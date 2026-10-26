/**
 * Background Service Worker da Extensão
 * Gerencia a fila de execuções, conexão MCP e persistência de automações
 */

import { ExecutionEngine } from '../../../BibliotecaDeDev/src/engine/ExecutionEngine';
import { registerAllDefaultHandlers } from '../../../BibliotecaDeDev/src/engine/DefaultHandlers';
import { WebAutomationGraph, getActiveTriggers, getTriggerUrlPatterns } from '../../../BibliotecaDeDev/src/types/schema';
import { ChromeBrowserDriver } from '../driver/ChromeBrowserDriver';
import { ExecutionContext } from '../../../BibliotecaDeDev/src/engine/ExecutionContext';
import { StateManager } from '../../../BibliotecaDeDev/src/engine/StateManager';
import { DEFAULT_AUTOMATION } from '../defaultAutomation';
import { SafeJsEvaluator } from '../utils/safeJsEvaluator';
import { ExecutionHistoryManager, ExecutionHistoryItem, BlockExecutionSnapshot } from '../editor/modules/executionHistoryManager';

// Registrar avaliador JS em conformidade com a CSP do Manifest V3 (sem 'unsafe-eval')
StateManager.customEvaluator = (code, vars) => SafeJsEvaluator.evaluate(code, vars);

class ExtensionController {
  private engine: ExecutionEngine;
  private activeContexts: Map<string, ExecutionContext> = new Map();
  private mcpEnabled: boolean = false;
  private mcpPort: number = 3001;

  constructor() {
    this.engine = new ExecutionEngine();
    registerAllDefaultHandlers(this.engine);
    this.initMessageListeners();
    this.initStorageDefaults();
    this.checkAndInitMCP();
  }

  private async checkAndInitMCP(): Promise<void> {
    const data = await chrome.storage.local.get('mcp_config');
    if (data.mcp_config?.enabled) {
      this.mcpEnabled = true;
      this.mcpPort = data.mcp_config.port || 3001;
      this.connectMCPBridge();
    }
  }

  private initStorageDefaults(): void {
    chrome.runtime.onInstalled?.addListener(async () => {
      const automations = await this.getSavedAutomations();
      if (automations.length === 0) {
        await this.saveAutomation(DEFAULT_AUTOMATION);
        console.log('[WebAutomations] Automação padrão carregada com sucesso.');
      }
      await this.syncTriggers();
    });

    // Monitorar inicialização do navegador (browser_startup)
    chrome.runtime.onStartup?.addListener(async () => {
      console.log('[WebAutomations] Navegador iniciado. Verificando gatilhos de browser_startup...');
      await this.syncTriggers();
      const automations = await this.getSavedAutomations();
      for (const auto of automations) {
        const startNode = auto.nodes.find((n) => n.type === 'start');
        if (!startNode) continue;
        const triggers = getActiveTriggers(startNode.data as any);
        if (triggers.some((t) => t.type === 'browser_startup')) {
          console.log(`[WebAutomations] Disparando automação no início do navegador: ${auto.metadata.name}`);
          this.executeAutomation(auto);
        }
      }
    });
  }

