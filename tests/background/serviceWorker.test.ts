import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { installChromeMock, flushPromises, ChromeMock } from '../helpers/chromeMock';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function makeGraph(id: string, startData: any = { label: 'Início', triggerType: 'manual' }, extra: any = {}) {
  return {
    schemaVersion: '1.0.0',
    metadata: { id, name: `Fluxo ${id}`, version: '1.0.0', createdAt: '', updatedAt: '' },
    settings: { stopOnError: true, defaultTimeoutMs: 1000, logLevel: 'info', parallelBranchesEnabled: false },
    variables: { a: 1 },
    nodes: [{ id: 'start', type: 'start', category: 'flow_logic', position: { x: 0, y: 0 }, data: startData }],
    edges: [],
    ...extra,
  } as any;
}

class FakeWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  static instances: FakeWebSocket[] = [];
  readyState = FakeWebSocket.CONNECTING;
  sent: any[] = [];
  onopen?: () => void;
  onmessage?: (e: { data: string }) => any;
  onclose?: () => void;
  onerror?: () => void;
  constructor(public url: string) {
    FakeWebSocket.instances.push(this);
  }
  send(data: string) {
    this.sent.push(JSON.parse(data));
  }
  close = vi.fn(() => {
    this.readyState = FakeWebSocket.CLOSED;
    this.onclose?.();
  });
  open() {
    this.readyState = FakeWebSocket.OPEN;
    this.onopen?.();
  }
}

let chromeMock: ChromeMock;

async function loadWorker(storage: Record<string, any> = {}) {
  vi.resetModules();
  chromeMock = installChromeMock(storage);
  await import('../../src/background/serviceWorker');
  await flushPromises();
  return chromeMock;
}

/** Envia uma mensagem ao listener de runtime.onMessage e aguarda a resposta via sendResponse */
function sendMessage(message: any, sender: any = {}): Promise<any> {
  return new Promise((resolve) => {
    const listener = chromeMock.runtime.onMessage.listeners[0];
    const ret = listener(message, sender, resolve);
    expect(ret).toBe(true); // mantém o canal aberto para resposta assíncrona
  });
}

function broadcasts(type?: string) {
  return chromeMock.runtime.sendMessage.mock.calls
    .map((c: any[]) => c[0])
    .filter((m: any) => !type || m?.type === type);
}

beforeEach(() => {
  FakeWebSocket.instances = [];
  (globalThis as any).WebSocket = FakeWebSocket;
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
});

/* ------------------------------------------------------------------ */
/* Inicialização                                                       */
/* ------------------------------------------------------------------ */

describe('Service Worker — inicialização', () => {
  it('registra todos os listeners de eventos do Chrome', async () => {
    const c = await loadWorker();
    expect(c.runtime.onMessage.listeners).toHaveLength(1);
    expect(c.runtime.onInstalled.listeners).toHaveLength(1);
    expect(c.runtime.onStartup.listeners).toHaveLength(1);
    expect(c.commands.onCommand.listeners).toHaveLength(1);
    expect(c.contextMenus.onClicked.listeners).toHaveLength(1);
    expect(c.alarms.onAlarm.listeners).toHaveLength(1);
    expect(c.webNavigation.onCompleted.listeners).toHaveLength(1);
  });

  it('registra o avaliador seguro de JS no StateManager', async () => {
    await loadWorker();
    const { StateManager } = await import('../../../BibliotecaDeDev/src/engine/StateManager');
    expect(typeof (StateManager as any).customEvaluator).toBe('function');
    expect((StateManager as any).customEvaluator('a + 1', { a: 1 })).toBe(2);
  });

  it('não conecta ao MCP quando desabilitado', async () => {
    await loadWorker({ mcp_config: { enabled: false } });
    expect(FakeWebSocket.instances).toHaveLength(0);
  });

  it('conecta ao MCP na porta configurada quando habilitado no storage', async () => {
    await loadWorker({ mcp_config: { enabled: true, port: 4555 } });
    expect(FakeWebSocket.instances).toHaveLength(1);
    expect(FakeWebSocket.instances[0].url).toBe('ws://localhost:4555/mcp-extension-bridge');
  });

  it('usa a porta 3001 por padrão quando MCP habilitado sem porta', async () => {
    await loadWorker({ mcp_config: { enabled: true } });
    expect(FakeWebSocket.instances[0].url).toBe('ws://localhost:3001/mcp-extension-bridge');
  });
});

/* ------------------------------------------------------------------ */
/* onInstalled / onStartup                                             */
/* ------------------------------------------------------------------ */

