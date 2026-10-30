import { describe, it, expect } from 'vitest';
import { CodeSyntaxHighlighter } from '../../src/editor/modules/codeSyntaxHighlighter';
import { CodeSyntaxValidator } from '../../src/editor/modules/codeSyntaxValidator';
import { CodeFormatter } from '../../src/editor/modules/codeFormatter';
import { JS_BUILTIN_SUGGESTIONS } from '../../src/editor/modules/codeEditorSuggestions';

describe('Code Editor Modules', () => {
  describe('CodeSyntaxHighlighter', () => {
    it('deve destacar palavras-chave JavaScript com tags span tok-kw', () => {
      const code = 'const x = 10; function teste() { return true; }';
      const highlighted = CodeSyntaxHighlighter.highlight(code, 'javascript');

      expect(highlighted).toContain('<span class="tok-kw">const</span>');
      expect(highlighted).toContain('<span class="tok-kw">function</span>');
      expect(highlighted).toContain('<span class="tok-kw">return</span>');
      expect(highlighted).toContain('<span class="tok-bool">true</span>');
    });

    it('deve destacar strings e comentários com tok-str e tok-com', () => {
      const code = '// comentario\nconst str = "hello";';
      const highlighted = CodeSyntaxHighlighter.highlight(code, 'javascript');

      expect(highlighted).toContain('tok-com');
      expect(highlighted).toContain('tok-str');
    });

    it('deve destacar tags HTML quando linguagem for html', () => {
      const html = '<div class="box"><span>Texto</span></div>';
      const highlighted = CodeSyntaxHighlighter.highlight(html, 'html');

      expect(highlighted).toContain('tok-kw');
      expect(highlighted).toContain('tok-fn');
      expect(highlighted).toContain('tok-str');
    });
  });

  describe('CodeSyntaxValidator', () => {
    it('deve validar sintaxe correta retornando null (sem erros)', () => {
      const code = 'const a = 1; if (a > 0) { console.log(a); }';
      const diag = CodeSyntaxValidator.validate(code, 'javascript');

      expect(diag).toBeNull();
    });

    it('deve detectar parênteses, colchetes ou chaves não fechados em JS', () => {
      const code = 'function err( { const arr = [1, 2; }';
      const diag = CodeSyntaxValidator.validate(code, 'javascript');

      expect(diag).not.toBeNull();
      expect(diag?.message).toBeDefined();
    });

    it('deve validar CSS verificando blocos com chaves balanceadas', () => {
      const validCss = '.card { color: red; margin: 10px; }';
      expect(CodeSyntaxValidator.validate(validCss, 'css')).toBeNull();

      const invalidCss = '.card { color: red;';
      expect(CodeSyntaxValidator.validate(invalidCss, 'css')).not.toBeNull();
    });
  });

  describe('CodeFormatter', () => {
    it('deve formatar JavaScript com indentação correta', () => {
      const raw = 'function teste() {\nconst x = 1;\nreturn x;\n}';
      const formatted = CodeFormatter.format(raw, 'javascript');

      expect(formatted).toBeDefined();
      expect(formatted).toContain('  const x = 1;');
    });

    it('deve formatar CSS organizando regras', () => {
      const raw = 'body{color:red;margin:0;}';
      const formatted = CodeFormatter.format(raw, 'css');

      expect(formatted).toContain('{\n');
      expect(formatted).toContain(';\n');
    });
  });

  describe('CodeEditorSuggestions', () => {
    it('deve conter lista de sugestões JS pré-configuradas com keywords e funções DOM', () => {
      expect(JS_BUILTIN_SUGGESTIONS.length).toBeGreaterThanOrEqual(20);

      const labels = JS_BUILTIN_SUGGESTIONS.map((s) => s.label);
      expect(labels).toContain('const');
      expect(labels).toContain('function');
      expect(labels).toContain('console.log');
      expect(labels).toContain('document.querySelector');
      expect(labels).toContain('addEventListener');
    });
  });
});
