import { describe, it, expect, vi, beforeEach } from 'vitest';
import { installChromeMock, ChromeMock, flushPromises } from '../helpers/chromeMock';

describe('Content Driver (contentDriver.ts & pageScriptBridge.ts)', () => {
  let chromeMock: ChromeMock;

  beforeEach(() => {
    vi.resetModules();
    chromeMock = installChromeMock();
    document.body.innerHTML = `
      <div id="testArea">
        <button id="myBtn" class="btn">Clique Aqui</button>
        <input id="myInput" type="text" value="" />
        <div id="targetDiv">Texto Original</div>
      </div>
    `;
  });

  async function loadContentDriver() {
    await import('../../src/content/contentDriver');
    await flushPromises();
  }

  function sendContentMessage(action: string, payload: any = {}): Promise<any> {
    return new Promise((resolve) => {
      const listener = chromeMock.runtime.onMessage.listeners[0];
      expect(listener).toBeDefined();
      listener({ action, payload }, {}, resolve);
    });
  }

  it('deve registrar listener em runtime.onMessage ao carregar', async () => {
    await loadContentDriver();
    expect(chromeMock.runtime.onMessage.listeners.length).toBeGreaterThanOrEqual(1);
  });

  it('CLICK_ELEMENT deve simular clique no elemento alvo', async () => {
    await loadContentDriver();

    const btn = document.getElementById('myBtn') as HTMLButtonElement;
    let clicked = false;
    btn.addEventListener('click', () => {
      clicked = true;
    });

    const res = await sendContentMessage('CLICK_ELEMENT', {
      selector: '#myBtn',
      selectorType: 'css',
      clickType: 'single',
    });

    expect(clicked).toBe(true);
    expect(res.success).toBe(true);
  });

  it('TYPE_INPUT deve preencher texto no campo de input', async () => {
    await loadContentDriver();

    const input = document.getElementById('myInput') as HTMLInputElement;

    const res = await sendContentMessage('TYPE_INPUT', {
      selector: '#myInput',
      selectorType: 'css',
      text: 'Olá Mundo',
      mode: 'paste',
      clear: true,
    });

    expect(input.value).toBe('Olá Mundo');
    expect(res.success).toBe(true);
  });

  it('EXTRACT_DATA deve extrair texto ou atributos do elemento', async () => {
    await loadContentDriver();

    const res = await sendContentMessage('EXTRACT_DATA', {
      selector: '#targetDiv',
      selectorType: 'css',
      extractType: 'innerText',
    });

    expect(res.data).toBe('Texto Original');
  });

  it('ELEMENT_EXISTS deve retornar true para elemento presente e false para ausente', async () => {
    await loadContentDriver();

    const exists = await sendContentMessage('ELEMENT_EXISTS', {
      selector: '#myBtn',
      selectorType: 'css',
    });
    expect(exists.data).toBe(true);

    const notExists = await sendContentMessage('ELEMENT_EXISTS', {
      selector: '#inexistente',
      selectorType: 'css',
      timeoutMs: 100,
    });
    expect(notExists.data).toBe(false);
  });

  it('INJECT_HTML deve inserir HTML no DOM', async () => {
    await loadContentDriver();

    const res = await sendContentMessage('INJECT_HTML', {
      html: '<span id="injetado">Novo Span</span>',
      targetSelector: '#testArea',
      position: 'beforeend',
    });

    expect(res.success).toBe(true);
    expect(document.getElementById('injetado')).toBeDefined();
    expect(document.getElementById('injetado')?.textContent).toBe('Novo Span');
  });

  it('INJECT_CSS deve injetar tag de estilo no head do documento', async () => {
    await loadContentDriver();

    const res = await sendContentMessage('INJECT_CSS', {
      css: '.btn { background: red; }',
      target: 'page',
      styleId: 'test-style',
    });

    expect(res.success).toBe(true);
    const styleEl = document.getElementById('test-style');
    expect(styleEl).toBeDefined();
    expect(styleEl?.textContent).toContain('.btn { background: red; }');
  });

  it('INJECT_SCRIPT deve anexar elemento <script> com integridade no DOM e executar', async () => {
    await loadContentDriver();

    const scriptPromise = sendContentMessage('INJECT_SCRIPT', {
      code: 'return 42 + (args[0] || 0);',
      args: [8],
    });

    // O elemento de script deve existir no DOM com id e classes de rastreio
    const scriptEl = document.querySelector('script.wa-injected-script') as HTMLScriptElement;
    expect(scriptEl).toBeDefined();
    expect(['verified', 'executed']).toContain(scriptEl.getAttribute('data-wa-stage'));
    expect(scriptEl.textContent).toContain('return 42');

    // Aguarda resolução da execução (via bridge ou fallback seguro)
    const res = await scriptPromise;
    expect(res.success).toBe(true);
    expect(res.data?.executed).toBe(true);
    expect(res.data?.result).toBe(50);
  });

  it('INJECT_SCRIPT deve mascarar window e globalThis como undefined e retornar objeto exportado', async () => {
    await loadContentDriver();

    const scriptPromise = sendContentMessage('INJECT_SCRIPT', {
      code: `
        return {
          isWindowUndefined: typeof window === 'undefined',
          isGlobalThisUndefined: typeof globalThis === 'undefined',
          isDocumentPresent: typeof document !== 'undefined',
          total: 10 * 5,
        };
      `,
    });

    const res = await scriptPromise;
    expect(res.success).toBe(true);
    expect(res.data?.result?.isWindowUndefined).toBe(true);
    expect(res.data?.result?.isGlobalThisUndefined).toBe(true);
    expect(res.data?.result?.isDocumentPresent).toBe(true);
    expect(res.data?.result?.total).toBe(50);
  });

  it('INJECT_SCRIPT em página com nonce de CSP herda o nonce no elemento <script>', async () => {
    const existingScript = document.createElement('script');
    existingScript.setAttribute('nonce', 'test-nonce-xyz');
    document.head.appendChild(existingScript);

    await loadContentDriver();

    const res = await sendContentMessage('INJECT_SCRIPT', {
      code: 'return 100;',
    });

    expect(res.success).toBe(true);
    const injected = document.querySelector('script.wa-injected-script') as HTMLScriptElement;
    expect(injected).toBeDefined();
    expect(injected.getAttribute('nonce')).toBe('test-nonce-xyz');
  });

  it('INJECT_SCRIPT em contexto de extensão utiliza type="text/plain" para conformidade com CSP do Manifest V3', async () => {
    const originalLocation = window.location;
    try {
      delete (window as any).location;
      window.location = new URL('chrome-extension://test-ext-id/editor.html') as any;

      await loadContentDriver();

      const res = await sendContentMessage('INJECT_SCRIPT', {
        code: 'return { ok: true, valor: 77 };',
      });

      expect(res.success).toBe(true);
      expect(res.data?.result?.valor).toBe(77);

      const injected = document.querySelector('script.wa-injected-script') as HTMLScriptElement;
      expect(injected).toBeDefined();
      expect(injected.type).toBe('text/plain');
    } finally {
      window.location = originalLocation;
    }
  });
});

