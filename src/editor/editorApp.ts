/**
 * WebAutomations Visual Flow Studio & Dashboard
 * Orquestrador central modularizado do editor visual
 */

import { WebAutomationGraph } from '../../../BibliotecaDeDev/src/types/schema';
import { DEFAULT_AUTOMATION } from '../defaultAutomation';
import { BLOCK_CATALOG } from './modules/blockCatalog';
import { ColorPickerManager } from './modules/colorPickerManager';
import { InspectorManager } from './modules/inspectorManager';
import { CanvasManager } from './modules/canvasManager';
import { WorkflowTabManager } from './modules/tabManager';
import { showToast, showModalDialog, sanitizeGraph } from './modules/editorUtils';

class VisualEditorApp {
  private currentView: 'dashboard' | 'studio' = 'dashboard';
  private graph: WebAutomationGraph;
  private selectedNodeId?: string;

  private colorPickerManager: ColorPickerManager;
  private inspectorManager: InspectorManager;
  private canvasManager: CanvasManager;
  private tabManager: WorkflowTabManager;

  constructor() {
    this.graph = JSON.parse(JSON.stringify(DEFAULT_AUTOMATION));

    // 1. Inicializar ColorPickerManager
    this.colorPickerManager = new ColorPickerManager({
      getGraph: () => this.graph,
      showToast: (msg, type) => showToast(msg, type),
    });

    // 2. Inicializar InspectorManager
    this.inspectorManager = new InspectorManager(
      {
        getGraph: () => this.graph,
        getSelectedNodeId: () => this.selectedNodeId,
        onNodeDataChanged: () => {
          this.canvasManager.render();
        },
        onRenderGraph: () => {
          this.canvasManager.render();
        },
        showToast: (msg, type) => showToast(msg, type),
      },
      this.colorPickerManager
    );

    // 3. Inicializar CanvasManager
    this.canvasManager = new CanvasManager({
      getGraph: () => this.graph,
      getSelectedNodeId: () => this.selectedNodeId,
      setSelectedNodeId: (nodeId) => {
        this.selectedNodeId = nodeId;
      },
      onNodeSelect: (nodeId) => {
        this.selectedNodeId = nodeId;
        this.inspectorManager.renderInspector();
      },
      showToast: (msg, type) => showToast(msg, type),
      showModalDialog: (title, msg, icon) => showModalDialog(title, msg, icon),
    });

    // 4. Inicializar WorkflowTabManager
    this.tabManager = new WorkflowTabManager({
      onOpenFlow: (flow) => this.openStudio(flow),
      onViewChange: (view) => this.switchView(view),
      onRunFlowDirectly: (flow) => this.runFlowDirectly(flow),
      showToast: (msg, type) => showToast(msg, type),
    });

    this.initBlockCatalogUI();
    this.initGlobalEvents();
    this.tabManager.loadFromStorage();
  }

  private switchView(view: 'dashboard' | 'studio'): void {
    this.currentView = view;
    document.getElementById('viewDashboard')?.classList.toggle('active', view === 'dashboard');
    document.getElementById('viewStudio')?.classList.toggle('active', view === 'studio');

    if (view === 'dashboard') {
      this.tabManager.setActiveTabId('dashboard');
      if (window.location.search) {
        window.history.replaceState({}, '', window.location.pathname);
      }
      this.tabManager.loadFromStorage(false);
    }
    this.tabManager.renderTabs();
  }

  private openStudio(graph: WebAutomationGraph): void {
    this.graph = JSON.parse(JSON.stringify(graph));
    this.selectedNodeId = undefined;

    this.tabManager.registerOpenTab(this.graph);

    const titleInput = document.getElementById('flowTitleInput') as HTMLInputElement;
    if (titleInput) titleInput.value = this.graph.metadata?.name || 'Minha Automação';

    if (this.graph.metadata?.id) {
      const newUrl = `${window.location.pathname}?flowId=${encodeURIComponent(this.graph.metadata.id)}`;
      window.history.replaceState({}, '', newUrl);
    }

    this.switchView('studio');
    this.canvasManager.updateCanvasTransform();
    this.canvasManager.render();
    this.inspectorManager.renderInspector();
    this.tabManager.renderTabs();
  }

