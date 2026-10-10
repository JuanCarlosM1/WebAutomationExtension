/**
 * Formatador e beautifier de código JS, HTML e CSS
 */
import { CodeLanguage } from './codeEditorSuggestions';

export class CodeFormatter {
  public static format(code: string, lang: CodeLanguage): string {
    const trimmed = code.trim();
    if (!trimmed) return code;

    try {
      if (lang === 'javascript') {
        return this.beautifyJS(trimmed);
      } else if (lang === 'html') {
        return this.beautifyHTML(trimmed);
      } else if (lang === 'css') {
        return this.beautifyCSS(trimmed);
      }
    } catch (e) {
      console.warn('Erro ao formatar código:', e);
    }
    return code;
  }

  public static beautifyJS(code: string): string {
    const lines = code.split('\n');
    let indentLevel = 0;
    const indentStr = '  ';

    return lines.map((rawLine) => {
      const line = rawLine.trim();
      if (!line) return '';

      if (/^[}\])]/.test(line)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      const res = indentStr.repeat(indentLevel) + line;

      const opens = (line.match(/[{\[(]/g) || []).length;
      const closes = (line.match(/[}\])]/g) || []).length;
      indentLevel = Math.max(0, indentLevel + (opens - closes));

      return res;
    }).join('\n');
  }

  public static beautifyCSS(code: string): string {
    return code
      .replace(/\{/g, ' {\n')
      .replace(/;/g, ';\n')
      .replace(/\}/g, '\n}\n')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((l) => (l.includes('{') || l.includes('}') ? l : '  ' + l))
      .join('\n');
  }

  public static beautifyHTML(code: string): string {
    const tokens = code.replace(/>\s*</g, '>\n<').split('\n');
    let indent = 0;
    const indentStr = '  ';

    return tokens.map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (/^<\/[a-zA-Z0-9_-]+>/.test(trimmed)) {
        indent = Math.max(0, indent - 1);
      }
      const res = indentStr.repeat(indent) + trimmed;
      if (/^<[a-zA-Z0-9_-]+(\s+[^>]*)?>/.test(trimmed) && !trimmed.endsWith('/>') && !/^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i.test(trimmed)) {
        indent++;
      }
      return res;
    }).join('\n');
  }
}
