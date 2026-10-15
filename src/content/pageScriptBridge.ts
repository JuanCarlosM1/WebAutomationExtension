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
    const { eventId, code, args } = detail;
    if (!eventId || !code) return;

    try {
      const vars: Record<string, any> = { args: args || [] };
      (args || []).forEach((arg: any, i: number) => {
        vars[`arg${i}`] = arg;
      });

      let result: any;
      let executed = false;

      // 1. Tenta execução nativa direta no contexto da página (V8)
      try {
        const paramNames = Object.keys(vars);
        const paramValues = Object.values(vars);
        const trimmed = code.trim();
        const hasReturn = /\breturn\b/.test(trimmed);
        const body = hasReturn ? trimmed : `return (${trimmed.replace(/;+$/, '')});`;
        const fn = new Function(...paramNames, body);
        result = fn.apply(window, paramValues);
        executed = true;
      } catch (nativeErr: any) {
        // Se a página tiver CSP proibindo 'unsafe-eval' no MAIN world,
        // avalia de forma segura através do interpretador AST no escopo de window da página
        if (nativeErr?.name === 'EvalError' || nativeErr?.message?.includes('violates') || nativeErr?.message?.includes('CSP')) {
          result = SafeJsEvaluator.evaluate(code, { ...vars, window, document, console });
          executed = true;
        } else {
          // Erro de sintaxe ou execução real do script do usuário
          throw nativeErr;
        }
      }

      // Trata retorno de Promise ou função sem argumentos
      Promise.resolve(result)
        .then((finalRes) => {
          if (typeof finalRes === 'function' && finalRes.length === 0) {
            try {
              finalRes = finalRes();
            } catch {}
          }
          window.dispatchEvent(
            new CustomEvent(eventId, {
              detail: { success: true, result: finalRes },
            })
          );
        })
        .catch((asyncErr) => {
          window.dispatchEvent(
            new CustomEvent(eventId, {
              detail: { success: false, error: asyncErr?.message || String(asyncErr) },
            })
          );
        });
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
