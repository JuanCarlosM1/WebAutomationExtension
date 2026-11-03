import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VariablesManager } from '../../src/editor/modules/variablesManager';
import { WorkflowTabManager } from '../../src/editor/modules/tabManager';
import { WebAutomationGraph } from '../../../BibliotecaDeDev/src/types/schema';

describe('Workspace Managers (variablesManager.ts & tabManager.ts)', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="flowTabs"></div>
      <div id="dashboardView"></div>
      <div id="studioView"></div>
      <div id="settingsView"></div>
      <div id="variablesModal">
        <tbody id="variablesTableBody"></tbody>
        <button id="btnAddVariable"></button>
      </div>
    `;
  });

  describe('VariablesManager', () => {
    it('ensureVariableDefinitions deve sincronizar variáveis simples com variableDefinitions', () => {
      const graph: WebAutomationGraph = {
        schemaVersion: '1.0.0',
        metadata: { id: 'g1', name: 'Fluxo Vars', version: '1', createdAt: '', updatedAt: '' },
        settings: { stopOnError: true, defaultTimeoutMs: 1000, logLevel: 'info', parallelBranchesEnabled: false },
        variables: {
          contador: 10,
          ativo: true,
          nome: 'Teste',
          lista: [1, 2, 3],
        },
        nodes: [],
        edges: [],
      };

      const manager = new VariablesManager({
        getGraph: () => graph,
        onVariablesChanged: vi.fn(),
        showToast: vi.fn(),
      });

      const defs = manager.ensureVariableDefinitions();

      expect(defs.length).toBe(4);
      expect(defs.find((d) => d.name === 'contador')?.type).toBe('number');
      expect(defs.find((d) => d.name === 'ativo')?.type).toBe('boolean');
      expect(defs.find((d) => d.name === 'nome')?.type).toBe('string');
      expect(defs.find((d) => d.name === 'lista')?.type).toBe('array');
    });
  });

  describe('WorkflowTabManager', () => {
    function makeTabGraph(id: string, name: string): WebAutomationGraph {
      return {
        schemaVersion: '1.0.0',
        metadata: { id, name, version: '1.0', createdAt: '', updatedAt: '' },
        settings: { stopOnError: true, defaultTimeoutMs: 1000, logLevel: 'info', parallelBranchesEnabled: false },
        variables: {},
        nodes: [{ id: 's', type: 'start', category: 'flow_logic', position: { x: 0, y: 0 }, data: { label: 'Start' } }],
        edges: [],
      };
    }

    it('cleanFlowName deve remover extensão .webautomation.json ou .json', () => {
      const tabManager = new WorkflowTabManager({
        onOpenFlow: vi.fn(),
        onViewChange: vi.fn(),
        onRunFlowDirectly: vi.fn(),
        showToast: vi.fn(),
      });

      expect(tabManager.cleanFlowName('MinhaAutomação.webautomation.json')).toBe('MinhaAutomação');
      expect(tabManager.cleanFlowName('MeuFluxo.json')).toBe('MeuFluxo');
      expect(tabManager.cleanFlowName('')).toBe('Sem Título');
    });

    it('deve gerenciar automações salvas e alternar abas', () => {
      const onViewChange = vi.fn();
      const tabManager = new WorkflowTabManager({
        onOpenFlow: vi.fn(),
        onViewChange,
        onRunFlowDirectly: vi.fn(),
        showToast: vi.fn(),
      });

      const g1 = makeTabGraph('g1', 'Fluxo 1');
      tabManager.setSavedAutomations([g1]);

      expect(tabManager.getSavedAutomations().length).toBe(1);
      expect(tabManager.isHomeTabActive()).toBe(true);

      tabManager.openDashboardTab();
      expect(onViewChange).toHaveBeenCalledWith('dashboard');
    });

    it('aba fantasma deve receber classe tab-ghost e não ser persistida em savedAutomations', () => {
      document.body.innerHTML += '<div id="workflowTabsContainer"></div>';
      const tabManager = new WorkflowTabManager({
        onOpenFlow: vi.fn(),
        onViewChange: vi.fn(),
        onRunFlowDirectly: vi.fn(),
        showToast: vi.fn(),
      });

      const normal = makeTabGraph('n1', 'Fluxo Normal');
      tabManager.setSavedAutomations([normal]);
      tabManager.registerOpenTab(normal);

      const ghost = makeTabGraph('ghost_run_1', 'Fluxo Fantasma');
      (ghost as any).isGhost = true;
      tabManager.registerOpenTab(ghost);

      // Deve renderizar a aba fantasma com estilo diferenciado
      const tabs = document.querySelectorAll('.app-tab-item');
      const ghostTab = Array.from(tabs).find((t) => t.classList.contains('tab-ghost'));
      expect(ghostTab).toBeDefined();

      // updateFlowInTabsAndSaved ignora fluxos fantasma
      tabManager.updateFlowInTabsAndSaved(ghost);
      expect(tabManager.getSavedAutomations().some((a) => a.metadata.id === 'ghost_run_1')).toBe(false);
    });

    describe('Abas de Início dinâmicas (não fixas)', () => {
      function createManager() {
        document.body.innerHTML += '<div id="workflowTabsContainer"></div>';
        const callbacks = {
          onOpenFlow: vi.fn(),
          onViewChange: vi.fn(),
          onRunFlowDirectly: vi.fn(),
          showToast: vi.fn(),
        };
        const tabManager = new WorkflowTabManager(callbacks);
        callbacks.onOpenFlow.mockImplementation((g: WebAutomationGraph) => tabManager.registerOpenTab(g));
        return { tabManager, callbacks };
      }

      function renderedTabIds(): string[] {
        return Array.from(document.querySelectorAll<HTMLElement>('#workflowTabsContainer .app-tab-item')).map(
          (el) => el.dataset.tabId || ''
        );
      }

      it('ao abrir o Visual Flow a aba ativa é sempre uma aba de Início', () => {
        const { tabManager } = createManager();
        tabManager.renderTabs();
        expect(tabManager.isHomeTabActive()).toBe(true);
        expect(tabManager.getHomeTabIds()).toHaveLength(1);
        expect(document.querySelectorAll('.tab-home.active')).toHaveLength(1);
      });

      it('o botão "+" (openNewHomeTab) sempre abre uma nova aba de Início e a ativa', () => {
        const { tabManager, callbacks } = createManager();
        const first = tabManager.getActiveTabId();
        const second = tabManager.openNewHomeTab();

        expect(second).not.toBe(first);
        expect(tabManager.getHomeTabIds()).toEqual([first, second]);
        expect(tabManager.getActiveTabId()).toBe(second);
        expect(callbacks.onViewChange).toHaveBeenCalledWith('dashboard');
        expect(document.querySelectorAll('.tab-home')).toHaveLength(2);
      });

      it('a aba de Início não é fixa: segue a ordem de abertura junto com as abas de fluxo', () => {
        const { tabManager } = createManager();
        tabManager.registerOpenTab(makeTabGraph('f1', 'Fluxo 1'));
        expect(tabManager.getHomeTabIds()).toHaveLength(0);

        const home = tabManager.openNewHomeTab();
        expect(renderedTabIds()).toEqual(['f1', home]);

        tabManager.registerOpenTab(makeTabGraph('f2', 'Fluxo 2'));
        expect(renderedTabIds()).toEqual(['f1', 'f2']);

        tabManager.registerOpenTab(makeTabGraph('f1', 'Fluxo 1'));
        const home2 = tabManager.openNewHomeTab();
        expect(renderedTabIds()).toEqual(['f1', home2, 'f2']);
      });

      it('abrir um fluxo já aberto apenas ativa a aba existente, sem duplicar', () => {
        const { tabManager } = createManager();
        tabManager.registerOpenTab(makeTabGraph('f1', 'Fluxo 1'));
        tabManager.openNewHomeTab();
        tabManager.registerOpenTab(makeTabGraph('f1', 'Fluxo 1'));

        expect(tabManager.getOpenTabs()).toHaveLength(1);
        expect(tabManager.getActiveTabId()).toBe('f1');
        expect(tabManager.getHomeTabIds()).toHaveLength(1);
      });

      it('fechar a aba de Início ativa ativa a aba vizinha', () => {
        const { tabManager, callbacks } = createManager();
        tabManager.registerOpenTab(makeTabGraph('f1', 'Fluxo 1'));
        const home = tabManager.openNewHomeTab();

        tabManager.closeDashboardTab(home);

        expect(tabManager.getHomeTabIds()).toHaveLength(0);
        expect(callbacks.onOpenFlow).toHaveBeenCalledWith(expect.objectContaining({ metadata: expect.objectContaining({ id: 'f1' }) }));
        expect(tabManager.getActiveTabId()).toBe('f1');
      });

      it('fechar todas as abas abre automaticamente uma nova aba de Início', () => {
        const { tabManager, callbacks } = createManager();
        tabManager.registerOpenTab(makeTabGraph('f1', 'Fluxo 1'));
        tabManager.openSettingsTab();
        callbacks.onViewChange.mockClear();

        tabManager.closeSettingsTab();
        tabManager.closeTab('f1');

        expect(tabManager.getOpenTabs()).toHaveLength(0);
        expect(tabManager.getHomeTabIds()).toHaveLength(1);
        expect(tabManager.isHomeTabActive()).toBe(true);
        expect(callbacks.onViewChange).toHaveBeenLastCalledWith('dashboard');
        expect(document.querySelectorAll('.app-tab-item')).toHaveLength(1);
        expect(document.querySelector('.tab-home.active')).not.toBeNull();
      });

      it('fechar a única aba de Início abre outra aba de Início no lugar', () => {
        const { tabManager } = createManager();
        const first = tabManager.getActiveTabId();
        tabManager.closeDashboardTab();

        const homes = tabManager.getHomeTabIds();
        expect(homes).toHaveLength(1);
        expect(homes[0]).not.toBe(first);
        expect(tabManager.isHomeTabActive()).toBe(true);
      });

      it('clicar no ✕ de uma aba de Início pela interface a fecha', () => {
        const { tabManager } = createManager();
        tabManager.openNewHomeTab();
        expect(document.querySelectorAll('.tab-home')).toHaveLength(2);

        (document.querySelector('.tab-home .app-tab-close') as HTMLElement).click();
        expect(document.querySelectorAll('.tab-home')).toHaveLength(1);
        expect(tabManager.getHomeTabIds()).toHaveLength(1);
      });

      it("setActiveTabId('dashboard') reutiliza uma aba de Início existente em vez de criar outra", () => {
        const { tabManager } = createManager();
        tabManager.registerOpenTab(makeTabGraph('f1', 'Fluxo 1'));
        const home = tabManager.openNewHomeTab();
        tabManager.registerOpenTab(makeTabGraph('f1', 'Fluxo 1'));

        tabManager.setActiveTabId('dashboard');
        expect(tabManager.getActiveTabId()).toBe(home);
        expect(tabManager.getHomeTabIds()).toEqual([home]);
      });

      it('abrir Configurações a partir do Início mantém a aba de Início', () => {
        const { tabManager } = createManager();
        const home = tabManager.getActiveTabId();
        tabManager.openSettingsTab();
        expect(renderedTabIds()).toEqual([home, 'settings']);
        expect(tabManager.getActiveTabId()).toBe('settings');
      });

      it('fechar uma aba inativa não altera a aba ativa', () => {
        const { tabManager, callbacks } = createManager();
        tabManager.registerOpenTab(makeTabGraph('f1', 'Fluxo 1'));
        const home = tabManager.openNewHomeTab();
        callbacks.onOpenFlow.mockClear();

        tabManager.closeTab('f1');
        expect(tabManager.getActiveTabId()).toBe(home);
        expect(callbacks.onOpenFlow).not.toHaveBeenCalled();
      });
    });
  });
});
