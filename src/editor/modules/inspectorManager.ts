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
import { N8NDataExplorer } from './n8nDataExplorer';

export interface InspectorCallbacks {
  getGraph: () => WebAutomationGraph;
  getSelectedNodeId: () => string | undefined;
  getSelectedNodeIds?: () => string[];
  onNodeDataChanged: () => void;
  onRenderGraph: () => void;
  showToast: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  onClearSelection?: () => void;
  onDeleteSelected?: () => void;
}

export class InspectorManager {
  private expandedTriggerIndices: Set<number> = new Set([0]);
  private expandedCaseIndices: Set<number> = new Set([0]);
  private pendingScrollSelector?: string;
  private disableSidebarEditing: boolean = false;
  private runtimeNodeOutputs: Record<string, any> = {};
  private isGhostMode: boolean = false;
  private ghostRunItem?: any;

  public setGhostMode(enabled: boolean, runItem?: any): void {
    this.isGhostMode = enabled;
    this.ghostRunItem = runItem;
    this.renderInspector();
  }

  public setDisableSidebarEditing(disabled: boolean): void {
    this.disableSidebarEditing = disabled;
    this.renderInspector();
  }

  public setRuntimeNodeOutputs(outputs: Record<string, any>): void {
    this.runtimeNodeOutputs = outputs || {};
  }

  public updateRuntimeNodeOutput(nodeId: string, output: any): void {
    this.runtimeNodeOutputs[nodeId] = output;
  }

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

    const selectedIds = this.callbacks.getSelectedNodeIds ? this.callbacks.getSelectedNodeIds() : [];
    const selectedId = this.callbacks.getSelectedNodeId();

    if (selectedIds.length > 1) {
      if (sidebarRight) sidebarRight.classList.remove('collapsed');
      if (sidebarLeft) sidebarLeft.classList.add('collapsed');
      btnActivityBlocks?.classList.remove('active');
      btnActivityInspector?.classList.add('active');
      if (resizerLeft) resizerLeft.style.display = 'block';

      noSelect.classList.add('hidden');
      form.classList.remove('hidden');
      this.renderMultiSelectionInspector(form, selectedIds);
      return;
    }

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

    if (this.isGhostMode) {
      this.renderGhostInspector(node, form);
      return;
    }

    if (this.disableSidebarEditing) {
      form.innerHTML = `
        <div style="background: #090e18; border: 1px solid #1e293b; border-left: 3px solid #6366f1; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(99, 102, 241, 0.15); display: flex; align-items: center; justify-content: center; color: #818cf8; font-size: 16px;">
              🔒
            </div>
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #f8fafc;">${node.data.label || node.type}</div>
              <span style="font-size: 10px; background: #1e293b; color: #818cf8; padding: 2px 6px; border-radius: 4px; font-weight: 600; text-transform: uppercase;">${node.type}</span>
            </div>
          </div>
          
          <div style="background: #0b0f19; border: 1px solid #1a2333; border-radius: 6px; padding: 10px; font-size: 11px; color: #94a3b8; line-height: 1.4;">
            <strong style="color: #cbd5e1; display: block; margin-bottom: 2px;">Edição na Barra Lateral Desativada</strong>
            Conforme definido nas Configurações, a edição deste bloco deve ser realizada no Modo Expandido.
          </div>

          <button type="button" id="btnSidebarOpenExpanded" class="btn btn-primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 14px; font-size: 12px; font-weight: 600; background: #6366f1; border-color: #6366f1; cursor: pointer; border-radius: 6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
            <span>Editar no Modo Expandido</span>
          </button>
          
          <div style="font-size: 10px; color: #64748b; text-align: center;">
            Dica: você também pode dar duplo clique no bloco no canvas.
          </div>
        </div>
      `;
      form.querySelector('#btnSidebarOpenExpanded')?.addEventListener('click', () => {
        this.openExpandedModal(node.id);
      });
      return;
    }

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
        this.addCheckboxInput(form, '🔒 Impedir alterações futuras nesta variável (Constante / Somente Leitura)', !!data.readonly, (val) => {
          data.readonly = val;
        });
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
        {
          const noticeGroup = document.createElement('div');
          noticeGroup.style.cssText = 'background: rgba(99, 102, 241, 0.08); border: 1px dashed rgba(99, 102, 241, 0.3); border-radius: 6px; padding: 8px 10px; margin-top: 6px; font-size: 11px; color: #94a3b8; line-height: 1.4;';
          noticeGroup.innerHTML = '🔒 <strong>Execução Isolada:</strong> O código é injetado e executado sem comunicação direta com o fluxo. Ferramentas de comunicação da extensão serão integradas posteriormente.';
          form.appendChild(noticeGroup);
        }
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
              <p style="font-size: 11px; color: #94a3b8; margin: 2px 0 0 0;">Configurações expandidas e fluxo de dados estilo N8N</p>
            </div>
          </div>
          <button id="btnCloseExpandedModal" class="sidebar-toggle-btn" title="Fechar visualização expandida (Esc)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="node-expand-body">
          <!-- Painel Esquerdo: Explorador N8N de Dados Anteriores e Variáveis -->
          <div id="expandedModalLeftPane" class="node-expand-explorer-pane">
            <!-- N8NDataExplorer renderizado aqui -->
          </div>

