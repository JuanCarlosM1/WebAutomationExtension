/**
 * Autocomplete items and language suggestions dictionary
 */
export type CodeLanguage = 'javascript' | 'html' | 'css';

export interface AutocompleteItem {
  label: string;
  type: 'keyword' | 'function' | 'variable' | 'property' | 'tag' | 'snippet';
  insertText: string;
  detail?: string;
  cursorOffset?: number;
}

export const JS_BUILTIN_SUGGESTIONS: AutocompleteItem[] = [
  { label: 'const', type: 'keyword', insertText: 'const ', detail: 'keyword' },
  { label: 'let', type: 'keyword', insertText: 'let ', detail: 'keyword' },
  { label: 'var', type: 'keyword', insertText: 'var ', detail: 'keyword' },
  { label: 'function', type: 'keyword', insertText: 'function () {\n  \n}', detail: 'keyword', cursorOffset: 9 },
  { label: 'return', type: 'keyword', insertText: 'return ', detail: 'keyword' },
  { label: 'if', type: 'snippet', insertText: 'if () {\n  \n}', detail: 'statement', cursorOffset: 4 },
  { label: 'ifelse', type: 'snippet', insertText: 'if () {\n  \n} else {\n  \n}', detail: 'statement', cursorOffset: 4 },
  { label: 'else', type: 'keyword', insertText: 'else {\n  \n}', detail: 'keyword', cursorOffset: 7 },
  { label: 'for', type: 'snippet', insertText: 'for (let i = 0; i < length; i++) {\n  \n}', detail: 'loop', cursorOffset: 20 },
  { label: 'forof', type: 'snippet', insertText: 'for (const item of items) {\n  \n}', detail: 'loop', cursorOffset: 19 },
  { label: 'while', type: 'snippet', insertText: 'while () {\n  \n}', detail: 'loop', cursorOffset: 7 },
  { label: 'switch', type: 'snippet', insertText: 'switch (key) {\n  case value:\n    break;\n  default:\n    break;\n}', detail: 'statement', cursorOffset: 8 },
  { label: 'trycatch', type: 'snippet', insertText: 'try {\n  \n} catch (error) {\n  console.error(error);\n}', detail: 'statement', cursorOffset: 8 },
  { label: 'async', type: 'keyword', insertText: 'async ', detail: 'keyword' },
  { label: 'await', type: 'keyword', insertText: 'await ', detail: 'keyword' },
  { label: 'true', type: 'keyword', insertText: 'true', detail: 'boolean' },
  { label: 'false', type: 'keyword', insertText: 'false', detail: 'boolean' },
  { label: 'null', type: 'keyword', insertText: 'null', detail: 'value' },
  { label: 'undefined', type: 'keyword', insertText: 'undefined', detail: 'value' },

  // APIs JavaScript & Navegador
  { label: 'console.log', type: 'function', insertText: 'console.log();', detail: 'log to console', cursorOffset: 12 },
  { label: 'console.error', type: 'function', insertText: 'console.error();', detail: 'error log', cursorOffset: 14 },
  { label: 'console.warn', type: 'function', insertText: 'console.warn();', detail: 'warning log', cursorOffset: 13 },
  { label: 'document.querySelector', type: 'function', insertText: "document.querySelector('')", detail: 'DOM query', cursorOffset: 23 },
  { label: 'document.querySelectorAll', type: 'function', insertText: "document.querySelectorAll('')", detail: 'DOM queries', cursorOffset: 26 },
  { label: 'document.getElementById', type: 'function', insertText: "document.getElementById('')", detail: 'DOM element', cursorOffset: 24 },
  { label: 'addEventListener', type: 'function', insertText: "addEventListener('', (e) => {\n  \n});", detail: 'event', cursorOffset: 17 },
  { label: 'setTimeout', type: 'function', insertText: 'setTimeout(() => {\n  \n}, 1000);', detail: 'timer', cursorOffset: 15 },
  { label: 'setInterval', type: 'function', insertText: 'setInterval(() => {\n  \n}, 1000);', detail: 'interval', cursorOffset: 16 },
  { label: 'fetch', type: 'function', insertText: "fetch('').then(res => res.json())", detail: 'HTTP fetch', cursorOffset: 7 },
  { label: 'JSON.stringify', type: 'function', insertText: 'JSON.stringify()', detail: 'serialize JSON', cursorOffset: 15 },
  { label: 'JSON.parse', type: 'function', insertText: 'JSON.parse()', detail: 'parse JSON', cursorOffset: 11 },
  { label: 'Array.map', type: 'function', insertText: 'map((item) => )', detail: 'transform array', cursorOffset: 15 },
  { label: 'Array.filter', type: 'function', insertText: 'filter((item) => )', detail: 'filter array', cursorOffset: 17 },
  { label: 'Array.forEach', type: 'function', insertText: 'forEach((item) => {\n  \n})', detail: 'iterate array', cursorOffset: 20 },
  { label: 'Array.find', type: 'function', insertText: 'find((item) => )', detail: 'find item', cursorOffset: 15 },
  { label: 'window.location.href', type: 'property', insertText: 'window.location.href', detail: 'current URL' },
  { label: 'window.localStorage', type: 'property', insertText: 'window.localStorage', detail: 'localStorage' },
];

