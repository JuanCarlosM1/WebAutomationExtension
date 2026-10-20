/**
 * Validador estático de sintaxe para JavaScript, HTML e CSS (compatível com CSP MV3)
 */
import { CodeLanguage } from './codeEditorSuggestions';

export interface SyntaxDiagnostic {
  line?: number;
  column?: number;
  message: string;
}

export class CodeSyntaxValidator {
  public static validate(code: string, lang: CodeLanguage): SyntaxDiagnostic | null {
    const trimmed = code.trim();
    if (!trimmed) return null;

    if (lang === 'javascript') {
      return this.validateJavaScript(code);
    } else if (lang === 'html' || lang === 'svg') {
      return this.validateHTML(code);
    } else if (lang === 'css') {
      return this.validateCSS(code);
    }
    return null;
  }

  private static validateJavaScript(code: string): SyntaxDiagnostic | null {
    const lines = code.split('\n');
    const stack: { char: string; line: number; col: number }[] = [];
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inTemplate = false;
    let inLineComment = false;
    let inBlockComment = false;
    let isEscaped = false;

    for (let l = 0; l < lines.length; l++) {
      const line = lines[l];
      inLineComment = false;

      for (let c = 0; c < line.length; c++) {
        const ch = line[c];
        const next = line[c + 1];

        if (isEscaped) {
          isEscaped = false;
          continue;
        }

        if (ch === '\\' && (inSingleQuote || inDoubleQuote || inTemplate)) {
          isEscaped = true;
          continue;
        }

        if (inLineComment) continue;

        if (inBlockComment) {
          if (ch === '*' && next === '/') {
            inBlockComment = false;
            c++;
          }
          continue;
        }

        if (!inSingleQuote && !inDoubleQuote && !inTemplate) {
          if (ch === '/' && next === '/') {
            inLineComment = true;
            c++;
            continue;
          }
          if (ch === '/' && next === '*') {
            inBlockComment = true;
            c++;
            continue;
          }
        }

        if (ch === "'" && !inDoubleQuote && !inTemplate) {
          inSingleQuote = !inSingleQuote;
          continue;
        }
        if (ch === '"' && !inSingleQuote && !inTemplate) {
          inDoubleQuote = !inDoubleQuote;
          continue;
        }
        if (ch === '`' && !inSingleQuote && !inDoubleQuote) {
          inTemplate = !inTemplate;
          continue;
        }

        if (inSingleQuote || inDoubleQuote || inTemplate) {
          continue;
        }

        // Verificação de delimitadores abertos e fechados
        if (ch === '(' || ch === '[' || ch === '{') {
          stack.push({ char: ch, line: l + 1, col: c + 1 });
        } else if (ch === ')' || ch === ']' || ch === '}') {
          const matchPairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
          const expectedOpen = matchPairs[ch];
          if (stack.length === 0) {
            return {
              line: l + 1,
              column: c + 1,
              message: `Caractere de fechamento inesperado "${ch}"`,
            };
          }
          const last = stack.pop()!;
          if (last.char !== expectedOpen) {
            return {
              line: l + 1,
              column: c + 1,
              message: `Fechamento com "${ch}" não corresponde a "${last.char}" aberto na linha ${last.line}`,
            };
          }
        }
      }

      if (inSingleQuote || inDoubleQuote) {
        return {
          line: l + 1,
          message: 'String literal não finalizada',
        };
      }
    }

    if (inBlockComment) {
      return {
        line: lines.length,
        message: 'Comentário de bloco /* ... */ não foi fechado',
      };
    }

    if (inTemplate) {
      return {
        line: lines.length,
        message: 'Template literal (crases `...`) não foi fechado',
      };
    }

    if (stack.length > 0) {
      const unclosed = stack[stack.length - 1];
      const names: Record<string, string> = { '(': 'parênteses "("', '[': 'colchetes "["', '{': 'chaves "{"' };
      return {
        line: unclosed.line,
        column: unclosed.col,
        message: `Bloco com ${names[unclosed.char] || unclosed.char} aberto na linha ${unclosed.line} não foi fechado`,
      };
    }

    return null;
  }

  private static validateHTML(code: string): SyntaxDiagnostic | null {
    const tagRegex = /<\/?([a-zA-Z0-9_-]+)(?:\s+[^>]*)?\/?>/g;
    const stack: { tag: string; line: number }[] = [];
    const lines = code.split('\n');

    const voidTags = new Set([
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
      'meta', 'param', 'source', 'track', 'wbr', '!doctype',
    ]);

    for (let lIdx = 0; lIdx < lines.length; lIdx++) {
      const lineText = lines[lIdx];
      let tMatch;
      while ((tMatch = tagRegex.exec(lineText)) !== null) {
        const rawTag = tMatch[0];
        const tagName = tMatch[1].toLowerCase();

        if (voidTags.has(tagName) || rawTag.endsWith('/>')) {
          continue;
        }

        if (rawTag.startsWith('</')) {
          if (stack.length === 0) {
            return {
              line: lIdx + 1,
              message: `Tag de fechamento inesperada </${tagName}> sem tag de abertura`,
            };
          }
          const last = stack.pop()!;
          if (last.tag !== tagName) {
            return {
              line: lIdx + 1,
              message: `Tag </${tagName}> fecha incorretamente a tag anterior <${last.tag}> (linha ${last.line})`,
            };
          }
        } else if (!rawTag.startsWith('<!--')) {
          stack.push({ tag: tagName, line: lIdx + 1 });
        }
      }
    }

    if (stack.length > 0) {
      const unclosed = stack[stack.length - 1];
      return {
        line: unclosed.line,
        message: `A tag <${unclosed.tag}> aberta na linha ${unclosed.line} não foi fechada`,
      };
    }
    return null;
  }

  private static validateCSS(code: string): SyntaxDiagnostic | null {
    let openBraces = 0;
    let lastOpenLine = 1;
    const lines = code.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const char of line) {
        if (char === '{') {
          openBraces++;
          lastOpenLine = i + 1;
        } else if (char === '}') {
          openBraces--;
          if (openBraces < 0) {
            return {
              line: i + 1,
              message: 'Chave de fechamento "}" inesperada em CSS',
            };
          }
        }
      }
    }

    if (openBraces > 0) {
      return {
        line: lastOpenLine,
        message: `Bloco CSS aberto na linha ${lastOpenLine} não foi fechado com "}"`,
      };
    }
    return null;
  }
}
