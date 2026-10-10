// ../BibliotecaDeDev/src/engine/StateManager.ts
var StateManager = class {
  variables = /* @__PURE__ */ new Map();
  localScopes = [];
  constructor(initialVariables = {}) {
    this.reset(initialVariables);
  }
  /**
   * Reseta o estado para os valores iniciais
   */
  reset(initialVariables = {}) {
    this.variables.clear();
    this.localScopes = [];
    for (const [key, value] of Object.entries(initialVariables)) {
      this.variables.set(key, value);
    }
  }
  /**
   * Define o valor de uma variável no escopo atual
   */
  set(key, value) {
    if (this.localScopes.length > 0) {
      const currentScope = this.localScopes[this.localScopes.length - 1];
      if (currentScope.has(key)) {
        currentScope.set(key, value);
        return;
      }
    }
    this.variables.set(key, value);
  }
  /**
   * Obtém o valor de uma variável (busca do escopo mais interno para o global)
   */
  get(key) {
    for (let i = this.localScopes.length - 1; i >= 0; i--) {
      if (this.localScopes[i].has(key)) {
        return this.localScopes[i].get(key);
      }
    }
    return this.variables.get(key);
  }
  /**
   * Retorna um snapshot de todas as variáveis acessíveis
   */
  getAll() {
    const result = {};
    for (const [k, v] of this.variables.entries()) {
      result[k] = v;
    }
    for (const scope of this.localScopes) {
      for (const [k, v] of scope.entries()) {
        result[k] = v;
      }
    }
    return result;
  }
  /**
   * Empilha um novo escopo de bloco (ex: corpo de loop)
   */
  pushScope(initialScopeVars = {}) {
    const scope = /* @__PURE__ */ new Map();
    for (const [k, v] of Object.entries(initialScopeVars)) {
      scope.set(k, v);
    }
    this.localScopes.push(scope);
  }
  /**
   * Desempilha o escopo de bloco mais recente
   */
  popScope() {
    if (this.localScopes.length > 0) {
      this.localScopes.pop();
    }
  }
  /**
   * Interpola strings com placeholders no formato {{variavel}} ou {{objeto.campo[0]}}
   */
  interpolate(template) {
    if (typeof template !== "string")
      return template;
    return template.replace(/\{\{\s*([a-zA-Z0-9_$.[\]]+)\s*\}\}/g, (_, expression) => {
      const val = this.resolvePath(expression.trim());
      if (val === void 0 || val === null) {
        return "";
      }
      if (typeof val === "object") {
        return JSON.stringify(val);
      }
      return String(val);
    });
  }
  /**
   * Resolve caminhos de propriedades aninhadas, ex: "user.profile.name" ou "items[0].id"
   */
  resolvePath(path) {
    const parts = path.replace(/\[(\w+)\]/g, ".$1").replace(/^\./, "").split(".");
    let current = this.get(parts[0]);
    for (let i = 1; i < parts.length; i++) {
      if (current === void 0 || current === null)
        return void 0;
      current = current[parts[i]];
    }
    return current;
  }
  /**
   * Avalia uma expressão ou script JS arbitrário no escopo atual das variáveis
   */
  evaluateJsExpression(expressionOrCode) {
    if (!expressionOrCode || !expressionOrCode.trim())
      return false;
    const interpolated = this.interpolate(expressionOrCode.trim());
    const vars = this.getAll();
    try {
      if (interpolated.includes(";") || interpolated.includes("return ") || interpolated.includes("\n")) {
        const fn2 = new Function(...Object.keys(vars), interpolated.includes("return ") ? interpolated : `return (${interpolated});`);
        return fn2(...Object.values(vars));
      }
      const fn = new Function(...Object.keys(vars), `return (${interpolated});`);
      return fn(...Object.values(vars));
    } catch (err) {
      console.warn(`[StateManager] Erro ao avaliar express\xE3o JS: "${interpolated}":`, err.message);
      return false;
    }
  }
  /**
   * Avalia uma condição com operadores lógicos do Switch/While
   */
  evaluateCondition(leftRaw, operator, rightRaw) {
    const leftResolved = leftRaw !== void 0 ? this.interpolate(leftRaw) : "";
    const rightResolved = rightRaw !== void 0 ? this.interpolate(rightRaw) : void 0;
    switch (operator) {
      case "equals":
        return String(leftResolved) === String(rightResolved);
      case "not_equals":
        return String(leftResolved) !== String(rightResolved);
      case "contains":
        return String(leftResolved).includes(String(rightResolved));
      case "not_contains":
        return !String(leftResolved).includes(String(rightResolved));
      case "greater_than":
        return Number(leftResolved) > Number(rightResolved);
      case "less_than":
        return Number(leftResolved) < Number(rightResolved);
      case "greater_or_equal":
        return Number(leftResolved) >= Number(rightResolved);
      case "less_or_equal":
        return Number(leftResolved) <= Number(rightResolved);
      case "is_empty":
        return leftResolved === "" || leftResolved === null || leftResolved === void 0;
      case "is_not_empty":
        return leftResolved !== "" && leftResolved !== null && leftResolved !== void 0;
      case "regex_match":
        if (!rightResolved)
          return false;
        try {
          const regex = new RegExp(rightResolved);
          return regex.test(String(leftResolved));
        } catch {
          return false;
        }
      default:
        return false;
    }
  }
};

// ../BibliotecaDeDev/src/engine/ExecutionContext.ts
var ExecutionContext = class {
  state;
  driver;
  status = "idle";
  logs = [];
  nodeResults = /* @__PURE__ */ new Map();
  events;
  isCancellationRequested = false;
  isPauseRequested = false;
  pauseResolver;
  constructor(initialVariables = {}, driver, events = {}) {
    this.state = new StateManager(initialVariables);
    this.driver = driver;
    this.events = events;
  }
  log(level, message, nodeId, payload) {
    const logItem = {
      timestamp: Date.now(),
      level,
      nodeId,
      message,
      payload
    };
    this.logs.push(logItem);
    this.events.onLog?.(logItem);
  }
  setStatus(status) {
    this.status = status;
    this.events.onStatusChange?.(status);
  }
  requestCancel() {
    this.isCancellationRequested = true;
    if (this.pauseResolver) {
      this.pauseResolver();
    }
  }
  requestPause() {
    this.isPauseRequested = true;
  }
  resume() {
    this.isPauseRequested = false;
    if (this.pauseResolver) {
      this.pauseResolver();
      this.pauseResolver = void 0;
    }
  }
  isCancelled() {
    return this.isCancellationRequested;
  }
  async checkPausePoint() {
    if (this.isPauseRequested && !this.isCancellationRequested) {
      this.setStatus("paused");
      await new Promise((resolve) => {
        this.pauseResolver = resolve;
      });
      if (!this.isCancellationRequested) {
        this.setStatus("running");
      }
    }
  }
};

