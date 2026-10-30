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
      expect(tabManager.getActiveTabId()).toBe('dashboard');

      tabManager.openDashboardTab();
      expect(onViewChange).toHaveBeenCalledWith('dashboard');
    });
  });
});
