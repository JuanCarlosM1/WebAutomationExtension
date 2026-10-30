/**
 * Implementação de IBrowserDriver para a Extensão de Navegador (Chrome / Chromium)
 */

import { IBrowserDriver } from '../../../BibliotecaDeDev/src/engine/ExecutionContext';
import { SafeJsEvaluator } from '../utils/safeJsEvaluator';

export class ChromeBrowserDriver implements IBrowserDriver {
  private activeTabId?: number;

  constructor(initialTabId?: number) {
    this.activeTabId = initialTabId;
  }

  public setActiveTab(tabId: number): void {
    this.activeTabId = tabId;
  }

  private isRestrictedTab(tab?: chrome.tabs.Tab | null): boolean {
    if (!tab?.url) return false;
    return (
      tab.url.startsWith('chrome-extension://') ||
      tab.url.startsWith('chrome://') ||
      tab.url.startsWith('edge://') ||
      tab.url.startsWith('devtools://') ||
      tab.url.startsWith('view-source:')
    );
  }

  private async getTargetTabId(): Promise<number> {
    if (this.activeTabId) {
      const tab = await chrome.tabs.get(this.activeTabId).catch(() => null);
      if (tab?.id && !this.isRestrictedTab(tab)) {
        return this.activeTabId;
      }
    }

    // Busca abas normais (páginas web) abertas no navegador
    const tabs = await chrome.tabs.query({});
    const webTabs = tabs.filter(
      (t) => t.id && t.url && (t.url.startsWith('http://') || t.url.startsWith('https://') || t.url.startsWith('file://'))
    );

    // Prioriza aba ativa na janela atual se for web, ou qualquer aba web ativa, ou a mais recente
    const currentWindowActive = webTabs.find((t) => t.active && t.windowId === chrome.windows?.WINDOW_ID_CURRENT);
    const anyActive = webTabs.find((t) => t.active);
    const target = currentWindowActive || anyActive || webTabs[webTabs.length - 1];

    if (target?.id) {
      this.activeTabId = target.id;
      return target.id;
    }

    // Se nenhuma aba web existir, cria uma nova aba para a automação rodar sem interferir no editor
    const newTab = await chrome.tabs.create({ url: 'about:blank', active: false });
    this.activeTabId = newTab.id!;
    return newTab.id!;
  }