          <!-- Painel Direito: Configurações do Bloco e Saída -->
          <div id="expandedModalRightPane" class="node-expand-form-pane">
            <!-- Abas do painel direito -->
            <div style="display: flex; gap: 6px; padding: 10px 20px 0 20px; border-bottom: 1px solid #1e293b; background: #0c121e;">
              <button type="button" id="btnTabExpandedConfig" style="padding: 7px 16px; border: none; border-bottom: 2px solid #3b82f6; background: transparent; color: #60a5fa; font-weight: 700; font-size: 12px; cursor: pointer;">
                Configurações do Bloco
              </button>
              <button type="button" id="btnTabExpandedOutput" style="padding: 7px 16px; border: none; border-bottom: 2px solid transparent; background: transparent; color: #94a3b8; font-weight: 600; font-size: 12px; cursor: pointer;">
                Dados de Saída ($output)
              </button>
            </div>

            <!-- Tab Content 1: Formulário de Configuração -->
            <div id="expandedTabContentConfig" style="padding: 20px; flex: 1; overflow-y: auto;">
              <form id="expandedNodeModalForm" class="node-form">
                <!-- Campos gerados dinamicamente -->
              </form>
            </div>

            <!-- Tab Content 2: Dados de Saída do Bloco -->
            <div id="expandedTabContentOutput" style="padding: 20px; flex: 1; overflow-y: auto; display: none;">
              <!-- Container de Saída -->
            </div>
          </div>
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

