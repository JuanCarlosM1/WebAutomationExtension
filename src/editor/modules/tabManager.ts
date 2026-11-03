/**
 * Gerenciador de Abas de Fluxos e Dashboard de Automações
 */

import { WebAutomationGraph } from '../../../../BibliotecaDeDev/src/types/schema';
import { DEFAULT_AUTOMATION, ALL_BLOCKS_TEST_AUTOMATION } from '../../defaultAutomation';
import { DialogMenu } from './dialogUtils';

export interface WorkflowTabManagerCallbacks {
  onOpenFlow: (flow: WebAutomationGraph) => void;
  onViewChange: (view: 'dashboard' | 'studio' | 'settings') => void;
  onRunFlowDirectly: (flow: WebAutomationGraph) => void;
  onDebugFlowDirectly?: (flow: WebAutomationGraph) => void;
  showToast: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

export class WorkflowTabManager {
  private savedAutomations: WebAutomationGraph[] = [];
  private openTabs: WebAutomationGraph[] = [];
  /**
   * Ordem visual de todas as abas abertas (Início, fluxos e Configurações).
   * Abas de Início usam ids com prefixo `home_`, a aba de configurações usa `settings`
   * e as abas de fluxo usam o próprio `metadata.id` do fluxo.
   */
  private tabOrder: string[] = [];
  private activeTabId: string = '';
  private homeTabCounter = 0;
  private preserveHomeOnNextOpen = false;

  constructor(private callbacks: WorkflowTabManagerCallbacks) {
    // Ao abrir o Visual Flow, a página inicial é sempre uma aba de Início
    const homeId = this.createHomeTabId();
    this.tabOrder.push(homeId);
    this.activeTabId = homeId;
    this.initTabsUI();
  }

  public static readonly HOME_TAB_PREFIX = 'home_';

  public isHomeTabId(id: string | undefined): boolean {
    return !!id && id.startsWith(WorkflowTabManager.HOME_TAB_PREFIX);
  }

  public isHomeTabActive(): boolean {
    return this.isHomeTabId(this.activeTabId);
  }

  public getTabOrder(): string[] {
    return [...this.tabOrder];
  }

  public getHomeTabIds(): string[] {
    return this.tabOrder.filter((id) => this.isHomeTabId(id));
  }

  private createHomeTabId(): string {
    this.homeTabCounter += 1;
    return `${WorkflowTabManager.HOME_TAB_PREFIX}${this.homeTabCounter}`;
  }

