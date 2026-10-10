(() => {
  // src/content/contentDriver.ts
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleDomAction(message).then((result) => sendResponse(result)).catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  });
  async function handleDomAction(message) {
    const { action, payload } = message;
    switch (action) {
      case "INJECT_FLOATING_TRIGGER_BUTTON": {
        injectFloatingTriggerButton(payload);
        return { success: true };
      }
      case "CLICK_ELEMENT": {
        const { selector, selectorType, clickType, timeoutMs, coordinates } = payload;
        const el = await waitForElementDOM(selector, selectorType, "clickable", timeoutMs || 5e3);
        if (!el)
          throw new Error(`Elemento n\xE3o encontrado para clique: ${selector}`);
        if (coordinates) {
          const rect = el.getBoundingClientRect();
          const clientX = rect.left + coordinates.x;
          const clientY = rect.top + coordinates.y;
          const evt = new MouseEvent(clickType === "contextmenu" ? "contextmenu" : "click", {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX,
            clientY,
            button: clickType === "contextmenu" ? 2 : 0
          });
          el.dispatchEvent(evt);
        } else {
          if (clickType === "double") {
            el.dispatchEvent(new MouseEvent("dblclick", { bubbles: true, cancelable: true, view: window }));
          } else if (clickType === "contextmenu") {
            el.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, view: window, button: 2 }));
          } else {
            el.click();
          }
        }
        return { success: true };
      }
      case "TYPE_INPUT": {
        const { selector, selectorType, text, mode, minDelay = 30, maxDelay = 100, clear = false, pressEnter = false, timeoutMs = 5e3 } = payload;
        const el = await waitForElementDOM(selector, selectorType, "visible", timeoutMs);
        if (!el)
          throw new Error(`Elemento n\xE3o encontrado para digita\xE7\xE3o: ${selector}`);
        el.focus();
        if (clear) {
          el.value = "";
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }
        if (mode === "paste") {
          el.value += text;
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        } else {
          for (const char of text) {
            const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
            await new Promise((r) => setTimeout(r, delay));
            el.dispatchEvent(new KeyboardEvent("keydown", { key: char, bubbles: true }));
            el.dispatchEvent(new KeyboardEvent("keypress", { key: char, bubbles: true }));
            el.value += char;
            el.dispatchEvent(new Event("input", { bubbles: true }));
            el.dispatchEvent(new KeyboardEvent("keyup", { key: char, bubbles: true }));
          }
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }
        if (pressEnter) {
          await new Promise((r) => setTimeout(r, 100));
          el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", keyCode: 13, bubbles: true }));
          el.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", code: "Enter", keyCode: 13, bubbles: true }));
        }
        return { success: true };
      }
      case "PRESS_KEY": {
        const { key, modifiers = [], selector, selectorType } = payload;
        let target = document.activeElement || document.body;
        if (selector) {
          const found = findElement(selector, selectorType || "css");
          if (found)
            target = found;
        }
        const evtInit = {
          key,
          bubbles: true,
          cancelable: true,
          ctrlKey: modifiers.includes("ctrl"),
          altKey: modifiers.includes("alt"),
          shiftKey: modifiers.includes("shift"),
          metaKey: modifiers.includes("meta")
        };
        target.dispatchEvent(new KeyboardEvent("keydown", evtInit));
        target.dispatchEvent(new KeyboardEvent("keyup", evtInit));
        return { success: true };
      }
      case "HOVER_FOCUS": {
        const { selector, selectorType, action: action2, timeoutMs = 5e3 } = payload;
        const el = await waitForElementDOM(selector, selectorType, "visible", timeoutMs);
        if (!el)
          throw new Error(`Elemento n\xE3o encontrado: ${selector}`);
        if (action2 === "focus") {
          el.focus();
        } else {
          el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true }));
          el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true, cancelable: true }));
        }
        return { success: true };
      }
      case "SCROLL": {
        const { target, selector, selectorType, deltaX = 0, deltaY = 0, smooth = true } = payload;
        const behavior = smooth ? "smooth" : "auto";
        if (target === "top") {
          window.scrollTo({ top: 0, left: 0, behavior });
        } else if (target === "bottom") {
          window.scrollTo({ top: document.body.scrollHeight, left: 0, behavior });
        } else if (target === "element" && selector) {
          const el = findElement(selector, selectorType || "css");
          if (el)
            el.scrollIntoView({ behavior, block: "center" });
        } else if (target === "by_pixels") {
          window.scrollBy({ top: deltaY, left: deltaX, behavior });
        }
        return { success: true };
      }
      case "WAIT_FOR_ELEMENT": {
        const { selector, selectorType, state, timeoutMs } = payload;
        const el = await waitForElementDOM(selector, selectorType, state, timeoutMs);
        return { success: !!el };
      }
      case "ELEMENT_EXISTS": {
        const { selector, selectorType, timeoutMs = 1e3 } = payload;
        const el = await waitForElementDOM(selector, selectorType, "attached", timeoutMs);
        return { success: true, data: !!el };
      }
      case "EXTRACT_DATA": {
        const { selector, selectorType, extractType, attributeName, timeoutMs = 5e3 } = payload;
        const el = await waitForElementDOM(selector, selectorType, "attached", timeoutMs);
        if (!el)
          throw new Error(`Elemento para extra\xE7\xE3o n\xE3o encontrado: ${selector}`);
        let value = null;
        if (extractType === "innerText")
          value = el.innerText;
        else if (extractType === "innerHTML")
          value = el.innerHTML;
        else if (extractType === "value")
          value = el.value;
        else if (extractType === "attribute" && attributeName)
          value = el.getAttribute(attributeName);
        return { success: true, data: value };
      }
      case "SCRAPE_LIST": {
        const { selector, selectorType, fields, maxItems = 100, timeoutMs = 5e3 } = payload;
        await waitForElementDOM(selector, selectorType, "attached", timeoutMs);
        const elements = findAllElements(selector, selectorType);
        const results = [];
        const limit = Math.min(elements.length, maxItems);
        for (let i = 0; i < limit; i++) {
          const itemEl = elements[i];
          const row = {};
          for (const field of fields) {
            let targetEl = itemEl;
            if (field.subSelector) {
              targetEl = itemEl.querySelector(field.subSelector);
            }
            if (!targetEl) {
              row[field.name] = null;
              continue;
            }
            if (field.extractType === "innerText")
              row[field.name] = targetEl.innerText?.trim();
            else if (field.extractType === "innerHTML")
              row[field.name] = targetEl.innerHTML;
            else if (field.extractType === "value")
              row[field.name] = targetEl.value;
            else if (field.extractType === "attribute" && field.attributeName) {
              row[field.name] = targetEl.getAttribute(field.attributeName);
            }
          }
          results.push(row);
        }
        return { success: true, data: results };
      }
      case "INJECT_HTML": {
        const { html, targetSelector, position, selectorType = "css" } = payload;
        const el = findElement(targetSelector, selectorType);
        if (!el)
          throw new Error(`Elemento alvo de inje\xE7\xE3o HTML n\xE3o encontrado: ${targetSelector}`);
        el.insertAdjacentHTML(position, html);
        return { success: true };
      }
      case "INJECT_CSS": {
        const { css, styleId } = payload;
        let styleEl = styleId ? document.getElementById(styleId) : null;
        if (!styleEl) {
          styleEl = document.createElement("style");
          if (styleId)
            styleEl.id = styleId;
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = css;
        return { success: true };
      }
      case "INJECT_WEB_COMPONENT": {
        const { html, css, js, containerId, mode } = payload;
        let container = document.getElementById(containerId);
        if (!container) {
          container = document.createElement("div");
          container.id = containerId;
          document.body.appendChild(container);
        }
        let root = container;
        if (mode === "shadow_dom" && !container.shadowRoot) {
          root = container.attachShadow({ mode: "open" });
        } else if (container.shadowRoot) {
          root = container.shadowRoot;
        }
        const style = document.createElement("style");
        style.textContent = css;
        const content = document.createElement("div");
        content.innerHTML = html;
        root.appendChild(style);
        root.appendChild(content);
        if (js) {
          const script = document.createElement("script");
          script.textContent = `(function(){ ${js} })();`;
          document.body.appendChild(script);
        }
        return { success: true };
      }
      default:
        throw new Error(`A\xE7\xE3o de DOM desconhecida: ${action}`);
    }
  }
  function findElement(selector, type) {
    if (type === "xpath") {
      const res = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      return res.singleNodeValue;
    }
    return document.querySelector(selector);
  }
  function findAllElements(selector, type) {
    if (type === "xpath") {
      const res = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const list = [];
      for (let i = 0; i < res.snapshotLength; i++) {
        const node = res.snapshotItem(i);
        if (node instanceof Element)
          list.push(node);
      }
      return list;
    }
    return Array.from(document.querySelectorAll(selector));
  }
  function waitForElementDOM(selector, type, state, timeoutMs) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const check = () => {
        const el = findElement(selector, type);
        if (state === "attached" && el)
          return resolve(el);
        if (state === "hidden" && (!el || el.offsetParent === null))
          return resolve(el);
        if (el && el.offsetParent !== null) {
          if (state === "visible")
            return resolve(el);
          if (state === "clickable" && !el.disabled)
            return resolve(el);
        }
        if (Date.now() - startTime >= timeoutMs) {
          return resolve(state === "hidden" ? el : null);
        }
        requestAnimationFrame(check);
      };
      check();
    });
  }
  function injectFloatingTriggerButton(payload) {
    const { automationId, automationName, buttonConfig = {} } = payload;
    const existingId = `webautomations-floating-btn-${automationId}`;
    if (document.getElementById(existingId))
      return;
    const btn = document.createElement("button");
    btn.id = existingId;
    btn.setAttribute("data-webautomations-trigger", automationId);
    const text = buttonConfig.buttonText || automationName || "Executar Fluxo";
    const iconType = buttonConfig.iconType || "emoji";
    let iconHtml = "";
    if (iconType === "image" && buttonConfig.imageIcon) {
      iconHtml = `<img src="${buttonConfig.imageIcon}" alt="icon" style="width:18px;height:18px;margin-right:6px;object-fit:contain;border-radius:3px;vertical-align:middle;display:inline-block;" />`;
    } else if (iconType === "svg" && buttonConfig.svgIcon) {
      iconHtml = `<span style="display:inline-flex;align-items:center;margin-right:6px;width:18px;height:18px;">${buttonConfig.svgIcon}</span>`;
    } else {
      const icon = buttonConfig.buttonIcon || "\u26A1";
      iconHtml = `<span style="margin-right:6px;font-size:16px;line-height:1;">${icon}</span>`;
    }
    btn.innerHTML = `${iconHtml}<span>${text}</span>`;
    const pos = buttonConfig.position || "bottom-right";
    const offsetX = buttonConfig.offsetX !== void 0 ? `${buttonConfig.offsetX}px` : "24px";
    const offsetY = buttonConfig.offsetY !== void 0 ? `${buttonConfig.offsetY}px` : "24px";
    let posCss = "";
    if (pos === "bottom-right")
      posCss = `bottom: ${offsetY}; right: ${offsetX};`;
    else if (pos === "bottom-left")
      posCss = `bottom: ${offsetY}; left: ${offsetX};`;
    else if (pos === "top-right")
      posCss = `top: ${offsetY}; right: ${offsetX};`;
    else if (pos === "top-left")
      posCss = `top: ${offsetY}; left: ${offsetX};`;
    const bgColor = buttonConfig.backgroundColor || "#6366f1";
    const txtColor = buttonConfig.textColor || "#ffffff";
    btn.style.cssText = `
    position: fixed;
    ${posCss}
    z-index: 2147483647;
    background: ${bgColor};
    color: ${txtColor};
    border: none;
    border-radius: 9999px;
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 600;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.15) inset;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s;
    user-select: none;
  `;
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-2px) scale(1.03)";
      btn.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.35)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translateY(0) scale(1)";
      btn.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.25)";
    });
    btn.addEventListener("click", () => {
      btn.style.opacity = "0.7";
      btn.textContent = "\u23F3 Executando...";
      chrome.storage.local.get("web_automations", (data) => {
        const list = data.web_automations || [];
        const auto = list.find((a) => a.metadata?.id === automationId);
        if (auto) {
          chrome.runtime.sendMessage({
            action: "EXECUTE_AUTOMATION",
            payload: { graph: auto }
          }, () => {
            btn.style.opacity = "1";
            btn.innerHTML = `${iconHtml}<span>${text}</span>`;
          });
        }
      });
    });
    document.body.appendChild(btn);
  }
})();
//# sourceMappingURL=contentDriver.js.map
