import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ExecutionHistoryManager,
  ExecutionHistoryItem,
  ExecutionFilterOptions,
} from '../../src/editor/modules/executionHistoryManager';

describe('ExecutionHistoryManager', () => {
  let fakeStorage: Record<string, any>;

  function createMockItem(overrides: Partial<ExecutionHistoryItem> = {}): ExecutionHistoryItem {
    const now = Date.now();
    return {
      id: `run_${now}_${Math.random().toString(36).substring(2, 6)}`,
      automationId: 'auto_default',
      automationName: 'Fluxo Padrão',
      timestamp: now,
      isoDate: new Date(now).toISOString(),
      durationMs: 120,
      status: 'completed',
      triggerType: 'manual',
      graphSnapshot: {
        metadata: { id: 'auto_default', name: 'Fluxo Padrão', version: '1.0.0' },
        nodes: [],
        edges: [],
      },
      blockSnapshots: {},
      logs: [],
      ...overrides,
    };
  }

  beforeEach(() => {
    fakeStorage = {};
    (globalThis as any).chrome = {
      storage: {
        local: {
          get: vi.fn((key: string, cb: (res: any) => void) => {
            cb({ [key]: fakeStorage[key] });
          }),
          set: vi.fn((data: any, cb?: () => void) => {
            Object.assign(fakeStorage, data);
            cb?.();
            return Promise.resolve();
          }),
          remove: vi.fn((key: string, cb?: () => void) => {
            delete fakeStorage[key];
            cb?.();
            return Promise.resolve();
          }),
        },
      },
    };
  });

  describe('getAll e getById', () => {
    it('retorna lista vazia se storage estiver vazio', async () => {
      const items = await ExecutionHistoryManager.getAll();
      expect(items).toEqual([]);
    });

    it('retorna execuções ordenadas da mais recente para a mais antiga', async () => {
      const item1 = createMockItem({ id: 'item1', timestamp: 1000 });
      const item2 = createMockItem({ id: 'item2', timestamp: 3000 });
      const item3 = createMockItem({ id: 'item3', timestamp: 2000 });
      fakeStorage.web_automations_history = [item1, item2, item3];

      const list = await ExecutionHistoryManager.getAll();
      expect(list.map((i) => i.id)).toEqual(['item2', 'item3', 'item1']);
    });

    it('getById retorna item correspondente ou undefined', async () => {
      const item = createMockItem({ id: 'target_id' });
      fakeStorage.web_automations_history = [item];

      const found = await ExecutionHistoryManager.getById('target_id');
      expect(found).toEqual(item);

      const notFound = await ExecutionHistoryManager.getById('non_existent');
      expect(notFound).toBeUndefined();
    });
  });

  describe('save', () => {
    it('salva novo item no início da lista', async () => {
      const item1 = createMockItem({ id: 'run_1', timestamp: 1000 });
      await ExecutionHistoryManager.save(item1);

      expect(fakeStorage.web_automations_history).toHaveLength(1);
      expect(fakeStorage.web_automations_history[0].id).toBe('run_1');

      const item2 = createMockItem({ id: 'run_2', timestamp: 2000 });
      await ExecutionHistoryManager.save(item2);

      expect(fakeStorage.web_automations_history).toHaveLength(2);
      expect(fakeStorage.web_automations_history[0].id).toBe('run_2');
    });

    it('atualiza item existente evitando duplicatas de id', async () => {
      const item1 = createMockItem({ id: 'run_dup', status: 'failed' });
      await ExecutionHistoryManager.save(item1);

      const itemUpdated = createMockItem({ id: 'run_dup', status: 'completed' });
      await ExecutionHistoryManager.save(itemUpdated);

      expect(fakeStorage.web_automations_history).toHaveLength(1);
      expect(fakeStorage.web_automations_history[0].status).toBe('completed');
    });

    it('limita histórico aos 100 itens mais recentes (MAX_HISTORY_ITEMS)', async () => {
      const existingItems = Array.from({ length: 100 }, (_, idx) =>
        createMockItem({ id: `item_${idx}`, timestamp: idx })
      );
      fakeStorage.web_automations_history = existingItems;

      const newItem = createMockItem({ id: 'item_101', timestamp: 9999 });
      await ExecutionHistoryManager.save(newItem);

      expect(fakeStorage.web_automations_history).toHaveLength(100);
      expect(fakeStorage.web_automations_history[0].id).toBe('item_101');
    });
  });

  describe('delete, clearAll e clearForAutomation', () => {
    it('delete remove uma execução específica pelo ID', async () => {
      const i1 = createMockItem({ id: 'r1' });
      const i2 = createMockItem({ id: 'r2' });
      fakeStorage.web_automations_history = [i1, i2];

      await ExecutionHistoryManager.delete('r1');
      expect(fakeStorage.web_automations_history.map((i: any) => i.id)).toEqual(['r2']);
    });

    it('clearAll remove toda a chave do histórico no storage', async () => {
      fakeStorage.web_automations_history = [createMockItem(), createMockItem()];

      await ExecutionHistoryManager.clearAll();
      expect(fakeStorage.web_automations_history).toBeUndefined();
    });

    it('clearForAutomation remove apenas as execuções da automação especificada', async () => {
      const i1 = createMockItem({ id: 'r1', automationId: 'auto_a' });
      const i2 = createMockItem({ id: 'r2', automationId: 'auto_b' });
      const i3 = createMockItem({ id: 'r3', automationId: 'auto_a' });
      fakeStorage.web_automations_history = [i1, i2, i3];

      await ExecutionHistoryManager.clearForAutomation('auto_a');
      expect(fakeStorage.web_automations_history.map((i: any) => i.id)).toEqual(['r2']);
    });
  });

  describe('applyFilters e getFiltered', () => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    const testItems: ExecutionHistoryItem[] = [
      createMockItem({
        id: '1',
        automationId: 'fluxo_vendas',
        automationName: 'Extrator de Vendas',
        status: 'completed',
        triggerType: 'schedule',
        timestamp: now,
        targetTabTitle: 'Painel CRM',
      }),
      createMockItem({
        id: '2',
        automationId: 'fluxo_vendas',
        automationName: 'Extrator de Vendas',
        status: 'failed',
        error: 'Timeout aguardando botão',
        triggerType: 'manual',
        timestamp: now - 2 * oneDay,
      }),
      createMockItem({
        id: '3',
        automationId: 'fluxo_backup',
        automationName: 'Backup Noturno',
        status: 'completed',
        triggerType: 'shortcut',
        timestamp: now - 10 * oneDay,
        targetTabUrl: 'https://app.sistema.com/db',
      }),
      createMockItem({
        id: '4',
        automationId: 'fluxo_backup',
        automationName: 'Backup Noturno',
        status: 'cancelled',
        triggerType: 'mcp',
        timestamp: now - 40 * oneDay,
      }),
    ];

    it('filtra por automationId', () => {
      const result = ExecutionHistoryManager.applyFilters(testItems, { automationId: 'fluxo_vendas' });
      expect(result.map((i) => i.id)).toEqual(['1', '2']);
    });

    it('filtra por status', () => {
      expect(ExecutionHistoryManager.applyFilters(testItems, { status: 'completed' }).map((i) => i.id)).toEqual(['1', '3']);
      expect(ExecutionHistoryManager.applyFilters(testItems, { status: 'failed' }).map((i) => i.id)).toEqual(['2']);
      expect(ExecutionHistoryManager.applyFilters(testItems, { status: 'cancelled' }).map((i) => i.id)).toEqual(['4']);
      expect(ExecutionHistoryManager.applyFilters(testItems, { status: 'all' })).toHaveLength(4);
    });

    it('filtra por dateRange (today, last7days, last30days, all)', () => {
      expect(ExecutionHistoryManager.applyFilters(testItems, { dateRange: 'today' }).map((i) => i.id)).toEqual(['1']);
      expect(ExecutionHistoryManager.applyFilters(testItems, { dateRange: 'last7days' }).map((i) => i.id)).toEqual(['1', '2']);
      expect(ExecutionHistoryManager.applyFilters(testItems, { dateRange: 'last30days' }).map((i) => i.id)).toEqual(['1', '2', '3']);
      expect(ExecutionHistoryManager.applyFilters(testItems, { dateRange: 'all' })).toHaveLength(4);
    });

    it('filtra por query textual (nome, erro, trigger, url ou título)', () => {
      // busca por nome
      expect(ExecutionHistoryManager.applyFilters(testItems, { query: 'vendas' }).map((i) => i.id)).toEqual(['1', '2']);
      // busca por erro
      expect(ExecutionHistoryManager.applyFilters(testItems, { query: 'timeout' }).map((i) => i.id)).toEqual(['2']);
      // busca por triggerType
      expect(ExecutionHistoryManager.applyFilters(testItems, { query: 'shortcut' }).map((i) => i.id)).toEqual(['3']);
      // busca por url da aba
      expect(ExecutionHistoryManager.applyFilters(testItems, { query: 'sistema.com' }).map((i) => i.id)).toEqual(['3']);
      // busca por título da aba
      expect(ExecutionHistoryManager.applyFilters(testItems, { query: 'painel crm' }).map((i) => i.id)).toEqual(['1']);
    });

    it('combina múltiplos filtros simultaneamente', () => {
      const filters: ExecutionFilterOptions = {
        automationId: 'fluxo_vendas',
        status: 'failed',
        query: 'timeout',
        dateRange: 'last7days',
      };
      const result = ExecutionHistoryManager.applyFilters(testItems, filters);
      expect(result.map((i) => i.id)).toEqual(['2']);
    });

    it('getFiltered busca dados do storage e aplica os filtros', async () => {
      fakeStorage.web_automations_history = testItems;
      const result = await ExecutionHistoryManager.getFiltered({ status: 'completed' });
      expect(result.map((i) => i.id)).toEqual(['1', '3']);
    });
  });
});
