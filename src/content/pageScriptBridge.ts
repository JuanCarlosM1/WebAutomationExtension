/**
 * Page Script Bridge
 * Executado diretamente no contexto MAIN da página web após ser inserido via tag <script>.
 * Possui acesso total ao objeto window da página, funções globais, bibliotecas da página (React/Vue/jQuery/etc).
 */
import { SafeJsEvaluator } from '../utils/safeJsEvaluator';

(function () {
  const win = window as any;
  if (win.__webautomations_page_bridge_installed) return;
  win.__webautomations_page_bridge_installed = true;

  window.addEventListener('__WA_EXECUTE_PAGE_SCRIPT__', (e: any) => {
    const detail = e.detail || {};
    const { eventId, scriptId, checksum, expectedCode } = detail;
    if (!eventId) return;

    try {
      // 1. Segundo: Sempre verificar antes de executar se o código injetado é o mesmo que foi escrito no fluxo
      const scriptEl = scriptId ? document.getElementById(scriptId) : null;
      if (!scriptEl) {
        throw new Error(`[PageBridge] Elemento de script #${scriptId} não foi encontrado no DOM da página.`);
      }

      const injectedCode = scriptEl.textContent || '';
      const scriptChecksum = scriptEl.getAttribute('data-checksum');

      if (expectedCode !== undefined && (injectedCode !== expectedCode || (checksum && scriptChecksum !== checksum))) {
        scriptEl.setAttribute('data-wa-stage', 'integrity_violation');
        throw new Error(`[PageBridge Security] Integridade violada: O script #${scriptId} no DOM difere do código original configurado no fluxo!`);
      }

      scriptEl.setAttribute('data-wa-stage', 'executing');

      // 2. Terceiro: Executar o código de forma que ele não seja capaz de se comunicar com o resto do fluxo
      // Execução em escopo estritamente isolado sem passar variáveis/contexto do fluxo
      let executed = false;
      try {
        const body = `"use strict"; (function() {\n${injectedCode}\n})();`;
        const fn = new Function(body);
        fn.call(window);
        executed = true;
      } catch (nativeErr: any) {
        // Se a página tiver CSP proibindo 'unsafe-eval' no MAIN world,
        // avalia de forma segura através do interpretador AST no escopo de window da página
        if (nativeErr?.name === 'EvalError' || nativeErr?.message?.includes('violates') || nativeErr?.message?.includes('CSP')) {
          SafeJsEvaluator.evaluate(`(function() {\n${injectedCode}\n})()`, {});
          executed = true;
        } else {
          throw nativeErr;
        }
      }

      scriptEl.setAttribute('data-wa-stage', 'executed');

      // Responde apenas com status de sucesso, sem transmitir dados/retornos para o fluxo
      window.dispatchEvent(
        new CustomEvent(eventId, {
          detail: { success: true, scriptId, executed },
        })
      );
    } catch (err: any) {
      window.dispatchEvent(
        new CustomEvent(eventId, {
          detail: { success: false, error: err?.message || String(err) },
        })
      );
    }
  });

  // Avisa que a ponte na página foi inicializada
  window.dispatchEvent(new CustomEvent('__WA_PAGE_BRIDGE_READY__'));
})();
