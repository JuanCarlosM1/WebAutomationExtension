/**
 * Utilitários para criação padronizada de inputs de formulário no Inspector
 */
import { CodeEditorComponent, CodeLanguage } from './codeEditorComponent';
import { HtmlElementAnalyzer } from './htmlElementAnalyzer';

import { CodeSyntaxHighlighter } from './codeSyntaxHighlighter';

export class InspectorInputHelpers {
  public static addTextInput(
    container: HTMLElement,
    labelText: string,
    value: string,
    onChange: (val: string) => void
  ): void {
    const group = document.createElement('div');
    group.className = 'form-group';
    group.innerHTML = `<label>${labelText}</label><input type="text" value="${value ?? ''}" />`;
    group.querySelector('input')?.addEventListener('input', (e: any) => onChange(e.target.value));
    container.appendChild(group);
  }

  /**
   * Adiciona um campo de seletor com botão de mira/analisador de HTML integrado
   */
  public static addSelectorInput(
    container: HTMLElement,
    labelText: string,
    value: string,
    onChange: (val: string) => void,
    placeholder: string = 'ex: #meu-elemento, .btn-primary, [data-id]'
  ): void {
    const group = document.createElement('div');
    group.className = 'form-group';
    group.innerHTML = `
      <label>${labelText}</label>
      <div style="display: flex; gap: 6px; align-items: center;">
        <input type="text" value="${value ?? ''}" placeholder="${placeholder}" style="flex: 1;" />
        <button type="button" class="btn btn-secondary btn-launch-analyzer" title="Ativar Analisador de HTML / Mira na Página" style="padding: 6px 10px; font-size: 11px; white-space: nowrap; display: flex; align-items: center; gap: 4px; border-color: #6366f1; background: rgba(99, 102, 241, 0.15); color: #c7d2fe; cursor: pointer; border-radius: 6px;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <span>Mirar</span>
        </button>
      </div>
    `;

    const inputEl = group.querySelector('input') as HTMLInputElement;
    inputEl?.addEventListener('input', (e: any) => onChange(e.target.value));

    const btnAnalyzer = group.querySelector('.btn-launch-analyzer') as HTMLButtonElement;
    btnAnalyzer?.addEventListener('click', () => {
      HtmlElementAnalyzer.startLivePicker((pickedSelector) => {
        if (inputEl) {
          inputEl.value = pickedSelector;
        }
        onChange(pickedSelector);
      });
    });

    container.appendChild(group);
  }

  public static addNumberInput(
    container: HTMLElement,
    labelText: string,
    value: number,
    onChange: (val: number) => void
  ): void {
    const group = document.createElement('div');
    group.className = 'form-group';
    group.innerHTML = `<label>${labelText}</label><input type="number" value="${value ?? 0}" />`;
    group.querySelector('input')?.addEventListener('input', (e: any) => onChange(Number(e.target.value)));
    container.appendChild(group);
  }

  public static addSelectInput(
    container: HTMLElement,
    labelText: string,
    selectedValue: string,
    options: Array<{ value: string; label: string }>,
    onChange: (val: string) => void
  ): void {
    const group = document.createElement('div');
    group.className = 'form-group';
    let optionsHtml = '';
    options.forEach((opt) => {
      const isSelected = String(selectedValue) === opt.value;
      optionsHtml += `<option value="${opt.value}" ${isSelected ? 'selected' : ''}>${opt.label}</option>`;
    });
    group.innerHTML = `<label>${labelText}</label><select>${optionsHtml}</select>`;
    const selectEl = group.querySelector('select');
    if (selectEl) {
      selectEl.value = String(selectedValue ?? '');
      selectEl.addEventListener('change', (e: any) => {
        onChange(e.target.value);
      });
      selectEl.addEventListener('input', (e: any) => {
        onChange(e.target.value);
      });
    }
    container.appendChild(group);
  }