// ../BibliotecaDeDev/src/engine/ExecutionEngine.ts
var ExecutionEngine = class {
  handlers = /* @__PURE__ */ new Map();
  /**
   * Registra um handler executor para um tipo de bloco
   */
  registerHandler(type, handler) {
    this.handlers.set(type, handler);
  }
  /**
   * Executa um grafo completo de automação
   */
  async runGraph(graph, driver, events = {}, overrideVariables = {}) {
    const initialVars = {
      ...graph.variables,
      ...overrideVariables
    };
    const context = new ExecutionContext(initialVars, driver, events);
    context.setStatus("running");
    try {
      const startNode = this.findStartNode(graph);
      if (!startNode) {
        throw new Error("Nenhum n\xF3 de In\xEDcio (start) v\xE1lido foi encontrado no grafo.");
      }
      context.log("info", `Iniciando automa\xE7\xE3o "${graph.metadata.name}" (v${graph.metadata.version})`);
      await this.traverseNode(startNode, graph, context);
      if (context.isCancelled()) {
        context.setStatus("cancelled");
        context.log("warn", "Execu\xE7\xE3o da automa\xE7\xE3o cancelada pelo usu\xE1rio.");
      } else {
        context.setStatus("completed");
        context.log("info", "Automa\xE7\xE3o finalizada com sucesso!");
      }
    } catch (error) {
      context.setStatus("failed");
      context.log("error", `Falha cr\xEDtica durante a execu\xE7\xE3o: ${error?.message || error}`);
    }
    return context;
  }
  /**
   * Localiza o nó inicial ativo no grafo
   */
  findStartNode(graph) {
    return graph.nodes.find((n) => n.type === "start" && !n.disabled);
  }
  /**
   * Processa a execução de um nó e continua a travessia
   */
  async traverseNode(node, graph, context) {
    if (context.isCancelled())
      return;
    await context.checkPausePoint();
    if (node.disabled || node.type === "note" || node.type === "group") {
      const nextNodes2 = this.getNextNodes(node.id, graph, void 0);
      for (const nextNode of nextNodes2) {
        await this.traverseNode(nextNode, graph, context);
      }
      return;
    }
    if (node.type === "try_catch") {
      await this.executeTryCatch(node, graph, context);
      return;
    }
    if (node.type === "while_loop") {
      await this.executeWhileLoop(node, graph, context);
      return;
    }
    if (node.type === "for_loop") {
      await this.executeForLoop(node, graph, context);
      return;
    }
    context.events.onNodeStart?.(node);
    context.log("debug", `Executando n\xF3 [${node.type}] (ID: ${node.id})`, node.id);
    const startTime = Date.now();
    let result;
    try {
      const handler = this.handlers.get(node.type);
      if (!handler) {
        throw new Error(`Nenhum handler registrado para o tipo de n\xF3: ${node.type}`);
      }
      result = await handler.execute(node, context);
      result.startTime = startTime;
      result.endTime = Date.now();
      result.durationMs = result.endTime - startTime;
      context.nodeResults.set(node.id, result);
      context.events.onNodeComplete?.(node, result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      result = {
        nodeId: node.id,
        status: "failed",
        error,
        startTime,
        endTime: Date.now(),
        durationMs: Date.now() - startTime
      };
      context.nodeResults.set(node.id, result);
      context.events.onNodeError?.(node, error);
      context.log("error", `Erro no n\xF3 [${node.id}]: ${error.message}`, node.id);
      if (graph.settings?.stopOnError !== false) {
        throw error;
      }
      return;
    }
    if (context.isCancelled())
      return;
    const nextNodes = this.getNextNodes(node.id, graph, result.outputHandle);
    if (nextNodes.length === 0)
      return;
    const isParallel = graph.settings?.parallelBranchesEnabled === true && node.type === "switch" && node.data.executionMode === "all_matches_parallel";
    if (isParallel) {
      await Promise.all(nextNodes.map((nxt) => this.traverseNode(nxt, graph, context)));
    } else {
      for (const nextNode of nextNodes) {
        await this.traverseNode(nextNode, graph, context);
      }
    }
  }
  /**
   * Executa bloco de Try/Catch
   */
  async executeTryCatch(node, graph, context) {
    const data = node.data;
    const errorVar = data.errorVarName || "lastError";
    context.events.onNodeStart?.(node);
    context.log("info", "Entrando no bloco Try / Catch...", node.id);
    const tryNodes = this.getNextNodes(node.id, graph, "try_body");
    const catchNodes = this.getNextNodes(node.id, graph, "catch_branch");
    const defaultNodes = this.getNextNodes(node.id, graph, "default");
    let succeeded = true;
    try {
      for (const tNode of tryNodes) {
        await this.traverseNode(tNode, graph, context);
      }
    } catch (err) {
      succeeded = false;
      const errorMsg = err?.message || String(err);
      context.log("warn", `Exce\xE7\xE3o capturada no Try/Catch: ${errorMsg}`, node.id);
      context.state.set(errorVar, errorMsg);
      for (const cNode of catchNodes) {
        await this.traverseNode(cNode, graph, context);
      }
    }
    context.events.onNodeComplete?.(node, {
      nodeId: node.id,
      status: "success",
      outputHandle: succeeded ? "try_body" : "catch_branch",
      startTime: Date.now(),
      endTime: Date.now(),
      durationMs: 0
    });
    for (const dNode of defaultNodes) {
      await this.traverseNode(dNode, graph, context);
    }
  }
  /**
   * Executa bloco de Loop While
   */
  async executeWhileLoop(node, graph, context) {
    const data = node.data;
    const maxIterations = data.maxIterations || 1e3;
    let iteration = 0;
    const bodyNodes = this.getNextNodes(node.id, graph, "loop_body");
    const doneNodes = this.getNextNodes(node.id, graph, "loop_done");
    context.events.onNodeStart?.(node);
    while (iteration < maxIterations) {
      if (context.isCancelled())
        break;
      await context.checkPausePoint();
      let conditionPassed = false;
      if (data.evaluationMode === "js_eval" || data.jsExpression && !data.operator) {
        conditionPassed = Boolean(context.state.evaluateJsExpression(data.jsExpression || ""));
      } else {
        conditionPassed = context.state.evaluateCondition(
          data.leftOperand,
          data.operator,
          data.rightOperand
        );
      }
      if (!conditionPassed) {
        context.log("info", `Loop While finalizado (condi\xE7\xE3o falsa na itera\xE7\xE3o ${iteration}).`, node.id);
        break;
      }
      iteration++;
      context.log("debug", `Executando itera\xE7\xE3o #${iteration} do Loop While`, node.id);
      for (const bNode of bodyNodes) {
        await this.traverseNode(bNode, graph, context);
      }
    }
    if (iteration >= maxIterations) {
      context.log("warn", `Loop While atingiu o limite de seguran\xE7a de ${maxIterations} itera\xE7\xF5es.`, node.id);
    }
    context.events.onNodeComplete?.(node, {
      nodeId: node.id,
      status: "success",
      outputHandle: "loop_done",
      startTime: Date.now(),
      endTime: Date.now(),
      durationMs: 0
    });
    const nextAfterLoop = doneNodes.length > 0 ? doneNodes : this.getNextNodes(node.id, graph, "default");
    for (const dNode of nextAfterLoop) {
      await this.traverseNode(dNode, graph, context);
    }
  }
  /**
   * Executa bloco de Loop For
   */
  async executeForLoop(node, graph, context) {
    const data = node.data;
    const itemVar = data.itemVarName || "item";
    const indexVar = data.indexVarName || "index";
    const maxIterations = data.maxIterations || 1e3;
    let itemsToIterate = [];
    if (data.loopType === "count") {
      const resolvedCount = Number(context.state.interpolate(String(data.countExpression || 0)));
      itemsToIterate = Array.from({ length: Math.min(resolvedCount, maxIterations) }, (_, i) => i);
    } else if (data.loopType === "js_generator" || data.jsExpression) {
      const evalResult = context.state.evaluateJsExpression(data.jsExpression || "");
      if (Array.isArray(evalResult)) {
        itemsToIterate = evalResult.slice(0, maxIterations);
      } else if (typeof evalResult === "number") {
        itemsToIterate = Array.from({ length: Math.min(evalResult, maxIterations) }, (_, i) => i);
      } else {
        itemsToIterate = [];
      }
    } else {
      const resolvedArray = typeof data.arrayExpression === "string" ? context.state.resolvePath(data.arrayExpression.replace(/[{}]/g, "").trim()) || [] : [];
      itemsToIterate = Array.isArray(resolvedArray) ? resolvedArray.slice(0, maxIterations) : [];
    }
    context.events.onNodeStart?.(node);
    context.log("info", `Iniciando Loop For com ${itemsToIterate.length} itera\xE7\xF5es...`, node.id);
    const bodyNodes = this.getNextNodes(node.id, graph, "loop_body");
    const doneNodes = this.getNextNodes(node.id, graph, "loop_done");
    for (let i = 0; i < itemsToIterate.length; i++) {
      if (context.isCancelled())
        break;
      await context.checkPausePoint();
      const currentItem = itemsToIterate[i];
      context.state.set(indexVar, i);
      context.state.set(itemVar, currentItem);
      context.log("debug", `Loop For: itera\xE7\xE3o ${i + 1}/${itemsToIterate.length}`, node.id);
      for (const bNode of bodyNodes) {
        await this.traverseNode(bNode, graph, context);
      }
    }
    context.events.onNodeComplete?.(node, {
      nodeId: node.id,
      status: "success",
      outputHandle: "loop_done",
      startTime: Date.now(),
      endTime: Date.now(),
      durationMs: 0
    });
    const nextAfterLoop = doneNodes.length > 0 ? doneNodes : this.getNextNodes(node.id, graph, "default");
    for (const dNode of nextAfterLoop) {
      await this.traverseNode(dNode, graph, context);
    }
  }
  /**
   * Obtém os próximos nós a serem executados a partir das arestas conectadas
   * Aplica a ordenação vertical (menor Y tem prioridade)
   */
  getNextNodes(sourceNodeId, graph, outputHandle) {
    const outgoingEdges = graph.edges.filter((edge) => {
      if (edge.source !== sourceNodeId)
        return false;
      if (outputHandle !== void 0) {
        return !edge.sourceHandle || edge.sourceHandle === outputHandle;
      }
      return true;
    });
    const targetNodes = outgoingEdges.map((edge) => graph.nodes.find((n) => n.id === edge.target)).filter((n) => n !== void 0);
    return targetNodes.sort((a, b) => a.position.y - b.position.y);
  }
};

// ../BibliotecaDeDev/src/engine/DefaultHandlers.ts
function successResult(nodeId, outputHandle, outputData) {
  return {
    nodeId,
    status: "success",
    outputHandle,
    outputData,
    startTime: 0,
    endTime: 0,
    durationMs: 0
  };
}
var StartNodeHandler = class {
  async execute(node, context) {
    context.log("info", `Gatilho acionado: ${node.data.triggerType}`, node.id);
    return successResult(node.id, "default");
  }
};
var DelayNodeHandler = class {
  async execute(node, context) {
    let delayMs = node.data.fixedMs ?? 1e3;
    if (node.data.isRandom && node.data.randomRange) {
      const { minMs, maxMs } = node.data.randomRange;
      delayMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    }
    context.log("debug", `Aguardando delay de ${delayMs}ms...`, node.id);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return successResult(node.id, "default");
  }
};
var SwitchNodeHandler = class {
  async execute(node, context) {
    const { cases, hasDefaultBranch } = node.data;
    for (const testCase of cases) {
      let passed = false;
      if (testCase.evaluationMode === "js_eval" || testCase.jsExpression && !testCase.operator) {
        const result = context.state.evaluateJsExpression(testCase.jsExpression || "");
        passed = Boolean(result);
      } else {
        passed = context.state.evaluateCondition(
          testCase.leftOperand,
          testCase.operator,
          testCase.rightOperand
        );
      }
      if (passed) {
        context.log("info", `Condi\xE7\xE3o satisfeita para o caso [${testCase.label || testCase.id}]`, node.id);
        return successResult(node.id, testCase.id);
      }
    }
    if (hasDefaultBranch) {
      context.log("info", "Nenhuma condi\xE7\xE3o satisfeita. Seguindo caminho default.", node.id);
      return successResult(node.id, "default");
    }
    return successResult(node.id, void 0);
  }
};
var IfElementExistsNodeHandler = class {
  async execute(node, context) {
    const { selector, selectorType, timeoutMs } = node.data;
    const interpolatedSelector = context.state.interpolate(selector);
    context.log("debug", `Verificando exist\xEAncia do elemento: ${interpolatedSelector}`, node.id);
    const exists = await context.driver.elementExists(interpolatedSelector, selectorType, timeoutMs);
    const branch = exists ? "true" : "false";
    context.log("info", `Elemento ${exists ? "encontrado" : "n\xE3o encontrado"}. Seguindo caminho: ${branch}`, node.id);
    return successResult(node.id, branch, { exists });
  }
};
var NavigateNodeHandler = class {
  async execute(node, context) {
    const url = context.state.interpolate(node.data.url);
    context.log("info", `Navegando para URL: ${url}`, node.id);
    await context.driver.navigateTo(url, node.data.waitUntil, node.data.timeoutMs);
    return successResult(node.id, "default");
  }
};
var TabActionNodeHandler = class {
  async execute(node, context) {
    const { action, queryType, queryValue, saveUrlToVar, active } = node.data;
    switch (action) {
      case "new_tab": {
        const targetUrl = node.data.url ? context.state.interpolate(node.data.url) : void 0;
        const res = await context.driver.createTab(targetUrl, active);
        if (saveUrlToVar && res.url)
          context.state.set(saveUrlToVar, res.url);
        break;
      }
      case "switch_tab": {
        const val = typeof queryValue === "string" ? context.state.interpolate(queryValue) : queryValue;
        await context.driver.switchTab(queryType, val);
        break;
      }
      case "close_tab": {
        const val = typeof queryValue === "string" ? context.state.interpolate(queryValue) : queryValue;
        await context.driver.closeTab(queryType, val);
        break;
      }
      case "get_current_url": {
        const currentUrl = await context.driver.getCurrentUrl();
        if (saveUrlToVar)
          context.state.set(saveUrlToVar, currentUrl);
        break;
      }
    }
    return successResult(node.id, "default");
  }
};
var HistoryNavigationNodeHandler = class {
  async execute(node, context) {
    await context.driver.navigateHistory(node.data.action, node.data.ignoreCache);
    return successResult(node.id, "default");
  }
};
var ClickElementNodeHandler = class {
  async execute(node, context) {
    const selector = context.state.interpolate(node.data.selector);
    await context.driver.clickElement(
      selector,
      node.data.selectorType,
      node.data.clickType,
      node.data.timeoutMs,
      node.data.clickCoordinates
    );
    return successResult(node.id, "default");
  }
};
var TypeInputNodeHandler = class {
  async execute(node, context) {
    const selector = context.state.interpolate(node.data.selector);
    const text = context.state.interpolate(node.data.text);
    await context.driver.typeText(
      selector,
      node.data.selectorType,
      text,
      node.data.mode,
      node.data.minTypingDelayMs,
      node.data.maxTypingDelayMs,
      node.data.clearBeforeTyping,
      node.data.pressEnterAfter,
      node.data.timeoutMs
    );
    return successResult(node.id, "default");
  }
};
var PressKeyNodeHandler = class {
  async execute(node, context) {
    const selector = node.data.selector ? context.state.interpolate(node.data.selector) : void 0;
    await context.driver.pressKey(node.data.key, node.data.modifiers, selector, node.data.selectorType);
    return successResult(node.id, "default");
  }
};
var HoverFocusNodeHandler = class {
  async execute(node, context) {
    const selector = context.state.interpolate(node.data.selector);
    await context.driver.hoverOrFocus(selector, node.data.selectorType, node.data.action, node.data.timeoutMs);
    return successResult(node.id, "default");
  }
};
var ScrollNodeHandler = class {
  async execute(node, context) {
    const selector = node.data.selector ? context.state.interpolate(node.data.selector) : void 0;
    await context.driver.scroll(
      node.data.target,
      selector,
      node.data.selectorType,
      node.data.deltaX,
      node.data.deltaY,
      node.data.smooth
    );
    return successResult(node.id, "default");
  }
};
var WaitForElementNodeHandler = class {
  async execute(node, context) {
    const selector = context.state.interpolate(node.data.selector);
    await context.driver.waitForElement(selector, node.data.selectorType, node.data.state, node.data.timeoutMs);
    return successResult(node.id, "default");
  }
};
var SetVariableNodeHandler = class {
  async execute(node, context) {
    const { varName, evaluationType, valueExpression } = node.data;
    let finalValue;
    if (evaluationType === "literal") {
      finalValue = valueExpression;
    } else if (evaluationType === "template") {
      finalValue = context.state.interpolate(String(valueExpression));
    } else if (evaluationType === "js_eval") {
      const interpolatedCode = context.state.interpolate(String(valueExpression));
      const vars = context.state.getAll();
      const fn = new Function(...Object.keys(vars), `return (${interpolatedCode});`);
      finalValue = fn(...Object.values(vars));
    }
    context.state.set(varName, finalValue);
    context.events.onVariableChange?.(varName, finalValue);
    context.log("info", `Vari\xE1vel [${varName}] definida com valor: ${JSON.stringify(finalValue)}`, node.id);
    return successResult(node.id, "default", { [varName]: finalValue });
  }
};
var HttpRequestNodeHandler = class {
  async execute(node, context) {
    const { url, method, headers, body, responseType, saveResponseToVar, saveStatusToVar } = node.data;
    const resolvedUrl = context.state.interpolate(url);
    const resolvedHeaders = {};
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        resolvedHeaders[k] = context.state.interpolate(v);
      }
    }
    const resolvedBody = body ? context.state.interpolate(body) : void 0;
    context.log("info", `Executando requisi\xE7\xE3o HTTP ${method} para ${resolvedUrl}`, node.id);
    const response = await fetch(resolvedUrl, {
      method,
      headers: resolvedHeaders,
      body: method !== "GET" && method !== "HEAD" ? resolvedBody : void 0
    });
    let data;
    if (responseType === "text") {
      data = await response.text();
    } else {
      data = await response.json();
    }
    context.state.set(saveResponseToVar, data);
    if (saveStatusToVar) {
      context.state.set(saveStatusToVar, response.status);
    }
    return successResult(node.id, "default", { response: data, status: response.status });
  }
};
var ExtractDataNodeHandler = class {
  async execute(node, context) {
    const selector = context.state.interpolate(node.data.selector);
    const data = await context.driver.extractData(
      selector,
      node.data.selectorType,
      node.data.extractType,
      node.data.attributeName,
      node.data.timeoutMs
    );
    context.state.set(node.data.saveToVar, data);
    context.log("info", `Dado extra\xEDdo salvo em [${node.data.saveToVar}]`, node.id);
    return successResult(node.id, "default", { [node.data.saveToVar]: data });
  }
};
var ScrapeListNodeHandler = class {
  async execute(node, context) {
    const selector = context.state.interpolate(node.data.selector);
    const items = await context.driver.scrapeList(
      selector,
      node.data.selectorType,
      node.data.fields,
      node.data.maxItems,
      node.data.timeoutMs
    );
    context.state.set(node.data.saveToVar, items);
    context.log("info", `Lista raspada (${items.length} itens) salva em [${node.data.saveToVar}]`, node.id);
    return successResult(node.id, "default", { [node.data.saveToVar]: items });
  }
};
var ExportFileNodeHandler = class {
  async execute(node, context) {
    const rawData = context.state.get(node.data.sourceVar);
    const filename = context.state.interpolate(node.data.filename);
    let content = "";
    let mimeType = "text/plain";
    if (node.data.format === "json") {
      content = JSON.stringify(rawData, null, 2);
      mimeType = "application/json";
    } else if (node.data.format === "csv") {
      mimeType = "text/csv";
      const delimiter = node.data.csvDelimiter || ",";
      if (Array.isArray(rawData) && rawData.length > 0) {
        const headers = Object.keys(rawData[0]);
        const headerRow = headers.join(delimiter);
        const rows = rawData.map(
          (item) => headers.map((h) => JSON.stringify(item[h] ?? "")).join(delimiter)
        );
        content = [headerRow, ...rows].join("\n");
      }
    }
    await context.driver.downloadFile(content, filename, mimeType);
    context.log("info", `Arquivo ${filename} exportado com sucesso.`, node.id);
    return successResult(node.id, "default");
  }
};
var InjectJavascriptNodeHandler = class {
  async execute(node, context) {
    const code = context.state.interpolate(node.data.code);
    const args = (node.data.args || []).map((arg) => context.state.get(arg));
    const result = await context.driver.injectScript(code, node.data.context, args);
    if (node.data.saveResultToVar) {
      context.state.set(node.data.saveResultToVar, result);
    }
    return successResult(node.id, "default", { result });
  }
};
var InjectHtmlNodeHandler = class {
  async execute(node, context) {
    const html = context.state.interpolate(node.data.html);
    const selector = context.state.interpolate(node.data.targetSelector);
    await context.driver.injectHtml(html, selector, node.data.position, node.data.selectorType);
    return successResult(node.id, "default");
  }
};
var InjectCssNodeHandler = class {
  async execute(node, context) {
    const css = context.state.interpolate(node.data.css);
    await context.driver.injectCss(css, node.data.target, node.data.styleId);
    return successResult(node.id, "default");
  }
};
var WebComponentNodeHandler = class {
  async execute(node, context) {
    const html = context.state.interpolate(node.data.html);
    const css = context.state.interpolate(node.data.css);
    const js = context.state.interpolate(node.data.js);
    await context.driver.injectWebComponent(html, css, js, node.data.containerId, node.data.mode);
    return successResult(node.id, "default");
  }
};
function registerAllDefaultHandlers(engine) {
  engine.registerHandler("start", new StartNodeHandler());
  engine.registerHandler("delay", new DelayNodeHandler());
  engine.registerHandler("switch", new SwitchNodeHandler());
  engine.registerHandler("if_element_exists", new IfElementExistsNodeHandler());
  engine.registerHandler("navigate", new NavigateNodeHandler());
  engine.registerHandler("tab_action", new TabActionNodeHandler());
  engine.registerHandler("history_navigation", new HistoryNavigationNodeHandler());
  engine.registerHandler("click_element", new ClickElementNodeHandler());
  engine.registerHandler("type_input", new TypeInputNodeHandler());
  engine.registerHandler("press_key", new PressKeyNodeHandler());
  engine.registerHandler("hover_focus", new HoverFocusNodeHandler());
  engine.registerHandler("scroll", new ScrollNodeHandler());
  engine.registerHandler("wait_for_element", new WaitForElementNodeHandler());
  engine.registerHandler("set_variable", new SetVariableNodeHandler());
  engine.registerHandler("http_request", new HttpRequestNodeHandler());
  engine.registerHandler("extract_data", new ExtractDataNodeHandler());
  engine.registerHandler("scrape_list", new ScrapeListNodeHandler());
  engine.registerHandler("export_file", new ExportFileNodeHandler());
  engine.registerHandler("inject_javascript", new InjectJavascriptNodeHandler());
  engine.registerHandler("inject_html", new InjectHtmlNodeHandler());
  engine.registerHandler("inject_css", new InjectCssNodeHandler());
  engine.registerHandler("web_component", new WebComponentNodeHandler());
}

