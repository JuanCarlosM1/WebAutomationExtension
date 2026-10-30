/**
 * Mock completo e reutilizável da API `chrome.*` para testes unitários da extensão.
 *
 * - Todos os métodos são `vi.fn()` e podem ser sobrescritos por teste (`mockImplementation`, `mockResolvedValue`...).
 * - Suporta tanto o estilo Promise (MV3) quanto o estilo callback das APIs.
 * - Eventos (`onMessage`, `onAlarm`, ...) guardam seus listeners e expõem `dispatch(...args)` para dispará-los.
 * - `chrome.storage.local` possui armazenamento em memória acessível em `mock.__storage`.
 */
import { vi } from 'vitest';

export interface MockEvent<T extends (...args: any[]) => any = (...args: any[]) => any> {
  addListener: ReturnType<typeof vi.fn>;
  removeListener: ReturnType<typeof vi.fn>;
  hasListener: ReturnType<typeof vi.fn>;
  listeners: T[];
  /** Dispara todos os listeners registrados e retorna os valores retornados por eles */
  dispatch: (...args: Parameters<T>) => any[];
}

export function createMockEvent<T extends (...args: any[]) => any = (...args: any[]) => any>(): MockEvent<T> {
  const listeners: T[] = [];
  return {
    listeners,
    addListener: vi.fn((fn: T) => {
      listeners.push(fn);
    }),
    removeListener: vi.fn((fn: T) => {
      const idx = listeners.indexOf(fn);
      if (idx >= 0) listeners.splice(idx, 1);
    }),
    hasListener: vi.fn((fn: T) => listeners.includes(fn)),
    dispatch: (...args: Parameters<T>) => [...listeners].map((l) => l(...args)),
  };
}

/** Executa `cb` (se fornecido) e retorna uma Promise com o mesmo valor — imita as APIs híbridas do Chrome */
function hybrid<T>(value: T | (() => T), cb?: (v: T) => void): Promise<T> {
  const resolved = typeof value === 'function' ? (value as () => T)() : value;
  if (typeof cb === 'function') {
    cb(resolved);
  }
  return Promise.resolve(resolved);
}

function pickKeys(store: Record<string, any>, keys: any): Record<string, any> {
  const clone = (v: any) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  if (keys === null || keys === undefined) {
    return clone(store) || {};
  }
  if (typeof keys === 'string') {
    return keys in store ? { [keys]: clone(store[keys]) } : {};
  }
  if (Array.isArray(keys)) {
    const out: Record<string, any> = {};
    for (const k of keys) if (k in store) out[k] = clone(store[k]);
    return out;
  }
  // Objeto com valores padrão
  const out: Record<string, any> = {};
  for (const [k, def] of Object.entries(keys)) out[k] = k in store ? clone(store[k]) : def;
  return out;
}

