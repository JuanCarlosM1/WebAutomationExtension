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

    it('se a aba configurada for restrita (chrome://, chrome-extension://), deve buscar outra aba web', async () => {
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

    it('se não houver abas web abertas, deve criar uma nova aba about:blank', async () => {
      chromeMock.tabs.query.mockResolvedValue([]);
      chromeMock.tabs.create.mockResolvedValue({ id: 99, url: 'about:blank' });
      chromeMock.tabs.get.mockImplementation(async (id: number) => ({ id, url: 'about:blank' }));

      const url = await driver.getCurrentUrl();
      expect(chromeMock.tabs.create).toHaveBeenCalledWith({ url: 'about:blank', active: false });
      expect(url).toBe('about:blank');
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

  describe('Envio para Content Script e Ações DOM', () => {
    beforeEach(() => {
      chromeMock.tabs.query.mockResolvedValue([{ id: 1, url: 'https://site.com', active: true }]);
    });

    it('deve injetar script contentDriver.js se a conexão ainda não existir (auto-recovery)', async () => {
      chromeMock.tabs.sendMessage
        .mockRejectedValueOnce(new Error('Receiving end does not exist'))
        .mockResolvedValueOnce({ data: { success: true } });

      await driver.clickElement('button.send', 'css', 'single');

      expect(chromeMock.scripting.executeScript).toHaveBeenCalledWith({
        target: { tabId: 1 },
        files: ['dist/contentDriver.js'],
      });
      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledTimes(2);
    });

    it('clickElement deve enviar comando correto', async () => {
      chromeMock.tabs.sendMessage.mockResolvedValue({ data: true });
      await driver.clickElement('#btn', 'css', 'double', 2000, { x: 10, y: 20 });

      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(1, {
        action: 'CLICK_ELEMENT',
        payload: {
          selector: '#btn',
          selectorType: 'css',
          clickType: 'double',
          timeoutMs: 2000,
          coordinates: { x: 10, y: 20 },
        },
      });
    });

    it('typeText deve enviar parâmetros para TYPE_INPUT', async () => {
      chromeMock.tabs.sendMessage.mockResolvedValue({ data: true });
      await driver.typeText('input', 'css', 'texto teste', 'human_typing', 10, 50, true, true, 3000);

      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(1, {
        action: 'TYPE_INPUT',
        payload: {
          selector: 'input',
          selectorType: 'css',
          text: 'texto teste',
          mode: 'human_typing',
          minDelay: 10,
          maxDelay: 50,
          clear: true,
          pressEnter: true,
          timeoutMs: 3000,
        },
      });
    });

    it('pressKey, hoverOrFocus e scroll', async () => {
      chromeMock.tabs.sendMessage.mockResolvedValue({ data: true });

      await driver.pressKey('Enter', ['Shift'], 'input', 'css');
      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(1, {
        action: 'PRESS_KEY',
        payload: { key: 'Enter', modifiers: ['Shift'], selector: 'input', selectorType: 'css' },
      });

      await driver.hoverOrFocus('.card', 'css', 'hover', 1500);
      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(1, {
        action: 'HOVER_FOCUS',
        payload: { selector: '.card', selectorType: 'css', action: 'hover', timeoutMs: 1500 },
      });

      await driver.scroll('element', '#container', 'css', 0, 100, true);
      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(1, {
        action: 'SCROLL',
        payload: { target: 'element', selector: '#container', selectorType: 'css', deltaX: 0, deltaY: 100, smooth: true },
      });
    });

    it('waitForElement e elementExists', async () => {
      chromeMock.tabs.sendMessage.mockResolvedValueOnce({ data: { success: true } });
      const waitResult = await driver.waitForElement('.ready', 'css', 'visible', 5000);
      expect(waitResult).toBe(true);

      chromeMock.tabs.sendMessage.mockResolvedValueOnce({ data: true });
      const existsResult = await driver.elementExists('.ready', 'css');
      expect(existsResult).toBe(true);
    });

    it('extractData e scrapeList', async () => {
      chromeMock.tabs.sendMessage.mockResolvedValueOnce({ data: 'Texto extraído' });
      const text = await driver.extractData('h1', 'css', 'innerText');
      expect(text).toBe('Texto extraído');

      chromeMock.tabs.sendMessage.mockResolvedValueOnce({ data: [{ title: 'Item 1' }, { title: 'Item 2' }] });
      const list = await driver.scrapeList('ul > li', 'css', [{ name: 'title', selector: 'span', extractType: 'innerText' }]);
      expect(list).toEqual([{ title: 'Item 1' }, { title: 'Item 2' }]);
    });

    it('injectHtml, injectCss e injectWebComponent', async () => {
      chromeMock.tabs.sendMessage.mockResolvedValue({ data: true });

      await driver.injectHtml('<div>banner</div>', 'body', 'beforeend');
      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(1, expect.objectContaining({ action: 'INJECT_HTML' }));

      await driver.injectCss('body { background: red; }', 'page', 'custom-style');
      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(1, expect.objectContaining({ action: 'INJECT_CSS' }));

      await driver.injectWebComponent('<div>wc</div>', 'div { color: blue }', 'console.log()', 'wc-root', 'shadow_dom');
      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(1, expect.objectContaining({ action: 'INJECT_WEB_COMPONENT' }));
    });
  });

  describe('injectScript e downloadFile', () => {
    it('injectScript em página de extensão deve usar SafeJsEvaluator', async () => {
      chromeMock.tabs.query.mockResolvedValue([{ id: 1, url: 'chrome-extension://xyz/popup.html', active: true }]);
      chromeMock.tabs.get.mockImplementation(async (id: number) => ({ id, url: 'chrome-extension://xyz/popup.html' }));

      const res = await driver.injectScript('return 42;', 'content_script', []);
      expect(res).toBeDefined();
    });

    it('injectScript em página web normal deve enviar para contentScript', async () => {
      chromeMock.tabs.query.mockResolvedValue([{ id: 1, url: 'https://example.com', active: true }]);
      chromeMock.tabs.get.mockImplementation(async (id: number) => ({ id, url: 'https://example.com' }));
      chromeMock.tabs.sendMessage.mockResolvedValue({ data: { result: 'resultado_remoto' } });

      const res = await driver.injectScript('document.title', 'content_script');
      expect(res).toBeDefined();
    });

    it('downloadFile deve codificar base64 e chamar chrome.downloads.download', async () => {
      await driver.downloadFile('Hello World', 'arquivo.txt', 'text/plain');

      expect(chromeMock.downloads.download).toHaveBeenCalledWith({
        url: expect.stringMatching(/^data:text\/plain;base64,/),
        filename: 'arquivo.txt',
        saveAs: false,
      });
    });
  });
});
