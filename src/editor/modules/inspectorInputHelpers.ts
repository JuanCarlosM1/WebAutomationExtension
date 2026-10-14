/**
 * Utilitários para criação padronizada de inputs de formulário no Inspector
 */
import { CodeEditorComponent, CodeLanguage } from './codeEditorComponent';
import { HtmlElementAnalyzer } from './htmlElementAnalyzer';

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
    const isExpandedModal = Boolean(container.closest('#expandedNodeModalForm'));

    // No modal expandido geral do bloco, renderizamos o editor completo embutido
    if (isExpandedModal) {
      const group = document.createElement('div');
      group.className = 'form-group code-editor-form-group';
      const label = document.createElement('label');
      label.textContent = labelText;
      group.appendChild(label);

      const editor = new CodeEditorComponent({
        language,
        value: value || '',
        onChange,
        title: labelText,
        height: '240px',
      });
      group.appendChild(editor.getElement());
      container.appendChild(group);
      return;
    }

    // Na barra lateral direita, renderizamos uma prévia clicável que abre o editor sobre o canvas
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
    const previewSnippet = (value || '').trim().split('\n').slice(0, 3).join('\n') || '// (sem código)';

    group.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <label style="margin-bottom: 0;">${labelText}</label>
        <span style="font-size: 10px; font-weight: 700; color: ${langBadgeColor}; background: rgba(255,255,255,0.06); padding: 1px 6px; border-radius: 4px;">${langTitle}</span>
      </div>
      <div class="code-field-trigger-card" title="Clique para abrir o editor de código completo sobre o canvas">
        <div class="code-field-trigger-header">
          <div style="display: flex; align-items: center; gap: 6px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${langBadgeColor}" stroke-width="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span style="font-size: 11px; font-weight: 600; color: #cbd5e1;">Editar ${langTitle}</span>
          </div>
          <span class="code-field-line-count" style="font-size: 10px; color: #64748b;">${linesCount} linha${linesCount === 1 ? '' : 's'}</span>
        </div>
        <pre class="code-field-preview-code"><code>${this.escapeSnippet(previewSnippet)}</code></pre>
        <div class="code-field-trigger-footer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          <span>Abrir Editor sobre o Canvas</span>
        </div>
      </div>
    `;

    const openEditor = () => {
      CodeEditorComponent.openCodeModal({
        title: labelText,
        language,
        value: value || '',
        onSave: (newVal) => {
          onChange(newVal);
          // Atualiza prévia na barra lateral
          const newLines = (newVal || '').split('\n').length;
          const countEl = group.querySelector('.code-field-line-count');
          if (countEl) countEl.textContent = `${newLines} linha${newLines === 1 ? '' : 's'}`;
          const codeEl = group.querySelector('.code-field-preview-code code');
          if (codeEl) {
            const snip = (newVal || '').trim().split('\n').slice(0, 3).join('\n') || '// (sem código)';
            codeEl.innerHTML = this.escapeSnippet(snip);
          }
          if (onNodeDataChanged) onNodeDataChanged();
          if (showToast) showToast('Código salvo com sucesso!', 'success');
        },
      });
    };

    group.querySelector('.code-field-trigger-card')?.addEventListener('click', openEditor);
    container.appendChild(group);
  }

  public static escapeSnippet(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
