/**
 * WebAutomations Visual Flow Studio & Dashboard
 * Orquestrador central modularizado do editor visual
 */

import { WebAutomationGraph } from '../../../BibliotecaDeDev/src/types/schema';
import { StateManager } from '../../../BibliotecaDeDev/src/engine/StateManager';
import { DEFAULT_AUTOMATION } from '../defaultAutomation';
import { SafeJsEvaluator } from '../utils/safeJsEvaluator';
import { BLOCK_CATALOG } from './modules/blockCatalog';
import { ColorPickerManager } from './modules/colorPickerManager';
import { InspectorManager } from './modules/inspectorManager';
import { CanvasManager } from './modules/canvasManager';
import { WorkflowTabManager } from './modules/tabManager';
import { VariablesManager } from './modules/variablesManager';
import { showToast, showModalDialog, sanitizeGraph, DialogMenu } from './modules/editorUtils';
import { FlowSettingsModal } from './modules/flowSettingsModal';
import { HtmlElementAnalyzer } from './modules/htmlElementAnalyzer';
import { CodeEditorComponent } from './modules/codeEditorComponent';
import {
  ExecutionHistoryManager,
  ExecutionHistoryItem,
  ExecutionFilterOptions
} from './modules/executionHistoryManager';

// Registrar avaliador JS em conformidade com a CSP do Manifest V3 (sem 'unsafe-eval' e sem acesso a privilégios de extensão)
StateManager.customEvaluator = (code, vars) => SafeJsEvaluator.evaluate(code, vars, true);

class VisualEditorApp {
  private currentView: 'dashboard' | 'studio' | 'settings' = 'dashboard';
  private graph: WebAutomationGraph;
  private selectedNodeId?: string;
  private lastDebugTabId?: number;
  private isGhostMode: boolean = false;
  private ghostHistoricalRun?: ExecutionHistoryItem;
  private originalEditableGraph?: WebAutomationGraph;
  private activeWebTabInfo?: { tabId?: number; title?: string; url?: string };

  private colorPickerManager: ColorPickerManager;
  private inspectorManager: InspectorManager;
  private canvasManager: CanvasManager;
  private tabManager: WorkflowTabManager;
  private variablesManager: VariablesManager;

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
        getSelectedNodeIds: () => this.canvasManager?.getSelectedNodeIds() || [],
        onClearSelection: () => {
          this.canvasManager.clearSelection();
          this.selectedNodeId = undefined;
          this.inspectorManager.renderInspector();
        },
        onDeleteSelected: () => {
          this.canvasManager.deleteSelectedNodes();
          this.selectedNodeId = undefined;
          this.inspectorManager.renderInspector();
        },
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
      getSelectedNodeIds: () => this.canvasManager.getSelectedNodeIds(),
      setSelectedNodeId: (nodeId) => {
        this.selectedNodeId = nodeId;
      },
      onNodeSelect: (nodeId) => {
        this.selectedNodeId = nodeId;
        const selectedCount = this.canvasManager.getSelectedNodeIds().length;
        if (nodeId || selectedCount > 0) {
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

    // Provedor de contexto global para o CodeEditorComponent (dados anteriores e variáveis N8N)
    CodeEditorComponent.setDefaultContextResolver(() => {
      const selectedId = this.selectedNodeId || this.canvasManager?.getSelectedNodeIds()?.[0];
      const selectedNode = selectedId ? this.graph.nodes.find((n) => n.id === selectedId) : undefined;
      return {
        graph: this.graph,
        currentNode: selectedNode,
        runtimeNodeOutputs: (this.inspectorManager as any)?.runtimeNodeOutputs || {},
        onShowToast: (msg, type) => showToast(msg, type),
      };
    });


    // 4. Inicializar WorkflowTabManager
    this.tabManager = new WorkflowTabManager({
      onOpenFlow: (flow) => this.openStudio(flow),
      onViewChange: (view) => this.switchView(view),
      onRunFlowDirectly: (flow) => this.runFlowDirectly(flow),
      onDebugFlowDirectly: (flow) => this.runFlowDirectly(flow, true),
      showToast: (msg, type) => showToast(msg, type),
    });

    // 5. Inicializar VariablesManager
    this.variablesManager = new VariablesManager({
      getGraph: () => this.graph,
      onVariablesChanged: () => {
        this.canvasManager?.render();
        this.inspectorManager?.renderInspector();
      },
      showToast: (msg, type) => showToast(msg, type),
    });

    this.initBlockCatalogUI();
    this.initGlobalEvents();
    this.initSettingsEvents();
    this.loadStartupPreferences();
    this.tabManager.loadFromStorage();
  }

  private loadStartupPreferences(): void {
    if (!chrome.storage?.local) return;
    chrome.storage.local.get(['studio_preferences', 'visual_studio_preferences'], (stored) => {
      const p = stored?.visual_studio_preferences || stored?.studio_preferences;
      if (p) {
        if (p.multiSelectMode !== undefined || p.areaSelectMode !== undefined) {
          this.canvasManager.updateSelectionSettings(p.multiSelectMode, p.areaSelectMode);
        }
        if (p.disableSidebarEditing !== undefined) {
          this.inspectorManager.setDisableSidebarEditing(Boolean(p.disableSidebarEditing));
        }
      }
    });
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
    const sidebarVariables = document.getElementById('sidebarVariables');
    const sidebarDebug = document.getElementById('sidebarDebug');
    const resizerLeft = document.getElementById('resizerLeft');
    const btnActivityVariables = document.getElementById('btnActivityVariables');
    const btnActivityDebug = document.getElementById('btnActivityDebug');

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
      if (sidebarVariables) sidebarVariables.style.display = 'none';
      if (sidebarDebug) sidebarDebug.style.display = 'none';
      if (resizerLeft) resizerLeft.style.display = 'none';

      btnActivitySettings?.classList.add('active');
      btnActivityVariables?.classList.remove('active');
      btnActivityDebug?.classList.remove('active');
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
      if (sidebarVariables) sidebarVariables.style.display = '';
      if (sidebarDebug) sidebarDebug.style.display = '';
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
      this.renderGlobalHistory();
    }
    this.tabManager.renderTabs();
  }

