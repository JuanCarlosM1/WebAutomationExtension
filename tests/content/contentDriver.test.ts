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
});

