/**
 * Syntax Highlighter visual com tags estilizadas e proteção total de tokens
 */
import { CodeLanguage } from './codeEditorSuggestions';
import { SyntaxDiagnostic } from './codeSyntaxValidator';

export class CodeSyntaxHighlighter {
  public static highlight(code: string, lang: CodeLanguage, error?: SyntaxDiagnostic | null): string {
    if (!code) {
      return '';
    }

    const placeholders: string[] = [];
    // Utiliza caracteres Unicode da área privada (PUA) para tokens imunes a regex de palavras ou dígitos
    const saveToken = (html: string) => {
      const idx = placeholders.length;
      placeholders.push(html);
      return String.fromCharCode(0xE100 + idx);
    };

    let text = code;

    if (lang === 'javascript') {
      // 1. Comentários de bloco e linha única
      text = text.replace(/(\/\*[\s\S]*?\*\/|\/\/[^\n]*)/g, (match) => {
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

      // Escapa o texto base que sobrou
      text = this.escapeHtml(text);

      // 4. Palavras-chave JS
      const kwRegex = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|class|extends|async|await|import|export|from|default|this|typeof|instanceof|void|delete|in|of)\b/g;
      text = text.replace(kwRegex, (m) => saveToken(`<span class="tok-kw">${m}</span>`));

      // 5. Booleanos e nulos
      text = text.replace(/\b(true|false|null|undefined|NaN)\b/g, (m) => saveToken(`<span class="tok-bool">${m}</span>`));

      // 6. Chamadas de função
      text = text.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g, (m) => saveToken(`<span class="tok-fn">${m}</span>`));

      // 7. Números
      text = text.replace(/\b(\d+(?:\.\d+)?)\b/g, (m) => saveToken(`<span class="tok-num">${m}</span>`));

    } else if (lang === 'css') {
      // 1. Comentários CSS
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
      text = text.replace(/([.#][a-zA-Z0-9_-]+)/g, (m) => saveToken(`<span class="tok-fn">${m}</span>`));

      // 4. Propriedades CSS
      text = text.replace(/([a-zA-Z-]+)(?=\s*:)/g, (m) => saveToken(`<span class="tok-kw">${m}</span>`));

      // 5. Unidades e Números
      text = text.replace(/\b(\d+(?:px|em|rem|%|vh|vw|s|ms|deg)?)\b/g, (m) => saveToken(`<span class="tok-num">${m}</span>`));

    } else if (lang === 'html' || lang === 'svg') {
      // 1. Comentários HTML / SVG
      text = text.replace(/(<!--[\s\S]*?-->)/g, (match) => {
        return saveToken(`<span class="tok-com">${this.escapeHtml(match)}</span>`);
      });

      // Escapa HTML
      text = this.escapeHtml(text);

      // 2. Tags HTML e Atributos de forma estruturada e atômica
      text = text.replace(/(&lt;\/?[a-zA-Z0-9_-]+)([\s\S]*?)(&gt;|\/&gt;)/g, (match, openTag, attrs, closeTag) => {
        const highlightedTag = saveToken(`<span class="tok-kw">${openTag}</span>`);
        let highlightedAttrs = attrs;

        // Valores de atributos entre aspas
        highlightedAttrs = highlightedAttrs.replace(/(=)(&quot;[\s\S]*?&quot;|&#39;[\s\S]*?&#39;|"[^"]*"|'[^']*')/g, (m: string, eq: string, val: string) => {
          return eq + saveToken(`<span class="tok-str">${val}</span>`);
        });

        // Nomes de atributos
        highlightedAttrs = highlightedAttrs.replace(/\b([a-zA-Z_:-]+)(?=\s*=)/g, (m: string, attrName: string) => {
          return saveToken(`<span class="tok-fn">${attrName}</span>`);
        });

        const highlightedClose = saveToken(`<span class="tok-kw">${closeTag}</span>`);
        return highlightedTag + highlightedAttrs + highlightedClose;
      });
    } else {
      text = this.escapeHtml(text);
    }

    // Restaura os placeholders de forma segura
    text = text.replace(/[\uE100-\uF8FF]/g, (char) => {
      const idx = char.charCodeAt(0) - 0xE100;
      return placeholders[idx] ?? '';
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
