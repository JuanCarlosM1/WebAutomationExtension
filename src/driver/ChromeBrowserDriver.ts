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

  private isStudioPage(url?: string): boolean {
    if (!url) return false;
    return url.includes('editor.html') || url.includes('settings.html') || url.includes('analyzer.html');
  }

  private async getTargetTabId(): Promise<number> {
    if (this.activeTabId) {
      try {
        const tab = await chrome.tabs.get(this.activeTabId);
        if (tab?.id && !this.isStudioPage(tab.url)) return tab.id;
      } catch {
        this.activeTabId = undefined;
      }
    }

    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (activeTab?.id && !this.isStudioPage(activeTab.url)) {
      this.activeTabId = activeTab.id;
      return activeTab.id;
    }

    if (chrome.tabs?.query) {
      const allTabs = await chrome.tabs.query({});
      const testTab = allTabs.find((t) => t.id && t.url?.includes('test.html'));
      if (testTab?.id) {
        this.activeTabId = testTab.id;
        return testTab.id;
      }

      const otherActiveTabs = allTabs.filter((t) => t.id && t.active && !this.isStudioPage(t.url));
      if (otherActiveTabs.length > 0 && otherActiveTabs[0].id) {
        this.activeTabId = otherActiveTabs[0].id;
        return otherActiveTabs[0].id;
      }

      const webTab = allTabs.find((t) => t.id && (t.url?.startsWith('http://') || t.url?.startsWith('https://')));
      if (webTab?.id) {
        this.activeTabId = webTab.id;
        return webTab.id;
      }
    }

    if (activeTab?.id) {
      this.activeTabId = activeTab.id;
      return activeTab.id;
    }

    throw new Error('Nenhuma aba ativa encontrada para executar a ação.');
  }



  // -------------------------------------------------------------
  // NAVEGAÇÃO E ABAS
  // -------------------------------------------------------------

  public async navigateTo(url: string, waitUntil: string = 'load', timeoutMs: number = 30000): Promise<void> {
    const tabId = await this.getTargetTabId();
    await chrome.tabs.update(tabId, { url });

    if (waitUntil === 'none') return;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(listener);
        reject(new Error(`Timeout (${timeoutMs}ms) aguardando carregamento da URL: ${url}`));
      }, timeoutMs);

      const listener = (updatedTabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
        if (updatedTabId === tabId) {
          if (waitUntil === 'load' && changeInfo.status === 'complete') {
            clearTimeout(timer);
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
          } else if (waitUntil === 'domcontentloaded' && changeInfo.status) {
            clearTimeout(timer);
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
          }
        }
      };

      chrome.tabs.onUpdated.addListener(listener);
    });
  }

  public async createTab(url?: string, active: boolean = true): Promise<{ tabId: number; url?: string }> {
    const defaultUrl = chrome.runtime?.getURL ? chrome.runtime.getURL('test.html') : 'test.html';
    const tab = await chrome.tabs.create({ url: url || defaultUrl, active });
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
    _timeoutMs?: number,
    coordinates?: { x: number; y: number }
  ): Promise<void> {
    const tabId = await this.getTargetTabId();
    const [res] = await chrome.scripting.executeScript({
      target: { tabId },
      func: (sel: string, type: 'css' | 'xpath', click: string, coords?: { x: number; y: number }) => {
        let el: Element | null = null;
        if (type === 'xpath') {
          const r = document.evaluate(sel, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          el = r.singleNodeValue as Element;
        } else {
          el = document.querySelector(sel);
        }
        if (!el) return { error: `Elemento não encontrado para clique: ${sel}` };

        if (coords) {
          const rect = el.getBoundingClientRect();
          const evt = new MouseEvent(click === 'contextmenu' ? 'contextmenu' : 'click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: rect.left + coords.x,
            clientY: rect.top + coords.y,
            button: click === 'contextmenu' ? 2 : 0,
          });
          el.dispatchEvent(evt);
        } else {
          if (click === 'double') {
            el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true, view: window }));
          } else if (click === 'contextmenu') {
            el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, view: window, button: 2 }));
          } else {
            (el as HTMLElement).click();
          }
        }
        return { success: true };
      },
      args: [selector, selectorType, clickType, coordinates],
    });
    if (res?.result && (res.result as any).error) {
      throw new Error((res.result as any).error);
    }
  }

  public async typeText(
    selector: string,
    selectorType: 'css' | 'xpath',
    text: string,
    _mode: string,
    _minDelay?: number,
    _maxDelay?: number,
    clear?: boolean,
    pressEnter?: boolean,
    _timeoutMs?: number
  ): Promise<void> {
    const tabId = await this.getTargetTabId();
    const [res] = await chrome.scripting.executeScript({
      target: { tabId },
      func: (sel: string, type: 'css' | 'xpath', txt: string, clearFirst: boolean, enter: boolean) => {
        let el: Element | null = null;
        if (type === 'xpath') {
          const r = document.evaluate(sel, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          el = r.singleNodeValue as Element;
        } else {
          el = document.querySelector(sel);
        }
        if (!el) return { error: `Elemento não encontrado para digitação: ${sel}` };
        const input = el as HTMLInputElement | HTMLTextAreaElement;
        input.focus();
        if (clearFirst) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
        input.value = (input.value || '') + txt;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        if (enter) {
          input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
          input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true }));
        }
        return { success: true };
      },
      args: [selector, selectorType, text, Boolean(clear), Boolean(pressEnter)],
    });
    if (res?.result && (res.result as any).error) {
      throw new Error((res.result as any).error);
    }
  }

  public async pressKey(key: string, modifiers?: string[], selector?: string, selectorType?: 'css' | 'xpath'): Promise<void> {
    const tabId = await this.getTargetTabId();
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (k: string, mods?: string[], sel?: string, type?: 'css' | 'xpath') => {
        let target: Element = document.activeElement || document.body;
        if (sel) {
          let found: Element | null = null;
          if (type === 'xpath') {
            const r = document.evaluate(sel, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            found = r.singleNodeValue as Element;
          } else {
            found = document.querySelector(sel);
          }
          if (found) target = found;
        }
        const eventInit: KeyboardEventInit = {
          key: k,
          bubbles: true,
          cancelable: true,
          ctrlKey: mods?.includes('ctrl') || mods?.includes('Control'),
          shiftKey: mods?.includes('shift') || mods?.includes('Shift'),
          altKey: mods?.includes('alt') || mods?.includes('Alt'),
          metaKey: mods?.includes('meta') || mods?.includes('Meta'),
        };
        target.dispatchEvent(new KeyboardEvent('keydown', eventInit));
        target.dispatchEvent(new KeyboardEvent('keypress', eventInit));
        target.dispatchEvent(new KeyboardEvent('keyup', eventInit));
      },
      args: [key, modifiers || [], selector, selectorType],
    });
  }

  public async hoverOrFocus(
    selector: string,
    selectorType: 'css' | 'xpath',
    action: 'hover' | 'focus',
    _timeoutMs?: number
  ): Promise<void> {
    const tabId = await this.getTargetTabId();
    const [res] = await chrome.scripting.executeScript({
      target: { tabId },
      func: (sel: string, type: 'css' | 'xpath', act: 'hover' | 'focus') => {
        let el: Element | null = null;
        if (type === 'xpath') {
          const r = document.evaluate(sel, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          el = r.singleNodeValue as Element;
        } else {
          el = document.querySelector(sel);
        }
        if (!el) return { error: `Elemento não encontrado: ${sel}` };
        if (act === 'focus') {
          (el as HTMLElement).focus();
        } else {
          el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true, view: window }));
        }
        return { success: true };
      },
      args: [selector, selectorType, action],
    });
    if (res?.result && (res.result as any).error) {
      throw new Error((res.result as any).error);
    }
  }

  public async scroll(
    target: string,
    selector?: string,
    selectorType?: 'css' | 'xpath',
    deltaX?: number,
    deltaY?: number,
    smooth?: boolean
  ): Promise<void> {
    const tabId = await this.getTargetTabId();
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (tgt: string, sel?: string, type?: 'css' | 'xpath', dX?: number, dY?: number, isSmooth?: boolean) => {
        const behavior = isSmooth ? 'smooth' : 'auto';
        if (sel) {
          let el: Element | null = null;
          if (type === 'xpath') {
            const r = document.evaluate(sel, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            el = r.singleNodeValue as Element;
          } else {
            el = document.querySelector(sel);
          }
          if (el) {
            el.scrollIntoView({ behavior, block: 'center' });
            return;
          }
        }
        if (tgt === 'top') {
          window.scrollTo({ top: 0, left: 0, behavior });
        } else if (tgt === 'bottom') {
          window.scrollTo({ top: document.body.scrollHeight, left: 0, behavior });
        } else if (tgt === 'by_offset') {
          window.scrollBy({ left: dX ?? 0, top: dY ?? 500, behavior });
        }
      },
      args: [target, selector, selectorType, deltaX, deltaY, smooth],
    });
  }

  public async waitForElement(
    selector: string,
    selectorType: 'css' | 'xpath',
    state: string,
    timeoutMs: number
  ): Promise<boolean> {
    const tabId = await this.getTargetTabId();
    const start = Date.now();
    const maxTimeout = timeoutMs || 5000;

    while (Date.now() - start < maxTimeout) {
      const [res] = await chrome.scripting.executeScript({
        target: { tabId },
        func: (sel: string, type: 'css' | 'xpath', checkState: string) => {
          let el: Element | null = null;
          if (type === 'xpath') {
            const r = document.evaluate(sel, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            el = r.singleNodeValue as Element;
          } else {
            el = document.querySelector(sel);
          }
          if (!el) return false;
          if (checkState === 'visible' || checkState === 'clickable') {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
          }
          return true;
        },
        args: [selector, selectorType, state],
      });
      if (res?.result) return true;
      await new Promise((r) => setTimeout(r, 200));
    }
    return false;
  }

  public async elementExists(selector: string, selectorType: 'css' | 'xpath', timeoutMs?: number): Promise<boolean> {
    try {
      return await this.waitForElement(selector, selectorType, 'present', timeoutMs ?? 1000);
    } catch {
      return false;
    }
  }

  public async extractData(
    selector: string,
    selectorType: 'css' | 'xpath',
    extractType: string,
    attributeName?: string,
    _timeoutMs?: number
  ): Promise<any> {
    const tabId = await this.getTargetTabId();
    const [res] = await chrome.scripting.executeScript({
      target: { tabId },
      func: (sel: string, type: 'css' | 'xpath', extType: string, attr?: string) => {
        let el: Element | null = null;
        if (type === 'xpath') {
          const r = document.evaluate(sel, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          el = r.singleNodeValue as Element;
        } else {
          el = document.querySelector(sel);
        }
        if (!el) return null;
        if (extType === 'text') return (el.textContent || '').trim();
        if (extType === 'html') return el.innerHTML;
        if (extType === 'outer_html') return el.outerHTML;
        if (extType === 'attribute' && attr) return el.getAttribute(attr);
        if (extType === 'value') return (el as HTMLInputElement).value;
        return (el.textContent || '').trim();
      },
      args: [selector, selectorType, extractType, attributeName],
    });
    return res?.result;
  }

  public async scrapeList(
    selector: string,
    selectorType: 'css' | 'xpath',
    fields: any[],
    maxItems?: number,
    _timeoutMs?: number
  ): Promise<any[]> {
    const tabId = await this.getTargetTabId();
    const [res] = await chrome.scripting.executeScript({
      target: { tabId },
      func: (sel: string, type: 'css' | 'xpath', fList: any[], max?: number) => {
        let elements: Element[] = [];
        if (type === 'xpath') {
          const r = document.evaluate(sel, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          for (let i = 0; i < r.snapshotLength; i++) {
            const n = r.snapshotItem(i) as Element;
            if (n) elements.push(n);
          }
        } else {
          elements = Array.from(document.querySelectorAll(sel));
        }
        if (max && max > 0) elements = elements.slice(0, max);
        return elements.map((itemEl) => {
          const rowData: Record<string, any> = {};
          for (const field of fList) {
            const fName = field.name || 'field';
            const fSel = field.selector;
            const subEl = fSel ? itemEl.querySelector(fSel) : itemEl;
            if (!subEl) {
              rowData[fName] = null;
              continue;
            }
            if (field.extractType === 'attribute' && field.attributeName) {
              rowData[fName] = subEl.getAttribute(field.attributeName);
            } else if (field.extractType === 'html') {
              rowData[fName] = subEl.innerHTML;
            } else if (field.extractType === 'value') {
              rowData[fName] = (subEl as HTMLInputElement).value;
            } else {
              rowData[fName] = (subEl.textContent || '').trim();
            }
          }
          return rowData;
        });
      },
      args: [selector, selectorType, fields, maxItems],
    });
    return res?.result || [];
  }

  public async injectScript(code: string, context: 'content_script' | 'background', args: any[] = []): Promise<any> {
    if (context === 'background') {
      const fn = new Function(...args.map((_, i) => `arg${i}`), code);
      return fn(...args);
    }

    const tabId = await this.getTargetTabId();
    // Injeta e executa diretamente os códigos JS escritos pelo usuário na página web (world: MAIN)
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      world: 'MAIN',
      func: (scriptCode: string, scriptArgs: any[]) => {
        try {
          const fn = new Function('args', scriptCode);
          return fn(scriptArgs);
        } catch (err: any) {
          return { __isError: true, message: err?.message || String(err), stack: err?.stack };
        }
      },
      args: [code, args],
    });

    const res = result?.result;
    if (res && (res as any).__isError) {
      throw new Error((res as any).message);
    }
    return res;
  }

  public async injectHtml(html: string, targetSelector: string, position: string, selectorType?: 'css' | 'xpath'): Promise<void> {
    const tabId = await this.getTargetTabId();
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (h: string, sel: string, pos: string, type?: 'css' | 'xpath') => {
        let el: Element | null = null;
        if (type === 'xpath') {
          const r = document.evaluate(sel, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          el = r.singleNodeValue as Element;
        } else {
          el = document.querySelector(sel);
        }
        if (!el) throw new Error(`Elemento não encontrado: ${sel}`);
        el.insertAdjacentHTML((pos as InsertPosition) || 'beforeend', h);
      },
      args: [html, targetSelector, position, selectorType],
    });
  }

  public async injectCss(css: string, _target: 'page' | 'injected_component', styleId?: string): Promise<void> {
    const tabId = await this.getTargetTabId();
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (styleContent: string, id?: string) => {
        const style = document.createElement('style');
        if (id) style.id = id;
        style.textContent = styleContent;
        (document.head || document.documentElement).appendChild(style);
      },
      args: [css, styleId],
    });
  }

  public async injectWebComponent(
    html: string,
    css: string,
    js: string,
    containerId: string,
    mode: 'shadow_dom' | 'inline'
  ): Promise<void> {
    const tabId = await this.getTargetTabId();
    await chrome.scripting.executeScript({
      target: { tabId },
      world: 'MAIN',
      func: (h: string, c: string, j: string, cid: string, m: 'shadow_dom' | 'inline') => {
        let container = document.getElementById(cid);
        if (!container) {
          container = document.createElement('div');
          container.id = cid;
          document.body.appendChild(container);
        }
        if (m === 'shadow_dom') {
          const shadow = container.shadowRoot || container.attachShadow({ mode: 'open' });
          shadow.innerHTML = `<style>${c}</style>${h}`;
        } else {
          container.innerHTML = `<style>${c}</style>${h}`;
        }
        if (j) {
          new Function(j)();
        }
      },
      args: [html, css, js, containerId, mode],
    });
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
