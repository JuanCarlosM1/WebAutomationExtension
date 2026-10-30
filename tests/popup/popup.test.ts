import { describe, it, expect, vi, beforeEach } from 'vitest';
import { installChromeMock, ChromeMock, flushPromises } from '../helpers/chromeMock';

describe('Popup App (popup.ts)', () => {
  let chromeMock: ChromeMock;

  beforeEach(() => {
    vi.resetModules();
    chromeMock = installChromeMock({
      web_automations: [
        {
          metadata: { id: 'fluxo_1', name: 'Fluxo 1.webautomation.json' },
          nodes: [{ id: '1' }, { id: '2' }],
        },
      ],
    });

    document.body.innerHTML = `
      <button id="btnOpenStudio">Abrir Studio</button>
      <button id="btnOpenHtmlAnalyzer">Analisador HTML</button>
      <button id="btnOpenSettingsPopup">Configurações</button>
      <input type="checkbox" id="mcpToggle" />
      <span id="mcpStatusText"></span>
      <div id="automationsList"></div>
    `;
  });

  async function loadPopup() {
    await import('../../src/popup/popup');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await flushPromises();
  }

  it('deve renderizar automações salvas na lista', async () => {
    await loadPopup();

    const automationsList = document.getElementById('automationsList');
    expect(automationsList?.children.length).toBe(1);

    const titleEl = automationsList?.querySelector('.flow-title');
    expect(titleEl?.textContent).toBe('Fluxo 1'); // extensão .webautomation.json removida

    const runBtn = automationsList?.querySelector('.btn-run') as HTMLButtonElement;
    expect(runBtn).toBeDefined();
    expect(runBtn.getAttribute('data-id')).toBe('fluxo_1');
  });

  it('clicar em "▶ Rodar" deve disparar EXECUTE_AUTOMATION via sendMessage', async () => {
    await loadPopup();

    const runBtn = document.querySelector('.btn-run') as HTMLButtonElement;
    chromeMock.runtime.sendMessage.mockImplementation((msg: any, cb?: any) => {
      if (msg.action === 'EXECUTE_AUTOMATION') {
        cb?.({ success: true });
      }
    });

    runBtn.click();
    expect(chromeMock.runtime.sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'EXECUTE_AUTOMATION' }),
      expect.any(Function)
    );
  });

  it('clicar em abrir fluxo deve abrir editor.html em nova janela', async () => {
    await loadPopup();

    const flowLink = document.querySelector('.flow-link') as HTMLElement;
    flowLink.click();

    expect(chromeMock.windows.create).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('editor.html?flowId=fluxo_1'),
        type: 'popup',
      }),
      expect.any(Function)
    );
  });

  it('deve consultar e refletir status do MCP ao iniciar', async () => {
    chromeMock.runtime.sendMessage.mockImplementation((msg: any, cb?: any) => {
      if (msg.action === 'GET_MCP_STATUS') {
        cb?.({ success: true, enabled: true, connected: true, port: 3001 });
      }
    });

    await loadPopup();

    const toggle = document.getElementById('mcpToggle') as HTMLInputElement;
    const statusText = document.getElementById('mcpStatusText');

    expect(toggle.checked).toBe(true);
    expect(statusText?.textContent).toContain('Conectado na porta 3001');
  });

  it('alternar checkbox MCP deve enviar SET_MCP_CONFIG', async () => {
    chromeMock.runtime.sendMessage.mockImplementation((msg: any, cb?: any) => {
      if (msg.action === 'SET_MCP_CONFIG') {
        cb?.({ success: true });
      }
    });

    await loadPopup();

    const toggle = document.getElementById('mcpToggle') as HTMLInputElement;
    toggle.checked = true;
    toggle.dispatchEvent(new Event('change'));

    expect(chromeMock.runtime.sendMessage).toHaveBeenCalledWith(
      {
        action: 'SET_MCP_CONFIG',
        payload: { enabled: true, port: 3001 },
      },
      expect.any(Function)
    );
  });

  it('clicar no botão do Analisador HTML deve ativar picker na aba ativa', async () => {
    chromeMock.tabs.query.mockImplementation((_q: any, cb?: any) => {
      cb?.([{ id: 42, url: 'https://exemplo.com' }]);
    });

    await loadPopup();

    const btnAnalyzer = document.getElementById('btnOpenHtmlAnalyzer') as HTMLButtonElement;
    btnAnalyzer.click();

    expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(
      42,
      { action: 'OPEN_HTML_ANALYZER', payload: { startPicker: true } },
      expect.any(Function)
    );
  });
});

