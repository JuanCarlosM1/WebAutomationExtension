import { describe, it, expect, vi } from 'vitest';
import { SafeJsEvaluator } from '../../src/utils/safeJsEvaluator';

describe('SafeJsEvaluator.evaluate', () => {
  describe('entradas vazias', () => {
    it('retorna false para string vazia', () => {
      expect(SafeJsEvaluator.evaluate('')).toBe(false);
    });
    it('retorna false para string só com espaços', () => {
      expect(SafeJsEvaluator.evaluate('   \n\t ')).toBe(false);
    });
    it('retorna false para undefined/null', () => {
      expect(SafeJsEvaluator.evaluate(undefined as any)).toBe(false);
      expect(SafeJsEvaluator.evaluate(null as any)).toBe(false);
    });
  });

  describe('expressões simples', () => {
    it('avalia aritmética', () => {
      expect(SafeJsEvaluator.evaluate('1 + 2 * 3')).toBe(7);
    });
    it('ignora ponto e vírgula final', () => {
      expect(SafeJsEvaluator.evaluate('10 - 4;;')).toBe(6);
    });
    it('avalia comparações booleanas', () => {
      expect(SafeJsEvaluator.evaluate('5 > 3')).toBe(true);
      expect(SafeJsEvaluator.evaluate('5 < 3')).toBe(false);
    });
    it('avalia strings e template literals (transpilados por buble)', () => {
      expect(SafeJsEvaluator.evaluate('`Olá ${nome}`', { nome: 'Mundo' })).toBe('Olá Mundo');
    });
    it('avalia arrow functions inline', () => {
      expect(SafeJsEvaluator.evaluate('[1,2,3].map(x => x * 2)')).toEqual([2, 4, 6]);
    });
    it('avalia literais de objeto', () => {
      expect(SafeJsEvaluator.evaluate('({ a: 1, b: "x" })')).toEqual({ a: 1, b: 'x' });
    });
  });

  describe('escopo de variáveis', () => {
    it('injeta variáveis do fluxo', () => {
      expect(SafeJsEvaluator.evaluate('a + b', { a: 2, b: 40 })).toBe(42);
    });
    it('acessa propriedades aninhadas', () => {
      expect(SafeJsEvaluator.evaluate('user.profile.name', { user: { profile: { name: 'Ana' } } })).toBe('Ana');
    });
    it('expõe globais padrão como Math e JSON', () => {
      expect(SafeJsEvaluator.evaluate('Math.max(1, 9, 3)')).toBe(9);
      expect(SafeJsEvaluator.evaluate('JSON.stringify({x:1})')).toBe('{"x":1}');
      expect(SafeJsEvaluator.evaluate('parseInt("42px")')).toBe(42);
    });
    it('variáveis do fluxo sobrescrevem globais', () => {
      expect(SafeJsEvaluator.evaluate('Math', { Math: 'custom' })).toBe('custom');
    });
  });

  describe('blocos de código', () => {
    it('executa blocos com return explícito', () => {
      expect(SafeJsEvaluator.evaluate('const x = 5;\nconst y = 6;\nreturn x * y;')).toBe(30);
    });
    it('suporta let/const/destructuring', () => {
      const code = 'const { a, b } = obj;\nlet soma = a + b;\nreturn soma;';
      expect(SafeJsEvaluator.evaluate(code, { obj: { a: 1, b: 2 } })).toBe(3);
    });
    it('suporta laços for...of', () => {
      const code = 'let t = 0;\nfor (const n of lista) { t += n; }\nreturn t;';
      expect(SafeJsEvaluator.evaluate(code, { lista: [1, 2, 3, 4] })).toBe(10);
    });
    it('retorna undefined para statements sem return', () => {
      expect(SafeJsEvaluator.evaluate('const x = 1;')).toBeUndefined();
    });
    it('blocos multilinha sem return não retornam valor', () => {
      expect(SafeJsEvaluator.evaluate('1 + 1\n2 + 2')).toBeUndefined();
    });
    it('invoca automaticamente função sem parâmetros retornada', () => {
      expect(SafeJsEvaluator.evaluate('const f = () => 99;\nreturn f;')).toBe(99);
    });
    it('não invoca função retornada que possui parâmetros', () => {
      const fn = SafeJsEvaluator.evaluate('return function (a) { return a; };');
      expect(typeof fn).toBe('function');
    });
    it('retorna a própria função se a invocação automática falhar', () => {
      const fn = SafeJsEvaluator.evaluate('return function () { throw new Error("x"); };');
      expect(typeof fn).toBe('function');
    });
    it('permite chamadas de função das variáveis', () => {
      const spy = vi.fn(() => 'ok');
      expect(SafeJsEvaluator.evaluate('callback(1)', { callback: spy })).toBe('ok');
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('segurança', () => {
    it('bloqueia acesso a chrome.*', () => {
      (globalThis as any).chrome = { runtime: { id: 'secret' } };
      expect(SafeJsEvaluator.evaluate('typeof chrome')).toBe('undefined');
    });
    it('bloqueia chrome mesmo se injetado via vars', () => {
      expect(SafeJsEvaluator.evaluate('typeof chrome', { chrome: { x: 1 } })).toBe('undefined');
    });
    it('bloqueia browser.*', () => {
      expect(SafeJsEvaluator.evaluate('typeof browser', { browser: {} })).toBe('undefined');
    });
  });

  describe('tratamento de erros', () => {
    it('retorna false e emite warning em erro de runtime', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      expect(SafeJsEvaluator.evaluate('naoExiste.prop')).toBe(false);
      expect(warn).toHaveBeenCalled();
    });
    it('lança erro quando throwOnError = true', () => {
      expect(() => SafeJsEvaluator.evaluate('naoExiste.prop', {}, true)).toThrow();
    });
    it('lança erros lançados pelo código do usuário quando throwOnError = true', () => {
      expect(() => SafeJsEvaluator.evaluate('throw new Error("boom")', {}, true)).toThrow(/boom/);
    });
    it('não lança com sintaxe inválida (fallback) quando throwOnError = false', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      expect(() => SafeJsEvaluator.evaluate('if ( {')).not.toThrow();
    });
  });
});

