import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InspectorInputHelpers } from '../../src/editor/modules/inspectorInputHelpers';
import { DomPropertiesRenderer } from '../../src/editor/modules/inspector/domProperties';
import { DataPropertiesRenderer } from '../../src/editor/modules/inspector/dataProperties';
import { FlowPropertiesRenderer } from '../../src/editor/modules/inspector/flowProperties';
import { StartPropertiesRenderer } from '../../src/editor/modules/inspector/startProperties';
import { InspectorManager } from '../../src/editor/modules/inspectorManager';
import { ColorPickerManager } from '../../src/editor/modules/colorPickerManager';
import { installChromeMock } from '../helpers/chromeMock';

describe('Inspector & Properties Modules', () => {
  let container: HTMLElement;
  let mockCtx: any;

  beforeEach(() => {
    installChromeMock();
    container = document.createElement('div');
    document.body.appendChild(container);
    mockCtx = {
      renderInspector: vi.fn(),
      getGraph: () => ({ nodes: [], edges: [], variables: {} }),
      showToast: vi.fn(),
      expandedTriggerIndices: new Set<number>([0]),
    };
  });

  describe('InspectorInputHelpers', () => {
    it('addTextInput deve adicionar input e disparar onChange ao digitar', () => {
      const onChange = vi.fn();
      InspectorInputHelpers.addTextInput(container, 'Nome do Fluxo', 'Meu Fluxo', onChange);

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('Meu Fluxo');

      input.value = 'Nome Atualizado';
      input.dispatchEvent(new Event('input'));

      expect(onChange).toHaveBeenCalledWith('Nome Atualizado');
    });

    it('addSelectorInput deve criar input com botão de mirar HTML', () => {
      const onChange = vi.fn();
      InspectorInputHelpers.addSelectorInput(container, 'Seletor', '#meu-id', onChange);

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('#meu-id');

      const btnMira = container.querySelector('.btn-launch-analyzer');
      expect(btnMira).toBeDefined();
    });

    it('addSelectInput deve criar select com opções', () => {
      const onChange = vi.fn();
      InspectorInputHelpers.addSelectInput(
        container,
        'Tipo',
        'opcao1',
        [
          { value: 'opcao1', label: 'Opção 1' },
          { value: 'opcao2', label: 'Opção 2' },
        ],
        onChange
      );

      const select = container.querySelector('select') as HTMLSelectElement;
      expect(select.value).toBe('opcao1');

      select.value = 'opcao2';
      select.dispatchEvent(new Event('change'));

      expect(onChange).toHaveBeenCalledWith('opcao2');
    });

    it('addCheckboxInput deve criar checkbox e disparar booleano', () => {
      const onChange = vi.fn();
      InspectorInputHelpers.addCheckboxInput(container, 'Ativo', false, onChange);

      const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));

      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Renderizadores de Propriedades por Categoria', () => {
    it('DomPropertiesRenderer deve renderizar campos para click_element e tab_action', () => {
      const clickData = { selector: 'button.btn', clickType: 'single' };
      DomPropertiesRenderer.renderClick(container, clickData);
      expect(container.innerHTML).toContain('Seletor');

      const tabData = { action: 'new_tab', url: 'https://exemplo.com' };
      DomPropertiesRenderer.renderTabAction(container, tabData, mockCtx);
      expect(container.innerHTML).toContain('Ação de Aba');
    });

    it('DataPropertiesRenderer deve renderizar campos para extract_data e httpRequest', () => {
      const extractData = { selector: 'h1', extractType: 'innerText', saveToVar: 'titulo' };
      DataPropertiesRenderer.renderExtractData(container, extractData, mockCtx);
      expect(container.innerHTML).toContain('Extração');

      const httpData = { url: 'https://api.com', method: 'GET' };
      DataPropertiesRenderer.renderHttpRequest(container, httpData, mockCtx);
      expect(container.innerHTML).toContain('URL da Requisição');
    });

    it('FlowPropertiesRenderer deve renderizar campos para delay e ifElement', () => {
      const delayData = { fixedMs: 1500, isRandom: false };
      FlowPropertiesRenderer.renderDelay(container, delayData, mockCtx);
      expect(container.innerHTML).toContain('Atraso Fixo');

      const ifData = { selector: '#alerta', selectorType: 'css' };
      FlowPropertiesRenderer.renderIfElement(container, ifData);
      expect(container.innerHTML).toContain('Seletor');
    });

    it('StartPropertiesRenderer deve renderizar configuração do bloco Start', () => {
      const startData = {
        label: 'Início',
        triggers: [{ type: 'manual', enabled: true }],
      };

      StartPropertiesRenderer.renderStartBlock(container, startData, mockCtx);
      expect(container.innerHTML).toContain('Formas de Disparo');
      expect(container.innerHTML).toContain('Tipo de Disparo');
    });
  });

  describe('InspectorManager — Modo Fantasma e Controle de Edição', () => {
    let form: HTMLFormElement;
    let noSelection: HTMLElement;
    let inspector: InspectorManager;
    let mockGraph: any;
    let selectedNodeId: string | undefined;

    beforeEach(() => {
      document.body.innerHTML = `
        <div id="sidebarInspector"></div>
        <div id="sidebarLibrary"></div>
        <div id="resizerLeft"></div>
        <button id="btnActivityBlocks"></button>
        <button id="btnActivityInspector"></button>
        <div id="noSelectionMessage"></div>
        <form id="nodePropertiesForm"></form>
      `;
      form = document.getElementById('nodePropertiesForm') as HTMLFormElement;
      noSelection = document.getElementById('noSelectionMessage')!;

      mockGraph = {
        nodes: [
          {
            id: 'node_1',
            type: 'click_element',
            category: 'browser_action',
            position: { x: 0, y: 0 },
            data: { label: 'Clique no Botão', selector: '#btn-submit' },
          },
        ],
        edges: [],
      };
      selectedNodeId = 'node_1';

      const callbacks = {
        getGraph: () => mockGraph,
        getSelectedNodeId: () => selectedNodeId,
        getSelectedNodeIds: () => (selectedNodeId ? [selectedNodeId] : []),
        onNodeDataChanged: vi.fn(),
        onRenderGraph: vi.fn(),
        showToast: vi.fn(),
      };

      const colorPicker = new ColorPickerManager();
      inspector = new InspectorManager(callbacks, colorPicker);
    });

    it('renderiza propriedades normais quando não está em Modo Fantasma', () => {
      inspector.renderInspector();
      expect(form.classList.contains('hidden')).toBe(false);
      expect(form.innerHTML).toContain('Clique no Botão');
      expect(form.innerHTML).toContain('Seletor');
    });

    it('setGhostMode(true) ativa Modo Fantasma e exibe dados da execução', () => {
      const ghostRunItem = {
        blockSnapshots: {
          node_1: {
            nodeId: 'node_1',
            nodeType: 'click_element',
            nodeLabel: 'Clique no Botão',
            status: 'completed',
            durationMs: 45,
            inputData: { target: '#btn-submit' },
            outputData: { clicked: true },
            config: { selector: '#btn-submit' },
            executedAt: Date.now(),
          },
        },
      };

      inspector.setGhostMode(true, ghostRunItem);

      expect(form.innerHTML).toContain('Modo Fantasma • Leitura');
      expect(form.innerHTML).toContain('Concluído com Sucesso');
      expect(form.innerHTML).toContain('45ms');
      expect(form.innerHTML).toContain('"target": "#btn-submit"');
      expect(form.innerHTML).toContain('"clicked": true');
    });

    it('setGhostMode(true) com falha exibe status de erro', () => {
      const ghostRunItem = {
        blockSnapshots: {
          node_1: {
            nodeId: 'node_1',
            status: 'failed',
            error: 'Elemento não encontrado',
          },
        },
      };

      inspector.setGhostMode(true, ghostRunItem);
      expect(form.innerHTML).toContain('Falha / Erro');
    });

    it('setGhostMode(false) restaura visualização de edição do inspector', () => {
      inspector.setGhostMode(true, { blockSnapshots: {} });
      expect(form.innerHTML).toContain('Modo Fantasma');

      inspector.setGhostMode(false);
      expect(form.innerHTML).not.toContain('Modo Fantasma');
      expect(form.innerHTML).toContain('Clique no Botão');
    });

    it('setDisableSidebarEditing(true) exibe aviso de bloqueio direcionando para modo expandido', () => {
      inspector.setDisableSidebarEditing(true);

      expect(form.innerHTML).toContain('Edição na Barra Lateral Desativada');
      expect(form.innerHTML).toContain('Editar no Modo Expandido');
    });
  });
});