  private openStudio(graph: WebAutomationGraph): void {
    if (this.isGhostMode) {
      this.exitGhostMode();
    }
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
    if ((this.graph as any).lastExecutionData?.nodeOutputs) {
      this.inspectorManager.setRuntimeNodeOutputs((this.graph as any).lastExecutionData.nodeOutputs);
    }
    this.inspectorManager.renderInspector();
    this.tabManager.renderTabs();
    this.loadScopedHistory();
    this.detectActiveWebTab();
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
    if (this.isGhostMode) {
      showToast('Modo Fantasma é somente leitura! Modificações não podem ser salvas.', 'warning');
      return;
    }
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

  private async runFlowDirectly(graph: WebAutomationGraph, isDebug: boolean = false): Promise<void> {
    showToast(`${isDebug ? 'Depurando' : 'Executando'} "${graph.metadata?.name || 'Automação'}" na página web ativa...`, 'info');

    if (chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage(
        {
          action: 'EXECUTE_AUTOMATION',
          payload: { graph, isDebug, triggerType: isDebug ? 'debug' : 'manual' },
        },
        (res) => {
          if (res?.success) {
            showToast(`"${graph.metadata?.name || 'Automação'}" finalizada com sucesso!`, 'success');
          } else if (res?.error) {
            showToast(`Erro ao executar: ${res.error}`, 'error');
          }
          this.loadScopedHistory();
          this.renderGlobalHistory();
        }
      );
    } else {
      showToast('Ambiente sem suporte a runtime.sendMessage.', 'error');
    }
  }

  public async detectActiveWebTab(): Promise<{ tabId?: number; title?: string; url?: string }> {
    const badge = document.getElementById('debugTargetTabBadge');
    const info = document.getElementById('debugTargetTabInfo');
    const btnFocus = document.getElementById('btnFocusTargetTab');

    if (badge) badge.textContent = 'Detectando...';

    return new Promise((resolve) => {
      if (chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({ action: 'GET_ACTIVE_WEB_TAB' }, (res) => {
          if (res?.success && res.tabId) {
            this.activeWebTabInfo = {
              tabId: res.tabId,
              title: res.title || 'Aba Sem Título',
              url: res.url || '',
            };
            this.lastDebugTabId = res.tabId;
            if (badge) {
              badge.textContent = `Aba #${res.tabId}`;
              badge.style.background = 'rgba(56, 189, 248, 0.2)';
              badge.style.color = '#38bdf8';
              badge.style.borderColor = '#0284c7';
            }
            if (info) {
              info.innerHTML = `<strong>${res.title || 'Página Web'}</strong><br/><span style="color: #64748b; font-size: 10px;">${res.url || ''}</span>`;
            }
            if (btnFocus) btnFocus.style.display = 'inline-flex';
            resolve(this.activeWebTabInfo);
          } else {
            this.activeWebTabInfo = undefined;
            if (badge) {
              badge.textContent = 'Nenhuma aba ativa';
              badge.style.background = 'rgba(239, 68, 68, 0.2)';
              badge.style.color = '#f87171';
              badge.style.borderColor = '#dc2626';
            }
            if (info) {
              info.textContent = 'Abra ou clique em uma aba de página web para depurar.';
            }
            if (btnFocus) btnFocus.style.display = 'none';
            resolve({});
          }
        });
      } else {
        if (badge) badge.textContent = 'Sem suporte Chrome';
        if (info) info.textContent = 'Ambiente de desenvolvimento sem runtime do Chrome.';
        resolve({});
      }
    });
  }

  public async focusTargetTab(): Promise<void> {
    const targetId = this.activeWebTabInfo?.tabId || this.lastDebugTabId;
    if (!targetId) {
      showToast('Nenhuma aba web ativa detectada.', 'warning');
      return;
    }
    if (chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ action: 'FOCUS_TAB', payload: { tabId: targetId } });
    }
  }

  public clearLogs(): void {
    const consoleEl = document.getElementById('logsConsole');
    if (consoleEl) {
      consoleEl.innerHTML = '<div class="log-entry debug">[SISTEMA] Console limpo.</div>';
    }
  }

  private async runCurrentFlow(isDebug: boolean = false, explicitTabId?: number): Promise<void> {
    if (this.isGhostMode) {
      showToast('A automação está em Modo Fantasma (Somente Leitura). Saia do modo fantasma para executar.', 'warning');
      return;
    }

    if (isDebug) {
      this.openDebugSidebar();
      await this.detectActiveWebTab();
      const targetLabel = this.activeWebTabInfo?.title
        ? `na aba "${this.activeWebTabInfo.title}"`
        : 'na aba web ativa';
      this.appendLog({
        timestamp: Date.now(),
        level: 'info',
        message: `Iniciando depuração do fluxo "${this.cleanFlowName(this.graph.metadata?.name)}" ${targetLabel}...`,
      });
      showToast('Iniciando depuração na página ativa...', 'info');
    } else {
      showToast('Iniciando execução do fluxo...', 'info');
    }

    if (chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage(
        {
          action: 'EXECUTE_AUTOMATION',
          payload: {
            graph: this.graph,
            isDebug,
            triggerType: isDebug ? 'debug' : 'manual',
            tabId: explicitTabId || this.activeWebTabInfo?.tabId,
          },
        },
        (res) => {
          if (res?.tabId) {
            this.lastDebugTabId = res.tabId;
            this.activeWebTabInfo = {
              tabId: res.tabId,
              title: this.activeWebTabInfo?.title,
              url: this.activeWebTabInfo?.url,
            };
          }
          if (res?.success) {
            this.appendLog({ timestamp: Date.now(), level: 'info', message: 'Execução concluída com sucesso!' });
            this.renderVariables(res.variables || {});
            if (res.nodeOutputs) {
              this.inspectorManager.setRuntimeNodeOutputs(res.nodeOutputs);
              (this.graph as any).lastExecutionData = {
                nodeOutputs: res.nodeOutputs,
                timestamp: Date.now(),
              };
            }
            showToast('Fluxo executado com sucesso!', 'success');
          } else if (res?.error) {
            this.appendLog({ timestamp: Date.now(), level: 'error', message: res.error });
            showToast(`Erro na execução: ${res.error}`, 'error');
          }
          this.loadScopedHistory();
          this.renderGlobalHistory();
        }
      );
    } else {
      this.appendLog({ timestamp: Date.now(), level: 'warn', message: 'Ambiente de desenvolvimento (API Chrome mockada).' });
    }
  }

  public enterGhostMode(historyItem: ExecutionHistoryItem): void {
    if (!this.isGhostMode) {
      this.originalEditableGraph = JSON.parse(JSON.stringify(this.graph));
    }
    this.isGhostMode = true;
    this.ghostHistoricalRun = historyItem;

    if (this.currentView !== 'studio') {
      this.switchView('studio');
    }

    // Carrega snapshot histórico exato da execução
    this.graph = JSON.parse(JSON.stringify(historyItem.graphSnapshot));

    // Notifica Canvas e Inspector para bloqueio e badges de auditoria
    this.canvasManager.setGhostMode(true, historyItem);
    this.inspectorManager.setGhostMode(true, historyItem);

    // Atualiza Banner do Modo Fantasma
    const banner = document.getElementById('ghostModeBanner');
    const details = document.getElementById('ghostBannerDetails');
    if (banner) banner.style.display = 'flex';
    if (details) {
      const execDate = new Date(historyItem.timestamp).toLocaleString();
      const statusText =
        historyItem.status === 'completed'
          ? '✓ Concluído'
          : historyItem.status === 'failed'
          ? '✕ Falha'
          : '⊘ Cancelado';
      const statusColor = historyItem.status === 'completed' ? '#34d399' : '#f87171';
      details.innerHTML = `Fluxo: <strong style="color: #fff;">${historyItem.automationName}</strong> • Executado em: ${execDate} • Duração: <strong>${historyItem.durationMs}ms</strong> • Status: <strong style="color: ${statusColor};">${statusText}</strong>`;
    }

    const titleInput = document.getElementById('flowTitleInput') as HTMLInputElement;
    if (titleInput) {
      titleInput.value = `👻 [FANTASMA] ${this.cleanFlowName(historyItem.automationName)}`;
      titleInput.readOnly = true;
    }

    this.setEditorActionsReadOnly(true);

    if (historyItem.finalVariables) {
      this.renderVariables(historyItem.finalVariables);
    }

    // Seleciona o primeiro bloco com falha ou o primeiro executado
    const failedNodeId = Object.keys(historyItem.blockSnapshots).find(
      (id) => historyItem.blockSnapshots[id]?.status === 'failed'
    );
    const firstExecNodeId =
      failedNodeId ||
      Object.keys(historyItem.blockSnapshots).find(
        (id) => historyItem.blockSnapshots[id]?.status === 'completed'
      );

    if (firstExecNodeId) {
      this.selectedNodeId = firstExecNodeId;
      this.canvasManager.setSelectedNodeIds([firstExecNodeId]);
      this.openInspectorSidebar();
    } else {
      this.canvasManager.render();
      this.inspectorManager.renderInspector();
    }

    this.loadScopedHistory();
    showToast('Modo Fantasma ativado! Inspeção histórica somente leitura.', 'info');
  }

  public exitGhostMode(): void {
    if (!this.isGhostMode) return;
    this.isGhostMode = false;
    this.ghostHistoricalRun = undefined;

    const banner = document.getElementById('ghostModeBanner');
    if (banner) banner.style.display = 'none';

    const titleInput = document.getElementById('flowTitleInput') as HTMLInputElement;
    if (titleInput) {
      titleInput.readOnly = false;
    }

    this.setEditorActionsReadOnly(false);

    if (this.originalEditableGraph) {
      this.graph = JSON.parse(JSON.stringify(this.originalEditableGraph));
      this.originalEditableGraph = undefined;
    }

    this.canvasManager.setGhostMode(false);
    this.inspectorManager.setGhostMode(false);

    if (titleInput) {
      titleInput.value = this.cleanFlowName(this.graph.metadata?.name);
    }

    this.canvasManager.render();
    this.inspectorManager.renderInspector();
    this.loadScopedHistory();
    showToast('Saiu do Modo Fantasma. Editor liberado para modificações.', 'info');
  }

  private setEditorActionsReadOnly(readOnly: boolean): void {
    const btnSave = document.getElementById('btnSaveFlow');
    const btnRun = document.getElementById('btnRunFlow');
    const btnClear = document.getElementById('btnClearCanvas');
    const btnDebug = document.getElementById('btnDebugFlow');
    const btnImport = document.getElementById('btnImportJson');

    [btnSave, btnRun, btnClear, btnDebug, btnImport].forEach((btn) => {
      if (btn) {
        (btn as HTMLButtonElement).disabled = readOnly;
        btn.style.opacity = readOnly ? '0.4' : '1';
        btn.style.pointerEvents = readOnly ? 'none' : 'auto';
      }
    });
  }

  public async loadScopedHistory(): Promise<void> {
    const listEl = document.getElementById('scopedHistoryList');
    const badgeEl = document.getElementById('scopedHistoryCountBadge');
    if (!listEl) return;

    const currentFlowId = this.graph.metadata.id;
    const history = await ExecutionHistoryManager.getFiltered({ automationId: currentFlowId });

    if (badgeEl) {
      badgeEl.textContent = `${history.length} execuções`;
    }

    if (history.length === 0) {
      listEl.innerHTML = `<div style="font-size: 11px; color: #64748b; text-align: center; padding: 12px 6px;">Nenhuma execução deste fluxo registrada ainda.</div>`;
      return;
    }

    listEl.innerHTML = '';
    history.slice(0, 20).forEach((item) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'scoped-history-item';
      itemEl.style.cssText = `
        background: #090d16;
        border: 1px solid #1e293b;
        border-radius: 6px;
        padding: 8px 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        transition: border-color 0.15s ease;
      `;

      const statusColor = item.status === 'completed' ? '#10b981' : item.status === 'failed' ? '#ef4444' : '#64748b';
      const statusIcon = item.status === 'completed' ? '✓' : item.status === 'failed' ? '✕' : '⊘';
      const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = new Date(item.timestamp).toLocaleDateString([], { day: '2-digit', month: '2-digit' });

      itemEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
          <span style="font-size: 11px; font-weight: 700; color: ${statusColor}; background: ${statusColor}18; border: 1px solid ${statusColor}44; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${statusIcon}
          </span>
          <div style="min-width: 0;">
            <div style="font-size: 11px; font-weight: 600; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${dateStr} ${timeStr}
            </div>
            <div style="font-size: 10px; color: #64748b;">
              ${item.durationMs}ms • <span style="text-transform: capitalize;">${item.triggerType}</span>
            </div>
          </div>
        </div>
        <button class="btn-xs btn-ghost-inspect" data-run-id="${item.id}" style="background: rgba(129, 140, 248, 0.15); border: 1px solid rgba(129, 140, 248, 0.4); color: #818cf8; font-size: 10px; padding: 3px 8px; border-radius: 4px; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; gap: 3px;" title="Inspecionar no Modo Fantasma">
          👻 Fantasma
        </button>
      `;

      itemEl.querySelector('.btn-ghost-inspect')?.addEventListener('click', () => {
        this.enterGhostMode(item);
      });

      listEl.appendChild(itemEl);
    });
  }

  public switchDashboardTab(tab: 'flows' | 'history'): void {
    const tabFlows = document.getElementById('dashTabFlows');
    const tabHistory = document.getElementById('dashTabHistory');
    const secFlows = document.getElementById('dashFlowsSection');
    const secHistory = document.getElementById('dashHistorySection');

    if (tab === 'flows') {
      tabFlows?.classList.add('active');
      tabFlows?.setAttribute('style', 'background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.4); color: #f8fafc; font-size: 13px; font-weight: 700; padding: 8px 16px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.15s ease;');
      tabHistory?.classList.remove('active');
      tabHistory?.setAttribute('style', 'background: #111827; border: 1px solid #1f293d; color: #94a3b8; font-size: 13px; font-weight: 600; padding: 8px 16px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.15s ease;');
      if (secFlows) secFlows.style.display = 'block';
      if (secHistory) secHistory.style.display = 'none';
      this.tabManager.renderDashboard();
    } else {
      tabHistory?.classList.add('active');
      tabHistory?.setAttribute('style', 'background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #f8fafc; font-size: 13px; font-weight: 700; padding: 8px 16px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.15s ease;');
      tabFlows?.classList.remove('active');
      tabFlows?.setAttribute('style', 'background: #111827; border: 1px solid #1f293d; color: #94a3b8; font-size: 13px; font-weight: 600; padding: 8px 16px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.15s ease;');
      if (secFlows) secFlows.style.display = 'none';
      if (secHistory) secHistory.style.display = 'block';
      this.populateAutomationFilterDropdown();
      this.renderGlobalHistory();
    }
  }

  public populateAutomationFilterDropdown(): void {
    const select = document.getElementById('historyFilterAutomation') as HTMLSelectElement;
    if (!select) return;
    const currentVal = select.value;
    const automations = this.tabManager.getSavedAutomations();

    let html = '<option value="">Todas as Automações</option>';
    automations.forEach((auto) => {
      const id = auto.metadata?.id || '';
      const name = this.cleanFlowName(auto.metadata?.name);
      html += `<option value="${id}">${name}</option>`;
    });

    select.innerHTML = html;
    if (currentVal) {
      select.value = currentVal;
    }
  }

  public async renderGlobalHistory(): Promise<void> {
    const container = document.getElementById('globalHistoryListContainer');
    const badge = document.getElementById('dashHistoryCountBadge');
    if (!container) return;

    const automationSelect = document.getElementById('historyFilterAutomation') as HTMLSelectElement;
    const statusSelect = document.getElementById('historyFilterStatus') as HTMLSelectElement;
    const dateSelect = document.getElementById('historyFilterDate') as HTMLSelectElement;
    const queryInput = document.getElementById('historyFilterQuery') as HTMLInputElement;

    const filters: ExecutionFilterOptions = {
      automationId: automationSelect?.value || undefined,
      status: statusSelect?.value || 'all',
      dateRange: (dateSelect?.value as any) || 'all',
      query: queryInput?.value || '',
    };

    const allHistory = await ExecutionHistoryManager.getAll();
    if (badge) {
      badge.textContent = String(allHistory.length);
    }

    const filtered = ExecutionHistoryManager.applyFilters(allHistory, filters);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="background: #111827; border: 1px dashed #1f293d; border-radius: 12px; padding: 40px 20px; text-align: center; color: #64748b;">
          <div style="font-size: 32px; margin-bottom: 8px;">📋</div>
          <div style="font-size: 14px; font-weight: 600; color: #94a3b8; margin-bottom: 4px;">Nenhuma execução encontrada</div>
          <div style="font-size: 12px;">Nenhum registro corresponde aos filtros selecionados.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    filtered.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'history-card';
      card.style.cssText = `
        background: #111827;
        border: 1px solid #1f293d;
        border-radius: 10px;
        padding: 14px 18px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        transition: transform 0.15s ease, border-color 0.15s ease;
      `;

      const statusColor = item.status === 'completed' ? '#10b981' : item.status === 'failed' ? '#ef4444' : '#64748b';
      const statusLabel = item.status === 'completed' ? '✓ Concluído' : item.status === 'failed' ? '✕ Falha' : '⊘ Cancelado';
      const fullDate = new Date(item.timestamp).toLocaleString();

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 11px; font-weight: 700; color: ${statusColor}; background: ${statusColor}18; border: 1px solid ${statusColor}44; padding: 3px 8px; border-radius: 6px;">
              ${statusLabel}
            </span>
            <span style="font-size: 14px; font-weight: 700; color: #f8fafc;">
              ${item.automationName}
            </span>
            <span style="font-size: 10px; color: #38bdf8; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); padding: 2px 7px; border-radius: 4px; text-transform: capitalize;">
              Gatilho: ${item.triggerType}
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-secondary btn-ghost-view" data-id="${item.id}" style="font-size: 11px; padding: 6px 12px; display: flex; align-items: center; gap: 6px; background: rgba(129, 140, 248, 0.15); border: 1px solid rgba(129, 140, 248, 0.4); color: #818cf8; cursor: pointer; border-radius: 6px;">
              <span>👻</span>
              <strong>Ver no Modo Fantasma</strong>
            </button>
            <button class="btn btn-danger btn-delete-exec" data-id="${item.id}" style="font-size: 11px; padding: 6px 10px; cursor: pointer; border-radius: 6px;" title="Excluir este registro">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 16px; font-size: 11px; color: #94a3b8; flex-wrap: wrap;">
          <div>Data/Hora: <strong style="color: #cbd5e1;">${fullDate}</strong></div>
          <div>Duração: <strong style="color: #cbd5e1;">${item.durationMs}ms</strong></div>
          ${item.targetTabTitle ? `<div>Página: <span style="color: #38bdf8;">${item.targetTabTitle}</span></div>` : ''}
          ${item.targetTabUrl ? `<div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #64748b;">${item.targetTabUrl}</div>` : ''}
        </div>

        ${
          item.error
            ? `
          <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 6px; padding: 8px 10px; font-size: 11px; color: #fca5a5; font-family: monospace; word-break: break-all;">
            ✕ Erro: ${item.error}
          </div>
        `
            : ''
        }
      `;

      card.querySelector('.btn-ghost-view')?.addEventListener('click', () => {
        this.enterGhostMode(item);
      });

      card.querySelector('.btn-delete-exec')?.addEventListener('click', async () => {
        await ExecutionHistoryManager.delete(item.id);
        this.renderGlobalHistory();
        showToast('Registro de execução excluído.', 'info');
      });

      container.appendChild(card);
    });
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
        if (this.currentView === 'studio' && !this.isGhostMode) {
          this.saveCurrentFlow();
        }
        return;
      }

      // 2. Apagar bloco ou ligação (corda) selecionada ao apertar Delete ou Backspace (fora de campos de digitação)
      if (e.key === 'Delete' || e.key === 'Del' || e.key === 'Backspace') {
        const target = e.target as HTMLElement;
        const isEditingText = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
        if (!isEditingText && this.currentView === 'studio' && !this.isGhostMode) {
          const selectedEdge = this.canvasManager.getSelectedEdgeId();
          if (selectedEdge) {
            e.preventDefault();
            this.canvasManager.deleteEdge(selectedEdge);
          } else {
            const selectedIds = this.canvasManager.getSelectedNodeIds();
            if (selectedIds.length > 0) {
              e.preventDefault();
              this.canvasManager.deleteSelectedNodes();
              this.selectedNodeId = undefined;
            } else if (this.selectedNodeId) {
              e.preventDefault();
              this.canvasManager.deleteNode(this.selectedNodeId);
            }
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
      if (this.isGhostMode) {
        showToast('Modo Fantasma é somente leitura! Não é possível limpar o canvas.', 'warning');
        return;
      }
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
    const sidebarVariables = document.getElementById('sidebarVariables');
    const sidebarDebug = document.getElementById('sidebarDebug');
    const resizerLeft = document.getElementById('resizerLeft');
    const btnToggleLeft = document.getElementById('btnToggleSidebarLeft');
    const btnToggleRight = document.getElementById('btnToggleSidebarRight');
    const btnToggleColors = document.getElementById('btnToggleSidebarColors');
    const btnToggleVariables = document.getElementById('btnToggleSidebarVariables');
    const btnToggleDebug = document.getElementById('btnToggleSidebarDebug');
    const btnActivityBlocks = document.getElementById('btnActivityBlocks');
    const btnActivityInspector = document.getElementById('btnActivityInspector');
    const btnActivityColors = document.getElementById('btnActivityColors');
    const btnActivityVariables = document.getElementById('btnActivityVariables');
    const btnActivityDebug = document.getElementById('btnActivityDebug');
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
    btnActivityVariables?.addEventListener('click', () => this.openVariablesSidebar());
    btnActivityDebug?.addEventListener('click', () => this.openDebugSidebar());
    btnToggleLeft?.addEventListener('click', () => this.openBlocksSidebar());
    btnToggleColors?.addEventListener('click', () => this.openBlocksSidebar());
    btnToggleVariables?.addEventListener('click', () => this.openBlocksSidebar());
    btnToggleDebug?.addEventListener('click', () => this.openBlocksSidebar());
    btnToggleRight?.addEventListener('click', () => {
      this.selectedNodeId = undefined;
      document.querySelectorAll('.graph-node').forEach((el) => el.classList.remove('selected'));
      this.openBlocksSidebar();
    });

    // Ações de Depuração na Página Web Ativa
    document.getElementById('btnDebugFlow')?.addEventListener('click', () => this.runCurrentFlow(true));
    document.getElementById('btnRunDebugActiveTab')?.addEventListener('click', () => this.runCurrentFlow(true));
    document.getElementById('btnRefreshTargetTab')?.addEventListener('click', () => this.detectActiveWebTab());
    document.getElementById('btnFocusTargetTab')?.addEventListener('click', () => this.focusTargetTab());
    document.getElementById('btnClearLogs')?.addEventListener('click', () => this.clearLogs());
    document.getElementById('btnExitGhostMode')?.addEventListener('click', () => this.exitGhostMode());

    // Abas do Dashboard (Meus Fluxos vs Histórico Global de Execuções)
    document.getElementById('dashTabFlows')?.addEventListener('click', () => this.switchDashboardTab('flows'));
    document.getElementById('dashTabHistory')?.addEventListener('click', () => this.switchDashboardTab('history'));
    document.getElementById('btnRefreshGlobalHistory')?.addEventListener('click', () => this.renderGlobalHistory());
    document.getElementById('btnClearGlobalHistory')?.addEventListener('click', async () => {
      const confirmed = await DialogMenu.confirm({
        title: 'Limpar Todo o Histórico?',
        message: 'Deseja realmente apagar todos os registros de execuções de todas as automações? Esta ação não pode ser desfeita.',
        confirmText: 'Limpar Histórico',
        isDanger: true,
      });
      if (confirmed) {
        await ExecutionHistoryManager.clearAll();
        this.renderGlobalHistory();
        this.loadScopedHistory();
        showToast('Todo o histórico de execuções foi apagado.', 'info');
      }
    });

    // Filtros de Auditoria e Busca no Histórico Global
    document.getElementById('historyFilterAutomation')?.addEventListener('change', () => this.renderGlobalHistory());
    document.getElementById('historyFilterStatus')?.addEventListener('change', () => this.renderGlobalHistory());
    document.getElementById('historyFilterDate')?.addEventListener('change', () => this.renderGlobalHistory());
    document.getElementById('historyFilterQuery')?.addEventListener('input', () => this.renderGlobalHistory());

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
          : (sidebarVariables && !sidebarVariables.classList.contains('collapsed'))
          ? sidebarVariables
          : (sidebarRight && !sidebarRight.classList.contains('collapsed'))
          ? sidebarRight
          : (sidebarDebug && !sidebarDebug.classList.contains('collapsed'))
          ? sidebarDebug
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
          if (sidebarVariables) sidebarVariables.style.width = wStr;
          if (sidebarDebug) sidebarDebug.style.width = wStr;
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
        if (msg.nodeOutputs) {
          this.inspectorManager.setRuntimeNodeOutputs(msg.nodeOutputs);
          (this.graph as any).lastExecutionData = {
            nodeOutputs: msg.nodeOutputs,
            timestamp: Date.now(),
          };
        }
      } else if (msg.type === 'NODE_ERROR') {
        this.unhighlightActiveNode(msg.nodeId);
        this.appendLog({ timestamp: Date.now(), level: 'error', message: `Erro no bloco [${msg.nodeId}]: ${msg.error}` });
        showToast(`Erro no bloco: ${msg.error}`, 'error');
      } else if (msg.type === 'LOG') {
        this.appendLog(msg.log);
      } else if (msg.type === 'STATUS_CHANGE') {
        this.appendLog({ timestamp: Date.now(), level: 'info', message: `Status alterado para: ${msg.status}` });
      } else if (msg.type === 'EXECUTION_RECORDED') {
        this.loadScopedHistory();
        this.renderGlobalHistory();
      }
    });
  }

  public openBlocksSidebar(): void {
    if (this.currentView === 'settings') return;
    const sidebarLeft = document.getElementById('sidebarLibrary');
    const sidebarRight = document.getElementById('sidebarInspector');
    const sidebarColors = document.getElementById('sidebarColors');
    const sidebarVariables = document.getElementById('sidebarVariables');
    const sidebarDebug = document.getElementById('sidebarDebug');
    const resizerLeft = document.getElementById('resizerLeft');
    const btnActivityBlocks = document.getElementById('btnActivityBlocks');
    const btnActivityInspector = document.getElementById('btnActivityInspector');
    const btnActivityColors = document.getElementById('btnActivityColors');
    const btnActivityVariables = document.getElementById('btnActivityVariables');
    const btnActivityDebug = document.getElementById('btnActivityDebug');

    sidebarLeft?.classList.remove('collapsed');
    btnActivityBlocks?.classList.add('active');

    sidebarRight?.classList.add('collapsed');
    btnActivityInspector?.classList.remove('active');

    sidebarColors?.classList.add('collapsed');
    btnActivityColors?.classList.remove('active');

    sidebarVariables?.classList.add('collapsed');
    btnActivityVariables?.classList.remove('active');

    sidebarDebug?.classList.add('collapsed');
    btnActivityDebug?.classList.remove('active');

    if (resizerLeft) resizerLeft.style.display = 'block';
  }

  public openInspectorSidebar(): void {
    if (this.currentView === 'settings') return;
    const sidebarLeft = document.getElementById('sidebarLibrary');
    const sidebarRight = document.getElementById('sidebarInspector');
    const sidebarColors = document.getElementById('sidebarColors');
    const sidebarVariables = document.getElementById('sidebarVariables');
    const sidebarDebug = document.getElementById('sidebarDebug');
    const resizerLeft = document.getElementById('resizerLeft');
    const btnActivityBlocks = document.getElementById('btnActivityBlocks');
    const btnActivityInspector = document.getElementById('btnActivityInspector');
    const btnActivityColors = document.getElementById('btnActivityColors');
    const btnActivityVariables = document.getElementById('btnActivityVariables');
    const btnActivityDebug = document.getElementById('btnActivityDebug');

    sidebarRight?.classList.remove('collapsed');
    btnActivityInspector?.classList.add('active');

    sidebarLeft?.classList.add('collapsed');
    btnActivityBlocks?.classList.remove('active');

    sidebarColors?.classList.add('collapsed');
    btnActivityColors?.classList.remove('active');

    sidebarVariables?.classList.add('collapsed');
    btnActivityVariables?.classList.remove('active');

    sidebarDebug?.classList.add('collapsed');
    btnActivityDebug?.classList.remove('active');

    this.inspectorManager.renderInspector();
    if (resizerLeft) resizerLeft.style.display = 'block';
  }

  public openColorsSidebar(): void {
    if (this.currentView === 'settings') return;
    const sidebarLeft = document.getElementById('sidebarLibrary');
    const sidebarRight = document.getElementById('sidebarInspector');
    const sidebarColors = document.getElementById('sidebarColors');
    const sidebarVariables = document.getElementById('sidebarVariables');
    const sidebarDebug = document.getElementById('sidebarDebug');
    const resizerLeft = document.getElementById('resizerLeft');
    const btnActivityBlocks = document.getElementById('btnActivityBlocks');
    const btnActivityInspector = document.getElementById('btnActivityInspector');
    const btnActivityColors = document.getElementById('btnActivityColors');
    const btnActivityVariables = document.getElementById('btnActivityVariables');
    const btnActivityDebug = document.getElementById('btnActivityDebug');

    sidebarColors?.classList.remove('collapsed');
    btnActivityColors?.classList.add('active');

    sidebarLeft?.classList.add('collapsed');
    btnActivityBlocks?.classList.remove('active');

    sidebarRight?.classList.add('collapsed');
    btnActivityInspector?.classList.remove('active');

    sidebarVariables?.classList.add('collapsed');
    btnActivityVariables?.classList.remove('active');

    sidebarDebug?.classList.add('collapsed');
    btnActivityDebug?.classList.remove('active');

    this.colorPickerManager.renderColorsSidebar();
    if (resizerLeft) resizerLeft.style.display = 'block';
  }

  public openVariablesSidebar(): void {
    if (this.currentView === 'settings') return;
    const sidebarLeft = document.getElementById('sidebarLibrary');
    const sidebarRight = document.getElementById('sidebarInspector');
    const sidebarColors = document.getElementById('sidebarColors');
    const sidebarVariables = document.getElementById('sidebarVariables');
    const sidebarDebug = document.getElementById('sidebarDebug');
    const resizerLeft = document.getElementById('resizerLeft');
    const btnActivityBlocks = document.getElementById('btnActivityBlocks');
    const btnActivityInspector = document.getElementById('btnActivityInspector');
    const btnActivityColors = document.getElementById('btnActivityColors');
    const btnActivityVariables = document.getElementById('btnActivityVariables');
    const btnActivityDebug = document.getElementById('btnActivityDebug');

    sidebarVariables?.classList.remove('collapsed');
    btnActivityVariables?.classList.add('active');

    sidebarLeft?.classList.add('collapsed');
    btnActivityBlocks?.classList.remove('active');

    sidebarRight?.classList.add('collapsed');
    btnActivityInspector?.classList.remove('active');

    sidebarColors?.classList.add('collapsed');
    btnActivityColors?.classList.remove('active');

    sidebarDebug?.classList.add('collapsed');
    btnActivityDebug?.classList.remove('active');

    this.variablesManager.renderVariablesSidebar();
    if (resizerLeft) resizerLeft.style.display = 'block';
  }

  public openDebugSidebar(): void {
    if (this.currentView === 'settings') return;
    const sidebarLeft = document.getElementById('sidebarLibrary');
    const sidebarRight = document.getElementById('sidebarInspector');
    const sidebarColors = document.getElementById('sidebarColors');
    const sidebarVariables = document.getElementById('sidebarVariables');
    const sidebarDebug = document.getElementById('sidebarDebug');
    const resizerLeft = document.getElementById('resizerLeft');
    const btnActivityBlocks = document.getElementById('btnActivityBlocks');
    const btnActivityInspector = document.getElementById('btnActivityInspector');
    const btnActivityColors = document.getElementById('btnActivityColors');
    const btnActivityVariables = document.getElementById('btnActivityVariables');
    const btnActivityDebug = document.getElementById('btnActivityDebug');

    sidebarDebug?.classList.remove('collapsed');
    btnActivityDebug?.classList.add('active');

    sidebarLeft?.classList.add('collapsed');
    btnActivityBlocks?.classList.remove('active');

    sidebarRight?.classList.add('collapsed');
    btnActivityInspector?.classList.remove('active');

    sidebarColors?.classList.add('collapsed');
    btnActivityColors?.classList.remove('active');

    sidebarVariables?.classList.add('collapsed');
    btnActivityVariables?.classList.remove('active');

    this.detectActiveWebTab();
    this.loadScopedHistory();

    if (resizerLeft) resizerLeft.style.display = 'block';
  }

  public ensureSidebarOpen(): void {
    if (this.currentView === 'settings') return;
    const sidebarLeft = document.getElementById('sidebarLibrary');
    const sidebarRight = document.getElementById('sidebarInspector');
    const sidebarColors = document.getElementById('sidebarColors');
    const sidebarVariables = document.getElementById('sidebarVariables');
    const sidebarDebug = document.getElementById('sidebarDebug');

    const isLeftOpen = sidebarLeft && !sidebarLeft.classList.contains('collapsed');
    const isRightOpen = sidebarRight && !sidebarRight.classList.contains('collapsed');
    const isColorsOpen = sidebarColors && !sidebarColors.classList.contains('collapsed');
    const isVariablesOpen = sidebarVariables && !sidebarVariables.classList.contains('collapsed');
    const isDebugOpen = sidebarDebug && !sidebarDebug.classList.contains('collapsed');

    if (!isLeftOpen && !isRightOpen && !isColorsOpen && !isVariablesOpen && !isDebugOpen) {
      this.openBlocksSidebar();
    }
  }

  private loadSettingsUI(): void {
    if (!chrome.storage?.local) return;
    chrome.storage.local.get([
      'floating_buttons_layout_settings',
      'studio_preferences',
      'visual_studio_preferences',
      'mcp_settings',
      'web_automations'
    ], (stored) => {
      const layout = stored.floating_buttons_layout_settings || {
        stackDirection: 'vertical',
        gap: 10,
        maxColumns: 3,
        maxRows: 5,
      };
      const studio = stored.visual_studio_preferences || stored.studio_preferences || {
        autoSave: 'always',
        edgeType: 'bezier',
        showMinimap: true,
        snapToGrid: true,
        multiSelectMode: 'both',
        areaSelectMode: 'both',
        disableSidebarEditing: false,
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
      setCheck('settingsDisableSidebarEditing', studio.disableSidebarEditing);

      setSelect('settingsMultiSelectMode', studio.multiSelectMode || 'both');
      setSelect('settingsAreaSelectMode', studio.areaSelectMode || 'both');
      this.canvasManager.updateSelectionSettings(studio.multiSelectMode || 'both', studio.areaSelectMode || 'both');

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
        multiSelectMode: (getVal('settingsMultiSelectMode') as any) || 'both',
        areaSelectMode: (getVal('settingsAreaSelectMode') as any) || 'both',
        disableSidebarEditing: Boolean(getCheck('settingsDisableSidebarEditing')),
      };

      this.canvasManager.updateSelectionSettings(studio.multiSelectMode, studio.areaSelectMode);
      this.inspectorManager.setDisableSidebarEditing(studio.disableSidebarEditing);

      const mcp = {
        enabled: getCheck('settingsMcpEnabled'),
        port: parseInt(getVal('settingsMcpPortInput') || '3001', 10),
      };

      if (chrome.storage?.local) {
        chrome.storage.local.set({
          floating_buttons_layout_settings: layout,
          studio_preferences: studio,
          visual_studio_preferences: studio,
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