    // Rastreia foco em inputs do formulário para permitir inserção de tags via 1 clique
    let lastFocusedInput: HTMLInputElement | HTMLTextAreaElement | null = null;
    formEl.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        lastFocusedInput = target as any;
      }
    });

    const insertIntoInput = (inputEl: HTMLInputElement | HTMLTextAreaElement, expr: string) => {
      const start = inputEl.selectionStart ?? inputEl.value.length;
      const end = inputEl.selectionEnd ?? inputEl.value.length;
      const val = inputEl.value;
      inputEl.value = val.slice(0, start) + expr + val.slice(end);
      inputEl.selectionStart = inputEl.selectionEnd = start + expr.length;
      inputEl.focus();
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      inputEl.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const handleInsertExpression = (expr: string) => {
      if (lastFocusedInput && document.body.contains(lastFocusedInput)) {
        insertIntoInput(lastFocusedInput, expr);
      } else {
        navigator.clipboard.writeText(expr);
        this.callbacks.showToast(`Copiado para a área de transferência: ${expr}`, 'success');
      }
    };

    // Suporte a Drag & Drop de variáveis e dados de blocos anteriores diretamente nos inputs
    formEl.addEventListener('dragover', (e) => {
      const target = (e.target as HTMLElement)?.closest('input, textarea') as HTMLInputElement | HTMLTextAreaElement | null;
      if (target) {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        target.classList.add('drag-over-input');
      } else if (lastFocusedInput && document.body.contains(lastFocusedInput)) {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
      }
    });

    formEl.addEventListener('dragleave', (e) => {
      const target = (e.target as HTMLElement)?.closest('input, textarea') as HTMLElement | null;
      if (target) {
        target.classList.remove('drag-over-input');
      }
    });

    formEl.addEventListener('drop', (e) => {
      const expr = e.dataTransfer?.getData('application/x-n8n-tag') || e.dataTransfer?.getData('text/plain');
      const target = (e.target as HTMLElement)?.closest('input, textarea') as HTMLInputElement | HTMLTextAreaElement | null;
      if (target) {
        target.classList.remove('drag-over-input');
      }
      if (expr) {
        e.preventDefault();
        if (target) {
          insertIntoInput(target, expr);
          this.callbacks.showToast(`Inserido no campo: ${expr}`, 'success');
        } else if (lastFocusedInput && document.body.contains(lastFocusedInput)) {
          insertIntoInput(lastFocusedInput, expr);
          this.callbacks.showToast(`Inserido no campo: ${expr}`, 'success');
        } else {
          navigator.clipboard.writeText(expr);
          this.callbacks.showToast(`Copiado para a área de transferência: ${expr}`, 'success');
        }
      }
    });

    // Renderiza Explorador N8N de dados anteriores e variáveis
    const explorerContainer = backdrop.querySelector('#expandedModalLeftPane') as HTMLElement;
    if (explorerContainer) {
      N8NDataExplorer.render(explorerContainer, {
        graph,
        currentNode: node,
        runtimeNodeOutputs: this.runtimeNodeOutputs,
        onInsertExpression: handleInsertExpression,
        onShowToast: (msg, type) => this.callbacks.showToast(msg, type),
      });
    }

    // Abas do painel direito: Configurações vs Saída do Bloco
    const outputTabContainer = backdrop.querySelector('#expandedTabContentOutput') as HTMLElement;
    const configTabContainer = backdrop.querySelector('#expandedTabContentConfig') as HTMLElement;
    const btnTabConfig = backdrop.querySelector('#btnTabExpandedConfig') as HTMLButtonElement;
    const btnTabOutput = backdrop.querySelector('#btnTabExpandedOutput') as HTMLButtonElement;

    btnTabConfig?.addEventListener('click', () => {
      configTabContainer.style.display = 'block';
      outputTabContainer.style.display = 'none';
      btnTabConfig.style.borderBottomColor = '#3b82f6';
      btnTabConfig.style.color = '#60a5fa';
      btnTabOutput.style.borderBottomColor = 'transparent';
      btnTabOutput.style.color = '#94a3b8';
    });

    btnTabOutput?.addEventListener('click', () => {
      configTabContainer.style.display = 'none';
      outputTabContainer.style.display = 'block';
      btnTabOutput.style.borderBottomColor = '#3b82f6';
      btnTabOutput.style.color = '#60a5fa';
      btnTabConfig.style.borderBottomColor = 'transparent';
      btnTabConfig.style.color = '#94a3b8';
      this.renderNodeOutputPanel(outputTabContainer, node);
    });

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

  /**
   * Atualiza o explorador de dados do lado esquerdo do modal expandido
   */
  private refreshExpandedExplorer(node: AnyAutomationNode): void {
    const explorerContainer = document.getElementById('expandedModalLeftPane');
    if (explorerContainer) {
      N8NDataExplorer.render(explorerContainer, {
        graph: this.callbacks.getGraph(),
        currentNode: node,
        runtimeNodeOutputs: this.runtimeNodeOutputs,
        onInsertExpression: (expr) => {
          const focused = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
          if (
            focused &&
            (focused.tagName === 'INPUT' || focused.tagName === 'TEXTAREA') &&
            document.getElementById('expandedNodeModalForm')?.contains(focused)
          ) {
            const start = focused.selectionStart ?? focused.value.length;
            const end = focused.selectionEnd ?? focused.value.length;
            const val = focused.value;
            focused.value = val.slice(0, start) + expr + val.slice(end);
            focused.selectionStart = focused.selectionEnd = start + expr.length;
            focused.dispatchEvent(new Event('input', { bubbles: true }));
            focused.dispatchEvent(new Event('change', { bubbles: true }));
          } else {
            navigator.clipboard.writeText(expr);
            this.callbacks.showToast(`Copiado: ${expr}`, 'success');
          }
        },
        onShowToast: (m, t) => this.callbacks.showToast(m, t),
      });
    }
  }

  /**
   * Renderiza o painel com os dados de saída do bloco e permite definir dados de teste (Mock como opção, não regra)
   */
  private renderNodeOutputPanel(container: HTMLElement, node: AnyAutomationNode): void {
    container.innerHTML = '';
    const nodeLabel = node.data?.label || node.type;
    const outputResult = N8NDataExplorer.getNodeOutputResult(node, this.runtimeNodeOutputs);
    const isMockEnabled = !!(node.data as any).useMockOutput;
    const hasRuntimeData = outputResult.source === 'runtime';

    const panel = document.createElement('div');
    panel.style.cssText = 'max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px;';

    // Status badge
    let badgeHtml = '';
    if (outputResult.source === 'runtime') {
      badgeHtml = `<span style="font-size: 10px; background: rgba(16, 185, 129, 0.15); color: #34d399; padding: 2px 8px; border-radius: 4px; font-weight: 600;">🟢 Execução Real</span>`;
    } else if (outputResult.source === 'mock') {
      badgeHtml = `<span style="font-size: 10px; background: rgba(245, 158, 11, 0.15); color: #fbbf24; padding: 2px 8px; border-radius: 4px; font-weight: 600;">🟡 Dados Simulados (Mock)</span>`;
    } else {
      badgeHtml = `<span style="font-size: 10px; background: rgba(148, 163, 184, 0.15); color: #94a3b8; padding: 2px 8px; border-radius: 4px; font-weight: 600;">⚪ Não Executado (Sem Dados)</span>`;
    }

    // JSON a exibir
    let currentDataToDisplay = outputResult.data;
    if (isMockEnabled && (node.data as any).outputData !== undefined) {
      currentDataToDisplay = (node.data as any).outputData;
    } else if (isMockEnabled && currentDataToDisplay === null) {
      currentDataToDisplay = N8NDataExplorer.generateDefaultMock(node);
    }
    const jsonStr = currentDataToDisplay ? JSON.stringify(currentDataToDisplay, null, 2) : '';

    panel.innerHTML = `
      <div style="background: #090e18; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 13px; font-weight: 700; color: #f8fafc;">Dados Produzidos por Este Bloco ($output)</span>
            ${badgeHtml}
          </div>
          <button type="button" id="btnCopyNodeExpr" class="btn btn-secondary" style="font-size: 11px; padding: 4px 10px;">
            📋 Copiar {{ $node["${nodeLabel}"].json }}
          </button>
        </div>

        <div style="font-size: 11px; color: #94a3b8; line-height: 1.4;">
          Estes dados representam a saída gerada por este bloco. Blocos subsequentes conectados a ele podem referenciá-lo usando:
          <code style="background: #1e293b; color: #60a5fa; padding: 2px 5px; border-radius: 4px; font-family: monospace;">{{ $node["${nodeLabel}"].json.campo }}</code>
          ou <code style="background: #1e293b; color: #34d399; padding: 2px 5px; border-radius: 4px; font-family: monospace;">{{ $json.campo }}</code> (no bloco imediatamente seguinte).
        </div>

        <!-- Opção de Mock (Agora OPCIONAL e não regra) -->
        <div style="background: #0d1527; border: 1px solid ${isMockEnabled ? '#3b82f6' : '#243049'}; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none;">
              <input type="checkbox" id="chkUseMockOutput" ${isMockEnabled ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px; accent-color: #3b82f6;" />
              <span style="font-size: 12px; font-weight: 600; color: #f1f5f9;">Habilitar dados simulados (Mock) para este bloco</span>
            </label>
            ${isMockEnabled ? `<button type="button" id="btnResetDefaultMock" class="btn btn-secondary" style="font-size: 10px; padding: 2px 8px;">Restaurar Amostra Padrão</button>` : ''}
          </div>
          <div style="font-size: 11px; color: #64748b; line-height: 1.4; margin-left: 26px;">
            Por padrão, o fluxo utiliza apenas resultados de execuções reais. Marque esta opção caso deseje simular dados de saída para testar expressões e variáveis antes de rodar a automação.
          </div>
        </div>

        ${isMockEnabled ? `
          <!-- Modo Edição de Mock -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <label style="font-size: 11px; font-weight: 600; color: #cbd5e1;">Editor de Dados Simulados (JSON):</label>
              <span style="font-size: 10px; color: #38bdf8;">Blocos seguintes enxergarão esta estrutura</span>
            </div>
            <textarea id="nodeOutputJsonArea" style="
              width: 100%; box-sizing: border-box; height: 200px; font-family: monospace; font-size: 12px; background: #080c14; color: #a5f3fc; border: 1px solid #243049; border-radius: 6px; padding: 10px; outline: none; line-height: 1.4; resize: vertical;
            ">${jsonStr}</textarea>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; color: #64748b;">Altere o JSON acima para simular diferentes cenários nos nós subsequentes.</span>
            <button type="button" id="btnSaveMockOutput" class="btn btn-primary" style="font-size: 11px; padding: 6px 14px;">
              💾 Salvar Dados Simulados
            </button>
          </div>
        ` : hasRuntimeData ? `
          <!-- Modo Visualização de Dados Reais -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <label style="font-size: 11px; font-weight: 600; color: #cbd5e1;">Saída Real da Última Execução (Somente Leitura):</label>
              <span style="font-size: 10px; color: #34d399;">Gerado durante execução real</span>
            </div>
            <pre style="
              width: 100%; box-sizing: border-box; max-height: 220px; overflow-y: auto; font-family: monospace; font-size: 12px; background: #080c14; color: #86efac; border: 1px solid #166534; border-radius: 6px; padding: 12px; line-height: 1.4; margin: 0;
            ">${jsonStr}</pre>
          </div>
        ` : `
          <!-- Modo Sem Dados e Sem Mock -->
          <div style="background: #080d1a; border: 1px dashed #334155; border-radius: 6px; padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <div style="font-size: 24px;">📊</div>
            <div style="font-size: 13px; font-weight: 600; color: #cbd5e1;">Nenhum dado real disponível no momento</div>
            <div style="font-size: 11px; color: #64748b; max-width: 440px; line-height: 1.4;">
              Execute o fluxo para coletar dados reais deste bloco ou marque a opção <strong>"Habilitar dados simulados (Mock)"</strong> acima para definir uma estrutura de teste.
            </div>
          </div>
        `}
      </div>
    `;

    panel.querySelector('#btnCopyNodeExpr')?.addEventListener('click', () => {
      const expr = `{{ $node["${nodeLabel}"].json }}`;
      navigator.clipboard.writeText(expr);
      this.callbacks.showToast(`Copiado: ${expr}`, 'success');
    });

    panel.querySelector('#chkUseMockOutput')?.addEventListener('change', (e: any) => {
      const checked = e.target.checked;
      (node.data as any).useMockOutput = checked;
      if (checked) {
        if (!(node.data as any).outputData) {
          (node.data as any).outputData = N8NDataExplorer.generateDefaultMock(node);
        }
        this.runtimeNodeOutputs[node.id] = (node.data as any).outputData;
        this.callbacks.showToast('Dados simulados (Mock) ativados para este bloco.', 'info');
      } else {
        if (this.runtimeNodeOutputs[node.id] === (node.data as any).outputData) {
          delete this.runtimeNodeOutputs[node.id];
        }
        this.callbacks.showToast('Dados simulados desativados. Usando apenas execuções reais.', 'info');
      }
      this.callbacks.onNodeDataChanged();
      this.renderNodeOutputPanel(container, node);
      this.refreshExpandedExplorer(node);
    });

    panel.querySelector('#btnResetDefaultMock')?.addEventListener('click', () => {
      const defMock = N8NDataExplorer.generateDefaultMock(node);
      (node.data as any).outputData = defMock;
      (node.data as any).useMockOutput = true;
      this.runtimeNodeOutputs[node.id] = defMock;
      this.callbacks.onNodeDataChanged();
      this.callbacks.showToast('Amostra de mock restaurada.', 'info');
      this.renderNodeOutputPanel(container, node);
      this.refreshExpandedExplorer(node);
    });

    panel.querySelector('#btnSaveMockOutput')?.addEventListener('click', () => {
      const area = panel.querySelector('#nodeOutputJsonArea') as HTMLTextAreaElement;
      try {
        const parsed = JSON.parse(area.value);
        (node.data as any).outputData = parsed;
        (node.data as any).useMockOutput = true;
        this.runtimeNodeOutputs[node.id] = parsed;
        this.callbacks.onNodeDataChanged();
        this.callbacks.showToast('Dados simulados salvos com sucesso!', 'success');
        this.renderNodeOutputPanel(container, node);
        this.refreshExpandedExplorer(node);
      } catch (e: any) {
        this.callbacks.showToast('JSON inválido nos dados simulados.', 'error');
      }
    });

    container.appendChild(panel);
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
    const selectedId = this.callbacks.getSelectedNodeId();
    const currentNode = selectedId ? this.callbacks.getGraph().nodes.find((n) => n.id === selectedId) : undefined;
    const explorerContext = {
      graph: this.callbacks.getGraph(),
      currentNode,
      runtimeNodeOutputs: this.runtimeNodeOutputs,
      onShowToast: this.callbacks.showToast,
    };
    InspectorInputHelpers.addCodeEditorInput(
      container,
      labelText,
      language,
      value,
      onChange,
      this.callbacks.onNodeDataChanged,
      this.callbacks.showToast,
      height,
      explorerContext
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

  /**
   * Renderiza o painel de propriedades quando múltiplos blocos estão selecionados
   */
  private renderMultiSelectionInspector(form: HTMLElement, selectedIds: string[]): void {
    form.innerHTML = '';
    const graph = this.callbacks.getGraph();
    const selectedNodes = graph.nodes.filter((n) => selectedIds.includes(n.id));

    const card = document.createElement('div');
    card.className = 'multi-selection-inspector-card';
    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #1e293b;">
        <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); display: flex; align-items: center; justify-content: center; color: #818cf8;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        </div>
        <div>
          <div style="font-size: 14px; font-weight: 700; color: #f8fafc;">Seleção Múltipla</div>
          <div style="font-size: 11px; color: #94a3b8;">${selectedNodes.length} blocos selecionados no canvas</div>
        </div>
      </div>
      <div style="font-size: 12px; color: #cbd5e1; margin-bottom: 8px; font-weight: 600;">Blocos Selecionados:</div>
      <div style="max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; padding-right: 4px;">
        ${selectedNodes.map((n) => `
          <div style="display: flex; align-items: center; justify-content: space-between; background: #090d16; border: 1px solid #1e293b; border-radius: 6px; padding: 6px 10px; font-size: 11px;">
            <span style="font-weight: 600; color: #f1f5f9; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${n.data?.label || n.type}</span>
            <span style="color: #64748b; font-family: monospace; font-size: 10px;">${n.type}</span>
          </div>
        `).join('')}
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button type="button" id="btnDeleteSelectedNodesInspector" class="btn btn-danger" style="width: 100%; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px; background: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.4); color: #f43f5e; border-radius: 6px; cursor: pointer;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          <span>Excluir ${selectedNodes.length} Blocos Selecionados</span>
        </button>
        <button type="button" id="btnClearSelectionInspector" class="btn btn-secondary" style="width: 100%; font-size: 12px; padding: 8px; background: #1e293b; border: 1px solid #334155; color: #cbd5e1; border-radius: 6px; cursor: pointer;">
          Desmarcar Todos
        </button>
      </div>
    `;
    form.appendChild(card);

    card.querySelector('#btnDeleteSelectedNodesInspector')?.addEventListener('click', () => {
      this.callbacks.onDeleteSelected?.();
    });
    card.querySelector('#btnClearSelectionInspector')?.addEventListener('click', () => {
      this.callbacks.onClearSelection?.();
    });
  }

  private renderGhostInspector(node: AnyAutomationNode, form: HTMLElement): void {
    const snap = this.ghostRunItem?.blockSnapshots?.[node.id];
    const status = snap?.status || 'skipped';
    const durationText = snap?.durationMs !== undefined ? `${snap.durationMs}ms` : 'Não registrado';
    const statusLabel =
      status === 'completed'
        ? '✓ Concluído com Sucesso'
        : status === 'failed'
        ? '✕ Falha / Erro'
        : '⚪ Não Executado';
    const statusColor =
      status === 'completed' ? '#10b981' : status === 'failed' ? '#ef4444' : '#64748b';

    const inputDataStr =
      snap?.inputData !== undefined && snap?.inputData !== null
        ? JSON.stringify(snap.inputData, null, 2)
        : '(Nenhum dado de entrada registrado para este bloco)';

    const outputDataStr =
      snap?.outputData !== undefined && snap?.outputData !== null
        ? JSON.stringify(snap.outputData, null, 2)
        : '(Nenhum dado de saída gerado por este bloco)';

    const configDataStr = JSON.stringify(snap?.config || node.data || {}, null, 2);

    form.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; animation: fadeIn 0.15s ease;">
        <!-- Header Fantasma -->
        <div style="background: #090d16; border: 1px solid #1e293b; border-left: 3px solid #818cf8; border-radius: 8px; padding: 12px 14px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 700; color: #818cf8; display: flex; align-items: center; gap: 4px;">
              👻 Modo Fantasma • Leitura
            </span>
            <span style="font-size: 10px; font-weight: 700; color: ${statusColor}; background: ${statusColor}18; border: 1px solid ${statusColor}44; padding: 2px 7px; border-radius: 4px;">
              ${statusLabel}
            </span>
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #f8fafc;">${node.data?.label || node.type}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
            Duração: <strong style="color: #f1f5f9;">${durationText}</strong> • Tipo: <span style="font-family: monospace;">${node.type}</span>
          </div>
        </div>

        ${
          snap?.error
            ? `
          <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: 8px; padding: 12px;">
            <div style="font-size: 11px; font-weight: 700; color: #fca5a5; display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              Mensagem de Erro da Execução
            </div>
            <div style="font-size: 11px; color: #fee2e2; font-family: monospace; white-space: pre-wrap; word-break: break-all;">${snap.error}</div>
          </div>
        `
            : ''
        }

        <!-- Entradas (Input Data) -->
        <div style="background: #111827; border: 1px solid #1f293d; border-radius: 8px; padding: 12px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 6px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              Entradas Recebidas (Inputs)
            </span>
          </div>
          <pre style="background: #090d16; border: 1px solid #1e293b; border-radius: 6px; padding: 8px; font-size: 10px; color: #cbd5e1; font-family: monospace; max-height: 140px; overflow: auto; margin: 0; white-space: pre-wrap;">${inputDataStr}</pre>
        </div>

        <!-- Saídas (Output Data) -->
        <div style="background: #111827; border: 1px solid #1f293d; border-radius: 8px; padding: 12px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 700; color: #34d399; display: flex; align-items: center; gap: 6px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
              Saídas Geradas (Outputs)
            </span>
          </div>
          <pre style="background: #090d16; border: 1px solid #1e293b; border-radius: 6px; padding: 8px; font-size: 10px; color: #cbd5e1; font-family: monospace; max-height: 160px; overflow: auto; margin: 0; white-space: pre-wrap;">${outputDataStr}</pre>
        </div>

        <!-- Configuração Histórica do Bloco (Read-Only) -->
        <div style="background: #111827; border: 1px solid #1f293d; border-radius: 8px; padding: 12px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 700; color: #f59e0b; display: flex; align-items: center; gap: 6px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Configuração do Bloco na Execução
            </span>
          </div>
          <pre style="background: #090d16; border: 1px solid #1e293b; border-radius: 6px; padding: 8px; font-size: 10px; color: #cbd5e1; font-family: monospace; max-height: 180px; overflow: auto; margin: 0; white-space: pre-wrap;">${configDataStr}</pre>
        </div>
      </div>
    `;
  }
}
