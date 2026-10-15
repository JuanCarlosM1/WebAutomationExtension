/**
 * Formulários e inspetor de propriedades de nós do fluxo
 */
import { AnyAutomationNode, WebAutomationGraph } from '../../../../BibliotecaDeDev/src/types/schema';
import { ColorPickerManager } from './colorPickerManager';
import { CodeEditorComponent, CodeLanguage } from './codeEditorComponent';
import { InspectorInputHelpers } from './inspectorInputHelpers';
import { FlowPropertiesRenderer } from './inspector/flowProperties';
import { DomPropertiesRenderer } from './inspector/domProperties';
import { DataPropertiesRenderer } from './inspector/dataProperties';
import { StartPropertiesRenderer } from './inspector/startProperties';

export interface InspectorCallbacks {
  getGraph: () => WebAutomationGraph;
  getSelectedNodeId: () => string | undefined;
  onNodeDataChanged: () => void;
  onRenderGraph: () => void;
  showToast: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

export class InspectorManager {
  private expandedTriggerIndices: Set<number> = new Set([0]);
  private expandedCaseIndices: Set<number> = new Set([0]);
  private pendingScrollSelector?: string;

  constructor(
    private callbacks: InspectorCallbacks,
    private colorPicker: ColorPickerManager
  ) {}

  public renderInspector(scrollToSelector?: string): void {
    if (scrollToSelector) {
      this.pendingScrollSelector = scrollToSelector;
    }

    const sidebarRight = document.getElementById('sidebarInspector');
    const sidebarLeft = document.getElementById('sidebarLibrary');
    const resizerLeft = document.getElementById('resizerLeft');
    const btnActivityBlocks = document.getElementById('btnActivityBlocks');
    const btnActivityInspector = document.getElementById('btnActivityInspector');
    const noSelect = document.getElementById('noSelectionMessage')!;
    const form = document.getElementById('nodePropertiesForm') as HTMLFormElement;

    const selectedId = this.callbacks.getSelectedNodeId();
    if (!selectedId) {
      noSelect.classList.remove('hidden');
      form.classList.add('hidden');
      if (resizerLeft) resizerLeft.style.display = 'block';
      return;
    }

    const graph = this.callbacks.getGraph();
    const node = graph.nodes.find((n) => n.id === selectedId);
    if (!node) {
      noSelect.classList.remove('hidden');
      form.classList.add('hidden');
      if (resizerLeft) resizerLeft.style.display = 'block';
      return;
    }

    if (sidebarRight) sidebarRight.classList.remove('collapsed');
    if (sidebarLeft) sidebarLeft.classList.add('collapsed');
    btnActivityBlocks?.classList.remove('active');
    btnActivityInspector?.classList.add('active');
    if (resizerLeft) resizerLeft.style.display = 'block';

    noSelect.classList.add('hidden');
    form.classList.remove('hidden');
    this.populatePropertiesForm(form, node);

    // Se o modal expandido estiver aberto, sincroniza seu formulário também
    const modalForm = document.getElementById('expandedNodeModalForm') as HTMLFormElement;
    if (modalForm) {
      this.populatePropertiesForm(modalForm, node);
    }

    if (this.pendingScrollSelector) {
      const sel = this.pendingScrollSelector;
      this.pendingScrollSelector = undefined;
      this.scrollTargetIntoInspectorView(sel);
    }
  }

