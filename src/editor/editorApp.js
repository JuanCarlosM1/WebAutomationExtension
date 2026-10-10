/**
 * WebAutomations Visual Flow Studio
 * Editor interativo em grafo com Drag & Drop, Inspetor e Execução em tempo real
 */

import { AnyAutomationNode, AutomationEdge, NodeType, WebAutomationGraph } from '../../../BibliotecaDeDev/src/types/schema';
import { DEFAULT_AUTOMATION } from '../defaultAutomation';

// Catálogo de nós disponíveis para a barra lateral
const BLOCK_CATALOG: Array<{
  category: string;
  categoryLabel: string;
  categoryClass: string;
  items: Array<{ type: NodeType; title: string; desc: string; icon: string; defaultData: any }>;
}> = [
  {
    category: 'flow_logic',
    categoryLabel: 'A. Controle de Fluxo e Lógica',
    categoryClass: 'cat-flow',
    items: [
      { type: 'start', title: 'Bloco de Início', desc: 'Ponto de partida e gatilho', icon: '▶', defaultData: { label: 'Início', triggerType: 'manual' } },
      { type: 'delay', title: 'Atraso (Delay)', desc: 'Pausa fixa ou randômica', icon: '⏱', defaultData: { label: 'Aguardar', isRandom: false, fixedMs: 1500 } },
      { type: 'switch', title: 'Switch (Condicional)', desc: 'Desvia fluxo por condição', icon: '⌥', defaultData: { label: 'Condição', executionMode: 'first_match', cases: [], hasDefaultBranch: true } },
      { type: 'while_loop', title: 'Loop While', desc: 'Enquanto condição for verdadeira', icon: '↺', defaultData: { label: 'Loop While', leftOperand: '{{i}}', operator: 'less_than', rightOperand: '10', maxIterations: 100 } },
      { type: 'for_loop', title: 'Loop For', desc: 'Itera sobre lista ou contagem', icon: '🔁', defaultData: { label: 'Loop For', loopType: 'count', countExpression: 5, itemVarName: 'item', indexVarName: 'index' } },
      { type: 'if_element_exists', title: 'Se Elemento Existir', desc: 'Desvio seletor CSS existe', icon: '👁', defaultData: { label: 'Elemento Existe?', selector: '.btn-primary', selectorType: 'css', timeoutMs: 3000 } },
      { type: 'try_catch', title: 'Tentar / Capturar', desc: 'Prevenção de falhas', icon: '🛡', defaultData: { label: 'Try/Catch', errorVarName: 'lastError' } },
      { type: 'group', title: 'Grupo de Blocos', desc: 'Agrupador visual', icon: '📁', defaultData: { label: 'Novo Grupo', childNodeIds: [] } },
    ],
  },
  {
    category: 'browser_navigation',
    categoryLabel: 'B. Navegação (Browser API)',
    categoryClass: 'cat-nav',
    items: [
      { type: 'navigate', title: 'Ir para Página', desc: 'Navega para URL', icon: '🌐', defaultData: { label: 'Navegar', url: 'https://', waitUntil: 'load' } },
      { type: 'tab_action', title: 'Ações de Aba', desc: 'Nova, trocar, fechar', icon: '📑', defaultData: { label: 'Aba', action: 'new_tab', url: 'https://google.com', active: true } },
      { type: 'history_navigation', title: 'Histórico', desc: 'Voltar, avançar, recarregar', icon: '⏮', defaultData: { label: 'Histórico', action: 'reload' } },
    ],
  },
  {
    category: 'dom_interaction',
    categoryLabel: 'C. Interação com DOM',
    categoryClass: 'cat-dom',
    items: [
      { type: 'click_element', title: 'Clicar em Elemento', desc: 'Clique simples, duplo ou dir.', icon: '👆', defaultData: { label: 'Clicar', selector: 'button', selectorType: 'css', clickType: 'single' } },
      { type: 'type_input', title: 'Digitar Texto', desc: 'Simulação humana ou colar', icon: '⌨', defaultData: { label: 'Digitar', selector: 'input', selectorType: 'css', text: '', mode: 'human_typing' } },
      { type: 'press_key', title: 'Enviar Tecla', desc: 'Enter, Esc, Tab, etc.', icon: '↵', defaultData: { label: 'Pressionar Tecla', key: 'Enter' } },
      { type: 'hover_focus', title: 'Foco / Hover', desc: 'Passar mouse ou focar', icon: '🎯', defaultData: { label: 'Foco/Hover', selector: '', selectorType: 'css', action: 'hover' } },
      { type: 'scroll', title: 'Rolar Página', desc: 'Topo, final ou elemento', icon: '📜', defaultData: { label: 'Rolar', target: 'bottom', smooth: true } },
      { type: 'wait_for_element', title: 'Esperar Elemento', desc: 'Aguardar visível ou clicável', icon: '⏳', defaultData: { label: 'Esperar', selector: '', selectorType: 'css', state: 'visible', timeoutMs: 10000 } },
    ],
  },
  {
    category: 'data_network',
    categoryLabel: 'D. Dados, Variáveis e Rede',
    categoryClass: 'cat-data',
    items: [
      { type: 'http_request', title: 'Requisição HTTP', desc: 'GET, POST, Headers, Body', icon: '📡', defaultData: { label: 'HTTP Request', url: 'https://api.example.com', method: 'GET', responseType: 'json', saveResponseToVar: 'apiResponse' } },
      { type: 'set_variable', title: 'Definir Variável', desc: 'Cria/modifica no estado', icon: '📦', defaultData: { label: 'Set Variable', varName: 'meuDado', evaluationType: 'literal', valueExpression: 'valor' } },
      { type: 'extract_data', title: 'Extrair Texto/Atrib.', desc: 'innerText, href, src', icon: '✂', defaultData: { label: 'Extrair', selector: 'h1', selectorType: 'css', extractType: 'innerText', saveToVar: 'extractedHeading' } },
      { type: 'scrape_list', title: 'Extrair Lista', desc: 'Scraping de múltiplos itens', icon: '📋', defaultData: { label: 'Scrape Lista', selector: '.card', selectorType: 'css', fields: [{ name: 'titulo', subSelector: '.title', extractType: 'innerText' }], saveToVar: 'items' } },
      { type: 'export_file', title: 'Exportar Arquivo', desc: 'Salvar em .csv ou .json', icon: '💾', defaultData: { label: 'Exportar', sourceVar: 'items', format: 'json', filename: 'dados.json' } },
    ],
  },
  {
    category: 'injection_customization',
    categoryLabel: 'E. Injeção e Customização',
    categoryClass: 'cat-inject',
    items: [
      { type: 'inject_javascript', title: 'Injetar JavaScript', desc: 'Roda no Content ou Background', icon: '⚡', defaultData: { label: 'Injetar JS', code: 'console.log("Olá Mundo");', context: 'content_script' } },
      { type: 'inject_html', title: 'Injetar HTML', desc: 'Insere elementos na página', icon: '🧩', defaultData: { label: 'Injetar HTML', html: '<div class="banner">Aviso</div>', targetSelector: 'body', position: 'beforeend' } },
      { type: 'inject_css', title: 'Injetar CSS', desc: 'Aplica estilos customizados', icon: '🎨', defaultData: { label: 'Injetar CSS', css: 'body { background: #000 !important; }', target: 'page' } },
      { type: 'web_component', title: 'Elementos Web', desc: 'HTML + CSS + JS unificados', icon: '📦', defaultData: { label: 'Web Component', html: '<button id="btn">Ok</button>', css: 'button { color: red; }', js: '', containerId: 'custom-widget', mode: 'shadow_dom' } },
      { type: 'note', title: 'Nota / Comentário', desc: 'Anotação visual no editor', icon: '📝', defaultData: { label: 'Nota', content: 'Descreva seu fluxo aqui...' } },
    ],
  },
];

