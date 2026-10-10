/**
 * Formulários e inspetor de propriedades de nós do fluxo
 */
import { AnyAutomationNode, WebAutomationGraph } from '../../../../BibliotecaDeDev/src/types/schema';
import { ColorPickerManager } from './colorPickerManager';

export interface InspectorCallbacks {
  getGraph: () => WebAutomationGraph;
  getSelectedNodeId: () => string | undefined;
  onNodeDataChanged: () => void;
  onRenderGraph: () => void;
  showToast: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

export class InspectorManager {
  private expandedTriggerIndices: Set<number> = new Set([0]);

  constructor(
    private callbacks: InspectorCallbacks,
    private colorPicker: ColorPickerManager
  ) {}

  public renderInspector(): void {
    const sidebarRight = document.getElementById('sidebarInspector');
    const resizerRight = document.getElementById('resizerRight');
    const noSelect = document.getElementById('noSelectionMessage')!;
    const form = document.getElementById('nodePropertiesForm') as HTMLFormElement;

    const selectedId = this.callbacks.getSelectedNodeId();
    if (!selectedId) {
      if (sidebarRight) sidebarRight.classList.add('collapsed');
      if (resizerRight) resizerRight.style.display = 'none';
      noSelect.classList.remove('hidden');
      form.classList.add('hidden');
      return;
    }

    const graph = this.callbacks.getGraph();
    const node = graph.nodes.find((n) => n.id === selectedId);
    if (!node) {
      if (sidebarRight) sidebarRight.classList.add('collapsed');
      if (resizerRight) resizerRight.style.display = 'none';
      return;
    }

    if (sidebarRight) sidebarRight.classList.remove('collapsed');
    if (resizerRight) resizerRight.style.display = 'block';

    noSelect.classList.add('hidden');
    form.classList.remove('hidden');
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
        this.renderStartBlockProperties(form, data);
        break;
      case 'delay':
        this.renderDelayProperties(form, data);
        break;
      case 'switch':
        this.renderSwitchProperties(form, data);
        break;
      case 'while_loop':
        this.renderWhileProperties(form, data);
        break;
      case 'for_loop':
        this.renderForProperties(form, data);
        break;
      case 'if_element_exists':
        this.renderIfElementProperties(form, data);
        break;
      case 'try_catch':
        this.addTextInput(form, 'Salvar Erro na Variável', data.errorVarName || 'lastError', (val) => data.errorVarName = val);
        break;
      case 'group':
        this.addTextInput(form, 'Cor de Destaque', data.color || '#6366f1', (val) => data.color = val);
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
        this.renderTabActionProperties(form, data);
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
        this.renderClickProperties(form, data);
        break;
      case 'type_input':
        this.renderTypeInputProperties(form, data);
        break;
      case 'press_key':
        this.addTextInput(form, 'Tecla (ex: Enter, Escape, Tab, ArrowDown)', data.key || 'Enter', (val) => data.key = val);
        this.addTextInput(form, 'Seletor Alvo (Opcional)', data.selector || '', (val) => data.selector = val);
        this.addSelectInput(form, 'Tipo de Seletor', data.selectorType || 'css', [
          { value: 'css', label: 'Seletor CSS' },
          { value: 'xpath', label: 'XPath' },
        ], (val) => data.selectorType = val);
        break;
      case 'hover_focus':
        this.addTextInput(form, 'Seletor do Elemento', data.selector || '', (val) => data.selector = val);
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
        this.renderScrollProperties(form, data);
        break;
      case 'wait_for_element':
        this.addTextInput(form, 'Seletor do Elemento', data.selector || '', (val) => data.selector = val);
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
        this.renderHttpRequestProperties(form, data);
        break;
      case 'set_variable':
        this.addTextInput(form, 'Nome da Variável', data.varName || 'meuDado', (val) => data.varName = val);
        this.addSelectInput(form, 'Tipo de Avaliação', data.evaluationType || 'literal', [
          { value: 'literal', label: 'Valor Fixo Literal' },
          { value: 'template', label: 'Template com Interpolação {{var}}' },
          { value: 'js_eval', label: 'Expressão JavaScript Dinâmica' },
        ], (val) => data.evaluationType = val);
        this.addTextareaInput(form, 'Valor ou Expressão', data.valueExpression ?? '', (val) => data.valueExpression = val);
        break;
      case 'extract_data':
        this.renderExtractDataProperties(form, data);
        break;
      case 'scrape_list':
        this.renderScrapeListProperties(form, data);
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
        this.addTextareaInput(form, 'Código JavaScript', data.code || 'console.log("Olá");', (val) => data.code = val);
        this.addTextInput(form, 'Salvar Resultado na Variável (opcional)', data.saveResultToVar || '', (val) => data.saveResultToVar = val);
        break;
      case 'inject_html':
        this.addTextInput(form, 'Seletor do Elemento Alvo', data.targetSelector || 'body', (val) => data.targetSelector = val);
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
        this.addTextareaInput(form, 'Conteúdo HTML', data.html || '', (val) => data.html = val);
        break;
      case 'inject_css':
        this.addSelectInput(form, 'Alvo do CSS', data.target || 'page', [
          { value: 'page', label: 'Página Inteira' },
          { value: 'injected_component', label: 'Componente Injetado' },
        ], (val) => data.target = val);
        this.addTextInput(form, 'ID da Tag Style (opcional)', data.styleId || 'custom-style', (val) => data.styleId = val);
        this.addTextareaInput(form, 'Código CSS', data.css || '', (val) => data.css = val);
        break;
      case 'web_component':
        this.addTextInput(form, 'ID do Container HTML', data.containerId || 'custom-widget', (val) => data.containerId = val);
        this.addSelectInput(form, 'Modo de Isolamento', data.mode || 'shadow_dom', [
          { value: 'shadow_dom', label: 'Shadow DOM Isolado' },
          { value: 'inline', label: 'Inline no DOM' },
        ], (val) => data.mode = val);
        this.addTextareaInput(form, 'Código HTML', data.html || '', (val) => data.html = val);
        this.addTextareaInput(form, 'Código CSS', data.css || '', (val) => data.css = val);
        this.addTextareaInput(form, 'Código JavaScript', data.js || '', (val) => data.js = val);
        break;
      case 'note':
        this.addTextareaInput(form, 'Conteúdo da Anotação', data.content || '', (val) => data.content = val);
        break;
    }
  }