  /** Insere uma nova aba logo após a aba ativa (ou no final, se não houver aba ativa). */
  private insertTabAfterActive(id: string): void {
    const activeIdx = this.tabOrder.indexOf(this.activeTabId);
    if (activeIdx === -1) {
      this.tabOrder.push(id);
    } else {
      this.tabOrder.splice(activeIdx + 1, 0, id);
    }
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

  /**
   * Define a aba ativa. O valor especial `'dashboard'` significa "qualquer aba de Início":
   * mantém a aba de Início ativa, ativa a última aba de Início existente ou cria uma nova.
   */
  public setActiveTabId(id: string): void {
    if (id === 'dashboard') {
      if (!this.isHomeTabActive()) {
        const homes = this.getHomeTabIds();
        if (homes.length > 0) {
          this.activeTabId = homes[homes.length - 1];
        } else {
          const homeId = this.createHomeTabId();
          this.insertTabAfterActive(homeId);
          this.activeTabId = homeId;
        }
      }
    } else {
      this.activeTabId = id;
    }
    this.renderTabs();
  }

  /** Abre sempre uma NOVA aba de Início (comportamento do botão "+"). */
  public openNewHomeTab(): string {
    const homeId = this.createHomeTabId();
    this.insertTabAfterActive(homeId);
    this.activeTabId = homeId;
    this.callbacks.onViewChange('dashboard');
    this.renderTabs();
    return homeId;
  }

  /**
   * Ativa uma aba de Início. Sem id, mantém a aba de Início ativa ou ativa a última existente;
   * se não houver nenhuma, cria uma nova.
   */
  public openDashboardTab(homeId?: string): void {
    if (homeId && this.tabOrder.includes(homeId) && this.isHomeTabId(homeId)) {
      this.activeTabId = homeId;
    } else if (!this.isHomeTabActive()) {
      const homes = this.getHomeTabIds();
      if (homes.length > 0) {
        this.activeTabId = homes[homes.length - 1];
      } else {
        const newId = this.createHomeTabId();
        this.insertTabAfterActive(newId);
        this.activeTabId = newId;
      }
    }
    this.callbacks.onViewChange('dashboard');
    this.renderTabs();
  }

  /** Fecha uma aba de Início (por padrão a aba de Início ativa). */
  public closeDashboardTab(homeId?: string): void {
    const target = homeId || (this.isHomeTabActive() ? this.activeTabId : this.getHomeTabIds().pop());
    if (!target) return;
    this.closeTabById(target);
  }

  public openSettingsTab(): void {
    if (!this.tabOrder.includes('settings')) {
      this.insertTabAfterActive('settings');
    }
    this.activeTabId = 'settings';
    this.callbacks.onViewChange('settings');
    this.renderTabs();
  }

  public closeSettingsTab(): void {
    this.closeTabById('settings');
  }

  public registerOpenTab(graph: WebAutomationGraph): void {
    if (graph.metadata?.name) {
      graph.metadata.name = this.cleanFlowName(graph.metadata.name);
    }
    const flowId = graph.metadata?.id || 'studio';
    const existing = this.openTabs.find((t) => t.metadata?.id === graph.metadata?.id);
    if (!existing) {
      this.openTabs.push(graph);
    } else {
      const idx = this.openTabs.indexOf(existing);
      this.openTabs[idx] = graph;
    }

    if (!this.tabOrder.includes(flowId)) {
      if (this.isHomeTabActive() && !this.preserveHomeOnNextOpen) {
        // Assim como a "nova aba" de um navegador, a aba de Início ativa é substituída pelo fluxo aberto
        const homeIdx = this.tabOrder.indexOf(this.activeTabId);
        this.tabOrder.splice(homeIdx, 1, flowId);
      } else {
        this.insertTabAfterActive(flowId);
      }
    }

    this.activeTabId = flowId;
    this.renderTabs();
  }

  public updateFlowInTabsAndSaved(graph: WebAutomationGraph): void {
    if ((graph as any).isGhost) return;
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

  private isPageReload(): boolean {
    try {
      const entries = (performance?.getEntriesByType?.('navigation') || []) as PerformanceNavigationTiming[];
      return entries.length > 0 && entries[0].type === 'reload';
    } catch {
      return false;
    }
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
        const allBlocks = JSON.parse(JSON.stringify(ALL_BLOCKS_TEST_AUTOMATION));
        allBlocks.metadata.name = this.cleanFlowName(allBlocks.metadata.name);
        this.savedAutomations = [def, allBlocks];
        await chrome.storage.local.set({ web_automations: this.savedAutomations });
      } else if (!this.savedAutomations.some((a) => a.metadata.id === ALL_BLOCKS_TEST_AUTOMATION.metadata.id)) {
        const allBlocks = JSON.parse(JSON.stringify(ALL_BLOCKS_TEST_AUTOMATION));
        allBlocks.metadata.name = this.cleanFlowName(allBlocks.metadata.name);
        this.savedAutomations.push(allBlocks);
        await chrome.storage.local.set({ web_automations: this.savedAutomations });
      }
    } else {
      const def = JSON.parse(JSON.stringify(DEFAULT_AUTOMATION));
      def.metadata.name = this.cleanFlowName(def.metadata.name);
      const allBlocks = JSON.parse(JSON.stringify(ALL_BLOCKS_TEST_AUTOMATION));
      allBlocks.metadata.name = this.cleanFlowName(allBlocks.metadata.name);
      this.savedAutomations = [def, allBlocks];
    }

    this.renderDashboard();
    this.renderTabs();

    if (checkUrlParam) {
      // Ao recarregar a página, o Visual Flow sempre volta para a aba de Início.
      // Links explícitos (ex.: "Editar" no popup ou atalho de configurações) continuam sendo atendidos.
      if (this.isPageReload()) {
        if (window.location.search) {
          window.history.replaceState({}, '', window.location.pathname);
        }
        this.callbacks.onViewChange('dashboard');
        return;
      }

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
          // Link direto: mantém a aba de Início e abre o fluxo em uma nova aba ao lado
          this.preserveHomeOnNextOpen = true;
          this.callbacks.onOpenFlow(matched);
          this.preserveHomeOnNextOpen = false;
          return;
        } else {
          this.callbacks.showToast('Fluxo solicitado não foi encontrado no armazenamento.', 'error');
        }
      }
    }
  }

  private createHomeTabElement(homeId: string): HTMLElement {
    const homeTab = document.createElement('div');
    const isHomeActive = this.activeTabId === homeId;
    homeTab.className = `app-tab-item tab-home ${isHomeActive ? 'active' : ''}`;
    homeTab.dataset.tabId = homeId;
    homeTab.title = 'Início (Gerenciador de Fluxos)';
    homeTab.innerHTML = `
      <span class="tab-home-icon" style="display:inline-flex;align-items:center;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      </span>
      <span class="tab-label">Início</span>
      <span class="app-tab-close" data-id="${homeId}" title="Fechar aba Início">✕</span>
    `;

    homeTab.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).classList.contains('app-tab-close')) return;
      this.openDashboardTab(homeId);
    });

    homeTab.querySelector('.app-tab-close')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeDashboardTab(homeId);
    });

    return homeTab;
  }

  private createFlowTabElement(flow: WebAutomationGraph): HTMLElement {
    const tabEl = document.createElement('div');
    const isActive = this.activeTabId === flow.metadata?.id;
    const isGhost = !!(flow as any).isGhost;
    tabEl.className = `app-tab-item ${isActive ? 'active' : ''} ${isGhost ? 'tab-ghost' : ''}`;
    tabEl.dataset.tabId = flow.metadata?.id || '';
    const titleClean = this.cleanFlowName(flow.metadata?.name);
    tabEl.title = isGhost ? `[Fantasma] ${titleClean}` : titleClean;

    tabEl.innerHTML = `
      <span class="tab-label" style="${isGhost ? 'color: #c7d2fe; display: flex; align-items: center; gap: 4px;' : ''}">${titleClean}</span>
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

    return tabEl;
  }

  private createSettingsTabElement(): HTMLElement {
    const settingsTab = document.createElement('div');
    const isSettingsActive = this.activeTabId === 'settings';
    settingsTab.className = `app-tab-item ${isSettingsActive ? 'active' : ''}`;
    settingsTab.dataset.tabId = 'settings';
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

    return settingsTab;
  }

  public renderTabs(): void {
    const container = document.getElementById('workflowTabsContainer');
    if (!container) return;
    container.innerHTML = '';

    // Todas as abas (Início, fluxos e Configurações) seguem a mesma ordem livre — nenhuma é fixa
    this.tabOrder.forEach((id) => {
      if (this.isHomeTabId(id)) {
        container.appendChild(this.createHomeTabElement(id));
      } else if (id === 'settings') {
        container.appendChild(this.createSettingsTabElement());
      } else {
        const flow = this.openTabs.find((t) => t.metadata?.id === id);
        if (flow) container.appendChild(this.createFlowTabElement(flow));
      }
    });
  }

  /** Ativa a aba indicada disparando a troca de visão correspondente. */
  private activateTab(id: string): void {
    if (this.isHomeTabId(id)) {
      this.openDashboardTab(id);
    } else if (id === 'settings') {
      this.openSettingsTab();
    } else {
      const flow = this.openTabs.find((t) => t.metadata?.id === id);
      if (flow) this.callbacks.onOpenFlow(flow);
    }
  }

  /**
   * Fecha qualquer aba pelo id. Se a aba fechada era a ativa, ativa a vizinha.
   * Se todas as abas forem fechadas, uma nova aba de Início é aberta automaticamente.
   */
  private closeTabById(id: string): void {
    const orderIdx = this.tabOrder.indexOf(id);
    if (orderIdx === -1) return;

    this.tabOrder.splice(orderIdx, 1);
    if (!this.isHomeTabId(id) && id !== 'settings') {
      const flowIdx = this.openTabs.findIndex((t) => t.metadata?.id === id);
      if (flowIdx >= 0) this.openTabs.splice(flowIdx, 1);
    }

    if (this.tabOrder.length === 0) {
      this.activeTabId = '';
      this.openNewHomeTab();
      return;
    }

    if (this.activeTabId === id) {
      const nextId = this.tabOrder[Math.max(0, orderIdx - 1)];
      this.activateTab(nextId);
    }

    this.renderTabs();
  }

  public closeTab(flowId: string): void {
    if (!this.openTabs.some((t) => t.metadata?.id === flowId)) return;
    this.closeTabById(flowId);
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
          <button class="btn-card-debug" data-id="${auto.metadata.id}" title="Depurar em aba em branco">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/></svg>
            Depurar
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

      card.querySelector('.btn-card-debug')?.addEventListener('click', () => {
        this.callbacks.onDebugFlowDirectly?.(auto);
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
