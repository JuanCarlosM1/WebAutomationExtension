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
import { showToast, showModalDialog, sanitizeGraph, DialogMenu } from './modules/editorUtils';
import { FlowSettingsModal } from './modules/flowSettingsModal';
import { HtmlElementAnalyzer } from './modules/htmlElementAnalyzer';

class VisualEditorApp {
  private currentView: 'dashboard' | 'studio' | 'settings' = 'dashboard';
  private graph: WebAutomationGraph;
  private selectedNodeId?: string;

  private colorPickerManager: ColorPickerManager;
  private inspectorManager: InspectorManager;
  private canvasManager: CanvasManager;
  private tabManager: WorkflowTabManager;

  constructor() {
    this.graph = JSON.parse(JSON.stringify(DEFAULT_AUTOMATION));
    this.graph.metadata.name = this.cleanFlowName(this.graph.metadata.name);

    // 1. Inicializar ColorPickerManager
    this.colorPickerManager = new ColorPickerManager(
      () => this.graph,
      (msg, type) => showToast(msg, type),
      () => {
        this.canvasManager.render();
      }
    );

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
        if (nodeId) {
          this.openInspectorSidebar();
        } else {
          this.inspectorManager.renderInspector();
          this.ensureSidebarOpen();
        }
      },
      showToast: (msg, type) => showToast(msg, type),
      showModalDialog: (title, msg, icon) => showModalDialog(title, msg, icon),
      onOpenNodeModal: (nodeId) => {
        this.inspectorManager.openExpandedModal(nodeId);
      },
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
    this.initSettingsEvents();
    this.tabManager.loadFromStorage();
  }

  public cleanFlowName(name?: string): string {
    return (name || 'Minha Automação').replace(/\.(webautomation\.json|json)$/i, '').trim() || 'Minha Automação';
  }

  private switchView(view: 'dashboard' | 'studio' | 'settings'): void {
    this.currentView = view;
    document.getElementById('viewDashboard')?.classList.toggle('active', view === 'dashboard');
    document.getElementById('viewStudio')?.classList.toggle('active', view === 'studio' || view === 'settings');

    const mainWorkspace = document.getElementById('mainWorkspace');
    const canvasContainer = document.getElementById('canvasContainer');
    const viewSettings = document.getElementById('viewSettings');
    const btnActivitySettings = document.getElementById('btnActivitySettings');
    const activityBarLeft = document.getElementById('activityBarLeft');
    const sidebarLeft = document.getElementById('sidebarLibrary');
    const sidebarRight = document.getElementById('sidebarInspector');
    const sidebarColors = document.getElementById('sidebarColors');
    const resizerLeft = document.getElementById('resizerLeft');

    if (view === 'settings') {
      mainWorkspace?.classList.add('settings-mode');
      if (canvasContainer) canvasContainer.style.display = 'none';
      if (viewSettings) {
        viewSettings.style.display = 'block';
        viewSettings.classList.add('active');
      }
      if (activityBarLeft) activityBarLeft.style.display = 'none';
      if (sidebarLeft) sidebarLeft.style.display = 'none';
      if (sidebarRight) sidebarRight.style.display = 'none';
      if (sidebarColors) sidebarColors.style.display = 'none';
      if (resizerLeft) resizerLeft.style.display = 'none';

      btnActivitySettings?.classList.add('active');
      this.loadSettingsUI();
      window.history.replaceState({}, '', `${window.location.pathname}?tab=settings`);
    } else {
      mainWorkspace?.classList.remove('settings-mode');
      if (canvasContainer) canvasContainer.style.display = '';
      if (viewSettings) {
        viewSettings.style.display = 'none';
        viewSettings.classList.remove('active');
      }
      if (activityBarLeft) activityBarLeft.style.display = '';
      if (sidebarLeft) sidebarLeft.style.display = '';
      if (sidebarRight) sidebarRight.style.display = '';
      if (sidebarColors) sidebarColors.style.display = '';
      if (resizerLeft) resizerLeft.style.display = '';

      btnActivitySettings?.classList.remove('active');
      if (view === 'studio') {
        this.ensureSidebarOpen();
      }
    }

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
    if (this.graph.metadata?.name) {
      this.graph.metadata.name = this.cleanFlowName(this.graph.metadata.name);
    }
    this.selectedNodeId = undefined;

    this.tabManager.registerOpenTab(this.graph);

    const titleInput = document.getElementById('flowTitleInput') as HTMLInputElement;
    if (titleInput) titleInput.value = this.cleanFlowName(this.graph.metadata?.name);

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
      this.graph.metadata.name = this.cleanFlowName(titleInput.value.trim());
      titleInput.value = this.graph.metadata.name;
    }
    this.graph.metadata.updatedAt = new Date().toISOString();

    // Sanitizar para remover dados de ícones antigos
    const cleanGraph = sanitizeGraph(this.graph);
    this.graph = cleanGraph;

    this.tabManager.updateFlowInTabsAndSaved(cleanGraph);

    if (chrome.storage?.local) {
      await chrome.storage.local.set({ web_automations: this.tabManager.getSavedAutomations() });
    }

    // Notificar Service Worker para sincronizar gatilhos e atualizar imediatamente os botões nas abas abertas
    if (chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({
        action: 'SAVE_AUTOMATION',
        payload: { graph: cleanGraph },
      }).catch(() => {
        // Ignorar se background estiver suspenso
      });
    }

    const saveBtnLabel = document.getElementById('saveButtonLabel');
    if (saveBtnLabel) saveBtnLabel.textContent = 'Salvo! ✓';
    setTimeout(() => {
      if (saveBtnLabel) saveBtnLabel.textContent = 'Salvar';
    }, 2000);

    this.tabManager.renderTabs();
    this.inspectorManager.renderInspector();
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
    const safeName = (this.cleanFlowName(cleanGraph.metadata?.name) || 'automacao').replace(/\s+/g, '_');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cleanGraph, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${safeName}.webautomation.json`);
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
    document.getElementById('btnTabNewFlow')?.addEventListener('click', () => {
      this.tabManager.openDashboardTab();
    });
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

      // 2. Apagar bloco ou ligação (corda) selecionada ao apertar Delete ou Backspace (fora de campos de digitação)
      if (e.key === 'Delete' || e.key === 'Del' || e.key === 'Backspace') {
        const target = e.target as HTMLElement;
        const isEditingText = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
        if (!isEditingText && this.currentView === 'studio') {
          const selectedEdge = this.canvasManager.getSelectedEdgeId();
          if (selectedEdge) {
            e.preventDefault();
            this.canvasManager.deleteEdge(selectedEdge);
          } else if (this.selectedNodeId) {
            e.preventDefault();
            this.canvasManager.deleteNode(this.selectedNodeId);
          }
        }
      }
    });

    // Navegação Voltar/Avançar
    window.addEventListener('popstate', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam === 'settings') {
        this.tabManager.openSettingsTab();
        return;
      }
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

    document.getElementById('btnClearCanvas')?.addEventListener('click', async () => {
      const confirmed = await DialogMenu.confirm({
        title: 'Limpar Canvas',
        message: 'Deseja realmente limpar todos os nós e ligações deste fluxo? Esta ação não pode ser desfeita.',
        confirmText: 'Limpar Canvas',
        isDanger: true,
      });
      if (confirmed) {
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

    document.getElementById('btnOpenSettings')?.addEventListener('click', () => {
      this.tabManager.openSettingsTab();
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
            DialogMenu.alert({
              title: 'Arquivo Inválido',
              message: 'Formato de arquivo inválido. Certifique-se de que é um .webautomation.json válido.',
              type: 'error',
            });
          }
        } catch (err: any) {
          DialogMenu.alert({
            title: 'Erro ao Carregar',
            message: 'Erro ao carregar JSON: ' + err.message,
            type: 'error',
          });
        }
      };
      reader.readAsText(file);
    });

    // Sidebars colapsáveis e redimensionáveis no lado esquerdo
    const sidebarLeft = document.getElementById('sidebarLibrary');
    const sidebarRight = document.getElementById('sidebarInspector');
    const sidebarColors = document.getElementById('sidebarColors');
    const resizerLeft = document.getElementById('resizerLeft');
    const btnToggleLeft = document.getElementById('btnToggleSidebarLeft');
    const btnToggleRight = document.getElementById('btnToggleSidebarRight');
    const btnToggleColors = document.getElementById('btnToggleSidebarColors');
    const btnActivityBlocks = document.getElementById('btnActivityBlocks');
    const btnActivityInspector = document.getElementById('btnActivityInspector');
    const btnActivityColors = document.getElementById('btnActivityColors');
    const btnActivityAnalyzer = document.getElementById('btnActivityAnalyzer');
    const btnActivitySettings = document.getElementById('btnActivitySettings');
    const btnDashboardSettings = document.getElementById('btnDashboardSettings');

    // Inicializar listener de mensagens do Analisador HTML (comunicação com a página ativa)
    HtmlElementAnalyzer.initMessageListener();

    btnActivityAnalyzer?.addEventListener('click', () => {
      HtmlElementAnalyzer.open();
      HtmlElementAnalyzer.startLivePicker();
    });

    btnActivitySettings?.addEventListener('click', () => {
      this.tabManager.openSettingsTab();
    });

    btnDashboardSettings?.addEventListener('click', () => {
      this.tabManager.openSettingsTab();
    });

    btnActivityBlocks?.addEventListener('click', () => this.openBlocksSidebar());
    btnActivityInspector?.addEventListener('click', () => this.openInspectorSidebar());
    btnActivityColors?.addEventListener('click', () => this.openColorsSidebar());
    btnToggleLeft?.addEventListener('click', () => this.openBlocksSidebar());
    btnToggleColors?.addEventListener('click', () => this.openBlocksSidebar());
    btnToggleRight?.addEventListener('click', () => {
      this.selectedNodeId = undefined;
      document.querySelectorAll('.graph-node').forEach((el) => el.classList.remove('selected'));
      this.openBlocksSidebar();
    });

    document.getElementById('btnExpandInspectorModal')?.addEventListener('click', () => {
      if (this.selectedNodeId) {
        this.inspectorManager.openExpandedModal(this.selectedNodeId);
      }
    });

    // Resizer Left (Controla a largura do painel ativo à esquerda)
    if (resizerLeft) {
      let isResizing = false;
      resizerLeft.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        isResizing = true;
        resizerLeft.classList.add('resizing');
        document.body.classList.add('is-resizing-active');

        const activePanel = (sidebarColors && !sidebarColors.classList.contains('collapsed'))
          ? sidebarColors
          : (sidebarRight && !sidebarRight.classList.contains('collapsed'))
          ? sidebarRight
          : sidebarLeft;

        const onMouseMove = (moveEvent: MouseEvent) => {
          if (!isResizing) return;
          moveEvent.preventDefault();
          moveEvent.stopPropagation();
          const activityBarWidth = 48;
          const newWidth = Math.max(240, Math.min(600, moveEvent.clientX - activityBarWidth));
          const wStr = `${newWidth}px`;
          if (sidebarLeft) sidebarLeft.style.width = wStr;
          if (sidebarRight) sidebarRight.style.width = wStr;
          if (sidebarColors) sidebarColors.style.width = wStr;
        };

        const onMouseUp = (upEvent: MouseEvent) => {
          if (!isResizing) return;
          upEvent.preventDefault();
          upEvent.stopPropagation();
          isResizing = false;
          resizerLeft.classList.remove('resizing');
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
      if (msg.type === 'OPEN_SETTINGS_TAB' || msg.action === 'OPEN_SETTINGS_TAB') {
        this.tabManager.openSettingsTab();
      } else if (msg.type === 'NODE_START') {
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

  public openBlocksSidebar(): void {
    if (this.currentView === 'settings') return;
    const sidebarLeft = document.getElementById('sidebarLibrary');
    const sidebarRight = document.getElementById('sidebarInspector');
    const sidebarColors = document.getElementById('sidebarColors');
    const resizerLeft = document.getElementById('resizerLeft');
    const btnActivityBlocks = document.getElementById('btnActivityBlocks');
    const btnActivityInspector = document.getElementById('btnActivityInspector');
    const btnActivityColors = document.getElementById('btnActivityColors');

    sidebarLeft?.classList.remove('collapsed');
    btnActivityBlocks?.classList.add('active');

    sidebarRight?.classList.add('collapsed');
    btnActivityInspector?.classList.remove('active');

    sidebarColors?.classList.add('collapsed');
    btnActivityColors?.classList.remove('active');

    if (resizerLeft) resizerLeft.style.display = 'block';
  }

  public openInspectorSidebar(): void {
    if (this.currentView === 'settings') return;
    const sidebarLeft = document.getElementById('sidebarLibrary');
    const sidebarRight = document.getElementById('sidebarInspector');
    const sidebarColors = document.getElementById('sidebarColors');
    const resizerLeft = document.getElementById('resizerLeft');
    const btnActivityBlocks = document.getElementById('btnActivityBlocks');
    const btnActivityInspector = document.getElementById('btnActivityInspector');
    const btnActivityColors = document.getElementById('btnActivityColors');

    sidebarRight?.classList.remove('collapsed');
    btnActivityInspector?.classList.add('active');

    sidebarLeft?.classList.add('collapsed');
    btnActivityBlocks?.classList.remove('active');

    sidebarColors?.classList.add('collapsed');
    btnActivityColors?.classList.remove('active');

    this.inspectorManager.renderInspector();
    if (resizerLeft) resizerLeft.style.display = 'block';
  }

  public openColorsSidebar(): void {
    if (this.currentView === 'settings') return;
    const sidebarLeft = document.getElementById('sidebarLibrary');
    const sidebarRight = document.getElementById('sidebarInspector');
    const sidebarColors = document.getElementById('sidebarColors');
    const resizerLeft = document.getElementById('resizerLeft');
    const btnActivityBlocks = document.getElementById('btnActivityBlocks');
    const btnActivityInspector = document.getElementById('btnActivityInspector');
    const btnActivityColors = document.getElementById('btnActivityColors');

    sidebarColors?.classList.remove('collapsed');
    btnActivityColors?.classList.add('active');

    sidebarLeft?.classList.add('collapsed');
    btnActivityBlocks?.classList.remove('active');

    sidebarRight?.classList.add('collapsed');
    btnActivityInspector?.classList.remove('active');

    this.colorPickerManager.renderColorsSidebar();
    if (resizerLeft) resizerLeft.style.display = 'block';
  }

  public ensureSidebarOpen(): void {
    if (this.currentView === 'settings') return;
    const sidebarLeft = document.getElementById('sidebarLibrary');
    const sidebarRight = document.getElementById('sidebarInspector');
    const sidebarColors = document.getElementById('sidebarColors');

    const isLeftOpen = sidebarLeft && !sidebarLeft.classList.contains('collapsed');
    const isRightOpen = sidebarRight && !sidebarRight.classList.contains('collapsed');
    const isColorsOpen = sidebarColors && !sidebarColors.classList.contains('collapsed');

    if (!isLeftOpen && !isRightOpen && !isColorsOpen) {
      this.openBlocksSidebar();
    }
  }

  private loadSettingsUI(): void {
    if (!chrome.storage?.local) return;
    chrome.storage.local.get([
      'floating_buttons_layout_settings',
      'studio_preferences',
      'mcp_settings',
      'web_automations'
    ], (stored) => {
      const layout = stored.floating_buttons_layout_settings || {
        stackDirection: 'vertical',
        gap: 10,
        maxColumns: 3,
        maxRows: 5,
      };
      const studio = stored.studio_preferences || {
        autoSave: 'always',
        edgeType: 'bezier',
        showMinimap: true,
        snapToGrid: true,
      };
      const mcp = stored.mcp_settings || {
        enabled: false,
        port: 3001,
      };

      const setSelect = (id: string, val: any) => {
        const el = document.getElementById(id) as HTMLSelectElement;
        if (el && val !== undefined) el.value = String(val);
      };
      const setInput = (id: string, val: any) => {
        const el = document.getElementById(id) as HTMLInputElement;
        if (el && val !== undefined) el.value = String(val);
      };
      const setCheck = (id: string, val: any) => {
        const el = document.getElementById(id) as HTMLInputElement;
        if (el && val !== undefined) el.checked = Boolean(val);
      };

      setSelect('settingsStackDirection', layout.stackDirection);
      setInput('settingsGapInput', layout.gap);
      setInput('settingsMaxColumnsInput', layout.maxColumns);
      setInput('settingsMaxRowsInput', layout.maxRows);

      setSelect('settingsAutoSaveInterval', studio.autoSave);
      setSelect('settingsDefaultEdgeType', studio.edgeType);
      setCheck('settingsShowMinimapDefault', studio.showMinimap);
      setCheck('settingsSnapToGridDefault', studio.snapToGrid);

      setCheck('settingsMcpEnabled', mcp.enabled);
      setInput('settingsMcpPortInput', mcp.port);

      const statsEl = document.getElementById('settingsStorageSummaryText');
      if (statsEl) {
        const flows = stored.web_automations || [];
        const jsonStr = JSON.stringify(stored);
        const kb = (new TextEncoder().encode(jsonStr).length / 1024).toFixed(1);
        statsEl.textContent = `${flows.length} fluxo(s) salvos (~${kb} KB utilizados)`;
      }
    });
  }

  private initSettingsEvents(): void {
    const btnSave = document.getElementById('btnSaveVisualSettings');
    btnSave?.addEventListener('click', () => {
      const getVal = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value;
      const getCheck = (id: string) => (document.getElementById(id) as HTMLInputElement)?.checked;

      const layout = {
        stackDirection: getVal('settingsStackDirection') || 'vertical',
        gap: parseInt(getVal('settingsGapInput') || '10', 10),
        maxColumns: parseInt(getVal('settingsMaxColumnsInput') || '3', 10),
        maxRows: parseInt(getVal('settingsMaxRowsInput') || '5', 10),
      };

      const studio = {
        autoSave: getVal('settingsAutoSaveInterval') || 'always',
        edgeType: getVal('settingsDefaultEdgeType') || 'bezier',
        showMinimap: getCheck('settingsShowMinimapDefault'),
        snapToGrid: getCheck('settingsSnapToGridDefault'),
      };

      const mcp = {
        enabled: getCheck('settingsMcpEnabled'),
        port: parseInt(getVal('settingsMcpPortInput') || '3001', 10),
      };

      if (chrome.storage?.local) {
        chrome.storage.local.set({
          floating_buttons_layout_settings: layout,
          studio_preferences: studio,
          mcp_settings: mcp,
        }, () => {
          showToast('Configurações salvas com sucesso!', 'success');
          try {
            chrome.tabs?.query({}, (tabs) => {
              tabs.forEach((t) => {
                if (t.id) {
                  chrome.tabs.sendMessage(t.id, {
                    type: 'UPDATE_FLOATING_BUTTONS_LAYOUT',
                    settings: layout,
                  }).catch(() => {});
                }
              });
            });
          } catch (_) {}
        });
      }
    });

    document.getElementById('btnSettingsResetPositions')?.addEventListener('click', () => {
      DialogMenu.confirm({
        title: 'Restaurar Posições?',
        message: 'Deseja restaurar as posições padrão de todos os botões flutuantes arrastados?',
        confirmText: 'Restaurar',
        isDanger: true,
      }).then((confirmed) => {
        if (confirmed) {
          chrome.storage?.local?.remove('floating_buttons_positions', () => {
            showToast('Posições padrão restauradas!', 'success');
          });
        }
      });
    });

    document.getElementById('btnSettingsExportAllData')?.addEventListener('click', async () => {
      if (!chrome.storage?.local) return;
      const all = await chrome.storage.local.get(null);
      const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `webautomations_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Backup exportado com sucesso!', 'success');
    });

    const fileInput = document.getElementById('settingsBackupFileInput') as HTMLInputElement;
    document.getElementById('btnSettingsImportAllData')?.addEventListener('click', () => {
      fileInput?.click();
    });

    fileInput?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const content = JSON.parse(ev.target?.result as string);
          if (content && typeof content === 'object') {
            await chrome.storage.local.set(content);
            showToast('Backup restaurado com sucesso!', 'success');
            this.loadSettingsUI();
            this.tabManager.loadFromStorage(false);
          }
        } catch (err: any) {
          DialogMenu.alert({
            title: 'Erro na Restauração',
            message: 'O arquivo selecionado não contém um JSON válido: ' + err.message,
            type: 'error',
          });
        }
      };
      reader.readAsText(file);
      fileInput.value = '';
    });
  }
}

// Inicializar aplicação
window.addEventListener('DOMContentLoaded', () => {
  new VisualEditorApp();
});