export function createChromeMock(initialStorage: Record<string, any> = {}) {
  const storage: Record<string, any> = JSON.parse(JSON.stringify(initialStorage));
  const storageOnChanged = createMockEvent();

  const local = {
    get: vi.fn((keys?: any, cb?: (items: Record<string, any>) => void) => {
      if (typeof keys === 'function') {
        cb = keys;
        keys = null;
      }
      return hybrid(() => pickKeys(storage, keys), cb);
    }),
    set: vi.fn((items: Record<string, any>, cb?: () => void) => {
      const changes: Record<string, any> = {};
      for (const [k, v] of Object.entries(items)) {
        changes[k] = { oldValue: storage[k], newValue: v };
        storage[k] = JSON.parse(JSON.stringify(v));
      }
      storageOnChanged.dispatch(changes, 'local');
      return hybrid(undefined as any, cb);
    }),
    remove: vi.fn((keys: string | string[], cb?: () => void) => {
      for (const k of Array.isArray(keys) ? keys : [keys]) delete storage[k];
      return hybrid(undefined as any, cb);
    }),
    clear: vi.fn((cb?: () => void) => {
      for (const k of Object.keys(storage)) delete storage[k];
      return hybrid(undefined as any, cb);
    }),
  };

  let tabIdSeq = 1000;

  const mock = {
    __storage: storage,
    runtime: {
      id: 'test-extension-id',
      lastError: undefined as any,
      getURL: vi.fn((p: string) => `chrome-extension://test-extension-id/${p.replace(/^\//, '')}`),
      sendMessage: vi.fn((_msg: any, cb?: (res: any) => void) => hybrid(undefined as any, cb)),
      onMessage: createMockEvent(),
      onInstalled: createMockEvent(),
      onStartup: createMockEvent(),
      connect: vi.fn(),
      getManifest: vi.fn(() => ({ version: '0.0.0-test' })),
    },
    storage: {
      local,
      sync: local,
      session: local,
      onChanged: storageOnChanged,
    },
    tabs: {
      query: vi.fn((_q: any, cb?: (tabs: any[]) => void) => hybrid([] as any[], cb)),
      get: vi.fn((tabId: number, cb?: (tab: any) => void) => hybrid({ id: tabId, url: 'https://example.com/' }, cb)),
      create: vi.fn((props: any, cb?: (tab: any) => void) =>
        hybrid({ id: ++tabIdSeq, url: props?.url, active: props?.active ?? true }, cb)
      ),
      update: vi.fn((tabId: number, props: any, cb?: (tab: any) => void) => hybrid({ id: tabId, ...props }, cb)),
      remove: vi.fn((_ids: any, cb?: () => void) => hybrid(undefined as any, cb)),
      reload: vi.fn((_id: number, _props?: any, cb?: () => void) => hybrid(undefined as any, cb)),
      goBack: vi.fn((_id: number, cb?: () => void) => hybrid(undefined as any, cb)),
      goForward: vi.fn((_id: number, cb?: () => void) => hybrid(undefined as any, cb)),
      sendMessage: vi.fn((_id: number, _msg: any, optsOrCb?: any, cb?: any) => {
        const callback = typeof optsOrCb === 'function' ? optsOrCb : cb;
        return hybrid(undefined as any, callback);
      }),
      onUpdated: createMockEvent(),
      onRemoved: createMockEvent(),
      onActivated: createMockEvent(),
    },
    windows: {
      WINDOW_ID_CURRENT: -2,
      create: vi.fn((props: any, cb?: (w: any) => void) => hybrid({ id: 1, ...props }, cb)),
      update: vi.fn((id: number, props: any, cb?: (w: any) => void) => hybrid({ id, ...props }, cb)),
      getCurrent: vi.fn((cb?: (w: any) => void) => hybrid({ id: 1 }, cb)),
    },
    scripting: {
      executeScript: vi.fn((_inj: any, cb?: (r: any[]) => void) => hybrid([] as any[], cb)),
      insertCSS: vi.fn((_inj: any, cb?: () => void) => hybrid(undefined as any, cb)),
    },
    downloads: {
      download: vi.fn((_opts: any, cb?: (id: number) => void) => hybrid(1, cb)),
    },
    contextMenus: {
      create: vi.fn(),
      removeAll: vi.fn((cb?: () => void) => {
        cb?.();
        return Promise.resolve();
      }),
      onClicked: createMockEvent(),
    },
    alarms: {
      create: vi.fn(),
      clearAll: vi.fn(() => Promise.resolve(true)),
      clear: vi.fn(() => Promise.resolve(true)),
      onAlarm: createMockEvent(),
    },
    commands: {
      onCommand: createMockEvent(),
    },
    webNavigation: {
      onCompleted: createMockEvent(),
    },
  };

  return mock;
}

export type ChromeMock = ReturnType<typeof createChromeMock>;

/** Instala um novo mock em `globalThis.chrome` e o retorna */
export function installChromeMock(initialStorage: Record<string, any> = {}): ChromeMock {
  const mock = createChromeMock(initialStorage);
  (globalThis as any).chrome = mock;
  return mock;
}

/** Aguarda a fila de microtasks/macrotasks esvaziar (útil para handlers assíncronos) */
export async function flushPromises(times = 5): Promise<void> {
  for (let i = 0; i < times; i++) {
    await new Promise((r) => setTimeout(r, 0));
  }
}

