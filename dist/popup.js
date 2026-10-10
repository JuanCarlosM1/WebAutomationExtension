// src/popup/popup.ts
document.addEventListener("DOMContentLoaded", async () => {
  const btnOpenStudio = document.getElementById("btnOpenStudio");
  const automationsList = document.getElementById("automationsList");
  const mcpToggle = document.getElementById("mcpToggle");
  const mcpStatusText = document.getElementById("mcpStatusText");
  function openInNewWindow(targetUrl) {
    if (chrome.windows?.create) {
      chrome.windows.create({
        url: targetUrl,
        type: "popup",
        width: 1280,
        height: 820,
        focused: true
      }, () => {
        window.close();
      });
    } else if (chrome.tabs?.create) {
      chrome.tabs.create({ url: targetUrl }, () => {
        window.close();
      });
    } else {
      window.open(targetUrl);
    }
  }
  btnOpenStudio?.addEventListener("click", () => {
    const targetUrl = chrome.runtime.getURL ? chrome.runtime.getURL("editor.html") : "editor.html";
    openInNewWindow(targetUrl);
  });
  if (chrome.runtime?.sendMessage && mcpToggle && mcpStatusText) {
    chrome.runtime.sendMessage({ action: "GET_MCP_STATUS" }, (res) => {
      if (res?.success) {
        mcpToggle.checked = !!res.enabled;
        updateMcpStatusUI(res.enabled, res.connected, res.port);
      }
    });
    mcpToggle.addEventListener("change", () => {
      const enabled = mcpToggle.checked;
      chrome.runtime.sendMessage({
        action: "SET_MCP_CONFIG",
        payload: { enabled, port: 3001 }
      }, (res) => {
        if (res?.success) {
          updateMcpStatusUI(enabled, false, 3001);
        }
      });
    });
  }
  function updateMcpStatusUI(enabled, connected, port) {
    if (!mcpStatusText)
      return;
    if (!enabled) {
      mcpStatusText.textContent = "Desativada (Clique para conectar)";
      mcpStatusText.style.color = "#64748b";
    } else if (connected) {
      mcpStatusText.textContent = `\u{1F7E2} Conectado na porta ${port}`;
      mcpStatusText.style.color = "#10b981";
    } else {
      mcpStatusText.textContent = `\u{1F7E1} Aguardando servidor na porta ${port}...`;
      mcpStatusText.style.color = "#fbbf24";
    }
  }
  if (chrome.storage?.local && automationsList) {
    chrome.storage.local.get("web_automations", (data) => {
      const list = data.web_automations || [];
      if (list.length === 0)
        return;
      automationsList.innerHTML = "";
      list.forEach((auto) => {
        const item = document.createElement("div");
        item.className = "item";
        item.style.cssText = "display: flex; align-items: center; justify-content: space-between; gap: 8px;";
        item.innerHTML = `
          <div class="flow-link" style="cursor: pointer; flex: 1; min-width: 0;" title="Abrir fluxo &quot;${auto.metadata?.name || "Automa\xE7\xE3o"}&quot; no Visual Flow">
            <div class="flow-title" style="font-weight: 600; font-size: 12px; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.15s ease;">${auto.metadata?.name || "Automa\xE7\xE3o"}</div>
            <div style="font-size: 10px; color: #94a3b8; display: flex; align-items: center; gap: 4px; margin-top: 2px;">
              <span>${auto.nodes?.length || 0} blocos</span>
              <span>\u2022</span>
              <span style="color: #818cf8; font-weight: 600;">Abrir no est\xFAdio \u2197</span>
            </div>
          </div>
          <button class="btn-run" data-id="${auto.metadata?.id}" title="Executar imediatamente sem abrir o est\xFAdio">\u25B6 Rodar</button>
        `;
        item.querySelector(".flow-link")?.addEventListener("click", () => {
          const flowId = auto.metadata?.id;
          const targetUrl = chrome.runtime.getURL ? chrome.runtime.getURL(`editor.html?flowId=${encodeURIComponent(flowId)}`) : `editor.html?flowId=${encodeURIComponent(flowId)}`;
          openInNewWindow(targetUrl);
        });
        item.querySelector(".btn-run")?.addEventListener("click", (e) => {
          e.stopPropagation();
          const runBtn = item.querySelector(".btn-run");
          if (runBtn) {
            runBtn.textContent = "\u23F3 Rodando...";
            runBtn.disabled = true;
          }
          chrome.runtime.sendMessage({
            action: "EXECUTE_AUTOMATION",
            payload: { graph: auto }
          }, (res) => {
            if (runBtn) {
              runBtn.textContent = res?.success ? "\u2713 Conclu\xEDdo" : "\u274C Erro";
              setTimeout(() => {
                runBtn.textContent = "\u25B6 Rodar";
                runBtn.disabled = false;
              }, 2500);
            }
          });
        });
        automationsList.appendChild(item);
      });
    });
  }
});
//# sourceMappingURL=popup.js.map