  public static addCheckboxInput(
    container: HTMLElement,
    labelText: string,
    checked: boolean,
    onChange: (val: boolean) => void
  ): void {
    const group = document.createElement('div');
    group.className = 'form-group';
    group.innerHTML = `
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
        <input type="checkbox" ${checked ? 'checked' : ''} style="cursor:pointer;" />
        ${labelText}
      </label>
    `;
    group.querySelector('input')?.addEventListener('change', (e: any) => onChange(e.target.checked));
    container.appendChild(group);
  }

  public static addTextareaInput(
    container: HTMLElement,
    labelText: string,
    value: string,
    onChange: (val: string) => void
  ): void {
    const group = document.createElement('div');
    group.className = 'form-group';
    group.innerHTML = `<label>${labelText}</label><textarea rows="4" style="min-height: 84px; line-height: 1.4; resize: vertical;">${value ?? ''}</textarea>`;
    group.querySelector('textarea')?.addEventListener('input', (e: any) => onChange(e.target.value));
    container.appendChild(group);
  }

  public static addCodeEditorInput(
    container: HTMLElement,
    labelText: string,
    language: CodeLanguage,
    value: string,
    onChange: (val: string) => void,
    onNodeDataChanged?: () => void,
    showToast?: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void,
    _height = '200px'
  ): void {
    const group = document.createElement('div');
    group.className = 'form-group code-preview-group';

    const langBadgeColor = {
      javascript: '#f59e0b',
      html: '#ec4899',
      css: '#06b6d4',
    }[language];

    const langTitle = {
      javascript: 'JS',
      html: 'HTML',
      css: 'CSS',
    }[language];

    const linesCount = (value || '').split('\n').length;

    group.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <label style="margin-bottom: 0;">${labelText}</label>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="code-field-line-count" style="font-size: 10px; color: #64748b;">${linesCount} linha${linesCount === 1 ? '' : 's'}</span>
          <span style="font-size: 10px; font-weight: 700; color: ${langBadgeColor}; background: rgba(255,255,255,0.06); padding: 1px 6px; border-radius: 4px;">${langTitle}</span>
        </div>
      </div>
      <div class="code-field-preview-container" style="background: #090d16; border: 1px solid #1e293b; border-radius: 8px; padding: 10px 12px; cursor: pointer; transition: all 0.2s ease; resize: none !important; user-select: none;" title="Clique no código para abrir o editor">
        <pre class="code-field-preview-code" style="margin: 0; padding: 0; background: transparent; border: none; font-family: var(--font-mono, 'JetBrains Mono', monospace); font-size: 11px; line-height: 1.5; color: #f1f5f9; max-height: 120px; overflow-y: auto; overflow-x: hidden; white-space: pre-wrap; word-break: break-all; resize: none !important;"><code>${CodeSyntaxHighlighter.highlight(value || '// Clique para abrir o editor de código', language)}</code></pre>
      </div>
    `;

    const previewContainer = group.querySelector('.code-field-preview-container') as HTMLElement;
    previewContainer?.addEventListener('mouseenter', () => {
      previewContainer.style.borderColor = '#6366f1';
      previewContainer.style.boxShadow = '0 0 12px rgba(99, 102, 241, 0.2)';
    });
    previewContainer?.addEventListener('mouseleave', () => {
      previewContainer.style.borderColor = '#1e293b';
      previewContainer.style.boxShadow = 'none';
    });

    const openEditor = () => {
      CodeEditorComponent.openCodeModal({
        title: labelText,
        language,
        value: value || '',
        onSave: (newVal) => {
          value = newVal;
          onChange(newVal);
          const newLines = (newVal || '').split('\n').length;
          const countEl = group.querySelector('.code-field-line-count');
          if (countEl) countEl.textContent = `${newLines} linha${newLines === 1 ? '' : 's'}`;
          const codeEl = group.querySelector('.code-field-preview-code code');
          if (codeEl) {
            codeEl.innerHTML = CodeSyntaxHighlighter.highlight(newVal || '// Clique para abrir o editor de código', language);
          }
          if (onNodeDataChanged) onNodeDataChanged();
          if (showToast) showToast('Código salvo com sucesso!', 'success');
        },
      });
    };

    previewContainer?.addEventListener('click', openEditor);
    container.appendChild(group);
  }

  public static escapeSnippet(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
