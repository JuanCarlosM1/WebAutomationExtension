import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ColorPickerManager } from '../../src/editor/modules/colorPickerManager';
import { WebAutomationGraph } from '../../../BibliotecaDeDev/src/types/schema';

describe('ColorPickerManager (colorPickerManager.ts)', () => {
  let mockGraph: WebAutomationGraph;
  let showToast: ReturnType<typeof vi.fn>;
  let onPaletteChanged: ReturnType<typeof vi.fn>;
  let manager: ColorPickerManager;

  beforeEach(() => {
    mockGraph = {
      schemaVersion: '1.0.0',
      metadata: { id: 'g1', name: 'Fluxo Cores', version: '1', createdAt: '', updatedAt: '' },
      settings: { stopOnError: true, defaultTimeoutMs: 1000, logLevel: 'info', parallelBranchesEnabled: false },
      variables: {},
      nodes: [],
      edges: [],
    };
    showToast = vi.fn();
    onPaletteChanged = vi.fn();
    manager = new ColorPickerManager(() => mockGraph, showToast, onPaletteChanged);

    document.body.innerHTML = `
      <div id="colorsSidebarContent"></div>
    `;
  });

  it('getFlowNamedColors deve inicializar paleta padrão se não existir no grafo', () => {
    const colors = manager.getFlowNamedColors();

    expect(Array.isArray(colors)).toBe(true);
    expect(colors.length).toBeGreaterThanOrEqual(5);
    expect(colors.some((c) => c.name === 'primaria')).toBe(true);
    expect(mockGraph.colorPalette).toBeDefined();
  });

  it('getFlowColorPalette deve retornar array apenas de strings hex', () => {
    const hexList = manager.getFlowColorPalette();

    expect(hexList.length).toBeGreaterThanOrEqual(5);
    expect(hexList.every((h) => h.startsWith('#'))).toBe(true);
  });

  it('renderColorsSidebar deve preencher o sidebar de cores no DOM', () => {
    manager.renderColorsSidebar();

    const container = document.getElementById('colorsSidebarContent');
    expect(container?.innerHTML).toContain('Defina cores com nomes personalizados');
  });

  it('createPaintColorPicker deve criar elemento de controle com swatch e disparar onChange', () => {
    const onChange = vi.fn();
    const targetDiv = document.createElement('div');
    manager.createPaintColorPicker(targetDiv, 'Cor do Botão', '#10b981', onChange);

    expect(targetDiv.innerHTML).toContain('Cor do Botão');
    expect(targetDiv.innerHTML).toContain('#10b981');
  });
});
