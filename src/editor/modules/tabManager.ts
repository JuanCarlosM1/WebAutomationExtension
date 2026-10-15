/**
 * Gerenciador de Abas de Fluxos e Dashboard de Automações
 */

import { WebAutomationGraph } from '../../../../BibliotecaDeDev/src/types/schema';
import { DEFAULT_AUTOMATION } from '../../defaultAutomation';
import { DialogMenu } from './dialogUtils';

export interface WorkflowTabManagerCallbacks {
  onOpenFlow: (flow: WebAutomationGraph) => void;
  onViewChange: (view: 'dashboard' | 'studio' | 'settings') => void;
  onRunFlowDirectly: (flow: WebAutomationGraph) => void;
  showToast: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

export class WorkflowTabManager {
  private savedAutomations: WebAutomationGraph[] = [];
  private openTabs: WebAutomationGraph[] = [];
  private activeTabId: string = 'dashboard';
  private isSettingsTabOpen = false;
  private isDashboardTabOpen = true;

  constructor(private callbacks: WorkflowTabManagerCallbacks) {
    this.initTabsUI();
  }

  public cleanFlowName(name?: string): string {
    return (name || 'Sem Título').replace(/\.(webautomation\.json|json)$/i, '').trim() || 'Sem Título';
  }

  public getSavedAutomations(): WebAutomationGraph[] {
    return this.savedAutomations;
  }

  public setSavedAutomations(list: WebAutomationGraph[]): void {
    this.savedAutomations = list;
  }

  public getOpenTabs(): WebAutomationGraph[] {
    return this.openTabs;
  }

  public getActiveTabId(): string {
    return this.activeTabId;
  }

  public setActiveTabId(id: string): void {
    this.activeTabId = id;
    this.renderTabs();
  }

  public openDashboardTab(): void {
    this.isDashboardTabOpen = true;
    this.activeTabId = 'dashboard';
    this.callbacks.onViewChange('dashboard');
    this.renderTabs();
  }

  public closeDashboardTab(): void {
    this.isDashboardTabOpen = false;
    if (this.activeTabId === 'dashboard') {
      if (this.openTabs.length > 0) {
        const next = this.openTabs[this.openTabs.length - 1];
        this.callbacks.onOpenFlow(next);
      } else if (this.isSettingsTabOpen) {
        this.openSettingsTab();
      }
    }
    this.renderTabs();
  }

  public openSettingsTab(): void {
    this.isSettingsTabOpen = true;
    this.activeTabId = 'settings';
    this.callbacks.onViewChange('settings');
    this.renderTabs();
  }

  public closeSettingsTab(): void {
    this.isSettingsTabOpen = false;
    if (this.activeTabId === 'settings') {
      if (this.openTabs.length > 0) {
        const next = this.openTabs[this.openTabs.length - 1];
        this.callbacks.onOpenFlow(next);
      } else if (this.isDashboardTabOpen) {
        this.openDashboardTab();
      } else {
        this.openDashboardTab();
      }
    }
    this.renderTabs();
  }

  public registerOpenTab(graph: WebAutomationGraph): void {
    if (graph.metadata?.name) {
      graph.metadata.name = this.cleanFlowName(graph.metadata.name);
    }
    const existing = this.openTabs.find((t) => t.metadata?.id === graph.metadata?.id);
    if (!existing) {
      this.openTabs.push(graph);
    } else {
      const idx = this.openTabs.indexOf(existing);
      this.openTabs[idx] = graph;
    }
    this.activeTabId = graph.metadata?.id || 'studio';
    this.renderTabs();
  }

  public updateFlowInTabsAndSaved(graph: WebAutomationGraph): void {
    if (graph.metadata?.name) {
      graph.metadata.name = this.cleanFlowName(graph.metadata.name);
    }
    const sIdx = this.savedAutomations.findIndex((a) => a.metadata.id === graph.metadata.id);
    if (sIdx >= 0) {
      this.savedAutomations[sIdx] = JSON.parse(JSON.stringify(graph));
    } else {
      this.savedAutomations.push(JSON.parse(JSON.stringify(graph)));
    }

    const tIdx = this.openTabs.findIndex((t) => t.metadata?.id === graph.metadata.id);
    if (tIdx >= 0) {
      this.openTabs[tIdx] = JSON.parse(JSON.stringify(graph));
    }
    this.renderTabs();
  }