// ../BibliotecaDeDev/src/types/schema.ts
function getTriggerUrlPatterns(trigger) {
  if (!trigger)
    return [];
  const list = [];
  if (Array.isArray(trigger.urlPatterns) && trigger.urlPatterns.length > 0) {
    list.push(...trigger.urlPatterns.map((u) => u.trim()).filter((u) => u.length > 0));
  } else if (trigger.urlPattern && trigger.urlPattern.trim()) {
    list.push(trigger.urlPattern.trim());
  }
  if (trigger.floatingButton?.urlPattern && trigger.floatingButton.urlPattern.trim()) {
    if (!list.includes(trigger.floatingButton.urlPattern.trim())) {
      list.push(trigger.floatingButton.urlPattern.trim());
    }
  }
  return list.length > 0 ? list : [];
}
function getActiveTriggers(data) {
  if (!data)
    return [{ type: "manual", enabled: true }];
  if (Array.isArray(data.triggers) && data.triggers.length > 0) {
    return data.triggers.filter((t) => t.enabled !== false);
  }
  const singleType = data.triggerType || "manual";
  return [
    {
      type: singleType,
      enabled: true,
      urlPattern: data.urlPattern,
      urlPatterns: data.urlPatterns || (data.urlPattern ? [data.urlPattern] : void 0),
      shortcutKey: data.shortcutKey,
      intervalMinutes: data.intervalMinutes,
      cronExpression: data.cronExpression,
      contextMenuTitle: data.contextMenuTitle,
      floatingButton: data.floatingButton
    }
  ];
}

