import { describe, it, expect, vi, beforeEach } from 'vitest';
import { installChromeMock, ChromeMock, flushPromises } from '../helpers/chromeMock';

describe('Settings App (settingsApp.ts)', () => {
  let chromeMock: ChromeMock;

  beforeEach(() => {
    vi.resetModules();
    chromeMock = installChromeMock({
      floating_buttons_layout_settings: {
        stackDirection: 'horizontal',
        gap: 15,
        maxColumns: 4,
        maxRows: 6,
      },
      visual_studio_preferences: {
        autoSave: 'manual',
        edgeType: 'smoothstep',
        minimap: false,
        snapGrid: true,
        multiSelectMode: 'box',
        areaSelectMode: 'box',
        disableSidebarEditing: true,
      },
      mcp_config: {
        enabled: true,
        port: 4000,
      },
      web_automations: [{ id: '1' }, { id: '2' }, { id: '3' }],
    });

    document.body.innerHTML = `
      <select id="stackDirection"><option value="vertical">vertical</option><option value="horizontal">horizontal</option></select>
      <input id="gapInput" type="number" />
      <input id="maxColumnsInput" type="number" />
      <input id="maxRowsInput" type="number" />
      <button id="btnResetPositions">Reset</button>

      <select id="autoSaveInterval"><option value="always">always</option><option value="manual">manual</option></select>
      <select id="defaultEdgeType"><option value="bezier">bezier</option><option value="smoothstep">smoothstep</option></select>
      <input id="showMinimapDefault" type="checkbox" />
      <input id="snapToGridDefault" type="checkbox" />
      <select id="multiSelectMode"><option value="both">both</option><option value="box">box</option></select>
      <select id="areaSelectMode"><option value="both">both</option><option value="box">box</option></select>
      <input id="disableSidebarEditing" type="checkbox" />

      <input id="mcpEnabled" type="checkbox" />
      <input id="mcpPortInput" type="number" />

      <div id="storageSummaryText"></div>
      <button id="btnExportAllData">Export</button>
      <button id="btnImportAllData">Import</button>
      <input id="backupFileInput" type="file" />
      <button id="btnSaveAllSettings">Salvar</button>
      <button id="btnOpenStudioFromSettings">Studio</button>
      <div id="toastContainer"></div>
    `;
  });

  async function loadSettings() {
    await import('../../src/settings/settingsApp');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await flushPromises();
  }

  it('deve carregar dados de configuração do storage para os inputs da tela', async () => {
    await loadSettings();

    const stackDirection = document.getElementById('stackDirection') as HTMLSelectElement;
    const gapInput = document.getElementById('gapInput') as HTMLInputElement;
    const mcpEnabled = document.getElementById('mcpEnabled') as HTMLInputElement;
    const mcpPortInput = document.getElementById('mcpPortInput') as HTMLInputElement;
    const summaryText = document.getElementById('storageSummaryText');

    expect(stackDirection.value).toBe('horizontal');
    expect(gapInput.value).toBe('15');
    expect(mcpEnabled.checked).toBe(true);
    expect(mcpPortInput.value).toBe('4000');
    expect(summaryText?.textContent).toContain('3 fluxo(s) de automação');
  });

  it('salvar configurações deve atualizar o storage.local e notificar MCP', async () => {
    await loadSettings();

    const gapInput = document.getElementById('gapInput') as HTMLInputElement;
    gapInput.value = '25';

    const btnSave = document.getElementById('btnSaveAllSettings') as HTMLButtonElement;
    btnSave.click();
    await flushPromises();

    expect(chromeMock.__storage.floating_buttons_layout_settings.gap).toBe(25);
    expect(chromeMock.runtime.sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'SET_MCP_CONFIG' })
    );
  });

  it('abrir Studio deve chamar tabs.create com a URL correta', async () => {
    await loadSettings();

    const btnStudio = document.getElementById('btnOpenStudioFromSettings') as HTMLButtonElement;
    btnStudio.click();

    expect(chromeMock.tabs.create).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('editor.html?tab=settings'),
      })
    );
  });
});

