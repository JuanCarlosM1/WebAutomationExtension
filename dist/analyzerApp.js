// src/editor/modules/dialogUtils.ts
var DialogMenu = class {
  /**
   * Exibe um menu de confirmação assíncrono (substituto de confirm)
   */
  static confirm(options) {
    const opts = typeof options === "string" ? { message: options } : options;
    return new Promise((resolve) => {
      this.closeExisting();
      const backdrop = document.createElement("div");
      backdrop.className = "flow-dialog-backdrop";
      backdrop.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(4, 7, 15, 0.78);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2147483647;
        padding: 16px;
        animation: dialogFadeIn 0.15s ease-out;
        font-family: var(--font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
      `;
      const title = opts.title || "Confirma\xE7\xE3o Necess\xE1ria";
      const confirmText = opts.confirmText || "Confirmar";
      const cancelText = opts.cancelText || "Cancelar";
      const isDanger = opts.isDanger !== false;
      const card = document.createElement("div");
      card.className = "flow-dialog-card";
      card.style.cssText = `
        background: #0f172a;
        border: 1px solid ${isDanger ? "#ef4444" : "#3b82f6"};
        border-radius: 12px;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.75), 0 0 25px ${isDanger ? "rgba(239, 68, 68, 0.2)" : "rgba(59, 130, 246, 0.2)"};
        max-width: 440px;
        width: 100%;
        overflow: hidden;
        animation: dialogScaleIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
      `;
      card.innerHTML = `
        <div style="padding: 14px 18px; border-bottom: 1px solid #1e293b; background: #131d35; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 16px;">${isDanger ? "\u26A0\uFE0F" : "\u2753"}</span>
          <h3 style="margin: 0; font-size: 13px; font-weight: 700; color: #f8fafc; flex: 1;">${title}</h3>
        </div>
        <div style="padding: 18px; font-size: 12px; line-height: 1.5; color: #cbd5e1;">
          ${opts.message}
        </div>
        <div style="padding: 12px 18px; border-top: 1px solid #1e293b; background: #0b1120; display: flex; justify-content: flex-end; gap: 8px;">
          <button type="button" id="dialogBtnCancel" style="
            background: #1e293b; color: #cbd5e1; border: 1px solid #334155; border-radius: 6px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s;
          ">${cancelText}</button>
          <button type="button" id="dialogBtnConfirm" style="
            background: ${isDanger ? "#ef4444" : "#3b82f6"}; color: white; border: none; border-radius: 6px; padding: 7px 16px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s;
          ">${confirmText}</button>
        </div>
      `;
      backdrop.appendChild(card);
      document.body.appendChild(backdrop);
      const btnCancel = card.querySelector("#dialogBtnCancel");
      const btnConfirm = card.querySelector("#dialogBtnConfirm");
      const cleanup = (result) => {
        window.removeEventListener("keydown", onKey);
        backdrop.remove();
        resolve(result);
      };
      const onKey = (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          cleanup(false);
        } else if (e.key === "Enter") {
          e.preventDefault();
          cleanup(true);
        }
      };
      btnCancel.addEventListener("click", () => cleanup(false));
      btnConfirm.addEventListener("click", () => cleanup(true));
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop)
          cleanup(false);
      });
      window.addEventListener("keydown", onKey);
      btnConfirm.focus();
    });
  }
  /**
   * Exibe um menu de alerta assíncrono (substituto de alert)
   */
  static alert(options) {
    const opts = typeof options === "string" ? { message: options } : options;
    return new Promise((resolve) => {
      this.closeExisting();
      const backdrop = document.createElement("div");
      backdrop.className = "flow-dialog-backdrop";
      backdrop.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(4, 7, 15, 0.78);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2147483647;
        padding: 16px;
        animation: dialogFadeIn 0.15s ease-out;
        font-family: var(--font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
      `;
      const type = opts.type || "info";
      let icon = "\u2139\uFE0F";
      let borderColor = "#3b82f6";
      if (type === "error") {
        icon = "\u274C";
        borderColor = "#ef4444";
      } else if (type === "warning") {
        icon = "\u26A0\uFE0F";
        borderColor = "#f59e0b";
      } else if (type === "success") {
        icon = "\u2705";
        borderColor = "#10b981";
      }
      const title = opts.title || (type === "error" ? "Aten\xE7\xE3o / Erro" : type === "warning" ? "Aviso" : "Informa\xE7\xE3o");
      const confirmText = opts.confirmText || "Entendido";
      const card = document.createElement("div");
      card.className = "flow-dialog-card";
      card.style.cssText = `
        background: #0f172a;
        border: 1px solid ${borderColor};
        border-radius: 12px;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.75), 0 0 25px ${borderColor}33;
        max-width: 440px;
        width: 100%;
        overflow: hidden;
        animation: dialogScaleIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
      `;
      card.innerHTML = `
        <div style="padding: 14px 18px; border-bottom: 1px solid #1e293b; background: #131d35; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 16px;">${icon}</span>
          <h3 style="margin: 0; font-size: 13px; font-weight: 700; color: #f8fafc; flex: 1;">${title}</h3>
        </div>
        <div style="padding: 18px; font-size: 12px; line-height: 1.5; color: #cbd5e1; white-space: pre-line;">
          ${opts.message}
        </div>
        <div style="padding: 12px 18px; border-top: 1px solid #1e293b; background: #0b1120; display: flex; justify-content: flex-end;">
          <button type="button" id="dialogBtnOk" style="
            background: #3b82f6; color: white; border: none; border-radius: 6px; padding: 7px 20px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s;
          ">${confirmText}</button>
        </div>
      `;
      backdrop.appendChild(card);
      document.body.appendChild(backdrop);
      const btnOk = card.querySelector("#dialogBtnOk");
      const cleanup = () => {
        window.removeEventListener("keydown", onKey);
        backdrop.remove();
        resolve();
      };
      const onKey = (e) => {
        if (e.key === "Escape" || e.key === "Enter") {
          e.preventDefault();
          cleanup();
        }
      };
      btnOk.addEventListener("click", cleanup);
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop)
          cleanup();
      });
      window.addEventListener("keydown", onKey);
      btnOk.focus();
    });
  }
  /**
   * Exibe um menu com campo de entrada de texto (substituto de prompt)
   */
  static prompt(options) {
    const opts = typeof options === "string" ? { message: options } : options;
    return new Promise((resolve) => {
      this.closeExisting();
      const backdrop = document.createElement("div");
      backdrop.className = "flow-dialog-backdrop";
      backdrop.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(4, 7, 15, 0.78);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2147483647;
        padding: 16px;
        animation: dialogFadeIn 0.15s ease-out;
        font-family: var(--font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
      `;
      const title = opts.title || "Entrada de Dados";
      const confirmText = opts.confirmText || "Salvar";
      const cancelText = opts.cancelText || "Cancelar";
      const defaultValue = opts.defaultValue || "";
      const placeholder = opts.placeholder || "";
      const card = document.createElement("div");
      card.className = "flow-dialog-card";
      card.style.cssText = `
        background: #0f172a;
        border: 1px solid #3b82f6;
        border-radius: 12px;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.75), 0 0 25px rgba(59, 130, 246, 0.2);
        max-width: 440px;
        width: 100%;
        overflow: hidden;
        animation: dialogScaleIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
      `;
      card.innerHTML = `
        <div style="padding: 14px 18px; border-bottom: 1px solid #1e293b; background: #131d35; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 16px;">\u270F\uFE0F</span>
          <h3 style="margin: 0; font-size: 13px; font-weight: 700; color: #f8fafc; flex: 1;">${title}</h3>
        </div>
        <div style="padding: 18px; font-size: 12px; line-height: 1.5; color: #cbd5e1; display: flex; flex-direction: column; gap: 10px;">
          <span>${opts.message}</span>
          <input type="text" id="dialogPromptInput" value="${defaultValue}" placeholder="${placeholder}" style="
            width: 100%; box-sizing: border-box; padding: 8px 12px; font-size: 12px; background: #090d16; color: #f8fafc; border: 1px solid #334155; border-radius: 6px; outline: none; transition: border-color 0.15s;
          " />
        </div>
        <div style="padding: 12px 18px; border-top: 1px solid #1e293b; background: #0b1120; display: flex; justify-content: flex-end; gap: 8px;">
          <button type="button" id="dialogBtnCancel" style="
            background: #1e293b; color: #cbd5e1; border: 1px solid #334155; border-radius: 6px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s;
          ">${cancelText}</button>
          <button type="button" id="dialogBtnConfirm" style="
            background: #3b82f6; color: white; border: none; border-radius: 6px; padding: 7px 16px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s;
          ">${confirmText}</button>
        </div>
      `;
      backdrop.appendChild(card);
      document.body.appendChild(backdrop);
      const input = card.querySelector("#dialogPromptInput");
      const btnCancel = card.querySelector("#dialogBtnCancel");
      const btnConfirm = card.querySelector("#dialogBtnConfirm");
      input.focus();
      input.select();
      const cleanup = (val) => {
        window.removeEventListener("keydown", onKey);
        backdrop.remove();
        resolve(val);
      };
      const onKey = (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          cleanup(null);
        } else if (e.key === "Enter") {
          e.preventDefault();
          cleanup(input.value);
        }
      };
      btnCancel.addEventListener("click", () => cleanup(null));
      btnConfirm.addEventListener("click", () => cleanup(input.value));
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop)
          cleanup(null);
      });
      window.addEventListener("keydown", onKey);
    });
  }
  static closeExisting() {
    document.querySelectorAll(".flow-dialog-backdrop").forEach((el) => el.remove());
  }
};

// src/editor/modules/htmlElementAnalyzer.ts
var HtmlElementAnalyzer = class {
  static activeCallback;
  static modalBackdrop;
  static lastTargetTabId;
  static isPickerActive = false;
  /**
   * Abre o Inspetor/Analisador de HTML em aba exclusiva ou modal flutuante
   */
  static open(onSelectSelector) {
    if (onSelectSelector) {
      this.activeCallback = onSelectSelector;
    }
    this.renderModal();
  }
  /**
   * Abre o Analisador HTML em uma nova aba dedicada e exclusiva
   */
  static openInNewTab() {
    if (chrome.tabs?.create) {
      chrome.tabs.create({ url: chrome.runtime.getURL("analyzer.html") });
    } else {
      window.open("analyzer.html", "_blank");
    }
  }
  /**
   * Inicia o modo de seleção interativo na aba web ativa usando o content script
   */
  static async startLivePicker(onPicked) {
    if (onPicked) {
      this.activeCallback = onPicked;
    }
    if (!chrome.tabs) {
      const mockSelector = await DialogMenu.prompt({
        title: "Seletor CSS",
        message: "Digite o seletor CSS do elemento ou teste o analisador:",
        defaultValue: "#main-content",
        placeholder: "#meu-elemento"
      });
      if (mockSelector && this.activeCallback) {
        this.activeCallback(mockSelector);
      }
      return;
    }
    chrome.tabs.query({}, (tabs) => {
      const isWebTab = (t) => {
        const u = t.url || "";
        return u.startsWith("http://") || u.startsWith("https://") || u.startsWith("file://");
      };
      let targetTab = tabs.find((t) => t.active && isWebTab(t));
      if (!targetTab) {
        targetTab = tabs.filter((t) => isWebTab(t)).sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0];
      }
      if (!targetTab?.id) {
        this.renderModal();
        DialogMenu.alert({
          title: "Nenhuma P\xE1gina Web Encontrada",
          message: "Nenhuma aba com p\xE1gina web aberta (http/https/file) foi encontrada.\nPor favor, abra um site no navegador para selecionar elementos.",
          type: "warning"
        });
        return;
      }
      const targetTabId = targetTab.id;
      this.lastTargetTabId = targetTabId;
      this.isPickerActive = true;
      if (targetTab.windowId && chrome.windows?.update) {
        chrome.windows.update(targetTab.windowId, { focused: true });
      }
      chrome.tabs.update(targetTabId, { active: true }, () => {
        chrome.tabs.sendMessage(targetTabId, { action: "OPEN_HTML_ANALYZER", payload: { startPicker: true } }, (response) => {
          const err = chrome.runtime.lastError;
          if (err || !response?.success) {
            if (chrome.scripting?.executeScript) {
              chrome.scripting.executeScript(
                {
                  target: { tabId: targetTabId },
                  files: ["dist/contentDriver.js"]
                },
                () => {
                  if (chrome.runtime.lastError) {
                    return;
                  }
                  chrome.tabs.sendMessage(targetTabId, { action: "OPEN_HTML_ANALYZER", payload: { startPicker: true } }, () => {
                    void chrome.runtime.lastError;
                  });
                }
              );
            }
          }
        });
      });
    });
  }
  /**
   * Conecta o ouvinte para receber elementos capturados do Content Script e atalhos de teclado remotos
   */
  static initMessageListener() {
    if (!chrome.runtime?.onMessage)
      return;
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === "ELEMENT_PICKED_EVENT") {
        this.isPickerActive = false;
        const { selector, analysis } = message.payload || {};
        if (selector) {
          if (this.activeCallback) {
            this.activeCallback(selector);
          }
          this.showAnalysisModal(analysis || { target: { selector, tagName: "ELEMENT", classes: [] }, children: [] });
        }
      } else if (message.action === "PICKER_STATUS_CHANGED") {
        this.isPickerActive = !!message.payload?.active;
      }
    });
    window.addEventListener("keydown", (e) => {
      if (!this.isPickerActive && e.key !== "Escape")
        return;
      const keysToRelay = ["Escape", "Enter", " ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (keysToRelay.includes(e.key)) {
        if (this.lastTargetTabId && chrome.tabs?.sendMessage) {
          chrome.tabs.sendMessage(
            this.lastTargetTabId,
            { action: "FORWARD_PICKER_KEY", payload: { key: e.key, code: e.code } },
            () => void chrome.runtime.lastError
          );
        }
        if (e.key === "Escape") {
          this.isPickerActive = false;
        }
      }
    }, true);
  }
  static panelPos;
  static renderModal() {
    if (this.modalBackdrop && document.body.contains(this.modalBackdrop))
      return;
    document.querySelectorAll(".html-analyzer-modal").forEach((el) => el.remove());
    const panel = document.createElement("div");
    panel.className = "html-analyzer-modal";
    const pos = this.panelPos || { left: Math.max(8, window.innerWidth - 388), top: 70 };
    panel.style.cssText = `
      position: fixed;
      left: ${pos.left}px; top: ${pos.top}px;
      width: 370px;
      max-height: 70vh;
      z-index: 100000;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 12px 30px rgba(0,0,0,0.6), 0 0 18px rgba(99,102,241,0.25);
      font-family: var(--font-sans, system-ui, sans-serif);
      overflow: hidden;
    `;
    panel.innerHTML = `
      <div id="analyzerDragHandle" title="Clique e arraste pela barra superior para mover" style="padding: 8px 12px; background: #131d35; border-bottom: 1px solid #1e293b; display: flex; align-items: center; justify-content: space-between; gap: 8px; user-select: none; cursor: grab;">
        <span style="font-size: 12px; font-weight: 700; color: #f8fafc; display: flex; align-items: center; gap: 6px;">
          <span>\u{1F50D}</span> Analisador HTML
        </span>
        <div style="display: flex; align-items: center; gap: 4px;">
          <button id="btnOpenInTabIcon" title="Abrir em Nova Aba Exclusiva" style="background: transparent; border: none; color: #94a3b8; font-size: 13px; cursor: pointer; padding: 2px 6px; border-radius: 4px; transition: color 0.15s;">\u29C9</button>
          <button id="btnCloseAnalyzer" title="Fechar e desativar" style="background: transparent; border: none; color: #94a3b8; font-size: 15px; cursor: pointer; padding: 0 4px; border-radius: 4px; transition: color 0.15s;">\u2715</button>
        </div>
      </div>
      <div id="analyzerBodyContent" style="padding: 8px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; gap: 6px;">
          <button type="button" id="btnPickFromWebPage" class="btn btn-primary" style="flex: 1; background: #3b82f6; border-color: #3b82f6; padding: 6px 10px; font-size: 11px; font-weight: 600; cursor: pointer;">\u{1F3AF} Ativar Mira na P\xE1gina</button>
          <button type="button" id="btnOpenDedicatedTab" class="btn btn-secondary" style="padding: 6px 10px; font-size: 11px; white-space: nowrap;">Aba Exclusiva</button>
        </div>
        <div style="display: flex; gap: 4px;">
          <input type="text" id="analyzerManualInput" placeholder="Seletor CSS (ex: #id, button.btn)" style="flex: 1; min-width: 0; padding: 5px 8px; font-size: 11px; background: #090d16; color: white; border: 1px solid #334155; border-radius: 6px;" />
          <button type="button" id="btnAnalyzeManual" class="btn btn-secondary" style="padding: 5px 10px; font-size: 11px; white-space: nowrap;">Analisar</button>
        </div>
        <div id="analyzerResultsContainer" style="display: flex; flex-direction: column; gap: 6px;">
          <div style="background: #090d16; border: 1px dashed #334155; border-radius: 6px; padding: 10px; text-align: center; color: #64748b; font-size: 11px;">
            Nenhum elemento analisado. Ative a mira ou digite um seletor.
          </div>
        </div>
      </div>
    `;
    panel.querySelector("#btnCloseAnalyzer")?.addEventListener("click", () => this.closeModal());
    panel.querySelector("#btnOpenInTabIcon")?.addEventListener("click", () => this.openInNewTab());
    panel.querySelector("#btnOpenDedicatedTab")?.addEventListener("click", () => this.openInNewTab());
    panel.querySelector("#btnPickFromWebPage")?.addEventListener("click", () => {
      this.startLivePicker();
    });
    const runManual = () => {
      const input = panel.querySelector("#analyzerManualInput")?.value.trim();
      if (!input)
        return;
      this.testAndShowLocalSelector(input);
    };
    panel.querySelector("#btnAnalyzeManual")?.addEventListener("click", runManual);
    panel.querySelector("#analyzerManualInput")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter")
        runManual();
    });
    const dragHandle = panel.querySelector("#analyzerDragHandle");
    if (dragHandle) {
      dragHandle.addEventListener("mousedown", (e) => {
        if (e.button !== 0)
          return;
        if (e.target.closest("button"))
          return;
        e.preventDefault();
        dragHandle.style.cursor = "grabbing";
        const rect = panel.getBoundingClientRect();
        const offX = e.clientX - rect.left;
        const offY = e.clientY - rect.top;
        const onMove = (me) => {
          const left = Math.max(0, Math.min(window.innerWidth - rect.width, me.clientX - offX));
          const top = Math.max(0, Math.min(window.innerHeight - 40, me.clientY - offY));
          panel.style.left = `${left}px`;
          panel.style.top = `${top}px`;
          this.panelPos = { left, top };
        };
        const onUp = () => {
          dragHandle.style.cursor = "grab";
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      });
    }
    document.body.appendChild(panel);
    this.modalBackdrop = panel;
  }
  static closeModal() {
    this.modalBackdrop?.remove();
    document.querySelectorAll(".html-analyzer-modal").forEach((el) => el.remove());
    this.modalBackdrop = void 0;
    this.isPickerActive = false;
    if (chrome.tabs?.query) {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((t) => {
          if (t.id && t.url && /^(https?|file):/.test(t.url)) {
            chrome.tabs.sendMessage(t.id, { action: "STOP_ELEMENT_PICKER" }, () => void chrome.runtime.lastError);
          }
        });
      });
    }
  }
  /**
   * Exibe o modal com o resultado detalhado da análise (Pai, Alvo e Filhos)
   */
  static showAnalysisModal(analysis) {
    this.renderModal();
    const resultsContainer = document.getElementById("analyzerResultsContainer");
    if (!resultsContainer)
      return;
    resultsContainer.innerHTML = "";
    if (analysis.parent) {
      resultsContainer.appendChild(this.createNodeCard("Elemento Pai (Container)", analysis.parent, "#64748b", "pai"));
    }
    resultsContainer.appendChild(this.createNodeCard("Elemento Selecionado (Alvo Principal)", analysis.target, "#6366f1", "alvo", true));
    if (analysis.children && analysis.children.length > 0) {
      const childrenSection = document.createElement("div");
      childrenSection.style.cssText = "display: flex; flex-direction: column; gap: 8px;";
      childrenSection.innerHTML = `<label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Elementos Filhos (${analysis.children.length}):</label>`;
      analysis.children.slice(0, 6).forEach((child, idx) => {
        childrenSection.appendChild(this.createNodeCard(`Filho #${idx + 1} &lt;${child.tagName.toLowerCase()}&gt;`, child, "#06b6d4", "filho"));
      });
      resultsContainer.appendChild(childrenSection);
    }
  }
  static createNodeCard(title, node, borderColor, type, isPrimary = false) {
    const card = document.createElement("div");
    card.style.cssText = `
      background: ${isPrimary ? "#111c38" : "#090d16"};
      border: 1px solid ${borderColor};
      border-radius: 8px;
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      position: relative;
    `;
    const tagBadge = `&lt;<span style="color: #60a5fa; font-weight: bold;">${node.tagName.toLowerCase()}</span>&gt;`;
    const idSnippet = node.id ? `<span style="color: #f59e0b; font-family: monospace;">#${node.id}</span>` : "";
    const classSnippet = node.classes.length > 0 ? `<span style="color: #10b981; font-family: monospace;">.${node.classes.slice(0, 2).join(".")}</span>` : "";
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; min-width: 0;">
          <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; background: ${borderColor}25; color: ${borderColor}; border: 1px solid ${borderColor}50; padding: 2px 6px; border-radius: 4px;">${type}</span>
          <span style="font-size: 12px; font-weight: 600; color: #f8fafc;">${title}</span>
          <span style="font-size: 11px; font-family: monospace; color: #94a3b8;">${tagBadge} ${idSnippet} ${classSnippet}</span>
        </div>
        <button type="button" class="btn-copy-selector btn btn-secondary" style="padding: 4px 10px; font-size: 11px; display: flex; align-items: center; gap: 4px; cursor: pointer;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span>Usar / Copiar</span>
        </button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr; gap: 4px; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px;">
        <div style="display: flex; flex-direction: column; gap: 2px; overflow: hidden;">
          <span style="font-size: 10px; color: #94a3b8; font-weight: 700;">SELETOR CSS OTIMIZADO:</span>
          <code style="font-size: 11px; color: #38bdf8; font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${node.selector || "tag"}</code>
        </div>
        <div style="display: flex; flex-direction: column; gap: 2px; overflow: hidden;">
          <span style="font-size: 10px; color: #94a3b8; font-weight: 700;">XPATH:</span>
          <code style="font-size: 11px; color: #fbbf24; font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${node.xpath || "//tag"}</code>
        </div>
      </div>
    `;
    const copyBtn = card.querySelector(".btn-copy-selector");
    copyBtn?.addEventListener("click", () => {
      const chosenSelector = node.selector;
      if (this.activeCallback) {
        this.activeCallback(chosenSelector);
      }
      navigator.clipboard?.writeText(chosenSelector);
      copyBtn.innerHTML = "<span>\u2713 Copiado!</span>";
      setTimeout(() => {
        copyBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span>Usar / Copiar</span>
        `;
      }, 1500);
    });
    return card;
  }
  static testAndShowLocalSelector(rawInput) {
    const tagName = rawInput.startsWith("#") ? "DIV" : rawInput.split(/[\.#\[]/)[0]?.toUpperCase() || "ELEMENT";
    const hasId = rawInput.includes("#");
    const idVal = hasId ? rawInput.split("#")[1]?.split(/[\.\[\s]/)[0] : void 0;
    const analysis = {
      target: {
        tagName,
        id: idVal,
        classes: rawInput.includes(".") ? rawInput.split(".").slice(1).map((c) => c.split(/[\#\[\s]/)[0]) : [],
        selector: rawInput,
        xpath: idVal ? `//*[@id="${idVal}"]` : `//${tagName.toLowerCase()}`,
        attributes: {}
      },
      children: []
    };
    this.showAnalysisModal(analysis);
  }
};

// src/editor/modules/editorUtils.ts
var lastToastMessages = /* @__PURE__ */ new Map();
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container)
    return;
  const now = Date.now();
  const lastTime = lastToastMessages.get(message);
  if (lastTime && now - lastTime < 1500) {
    return;
  }
  lastToastMessages.set(message, now);
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.title = "Clique para fechar";
  toast.textContent = message;
  const dismissToast = () => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.15s ease-out";
    setTimeout(() => toast.remove(), 150);
  };
  toast.addEventListener("click", dismissToast);
  container.appendChild(toast);
  setTimeout(dismissToast, 2200);
}

// src/analyzer/analyzerApp.ts
document.addEventListener("DOMContentLoaded", () => {
  const targetPageTitle = document.getElementById("targetPageTitle");
  const targetPageUrl = document.getElementById("targetPageUrl");
  const btnRefreshTargetTab = document.getElementById("btnRefreshTargetTab");
  const btnTriggerLivePicker = document.getElementById("btnTriggerLivePicker");
  const manualSelectorInput = document.getElementById("manualSelectorInput");
  const btnAnalyzeManualDirect = document.getElementById("btnAnalyzeManualDirect");
  const analyzerResultsContainer = document.getElementById("analyzerResultsContainer");
  const btnOpenFloatingWindow = document.getElementById("btnOpenFloatingWindow");
  const btnOpenStudioFromAnalyzer = document.getElementById("btnOpenStudioFromAnalyzer");
  HtmlElementAnalyzer.initMessageListener();
  btnOpenStudioFromAnalyzer?.addEventListener("click", () => {
    if (chrome.tabs?.create) {
      chrome.tabs.create({ url: chrome.runtime.getURL("editor.html") });
    } else {
      window.open("editor.html", "_blank");
    }
  });
  btnOpenFloatingWindow?.addEventListener("click", () => {
    HtmlElementAnalyzer.open((chosenSelector) => {
      showToast(`Seletor capturado: ${chosenSelector}`, "success");
    });
  });
  function refreshTargetTabInfo() {
    if (!chrome.tabs?.query) {
      if (targetPageTitle)
        targetPageTitle.textContent = "Ambiente Local (Sem API chrome.tabs)";
      if (targetPageUrl)
        targetPageUrl.textContent = window.location.href;
      return;
    }
    chrome.tabs.query({}, (tabs) => {
      const isWebTab = (t) => {
        const u = t.url || "";
        return u.startsWith("http://") || u.startsWith("https://") || u.startsWith("file://");
      };
      const webTabs = tabs.filter(isWebTab);
      const target = webTabs.sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0];
      if (target) {
        HtmlElementAnalyzer.lastTargetTabId = target.id;
        if (targetPageTitle)
          targetPageTitle.textContent = target.title || "P\xE1gina Web Sem T\xEDtulo";
        if (targetPageUrl)
          targetPageUrl.textContent = target.url || "";
      } else {
        if (targetPageTitle)
          targetPageTitle.textContent = "Nenhuma aba web aberta";
        if (targetPageUrl)
          targetPageUrl.textContent = "Abra um site no navegador para inspecionar";
      }
    });
  }
  btnRefreshTargetTab?.addEventListener("click", () => {
    refreshTargetTabInfo();
    showToast("Aba alvo atualizada.", "info");
  });
  refreshTargetTabInfo();
  btnTriggerLivePicker?.addEventListener("click", () => {
    HtmlElementAnalyzer.startLivePicker((pickedSelector) => {
      if (manualSelectorInput)
        manualSelectorInput.value = pickedSelector;
      showToast(`Elemento selecionado: ${pickedSelector}`, "success");
    });
  });
  const runManualAnalysis = () => {
    const selector = manualSelectorInput?.value.trim();
    if (!selector) {
      showToast("Digite um seletor para analisar.", "warning");
      return;
    }
    const tabId = HtmlElementAnalyzer.lastTargetTabId;
    if (tabId && chrome.tabs?.sendMessage) {
      chrome.tabs.sendMessage(tabId, {
        action: "EXTRACT_DATA",
        payload: { selector, selectorType: "css", extractType: "innerText" }
      }, (res) => {
        if (res?.success) {
          renderAnalysisResultInPage({
            target: {
              selector,
              tagName: selector.split(/[.#[\s]/)[0] || "ELEMENT",
              classes: [],
              xpath: `//*[contains(@class, '${selector}')]`,
              textSnippet: res.data || "(conte\xFAdo extra\xEDdo)",
              attributes: {},
              isTarget: true
            },
            children: []
          });
          showToast("Elemento localizado na p\xE1gina!", "success");
        } else {
          renderAnalysisResultInPage({
            target: {
              selector,
              tagName: "SELETOR",
              classes: [],
              xpath: `//${selector}`,
              textSnippet: "Seletor formatado para uso no fluxo",
              attributes: {},
              isTarget: true
            },
            children: []
          });
        }
      });
    } else {
      renderAnalysisResultInPage({
        target: {
          selector,
          tagName: "SELETOR",
          classes: [],
          xpath: `//${selector}`,
          textSnippet: "Seletor validado",
          attributes: {},
          isTarget: true
        },
        children: []
      });
    }
  };
  btnAnalyzeManualDirect?.addEventListener("click", runManualAnalysis);
  manualSelectorInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
      runManualAnalysis();
  });
  chrome.runtime?.onMessage?.addListener((message) => {
    if (message.action === "ELEMENT_PICKED_EVENT") {
      const { selector, analysis } = message.payload || {};
      if (manualSelectorInput && selector) {
        manualSelectorInput.value = selector;
      }
      if (analysis) {
        renderAnalysisResultInPage(analysis);
      }
    }
  });
  function renderAnalysisResultInPage(analysis) {
    if (!analyzerResultsContainer)
      return;
    analyzerResultsContainer.innerHTML = "";
    if (analysis.parent) {
      analyzerResultsContainer.appendChild(createResultCard("Elemento Pai (Container)", analysis.parent, "#64748b"));
    }
    analyzerResultsContainer.appendChild(createResultCard("Elemento Selecionado (Alvo Principal)", analysis.target, "#6366f1", true));
    if (analysis.children && analysis.children.length > 0) {
      const childrenWrapper = document.createElement("div");
      childrenWrapper.style.cssText = "background: #111827; border: 1px solid #1f293d; border-radius: 12px; padding: 20px;";
      childrenWrapper.innerHTML = `
        <h3 style="margin: 0 0 14px; font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">
          Elementos Filhos (${analysis.children.length})
        </h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${analysis.children.map((child, idx) => `
            <div style="background: #090d16; border: 1px solid #243049; border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
              <div>
                <span style="font-weight: 700; color: #38bdf8; font-family: monospace;">&lt;${child.tagName.toLowerCase()}&gt;</span>
                <span style="font-size: 12px; color: #cbd5e1; margin-left: 8px; font-family: monospace;">${child.selector}</span>
              </div>
              <button class="btn btn-secondary btn-copy-child" data-sel="${child.selector}" style="font-size: 11px; padding: 4px 10px;">Copiar</button>
            </div>
          `).join("")}
        </div>
      `;
      childrenWrapper.querySelectorAll(".btn-copy-child").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const sel = e.currentTarget.getAttribute("data-sel");
          if (sel) {
            navigator.clipboard.writeText(sel);
            showToast("Seletor do filho copiado!", "success");
          }
        });
      });
      analyzerResultsContainer.appendChild(childrenWrapper);
    }
  }
  function createResultCard(title, node, accentColor, isMain = false) {
    const card = document.createElement("div");
    card.style.cssText = `
      background: #111827;
      border: 1px solid ${isMain ? accentColor : "#1f293d"};
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    `;
    const tagStr = `<${node.tagName.toLowerCase()}${node.id ? ` id="${node.id}"` : ""}>`;
    const textSnippet = node.textSnippet ? `"${node.textSnippet.slice(0, 100)}"` : "(sem texto interno)";
    card.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e293b; padding-bottom: 12px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 14px; font-weight: 700; color: ${accentColor};">${title}</span>
          <span style="background: #1e293b; color: #38bdf8; font-family: monospace; font-size: 11px; padding: 2px 8px; border-radius: 4px;">${tagStr}</span>
        </div>
        ${isMain ? '<span style="background: rgba(99, 102, 241, 0.2); color: #818cf8; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">ALVO PRINCIPAL</span>' : ""}
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        <!-- Seletor CSS -->
        <div>
          <label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Seletor CSS Recomendado:</label>
          <div style="display: flex; gap: 8px; margin-top: 4px;">
            <input type="text" readonly value="${node.selector}" style="flex: 1; background: #090d16; border: 1px solid #243049; border-radius: 6px; padding: 8px 12px; font-family: monospace; font-size: 12px; color: #f8fafc;" />
            <button class="btn btn-primary btn-copy-css" style="padding: 6px 14px; font-size: 12px;">Copiar CSS</button>
          </div>
        </div>

        <!-- Seletor XPath -->
        <div>
          <label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">XPath:</label>
          <div style="display: flex; gap: 8px; margin-top: 4px;">
            <input type="text" readonly value="${node.xpath || `//${node.tagName.toLowerCase()}`}" style="flex: 1; background: #090d16; border: 1px solid #243049; border-radius: 6px; padding: 8px 12px; font-family: monospace; font-size: 12px; color: #f8fafc;" />
            <button class="btn btn-secondary btn-copy-xpath" style="padding: 6px 14px; font-size: 12px;">Copiar XPath</button>
          </div>
        </div>

        <!-- Texto Interno -->
        <div style="font-size: 12px; color: #cbd5e1; background: #090d16; border: 1px solid #1e293b; border-radius: 6px; padding: 8px 12px;">
          <span style="color: #64748b;">Texto:</span> <code>${textSnippet}</code>
        </div>
      </div>
    `;
    card.querySelector(".btn-copy-css")?.addEventListener("click", () => {
      navigator.clipboard.writeText(node.selector);
      showToast("Seletor CSS copiado para a \xE1rea de transfer\xEAncia!", "success");
    });
    card.querySelector(".btn-copy-xpath")?.addEventListener("click", () => {
      navigator.clipboard.writeText(node.xpath || `//${node.tagName.toLowerCase()}`);
      showToast("XPath copiado para a \xE1rea de transfer\xEAncia!", "success");
    });
    return card;
  }
});
//# sourceMappingURL=analyzerApp.js.map