  /**
   * Sincroniza alarmes (schedule) e itens de menu de contexto (context_menu) com base nos fluxos salvos
   */
  public async syncTriggers(): Promise<void> {
    try {
      const automations = await this.getSavedAutomations();

      // 1. Context Menus
      if (chrome.contextMenus) {
        chrome.contextMenus.removeAll(() => {
          for (const auto of automations) {
            const startNode = auto.nodes.find((n) => n.type === 'start');
            if (!startNode) continue;
            const triggers = getActiveTriggers(startNode.data as any);
            const contextTriggers = triggers.filter((t) => t.type === 'context_menu');

            contextTriggers.forEach((trigger, idx) => {
              const title = trigger.contextMenuTitle || `Executar: ${auto.metadata.name}`;
              chrome.contextMenus.create({
                id: `menu_flow_${auto.metadata.id}_${idx}`,
                title: title,
                contexts: ['all'],
              });
            });
          }
        });
      }

      // 2. Alarms (Agendamento por intervalo de tempo e datas específicas)
      if (chrome.alarms) {
        await chrome.alarms.clearAll();
        for (const auto of automations) {
          const startNode = auto.nodes.find((n) => n.type === 'start');
          if (!startNode) continue;
          const triggers = getActiveTriggers(startNode.data as any);
          
          triggers.forEach((trigger, idx) => {
            if (trigger.type === 'schedule') {
              let minutes = trigger.intervalMinutes || 15;
              if (trigger.intervalValue && trigger.intervalUnit) {
                if (trigger.intervalUnit === 'minutes') minutes = trigger.intervalValue;
                else if (trigger.intervalUnit === 'hours') minutes = trigger.intervalValue * 60;
                else if (trigger.intervalUnit === 'seconds') minutes = Math.max(0.1, trigger.intervalValue / 60);
                else if (trigger.intervalUnit === 'ms') minutes = Math.max(0.1, trigger.intervalValue / 60000);
              }
              chrome.alarms.create(`alarm_flow_${auto.metadata.id}_${idx}`, {
                periodInMinutes: Math.max(0.1, minutes),
              });
              console.log(`[WebAutomations] Alarme de intervalo registrado para "${auto.metadata.name}" a cada ${minutes} min.`);
            } else if (trigger.type === 'date_schedule') {
              // Verifica a cada 1 minuto se corresponde às regras de datas/horário
              chrome.alarms.create(`date_alarm_flow_${auto.metadata.id}_${idx}`, {
                periodInMinutes: 1,
              });
              console.log(`[WebAutomations] Alarme por data registrado para "${auto.metadata.name}".`);
            }
          });
        }
      }
    } catch (err) {
      console.warn('[WebAutomations] Erro ao sincronizar gatilhos:', err);
    }
  }

