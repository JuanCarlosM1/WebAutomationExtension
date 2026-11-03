import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChromeBrowserDriver } from '../../src/driver/ChromeBrowserDriver';
import { installChromeMock, ChromeMock, flushPromises } from '../helpers/chromeMock';

describe('ChromeBrowserDriver', () => {
  let chromeMock: ChromeMock;
  let driver: ChromeBrowserDriver;

  beforeEach(() => {
    chromeMock = installChromeMock();
    driver = new ChromeBrowserDriver();
  });

  describe('Gerenciamento de Abas e Alvo (getTargetTabId)', () => {
    it('deve usar activeTabId explicitamente definido se for aba web válida', async () => {
      chromeMock.tabs.get.mockImplementation(async (id: number) => ({ id, url: 'https://site.com' }));
      driver.setActiveTab(10);

      const url = await driver.getCurrentUrl();
      expect(chromeMock.tabs.get).toHaveBeenCalledWith(10);
      expect(url).toBe('https://site.com');
    });

    it('se a aba configurada for restrita (chrome://, chrome-extension://, editor.html), deve buscar outra aba web', async () => {
      chromeMock.tabs.get.mockImplementation(async (id: number) => {
        if (id === 10) return { id: 10, url: 'chrome://extensions' };
        return { id: 20, url: 'https://exemplo.org' };
      });
      chromeMock.tabs.query.mockResolvedValue([
        { id: 20, url: 'https://exemplo.org', active: true, windowId: -2 },
      ]);
      driver.setActiveTab(10);

      const url = await driver.getCurrentUrl();
      expect(url).toBe('https://exemplo.org');
    });

    it('se não houver abas web abertas, deve criar uma nova aba fallback', async () => {
      chromeMock.tabs.query.mockResolvedValue([]);
      chromeMock.tabs.create.mockResolvedValue({ id: 99, url: 'https://example.com' });
      chromeMock.tabs.get.mockImplementation(async (id: number) => ({ id, url: 'https://example.com' }));

      const url = await driver.getCurrentUrl();
      expect(chromeMock.tabs.create).toHaveBeenCalledWith({ url: 'https://example.com', active: false });
      expect(url).toBe('https://example.com');
    });
  });

  describe('Navegação (navigateTo, navigateHistory)', () => {
    it('deve navegar com waitUntil: "none" imediatamente sem esperar listener', async () => {
      chromeMock.tabs.query.mockResolvedValue([{ id: 1, url: 'https://orig.com', active: true }]);
      chromeMock.tabs.get.mockImplementation(async (id: number) => ({ id, url: 'https://orig.com' }));

      await driver.navigateTo('https://novo.com', 'none');
      expect(chromeMock.tabs.update).toHaveBeenCalledWith(1, { url: 'https://novo.com' });
    });

    it('deve aguardar evento onUpdated complete ao usar waitUntil: "load"', async () => {
      chromeMock.tabs.query.mockResolvedValue([{ id: 1, url: 'https://orig.com', active: true }]);
      chromeMock.tabs.get.mockImplementation(async (id: number) => ({ id, url: 'https://orig.com' }));

      const promise = driver.navigateTo('https://novo.com', 'load', 5000);
      await flushPromises();

      expect(chromeMock.tabs.onUpdated.listeners.length).toBe(1);
      const listener = chromeMock.tabs.onUpdated.listeners[0];

      // Simula evento da aba sendo atualizada com status complete
      listener(1, { status: 'complete' });

      await expect(promise).resolves.toBeUndefined();
    });

    it('deve rejeitar se ocorrer timeout no navigateTo', async () => {
      chromeMock.tabs.query.mockResolvedValue([{ id: 1, url: 'https://orig.com', active: true }]);
      chromeMock.tabs.get.mockImplementation(async (id: number) => ({ id, url: 'https://orig.com' }));

      const promise = driver.navigateTo('https://novo.com', 'load', 50);
      await expect(promise).rejects.toThrow(/Timeout/);
    });

    it('deve executar ações de histórico: reload, back e forward', async () => {
      chromeMock.tabs.query.mockResolvedValue([{ id: 1, url: 'https://orig.com', active: true }]);

      await driver.navigateHistory('reload', true);
      expect(chromeMock.tabs.reload).toHaveBeenCalledWith(1, { bypassCache: true });

      await driver.navigateHistory('back');
      expect(chromeMock.tabs.goBack).toHaveBeenCalledWith(1);

      await driver.navigateHistory('forward');
      expect(chromeMock.tabs.goForward).toHaveBeenCalledWith(1);
    });
  });

  describe('Controle de Abas (createTab, switchTab, closeTab)', () => {
    it('createTab deve criar e atualizar activeTabId se active=true', async () => {
      chromeMock.tabs.create.mockResolvedValue({ id: 50, url: 'https://teste.com' });
      const res = await driver.createTab('https://teste.com', true);

      expect(res).toEqual({ tabId: 50, url: 'https://teste.com' });
    });

    it('switchTab por index', async () => {
      chromeMock.tabs.query.mockResolvedValue([
        { id: 1, title: 'Tab 1' },
        { id: 2, title: 'Tab 2' },
      ]);
      await driver.switchTab('index', 1);
      expect(chromeMock.tabs.update).toHaveBeenCalledWith(2, { active: true });
    });

    it('switchTab por title', async () => {
      chromeMock.tabs.query.mockResolvedValue([
        { id: 1, title: 'Dashboard' },
        { id: 2, title: 'Settings Page' },
      ]);
      await driver.switchTab('title', 'settings');
      expect(chromeMock.tabs.update).toHaveBeenCalledWith(2, { active: true });
    });

    it('switchTab por url_match', async () => {
      chromeMock.tabs.query.mockResolvedValue([
        { id: 1, url: 'https://example.com/item/1' },
        { id: 2, url: 'https://example.com/checkout' },
      ]);
      await driver.switchTab('url_match', 'checkout');
      expect(chromeMock.tabs.update).toHaveBeenCalledWith(2, { active: true });
    });

    it('switchTab deve lançar erro se não encontrar aba correspondente', async () => {
      chromeMock.tabs.query.mockResolvedValue([]);
      await expect(driver.switchTab('index', 99)).rejects.toThrow(/Aba não encontrada/);
    });

    it('closeTab sem parâmetros deve fechar a aba atual', async () => {
      chromeMock.tabs.query.mockResolvedValue([{ id: 15, url: 'https://site.com', active: true }]);
      await driver.closeTab();
      expect(chromeMock.tabs.remove).toHaveBeenCalledWith(15);
    });
  });

  describe('Execução de Ações DOM via chrome.scripting.executeScript', () => {
    beforeEach(() => {
      chromeMock.tabs.query.mockResolvedValue([{ id: 1, url: 'https://site.com', active: true }]);
      chromeMock.scripting.executeScript.mockImplementation(async (injection: any) => {
        return [{ result: { success: true } }];
      });
    });

    it('clickElement deve executar script na aba alvo via executeScript', async () => {
      await driver.clickElement('#btn', 'css', 'single', 2000, { x: 10, y: 20 });

      expect(chromeMock.scripting.executeScript).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { tabId: 1 },
          func: expect.any(Function),
          args: ['#btn', 'css', 'single', { x: 10, y: 20 }],
        })
      );
    });

    it('typeText deve chamar executeScript com texto e parâmetros de digitação', async () => {
      await driver.typeText('input', 'css', 'texto teste', 'human_typing', 10, 50, true, true, 3000);

      expect(chromeMock.scripting.executeScript).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { tabId: 1 },
          func: expect.any(Function),
          args: ['input', 'css', 'texto teste', true, true],
        })
      );
    });

    it('pressKey, hoverOrFocus e scroll devem executar scripts apropriados', async () => {
      await driver.pressKey('Enter', ['Shift'], 'input', 'css');
      expect(chromeMock.scripting.executeScript).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { tabId: 1 },
          func: expect.any(Function),
          args: ['Enter', ['Shift'], 'input', 'css'],
        })
      );

      await driver.hoverOrFocus('.card', 'css', 'hover', 1500);
      expect(chromeMock.scripting.executeScript).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { tabId: 1 },
          func: expect.any(Function),
          args: ['.card', 'css', 'hover'],
        })
      );

      await driver.scroll('element', '#container', 'css', 0, 100, true);
      expect(chromeMock.scripting.executeScript).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { tabId: 1 },
          func: expect.any(Function),
          args: ['element', '#container', 'css', 0, 100, true],
        })
      );
    });

    it('waitForElement e elementExists', async () => {
      chromeMock.scripting.executeScript.mockResolvedValueOnce([{ result: true }]);
      const waitResult = await driver.waitForElement('.ready', 'css', 'visible', 5000);
      expect(waitResult).toBe(true);

      chromeMock.scripting.executeScript.mockResolvedValueOnce([{ result: true }]);
      const existsResult = await driver.elementExists('.ready', 'css');
      expect(existsResult).toBe(true);
    });

    it('extractData e scrapeList', async () => {
      chromeMock.scripting.executeScript.mockResolvedValueOnce([{ result: 'Texto extraído' }]);
      const text = await driver.extractData('h1', 'css', 'innerText');
      expect(text).toBe('Texto extraído');

      chromeMock.scripting.executeScript.mockResolvedValueOnce([{ result: [{ title: 'Item 1' }] }]);
      const list = await driver.scrapeList('ul > li', 'css', [{ name: 'title', selector: 'span', extractType: 'innerText' }]);
      expect(list).toEqual([{ title: 'Item 1' }]);
    });

    it('injectHtml, injectCss e injectWebComponent', async () => {
      await driver.injectHtml('<div>banner</div>', 'body', 'beforeend');
      expect(chromeMock.scripting.executeScript).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { tabId: 1 },
          func: expect.any(Function),
          args: ['<div>banner</div>', 'body', 'beforeend', undefined],
        })
      );

      await driver.injectCss('body { background: red; }', 'page', 'custom-style');
      expect(chromeMock.scripting.executeScript).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { tabId: 1 },
          func: expect.any(Function),
          args: ['body { background: red; }', 'custom-style'],
        })
      );

      await driver.injectWebComponent('<div>wc</div>', 'div { color: blue }', 'console.log()', 'wc-root', 'shadow_dom');
      expect(chromeMock.scripting.executeScript).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { tabId: 1 },
          world: 'MAIN',
          func: expect.any(Function),
          args: ['<div>wc</div>', 'div { color: blue }', 'console.log()', 'wc-root', 'shadow_dom'],
        })
      );
    });
  });

  describe('injectScript e downloadFile', () => {
    it('injectScript com context: background deve avaliar localmente via new Function', async () => {
      const res = await driver.injectScript('return arg0 + arg1;', 'background', [15, 27]);
      expect(res).toBe(42);
    });

    it('injectScript em página web com context: content_script deve isolar escopo e injetar script no DOM', async () => {
      chromeMock.tabs.query.mockResolvedValue([{ id: 1, url: 'https://example.com', active: true }]);
      chromeMock.tabs.get.mockImplementation(async (id: number) => ({ id, url: 'https://example.com' }));
      chromeMock.scripting.executeScript.mockImplementation(async (injection: any) => {
        if (typeof injection.func === 'function') {
          const res = await injection.func(...(injection.args || []));
          return [{ result: res }];
        }
        return [{ result: undefined }];
      });

      const res = await driver.injectScript('return 100 * 2;', 'content_script');
      expect(res).toBe(200);
      expect(chromeMock.scripting.executeScript).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { tabId: 1 },
        })
      );
    });

    it('injectScript deve lançar erro se script retornar __isError', async () => {
      chromeMock.tabs.query.mockResolvedValue([{ id: 1, url: 'https://example.com', active: true }]);
      chromeMock.tabs.get.mockImplementation(async (id: number) => ({ id, url: 'https://example.com' }));
      chromeMock.scripting.executeScript.mockResolvedValueOnce([
        { result: { __isError: true, message: 'ReferenceError: foo is not defined' } },
      ]);

      await expect(driver.injectScript('foo()', 'content_script')).rejects.toThrow('ReferenceError: foo is not defined');
    });

    it('injectScript deve injetar elemento <script> real no DOM, isolar o escopo de window e exportar funções/variáveis via retorno em objeto', async () => {
      chromeMock.tabs.query.mockResolvedValue([{ id: 1, url: 'https://example.com', active: true }]);
      chromeMock.tabs.get.mockImplementation(async (id: number) => ({ id, url: 'https://example.com' }));
      chromeMock.scripting.executeScript.mockImplementation(async (injection: any) => {
        if (typeof injection.func === 'function') {
          const res = await injection.func(...(injection.args || []));
          return [{ result: res }];
        }
        return [{ result: undefined }];
      });

      const userCode = `
        function somarValores(a, b) {
          return a + b;
        }
        var resultadoSoma = somarValores(10, 20);
        return {
          somarValores: somarValores,
          total: resultadoSoma,
          arg0: args[0],
          isWindowUndefined: typeof window === 'undefined',
        };
      `;

      const result = await driver.injectScript(userCode, 'content_script', ['parametro_extensao']);

      // 1. O resultado da execução foi retornado à automação com a função reconstituída e valores
      expect(result.total).toBe(30);
      expect(result.arg0).toBe('parametro_extensao');
      expect(result.isWindowUndefined).toBe(true);
      expect(typeof result.somarValores).toBe('function');
      expect(result.somarValores(50, 50)).toBe(100);

      // 2. O elemento <script> real foi inserido no DOM e permanece na página após a execução
      const injectedScript = document.querySelector('script.wa-injected-script') as HTMLScriptElement;
      expect(injectedScript).toBeDefined();
      expect(injectedScript.type).toBe('text/javascript');
      expect(injectedScript.getAttribute('data-script-id')).toBeDefined();
      expect(injectedScript.getAttribute('data-wa-stage')).toBe('executed');
      expect(injectedScript.textContent).toContain('somarValores');

      // 3. Nenhum vazamento para o window da página (window isolado de poluição global)
      const win = window as any;
      expect(win.somarValores).toBeUndefined();
      expect(win.resultadoSoma).toBeUndefined();
    });

    it('compartilhamento de funções e variáveis entre blocos deve ocorrer exclusivamente pelas funcionalidades de compartilhamento da automação (args e $vars)', async () => {
      chromeMock.tabs.query.mockResolvedValue([{ id: 1, url: 'https://example.com', active: true }]);
      chromeMock.tabs.get.mockImplementation(async (id: number) => ({ id, url: 'https://example.com' }));
      chromeMock.scripting.executeScript.mockImplementation(async (injection: any) => {
        if (typeof injection.func === 'function') {
          const res = await injection.func(...(injection.args || []));
          return [{ result: res }];
        }
        return [{ result: undefined }];
      });

      // Bloco 1: declara e exporta uma função e variável através do retorno de um objeto
      const block1Code = `
        function dobrar(n) { return n * 2; }
        return {
          dobrar: dobrar,
          multiplicadorBase: 10,
        };
      `;
      const out1 = await driver.injectScript(block1Code, 'content_script');
      expect(typeof out1.dobrar).toBe('function');
      expect(out1.multiplicadorBase).toBe(10);

      // Bloco 2: recebe a função e variáveis exclusivamente via args e $vars providos pela automação
      const block2Code = `
        // Executa a função recebida por args e consome variável de $vars
        const res = args[0](21) + $vars.multiplicadorBase;
        return { totalFinal: res };
      `;
      const out2 = await driver.injectScript(block2Code, 'content_script', [out1.dobrar], { multiplicadorBase: out1.multiplicadorBase });
      expect(out2.totalFinal).toBe(52);

      // Ambos os scripts existem no DOM para inspeção
      const scripts = document.querySelectorAll('script.wa-injected-script');
      expect(scripts.length).toBeGreaterThanOrEqual(2);
    });

    it('deve marcar o script no DOM com data-wa-stage="error" e lançar erro se a execução falhar', async () => {
      chromeMock.tabs.query.mockResolvedValue([{ id: 1, url: 'https://example.com', active: true }]);
      chromeMock.tabs.get.mockImplementation(async (id: number) => ({ id, url: 'https://example.com' }));
      chromeMock.scripting.executeScript.mockImplementation(async (injection: any) => {
        if (typeof injection.func === 'function') {
          const res = await injection.func(...(injection.args || []));
          return [{ result: res }];
        }
        return [{ result: undefined }];
      });

      await expect(driver.injectScript('throw new Error("Falha intencional de execução");', 'content_script'))
        .rejects.toThrow('Falha intencional de execução');

      const failedScript = document.querySelector('script[data-wa-stage="error"]') as HTMLScriptElement;
      expect(failedScript).toBeDefined();
      expect(failedScript.getAttribute('data-error')).toContain('Falha intencional de execução');
    });

    it('downloadFile deve codificar base64 e chamar chrome.downloads.download', async () => {
      await driver.downloadFile('Hello World', 'arquivo.txt', 'text/plain');

      expect(chromeMock.downloads.download).toHaveBeenCalledWith({
        url: expect.stringMatching(/^data:text\/plain;base64,/),
        filename: 'arquivo.txt',
        saveAs: false,
      });
    });

    it('injectScript não deve falhar com "Element is not defined" em escopo de Service Worker', async () => {
      chromeMock.tabs.query.mockResolvedValue([{ id: 1, url: 'https://example.com', active: true }]);
      chromeMock.tabs.get.mockImplementation(async (id: number) => ({ id, url: 'https://example.com' }));
      chromeMock.scripting.executeScript.mockImplementation(async (injection: any) => {
        if (typeof injection.func === 'function') {
          const res = await injection.func(...(injection.args || []));
          return [{ result: res }];
        }
        return [{ result: undefined }];
      });

      const originalElement = (globalThis as any).Element;
      try {
        delete (globalThis as any).Element;
        const res = await driver.injectScript('return { executado: true, soma: 1 + 1 };', 'content_script', [10], { base: 20 });
        expect(res.executado).toBe(true);
        expect(res.soma).toBe(2);
      } finally {
        (globalThis as any).Element = originalElement;
      }
    });
  });
});