// src/driver/ChromeBrowserDriver.ts
var ChromeBrowserDriver = class {
  activeTabId;
  constructor(initialTabId) {
    this.activeTabId = initialTabId;
  }
  setActiveTab(tabId) {
    this.activeTabId = tabId;
  }
  async getTargetTabId() {
    if (this.activeTabId) {
      return this.activeTabId;
    }
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      throw new Error("Nenhuma aba ativa encontrada para executar a a\xE7\xE3o.");
    }
    this.activeTabId = tab.id;
    return tab.id;
  }
  async sendToContentScript(action, payload) {
    const tabId = await this.getTargetTabId();
    try {
      const response = await chrome.tabs.sendMessage(tabId, { action, payload });
      if (response && response.error) {
        throw new Error(response.error);
      }
      return response?.data ?? response;
    } catch (err) {
      if (err?.message?.includes("Receiving end does not exist") || err?.message?.includes("Could not establish connection")) {
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ["dist/contentDriver.js"]
        });
        const retryResponse = await chrome.tabs.sendMessage(tabId, { action, payload });
        if (retryResponse && retryResponse.error)
          throw new Error(retryResponse.error);
        return retryResponse?.data ?? retryResponse;
      }
      throw err;
    }
  }
  // -------------------------------------------------------------
  // NAVEGAÇÃO E ABAS
  // -------------------------------------------------------------
  async navigateTo(url, waitUntil = "load", timeoutMs = 3e4) {
    const tabId = await this.getTargetTabId();
    await chrome.tabs.update(tabId, { url });
    if (waitUntil === "none")
      return;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(listener);
        reject(new Error(`Timeout (${timeoutMs}ms) aguardando carregamento da URL: ${url}`));
      }, timeoutMs);
      const listener = (updatedTabId, changeInfo) => {
        if (updatedTabId === tabId) {
          if (waitUntil === "load" && changeInfo.status === "complete") {
            clearTimeout(timer);
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
          } else if (waitUntil === "domcontentloaded" && changeInfo.status) {
            clearTimeout(timer);
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
          }
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
    });
  }
  async createTab(url, active = true) {
    const tab = await chrome.tabs.create({ url, active });
    if (tab.id && active) {
      this.activeTabId = tab.id;
    }
    return { tabId: tab.id, url: tab.url };
  }
  async switchTab(queryType, queryValue) {
    let targetTab;
    if (queryType === "index") {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      targetTab = tabs[Number(queryValue)];
    } else if (queryType === "title") {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      targetTab = tabs.find((t) => t.title?.toLowerCase().includes(String(queryValue).toLowerCase()));
    } else if (queryType === "url_match") {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const regex = new RegExp(String(queryValue));
      targetTab = tabs.find((t) => t.url && regex.test(t.url));
    }
    if (!targetTab?.id) {
      throw new Error(`Aba n\xE3o encontrada com crit\xE9rio ${queryType}: ${queryValue}`);
    }
    await chrome.tabs.update(targetTab.id, { active: true });
    this.activeTabId = targetTab.id;
  }
  async closeTab(queryType, queryValue) {
    if (!queryType) {
      const tabId2 = await this.getTargetTabId();
      await chrome.tabs.remove(tabId2);
      this.activeTabId = void 0;
      return;
    }
    await this.switchTab(queryType, queryValue);
    const tabId = await this.getTargetTabId();
    await chrome.tabs.remove(tabId);
    this.activeTabId = void 0;
  }
  async getCurrentUrl() {
    const tabId = await this.getTargetTabId();
    const tab = await chrome.tabs.get(tabId);
    return tab.url || "";
  }
  async navigateHistory(action, ignoreCache = false) {
    const tabId = await this.getTargetTabId();
    if (action === "reload") {
      await chrome.tabs.reload(tabId, { bypassCache: ignoreCache });
    } else if (action === "back") {
      await chrome.tabs.goBack(tabId);
    } else if (action === "forward") {
      await chrome.tabs.goForward(tabId);
    }
  }
  // -------------------------------------------------------------
  // OPERAÇÕES NO DOM
  // -------------------------------------------------------------
  async clickElement(selector, selectorType, clickType, timeoutMs, coordinates) {
    await this.sendToContentScript("CLICK_ELEMENT", {
      selector,
      selectorType,
      clickType,
      timeoutMs,
      coordinates
    });
  }
  async typeText(selector, selectorType, text, mode, minDelay, maxDelay, clear, pressEnter, timeoutMs) {
    await this.sendToContentScript("TYPE_INPUT", {
      selector,
      selectorType,
      text,
      mode,
      minDelay,
      maxDelay,
      clear,
      pressEnter,
      timeoutMs
    });
  }
  async pressKey(key, modifiers, selector, selectorType) {
    await this.sendToContentScript("PRESS_KEY", { key, modifiers, selector, selectorType });
  }
  async hoverOrFocus(selector, selectorType, action, timeoutMs) {
    await this.sendToContentScript("HOVER_FOCUS", { selector, selectorType, action, timeoutMs });
  }
  async scroll(target, selector, selectorType, deltaX, deltaY, smooth) {
    await this.sendToContentScript("SCROLL", { target, selector, selectorType, deltaX, deltaY, smooth });
  }
  async waitForElement(selector, selectorType, state, timeoutMs) {
    const res = await this.sendToContentScript("WAIT_FOR_ELEMENT", { selector, selectorType, state, timeoutMs });
    return !!res?.success;
  }
  async elementExists(selector, selectorType, timeoutMs) {
    const res = await this.sendToContentScript("ELEMENT_EXISTS", { selector, selectorType, timeoutMs });
    return !!res;
  }
  async extractData(selector, selectorType, extractType, attributeName, timeoutMs) {
    return await this.sendToContentScript("EXTRACT_DATA", {
      selector,
      selectorType,
      extractType,
      attributeName,
      timeoutMs
    });
  }
  async scrapeList(selector, selectorType, fields, maxItems, timeoutMs) {
    return await this.sendToContentScript("SCRAPE_LIST", {
      selector,
      selectorType,
      fields,
      maxItems,
      timeoutMs
    });
  }
  async injectScript(code, context, args = []) {
    if (context === "background") {
      const fn = new Function(...args.map((_, i) => `arg${i}`), code);
      return fn(...args);
    }
    const tabId = await this.getTargetTabId();
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: (scriptContent, scriptArgs) => {
        const fn = new Function("args", scriptContent);
        return fn(scriptArgs);
      },
      args: [code, args]
    });
    return result?.result;
  }
  async injectHtml(html, targetSelector, position, selectorType) {
    await this.sendToContentScript("INJECT_HTML", { html, targetSelector, position, selectorType });
  }
  async injectCss(css, target, styleId) {
    await this.sendToContentScript("INJECT_CSS", { css, target, styleId });
  }
  async injectWebComponent(html, css, js, containerId, mode) {
    await this.sendToContentScript("INJECT_WEB_COMPONENT", { html, css, js, containerId, mode });
  }
  async downloadFile(content, filename, mimeType) {
    const base64Data = btoa(unescape(encodeURIComponent(content)));
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    await chrome.downloads.download({
      url: dataUrl,
      filename,
      saveAs: false
    });
  }
};