  public async loadFromStorage(checkUrlParam: boolean = true): Promise<void> {
    if (chrome.storage?.local) {
      const data = await chrome.storage.local.get('web_automations');
      this.savedAutomations = (data.web_automations || []).map((a: any) => {
        if (a.metadata?.name) a.metadata.name = this.cleanFlowName(a.metadata.name);
        return a;
      });

      if (this.savedAutomations.length === 0) {
        const def = JSON.parse(JSON.stringify(DEFAULT_AUTOMATION));
        def.metadata.name = this.cleanFlowName(def.metadata.name);
        this.savedAutomations = [def];
        await chrome.storage.local.set({ web_automations: this.savedAutomations });
      }
    } else {
      const def = JSON.parse(JSON.stringify(DEFAULT_AUTOMATION));
      def.metadata.name = this.cleanFlowName(def.metadata.name);
      this.savedAutomations = [def];
    }

    this.renderDashboard();
    this.renderTabs();

    if (checkUrlParam) {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam === 'settings') {
        this.openSettingsTab();
        return;
      }

      const flowId = urlParams.get('flowId');
      if (flowId) {
        const matched = this.savedAutomations.find((a) => a.metadata?.id === flowId);
        if (matched) {
          this.callbacks.onOpenFlow(matched);
          return;
        } else {
          this.callbacks.showToast('Fluxo solicitado não foi encontrado no armazenamento.', 'error');
        }
      }
    }
  }

