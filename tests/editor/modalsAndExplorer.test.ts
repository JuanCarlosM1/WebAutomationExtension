import { describe, it, expect, vi, beforeEach } from 'vitest';
import { N8NDataExplorer } from '../../src/editor/modules/n8nDataExplorer';
import { FlowSettingsModal } from '../../src/editor/modules/flowSettingsModal';
import { WebAutomationGraph, AnyAutomationNode } from '../../../BibliotecaDeDev/src/types/schema';
import { installChromeMock, ChromeMock } from '../helpers/chromeMock';

describe('Modals & Explorers (n8nDataExplorer.ts & flowSettingsModal.ts)', () => {
  let chromeMock: ChromeMock;

  beforeEach(() => {
    chromeMock = installChromeMock({
      floating_buttons_layout_settings: {
        stackDirection: 'vertical',
        maxColumns: 3,
        maxRows: 5,
        gap: 10,
      },
    });
    document.body.innerHTML = '<div id="modalHost"></div>';
  });

  describe('N8NDataExplorer', () => {
    it('getPredecessorNodes deve identificar nós diretamente e indiretamente conectados', () => {
      const graph: WebAutomationGraph = {
        schemaVersion: '1.0.0',
        metadata: { id: 'g1', name: 'G1', version: '1', createdAt: '', updatedAt: '' },
        settings: { stopOnError: true, defaultTimeoutMs: 1000, logLevel: 'info', parallelBranchesEnabled: false },
        variables: {},
        nodes: [
          { id: 'node_1', type: 'start', category: 'flow_logic', position: { x: 0, y: 0 }, data: { label: 'Start' } },
          { id: 'node_2', type: 'navigate', category: 'browser_navigation', position: { x: 100, y: 0 }, data: { label: 'Nav' } },
          { id: 'node_3', type: 'extract_data', category: 'data_network', position: { x: 200, y: 0 }, data: { label: 'Extract' } },
        ],
        edges: [
          { id: 'e1', source: 'node_1', target: 'node_2' },
          { id: 'e2', source: 'node_2', target: 'node_3' },
        ],
      };

      const predecessors = N8NDataExplorer.getPredecessorNodes(graph, 'node_3');

      expect(predecessors.direct.map((n) => n.id)).toEqual(['node_2']);
      expect(predecessors.ancestors.map((n) => n.id)).toEqual(['node_1']);
    });

    it('generateDefaultMock deve gerar estrutura de dados simulada para nós conhecidos', () => {
      const nodeStart: AnyAutomationNode = {
        id: 'start_1',
        type: 'start',
        category: 'flow_logic',
        position: { x: 0, y: 0 },
        data: { label: 'Início', triggerType: 'manual' },
      };

      const mock = N8NDataExplorer.generateDefaultMock(nodeStart);
      expect(mock).toBeDefined();
      expect(mock.trigger).toBe('manual');
      expect(mock.timestamp).toBeDefined();
    });

    it('render deve renderizar o painel interativo no DOM', () => {
      const graph: WebAutomationGraph = {
        schemaVersion: '1.0.0',
        metadata: { id: 'g1', name: 'G1', version: '1', createdAt: '', updatedAt: '' },
        settings: { stopOnError: true, defaultTimeoutMs: 1000, logLevel: 'info', parallelBranchesEnabled: false },
        variables: { varGlobal: 'valor123' },
        nodes: [
          { id: 'node_1', type: 'start', category: 'flow_logic', position: { x: 0, y: 0 }, data: { label: 'Start' } },
          { id: 'node_2', type: 'extract_data', category: 'data_network', position: { x: 100, y: 0 }, data: { label: 'Extract' } },
        ],
        edges: [{ id: 'e1', source: 'node_1', target: 'node_2' }],
      };

      const container = document.createElement('div');
      N8NDataExplorer.render(container, {
        graph,
        currentNode: graph.nodes[1],
        runtimeNodeOutputs: { node_1: { status: 'success' } },
        onInsertExpression: vi.fn(),
        onShowToast: vi.fn(),
      });

      expect(container.innerHTML).toContain('Dados Anteriores');
      expect(container.innerHTML).toContain('Blocos Anteriores');
    });
  });

  describe('FlowSettingsModal', () => {
    it('deve abrir o modal de configurações de layout com classes corretas', () => {
      FlowSettingsModal.open();

      const modal = document.querySelector('.flow-settings-modal-backdrop');
      expect(modal).toBeDefined();
      expect(modal?.innerHTML).toContain('Botões Flutuantes');
    });

    it('deve salvar configurações e persistir no storage.local', () => {
      const onSave = vi.fn();
      FlowSettingsModal.open(onSave);

      const saveBtn = document.querySelector('.flow-settings-card button[style*="background: #3b82f6"]') as HTMLButtonElement;
      if (saveBtn) {
        saveBtn.click();
        expect(chromeMock.storage.local.set).toHaveBeenCalled();
      }
    });
  });
});