class VisualEditorApp {
  private graph: WebAutomationGraph;
  private selectedNodeId?: string;
  private connectingFromNodeId?: string;
  private isDraggingNode = false;
  private dragOffset = { x: 0, y: 0 };

  constructor() {
    this.graph = JSON.parse(JSON.stringify(DEFAULT_AUTOMATION));

    this.initUI();
    this.initEvents();
    this.render();
  }

  private initUI(): void {
    // Renderizar biblioteca de blocos na lateral
    const container = document.getElementById('categoriesContainer')!;
    container.innerHTML = '';

    BLOCK_CATALOG.forEach((cat) => {
      const groupEl = document.createElement('div');
      groupEl.className = `category-group ${cat.categoryClass}`;
      groupEl.innerHTML = `<h4>${cat.categoryLabel}</h4>`;

      cat.items.forEach((item) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'block-item';
        itemEl.draggable = true;
        itemEl.dataset.type = item.type;
        itemEl.dataset.category = cat.category;
        itemEl.innerHTML = `
          <div class="block-item-icon">${item.icon}</div>
          <div>
            <div class="block-item-title">${item.title}</div>
            <div class="block-item-desc">${item.desc}</div>
          </div>
        `;

        itemEl.addEventListener('dragstart', (e) => {
          e.dataTransfer?.setData('application/json', JSON.stringify(item));
        });

        groupEl.appendChild(itemEl);
      });

      container.appendChild(groupEl);
    });
  }

  private initEvents(): void {
    const canvas = document.getElementById('canvasContainer')!;

    // Drag & Drop do bloco para o canvas
    canvas.addEventListener('dragover', (e) => e.preventDefault());
    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      const raw = e.dataTransfer?.getData('application/json');
      if (!raw) return;

      const item = JSON.parse(raw);
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - 100;
      const y = e.clientY - rect.top - 30;

      const newNode: AnyAutomationNode = {
        id: `node_${Date.now()}`,
        type: item.type,
        category: item.category || 'flow_logic',
        position: { x: Math.max(20, x), y: Math.max(20, y) },
        data: { ...item.defaultData },
      };

      this.graph.nodes.push(newNode);
      this.selectedNodeId = newNode.id;
      this.render();
      this.renderInspector();
    });

    // Deselecionar ao clicar no fundo
    canvas.addEventListener('mousedown', (e) => {
      if (e.target === canvas || (e.target as HTMLElement).id === 'edgesLayer') {
        this.selectedNodeId = undefined;
        this.render();
        this.renderInspector();
      }
    });

    // Botões do Cabeçalho
    document.getElementById('btnRunFlow')?.addEventListener('click', () => this.runCurrentFlow());
    document.getElementById('btnExportJson')?.addEventListener('click', () => this.exportJson());
    document.getElementById('btnImportJson')?.addEventListener('click', () => {
      document.getElementById('jsonFileInput')?.click();
    });

    document.getElementById('jsonFileInput')?.addEventListener('change', (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          this.graph = JSON.parse(evt.target?.result as string);
          this.selectedNodeId = undefined;
          this.render();
          this.renderInspector();
        } catch (err: any) {
          alert('Erro ao carregar JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    });

    // Abas do Inspetor
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e: any) => {
        document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
        btn.classList.add('active');
        const tabId = btn.dataset.tab;
        if (tabId === 'properties') document.getElementById('tabProperties')?.classList.add('active');
        if (tabId === 'state') document.getElementById('tabState')?.classList.add('active');
        if (tabId === 'logs') document.getElementById('tabLogs')?.classList.add('active');
      });
    });

    // Limpar logs
    document.getElementById('btnClearLogs')?.addEventListener('click', () => {
      const consoleEl = document.getElementById('logsConsole');
      if (consoleEl) consoleEl.innerHTML = '';
    });

    // Ouvir mensagens de progresso do Background Service Worker
    chrome.runtime?.onMessage?.addListener((msg) => {
      if (msg.type === 'NODE_START') {
        this.highlightActiveNode(msg.nodeId);
      } else if (msg.type === 'NODE_COMPLETE') {
        this.unhighlightActiveNode(msg.nodeId);
      } else if (msg.type === 'LOG') {
        this.appendLog(msg.log);
      } else if (msg.type === 'STATUS_CHANGE') {
        this.appendLog({ timestamp: Date.now(), level: 'info', message: `Status alterado para: ${msg.status}` });
      }
    });
  }

  private render(): void {
    const nodesLayer = document.getElementById('nodesLayer')!;
    nodesLayer.innerHTML = '';

    this.graph.nodes.forEach((node) => {
      const nodeEl = document.createElement('div');
      nodeEl.className = `graph-node ${this.selectedNodeId === node.id ? 'selected' : ''}`;
      nodeEl.style.left = `${node.position.x}px`;
      nodeEl.style.top = `${node.position.y}px`;
      nodeEl.id = `rendered_${node.id}`;

      nodeEl.innerHTML = `
        <div class="node-handle node-handle-input" data-node-id="${node.id}" data-handle-type="input"></div>
        <div class="graph-node-header">
          <span class="graph-node-title">${node.data.label || node.type}</span>
          <button class="btn-xs delete-node-btn" data-id="${node.id}">✕</button>
        </div>
        <div class="graph-node-body">
          Tipo: <strong>${node.type}</strong>
        </div>
        <div class="node-handle node-handle-output" data-node-id="${node.id}" data-handle-type="output"></div>
      `;

      // Mover nó
      nodeEl.addEventListener('mousedown', (e) => {
        if ((e.target as HTMLElement).classList.contains('delete-node-btn')) return;
        if ((e.target as HTMLElement).classList.contains('node-handle')) return;

        this.selectedNodeId = node.id;
        this.isDraggingNode = true;
        this.dragOffset = {
          x: e.clientX - node.position.x,
          y: e.clientY - node.position.y,
        };
        this.render();
        this.renderInspector();

        const onMouseMove = (moveEvt: MouseEvent) => {
          if (!this.isDraggingNode) return;
          node.position.x = Math.max(10, moveEvt.clientX - this.dragOffset.x);
          node.position.y = Math.max(10, moveEvt.clientY - this.dragOffset.y);
          nodeEl.style.left = `${node.position.x}px`;
          nodeEl.style.top = `${node.position.y}px`;
          this.renderEdges();
        };

        const onMouseUp = () => {
          this.isDraggingNode = false;
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });

      // Conexões (Handles)
      const outHandle = nodeEl.querySelector('.node-handle-output');
      outHandle?.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        this.connectingFromNodeId = node.id;
      });

      const inHandle = nodeEl.querySelector('.node-handle-input');
      inHandle?.addEventListener('mouseup', (e) => {
        e.stopPropagation();
        if (this.connectingFromNodeId && this.connectingFromNodeId !== node.id) {
          const edgeId = `e_${this.connectingFromNodeId}_${node.id}`;
          if (!this.graph.edges.some((edge) => edge.source === this.connectingFromNodeId && edge.target === node.id)) {
            this.graph.edges.push({
              id: edgeId,
              source: this.connectingFromNodeId,
              target: node.id,
            });
            this.renderEdges();
          }
        }
        this.connectingFromNodeId = undefined;
      });

      // Deletar nó
      nodeEl.querySelector('.delete-node-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.graph.nodes = this.graph.nodes.filter((n) => n.id !== node.id);
        this.graph.edges = this.graph.edges.filter((ed) => ed.source !== node.id && ed.target !== node.id);
        if (this.selectedNodeId === node.id) this.selectedNodeId = undefined;
        this.render();
        this.renderInspector();
      });

      nodesLayer.appendChild(nodeEl);
    });

    this.renderEdges();
  }

  private renderEdges(): void {
    const svg = document.getElementById('edgesLayer')!;
    svg.innerHTML = '';

    this.graph.edges.forEach((edge) => {
      const sourceNode = this.graph.nodes.find((n) => n.id === edge.source);
      const targetNode = this.graph.nodes.find((n) => n.id === edge.target);
      if (!sourceNode || !targetNode) return;

      const x1 = sourceNode.position.x + 210;
      const y1 = sourceNode.position.y + 45;
      const x2 = targetNode.position.x;
      const y2 = targetNode.position.y + 45;

      const dx = Math.abs(x2 - x1) * 0.5;
      const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#6366f1');
      path.setAttribute('stroke-width', '2.5');
      path.setAttribute('stroke-linecap', 'round');

      svg.appendChild(path);
    });
  }

  private renderInspector(): void {
    const noSelect = document.getElementById('noSelectionMessage')!;
    const form = document.getElementById('nodePropertiesForm') as HTMLFormElement;

    if (!this.selectedNodeId) {
      noSelect.classList.remove('hidden');
      form.classList.add('hidden');
      return;
    }

    const node = this.graph.nodes.find((n) => n.id === this.selectedNodeId);
    if (!node) return;

    noSelect.classList.add('hidden');
    form.classList.remove('hidden');
    form.innerHTML = '';

    // Campo Label Comum
    const labelGroup = document.createElement('div');
    labelGroup.className = 'form-group';
    labelGroup.innerHTML = `
      <label>Título / Rótulo</label>
      <input type="text" id="prop_label" value="${node.data.label || ''}" />
    `;
    labelGroup.querySelector('input')?.addEventListener('input', (e: any) => {
      node.data.label = e.target.value;
      const renderedHeader = document.querySelector(`#rendered_${node.id} .graph-node-title`);
      if (renderedHeader) renderedHeader.textContent = e.target.value || node.type;
    });
    form.appendChild(labelGroup);

    // Campos específicos para cada tipo
    Object.keys(node.data).forEach((key) => {
      if (key === 'label') return;

      const val = (node.data as any)[key];
      const group = document.createElement('div');
      group.className = 'form-group';

      if (typeof val === 'boolean') {
        group.innerHTML = `
          <label style="display:flex;align-items:center;gap:8px;">
            <input type="checkbox" id="prop_${key}" ${val ? 'checked' : ''} />
            ${key}
          </label>
        `;
        group.querySelector('input')?.addEventListener('change', (e: any) => {
          (node.data as any)[key] = e.target.checked;
        });
      } else if (typeof val === 'string' && val.length > 50) {
        group.innerHTML = `
          <label>${key}</label>
          <textarea id="prop_${key}">${val}</textarea>
        `;
        group.querySelector('textarea')?.addEventListener('input', (e: any) => {
          (node.data as any)[key] = e.target.value;
        });
      } else {
        group.innerHTML = `
          <label>${key}</label>
          <input type="${typeof val === 'number' ? 'number' : 'text'}" id="prop_${key}" value="${val ?? ''}" />
        `;
        group.querySelector('input')?.addEventListener('input', (e: any) => {
          (node.data as any)[key] = typeof val === 'number' ? Number(e.target.value) : e.target.value;
        });
      }

      form.appendChild(group);
    });
  }

  private async runCurrentFlow(): Promise<void> {
    this.appendLog({ timestamp: Date.now(), level: 'info', message: 'Iniciando execução pelo editor...' });

    // Alternar para aba de logs
    document.querySelector('.tab-btn[data-tab="logs"]')?.dispatchEvent(new Event('click'));

    if (chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({
        action: 'EXECUTE_AUTOMATION',
        payload: { graph: this.graph },
      }, (res) => {
        if (res?.success) {
          this.appendLog({ timestamp: Date.now(), level: 'info', message: 'Execução concluída!' });
          this.renderVariables(res.variables || {});
        } else if (res?.error) {
          this.appendLog({ timestamp: Date.now(), level: 'error', message: res.error });
        }
      });
    } else {
      this.appendLog({ timestamp: Date.now(), level: 'warn', message: 'Ambiente de desenvolvimento puro (API do Chrome mockada).' });
    }
  }

  private highlightActiveNode(nodeId: string): void {
    document.querySelectorAll('.graph-node').forEach((el) => el.classList.remove('active-executing'));
    document.getElementById(`rendered_${nodeId}`)?.classList.add('active-executing');
  }

  private unhighlightActiveNode(nodeId: string): void {
    document.getElementById(`rendered_${nodeId}`)?.classList.remove('active-executing');
  }

  private appendLog(log: { timestamp: number; level: string; message: string }): void {
    const consoleEl = document.getElementById('logsConsole');
    if (!consoleEl) return;
    const time = new Date(log.timestamp).toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry ${log.level}`;
    entry.textContent = `[${time}] [${log.level.toUpperCase()}] ${log.message}`;
    consoleEl.appendChild(entry);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  private renderVariables(vars: Record<string, any>): void {
    const varEl = document.getElementById('variablesList');
    if (!varEl) return;
    varEl.innerHTML = `<pre style="font-family: var(--font-mono); font-size: 11px;">${JSON.stringify(vars, null, 2)}</pre>`;
  }

  private exportJson(): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.graph, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${this.graph.metadata.name.replace(/\s+/g, '_')}.webautomation.json`);
    dlAnchor.click();
  }
}

// Inicializar aplicação
window.addEventListener('DOMContentLoaded', () => {
  new VisualEditorApp();
});