describe('Service Worker — onInstalled', () => {
  it('salva a automação padrão quando não há automações', async () => {
    const c = await loadWorker();
    await c.runtime.onInstalled.dispatch({ reason: 'install' })[0];
    const saved = c.__storage.web_automations;
    expect(saved).toHaveLength(1);
    expect(saved[0].metadata.id).toBe('auto_wiki_scraping_default');
    expect(c.alarms.clearAll).toHaveBeenCalled();
  });

  it('não sobrescreve automações existentes', async () => {
    const c = await loadWorker({ web_automations: [makeGraph('existente')] });
    await c.runtime.onInstalled.dispatch({ reason: 'update' })[0];
    expect(c.__storage.web_automations).toHaveLength(1);
    expect(c.__storage.web_automations[0].metadata.id).toBe('existente');
    expect(c.alarms.clearAll).toHaveBeenCalled();
  });
});

describe('Service Worker — onStartup (browser_startup)', () => {
  it('executa apenas fluxos com gatilho browser_startup', async () => {
    const c = await loadWorker({
      web_automations: [
        makeGraph('com_startup', { triggers: [{ type: 'browser_startup', enabled: true }] }),
        makeGraph('manual', { triggerType: 'manual' }),
        makeGraph('startup_desabilitado', { triggers: [{ type: 'browser_startup', enabled: false }] }),
      ],
    });
    await c.runtime.onStartup.dispatch()[0];
    await flushPromises();
    const ids = new Set(broadcasts('STATUS_CHANGE').map((m: any) => m.automationId));
    expect(ids).toEqual(new Set(['com_startup']));
  });

  it('ignora fluxos sem nó start', async () => {
    const g = makeGraph('sem_start');
    g.nodes = [];
    const c = await loadWorker({ web_automations: [g] });
    await c.runtime.onStartup.dispatch()[0];
    await flushPromises();
    expect(broadcasts('STATUS_CHANGE')).toHaveLength(0);
  });
});

/* ------------------------------------------------------------------ */
/* syncTriggers                                                        */
/* ------------------------------------------------------------------ */

