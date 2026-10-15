/**
 * Editor de Código embutido (JS, HTML, CSS)
 * Suporte a:
 * - Numeração dinâmica de linhas
 * - Syntax highlighting com tags de tokenização visual
 * - Identação inteligente com tecla TAB e SHIFT+TAB
 * - Auto-fechamento e envelopamento de aspas, parênteses, chaves e colchetes
 * - Formatação rápida / beautify
 * - Modo expandido fullscreen embutido
 * - Cópia e download do script
 */

import {
  CodeLanguage,
  AutocompleteItem,
  JS_BUILTIN_SUGGESTIONS,
  CSS_SUGGESTIONS,
  HTML_SUGGESTIONS
} from './codeEditorSuggestions';
import { CodeSyntaxValidator } from './codeSyntaxValidator';
import { CodeFormatter } from './codeFormatter';
import { CodeSyntaxHighlighter } from './codeSyntaxHighlighter';
import { ColorPickerManager } from './colorPickerManager';

export type { CodeLanguage, AutocompleteItem };
export { JS_BUILTIN_SUGGESTIONS, CSS_SUGGESTIONS, HTML_SUGGESTIONS };

export interface CodeEditorOptions {
  language: CodeLanguage;
  value: string;
  onChange: (val: string) => void;
  title?: string;
  height?: string;
  placeholder?: string;
  onOpenExpandedModal?: () => void;
}

export class CodeEditorComponent {
  private container: HTMLElement;
  private textarea!: HTMLTextAreaElement;
  private lineNumbersEl!: HTMLElement;
  private highlightLayer!: HTMLElement;
  private statusLangEl!: HTMLElement;
  private statusPosEl!: HTMLElement;
  private statusErrorEl!: HTMLElement;
  private currentLanguage: CodeLanguage;
  private currentValue: string;
  private onChange: (val: string) => void;

  // Autocomplete
  private autocompletePopup!: HTMLElement;
  private autocompleteListEl!: HTMLElement;
  private isAutocompleteOpen = false;
  private autocompleteItems: AutocompleteItem[] = [];
  private selectedAutocompleteIndex = 0;
  private currentPrefix = '';
  private prefixStart = 0;

  // Diagnóstico de Sintaxe
  private currentSyntaxError: { line?: number; column?: number; message: string } | null = null;

  // Code Folding (Recolher e expandir funções e blocos)
  private foldedRanges: { startLine: number; endLine: number; preview: string }[] = [];

  // Histórico de Desfazer (Undo) e Fazer (Redo)
  private historyStack: { value: string; selectionStart: number; selectionEnd: number }[] = [];
  private historyIndex = -1;
  private isApplyingHistory = false;
  private historyDebounceTimer?: number;

  private btnUndo?: HTMLButtonElement;
  private btnRedo?: HTMLButtonElement;

  constructor(options: CodeEditorOptions) {
    this.currentLanguage = options.language;
    this.currentValue = options.value || '';
    this.onChange = options.onChange;

    this.container = document.createElement('div');
    this.container.className = `code-editor-component lang-${this.currentLanguage}`;
    if (options.height) {
      this.container.style.height = options.height;
    }

    this.buildDOM(options);
    this.bindEvents();
    this.initHistory();
    this.updateEditor();
  }

  public getElement(): HTMLElement {
    return this.container;
  }

  public setValue(val: string): void {
    this.currentValue = val;
    this.textarea.value = val;
    this.initHistory();
    this.updateEditor();
  }

  public getValue(): string {
    return this.currentValue;
  }