// src/defaultAutomation.ts
var DEFAULT_AUTOMATION = {
  schemaVersion: "1.0.0",
  metadata: {
    id: "auto_wiki_scraping_default",
    name: "Pesquisa e Extra\xE7\xE3o na Wikipedia",
    description: "Navega at\xE9 a Wikipedia, pesquisa por Intelig\xEAncia Artificial com digita\xE7\xE3o humana, aguarda o carregamento e extrai o t\xEDtulo.",
    version: "1.0.0",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    tags: ["wikipedia", "scraping", "demo"]
  },
  settings: {
    stopOnError: true,
    defaultTimeoutMs: 15e3,
    logLevel: "info",
    parallelBranchesEnabled: false
  },
  variables: {
    termoPesquisa: "Intelig\xEAncia Artificial",
    tituloArtigo: ""
  },
  nodes: [
    {
      id: "node_start",
      type: "start",
      category: "flow_logic",
      position: { x: 50, y: 180 },
      data: {
        label: "Iniciar Demonstra\xE7\xE3o",
        triggerType: "manual"
      }
    },
    {
      id: "node_navigate",
      type: "navigate",
      category: "browser_navigation",
      position: { x: 300, y: 180 },
      data: {
        label: "Acessar Wikipedia",
        url: "https://pt.wikipedia.org/wiki/Wikip%C3%A9dia:P%C3%A1gina_principal",
        waitUntil: "domcontentloaded",
        timeoutMs: 15e3
      }
    },
    {
      id: "node_type",
      type: "type_input",
      category: "dom_interaction",
      position: { x: 550, y: 180 },
      data: {
        label: "Digitar Busca",
        selector: 'input.cdx-text-input__input, input[name="search"]',
        selectorType: "css",
        text: "{{termoPesquisa}}",
        mode: "human_typing",
        minTypingDelayMs: 40,
        maxTypingDelayMs: 120,
        clearBeforeTyping: true,
        pressEnterAfter: true
      }
    },
    {
      id: "node_wait",
      type: "wait_for_element",
      category: "dom_interaction",
      position: { x: 800, y: 180 },
      data: {
        label: "Aguardar Artigo",
        selector: "#firstHeading",
        selectorType: "css",
        state: "visible",
        timeoutMs: 1e4
      }
    },
    {
      id: "node_extract",
      type: "extract_data",
      category: "data_network",
      position: { x: 1050, y: 180 },
      data: {
        label: "Extrair T\xEDtulo",
        selector: "#firstHeading",
        selectorType: "css",
        extractType: "innerText",
        saveToVar: "tituloArtigo"
      }
    },
    {
      id: "node_inject_banner",
      type: "inject_html",
      category: "injection_customization",
      position: { x: 1300, y: 180 },
      data: {
        label: "Notifica\xE7\xE3o na P\xE1gina",
        html: '<div style="position:fixed; top:20px; right:20px; z-index:999999; background:linear-gradient(135deg, #4f46e5, #9333ea); color:white; padding:16px 22px; border-radius:12px; font-family:sans-serif; font-size:14px; font-weight:bold; box-shadow:0 10px 30px rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.3); animation: slideIn 0.5s ease;">\u26A1 WebAutomations: Artigo Extra\xEDdo com Sucesso!</div>',
        targetSelector: "body",
        position: "beforeend"
      }
    }
  ],
  edges: [
    { id: "e1", source: "node_start", target: "node_navigate" },
    { id: "e2", source: "node_navigate", target: "node_type" },
    { id: "e3", source: "node_type", target: "node_wait" },
    { id: "e4", source: "node_wait", target: "node_extract" },
    { id: "e5", source: "node_extract", target: "node_inject_banner" }
  ],
  viewport: { x: 0, y: 0, zoom: 1 }
};