  private initMessageListeners(): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleExtensionMessage(message, sender)
        .then((res) => sendResponse(res))
        .catch((err) => sendResponse({ success: false, error: err.message }));
      return true;
    });

    // Monitorar comandos e atalhos de teclado configurados
    chrome.commands?.onCommand.addListener(async (command) => {
      console.log(`Comando de atalho acionado: ${command}`);
      const automations = await this.getSavedAutomations();
      for (const auto of automations) {
        const startNode = auto.nodes.find((n) => n.type === 'start');
        if (!startNode) continue;
        const triggers = getActiveTriggers(startNode.data as any);
        if (triggers.some((t) => t.type === 'shortcut' && t.shortcutKey === command)) {
          this.executeAutomation(auto, undefined, undefined, 'shortcut');
        }
      }
    });

    // Monitorar cliques no menu de contexto (context_menu)
    chrome.contextMenus?.onClicked.addListener(async (info, tab) => {
      if (typeof info.menuItemId === 'string' && info.menuItemId.startsWith('menu_flow_')) {
        // Formato menu_flow_{flowId}_{index}
        const parts = info.menuItemId.replace('menu_flow_', '').split('_');
        const flowId = parts.slice(0, -1).join('_') || parts[0];
        const automations = await this.getSavedAutomations();
        const targetAuto = automations.find((a) => a.metadata.id === flowId || a.metadata.id === info.menuItemId.replace('menu_flow_', ''));
        if (targetAuto) {
          const driver = tab?.id ? new ChromeBrowserDriver(tab.id) : new ChromeBrowserDriver();
          console.log(`[WebAutomations] Disparando fluxo pelo menu de contexto: ${targetAuto.metadata.name}`);
          this.executeAutomation(targetAuto, driver, undefined, 'context_menu');
        }
      }
    });

    // Monitorar alarmes periódicos (schedule / date_schedule)
    chrome.alarms?.onAlarm.addListener(async (alarm) => {
      if (alarm.name.startsWith('alarm_flow_')) {
        const parts = alarm.name.replace('alarm_flow_', '').split('_');
        const flowId = parts.slice(0, -1).join('_') || parts[0];
        const automations = await this.getSavedAutomations();
        const targetAuto = automations.find((a) => a.metadata.id === flowId || a.metadata.id === alarm.name.replace('alarm_flow_', ''));
        if (targetAuto) {
          console.log(`[WebAutomations] Disparando fluxo por intervalo agendado: ${targetAuto.metadata.name}`);
          this.executeAutomation(targetAuto, undefined, undefined, 'schedule');
        }
      } else if (alarm.name.startsWith('date_alarm_flow_')) {
        const parts = alarm.name.replace('date_alarm_flow_', '').split('_');
        const trigIdx = Number(parts[parts.length - 1]);
        const flowId = parts.slice(0, -1).join('_');
        const automations = await this.getSavedAutomations();
        const targetAuto = automations.find((a) => a.metadata.id === flowId);
        if (!targetAuto) return;

        const startNode = targetAuto.nodes.find((n) => n.type === 'start');
        if (!startNode) return;
        const triggers = getActiveTriggers(startNode.data as any);
        const trigger = triggers[trigIdx] || triggers.find((t) => t.type === 'date_schedule');
        if (!trigger || trigger.type !== 'date_schedule' || !trigger.dateSchedule) return;

        const ds = trigger.dateSchedule;
        const now = new Date();
        const currentHours = String(now.getHours()).padStart(2, '0');
        const currentMinutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${currentHours}:${currentMinutes}`;

        // Se tem horário configurado, verificar correspondência
        if (ds.time && ds.time !== currentTime) {
          return;
        }

        let isDateMatched = false;
        if (ds.mode === 'weekdays') {
          const currentDayOfWeek = now.getDay(); // 0 a 6
          isDateMatched = Array.isArray(ds.weekdays) && ds.weekdays.includes(currentDayOfWeek);
        } else if (ds.mode === 'month_days') {
          const currentDayOfMonth = now.getDate(); // 1 a 31
          isDateMatched = Array.isArray(ds.monthDays) && ds.monthDays.includes(currentDayOfMonth);
        } else if (ds.mode === 'full_dates') {
          const y = now.getFullYear();
          const m = String(now.getMonth() + 1).padStart(2, '0');
          const d = String(now.getDate()).padStart(2, '0');
          const todayDateStr = `${y}-${m}-${d}`;
          isDateMatched = Array.isArray(ds.fullDates) && ds.fullDates.includes(todayDateStr);
        }

        if (isDateMatched) {
          console.log(`[WebAutomations] Disparando fluxo por data agendada (${ds.mode}): ${targetAuto.metadata.name}`);
          this.executeAutomation(targetAuto, undefined, undefined, 'date_schedule');
        }
      }
    });

    // Monitorar navegação para gatilhos on_url_load e floating_button
    chrome.webNavigation?.onCompleted.addListener(async (details) => {
      if (details.frameId !== 0) return; // Apenas frame principal
      const automations = await this.getSavedAutomations();
      for (const auto of automations) {
        const startNode = auto.nodes.find((n) => n.type === 'start');
        if (!startNode) continue;
        const triggers = getActiveTriggers(startNode.data as any);

        for (const trigger of triggers) {
          const patterns = getTriggerUrlPatterns(trigger);

          // Gatilho ao carregar URL (qualquer uma das URLs da lista)
          if (trigger.type === 'on_url_load' && patterns.length > 0) {
            const matches = patterns.some((p) => {
              const regex = new RegExp(p.replace(/\*/g, '.*'));
              return regex.test(details.url);
            });
            if (matches) {
              const driver = new ChromeBrowserDriver(details.tabId);
              this.executeAutomation(auto, driver, undefined, 'on_url_load');
            }
          }
        }
      }
    });
  }

  /**
   * Conecta a extensão ao servidor MCP apenas se habilitado pelo usuário
   */
  public connectMCPBridge(): void {
    if (!this.mcpEnabled) return;
    if (this.mcpWebSocket && (this.mcpWebSocket.readyState === WebSocket.OPEN || this.mcpWebSocket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const ws = new WebSocket(`ws://localhost:${this.mcpPort}/mcp-extension-bridge`);

      ws.onopen = () => {
        console.log('[WebAutomations MCP] Conectado ao Servidor MCP com sucesso.');
        this.mcpWebSocket = ws;
        ws.send(JSON.stringify({ type: 'REGISTER_EXTENSION', timestamp: Date.now() }));
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          await this.handleMCPRequest(data);
        } catch (e) {
          console.error('[WebAutomations MCP] Erro ao processar mensagem:', e);
        }
      };

      ws.onclose = () => {
        this.mcpWebSocket = undefined;
        if (this.mcpEnabled) {
          setTimeout(() => this.connectMCPBridge(), 15000);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      // Falha silenciosa se não houver servidor escutando
    }
  }

  public disconnectMCPBridge(): void {
    this.mcpEnabled = false;
    if (this.mcpWebSocket) {
      this.mcpWebSocket.close();
      this.mcpWebSocket = undefined;
    }
  }

  private async handleMCPRequest(msg: { id: string; action: string; payload: any }): Promise<void> {
    const { id, action, payload } = msg;

    try {
      if (action === 'RUN_GRAPH') {
        const graph: WebAutomationGraph = payload.graph;
        const driver = new ChromeBrowserDriver();
        const ctx = await this.executeAutomation(graph, driver, (event, data) => {
          this.mcpWebSocket?.send(JSON.stringify({ type: 'EXECUTION_EVENT', id, event, data }));
        });
        this.mcpWebSocket?.send(JSON.stringify({
          type: 'MCP_RESPONSE',
          id,
          success: true,
          status: ctx.status,
          variables: ctx.state.getAll(),
          logs: ctx.logs,
        }));
      } else if (action === 'LIST_AUTOMATIONS') {
        const automations = await this.getSavedAutomations();
        this.mcpWebSocket?.send(JSON.stringify({
          type: 'MCP_RESPONSE',
          id,
          success: true,
          data: automations.map((a) => a.metadata),
        }));
      } else if (action === 'GET_STATUS') {
        const ctx = this.activeContexts.get(payload.automationId);
        this.mcpWebSocket?.send(JSON.stringify({
          type: 'MCP_RESPONSE',
          id,
          success: true,
          status: ctx ? ctx.status : 'not_found',
          variables: ctx ? ctx.state.getAll() : {},
        }));
      }
    } catch (err: any) {
      this.mcpWebSocket?.send(JSON.stringify({
        type: 'MCP_RESPONSE',
        id,
        success: false,
        error: err.message,
      }));
    }
  }

  public async getActiveWebTab(): Promise<{ tabId?: number; title?: string; url?: string }> {
    const isExt = (url?: string) =>
      !url ||
      url.includes('editor.html') ||
      url.includes('settings.html') ||
      url.includes('analyzer.html') ||
      url.startsWith('chrome://') ||
      url.startsWith('chrome-extension://');

    if (chrome.tabs?.query) {
      try {
        const activeTabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const target = activeTabs.find((t) => t.id && !isExt(t.url));
        if (target?.id) {
          return { tabId: target.id, title: target.title || '', url: target.url || '' };
        }

        const allTabs = await chrome.tabs.query({});
        const activeAnywhere = allTabs.find((t) => t.id && t.active && !isExt(t.url));
        if (activeAnywhere?.id) {
          return { tabId: activeAnywhere.id, title: activeAnywhere.title || '', url: activeAnywhere.url || '' };
        }

        const firstWeb = allTabs.find((t) => t.id && !isExt(t.url));
        if (firstWeb?.id) {
          return { tabId: firstWeb.id, title: firstWeb.title || '', url: firstWeb.url || '' };
        }
      } catch {}
    }
    return {};
  }

  private async handleExtensionMessage(message: any, sender: chrome.runtime.MessageSender): Promise<any> {
    const { action, payload } = message;

    switch (action) {
      case 'GET_ACTIVE_WEB_TAB': {
        const tabInfo = await this.getActiveWebTab();
        return { success: true, ...tabInfo };
      }

      case 'GET_EXECUTION_HISTORY': {
        const history = await ExecutionHistoryManager.getAll();
        return { success: true, history };
      }

      case 'CLEAR_EXECUTION_HISTORY': {
        if (payload?.automationId) {
          await ExecutionHistoryManager.clearForAutomation(payload.automationId);
        } else {
          await ExecutionHistoryManager.clearAll();
        }
        return { success: true };
      }

      case 'DELETE_EXECUTION': {
        if (payload?.id) {
          await ExecutionHistoryManager.delete(payload.id);
          return { success: true };
        }
        return { success: false, error: 'ID de execução não informado' };
      }

      case 'EXECUTE_AUTOMATION': {
        const graph: WebAutomationGraph = payload.graph;
        let targetTabId = payload.tabId;

        // Se tabId não foi especificado, prioriza a aba de onde veio a mensagem (se for página comum) ou a aba web ativa
        if (!targetTabId) {
          const isStudioOrSettings =
            sender.tab?.url?.includes('editor.html') ||
            sender.tab?.url?.includes('settings.html') ||
            sender.tab?.url?.includes('analyzer.html');
          if (sender.tab?.id && !isStudioOrSettings) {
            targetTabId = sender.tab.id;
          } else {
            const activeTab = await this.getActiveWebTab();
            targetTabId = activeTab.tabId;
          }
        }

        const triggerType =
          payload.triggerType ||
          (payload.isDebug ? 'debug' : sender.tab?.id ? 'floating_button' : 'manual');
        const driver = new ChromeBrowserDriver(targetTabId);
        const ctx = await this.executeAutomation(graph, driver, undefined, triggerType);
        const nodeOutputs =
          (ctx as any).nodeOutputs ||
          (typeof (ctx.state as any)?.getNodeOutputs === 'function'
            ? (ctx.state as any).getNodeOutputs()
            : {});
        const readonlyVariables =
          typeof (ctx.state as any)?.getReadonlyVariables === 'function'
            ? (ctx.state as any).getReadonlyVariables()
            : (graph.variableDefinitions || [])
                .filter((v: any) => v.readonly)
                .map((v: any) => v.name);

        return {
          success: ctx.status !== 'failed' && ctx.status !== 'cancelled',
          tabId: targetTabId,
          status: ctx.status,
          variables: ctx.state.getAll(),
          nodeOutputs,
          readonlyVariables,
          logs: ctx.logs,
          historyItem: (ctx as any).historyItem,
          error:
            ctx.status === 'failed'
              ? ctx.logs.filter((l) => l.level === 'error').pop()?.message ||
                'Falha durante a execução'
              : undefined,
        };
      }

      case 'FOCUS_TAB': {
        if (payload?.tabId) {
          try {
            await chrome.tabs.update(payload.tabId, { active: true });
            const tab = await chrome.tabs.get(payload.tabId);
            if (tab?.windowId && chrome.windows?.update) {
              await chrome.windows.update(tab.windowId, { focused: true });
            }
            return { success: true };
          } catch (err: any) {
            return { success: false, error: err.message };
          }
        }
        return { success: false, error: 'tabId não especificado' };
      }

      case 'CANCEL_AUTOMATION': {
        const ctx = this.activeContexts.get(payload.automationId);
        if (ctx) {
          ctx.requestCancel();
          return { success: true };
        }
        return { success: false, error: 'Automação não encontrada em execução.' };
      }

      case 'SAVE_AUTOMATION': {
        const graph: WebAutomationGraph = payload.graph;
        await this.saveAutomation(graph);
        return { success: true };
      }

      case 'SYNC_TRIGGERS': {
        await this.syncTriggers();
        return { success: true };
      }

      case 'SET_MCP_CONFIG': {
        const { enabled, port = 3001 } = payload;
        this.mcpEnabled = !!enabled;
        this.mcpPort = port;
        await chrome.storage.local.set({ mcp_config: { enabled: this.mcpEnabled, port: this.mcpPort } });

        if (this.mcpEnabled) {
          this.connectMCPBridge();
        } else {
          this.disconnectMCPBridge();
        }
        return { success: true, enabled: this.mcpEnabled, port: this.mcpPort };
      }

      case 'GET_MCP_STATUS': {
        const isConnected = !!this.mcpWebSocket && this.mcpWebSocket.readyState === WebSocket.OPEN;
        return {
          success: true,
          enabled: this.mcpEnabled,
          connected: isConnected,
          port: this.mcpPort,
        };
      }

      case 'RELAY_PICKER_KEY': {
        const { tabId, key, code } = payload || {};
        if (tabId && chrome.tabs?.sendMessage) {
          chrome.tabs.sendMessage(tabId, { action: 'FORWARD_PICKER_KEY', payload: { key, code } }, () => void chrome.runtime.lastError);
        }
        return { success: true };
      }

      default:
        return { success: false, error: `Ação não reconhecida: ${action}` };
    }
  }

  public async executeAutomation(
    graph: WebAutomationGraph,
    driver: ChromeBrowserDriver = new ChromeBrowserDriver(),
    onProgress?: (event: string, data: any) => void,
    triggerType: 'manual' | 'debug' | 'floating_button' | 'shortcut' | 'schedule' | 'date_schedule' | 'context_menu' | 'mcp' | 'unknown' = 'manual'
  ): Promise<ExecutionContext> {
    const autoId = graph.metadata.id;
    const startTime = Date.now();
    const nodeOutputs: Record<string, any> = {};

    // Clonar grafo integral para o snapshot histórico (fantasma)
    const graphSnapshot: WebAutomationGraph = JSON.parse(JSON.stringify(graph));
    const initialVariables = (graph.variableDefinitions || []).reduce((acc: any, v: any) => {
      acc[v.name] = v.defaultValue;
      return acc;
    }, {});

    // Inicializar snapshots de blocos com sua respectiva configuração exata
    const blockSnapshots: Record<string, BlockExecutionSnapshot> = {};
    for (const node of (graph.nodes || [])) {
      blockSnapshots[node.id] = {
        nodeId: node.id,
        nodeType: node.type,
        nodeLabel: (node.data as any)?.label || node.type,
        status: 'skipped',
        config: JSON.parse(JSON.stringify(node.data || {})),
        executedAt: 0,
      };
    }

    const ctx = await this.engine.runGraph(graph, driver, {
      onStatusChange: (status) => {
        onProgress?.('status_change', { automationId: autoId, status });
        this.broadcastToUI({ type: 'STATUS_CHANGE', automationId: autoId, status });
      },
      onNodeStart: (node) => {
        const snap = blockSnapshots[node.id];
        if (snap) {
          snap.status = 'running';
          snap.executedAt = Date.now();
        }
        onProgress?.('node_start', { automationId: autoId, nodeId: node.id });
        this.broadcastToUI({ type: 'NODE_START', automationId: autoId, nodeId: node.id });
      },
      onNodeComplete: (node, result) => {
        const out = result?.output !== undefined ? result.output : (result?.data !== undefined ? result.data : result);
        nodeOutputs[node.id] = out;

        const snap = blockSnapshots[node.id];
        if (snap) {
          snap.status = 'completed';
          snap.outputData = out;
          snap.durationMs = Date.now() - (snap.executedAt || startTime);

          // Coleta os dados de entrada oriundos de blocos anteriores conectados
          const incomingEdges = (graph.edges || []).filter((e) => e.target === node.id);
          const inputMap: Record<string, any> = {};
          for (const edge of incomingEdges) {
            if (nodeOutputs[edge.source] !== undefined) {
              inputMap[edge.source] = nodeOutputs[edge.source];
            }
          }
          snap.inputData = Object.keys(inputMap).length > 0 ? inputMap : (result?.input || result?.inputData || null);
        }

        onProgress?.('node_complete', { automationId: autoId, nodeId: node.id, nodeLabel: (node.data as any)?.label, result });
        this.broadcastToUI({
          type: 'NODE_COMPLETE',
          automationId: autoId,
          nodeId: node.id,
          nodeLabel: (node.data as any)?.label,
          result,
          nodeOutputs: { ...nodeOutputs },
        });
      },
      onNodeError: (node, error) => {
        const snap = blockSnapshots[node.id];
        if (snap) {
          snap.status = 'failed';
          snap.error = error.message;
          snap.durationMs = Date.now() - (snap.executedAt || startTime);
        }
        onProgress?.('node_error', { automationId: autoId, nodeId: node.id, error: error.message });
        this.broadcastToUI({ type: 'NODE_ERROR', automationId: autoId, nodeId: node.id, error: error.message });
      },
      onLog: (log) => {
        onProgress?.('log', { automationId: autoId, log });
        this.broadcastToUI({ type: 'LOG', automationId: autoId, log });
      },
    });

    (ctx as any).nodeOutputs = nodeOutputs;
    if (ctx.state) {
      (ctx.state as any).getNodeOutputs = () => nodeOutputs;
      (ctx.state as any).getReadonlyVariables = () => {
        return (graph.variableDefinitions || [])
          .filter((v: any) => v.readonly)
          .map((v: any) => v.name);
      };
    }

    // Registrar histórico completo de execução (para o Modo Fantasma)
    const durationMs = Date.now() - startTime;
    let targetTabUrl = '';
    let targetTabTitle = '';
    if (driver && (driver as any).activeTabId) {
      try {
        const t = await chrome.tabs.get((driver as any).activeTabId);
        targetTabUrl = t?.url || '';
        targetTabTitle = t?.title || '';
      } catch {}
    }

    const historyItem: ExecutionHistoryItem = {
      id: `run_${startTime}_${Math.random().toString(36).substring(2, 7)}`,
      automationId: autoId,
      automationName: graph.metadata?.name || 'Automação',
      timestamp: startTime,
      isoDate: new Date(startTime).toISOString(),
      durationMs,
      status: ctx.status as any,
      error:
        ctx.status === 'failed'
          ? ctx.logs.filter((l) => l.level === 'error').pop()?.message ||
            'Falha durante a execução'
          : undefined,
      triggerType,
      targetTabUrl,
      targetTabTitle,
      graphSnapshot,
      initialVariables,
      finalVariables: ctx.state ? ctx.state.getAll() : {},
      blockSnapshots,
      logs: ctx.logs || [],
    };

    // Salvar e propagar para UI (Dashboard e Studio)
    await ExecutionHistoryManager.save(historyItem);
    (ctx as any).historyItem = historyItem;
    this.broadcastToUI({ type: 'EXECUTION_RECORDED', historyItem });

    this.activeContexts.set(autoId, ctx);
    return ctx;
  }

  private broadcastToUI(message: any): void {
    chrome.runtime.sendMessage(message).catch(() => {
      // Ignora erro se nenhuma aba de editor/popup estiver aberta no momento
    });
  }

  private async getSavedAutomations(): Promise<WebAutomationGraph[]> {
    const data = await chrome.storage.local.get('web_automations');
    return data.web_automations || [];
  }

  private async saveAutomation(graph: WebAutomationGraph): Promise<void> {
    const current = await this.getSavedAutomations();
    const index = current.findIndex((a) => a.metadata.id === graph.metadata.id);
    if (index >= 0) {
      current[index] = graph;
    } else {
      current.push(graph);
    }
    await chrome.storage.local.set({ web_automations: current });
    await this.syncTriggers();
  }
}

// Inicializar controlador no Service Worker
const controller = new ExtensionController();