  private renderStartBlockProperties(form: HTMLElement, data: any): void {
    if (!Array.isArray(data.triggers) || data.triggers.length === 0) {
      const initialType = data.triggerType || 'manual';
      data.triggers = [
        {
          type: initialType,
          enabled: true,
          urlPattern: data.urlPattern,
          urlPatterns: data.urlPatterns || (data.urlPattern ? [data.urlPattern] : []),
          shortcutKey: data.shortcutKey,
          intervalMinutes: data.intervalMinutes,
          cronExpression: data.cronExpression,
          contextMenuTitle: data.contextMenuTitle,
          floatingButton: data.floatingButton,
        },
      ];
    }

    const triggerLabelsMap: Record<string, string> = {
      manual: '▶ Manual (Disparo pelo Usuário)',
      on_url_load: '🌐 Ao Carregar URLs de Execução',
      shortcut: '⌨ Atalho de Teclado',
      schedule: '⏱ Em um Intervalo de Tempo',
      browser_startup: '🚀 Ao Abrir o Browser',
      context_menu: '🖱 Pelo Menu de Contexto',
      floating_button: '✨ Botão Flutuante Personalizado',
      mcp: '🤖 Via MCP (IA)',
    };

    const triggersContainer = document.createElement('div');
    triggersContainer.style.cssText = 'margin-top: 10px; display: flex; flex-direction: column; gap: 8px;';

    const headerDiv = document.createElement('div');
    headerDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;';
    headerDiv.innerHTML = `
      <label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Formas de Disparo (${data.triggers.length})</label>
      <span style="font-size: 10px; color: #64748b;">Clique para expandir/recolher</span>
    `;
    triggersContainer.appendChild(headerDiv);

    data.triggers.forEach((trig: any, index: number) => {
      const isExpanded = this.expandedTriggerIndices.has(index);
      const card = document.createElement('div');
      card.style.cssText = `background: #0f172a; border: 1px solid ${isExpanded ? '#3b82f6' : '#1e293b'}; border-radius: 6px; overflow: hidden; transition: border-color 0.15s;`;

      const accordionHeader = document.createElement('div');
      accordionHeader.style.cssText = `padding: 8px 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: ${isExpanded ? '#1e293b70' : '#0f172a'}; user-select: none; gap: 8px;`;

      const headerLeft = document.createElement('div');
      headerLeft.style.cssText = 'display: flex; align-items: center; gap: 6px; flex: 1; overflow: hidden;';
      const iconSpan = document.createElement('span');
      iconSpan.style.cssText = 'font-size: 10px; color: #94a3b8; transition: transform 0.15s;';
      iconSpan.textContent = isExpanded ? '▼' : '▶';

      const titleSpan = document.createElement('span');
      titleSpan.style.cssText = `font-size: 12px; font-weight: ${isExpanded ? '600' : '500'}; color: ${isExpanded ? '#60a5fa' : '#cbd5e1'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
      titleSpan.textContent = triggerLabelsMap[trig.type] || trig.type;

      headerLeft.appendChild(iconSpan);
      headerLeft.appendChild(titleSpan);

      const btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.innerHTML = '&times;';
      btnDel.title = 'Remover este gatilho';
      btnDel.style.cssText = 'background: transparent; color: #ef4444; border: none; font-size: 16px; cursor: pointer; line-height: 1; padding: 2px 4px;';
      btnDel.addEventListener('click', (e) => {
        e.stopPropagation();
        if (data.triggers.length <= 1) {
          alert('O fluxo deve ter pelo menos 1 forma de disparo!');
          return;
        }
        data.triggers.splice(index, 1);
        const newExpanded = new Set<number>();
        this.expandedTriggerIndices.forEach((idx) => {
          if (idx < index) newExpanded.add(idx);
          else if (idx > index) newExpanded.add(idx - 1);
        });
        this.expandedTriggerIndices = newExpanded;
        data.triggerType = data.triggers[0]?.type || 'manual';
        this.callbacks.onRenderGraph();
        this.renderInspector();
      });

      accordionHeader.appendChild(headerLeft);
      accordionHeader.appendChild(btnDel);

      accordionHeader.addEventListener('click', () => {
        if (this.expandedTriggerIndices.has(index)) {
          this.expandedTriggerIndices.delete(index);
        } else {
          this.expandedTriggerIndices.add(index);
        }
        this.renderInspector();
      });

      card.appendChild(accordionHeader);

      if (isExpanded) {
        const body = document.createElement('div');
        body.style.cssText = 'padding: 10px; border-top: 1px solid #1e293b; display: flex; flex-direction: column; gap: 8px;';

        const selectDiv = document.createElement('div');
        selectDiv.style.cssText = 'display: flex; flex-direction: column; gap: 4px;';
        const selectLabel = document.createElement('label');
        selectLabel.style.cssText = 'font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;';
        selectLabel.textContent = 'Tipo de Gatilho';

        const selectEl = document.createElement('select');
        selectEl.style.cssText = 'width: 100%; padding: 5px 8px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;';
        const triggerOptions = [
          { value: 'manual', label: '▶ Manual (Disparo pelo Usuário)' },
          { value: 'on_url_load', label: '🌐 Ao Carregar URLs de Execução' },
          { value: 'shortcut', label: '⌨ Atalho de Teclado' },
          { value: 'schedule', label: '⏱ Em um Intervalo de Tempo' },
          { value: 'browser_startup', label: '🚀 Ao Abrir o Browser' },
          { value: 'context_menu', label: '🖱 Pelo Menu de Contexto' },
          { value: 'floating_button', label: '✨ Botão Flutuante Personalizado' },
          { value: 'mcp', label: '🤖 Via MCP (IA)' },
        ];
        selectEl.innerHTML = triggerOptions.map((o) => `<option value="${o.value}" ${trig.type === o.value ? 'selected' : ''}>${o.label}</option>`).join('');
        selectEl.addEventListener('change', (e: any) => {
          trig.type = e.target.value;
          data.triggerType = data.triggers[0]?.type || 'manual';
          this.renderInspector();
        });

        selectDiv.appendChild(selectLabel);
        selectDiv.appendChild(selectEl);
        body.appendChild(selectDiv);

        if (trig.type === 'on_url_load') {
          if (!Array.isArray(trig.urlPatterns)) {
            trig.urlPatterns = trig.urlPattern ? [trig.urlPattern] : ['*://*.google.com/*'];
          }
          this.renderUrlListSection(body, 'URLs para Execução', trig.urlPatterns, (newList) => {
            trig.urlPatterns = newList;
            trig.urlPattern = newList[0] || '';
          });
        } else if (trig.type === 'shortcut') {
          this.addTextInput(body, 'Atalho de Teclado (ex: Ctrl+Shift+U)', trig.shortcutKey || 'run_default_automation', (val) => trig.shortcutKey = val);
        } else if (trig.type === 'schedule') {
          this.addNumberInput(body, 'Repetir a Cada (minutos)', trig.intervalMinutes ?? 15, (val) => trig.intervalMinutes = val);
          this.addTextInput(body, 'Expressão Cron (Opcional, ex: 0 * * * *)', trig.cronExpression || '', (val) => trig.cronExpression = val);
        } else if (trig.type === 'context_menu') {
          this.addTextInput(body, 'Título no Menu de Contexto', trig.contextMenuTitle || 'Executar Esta Automação', (val) => trig.contextMenuTitle = val);
        } else if (trig.type === 'floating_button') {
          this.renderFloatingButtonTriggerConfig(body, trig);
        }

        card.appendChild(body);
      }

      triggersContainer.appendChild(card);
    });

    const btnAddTrigger = document.createElement('button');
    btnAddTrigger.type = 'button';
    btnAddTrigger.className = 'btn-xs';
    btnAddTrigger.style.cssText = 'width: 100%; margin-top: 6px; padding: 8px; font-weight: 600; background: #3b82f620; border: 1px dashed #3b82f6; color: #60a5fa; cursor: pointer; border-radius: 6px;';
    btnAddTrigger.textContent = '➕ Adicionar Mais Uma Forma de Disparo';
    btnAddTrigger.addEventListener('click', () => {
      data.triggers.push({ type: 'manual', enabled: true });
      this.expandedTriggerIndices.add(data.triggers.length - 1);
      data.triggerType = data.triggers[0]?.type || 'manual';
      this.callbacks.onRenderGraph();
      this.renderInspector();
    });
    triggersContainer.appendChild(btnAddTrigger);

    form.appendChild(triggersContainer);
  }

  private renderFloatingButtonTriggerConfig(body: HTMLElement, trig: any): void {
    if (!trig.floatingButton) {
      trig.floatingButton = {
        buttonText: 'Executar Fluxo',
        iconType: 'emoji',
        buttonIcon: '⚡',
        position: 'bottom-right',
        offsetX: 24,
        offsetY: 24,
        backgroundColor: '#6366f1',
        textColor: '#ffffff',
        urlPattern: '*://*/*',
      };
    }
    const fb = trig.floatingButton;
    if (!fb.iconType) fb.iconType = 'emoji';

    this.addTextInput(body, 'Texto do Botão', fb.buttonText || '', (val) => fb.buttonText = val);

    const iconGroup = document.createElement('div');
    iconGroup.style.cssText = 'background: #0b0f19; border: 1px solid #1e293b; border-radius: 6px; padding: 8px; display: flex; flex-direction: column; gap: 6px;';

    const iconHeader = document.createElement('label');
    iconHeader.style.cssText = 'font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;';
    iconHeader.textContent = 'Tipo de Ícone';
    iconGroup.appendChild(iconHeader);

    const iconTypeSelect = document.createElement('select');
    iconTypeSelect.style.cssText = 'width: 100%; padding: 5px 8px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;';
    iconTypeSelect.innerHTML = `
      <option value="emoji" ${fb.iconType === 'emoji' ? 'selected' : ''}>Emoji / Caractere</option>
      <option value="svg" ${fb.iconType === 'svg' ? 'selected' : ''}>Código SVG</option>
      <option value="image" ${fb.iconType === 'image' ? 'selected' : ''}>Imagem (Upload)</option>
    `;

    const iconContentDiv = document.createElement('div');
    iconContentDiv.style.cssText = 'margin-top: 4px;';

    const renderIconOptions = () => {
      iconContentDiv.innerHTML = '';
      if (fb.iconType === 'emoji') {
        const emojiInput = document.createElement('input');
        emojiInput.type = 'text';
        emojiInput.value = fb.buttonIcon || '⚡';
        emojiInput.placeholder = 'ex: ⚡, 🚀, ▶, ⚙️';
        emojiInput.style.cssText = 'width: 100%; padding: 5px 8px; font-size: 14px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;';
        emojiInput.addEventListener('input', (e: any) => fb.buttonIcon = e.target.value);
        iconContentDiv.appendChild(emojiInput);
      } else if (fb.iconType === 'svg') {
        const svgInput = document.createElement('textarea');
        svgInput.value = fb.svgIcon || '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>';
        svgInput.placeholder = '<svg viewBox="0 0 24 24" ...>...</svg>';
        svgInput.rows = 3;
        svgInput.style.cssText = 'width: 100%; padding: 5px 8px; font-size: 11px; font-family: monospace; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px; resize: vertical;';
        svgInput.addEventListener('input', (e: any) => fb.svgIcon = e.target.value);
        iconContentDiv.appendChild(svgInput);
      } else if (fb.iconType === 'image') {
        const uploadContainer = document.createElement('div');
        uploadContainer.style.cssText = 'display: flex; flex-direction: column; gap: 6px;';
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/png, image/jpeg, image/svg+xml, image/webp, image/gif';
        fileInput.style.cssText = 'font-size: 11px; color: #94a3b8; cursor: pointer;';

        const previewImg = document.createElement('img');
        previewImg.style.cssText = `width: 32px; height: 32px; object-fit: contain; border-radius: 4px; border: 1px solid #243049; background: #172033; display: ${fb.imageIcon ? 'block' : 'none'};`;
        if (fb.imageIcon) previewImg.src = fb.imageIcon;

        fileInput.addEventListener('change', (e: any) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (re) => {
              const base64 = re.target?.result as string;
              fb.imageIcon = base64;
              previewImg.src = base64;
              previewImg.style.display = 'block';
            };
            reader.readAsDataURL(file);
          }
        });

        uploadContainer.appendChild(fileInput);
        uploadContainer.appendChild(previewImg);
        iconContentDiv.appendChild(uploadContainer);
      }
    };

    iconTypeSelect.addEventListener('change', (e: any) => {
      const newType = e.target.value;
      fb.iconType = newType;
      if (newType === 'emoji') {
        delete fb.svgIcon;
        delete fb.imageIcon;
        if (!fb.buttonIcon) fb.buttonIcon = '⚡';
      } else if (newType === 'svg') {
        delete fb.buttonIcon;
        delete fb.imageIcon;
        if (!fb.svgIcon) fb.svgIcon = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>';
      } else if (newType === 'image') {
        delete fb.buttonIcon;
        delete fb.svgIcon;
      }
      renderIconOptions();
    });

    renderIconOptions();
    iconGroup.appendChild(iconTypeSelect);
    iconGroup.appendChild(iconContentDiv);
    body.appendChild(iconGroup);

    this.addSelectInput(body, 'Posição na Tela', fb.position || 'bottom-right', [
      { value: 'bottom-right', label: 'Inferior Direito (Padrão)' },
      { value: 'bottom-left', label: 'Inferior Esquerdo' },
      { value: 'top-right', label: 'Superior Direito' },
      { value: 'top-left', label: 'Superior Esquerdo' },
    ], (val) => fb.position = val);
    this.addNumberInput(body, 'Deslocamento X (px)', fb.offsetX ?? 24, (val) => fb.offsetX = val);
    this.addNumberInput(body, 'Deslocamento Y (px)', fb.offsetY ?? 24, (val) => fb.offsetY = val);

    this.colorPicker.createPaintColorPicker(body, 'Cor de Fundo', fb.backgroundColor || '#6366f1', (val) => fb.backgroundColor = val);
    this.colorPicker.createPaintColorPicker(body, 'Cor do Texto', fb.textColor || '#ffffff', (val) => fb.textColor = val);

    if (!Array.isArray(trig.urlPatterns)) {
      trig.urlPatterns = fb.urlPattern ? [fb.urlPattern] : ['*://*/*'];
    }
    this.renderUrlListSection(body, 'URLs Em Que o Botão Será Exibido', trig.urlPatterns, (newList) => {
      trig.urlPatterns = newList;
      fb.urlPattern = newList[0] || '*://*/*';
    });
  }

  private renderUrlListSection(container: HTMLElement, labelText: string, currentList: string[], onUpdate: (newList: string[]) => void): void {
    const urlSection = document.createElement('div');
    urlSection.style.cssText = 'display: flex; flex-direction: column; gap: 4px; margin-top: 4px;';

    const secHeader = document.createElement('div');
    secHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
    secHeader.innerHTML = `
      <label style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">${labelText} (${currentList.length})</label>
    `;
    urlSection.appendChild(secHeader);

    const itemsDiv = document.createElement('div');
    itemsDiv.style.cssText = 'display: flex; flex-direction: column; gap: 4px;';

    if (currentList.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.style.cssText = 'font-size: 11px; color: #64748b; font-style: italic;';
      emptyMsg.textContent = 'Nenhuma URL definida (executa em qualquer página).';
      itemsDiv.appendChild(emptyMsg);
    } else {
      currentList.forEach((urlVal, uIdx) => {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; gap: 4px; align-items: center;';

        const inp = document.createElement('input');
        inp.type = 'text';
        inp.value = urlVal;
        inp.placeholder = 'ex: *://*.google.com/* ou https://exemplo.com/painel';
        inp.style.cssText = 'flex: 1; padding: 4px 6px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;';
        inp.addEventListener('input', (e: any) => {
          currentList[uIdx] = e.target.value;
          onUpdate(currentList);
        });

        const delUrlBtn = document.createElement('button');
        delUrlBtn.type = 'button';
        delUrlBtn.innerHTML = '&times;';
        delUrlBtn.title = 'Remover URL';
        delUrlBtn.style.cssText = 'background: #ef444420; color: #ef4444; border: 1px solid #ef444440; border-radius: 4px; width: 22px; height: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center;';
        delUrlBtn.addEventListener('click', () => {
          currentList.splice(uIdx, 1);
          onUpdate(currentList);
          this.renderInspector();
        });

        row.appendChild(inp);
        row.appendChild(delUrlBtn);
        itemsDiv.appendChild(row);
      });
    }

    urlSection.appendChild(itemsDiv);

    const btnAddUrl = document.createElement('button');
    btnAddUrl.type = 'button';
    btnAddUrl.className = 'btn-xs';
    btnAddUrl.style.cssText = 'width: 100%; margin-top: 4px; padding: 4px 6px; font-size: 11px; background: #1e293b; border: 1px solid #334155; color: #94a3b8; cursor: pointer; border-radius: 4px;';
    btnAddUrl.textContent = '+ Adicionar URL para Execução';
    btnAddUrl.addEventListener('click', () => {
      currentList.push('*://*/*');
      onUpdate(currentList);
      this.renderInspector();
    });
    urlSection.appendChild(btnAddUrl);

    container.appendChild(urlSection);
  }

  private renderDelayProperties(form: HTMLElement, data: any): void {
    this.addCheckboxInput(form, 'Usar Tempo Randômico', !!data.isRandom, (val) => {
      data.isRandom = val;
      if (val && !data.randomRange) data.randomRange = { minMs: 1000, maxMs: 3000 };
      this.renderInspector();
    });

    if (!data.isRandom) {
      this.addNumberInput(form, 'Atraso Fixo (ms)', data.fixedMs ?? 1500, (val) => data.fixedMs = val);
    } else {
      this.addNumberInput(form, 'Atraso Mínimo (ms)', data.randomRange?.minMs ?? 1000, (val) => {
        if (!data.randomRange) data.randomRange = { minMs: 1000, maxMs: 3000 };
        data.randomRange.minMs = val;
      });
      this.addNumberInput(form, 'Atraso Máximo (ms)', data.randomRange?.maxMs ?? 3000, (val) => {
        if (!data.randomRange) data.randomRange = { minMs: 1000, maxMs: 3000 };
        data.randomRange.maxMs = val;
      });
    }
  }

  private renderSwitchProperties(form: HTMLElement, data: any): void {
    this.addSelectInput(form, 'Modo de Execução', data.executionMode || 'first_match', [
      { value: 'first_match', label: 'Executar o primeiro que satisfizer' },
      { value: 'all_matches_parallel', label: 'Executar todos que satisfizerem em paralelo' },
    ], (val) => data.executionMode = val);

    this.addCheckboxInput(form, 'Possui Caminho Padrão (Default)', data.hasDefaultBranch !== false, (val) => data.hasDefaultBranch = val);

    const casesContainer = document.createElement('div');
    casesContainer.style.cssText = 'border-top: 1px solid #243049; padding-top: 10px; margin-top: 10px;';
    casesContainer.innerHTML = '<div style="font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 8px;">Casos Condicionais</div>';

    if (!Array.isArray(data.cases)) data.cases = [];
    data.cases.forEach((c: any, index: number) => {
      const mode = c.evaluationMode || (c.jsExpression && !c.operator ? 'js_eval' : 'comparison');
      const caseEl = document.createElement('div');
      caseEl.style.cssText = 'background: #0b0f19; border: 1px solid #1e293b; padding: 8px; border-radius: 6px; margin-bottom: 8px;';
      caseEl.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <input type="text" placeholder="Nome do Caso" value="${c.label || 'Caso #' + (index + 1)}" class="case-label-input" style="background:transparent;border:none;border-bottom:1px solid #243049;color:#e2e8f0;font-size:11px;font-weight:600;width:75%;outline:none;padding:2px 0;" />
          <button type="button" class="btn-xs delete-case-btn" data-idx="${index}" style="color:#ef4444;background:transparent;border:none;cursor:pointer;padding:2px 6px;">✕</button>
        </div>
        <div style="margin-bottom:6px;">
          <label style="font-size:10px;color:#94a3b8;display:block;margin-bottom:3px;">Tipo de Avaliação</label>
          <select class="case-eval-mode" style="width:100%;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;">
            <option value="comparison" ${mode === 'comparison' ? 'selected' : ''}>Comparação de Valores</option>
            <option value="js_eval" ${mode === 'js_eval' ? 'selected' : ''}>Expressão / Código JS</option>
          </select>
        </div>
        <div class="case-comparison-fields" style="display:${mode === 'comparison' ? 'block' : 'none'};">
          <input type="text" placeholder="Operando Esquerdo (ex: {{status}})" value="${c.leftOperand || ''}" class="case-left" style="width:100%;margin-bottom:4px;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;" />
          <select class="case-op" style="width:100%;margin-bottom:4px;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;">
            <option value="equals" ${c.operator === 'equals' ? 'selected' : ''}>Igual</option>
            <option value="not_equals" ${c.operator === 'not_equals' ? 'selected' : ''}>Diferente</option>
            <option value="contains" ${c.operator === 'contains' ? 'selected' : ''}>Contém</option>
            <option value="not_contains" ${c.operator === 'not_contains' ? 'selected' : ''}>Não Contém</option>
            <option value="greater_than" ${c.operator === 'greater_than' ? 'selected' : ''}>Maior que</option>
            <option value="less_than" ${c.operator === 'less_than' ? 'selected' : ''}>Menor que</option>
            <option value="greater_or_equal" ${c.operator === 'greater_or_equal' ? 'selected' : ''}>Maior ou Igual</option>
            <option value="less_or_equal" ${c.operator === 'less_or_equal' ? 'selected' : ''}>Menor ou Igual</option>
            <option value="is_empty" ${c.operator === 'is_empty' ? 'selected' : ''}>Está Vazio</option>
            <option value="is_not_empty" ${c.operator === 'is_not_empty' ? 'selected' : ''}>Não Está Vazio</option>
          </select>
          <input type="text" placeholder="Operando Direito (ex: 200)" value="${c.rightOperand || ''}" class="case-right" style="width:100%;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;" />
        </div>
        <div class="case-js-fields" style="display:${mode === 'js_eval' ? 'block' : 'none'};">
          <label style="font-size:10px;color:#94a3b8;display:block;margin-bottom:3px;">Código JS Booleano (retorna true/false)</label>
          <textarea class="case-js-code" placeholder="ex: user.role === 'admin' && user.age > 18" style="width:100%;height:60px;padding:6px;font-size:11px;font-family:monospace;background:#172033;color:#38bdf8;border:1px solid #243049;border-radius:4px;resize:vertical;">${c.jsExpression || ''}</textarea>
        </div>
      `;

      caseEl.querySelector('.case-label-input')?.addEventListener('input', (e: any) => {
        c.label = e.target.value;
        this.callbacks.onRenderGraph();
      });

      const modeSelect = caseEl.querySelector('.case-eval-mode') as HTMLSelectElement;
      const compFields = caseEl.querySelector('.case-comparison-fields') as HTMLElement;
      const jsFields = caseEl.querySelector('.case-js-fields') as HTMLElement;

      modeSelect?.addEventListener('change', (e: any) => {
        c.evaluationMode = e.target.value;
        if (c.evaluationMode === 'js_eval') {
          compFields.style.display = 'none';
          jsFields.style.display = 'block';
        } else {
          compFields.style.display = 'block';
          jsFields.style.display = 'none';
        }
      });

      caseEl.querySelector('.case-left')?.addEventListener('input', (e: any) => c.leftOperand = e.target.value);
      caseEl.querySelector('.case-op')?.addEventListener('change', (e: any) => c.operator = e.target.value);
      caseEl.querySelector('.case-right')?.addEventListener('input', (e: any) => c.rightOperand = e.target.value);
      caseEl.querySelector('.case-js-code')?.addEventListener('input', (e: any) => c.jsExpression = e.target.value);

      caseEl.querySelector('.delete-case-btn')?.addEventListener('click', () => {
        data.cases.splice(index, 1);
        this.callbacks.onRenderGraph();
        this.renderInspector();
      });

      casesContainer.appendChild(caseEl);
    });

    const btnAddCase = document.createElement('button');
    btnAddCase.type = 'button';
    btnAddCase.className = 'btn-xs';
    btnAddCase.style.cssText = 'width: 100%; margin-top: 4px; padding: 6px;';
    btnAddCase.textContent = '+ Adicionar Caso';
    btnAddCase.addEventListener('click', () => {
      data.cases.push({
        id: `case_${Date.now()}`,
        label: `Caso ${data.cases.length + 1}`,
        evaluationMode: 'comparison',
        leftOperand: '',
        operator: 'equals',
        rightOperand: '',
        jsExpression: ''
      });
      this.callbacks.onRenderGraph();
      this.renderInspector();
    });
    casesContainer.appendChild(btnAddCase);
    form.appendChild(casesContainer);
  }

  private renderWhileProperties(form: HTMLElement, data: any): void {
    const mode = data.evaluationMode || (data.jsExpression && !data.operator ? 'js_eval' : 'comparison');
    this.addSelectInput(form, 'Tipo de Condição', mode, [
      { value: 'comparison', label: 'Comparação de Valores' },
      { value: 'js_eval', label: 'Expressão / Código JS' },
    ], (val) => {
      data.evaluationMode = val;
      this.renderInspector();
    });

    if (data.evaluationMode === 'js_eval') {
      this.addTextareaInput(
        form,
        'Código JS Booleano (enquanto retornar true, o loop continua)',
        data.jsExpression || '',
        (val) => data.jsExpression = val
      );
    } else {
      this.addTextInput(form, 'Operando Esquerdo (ex: {{i}})', data.leftOperand || '', (val) => data.leftOperand = val);
      this.addSelectInput(form, 'Operador Condicional', data.operator || 'less_than', [
        { value: 'less_than', label: 'Menor que' },
        { value: 'less_or_equal', label: 'Menor ou Igual' },
        { value: 'greater_than', label: 'Maior que' },
        { value: 'greater_or_equal', label: 'Maior ou Igual' },
        { value: 'equals', label: 'Igual' },
        { value: 'not_equals', label: 'Diferente' },
      ], (val) => data.operator = val);
      this.addTextInput(form, 'Operando Direito (ex: 10)', data.rightOperand || '', (val) => data.rightOperand = val);
    }

    this.addNumberInput(form, 'Limite Máximo de Iterações (Segurança)', data.maxIterations ?? 100, (val) => data.maxIterations = val);
  }

  private renderForProperties(form: HTMLElement, data: any): void {
    this.addSelectInput(form, 'Tipo de Loop', data.loopType || 'count', [
      { value: 'count', label: 'Contagem de Vezes' },
      { value: 'array', label: 'Iterar sobre Lista/Array' },
      { value: 'js_generator', label: 'Gerador / Expressão JS' },
    ], (val) => { data.loopType = val; this.renderInspector(); });

    if (data.loopType === 'count') {
      this.addTextInput(form, 'Contagem / Vezes (ex: 5 ou {{total}})', String(data.countExpression ?? 5), (val) => data.countExpression = val);
    } else if (data.loopType === 'js_generator') {
      this.addTextareaInput(
        form,
        'Código JS (deve retornar um Array ou Número de vezes)',
        data.jsExpression || '',
        (val) => data.jsExpression = val
      );
    } else {
      this.addTextInput(form, 'Expressão da Lista (ex: {{produtos}})', data.arrayExpression || '', (val) => data.arrayExpression = val);
    }

    this.addTextInput(form, 'Variável do Item Atual', data.itemVarName || 'item', (val) => data.itemVarName = val);
    this.addTextInput(form, 'Variável do Índice Atual', data.indexVarName || 'index', (val) => data.indexVarName = val);
    this.addNumberInput(form, 'Limite Máximo de Iterações', data.maxIterations ?? 100, (val) => data.maxIterations = val);
  }

  private renderIfElementProperties(form: HTMLElement, data: any): void {
    this.addTextInput(form, 'Seletor do Elemento', data.selector || '', (val) => data.selector = val);
    this.addSelectInput(form, 'Tipo de Seletor', data.selectorType || 'css', [
      { value: 'css', label: 'Seletor CSS' },
      { value: 'xpath', label: 'XPath' },
    ], (val) => data.selectorType = val);
    this.addNumberInput(form, 'Tempo Limite de Espera (ms)', data.timeoutMs ?? 3000, (val) => data.timeoutMs = val);
  }

  private renderTabActionProperties(form: HTMLElement, data: any): void {
    this.addSelectInput(form, 'Ação de Aba', data.action || 'new_tab', [
      { value: 'new_tab', label: 'Nova Aba' },
      { value: 'switch_tab', label: 'Trocar Aba' },
      { value: 'close_tab', label: 'Fechar Aba' },
      { value: 'get_current_url', label: 'Obter URL Atual' },
    ], (val) => { data.action = val; this.renderInspector(); });

    if (data.action === 'new_tab') {
      this.addTextInput(form, 'URL Inicial', data.url || 'https://google.com', (val) => data.url = val);
      this.addCheckboxInput(form, 'Focar Imediatamente', data.active !== false, (val) => data.active = val);
      this.addTextInput(form, 'Salvar URL em Variável (opcional)', data.saveUrlToVar || '', (val) => data.saveUrlToVar = val);
    } else if (data.action === 'switch_tab' || data.action === 'close_tab') {
      this.addSelectInput(form, 'Critério de Busca', data.queryType || 'title', [
        { value: 'title', label: 'Por Título da Aba' },
        { value: 'index', label: 'Por Posição / Índice' },
        { value: 'url_match', label: 'Por Correspondência de URL' },
      ], (val) => data.queryType = val);
      this.addTextInput(form, 'Valor da Busca', data.queryValue || '', (val) => data.queryValue = val);
    } else if (data.action === 'get_current_url') {
      this.addTextInput(form, 'Salvar URL na Variável', data.saveUrlToVar || 'currentUrl', (val) => data.saveUrlToVar = val);
    }
  }

  private renderClickProperties(form: HTMLElement, data: any): void {
    this.addTextInput(form, 'Seletor do Elemento', data.selector || '', (val) => data.selector = val);
    this.addSelectInput(form, 'Tipo de Seletor', data.selectorType || 'css', [
      { value: 'css', label: 'Seletor CSS' },
      { value: 'xpath', label: 'XPath' },
    ], (val) => data.selectorType = val);
    this.addSelectInput(form, 'Tipo de Clique', data.clickType || 'single', [
      { value: 'single', label: 'Clique Simples (Botão Esquerdo)' },
      { value: 'double', label: 'Clique Duplo' },
      { value: 'contextmenu', label: 'Clique com Botão Direito' },
    ], (val) => data.clickType = val);
    this.addCheckboxInput(form, 'Aguardar Elemento antes do Clique', data.waitForElement !== false, (val) => data.waitForElement = val);
    this.addNumberInput(form, 'Tempo Limite (ms)', data.timeoutMs ?? 5000, (val) => data.timeoutMs = val);
  }

  private renderTypeInputProperties(form: HTMLElement, data: any): void {
    this.addTextInput(form, 'Seletor do Campo', data.selector || '', (val) => data.selector = val);
    this.addSelectInput(form, 'Tipo de Seletor', data.selectorType || 'css', [
      { value: 'css', label: 'Seletor CSS' },
      { value: 'xpath', label: 'XPath' },
    ], (val) => data.selectorType = val);
    this.addTextareaInput(form, 'Texto a Digitar (suporta {{var}})', data.text || '', (val) => data.text = val);
    this.addSelectInput(form, 'Modo de Digitação', data.mode || 'human_typing', [
      { value: 'human_typing', label: 'Digitação Humana Realista (com delay)' },
      { value: 'paste', label: 'Colar Imediato (Paste)' },
    ], (val) => { data.mode = val; this.renderInspector(); });

    if (data.mode === 'human_typing') {
      this.addNumberInput(form, 'Atraso Mínimo por Tecla (ms)', data.minTypingDelayMs ?? 40, (val) => data.minTypingDelayMs = val);
      this.addNumberInput(form, 'Atraso Máximo por Tecla (ms)', data.maxTypingDelayMs ?? 120, (val) => data.maxTypingDelayMs = val);
    }

    this.addCheckboxInput(form, 'Limpar campo antes de digitar', !!data.clearBeforeTyping, (val) => data.clearBeforeTyping = val);
    this.addCheckboxInput(form, 'Pressionar Enter após digitar', !!data.pressEnterAfter, (val) => data.pressEnterAfter = val);
    this.addNumberInput(form, 'Tempo Limite (ms)', data.timeoutMs ?? 5000, (val) => data.timeoutMs = val);
  }

  private renderScrollProperties(form: HTMLElement, data: any): void {
    this.addSelectInput(form, 'Destino da Rolagem', data.target || 'bottom', [
      { value: 'bottom', label: 'Rolar até o Final da Página' },
      { value: 'top', label: 'Rolar até o Topo da Página' },
      { value: 'element', label: 'Rolar até o Elemento ficar Visível' },
      { value: 'by_pixels', label: 'Rolar por Quantidade de Pixels' },
    ], (val) => { data.target = val; this.renderInspector(); });

    if (data.target === 'element') {
      this.addTextInput(form, 'Seletor do Elemento Alvo', data.selector || '', (val) => data.selector = val);
      this.addSelectInput(form, 'Tipo de Seletor', data.selectorType || 'css', [
        { value: 'css', label: 'Seletor CSS' },
        { value: 'xpath', label: 'XPath' },
      ], (val) => data.selectorType = val);
    } else if (data.target === 'by_pixels') {
      this.addNumberInput(form, 'Deslocamento Vertical (Delta Y)', data.deltaY ?? 500, (val) => data.deltaY = val);
      this.addNumberInput(form, 'Deslocamento Horizontal (Delta X)', data.deltaX ?? 0, (val) => data.deltaX = val);
    }

    this.addCheckboxInput(form, 'Rolagem Suave (Smooth)', data.smooth !== false, (val) => data.smooth = val);
  }

  private renderHttpRequestProperties(form: HTMLElement, data: any): void {
    this.addTextInput(form, 'URL da Requisição', data.url || 'https://', (val) => data.url = val);
    this.addSelectInput(form, 'Método HTTP', data.method || 'GET', [
      { value: 'GET', label: 'GET' },
      { value: 'POST', label: 'POST' },
      { value: 'PUT', label: 'PUT' },
      { value: 'PATCH', label: 'PATCH' },
      { value: 'DELETE', label: 'DELETE' },
      { value: 'HEAD', label: 'HEAD' },
    ], (val) => { data.method = val; this.renderInspector(); });

    if (data.method === 'POST' || data.method === 'PUT' || data.method === 'PATCH') {
      this.addTextareaInput(form, 'Corpo da Requisição (Body)', data.body || '', (val) => data.body = val);
    }

    this.addSelectInput(form, 'Tipo de Resposta', data.responseType || 'json', [
      { value: 'json', label: 'JSON (Objeto/Array)' },
      { value: 'text', label: 'Texto Puro' },
    ], (val) => data.responseType = val);

    this.addTextInput(form, 'Salvar Resposta na Variável', data.saveResponseToVar || 'apiResponse', (val) => data.saveResponseToVar = val);
    this.addTextInput(form, 'Salvar Status HTTP na Variável (opcional)', data.saveStatusToVar || '', (val) => data.saveStatusToVar = val);
    this.addNumberInput(form, 'Tempo Limite (ms)', data.timeoutMs ?? 15000, (val) => data.timeoutMs = val);
  }

  private renderExtractDataProperties(form: HTMLElement, data: any): void {
    this.addTextInput(form, 'Seletor do Elemento', data.selector || '', (val) => data.selector = val);
    this.addSelectInput(form, 'Tipo de Seletor', data.selectorType || 'css', [
      { value: 'css', label: 'Seletor CSS' },
      { value: 'xpath', label: 'XPath' },
    ], (val) => data.selectorType = val);
    this.addSelectInput(form, 'Tipo de Extração', data.extractType || 'innerText', [
      { value: 'innerText', label: 'Texto Visível (innerText)' },
      { value: 'innerHTML', label: 'HTML Interno (innerHTML)' },
      { value: 'value', label: 'Valor do Campo (value)' },
      { value: 'attribute', label: 'Atributo HTML (ex: href, src)' },
    ], (val) => { data.extractType = val; this.renderInspector(); });

    if (data.extractType === 'attribute') {
      this.addTextInput(form, 'Nome do Atributo (ex: href, src)', data.attributeName || 'href', (val) => data.attributeName = val);
    }

    this.addTextInput(form, 'Salvar Dado na Variável', data.saveToVar || 'extractedData', (val) => data.saveToVar = val);
    this.addNumberInput(form, 'Tempo Limite (ms)', data.timeoutMs ?? 5000, (val) => data.timeoutMs = val);
  }

  private renderScrapeListProperties(form: HTMLElement, data: any): void {
    this.addTextInput(form, 'Seletor dos Itens / Cards', data.selector || '.card', (val) => data.selector = val);
    this.addSelectInput(form, 'Tipo de Seletor', data.selectorType || 'css', [
      { value: 'css', label: 'Seletor CSS' },
      { value: 'xpath', label: 'XPath' },
    ], (val) => data.selectorType = val);
    this.addTextInput(form, 'Salvar Lista na Variável', data.saveToVar || 'items', (val) => data.saveToVar = val);
    this.addNumberInput(form, 'Limite Máximo de Itens', data.maxItems ?? 50, (val) => data.maxItems = val);
    this.addNumberInput(form, 'Tempo Limite (ms)', data.timeoutMs ?? 5000, (val) => data.timeoutMs = val);

    const fieldsContainer = document.createElement('div');
    fieldsContainer.style.cssText = 'border-top: 1px solid #243049; padding-top: 10px; margin-top: 10px;';
    fieldsContainer.innerHTML = '<div style="font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 8px;">Campos Extraídos por Item</div>';

    if (!Array.isArray(data.fields)) data.fields = [];
    data.fields.forEach((f: any, idx: number) => {
      const fieldEl = document.createElement('div');
      fieldEl.style.cssText = 'background: #0b0f19; border: 1px solid #1e293b; padding: 8px; border-radius: 6px; margin-bottom: 8px;';
      fieldEl.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:11px;font-weight:600;">Campo #${idx + 1}</span>
          <button class="btn-xs delete-field-btn" data-idx="${idx}">✕</button>
        </div>
        <input type="text" placeholder="Nome da Chave (ex: preco)" value="${f.name || ''}" class="field-name" style="width:100%;margin-bottom:4px;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;" />
        <input type="text" placeholder="Sub-seletor (ex: .price ou vazio)" value="${f.subSelector || ''}" class="field-sub" style="width:100%;margin-bottom:4px;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;" />
        <select class="field-type" style="width:100%;margin-bottom:4px;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;">
          <option value="innerText" ${f.extractType === 'innerText' ? 'selected' : ''}>Texto (innerText)</option>
          <option value="attribute" ${f.extractType === 'attribute' ? 'selected' : ''}>Atributo</option>
          <option value="innerHTML" ${f.extractType === 'innerHTML' ? 'selected' : ''}>HTML (innerHTML)</option>
          <option value="value" ${f.extractType === 'value' ? 'selected' : ''}>Valor (value)</option>
        </select>
        <input type="text" placeholder="Nome do Atributo (ex: href)" value="${f.attributeName || ''}" class="field-attr ${f.extractType !== 'attribute' ? 'hidden' : ''}" style="width:100%;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;" />
      `;

      fieldEl.querySelector('.field-name')?.addEventListener('input', (e: any) => f.name = e.target.value);
      fieldEl.querySelector('.field-sub')?.addEventListener('input', (e: any) => f.subSelector = e.target.value);
      fieldEl.querySelector('.field-type')?.addEventListener('change', (e: any) => {
        f.extractType = e.target.value;
        const attrInput = fieldEl.querySelector('.field-attr');
        if (attrInput) {
          if (f.extractType === 'attribute') attrInput.classList.remove('hidden');
          else attrInput.classList.add('hidden');
        }
      });
      fieldEl.querySelector('.field-attr')?.addEventListener('input', (e: any) => f.attributeName = e.target.value);
      fieldEl.querySelector('.delete-field-btn')?.addEventListener('click', () => {
        data.fields.splice(idx, 1);
        this.renderInspector();
      });

      fieldsContainer.appendChild(fieldEl);
    });

    const btnAddField = document.createElement('button');
    btnAddField.type = 'button';
    btnAddField.className = 'btn-xs';
    btnAddField.style.cssText = 'width: 100%; margin-top: 4px; padding: 6px;';
    btnAddField.textContent = '+ Adicionar Campo ao Scraper';
    btnAddField.addEventListener('click', () => {
      data.fields.push({ name: `campo_${data.fields.length + 1}`, subSelector: '', extractType: 'innerText', attributeName: '' });
      this.renderInspector();
    });
    fieldsContainer.appendChild(btnAddField);
    form.appendChild(fieldsContainer);
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
    group.innerHTML = `<label>${labelText}</label><textarea>${value ?? ''}</textarea>`;
    group.querySelector('textarea')?.addEventListener('input', (e: any) => onChange(e.target.value));
    container.appendChild(group);
  }
}