describe('Service Worker — sincronização de gatilhos', () => {
  it('cria itens de menu de contexto para gatilhos context_menu', async () => {
    const c = await loadWorker({
      web_automations: [
        makeGraph('f1', {
          triggers: [
            { type: 'context_menu', enabled: true, contextMenuTitle: 'Título Custom' },
            { type: 'context_menu', enabled: true },
            { type: 'manual', enabled: true },
          ],
        }),
      ],
    });
    await sendMessage({ action: 'SYNC_TRIGGERS' });
    expect(c.contextMenus.removeAll).toHaveBeenCalled();
    expect(c.contextMenus.create).toHaveBeenCalledWith({ id: 'menu_flow_f1_0', title: 'Título Custom', contexts: ['all'] });
    expect(c.contextMenus.create).toHaveBeenCalledWith({ id: 'menu_flow_f1_1', title: 'Executar: Fluxo f1', contexts: ['all'] });
    expect(c.contextMenus.create).toHaveBeenCalledTimes(2);
  });

  it.each([
    [{ intervalMinutes: 30 }, 30],
    [{}, 15],
    [{ intervalValue: 5, intervalUnit: 'minutes' }, 5],
    [{ intervalValue: 2, intervalUnit: 'hours' }, 120],
    [{ intervalValue: 30, intervalUnit: 'seconds' }, 0.5],
    [{ intervalValue: 1, intervalUnit: 'seconds' }, 0.1],
    [{ intervalValue: 120000, intervalUnit: 'ms' }, 2],
    [{ intervalValue: 10, intervalUnit: 'ms' }, 0.1],
  ])('cria alarme de intervalo para schedule %j → %d min', async (cfg, expected) => {
    const c = await loadWorker({
      web_automations: [makeGraph('s1', { triggers: [{ type: 'schedule', enabled: true, ...cfg }] })],
    });
    await sendMessage({ action: 'SYNC_TRIGGERS' });
    expect(c.alarms.clearAll).toHaveBeenCalled();
    expect(c.alarms.create).toHaveBeenCalledWith('alarm_flow_s1_0', { periodInMinutes: expected });
  });

  it('cria alarme de verificação a cada 1 min para date_schedule', async () => {
    const c = await loadWorker({
      web_automations: [makeGraph('d1', { triggers: [{ type: 'manual' }, { type: 'date_schedule', enabled: true }] })],
    });
    await sendMessage({ action: 'SYNC_TRIGGERS' });
    expect(c.alarms.create).toHaveBeenCalledWith('date_alarm_flow_d1_1', { periodInMinutes: 1 });
  });

  it('suporta formato legado (triggerType/intervalMinutes)', async () => {
    const c = await loadWorker({
      web_automations: [makeGraph('legado', { triggerType: 'schedule', intervalMinutes: 45 })],
    });
    await sendMessage({ action: 'SYNC_TRIGGERS' });
    expect(c.alarms.create).toHaveBeenCalledWith('alarm_flow_legado_0', { periodInMinutes: 45 });
  });

  it('captura erros internos e continua respondendo com sucesso', async () => {
    const c = await loadWorker();
    c.storage.local.get.mockRejectedValueOnce(new Error('falha storage'));
    await expect(sendMessage({ action: 'SYNC_TRIGGERS' })).resolves.toEqual({ success: true });
    expect(console.warn).toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/* Mensagens de runtime                                                */
/* ------------------------------------------------------------------ */

describe('Service Worker — mensagens de runtime', () => {
  it('SAVE_AUTOMATION adiciona um novo fluxo', async () => {
    const c = await loadWorker();
    const res = await sendMessage({ action: 'SAVE_AUTOMATION', payload: { graph: makeGraph('novo') } });
    expect(res).toEqual({ success: true });
    expect(c.__storage.web_automations.map((g: any) => g.metadata.id)).toEqual(['novo']);
    expect(c.alarms.clearAll).toHaveBeenCalled(); // syncTriggers após salvar
  });

  it('SAVE_AUTOMATION atualiza um fluxo existente pelo id', async () => {
    const c = await loadWorker({ web_automations: [makeGraph('x'), makeGraph('y')] });
    const updated = makeGraph('x');
    updated.metadata.name = 'Renomeado';
    await sendMessage({ action: 'SAVE_AUTOMATION', payload: { graph: updated } });
    expect(c.__storage.web_automations).toHaveLength(2);
    expect(c.__storage.web_automations[0].metadata.name).toBe('Renomeado');
  });

  it('EXECUTE_AUTOMATION executa o grafo e retorna o resultado', async () => {
    await loadWorker();
    const res = await sendMessage({ action: 'EXECUTE_AUTOMATION', payload: { graph: makeGraph('run') } });
    expect(res.success).toBe(true);
    expect(res.status).toBe('completed');
    expect(res.variables).toMatchObject({ a: 1 });
    expect(res.nodeOutputs).toBeTypeOf('object');
    expect(res.readonlyVariables).toBeDefined();
    expect(Array.isArray(res.logs)).toBe(true);
    expect(res.error).toBeUndefined();
  });

  it('EXECUTE_AUTOMATION retorna erro quando o fluxo falha', async () => {
    await loadWorker();
    const g = makeGraph('falha');
    g.nodes = [];
    const res = await sendMessage({ action: 'EXECUTE_AUTOMATION', payload: { graph: g } });
    expect(res.success).toBe(false);
    expect(res.status).toBe('failed');
    expect(res.error).toMatch(/start/i);
  });

  it('EXECUTE_AUTOMATION transmite eventos de progresso para a UI', async () => {
    await loadWorker();
    await sendMessage({ action: 'EXECUTE_AUTOMATION', payload: { graph: makeGraph('ev') } });
    const statuses = broadcasts('STATUS_CHANGE').map((m: any) => m.status);
    expect(statuses).toContain('running');
    expect(statuses).toContain('completed');
    expect(broadcasts('NODE_START')).toContainEqual({ type: 'NODE_START', automationId: 'ev', nodeId: 'start' });
    const complete = broadcasts('NODE_COMPLETE')[0];
    expect(complete).toMatchObject({ automationId: 'ev', nodeId: 'start', nodeLabel: 'Início' });
    expect(broadcasts('LOG').length).toBeGreaterThan(0);
  });

  it('EXECUTE_AUTOMATION usa a aba remetente quando enviado por um content script', async () => {
    const c = await loadWorker();
    const g = makeGraph('tab');
    g.nodes.push({ id: 'h', type: 'history_navigation', category: 'browser_navigation', position: { x: 0, y: 0 }, data: { action: 'reload' } });
    g.edges.push({ id: 'e', source: 'start', target: 'h' });
    await sendMessage({ action: 'EXECUTE_AUTOMATION', payload: { graph: g } }, { tab: { id: 77, url: 'https://web.com' } });
    expect(c.tabs.reload).toHaveBeenCalledWith(77, expect.anything());
  });

  it('EXECUTE_AUTOMATION prioriza payload.tabId', async () => {
    const c = await loadWorker();
    const g = makeGraph('tab2');
    g.nodes.push({ id: 'h', type: 'history_navigation', category: 'browser_navigation', position: { x: 0, y: 0 }, data: { action: 'reload' } });
    g.edges.push({ id: 'e', source: 'start', target: 'h' });
    await sendMessage({ action: 'EXECUTE_AUTOMATION', payload: { graph: g, tabId: 55 } }, { tab: { id: 77, url: 'https://web.com' } });
    expect(c.tabs.reload).toHaveBeenCalledWith(55, expect.anything());
  });

  it('CANCEL_AUTOMATION retorna erro se não houver execução', async () => {
    await loadWorker();
    const res = await sendMessage({ action: 'CANCEL_AUTOMATION', payload: { automationId: 'nada' } });
    expect(res).toEqual({ success: false, error: 'Automação não encontrada em execução.' });
  });

  it('CANCEL_AUTOMATION solicita cancelamento de contexto conhecido', async () => {
    await loadWorker();
    await sendMessage({ action: 'EXECUTE_AUTOMATION', payload: { graph: makeGraph('c1') } });
    const res = await sendMessage({ action: 'CANCEL_AUTOMATION', payload: { automationId: 'c1' } });
    expect(res).toEqual({ success: true });
  });

  it('SET_MCP_CONFIG habilita, persiste e conecta', async () => {
    const c = await loadWorker();
    const res = await sendMessage({ action: 'SET_MCP_CONFIG', payload: { enabled: true, port: 4000 } });
    expect(res).toEqual({ success: true, enabled: true, port: 4000 });
    expect(c.__storage.mcp_config).toEqual({ enabled: true, port: 4000 });
    expect(FakeWebSocket.instances.at(-1)!.url).toBe('ws://localhost:4000/mcp-extension-bridge');
  });

  it('SET_MCP_CONFIG usa porta padrão 3001', async () => {
    await loadWorker();
    const res = await sendMessage({ action: 'SET_MCP_CONFIG', payload: { enabled: true } });
    expect(res.port).toBe(3001);
  });

  it('SET_MCP_CONFIG desabilita e fecha a conexão', async () => {
    const c = await loadWorker({ mcp_config: { enabled: true, port: 3001 } });
    const ws = FakeWebSocket.instances[0];
    ws.open();
    const res = await sendMessage({ action: 'SET_MCP_CONFIG', payload: { enabled: false } });
    expect(res.enabled).toBe(false);
    expect(ws.close).toHaveBeenCalled();
    expect(c.__storage.mcp_config.enabled).toBe(false);
  });

  it('GET_MCP_STATUS reflete estado desconectado/conectado', async () => {
    await loadWorker({ mcp_config: { enabled: true, port: 3005 } });
    let res = await sendMessage({ action: 'GET_MCP_STATUS' });
    expect(res).toEqual({ success: true, enabled: true, connected: false, port: 3005 });
    FakeWebSocket.instances[0].open();
    res = await sendMessage({ action: 'GET_MCP_STATUS' });
    expect(res.connected).toBe(true);
  });

  it('RELAY_PICKER_KEY encaminha a tecla para a aba', async () => {
    const c = await loadWorker();
    const res = await sendMessage({ action: 'RELAY_PICKER_KEY', payload: { tabId: 12, key: 'Escape', code: 'Escape' } });
    expect(res).toEqual({ success: true });
    expect(c.tabs.sendMessage).toHaveBeenCalledWith(
      12,
      { action: 'FORWARD_PICKER_KEY', payload: { key: 'Escape', code: 'Escape' } },
      expect.any(Function)
    );
  });

  it('RELAY_PICKER_KEY sem tabId não envia nada', async () => {
    const c = await loadWorker();
    const res = await sendMessage({ action: 'RELAY_PICKER_KEY', payload: {} });
    expect(res).toEqual({ success: true });
    expect(c.tabs.sendMessage).not.toHaveBeenCalled();
  });

  it('GET_ACTIVE_WEB_TAB retorna a aba web ativa atual', async () => {
    const c = await loadWorker();
    c.tabs.query.mockImplementation((q: any) => {
      if (q.active && q.lastFocusedWindow) {
        return Promise.resolve([{ id: 42, title: 'Minha Pagina', url: 'https://exemplo.com' }]);
      }
      return Promise.resolve([]);
    });

    const res = await sendMessage({ action: 'GET_ACTIVE_WEB_TAB' });
    expect(res).toEqual({
      success: true,
      tabId: 42,
      title: 'Minha Pagina',
      url: 'https://exemplo.com',
    });
  });

  it('GET_ACTIVE_WEB_TAB ignora abas internas da extensão e seleciona a primeira web', async () => {
    const c = await loadWorker();
    c.tabs.query.mockImplementation((q: any) => {
      if (q.active && q.lastFocusedWindow) {
        return Promise.resolve([{ id: 10, title: 'Editor', url: 'chrome-extension://xyz/editor.html' }]);
      }
      return Promise.resolve([
        { id: 10, title: 'Editor', url: 'chrome-extension://xyz/editor.html' },
        { id: 99, title: 'Web Page', url: 'https://exemplo.com' },
      ]);
    });

    const res = await sendMessage({ action: 'GET_ACTIVE_WEB_TAB' });
    expect(res).toEqual({
      success: true,
      tabId: 99,
      title: 'Web Page',
      url: 'https://exemplo.com',
    });
  });

  it('GET_EXECUTION_HISTORY retorna lista do histórico de execuções', async () => {
    await loadWorker({
      web_automations_history: [
        { id: 'run_1', automationId: 'auto_1', status: 'completed' },
      ],
    });

    const res = await sendMessage({ action: 'GET_EXECUTION_HISTORY' });
    expect(res.success).toBe(true);
    expect(res.history).toHaveLength(1);
    expect(res.history[0].id).toBe('run_1');
  });

  it('CLEAR_EXECUTION_HISTORY limpa histórico global ou por automação', async () => {
    const c = await loadWorker({
      web_automations_history: [
        { id: 'run_1', automationId: 'auto_1', status: 'completed' },
        { id: 'run_2', automationId: 'auto_2', status: 'completed' },
      ],
    });

    // Limpar específico
    let res = await sendMessage({ action: 'CLEAR_EXECUTION_HISTORY', payload: { automationId: 'auto_1' } });
    expect(res).toEqual({ success: true });
    expect(c.__storage.web_automations_history).toHaveLength(1);
    expect(c.__storage.web_automations_history[0].id).toBe('run_2');

    // Limpar tudo
    res = await sendMessage({ action: 'CLEAR_EXECUTION_HISTORY' });
    expect(res).toEqual({ success: true });
    expect(c.__storage.web_automations_history).toBeUndefined();
  });

  it('DELETE_EXECUTION remove um registro específico pelo ID', async () => {
    const c = await loadWorker({
      web_automations_history: [
        { id: 'run_1', automationId: 'auto_1' },
        { id: 'run_2', automationId: 'auto_1' },
      ],
    });

    const res = await sendMessage({ action: 'DELETE_EXECUTION', payload: { id: 'run_1' } });
    expect(res).toEqual({ success: true });
    expect(c.__storage.web_automations_history).toHaveLength(1);
    expect(c.__storage.web_automations_history[0].id).toBe('run_2');

    const errRes = await sendMessage({ action: 'DELETE_EXECUTION', payload: {} });
    expect(errRes.success).toBe(false);
  });

  it('FOCUS_TAB ativa a aba e coloca o foco na janela correspondente', async () => {
    const c = await loadWorker();
    c.tabs.get.mockResolvedValue({ id: 88, windowId: 5 });

    const res = await sendMessage({ action: 'FOCUS_TAB', payload: { tabId: 88 } });
    expect(res).toEqual({ success: true });
    expect(c.tabs.update).toHaveBeenCalledWith(88, { active: true });
    expect(c.windows.update).toHaveBeenCalledWith(5, { focused: true });

    const errRes = await sendMessage({ action: 'FOCUS_TAB', payload: {} });
    expect(errRes).toEqual({ success: false, error: 'tabId não especificado' });
  });

  it('EXECUTE_AUTOMATION registra histórico completo com snapshots de nós e variáveis', async () => {
    const c = await loadWorker();
    const g = makeGraph('hist_test');
    const res = await sendMessage({ action: 'EXECUTE_AUTOMATION', payload: { graph: g } });

    expect(res.success).toBe(true);
    expect(res.historyItem).toBeDefined();
    expect(res.historyItem.automationId).toBe('hist_test');
    expect(res.historyItem.status).toBe('completed');
    expect(res.historyItem.blockSnapshots).toBeDefined();
    expect(c.__storage.web_automations_history).toBeDefined();
    expect(c.__storage.web_automations_history.length).toBeGreaterThan(0);
  });

  it('ação desconhecida retorna erro', async () => {
    await loadWorker();
    const res = await sendMessage({ action: 'FOO' });
    expect(res).toEqual({ success: false, error: 'Ação não reconhecida: FOO' });
  });

  it('exceções no handler são convertidas em resposta de erro', async () => {
    await loadWorker();
    const res = await sendMessage({ action: 'SAVE_AUTOMATION', payload: null });
    expect(res.success).toBe(false);
    expect(typeof res.error).toBe('string');
  });
});

/* ------------------------------------------------------------------ */
/* Atalhos, menu de contexto, alarmes e navegação                      */
/* ------------------------------------------------------------------ */

describe('Service Worker — gatilhos de eventos', () => {
  it('atalho de teclado executa fluxos com shortcutKey correspondente', async () => {
    const c = await loadWorker({
      web_automations: [
        makeGraph('sc', { triggers: [{ type: 'shortcut', enabled: true, shortcutKey: 'run_default_automation' }] }),
        makeGraph('outro', { triggers: [{ type: 'shortcut', enabled: true, shortcutKey: 'outro_cmd' }] }),
      ],
    });
    await c.commands.onCommand.dispatch('run_default_automation')[0];
    await flushPromises();
    const ids = new Set(broadcasts('STATUS_CHANGE').map((m: any) => m.automationId));
    expect(ids).toEqual(new Set(['sc']));
  });

  it('clique no menu de contexto executa o fluxo (id com underscores)', async () => {
    const c = await loadWorker({ web_automations: [makeGraph('meu_fluxo_x')] });
    await c.contextMenus.onClicked.dispatch({ menuItemId: 'menu_flow_meu_fluxo_x_0' } as any, { id: 3 } as any)[0];
    await flushPromises();
    expect(broadcasts('STATUS_CHANGE').some((m: any) => m.automationId === 'meu_fluxo_x')).toBe(true);
  });

  it('clique no menu de contexto ignora ids de outros menus', async () => {
    const c = await loadWorker({ web_automations: [makeGraph('f')] });
    await c.contextMenus.onClicked.dispatch({ menuItemId: 'outro_menu' } as any, undefined as any)[0];
    await flushPromises();
    expect(broadcasts('STATUS_CHANGE')).toHaveLength(0);
  });

  it('clique no menu de contexto ignora fluxo inexistente', async () => {
    const c = await loadWorker({ web_automations: [makeGraph('f')] });
    await c.contextMenus.onClicked.dispatch({ menuItemId: 'menu_flow_nao_existe_0' } as any, undefined as any)[0];
    await flushPromises();
    expect(broadcasts('STATUS_CHANGE')).toHaveLength(0);
  });

  it('alarme de intervalo executa o fluxo', async () => {
    const c = await loadWorker({ web_automations: [makeGraph('agendado_1')] });
    await c.alarms.onAlarm.dispatch({ name: 'alarm_flow_agendado_1_0' } as any)[0];
    await flushPromises();
    expect(broadcasts('STATUS_CHANGE').some((m: any) => m.automationId === 'agendado_1')).toBe(true);
  });

  it('alarme de intervalo de fluxo removido não executa nada', async () => {
    const c = await loadWorker({ web_automations: [] });
    await c.alarms.onAlarm.dispatch({ name: 'alarm_flow_sumiu_0' } as any)[0];
    await flushPromises();
    expect(broadcasts('STATUS_CHANGE')).toHaveLength(0);
  });

  describe('alarme por data (date_schedule)', () => {
    // 2026-10-30 é uma sexta-feira (getDay() === 5)
    const NOW = new Date(2026, 9, 30, 14, 5, 0);

    async function fire(dateSchedule: any) {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(NOW);
      const c = await loadWorker({
        web_automations: [makeGraph('ds', { triggers: [{ type: 'date_schedule', enabled: true, dateSchedule }] })],
      });
      await c.alarms.onAlarm.dispatch({ name: 'date_alarm_flow_ds_0' } as any)[0];
      await flushPromises();
      return broadcasts('STATUS_CHANGE').some((m: any) => m.automationId === 'ds');
    }

    it('executa no dia da semana e horário corretos', async () => {
      expect(await fire({ mode: 'weekdays', weekdays: [5], time: '14:05' })).toBe(true);
    });
    it('não executa em outro dia da semana', async () => {
      expect(await fire({ mode: 'weekdays', weekdays: [1, 2], time: '14:05' })).toBe(false);
    });
    it('não executa em horário diferente', async () => {
      expect(await fire({ mode: 'weekdays', weekdays: [5], time: '09:00' })).toBe(false);
    });
    it('sem horário configurado executa em qualquer minuto do dia correspondente', async () => {
      expect(await fire({ mode: 'weekdays', weekdays: [5] })).toBe(true);
    });
    it('executa no dia do mês correspondente', async () => {
      expect(await fire({ mode: 'month_days', monthDays: [30], time: '14:05' })).toBe(true);
      expect(await fire({ mode: 'month_days', monthDays: [1] })).toBe(false);
    });
    it('executa em datas completas correspondentes', async () => {
      expect(await fire({ mode: 'full_dates', fullDates: ['2026-10-30'] })).toBe(true);
      expect(await fire({ mode: 'full_dates', fullDates: ['2026-10-31'] })).toBe(false);
    });
    it('não executa com modo desconhecido ou listas inválidas', async () => {
      expect(await fire({ mode: 'outro' })).toBe(false);
      expect(await fire({ mode: 'weekdays', weekdays: 'x' })).toBe(false);
    });

    it('ignora quando o gatilho não tem dateSchedule', async () => {
      const c = await loadWorker({
        web_automations: [makeGraph('ds', { triggers: [{ type: 'date_schedule', enabled: true }] })],
      });
      await c.alarms.onAlarm.dispatch({ name: 'date_alarm_flow_ds_0' } as any)[0];
      await flushPromises();
      expect(broadcasts('STATUS_CHANGE')).toHaveLength(0);
    });

    it('ignora fluxos inexistentes ou sem nó start', async () => {
      const g = makeGraph('semstart');
      g.nodes = [];
      const c = await loadWorker({ web_automations: [g] });
      await c.alarms.onAlarm.dispatch({ name: 'date_alarm_flow_semstart_0' } as any)[0];
      await c.alarms.onAlarm.dispatch({ name: 'date_alarm_flow_naoexiste_0' } as any)[0];
      await flushPromises();
      expect(broadcasts('STATUS_CHANGE')).toHaveLength(0);
    });
  });

  describe('navegação concluída (on_url_load / floating_button)', () => {
    it('ignora frames que não são o principal', async () => {
      const c = await loadWorker({
        web_automations: [makeGraph('u', { triggers: [{ type: 'on_url_load', enabled: true, urlPattern: '*' }] })],
      });
      await c.webNavigation.onCompleted.dispatch({ frameId: 2, tabId: 1, url: 'https://a.com' } as any)[0];
      await flushPromises();
      expect(broadcasts('STATUS_CHANGE')).toHaveLength(0);
    });

    it('executa fluxo on_url_load quando a URL corresponde a algum padrão', async () => {
      const c = await loadWorker({
        web_automations: [
          makeGraph('u', { triggers: [{ type: 'on_url_load', enabled: true, urlPatterns: ['https://nada.com/*', 'https://site.com/*'] }] }),
          makeGraph('nao', { triggers: [{ type: 'on_url_load', enabled: true, urlPatterns: ['https://outro.com/*'] }] }),
        ],
      });
      await c.webNavigation.onCompleted.dispatch({ frameId: 0, tabId: 5, url: 'https://site.com/home' } as any)[0];
      await flushPromises();
      const ids = new Set(broadcasts('STATUS_CHANGE').map((m: any) => m.automationId));
      expect(ids).toEqual(new Set(['u']));
    });

    it('on_url_load sem padrões não executa', async () => {
      const c = await loadWorker({
        web_automations: [makeGraph('u', { triggers: [{ type: 'on_url_load', enabled: true }] })],
      });
      await c.webNavigation.onCompleted.dispatch({ frameId: 0, tabId: 5, url: 'https://site.com/' } as any)[0];
      await flushPromises();
      expect(broadcasts('STATUS_CHANGE')).toHaveLength(0);
    });
  });
});

/* ------------------------------------------------------------------ */
/* MCP Bridge                                                          */
/* ------------------------------------------------------------------ */

describe('Service Worker — MCP Bridge (WebSocket)', () => {
  async function connected(storage: Record<string, any> = {}) {
    await loadWorker({ mcp_config: { enabled: true, port: 3001 }, ...storage });
    const ws = FakeWebSocket.instances[0];
    ws.open();
    return ws;
  }

  it('registra a extensão ao abrir a conexão', async () => {
    const ws = await connected();
    expect(ws.sent[0]).toMatchObject({ type: 'REGISTER_EXTENSION' });
    expect(typeof ws.sent[0].timestamp).toBe('number');
  });

  it('não abre conexões duplicadas quando já conectado/conectando', async () => {
    await connected();
    await sendMessage({ action: 'SET_MCP_CONFIG', payload: { enabled: true, port: 3001 } });
    expect(FakeWebSocket.instances).toHaveLength(1);
  });

  it('LIST_AUTOMATIONS responde com os metadados', async () => {
    const ws = await connected({ web_automations: [makeGraph('l1'), makeGraph('l2')] });
    await ws.onmessage!({ data: JSON.stringify({ id: 'r1', action: 'LIST_AUTOMATIONS', payload: {} }) });
    const res = ws.sent.find((m) => m.type === 'MCP_RESPONSE');
    expect(res.id).toBe('r1');
    expect(res.success).toBe(true);
    expect(res.data.map((m: any) => m.id)).toEqual(['l1', 'l2']);
  });

  it('RUN_GRAPH executa o grafo, envia eventos e a resposta final', async () => {
    const ws = await connected();
    await ws.onmessage!({ data: JSON.stringify({ id: 'r2', action: 'RUN_GRAPH', payload: { graph: makeGraph('mcp') } }) });
    const events = ws.sent.filter((m) => m.type === 'EXECUTION_EVENT');
    expect(events.length).toBeGreaterThan(0);
    expect(events.every((e) => e.id === 'r2')).toBe(true);
    expect(events.map((e) => e.event)).toEqual(expect.arrayContaining(['status_change', 'node_start', 'node_complete', 'log']));
    const res = ws.sent.find((m) => m.type === 'MCP_RESPONSE');
    expect(res).toMatchObject({ id: 'r2', success: true, status: 'completed', variables: { a: 1 } });
    expect(Array.isArray(res.logs)).toBe(true);
  });

  it('GET_STATUS retorna not_found para fluxos desconhecidos', async () => {
    const ws = await connected();
    await ws.onmessage!({ data: JSON.stringify({ id: 'r3', action: 'GET_STATUS', payload: { automationId: 'x' } }) });
    expect(ws.sent.find((m) => m.type === 'MCP_RESPONSE')).toEqual({
      type: 'MCP_RESPONSE',
      id: 'r3',
      success: true,
      status: 'not_found',
      variables: {},
    });
  });

  it('GET_STATUS retorna o status de execução conhecida', async () => {
    const ws = await connected();
    await ws.onmessage!({ data: JSON.stringify({ id: 'a', action: 'RUN_GRAPH', payload: { graph: makeGraph('k') } }) });
    ws.sent = [];
    await ws.onmessage!({ data: JSON.stringify({ id: 'b', action: 'GET_STATUS', payload: { automationId: 'k' } }) });
    expect(ws.sent[0]).toMatchObject({ id: 'b', status: 'completed', variables: { a: 1 } });
  });

  it('erros na ação são respondidos com success=false', async () => {
    const ws = await connected();
    await ws.onmessage!({ data: JSON.stringify({ id: 'e1', action: 'RUN_GRAPH', payload: {} }) });
    const res = ws.sent.find((m) => m.type === 'MCP_RESPONSE');
    expect(res.success).toBe(false);
    expect(res.id).toBe('e1');
    expect(typeof res.error).toBe('string');
  });

  it('mensagens JSON inválidas são logadas sem quebrar', async () => {
    const ws = await connected();
    await ws.onmessage!({ data: '{inválido' });
    expect(console.error).toHaveBeenCalled();
  });

  it('erro de socket fecha a conexão', async () => {
    await loadWorker({ mcp_config: { enabled: true } });
    const ws = FakeWebSocket.instances[0];
    ws.onerror!();
    expect(ws.close).toHaveBeenCalled();
  });

  it('reconecta após 15s quando a conexão cai e o MCP continua habilitado', async () => {
    await loadWorker({ mcp_config: { enabled: true } });
    vi.useFakeTimers();
    FakeWebSocket.instances[0].onclose!();
    expect(FakeWebSocket.instances).toHaveLength(1);
    vi.advanceTimersByTime(15000);
    expect(FakeWebSocket.instances).toHaveLength(2);
  });

  it('não reconecta após desabilitar o MCP', async () => {
    await loadWorker({ mcp_config: { enabled: true } });
    await sendMessage({ action: 'SET_MCP_CONFIG', payload: { enabled: false } });
    vi.useFakeTimers();
    FakeWebSocket.instances[0].onclose!();
    vi.advanceTimersByTime(20000);
    expect(FakeWebSocket.instances).toHaveLength(1);
  });

  it('falha silenciosamente se o construtor do WebSocket lançar', async () => {
    (globalThis as any).WebSocket = class {
      static OPEN = 1;
      static CONNECTING = 0;
      constructor() {
        throw new Error('sem servidor');
      }
    };
    await expect(loadWorker({ mcp_config: { enabled: true } })).resolves.toBeDefined();
  });
});