// src/background/serviceWorker.ts
var ExtensionController = class {
  engine;
  activeContexts = /* @__PURE__ */ new Map();
  mcpEnabled = false;
  mcpPort = 3001;
  constructor() {
    this.engine = new ExecutionEngine();
    registerAllDefaultHandlers(this.engine);
    this.initMessageListeners();
    this.initStorageDefaults();
    this.checkAndInitMCP();
  }
  async checkAndInitMCP() {
    const data = await chrome.storage.local.get("mcp_config");
    if (data.mcp_config?.enabled) {
      this.mcpEnabled = true;
      this.mcpPort = data.mcp_config.port || 3001;
      this.connectMCPBridge();
    }
  }
  initStorageDefaults() {
    chrome.runtime.onInstalled?.addListener(async () => {
      const automations = await this.getSavedAutomations();
      if (automations.length === 0) {
        await this.saveAutomation(DEFAULT_AUTOMATION);
        console.log("[WebAutomations] Automa\xE7\xE3o padr\xE3o carregada com sucesso.");
      }
      await this.syncTriggers();
    });
    chrome.runtime.onStartup?.addListener(async () => {
      console.log("[WebAutomations] Navegador iniciado. Verificando gatilhos de browser_startup...");
      await this.syncTriggers();
      const automations = await this.getSavedAutomations();
      for (const auto of automations) {
        const startNode = auto.nodes.find((n) => n.type === "start");
        if (!startNode)
          continue;
        const triggers = getActiveTriggers(startNode.data);
        if (triggers.some((t) => t.type === "browser_startup")) {
          console.log(`[WebAutomations] Disparando automa\xE7\xE3o no in\xEDcio do navegador: ${auto.metadata.name}`);
          this.executeAutomation(auto);
        }
      }
    });
  }
  /**
   * Sincroniza alarmes (schedule) e itens de menu de contexto (context_menu) com base nos fluxos salvos
   */
  async syncTriggers() {
    try {
      const automations = await this.getSavedAutomations();
      if (chrome.contextMenus) {
        chrome.contextMenus.removeAll(() => {
          for (const auto of automations) {
            const startNode = auto.nodes.find((n) => n.type === "start");
            if (!startNode)
              continue;
            const triggers = getActiveTriggers(startNode.data);
            const contextTriggers = triggers.filter((t) => t.type === "context_menu");
            contextTriggers.forEach((trigger, idx) => {
              const title = trigger.contextMenuTitle || `Executar: ${auto.metadata.name}`;
              chrome.contextMenus.create({
                id: `menu_flow_${auto.metadata.id}_${idx}`,
                title,
                contexts: ["all"]
              });
            });
          }
        });
      }
      if (chrome.alarms) {
        await chrome.alarms.clearAll();
        for (const auto of automations) {
          const startNode = auto.nodes.find((n) => n.type === "start");
          if (!startNode)
            continue;
          const triggers = getActiveTriggers(startNode.data);
          const scheduleTriggers = triggers.filter((t) => t.type === "schedule");
          scheduleTriggers.forEach((trigger, idx) => {
            const interval = Number(trigger.intervalMinutes) || 15;
            chrome.alarms.create(`alarm_flow_${auto.metadata.id}_${idx}`, {
              periodInMinutes: Math.max(1, interval)
            });
            console.log(`[WebAutomations] Alarme registrado para "${auto.metadata.name}" a cada ${interval} min.`);
          });
        }
      }
    } catch (err) {
      console.warn("[WebAutomations] Erro ao sincronizar gatilhos:", err);
    }
  }
  initMessageListeners() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleExtensionMessage(message, sender).then((res) => sendResponse(res)).catch((err) => sendResponse({ success: false, error: err.message }));
      return true;
    });
    chrome.commands?.onCommand.addListener(async (command) => {
      console.log(`Comando de atalho acionado: ${command}`);
      const automations = await this.getSavedAutomations();
      for (const auto of automations) {
        const startNode = auto.nodes.find((n) => n.type === "start");
        if (!startNode)
          continue;
        const triggers = getActiveTriggers(startNode.data);
        if (triggers.some((t) => t.type === "shortcut" && t.shortcutKey === command)) {
          this.executeAutomation(auto);
        }
      }
    });
    chrome.contextMenus?.onClicked.addListener(async (info, tab) => {
      if (typeof info.menuItemId === "string" && info.menuItemId.startsWith("menu_flow_")) {
        const parts = info.menuItemId.replace("menu_flow_", "").split("_");
        const flowId = parts.slice(0, -1).join("_") || parts[0];
        const automations = await this.getSavedAutomations();
        const targetAuto = automations.find((a) => a.metadata.id === flowId || a.metadata.id === info.menuItemId.replace("menu_flow_", ""));
        if (targetAuto) {
          const driver = tab?.id ? new ChromeBrowserDriver(tab.id) : new ChromeBrowserDriver();
          console.log(`[WebAutomations] Disparando fluxo pelo menu de contexto: ${targetAuto.metadata.name}`);
          this.executeAutomation(targetAuto, driver);
        }
      }
    });
    chrome.alarms?.onAlarm.addListener(async (alarm) => {
      if (alarm.name.startsWith("alarm_flow_")) {
        const parts = alarm.name.replace("alarm_flow_", "").split("_");
        const flowId = parts.slice(0, -1).join("_") || parts[0];
        const automations = await this.getSavedAutomations();
        const targetAuto = automations.find((a) => a.metadata.id === flowId || a.metadata.id === alarm.name.replace("alarm_flow_", ""));
        if (targetAuto) {
          console.log(`[WebAutomations] Disparando fluxo por intervalo agendado: ${targetAuto.metadata.name}`);
          this.executeAutomation(targetAuto);
        }
      }
    });
    chrome.webNavigation?.onCompleted.addListener(async (details) => {
      if (details.frameId !== 0)
        return;
      const automations = await this.getSavedAutomations();
      for (const auto of automations) {
        const startNode = auto.nodes.find((n) => n.type === "start");
        if (!startNode)
          continue;
        const triggers = getActiveTriggers(startNode.data);
        for (const trigger of triggers) {
          const patterns = getTriggerUrlPatterns(trigger);
          if (trigger.type === "on_url_load" && patterns.length > 0) {
            const matches = patterns.some((p) => {
              const regex = new RegExp(p.replace(/\*/g, ".*"));
              return regex.test(details.url);
            });
            if (matches) {
              const driver = new ChromeBrowserDriver(details.tabId);
              this.executeAutomation(auto, driver);
            }
          }
          if (trigger.type === "floating_button") {
            const floatingPatterns = patterns.length > 0 ? patterns : [".*"];
            const matches = floatingPatterns.some((p) => {
              const regex = new RegExp(p.replace(/\*/g, ".*"));
              return regex.test(details.url);
            });
            if (matches && details.tabId) {
              chrome.tabs.sendMessage(details.tabId, {
                action: "INJECT_FLOATING_TRIGGER_BUTTON",
                payload: {
                  automationId: auto.metadata.id,
                  automationName: auto.metadata.name,
                  buttonConfig: trigger.floatingButton
                }
              }).catch(() => {
              });
            }
          }
        }
      }
    });
  }
  /**
   * Conecta a extensão ao servidor MCP apenas se habilitado pelo usuário
   */
  connectMCPBridge() {
    if (!this.mcpEnabled)
      return;
    if (this.mcpWebSocket && (this.mcpWebSocket.readyState === WebSocket.OPEN || this.mcpWebSocket.readyState === WebSocket.CONNECTING)) {
      return;
    }
    try {
      const ws = new WebSocket(`ws://localhost:${this.mcpPort}/mcp-extension-bridge`);
      ws.onopen = () => {
        console.log("[WebAutomations MCP] Conectado ao Servidor MCP com sucesso.");
        this.mcpWebSocket = ws;
        ws.send(JSON.stringify({ type: "REGISTER_EXTENSION", timestamp: Date.now() }));
      };
      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          await this.handleMCPRequest(data);
        } catch (e) {
          console.error("[WebAutomations MCP] Erro ao processar mensagem:", e);
        }
      };
      ws.onclose = () => {
        this.mcpWebSocket = void 0;
        if (this.mcpEnabled) {
          setTimeout(() => this.connectMCPBridge(), 15e3);
        }
      };
      ws.onerror = () => {
        ws.close();
      };
    } catch {
    }
  }
  disconnectMCPBridge() {
    this.mcpEnabled = false;
    if (this.mcpWebSocket) {
      this.mcpWebSocket.close();
      this.mcpWebSocket = void 0;
    }
  }
  async handleMCPRequest(msg) {
    const { id, action, payload } = msg;
    try {
      if (action === "RUN_GRAPH") {
        const graph = payload.graph;
        const driver = new ChromeBrowserDriver();
        const ctx = await this.executeAutomation(graph, driver, (event, data) => {
          this.mcpWebSocket?.send(JSON.stringify({ type: "EXECUTION_EVENT", id, event, data }));
        });
        this.mcpWebSocket?.send(JSON.stringify({
          type: "MCP_RESPONSE",
          id,
          success: true,
          status: ctx.status,
          variables: ctx.state.getAll(),
          logs: ctx.logs
        }));
      } else if (action === "LIST_AUTOMATIONS") {
        const automations = await this.getSavedAutomations();
        this.mcpWebSocket?.send(JSON.stringify({
          type: "MCP_RESPONSE",
          id,
          success: true,
          data: automations.map((a) => a.metadata)
        }));
      } else if (action === "GET_STATUS") {
        const ctx = this.activeContexts.get(payload.automationId);
        this.mcpWebSocket?.send(JSON.stringify({
          type: "MCP_RESPONSE",
          id,
          success: true,
          status: ctx ? ctx.status : "not_found",
          variables: ctx ? ctx.state.getAll() : {}
        }));
      }
    } catch (err) {
      this.mcpWebSocket?.send(JSON.stringify({
        type: "MCP_RESPONSE",
        id,
        success: false,
        error: err.message
      }));
    }
  }
  async handleExtensionMessage(message, sender) {
    const { action, payload } = message;
    switch (action) {
      case "EXECUTE_AUTOMATION": {
        const graph = payload.graph;
        const targetTabId = payload.tabId || sender.tab?.id;
        const driver = new ChromeBrowserDriver(targetTabId);
        const ctx = await this.executeAutomation(graph, driver);
        return {
          success: true,
          status: ctx.status,
          variables: ctx.state.getAll(),
          logs: ctx.logs
        };
      }
      case "CANCEL_AUTOMATION": {
        const ctx = this.activeContexts.get(payload.automationId);
        if (ctx) {
          ctx.requestCancel();
          return { success: true };
        }
        return { success: false, error: "Automa\xE7\xE3o n\xE3o encontrada em execu\xE7\xE3o." };
      }
      case "SAVE_AUTOMATION": {
        const graph = payload.graph;
        await this.saveAutomation(graph);
        return { success: true };
      }
      case "SET_MCP_CONFIG": {
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
      case "GET_MCP_STATUS": {
        const isConnected = !!this.mcpWebSocket && this.mcpWebSocket.readyState === WebSocket.OPEN;
        return {
          success: true,
          enabled: this.mcpEnabled,
          connected: isConnected,
          port: this.mcpPort
        };
      }
      default:
        return { success: false, error: `A\xE7\xE3o n\xE3o reconhecida: ${action}` };
    }
  }
  async executeAutomation(graph, driver = new ChromeBrowserDriver(), onProgress) {
    const autoId = graph.metadata.id;
    const ctx = await this.engine.runGraph(graph, driver, {
      onStatusChange: (status) => {
        onProgress?.("status_change", { automationId: autoId, status });
        this.broadcastToUI({ type: "STATUS_CHANGE", automationId: autoId, status });
      },
      onNodeStart: (node) => {
        onProgress?.("node_start", { automationId: autoId, nodeId: node.id });
        this.broadcastToUI({ type: "NODE_START", automationId: autoId, nodeId: node.id });
      },
      onNodeComplete: (node, result) => {
        onProgress?.("node_complete", { automationId: autoId, nodeId: node.id, result });
        this.broadcastToUI({ type: "NODE_COMPLETE", automationId: autoId, nodeId: node.id, result });
      },
      onNodeError: (node, error) => {
        onProgress?.("node_error", { automationId: autoId, nodeId: node.id, error: error.message });
        this.broadcastToUI({ type: "NODE_ERROR", automationId: autoId, nodeId: node.id, error: error.message });
      },
      onLog: (log) => {
        onProgress?.("log", { automationId: autoId, log });
        this.broadcastToUI({ type: "LOG", automationId: autoId, log });
      }
    });
    this.activeContexts.set(autoId, ctx);
    return ctx;
  }
  broadcastToUI(message) {
    chrome.runtime.sendMessage(message).catch(() => {
    });
  }
  async getSavedAutomations() {
    const data = await chrome.storage.local.get("web_automations");
    return data.web_automations || [];
  }
  async saveAutomation(graph) {
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
};
var controller = new ExtensionController();
//# sourceMappingURL=background.js.map
