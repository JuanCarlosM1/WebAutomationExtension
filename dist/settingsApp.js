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

// src/settings/settingsApp.ts
document.addEventListener("DOMContentLoaded", async () => {
  const stackDirection = document.getElementById("stackDirection");
  const gapInput = document.getElementById("gapInput");
  const maxColumnsInput = document.getElementById("maxColumnsInput");
  const maxRowsInput = document.getElementById("maxRowsInput");
  const btnResetPositions = document.getElementById("btnResetPositions");
  const autoSaveInterval = document.getElementById("autoSaveInterval");
  const defaultEdgeType = document.getElementById("defaultEdgeType");
  const showMinimapDefault = document.getElementById("showMinimapDefault");
  const snapToGridDefault = document.getElementById("snapToGridDefault");
  const mcpEnabled = document.getElementById("mcpEnabled");
  const mcpPortInput = document.getElementById("mcpPortInput");
  const storageSummaryText = document.getElementById("storageSummaryText");
  const btnExportAllData = document.getElementById("btnExportAllData");
  const btnImportAllData = document.getElementById("btnImportAllData");
  const backupFileInput = document.getElementById("backupFileInput");
  const btnSaveAllSettings = document.getElementById("btnSaveAllSettings");
  const btnOpenStudioFromSettings = document.getElementById("btnOpenStudioFromSettings");
  btnOpenStudioFromSettings?.addEventListener("click", () => {
    if (chrome.tabs?.create) {
      chrome.tabs.create({ url: chrome.runtime.getURL("editor.html?tab=settings") });
    } else {
      window.open("editor.html?tab=settings", "_blank");
    }
  });
  if (chrome.storage?.local) {
    chrome.storage.local.get(
      [
        "floating_buttons_layout_settings",
        "visual_studio_preferences",
        "mcp_config",
        "web_automations"
      ],
      (data) => {
        const layout = data.floating_buttons_layout_settings || {
          stackDirection: "vertical",
          gap: 10,
          maxColumns: 3,
          maxRows: 5
        };
        if (stackDirection)
          stackDirection.value = layout.stackDirection || "vertical";
        if (gapInput)
          gapInput.value = String(layout.gap ?? 10);
        if (maxColumnsInput)
          maxColumnsInput.value = String(layout.maxColumns ?? 3);
        if (maxRowsInput)
          maxRowsInput.value = String(layout.maxRows ?? 5);
        const prefs = data.visual_studio_preferences || {
          autoSave: "always",
          edgeType: "bezier",
          minimap: true,
          snapGrid: true
        };
        if (autoSaveInterval)
          autoSaveInterval.value = prefs.autoSave || "always";
        if (defaultEdgeType)
          defaultEdgeType.value = prefs.edgeType || "bezier";
        if (showMinimapDefault)
          showMinimapDefault.checked = prefs.minimap !== false;
        if (snapToGridDefault)
          snapToGridDefault.checked = prefs.snapGrid !== false;
        const mcp = data.mcp_config || { enabled: false, port: 3001 };
        if (mcpEnabled)
          mcpEnabled.checked = !!mcp.enabled;
        if (mcpPortInput)
          mcpPortInput.value = String(mcp.port || 3001);
        const automations = data.web_automations || [];
        if (storageSummaryText) {
          storageSummaryText.textContent = `${automations.length} fluxo(s) de automa\xE7\xE3o armazenados localmente.`;
        }
      }
    );
  }
  btnResetPositions?.addEventListener("click", async () => {
    const confirmed = await DialogMenu.confirm({
      title: "Restaurar Posi\xE7\xF5es",
      message: "Deseja redefinir as posi\xE7\xF5es manuais de todos os bot\xF5es flutuantes arrastados em p\xE1ginas da web?",
      confirmText: "Restaurar",
      isDanger: false
    });
    if (confirmed && chrome.storage?.local) {
      await chrome.storage.local.remove("floating_buttons_dragged_positions");
      showToast("Posi\xE7\xF5es dos bot\xF5es flutuantes redefinidas com sucesso!", "success");
    }
  });
  btnSaveAllSettings?.addEventListener("click", async () => {
    const layoutConfig = {
      stackDirection: stackDirection?.value || "vertical",
      gap: Number(gapInput?.value) || 10,
      maxColumns: Number(maxColumnsInput?.value) || 3,
      maxRows: Number(maxRowsInput?.value) || 5
    };
    const studioPrefs = {
      autoSave: autoSaveInterval?.value || "always",
      edgeType: defaultEdgeType?.value || "bezier",
      minimap: showMinimapDefault?.checked ?? true,
      snapGrid: snapToGridDefault?.checked ?? true
    };
    const mcpConfig = {
      enabled: mcpEnabled?.checked ?? false,
      port: Number(mcpPortInput?.value) || 3001
    };
    if (chrome.storage?.local) {
      await chrome.storage.local.set({
        floating_buttons_layout_settings: layoutConfig,
        visual_studio_preferences: studioPrefs,
        mcp_config: mcpConfig
      });
      if (chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({
          action: "SET_MCP_CONFIG",
          payload: mcpConfig
        });
      }
      showToast("Configura\xE7\xF5es salvas e sincronizadas com sucesso!", "success");
    }
  });
  btnExportAllData?.addEventListener("click", () => {
    if (!chrome.storage?.local)
      return;
    chrome.storage.local.get(null, (allData) => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `webautomations_backup_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Backup exportado com sucesso!", "success");
    });
  });
  btnImportAllData?.addEventListener("click", () => {
    backupFileInput?.click();
  });
  backupFileInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file)
      return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const imported = JSON.parse(evt.target?.result);
        if (!imported || typeof imported !== "object") {
          throw new Error("Conte\xFAdo do arquivo inv\xE1lido");
        }
        const confirmed = await DialogMenu.confirm({
          title: "Restaurar Backup Completo",
          message: "A restaura\xE7\xE3o ir\xE1 mesclar e atualizar os dados da extens\xE3o com o arquivo selecionado. Deseja continuar?",
          confirmText: "Restaurar Dados",
          isDanger: true
        });
        if (confirmed && chrome.storage?.local) {
          await chrome.storage.local.set(imported);
          showToast("Backup restaurado com sucesso! Recarregando dados...", "success");
          setTimeout(() => window.location.reload(), 1200);
        }
      } catch (err) {
        DialogMenu.alert({
          title: "Erro na Restaura\xE7\xE3o",
          message: "Falha ao processar o arquivo de backup: " + err.message,
          type: "error"
        });
      }
    };
    reader.readAsText(file);
  });
});
//# sourceMappingURL=settingsApp.js.map