  /**
   * Preenche o formulário de propriedades para um nó específico
   */
  public populatePropertiesForm(form: HTMLElement, node: AnyAutomationNode): void {
    form.innerHTML = '';

    const typeBadge = document.createElement('div');
    typeBadge.style.cssText = 'font-size: 11px; color: #818cf8; margin-bottom: 4px; font-weight: 700; text-transform: uppercase;';
    typeBadge.textContent = `Bloco: ${node.type}`;
    form.appendChild(typeBadge);

    this.addTextInput(form, 'Título do Bloco', node.data.label || '', (val) => {
      node.data.label = val;
      const renderedHeader = document.querySelector(`#rendered_${node.id} .graph-node-title-text`);
      if (renderedHeader) renderedHeader.textContent = val || node.type;
      this.callbacks.onNodeDataChanged();
      // Sincroniza título em outros formulários caso o modal esteja aberto
      const modalTitle = document.getElementById('expandedModalNodeTitle');
      if (modalTitle) modalTitle.textContent = val || node.type;
    });

    this.addTextareaInput(form, 'Descrição / Objetivo', node.data.description || '', (val) => {
      node.data.description = val;
      const renderedDesc = document.querySelector(`#rendered_${node.id} .graph-node-desc-preview`);
      if (renderedDesc) {
        renderedDesc.textContent = val || '';
        (renderedDesc as HTMLElement).style.display = val ? 'block' : 'none';
      }
      this.callbacks.onNodeDataChanged();
    });

    const data = node.data as any;

    switch (node.type) {
      case 'start':
        StartPropertiesRenderer.renderStartBlock(form, data, {
          renderInspector: (sel) => this.renderInspector(sel),
          expandedTriggerIndices: this.expandedTriggerIndices,
          colorPicker: this.colorPicker,
          onNodeDataChanged: this.callbacks.onNodeDataChanged,
          showToast: this.callbacks.showToast,
        });
        break;
      case 'delay':
        FlowPropertiesRenderer.renderDelay(form, data, {
          renderInspector: (sel) => this.renderInspector(sel),
          expandedCaseIndices: this.expandedCaseIndices,
          onNodeDataChanged: this.callbacks.onNodeDataChanged,
          showToast: this.callbacks.showToast,
        });
        break;
      case 'switch':
        FlowPropertiesRenderer.renderSwitch(form, data, {
          renderInspector: (sel) => this.renderInspector(sel),
          expandedCaseIndices: this.expandedCaseIndices,
          onNodeDataChanged: this.callbacks.onNodeDataChanged,
          showToast: this.callbacks.showToast,
        });
        break;
      case 'while_loop':
        FlowPropertiesRenderer.renderWhile(form, data, {
          renderInspector: (sel) => this.renderInspector(sel),
          expandedCaseIndices: this.expandedCaseIndices,
          onNodeDataChanged: this.callbacks.onNodeDataChanged,
          showToast: this.callbacks.showToast,
        });
        break;
      case 'for_loop':
        FlowPropertiesRenderer.renderFor(form, data, {
          renderInspector: (sel) => this.renderInspector(sel),
          expandedCaseIndices: this.expandedCaseIndices,
          onNodeDataChanged: this.callbacks.onNodeDataChanged,
          showToast: this.callbacks.showToast,
        });
        break;
      case 'if_element_exists':
        FlowPropertiesRenderer.renderIfElement(form, data);
        break;
      case 'try_catch':
        this.addTextInput(form, 'Salvar Erro na Variável', data.errorVarName || 'lastError', (val) => data.errorVarName = val);
        break;
      case 'group':
        this.colorPicker.createPaintColorPicker(form, 'Cor de Destaque', data.color || '#6366f1', (val) => {
          data.color = val;
          this.callbacks.onRenderGraph();
        });
        this.addTextareaInput(form, 'Descrição do Grupo', data.description || '', (val) => data.description = val);
        break;
      case 'navigate':
        this.addTextInput(form, 'URL de Destino', data.url || 'https://', (val) => data.url = val);
        this.addSelectInput(form, 'Aguardar Carregamento', data.waitUntil || 'load', [
          { value: 'domcontentloaded', label: 'DOM Pronto (domcontentloaded)' },
          { value: 'load', label: 'Carregamento Completo (load)' },
          { value: 'networkidle', label: 'Rede Ociosa (networkidle)' },
          { value: 'none', label: 'Imediato (none)' },
        ], (val) => data.waitUntil = val);
        this.addNumberInput(form, 'Tempo Limite / Timeout (ms)', data.timeoutMs ?? 30000, (val) => data.timeoutMs = val);
        break;
      case 'tab_action':
        DomPropertiesRenderer.renderTabAction(form, data, {
          renderInspector: () => this.renderInspector(),
        });
        break;
      case 'history_navigation':
        this.addSelectInput(form, 'Ação de Navegação', data.action || 'reload', [
          { value: 'reload', label: 'Recarregar Página' },
          { value: 'back', label: 'Voltar Página' },
          { value: 'forward', label: 'Avançar Página' },
        ], (val) => { data.action = val; this.renderInspector(); });
        if (data.action === 'reload') {
          this.addCheckboxInput(form, 'Ignorar Cache do Navegador', !!data.ignoreCache, (val) => data.ignoreCache = val);
        }
        break;
      case 'click_element':
        DomPropertiesRenderer.renderClick(form, data);
        break;
      case 'type_input':
        DomPropertiesRenderer.renderTypeInput(form, data, {
          renderInspector: () => this.renderInspector(),
        });
        break;
      case 'press_key':
        this.addTextInput(form, 'Tecla (ex: Enter, Escape, Tab, ArrowDown)', data.key || 'Enter', (val) => data.key = val);
        InspectorInputHelpers.addSelectorInput(form, 'Seletor Alvo (Opcional)', data.selector || '', (val) => data.selector = val);
        this.addSelectInput(form, 'Tipo de Seletor', data.selectorType || 'css', [
          { value: 'css', label: 'Seletor CSS' },
          { value: 'xpath', label: 'XPath' },
        ], (val) => data.selectorType = val);
        break;
      case 'hover_focus':
        InspectorInputHelpers.addSelectorInput(form, 'Seletor do Elemento', data.selector || '', (val) => data.selector = val);
        this.addSelectInput(form, 'Tipo de Seletor', data.selectorType || 'css', [
          { value: 'css', label: 'Seletor CSS' },
          { value: 'xpath', label: 'XPath' },
        ], (val) => data.selectorType = val);
        this.addSelectInput(form, 'Ação', data.action || 'hover', [
          { value: 'hover', label: 'Passar Mouse (Hover)' },
          { value: 'focus', label: 'Focar no Elemento (Focus)' },
        ], (val) => data.action = val);
        this.addNumberInput(form, 'Tempo Limite (ms)', data.timeoutMs ?? 5000, (val) => data.timeoutMs = val);
        break;
      case 'scroll':
        DomPropertiesRenderer.renderScroll(form, data, {
          renderInspector: () => this.renderInspector(),
        });
        break;
      case 'wait_for_element':
        InspectorInputHelpers.addSelectorInput(form, 'Seletor do Elemento', data.selector || '', (val) => data.selector = val);
        this.addSelectInput(form, 'Tipo de Seletor', data.selectorType || 'css', [
          { value: 'css', label: 'Seletor CSS' },
          { value: 'xpath', label: 'XPath' },
        ], (val) => data.selectorType = val);
        this.addSelectInput(form, 'Estado Esperado', data.state || 'visible', [
          { value: 'visible', label: 'Visível na Tela' },
          { value: 'clickable', label: 'Clicável e Habilitado' },
          { value: 'hidden', label: 'Oculto ou Desaparecido' },
          { value: 'attached', label: 'Presente no Código DOM' },
        ], (val) => data.state = val);
        this.addNumberInput(form, 'Tempo Limite (ms)', data.timeoutMs ?? 10000, (val) => data.timeoutMs = val);
        break;
      case 'http_request':
        DataPropertiesRenderer.renderHttpRequest(form, data, {
          renderInspector: () => this.renderInspector(),
        });
        break;
      case 'set_variable':
        this.addTextInput(form, 'Nome da Variável', data.varName || 'meuDado', (val) => data.varName = val);
        this.addSelectInput(form, 'Tipo de Avaliação', data.evaluationType || 'literal', [
          { value: 'literal', label: 'Valor Fixo Literal' },
          { value: 'template', label: 'Template com Interpolação {{var}}' },
          { value: 'js_eval', label: 'Expressão JavaScript Dinâmica' },
        ], (val) => { data.evaluationType = val; this.renderInspector(); });
        if (data.evaluationType === 'js_eval') {
          this.addCodeEditorInput(form, 'Código / Expressão JavaScript', 'javascript', data.valueExpression ?? '', (val) => data.valueExpression = val, '180px');
        } else {
          this.addTextareaInput(form, 'Valor ou Expressão', data.valueExpression ?? '', (val) => data.valueExpression = val);
        }
        break;
      case 'extract_data':
        DataPropertiesRenderer.renderExtractData(form, data, {
          renderInspector: () => this.renderInspector(),
        });
        break;
      case 'scrape_list':
        DataPropertiesRenderer.renderScrapeList(form, data, {
          renderInspector: () => this.renderInspector(),
        });
        break;
      case 'export_file':
        this.addTextInput(form, 'Variável Fonte dos Dados', data.sourceVar || 'items', (val) => data.sourceVar = val);
        this.addSelectInput(form, 'Formato do Arquivo', data.format || 'json', [
          { value: 'json', label: 'JSON (.json)' },
          { value: 'csv', label: 'CSV (.csv)' },
        ], (val) => { data.format = val; this.renderInspector(); });
        this.addTextInput(form, 'Nome do Arquivo para Salvar', data.filename || 'dados.json', (val) => data.filename = val);
        if (data.format === 'csv') {
          this.addTextInput(form, 'Delimitador CSV', data.csvDelimiter || ',', (val) => data.csvDelimiter = val);
        }
        break;
      case 'inject_javascript':
        this.addSelectInput(form, 'Ambiente de Execução', data.context || 'content_script', [
          { value: 'content_script', label: 'Na Página Aberta (Content Script)' },
          { value: 'background', label: 'No Background da Extensão' },
        ], (val) => data.context = val);
        this.addCodeEditorInput(form, 'Código JavaScript', 'javascript', data.code || 'console.log("Olá");', (val) => data.code = val, '220px');
        this.addTextInput(form, 'Salvar Resultado na Variável (opcional)', data.saveResultToVar || '', (val) => data.saveResultToVar = val);
        break;
      case 'inject_html':
        InspectorInputHelpers.addSelectorInput(form, 'Seletor do Elemento Alvo', data.targetSelector || 'body', (val) => data.targetSelector = val);
        this.addSelectInput(form, 'Tipo de Seletor', data.selectorType || 'css', [
          { value: 'css', label: 'Seletor CSS' },
          { value: 'xpath', label: 'XPath' },
        ], (val) => data.selectorType = val);
        this.addSelectInput(form, 'Posição da Injeção', data.position || 'beforeend', [
          { value: 'beforeend', label: 'No Final do Elemento (beforeend)' },
          { value: 'afterbegin', label: 'No Início do Elemento (afterbegin)' },
          { value: 'beforebegin', label: 'Antes do Elemento (beforebegin)' },
          { value: 'afterend', label: 'Depois do Elemento (afterend)' },
        ], (val) => data.position = val);
        this.addCodeEditorInput(form, 'Conteúdo HTML', 'html', data.html || '', (val) => data.html = val, '200px');
        break;
      case 'inject_css':
        this.addSelectInput(form, 'Alvo do CSS', data.target || 'page', [
          { value: 'page', label: 'Página Inteira' },
          { value: 'injected_component', label: 'Componente Injetado' },
        ], (val) => data.target = val);
        this.addTextInput(form, 'ID da Tag Style (opcional)', data.styleId || 'custom-style', (val) => data.styleId = val);
        this.addCodeEditorInput(form, 'Código CSS', 'css', data.css || '', (val) => data.css = val, '200px');
        break;
      case 'web_component':
        this.addTextInput(form, 'ID do Container HTML', data.containerId || 'custom-widget', (val) => data.containerId = val);
        this.addSelectInput(form, 'Modo de Isolamento', data.mode || 'shadow_dom', [
          { value: 'shadow_dom', label: 'Shadow DOM Isolado' },
          { value: 'inline', label: 'Inline no DOM' },
        ], (val) => data.mode = val);
        this.addCodeEditorInput(form, 'Código HTML', 'html', data.html || '', (val) => data.html = val, '180px');
        this.addCodeEditorInput(form, 'Código CSS', 'css', data.css || '', (val) => data.css = val, '180px');
        this.addCodeEditorInput(form, 'Código JavaScript', 'javascript', data.js || '', (val) => data.js = val, '180px');
        break;
      case 'note':
        this.addTextareaInput(form, 'Conteúdo da Anotação', data.content || '', (val) => data.content = val);
        break;
    }
  }

