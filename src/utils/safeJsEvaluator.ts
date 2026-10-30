/**
 * Avaliador seguro de JavaScript para Extensões Chrome Manifest V3
 * Executa código e expressões sem violar a Content Security Policy (sem 'unsafe-eval' / new Function)
 */
import * as buble from 'buble';
import { Interpreter } from 'eval5';

export class SafeJsEvaluator {
  /**
   * Avalia uma expressão ou bloco de código JS arbitrário com o escopo de variáveis fornecido
   */
  public static evaluate(expressionOrCode: string, vars: Record<string, any> = {}, throwOnError = false): any {
    if (!expressionOrCode || !expressionOrCode.trim()) return false;

    const trimmed = expressionOrCode.trim();

    // Determina como envolver o código
    const hasReturn = /\breturn\b/.test(trimmed);
    const withoutTrailingSemicolon = trimmed.replace(/;+$/, '');

    let codeToTransform = trimmed;
    if (!hasReturn) {
      // Se não contém return, é uma expressão simples ou chamada única de função (ex: console.log(...) ou 1 + 2)
      const isStatement = /^\s*(const|let|var|function|class|if|for|while|switch|try|throw)\b/.test(trimmed);
      if (!isStatement && !trimmed.includes('\n')) {
        codeToTransform = `return (${withoutTrailingSemicolon});`;
      } else {
        codeToTransform = trimmed;
      }
    }

    // Transpila ES6+ (const, let, arrow functions, template strings, destructuring) para ES5
    let es5Code = codeToTransform;
    try {
      es5Code = buble.transform(codeToTransform, {
        transforms: {
          dangerousForOf: true,
          dangerousTaggedTemplateString: true,
        },
      }).code;
    } catch {
      // Se falhou ao colocar 'return (...)', tenta transpilar o código original sem o return
      if (codeToTransform !== trimmed) {
        try {
          es5Code = buble.transform(trimmed, {
            transforms: {
              dangerousForOf: true,
              dangerousTaggedTemplateString: true,
            },
          }).code;
        } catch {
          es5Code = trimmed.replace(/\bconst\b/g, 'var').replace(/\blet\b/g, 'var');
        }
      } else {
        es5Code = trimmed.replace(/\bconst\b/g, 'var').replace(/\blet\b/g, 'var');
      }
    }

    // Monta o escopo de execução com globais padrão do ambiente (browser/worker)
    const globalScope: Record<string, any> = {};
    if (typeof globalThis !== 'undefined') {
      const standardGlobals = [
        'console', 'Math', 'Date', 'JSON', 'parseInt', 'parseFloat',
        'isNaN', 'isFinite', 'encodeURI', 'decodeURI', 'encodeURIComponent', 'decodeURIComponent',
        'String', 'Number', 'Boolean', 'Array', 'Object', 'RegExp', 'Map', 'Set', 'Promise',
        'window', 'document', 'location', 'navigator', 'history', 'localStorage', 'sessionStorage',
        'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'
      ];
      for (const g of standardGlobals) {
        try {
          if (g in globalThis) {
            globalScope[g] = (globalThis as any)[g];
          }
        } catch {}
      }
    }

    // Injeta as variáveis do fluxo no escopo
    Object.assign(globalScope, vars);

    // O JavaScript dos fluxos NÃO pode executar o mesmo que os códigos de uma extensão.
    // Bloqueia categoricamente qualquer acesso a APIs privadas de extensão (chrome.* / browser.*)
    globalScope.chrome = undefined;
    globalScope.browser = undefined;

    try {
      const interpreter = new Interpreter(globalScope, {
        timeout: 10000,
        rootContext: globalScope,
      });

      const wrapped = `(function() {\n${es5Code}\n})()`;
      const result = interpreter.evaluate(wrapped);

      // Se o usuário retornou uma função diretamente sem parâmetros (ex: const f = () => true; return f;), avalia
      if (typeof result === 'function' && result.length === 0) {
        try {
          return result();
        } catch {
          return result;
        }
      }

      return result;
    } catch (err: any) {
      if (throwOnError) throw err;
      console.warn(`[SafeJsEvaluator] Erro ao avaliar código JS:`, err?.message || err);
      return false;
    }
  }
}
