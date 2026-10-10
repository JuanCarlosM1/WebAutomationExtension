/**
 * Syntax Highlighter visual com tags estilizadas
 */
import { CodeLanguage } from './codeEditorSuggestions';
import { SyntaxDiagnostic } from './codeSyntaxValidator';

export class CodeSyntaxHighlighter {
  public static highlight(code: string, lang: CodeLanguage, error?: SyntaxDiagnostic | null): string {
    const placeholders: string[] = [];
    const saveToken = (html: string) => {
      const idx = placeholders.length;
      placeholders.push(html);
      return `___TOK_${idx}___`;
    };

    let text = code;

    if (lang === 'javascript') {
      // 1. Comentários de bloco e linha única
      text = text.replace(/(\/\*[\s\S]*?\*\/)/g, (match) => {
        return saveToken(`<span class="tok-com">${this.escapeHtml(match)}</span>`);
      });
      text = text.replace(/(\/\/[^\n]*)/g, (match) => {
        return saveToken(`<span class="tok-com">${this.escapeHtml(match)}</span>`);
      });

      // 2. Strings e Template literals
      text = text.replace(/(`(?:\\`|[\s\S])*?`|"(?:\\"|[^"\n])*"|'(?:\\'|[^'\n])*')/g, (match) => {
        return saveToken(`<span class="tok-str">${this.escapeHtml(match)}</span>`);
      });

      // 3. Regex literals comuns
      text = text.replace(/(\/(?![*\/])(?:\\\/|[^\/\n])+\/[gimsuy]*)(?=\s*[,;)\].]|\s*$)/g, (match) => {
        return saveToken(`<span class="tok-str">${this.escapeHtml(match)}</span>`);
      });

      // Agora escapa o texto base que sobrou
      text = this.escapeHtml(text);

      // 4. Palavras-chave
      const kwRegex = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|class|extends|async|await|import|export|from|default|this|typeof|instanceof|void|delete|in|of)\b/g;
      text = text.replace(kwRegex, '<span class="tok-kw">$1</span>');

      // 5. Booleanos e nulos
      text = text.replace(/\b(true|false|null|undefined|NaN)\b/g, '<span class="tok-bool">$1</span>');

      // 6. Números
      text = text.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-num">$1</span>');

      // 7. Chamadas de função
      text = text.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g, '<span class="tok-fn">$1</span>');

    } else if (lang === 'css') {
      // 1. Comentários
      text = text.replace(/(\/\*[\s\S]*?\*\/)/g, (match) => {
        return saveToken(`<span class="tok-com">${this.escapeHtml(match)}</span>`);
      });

      // 2. Strings
      text = text.replace(/("(?:\\"|[^"\n])*"|'(?:\\'|[^'\n])*')/g, (match) => {
        return saveToken(`<span class="tok-str">${this.escapeHtml(match)}</span>`);
      });

      // Escapa o texto base
      text = this.escapeHtml(text);

      // 3. Seletores e IDs
      text = text.replace(/([.#][a-zA-Z0-9_-]+)/g, '<span class="tok-fn">$1</span>');

      // 4. Propriedades CSS
      text = text.replace(/([a-zA-Z-]+)(?=\s*:)/g, '<span class="tok-kw">$1</span>');

      // 5. Unidades e Números
      text = text.replace(/\b(\d+(?:px|em|rem|%|vh|vw|s|ms|deg)?)\b/g, '<span class="tok-num">$1</span>');

    } else if (lang === 'html') {
      // 1. Comentários HTML
      text = text.replace(/(<!--[\s\S]*?-->)/g, (match) => {
        return saveToken(`<span class="tok-com">${this.escapeHtml(match)}</span>`);
      });

      // Escapa HTML
      text = this.escapeHtml(text);

      // 2. Tags
      text = text.replace(/(&lt;\/?[a-zA-Z0-9_-]+)/g, '<span class="tok-kw">$1</span>');
      text = text.replace(/(&gt;)/g, '<span class="tok-kw">$1</span>');

      // 3. Valores de atributos entre aspas
      text = text.replace(/(=)(&quot;.*?&quot;|&#39;.*?&#39;|".*?"|'.*?')/g, '$1<span class="tok-str">$2</span>');

      // 4. Nomes de atributos
      text = text.replace(/\b([a-zA-Z_-]+)(?=\s*=)/g, '<span class="tok-fn">$1</span>');
    } else {
      text = this.escapeHtml(text);
    }

    // Restaura os placeholders protegidos
    placeholders.forEach((tokenHtml, idx) => {
      text = text.replace(`___TOK_${idx}___`, tokenHtml);
    });

    // Se houver erro de sintaxe em uma linha específica, adiciona sublinhado ondulado na linha afetada
    if (error && error.line) {
      const lines = text.split('\n');
      const errIdx = error.line - 1;
      if (errIdx >= 0 && errIdx < lines.length) {
        const lineContent = lines[errIdx];
        if (lineContent.trim()) {
          lines[errIdx] = `<span class="code-syntax-error" title="${this.escapeHtml(error.message)}">${lineContent}</span>`;
          text = lines.join('\n');
        }
      }
    }

    return text;
  }

  public static escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