  /**
   * Abre o modal centralizado e grande com as configurações do bloco
   */
  public openExpandedModal(nodeId?: string): void {
    const targetNodeId = nodeId || this.callbacks.getSelectedNodeId();
    if (!targetNodeId) {
      this.callbacks.showToast('Nenhum bloco selecionado para expandir.', 'warning');
      return;
    }

    const graph = this.callbacks.getGraph();
    const node = graph.nodes.find((n) => n.id === targetNodeId);
    if (!node) return;

    this.closeExpandedModal();

    const backdrop = document.createElement('div');
    backdrop.id = 'expandedNodeModalBackdrop';
    backdrop.className = 'flow-modal-backdrop';

    backdrop.innerHTML = `
      <div class="node-expand-modal-card">
        <div class="node-expand-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(59, 130, 246, 0.15); display: flex; align-items: center; justify-content: center; color: #60a5fa;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h3 id="expandedModalNodeTitle" style="font-size: 15px; font-weight: 700; color: #f8fafc; margin: 0;">${node.data.label || node.type}</h3>
                <span style="font-size: 10px; background: #1e293b; color: #818cf8; padding: 2px 6px; border-radius: 4px; font-weight: 600; text-transform: uppercase;">${node.type}</span>
              </div>
              <p style="font-size: 11px; color: #94a3b8; margin: 2px 0 0 0;">Configurações expandidas do bloco selecionado</p>
            </div>
          </div>
          <button id="btnCloseExpandedModal" class="sidebar-toggle-btn" title="Fechar visualização expandida (Esc)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="node-expand-body">
          <form id="expandedNodeModalForm" class="node-form">
            <!-- Campos gerados dinamicamente -->
          </form>
        </div>
        <!-- Botões de Ação do Rodapé -->
        <div class="node-expand-footer" style="display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 20px; border-top: 1px solid #1e293b; background: #0b1120;">
          <button type="button" id="btnDiscardExpandedModal" class="btn btn-secondary" style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; font-size: 13px; color: #f87171; border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.08); cursor: pointer; border-radius: 6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            <span>Descartar Alterações</span>
          </button>
          <div style="display: flex; gap: 10px;">
            <button type="button" id="btnDoneExpandedModal" class="btn btn-primary" style="display: flex; align-items: center; gap: 6px; padding: 8px 22px; font-size: 13px; background: #6366f1; border-color: #6366f1; cursor: pointer; border-radius: 6px; font-weight: 600;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Concluir e Aplicar</span>
            </button>
          </div>
        </div>
      </div>
    `;

      // Backup dos dados originais para possibilidade de descarte
      const backupNodeData = JSON.parse(JSON.stringify(node.data || {}));
      let changesCommitted = false;

      const formEl = backdrop.querySelector('#expandedNodeModalForm') as HTMLElement;
      this.populatePropertiesForm(formEl, node);

      // Função de descarte: restaura o estado original do nó e atualiza tudo imediatamente
      const discardChanges = () => {
        node.data = JSON.parse(JSON.stringify(backupNodeData));
        this.closeExpandedModal();
        this.renderInspector();
        this.callbacks.onNodeDataChanged();
        this.callbacks.showToast('Alterações no bloco foram descartadas.', 'info');
      };

      // Função de conclusão: confirma as alterações e sincroniza a barra lateral imediatamente
      const commitChanges = () => {
        changesCommitted = true;
        this.closeExpandedModal();
        this.renderInspector();
        this.callbacks.onNodeDataChanged();
        this.callbacks.showToast('Alterações no bloco aplicadas com sucesso!', 'success');
      };

      backdrop.querySelector('#btnDiscardExpandedModal')?.addEventListener('click', discardChanges);
      backdrop.querySelector('#btnDoneExpandedModal')?.addEventListener('click', commitChanges);

      // Fechar pelo botão X ou tecla Escape descarta as alterações; aplicar alterações acontece APENAS via 'Concluir e Aplicar'
      const handleCloseDialog = () => {
        if (!changesCommitted) {
          discardChanges();
        }
      };

      backdrop.querySelector('#btnCloseExpandedModal')?.addEventListener('click', handleCloseDialog);

      // Clicar fora do editor (backdrop) não faz NADA por especificação do usuário:
      // apenas botões configurados devem fechar ou aplicar/descartar alterações
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          e.stopPropagation();
          // Não fecha nem aplica alterações ao clicar fora
        }
      });

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCloseDialog();
          window.removeEventListener('keydown', onKeyDown);
        }
      };
      window.addEventListener('keydown', onKeyDown);

      document.body.appendChild(backdrop);
    }

    /**
     * Fecha o modal expandido se estiver aberto
     */
    public closeExpandedModal(): void {
      const existing = document.getElementById('expandedNodeModalBackdrop');
      existing?.remove();
    }

  // Helpers de criação de inputs
  private addTextInput(container: HTMLElement, labelText: string, value: string, onChange: (val: string) => void): void {
    const group = document.createElement('div');
    group.className = 'form-group';
    group.innerHTML = `<label>${labelText}</label><input type="text" value="${value ?? ''}" />`;
    group.querySelector('input')?.addEventListener('input', (e: any) => onChange(e.target.value));
    container.appendChild(group);
  }

  private addNumberInput(container: HTMLElement, labelText: string, value: number, onChange: (val: number) => void): void {
    const group = document.createElement('div');
    group.className = 'form-group';
    group.innerHTML = `<label>${labelText}</label><input type="number" value="${value ?? 0}" />`;
    group.querySelector('input')?.addEventListener('input', (e: any) => onChange(Number(e.target.value)));
    container.appendChild(group);
  }

  private addSelectInput(
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
    group.querySelector('select')?.addEventListener('change', (e: any) => onChange(e.target.value));
    container.appendChild(group);
  }

  private addCheckboxInput(container: HTMLElement, labelText: string, checked: boolean, onChange: (val: boolean) => void): void {
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

  private addTextareaInput(container: HTMLElement, labelText: string, value: string, onChange: (val: string) => void): void {
    const group = document.createElement('div');
    group.className = 'form-group';
    group.innerHTML = `<label>${labelText}</label><textarea rows="4" style="min-height: 84px; line-height: 1.4; resize: vertical;">${value ?? ''}</textarea>`;
    group.querySelector('textarea')?.addEventListener('input', (e: any) => onChange(e.target.value));
    container.appendChild(group);
  }

  private addCodeEditorInput(
    container: HTMLElement,
    labelText: string,
    language: CodeLanguage,
    value: string,
    onChange: (val: string) => void,
    height = '200px'
  ): void {
    InspectorInputHelpers.addCodeEditorInput(
      container,
      labelText,
      language,
      value,
      onChange,
      this.callbacks.onNodeDataChanged,
      this.callbacks.showToast,
      height
    );
  }

  /**
   * Garante que o elemento recém expandido na barra lateral direita fique visível rolando a barra
   */
  public scrollTargetIntoInspectorView(elementOrSelector: HTMLElement | string): void {
    requestAnimationFrame(() => {
      const container = document.getElementById('tabProperties');
      if (!container) return;

      const el = typeof elementOrSelector === 'string'
        ? container.querySelector(elementOrSelector) as HTMLElement
        : elementOrSelector;

      if (!el) return;

      // Usar scrollIntoView suave com ajuste de bloco
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Verificação de segurança para garantir que a base do elemento expandido fique visível
      setTimeout(() => {
        const cRect = container.getBoundingClientRect();
        const eRect = el.getBoundingClientRect();

        if (eRect.bottom > cRect.bottom) {
          const delta = eRect.bottom - cRect.bottom + 16;
          container.scrollBy({ top: delta, behavior: 'smooth' });
        } else if (eRect.top < cRect.top) {
          const delta = eRect.top - cRect.top - 16;
          container.scrollBy({ top: delta, behavior: 'smooth' });
        }
      }, 50);
    });
  }
}