  private createNewFlow(): void {
    const savedList = this.tabManager.getSavedAutomations();
    const newGraph: WebAutomationGraph = {
      schemaVersion: '1.0.0',
      metadata: {
        id: `auto_${Date.now()}`,
        name: `Novo Fluxo ${savedList.length + 1}`,
        description: 'Fluxo criado no Visual Flow Studio',
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      settings: { stopOnError: true, defaultTimeoutMs: 15000, logLevel: 'info', parallelBranchesEnabled: false },
      variables: {},
      nodes: [
        {
          id: `start_${Date.now()}`,
          type: 'start',
          category: 'flow_logic',
          position: { x: 120, y: 180 },
          data: { label: 'Início', triggerType: 'manual' },
        },
      ],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    };

    savedList.push(newGraph);
    if (chrome.storage?.local) {
      chrome.storage.local.set({ web_automations: savedList });
    }

    this.openStudio(newGraph);
    showToast('Novo fluxo criado!', 'info');
  }

  private async saveCurrentFlow(): Promise<void> {
    const titleInput = document.getElementById('flowTitleInput') as HTMLInputElement;
    if (titleInput && titleInput.value.trim()) {
      this.graph.metadata.name = titleInput.value.trim();
    }
    this.graph.metadata.updatedAt = new Date().toISOString();

    // Sanitizar para remover dados de ícones antigos
    const cleanGraph = sanitizeGraph(this.graph);
    this.graph = cleanGraph;

    this.tabManager.updateFlowInTabsAndSaved(cleanGraph);

    if (chrome.storage?.local) {
      await chrome.storage.local.set({ web_automations: this.tabManager.getSavedAutomations() });
    }

    const saveBtnLabel = document.getElementById('saveButtonLabel');
    if (saveBtnLabel) saveBtnLabel.textContent = 'Salvo! ✓';
    setTimeout(() => {
      if (saveBtnLabel) saveBtnLabel.textContent = 'Salvar';
    }, 2000);

    this.tabManager.renderTabs();
    showToast(`Automação "${this.graph.metadata.name}" salva com sucesso!`, 'success');
  }

  private async runFlowDirectly(graph: WebAutomationGraph): Promise<void> {
    showToast(`Executando "${graph.metadata?.name || 'Automação'}" no navegador...`, 'info');

    if (chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage(
        {
          action: 'EXECUTE_AUTOMATION',
          payload: { graph },
        },
        (res) => {
          if (res?.success) {
            showToast(`"${graph.metadata?.name || 'Automação'}" finalizada com sucesso!`, 'success');
          } else if (res?.error) {
            showToast(`Erro ao executar: ${res.error}`, 'error');
          }
        }
      );
    } else {
      showToast('Ambiente sem suporte a runtime.sendMessage.', 'error');
    }
  }

  private async runCurrentFlow(): Promise<void> {
    showToast('Iniciando execução do fluxo...', 'info');

    if (chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage(
        {
          action: 'EXECUTE_AUTOMATION',
          payload: { graph: this.graph },
        },
        (res) => {
          if (res?.success) {
            this.appendLog({ timestamp: Date.now(), level: 'info', message: 'Execução concluída com sucesso!' });
            this.renderVariables(res.variables || {});
            showToast('Fluxo executado com sucesso!', 'success');
          } else if (res?.error) {
            this.appendLog({ timestamp: Date.now(), level: 'error', message: res.error });
            showToast(`Erro na execução: ${res.error}`, 'error');
          }
        }
      );
    } else {
      this.appendLog({ timestamp: Date.now(), level: 'warn', message: 'Ambiente de desenvolvimento (API Chrome mockada).' });
    }
  }

  private exportJson(): void {
    const cleanGraph = sanitizeGraph(this.graph);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cleanGraph, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${(this.graph.metadata?.name || 'automacao').replace(/\s+/g, '_')}.webautomation.json`);
    dlAnchor.click();
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

  private initBlockCatalogUI(): void {
    const container = document.getElementById('categoriesContainer');
    if (!container) return;
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
        itemEl.title = 'Clique para adicionar ou arraste para o canvas';
        itemEl.innerHTML = `
          <div class="block-item-icon">${item.icon}</div>
          <div>
            <div class="block-item-title">${item.title}</div>
            <div class="block-item-desc">${item.desc}</div>
          </div>
        `;

        itemEl.addEventListener('click', () => {
          this.canvasManager.addNodeToCanvas(item);
        });

        itemEl.addEventListener('dragstart', (e) => {
          e.dataTransfer?.setData('application/json', JSON.stringify(item));
        });

        groupEl.appendChild(itemEl);
      });

      container.appendChild(groupEl);
    });
  }

  private initGlobalEvents(): void {
    // Botões do Dashboard e Topo
    document.getElementById('btnCreateNewFlow')?.addEventListener('click', () => this.createNewFlow());
    document.getElementById('btnTabNewFlow')?.addEventListener('click', () => this.createNewFlow());
    document.getElementById('btnDashboardImport')?.addEventListener('click', () => {
      document.getElementById('jsonFileInput')?.click();
    });

    document.getElementById('dashboardSearchInput')?.addEventListener('input', (e: any) => {
      this.tabManager.renderDashboard(e.target.value);
    });

    document.getElementById('blockSearchInput')?.addEventListener('input', (e: any) => {
      const q = (e.target.value || '').toLowerCase().trim();
      document.querySelectorAll('.block-item').forEach((item) => {
        const title = (item.querySelector('.block-item-title')?.textContent || '').toLowerCase();
        const desc = (item.querySelector('.block-item-desc')?.textContent || '').toLowerCase();
        const match = title.includes(q) || desc.includes(q);
        (item as HTMLElement).style.display = match ? 'flex' : 'none';
      });
    });

    document.getElementById('btnSaveFlow')?.addEventListener('click', () => this.saveCurrentFlow());

    // Atalho Ctrl+S para salvar e Delete para apagar bloco selecionado
    window.addEventListener('keydown', (e) => {
      // 1. Salvar com Ctrl+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (this.currentView === 'studio') {
          this.saveCurrentFlow();
        }
        return;
      }

      // 2. Apagar bloco selecionado ao apertar Delete ou Backspace (fora de campos de digitação)
      if (e.key === 'Delete' || e.key === 'Del') {
        const target = e.target as HTMLElement;
        const isEditingText = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
        if (!isEditingText && this.currentView === 'studio' && this.selectedNodeId) {
          e.preventDefault();
          this.canvasManager.deleteNode(this.selectedNodeId);
        }
      }
    });

    // Navegação Voltar/Avançar
    window.addEventListener('popstate', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const flowId = urlParams.get('flowId');
      if (flowId) {
        const matched = this.tabManager.getSavedAutomations().find((a) => a.metadata?.id === flowId);
        if (matched) {
          this.openStudio(matched);
        }
      } else {
        this.switchView('dashboard');
      }
    });

    document.getElementById('btnClearCanvas')?.addEventListener('click', () => {
      if (confirm('Deseja limpar todos os nós e ligações deste fluxo?')) {
        this.graph.nodes = [];
        this.graph.edges = [];
        this.selectedNodeId = undefined;
        this.canvasManager.render();
        this.inspectorManager.renderInspector();
        showToast('Canvas limpo.', 'info');
      }
    });

    document.getElementById('btnRunFlow')?.addEventListener('click', () => this.runCurrentFlow());
    document.getElementById('btnExportJson')?.addEventListener('click', () => this.exportJson());
    document.getElementById('btnOpenFlowPalette')?.addEventListener('click', () => {
      this.colorPickerManager.openFlowPaletteModal(() => {
        this.canvasManager.render();
      });
    });

    document.getElementById('btnImportJson')?.addEventListener('click', () => {
      document.getElementById('jsonFileInput')?.click();
    });

    document.getElementById('jsonFileInput')?.addEventListener('change', (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const imported = JSON.parse(evt.target?.result as string);
          if (imported.nodes && imported.edges) {
            this.openStudio(imported);
            this.saveCurrentFlow();
            showToast('Fluxo importado com sucesso!', 'success');
          } else {
            alert('Formato de arquivo inválido. Certifique-se de que é um .webautomation.json válido.');
          }
        } catch (err: any) {
          alert('Erro ao carregar JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    });

    // Sidebars colapsáveis e redimensionáveis
    const sidebarLeft = document.getElementById('sidebarLibrary');
    const sidebarRight = document.getElementById('sidebarInspector');
    const resizerLeft = document.getElementById('resizerLeft');
    const resizerRight = document.getElementById('resizerRight');
    const btnToggleLeft = document.getElementById('btnToggleSidebarLeft');
    const btnToggleRight = document.getElementById('btnToggleSidebarRight');
    const btnActivityBlocks = document.getElementById('btnActivityBlocks');

    const toggleSidebarLeft = (collapse?: boolean) => {
      if (!sidebarLeft) return;
      const shouldCollapse = collapse !== undefined ? collapse : !sidebarLeft.classList.contains('collapsed');
      sidebarLeft.classList.toggle('collapsed', shouldCollapse);
      btnActivityBlocks?.classList.toggle('active', !shouldCollapse);
      if (resizerLeft) resizerLeft.style.display = shouldCollapse ? 'none' : 'block';
    };

    btnActivityBlocks?.addEventListener('click', () => toggleSidebarLeft());
    btnToggleLeft?.addEventListener('click', () => toggleSidebarLeft(true));
    btnToggleRight?.addEventListener('click', () => {
      this.selectedNodeId = undefined;
      document.querySelectorAll('.graph-node').forEach((el) => el.classList.remove('selected'));
      this.inspectorManager.renderInspector();
    });

    // Resizer Left (Biblioteca de Blocos)
    if (resizerLeft && sidebarLeft) {
      let isResizingLeft = false;
      resizerLeft.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        isResizingLeft = true;
        resizerLeft.classList.add('resizing');
        document.body.classList.add('is-resizing-active');

        const onMouseMove = (moveEvent: MouseEvent) => {
          if (!isResizingLeft) return;
          moveEvent.preventDefault();
          moveEvent.stopPropagation();
          const newWidth = Math.max(200, Math.min(520, moveEvent.clientX));
          sidebarLeft.style.width = `${newWidth}px`;
        };

        const onMouseUp = (upEvent: MouseEvent) => {
          if (!isResizingLeft) return;
          upEvent.preventDefault();
          upEvent.stopPropagation();
          isResizingLeft = false;
          resizerLeft.classList.remove('resizing');
          document.body.classList.remove('is-resizing-active');
          window.removeEventListener('mousemove', onMouseMove, true);
          window.removeEventListener('mouseup', onMouseUp, true);
        };

        window.addEventListener('mousemove', onMouseMove, true);
        window.addEventListener('mouseup', onMouseUp, true);
      });
    }

    // Resizer Right (Propriedades do Bloco)
    if (resizerRight && sidebarRight) {
      let isResizingRight = false;
      resizerRight.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        isResizingRight = true;
        resizerRight.classList.add('resizing');
        document.body.classList.add('is-resizing-active');

        const onMouseMove = (moveEvent: MouseEvent) => {
          if (!isResizingRight) return;
          moveEvent.preventDefault();
          moveEvent.stopPropagation();
          const newWidth = Math.max(240, Math.min(650, window.innerWidth - moveEvent.clientX));
          sidebarRight.style.width = `${newWidth}px`;
        };

        const onMouseUp = (upEvent: MouseEvent) => {
          if (!isResizingRight) return;
          upEvent.preventDefault();
          upEvent.stopPropagation();
          isResizingRight = false;
          resizerRight.classList.remove('resizing');
          document.body.classList.remove('is-resizing-active');
          window.removeEventListener('mousemove', onMouseMove, true);
          window.removeEventListener('mouseup', onMouseUp, true);
        };

        window.addEventListener('mousemove', onMouseMove, true);
        window.addEventListener('mouseup', onMouseUp, true);
      });
    }

    // Runtime messages
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
}

// Inicializar aplicação
window.addEventListener('DOMContentLoaded', () => {
  new VisualEditorApp();
});