  /**
   * Abre um editor de código em um modal centralizado e proeminente sobre o canvas
   */
  public static openCodeModal(params: {
    title: string;
    language: CodeLanguage;
    value: string;
    onSave: (newValue: string) => void;
  }): void {
    const existing = document.getElementById('codeEditorCanvasModalBackdrop');
    existing?.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'codeEditorCanvasModalBackdrop';
    backdrop.className = 'flow-modal-backdrop';

    const langName = {
      javascript: 'JavaScript',
      html: 'HTML',
      css: 'CSS',
    }[params.language];

    const langColor = {
      javascript: '#f59e0b',
      html: '#ec4899',
      css: '#06b6d4',
    }[params.language];

    backdrop.innerHTML = `
      <div class="code-modal-card">
        <div class="code-modal-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(99, 102, 241, 0.15); display: flex; align-items: center; justify-content: center; color: ${langColor};">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h3 style="font-size: 15px; font-weight: 700; color: #f8fafc; margin: 0;">${params.title}</h3>
                <span style="font-size: 10px; background: #1e293b; color: ${langColor}; padding: 2px 6px; border-radius: 4px; font-weight: 700; text-transform: uppercase;">${langName}</span>
              </div>
              <p style="font-size: 11px; color: #94a3b8; margin: 2px 0 0 0;">Editor de código sobre o canvas com destaque e auto-indentação</p>
            </div>
          </div>
          <button id="btnCloseCodeModal" class="sidebar-toggle-btn" title="Fechar editor (Esc)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="code-modal-body">
          <!-- Editor montado aqui -->
        </div>
        <div class="code-modal-footer">
          <span style="font-size: 11px; color: #64748b; margin-right: auto;">Pressione <strong>Tab</strong> para indentar • <strong>Esc</strong> para fechar</span>
          <button id="btnCancelCodeModal" class="btn btn-secondary">Cancelar</button>
          <button id="btnSaveCodeModal" class="btn btn-primary">Salvar Código</button>
        </div>
      </div>
    `;

    const bodyEl = backdrop.querySelector('.code-modal-body') as HTMLElement;
    let localValue = params.value || '';

    const editor = new CodeEditorComponent({
      language: params.language,
      value: localValue,
      title: params.title,
      height: '100%',
      onChange: (val) => {
        localValue = val;
      },
    });

    bodyEl.appendChild(editor.getElement());

    const close = () => {
      window.removeEventListener('keydown', onKeyDown);
      backdrop.remove();
    };

    const saveAndClose = () => {
      params.onSave(localValue);
      close();
    };

    backdrop.querySelector('#btnCloseCodeModal')?.addEventListener('click', close);
    backdrop.querySelector('#btnCancelCodeModal')?.addEventListener('click', close);
    backdrop.querySelector('#btnSaveCodeModal')?.addEventListener('click', saveAndClose);

    // Clicar fora da tela do editor não deve fechar nem alterar nada
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        e.stopPropagation();
      }
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    document.body.appendChild(backdrop);
  }

  private buildDOM(options: CodeEditorOptions): void {
    const langLabel = {
      javascript: 'JavaScript',
      html: 'HTML',
      css: 'CSS',
    }[this.currentLanguage];

    this.container.innerHTML = `
      <div class="code-editor-toolbar">
        <div class="code-editor-toolbar-left">
          <span class="code-editor-lang-badge">${langLabel}</span>
          <span class="code-editor-title">${options.title || 'Editor de Código'}</span>
        </div>
        <div class="code-editor-toolbar-actions">
          <button type="button" class="ce-btn btn-undo-code" title="Desfazer (Ctrl+Z)" disabled>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
            <span>Desfazer</span>
          </button>
          <button type="button" class="ce-btn btn-redo-code" title="Fazer (Ctrl+Y / Ctrl+Shift+Z)" disabled>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
            <span>Fazer</span>
          </button>
          <button type="button" class="ce-btn btn-format-code" title="Formatar / Auto-indentar código">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>Formatar</span>
          </button>
          <button type="button" class="ce-btn btn-select-all-code" title="Selecionar Todo o Código (Ctrl+A)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 3v18"/><path d="M15 3v18"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
            <span>Selecionar</span>
          </button>
          <button type="button" class="ce-btn btn-copy-code" title="Copiar código">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Copiar</span>
          </button>
        </div>
      </div>

      <div class="code-editor-main">
        <div class="code-editor-gutters">
          <div class="code-editor-line-numbers">1</div>
        </div>
        <div class="code-editor-content-wrapper">
          <pre class="code-editor-highlight-layer" aria-hidden="true"><code></code></pre>
          <textarea
            class="code-editor-textarea"
            spellcheck="false"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            placeholder="${options.placeholder || 'Digite seu código aqui...'}"
          ></textarea>
          <div class="code-editor-autocomplete-popup" style="display: none;">
            <ul class="code-editor-autocomplete-list"></ul>
          </div>
        </div>
      </div>

      <div class="code-editor-statusbar">
        <span class="ce-status-lang">${langLabel} (UTF-8)</span>
        <span class="ce-status-error valid" title="Verificação de Sintaxe">✓ Sem erros</span>
        <span class="ce-status-pos">Lin 1, Col 1</span>
      </div>
    `;

    this.textarea = this.container.querySelector('.code-editor-textarea') as HTMLTextAreaElement;
    this.lineNumbersEl = this.container.querySelector('.code-editor-line-numbers') as HTMLElement;
    this.highlightLayer = this.container.querySelector('.code-editor-highlight-layer code') as HTMLElement;
    this.statusLangEl = this.container.querySelector('.ce-status-lang') as HTMLElement;
    this.statusPosEl = this.container.querySelector('.ce-status-pos') as HTMLElement;
    this.statusErrorEl = this.container.querySelector('.ce-status-error') as HTMLElement;
    this.autocompletePopup = this.container.querySelector('.code-editor-autocomplete-popup') as HTMLElement;
    this.autocompleteListEl = this.container.querySelector('.code-editor-autocomplete-list') as HTMLElement;
    this.btnUndo = this.container.querySelector('.btn-undo-code') as HTMLButtonElement;
    this.btnRedo = this.container.querySelector('.btn-redo-code') as HTMLButtonElement;

    this.textarea.value = this.currentValue;
  }

  private bindEvents(): void {
    // Sincronização de texto e digitação
    this.textarea.addEventListener('input', () => {
      this.currentValue = this.textarea.value;
      this.recordHistory(this.currentValue, this.textarea.selectionStart, this.textarea.selectionEnd);
      this.updateEditor();
      this.onChange(this.currentValue);
      this.triggerAutocomplete();
    });

    // Sincronização de rolagem (Scroll Sync entre Textarea e Camada de Destaque / Linhas)
    this.textarea.addEventListener('scroll', () => {
      this.syncScroll();
      if (this.isAutocompleteOpen) {
        this.positionAutocompletePopup();
      }
    });

    // Teclas especiais (Tab, Parênteses, Chaves, Aspas, Setas e Enter)
    this.textarea.addEventListener('keydown', (e: KeyboardEvent) => {
      if (this.handleAutocompleteKeydown(e)) {
        return;
      }
      this.handleKeydown(e);
      this.updateCursorStatus();
    });

    this.textarea.addEventListener('keyup', (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        this.triggerAutocomplete();
      }
      this.updateCursorStatus();
    });

    this.textarea.addEventListener('click', () => {
      this.closeAutocomplete();
      this.updateCursorStatus();
    });

    this.textarea.addEventListener('blur', () => {
      // Pequeno timeout para permitir clique em itens do autocomplete
      setTimeout(() => this.closeAutocomplete(), 200);
    });

    this.textarea.addEventListener('focus', () => this.updateCursorStatus());

    // Botões de ação da Toolbar
    this.btnUndo?.addEventListener('click', () => {
      this.undo();
    });

    this.btnRedo?.addEventListener('click', () => {
      this.redo();
    });

    const copyBtn = this.container.querySelector('.btn-copy-code');
    copyBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(this.currentValue);
        const span = copyBtn.querySelector('span');
        if (span) {
          const old = span.textContent;
          span.textContent = 'Copiado!';
          setTimeout(() => { span.textContent = old; }, 1500);
        }
      } catch (e) {
        console.error(e);
      }
    });

    const formatBtn = this.container.querySelector('.btn-format-code');
    formatBtn?.addEventListener('click', () => {
      this.formatCode();
    });

    const selectAllBtn = this.container.querySelector('.btn-select-all-code');
    selectAllBtn?.addEventListener('click', () => {
      this.textarea.focus();
      this.textarea.setSelectionRange(0, this.textarea.value.length);
      this.updateCursorStatus();
    });
  }

  private handleKeydown(e: KeyboardEvent): void {
    const textarea = this.textarea;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    // Atalho Selecionar Tudo (Ctrl+A / Cmd+A) independente da posição ou foco
    if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      textarea.focus();
      textarea.setSelectionRange(0, textarea.value.length);
      this.updateCursorStatus();
      return;
    }

    // Atalhos de Desfazer e Fazer (Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y, Cmd+Z, Cmd+Shift+Z)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
      e.preventDefault();
      if (e.shiftKey) {
        this.redo();
      } else {
        this.undo();
      }
      return;
    }

    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
      e.preventDefault();
      this.redo();
      return;
    }

    // 1. Tecla TAB e Shift+TAB para indentação
    if (e.key === 'Tab') {
      e.preventDefault();
      const tabStr = '  '; // 2 espaços

      if (start === end) {
        // Inserção simples de 2 espaços
        textarea.value = value.substring(0, start) + tabStr + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + tabStr.length;
      } else {
        // Indentação de bloco multilinha
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = value.indexOf('\n', end);
        const effectiveEnd = lineEnd === -1 ? value.length : lineEnd;
        const selectedBlock = value.substring(lineStart, effectiveEnd);
        const lines = selectedBlock.split('\n');

        let modified = '';
        if (e.shiftKey) {
          // Desindentar
          modified = lines.map((l) => l.startsWith('  ') ? l.substring(2) : (l.startsWith(' ') ? l.substring(1) : l)).join('\n');
        } else {
          // Indentar
          modified = lines.map((l) => tabStr + l).join('\n');
        }

        textarea.value = value.substring(0, lineStart) + modified + value.substring(effectiveEnd);
        textarea.selectionStart = lineStart;
        textarea.selectionEnd = lineStart + modified.length;
      }

      this.currentValue = textarea.value;
      this.updateEditor();
      this.onChange(this.currentValue);
      return;
    }

    // 2. Auto-fechamento de parênteses, chaves, colchetes e aspas
    const pairs: Record<string, string> = {
      '(': ')',
      '{': '}',
      '[': ']',
      "'": "'",
      '"': '"',
      '`': '`',
    };

    if (pairs[e.key]) {
      const open = e.key;
      const close = pairs[open];

      // Se houver seleção, envelopa a seleção
      if (start !== end) {
        e.preventDefault();
        const selected = value.substring(start, end);
        textarea.value = value.substring(0, start) + open + selected + close + value.substring(end);
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = end + 1;
        this.currentValue = textarea.value;
        this.updateEditor();
        this.onChange(this.currentValue);
        return;
      }

      // Se não houver seleção, insere par e posiciona cursor no meio
      if (['(', '{', '['].includes(open)) {
        e.preventDefault();
        textarea.value = value.substring(0, start) + open + close + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        this.currentValue = textarea.value;
        this.updateEditor();
        this.onChange(this.currentValue);
        return;
      }
    }

    // Pular caractere de fechamento se o usuário digitar ele diretamente
    if ([')', '}', ']', "'", '"', '`'].includes(e.key) && start === end && value[start] === e.key) {
      e.preventDefault();
      textarea.selectionStart = textarea.selectionEnd = start + 1;
      return;
    }

    // 3. Enter com auto-identação herdada da linha anterior
    if (e.key === 'Enter') {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLine = value.substring(lineStart, start);
      const matchIndent = currentLine.match(/^(\s+)/);
      let indent = matchIndent ? matchIndent[1] : '';

      // Se o último caractere antes do Enter for '{' ou '(', adiciona mais 2 espaços
      const prevChar = value.charAt(start - 1);
      const nextChar = value.charAt(start);
      if (prevChar === '{' || prevChar === '[') {
        e.preventDefault();
        const extraIndent = indent + '  ';
        if (nextChar === '}' || nextChar === ']') {
          // Linha intermediária expandida
          textarea.value = value.substring(0, start) + '\n' + extraIndent + '\n' + indent + value.substring(start);
          textarea.selectionStart = textarea.selectionEnd = start + 1 + extraIndent.length;
        } else {
          textarea.value = value.substring(0, start) + '\n' + extraIndent + value.substring(start);
          textarea.selectionStart = textarea.selectionEnd = start + 1 + extraIndent.length;
        }
        this.currentValue = textarea.value;
        this.updateEditor();
        this.onChange(this.currentValue);
        return;
      }

      if (indent.length > 0) {
        e.preventDefault();
        textarea.value = value.substring(0, start) + '\n' + indent + value.substring(start);
        textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length;
        this.currentValue = textarea.value;
        this.updateEditor();
        this.onChange(this.currentValue);
        return;
      }
    }
  }

  /* ========================================================== */
  /* SISTEMA DE AUTOCOMPLETE INTELIGENTE (JS, HTML, CSS)        */
  /* ========================================================== */

  private handleAutocompleteKeydown(e: KeyboardEvent): boolean {
    if (!this.isAutocompleteOpen) {
      // Atalho manual para abrir sugestões: Ctrl+Espaço
      if ((e.ctrlKey || e.metaKey) && e.key === ' ') {
        e.preventDefault();
        this.triggerAutocomplete(true);
        return true;
      }
      return false;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedAutocompleteIndex = (this.selectedAutocompleteIndex + 1) % this.autocompleteItems.length;
      this.renderAutocompleteList();
      return true;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedAutocompleteIndex = (this.selectedAutocompleteIndex - 1 + this.autocompleteItems.length) % this.autocompleteItems.length;
      this.renderAutocompleteList();
      return true;
    }

    if (e.key === 'Enter' || e.key === 'Tab') {
      if (this.autocompleteItems.length > 0) {
        e.preventDefault();
        this.applyAutocomplete(this.autocompleteItems[this.selectedAutocompleteIndex]);
        return true;
      }
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      this.closeAutocomplete();
      return true;
    }

    return false;
  }

  private triggerAutocomplete(force = false): void {
    const textarea = this.textarea;
    const pos = textarea.selectionStart;
    const value = textarea.value;

    // Detectar palavra/prefixo atual imediatamente antes do cursor
    const leftText = value.substring(0, pos);
    const match = leftText.match(/([a-zA-Z0-9_$-]+)$/);

    if (!match && !force) {
      this.closeAutocomplete();
      return;
    }

    const prefix = match ? match[1] : '';
    this.currentPrefix = prefix;
    this.prefixStart = pos - prefix.length;

    if (!force && prefix.length === 0) {
      this.closeAutocomplete();
      return;
    }

    // Obter lista de sugestões com suporte a códigos mistos (JS, HTML, CSS) priorizando contexto
    const suggestions = this.getMixedSuggestions(pos);
    
    // Filtrar sugestões pelo prefixo digitado (case-insensitive)
    const filtered = suggestions.filter((item) => {
      if (!prefix) return true;
      return item.label.toLowerCase().startsWith(prefix.toLowerCase());
    });

    if (filtered.length === 0) {
      this.closeAutocomplete();
      return;
    }

    this.autocompleteItems = filtered.slice(0, 20); // Limita aos primeiros 20 resultados
    this.selectedAutocompleteIndex = 0;
    this.isAutocompleteOpen = true;

    this.renderAutocompleteList();
    this.positionAutocompletePopup();
  }

  private renderAutocompleteList(): void {
    this.autocompleteListEl.innerHTML = '';
    
    this.autocompleteItems.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = `code-editor-autocomplete-item ${idx === this.selectedAutocompleteIndex ? 'active' : ''}`;
      
      const iconLetter = {
        keyword: 'K',
        function: 'F',
        variable: 'V',
        property: 'P',
        tag: 'T',
        snippet: 'S',
      }[item.type] || 'A';

      li.innerHTML = `
        <span class="ac-icon ac-icon-${item.type}">${iconLetter}</span>
        <span class="ac-label">${item.label}</span>
        <span class="ac-type">${item.detail || item.type}</span>
      `;

      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.applyAutocomplete(item);
      });

      this.autocompleteListEl.appendChild(li);
    });

    this.autocompletePopup.style.display = 'block';

    // Rolar lista para manter o item selecionado visível
    const activeEl = this.autocompleteListEl.children[this.selectedAutocompleteIndex] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }

  private positionAutocompletePopup(): void {
    const textarea = this.textarea;
    const textBefore = textarea.value.substring(0, textarea.selectionStart);
    const lines = textBefore.split('\n');
    const currentLineIdx = lines.length - 1;
    const currentColIdx = lines[currentLineIdx].length;

    const lineHeight = 18; // 12px * 1.5
    const charWidth = 7.2; // Largura aproximada de caractere monoespaçado

    const top = Math.max(10, (currentLineIdx + 1) * lineHeight - textarea.scrollTop + 14);
    const left = Math.min(Math.max(10, currentColIdx * charWidth - textarea.scrollLeft + 12), textarea.clientWidth - 280);

    this.autocompletePopup.style.top = `${top}px`;
    this.autocompletePopup.style.left = `${left}px`;
  }

  private applyAutocomplete(item: AutocompleteItem): void {
    const textarea = this.textarea;
    const value = textarea.value;
    const before = value.substring(0, this.prefixStart);
    const after = value.substring(textarea.selectionEnd);

    const insertedText = item.insertText;
    textarea.value = before + insertedText + after;

    const cursorOffset = item.cursorOffset !== undefined ? item.cursorOffset : insertedText.length;
    const newCursor = this.prefixStart + cursorOffset;
    textarea.selectionStart = textarea.selectionEnd = newCursor;

    this.currentValue = textarea.value;
    this.updateEditor();
    this.onChange(this.currentValue);
    this.closeAutocomplete();
    textarea.focus();
  }

  private closeAutocomplete(): void {
    this.isAutocompleteOpen = false;
    this.autocompletePopup.style.display = 'none';
  }

  private getLanguageSuggestions(lang: CodeLanguage): AutocompleteItem[] {
    if (lang === 'javascript') {
      const declared = this.extractDeclaredIdentifiers(this.currentValue);
      const builtins = JS_BUILTIN_SUGGESTIONS;

      const seen = new Set<string>();
      const combined: AutocompleteItem[] = [];

      // Sugestões das Cores Nomeadas do Fluxo
      const flowColors = ColorPickerManager.activeFlowColors || [];
      flowColors.forEach((fc) => {
        if (fc.name) {
          combined.push({
            label: `flowColors.${fc.name}`,
            type: 'variable',
            insertText: `flowColors.${fc.name}`,
            detail: `Cor do Fluxo (${fc.hex})`,
          });
          combined.push({
            label: `colors.${fc.name}`,
            type: 'variable',
            insertText: `colors.${fc.name}`,
            detail: `Cor do Fluxo (${fc.hex})`,
          });
        }
      });
      if (flowColors.length > 0) {
        combined.push({
          label: 'flowColors',
          type: 'variable',
          insertText: 'flowColors',
          detail: 'Objeto de Cores do Fluxo',
        });
        combined.push({
          label: 'colors',
          type: 'variable',
          insertText: 'colors',
          detail: 'Objeto de Cores do Fluxo',
        });
      }

      declared.forEach((item) => {
        if (!seen.has(item.label)) {
          seen.add(item.label);
          combined.push(item);
        }
      });

      builtins.forEach((item) => {
        if (!seen.has(item.label)) {
          seen.add(item.label);
          combined.push(item);
        }
      });

      return combined;
    } else if (lang === 'css') {
      const cssCombined = [...CSS_SUGGESTIONS];
      const flowColors = ColorPickerManager.activeFlowColors || [];
      flowColors.forEach((fc) => {
        if (fc.name) {
          cssCombined.push({
            label: `var(--color-${fc.name})`,
            type: 'property',
            insertText: `var(--color-${fc.name})`,
            detail: `Cor do Fluxo (${fc.hex})`,
          });
          cssCombined.push({
            label: `${fc.hex} /* ${fc.name} */`,
            type: 'property',
            insertText: fc.hex,
            detail: `Cor do Fluxo: ${fc.name}`,
          });
        }
      });
      return cssCombined;
    } else if (lang === 'html') {
      return HTML_SUGGESTIONS;
    }
    return [];
  }

  /**
   * Obtém sugestões para códigos mistos (JS, HTML e CSS combinados),
   * detectando quais linguagens estão presentes no código e priorizando
   * o contexto específico que está sendo editado na posição do cursor.
   */
  private getMixedSuggestions(cursorPos: number): AutocompleteItem[] {
    const code = this.currentValue || '';
    const textBeforeCursor = code.substring(0, cursorPos);

    // 1. Detectar linguagens presentes no código
    const hasJsInDoc =
      this.currentLanguage === 'javascript' ||
      /<script\b/i.test(code) ||
      /\b(function|const|let|var|document\.|window\.|console\.|=>|addEventListener|return|async|await)\b/.test(code);

    const hasCssInDoc =
      this.currentLanguage === 'css' ||
      /<style\b/i.test(code) ||
      /\b(style\s*=|display\s*:|color\s*:|background\s*:|margin\s*:|padding\s*:|font-size\s*:|border\s*:|width\s*:|height\s*:)\b/i.test(code);

    const hasHtmlInDoc =
      this.currentLanguage === 'html' ||
      /<\/?[a-z][\s\S]*>/i.test(code) ||
      /<!DOCTYPE\b/i.test(code);

    // 2. Determinar a linguagem do contexto atual sob o cursor
    let cursorLang: CodeLanguage = this.currentLanguage;

    // Verificar se cursor está dentro de tag <script>...</script>
    const lastOpenScript = textBeforeCursor.lastIndexOf('<script');
    const lastCloseScript = textBeforeCursor.lastIndexOf('</script>');
    const isInsideScriptTag = lastOpenScript !== -1 && lastOpenScript > lastCloseScript;

    // Verificar se cursor está dentro de tag <style>...</style>
    const lastOpenStyle = textBeforeCursor.lastIndexOf('<style');
    const lastCloseStyle = textBeforeCursor.lastIndexOf('</style>');
    const isInsideStyleTag = lastOpenStyle !== -1 && lastOpenStyle > lastCloseStyle;

    // Verificar se cursor está dentro de atributo style="..."
    const lastStyleAttrDbl = textBeforeCursor.lastIndexOf('style="');
    const lastStyleAttrSgl = textBeforeCursor.lastIndexOf("style='");
    const styleAttrIdx = Math.max(lastStyleAttrDbl, lastStyleAttrSgl);
    const quoteChar = styleAttrIdx !== -1 ? textBeforeCursor[styleAttrIdx + 6] : '';
    const isInsideStyleAttr =
      styleAttrIdx !== -1 && textBeforeCursor.indexOf(quoteChar, styleAttrIdx + 7) === -1;

    // Verificar se cursor está dentro de atributo de evento inline como onclick="..."
    const inlineEventMatch = textBeforeCursor.match(/on[a-z]+\s*=\s*["']([^"']*)$/i);

    if (isInsideScriptTag || inlineEventMatch) {
      cursorLang = 'javascript';
    } else if (isInsideStyleTag || isInsideStyleAttr) {
      cursorLang = 'css';
    } else if (this.currentLanguage === 'html') {
      cursorLang = 'html';
    } else if (this.currentLanguage === 'javascript') {
      // Se em arquivo JS, verificar se está digitando tag HTML (ex: template string com HTML)
      const lastLeftAngle = textBeforeCursor.lastIndexOf('<');
      const lastRightAngle = textBeforeCursor.lastIndexOf('>');
      if (lastLeftAngle > lastRightAngle) {
        cursorLang = 'html';
      } else {
        cursorLang = 'javascript';
      }
    } else if (this.currentLanguage === 'css') {
      cursorLang = 'css';
    }

    // 3. Obter itens de cada linguagem presente
    const jsItems: AutocompleteItem[] = hasJsInDoc
      ? this.getLanguageSuggestions('javascript').map((item) => ({
          ...item,
          detail: item.detail ? `[JS] ${item.detail}` : '[JS]',
        }))
      : [];

    const cssItems: AutocompleteItem[] = hasCssInDoc
      ? CSS_SUGGESTIONS.map((item) => ({
          ...item,
          detail: item.detail ? `[CSS] ${item.detail}` : '[CSS]',
        }))
      : [];

    const htmlItems: AutocompleteItem[] = hasHtmlInDoc
      ? HTML_SUGGESTIONS.map((item) => ({
          ...item,
          detail: item.detail ? `[HTML] ${item.detail}` : '[HTML]',
        }))
      : [];

    // Priorizar a lista da linguagem do cursor no topo
    let prioritizedLists: AutocompleteItem[][] = [];
    if (cursorLang === 'javascript') {
      prioritizedLists = [jsItems, htmlItems, cssItems];
    } else if (cursorLang === 'css') {
      prioritizedLists = [cssItems, htmlItems, jsItems];
    } else {
      prioritizedLists = [htmlItems, jsItems, cssItems];
    }

    const seen = new Set<string>();
    const combined: AutocompleteItem[] = [];

    for (const list of prioritizedLists) {
      for (const item of list) {
        const key = `${item.label}::${item.type}`;
        if (!seen.has(key)) {
          seen.add(key);
          combined.push(item);
        }
      }
    }

    // Fallback se nada foi detectado
    if (combined.length === 0) {
      return this.getLanguageSuggestions(this.currentLanguage);
    }

    return combined;
  }

  /**
   * Extrai variáveis, constantes e funções declaradas pelo usuário no próprio código JS
   */
  private extractDeclaredIdentifiers(code: string): AutocompleteItem[] {
    const items: AutocompleteItem[] = [];
    const seen = new Set<string>();

    const addIdentifier = (name: string, type: 'variable' | 'function', detail: string) => {
      if (name && !seen.has(name) && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
        seen.add(name);
        items.push({
          label: name,
          type,
          insertText: type === 'function' ? `${name}()` : name,
          detail,
          cursorOffset: type === 'function' ? name.length + 1 : name.length,
        });
      }
    };

    // 1. Declarações de variáveis (const x, let y, var z)
    const varRegex = /\b(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$,\s=]+)/g;
    let match;
    while ((match = varRegex.exec(code)) !== null) {
      const declStr = match[1];
      const parts = declStr.split(',');
      for (const part of parts) {
        const idMatch = part.trim().match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
        if (idMatch) {
          addIdentifier(idMatch[1], 'variable', 'local variable');
        }
      }
    }

    // 2. Declarações de função tradicional: function myFunc(...)
    const fnRegex = /\bfunction\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
    while ((match = fnRegex.exec(code)) !== null) {
      addIdentifier(match[1], 'function', 'function');
    }

    // 3. Funções atribuídas: const myFunc = (...) => ... ou let f = function(...)
    const arrowFnRegex = /\b(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/g;
    while ((match = arrowFnRegex.exec(code)) !== null) {
      addIdentifier(match[1], 'function', 'arrow function');
    }

    // 4. Parâmetros de funções comuns: function(arg1, arg2) ou (item, index) =>
    const paramRegex = /\(([^)]+)\)\s*(?:=>|\{)/g;
    while ((match = paramRegex.exec(code)) !== null) {
      const params = match[1].split(',');
      for (const p of params) {
        const pClean = p.trim().match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
        if (pClean && !['const', 'let', 'var', 'function'].includes(pClean[1])) {
          addIdentifier(pClean[1], 'variable', 'parameter');
        }
      }
    }

    return items;
  }

  /**
   * Valida sintaxe em tempo real para JS, HTML e CSS delegada ao CodeSyntaxValidator
   */
  private validateSyntax(code: string, lang: CodeLanguage): SyntaxDiagnostic | null {
    return CodeSyntaxValidator.validate(code, lang);
  }

  /**
   * Detecta blocos dobráveis (funções, chaves {}, tags multilinhas)
   */
  private detectFoldableRanges(code: string): { startLine: number; endLine: number }[] {
    const lines = code.split('\n');
    const ranges: { startLine: number; endLine: number }[] = [];
    const stack: { line: number }[] = [];

    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;
      for (let i = 0; i < lineText.length; i++) {
        const char = lineText[i];
        if (char === '{') {
          stack.push({ line: lineNum });
        } else if (char === '}') {
          const top = stack.pop();
          if (top && top.line < lineNum) {
            ranges.push({ startLine: top.line, endLine: lineNum });
          }
        }
      }
    });

    return ranges;
  }

  private toggleFoldAtLine(lineNum: number): void {
    const existingIndex = this.foldedRanges.findIndex((r) => r.startLine === lineNum);
    if (existingIndex !== -1) {
      // Desdobrar (expandir)
      const range = this.foldedRanges[existingIndex];
      this.foldedRanges.splice(existingIndex, 1);
      this.unfoldRangeInText(range);
    } else {
      // Dobrar (recolher)
      const ranges = this.detectFoldableRanges(this.textarea.value);
      const match = ranges.find((r) => r.startLine === lineNum);
      if (match) {
        this.foldRangeInText(match.startLine, match.endLine);
      }
    }
  }

  private foldRangeInText(startLine: number, endLine: number): void {
    const lines = this.textarea.value.split('\n');
    if (startLine > lines.length || endLine > lines.length || startLine >= endLine) return;

    // Linhas que serão escondidas
    const hiddenLines = lines.slice(startLine, endLine);
    const preview = ` /* ... ${hiddenLines.length} linhas ... */ `;
    
    this.foldedRanges.push({
      startLine,
      endLine,
      preview: hiddenLines.join('\n'),
    });

    // Manter a linha inicial, concatenar placeholder com fechamento na mesma linha
    const startText = lines[startLine - 1];
    const endText = lines[endLine - 1].trim();
    lines[startLine - 1] = `${startText}...}${endText !== '}' && endText.endsWith('}') ? '' : (endText === '}' ? '' : ' ' + endText)}`;
    
    // Remover linhas intermediárias até endLine
    lines.splice(startLine, endLine - startLine);

    this.textarea.value = lines.join('\n');
    this.currentValue = this.textarea.value;
    this.updateEditor();
    this.onChange(this.currentValue);
  }

  private unfoldRangeInText(range: { startLine: number; endLine: number; preview: string }): void {
    const lines = this.textarea.value.split('\n');
    const startIdx = range.startLine - 1;
    if (startIdx >= lines.length) return;

    const currentStartLine = lines[startIdx];
    // Recupera texto original da linha inicial antes do "...}"
    const cleanStart = currentStartLine.replace(/\.\.\.\}.*$/, '');
    
    const hiddenLines = range.preview.split('\n');
    // Recoloca linha inicial e as linhas que estavam escondidas
    lines.splice(startIdx, 1, cleanStart, ...hiddenLines);

    this.textarea.value = lines.join('\n');
    this.currentValue = this.textarea.value;
    this.updateEditor();
    this.onChange(this.currentValue);
  }

  private updateEditor(): void {
    // 1. Diagnóstico de Sintaxe
    this.currentSyntaxError = this.validateSyntax(this.currentValue, this.currentLanguage);
    if (this.statusErrorEl) {
      if (this.currentSyntaxError) {
        this.statusErrorEl.className = 'ce-status-error';
        const lineInfo = this.currentSyntaxError.line ? ` (Lin ${this.currentSyntaxError.line})` : '';
        this.statusErrorEl.textContent = `⚠ ${this.currentSyntaxError.message}${lineInfo}`;
        this.statusErrorEl.title = this.currentSyntaxError.message;
      } else {
        this.statusErrorEl.className = 'ce-status-error valid';
        this.statusErrorEl.textContent = '✓ Sem erros';
        this.statusErrorEl.title = 'Sintaxe válida';
      }
    }

    // 2. Atualizar numeração de linhas e botões de recolher / expandir
    const lines = this.currentValue.split('\n');
    const lineCount = lines.length || 1;
    const foldableRanges = this.detectFoldableRanges(this.currentValue);
    const foldableStartLines = new Set(foldableRanges.map((r) => r.startLine));
    const foldedStartLines = new Set(this.foldedRanges.map((r) => r.startLine));

    let numbersHtml = '';
    for (let i = 1; i <= lineCount; i++) {
      const isErrLine = this.currentSyntaxError?.line === i;
      const isFoldable = foldableStartLines.has(i);
      const isFolded = foldedStartLines.has(i);

      let foldBtn = '';
      if (isFolded) {
        foldBtn = `<span class="ce-fold-btn folded" data-line="${i}" title="Expandir bloco">▶</span>`;
      } else if (isFoldable) {
        foldBtn = `<span class="ce-fold-btn" data-line="${i}" title="Recolher bloco">▼</span>`;
      } else {
        foldBtn = `<span class="ce-fold-placeholder"></span>`;
      }

      numbersHtml += `
        <div class="ce-line-gutter-row" style="${isErrLine ? 'color: #f43f5e; font-weight: bold;' : ''}">
          ${foldBtn}
          <span class="ce-line-num">${i}</span>
        </div>
      `;
    }
    this.lineNumbersEl.innerHTML = numbersHtml;

    // Bind cliques de recolher/expandir nas setinhas da gutter
    this.lineNumbersEl.querySelectorAll('.ce-fold-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const line = parseInt((btn as HTMLElement).dataset.line || '0', 10);
        if (line > 0) {
          this.toggleFoldAtLine(line);
        }
      });
    });

    // 3. Atualizar Highlight layer com marcação ondulada de erro se houver
    this.highlightLayer.innerHTML = CodeSyntaxHighlighter.highlight(this.currentValue, this.currentLanguage, this.currentSyntaxError) + '\n';

    // 4. Sincronizar scroll
    this.syncScroll();
    this.updateCursorStatus();
    this.updateHistoryButtons();
  }

  /**
   * Inicializa a pilha de histórico com o estado inicial
   */
  private initHistory(): void {
    this.historyStack = [{
      value: this.currentValue,
      selectionStart: this.textarea.selectionStart || 0,
      selectionEnd: this.textarea.selectionEnd || 0,
    }];
    this.historyIndex = 0;
    this.updateHistoryButtons();
  }

  /**
   * Registra uma nova alteração no histórico (com debounce de digitação e corte da pilha)
   */
  private recordHistory(val: string, selStart: number, selEnd: number): void {
    if (this.isApplyingHistory) return;

    if (this.historyDebounceTimer) {
      window.clearTimeout(this.historyDebounceTimer);
    }

    this.historyDebounceTimer = window.setTimeout(() => {
      // Se estamos gravando algo diferente do topo atual
      const currentEntry = this.historyStack[this.historyIndex];
      if (currentEntry && currentEntry.value === val) return;

      // Descarta estados à frente do índice atual (novo ramo de edição)
      this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);

      // Limite de 100 itens no histórico para evitar sobrecarga de memória
      if (this.historyStack.length >= 100) {
        this.historyStack.shift();
      }

      this.historyStack.push({
        value: val,
        selectionStart: selStart,
        selectionEnd: selEnd,
      });
      this.historyIndex = this.historyStack.length - 1;
      this.updateHistoryButtons();
    }, 250);
  }

  /**
   * Desfaz a última alteração (Undo)
   */
  public undo(): void {
    if (this.historyIndex <= 0) return;

    this.historyIndex--;
    const state = this.historyStack[this.historyIndex];
    if (!state) return;

    this.isApplyingHistory = true;
    this.currentValue = state.value;
    this.textarea.value = state.value;
    this.textarea.selectionStart = state.selectionStart;
    this.textarea.selectionEnd = state.selectionEnd;
    this.updateEditor();
    this.onChange(this.currentValue);
    this.isApplyingHistory = false;
    this.updateHistoryButtons();
  }

  /**
   * Refaz a alteração desfeita (Redo)
   */
  public redo(): void {
    if (this.historyIndex >= this.historyStack.length - 1) return;

    this.historyIndex++;
    const state = this.historyStack[this.historyIndex];
    if (!state) return;

    this.isApplyingHistory = true;
    this.currentValue = state.value;
    this.textarea.value = state.value;
    this.textarea.selectionStart = state.selectionStart;
    this.textarea.selectionEnd = state.selectionEnd;
    this.updateEditor();
    this.onChange(this.currentValue);
    this.isApplyingHistory = false;
    this.updateHistoryButtons();
  }

  /**
   * Atualiza o estado de habilitação/desabilitação dos botões da Toolbar
   */
  private updateHistoryButtons(): void {
    if (this.btnUndo) {
      this.btnUndo.disabled = this.historyIndex <= 0;
    }
    if (this.btnRedo) {
      this.btnRedo.disabled = this.historyIndex >= this.historyStack.length - 1;
    }
  }

  private syncScroll(): void {
    const st = this.textarea.scrollTop;
    const sl = this.textarea.scrollLeft;

    const layer = this.container.querySelector('.code-editor-highlight-layer');
    if (layer) {
      layer.scrollTop = st;
      layer.scrollLeft = sl;
    }
    const gutters = this.container.querySelector('.code-editor-gutters');
    if (gutters) {
      gutters.scrollTop = st;
    }
  }

  private updateCursorStatus(): void {
    const text = this.textarea.value.substring(0, this.textarea.selectionStart);
    const lines = text.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    this.statusPosEl.textContent = `Lin ${line}, Col ${col}`;
  }

  private formatCode(): void {
    const formatted = CodeFormatter.format(this.currentValue, this.currentLanguage);
    if (formatted !== this.currentValue) {
      this.setValue(formatted);
      this.onChange(formatted);
    }
  }

  private toggleFullscreen(): void {
    const isFs = this.container.classList.toggle('is-fullscreen');
    const fsBtn = this.container.querySelector('.btn-fullscreen-code');
    if (isFs) {
      document.body.classList.add('code-editor-fs-open');
      if (fsBtn) {
        fsBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
        `;
      }
    } else {
      document.body.classList.remove('code-editor-fs-open');
      if (fsBtn) {
        fsBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
        `;
      }
    }
    setTimeout(() => this.syncScroll(), 50);
  }
}
