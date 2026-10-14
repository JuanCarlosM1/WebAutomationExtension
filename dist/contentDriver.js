(() => {
  // src/content/contentDriver.ts
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleDomAction(message).then((result) => sendResponse(result)).catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  });
  async function handleDomAction(message) {
    const { action, payload } = message;
    switch (action) {
      case "START_ELEMENT_PICKER": {
        startElementPickerMode();
        return { success: true };
      }
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
    const pos = buttonConfig.position || "bottom-right";
    const containerId = `webautomations-floating-container-${pos}`;
    const shape = buttonConfig.shape || "pill";
    const oldBtn = document.getElementById(existingId);
    if (oldBtn) {
      const prevText = oldBtn.getAttribute("data-webautomations-text");
      const prevShape = oldBtn.getAttribute("data-webautomations-shape");
      const prevPos = oldBtn.getAttribute("data-webautomations-pos");
      const newText = buttonConfig.buttonText || automationName || "Executar Fluxo";
      if (prevText === newText && prevShape === shape && prevPos === pos) {
        return;
      }
    }
    const oldBtns = document.querySelectorAll(`[id="${existingId}"], [data-webautomations-trigger="${automationId}"]`);
    oldBtns.forEach((btn) => btn.remove());
    chrome.storage.local.get(["floating_buttons_layout_settings", "floating_buttons_dragged_positions"], (stored) => {
      const layoutSettings = stored.floating_buttons_layout_settings || {};
      const draggedPositions = stored.floating_buttons_dragged_positions || {};
      const savedPos = draggedPositions[automationId];
      const stackDirection = layoutSettings.stackDirection || "vertical";
      const maxColumns = Number(layoutSettings.maxColumns) > 0 ? Number(layoutSettings.maxColumns) : 3;
      const maxRows = Number(layoutSettings.maxRows) > 0 ? Number(layoutSettings.maxRows) : 5;
      const gap = layoutSettings.gap !== void 0 ? Number(layoutSettings.gap) : 10;
      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        container.setAttribute("data-webautomations-container", pos);
        const unitX = buttonConfig.offsetUnitX || "px";
        const unitY = buttonConfig.offsetUnitY || "px";
        const rawOffsetX = buttonConfig.offsetX !== void 0 ? buttonConfig.offsetX : 24;
        const rawOffsetY = buttonConfig.offsetY !== void 0 ? buttonConfig.offsetY : 24;
        const offsetX = `${rawOffsetX}${unitX}`;
        const offsetY = `${rawOffsetY}${unitY}`;
        let posCss = "";
        let alignFlex = "flex-end";
        let justifyFlex = "flex-end";
        switch (pos) {
          case "bottom-right":
            posCss = `bottom: ${offsetY}; right: ${offsetX};`;
            alignFlex = "flex-end";
            justifyFlex = "flex-end";
            break;
          case "bottom-left":
            posCss = `bottom: ${offsetY}; left: ${offsetX};`;
            alignFlex = "flex-start";
            justifyFlex = "flex-end";
            break;
          case "top-right":
            posCss = `top: ${offsetY}; right: ${offsetX};`;
            alignFlex = "flex-end";
            justifyFlex = "flex-start";
            break;
          case "top-left":
            posCss = `top: ${offsetY}; left: ${offsetX};`;
            alignFlex = "flex-start";
            justifyFlex = "flex-start";
            break;
          case "top-center":
            posCss = `top: ${offsetY}; left: 50%; transform: translateX(-50%);`;
            alignFlex = "center";
            justifyFlex = "flex-start";
            break;
          case "bottom-center":
            posCss = `bottom: ${offsetY}; left: 50%; transform: translateX(-50%);`;
            alignFlex = "center";
            justifyFlex = "flex-end";
            break;
          case "center-left":
            posCss = `top: 50%; left: ${offsetX}; transform: translateY(-50%);`;
            alignFlex = "flex-start";
            justifyFlex = "center";
            break;
          case "center-right":
            posCss = `top: 50%; right: ${offsetX}; transform: translateY(-50%);`;
            alignFlex = "flex-end";
            justifyFlex = "center";
            break;
          case "center":
            posCss = `top: 50%; left: 50%; transform: translate(-50%, -50%);`;
            alignFlex = "center";
            justifyFlex = "center";
            break;
          default:
            posCss = `bottom: ${offsetY}; right: ${offsetX};`;
            alignFlex = "flex-end";
            justifyFlex = "flex-end";
            break;
        }
        container.style.cssText = `
        position: fixed;
        ${posCss}
        z-index: 2147483647;
        display: flex;
        flex-direction: ${stackDirection === "vertical" ? "column" : "row"};
        flex-wrap: wrap;
        align-items: ${alignFlex};
        justify-content: ${justifyFlex};
        gap: ${gap}px;
        max-width: ${stackDirection === "horizontal" ? `${maxColumns * 220}px` : "calc(100vw - 32px)"};
        max-height: ${stackDirection === "vertical" ? `${maxRows * 56}px` : "calc(100vh - 32px)"};
        pointer-events: none;
        transition: all 0.2s ease;
      `;
        if (document.body) {
          document.body.appendChild(container);
        } else {
          document.addEventListener("DOMContentLoaded", () => {
            if (container && !document.getElementById(container.id)) {
              document.body?.appendChild(container);
            }
          });
          document.documentElement.appendChild(container);
        }
      }
      const duplicateInsideContainer = container.querySelector(`[data-webautomations-trigger="${automationId}"], [id="${existingId}"]`);
      if (duplicateInsideContainer) {
        duplicateInsideContainer.remove();
      }
      const btn = document.createElement("button");
      btn.id = existingId;
      btn.setAttribute("data-webautomations-trigger", automationId);
      btn.setAttribute("data-webautomations-shape", shape);
      btn.setAttribute("data-webautomations-pos", pos);
      const text = buttonConfig.buttonText || automationName || "Executar Fluxo";
      btn.setAttribute("data-webautomations-text", text);
      const iconType = buttonConfig.iconType || "emoji";
      const size = buttonConfig.size || "medium";
      let paddingCss = "10px 18px";
      let fontSizeCss = "13px";
      let iconSize = "18px";
      let minDimension = "";
      if (size === "compact") {
        paddingCss = "4px 8px";
        fontSizeCss = "10px";
        iconSize = "12px";
      } else if (size === "small") {
        paddingCss = "6px 12px";
        fontSizeCss = "11px";
        iconSize = "14px";
      } else if (size === "medium") {
        paddingCss = "10px 18px";
        fontSizeCss = "13px";
        iconSize = "18px";
      } else if (size === "large") {
        paddingCss = "14px 24px";
        fontSizeCss = "15px";
        iconSize = "22px";
      } else if (size === "custom") {
        const cW = buttonConfig.customWidth ? `${buttonConfig.customWidth}px` : "auto";
        const cH = buttonConfig.customHeight ? `${buttonConfig.customHeight}px` : "auto";
        const cF = buttonConfig.customFontSize ? `${buttonConfig.customFontSize}px` : "14px";
        paddingCss = "4px 8px";
        fontSizeCss = cF;
        iconSize = buttonConfig.customFontSize ? `${Math.max(12, Math.round(buttonConfig.customFontSize * 1.1))}px` : "18px";
        minDimension = `width: ${cW}; height: ${cH};`;
      }
      let borderRadiusCss = "9999px";
      if (shape === "rounded") {
        borderRadiusCss = buttonConfig.borderRadius !== void 0 ? `${buttonConfig.borderRadius}px` : "10px";
      } else if (shape === "square") {
        borderRadiusCss = "0px";
      } else if (shape === "circle") {
        borderRadiusCss = "50%";
        let circleDim = "44px";
        if (size === "compact") {
          circleDim = "28px";
        } else if (size === "small") {
          circleDim = "36px";
        } else if (size === "medium") {
          circleDim = "44px";
        } else if (size === "large") {
          circleDim = "54px";
        } else if (size === "custom") {
          circleDim = buttonConfig.customWidth ? `${buttonConfig.customWidth}px` : buttonConfig.customHeight ? `${buttonConfig.customHeight}px` : "44px";
        }
        minDimension = `width: ${circleDim}; height: ${circleDim}; min-width: ${circleDim}; min-height: ${circleDim}; padding: 0;`;
      } else if (shape === "pill") {
        borderRadiusCss = "9999px";
      }
      let iconHtml = "";
      if (iconType === "image" && buttonConfig.imageIcon) {
        iconHtml = `<img src="${buttonConfig.imageIcon}" alt="icon" style="width:${iconSize};height:${iconSize};${shape === "circle" ? "" : "margin-right:6px;"}object-fit:contain;border-radius:3px;vertical-align:middle;display:inline-block;" />`;
      } else if (iconType === "svg" && buttonConfig.svgIcon) {
        iconHtml = `<span style="display:inline-flex;align-items:center;justify-content:center;${shape === "circle" ? "" : "margin-right:6px;"}width:${iconSize};height:${iconSize};">${buttonConfig.svgIcon}</span>`;
      } else {
        const icon = buttonConfig.buttonIcon || "\u26A1";
        iconHtml = `<span style="${shape === "circle" ? "" : "margin-right:6px;"}font-size:${iconSize};line-height:1;">${icon}</span>`;
      }
      if (shape === "circle") {
        btn.innerHTML = `${iconHtml}`;
        btn.title = text;
      } else {
        btn.innerHTML = `${iconHtml}<span>${text}</span>`;
      }
      const bgColor = buttonConfig.backgroundColor || "#6366f1";
      const txtColor = buttonConfig.textColor || "#ffffff";
      const rawOpacity = buttonConfig.opacity !== void 0 ? Number(buttonConfig.opacity) : 1;
      const baseOpacity = isNaN(rawOpacity) ? 1 : Math.max(0.1, Math.min(1, rawOpacity));
      let customPosCss = "position: relative;";
      if (savedPos && savedPos.left !== void 0 && savedPos.top !== void 0) {
        customPosCss = `position: fixed; left: ${savedPos.left}px; top: ${savedPos.top}px; z-index: 2147483647;`;
      }
      btn.style.cssText = `
      ${customPosCss}
      pointer-events: auto;
      background: ${bgColor};
      color: ${txtColor};
      opacity: ${baseOpacity};
      border: none;
      border-radius: ${borderRadiusCss};
      padding: ${paddingCss};
      ${minDimension}
      font-size: ${fontSizeCss};
      font-weight: 600;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.15) inset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: box-shadow 0.2s, opacity 0.2s;
      user-select: none;
      white-space: nowrap;
    `;
      const allowDrag = buttonConfig.allowDrag !== false;
      let isDragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let initialLeft = 0;
      let initialTop = 0;
      let hasMoved = false;
      if (allowDrag) {
        btn.title = `${text} (Segure CTRL para arrastar o bot\xE3o)`;
        btn.addEventListener("mousedown", (e) => {
          if (e.button !== 0)
            return;
          if (!e.ctrlKey)
            return;
          isDragging = true;
          hasMoved = false;
          dragStartX = e.clientX;
          dragStartY = e.clientY;
          const rect = btn.getBoundingClientRect();
          initialLeft = rect.left;
          initialTop = rect.top;
          btn.style.cursor = "grabbing";
          btn.style.transition = "none";
          const onMouseMove = (me) => {
            if (!isDragging)
              return;
            const dx = me.clientX - dragStartX;
            const dy = me.clientY - dragStartY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
              hasMoved = true;
            }
            if (hasMoved) {
              if (btn.parentElement !== document.body) {
                document.body.appendChild(btn);
              }
              btn.style.position = "fixed";
              btn.style.left = `${Math.max(4, Math.min(window.innerWidth - rect.width - 4, initialLeft + dx))}px`;
              btn.style.top = `${Math.max(4, Math.min(window.innerHeight - rect.height - 4, initialTop + dy))}px`;
              btn.style.zIndex = "2147483647";
            }
          };
          const onMouseUp = () => {
            if (!isDragging)
              return;
            isDragging = false;
            btn.style.cursor = "pointer";
            btn.style.transition = "box-shadow 0.2s, opacity 0.2s";
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            if (hasMoved) {
              const finalRect = btn.getBoundingClientRect();
              chrome.storage.local.get("floating_buttons_dragged_positions", (d) => {
                const allPositions = d.floating_buttons_dragged_positions || {};
                allPositions[automationId] = {
                  left: Math.round(finalRect.left),
                  top: Math.round(finalRect.top),
                  updatedAt: Date.now()
                };
                chrome.storage.local.set({ floating_buttons_dragged_positions: allPositions });
              });
            }
          };
          window.addEventListener("mousemove", onMouseMove);
          window.addEventListener("mouseup", onMouseUp);
        });
      }
      btn.addEventListener("mouseenter", () => {
        btn.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.35)";
        btn.style.opacity = "1";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.25)";
        btn.style.opacity = `${baseOpacity}`;
      });
      btn.addEventListener("click", (e) => {
        if (hasMoved) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
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
              btn.style.opacity = `${baseOpacity}`;
              btn.innerHTML = `${iconHtml}<span>${text}</span>`;
            });
          }
        });
      });
      if (savedPos && savedPos.left !== void 0 && savedPos.top !== void 0) {
        document.body.appendChild(btn);
      } else {
        container.appendChild(btn);
      }
    });
  }
  function matchUrlPattern(pattern, url) {
    if (!pattern || pattern === "*://*/*" || pattern === "https://*/*" || pattern === "<all_urls>" || pattern === ".*") {
      return true;
    }
    try {
      const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
      const regex = new RegExp(`^${escaped}$`, "i");
      return regex.test(url);
    } catch {
      return false;
    }
  }
  var floatingButtonsMutationObserver = null;
  function checkAndInjectFloatingButtonsOnLoad() {
    try {
      if (!chrome.storage?.local)
        return;
      chrome.storage.local.get("web_automations", (data) => {
        const list = data.web_automations || [];
        const currentUrl = window.location.href;
        const matchedAutomationIds = /* @__PURE__ */ new Set();
        for (const auto of list) {
          const startNode = auto.nodes?.find((n) => n.type === "start");
          if (!startNode || !startNode.data)
            continue;
          const triggers = startNode.data.triggers || [];
          const floatingTriggers = triggers.filter((t) => t.type === "floating_button" && t.enabled !== false);
          for (const trig of floatingTriggers) {
            const patterns = trig.urlPatterns || (trig.urlPattern ? [trig.urlPattern] : ["*://*/*"]);
            const floatingPatterns = patterns.length > 0 ? patterns : ["*://*/*"];
            const matches = floatingPatterns.some((p) => matchUrlPattern(p, currentUrl));
            if (matches) {
              const btnConfig = trig.floatingButton || {};
              const reqSelector = (btnConfig.requireElementSelector || "").trim();
              const reqSelectorType = btnConfig.requireElementSelectorType || "css";
              if (reqSelector) {
                const targetEl = findElement(reqSelector, reqSelectorType);
                if (!targetEl) {
                  continue;
                }
              }
              matchedAutomationIds.add(auto.metadata.id);
              injectFloatingTriggerButton({
                automationId: auto.metadata.id,
                automationName: auto.metadata.name,
                buttonConfig: btnConfig
              });
            }
          }
        }
        document.querySelectorAll("[data-webautomations-trigger]").forEach((el) => {
          const autoId = el.getAttribute("data-webautomations-trigger");
          if (autoId && !matchedAutomationIds.has(autoId)) {
            el.remove();
          }
        });
      });
    } catch (err) {
      console.warn("[WebAutomations] Erro ao carregar bot\xF5es flutuantes:", err);
    }
  }
  function setupFloatingButtonsDomObserver() {
    if (floatingButtonsMutationObserver)
      return;
    let debounceTimeout = null;
    floatingButtonsMutationObserver = new MutationObserver(() => {
      if (debounceTimeout)
        clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        checkAndInjectFloatingButtonsOnLoad();
      }, 250);
    });
    floatingButtonsMutationObserver.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      checkAndInjectFloatingButtonsOnLoad();
      setupFloatingButtonsDomObserver();
    });
  } else {
    checkAndInjectFloatingButtonsOnLoad();
    setupFloatingButtonsDomObserver();
  }
  if (chrome.storage?.onChanged) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && (changes.web_automations || changes.floating_buttons_layout_settings)) {
        checkAndInjectFloatingButtonsOnLoad();
      }
    });
  }
  var pickerOverlayEl = null;
  var pickerHighlightEl = null;
  var pickerInfoBannerEl = null;
  var hoveredTargetEl = null;
  function startElementPickerMode() {
    stopElementPickerMode();
    const overlay = document.createElement("div");
    overlay.id = "webautomations-picker-overlay";
    overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 2147483646;
    cursor: crosshair;
    pointer-events: none;
  `;
    const highlight = document.createElement("div");
    highlight.id = "webautomations-picker-highlight";
    highlight.style.cssText = `
    position: fixed;
    border: 2px solid #6366f1;
    background: rgba(99, 102, 241, 0.2);
    border-radius: 4px;
    z-index: 2147483646;
    pointer-events: none;
    transition: all 0.05s ease-out;
    display: none;
    box-shadow: 0 0 12px rgba(99, 102, 241, 0.5);
  `;
    const banner = document.createElement("div");
    banner.id = "webautomations-picker-banner";
    banner.style.cssText = `
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: #0f172a;
    color: #f8fafc;
    border: 1px solid #6366f1;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    font-family: system-ui, sans-serif;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.6);
    z-index: 2147483647;
    user-select: none;
  `;
    banner.innerHTML = `
    <span style="color: #818cf8;">\u{1F3AF} Clique no elemento desejado</span>
    <span id="pickerTagPreview" style="font-size: 11px; background: #1e293b; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #38bdf8;">nenhum</span>
    <button type="button" id="btnCancelPicker" style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171; border-radius: 4px; padding: 3px 8px; font-size: 11px; cursor: pointer;">Cancelar (Esc)</button>
  `;
    document.body.appendChild(overlay);
    document.body.appendChild(highlight);
    document.body.appendChild(banner);
    pickerOverlayEl = overlay;
    pickerHighlightEl = highlight;
    pickerInfoBannerEl = banner;
    const onMouseMove = (e) => {
      highlight.style.display = "none";
      const target = document.elementFromPoint(e.clientX, e.clientY);
      highlight.style.display = "block";
      if (!target || target === overlay || target === highlight || target === banner || banner.contains(target)) {
        return;
      }
      hoveredTargetEl = target;
      const rect = target.getBoundingClientRect();
      highlight.style.left = `${rect.left}px`;
      highlight.style.top = `${rect.top}px`;
      highlight.style.width = `${rect.width}px`;
      highlight.style.height = `${rect.height}px`;
      const previewTag = banner.querySelector("#pickerTagPreview");
      if (previewTag) {
        const idStr = target.id ? `#${target.id}` : "";
        const cls = target.className && typeof target.className === "string" ? `.${target.className.trim().split(/\s+/)[0]}` : "";
        previewTag.textContent = `<${target.tagName.toLowerCase()}${idStr}${cls}>`;
      }
    };
    const onClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (hoveredTargetEl) {
        const analysis = analyzeElementNodeHierarchical(hoveredTargetEl);
        const chosenSelector = analysis.target.selector;
        chrome.runtime.sendMessage({
          action: "ELEMENT_PICKED_EVENT",
          payload: {
            selector: chosenSelector,
            analysis
          }
        });
        stopElementPickerMode();
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        stopElementPickerMode();
      }
    };
    banner.querySelector("#btnCancelPicker")?.addEventListener("click", stopElementPickerMode);
    window.addEventListener("mousemove", onMouseMove, true);
    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKeyDown, true);
    window.__webautomations_picker_cleanup = () => {
      window.removeEventListener("mousemove", onMouseMove, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }
  function stopElementPickerMode() {
    if (typeof window.__webautomations_picker_cleanup === "function") {
      window.__webautomations_picker_cleanup();
      delete window.__webautomations_picker_cleanup;
    }
    pickerOverlayEl?.remove();
    pickerHighlightEl?.remove();
    pickerInfoBannerEl?.remove();
    pickerOverlayEl = null;
    pickerHighlightEl = null;
    pickerInfoBannerEl = null;
    hoveredTargetEl = null;
  }
  function generateCleanSimpleSelector(el) {
    const tagName = el.tagName.toLowerCase();
    if (el.id && !/^[0-9]/.test(el.id)) {
      const escapedId = CSS.escape ? CSS.escape(el.id) : el.id;
      const testId = `#${escapedId}`;
      try {
        if (document.querySelectorAll(testId).length === 1) {
          return testId;
        }
      } catch {
      }
    }
    const testAttrs = ["name", "data-testid", "data-test", "data-qa", "data-id", "aria-label", "placeholder", "role"];
    for (const attr of testAttrs) {
      const val = el.getAttribute(attr);
      if (val) {
        const sel = `${tagName}[${attr}="${CSS.escape ? CSS.escape(val) : val}"]`;
        try {
          if (document.querySelectorAll(sel).length === 1) {
            return sel;
          }
        } catch {
        }
      }
    }
    if (el.classList && el.classList.length > 0) {
      const validClasses = Array.from(el.classList).filter((c) => !c.includes(":") && !c.includes("/") && c.length > 2);
      for (const cls of validClasses) {
        const sel = `${tagName}.${CSS.escape ? CSS.escape(cls) : cls}`;
        try {
          if (document.querySelectorAll(sel).length === 1) {
            return sel;
          }
        } catch {
        }
      }
      if (validClasses.length >= 2) {
        const sel2 = `${tagName}.${CSS.escape ? CSS.escape(validClasses[0]) : validClasses[0]}.${CSS.escape ? CSS.escape(validClasses[1]) : validClasses[1]}`;
        try {
          if (document.querySelectorAll(sel2).length === 1) {
            return sel2;
          }
        } catch {
        }
      }
    }
    if (el.parentElement && el.parentElement !== document.body && el.parentElement !== document.documentElement) {
      const parentSel = generateCleanSimpleSelector(el.parentElement);
      const combinedSel = `${parentSel} > ${tagName}`;
      try {
        if (document.querySelectorAll(combinedSel).length === 1) {
          return combinedSel;
        }
      } catch {
      }
    }
    return tagName;
  }
  function generateSimpleXPath(el) {
    if (el.id) {
      return `//*[@id="${el.id}"]`;
    }
    const tagName = el.tagName.toLowerCase();
    const name = el.getAttribute("name");
    if (name) {
      return `//${tagName}[@name="${name}"]`;
    }
    const text = el.textContent?.trim();
    if (text && text.length > 0 && text.length < 30) {
      return `//${tagName}[contains(text(), "${text.slice(0, 20)}")]`;
    }
    return `//${tagName}`;
  }
  function extractNodeData(el, isTarget = false) {
    const attrs = {};
    for (let i = 0; i < el.attributes.length; i++) {
      const at = el.attributes[i];
      attrs[at.name] = at.value;
    }
    return {
      tagName: el.tagName,
      id: el.id || void 0,
      classes: Array.from(el.classList || []),
      textSnippet: el.textContent?.trim().slice(0, 40) || void 0,
      selector: generateCleanSimpleSelector(el),
      xpath: generateSimpleXPath(el),
      attributes: attrs,
      isTarget
    };
  }
  function analyzeElementNodeHierarchical(el) {
    const target = extractNodeData(el, true);
    const parent = el.parentElement && el.parentElement !== document.documentElement ? extractNodeData(el.parentElement) : void 0;
    const children = [];
    for (let i = 0; i < el.children.length; i++) {
      children.push(extractNodeData(el.children[i]));
    }
    return {
      target,
      parent,
      children
    };
  }
})();
//# sourceMappingURL=contentDriver.js.map