  private async sendToContentScript(action: string, payload: any): Promise<any> {
    const tabId = await this.getTargetTabId();
    try {
      const response = await chrome.tabs.sendMessage(tabId, { action, payload });
      if (response && response.error) {
        throw new Error(response.error);
      }
      return response?.data ?? response;
    } catch (err: any) {
      // Se o script ainda não tiver sido injetado, injeta sob demanda e tenta novamente
      if (err?.message?.includes('Receiving end does not exist') || err?.message?.includes('Could not establish connection')) {
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ['dist/contentDriver.js'],
        });
        const retryResponse = await chrome.tabs.sendMessage(tabId, { action, payload });
        if (retryResponse && retryResponse.error) throw new Error(retryResponse.error);
        return retryResponse?.data ?? retryResponse;
      }
      throw err;
    }
  }

  // -------------------------------------------------------------
  // NAVEGAÇÃO E ABAS
  // -------------------------------------------------------------

  public async navigateTo(url: string, waitUntil: string = 'load', timeoutMs: number = 30000): Promise<void> {
    const tabId = await this.getTargetTabId();

    // Se a aba foi criada como about:blank ou vazia, podemos ativá-la para o usuário acompanhar a automação
    const tabInfo = await chrome.tabs.get(tabId).catch(() => null);
    if (tabInfo && (tabInfo.url === 'about:blank' || tabInfo.url === '')) {
      chrome.tabs.update(tabId, { active: true }).catch(() => {});
    }

    if (waitUntil === 'none') {
      await chrome.tabs.update(tabId, { url });
      return;
    }

    return new Promise((resolve, reject) => {
      let isResolved = false;
      const timer = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          chrome.tabs.onUpdated.removeListener(listener);
          reject(new Error(`Timeout (${timeoutMs}ms) aguardando carregamento da URL: ${url}`));
        }
      }, timeoutMs);

      const listener = (updatedTabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
        if (updatedTabId === tabId && !isResolved) {
          if (changeInfo.status === 'complete') {
            isResolved = true;
            clearTimeout(timer);
            chrome.tabs.onUpdated.removeListener(listener);
            if (waitUntil === 'networkidle') {
              setTimeout(resolve, 500);
            } else {
              setTimeout(resolve, 100);
            }
          }
        }
      };

      chrome.tabs.onUpdated.addListener(listener);
      chrome.tabs.update(tabId, { url }).catch((err) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timer);
          chrome.tabs.onUpdated.removeListener(listener);
          reject(err);
        }
      });
    });
  }

  public async createTab(url?: string, active: boolean = true): Promise<{ tabId: number; url?: string }> {
    const tab = await chrome.tabs.create({ url, active });
    if (tab.id && active) {
      this.activeTabId = tab.id;
    }
    return { tabId: tab.id!, url: tab.url };
  }

  public async switchTab(queryType: string, queryValue: string | number): Promise<void> {
    let targetTab: chrome.tabs.Tab | undefined;

    if (queryType === 'index') {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      targetTab = tabs[Number(queryValue)];
    } else if (queryType === 'title') {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      targetTab = tabs.find((t) => t.title?.toLowerCase().includes(String(queryValue).toLowerCase()));
    } else if (queryType === 'url_match') {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const regex = new RegExp(String(queryValue));
      targetTab = tabs.find((t) => t.url && regex.test(t.url));
    }

    if (!targetTab?.id) {
      throw new Error(`Aba não encontrada com critério ${queryType}: ${queryValue}`);
    }

    await chrome.tabs.update(targetTab.id, { active: true });
    this.activeTabId = targetTab.id;
  }

  public async closeTab(queryType?: string, queryValue?: string | number): Promise<void> {
    if (!queryType) {
      const tabId = await this.getTargetTabId();
      await chrome.tabs.remove(tabId);
      this.activeTabId = undefined;
      return;
    }

    await this.switchTab(queryType, queryValue!);
    const tabId = await this.getTargetTabId();
    await chrome.tabs.remove(tabId);
    this.activeTabId = undefined;
  }

  public async getCurrentUrl(): Promise<string> {
    const tabId = await this.getTargetTabId();
    const tab = await chrome.tabs.get(tabId);
    return tab.url || '';
  }

  public async navigateHistory(action: 'back' | 'forward' | 'reload', ignoreCache: boolean = false): Promise<void> {
    const tabId = await this.getTargetTabId();
    if (action === 'reload') {
      await chrome.tabs.reload(tabId, { bypassCache: ignoreCache });
    } else if (action === 'back') {
      await chrome.tabs.goBack(tabId);
    } else if (action === 'forward') {
      await chrome.tabs.goForward(tabId);
    }
  }

  // -------------------------------------------------------------
  // OPERAÇÕES NO DOM
  // -------------------------------------------------------------

  public async clickElement(
    selector: string,
    selectorType: 'css' | 'xpath',
    clickType: string,
    timeoutMs?: number,
    coordinates?: { x: number; y: number }
  ): Promise<void> {
    await this.sendToContentScript('CLICK_ELEMENT', {
      selector,
      selectorType,
      clickType,
      timeoutMs,
      coordinates,
    });
  }

  public async typeText(
    selector: string,
    selectorType: 'css' | 'xpath',
    text: string,
    mode: string,
    minDelay?: number,
    maxDelay?: number,
    clear?: boolean,
    pressEnter?: boolean,
    timeoutMs?: number
  ): Promise<void> {
    await this.sendToContentScript('TYPE_INPUT', {
      selector,
      selectorType,
      text,
      mode,
      minDelay,
      maxDelay,
      clear,
      pressEnter,
      timeoutMs,
    });
  }

  public async pressKey(key: string, modifiers?: string[], selector?: string, selectorType?: 'css' | 'xpath'): Promise<void> {
    await this.sendToContentScript('PRESS_KEY', { key, modifiers, selector, selectorType });
  }

  public async hoverOrFocus(
    selector: string,
    selectorType: 'css' | 'xpath',
    action: 'hover' | 'focus',
    timeoutMs?: number
  ): Promise<void> {
    await this.sendToContentScript('HOVER_FOCUS', { selector, selectorType, action, timeoutMs });
  }

  public async scroll(
    target: string,
    selector?: string,
    selectorType?: 'css' | 'xpath',
    deltaX?: number,
    deltaY?: number,
    smooth?: boolean
  ): Promise<void> {
    await this.sendToContentScript('SCROLL', { target, selector, selectorType, deltaX, deltaY, smooth });
  }

  public async waitForElement(
    selector: string,
    selectorType: 'css' | 'xpath',
    state: string,
    timeoutMs: number
  ): Promise<boolean> {
    const res = await this.sendToContentScript('WAIT_FOR_ELEMENT', { selector, selectorType, state, timeoutMs });
    return !!res?.success;
  }

  public async elementExists(selector: string, selectorType: 'css' | 'xpath', timeoutMs?: number): Promise<boolean> {
    const res = await this.sendToContentScript('ELEMENT_EXISTS', { selector, selectorType, timeoutMs });
    return !!res;
  }

  public async extractData(
    selector: string,
    selectorType: 'css' | 'xpath',
    extractType: string,
    attributeName?: string,
    timeoutMs?: number
  ): Promise<any> {
    return await this.sendToContentScript('EXTRACT_DATA', {
      selector,
      selectorType,
      extractType,
      attributeName,
      timeoutMs,
    });
  }

  public async scrapeList(
    selector: string,
    selectorType: 'css' | 'xpath',
    fields: any[],
    maxItems?: number,
    timeoutMs?: number
  ): Promise<any[]> {
    return await this.sendToContentScript('SCRAPE_LIST', {
      selector,
      selectorType,
      fields,
      maxItems,
      timeoutMs,
    });
  }

  public async injectScript(code: string, _context: 'content_script' | 'background', args: any[] = []): Promise<any> {
    // O JavaScript do fluxo roda estritamente no contexto da página web e não possui privilégios de extensão (chrome.*).
    const tabId = await this.getTargetTabId();
    const tab = await chrome.tabs.get(tabId).catch(() => null);
    const isExtensionPage = !tab?.url || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('chrome://');

    if (isExtensionPage) {
      // Se for executado sem uma página web real aberta, avalia com SafeJsEvaluator mantendo bloqueio de APIs chrome.*
      const evalRes = SafeJsEvaluator.evaluate(`(function(args, $args) {\n${code}\n})(args, args)`, {
        args,
        $args: args,
        chrome: undefined,
        browser: undefined,
      });
      return evalRes !== undefined ? evalRes : { success: true, executed: true };
    }

    const response = await this.sendToContentScript('INJECT_SCRIPT', { code, args });
    if (response && response.data && response.data.result !== undefined) {
      return response.data.result;
    }
    return response?.data ?? response;
  }

  public async injectHtml(html: string, targetSelector: string, position: string, selectorType?: 'css' | 'xpath'): Promise<void> {
    await this.sendToContentScript('INJECT_HTML', { html, targetSelector, position, selectorType });
  }

  public async injectCss(css: string, target: 'page' | 'injected_component', styleId?: string): Promise<void> {
    await this.sendToContentScript('INJECT_CSS', { css, target, styleId });
  }

  public async injectWebComponent(
    html: string,
    css: string,
    js: string,
    containerId: string,
    mode: 'shadow_dom' | 'inline'
  ): Promise<void> {
    await this.sendToContentScript('INJECT_WEB_COMPONENT', { html, css, js, containerId, mode });
  }

  public async downloadFile(content: string, filename: string, mimeType: string): Promise<void> {
    const base64Data = btoa(unescape(encodeURIComponent(content)));
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    await chrome.downloads.download({
      url: dataUrl,
      filename,
      saveAs: false,
    });
  }
}
