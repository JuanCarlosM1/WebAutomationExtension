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
        showCompactAnalyzerOnPage();
        startElementPickerMode();
        return { success: true };
      }
      case "OPEN_HTML_ANALYZER": {
        showCompactAnalyzerOnPage();
        if (payload?.startPicker) {
          startElementPickerMode();
        }
        return { success: true };
      }
      case "STOP_ELEMENT_PICKER": {
        stopElementPickerCrosshair();
        return { success: true };
      }
      case "FORWARD_PICKER_KEY": {
        if (typeof window.__webautomations_picker_handle_key === "function") {
          window.__webautomations_picker_handle_key(payload?.key || payload);
        }
        return { success: true };
      }
      case "INJECT_FLOATING_TRIGGER_BUTTON": {
        injectFloatingTriggerButton(payload);
        return { success: true };
      }
      case "SYNC_FLOATING_TRIGGER_BUTTONS": {
        checkAndInjectFloatingButtonsOnLoad();
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
    const configSignature = JSON.stringify({ automationName, buttonConfig });
    const oldBtn = document.getElementById(existingId);
    if (oldBtn && oldBtn.getAttribute("data-webautomations-sig") === configSignature) {
      return;
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
      const containerCss = `
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
      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        container.setAttribute("data-webautomations-container", pos);
        container.style.cssText = containerCss;
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
      } else {
        container.style.cssText = containerCss;
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
      btn.setAttribute("data-webautomations-sig", configSignature);
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
  var compactAnalyzerEl = null;
  var compactSelectedHighlightEl = null;
  function copyTextToClipboard(text) {
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
  function highlightSelectedElement(target) {
    let hl = document.getElementById("webautomations-selected-highlight");
    if (!hl) {
      hl = document.createElement("div");
      hl.id = "webautomations-selected-highlight";
      hl.style.cssText = `
      position: fixed;
      border: 2px solid #818cf8;
      background: rgba(99, 102, 241, 0.18);
      border-radius: 4px;
      z-index: 2147483645;
      pointer-events: none;
      box-shadow: 0 0 16px rgba(99, 102, 241, 0.55);
      transition: all 0.1s ease-out;
    `;
      document.body.appendChild(hl);
    }
    compactSelectedHighlightEl = hl;
    const rect = target.getBoundingClientRect();
    hl.style.display = "block";
    hl.style.left = `${rect.left}px`;
    hl.style.top = `${rect.top}px`;
    hl.style.width = `${rect.width}px`;
    hl.style.height = `${rect.height}px`;
  }
  function closeCompactAnalyzerOnPage() {
    stopElementPickerCrosshair();
    compactAnalyzerEl?.remove();
    compactAnalyzerEl = null;
    compactSelectedHighlightEl?.remove();
    compactSelectedHighlightEl = null;
    const oldHl = document.getElementById("webautomations-selected-highlight");
    oldHl?.remove();
    const oldWin = document.getElementById("webautomations-compact-analyzer");
    oldWin?.remove();
    try {
      chrome.runtime.sendMessage({ action: "PICKER_STATUS_CHANGED", payload: { active: false } });
    } catch {
    }
  }
  function showCompactAnalyzerOnPage(analysis, targetEl) {
    let win = document.getElementById("webautomations-compact-analyzer");
    if (!win) {
      win = document.createElement("div");
      win.id = "webautomations-compact-analyzer";
      win.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      width: 360px;
      max-height: 84vh;
      background: #0f172a;
      border: 1px solid #4f46e5;
      border-radius: 10px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75), 0 0 20px rgba(99, 102, 241, 0.35);
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      z-index: 2147483647;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      user-select: none;
      box-sizing: border-box;
    `;
      document.body.appendChild(win);
    }
    compactAnalyzerEl = win;
    const renderCard = (title, node, isTarget = false, isChild = false) => {
      const tagColor = isTarget ? "#38bdf8" : isChild ? "#34d399" : "#a78bfa";
      const bg = isTarget ? "rgba(99, 102, 241, 0.12)" : "rgba(30, 41, 59, 0.6)";
      const border = isTarget ? "#6366f1" : "#334155";
      const tagStr = `&lt;${node.tagName.toLowerCase()}${node.id ? ` id="${node.id}"` : ""}${node.classes && node.classes.length ? ` class="${node.classes.slice(0, 2).join(" ")}"` : ""}&gt;`;
      const textStr = node.textSnippet ? `<div style="font-size:10px; color:#94a3b8; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:2px;">"${node.textSnippet}"</div>` : "";
      return `
      <div style="background:${bg}; border:1px solid ${border}; border-radius:6px; padding:6px 8px; display:flex; flex-direction:column; gap:4px;">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:4px;">
          <span style="font-size:10px; font-weight:700; color:${tagColor}; text-transform:uppercase;">${title}</span>
          <code style="font-size:10px; color:#f1f5f9; background:#090d16; padding:1px 4px; border-radius:3px;">${tagStr}</code>
        </div>
        ${textStr}
        <div style="display:flex; align-items:center; gap:4px; margin-top:2px;">
          <input type="text" readonly value="${node.selector || ""}" title="Seletor CSS" style="flex:1; background:#090d16; border:1px solid #1e293b; border-radius:3px; color:#38bdf8; font-family:monospace; font-size:10px; padding:2px 6px;" />
          <button type="button" class="btn-copy-val" data-val="${(node.selector || "").replace(/"/g, "&quot;")}" style="background:#1e293b; border:1px solid #334155; color:#f8fafc; border-radius:3px; font-size:10px; padding:2px 6px; cursor:pointer;">Copiar</button>
        </div>
        <div style="display:flex; align-items:center; gap:4px;">
          <input type="text" readonly value="${node.xpath || ""}" title="XPath" style="flex:1; background:#090d16; border:1px solid #1e293b; border-radius:3px; color:#fbbf24; font-family:monospace; font-size:10px; padding:2px 6px;" />
          <button type="button" class="btn-copy-val" data-val="${(node.xpath || "").replace(/"/g, "&quot;")}" style="background:#1e293b; border:1px solid #334155; color:#f8fafc; border-radius:3px; font-size:10px; padding:2px 6px; cursor:pointer;">Copiar</button>
        </div>
      </div>
    `;
    };
    let bodyHtml = "";
    if (analysis && analysis.target) {
      let parentHtml = "";
      if (analysis.parent) {
        parentHtml = renderCard("Elemento Pai (Container)", analysis.parent);
      }
      let childrenHtml = "";
      if (analysis.children && analysis.children.length > 0) {
        const childCards = analysis.children.slice(0, 4).map((c, i) => renderCard(`Filho #${i + 1}`, c, false, true)).join("");
        childrenHtml = `
        <div style="display:flex; flex-direction:column; gap:6px;">
          <span style="font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase;">Elementos Filhos (${analysis.children.length}):</span>
          ${childCards}
        </div>
      `;
      }
      bodyHtml = `
      <div id="compactAnalysisBody" style="padding:10px 12px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:8px;">
        ${renderCard("Elemento Selecionado (Alvo)", analysis.target, true)}
        ${parentHtml}
        ${childrenHtml}
      </div>
    `;
    } else {
      bodyHtml = `
      <div id="compactAnalysisBody" style="padding:16px 12px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:8px; text-align:center;">
        <div style="color:#94a3b8; font-size:11px; line-height:1.5;">
          \u{1F3AF} Clique no bot\xE3o <b>Nova Mira</b> para selecionar qualquer elemento na p\xE1gina ou digite um seletor abaixo para testar.
        </div>
      </div>
    `;
    }
    win.innerHTML = `
    <div id="compactAnalyzerHeader" style="background:#172033; padding:8px 12px; border-bottom:1px solid #1e293b; display:flex; align-items:center; justify-content:space-between; cursor:grab; user-select:none;">
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="opacity:0.6; font-size:12px;">\u22EE\u22EE</span>
        <span style="font-weight:700; color:#818cf8; font-size:12px;">\u{1F50D} Analisador HTML</span>
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        <button type="button" id="btnCompactPickNew" title="Selecionar elemento com a mira" style="background:#6366f1; border:none; color:white; border-radius:4px; padding:3px 8px; font-size:11px; font-weight:600; cursor:pointer;">\u{1F3AF} Nova Mira</button>
        <button type="button" id="btnCompactClose" title="Fechar analisador" style="background:transparent; border:none; color:#94a3b8; font-size:14px; cursor:pointer; padding:2px 4px;">\u2715</button>
      </div>
    </div>
    <div style="padding:8px 12px; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; gap:6px; background:#0b1120;">
      <input type="text" id="compactManualSelector" placeholder="Testar Seletor CSS (ex: button.btn)" style="flex:1; background:#090d16; border:1px solid #334155; border-radius:4px; color:#f8fafc; font-size:11px; padding:4px 8px; outline:none;" />
      <button type="button" id="btnCompactTestSelector" style="background:#1e293b; border:1px solid #334155; color:#38bdf8; border-radius:4px; padding:4px 8px; font-size:11px; font-weight:600; cursor:pointer;">Testar</button>
    </div>
    ${bodyHtml}
  `;
    win.querySelectorAll(".btn-copy-val").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const val = btn.getAttribute("data-val");
        if (val) {
          copyTextToClipboard(val);
          const oldText = btn.textContent;
          btn.textContent = "\u2713 Copiado";
          btn.style.borderColor = "#10b981";
          btn.style.color = "#10b981";
          setTimeout(() => {
            btn.textContent = oldText;
            btn.style.borderColor = "#334155";
            btn.style.color = "#f8fafc";
          }, 1200);
        }
      });
    });
    win.querySelector("#btnCompactPickNew")?.addEventListener("click", () => {
      startElementPickerMode();
    });
    win.querySelector("#btnCompactClose")?.addEventListener("click", () => {
      closeCompactAnalyzerOnPage();
    });
    const testBtn = win.querySelector("#btnCompactTestSelector");
    const testInput = win.querySelector("#compactManualSelector");
    const runTest = () => {
      const q = testInput?.value.trim();
      if (!q)
        return;
      try {
        const matched = document.querySelectorAll(q);
        if (matched.length === 0) {
          alert("Nenhum elemento encontrado na p\xE1gina para o seletor: " + q);
          return;
        }
        const first = matched[0];
        first.scrollIntoView({ behavior: "smooth", block: "center" });
        highlightSelectedElement(first);
        const newAnalysis = analyzeElementNodeHierarchical(first);
        showCompactAnalyzerOnPage(newAnalysis, first);
      } catch (err) {
        alert("Seletor inv\xE1lido: " + err.message);
      }
    };
    testBtn?.addEventListener("click", runTest);
    testInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter")
        runTest();
    });
    const dragHandle = win.querySelector("#compactAnalyzerHeader");
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initLeft = 0;
    let initTop = 0;
    dragHandle.addEventListener("mousedown", (e) => {
      if (e.target.tagName === "BUTTON" || e.target.closest("button") || e.target.tagName === "INPUT")
        return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = win.getBoundingClientRect();
      initLeft = rect.left;
      initTop = rect.top;
      win.style.right = "auto";
      win.style.left = `${initLeft}px`;
      win.style.top = `${initTop}px`;
      dragHandle.style.cursor = "grabbing";
      e.stopPropagation();
    });
    const onDrag = (e) => {
      if (!isDragging)
        return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      win.style.left = `${Math.max(8, Math.min(window.innerWidth - win.offsetWidth - 8, initLeft + dx))}px`;
      win.style.top = `${Math.max(8, Math.min(window.innerHeight - win.offsetHeight - 8, initTop + dy))}px`;
    };
    const onDragStop = () => {
      if (!isDragging)
        return;
      isDragging = false;
      dragHandle.style.cursor = "grab";
    };
    window.addEventListener("mousemove", onDrag, true);
    window.addEventListener("mouseup", onDragStop, true);
  }
  function startElementPickerMode() {
    stopElementPickerCrosshair();
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
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 600;
    font-family: system-ui, sans-serif;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.7);
    z-index: 2147483647;
    user-select: none;
  `;
    banner.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;">
      <span style="color: #818cf8; font-weight:700;">\u{1F3AF} Clique no elemento desejado</span>
    </div>
    <span id="pickerTagPreview" style="font-size: 11px; background: #1e293b; padding: 2px 8px; border-radius: 4px; font-family: monospace; color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.2);">nenhum</span>
    <button type="button" id="btnCancelPicker" style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171; border-radius: 4px; padding: 3px 8px; font-size: 11px; font-weight: 600; cursor: pointer;">Cancelar (Esc)</button>
  `;
    document.body.appendChild(overlay);
    document.body.appendChild(highlight);
    document.body.appendChild(banner);
    pickerOverlayEl = overlay;
    pickerHighlightEl = highlight;
    pickerInfoBannerEl = banner;
    const updateTargetHighlight = (target) => {
      if (!target || target === overlay || target === highlight || target === banner || banner.contains(target)) {
        return;
      }
      const compactWin = document.getElementById("webautomations-compact-analyzer");
      if (compactWin && (target === compactWin || compactWin.contains(target))) {
        return;
      }
      hoveredTargetEl = target;
      const rect = target.getBoundingClientRect();
      highlight.style.display = "block";
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
    const onMouseMove = (e) => {
      highlight.style.display = "none";
      const target = document.elementFromPoint(e.clientX, e.clientY);
      highlight.style.display = "block";
      if (target) {
        updateTargetHighlight(target);
      }
    };
    const confirmPick = () => {
      if (hoveredTargetEl) {
        const targetEl = hoveredTargetEl;
        const analysis = analyzeElementNodeHierarchical(targetEl);
        const chosenSelector = analysis.target.selector;
        chrome.runtime.sendMessage({
          action: "ELEMENT_PICKED_EVENT",
          payload: {
            selector: chosenSelector,
            analysis
          }
        });
        stopElementPickerCrosshair();
        highlightSelectedElement(targetEl);
        showCompactAnalyzerOnPage(analysis, targetEl);
      }
    };
    const onClick = (e) => {
      const compactWin = document.getElementById("webautomations-compact-analyzer");
      if (compactWin && e.target && compactWin.contains(e.target)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      confirmPick();
    };
    const handlePickerKey = (key) => {
      if (key === "Escape") {
        stopElementPickerCrosshair();
      } else if (key === "Enter" || key === " ") {
        confirmPick();
      } else if (key === "ArrowUp") {
        if (hoveredTargetEl?.parentElement && hoveredTargetEl.parentElement !== document.documentElement) {
          updateTargetHighlight(hoveredTargetEl.parentElement);
        }
      } else if (key === "ArrowDown") {
        if (hoveredTargetEl?.firstElementChild) {
          updateTargetHighlight(hoveredTargetEl.firstElementChild);
        }
      } else if (key === "ArrowRight") {
        if (hoveredTargetEl?.nextElementSibling) {
          updateTargetHighlight(hoveredTargetEl.nextElementSibling);
        }
      } else if (key === "ArrowLeft") {
        if (hoveredTargetEl?.previousElementSibling) {
          updateTargetHighlight(hoveredTargetEl.previousElementSibling);
        }
      }
    };
    window.__webautomations_picker_handle_key = handlePickerKey;
    const onKeyDown = (e) => {
      handlePickerKey(e.key);
    };
    banner.querySelector("#btnCancelPicker")?.addEventListener("click", stopElementPickerCrosshair);
    window.addEventListener("mousemove", onMouseMove, true);
    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKeyDown, true);
    window.__webautomations_picker_cleanup = () => {
      window.removeEventListener("mousemove", onMouseMove, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKeyDown, true);
      delete window.__webautomations_picker_handle_key;
    };
    try {
      chrome.runtime.sendMessage({ action: "PICKER_STATUS_CHANGED", payload: { active: true } });
    } catch {
    }
  }
  function stopElementPickerCrosshair() {
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
    try {
      chrome.runtime.sendMessage({ action: "PICKER_STATUS_CHANGED", payload: { active: false } });
    } catch {
    }
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