export const CSS_SUGGESTIONS: AutocompleteItem[] = [
  { label: 'display', type: 'property', insertText: 'display: flex;', detail: 'layout' },
  { label: 'display: flex', type: 'property', insertText: 'display: flex;\n', detail: 'layout' },
  { label: 'display: grid', type: 'property', insertText: 'display: grid;\n', detail: 'layout' },
  { label: 'display: none', type: 'property', insertText: 'display: none;\n', detail: 'layout' },
  { label: 'flex-direction', type: 'property', insertText: 'flex-direction: column;', detail: 'flex' },
  { label: 'justify-content', type: 'property', insertText: 'justify-content: center;', detail: 'alignment' },
  { label: 'align-items', type: 'property', insertText: 'align-items: center;', detail: 'alignment' },
  { label: 'gap', type: 'property', insertText: 'gap: 8px;', detail: 'spacing' },
  { label: 'color', type: 'property', insertText: 'color: #ffffff;', detail: 'text color' },
  { label: 'background', type: 'property', insertText: 'background: #000000;', detail: 'background' },
  { label: 'background-color', type: 'property', insertText: 'background-color: #000000;', detail: 'background' },
  { label: 'padding', type: 'property', insertText: 'padding: 10px;', detail: 'spacing' },
  { label: 'margin', type: 'property', insertText: 'margin: 0;', detail: 'spacing' },
  { label: 'width', type: 'property', insertText: 'width: 100%;', detail: 'dimension' },
  { label: 'height', type: 'property', insertText: 'height: 100%;', detail: 'dimension' },
  { label: 'max-width', type: 'property', insertText: 'max-width: 1200px;', detail: 'dimension' },
  { label: 'min-height', type: 'property', insertText: 'min-height: 100vh;', detail: 'dimension' },
  { label: 'font-size', type: 'property', insertText: 'font-size: 14px;', detail: 'typography' },
  { label: 'font-weight', type: 'property', insertText: 'font-weight: 600;', detail: 'typography' },
  { label: 'font-family', type: 'property', insertText: "font-family: -apple-system, sans-serif;", detail: 'typography' },
  { label: 'border', type: 'property', insertText: 'border: 1px solid #e2e8f0;', detail: 'border' },
  { label: 'border-radius', type: 'property', insertText: 'border-radius: 8px;', detail: 'border' },
  { label: 'position', type: 'property', insertText: 'position: relative;', detail: 'position' },
  { label: 'position: absolute', type: 'property', insertText: 'position: absolute;\ntop: 0;\nleft: 0;\n', detail: 'position' },
  { label: 'position: fixed', type: 'property', insertText: 'position: fixed;\ntop: 0;\nleft: 0;\n', detail: 'position' },
  { label: 'overflow', type: 'property', insertText: 'overflow: hidden;', detail: 'overflow' },
  { label: 'cursor', type: 'property', insertText: 'cursor: pointer;', detail: 'cursor' },
  { label: 'opacity', type: 'property', insertText: 'opacity: 1;', detail: 'opacity' },
  { label: 'box-shadow', type: 'property', insertText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);', detail: 'shadow' },
  { label: 'transition', type: 'property', insertText: 'transition: all 0.2s ease;', detail: 'animation' },
  { label: 'z-index', type: 'property', insertText: 'z-index: 10;', detail: 'stacking' },
];

export const HTML_SUGGESTIONS: AutocompleteItem[] = [
  { label: 'div', type: 'tag', insertText: '<div>\n  \n</div>', detail: 'block container', cursorOffset: 8 },
  { label: 'span', type: 'tag', insertText: '<span></span>', detail: 'inline container', cursorOffset: 6 },
  { label: 'button', type: 'tag', insertText: '<button type="button"></button>', detail: 'button element', cursorOffset: 22 },
  { label: 'input', type: 'tag', insertText: '<input type="text" placeholder="" />', detail: 'input element', cursorOffset: 32 },
  { label: 'a', type: 'tag', insertText: '<a href="#"></a>', detail: 'anchor link', cursorOffset: 12 },
  { label: 'p', type: 'tag', insertText: '<p></p>', detail: 'paragraph', cursorOffset: 3 },
  { label: 'h1', type: 'tag', insertText: '<h1></h1>', detail: 'heading 1', cursorOffset: 4 },
  { label: 'h2', type: 'tag', insertText: '<h2></h2>', detail: 'heading 2', cursorOffset: 4 },
  { label: 'h3', type: 'tag', insertText: '<h3></h3>', detail: 'heading 3', cursorOffset: 4 },
  { label: 'ul', type: 'tag', insertText: '<ul>\n  <li></li>\n</ul>', detail: 'unordered list', cursorOffset: 11 },
  { label: 'li', type: 'tag', insertText: '<li></li>', detail: 'list item', cursorOffset: 4 },
  { label: 'form', type: 'tag', insertText: '<form>\n  \n</form>', detail: 'form container', cursorOffset: 9 },
  { label: 'table', type: 'tag', insertText: '<table>\n  <tr>\n    <td></td>\n  </tr>\n</table>', detail: 'table element', cursorOffset: 22 },
  { label: 'img', type: 'tag', insertText: '<img src="" alt="" />', detail: 'image element', cursorOffset: 10 },
  { label: 'label', type: 'tag', insertText: '<label></label>', detail: 'input label', cursorOffset: 7 },
  { label: 'select', type: 'tag', insertText: '<select>\n  <option value="1">Opção 1</option>\n</select>', detail: 'select dropdown', cursorOffset: 8 },
  { label: 'textarea', type: 'tag', insertText: '<textarea></textarea>', detail: 'multiline input', cursorOffset: 10 },
  { label: 'class', type: 'property', insertText: 'class=""', detail: 'attribute', cursorOffset: 7 },
  { label: 'id', type: 'property', insertText: 'id=""', detail: 'attribute', cursorOffset: 4 },
  { label: 'style', type: 'property', insertText: 'style=""', detail: 'attribute', cursorOffset: 7 },
];