  public renderTabs(): void {
    const container = document.getElementById('workflowTabsContainer');
    if (!container) return;
    container.innerHTML = '';

    // 1. Aba Início dinâmica
    if (this.isDashboardTabOpen) {
      const homeTab = document.createElement('div');
      const isHomeActive = this.activeTabId === 'dashboard';
      homeTab.className = `app-tab-item tab-home ${isHomeActive ? 'active' : ''}`;
      homeTab.title = 'Início (Gerenciador de Fluxos)';
      homeTab.innerHTML = `
        <span class="tab-home-icon" style="display:inline-flex;align-items:center;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </span>
        <span class="tab-label">Início</span>
        <span class="app-tab-close" data-id="dashboard" title="Fechar aba Início">✕</span>
      `;

      homeTab.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).classList.contains('app-tab-close')) return;
        this.openDashboardTab();
      });

      homeTab.querySelector('.app-tab-close')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeDashboardTab();
      });

      container.appendChild(homeTab);
    }

    // 2. Abas de Workflows Abertos
    this.openTabs.forEach((flow) => {
      const tabEl = document.createElement('div');
      const isActive = this.activeTabId === flow.metadata?.id;
      tabEl.className = `app-tab-item ${isActive ? 'active' : ''}`;
      const titleClean = this.cleanFlowName(flow.metadata?.name);
      tabEl.title = titleClean;

      tabEl.innerHTML = `
        <span class="tab-label">${titleClean}</span>
        <span class="app-tab-close" data-id="${flow.metadata?.id}" title="Fechar aba">✕</span>
      `;

      tabEl.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).classList.contains('app-tab-close')) return;
        this.callbacks.onOpenFlow(flow);
      });

      tabEl.querySelector('.app-tab-close')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeTab(flow.metadata?.id);
      });

      container.appendChild(tabEl);
    });

    // 3. Aba de Configurações interna do Visual Flow
    if (this.isSettingsTabOpen) {
      const settingsTab = document.createElement('div');
      const isSettingsActive = this.activeTabId === 'settings';
      settingsTab.className = `app-tab-item ${isSettingsActive ? 'active' : ''}`;
      settingsTab.title = 'Configurações do Visual Flow Studio';
      settingsTab.innerHTML = `
        <span class="tab-label">⚙️ Configurações</span>
        <span class="app-tab-close" data-id="settings" title="Fechar aba">✕</span>
      `;

      settingsTab.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).classList.contains('app-tab-close')) return;
        this.openSettingsTab();
      });

      settingsTab.querySelector('.app-tab-close')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeSettingsTab();
      });

      container.appendChild(settingsTab);
    }
  }

  public closeTab(flowId: string): void {
    const idx = this.openTabs.findIndex((t) => t.metadata?.id === flowId);
    if (idx === -1) return;

    this.openTabs.splice(idx, 1);

    if (this.activeTabId === flowId) {
      if (this.openTabs.length > 0) {
        const nextFlow = this.openTabs[Math.max(0, idx - 1)];
        this.callbacks.onOpenFlow(nextFlow);
      } else if (this.isDashboardTabOpen) {
        this.openDashboardTab();
      } else if (this.isSettingsTabOpen) {
        this.openSettingsTab();
      } else {
        this.openDashboardTab();
      }
    }

    this.renderTabs();
  }

  public renderDashboard(filterQuery: string = ''): void {
    const grid = document.getElementById('automationsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const query = filterQuery.toLowerCase().trim();
    const filtered = this.savedAutomations.filter((auto) => {
      if (!query) return true;
      const name = (auto.metadata?.name || '').toLowerCase();
      const desc = (auto.metadata?.description || '').toLowerCase();
      const tags = (auto.metadata?.tags || []).join(' ').toLowerCase();
      return name.includes(query) || desc.includes(query) || tags.includes(query);
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #64748b;">
          <p style="font-size: 15px; font-weight: 600; margin-bottom: 8px;">Nenhuma automação encontrada.</p>
          <p style="font-size: 13px;">Clique em "Novo Fluxo" para criar ou importe um arquivo .json.</p>
        </div>
      `;
      return;
    }

    filtered.forEach((auto) => {
      const startNode = auto.nodes.find((n) => n.type === 'start');
      let triggerLabel = 'manual';
      if (startNode?.data) {
        if (Array.isArray(startNode.data.triggers) && startNode.data.triggers.length > 0) {
          const names = startNode.data.triggers.map((t: any) => t.type);
          triggerLabel = names.length === 1 ? names[0] : `${names.length} gatilhos`;
        } else if (startNode.data.triggerType) {
          triggerLabel = startNode.data.triggerType;
        }
      }
      const dateFormatted = auto.metadata?.updatedAt ? new Date(auto.metadata.updatedAt).toLocaleDateString('pt-BR') : 'Hoje';

      const card = document.createElement('div');
      card.className = 'flow-card';
      card.innerHTML = `
        <div>
          <div class="flow-card-header">
            <h3 class="flow-card-title">${this.cleanFlowName(auto.metadata?.name)}</h3>
            <span class="flow-tag">${triggerLabel}</span>
          </div>
          <p class="flow-card-desc">${auto.metadata?.description || 'Fluxo de automação visual.'}</p>
          <div class="flow-card-meta">
            <span style="display:inline-flex;align-items:center;gap:4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              ${auto.nodes?.length || 0} blocos
            </span>
            <span>•</span>
            <span style="display:inline-flex;align-items:center;gap:4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              ${dateFormatted}
            </span>
          </div>
        </div>
        <div class="flow-card-actions">
          <button class="btn-card-run" data-id="${auto.metadata.id}" title="Executar este fluxo imediatamente">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Executar
          </button>
          <button class="btn-card-edit" data-id="${auto.metadata.id}" title="Abrir em aba no Visual Flow Studio">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Abrir
          </button>
          <button class="btn-xs delete-flow-btn" data-id="${auto.metadata.id}" title="Excluir fluxo" style="margin-left: auto;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `;

      card.querySelector('.btn-card-run')?.addEventListener('click', () => {
        this.callbacks.onRunFlowDirectly(auto);
      });

      card.querySelector('.btn-card-edit')?.addEventListener('click', () => {
        this.callbacks.onOpenFlow(auto);
      });
      card.querySelector('.flow-card-title')?.addEventListener('click', () => {
        this.callbacks.onOpenFlow(auto);
      });

      card.querySelector('.delete-flow-btn')?.addEventListener('click', async (e) => {
        e.stopPropagation();
        const confirmed = await DialogMenu.confirm({
          title: 'Excluir Automação',
          message: `Deseja realmente excluir a automação "${auto.metadata?.name}"? Esta ação removerá o fluxo do storage local.`,
          confirmText: 'Excluir',
          isDanger: true,
        });
        if (confirmed) {
          this.savedAutomations = this.savedAutomations.filter((a) => a.metadata.id !== auto.metadata.id);
          this.closeTab(auto.metadata.id);
          if (chrome.storage?.local) {
            await chrome.storage.local.set({ web_automations: this.savedAutomations });
          }
          this.callbacks.showToast('Automação excluída.', 'info');
          this.renderDashboard();
        }
      });

      grid.appendChild(card);
    });
  }

  private initTabsUI(): void {
    // Abas gerenciadas dinamicamente em renderTabs()
  }
}
