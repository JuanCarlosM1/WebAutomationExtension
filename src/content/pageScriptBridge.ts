/**
 * Page Script Bridge
 * Executado diretamente no contexto MAIN da página web após ser inserido via tag <script>.
 * Possui acesso às capacidades de uma página web comum (DOM, window, fetch, eventos).
 * NÃO possui privilégios de extensão (chrome.* e browser.* são estritamente inacessíveis).
 * Disponibiliza ferramentas criadas pela extensão para automação web (WebAutomations, $wa, args).
 */
import { SafeJsEvaluator } from '../utils/safeJsEvaluator';

(function () {
  const win = window as any;
  if (win.__webautomations_page_bridge_installed) return;
  win.__webautomations_page_bridge_installed = true;

  // Utilitários que a extensão disponibiliza especificamente para os scripts do fluxo na página
  const WebAutomationsHelper = {
    version: '1.0.0',
    sleep: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
    get: (selector: string, type: 'css' | 'xpath' = 'css') => {
      if (type === 'xpath') {
        const res = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return res.singleNodeValue;
      }
      return document.querySelector(selector);
    },
    getAll: (selector: string, type: 'css' | 'xpath' = 'css') => {
      if (type === 'xpath') {
        const res = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const list: any[] = [];
        for (let i = 0; i < res.snapshotLength; i++) {
          list.push(res.snapshotItem(i));
        }
        return list;
      }
      return Array.from(document.querySelectorAll(selector));
    },
    waitFor: (selector: string, timeoutMs: number = 10000, type: 'css' | 'xpath' = 'css') => {
      return new Promise((resolve, reject) => {
        const existing = WebAutomationsHelper.get(selector, type);
        if (existing) return resolve(existing);
        const startTime = Date.now();
        const interval = setInterval(() => {
          const el = WebAutomationsHelper.get(selector, type);
          if (el) {
            clearInterval(interval);
            resolve(el);
          } else if (Date.now() - startTime > timeoutMs) {
            clearInterval(interval);
            reject(new Error(`Timeout aguardando elemento: ${selector}`));
          }
        }, 100);
      });
    },
    click: (selector: string, type: 'css' | 'xpath' = 'css') => {
      const el = WebAutomationsHelper.get(selector, type) as HTMLElement | null;
      if (!el) throw new Error(`Elemento não encontrado para clique: ${selector}`);
      el.click();
      return true;
    },
    type: (selector: string, text: string, type: 'css' | 'xpath' = 'css') => {
      const el = WebAutomationsHelper.get(selector, type) as HTMLInputElement | HTMLTextAreaElement | null;
      if (!el) throw new Error(`Elemento não encontrado para digitação: ${selector}`);
      el.focus();
      el.value = text;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    },
    log: (...args: any[]) => {
      console.log('%c[WebAutomations]', 'color: #6366f1; font-weight: bold;', ...args);
    },
  };

  win.WebAutomations = WebAutomationsHelper;
  win.$wa = WebAutomationsHelper;

  window.addEventListener('__WA_EXECUTE_PAGE_SCRIPT__', async (e: any) => {
    const detail = e.detail || {};
    const { eventId, scriptId, checksum, expectedCode, args } = detail;
    if (!eventId) return;

    try {
      // 1. Sempre verificar antes de executar se o código injetado é o mesmo que foi escrito no fluxo
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

      const safeArgs = Array.isArray(args) ? args : [];
      let executed = false;
      let result: any = undefined;

      try {
        // Envolve o código para:
        // - Executar com as capacidades normais da página web
        // - Bloquear categoricamente qualquer acesso a APIs de extensão (chrome, browser = undefined)
        // - Disponibilizar ferramentas criadas na extensão para a página (WebAutomations, $wa, args, $args)
        // - Permitir 'return' e 'await' assíncrono
        const body = `"use strict"; return (async function(args, $args, WebAutomations, $wa, chrome, browser) {\n${injectedCode}\n}).call(window, safeArgs, safeArgs, WebAutomationsHelper, WebAutomationsHelper, undefined, undefined);`;
        const fn = new Function('safeArgs', 'WebAutomationsHelper', body);
        result = await fn(safeArgs, WebAutomationsHelper);
        executed = true;
      } catch (nativeErr: any) {
        // Se a página tiver CSP estrita proibindo 'unsafe-eval' no MAIN world,
        // avalia de forma segura através do interpretador AST no escopo da página
        if (nativeErr?.name === 'EvalError' || nativeErr?.message?.includes('violates') || nativeErr?.message?.includes('CSP')) {
          result = SafeJsEvaluator.evaluate(`(function(args, $args, WebAutomations, $wa) {\n${injectedCode}\n})(args, args, WebAutomations, $wa)`, {
            args: safeArgs,
            $args: safeArgs,
            WebAutomations: WebAutomationsHelper,
            $wa: WebAutomationsHelper,
            chrome: undefined,
            browser: undefined,
          });
          executed = true;
        } else {
          throw nativeErr;
        }
      }

      scriptEl.setAttribute('data-wa-stage', 'executed');

      // Sanitiza o resultado para garantir que é serializável via CustomEvent
      let sanitizedResult: any = result;
      if (result instanceof Element) {
        sanitizedResult = {
          tagName: result.tagName,
          id: result.id,
          className: result.className,
          textContent: result.textContent?.slice(0, 500) || '',
        };
      } else if (typeof result === 'function') {
        sanitizedResult = '[Function]';
      }

      window.dispatchEvent(
        new CustomEvent(eventId, {
          detail: { success: true, scriptId, executed, result: sanitizedResult },
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
