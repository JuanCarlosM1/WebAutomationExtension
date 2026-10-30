/**
 * Setup global dos testes: garante um `chrome` mockado limpo e DOM vazio antes de cada teste.
 */
import { beforeEach, afterEach, vi } from 'vitest';
import { installChromeMock } from './chromeMock';

// jsdom não implementa alguns métodos usados pela UI
if (typeof window !== 'undefined') {
  window.close = () => {};
  try {
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      get() {
        return this.parentElement || (document && document.body) || null;
      },
      configurable: true,
    });
  } catch {}
  if (!Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText')) {
    Object.defineProperty(HTMLElement.prototype, 'innerText', {
      get() {
        return this.textContent;
      },
      set(val) {
        this.textContent = val;
      },
    });
  }
  if (!(Element.prototype as any).scrollIntoView) {
    (Element.prototype as any).scrollIntoView = function () {};
  }
  if (!(window as any).matchMedia) {
    (window as any).matchMedia = () => ({
      matches: false,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
    });
  }
}

beforeEach(() => {
  installChromeMock();
  if (typeof document !== 'undefined') {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  }
});

afterEach(() => {
  vi.useRealTimers();
});

