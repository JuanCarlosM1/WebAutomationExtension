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

// src/editor/modules/blockCatalog.ts
var BLOCK_CATALOG = [
  {
    category: "flow_logic",
    categoryLabel: "A. Controle de Fluxo e L\xF3gica",
    categoryClass: "cat-flow",
    items: [
      {
        type: "start",
        title: "Bloco de In\xEDcio",
        desc: "Ponto de partida e gatilho",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
        defaultData: { label: "In\xEDcio", triggerType: "manual" }
      },
      {
        type: "delay",
        title: "Atraso (Delay)",
        desc: "Pausa fixa ou rand\xF4mica",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        defaultData: { label: "Aguardar", isRandom: false, fixedMs: 1500, randomRange: { minMs: 1e3, maxMs: 3e3 } }
      },
      {
        type: "switch",
        title: "Switch (Condicional)",
        desc: "Desvia fluxo por condi\xE7\xE3o ou c\xF3digo JS",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>',
        defaultData: {
          label: "Condi\xE7\xE3o",
          executionMode: "first_match",
          cases: [
            {
              id: "case_1",
              label: "Caso 1",
              logicalOperator: "and",
              rules: [{ id: "rule_1", evaluationMode: "comparison", leftOperand: "{{status}}", operator: "equals", rightOperand: "200" }]
            }
          ],
          hasDefaultBranch: true
        }
      },
      {
        type: "while_loop",
        title: "Loop While",
        desc: "Enquanto condi\xE7\xE3o ou JS for verdadeiro",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
        defaultData: {
          label: "Loop While",
          logicalOperator: "and",
          rules: [{ id: "rule_1", evaluationMode: "comparison", leftOperand: "{{i}}", operator: "less_than", rightOperand: "10" }],
          maxIterations: 100
        }
      },
      {
        type: "for_loop",
        title: "Loop For",
        desc: "Itera sobre lista, contagem ou gerador JS",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
        defaultData: { label: "Loop For", loopType: "count", countExpression: 5, arrayExpression: "{{items}}", itemVarName: "item", indexVarName: "index", maxIterations: 100 }
      },
      {
        type: "if_element_exists",
        title: "Se Elemento Existir",
        desc: "Desvio seletor CSS existe",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
        defaultData: { label: "Elemento Existe?", selector: ".btn-primary", selectorType: "css", timeoutMs: 3e3 }
      },
      {
        type: "try_catch",
        title: "Tentar / Capturar",
        desc: "Preven\xE7\xE3o de falhas",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        defaultData: { label: "Try/Catch", errorVarName: "lastError" }
      },
      {
        type: "group",
        title: "Grupo de Blocos",
        desc: "Agrupador visual",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
        defaultData: { label: "Novo Grupo", childNodeIds: [], color: "#6366f1", description: "" }
      }
    ]
  },
  {
    category: "browser_navigation",
    categoryLabel: "B. Navega\xE7\xE3o (Browser API)",
    categoryClass: "cat-nav",
    items: [
      {
        type: "navigate",
        title: "Ir para P\xE1gina",
        desc: "Navega para URL",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        defaultData: { label: "Navegar", url: "https://", waitUntil: "load", timeoutMs: 3e4 }
      },
      {
        type: "tab_action",
        title: "A\xE7\xF5es de Aba",
        desc: "Nova, trocar, fechar",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
        defaultData: { label: "Aba", action: "new_tab", url: "https://google.com", active: true, queryType: "title", queryValue: "", saveUrlToVar: "" }
      },
      {
        type: "history_navigation",
        title: "Hist\xF3rico",
        desc: "Voltar, avan\xE7ar, recarregar",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 19 2 12 11 5 11 19"/><polygon points="22 19 13 12 22 5 22 19"/></svg>',
        defaultData: { label: "Hist\xF3rico", action: "reload", ignoreCache: false }
      }
    ]
  },
  {
    category: "dom_interaction",
    categoryLabel: "C. Intera\xE7\xE3o com DOM",
    categoryClass: "cat-dom",
    items: [
      {
        type: "click_element",
        title: "Clicar em Elemento",
        desc: "Clique simples, duplo ou dir.",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 15l5 5"/><circle cx="9" cy="9" r="7"/></svg>',
        defaultData: { label: "Clicar", selector: "button", selectorType: "css", clickType: "single", waitForElement: true, timeoutMs: 5e3 }
      },
      {
        type: "type_input",
        title: "Digitar Texto",
        desc: "Simula\xE7\xE3o humana ou colar",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="8" x2="6" y2="8"/><line x1="10" y1="8" x2="10" y2="8"/><line x1="14" y1="8" x2="14" y2="8"/><line x1="18" y1="8" x2="18" y2="8"/><line x1="7" y1="16" x2="17" y2="16"/></svg>',
        defaultData: { label: "Digitar", selector: "input", selectorType: "css", text: "", mode: "human_typing", minTypingDelayMs: 40, maxTypingDelayMs: 120, clearBeforeTyping: false, pressEnterAfter: false, timeoutMs: 5e3 }
      },
      {
        type: "press_key",
        title: "Enviar Tecla",
        desc: "Enter, Esc, Tab, etc.",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>',
        defaultData: { label: "Pressionar Tecla", key: "Enter", selector: "", selectorType: "css" }
      },
      {
        type: "hover_focus",
        title: "Foco / Hover",
        desc: "Passar mouse ou focar",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
        defaultData: { label: "Foco/Hover", selector: "", selectorType: "css", action: "hover", timeoutMs: 5e3 }
      },
      {
        type: "scroll",
        title: "Rolar P\xE1gina",
        desc: "Topo, final ou elemento",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
        defaultData: { label: "Rolar", target: "bottom", selector: "", selectorType: "css", deltaX: 0, deltaY: 500, smooth: true }
      },
      {
        type: "wait_for_element",
        title: "Esperar Elemento",
        desc: "Aguardar vis\xEDvel ou clic\xE1vel",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>',
        defaultData: { label: "Esperar", selector: "", selectorType: "css", state: "visible", timeoutMs: 1e4 }
      }
    ]
  },
  {
    category: "data_network",
    categoryLabel: "D. Dados, Vari\xE1veis e Rede",
    categoryClass: "cat-data",
    items: [
      {
        type: "http_request",
        title: "Requisi\xE7\xE3o HTTP",
        desc: "GET, POST, Headers, Body",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>',
        defaultData: { label: "HTTP Request", url: "https://api.example.com", method: "GET", responseType: "json", body: "", saveResponseToVar: "apiResponse", saveStatusToVar: "apiStatus", timeoutMs: 15e3 }
      },
      {
        type: "set_variable",
        title: "Definir Vari\xE1vel",
        desc: "Cria/modifica no estado",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
        defaultData: { label: "Set Variable", varName: "meuDado", evaluationType: "literal", valueExpression: "valor" }
      },
      {
        type: "extract_data",
        title: "Extrair Texto/Atrib.",
        desc: "innerText, href, src",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>',
        defaultData: { label: "Extrair", selector: "h1", selectorType: "css", extractType: "innerText", attributeName: "href", saveToVar: "extractedHeading", timeoutMs: 5e3 }
      },
      {
        type: "scrape_list",
        title: "Extrair Lista",
        desc: "Scraping de m\xFAltiplos itens",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
        defaultData: { label: "Scrape Lista", selector: ".card", selectorType: "css", fields: [{ name: "titulo", subSelector: ".title", extractType: "innerText", attributeName: "" }], saveToVar: "items", maxItems: 50, timeoutMs: 5e3 }
      },
      {
        type: "export_file",
        title: "Exportar Arquivo",
        desc: "Salvar em .csv ou .json",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
        defaultData: { label: "Exportar", sourceVar: "items", format: "json", filename: "dados.json", csvDelimiter: "," }
      }
    ]
  },
  {
    category: "injection_customization",
    categoryLabel: "E. Inje\xE7\xE3o e Customiza\xE7\xE3o",
    categoryClass: "cat-inject",
    items: [
      {
        type: "inject_javascript",
        title: "Injetar JavaScript",
        desc: "Roda no Content ou Background",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
        defaultData: { label: "Injetar JS", code: 'console.log("Ol\xE1 Mundo");', context: "content_script", saveResultToVar: "" }
      },
      {
        type: "inject_html",
        title: "Injetar HTML",
        desc: "Insere elementos na p\xE1gina",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
        defaultData: { label: "Injetar HTML", html: '<div class="banner">Aviso</div>', targetSelector: "body", selectorType: "css", position: "beforeend" }
      },
      {
        type: "inject_css",
        title: "Injetar CSS",
        desc: "Aplica estilos customizados",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
        defaultData: { label: "Injetar CSS", css: "body { background: #000 !important; }", target: "page", styleId: "custom-style" }
      },
      {
        type: "web_component",
        title: "Elementos Web",
        desc: "HTML + CSS + JS unificados",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
        defaultData: { label: "Web Component", html: '<button id="btn">Ok</button>', css: "button { color: red; }", js: "", containerId: "custom-widget", mode: "shadow_dom" }
      },
      {
        type: "note",
        title: "Nota / Coment\xE1rio",
        desc: "Anota\xE7\xE3o visual no editor",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
        defaultData: { label: "Nota", content: "Descreva seu fluxo aqui..." }
      }
    ]
  }
];

// src/editor/modules/colorPickerManager.ts
var ColorPickerManager = class {
  constructor(getGraph, showToast2, onPaletteChanged) {
    this.getGraph = getGraph;
    this.showToast = showToast2;
    this.onPaletteChanged = onPaletteChanged;
  }
  getFlowColorPalette() {
    const graph = this.getGraph();
    if (!Array.isArray(graph.colorPalette)) {
      graph.colorPalette = [
        "#6366f1",
        "#3b82f6",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
        "#ec4899"
      ];
    }
    return graph.colorPalette;
  }
  openFlowPaletteModal(onCloseOrChange) {
    const existing = document.querySelector(".flow-palette-modal-backdrop");
    existing?.remove();
    const palette = this.getFlowColorPalette();
    const backdrop = document.createElement("div");
    backdrop.className = "flow-modal-backdrop flow-palette-modal-backdrop";
    const triggerChange = () => {
      this.onPaletteChanged?.();
      onCloseOrChange?.();
      window.dispatchEvent(new CustomEvent("flow-palette-updated"));
    };
    const renderPaletteModalContent = () => {
      backdrop.innerHTML = `
        <div class="flow-modal-card" style="max-width: 480px; width: 100%; border: 1px solid #8b5cf6;">
          <div class="flow-modal-header">
            <div class="flow-modal-icon" style="background: rgba(139, 92, 246, 0.15); color: #a855f7;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
            </div>
            <div class="flow-modal-title" style="color: #f8fafc; font-weight: 700;">Cores do Fluxo</div>
          </div>
          <div class="flow-modal-body" style="display: flex; flex-direction: column; gap: 12px;">
            <p style="font-size: 12px; color: #94a3b8; line-height: 1.4;">
              Defina as cores personalizadas deste fluxo. Todas as cores adicionadas aqui ficam acess\xEDveis instantaneamente em qualquer seletor de cor no editor.
            </p>
            <div class="custom-palette-list" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; max-height: 220px; overflow-y: auto;">
              ${palette.map((color, idx) => `
                <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 6px; padding: 6px; display: flex; flex-direction: column; gap: 4px; align-items: center; position: relative;">
                  <button type="button" class="del-palette-color-btn" data-idx="${idx}" title="Remover" style="position: absolute; top: 2px; right: 4px; background: transparent; border: none; color: #ef4444; font-size: 14px; font-weight: bold; cursor: pointer; line-height: 1; padding: 2px 4px;">&times;</button>
                  <div style="width: 100%; height: 26px; background: ${color}; border-radius: 4px; border: 1px solid rgba(0,0,0,0.3); box-shadow: inset 0 0 2px rgba(255,255,255,0.2);"></div>
                  <span style="font-size: 10px; font-family: monospace; color: #cbd5e1; user-select: all;">${color}</span>
                </div>
              `).join("")}
            </div>

            <div style="display: flex; gap: 8px; align-items: center; padding-top: 10px; border-top: 1px solid #1e293b;">
              <input type="color" id="newPaletteColorPicker" value="#10b981" style="width: 36px; height: 32px; border: 1px solid #334155; border-radius: 6px; background: transparent; cursor: pointer; padding: 0;" />
              <input type="text" id="newPaletteColorInput" value="#10b981" placeholder="#10b981" style="flex: 1; padding: 6px 10px; font-size: 12px; font-family: monospace; background: #172033; color: white; border: 1px solid #243049; border-radius: 6px;" />
              <button type="button" id="btnAddColorToFlowPalette" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px; white-space: nowrap;">+ Adicionar Cor</button>
            </div>
          </div>
          <div class="flow-modal-footer" style="display: flex; justify-content: flex-end; gap: 8px; border-top: 1px solid #1e293b; padding-top: 12px;">
            <button type="button" class="btn btn-primary flow-palette-close-btn" style="background: #8b5cf6; border-color: #8b5cf6; padding: 6px 16px;">Salvar & Concluir</button>
          </div>
        </div>
      `;
      const pickerEl = backdrop.querySelector("#newPaletteColorPicker");
      const inputEl = backdrop.querySelector("#newPaletteColorInput");
      const addBtn = backdrop.querySelector("#btnAddColorToFlowPalette");
      pickerEl?.addEventListener("input", (e) => {
        inputEl.value = e.target.value;
      });
      inputEl?.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        if (val.startsWith("#") && (val.length === 4 || val.length === 7)) {
          pickerEl.value = val.length === 4 ? `#${val[1]}${val[1]}${val[2]}${val[2]}${val[3]}${val[3]}` : val;
        }
      });
      const handleAddColor = () => {
        let val = inputEl.value.trim();
        if (val) {
          if (!val.startsWith("#"))
            val = `#${val}`;
          if (!palette.some((c) => c.toLowerCase() === val.toLowerCase())) {
            palette.push(val);
            this.getGraph().colorPalette = palette;
            renderPaletteModalContent();
            triggerChange();
          } else {
            this.showToast("Esta cor j\xE1 existe na paleta do fluxo.", "info");
          }
        }
      };
      addBtn?.addEventListener("click", handleAddColor);
      inputEl?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleAddColor();
        }
      });
      backdrop.querySelectorAll(".del-palette-color-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.dataset.idx);
          palette.splice(idx, 1);
          this.getGraph().colorPalette = palette;
          renderPaletteModalContent();
          triggerChange();
        });
      });
      const closeModal = () => {
        backdrop.remove();
        onCloseOrChange?.();
      };
      backdrop.querySelector(".flow-palette-close-btn")?.addEventListener("click", closeModal);
    };
    renderPaletteModalContent();
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.remove();
        onCloseOrChange?.();
      }
    });
    document.body.appendChild(backdrop);
  }
  createPaintColorPicker(container, labelText, initialColor, onChange) {
    let currentColor = initialColor || "#6366f1";
    const group = document.createElement("div");
    group.className = "form-group paint-color-picker-group";
    group.style.cssText = "display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; position: relative;";
    const header = document.createElement("div");
    header.style.cssText = "display: flex; justify-content: space-between; align-items: center;";
    header.innerHTML = `
      <label style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">${labelText}</label>
    `;
    group.appendChild(header);
    const displayBar = document.createElement("div");
    displayBar.style.cssText = "display: flex; align-items: center; gap: 8px; background: #0b0f19; border: 1px solid #1e293b; border-radius: 6px; padding: 6px 8px;";
    const swatchCurrent = document.createElement("div");
    swatchCurrent.style.cssText = `
      width: 28px;
      height: 28px;
      border-radius: 4px;
      background: ${currentColor || "#6366f1"};
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
      flex-shrink: 0;
      cursor: pointer;
    `;
    swatchCurrent.title = "Clique para abrir paleta";
    const infoDiv = document.createElement("div");
    infoDiv.style.cssText = "display: flex; flex-direction: column; flex: 1; min-width: 0;";
    infoDiv.innerHTML = `
      <span style="font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 600;">Cor Atual</span>
      <span class="current-hex-label" style="font-size: 12px; font-family: monospace; color: #f1f5f9; font-weight: 600;">${currentColor || "#6366f1"}</span>
    `;
    const btnMoreColors = document.createElement("button");
    btnMoreColors.type = "button";
    btnMoreColors.className = "btn-xs";
    btnMoreColors.style.cssText = "padding: 5px 10px; font-size: 11px; font-weight: 600; background: #1e293b; border: 1px solid #334155; color: #93c5fd; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 4px; white-space: nowrap; transition: all 0.15s;";
    btnMoreColors.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px;"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
      Mais Cores...
    `;
    displayBar.appendChild(swatchCurrent);
    displayBar.appendChild(infoDiv);
    displayBar.appendChild(btnMoreColors);
    group.appendChild(displayBar);
    const popoverPanel = document.createElement("div");
    popoverPanel.style.cssText = "display: none; position: relative; z-index: 1000; background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 10px; flex-direction: column; gap: 8px; margin-top: 4px; box-shadow: 0 12px 32px rgba(0,0,0,0.8); width: 100%; box-sizing: border-box;";
    const mainBaseColors = [
      "#000000",
      "#7f7f7f",
      "#880015",
      "#ed1c24",
      "#ff7f27",
      "#fff200",
      "#22b14c",
      "#00a2e8",
      "#3f48cc",
      "#a349a4",
      "#ffffff",
      "#c3c3c3",
      "#b97a57",
      "#ffaec9",
      "#ffc90e",
      "#efe4b0",
      "#b5e61d",
      "#99d9ea",
      "#7092be",
      "#c8bfe7"
    ];
    const modernColors = [
      "#6366f1",
      "#4f46e5",
      "#3b82f6",
      "#0ea5e9",
      "#06b6d4",
      "#10b981",
      "#14b8a6",
      "#84cc16",
      "#eab308",
      "#f59e0b",
      "#ef4444",
      "#f43f5e",
      "#ec4899",
      "#d946ef",
      "#a855f7",
      "#8b5cf6",
      "#64748b",
      "#475569",
      "#334155",
      "#1e293b"
    ];
    const applySelectedColor = (newCol) => {
      currentColor = newCol;
      swatchCurrent.style.background = newCol;
      const hexLbl = infoDiv.querySelector(".current-hex-label");
      if (hexLbl)
        hexLbl.textContent = newCol;
      if (hexInp.value !== newCol)
        hexInp.value = newCol;
      onChange(newCol);
    };
    const buildGrid = (title, colors, canAddCustom = false) => {
      const sec = document.createElement("div");
      sec.style.cssText = "display: flex; flex-direction: column; gap: 4px;";
      const secHeader = document.createElement("div");
      secHeader.style.cssText = "display: flex; justify-content: space-between; align-items: center;";
      secHeader.innerHTML = `<span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">${title}</span>`;
      if (canAddCustom) {
        const btnManage = document.createElement("button");
        btnManage.type = "button";
        btnManage.style.cssText = "background: #1e293b; border: 1px solid #334155; color: #93c5fd; font-size: 10px; font-weight: 600; cursor: pointer; padding: 2px 7px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; transition: background 0.15s;";
        btnManage.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> <span>Editar</span>`;
        btnManage.addEventListener("mouseenter", () => btnManage.style.background = "#334155");
        btnManage.addEventListener("mouseleave", () => btnManage.style.background = "#1e293b");
        btnManage.addEventListener("click", (e) => {
          e.preventDefault();
          this.openFlowPaletteModal(() => {
            refreshPopover();
          });
        });
        secHeader.appendChild(btnManage);
      }
      sec.appendChild(secHeader);
      const grid = document.createElement("div");
      grid.style.cssText = "display: grid; grid-template-columns: repeat(10, 1fr); gap: 3px;";
      colors.forEach((c) => {
        const sw = document.createElement("button");
        sw.type = "button";
        sw.title = c;
        sw.style.cssText = `
          width: 100%;
          height: 18px;
          background: ${c};
          border: 1px solid ${c.toLowerCase() === "#ffffff" ? "#475569" : "#00000040"};
          border-radius: 2px;
          cursor: pointer;
          padding: 0;
          transition: transform 0.1s;
        `;
        sw.addEventListener("mouseenter", () => sw.style.transform = "scale(1.2)");
        sw.addEventListener("mouseleave", () => sw.style.transform = "scale(1)");
        sw.addEventListener("click", (e) => {
          e.preventDefault();
          applySelectedColor(c);
        });
        grid.appendChild(sw);
      });
      sec.appendChild(grid);
      return sec;
    };
    const customSpectrumCard = document.createElement("div");
    customSpectrumCard.style.cssText = `
      display: none;
      flex-direction: column;
      gap: 8px;
      background: #0b0f19;
      border: 1.5px solid #3b82f6;
      border-radius: 8px;
      padding: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
      width: 100%;
      box-sizing: border-box;
      position: relative;
    `;
    const spectrumCanvas = document.createElement("canvas");
    spectrumCanvas.width = 240;
    spectrumCanvas.height = 110;
    spectrumCanvas.style.cssText = "width: 100%; height: 110px; border-radius: 6px; cursor: crosshair; display: block; border: 1px solid #1e293b;";
    const hueSlider = document.createElement("input");
    hueSlider.type = "range";
    hueSlider.min = "0";
    hueSlider.max = "360";
    hueSlider.value = "239";
    hueSlider.style.cssText = `
      width: 100%;
      height: 12px;
      border-radius: 6px;
      outline: none;
      -webkit-appearance: none;
      background: linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);
      cursor: pointer;
      margin: 2px 0;
    `;
    let currentHue = 239;
    const drawSpectrum = (hue) => {
      const ctx = spectrumCanvas.getContext("2d");
      if (!ctx)
        return;
      const w = spectrumCanvas.width;
      const h = spectrumCanvas.height;
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillRect(0, 0, w, h);
      const whiteGrad = ctx.createLinearGradient(0, 0, w, 0);
      whiteGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
      whiteGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = whiteGrad;
      ctx.fillRect(0, 0, w, h);
      const blackGrad = ctx.createLinearGradient(0, 0, 0, h);
      blackGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      blackGrad.addColorStop(1, "rgba(0, 0, 0, 1)");
      ctx.fillStyle = blackGrad;
      ctx.fillRect(0, 0, w, h);
    };
    const pickColorFromCanvas = (e) => {
      const rect = spectrumCanvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0)
        return;
      const x = Math.max(0, Math.min(spectrumCanvas.width - 1, Math.round((e.clientX - rect.left) / rect.width * spectrumCanvas.width)));
      const y = Math.max(0, Math.min(spectrumCanvas.height - 1, Math.round((e.clientY - rect.top) / rect.height * spectrumCanvas.height)));
      const ctx = spectrumCanvas.getContext("2d");
      if (!ctx)
        return;
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
      applySelectedColor(hex);
    };
    let isCanvasDragging = false;
    spectrumCanvas.addEventListener("mousedown", (e) => {
      isCanvasDragging = true;
      pickColorFromCanvas(e);
    });
    window.addEventListener("mousemove", (e) => {
      if (isCanvasDragging)
        pickColorFromCanvas(e);
    });
    window.addEventListener("mouseup", () => {
      isCanvasDragging = false;
    });
    hueSlider.addEventListener("input", () => {
      currentHue = Number(hueSlider.value);
      drawSpectrum(currentHue);
    });
    const nativeColorBtn = document.createElement("button");
    nativeColorBtn.type = "button";
    nativeColorBtn.title = "Alternar espectro RGB personalizado";
    nativeColorBtn.style.cssText = "width: 34px; height: 32px; flex-shrink: 0; border: 1.5px solid #475569; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; background: conic-gradient(red, yellow, lime, cyan, blue, magenta, red); box-shadow: 0 1px 4px rgba(0,0,0,0.4); padding: 0; outline: none; transition: all 0.15s;";
    nativeColorBtn.addEventListener("mouseenter", () => nativeColorBtn.style.transform = "scale(1.05)");
    nativeColorBtn.addEventListener("mouseleave", () => nativeColorBtn.style.transform = "scale(1)");
    nativeColorBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isVisible = customSpectrumCard.style.display === "flex";
      if (!isVisible) {
        customSpectrumCard.style.display = "flex";
        nativeColorBtn.style.borderColor = "#6366f1";
        requestAnimationFrame(() => drawSpectrum(currentHue));
      } else {
        customSpectrumCard.style.display = "none";
        nativeColorBtn.style.borderColor = "#475569";
      }
    });
    const hexInp = document.createElement("input");
    hexInp.type = "text";
    hexInp.value = currentColor || "#6366f1";
    hexInp.placeholder = "#ffffff";
    hexInp.style.cssText = "width: 72px; min-width: 0; flex: 1 1 auto; padding: 5px 6px; font-size: 11px; font-family: monospace; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px; box-sizing: border-box;";
    const btnSaveToFlowPalette = document.createElement("button");
    btnSaveToFlowPalette.type = "button";
    btnSaveToFlowPalette.title = "Salvar esta cor no grupo de cores do fluxo";
    btnSaveToFlowPalette.style.cssText = "flex-shrink: 0; padding: 5px 8px; font-size: 10px; font-weight: 600; background: #3b82f620; border: 1px solid #3b82f660; color: #93c5fd; border-radius: 4px; cursor: pointer; white-space: nowrap; transition: background 0.15s;";
    btnSaveToFlowPalette.textContent = "+ Salvar no Fluxo";
    btnSaveToFlowPalette.addEventListener("mouseenter", () => btnSaveToFlowPalette.style.background = "#3b82f635");
    btnSaveToFlowPalette.addEventListener("mouseleave", () => btnSaveToFlowPalette.style.background = "#3b82f620");
    hexInp.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (val.startsWith("#") && (val.length === 4 || val.length === 7)) {
        applySelectedColor(val);
      }
    });
    btnSaveToFlowPalette.addEventListener("click", (e) => {
      e.preventDefault();
      const palette = this.getFlowColorPalette();
      if (!palette.some((c) => c.toLowerCase() === currentColor.toLowerCase())) {
        palette.push(currentColor);
        this.getGraph().colorPalette = palette;
        this.showToast(`Cor ${currentColor} adicionada ao grupo de cores do fluxo!`, "success");
        this.onPaletteChanged?.();
        refreshPopover();
      } else {
        this.showToast("Esta cor j\xE1 est\xE1 no grupo de cores do fluxo.", "info");
      }
    });
    customSpectrumCard.appendChild(spectrumCanvas);
    customSpectrumCard.appendChild(hueSlider);
    const editorCompletoRow = document.createElement("div");
    editorCompletoRow.style.cssText = "display: flex; align-items: center; gap: 6px; padding-top: 6px; border-top: 1px solid #1e293b; width: 100%; box-sizing: border-box; position: relative; z-index: 10000;";
    editorCompletoRow.appendChild(nativeColorBtn);
    editorCompletoRow.appendChild(hexInp);
    editorCompletoRow.appendChild(btnSaveToFlowPalette);
    const refreshPopover = () => {
      popoverPanel.innerHTML = "";
      const flowPalette = this.getFlowColorPalette();
      if (flowPalette.length > 0) {
        popoverPanel.appendChild(buildGrid("Cores do Fluxo", flowPalette, true));
      }
      popoverPanel.appendChild(buildGrid("Cores Principais", mainBaseColors));
      popoverPanel.appendChild(buildGrid("Cores Modernas", modernColors));
      popoverPanel.appendChild(editorCompletoRow);
      popoverPanel.appendChild(customSpectrumCard);
      hexInp.value = currentColor;
    };
    const togglePopover = (open) => {
      const currentlyOpen = popoverPanel.style.display === "flex";
      const shouldOpen = open !== void 0 ? open : !currentlyOpen;
      if (shouldOpen) {
        refreshPopover();
        popoverPanel.style.display = "flex";
        btnMoreColors.style.background = "#334155";
        btnMoreColors.style.borderColor = "#6366f1";
        if (customSpectrumCard.style.display === "flex") {
          requestAnimationFrame(() => drawSpectrum(currentHue));
        }
        requestAnimationFrame(() => {
          popoverPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      } else {
        popoverPanel.style.display = "none";
        btnMoreColors.style.background = "#1e293b";
        btnMoreColors.style.borderColor = "#334155";
      }
    };
    btnMoreColors.addEventListener("click", (e) => {
      e.preventDefault();
      togglePopover();
    });
    swatchCurrent.addEventListener("click", (e) => {
      e.preventDefault();
      togglePopover();
    });
    const onPaletteUpdatedHandler = () => {
      if (popoverPanel.style.display === "flex") {
        refreshPopover();
      }
    };
    window.addEventListener("flow-palette-updated", onPaletteUpdatedHandler);
    group.appendChild(popoverPanel);
    container.appendChild(group);
  }
};

// src/editor/modules/codeEditorSuggestions.ts
var JS_BUILTIN_SUGGESTIONS = [
  { label: "const", type: "keyword", insertText: "const ", detail: "keyword" },
  { label: "let", type: "keyword", insertText: "let ", detail: "keyword" },
  { label: "var", type: "keyword", insertText: "var ", detail: "keyword" },
  { label: "function", type: "keyword", insertText: "function () {\n  \n}", detail: "keyword", cursorOffset: 9 },
  { label: "return", type: "keyword", insertText: "return ", detail: "keyword" },
  { label: "if", type: "snippet", insertText: "if () {\n  \n}", detail: "statement", cursorOffset: 4 },
  { label: "ifelse", type: "snippet", insertText: "if () {\n  \n} else {\n  \n}", detail: "statement", cursorOffset: 4 },
  { label: "else", type: "keyword", insertText: "else {\n  \n}", detail: "keyword", cursorOffset: 7 },
  { label: "for", type: "snippet", insertText: "for (let i = 0; i < length; i++) {\n  \n}", detail: "loop", cursorOffset: 20 },
  { label: "forof", type: "snippet", insertText: "for (const item of items) {\n  \n}", detail: "loop", cursorOffset: 19 },
  { label: "while", type: "snippet", insertText: "while () {\n  \n}", detail: "loop", cursorOffset: 7 },
  { label: "switch", type: "snippet", insertText: "switch (key) {\n  case value:\n    break;\n  default:\n    break;\n}", detail: "statement", cursorOffset: 8 },
  { label: "trycatch", type: "snippet", insertText: "try {\n  \n} catch (error) {\n  console.error(error);\n}", detail: "statement", cursorOffset: 8 },
  { label: "async", type: "keyword", insertText: "async ", detail: "keyword" },
  { label: "await", type: "keyword", insertText: "await ", detail: "keyword" },
  { label: "true", type: "keyword", insertText: "true", detail: "boolean" },
  { label: "false", type: "keyword", insertText: "false", detail: "boolean" },
  { label: "null", type: "keyword", insertText: "null", detail: "value" },
  { label: "undefined", type: "keyword", insertText: "undefined", detail: "value" },
  // APIs JavaScript & Navegador
  { label: "console.log", type: "function", insertText: "console.log();", detail: "log to console", cursorOffset: 12 },
  { label: "console.error", type: "function", insertText: "console.error();", detail: "error log", cursorOffset: 14 },
  { label: "console.warn", type: "function", insertText: "console.warn();", detail: "warning log", cursorOffset: 13 },
  { label: "document.querySelector", type: "function", insertText: "document.querySelector('')", detail: "DOM query", cursorOffset: 23 },
  { label: "document.querySelectorAll", type: "function", insertText: "document.querySelectorAll('')", detail: "DOM queries", cursorOffset: 26 },
  { label: "document.getElementById", type: "function", insertText: "document.getElementById('')", detail: "DOM element", cursorOffset: 24 },
  { label: "addEventListener", type: "function", insertText: "addEventListener('', (e) => {\n  \n});", detail: "event", cursorOffset: 17 },
  { label: "setTimeout", type: "function", insertText: "setTimeout(() => {\n  \n}, 1000);", detail: "timer", cursorOffset: 15 },
  { label: "setInterval", type: "function", insertText: "setInterval(() => {\n  \n}, 1000);", detail: "interval", cursorOffset: 16 },
  { label: "fetch", type: "function", insertText: "fetch('').then(res => res.json())", detail: "HTTP fetch", cursorOffset: 7 },
  { label: "JSON.stringify", type: "function", insertText: "JSON.stringify()", detail: "serialize JSON", cursorOffset: 15 },
  { label: "JSON.parse", type: "function", insertText: "JSON.parse()", detail: "parse JSON", cursorOffset: 11 },
  { label: "Array.map", type: "function", insertText: "map((item) => )", detail: "transform array", cursorOffset: 15 },
  { label: "Array.filter", type: "function", insertText: "filter((item) => )", detail: "filter array", cursorOffset: 17 },
  { label: "Array.forEach", type: "function", insertText: "forEach((item) => {\n  \n})", detail: "iterate array", cursorOffset: 20 },
  { label: "Array.find", type: "function", insertText: "find((item) => )", detail: "find item", cursorOffset: 15 },
  { label: "window.location.href", type: "property", insertText: "window.location.href", detail: "current URL" },
  { label: "window.localStorage", type: "property", insertText: "window.localStorage", detail: "localStorage" }
];
var CSS_SUGGESTIONS = [
  { label: "display", type: "property", insertText: "display: flex;", detail: "layout" },
  { label: "display: flex", type: "property", insertText: "display: flex;\n", detail: "layout" },
  { label: "display: grid", type: "property", insertText: "display: grid;\n", detail: "layout" },
  { label: "display: none", type: "property", insertText: "display: none;\n", detail: "layout" },
  { label: "flex-direction", type: "property", insertText: "flex-direction: column;", detail: "flex" },
  { label: "justify-content", type: "property", insertText: "justify-content: center;", detail: "alignment" },
  { label: "align-items", type: "property", insertText: "align-items: center;", detail: "alignment" },
  { label: "gap", type: "property", insertText: "gap: 8px;", detail: "spacing" },
  { label: "color", type: "property", insertText: "color: #ffffff;", detail: "text color" },
  { label: "background", type: "property", insertText: "background: #000000;", detail: "background" },
  { label: "background-color", type: "property", insertText: "background-color: #000000;", detail: "background" },
  { label: "padding", type: "property", insertText: "padding: 10px;", detail: "spacing" },
  { label: "margin", type: "property", insertText: "margin: 0;", detail: "spacing" },
  { label: "width", type: "property", insertText: "width: 100%;", detail: "dimension" },
  { label: "height", type: "property", insertText: "height: 100%;", detail: "dimension" },
  { label: "max-width", type: "property", insertText: "max-width: 1200px;", detail: "dimension" },
  { label: "min-height", type: "property", insertText: "min-height: 100vh;", detail: "dimension" },
  { label: "font-size", type: "property", insertText: "font-size: 14px;", detail: "typography" },
  { label: "font-weight", type: "property", insertText: "font-weight: 600;", detail: "typography" },
  { label: "font-family", type: "property", insertText: "font-family: -apple-system, sans-serif;", detail: "typography" },
  { label: "border", type: "property", insertText: "border: 1px solid #e2e8f0;", detail: "border" },
  { label: "border-radius", type: "property", insertText: "border-radius: 8px;", detail: "border" },
  { label: "position", type: "property", insertText: "position: relative;", detail: "position" },
  { label: "position: absolute", type: "property", insertText: "position: absolute;\ntop: 0;\nleft: 0;\n", detail: "position" },
  { label: "position: fixed", type: "property", insertText: "position: fixed;\ntop: 0;\nleft: 0;\n", detail: "position" },
  { label: "overflow", type: "property", insertText: "overflow: hidden;", detail: "overflow" },
  { label: "cursor", type: "property", insertText: "cursor: pointer;", detail: "cursor" },
  { label: "opacity", type: "property", insertText: "opacity: 1;", detail: "opacity" },
  { label: "box-shadow", type: "property", insertText: "box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);", detail: "shadow" },
  { label: "transition", type: "property", insertText: "transition: all 0.2s ease;", detail: "animation" },
  { label: "z-index", type: "property", insertText: "z-index: 10;", detail: "stacking" }
];
var HTML_SUGGESTIONS = [
  { label: "div", type: "tag", insertText: "<div>\n  \n</div>", detail: "block container", cursorOffset: 8 },
  { label: "span", type: "tag", insertText: "<span></span>", detail: "inline container", cursorOffset: 6 },
  { label: "button", type: "tag", insertText: '<button type="button"></button>', detail: "button element", cursorOffset: 22 },
  { label: "input", type: "tag", insertText: '<input type="text" placeholder="" />', detail: "input element", cursorOffset: 32 },
  { label: "a", type: "tag", insertText: '<a href="#"></a>', detail: "anchor link", cursorOffset: 12 },
  { label: "p", type: "tag", insertText: "<p></p>", detail: "paragraph", cursorOffset: 3 },
  { label: "h1", type: "tag", insertText: "<h1></h1>", detail: "heading 1", cursorOffset: 4 },
  { label: "h2", type: "tag", insertText: "<h2></h2>", detail: "heading 2", cursorOffset: 4 },
  { label: "h3", type: "tag", insertText: "<h3></h3>", detail: "heading 3", cursorOffset: 4 },
  { label: "ul", type: "tag", insertText: "<ul>\n  <li></li>\n</ul>", detail: "unordered list", cursorOffset: 11 },
  { label: "li", type: "tag", insertText: "<li></li>", detail: "list item", cursorOffset: 4 },
  { label: "form", type: "tag", insertText: "<form>\n  \n</form>", detail: "form container", cursorOffset: 9 },
  { label: "table", type: "tag", insertText: "<table>\n  <tr>\n    <td></td>\n  </tr>\n</table>", detail: "table element", cursorOffset: 22 },
  { label: "img", type: "tag", insertText: '<img src="" alt="" />', detail: "image element", cursorOffset: 10 },
  { label: "label", type: "tag", insertText: "<label></label>", detail: "input label", cursorOffset: 7 },
  { label: "select", type: "tag", insertText: '<select>\n  <option value="1">Op\xE7\xE3o 1</option>\n</select>', detail: "select dropdown", cursorOffset: 8 },
  { label: "textarea", type: "tag", insertText: "<textarea></textarea>", detail: "multiline input", cursorOffset: 10 },
  { label: "script", type: "tag", insertText: "<script>\n  \n<\/script>", detail: "javascript script tag", cursorOffset: 11 },
  { label: "style", type: "tag", insertText: "<style>\n  \n</style>", detail: "css style tag", cursorOffset: 10 },
  { label: "class", type: "property", insertText: 'class=""', detail: "attribute", cursorOffset: 7 },
  { label: "id", type: "property", insertText: 'id=""', detail: "attribute", cursorOffset: 4 },
  { label: "style-attr", type: "property", insertText: 'style=""', detail: "style attribute", cursorOffset: 7 }
];

// src/editor/modules/codeSyntaxValidator.ts
var CodeSyntaxValidator = class {
  static validate(code, lang) {
    const trimmed = code.trim();
    if (!trimmed)
      return null;
    if (lang === "javascript") {
      return this.validateJavaScript(code);
    } else if (lang === "html") {
      return this.validateHTML(code);
    } else if (lang === "css") {
      return this.validateCSS(code);
    }
    return null;
  }
  static validateJavaScript(code) {
    const lines = code.split("\n");
    const stack = [];
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inTemplate = false;
    let inLineComment = false;
    let inBlockComment = false;
    let isEscaped = false;
    for (let l = 0; l < lines.length; l++) {
      const line = lines[l];
      inLineComment = false;
      for (let c = 0; c < line.length; c++) {
        const ch = line[c];
        const next = line[c + 1];
        if (isEscaped) {
          isEscaped = false;
          continue;
        }
        if (ch === "\\" && (inSingleQuote || inDoubleQuote || inTemplate)) {
          isEscaped = true;
          continue;
        }
        if (inLineComment)
          continue;
        if (inBlockComment) {
          if (ch === "*" && next === "/") {
            inBlockComment = false;
            c++;
          }
          continue;
        }
        if (!inSingleQuote && !inDoubleQuote && !inTemplate) {
          if (ch === "/" && next === "/") {
            inLineComment = true;
            c++;
            continue;
          }
          if (ch === "/" && next === "*") {
            inBlockComment = true;
            c++;
            continue;
          }
        }
        if (ch === "'" && !inDoubleQuote && !inTemplate) {
          inSingleQuote = !inSingleQuote;
          continue;
        }
        if (ch === '"' && !inSingleQuote && !inTemplate) {
          inDoubleQuote = !inDoubleQuote;
          continue;
        }
        if (ch === "`" && !inSingleQuote && !inDoubleQuote) {
          inTemplate = !inTemplate;
          continue;
        }
        if (inSingleQuote || inDoubleQuote || inTemplate) {
          continue;
        }
        if (ch === "(" || ch === "[" || ch === "{") {
          stack.push({ char: ch, line: l + 1, col: c + 1 });
        } else if (ch === ")" || ch === "]" || ch === "}") {
          const matchPairs = { ")": "(", "]": "[", "}": "{" };
          const expectedOpen = matchPairs[ch];
          if (stack.length === 0) {
            return {
              line: l + 1,
              column: c + 1,
              message: `Caractere de fechamento inesperado "${ch}"`
            };
          }
          const last = stack.pop();
          if (last.char !== expectedOpen) {
            return {
              line: l + 1,
              column: c + 1,
              message: `Fechamento com "${ch}" n\xE3o corresponde a "${last.char}" aberto na linha ${last.line}`
            };
          }
        }
      }
      if (inSingleQuote || inDoubleQuote) {
        return {
          line: l + 1,
          message: "String literal n\xE3o finalizada"
        };
      }
    }
    if (inBlockComment) {
      return {
        line: lines.length,
        message: "Coment\xE1rio de bloco /* ... */ n\xE3o foi fechado"
      };
    }
    if (inTemplate) {
      return {
        line: lines.length,
        message: "Template literal (crases `...`) n\xE3o foi fechado"
      };
    }
    if (stack.length > 0) {
      const unclosed = stack[stack.length - 1];
      const names = { "(": 'par\xEAnteses "("', "[": 'colchetes "["', "{": 'chaves "{"' };
      return {
        line: unclosed.line,
        column: unclosed.col,
        message: `Bloco com ${names[unclosed.char] || unclosed.char} aberto na linha ${unclosed.line} n\xE3o foi fechado`
      };
    }
    return null;
  }
  static validateHTML(code) {
    const tagRegex = /<\/?([a-zA-Z0-9_-]+)(?:\s+[^>]*)?\/?>/g;
    const stack = [];
    const lines = code.split("\n");
    const voidTags = /* @__PURE__ */ new Set([
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
      "!doctype"
    ]);
    for (let lIdx = 0; lIdx < lines.length; lIdx++) {
      const lineText = lines[lIdx];
      let tMatch;
      while ((tMatch = tagRegex.exec(lineText)) !== null) {
        const rawTag = tMatch[0];
        const tagName = tMatch[1].toLowerCase();
        if (voidTags.has(tagName) || rawTag.endsWith("/>")) {
          continue;
        }
        if (rawTag.startsWith("</")) {
          if (stack.length === 0) {
            return {
              line: lIdx + 1,
              message: `Tag de fechamento inesperada </${tagName}> sem tag de abertura`
            };
          }
          const last = stack.pop();
          if (last.tag !== tagName) {
            return {
              line: lIdx + 1,
              message: `Tag </${tagName}> fecha incorretamente a tag anterior <${last.tag}> (linha ${last.line})`
            };
          }
        } else if (!rawTag.startsWith("<!--")) {
          stack.push({ tag: tagName, line: lIdx + 1 });
        }
      }
    }
    if (stack.length > 0) {
      const unclosed = stack[stack.length - 1];
      return {
        line: unclosed.line,
        message: `A tag <${unclosed.tag}> aberta na linha ${unclosed.line} n\xE3o foi fechada`
      };
    }
    return null;
  }
  static validateCSS(code) {
    let openBraces = 0;
    let lastOpenLine = 1;
    const lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const char of line) {
        if (char === "{") {
          openBraces++;
          lastOpenLine = i + 1;
        } else if (char === "}") {
          openBraces--;
          if (openBraces < 0) {
            return {
              line: i + 1,
              message: 'Chave de fechamento "}" inesperada em CSS'
            };
          }
        }
      }
    }
    if (openBraces > 0) {
      return {
        line: lastOpenLine,
        message: `Bloco CSS aberto na linha ${lastOpenLine} n\xE3o foi fechado com "}"`
      };
    }
    return null;
  }
};

// src/editor/modules/codeFormatter.ts
var CodeFormatter = class {
  static format(code, lang) {
    const trimmed = code.trim();
    if (!trimmed)
      return code;
    try {
      if (lang === "javascript") {
        return this.beautifyJS(trimmed);
      } else if (lang === "html") {
        return this.beautifyHTML(trimmed);
      } else if (lang === "css") {
        return this.beautifyCSS(trimmed);
      }
    } catch (e) {
      console.warn("Erro ao formatar c\xF3digo:", e);
    }
    return code;
  }
  static beautifyJS(code) {
    const lines = code.split("\n");
    let indentLevel = 0;
    const indentStr = "  ";
    return lines.map((rawLine) => {
      const line = rawLine.trim();
      if (!line)
        return "";
      if (/^[}\])]/.test(line)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      const res = indentStr.repeat(indentLevel) + line;
      const opens = (line.match(/[{\[(]/g) || []).length;
      const closes = (line.match(/[}\])]/g) || []).length;
      indentLevel = Math.max(0, indentLevel + (opens - closes));
      return res;
    }).join("\n");
  }
  static beautifyCSS(code) {
    return code.replace(/\{/g, " {\n").replace(/;/g, ";\n").replace(/\}/g, "\n}\n").split("\n").map((l) => l.trim()).filter((l) => l.length > 0).map((l) => l.includes("{") || l.includes("}") ? l : "  " + l).join("\n");
  }
  static beautifyHTML(code) {
    const tokens = code.replace(/>\s*</g, ">\n<").split("\n");
    let indent = 0;
    const indentStr = "  ";
    return tokens.map((line) => {
      const trimmed = line.trim();
      if (!trimmed)
        return "";
      if (/^<\/[a-zA-Z0-9_-]+>/.test(trimmed)) {
        indent = Math.max(0, indent - 1);
      }
      const res = indentStr.repeat(indent) + trimmed;
      if (/^<[a-zA-Z0-9_-]+(\s+[^>]*)?>/.test(trimmed) && !trimmed.endsWith("/>") && !/^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i.test(trimmed)) {
        indent++;
      }
      return res;
    }).join("\n");
  }
};

// src/editor/modules/codeSyntaxHighlighter.ts
var CodeSyntaxHighlighter = class {
  static highlight(code, lang, error) {
    if (!code) {
      return "";
    }
    const placeholders = [];
    const saveToken = (html) => {
      const idx = placeholders.length;
      placeholders.push(html);
      return String.fromCharCode(57600 + idx);
    };
    let text = code;
    if (lang === "javascript") {
      text = text.replace(/(\/\*[\s\S]*?\*\/|\/\/[^\n]*)/g, (match) => {
        return saveToken(`<span class="tok-com">${this.escapeHtml(match)}</span>`);
      });
      text = text.replace(/(`(?:\\`|[\s\S])*?`|"(?:\\"|[^"\n])*"|'(?:\\'|[^'\n])*')/g, (match) => {
        return saveToken(`<span class="tok-str">${this.escapeHtml(match)}</span>`);
      });
      text = text.replace(/(\/(?![*\/])(?:\\\/|[^\/\n])+\/[gimsuy]*)(?=\s*[,;)\].]|\s*$)/g, (match) => {
        return saveToken(`<span class="tok-str">${this.escapeHtml(match)}</span>`);
      });
      text = this.escapeHtml(text);
      const kwRegex = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|class|extends|async|await|import|export|from|default|this|typeof|instanceof|void|delete|in|of)\b/g;
      text = text.replace(kwRegex, (m) => saveToken(`<span class="tok-kw">${m}</span>`));
      text = text.replace(/\b(true|false|null|undefined|NaN)\b/g, (m) => saveToken(`<span class="tok-bool">${m}</span>`));
      text = text.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g, (m) => saveToken(`<span class="tok-fn">${m}</span>`));
      text = text.replace(/\b(\d+(?:\.\d+)?)\b/g, (m) => saveToken(`<span class="tok-num">${m}</span>`));
    } else if (lang === "css") {
      text = text.replace(/(\/\*[\s\S]*?\*\/)/g, (match) => {
        return saveToken(`<span class="tok-com">${this.escapeHtml(match)}</span>`);
      });
      text = text.replace(/("(?:\\"|[^"\n])*"|'(?:\\'|[^'\n])*')/g, (match) => {
        return saveToken(`<span class="tok-str">${this.escapeHtml(match)}</span>`);
      });
      text = this.escapeHtml(text);
      text = text.replace(/([.#][a-zA-Z0-9_-]+)/g, (m) => saveToken(`<span class="tok-fn">${m}</span>`));
      text = text.replace(/([a-zA-Z-]+)(?=\s*:)/g, (m) => saveToken(`<span class="tok-kw">${m}</span>`));
      text = text.replace(/\b(\d+(?:px|em|rem|%|vh|vw|s|ms|deg)?)\b/g, (m) => saveToken(`<span class="tok-num">${m}</span>`));
    } else if (lang === "html") {
      text = text.replace(/(<!--[\s\S]*?-->)/g, (match) => {
        return saveToken(`<span class="tok-com">${this.escapeHtml(match)}</span>`);
      });
      text = this.escapeHtml(text);
      text = text.replace(/(&lt;\/?[a-zA-Z0-9_-]+)([\s\S]*?)(&gt;|\/&gt;)/g, (match, openTag, attrs, closeTag) => {
        const highlightedTag = saveToken(`<span class="tok-kw">${openTag}</span>`);
        let highlightedAttrs = attrs;
        highlightedAttrs = highlightedAttrs.replace(/(=)(&quot;[\s\S]*?&quot;|&#39;[\s\S]*?&#39;|"[^"]*"|'[^']*')/g, (m, eq, val) => {
          return eq + saveToken(`<span class="tok-str">${val}</span>`);
        });
        highlightedAttrs = highlightedAttrs.replace(/\b([a-zA-Z_:-]+)(?=\s*=)/g, (m, attrName) => {
          return saveToken(`<span class="tok-fn">${attrName}</span>`);
        });
        const highlightedClose = saveToken(`<span class="tok-kw">${closeTag}</span>`);
        return highlightedTag + highlightedAttrs + highlightedClose;
      });
    } else {
      text = this.escapeHtml(text);
    }
    text = text.replace(/[\uE100-\uF8FF]/g, (char) => {
      const idx = char.charCodeAt(0) - 57600;
      return placeholders[idx] ?? "";
    });
    if (error && error.line) {
      const lines = text.split("\n");
      const errIdx = error.line - 1;
      if (errIdx >= 0 && errIdx < lines.length) {
        const lineContent = lines[errIdx];
        if (lineContent.trim()) {
          lines[errIdx] = `<span class="code-syntax-error" title="${this.escapeHtml(error.message)}">${lineContent}</span>`;
          text = lines.join("\n");
        }
      }
    }
    return text;
  }
  static escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
};

// src/editor/modules/codeEditorComponent.ts
var CodeEditorComponent = class _CodeEditorComponent {
  container;
  textarea;
  lineNumbersEl;
  highlightLayer;
  statusLangEl;
  statusPosEl;
  statusErrorEl;
  currentLanguage;
  currentValue;
  onChange;
  // Autocomplete
  autocompletePopup;
  autocompleteListEl;
  isAutocompleteOpen = false;
  autocompleteItems = [];
  selectedAutocompleteIndex = 0;
  currentPrefix = "";
  prefixStart = 0;
  // Diagnóstico de Sintaxe
  currentSyntaxError = null;
  // Code Folding (Recolher e expandir funções e blocos)
  foldedRanges = [];
  // Histórico de Desfazer (Undo) e Fazer (Redo)
  historyStack = [];
  historyIndex = -1;
  isApplyingHistory = false;
  historyDebounceTimer;
  btnUndo;
  btnRedo;
  constructor(options) {
    this.currentLanguage = options.language;
    this.currentValue = options.value || "";
    this.onChange = options.onChange;
    this.container = document.createElement("div");
    this.container.className = `code-editor-component lang-${this.currentLanguage}`;
    if (options.height) {
      this.container.style.height = options.height;
    }
    this.buildDOM(options);
    this.bindEvents();
    this.initHistory();
    this.updateEditor();
  }
  getElement() {
    return this.container;
  }
  setValue(val) {
    this.currentValue = val;
    this.textarea.value = val;
    this.initHistory();
    this.updateEditor();
  }
  getValue() {
    return this.currentValue;
  }
  /**
   * Abre um editor de código em um modal centralizado e proeminente sobre o canvas
   */
  static openCodeModal(params) {
    const existing = document.getElementById("codeEditorCanvasModalBackdrop");
    existing?.remove();
    const backdrop = document.createElement("div");
    backdrop.id = "codeEditorCanvasModalBackdrop";
    backdrop.className = "flow-modal-backdrop";
    const langName = {
      javascript: "JavaScript",
      html: "HTML",
      css: "CSS"
    }[params.language];
    const langColor = {
      javascript: "#f59e0b",
      html: "#ec4899",
      css: "#06b6d4"
    }[params.language];
    backdrop.innerHTML = `
      <div class="code-modal-card">
        <div class="code-modal-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(99, 102, 241, 0.15); display: flex; align-items: center; justify-content: center; color: ${langColor};">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h3 style="font-size: 15px; font-weight: 700; color: #f8fafc; margin: 0;">${params.title}</h3>
                <span style="font-size: 10px; background: #1e293b; color: ${langColor}; padding: 2px 6px; border-radius: 4px; font-weight: 700; text-transform: uppercase;">${langName}</span>
              </div>
              <p style="font-size: 11px; color: #94a3b8; margin: 2px 0 0 0;">Editor de c\xF3digo sobre o canvas com destaque e auto-indenta\xE7\xE3o</p>
            </div>
          </div>
          <button id="btnCloseCodeModal" class="sidebar-toggle-btn" title="Fechar editor (Esc)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="code-modal-body">
          <!-- Editor montado aqui -->
        </div>
        <div class="code-modal-footer">
          <span style="font-size: 11px; color: #64748b; margin-right: auto;">Pressione <strong>Tab</strong> para indentar \u2022 <strong>Esc</strong> para fechar</span>
          <button id="btnCancelCodeModal" class="btn btn-secondary">Cancelar</button>
          <button id="btnSaveCodeModal" class="btn btn-primary">Salvar C\xF3digo</button>
        </div>
      </div>
    `;
    const bodyEl = backdrop.querySelector(".code-modal-body");
    let localValue = params.value || "";
    const editor = new _CodeEditorComponent({
      language: params.language,
      value: localValue,
      title: params.title,
      height: "100%",
      onChange: (val) => {
        localValue = val;
      }
    });
    bodyEl.appendChild(editor.getElement());
    const close = () => {
      window.removeEventListener("keydown", onKeyDown);
      backdrop.remove();
    };
    const saveAndClose = () => {
      params.onSave(localValue);
      close();
    };
    backdrop.querySelector("#btnCloseCodeModal")?.addEventListener("click", close);
    backdrop.querySelector("#btnCancelCodeModal")?.addEventListener("click", close);
    backdrop.querySelector("#btnSaveCodeModal")?.addEventListener("click", saveAndClose);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        e.stopPropagation();
      }
    });
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.appendChild(backdrop);
  }
  buildDOM(options) {
    const langLabel = {
      javascript: "JavaScript",
      html: "HTML",
      css: "CSS"
    }[this.currentLanguage];
    this.container.innerHTML = `
      <div class="code-editor-toolbar">
        <div class="code-editor-toolbar-left">
          <span class="code-editor-lang-badge">${langLabel}</span>
          <span class="code-editor-title">${options.title || "Editor de C\xF3digo"}</span>
        </div>
        <div class="code-editor-toolbar-actions">
          <button type="button" class="ce-btn btn-undo-code" title="Desfazer (Ctrl+Z)" disabled>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
            <span>Desfazer</span>
          </button>
          <button type="button" class="ce-btn btn-redo-code" title="Fazer (Ctrl+Y / Ctrl+Shift+Z)" disabled>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
            <span>Fazer</span>
          </button>
          <button type="button" class="ce-btn btn-format-code" title="Formatar / Auto-indentar c\xF3digo">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>Formatar</span>
          </button>
          <button type="button" class="ce-btn btn-select-all-code" title="Selecionar Todo o C\xF3digo (Ctrl+A)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 3v18"/><path d="M15 3v18"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
            <span>Selecionar</span>
          </button>
          <button type="button" class="ce-btn btn-copy-code" title="Copiar c\xF3digo">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Copiar</span>
          </button>
          <button type="button" class="ce-btn btn-fullscreen-code" title="Expandir editor em tela cheia">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
          </button>
        </div>
      </div>

      <div class="code-editor-main">
        <div class="code-editor-gutters">
          <div class="code-editor-line-numbers">1</div>
        </div>
        <div class="code-editor-content-wrapper">
          <pre class="code-editor-highlight-layer" aria-hidden="true"><code></code></pre>
          <textarea
            class="code-editor-textarea"
            spellcheck="false"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            placeholder="${options.placeholder || "Digite seu c\xF3digo aqui..."}"
          ></textarea>
          <div class="code-editor-autocomplete-popup" style="display: none;">
            <ul class="code-editor-autocomplete-list"></ul>
          </div>
        </div>
      </div>

      <div class="code-editor-statusbar">
        <span class="ce-status-lang">${langLabel} (UTF-8)</span>
        <span class="ce-status-error valid" title="Verifica\xE7\xE3o de Sintaxe">\u2713 Sem erros</span>
        <span class="ce-status-pos">Lin 1, Col 1</span>
      </div>
    `;
    this.textarea = this.container.querySelector(".code-editor-textarea");
    this.lineNumbersEl = this.container.querySelector(".code-editor-line-numbers");
    this.highlightLayer = this.container.querySelector(".code-editor-highlight-layer code");
    this.statusLangEl = this.container.querySelector(".ce-status-lang");
    this.statusPosEl = this.container.querySelector(".ce-status-pos");
    this.statusErrorEl = this.container.querySelector(".ce-status-error");
    this.autocompletePopup = this.container.querySelector(".code-editor-autocomplete-popup");
    this.autocompleteListEl = this.container.querySelector(".code-editor-autocomplete-list");
    this.btnUndo = this.container.querySelector(".btn-undo-code");
    this.btnRedo = this.container.querySelector(".btn-redo-code");
    this.textarea.value = this.currentValue;
  }
  bindEvents() {
    this.textarea.addEventListener("input", () => {
      this.currentValue = this.textarea.value;
      this.recordHistory(this.currentValue, this.textarea.selectionStart, this.textarea.selectionEnd);
      this.updateEditor();
      this.onChange(this.currentValue);
      this.triggerAutocomplete();
    });
    this.textarea.addEventListener("scroll", () => {
      this.syncScroll();
      if (this.isAutocompleteOpen) {
        this.positionAutocompletePopup();
      }
    });
    this.textarea.addEventListener("keydown", (e) => {
      if (this.handleAutocompleteKeydown(e)) {
        return;
      }
      this.handleKeydown(e);
      this.updateCursorStatus();
    });
    this.textarea.addEventListener("keyup", (e) => {
      if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
        this.triggerAutocomplete();
      }
      this.updateCursorStatus();
    });
    this.textarea.addEventListener("click", () => {
      this.closeAutocomplete();
      this.updateCursorStatus();
    });
    this.textarea.addEventListener("blur", () => {
      setTimeout(() => this.closeAutocomplete(), 200);
    });
    this.textarea.addEventListener("focus", () => this.updateCursorStatus());
    this.btnUndo?.addEventListener("click", () => {
      this.undo();
    });
    this.btnRedo?.addEventListener("click", () => {
      this.redo();
    });
    const copyBtn = this.container.querySelector(".btn-copy-code");
    copyBtn?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(this.currentValue);
        const span = copyBtn.querySelector("span");
        if (span) {
          const old = span.textContent;
          span.textContent = "Copiado!";
          setTimeout(() => {
            span.textContent = old;
          }, 1500);
        }
      } catch (e) {
        console.error(e);
      }
    });
    const formatBtn = this.container.querySelector(".btn-format-code");
    formatBtn?.addEventListener("click", () => {
      this.formatCode();
    });
    const selectAllBtn = this.container.querySelector(".btn-select-all-code");
    selectAllBtn?.addEventListener("click", () => {
      this.textarea.focus();
      this.textarea.setSelectionRange(0, this.textarea.value.length);
      this.updateCursorStatus();
    });
    const fullscreenBtn = this.container.querySelector(".btn-fullscreen-code");
    fullscreenBtn?.addEventListener("click", () => {
      this.toggleFullscreen();
    });
  }
  handleKeydown(e) {
    const textarea = this.textarea;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    if ((e.ctrlKey || e.metaKey) && (e.key === "a" || e.key === "A")) {
      e.preventDefault();
      textarea.focus();
      textarea.setSelectionRange(0, textarea.value.length);
      this.updateCursorStatus();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
      e.preventDefault();
      if (e.shiftKey) {
        this.redo();
      } else {
        this.undo();
      }
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "Y")) {
      e.preventDefault();
      this.redo();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const tabStr = "  ";
      if (start === end) {
        textarea.value = value.substring(0, start) + tabStr + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + tabStr.length;
      } else {
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        const lineEnd = value.indexOf("\n", end);
        const effectiveEnd = lineEnd === -1 ? value.length : lineEnd;
        const selectedBlock = value.substring(lineStart, effectiveEnd);
        const lines = selectedBlock.split("\n");
        let modified = "";
        if (e.shiftKey) {
          modified = lines.map((l) => l.startsWith("  ") ? l.substring(2) : l.startsWith(" ") ? l.substring(1) : l).join("\n");
        } else {
          modified = lines.map((l) => tabStr + l).join("\n");
        }
        textarea.value = value.substring(0, lineStart) + modified + value.substring(effectiveEnd);
        textarea.selectionStart = lineStart;
        textarea.selectionEnd = lineStart + modified.length;
      }
      this.currentValue = textarea.value;
      this.updateEditor();
      this.onChange(this.currentValue);
      return;
    }
    const pairs = {
      "(": ")",
      "{": "}",
      "[": "]",
      "'": "'",
      '"': '"',
      "`": "`"
    };
    if (pairs[e.key]) {
      const open = e.key;
      const close = pairs[open];
      if (start !== end) {
        e.preventDefault();
        const selected = value.substring(start, end);
        textarea.value = value.substring(0, start) + open + selected + close + value.substring(end);
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = end + 1;
        this.currentValue = textarea.value;
        this.updateEditor();
        this.onChange(this.currentValue);
        return;
      }
      if (["(", "{", "["].includes(open)) {
        e.preventDefault();
        textarea.value = value.substring(0, start) + open + close + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        this.currentValue = textarea.value;
        this.updateEditor();
        this.onChange(this.currentValue);
        return;
      }
    }
    if ([")", "}", "]", "'", '"', "`"].includes(e.key) && start === end && value[start] === e.key) {
      e.preventDefault();
      textarea.selectionStart = textarea.selectionEnd = start + 1;
      return;
    }
    if (e.key === "Enter") {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const currentLine = value.substring(lineStart, start);
      const matchIndent = currentLine.match(/^(\s+)/);
      let indent = matchIndent ? matchIndent[1] : "";
      const prevChar = value.charAt(start - 1);
      const nextChar = value.charAt(start);
      if (prevChar === "{" || prevChar === "[") {
        e.preventDefault();
        const extraIndent = indent + "  ";
        if (nextChar === "}" || nextChar === "]") {
          textarea.value = value.substring(0, start) + "\n" + extraIndent + "\n" + indent + value.substring(start);
          textarea.selectionStart = textarea.selectionEnd = start + 1 + extraIndent.length;
        } else {
          textarea.value = value.substring(0, start) + "\n" + extraIndent + value.substring(start);
          textarea.selectionStart = textarea.selectionEnd = start + 1 + extraIndent.length;
        }
        this.currentValue = textarea.value;
        this.updateEditor();
        this.onChange(this.currentValue);
        return;
      }
      if (indent.length > 0) {
        e.preventDefault();
        textarea.value = value.substring(0, start) + "\n" + indent + value.substring(start);
        textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length;
        this.currentValue = textarea.value;
        this.updateEditor();
        this.onChange(this.currentValue);
        return;
      }
    }
  }
  /* ========================================================== */
  /* SISTEMA DE AUTOCOMPLETE INTELIGENTE (JS, HTML, CSS)        */
  /* ========================================================== */
  handleAutocompleteKeydown(e) {
    if (!this.isAutocompleteOpen) {
      if ((e.ctrlKey || e.metaKey) && e.key === " ") {
        e.preventDefault();
        this.triggerAutocomplete(true);
        return true;
      }
      return false;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.selectedAutocompleteIndex = (this.selectedAutocompleteIndex + 1) % this.autocompleteItems.length;
      this.renderAutocompleteList();
      return true;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      this.selectedAutocompleteIndex = (this.selectedAutocompleteIndex - 1 + this.autocompleteItems.length) % this.autocompleteItems.length;
      this.renderAutocompleteList();
      return true;
    }
    if (e.key === "Enter" || e.key === "Tab") {
      if (this.autocompleteItems.length > 0) {
        e.preventDefault();
        this.applyAutocomplete(this.autocompleteItems[this.selectedAutocompleteIndex]);
        return true;
      }
    }
    if (e.key === "Escape") {
      e.preventDefault();
      this.closeAutocomplete();
      return true;
    }
    return false;
  }
  triggerAutocomplete(force = false) {
    const textarea = this.textarea;
    const pos = textarea.selectionStart;
    const value = textarea.value;
    const leftText = value.substring(0, pos);
    const match = leftText.match(/([a-zA-Z0-9_$-]+)$/);
    if (!match && !force) {
      this.closeAutocomplete();
      return;
    }
    const prefix = match ? match[1] : "";
    this.currentPrefix = prefix;
    this.prefixStart = pos - prefix.length;
    if (!force && prefix.length === 0) {
      this.closeAutocomplete();
      return;
    }
    const suggestions = this.getMixedSuggestions(pos);
    const filtered = suggestions.filter((item) => {
      if (!prefix)
        return true;
      return item.label.toLowerCase().startsWith(prefix.toLowerCase());
    });
    if (filtered.length === 0) {
      this.closeAutocomplete();
      return;
    }
    this.autocompleteItems = filtered.slice(0, 20);
    this.selectedAutocompleteIndex = 0;
    this.isAutocompleteOpen = true;
    this.renderAutocompleteList();
    this.positionAutocompletePopup();
  }
  renderAutocompleteList() {
    this.autocompleteListEl.innerHTML = "";
    this.autocompleteItems.forEach((item, idx) => {
      const li = document.createElement("li");
      li.className = `code-editor-autocomplete-item ${idx === this.selectedAutocompleteIndex ? "active" : ""}`;
      const iconLetter = {
        keyword: "K",
        function: "F",
        variable: "V",
        property: "P",
        tag: "T",
        snippet: "S"
      }[item.type] || "A";
      li.innerHTML = `
        <span class="ac-icon ac-icon-${item.type}">${iconLetter}</span>
        <span class="ac-label">${item.label}</span>
        <span class="ac-type">${item.detail || item.type}</span>
      `;
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        this.applyAutocomplete(item);
      });
      this.autocompleteListEl.appendChild(li);
    });
    this.autocompletePopup.style.display = "block";
    const activeEl = this.autocompleteListEl.children[this.selectedAutocompleteIndex];
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }
  positionAutocompletePopup() {
    const textarea = this.textarea;
    const textBefore = textarea.value.substring(0, textarea.selectionStart);
    const lines = textBefore.split("\n");
    const currentLineIdx = lines.length - 1;
    const currentColIdx = lines[currentLineIdx].length;
    const lineHeight = 18;
    const charWidth = 7.2;
    const top = Math.max(10, (currentLineIdx + 1) * lineHeight - textarea.scrollTop + 14);
    const left = Math.min(Math.max(10, currentColIdx * charWidth - textarea.scrollLeft + 12), textarea.clientWidth - 280);
    this.autocompletePopup.style.top = `${top}px`;
    this.autocompletePopup.style.left = `${left}px`;
  }
  applyAutocomplete(item) {
    const textarea = this.textarea;
    const value = textarea.value;
    const before = value.substring(0, this.prefixStart);
    const after = value.substring(textarea.selectionEnd);
    const insertedText = item.insertText;
    textarea.value = before + insertedText + after;
    const cursorOffset = item.cursorOffset !== void 0 ? item.cursorOffset : insertedText.length;
    const newCursor = this.prefixStart + cursorOffset;
    textarea.selectionStart = textarea.selectionEnd = newCursor;
    this.currentValue = textarea.value;
    this.updateEditor();
    this.onChange(this.currentValue);
    this.closeAutocomplete();
    textarea.focus();
  }
  closeAutocomplete() {
    this.isAutocompleteOpen = false;
    this.autocompletePopup.style.display = "none";
  }
  getLanguageSuggestions(lang) {
    if (lang === "javascript") {
      const declared = this.extractDeclaredIdentifiers(this.currentValue);
      const builtins = JS_BUILTIN_SUGGESTIONS;
      const seen = /* @__PURE__ */ new Set();
      const combined = [];
      declared.forEach((item) => {
        if (!seen.has(item.label)) {
          seen.add(item.label);
          combined.push(item);
        }
      });
      builtins.forEach((item) => {
        if (!seen.has(item.label)) {
          seen.add(item.label);
          combined.push(item);
        }
      });
      return combined;
    } else if (lang === "css") {
      return CSS_SUGGESTIONS;
    } else if (lang === "html") {
      return HTML_SUGGESTIONS;
    }
    return [];
  }
  /**
   * Obtém sugestões para códigos mistos (JS, HTML e CSS combinados),
   * detectando quais linguagens estão presentes no código e priorizando
   * o contexto específico que está sendo editado na posição do cursor.
   */
  getMixedSuggestions(cursorPos) {
    const code = this.currentValue || "";
    const textBeforeCursor = code.substring(0, cursorPos);
    const hasJsInDoc = this.currentLanguage === "javascript" || /<script\b/i.test(code) || /\b(function|const|let|var|document\.|window\.|console\.|=>|addEventListener|return|async|await)\b/.test(code);
    const hasCssInDoc = this.currentLanguage === "css" || /<style\b/i.test(code) || /\b(style\s*=|display\s*:|color\s*:|background\s*:|margin\s*:|padding\s*:|font-size\s*:|border\s*:|width\s*:|height\s*:)\b/i.test(code);
    const hasHtmlInDoc = this.currentLanguage === "html" || /<\/?[a-z][\s\S]*>/i.test(code) || /<!DOCTYPE\b/i.test(code);
    let cursorLang = this.currentLanguage;
    const lastOpenScript = textBeforeCursor.lastIndexOf("<script");
    const lastCloseScript = textBeforeCursor.lastIndexOf("<\/script>");
    const isInsideScriptTag = lastOpenScript !== -1 && lastOpenScript > lastCloseScript;
    const lastOpenStyle = textBeforeCursor.lastIndexOf("<style");
    const lastCloseStyle = textBeforeCursor.lastIndexOf("</style>");
    const isInsideStyleTag = lastOpenStyle !== -1 && lastOpenStyle > lastCloseStyle;
    const lastStyleAttrDbl = textBeforeCursor.lastIndexOf('style="');
    const lastStyleAttrSgl = textBeforeCursor.lastIndexOf("style='");
    const styleAttrIdx = Math.max(lastStyleAttrDbl, lastStyleAttrSgl);
    const quoteChar = styleAttrIdx !== -1 ? textBeforeCursor[styleAttrIdx + 6] : "";
    const isInsideStyleAttr = styleAttrIdx !== -1 && textBeforeCursor.indexOf(quoteChar, styleAttrIdx + 7) === -1;
    const inlineEventMatch = textBeforeCursor.match(/on[a-z]+\s*=\s*["']([^"']*)$/i);
    if (isInsideScriptTag || inlineEventMatch) {
      cursorLang = "javascript";
    } else if (isInsideStyleTag || isInsideStyleAttr) {
      cursorLang = "css";
    } else if (this.currentLanguage === "html") {
      cursorLang = "html";
    } else if (this.currentLanguage === "javascript") {
      const lastLeftAngle = textBeforeCursor.lastIndexOf("<");
      const lastRightAngle = textBeforeCursor.lastIndexOf(">");
      if (lastLeftAngle > lastRightAngle) {
        cursorLang = "html";
      } else {
        cursorLang = "javascript";
      }
    } else if (this.currentLanguage === "css") {
      cursorLang = "css";
    }
    const jsItems = hasJsInDoc ? this.getLanguageSuggestions("javascript").map((item) => ({
      ...item,
      detail: item.detail ? `[JS] ${item.detail}` : "[JS]"
    })) : [];
    const cssItems = hasCssInDoc ? CSS_SUGGESTIONS.map((item) => ({
      ...item,
      detail: item.detail ? `[CSS] ${item.detail}` : "[CSS]"
    })) : [];
    const htmlItems = hasHtmlInDoc ? HTML_SUGGESTIONS.map((item) => ({
      ...item,
      detail: item.detail ? `[HTML] ${item.detail}` : "[HTML]"
    })) : [];
    let prioritizedLists = [];
    if (cursorLang === "javascript") {
      prioritizedLists = [jsItems, htmlItems, cssItems];
    } else if (cursorLang === "css") {
      prioritizedLists = [cssItems, htmlItems, jsItems];
    } else {
      prioritizedLists = [htmlItems, jsItems, cssItems];
    }
    const seen = /* @__PURE__ */ new Set();
    const combined = [];
    for (const list of prioritizedLists) {
      for (const item of list) {
        const key = `${item.label}::${item.type}`;
        if (!seen.has(key)) {
          seen.add(key);
          combined.push(item);
        }
      }
    }
    if (combined.length === 0) {
      return this.getLanguageSuggestions(this.currentLanguage);
    }
    return combined;
  }
  /**
   * Extrai variáveis, constantes e funções declaradas pelo usuário no próprio código JS
   */
  extractDeclaredIdentifiers(code) {
    const items = [];
    const seen = /* @__PURE__ */ new Set();
    const addIdentifier = (name, type, detail) => {
      if (name && !seen.has(name) && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
        seen.add(name);
        items.push({
          label: name,
          type,
          insertText: type === "function" ? `${name}()` : name,
          detail,
          cursorOffset: type === "function" ? name.length + 1 : name.length
        });
      }
    };
    const varRegex = /\b(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$,\s=]+)/g;
    let match;
    while ((match = varRegex.exec(code)) !== null) {
      const declStr = match[1];
      const parts = declStr.split(",");
      for (const part of parts) {
        const idMatch = part.trim().match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
        if (idMatch) {
          addIdentifier(idMatch[1], "variable", "local variable");
        }
      }
    }
    const fnRegex = /\bfunction\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
    while ((match = fnRegex.exec(code)) !== null) {
      addIdentifier(match[1], "function", "function");
    }
    const arrowFnRegex = /\b(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/g;
    while ((match = arrowFnRegex.exec(code)) !== null) {
      addIdentifier(match[1], "function", "arrow function");
    }
    const paramRegex = /\(([^)]+)\)\s*(?:=>|\{)/g;
    while ((match = paramRegex.exec(code)) !== null) {
      const params = match[1].split(",");
      for (const p of params) {
        const pClean = p.trim().match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
        if (pClean && !["const", "let", "var", "function"].includes(pClean[1])) {
          addIdentifier(pClean[1], "variable", "parameter");
        }
      }
    }
    return items;
  }
  /**
   * Valida sintaxe em tempo real para JS, HTML e CSS delegada ao CodeSyntaxValidator
   */
  validateSyntax(code, lang) {
    return CodeSyntaxValidator.validate(code, lang);
  }
  /**
   * Detecta blocos dobráveis (funções, chaves {}, tags multilinhas)
   */
  detectFoldableRanges(code) {
    const lines = code.split("\n");
    const ranges = [];
    const stack = [];
    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;
      for (let i = 0; i < lineText.length; i++) {
        const char = lineText[i];
        if (char === "{") {
          stack.push({ line: lineNum });
        } else if (char === "}") {
          const top = stack.pop();
          if (top && top.line < lineNum) {
            ranges.push({ startLine: top.line, endLine: lineNum });
          }
        }
      }
    });
    return ranges;
  }
  toggleFoldAtLine(lineNum) {
    const existingIndex = this.foldedRanges.findIndex((r) => r.startLine === lineNum);
    if (existingIndex !== -1) {
      const range = this.foldedRanges[existingIndex];
      this.foldedRanges.splice(existingIndex, 1);
      this.unfoldRangeInText(range);
    } else {
      const ranges = this.detectFoldableRanges(this.textarea.value);
      const match = ranges.find((r) => r.startLine === lineNum);
      if (match) {
        this.foldRangeInText(match.startLine, match.endLine);
      }
    }
  }
  foldRangeInText(startLine, endLine) {
    const lines = this.textarea.value.split("\n");
    if (startLine > lines.length || endLine > lines.length || startLine >= endLine)
      return;
    const hiddenLines = lines.slice(startLine, endLine);
    const preview = ` /* ... ${hiddenLines.length} linhas ... */ `;
    this.foldedRanges.push({
      startLine,
      endLine,
      preview: hiddenLines.join("\n")
    });
    const startText = lines[startLine - 1];
    const endText = lines[endLine - 1].trim();
    lines[startLine - 1] = `${startText}...}${endText !== "}" && endText.endsWith("}") ? "" : endText === "}" ? "" : " " + endText}`;
    lines.splice(startLine, endLine - startLine);
    this.textarea.value = lines.join("\n");
    this.currentValue = this.textarea.value;
    this.updateEditor();
    this.onChange(this.currentValue);
  }
  unfoldRangeInText(range) {
    const lines = this.textarea.value.split("\n");
    const startIdx = range.startLine - 1;
    if (startIdx >= lines.length)
      return;
    const currentStartLine = lines[startIdx];
    const cleanStart = currentStartLine.replace(/\.\.\.\}.*$/, "");
    const hiddenLines = range.preview.split("\n");
    lines.splice(startIdx, 1, cleanStart, ...hiddenLines);
    this.textarea.value = lines.join("\n");
    this.currentValue = this.textarea.value;
    this.updateEditor();
    this.onChange(this.currentValue);
  }
  updateEditor() {
    this.currentSyntaxError = this.validateSyntax(this.currentValue, this.currentLanguage);
    if (this.statusErrorEl) {
      if (this.currentSyntaxError) {
        this.statusErrorEl.className = "ce-status-error";
        const lineInfo = this.currentSyntaxError.line ? ` (Lin ${this.currentSyntaxError.line})` : "";
        this.statusErrorEl.textContent = `\u26A0 ${this.currentSyntaxError.message}${lineInfo}`;
        this.statusErrorEl.title = this.currentSyntaxError.message;
      } else {
        this.statusErrorEl.className = "ce-status-error valid";
        this.statusErrorEl.textContent = "\u2713 Sem erros";
        this.statusErrorEl.title = "Sintaxe v\xE1lida";
      }
    }
    const lines = this.currentValue.split("\n");
    const lineCount = lines.length || 1;
    const foldableRanges = this.detectFoldableRanges(this.currentValue);
    const foldableStartLines = new Set(foldableRanges.map((r) => r.startLine));
    const foldedStartLines = new Set(this.foldedRanges.map((r) => r.startLine));
    let numbersHtml = "";
    for (let i = 1; i <= lineCount; i++) {
      const isErrLine = this.currentSyntaxError?.line === i;
      const isFoldable = foldableStartLines.has(i);
      const isFolded = foldedStartLines.has(i);
      let foldBtn = "";
      if (isFolded) {
        foldBtn = `<span class="ce-fold-btn folded" data-line="${i}" title="Expandir bloco">\u25B6</span>`;
      } else if (isFoldable) {
        foldBtn = `<span class="ce-fold-btn" data-line="${i}" title="Recolher bloco">\u25BC</span>`;
      } else {
        foldBtn = `<span class="ce-fold-placeholder"></span>`;
      }
      numbersHtml += `
        <div class="ce-line-gutter-row" style="${isErrLine ? "color: #f43f5e; font-weight: bold;" : ""}">
          ${foldBtn}
          <span class="ce-line-num">${i}</span>
        </div>
      `;
    }
    this.lineNumbersEl.innerHTML = numbersHtml;
    this.lineNumbersEl.querySelectorAll(".ce-fold-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const line = parseInt(btn.dataset.line || "0", 10);
        if (line > 0) {
          this.toggleFoldAtLine(line);
        }
      });
    });
    this.highlightLayer.innerHTML = CodeSyntaxHighlighter.highlight(this.currentValue, this.currentLanguage, this.currentSyntaxError) + "\n";
    this.syncScroll();
    this.updateCursorStatus();
    this.updateHistoryButtons();
  }
  /**
   * Inicializa a pilha de histórico com o estado inicial
   */
  initHistory() {
    this.historyStack = [{
      value: this.currentValue,
      selectionStart: this.textarea.selectionStart || 0,
      selectionEnd: this.textarea.selectionEnd || 0
    }];
    this.historyIndex = 0;
    this.updateHistoryButtons();
  }
  /**
   * Registra uma nova alteração no histórico (com debounce de digitação e corte da pilha)
   */
  recordHistory(val, selStart, selEnd) {
    if (this.isApplyingHistory)
      return;
    if (this.historyDebounceTimer) {
      window.clearTimeout(this.historyDebounceTimer);
    }
    this.historyDebounceTimer = window.setTimeout(() => {
      const currentEntry = this.historyStack[this.historyIndex];
      if (currentEntry && currentEntry.value === val)
        return;
      this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
      if (this.historyStack.length >= 100) {
        this.historyStack.shift();
      }
      this.historyStack.push({
        value: val,
        selectionStart: selStart,
        selectionEnd: selEnd
      });
      this.historyIndex = this.historyStack.length - 1;
      this.updateHistoryButtons();
    }, 250);
  }
  /**
   * Desfaz a última alteração (Undo)
   */
  undo() {
    if (this.historyIndex <= 0)
      return;
    this.historyIndex--;
    const state = this.historyStack[this.historyIndex];
    if (!state)
      return;
    this.isApplyingHistory = true;
    this.currentValue = state.value;
    this.textarea.value = state.value;
    this.textarea.selectionStart = state.selectionStart;
    this.textarea.selectionEnd = state.selectionEnd;
    this.updateEditor();
    this.onChange(this.currentValue);
    this.isApplyingHistory = false;
    this.updateHistoryButtons();
  }
  /**
   * Refaz a alteração desfeita (Redo)
   */
  redo() {
    if (this.historyIndex >= this.historyStack.length - 1)
      return;
    this.historyIndex++;
    const state = this.historyStack[this.historyIndex];
    if (!state)
      return;
    this.isApplyingHistory = true;
    this.currentValue = state.value;
    this.textarea.value = state.value;
    this.textarea.selectionStart = state.selectionStart;
    this.textarea.selectionEnd = state.selectionEnd;
    this.updateEditor();
    this.onChange(this.currentValue);
    this.isApplyingHistory = false;
    this.updateHistoryButtons();
  }
  /**
   * Atualiza o estado de habilitação/desabilitação dos botões da Toolbar
   */
  updateHistoryButtons() {
    if (this.btnUndo) {
      this.btnUndo.disabled = this.historyIndex <= 0;
    }
    if (this.btnRedo) {
      this.btnRedo.disabled = this.historyIndex >= this.historyStack.length - 1;
    }
  }
  syncScroll() {
    const st = this.textarea.scrollTop;
    const sl = this.textarea.scrollLeft;
    const layer = this.container.querySelector(".code-editor-highlight-layer");
    if (layer) {
      layer.scrollTop = st;
      layer.scrollLeft = sl;
    }
    const gutters = this.container.querySelector(".code-editor-gutters");
    if (gutters) {
      gutters.scrollTop = st;
    }
  }
  updateCursorStatus() {
    const text = this.textarea.value.substring(0, this.textarea.selectionStart);
    const lines = text.split("\n");
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    this.statusPosEl.textContent = `Lin ${line}, Col ${col}`;
  }
  formatCode() {
    const formatted = CodeFormatter.format(this.currentValue, this.currentLanguage);
    if (formatted !== this.currentValue) {
      this.setValue(formatted);
      this.onChange(formatted);
    }
  }
  toggleFullscreen() {
    const isFs = this.container.classList.toggle("is-fullscreen");
    const fsBtn = this.container.querySelector(".btn-fullscreen-code");
    if (isFs) {
      document.body.classList.add("code-editor-fs-open");
      if (fsBtn) {
        fsBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
        `;
      }
    } else {
      document.body.classList.remove("code-editor-fs-open");
      if (fsBtn) {
        fsBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
        `;
      }
    }
    setTimeout(() => this.syncScroll(), 50);
  }
};

// src/editor/modules/htmlElementAnalyzer.ts
var HtmlElementAnalyzer = class {
  static activeCallback;
  static modalBackdrop;
  /**
   * Abre o Inspetor/Analisador de HTML.
   * Se for passado onSelectSelector, ao escolher um elemento, esse seletor é retornado no callback.
   */
  static open(onSelectSelector) {
    this.activeCallback = onSelectSelector;
    this.renderModal();
  }
  /**
   * Inicia o modo de seleção interativo na aba web ativa usando o content script
   */
  static startLivePicker(onPicked) {
    if (onPicked) {
      this.activeCallback = onPicked;
    }
    if (!chrome.tabs) {
      const mockSelector = prompt("Digite o seletor CSS do elemento ou use o Analisador:", "#main-content");
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
        alert(
          "Nenhuma aba de p\xE1gina web aberta (http/https/file) foi encontrada.\nPor favor, abra um site no navegador para selecionar elementos."
        );
        return;
      }
      const targetTabId = targetTab.id;
      chrome.tabs.update(targetTabId, { active: true }, () => {
        chrome.tabs.sendMessage(targetTabId, { action: "START_ELEMENT_PICKER" }, (response) => {
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
                  chrome.tabs.sendMessage(targetTabId, { action: "START_ELEMENT_PICKER" }, () => {
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
   * Conecta o ouvinte para receber elementos capturados do Content Script
   */
  static initMessageListener() {
    if (!chrome.runtime?.onMessage)
      return;
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === "ELEMENT_PICKED_EVENT") {
        const { selector, analysis } = message.payload || {};
        if (selector) {
          if (this.activeCallback) {
            this.activeCallback(selector);
          }
          this.showAnalysisModal(analysis || { target: { selector, tagName: "ELEMENT", classes: [] }, children: [] });
        }
      }
    });
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
      <div id="analyzerDragHandle" title="Segure CTRL e arraste para mover" style="padding: 6px 10px; background: #131d35; border-bottom: 1px solid #1e293b; display: flex; align-items: center; justify-content: space-between; gap: 8px; user-select: none;">
        <span style="font-size: 12px; font-weight: 700; color: #f8fafc;">\u{1F50D} Analisador HTML <span style="font-weight: 400; color: #64748b; font-size: 10px;">(CTRL + arrastar)</span></span>
        <button id="btnCloseAnalyzer" title="Fechar e desativar" style="background: transparent; border: none; color: #94a3b8; font-size: 15px; cursor: pointer; padding: 0 4px; border-radius: 4px;">\u2715</button>
      </div>
      <div id="analyzerBodyContent" style="padding: 8px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
        <button type="button" id="btnPickFromWebPage" class="btn btn-primary" style="background: #3b82f6; border-color: #3b82f6; padding: 6px 10px; font-size: 11px; font-weight: 600; cursor: pointer;">\u{1F3AF} Ativar Mira na P\xE1gina</button>
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
    panel.addEventListener("mousedown", (e) => {
      if (!e.ctrlKey || e.button !== 0)
        return;
      e.preventDefault();
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
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });
    document.body.appendChild(panel);
    this.modalBackdrop = panel;
  }
  static closeModal() {
    this.modalBackdrop?.remove();
    document.querySelectorAll(".html-analyzer-modal").forEach((el) => el.remove());
    this.modalBackdrop = void 0;
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

// src/editor/modules/inspectorInputHelpers.ts
var InspectorInputHelpers = class {
  static addTextInput(container, labelText, value, onChange) {
    const group = document.createElement("div");
    group.className = "form-group";
    group.innerHTML = `<label>${labelText}</label><input type="text" value="${value ?? ""}" />`;
    group.querySelector("input")?.addEventListener("input", (e) => onChange(e.target.value));
    container.appendChild(group);
  }
  /**
   * Adiciona um campo de seletor com botão de mira/analisador de HTML integrado
   */
  static addSelectorInput(container, labelText, value, onChange, placeholder = "ex: #meu-elemento, .btn-primary, [data-id]") {
    const group = document.createElement("div");
    group.className = "form-group";
    group.innerHTML = `
      <label>${labelText}</label>
      <div style="display: flex; gap: 6px; align-items: center;">
        <input type="text" value="${value ?? ""}" placeholder="${placeholder}" style="flex: 1;" />
        <button type="button" class="btn btn-secondary btn-launch-analyzer" title="Ativar Analisador de HTML / Mira na P\xE1gina" style="padding: 6px 10px; font-size: 11px; white-space: nowrap; display: flex; align-items: center; gap: 4px; border-color: #6366f1; background: rgba(99, 102, 241, 0.15); color: #c7d2fe; cursor: pointer; border-radius: 6px;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <span>Mirar</span>
        </button>
      </div>
    `;
    const inputEl = group.querySelector("input");
    inputEl?.addEventListener("input", (e) => onChange(e.target.value));
    const btnAnalyzer = group.querySelector(".btn-launch-analyzer");
    btnAnalyzer?.addEventListener("click", () => {
      HtmlElementAnalyzer.startLivePicker((pickedSelector) => {
        if (inputEl) {
          inputEl.value = pickedSelector;
        }
        onChange(pickedSelector);
      });
    });
    container.appendChild(group);
  }
  static addNumberInput(container, labelText, value, onChange) {
    const group = document.createElement("div");
    group.className = "form-group";
    group.innerHTML = `<label>${labelText}</label><input type="number" value="${value ?? 0}" />`;
    group.querySelector("input")?.addEventListener("input", (e) => onChange(Number(e.target.value)));
    container.appendChild(group);
  }
  static addSelectInput(container, labelText, selectedValue, options, onChange) {
    const group = document.createElement("div");
    group.className = "form-group";
    let optionsHtml = "";
    options.forEach((opt) => {
      const isSelected = String(selectedValue) === opt.value;
      optionsHtml += `<option value="${opt.value}" ${isSelected ? "selected" : ""}>${opt.label}</option>`;
    });
    group.innerHTML = `<label>${labelText}</label><select>${optionsHtml}</select>`;
    const selectEl = group.querySelector("select");
    if (selectEl) {
      selectEl.value = String(selectedValue ?? "");
      selectEl.addEventListener("change", (e) => {
        onChange(e.target.value);
      });
      selectEl.addEventListener("input", (e) => {
        onChange(e.target.value);
      });
    }
    container.appendChild(group);
  }
  static addCheckboxInput(container, labelText, checked, onChange) {
    const group = document.createElement("div");
    group.className = "form-group";
    group.innerHTML = `
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
        <input type="checkbox" ${checked ? "checked" : ""} style="cursor:pointer;" />
        ${labelText}
      </label>
    `;
    group.querySelector("input")?.addEventListener("change", (e) => onChange(e.target.checked));
    container.appendChild(group);
  }
  static addTextareaInput(container, labelText, value, onChange) {
    const group = document.createElement("div");
    group.className = "form-group";
    group.innerHTML = `<label>${labelText}</label><textarea rows="4" style="min-height: 84px; line-height: 1.4; resize: vertical;">${value ?? ""}</textarea>`;
    group.querySelector("textarea")?.addEventListener("input", (e) => onChange(e.target.value));
    container.appendChild(group);
  }
  static addCodeEditorInput(container, labelText, language, value, onChange, onNodeDataChanged, showToast2, _height = "200px") {
    const isExpandedModal = Boolean(container.closest("#expandedNodeModalForm"));
    if (isExpandedModal) {
      const group2 = document.createElement("div");
      group2.className = "form-group code-editor-form-group";
      const label = document.createElement("label");
      label.textContent = labelText;
      group2.appendChild(label);
      const editor = new CodeEditorComponent({
        language,
        value: value || "",
        onChange,
        title: labelText,
        height: "240px"
      });
      group2.appendChild(editor.getElement());
      container.appendChild(group2);
      return;
    }
    const group = document.createElement("div");
    group.className = "form-group code-preview-group";
    const langBadgeColor = {
      javascript: "#f59e0b",
      html: "#ec4899",
      css: "#06b6d4"
    }[language];
    const langTitle = {
      javascript: "JS",
      html: "HTML",
      css: "CSS"
    }[language];
    const linesCount = (value || "").split("\n").length;
    const previewSnippet = (value || "").trim().split("\n").slice(0, 3).join("\n") || "// (sem c\xF3digo)";
    group.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <label style="margin-bottom: 0;">${labelText}</label>
        <span style="font-size: 10px; font-weight: 700; color: ${langBadgeColor}; background: rgba(255,255,255,0.06); padding: 1px 6px; border-radius: 4px;">${langTitle}</span>
      </div>
      <div class="code-field-trigger-card" title="Clique para abrir o editor de c\xF3digo completo sobre o canvas">
        <div class="code-field-trigger-header">
          <div style="display: flex; align-items: center; gap: 6px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${langBadgeColor}" stroke-width="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span style="font-size: 11px; font-weight: 600; color: #cbd5e1;">Editar ${langTitle}</span>
          </div>
          <span class="code-field-line-count" style="font-size: 10px; color: #64748b;">${linesCount} linha${linesCount === 1 ? "" : "s"}</span>
        </div>
        <pre class="code-field-preview-code"><code>${this.escapeSnippet(previewSnippet)}</code></pre>
        <div class="code-field-trigger-footer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          <span>Abrir Editor sobre o Canvas</span>
        </div>
      </div>
    `;
    const openEditor = () => {
      CodeEditorComponent.openCodeModal({
        title: labelText,
        language,
        value: value || "",
        onSave: (newVal) => {
          onChange(newVal);
          const newLines = (newVal || "").split("\n").length;
          const countEl = group.querySelector(".code-field-line-count");
          if (countEl)
            countEl.textContent = `${newLines} linha${newLines === 1 ? "" : "s"}`;
          const codeEl = group.querySelector(".code-field-preview-code code");
          if (codeEl) {
            const snip = (newVal || "").trim().split("\n").slice(0, 3).join("\n") || "// (sem c\xF3digo)";
            codeEl.innerHTML = this.escapeSnippet(snip);
          }
          if (onNodeDataChanged)
            onNodeDataChanged();
          if (showToast2)
            showToast2("C\xF3digo salvo com sucesso!", "success");
        }
      });
    };
    group.querySelector(".code-field-trigger-card")?.addEventListener("click", openEditor);
    container.appendChild(group);
  }
  static escapeSnippet(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
};

// src/editor/modules/inspector/flowProperties.ts
var FlowPropertiesRenderer = class {
  static renderDelay(form, data, ctx) {
    InspectorInputHelpers.addCheckboxInput(form, "Usar Tempo Rand\xF4mico", !!data.isRandom, (val) => {
      data.isRandom = val;
      if (val && !data.randomRange)
        data.randomRange = { minMs: 1e3, maxMs: 3e3 };
      ctx.renderInspector();
    });
    if (!data.isRandom) {
      InspectorInputHelpers.addNumberInput(form, "Atraso Fixo (ms)", data.fixedMs ?? 1500, (val) => data.fixedMs = val);
    } else {
      InspectorInputHelpers.addNumberInput(form, "Atraso M\xEDnimo (ms)", data.randomRange?.minMs ?? 1e3, (val) => {
        if (!data.randomRange)
          data.randomRange = { minMs: 1e3, maxMs: 3e3 };
        data.randomRange.minMs = val;
      });
      InspectorInputHelpers.addNumberInput(form, "Atraso M\xE1ximo (ms)", data.randomRange?.maxMs ?? 3e3, (val) => {
        if (!data.randomRange)
          data.randomRange = { minMs: 1e3, maxMs: 3e3 };
        data.randomRange.maxMs = val;
      });
    }
  }
  static renderSwitch(form, data, ctx) {
    InspectorInputHelpers.addSelectInput(
      form,
      "Modo de Execu\xE7\xE3o",
      data.executionMode || "first_match",
      [
        { value: "first_match", label: "Executar o primeiro que satisfizer" },
        { value: "all_matches_parallel", label: "Executar todos que satisfizerem em paralelo" }
      ],
      (val) => data.executionMode = val
    );
    InspectorInputHelpers.addCheckboxInput(
      form,
      "Possui Caminho Padr\xE3o (Default)",
      data.hasDefaultBranch !== false,
      (val) => data.hasDefaultBranch = val
    );
    const casesContainer = document.createElement("div");
    casesContainer.style.cssText = "border-top: 1px solid #243049; padding-top: 10px; margin-top: 10px; display: flex; flex-direction: column; gap: 8px;";
    const casesHeader = document.createElement("div");
    casesHeader.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;";
    casesHeader.innerHTML = `
      <label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Caminhos Condicionais (${Array.isArray(data.cases) ? data.cases.length : 0})</label>
      <span style="font-size: 10px; color: #64748b;">Clique para expandir/recolher</span>
    `;
    casesContainer.appendChild(casesHeader);
    if (!Array.isArray(data.cases))
      data.cases = [];
    data.cases.forEach((c, index) => {
      this.ensureConditionGroups(c);
      const isExpanded = ctx.expandedCaseIndices.has(index);
      const caseCard = document.createElement("div");
      caseCard.className = "switch-case-card-item";
      caseCard.setAttribute("data-case-index", String(index));
      caseCard.style.cssText = `background: #0f172a; border: 1px solid ${isExpanded ? "#3b82f6" : "#1e293b"}; border-radius: 6px; overflow: hidden; transition: border-color 0.15s;`;
      const accordionHeader = document.createElement("div");
      accordionHeader.style.cssText = `padding: 8px 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: ${isExpanded ? "#1e293b70" : "#0f172a"}; user-select: none; gap: 8px;`;
      const headerLeft = document.createElement("div");
      headerLeft.style.cssText = "display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0;";
      const iconSpan = document.createElement("span");
      iconSpan.style.cssText = "font-size: 10px; color: #94a3b8; transition: transform 0.15s;";
      iconSpan.textContent = isExpanded ? "\u25BC" : "\u25B6";
      const titleSpan = document.createElement("span");
      titleSpan.style.cssText = `font-size: 12px; font-weight: ${isExpanded ? "600" : "500"}; color: ${isExpanded ? "#60a5fa" : "#cbd5e1"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
      titleSpan.textContent = c.label || `Caso #${index + 1}`;
      headerLeft.appendChild(iconSpan);
      headerLeft.appendChild(titleSpan);
      const btnDel = document.createElement("button");
      btnDel.type = "button";
      btnDel.innerHTML = "&times;";
      btnDel.title = "Remover este caminho";
      btnDel.style.cssText = "background: transparent; color: #ef4444; border: none; font-size: 16px; cursor: pointer; line-height: 1; padding: 2px 4px;";
      btnDel.addEventListener("click", (e) => {
        e.stopPropagation();
        data.cases.splice(index, 1);
        ctx.renderInspector();
      });
      accordionHeader.appendChild(headerLeft);
      accordionHeader.appendChild(btnDel);
      accordionHeader.addEventListener("click", () => {
        if (ctx.expandedCaseIndices.has(index)) {
          ctx.expandedCaseIndices.delete(index);
        } else {
          ctx.expandedCaseIndices.add(index);
        }
        ctx.renderInspector();
      });
      caseCard.appendChild(accordionHeader);
      if (isExpanded) {
        const body = document.createElement("div");
        body.style.cssText = "padding: 10px; border-top: 1px solid #1e293b; display: flex; flex-direction: column; gap: 8px;";
        InspectorInputHelpers.addTextInput(body, "T\xEDtulo do Caminho", c.label || "", (val) => {
          c.label = val;
          titleSpan.textContent = val || `Caso #${index + 1}`;
          ctx.onNodeDataChanged();
        });
        const groupsBuilder = this.renderConditionGroupsBuilder(c, ctx);
        body.appendChild(groupsBuilder);
        caseCard.appendChild(body);
      }
      casesContainer.appendChild(caseCard);
    });
    const btnAddCase = document.createElement("button");
    btnAddCase.type = "button";
    btnAddCase.className = "btn-xs";
    btnAddCase.style.cssText = "width: 100%; margin-top: 4px; padding: 6px;";
    btnAddCase.textContent = "+ Adicionar Caminho Condicional";
    btnAddCase.addEventListener("click", () => {
      const newIdx = data.cases.length;
      data.cases.push({
        id: `case_${Date.now()}`,
        label: `Caso #${newIdx + 1}`,
        conditionGroups: [
          {
            id: `grp_${Date.now()}_0`,
            logicalOperator: "and",
            nextOperator: "or",
            rules: [
              {
                id: `rule_${Date.now()}_0`,
                evaluationMode: "comparison",
                leftOperand: "",
                operator: "equals",
                rightOperand: "",
                jsExpression: ""
              }
            ]
          }
        ]
      });
      ctx.expandedCaseIndices.add(newIdx);
      ctx.renderInspector(`.switch-case-card-item[data-case-index="${newIdx}"]`);
    });
    casesContainer.appendChild(btnAddCase);
    form.appendChild(casesContainer);
  }
  /**
   * Garante a inicialização consistente de conditionGroups a partir de dados existentes ou legados
   */
  static ensureConditionGroups(target) {
    if (!Array.isArray(target.conditionGroups) || target.conditionGroups.length === 0) {
      if (Array.isArray(target.rules) && target.rules.length > 0) {
        target.conditionGroups = [
          {
            id: `grp_${Date.now()}_0`,
            logicalOperator: target.logicalOperator || "and",
            nextOperator: "or",
            rules: JSON.parse(JSON.stringify(target.rules))
          }
        ];
      } else {
        target.conditionGroups = [
          {
            id: `grp_${Date.now()}_0`,
            logicalOperator: "and",
            nextOperator: "or",
            rules: [
              {
                id: `rule_${Date.now()}_0`,
                evaluationMode: target.evaluationMode || (target.jsExpression && !target.operator ? "js_eval" : "comparison"),
                leftOperand: target.leftOperand || "",
                operator: target.operator || "equals",
                rightOperand: target.rightOperand || "",
                jsExpression: target.jsExpression || ""
              }
            ]
          }
        ];
      }
    }
  }
  /**
   * Renderiza o construtor visual de grupos de condições com AND e OR:
   * ( (Expressão 1 AND Expressão 2) OU (Expressão 3 AND Expressão 4) OR Expressão 5 )
   */
  static renderConditionGroupsBuilder(dataObj, ctx) {
    this.ensureConditionGroups(dataObj);
    const container = document.createElement("div");
    container.style.cssText = "display: flex; flex-direction: column; gap: 8px; margin-top: 4px;";
    const header = document.createElement("div");
    header.style.cssText = "display: flex; justify-content: space-between; align-items: center;";
    header.innerHTML = `
      <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">L\xF3gica Combinada (E / OU)</span>
      <span style="font-size: 10px; color: #60a5fa;">${dataObj.conditionGroups.length} Grupo(s)</span>
    `;
    container.appendChild(header);
    dataObj.conditionGroups.forEach((group, gIdx) => {
      const isLastGroup = gIdx === dataObj.conditionGroups.length - 1;
      const groupEl = document.createElement("div");
      groupEl.style.cssText = "background: #080d1a; border: 1px solid #1e293b; border-radius: 6px; padding: 8px; display: flex; flex-direction: column; gap: 6px;";
      const groupHeader = document.createElement("div");
      groupHeader.style.cssText = "display: flex; justify-content: space-between; align-items: center; gap: 8px;";
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.value = group.name || group.label || `Grupo ${gIdx + 1}`;
      nameInput.className = "group-name-input";
      nameInput.placeholder = `Grupo ${gIdx + 1}`;
      nameInput.style.cssText = "background: #172033; border: 1px solid #243049; color: #f1f5f9; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; outline: none; flex: 1; max-width: 220px;";
      nameInput.addEventListener("focus", () => {
        nameInput.style.borderColor = "#6366f1";
      });
      nameInput.addEventListener("blur", () => {
        nameInput.style.borderColor = "#243049";
      });
      nameInput.addEventListener("input", (e) => {
        group.name = e.target.value;
        group.label = e.target.value;
        ctx.onNodeDataChanged();
      });
      groupHeader.appendChild(nameInput);
      if (dataObj.conditionGroups.length > 1) {
        const delGroupBtn = document.createElement("button");
        delGroupBtn.type = "button";
        delGroupBtn.innerHTML = "&times; Excluir";
        delGroupBtn.style.cssText = "background: transparent; color: #ef4444; border: none; font-size: 11px; font-weight: 600; cursor: pointer; padding: 2px 4px;";
        delGroupBtn.addEventListener("click", () => {
          dataObj.conditionGroups.splice(gIdx, 1);
          ctx.renderInspector();
          ctx.onNodeDataChanged();
        });
        groupHeader.appendChild(delGroupBtn);
      }
      groupEl.appendChild(groupHeader);
      const rulesList = document.createElement("div");
      rulesList.style.cssText = "display: flex; flex-direction: column; gap: 6px; padding-left: 4px;";
      if (!Array.isArray(group.rules) || group.rules.length === 0) {
        group.rules = [
          {
            id: `rule_${Date.now()}_0`,
            evaluationMode: "comparison",
            leftOperand: "",
            operator: "equals",
            rightOperand: ""
          }
        ];
      }
      group.rules.forEach((rule, rIdx) => {
        if (rIdx === 0) {
          delete rule.connector;
        } else {
          if (!rule.connector)
            rule.connector = group.logicalOperator === "or" ? "or" : "and";
          rulesList.appendChild(this.createConnectorButton(rule, ctx));
        }
        const ruleEl = this.createRuleEditorElement(
          rule,
          rIdx,
          group.rules.length,
          () => {
            group.rules.splice(rIdx, 1);
            if (group.rules.length === 0) {
              group.rules.push({
                id: `rule_${Date.now()}`,
                evaluationMode: "comparison",
                leftOperand: "",
                operator: "equals",
                rightOperand: ""
              });
            }
            ctx.renderInspector();
            ctx.onNodeDataChanged();
          },
          ctx
        );
        rulesList.appendChild(ruleEl);
      });
      groupEl.appendChild(rulesList);
      const btnAddRuleInGroup = document.createElement("button");
      btnAddRuleInGroup.type = "button";
      btnAddRuleInGroup.className = "btn-xs";
      btnAddRuleInGroup.style.cssText = "width: 100%; padding: 4px; background: rgba(59, 130, 246, 0.1); color: #93c5fd; border: 1px dashed #3b82f6; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: 600;";
      btnAddRuleInGroup.textContent = "+ Adicionar Express\xE3o";
      btnAddRuleInGroup.addEventListener("click", () => {
        group.rules.push({
          id: `rule_${Date.now()}`,
          evaluationMode: "comparison",
          leftOperand: "",
          operator: "equals",
          rightOperand: "",
          jsExpression: ""
        });
        ctx.renderInspector();
        ctx.onNodeDataChanged();
      });
      groupEl.appendChild(btnAddRuleInGroup);
      container.appendChild(groupEl);
      if (!isLastGroup) {
        const connectorDiv = document.createElement("div");
        connectorDiv.style.cssText = "display: flex; align-items: center; justify-content: center; gap: 8px; margin: 4px 0;";
        const lineLeft = document.createElement("div");
        lineLeft.style.cssText = "flex: 1; height: 1px; background: #334155;";
        const lineRight = document.createElement("div");
        lineRight.style.cssText = "flex: 1; height: 1px; background: #334155;";
        const groupConnectorBtn = document.createElement("button");
        groupConnectorBtn.type = "button";
        groupConnectorBtn.title = "Clique para alternar: E / OU / N\xE3o E / N\xE3o OU";
        const order = ["and", "or", "and_not", "or_not"];
        const labels = { and: "E", or: "OU", and_not: "N\xE3o E", or_not: "N\xE3o OU" };
        const colors = { and: "#38bdf8", or: "#f59e0b", and_not: "#ef4444", or_not: "#ec4899" };
        const refreshGroupBtn = () => {
          const cur = order.includes(group.nextOperator) ? group.nextOperator : "or";
          groupConnectorBtn.textContent = labels[cur];
          groupConnectorBtn.style.cssText = `padding: 2px 14px; font-size: 10px; font-weight: 700; background: #1e293b; color: ${colors[cur]}; border: 1px solid ${colors[cur]}; border-radius: 12px; cursor: pointer; text-transform: uppercase; min-width: 60px;`;
        };
        refreshGroupBtn();
        groupConnectorBtn.addEventListener("click", () => {
          const cur = order.includes(group.nextOperator) ? group.nextOperator : "or";
          const idx = order.indexOf(cur);
          group.nextOperator = order[(idx + 1) % order.length];
          refreshGroupBtn();
          ctx.onNodeDataChanged();
        });
        connectorDiv.appendChild(lineLeft);
        connectorDiv.appendChild(groupConnectorBtn);
        connectorDiv.appendChild(lineRight);
        container.appendChild(connectorDiv);
      }
    });
    const btnAddGroup = document.createElement("button");
    btnAddGroup.type = "button";
    btnAddGroup.className = "btn-xs";
    btnAddGroup.style.cssText = "width: 100%; padding: 6px; background: rgba(99, 102, 241, 0.15); color: #a5b4fc; border: 1px dashed #6366f1; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600; margin-top: 4px;";
    btnAddGroup.textContent = "+ Adicionar Grupo";
    btnAddGroup.addEventListener("click", () => {
      dataObj.conditionGroups.push({
        id: `grp_${Date.now()}`,
        name: `Grupo ${dataObj.conditionGroups.length + 1}`,
        label: `Grupo ${dataObj.conditionGroups.length + 1}`,
        logicalOperator: "and",
        nextOperator: "or",
        rules: [
          {
            id: `rule_${Date.now()}_0`,
            evaluationMode: "comparison",
            leftOperand: "",
            operator: "equals",
            rightOperand: "",
            jsExpression: ""
          }
        ]
      });
      ctx.renderInspector();
      ctx.onNodeDataChanged();
    });
    container.appendChild(btnAddGroup);
    return container;
  }
  /**
   * Botão que alterna o conector de uma regra com a anterior: E → OU → Não E → Não OU → E ...
   */
  static createConnectorButton(rule, ctx) {
    const order = ["and", "or", "and_not", "or_not"];
    const labels = { and: "E", or: "OU", and_not: "N\xE3o E", or_not: "N\xE3o OU" };
    const colors = { and: "#38bdf8", or: "#f59e0b", and_not: "#ef4444", or_not: "#ec4899" };
    const wrap = document.createElement("div");
    wrap.style.cssText = "display: flex; align-items: center; justify-content: center; gap: 8px;";
    const lineL = document.createElement("div");
    lineL.style.cssText = "flex: 1; height: 1px; background: #334155;";
    const lineR = document.createElement("div");
    lineR.style.cssText = "flex: 1; height: 1px; background: #334155;";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.title = "Clique para alternar: E / OU / N\xE3o E / N\xE3o OU";
    const refresh = () => {
      const c = order.includes(rule.connector) ? rule.connector : "and";
      btn.textContent = labels[c];
      btn.style.cssText = `padding: 2px 14px; font-size: 10px; font-weight: 700; background: #1e293b; color: ${colors[c]}; border: 1px solid ${colors[c]}; border-radius: 12px; cursor: pointer; text-transform: uppercase; min-width: 60px;`;
    };
    refresh();
    btn.addEventListener("click", () => {
      const idx = order.indexOf(rule.connector);
      rule.connector = order[(idx + 1) % order.length];
      refresh();
      ctx.onNodeDataChanged();
    });
    wrap.appendChild(lineL);
    wrap.appendChild(btn);
    wrap.appendChild(lineR);
    return wrap;
  }
  static createRuleEditorElement(rule, ruleIdx, totalRules, onDelete, ctx) {
    const ruleEl = document.createElement("div");
    ruleEl.style.cssText = "background: #0f172a; border: 1px solid #1e293b; border-radius: 5px; padding: 8px; display: flex; flex-direction: column; gap: 6px;";
    const mode = rule.evaluationMode || (rule.jsExpression && !rule.operator ? "js_eval" : "comparison");
    const ruleHeader = document.createElement("div");
    ruleHeader.style.cssText = "display: flex; justify-content: space-between; align-items: center;";
    ruleHeader.innerHTML = `
      <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Express\xE3o #${ruleIdx + 1}</span>
    `;
    if (totalRules > 1) {
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.innerHTML = "&times;";
      delBtn.title = "Remover esta express\xE3o";
      delBtn.style.cssText = "background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 14px; line-height: 1; padding: 0 4px;";
      delBtn.addEventListener("click", onDelete);
      ruleHeader.appendChild(delBtn);
    }
    ruleEl.appendChild(ruleHeader);
    const modeSelect = document.createElement("select");
    modeSelect.style.cssText = "width: 100%; padding: 4px 6px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;";
    modeSelect.innerHTML = `
      <option value="comparison" ${mode === "comparison" ? "selected" : ""}>Compara\xE7\xE3o de Valores</option>
      <option value="js_eval" ${mode === "js_eval" ? "selected" : ""}>Express\xE3o / C\xF3digo JS</option>
    `;
    ruleEl.appendChild(modeSelect);
    const compFields = document.createElement("div");
    compFields.style.cssText = `display: ${mode === "comparison" ? "flex" : "none"}; flex-direction: column; gap: 4px;`;
    compFields.innerHTML = `
      <input type="text" placeholder="Operando Esquerdo (ex: {{status}})" value="${rule.leftOperand || ""}" class="rule-left" style="width: 100%; padding: 4px 6px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;" />
      <select class="rule-op" style="width: 100%; padding: 4px 6px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;">
        <option value="equals" ${rule.operator === "equals" ? "selected" : ""}>Igual</option>
        <option value="not_equals" ${rule.operator === "not_equals" ? "selected" : ""}>Diferente</option>
        <option value="contains" ${rule.operator === "contains" ? "selected" : ""}>Cont\xE9m</option>
        <option value="not_contains" ${rule.operator === "not_contains" ? "selected" : ""}>N\xE3o Cont\xE9m</option>
        <option value="greater_than" ${rule.operator === "greater_than" ? "selected" : ""}>Maior que</option>
        <option value="less_than" ${rule.operator === "less_than" ? "selected" : ""}>Menor que</option>
        <option value="greater_or_equal" ${rule.operator === "greater_or_equal" ? "selected" : ""}>Maior ou Igual</option>
        <option value="less_or_equal" ${rule.operator === "less_or_equal" ? "selected" : ""}>Menor ou Igual</option>
        <option value="is_empty" ${rule.operator === "is_empty" ? "selected" : ""}>Est\xE1 Vazio</option>
        <option value="is_not_empty" ${rule.operator === "is_not_empty" ? "selected" : ""}>N\xE3o Est\xE1 Vazio</option>
      </select>
      <input type="text" placeholder="Operando Direito (ex: 200)" value="${rule.rightOperand || ""}" class="rule-right" style="width: 100%; padding: 4px 6px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;" />
    `;
    const jsFields = document.createElement("div");
    jsFields.style.cssText = `display: ${mode === "js_eval" ? "flex" : "none"}; flex-direction: column; gap: 4px;`;
    jsFields.innerHTML = `
      <div style="display: flex; gap: 4px; align-items: flex-start;">
        <textarea class="rule-js-code" rows="4" placeholder="Express\xE3o JS (ex: status === 200)" style="flex: 1; min-height: 84px; line-height: 1.5; padding: 6px 8px; font-size: 11px; font-family: monospace; background: #172033; color: #38bdf8; border: 1px solid #243049; border-radius: 4px; resize: vertical;">${InspectorInputHelpers.escapeSnippet(rule.jsExpression || "")}</textarea>
        <button type="button" class="btn-open-rule-editor" title="Abrir no editor JS completo sobre o canvas" style="padding: 6px 8px; background: rgba(99, 102, 241, 0.2); border: 1px solid #6366f1; color: #818cf8; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </button>
      </div>
    `;
    modeSelect.addEventListener("change", (e) => {
      rule.evaluationMode = e.target.value;
      if (rule.evaluationMode === "js_eval") {
        compFields.style.display = "none";
        jsFields.style.display = "flex";
      } else {
        compFields.style.display = "flex";
        jsFields.style.display = "none";
      }
      ctx.onNodeDataChanged();
    });
    compFields.querySelector(".rule-left")?.addEventListener("input", (e) => {
      rule.leftOperand = e.target.value;
      ctx.onNodeDataChanged();
    });
    compFields.querySelector(".rule-op")?.addEventListener("change", (e) => {
      rule.operator = e.target.value;
      ctx.onNodeDataChanged();
    });
    compFields.querySelector(".rule-right")?.addEventListener("input", (e) => {
      rule.rightOperand = e.target.value;
      ctx.onNodeDataChanged();
    });
    const jsInput = jsFields.querySelector(".rule-js-code");
    jsInput?.addEventListener("input", (e) => {
      rule.jsExpression = e.target.value;
      ctx.onNodeDataChanged();
    });
    jsFields.querySelector(".btn-open-rule-editor")?.addEventListener("click", () => {
      CodeEditorComponent.openCodeModal({
        title: `Express\xE3o JavaScript (Regra #${ruleIdx + 1})`,
        language: "javascript",
        value: rule.jsExpression || "",
        onSave: (newVal) => {
          rule.jsExpression = newVal;
          if (jsInput)
            jsInput.value = newVal;
          ctx.onNodeDataChanged();
          ctx.showToast("Express\xE3o JS salva!", "success");
        }
      });
    });
    ruleEl.appendChild(compFields);
    ruleEl.appendChild(jsFields);
    return ruleEl;
  }
  static renderWhile(form, data, ctx) {
    this.ensureConditionGroups(data);
    const whileContainer = document.createElement("div");
    whileContainer.style.cssText = "display: flex; flex-direction: column; gap: 8px;";
    const groupsBuilder = this.renderConditionGroupsBuilder(data, ctx);
    whileContainer.appendChild(groupsBuilder);
    form.appendChild(whileContainer);
    InspectorInputHelpers.addNumberInput(
      form,
      "Limite M\xE1ximo de Itera\xE7\xF5es (Seguran\xE7a)",
      data.maxIterations ?? 100,
      (val) => {
        data.maxIterations = val;
        ctx.onNodeDataChanged();
      }
    );
  }
  static renderFor(form, data, ctx) {
    InspectorInputHelpers.addSelectInput(
      form,
      "Tipo de Loop",
      data.loopType || "count",
      [
        { value: "count", label: "Contagem de Vezes" },
        { value: "array", label: "Iterar sobre Lista/Array" },
        { value: "js_generator", label: "Gerador / Express\xE3o JS" }
      ],
      (val) => {
        data.loopType = val;
        ctx.renderInspector();
      }
    );
    if (data.loopType === "count") {
      InspectorInputHelpers.addTextInput(
        form,
        "Contagem / Vezes (ex: 5 ou {{total}})",
        String(data.countExpression ?? 5),
        (val) => data.countExpression = val
      );
    } else if (data.loopType === "js_generator") {
      InspectorInputHelpers.addCodeEditorInput(
        form,
        "C\xF3digo JS (deve retornar um Array ou N\xFAmero de vezes)",
        "javascript",
        data.jsExpression || "",
        (val) => data.jsExpression = val,
        ctx.onNodeDataChanged,
        ctx.showToast,
        "180px"
      );
    } else {
      InspectorInputHelpers.addTextInput(
        form,
        "Express\xE3o da Lista (ex: {{produtos}})",
        data.arrayExpression || "",
        (val) => data.arrayExpression = val
      );
    }
    InspectorInputHelpers.addTextInput(form, "Vari\xE1vel do Item Atual", data.itemVarName || "item", (val) => data.itemVarName = val);
    InspectorInputHelpers.addTextInput(form, "Vari\xE1vel do \xCDndice Atual", data.indexVarName || "index", (val) => data.indexVarName = val);
    InspectorInputHelpers.addNumberInput(form, "Limite M\xE1ximo de Itera\xE7\xF5es", data.maxIterations ?? 100, (val) => data.maxIterations = val);
  }
  static renderIfElement(form, data) {
    InspectorInputHelpers.addSelectorInput(form, "Seletor do Elemento", data.selector || "", (val) => data.selector = val);
    InspectorInputHelpers.addSelectInput(
      form,
      "Tipo de Seletor",
      data.selectorType || "css",
      [
        { value: "css", label: "Seletor CSS" },
        { value: "xpath", label: "XPath" }
      ],
      (val) => data.selectorType = val
    );
    InspectorInputHelpers.addNumberInput(form, "Tempo Limite de Espera (ms)", data.timeoutMs ?? 3e3, (val) => data.timeoutMs = val);
  }
};

// src/editor/modules/inspector/domProperties.ts
var DomPropertiesRenderer = class {
  static renderTabAction(form, data, ctx) {
    InspectorInputHelpers.addSelectInput(
      form,
      "A\xE7\xE3o de Aba",
      data.action || "new_tab",
      [
        { value: "new_tab", label: "Nova Aba" },
        { value: "switch_tab", label: "Trocar Aba" },
        { value: "close_tab", label: "Fechar Aba" },
        { value: "get_current_url", label: "Obter URL Atual" }
      ],
      (val) => {
        data.action = val;
        ctx.renderInspector();
      }
    );
    if (data.action === "new_tab") {
      InspectorInputHelpers.addTextInput(form, "URL Inicial", data.url || "https://google.com", (val) => data.url = val);
      InspectorInputHelpers.addCheckboxInput(form, "Focar Imediatamente", data.active !== false, (val) => data.active = val);
      InspectorInputHelpers.addTextInput(form, "Salvar URL em Vari\xE1vel (opcional)", data.saveUrlToVar || "", (val) => data.saveUrlToVar = val);
    } else if (data.action === "switch_tab" || data.action === "close_tab") {
      InspectorInputHelpers.addSelectInput(
        form,
        "Crit\xE9rio de Busca",
        data.queryType || "title",
        [
          { value: "title", label: "Por T\xEDtulo da Aba" },
          { value: "index", label: "Por Posi\xE7\xE3o / \xCDndice" },
          { value: "url_match", label: "Por Correspond\xEAncia de URL" }
        ],
        (val) => data.queryType = val
      );
      InspectorInputHelpers.addTextInput(form, "Valor da Busca", data.queryValue || "", (val) => data.queryValue = val);
    } else if (data.action === "get_current_url") {
      InspectorInputHelpers.addTextInput(form, "Salvar URL na Vari\xE1vel", data.saveUrlToVar || "currentUrl", (val) => data.saveUrlToVar = val);
    }
  }
  static renderClick(form, data) {
    InspectorInputHelpers.addSelectorInput(form, "Seletor do Elemento", data.selector || "", (val) => data.selector = val);
    InspectorInputHelpers.addSelectInput(
      form,
      "Tipo de Seletor",
      data.selectorType || "css",
      [
        { value: "css", label: "Seletor CSS" },
        { value: "xpath", label: "XPath" }
      ],
      (val) => data.selectorType = val
    );
    InspectorInputHelpers.addSelectInput(
      form,
      "Tipo de Clique",
      data.clickType || "single",
      [
        { value: "single", label: "Clique Simples (Bot\xE3o Esquerdo)" },
        { value: "double", label: "Clique Duplo" },
        { value: "contextmenu", label: "Clique com Bot\xE3o Direito" }
      ],
      (val) => data.clickType = val
    );
    InspectorInputHelpers.addCheckboxInput(form, "Aguardar Elemento antes do Clique", data.waitForElement !== false, (val) => data.waitForElement = val);
    InspectorInputHelpers.addNumberInput(form, "Tempo Limite (ms)", data.timeoutMs ?? 5e3, (val) => data.timeoutMs = val);
  }
  static renderTypeInput(form, data, ctx) {
    InspectorInputHelpers.addSelectorInput(form, "Seletor do Campo", data.selector || "", (val) => data.selector = val);
    InspectorInputHelpers.addSelectInput(
      form,
      "Tipo de Seletor",
      data.selectorType || "css",
      [
        { value: "css", label: "Seletor CSS" },
        { value: "xpath", label: "XPath" }
      ],
      (val) => data.selectorType = val
    );
    InspectorInputHelpers.addTextareaInput(form, "Texto a Digitar (suporta {{var}})", data.text || "", (val) => data.text = val);
    InspectorInputHelpers.addSelectInput(
      form,
      "Modo de Digita\xE7\xE3o",
      data.mode || "human_typing",
      [
        { value: "human_typing", label: "Digita\xE7\xE3o Humana Realista (com delay)" },
        { value: "paste", label: "Colar Imediato (Paste)" }
      ],
      (val) => {
        data.mode = val;
        ctx.renderInspector();
      }
    );
    if (data.mode === "human_typing") {
      InspectorInputHelpers.addNumberInput(form, "Atraso M\xEDnimo por Tecla (ms)", data.minTypingDelayMs ?? 40, (val) => data.minTypingDelayMs = val);
      InspectorInputHelpers.addNumberInput(form, "Atraso M\xE1ximo por Tecla (ms)", data.maxTypingDelayMs ?? 120, (val) => data.maxTypingDelayMs = val);
    }
    InspectorInputHelpers.addCheckboxInput(form, "Limpar campo antes de digitar", !!data.clearBeforeTyping, (val) => data.clearBeforeTyping = val);
    InspectorInputHelpers.addCheckboxInput(form, "Pressionar Enter ap\xF3s digitar", !!data.pressEnterAfter, (val) => data.pressEnterAfter = val);
    InspectorInputHelpers.addNumberInput(form, "Tempo Limite (ms)", data.timeoutMs ?? 5e3, (val) => data.timeoutMs = val);
  }
  static renderScroll(form, data, ctx) {
    InspectorInputHelpers.addSelectInput(
      form,
      "Destino da Rolagem",
      data.target || "bottom",
      [
        { value: "bottom", label: "Rolar at\xE9 o Final da P\xE1gina" },
        { value: "top", label: "Rolar at\xE9 o Topo da P\xE1gina" },
        { value: "element", label: "Rolar at\xE9 o Elemento ficar Vis\xEDvel" },
        { value: "by_pixels", label: "Rolar por Quantidade de Pixels" }
      ],
      (val) => {
        data.target = val;
        ctx.renderInspector();
      }
    );
    if (data.target === "element") {
      InspectorInputHelpers.addSelectorInput(form, "Seletor do Elemento Alvo", data.selector || "", (val) => data.selector = val);
      InspectorInputHelpers.addSelectInput(
        form,
        "Tipo de Seletor",
        data.selectorType || "css",
        [
          { value: "css", label: "Seletor CSS" },
          { value: "xpath", label: "XPath" }
        ],
        (val) => data.selectorType = val
      );
    } else if (data.target === "by_pixels") {
      InspectorInputHelpers.addNumberInput(form, "Deslocamento Vertical (Delta Y)", data.deltaY ?? 500, (val) => data.deltaY = val);
      InspectorInputHelpers.addNumberInput(form, "Deslocamento Horizontal (Delta X)", data.deltaX ?? 0, (val) => data.deltaX = val);
    }
    InspectorInputHelpers.addCheckboxInput(form, "Rolagem Suave (Smooth)", data.smooth !== false, (val) => data.smooth = val);
  }
};

// src/editor/modules/inspector/dataProperties.ts
var DataPropertiesRenderer = class {
  static renderHttpRequest(form, data, ctx) {
    InspectorInputHelpers.addTextInput(form, "URL da Requisi\xE7\xE3o", data.url || "https://", (val) => data.url = val);
    InspectorInputHelpers.addSelectInput(
      form,
      "M\xE9todo HTTP",
      data.method || "GET",
      [
        { value: "GET", label: "GET" },
        { value: "POST", label: "POST" },
        { value: "PUT", label: "PUT" },
        { value: "PATCH", label: "PATCH" },
        { value: "DELETE", label: "DELETE" },
        { value: "HEAD", label: "HEAD" }
      ],
      (val) => {
        data.method = val;
        ctx.renderInspector();
      }
    );
    if (data.method === "POST" || data.method === "PUT" || data.method === "PATCH") {
      InspectorInputHelpers.addTextareaInput(form, "Corpo da Requisi\xE7\xE3o (Body)", data.body || "", (val) => data.body = val);
    }
    InspectorInputHelpers.addSelectInput(
      form,
      "Tipo de Resposta",
      data.responseType || "json",
      [
        { value: "json", label: "JSON (Objeto/Array)" },
        { value: "text", label: "Texto Puro" }
      ],
      (val) => data.responseType = val
    );
    InspectorInputHelpers.addTextInput(form, "Salvar Resposta na Vari\xE1vel", data.saveResponseToVar || "apiResponse", (val) => data.saveResponseToVar = val);
    InspectorInputHelpers.addTextInput(form, "Salvar Status HTTP na Vari\xE1vel (opcional)", data.saveStatusToVar || "", (val) => data.saveStatusToVar = val);
    InspectorInputHelpers.addNumberInput(form, "Tempo Limite (ms)", data.timeoutMs ?? 15e3, (val) => data.timeoutMs = val);
  }
  static renderExtractData(form, data, ctx) {
    InspectorInputHelpers.addSelectorInput(form, "Seletor do Elemento", data.selector || "", (val) => data.selector = val);
    InspectorInputHelpers.addSelectInput(
      form,
      "Tipo de Seletor",
      data.selectorType || "css",
      [
        { value: "css", label: "Seletor CSS" },
        { value: "xpath", label: "XPath" }
      ],
      (val) => data.selectorType = val
    );
    InspectorInputHelpers.addSelectInput(
      form,
      "Tipo de Extra\xE7\xE3o",
      data.extractType || "innerText",
      [
        { value: "innerText", label: "Texto Vis\xEDvel (innerText)" },
        { value: "innerHTML", label: "HTML Interno (innerHTML)" },
        { value: "value", label: "Valor do Campo (value)" },
        { value: "attribute", label: "Atributo HTML (ex: href, src)" }
      ],
      (val) => {
        data.extractType = val;
        ctx.renderInspector();
      }
    );
    if (data.extractType === "attribute") {
      InspectorInputHelpers.addTextInput(form, "Nome do Atributo (ex: href, src)", data.attributeName || "href", (val) => data.attributeName = val);
    }
    InspectorInputHelpers.addTextInput(form, "Salvar Dado na Vari\xE1vel", data.saveToVar || "extractedData", (val) => data.saveToVar = val);
    InspectorInputHelpers.addNumberInput(form, "Tempo Limite (ms)", data.timeoutMs ?? 5e3, (val) => data.timeoutMs = val);
  }
  static renderScrapeList(form, data, ctx) {
    InspectorInputHelpers.addSelectorInput(form, "Seletor dos Itens / Cards", data.selector || ".card", (val) => data.selector = val);
    InspectorInputHelpers.addSelectInput(
      form,
      "Tipo de Seletor",
      data.selectorType || "css",
      [
        { value: "css", label: "Seletor CSS" },
        { value: "xpath", label: "XPath" }
      ],
      (val) => data.selectorType = val
    );
    InspectorInputHelpers.addTextInput(form, "Salvar Lista na Vari\xE1vel", data.saveToVar || "items", (val) => data.saveToVar = val);
    InspectorInputHelpers.addNumberInput(form, "Limite M\xE1ximo de Itens", data.maxItems ?? 50, (val) => data.maxItems = val);
    InspectorInputHelpers.addNumberInput(form, "Tempo Limite (ms)", data.timeoutMs ?? 5e3, (val) => data.timeoutMs = val);
    const fieldsContainer = document.createElement("div");
    fieldsContainer.style.cssText = "border-top: 1px solid #243049; padding-top: 10px; margin-top: 10px;";
    fieldsContainer.innerHTML = '<div style="font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 8px;">Campos Extra\xEDdos por Item</div>';
    if (!Array.isArray(data.fields))
      data.fields = [];
    data.fields.forEach((f, idx) => {
      const fieldEl = document.createElement("div");
      fieldEl.style.cssText = "background: #0b0f19; border: 1px solid #1e293b; padding: 8px; border-radius: 6px; margin-bottom: 8px;";
      fieldEl.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:11px;font-weight:600;">Campo #${idx + 1}</span>
          <button class="btn-xs delete-field-btn" data-idx="${idx}">\u2715</button>
        </div>
        <input type="text" placeholder="Nome da Chave (ex: preco)" value="${f.name || ""}" class="field-name" style="width:100%;margin-bottom:4px;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;" />
        <input type="text" placeholder="Sub-seletor (ex: .price ou vazio)" value="${f.subSelector || ""}" class="field-sub" style="width:100%;margin-bottom:4px;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;" />
        <select class="field-type" style="width:100%;margin-bottom:4px;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;">
          <option value="innerText" ${f.extractType === "innerText" ? "selected" : ""}>Texto (innerText)</option>
          <option value="attribute" ${f.extractType === "attribute" ? "selected" : ""}>Atributo</option>
          <option value="innerHTML" ${f.extractType === "innerHTML" ? "selected" : ""}>HTML (innerHTML)</option>
          <option value="value" ${f.extractType === "value" ? "selected" : ""}>Valor (value)</option>
        </select>
        <input type="text" placeholder="Nome do Atributo (ex: href)" value="${f.attributeName || ""}" class="field-attr ${f.extractType !== "attribute" ? "hidden" : ""}" style="width:100%;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;" />
      `;
      fieldEl.querySelector(".field-name")?.addEventListener("input", (e) => f.name = e.target.value);
      fieldEl.querySelector(".field-sub")?.addEventListener("input", (e) => f.subSelector = e.target.value);
      fieldEl.querySelector(".field-type")?.addEventListener("change", (e) => {
        f.extractType = e.target.value;
        const attrInput = fieldEl.querySelector(".field-attr");
        if (attrInput) {
          if (f.extractType === "attribute")
            attrInput.classList.remove("hidden");
          else
            attrInput.classList.add("hidden");
        }
      });
      fieldEl.querySelector(".field-attr")?.addEventListener("input", (e) => f.attributeName = e.target.value);
      fieldEl.querySelector(".delete-field-btn")?.addEventListener("click", () => {
        data.fields.splice(idx, 1);
        ctx.renderInspector();
      });
      fieldsContainer.appendChild(fieldEl);
    });
    const btnAddField = document.createElement("button");
    btnAddField.type = "button";
    btnAddField.className = "btn-xs";
    btnAddField.style.cssText = "width: 100%; margin-top: 4px; padding: 6px;";
    btnAddField.textContent = "+ Adicionar Campo ao Scraper";
    btnAddField.addEventListener("click", () => {
      data.fields.push({ name: `campo_${data.fields.length + 1}`, subSelector: "", extractType: "innerText", attributeName: "" });
      ctx.renderInspector();
    });
    fieldsContainer.appendChild(btnAddField);
    form.appendChild(fieldsContainer);
  }
};

// src/editor/modules/inspector/startProperties.ts
var StartPropertiesRenderer = class {
  static renderStartBlock(form, data, ctx) {
    if (!Array.isArray(data.triggers) || data.triggers.length === 0) {
      const initialType = data.triggerType || "manual";
      data.triggers = [
        {
          type: initialType,
          enabled: true,
          urlPattern: data.urlPattern,
          urlPatterns: data.urlPatterns || (data.urlPattern ? [data.urlPattern] : []),
          shortcutKey: data.shortcutKey,
          intervalMinutes: data.intervalMinutes,
          cronExpression: data.cronExpression,
          contextMenuTitle: data.contextMenuTitle,
          floatingButton: data.floatingButton
        }
      ];
    }
    const triggerLabelsMap = {
      manual: "Manual (Disparo pelo Usu\xE1rio)",
      on_url_load: "Ao Carregar URLs de Execu\xE7\xE3o",
      shortcut: "Atalho de Teclado",
      schedule: "Em um Intervalo de Tempo",
      date_schedule: "Em Datas Espec\xEDficas / Calend\xE1rio",
      browser_startup: "Ao Abrir o Browser",
      context_menu: "Pelo Menu de Contexto",
      floating_button: "Bot\xE3o Flutuante Personalizado",
      mcp: "Via MCP (IA)"
    };
    const triggersContainer = document.createElement("div");
    triggersContainer.style.cssText = "margin-top: 10px; display: flex; flex-direction: column; gap: 8px;";
    const headerDiv = document.createElement("div");
    headerDiv.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;";
    headerDiv.innerHTML = `
      <label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Formas de Disparo (${data.triggers.length})</label>
      <span style="font-size: 10px; color: #64748b;">Clique para expandir/recolher</span>
    `;
    triggersContainer.appendChild(headerDiv);
    data.triggers.forEach((trig, index) => {
      const isExpanded = ctx.expandedTriggerIndices.has(index);
      const card = document.createElement("div");
      card.className = "start-trigger-card-item";
      card.setAttribute("data-trigger-index", String(index));
      card.style.cssText = `background: #0f172a; border: 1px solid ${isExpanded ? "#3b82f6" : "#1e293b"}; border-radius: 6px; overflow: hidden; transition: border-color 0.15s;`;
      const accordionHeader = document.createElement("div");
      accordionHeader.style.cssText = `padding: 8px 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: ${isExpanded ? "#1e293b70" : "#0f172a"}; user-select: none; gap: 8px;`;
      const headerLeft = document.createElement("div");
      headerLeft.style.cssText = "display: flex; align-items: center; gap: 6px; flex: 1; overflow: hidden;";
      const iconSpan = document.createElement("span");
      iconSpan.style.cssText = "font-size: 10px; color: #94a3b8; transition: transform 0.15s;";
      iconSpan.textContent = isExpanded ? "\u25BC" : "\u25B6";
      const titleSpan = document.createElement("span");
      titleSpan.style.cssText = `font-size: 12px; font-weight: ${isExpanded ? "600" : "500"}; color: ${isExpanded ? "#60a5fa" : "#cbd5e1"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
      titleSpan.textContent = triggerLabelsMap[trig.type] || trig.type;
      headerLeft.appendChild(iconSpan);
      headerLeft.appendChild(titleSpan);
      const btnDel = document.createElement("button");
      btnDel.type = "button";
      btnDel.innerHTML = "&times;";
      btnDel.title = "Remover este gatilho";
      btnDel.style.cssText = "background: transparent; color: #ef4444; border: none; font-size: 16px; cursor: pointer; line-height: 1; padding: 2px 4px;";
      btnDel.addEventListener("click", (e) => {
        e.stopPropagation();
        if (data.triggers.length <= 1) {
          alert("O fluxo deve ter pelo menos 1 forma de disparo!");
          return;
        }
        data.triggers.splice(index, 1);
        ctx.renderInspector();
        ctx.onNodeDataChanged?.();
      });
      accordionHeader.appendChild(headerLeft);
      accordionHeader.appendChild(btnDel);
      accordionHeader.addEventListener("click", () => {
        if (ctx.expandedTriggerIndices.has(index)) {
          ctx.expandedTriggerIndices.delete(index);
        } else {
          ctx.expandedTriggerIndices.add(index);
        }
        ctx.renderInspector();
      });
      card.appendChild(accordionHeader);
      if (isExpanded) {
        const body = document.createElement("div");
        body.style.cssText = "padding: 10px; border-top: 1px solid #1e293b; display: flex; flex-direction: column; gap: 8px;";
        InspectorInputHelpers.addSelectInput(
          body,
          "Tipo de Disparo",
          trig.type || "manual",
          [
            { value: "manual", label: "Manual (Disparo pelo Usu\xE1rio)" },
            { value: "on_url_load", label: "Ao Carregar URLs de Execu\xE7\xE3o" },
            { value: "shortcut", label: "Atalho de Teclado" },
            { value: "schedule", label: "Em um Intervalo de Tempo" },
            { value: "date_schedule", label: "Em Datas Espec\xEDficas / Calend\xE1rio" },
            { value: "browser_startup", label: "Ao Abrir o Browser" },
            { value: "context_menu", label: "Pelo Menu de Contexto" },
            { value: "floating_button", label: "Bot\xE3o Flutuante Personalizado" },
            { value: "mcp", label: "Via MCP (IA)" }
          ],
          (val) => {
            trig.type = val;
            ctx.renderInspector();
            ctx.onNodeDataChanged?.();
          }
        );
        if (trig.type === "on_url_load") {
          if (!Array.isArray(trig.urlPatterns)) {
            trig.urlPatterns = trig.urlPattern ? [trig.urlPattern] : ["https://*/*"];
          }
          this.renderUrlListSection(body, "URLs de Execu\xE7\xE3o Autom\xE1tica", trig.urlPatterns, (newList) => {
            trig.urlPatterns = newList;
            trig.urlPattern = newList[0] || "https://*/*";
            ctx.onNodeDataChanged?.();
          }, ctx);
          InspectorInputHelpers.addCheckboxInput(
            body,
            "Ativar Apenas Quando um Elemento Espec\xEDfico Aparecer",
            !!trig.requireElement,
            (val) => {
              trig.requireElement = val;
              ctx.renderInspector();
              ctx.onNodeDataChanged?.();
            }
          );
          if (trig.requireElement) {
            const onUrlElemBox = document.createElement("div");
            onUrlElemBox.style.cssText = "background: #0b0f19; border: 1px solid #1e293b; border-radius: 6px; padding: 10px; display: flex; flex-direction: column; gap: 8px; margin-top: 4px;";
            InspectorInputHelpers.addSelectorInput(
              onUrlElemBox,
              "Seletor do Elemento Obrigat\xF3rio",
              trig.requireElementSelector || "",
              (val) => {
                trig.requireElementSelector = val.trim();
                ctx.onNodeDataChanged?.();
              }
            );
            InspectorInputHelpers.addSelectInput(
              onUrlElemBox,
              "Tipo do Seletor",
              trig.requireElementSelectorType || "css",
              [
                { value: "css", label: "Seletor CSS" },
                { value: "xpath", label: "XPath" }
              ],
              (val) => {
                trig.requireElementSelectorType = val;
                ctx.onNodeDataChanged?.();
              }
            );
            body.appendChild(onUrlElemBox);
          }
        } else if (trig.type === "shortcut") {
          InspectorInputHelpers.addTextInput(body, "Combina\xE7\xE3o de Teclas (ex: Ctrl+Shift+U)", trig.shortcutKey || "Ctrl+Shift+U", (val) => {
            trig.shortcutKey = val;
            ctx.onNodeDataChanged?.();
          });
        } else if (trig.type === "schedule") {
          this.renderIntervalScheduleTriggerConfig(body, trig, ctx);
        } else if (trig.type === "date_schedule") {
          this.renderDateScheduleTriggerConfig(body, trig, ctx);
        } else if (trig.type === "context_menu") {
          InspectorInputHelpers.addTextInput(body, "T\xEDtulo no Menu de Contexto", trig.contextMenuTitle || "Executar Automa\xE7\xE3o", (val) => {
            trig.contextMenuTitle = val;
            ctx.onNodeDataChanged?.();
          });
        } else if (trig.type === "floating_button") {
          this.renderFloatingButtonTriggerConfig(body, trig, ctx);
        }
        card.appendChild(body);
      }
      triggersContainer.appendChild(card);
    });
    const btnAddTrigger = document.createElement("button");
    btnAddTrigger.type = "button";
    btnAddTrigger.className = "btn-xs";
    btnAddTrigger.style.cssText = "width: 100%; margin-top: 4px; padding: 6px;";
    btnAddTrigger.textContent = "+ Adicionar Outra Forma de Disparo";
    btnAddTrigger.addEventListener("click", () => {
      const newIndex = data.triggers.length;
      data.triggers.push({
        type: "on_url_load",
        enabled: true,
        urlPatterns: ["https://*/*"]
      });
      ctx.expandedTriggerIndices.add(newIndex);
      ctx.renderInspector(`.start-trigger-card-item[data-trigger-index="${newIndex}"]`);
      ctx.onNodeDataChanged?.();
    });
    triggersContainer.appendChild(btnAddTrigger);
    form.appendChild(triggersContainer);
  }
  static renderIntervalScheduleTriggerConfig(body, trig, ctx) {
    if (trig.intervalValue === void 0) {
      trig.intervalValue = trig.intervalMinutes ?? 15;
    }
    if (!trig.intervalUnit) {
      trig.intervalUnit = "minutes";
    }
    const intervalRow = document.createElement("div");
    intervalRow.style.cssText = "display: flex; flex-direction: column; gap: 4px;";
    const lbl = document.createElement("label");
    lbl.style.cssText = "font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;";
    lbl.textContent = "Repetir a Cada (Intervalo)";
    intervalRow.appendChild(lbl);
    const inputGroup = document.createElement("div");
    inputGroup.style.cssText = "display: flex; gap: 6px; align-items: center;";
    const numInp = document.createElement("input");
    numInp.type = "number";
    numInp.min = "1";
    numInp.value = String(trig.intervalValue);
    numInp.style.cssText = "flex: 1; min-width: 0; padding: 6px 8px; font-size: 12px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;";
    numInp.addEventListener("input", (e) => {
      const val = Math.max(1, Number(e.target.value) || 1);
      trig.intervalValue = val;
      if (trig.intervalUnit === "minutes")
        trig.intervalMinutes = val;
      else if (trig.intervalUnit === "hours")
        trig.intervalMinutes = val * 60;
      else if (trig.intervalUnit === "seconds")
        trig.intervalMinutes = Math.max(1, Math.round(val / 60));
      else if (trig.intervalUnit === "ms")
        trig.intervalMinutes = Math.max(1, Math.round(val / 6e4));
      ctx?.onNodeDataChanged?.();
    });
    const unitSelect = document.createElement("select");
    unitSelect.style.cssText = "width: 140px; padding: 6px 8px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px; cursor: pointer;";
    unitSelect.innerHTML = `
      <option value="ms" ${trig.intervalUnit === "ms" ? "selected" : ""}>Milissegundos (ms)</option>
      <option value="seconds" ${trig.intervalUnit === "seconds" ? "selected" : ""}>Segundos (s)</option>
      <option value="minutes" ${trig.intervalUnit === "minutes" ? "selected" : ""}>Minutos (min)</option>
      <option value="hours" ${trig.intervalUnit === "hours" ? "selected" : ""}>Horas (h)</option>
    `;
    unitSelect.addEventListener("change", (e) => {
      trig.intervalUnit = e.target.value;
      const val = Number(trig.intervalValue) || 1;
      if (trig.intervalUnit === "minutes")
        trig.intervalMinutes = val;
      else if (trig.intervalUnit === "hours")
        trig.intervalMinutes = val * 60;
      else if (trig.intervalUnit === "seconds")
        trig.intervalMinutes = Math.max(1, Math.round(val / 60));
      else if (trig.intervalUnit === "ms")
        trig.intervalMinutes = Math.max(1, Math.round(val / 6e4));
      ctx?.onNodeDataChanged?.();
    });
    inputGroup.appendChild(numInp);
    inputGroup.appendChild(unitSelect);
    intervalRow.appendChild(inputGroup);
    body.appendChild(intervalRow);
    InspectorInputHelpers.addTextInput(body, "Express\xE3o Cron (Opcional, ex: 0 * * * *)", trig.cronExpression || "", (val) => {
      trig.cronExpression = val;
      ctx?.onNodeDataChanged?.();
    });
  }
  static renderDateScheduleTriggerConfig(body, trig, ctx) {
    if (!trig.dateSchedule) {
      trig.dateSchedule = {
        mode: "weekdays",
        weekdays: [1, 2, 3, 4, 5],
        monthDays: [1, 15],
        fullDates: [],
        time: "09:00"
      };
    }
    const ds = trig.dateSchedule;
    if (!ds.mode)
      ds.mode = "weekdays";
    if (!Array.isArray(ds.weekdays))
      ds.weekdays = [1, 2, 3, 4, 5];
    if (!Array.isArray(ds.monthDays))
      ds.monthDays = [1, 15];
    if (!Array.isArray(ds.fullDates))
      ds.fullDates = [];
    if (!ds.time)
      ds.time = "09:00";
    const modeGroup = document.createElement("div");
    modeGroup.style.cssText = "display: flex; flex-direction: column; gap: 4px;";
    const modeLabel = document.createElement("label");
    modeLabel.style.cssText = "font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;";
    modeLabel.textContent = "Modo de Sele\xE7\xE3o de Datas";
    const modeSelect = document.createElement("select");
    modeSelect.style.cssText = "width: 100%; padding: 6px 8px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;";
    modeSelect.innerHTML = `
      <option value="weekdays" ${ds.mode === "weekdays" ? "selected" : ""}>Dias da Semana apenas (Seg, Ter, etc.)</option>
      <option value="month_days" ${ds.mode === "month_days" ? "selected" : ""}>Dias apenas entre dias do m\xEAs (1 a 31)</option>
      <option value="full_dates" ${ds.mode === "full_dates" ? "selected" : ""}>Datas completas (Calend\xE1rio espec\xEDfico)</option>
    `;
    modeSelect.addEventListener("change", (e) => {
      ds.mode = e.target.value;
      ctx.renderInspector();
      ctx.onNodeDataChanged?.();
    });
    modeGroup.appendChild(modeLabel);
    modeGroup.appendChild(modeSelect);
    body.appendChild(modeGroup);
    InspectorInputHelpers.addTextInput(body, "Hor\xE1rio de Execu\xE7\xE3o no Dia (HH:MM)", ds.time || "09:00", (val) => {
      ds.time = val;
      ctx.onNodeDataChanged?.();
    });
    const selectionCard = document.createElement("div");
    selectionCard.style.cssText = "background: #0b0f19; border: 1px solid #1e293b; border-radius: 6px; padding: 10px; display: flex; flex-direction: column; gap: 8px;";
    if (ds.mode === "weekdays") {
      const wLabel = document.createElement("div");
      wLabel.style.cssText = "font-size: 10px; font-weight: 700; color: #93c5fd; text-transform: uppercase;";
      wLabel.textContent = "Escolha os Dias da Semana:";
      selectionCard.appendChild(wLabel);
      const days = [
        { id: 0, short: "Dom", full: "Domingo" },
        { id: 1, short: "Seg", full: "Segunda-feira" },
        { id: 2, short: "Ter", full: "Ter\xE7a-feira" },
        { id: 3, short: "Qua", full: "Quarta-feira" },
        { id: 4, short: "Qui", full: "Quinta-feira" },
        { id: 5, short: "Sex", full: "Sexta-feira" },
        { id: 6, short: "S\xE1b", full: "S\xE1bado" }
      ];
      const daysGrid = document.createElement("div");
      daysGrid.style.cssText = "display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;";
      days.forEach((day) => {
        const isSelected = ds.weekdays.includes(day.id);
        const dayBtn = document.createElement("button");
        dayBtn.type = "button";
        dayBtn.textContent = day.short;
        dayBtn.title = day.full;
        dayBtn.style.cssText = `
          padding: 8px 2px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 4px;
          border: 1px solid ${isSelected ? "#3b82f6" : "#243049"};
          background: ${isSelected ? "#2563eb" : "#172033"};
          color: ${isSelected ? "#ffffff" : "#94a3b8"};
          cursor: pointer;
          transition: all 0.15s;
        `;
        dayBtn.addEventListener("click", () => {
          if (ds.weekdays.includes(day.id)) {
            if (ds.weekdays.length > 1) {
              ds.weekdays = ds.weekdays.filter((d) => d !== day.id);
            } else {
              ctx.showToast("Selecione pelo menos 1 dia da semana.", "warning");
              return;
            }
          } else {
            ds.weekdays.push(day.id);
            ds.weekdays.sort();
          }
          ctx.renderInspector();
          ctx.onNodeDataChanged?.();
        });
        daysGrid.appendChild(dayBtn);
      });
      selectionCard.appendChild(daysGrid);
    } else if (ds.mode === "month_days") {
      const mLabel = document.createElement("div");
      mLabel.style.cssText = "font-size: 10px; font-weight: 700; color: #93c5fd; text-transform: uppercase;";
      mLabel.textContent = "Escolha os Dias do M\xEAs (1 a 31):";
      selectionCard.appendChild(mLabel);
      const monthGrid = document.createElement("div");
      monthGrid.style.cssText = "display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;";
      for (let day = 1; day <= 31; day++) {
        const isSelected = ds.monthDays.includes(day);
        const dayBtn = document.createElement("button");
        dayBtn.type = "button";
        dayBtn.textContent = String(day);
        dayBtn.style.cssText = `
          padding: 6px 0;
          font-size: 11px;
          font-weight: 600;
          border-radius: 4px;
          border: 1px solid ${isSelected ? "#10b981" : "#243049"};
          background: ${isSelected ? "#059669" : "#172033"};
          color: ${isSelected ? "#ffffff" : "#94a3b8"};
          cursor: pointer;
          transition: all 0.15s;
        `;
        dayBtn.addEventListener("click", () => {
          if (ds.monthDays.includes(day)) {
            if (ds.monthDays.length > 1) {
              ds.monthDays = ds.monthDays.filter((d) => d !== day);
            } else {
              ctx.showToast("Selecione pelo menos 1 dia do m\xEAs.", "warning");
              return;
            }
          } else {
            ds.monthDays.push(day);
            ds.monthDays.sort((a, b) => a - b);
          }
          ctx.renderInspector();
          ctx.onNodeDataChanged?.();
        });
        monthGrid.appendChild(dayBtn);
      }
      selectionCard.appendChild(monthGrid);
    } else if (ds.mode === "full_dates") {
      const cLabel = document.createElement("div");
      cLabel.style.cssText = "font-size: 10px; font-weight: 700; color: #93c5fd; text-transform: uppercase;";
      cLabel.textContent = "Adicionar Datas Espec\xEDficas (Calend\xE1rio Nativo):";
      selectionCard.appendChild(cLabel);
      const pickerRow = document.createElement("div");
      pickerRow.style.cssText = "display: flex; gap: 8px; align-items: center;";
      const dateInput = document.createElement("input");
      dateInput.type = "date";
      dateInput.className = "native-date-picker-input";
      dateInput.style.cssText = "flex: 1;";
      const today = /* @__PURE__ */ new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      dateInput.value = `${yyyy}-${mm}-${dd}`;
      const btnAddDate = document.createElement("button");
      btnAddDate.type = "button";
      btnAddDate.className = "btn btn-secondary";
      btnAddDate.style.cssText = "padding: 6px 12px; font-size: 11px; white-space: nowrap; display: flex; align-items: center; gap: 4px;";
      btnAddDate.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Adicionar Data
      `;
      const handleAddSelectedDate = () => {
        const val = dateInput.value;
        if (!val) {
          if (typeof dateInput.showPicker === "function") {
            try {
              dateInput.showPicker();
            } catch {
            }
          }
          return;
        }
        if (!ds.fullDates.includes(val)) {
          ds.fullDates.push(val);
          ds.fullDates.sort();
          ctx.renderInspector();
          ctx.onNodeDataChanged?.();
        } else {
          ctx.showToast("Esta data j\xE1 foi adicionada \xE0 lista.", "info");
        }
      };
      btnAddDate.addEventListener("click", handleAddSelectedDate);
      dateInput.addEventListener("change", () => {
        handleAddSelectedDate();
      });
      pickerRow.appendChild(dateInput);
      pickerRow.appendChild(btnAddDate);
      selectionCard.appendChild(pickerRow);
      const tipText = document.createElement("span");
      tipText.style.cssText = "font-size: 10px; color: #64748b; font-style: italic;";
      tipText.textContent = "Clique no \xEDcone de calend\xE1rio no campo acima para abrir o calend\xE1rio do navegador.";
      selectionCard.appendChild(tipText);
      const datesBadgeRow = document.createElement("div");
      datesBadgeRow.style.cssText = "display: flex; flex-direction: column; gap: 4px; margin-top: 6px; border-top: 1px solid #1e293b; padding-top: 6px;";
      const badgeHeader = document.createElement("div");
      badgeHeader.style.cssText = "display: flex; justify-content: space-between; align-items: center;";
      badgeHeader.innerHTML = `
        <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Datas Selecionadas (${ds.fullDates.length})</span>
      `;
      if (ds.fullDates.length > 0) {
        const btnClear = document.createElement("button");
        btnClear.type = "button";
        btnClear.textContent = "Limpar Todas";
        btnClear.style.cssText = "font-size: 10px; color: #ef4444; background: transparent; border: none; cursor: pointer; text-decoration: underline;";
        btnClear.addEventListener("click", () => {
          ds.fullDates = [];
          ctx.renderInspector();
          ctx.onNodeDataChanged?.();
        });
        badgeHeader.appendChild(btnClear);
      }
      datesBadgeRow.appendChild(badgeHeader);
      if (ds.fullDates.length === 0) {
        const noneSelected = document.createElement("span");
        noneSelected.style.cssText = "font-size: 11px; color: #ef4444; font-style: italic;";
        noneSelected.textContent = "Nenhuma data selecionada no calend\xE1rio.";
        datesBadgeRow.appendChild(noneSelected);
      } else {
        const tagContainer = document.createElement("div");
        tagContainer.style.cssText = "display: flex; flex-wrap: wrap; gap: 4px; max-height: 100px; overflow-y: auto;";
        ds.fullDates.forEach((dt) => {
          const parts = dt.split("-");
          const formatted = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dt;
          const tag = document.createElement("span");
          tag.style.cssText = "background: #7c3aed25; border: 1px solid #7c3aed60; color: #c4b5fd; font-size: 11px; font-family: monospace; padding: 3px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px;";
          tag.innerHTML = `<span>${formatted}</span><button type="button" title="Remover data" style="background:transparent;border:none;color:#ef4444;cursor:pointer;line-height:1;font-size:13px;padding:0;font-weight:bold;">&times;</button>`;
          tag.querySelector("button")?.addEventListener("click", () => {
            ds.fullDates = ds.fullDates.filter((x) => x !== dt);
            ctx.renderInspector();
            ctx.onNodeDataChanged?.();
          });
          tagContainer.appendChild(tag);
        });
        datesBadgeRow.appendChild(tagContainer);
      }
      selectionCard.appendChild(datesBadgeRow);
    }
    body.appendChild(selectionCard);
  }
  static renderFloatingButtonTriggerConfig(body, trig, ctx) {
    if (!trig.floatingButton) {
      trig.floatingButton = {
        buttonText: "Executar Fluxo",
        iconType: "emoji",
        buttonIcon: "\u26A1",
        size: "medium",
        shape: "pill",
        position: "bottom-right",
        offsetX: 24,
        offsetUnitX: "px",
        offsetY: 24,
        offsetUnitY: "px",
        backgroundColor: "#6366f1",
        textColor: "#ffffff",
        opacity: 1,
        requireElement: false,
        requireElementSelector: "",
        requireElementSelectorType: "css",
        filterBySites: false,
        urlPattern: "*://*/*"
      };
    }
    const fb = trig.floatingButton;
    if (!fb.iconType)
      fb.iconType = "emoji";
    if (!fb.offsetUnitX)
      fb.offsetUnitX = "px";
    if (!fb.offsetUnitY)
      fb.offsetUnitY = "px";
    InspectorInputHelpers.addTextInput(body, "Texto do Bot\xE3o", fb.buttonText || "", (val) => {
      fb.buttonText = val;
      ctx.onNodeDataChanged?.();
    });
    const iconGroup = document.createElement("div");
    iconGroup.style.cssText = "background: #0b0f19; border: 1px solid #1e293b; border-radius: 6px; padding: 8px; display: flex; flex-direction: column; gap: 6px;";
    const iconHeader = document.createElement("label");
    iconHeader.style.cssText = "font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;";
    iconHeader.textContent = "Tipo de \xCDcone";
    iconGroup.appendChild(iconHeader);
    const iconTypeSelect = document.createElement("select");
    iconTypeSelect.style.cssText = "width: 100%; padding: 5px 8px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;";
    iconTypeSelect.innerHTML = `
      <option value="emoji" ${fb.iconType === "emoji" ? "selected" : ""}>Emoji / Caractere</option>
      <option value="svg" ${fb.iconType === "svg" ? "selected" : ""}>C\xF3digo SVG</option>
      <option value="image" ${fb.iconType === "image" ? "selected" : ""}>Imagem (Upload)</option>
    `;
    const iconContentDiv = document.createElement("div");
    iconContentDiv.style.cssText = "margin-top: 4px;";
    const renderIconOptions = () => {
      iconContentDiv.innerHTML = "";
      if (fb.iconType === "emoji") {
        const emojiInput = document.createElement("input");
        emojiInput.type = "text";
        emojiInput.value = fb.buttonIcon || "\u26A1";
        emojiInput.placeholder = "ex: \u26A1, \u{1F680}, \u25B6, \u2699\uFE0F";
        emojiInput.style.cssText = "width: 100%; padding: 5px 8px; font-size: 14px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;";
        emojiInput.addEventListener("input", (e) => {
          fb.buttonIcon = e.target.value;
          ctx.onNodeDataChanged?.();
        });
        iconContentDiv.appendChild(emojiInput);
      } else if (fb.iconType === "svg") {
        const svgInput = document.createElement("textarea");
        svgInput.value = fb.svgIcon || '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>';
        svgInput.placeholder = '<svg viewBox="0 0 24 24" ...>...</svg>';
        svgInput.rows = 3;
        svgInput.style.cssText = "width: 100%; padding: 5px 8px; font-size: 11px; font-family: monospace; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px; resize: vertical;";
        svgInput.addEventListener("input", (e) => {
          fb.svgIcon = e.target.value;
          ctx.onNodeDataChanged?.();
        });
        iconContentDiv.appendChild(svgInput);
      } else if (fb.iconType === "image") {
        const uploadContainer = document.createElement("div");
        uploadContainer.style.cssText = "display: flex; flex-direction: column; gap: 6px;";
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/png, image/jpeg, image/svg+xml, image/webp, image/gif";
        fileInput.style.cssText = "font-size: 11px; color: #94a3b8; cursor: pointer;";
        const previewImg = document.createElement("img");
        previewImg.style.cssText = `width: 32px; height: 32px; object-fit: contain; border-radius: 4px; border: 1px solid #243049; background: #172033; display: ${fb.imageIcon ? "block" : "none"};`;
        if (fb.imageIcon)
          previewImg.src = fb.imageIcon;
        fileInput.addEventListener("change", (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (re) => {
              const base64 = re.target?.result;
              fb.imageIcon = base64;
              previewImg.src = base64;
              previewImg.style.display = "block";
              ctx.onNodeDataChanged?.();
            };
            reader.readAsDataURL(file);
          }
        });
        uploadContainer.appendChild(fileInput);
        uploadContainer.appendChild(previewImg);
        iconContentDiv.appendChild(uploadContainer);
      }
    };
    iconTypeSelect.addEventListener("change", (e) => {
      const newType = e.target.value;
      fb.iconType = newType;
      if (newType === "emoji") {
        delete fb.svgIcon;
        delete fb.imageIcon;
        if (!fb.buttonIcon)
          fb.buttonIcon = "\u26A1";
      } else if (newType === "svg") {
        delete fb.buttonIcon;
        delete fb.imageIcon;
        if (!fb.svgIcon)
          fb.svgIcon = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>';
      } else if (newType === "image") {
        delete fb.buttonIcon;
        delete fb.svgIcon;
      }
      renderIconOptions();
      ctx.onNodeDataChanged?.();
    });
    renderIconOptions();
    iconGroup.appendChild(iconTypeSelect);
    iconGroup.appendChild(iconContentDiv);
    body.appendChild(iconGroup);
    const customSizeContainer = document.createElement("div");
    customSizeContainer.style.cssText = `background: #0d1527; border: 1px solid #1e3a8a; border-radius: 6px; padding: 10px; display: ${fb.size === "custom" ? "grid" : "none"}; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: -2px; margin-bottom: 6px;`;
    const widthCol = document.createElement("div");
    widthCol.style.cssText = "display: flex; flex-direction: column; gap: 4px;";
    widthCol.innerHTML = '<label style="font-size: 10px; font-weight: 700; color: #93c5fd; text-transform: uppercase;">Largura (px)</label>';
    const widthInp = document.createElement("input");
    widthInp.type = "number";
    widthInp.min = "30";
    widthInp.max = "800";
    widthInp.value = String(fb.customWidth ?? 160);
    widthInp.style.cssText = "width: 100%; padding: 5px 6px; font-size: 12px; background: #172033; color: white; border: 1px solid #2563eb; border-radius: 4px;";
    widthInp.addEventListener("input", (e) => {
      fb.customWidth = Math.max(20, Number(e.target.value) || 160);
      ctx.onNodeDataChanged?.();
    });
    widthCol.appendChild(widthInp);
    customSizeContainer.appendChild(widthCol);
    const heightCol = document.createElement("div");
    heightCol.style.cssText = "display: flex; flex-direction: column; gap: 4px;";
    heightCol.innerHTML = '<label style="font-size: 10px; font-weight: 700; color: #93c5fd; text-transform: uppercase;">Altura (px)</label>';
    const heightInp = document.createElement("input");
    heightInp.type = "number";
    heightInp.min = "20";
    heightInp.max = "400";
    heightInp.value = String(fb.customHeight ?? 44);
    heightInp.style.cssText = "width: 100%; padding: 5px 6px; font-size: 12px; background: #172033; color: white; border: 1px solid #2563eb; border-radius: 4px;";
    heightInp.addEventListener("input", (e) => {
      fb.customHeight = Math.max(16, Number(e.target.value) || 44);
      ctx.onNodeDataChanged?.();
    });
    heightCol.appendChild(heightInp);
    customSizeContainer.appendChild(heightCol);
    const fontCol = document.createElement("div");
    fontCol.style.cssText = "display: flex; flex-direction: column; gap: 4px;";
    fontCol.innerHTML = '<label style="font-size: 10px; font-weight: 700; color: #93c5fd; text-transform: uppercase;">Fonte (px)</label>';
    const fontInp = document.createElement("input");
    fontInp.type = "number";
    fontInp.min = "8";
    fontInp.max = "48";
    fontInp.value = String(fb.customFontSize ?? 14);
    fontInp.style.cssText = "width: 100%; padding: 5px 6px; font-size: 12px; background: #172033; color: white; border: 1px solid #2563eb; border-radius: 4px;";
    fontInp.addEventListener("input", (e) => {
      fb.customFontSize = Math.max(8, Number(e.target.value) || 14);
      ctx.onNodeDataChanged?.();
    });
    fontCol.appendChild(fontInp);
    customSizeContainer.appendChild(fontCol);
    InspectorInputHelpers.addSelectInput(
      body,
      "Tamanho do Bot\xE3o",
      fb.size || "medium",
      [
        { value: "compact", label: "1. Ultra Compacto (M\xEDnimo)" },
        { value: "small", label: "2. Pequeno (Discreto)" },
        { value: "medium", label: "3. M\xE9dio (Padr\xE3o)" },
        { value: "large", label: "4. Grande (Destaque)" },
        { value: "custom", label: "5. Personalizado (Manual)" }
      ],
      (val) => {
        fb.size = val;
        if (fb.size === "custom") {
          if (!fb.customWidth)
            fb.customWidth = 160;
          if (!fb.customHeight)
            fb.customHeight = 44;
          if (!fb.customFontSize)
            fb.customFontSize = 14;
        }
        customSizeContainer.style.display = fb.size === "custom" ? "grid" : "none";
        ctx.onNodeDataChanged?.();
      }
    );
    body.appendChild(customSizeContainer);
    InspectorInputHelpers.addSelectInput(
      body,
      "Formato do Bot\xE3o",
      fb.shape || "pill",
      [
        { value: "pill", label: "P\xEDlula (Cantos 100% Redondos)" },
        { value: "rounded", label: "Ret\xE2ngulo Arredondado" },
        { value: "circle", label: "C\xEDrculo (\xCDcone Flutuante)" },
        { value: "square", label: "Quadrado (Cantos Retos)" }
      ],
      (val) => {
        fb.shape = val;
        ctx.onNodeDataChanged?.();
      }
    );
    InspectorInputHelpers.addSelectInput(
      body,
      "Posi\xE7\xE3o na Tela",
      fb.position || "bottom-right",
      [
        { value: "bottom-right", label: "Inferior Direito (Padr\xE3o)" },
        { value: "bottom-left", label: "Inferior Esquerdo" },
        { value: "bottom-center", label: "Inferior Centro" },
        { value: "top-right", label: "Superior Direito" },
        { value: "top-left", label: "Superior Esquerdo" },
        { value: "top-center", label: "Superior Centro" },
        { value: "center-left", label: "Centro Esquerdo" },
        { value: "center-right", label: "Centro Direito" },
        { value: "center", label: "Centro da Tela" }
      ],
      (val) => {
        fb.position = val;
        ctx.onNodeDataChanged?.();
      }
    );
    ctx.colorPicker.createPaintColorPicker(body, "Cor de Fundo", fb.backgroundColor || "#6366f1", (val) => {
      fb.backgroundColor = val;
      ctx.onNodeDataChanged?.();
    });
    ctx.colorPicker.createPaintColorPicker(body, "Cor do Texto", fb.textColor || "#ffffff", (val) => {
      fb.textColor = val;
      ctx.onNodeDataChanged?.();
    });
    const currentOpacity = fb.opacity !== void 0 ? Number(fb.opacity) : 1;
    const currentOpacityPct = Math.max(0, Math.min(100, Math.round(currentOpacity * 100)));
    const opacityGroup = document.createElement("div");
    opacityGroup.className = "form-group";
    opacityGroup.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <label style="margin: 0;">Opacidade do Bot\xE3o</label>
        <span class="fb-opacity-label" style="font-size: 11px; font-weight: 700; color: #818cf8;">${currentOpacityPct}%</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <input type="range" min="0" max="100" value="${currentOpacityPct}" style="flex: 1; accent-color: #6366f1;" />
      </div>
    `;
    const rangeEl = opacityGroup.querySelector('input[type="range"]');
    const labelEl = opacityGroup.querySelector(".fb-opacity-label");
    rangeEl?.addEventListener("input", (e) => {
      const val = Number(e.target.value);
      fb.opacity = Math.max(0, Math.min(1, val / 100));
      if (labelEl)
        labelEl.textContent = `${val}%`;
      ctx.onNodeDataChanged?.();
    });
    body.appendChild(opacityGroup);
    const offsetHGroup = document.createElement("div");
    offsetHGroup.className = "form-group";
    offsetHGroup.innerHTML = `
      <label>Deslocamento Horizontal</label>
      <div style="display: flex; gap: 6px; align-items: center;">
        <input type="number" class="offset-h-val" value="${fb.offsetX ?? 24}" style="flex: 1; min-width: 0;" />
        <select class="offset-h-unit" style="width: 70px; padding: 6px 8px; font-size: 12px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px; cursor: pointer;">
          <option value="px" ${(fb.offsetUnitX || "px") === "px" ? "selected" : ""}>px</option>
          <option value="%" ${fb.offsetUnitX === "%" ? "selected" : ""}>%</option>
          <option value="rem" ${fb.offsetUnitX === "rem" ? "selected" : ""}>rem</option>
          <option value="vw" ${fb.offsetUnitX === "vw" ? "selected" : ""}>vw</option>
        </select>
      </div>
    `;
    offsetHGroup.querySelector(".offset-h-val")?.addEventListener("input", (e) => {
      fb.offsetX = Number(e.target.value);
      ctx.onNodeDataChanged?.();
    });
    offsetHGroup.querySelector(".offset-h-unit")?.addEventListener("change", (e) => {
      fb.offsetUnitX = e.target.value;
      ctx.onNodeDataChanged?.();
    });
    body.appendChild(offsetHGroup);
    const offsetVGroup = document.createElement("div");
    offsetVGroup.className = "form-group";
    offsetVGroup.innerHTML = `
      <label>Deslocamento Vertical</label>
      <div style="display: flex; gap: 6px; align-items: center;">
        <input type="number" class="offset-v-val" value="${fb.offsetY ?? 24}" style="flex: 1; min-width: 0;" />
        <select class="offset-v-unit" style="width: 70px; padding: 6px 8px; font-size: 12px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px; cursor: pointer;">
          <option value="px" ${(fb.offsetUnitY || "px") === "px" ? "selected" : ""}>px</option>
          <option value="%" ${fb.offsetUnitY === "%" ? "selected" : ""}>%</option>
          <option value="rem" ${fb.offsetUnitY === "rem" ? "selected" : ""}>rem</option>
          <option value="vh" ${fb.offsetUnitY === "vh" ? "selected" : ""}>vh</option>
        </select>
      </div>
    `;
    offsetVGroup.querySelector(".offset-v-val")?.addEventListener("input", (e) => {
      fb.offsetY = Number(e.target.value);
      ctx.onNodeDataChanged?.();
    });
    offsetVGroup.querySelector(".offset-v-unit")?.addEventListener("change", (e) => {
      fb.offsetUnitY = e.target.value;
      ctx.onNodeDataChanged?.();
    });
    body.appendChild(offsetVGroup);
    InspectorInputHelpers.addCheckboxInput(
      body,
      "Permitir Arrastar o Bot\xE3o Flutuante (CTRL + Clique / Arraste)",
      fb.allowDrag ?? true,
      (val) => {
        fb.allowDrag = val;
        ctx.onNodeDataChanged?.();
      }
    );
    const isRequireElem = Boolean(fb.requireElement);
    const requireElemContainer = document.createElement("div");
    requireElemContainer.style.cssText = "background: #0b0f19; border: 1px solid #1e293b; border-radius: 6px; padding: 10px; display: flex; flex-direction: column; gap: 8px; margin-top: 4px; box-sizing: border-box; width: 100%; overflow: hidden;";
    const requireElemHeader = document.createElement("div");
    requireElemHeader.style.cssText = "display: flex; flex-direction: column; gap: 6px; width: 100%;";
    requireElemHeader.innerHTML = `
      <label style="font-size: 11px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; margin: 0; line-height: 1.4;">Exibir apenas quando elemento especificado estiver na aba</label>
      <select class="select-req-elem-toggle select-toggle-control" style="width: 100%;">
        <option value="false" ${!isRequireElem ? "selected" : ""}>N\xE3o (Sempre vis\xEDvel)</option>
        <option value="true" ${isRequireElem ? "selected" : ""}>Sim (Apenas se elemento existir)</option>
      </select>
    `;
    requireElemContainer.appendChild(requireElemHeader);
    const requireElemDetails = document.createElement("div");
    requireElemDetails.style.cssText = `display: ${isRequireElem ? "flex" : "none"}; flex-direction: column; gap: 8px; border-top: 1px solid #1e293b; padding-top: 8px; width: 100%; box-sizing: border-box;`;
    InspectorInputHelpers.addSelectorInput(
      requireElemDetails,
      "Seletor do Elemento Obrigat\xF3rio",
      fb.requireElementSelector || "",
      (val) => {
        fb.requireElementSelector = val.trim();
        ctx.onNodeDataChanged?.();
      }
    );
    InspectorInputHelpers.addSelectInput(
      requireElemDetails,
      "Tipo do Seletor",
      fb.requireElementSelectorType || "css",
      [
        { value: "css", label: "Seletor CSS" },
        { value: "xpath", label: "XPath" }
      ],
      (val) => {
        fb.requireElementSelectorType = val;
        ctx.onNodeDataChanged?.();
      }
    );
    requireElemContainer.appendChild(requireElemDetails);
    requireElemHeader.querySelector(".select-req-elem-toggle")?.addEventListener("change", (e) => {
      const active = e.target.value === "true";
      fb.requireElement = active;
      requireElemDetails.style.display = active ? "flex" : "none";
      ctx.onNodeDataChanged?.();
    });
    body.appendChild(requireElemContainer);
    const isFilterSites = Boolean(fb.filterBySites);
    const sitesContainer = document.createElement("div");
    sitesContainer.style.cssText = "background: #0b0f19; border: 1px solid #1e293b; border-radius: 6px; padding: 10px; display: flex; flex-direction: column; gap: 8px; margin-top: 4px; box-sizing: border-box; width: 100%; overflow: hidden;";
    const sitesHeader = document.createElement("div");
    sitesHeader.style.cssText = "display: flex; flex-direction: column; gap: 6px; width: 100%;";
    sitesHeader.innerHTML = `
      <label style="font-size: 11px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; margin: 0; line-height: 1.4;">Exibir apenas quando estiver em um ou mais sites espec\xEDficos</label>
      <select class="select-sites-toggle select-toggle-control" style="width: 100%;">
        <option value="false" ${!isFilterSites ? "selected" : ""}>N\xE3o (Exibir em todos os sites)</option>
        <option value="true" ${isFilterSites ? "selected" : ""}>Sim (Filtrar por URLs)</option>
      </select>
    `;
    sitesContainer.appendChild(sitesHeader);
    const sitesDetails = document.createElement("div");
    sitesDetails.style.cssText = `display: ${isFilterSites ? "flex" : "none"}; flex-direction: column; gap: 8px; border-top: 1px solid #1e293b; padding-top: 8px; width: 100%; box-sizing: border-box;`;
    if (!Array.isArray(trig.urlPatterns)) {
      trig.urlPatterns = fb.urlPattern && fb.urlPattern !== "*://*/*" ? [fb.urlPattern] : ["https://*/*"];
    }
    this.renderUrlListSection(sitesDetails, "Sites / URLs Permitidas", trig.urlPatterns, (newList) => {
      trig.urlPatterns = newList;
      fb.urlPattern = newList[0] || "*://*/*";
    }, ctx);
    sitesContainer.appendChild(sitesDetails);
    sitesHeader.querySelector(".select-sites-toggle")?.addEventListener("change", (e) => {
      const active = e.target.value === "true";
      fb.filterBySites = active;
      sitesDetails.style.display = active ? "flex" : "none";
      if (!active) {
        fb.urlPattern = "*://*/*";
      }
      ctx.onNodeDataChanged?.();
    });
    body.appendChild(sitesContainer);
  }
  static renderUrlListSection(container, labelText, currentList, onUpdate, ctx) {
    const urlSection = document.createElement("div");
    urlSection.style.cssText = "display: flex; flex-direction: column; gap: 4px; margin-top: 4px;";
    const secHeader = document.createElement("div");
    secHeader.style.cssText = "display: flex; justify-content: space-between; align-items: center;";
    secHeader.innerHTML = `
      <label style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">${labelText} (${currentList.length})</label>
    `;
    urlSection.appendChild(secHeader);
    const itemsDiv = document.createElement("div");
    itemsDiv.style.cssText = "display: flex; flex-direction: column; gap: 4px;";
    if (currentList.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.style.cssText = "font-size: 11px; color: #64748b; font-style: italic;";
      emptyMsg.textContent = "Nenhuma URL definida (executa em qualquer p\xE1gina).";
      itemsDiv.appendChild(emptyMsg);
    } else {
      currentList.forEach((urlVal, uIdx) => {
        const row = document.createElement("div");
        row.style.cssText = "display: flex; gap: 4px; align-items: center;";
        const inp = document.createElement("input");
        inp.type = "text";
        inp.value = urlVal;
        inp.placeholder = "ex: *://*.google.com/* ou https://exemplo.com/painel";
        inp.style.cssText = "flex: 1; padding: 4px 6px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;";
        inp.addEventListener("input", (e) => {
          currentList[uIdx] = e.target.value;
          onUpdate(currentList);
          ctx.onNodeDataChanged?.();
        });
        const delUrlBtn = document.createElement("button");
        delUrlBtn.type = "button";
        delUrlBtn.innerHTML = "&times;";
        delUrlBtn.title = "Remover URL";
        delUrlBtn.style.cssText = "background: #ef444420; color: #ef4444; border: 1px solid #ef444440; border-radius: 4px; width: 22px; height: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center;";
        delUrlBtn.addEventListener("click", () => {
          currentList.splice(uIdx, 1);
          onUpdate(currentList);
          ctx.renderInspector();
          ctx.onNodeDataChanged?.();
        });
        row.appendChild(inp);
        row.appendChild(delUrlBtn);
        itemsDiv.appendChild(row);
      });
    }
    urlSection.appendChild(itemsDiv);
    const btnAddUrl = document.createElement("button");
    btnAddUrl.type = "button";
    btnAddUrl.className = "btn-xs";
    btnAddUrl.style.cssText = "width: 100%; margin-top: 4px; padding: 4px 6px; font-size: 11px; background: #1e293b; border: 1px solid #334155; color: #94a3b8; cursor: pointer; border-radius: 4px;";
    btnAddUrl.textContent = "+ Adicionar URL para Execu\xE7\xE3o";
    btnAddUrl.addEventListener("click", () => {
      currentList.push("*://*/*");
      onUpdate(currentList);
      ctx.renderInspector();
      ctx.onNodeDataChanged?.();
    });
    urlSection.appendChild(btnAddUrl);
    container.appendChild(urlSection);
  }
};

// src/editor/modules/inspectorManager.ts
var InspectorManager = class {
  constructor(callbacks, colorPicker) {
    this.callbacks = callbacks;
    this.colorPicker = colorPicker;
  }
  expandedTriggerIndices = /* @__PURE__ */ new Set([0]);
  expandedCaseIndices = /* @__PURE__ */ new Set([0]);
  pendingScrollSelector;
  renderInspector(scrollToSelector) {
    if (scrollToSelector) {
      this.pendingScrollSelector = scrollToSelector;
    }
    const sidebarRight = document.getElementById("sidebarInspector");
    const resizerRight = document.getElementById("resizerRight");
    const noSelect = document.getElementById("noSelectionMessage");
    const form = document.getElementById("nodePropertiesForm");
    const selectedId = this.callbacks.getSelectedNodeId();
    if (!selectedId) {
      if (sidebarRight)
        sidebarRight.classList.add("collapsed");
      if (resizerRight)
        resizerRight.style.display = "none";
      noSelect.classList.remove("hidden");
      form.classList.add("hidden");
      return;
    }
    const graph = this.callbacks.getGraph();
    const node = graph.nodes.find((n) => n.id === selectedId);
    if (!node) {
      if (sidebarRight)
        sidebarRight.classList.add("collapsed");
      if (resizerRight)
        resizerRight.style.display = "none";
      return;
    }
    if (sidebarRight)
      sidebarRight.classList.remove("collapsed");
    if (resizerRight)
      resizerRight.style.display = "block";
    noSelect.classList.add("hidden");
    form.classList.remove("hidden");
    this.populatePropertiesForm(form, node);
    const modalForm = document.getElementById("expandedNodeModalForm");
    if (modalForm) {
      this.populatePropertiesForm(modalForm, node);
    }
    if (this.pendingScrollSelector) {
      const sel = this.pendingScrollSelector;
      this.pendingScrollSelector = void 0;
      this.scrollTargetIntoInspectorView(sel);
    }
  }
  /**
   * Preenche o formulário de propriedades para um nó específico
   */
  populatePropertiesForm(form, node) {
    form.innerHTML = "";
    const typeBadge = document.createElement("div");
    typeBadge.style.cssText = "font-size: 11px; color: #818cf8; margin-bottom: 4px; font-weight: 700; text-transform: uppercase;";
    typeBadge.textContent = `Bloco: ${node.type}`;
    form.appendChild(typeBadge);
    this.addTextInput(form, "T\xEDtulo do Bloco", node.data.label || "", (val) => {
      node.data.label = val;
      const renderedHeader = document.querySelector(`#rendered_${node.id} .graph-node-title-text`);
      if (renderedHeader)
        renderedHeader.textContent = val || node.type;
      this.callbacks.onNodeDataChanged();
      const modalTitle = document.getElementById("expandedModalNodeTitle");
      if (modalTitle)
        modalTitle.textContent = val || node.type;
    });
    this.addTextareaInput(form, "Descri\xE7\xE3o / Objetivo", node.data.description || "", (val) => {
      node.data.description = val;
      const renderedDesc = document.querySelector(`#rendered_${node.id} .graph-node-desc-preview`);
      if (renderedDesc) {
        renderedDesc.textContent = val || "";
        renderedDesc.style.display = val ? "block" : "none";
      }
      this.callbacks.onNodeDataChanged();
    });
    const data = node.data;
    switch (node.type) {
      case "start":
        StartPropertiesRenderer.renderStartBlock(form, data, {
          renderInspector: (sel) => this.renderInspector(sel),
          expandedTriggerIndices: this.expandedTriggerIndices,
          colorPicker: this.colorPicker,
          onNodeDataChanged: this.callbacks.onNodeDataChanged,
          showToast: this.callbacks.showToast
        });
        break;
      case "delay":
        FlowPropertiesRenderer.renderDelay(form, data, {
          renderInspector: (sel) => this.renderInspector(sel),
          expandedCaseIndices: this.expandedCaseIndices,
          onNodeDataChanged: this.callbacks.onNodeDataChanged,
          showToast: this.callbacks.showToast
        });
        break;
      case "switch":
        FlowPropertiesRenderer.renderSwitch(form, data, {
          renderInspector: (sel) => this.renderInspector(sel),
          expandedCaseIndices: this.expandedCaseIndices,
          onNodeDataChanged: this.callbacks.onNodeDataChanged,
          showToast: this.callbacks.showToast
        });
        break;
      case "while_loop":
        FlowPropertiesRenderer.renderWhile(form, data, {
          renderInspector: (sel) => this.renderInspector(sel),
          expandedCaseIndices: this.expandedCaseIndices,
          onNodeDataChanged: this.callbacks.onNodeDataChanged,
          showToast: this.callbacks.showToast
        });
        break;
      case "for_loop":
        FlowPropertiesRenderer.renderFor(form, data, {
          renderInspector: (sel) => this.renderInspector(sel),
          expandedCaseIndices: this.expandedCaseIndices,
          onNodeDataChanged: this.callbacks.onNodeDataChanged,
          showToast: this.callbacks.showToast
        });
        break;
      case "if_element_exists":
        FlowPropertiesRenderer.renderIfElement(form, data);
        break;
      case "try_catch":
        this.addTextInput(form, "Salvar Erro na Vari\xE1vel", data.errorVarName || "lastError", (val) => data.errorVarName = val);
        break;
      case "group":
        this.colorPicker.createPaintColorPicker(form, "Cor de Destaque", data.color || "#6366f1", (val) => {
          data.color = val;
          this.callbacks.onRenderGraph();
        });
        this.addTextareaInput(form, "Descri\xE7\xE3o do Grupo", data.description || "", (val) => data.description = val);
        break;
      case "navigate":
        this.addTextInput(form, "URL de Destino", data.url || "https://", (val) => data.url = val);
        this.addSelectInput(form, "Aguardar Carregamento", data.waitUntil || "load", [
          { value: "domcontentloaded", label: "DOM Pronto (domcontentloaded)" },
          { value: "load", label: "Carregamento Completo (load)" },
          { value: "networkidle", label: "Rede Ociosa (networkidle)" },
          { value: "none", label: "Imediato (none)" }
        ], (val) => data.waitUntil = val);
        this.addNumberInput(form, "Tempo Limite / Timeout (ms)", data.timeoutMs ?? 3e4, (val) => data.timeoutMs = val);
        break;
      case "tab_action":
        DomPropertiesRenderer.renderTabAction(form, data, {
          renderInspector: () => this.renderInspector()
        });
        break;
      case "history_navigation":
        this.addSelectInput(form, "A\xE7\xE3o de Navega\xE7\xE3o", data.action || "reload", [
          { value: "reload", label: "Recarregar P\xE1gina" },
          { value: "back", label: "Voltar P\xE1gina" },
          { value: "forward", label: "Avan\xE7ar P\xE1gina" }
        ], (val) => {
          data.action = val;
          this.renderInspector();
        });
        if (data.action === "reload") {
          this.addCheckboxInput(form, "Ignorar Cache do Navegador", !!data.ignoreCache, (val) => data.ignoreCache = val);
        }
        break;
      case "click_element":
        DomPropertiesRenderer.renderClick(form, data);
        break;
      case "type_input":
        DomPropertiesRenderer.renderTypeInput(form, data, {
          renderInspector: () => this.renderInspector()
        });
        break;
      case "press_key":
        this.addTextInput(form, "Tecla (ex: Enter, Escape, Tab, ArrowDown)", data.key || "Enter", (val) => data.key = val);
        InspectorInputHelpers.addSelectorInput(form, "Seletor Alvo (Opcional)", data.selector || "", (val) => data.selector = val);
        this.addSelectInput(form, "Tipo de Seletor", data.selectorType || "css", [
          { value: "css", label: "Seletor CSS" },
          { value: "xpath", label: "XPath" }
        ], (val) => data.selectorType = val);
        break;
      case "hover_focus":
        InspectorInputHelpers.addSelectorInput(form, "Seletor do Elemento", data.selector || "", (val) => data.selector = val);
        this.addSelectInput(form, "Tipo de Seletor", data.selectorType || "css", [
          { value: "css", label: "Seletor CSS" },
          { value: "xpath", label: "XPath" }
        ], (val) => data.selectorType = val);
        this.addSelectInput(form, "A\xE7\xE3o", data.action || "hover", [
          { value: "hover", label: "Passar Mouse (Hover)" },
          { value: "focus", label: "Focar no Elemento (Focus)" }
        ], (val) => data.action = val);
        this.addNumberInput(form, "Tempo Limite (ms)", data.timeoutMs ?? 5e3, (val) => data.timeoutMs = val);
        break;
      case "scroll":
        DomPropertiesRenderer.renderScroll(form, data, {
          renderInspector: () => this.renderInspector()
        });
        break;
      case "wait_for_element":
        InspectorInputHelpers.addSelectorInput(form, "Seletor do Elemento", data.selector || "", (val) => data.selector = val);
        this.addSelectInput(form, "Tipo de Seletor", data.selectorType || "css", [
          { value: "css", label: "Seletor CSS" },
          { value: "xpath", label: "XPath" }
        ], (val) => data.selectorType = val);
        this.addSelectInput(form, "Estado Esperado", data.state || "visible", [
          { value: "visible", label: "Vis\xEDvel na Tela" },
          { value: "clickable", label: "Clic\xE1vel e Habilitado" },
          { value: "hidden", label: "Oculto ou Desaparecido" },
          { value: "attached", label: "Presente no C\xF3digo DOM" }
        ], (val) => data.state = val);
        this.addNumberInput(form, "Tempo Limite (ms)", data.timeoutMs ?? 1e4, (val) => data.timeoutMs = val);
        break;
      case "http_request":
        DataPropertiesRenderer.renderHttpRequest(form, data, {
          renderInspector: () => this.renderInspector()
        });
        break;
      case "set_variable":
        this.addTextInput(form, "Nome da Vari\xE1vel", data.varName || "meuDado", (val) => data.varName = val);
        this.addSelectInput(form, "Tipo de Avalia\xE7\xE3o", data.evaluationType || "literal", [
          { value: "literal", label: "Valor Fixo Literal" },
          { value: "template", label: "Template com Interpola\xE7\xE3o {{var}}" },
          { value: "js_eval", label: "Express\xE3o JavaScript Din\xE2mica" }
        ], (val) => {
          data.evaluationType = val;
          this.renderInspector();
        });
        if (data.evaluationType === "js_eval") {
          this.addCodeEditorInput(form, "C\xF3digo / Express\xE3o JavaScript", "javascript", data.valueExpression ?? "", (val) => data.valueExpression = val, "180px");
        } else {
          this.addTextareaInput(form, "Valor ou Express\xE3o", data.valueExpression ?? "", (val) => data.valueExpression = val);
        }
        break;
      case "extract_data":
        DataPropertiesRenderer.renderExtractData(form, data, {
          renderInspector: () => this.renderInspector()
        });
        break;
      case "scrape_list":
        DataPropertiesRenderer.renderScrapeList(form, data, {
          renderInspector: () => this.renderInspector()
        });
        break;
      case "export_file":
        this.addTextInput(form, "Vari\xE1vel Fonte dos Dados", data.sourceVar || "items", (val) => data.sourceVar = val);
        this.addSelectInput(form, "Formato do Arquivo", data.format || "json", [
          { value: "json", label: "JSON (.json)" },
          { value: "csv", label: "CSV (.csv)" }
        ], (val) => {
          data.format = val;
          this.renderInspector();
        });
        this.addTextInput(form, "Nome do Arquivo para Salvar", data.filename || "dados.json", (val) => data.filename = val);
        if (data.format === "csv") {
          this.addTextInput(form, "Delimitador CSV", data.csvDelimiter || ",", (val) => data.csvDelimiter = val);
        }
        break;
      case "inject_javascript":
        this.addSelectInput(form, "Ambiente de Execu\xE7\xE3o", data.context || "content_script", [
          { value: "content_script", label: "Na P\xE1gina Aberta (Content Script)" },
          { value: "background", label: "No Background da Extens\xE3o" }
        ], (val) => data.context = val);
        this.addCodeEditorInput(form, "C\xF3digo JavaScript", "javascript", data.code || 'console.log("Ol\xE1");', (val) => data.code = val, "220px");
        this.addTextInput(form, "Salvar Resultado na Vari\xE1vel (opcional)", data.saveResultToVar || "", (val) => data.saveResultToVar = val);
        break;
      case "inject_html":
        InspectorInputHelpers.addSelectorInput(form, "Seletor do Elemento Alvo", data.targetSelector || "body", (val) => data.targetSelector = val);
        this.addSelectInput(form, "Tipo de Seletor", data.selectorType || "css", [
          { value: "css", label: "Seletor CSS" },
          { value: "xpath", label: "XPath" }
        ], (val) => data.selectorType = val);
        this.addSelectInput(form, "Posi\xE7\xE3o da Inje\xE7\xE3o", data.position || "beforeend", [
          { value: "beforeend", label: "No Final do Elemento (beforeend)" },
          { value: "afterbegin", label: "No In\xEDcio do Elemento (afterbegin)" },
          { value: "beforebegin", label: "Antes do Elemento (beforebegin)" },
          { value: "afterend", label: "Depois do Elemento (afterend)" }
        ], (val) => data.position = val);
        this.addCodeEditorInput(form, "Conte\xFAdo HTML", "html", data.html || "", (val) => data.html = val, "200px");
        break;
      case "inject_css":
        this.addSelectInput(form, "Alvo do CSS", data.target || "page", [
          { value: "page", label: "P\xE1gina Inteira" },
          { value: "injected_component", label: "Componente Injetado" }
        ], (val) => data.target = val);
        this.addTextInput(form, "ID da Tag Style (opcional)", data.styleId || "custom-style", (val) => data.styleId = val);
        this.addCodeEditorInput(form, "C\xF3digo CSS", "css", data.css || "", (val) => data.css = val, "200px");
        break;
      case "web_component":
        this.addTextInput(form, "ID do Container HTML", data.containerId || "custom-widget", (val) => data.containerId = val);
        this.addSelectInput(form, "Modo de Isolamento", data.mode || "shadow_dom", [
          { value: "shadow_dom", label: "Shadow DOM Isolado" },
          { value: "inline", label: "Inline no DOM" }
        ], (val) => data.mode = val);
        this.addCodeEditorInput(form, "C\xF3digo HTML", "html", data.html || "", (val) => data.html = val, "180px");
        this.addCodeEditorInput(form, "C\xF3digo CSS", "css", data.css || "", (val) => data.css = val, "180px");
        this.addCodeEditorInput(form, "C\xF3digo JavaScript", "javascript", data.js || "", (val) => data.js = val, "180px");
        break;
      case "note":
        this.addTextareaInput(form, "Conte\xFAdo da Anota\xE7\xE3o", data.content || "", (val) => data.content = val);
        break;
    }
  }
  /**
   * Abre o modal centralizado e grande com as configurações do bloco
   */
  openExpandedModal(nodeId) {
    const targetNodeId = nodeId || this.callbacks.getSelectedNodeId();
    if (!targetNodeId) {
      this.callbacks.showToast("Nenhum bloco selecionado para expandir.", "warning");
      return;
    }
    const graph = this.callbacks.getGraph();
    const node = graph.nodes.find((n) => n.id === targetNodeId);
    if (!node)
      return;
    this.closeExpandedModal();
    const backdrop = document.createElement("div");
    backdrop.id = "expandedNodeModalBackdrop";
    backdrop.className = "flow-modal-backdrop";
    backdrop.innerHTML = `
      <div class="node-expand-modal-card">
        <div class="node-expand-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(59, 130, 246, 0.15); display: flex; align-items: center; justify-content: center; color: #60a5fa;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h3 id="expandedModalNodeTitle" style="font-size: 15px; font-weight: 700; color: #f8fafc; margin: 0;">${node.data.label || node.type}</h3>
                <span style="font-size: 10px; background: #1e293b; color: #818cf8; padding: 2px 6px; border-radius: 4px; font-weight: 600; text-transform: uppercase;">${node.type}</span>
              </div>
              <p style="font-size: 11px; color: #94a3b8; margin: 2px 0 0 0;">Configura\xE7\xF5es expandidas do bloco selecionado</p>
            </div>
          </div>
          <button id="btnCloseExpandedModal" class="sidebar-toggle-btn" title="Fechar visualiza\xE7\xE3o expandida (Esc)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="node-expand-body">
          <form id="expandedNodeModalForm" class="node-form">
            <!-- Campos gerados dinamicamente -->
          </form>
        </div>
        <!-- Bot\xF5es de A\xE7\xE3o do Rodap\xE9 -->
        <div class="node-expand-footer" style="display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 20px; border-top: 1px solid #1e293b; background: #0b1120;">
          <button type="button" id="btnDiscardExpandedModal" class="btn btn-secondary" style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; font-size: 13px; color: #f87171; border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.08); cursor: pointer; border-radius: 6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            <span>Descartar Altera\xE7\xF5es</span>
          </button>
          <div style="display: flex; gap: 10px;">
            <button type="button" id="btnDoneExpandedModal" class="btn btn-primary" style="display: flex; align-items: center; gap: 6px; padding: 8px 22px; font-size: 13px; background: #6366f1; border-color: #6366f1; cursor: pointer; border-radius: 6px; font-weight: 600;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Concluir e Aplicar</span>
            </button>
          </div>
        </div>
      </div>
    `;
    const backupNodeData = JSON.parse(JSON.stringify(node.data || {}));
    let changesCommitted = false;
    const formEl = backdrop.querySelector("#expandedNodeModalForm");
    this.populatePropertiesForm(formEl, node);
    const discardChanges = () => {
      node.data = JSON.parse(JSON.stringify(backupNodeData));
      this.closeExpandedModal();
      this.renderInspector();
      this.callbacks.onNodeDataChanged();
      this.callbacks.showToast("Altera\xE7\xF5es no bloco foram descartadas.", "info");
    };
    const commitChanges = () => {
      changesCommitted = true;
      this.closeExpandedModal();
      this.renderInspector();
      this.callbacks.onNodeDataChanged();
      this.callbacks.showToast("Altera\xE7\xF5es no bloco aplicadas com sucesso!", "success");
    };
    backdrop.querySelector("#btnDiscardExpandedModal")?.addEventListener("click", discardChanges);
    backdrop.querySelector("#btnDoneExpandedModal")?.addEventListener("click", commitChanges);
    const handleCloseDialog = () => {
      if (!changesCommitted) {
        discardChanges();
      }
    };
    backdrop.querySelector("#btnCloseExpandedModal")?.addEventListener("click", handleCloseDialog);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        e.stopPropagation();
      }
    });
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseDialog();
        window.removeEventListener("keydown", onKeyDown);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.appendChild(backdrop);
  }
  /**
   * Fecha o modal expandido se estiver aberto
   */
  closeExpandedModal() {
    const existing = document.getElementById("expandedNodeModalBackdrop");
    existing?.remove();
  }
  // Helpers de criação de inputs
  addTextInput(container, labelText, value, onChange) {
    const group = document.createElement("div");
    group.className = "form-group";
    group.innerHTML = `<label>${labelText}</label><input type="text" value="${value ?? ""}" />`;
    group.querySelector("input")?.addEventListener("input", (e) => onChange(e.target.value));
    container.appendChild(group);
  }
  addNumberInput(container, labelText, value, onChange) {
    const group = document.createElement("div");
    group.className = "form-group";
    group.innerHTML = `<label>${labelText}</label><input type="number" value="${value ?? 0}" />`;
    group.querySelector("input")?.addEventListener("input", (e) => onChange(Number(e.target.value)));
    container.appendChild(group);
  }
  addSelectInput(container, labelText, selectedValue, options, onChange) {
    const group = document.createElement("div");
    group.className = "form-group";
    let optionsHtml = "";
    options.forEach((opt) => {
      const isSelected = String(selectedValue) === opt.value;
      optionsHtml += `<option value="${opt.value}" ${isSelected ? "selected" : ""}>${opt.label}</option>`;
    });
    group.innerHTML = `<label>${labelText}</label><select>${optionsHtml}</select>`;
    group.querySelector("select")?.addEventListener("change", (e) => onChange(e.target.value));
    container.appendChild(group);
  }
  addCheckboxInput(container, labelText, checked, onChange) {
    const group = document.createElement("div");
    group.className = "form-group";
    group.innerHTML = `
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
        <input type="checkbox" ${checked ? "checked" : ""} style="cursor:pointer;" />
        ${labelText}
      </label>
    `;
    group.querySelector("input")?.addEventListener("change", (e) => onChange(e.target.checked));
    container.appendChild(group);
  }
  addTextareaInput(container, labelText, value, onChange) {
    const group = document.createElement("div");
    group.className = "form-group";
    group.innerHTML = `<label>${labelText}</label><textarea rows="4" style="min-height: 84px; line-height: 1.4; resize: vertical;">${value ?? ""}</textarea>`;
    group.querySelector("textarea")?.addEventListener("input", (e) => onChange(e.target.value));
    container.appendChild(group);
  }
  addCodeEditorInput(container, labelText, language, value, onChange, _height = "200px") {
    const isExpandedModal = Boolean(container.closest("#expandedNodeModalForm"));
    if (isExpandedModal) {
      const group2 = document.createElement("div");
      group2.className = "form-group code-editor-form-group";
      const label = document.createElement("label");
      label.textContent = labelText;
      group2.appendChild(label);
      const editor = new CodeEditorComponent({
        language,
        value: value || "",
        onChange,
        title: labelText,
        height: "240px"
      });
      group2.appendChild(editor.getElement());
      container.appendChild(group2);
      return;
    }
    const group = document.createElement("div");
    group.className = "form-group code-preview-group";
    const langBadgeColor = {
      javascript: "#f59e0b",
      html: "#ec4899",
      css: "#06b6d4"
    }[language];
    const langTitle = {
      javascript: "JS",
      html: "HTML",
      css: "CSS"
    }[language];
    const linesCount = (value || "").split("\n").length;
    const previewSnippet = (value || "").trim().split("\n").slice(0, 3).join("\n") || "// (sem c\xF3digo)";
    group.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <label style="margin-bottom: 0;">${labelText}</label>
        <span style="font-size: 10px; font-weight: 700; color: ${langBadgeColor}; background: rgba(255,255,255,0.06); padding: 1px 6px; border-radius: 4px;">${langTitle}</span>
      </div>
      <div class="code-field-trigger-card" title="Clique para abrir o editor de c\xF3digo completo sobre o canvas">
        <div class="code-field-trigger-header">
          <div style="display: flex; align-items: center; gap: 6px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${langBadgeColor}" stroke-width="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span style="font-size: 11px; font-weight: 600; color: #cbd5e1;">Editar ${langTitle}</span>
          </div>
          <span class="code-field-line-count" style="font-size: 10px; color: #64748b;">${linesCount} linha${linesCount === 1 ? "" : "s"}</span>
        </div>
        <pre class="code-field-preview-code"><code>${this.escapeSnippet(previewSnippet)}</code></pre>
        <div class="code-field-trigger-footer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          <span>Abrir Editor sobre o Canvas</span>
        </div>
      </div>
    `;
    const openEditor = () => {
      CodeEditorComponent.openCodeModal({
        title: labelText,
        language,
        value: value || "",
        onSave: (newVal) => {
          onChange(newVal);
          const newLines = (newVal || "").split("\n").length;
          const countEl = group.querySelector(".code-field-line-count");
          if (countEl)
            countEl.textContent = `${newLines} linha${newLines === 1 ? "" : "s"}`;
          const codeEl = group.querySelector(".code-field-preview-code code");
          if (codeEl) {
            const snip = (newVal || "").trim().split("\n").slice(0, 3).join("\n") || "// (sem c\xF3digo)";
            codeEl.innerHTML = this.escapeSnippet(snip);
          }
          this.callbacks.onNodeDataChanged();
          this.callbacks.showToast("C\xF3digo salvo com sucesso!", "success");
        }
      });
    };
    group.querySelector(".code-field-trigger-card")?.addEventListener("click", openEditor);
    container.appendChild(group);
  }
  escapeSnippet(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  /**
   * Garante que o elemento recém expandido na barra lateral direita fique visível rolando a barra
   */
  scrollTargetIntoInspectorView(elementOrSelector) {
    requestAnimationFrame(() => {
      const container = document.getElementById("tabProperties");
      if (!container)
        return;
      const el = typeof elementOrSelector === "string" ? container.querySelector(elementOrSelector) : elementOrSelector;
      if (!el)
        return;
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setTimeout(() => {
        const cRect = container.getBoundingClientRect();
        const eRect = el.getBoundingClientRect();
        if (eRect.bottom > cRect.bottom) {
          const delta = eRect.bottom - cRect.bottom + 16;
          container.scrollBy({ top: delta, behavior: "smooth" });
        } else if (eRect.top < cRect.top) {
          const delta = eRect.top - cRect.top - 16;
          container.scrollBy({ top: delta, behavior: "smooth" });
        }
      }, 50);
    });
  }
};

// src/editor/modules/canvasPathUtils.ts
var CanvasPathUtils = class {
  /**
   * Calcula as coordenadas do centro de uma porta/handle para ligar arestas
   */
  static getHandleCenterPoint(handleEl, fallbackX, fallbackY) {
    if (!handleEl)
      return { x: fallbackX, y: fallbackY };
    const nodeEl = handleEl.closest(".graph-node");
    if (!nodeEl)
      return { x: fallbackX, y: fallbackY };
    const nodeLeft = parseFloat(nodeEl.style.left) || 0;
    const nodeTop = parseFloat(nodeEl.style.top) || 0;
    let localLeft = handleEl.offsetLeft;
    let localTop = handleEl.offsetTop;
    let curr = handleEl.offsetParent;
    while (curr && curr !== nodeEl) {
      localLeft += curr.offsetLeft;
      localTop += curr.offsetTop;
      curr = curr.offsetParent;
    }
    const width = handleEl.offsetWidth || 12;
    const height = handleEl.offsetHeight || 12;
    return {
      x: nodeLeft + localLeft + width / 2,
      y: nodeTop + localTop + height / 2
    };
  }
  /**
   * Roteia uma corda ortogonal evitando atravessar blocos (obstáculos).
   * Usa A* sobre uma grade esparsa formada pelas bordas dos obstáculos, penalizando curvas.
   * Retorna null se não houver rota (o chamador usa o caminho padrão).
   */
  static routeAroundObstacles(x1, y1, x2, y2, obstacles) {
    const pad = 14;
    const stub = 20;
    const s = { x: x1 + stub, y: y1 };
    const t = { x: x2 - stub, y: y2 };
    const rects = obstacles.map((o) => ({ l: o.x - pad, t: o.y - pad, r: o.x + o.w + pad, b: o.y + o.h + pad })).filter((o) => {
      const inside = (p) => p.x > o.l && p.x < o.r && p.y > o.t && p.y < o.b;
      return !inside(s) && !inside(t);
    });
    if (rects.length === 0)
      return null;
    const xsSet = /* @__PURE__ */ new Set([s.x, t.x]);
    const ysSet = /* @__PURE__ */ new Set([s.y, t.y]);
    rects.forEach((o) => {
      xsSet.add(o.l);
      xsSet.add(o.r);
      ysSet.add(o.t);
      ysSet.add(o.b);
    });
    const xs = Array.from(xsSet).sort((a, b) => a - b);
    const ys = Array.from(ysSet).sort((a, b) => a - b);
    const blockedSeg = (ax, ay, bx, by) => {
      const minX = Math.min(ax, bx);
      const maxX = Math.max(ax, bx);
      const minY = Math.min(ay, by);
      const maxY = Math.max(ay, by);
      return rects.some((o) => maxX > o.l && minX < o.r && maxY > o.t && minY < o.b && !(minX === maxX && (minX <= o.l || minX >= o.r)) && !(minY === maxY && (minY <= o.t || minY >= o.b)));
    };
    const nx = xs.length;
    const ny = ys.length;
    const si = xs.indexOf(s.x);
    const sj = ys.indexOf(s.y);
    const ti = xs.indexOf(t.x);
    const tj = ys.indexOf(t.y);
    const dirs = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1]
    ];
    const key = (i, j, d) => (i * ny + j) * 4 + d;
    const bendCost = 40;
    const dist = /* @__PURE__ */ new Map();
    const prev = /* @__PURE__ */ new Map();
    const open = [];
    const h = (i, j) => Math.abs(xs[i] - xs[ti]) + Math.abs(ys[j] - ys[tj]);
    const startK = key(si, sj, 0);
    dist.set(startK, 0);
    open.push({ k: startK, i: si, j: sj, d: 0, f: h(si, sj), g: 0 });
    let endK = -1;
    let guard = 0;
    while (open.length && guard++ < 6e4) {
      let bi = 0;
      for (let q = 1; q < open.length; q++)
        if (open[q].f < open[bi].f)
          bi = q;
      const cur = open.splice(bi, 1)[0];
      if (cur.g > (dist.get(cur.k) ?? Infinity))
        continue;
      if (cur.i === ti && cur.j === tj) {
        endK = cur.k;
        break;
      }
      for (let d = 0; d < 4; d++) {
        const ni = cur.i + dirs[d][0];
        const nj = cur.j + dirs[d][1];
        if (ni < 0 || nj < 0 || ni >= nx || nj >= ny)
          continue;
        if (blockedSeg(xs[cur.i], ys[cur.j], xs[ni], ys[nj]))
          continue;
        const len = Math.abs(xs[ni] - xs[cur.i]) + Math.abs(ys[nj] - ys[cur.j]);
        const g = cur.g + len + (d !== cur.d ? bendCost : 0);
        const nk = key(ni, nj, d);
        if (g < (dist.get(nk) ?? Infinity)) {
          dist.set(nk, g);
          prev.set(nk, cur.k);
          open.push({ k: nk, i: ni, j: nj, d, g, f: g + h(ni, nj) });
        }
      }
    }
    if (endK < 0)
      return null;
    const pts = [];
    let k = endK;
    while (k !== void 0) {
      const cell = Math.floor(k / 4);
      pts.push({ x: xs[Math.floor(cell / ny)], y: ys[cell % ny] });
      k = prev.get(k);
    }
    pts.reverse();
    const simplified = [{ x: x1, y: y1 }, ...pts, { x: x2, y: y2 }].filter((p, idx, arr) => {
      if (idx === 0 || idx === arr.length - 1)
        return true;
      const a = arr[idx - 1];
      const b = arr[idx + 1];
      return !(a.x === p.x && p.x === b.x || a.y === p.y && p.y === b.y);
    });
    return simplified;
  }
  static polylineToRoundedPath(pts, r) {
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const a = pts[i - 1];
      const p = pts[i];
      const b = pts[i + 1];
      const l1 = Math.abs(p.x - a.x) + Math.abs(p.y - a.y);
      const l2 = Math.abs(b.x - p.x) + Math.abs(b.y - p.y);
      const rr = Math.min(r, l1 / 2, l2 / 2);
      const ux = Math.sign(p.x - a.x);
      const uy = Math.sign(p.y - a.y);
      const vx = Math.sign(b.x - p.x);
      const vy = Math.sign(b.y - p.y);
      d += ` L ${p.x - ux * rr} ${p.y - uy * rr} Q ${p.x} ${p.y} ${p.x + vx * rr} ${p.y + vy * rr}`;
    }
    const last = pts[pts.length - 1];
    d += ` L ${last.x} ${last.y}`;
    let total = 0;
    for (let i = 1; i < pts.length; i++)
      total += Math.abs(pts[i].x - pts[i - 1].x) + Math.abs(pts[i].y - pts[i - 1].y);
    let acc = 0;
    let midX = pts[0].x;
    let midY = pts[0].y;
    for (let i = 1; i < pts.length; i++) {
      const seg = Math.abs(pts[i].x - pts[i - 1].x) + Math.abs(pts[i].y - pts[i - 1].y);
      if (acc + seg >= total / 2) {
        const f = seg === 0 ? 0 : (total / 2 - acc) / seg;
        midX = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * f;
        midY = pts[i - 1].y + (pts[i].y - pts[i - 1].y) * f;
        break;
      }
      acc += seg;
    }
    return { pathData: d, midX, midY };
  }
  /**
   * Gera o caminho ortogonal suavizado SVG entre dois pontos (x1, y1) e (x2, y2).
   * Se obstacles for informado, tenta desviar dos blocos.
   */
  static generateOrthogonalPath(x1, y1, x2, y2, obstacles) {
    const r = 10;
    if (obstacles && obstacles.length > 0) {
      let defaultClear = false;
      if (x2 >= x1 + 30) {
        const mx = (x1 + x2) / 2;
        const segs = [
          [x1, y1, mx, y1],
          [mx, y1, mx, y2],
          [mx, y2, x2, y2]
        ];
        const touches = (o, px, py) => px >= o.x - 10 && px <= o.x + o.w + 10 && py >= o.y - 10 && py <= o.y + o.h + 10;
        defaultClear = !segs.some(
          ([ax, ay, bx, by]) => obstacles.some((o) => {
            if (touches(o, x1, y1) || touches(o, x2, y2))
              return false;
            const p = 6;
            return Math.max(ax, bx) > o.x - p && Math.min(ax, bx) < o.x + o.w + p && Math.max(ay, by) > o.y - p && Math.min(ay, by) < o.y + o.h + p;
          })
        );
      }
      if (!defaultClear) {
        const route = this.routeAroundObstacles(x1, y1, x2, y2, obstacles);
        if (route && route.length >= 2) {
          return this.polylineToRoundedPath(route, r);
        }
      }
    }
    if (x2 >= x1 + 30) {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      if (Math.abs(y2 - y1) < 2) {
        return {
          pathData: `M ${x1} ${y1} L ${x2} ${y2}`,
          midX,
          midY
        };
      }
      const effectiveR = Math.min(r, Math.abs(y2 - y1) / 2, (x2 - x1) / 4);
      if (y2 > y1) {
        return {
          pathData: `M ${x1} ${y1} L ${midX - effectiveR} ${y1} Q ${midX} ${y1} ${midX} ${y1 + effectiveR} L ${midX} ${y2 - effectiveR} Q ${midX} ${y2} ${midX + effectiveR} ${y2} L ${x2} ${y2}`,
          midX,
          midY
        };
      } else {
        return {
          pathData: `M ${x1} ${y1} L ${midX - effectiveR} ${y1} Q ${midX} ${y1} ${midX} ${y1 - effectiveR} L ${midX} ${y2 + effectiveR} Q ${midX} ${y2} ${midX + effectiveR} ${y2} L ${x2} ${y2}`,
          midX,
          midY
        };
      }
    } else {
      const margin = 24;
      const startX = x1 + margin;
      const endX = x2 - margin;
      const midY = (y1 + y2) / 2;
      const pathData = `M ${x1} ${y1} L ${startX - r} ${y1} Q ${startX} ${y1} ${startX} ${y1 > y2 ? y1 - r : y1 + r} L ${startX} ${midY + (y1 > y2 ? r : -r)} Q ${startX} ${midY} ${startX - r} ${midY} L ${endX + r} ${midY} Q ${endX} ${midY} ${endX} ${y1 > y2 ? midY - r : midY + r} L ${endX} ${y2 + (y1 > y2 ? r : -r)} Q ${endX} ${y2} ${endX + r} ${y2} L ${x2} ${y2}`;
      return {
        pathData,
        midX: (startX + endX) / 2,
        midY
      };
    }
  }
};

// src/editor/modules/canvasMinimap.ts
var CanvasMinimap = class {
  constructor(options) {
    this.options = options;
    this.initEvents();
  }
  render() {
    const minimapSvg = document.getElementById("minimapSvg");
    const indicator = document.getElementById("minimapIndicator");
    const minimapBody = document.getElementById("minimapBody");
    const canvas = document.getElementById("canvasContainer");
    if (!minimapSvg || !indicator || !minimapBody || !canvas)
      return;
    minimapSvg.innerHTML = "";
    const nodes = this.options.getNodes();
    if (nodes.length === 0) {
      indicator.style.display = "none";
      return;
    }
    indicator.style.display = "block";
    const mmWidth = minimapBody.clientWidth || 190;
    const mmHeight = minimapBody.clientHeight || 108;
    const zoom = this.options.getZoom();
    const panOffset = this.options.getPanOffset();
    const canvasRect = canvas.getBoundingClientRect();
    const visibleLeft = -panOffset.x / zoom;
    const visibleTop = -panOffset.y / zoom;
    const visibleRight = visibleLeft + canvasRect.width / zoom;
    const visibleBottom = visibleTop + canvasRect.height / zoom;
    let minX = Math.min(visibleLeft, ...nodes.map((n) => n.position.x));
    let minY = Math.min(visibleTop, ...nodes.map((n) => n.position.y));
    let maxX = Math.max(visibleRight, ...nodes.map((n) => n.position.x + 220));
    let maxY = Math.max(visibleBottom, ...nodes.map((n) => n.position.y + 120));
    const padding = 150;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
    const graphWidth = maxX - minX || 1;
    const graphHeight = maxY - minY || 1;
    const scaleX = mmWidth / graphWidth;
    const scaleY = mmHeight / graphHeight;
    const mmScale = Math.min(scaleX, scaleY);
    const offsetX = (mmWidth - graphWidth * mmScale) / 2;
    const offsetY = (mmHeight - graphHeight * mmScale) / 2;
    const toMmX = (x) => (x - minX) * mmScale + offsetX;
    const toMmY = (y) => (y - minY) * mmScale + offsetY;
    const edges = this.options.getEdges();
    edges.forEach((edge) => {
      const src = nodes.find((n) => n.id === edge.source);
      const tgt = nodes.find((n) => n.id === edge.target);
      if (!src || !tgt)
        return;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(toMmX(src.position.x + 110)));
      line.setAttribute("y1", String(toMmY(src.position.y + 45)));
      line.setAttribute("x2", String(toMmX(tgt.position.x + 110)));
      line.setAttribute("y2", String(toMmY(tgt.position.y + 45)));
      line.setAttribute("stroke", "#6366f1");
      line.setAttribute("stroke-width", "1.2");
      line.setAttribute("opacity", "0.6");
      minimapSvg.appendChild(line);
    });
    const selectedId = this.options.getSelectedNodeId();
    nodes.forEach((node) => {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      const nx = toMmX(node.position.x);
      const ny = toMmY(node.position.y);
      const nw = Math.max(8, 210 * mmScale);
      const nh = Math.max(5, 75 * mmScale);
      rect.setAttribute("x", String(nx));
      rect.setAttribute("y", String(ny));
      rect.setAttribute("width", String(nw));
      rect.setAttribute("height", String(nh));
      rect.setAttribute("rx", "2");
      rect.setAttribute("fill", selectedId === node.id ? "#818cf8" : "#334155");
      rect.setAttribute("stroke", selectedId === node.id ? "#c7d2fe" : "#475569");
      rect.setAttribute("stroke-width", "1");
      minimapSvg.appendChild(rect);
    });
    const indX = toMmX(visibleLeft);
    const indY = toMmY(visibleTop);
    const indW = canvasRect.width / zoom * mmScale;
    const indH = canvasRect.height / zoom * mmScale;
    indicator.style.left = `${Math.max(0, indX)}px`;
    indicator.style.top = `${Math.max(0, indY)}px`;
    indicator.style.width = `${Math.min(mmWidth, indW)}px`;
    indicator.style.height = `${Math.min(mmHeight, indH)}px`;
  }
  initEvents() {
    const minimapBody = document.getElementById("minimapBody");
    const canvas = document.getElementById("canvasContainer");
    if (!minimapBody || !canvas)
      return;
    const navigateToMinimapPoint = (e) => {
      const nodes = this.options.getNodes();
      if (nodes.length === 0)
        return;
      const bodyRect = minimapBody.getBoundingClientRect();
      const clickX = e.clientX - bodyRect.left;
      const clickY = e.clientY - bodyRect.top;
      const mmWidth = bodyRect.width;
      const mmHeight = bodyRect.height;
      const canvasRect = canvas.getBoundingClientRect();
      const zoom = this.options.getZoom();
      const panOffset = this.options.getPanOffset();
      const visibleLeft = -panOffset.x / zoom;
      const visibleTop = -panOffset.y / zoom;
      const visibleRight = visibleLeft + canvasRect.width / zoom;
      const visibleBottom = visibleTop + canvasRect.height / zoom;
      let minX = Math.min(visibleLeft, ...nodes.map((n) => n.position.x)) - 150;
      let minY = Math.min(visibleTop, ...nodes.map((n) => n.position.y)) - 150;
      let maxX = Math.max(visibleRight, ...nodes.map((n) => n.position.x + 220)) + 150;
      let maxY = Math.max(visibleBottom, ...nodes.map((n) => n.position.y + 120)) + 150;
      const graphWidth = maxX - minX || 1;
      const graphHeight = maxY - minY || 1;
      const mmScale = Math.min(mmWidth / graphWidth, mmHeight / graphHeight);
      const offsetX = (mmWidth - graphWidth * mmScale) / 2;
      const offsetY = (mmHeight - graphHeight * mmScale) / 2;
      const targetWorldX = minX + (clickX - offsetX) / mmScale;
      const targetWorldY = minY + (clickY - offsetY) / mmScale;
      const newPanX = canvasRect.width / 2 - targetWorldX * zoom;
      const newPanY = canvasRect.height / 2 - targetWorldY * zoom;
      this.options.onNavigate(newPanX, newPanY);
    };
    minimapBody.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      navigateToMinimapPoint(e);
      const onMinimapMove = (moveEvt) => {
        navigateToMinimapPoint(moveEvt);
      };
      const onMinimapUp = () => {
        window.removeEventListener("mousemove", onMinimapMove);
        window.removeEventListener("mouseup", onMinimapUp);
      };
      window.addEventListener("mousemove", onMinimapMove);
      window.addEventListener("mouseup", onMinimapUp);
    });
  }
};

// src/editor/modules/canvasManager.ts
var CanvasManager = class {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.minimap = new CanvasMinimap({
      getNodes: () => this.callbacks.getGraph().nodes,
      getEdges: () => this.callbacks.getGraph().edges,
      getSelectedNodeId: () => this.callbacks.getSelectedNodeId(),
      getZoom: () => this.zoom,
      getPanOffset: () => ({ ...this.panOffset }),
      onNavigate: (newPanX, newPanY) => {
        this.panOffset.x = newPanX;
        this.panOffset.y = newPanY;
        this.updateCanvasTransform();
      }
    });
    this.initCanvasEvents();
  }
  zoom = 1;
  panOffset = { x: 0, y: 0 };
  isPanning = false;
  panStart = { x: 0, y: 0 };
  isDraggingNode = false;
  selectedEdgeId;
  connectingFromNodeId;
  connectingHandle;
  isCtrlConnectionMode = false;
  activeMoveHandler;
  activeUpHandler;
  minimap;
  getSelectedEdgeId() {
    return this.selectedEdgeId;
  }
  setSelectedEdgeId(edgeId) {
    this.selectedEdgeId = edgeId;
    this.highlightSelectedEdge();
  }
  deleteEdge(edgeId) {
    const graph = this.callbacks.getGraph();
    const edgeExists = graph.edges.some((ed) => ed.id === edgeId);
    if (!edgeExists)
      return;
    graph.edges = graph.edges.filter((ed) => ed.id !== edgeId);
    if (this.selectedEdgeId === edgeId) {
      this.selectedEdgeId = void 0;
    }
    this.renderEdges();
    this.renderMinimap();
    this.callbacks.showToast("Liga\xE7\xE3o exclu\xEDda!", "info");
  }
  highlightSelectedEdge() {
    const paths = document.querySelectorAll(".edges-svg-layer path");
    paths.forEach((p) => {
      if (p.getAttribute("stroke") === "transparent")
        return;
      if (p.getAttribute("data-edge-id") === this.selectedEdgeId) {
        p.classList.add("selected-edge");
      } else {
        p.classList.remove("selected-edge");
      }
    });
  }
  getZoom() {
    return this.zoom;
  }
  getPanOffset() {
    return { ...this.panOffset };
  }
  resetTransform() {
    this.zoom = 1;
    this.panOffset = { x: 0, y: 0 };
    this.updateCanvasTransform();
  }
  updateCanvasTransform() {
    const viewport = document.getElementById("canvasViewport");
    if (viewport) {
      viewport.style.transform = `translate(${this.panOffset.x}px, ${this.panOffset.y}px) scale(${this.zoom})`;
    }
    const btnReset = document.getElementById("btnZoomReset");
    if (btnReset) {
      btnReset.textContent = `${Math.round(this.zoom * 100)}%`;
    }
    this.renderMinimap();
  }
  setZoom(newZoom, originX, originY) {
    const prevZoom = this.zoom;
    this.zoom = Math.min(2.5, Math.max(0.3, newZoom));
    if (originX !== void 0 && originY !== void 0) {
      const scaleFactor = this.zoom / prevZoom;
      this.panOffset.x = originX - (originX - this.panOffset.x) * scaleFactor;
      this.panOffset.y = originY - (originY - this.panOffset.y) * scaleFactor;
    }
    this.updateCanvasTransform();
  }
  addNodeToCanvas(item, clientX, clientY) {
    const graph = this.callbacks.getGraph();
    const canvas = document.getElementById("canvasContainer");
    const rect = canvas.getBoundingClientRect();
    let nodeX;
    let nodeY;
    if (clientX !== void 0 && clientY !== void 0) {
      nodeX = (clientX - rect.left - this.panOffset.x) / this.zoom - 105;
      nodeY = (clientY - rect.top - this.panOffset.y) / this.zoom - 25;
    } else {
      const visibleCenterX = (rect.width / 2 - this.panOffset.x) / this.zoom;
      const visibleCenterY = (rect.height / 2 - this.panOffset.y) / this.zoom;
      nodeX = visibleCenterX - 100 + (Math.random() * 60 - 30);
      nodeY = visibleCenterY - 40 + (Math.random() * 60 - 30);
    }
    if (item.type === "start") {
      const alreadyHasStart = graph.nodes.some((n) => n.type === "start");
      if (alreadyHasStart) {
        this.callbacks.showModalDialog(
          "Regra de Workflow: Bloco de In\xEDcio Duplicado",
          "Cada workflow s\xF3 pode possuir exatamente <strong>1 Bloco de In\xEDcio</strong> (gatilho). Caso queira trocar o tipo de gatilho, altere os par\xE2metros do bloco de in\xEDcio existente no painel \xE0 direita.",
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>'
        );
        this.callbacks.showToast("S\xF3 \xE9 permitido 1 Bloco de In\xEDcio por workflow!", "error");
        return;
      }
    }
    const newNode = {
      id: `node_${Date.now()}_${Math.floor(Math.random() * 1e3)}`,
      type: item.type,
      category: item.category || "flow_logic",
      position: { x: Math.round(Math.max(20, nodeX)), y: Math.round(Math.max(20, nodeY)) },
      data: JSON.parse(JSON.stringify(item.defaultData))
    };
    graph.nodes.push(newNode);
    this.callbacks.setSelectedNodeId(newNode.id);
    this.render();
    this.callbacks.onNodeSelect(newNode.id);
    this.callbacks.showToast(`Bloco "${item.title}" adicionado!`, "info");
  }
  render() {
    const graph = this.callbacks.getGraph();
    const selectedNodeId = this.callbacks.getSelectedNodeId();
    const nodesLayer = document.getElementById("nodesLayer");
    if (!nodesLayer)
      return;
    nodesLayer.innerHTML = "";
    graph.nodes.forEach((node) => {
      const nodeEl = document.createElement("div");
      nodeEl.className = `graph-node ${selectedNodeId === node.id ? "selected" : ""}`;
      nodeEl.style.left = `${node.position.x}px`;
      nodeEl.style.top = `${node.position.y}px`;
      nodeEl.id = `rendered_${node.id}`;
      nodeEl.dataset.id = node.id;
      let outputsHtml = "";
      const isMultiOutput = ["if_element_exists", "while_loop", "for_loop", "try_catch", "switch"].includes(node.type);
      if (node.type === "if_element_exists") {
        outputsHtml = `
          <div class="node-outputs-container">
            <div class="node-output-port">
              <span>Se Existir (True)</span>
              <div class="port-handle port-true" data-handle="true" data-node-id="${node.id}" title="Conectar sa\xEDda Se Existir"></div>
            </div>
            <div class="node-output-port">
              <span>Se N\xE3o Existir (False)</span>
              <div class="port-handle port-false" data-handle="false" data-node-id="${node.id}" title="Conectar sa\xEDda Se N\xE3o Existir"></div>
            </div>
          </div>
        `;
      } else if (node.type === "while_loop" || node.type === "for_loop") {
        outputsHtml = `
          <div class="node-outputs-container">
            <div class="node-output-port">
              <span>Corpo do Loop</span>
              <div class="port-handle port-body" data-handle="loop_body" data-node-id="${node.id}" title="Conectar corpo da itera\xE7\xE3o"></div>
            </div>
            <div class="node-output-port">
              <span>Ao Concluir</span>
              <div class="port-handle port-done" data-handle="loop_done" data-node-id="${node.id}" title="Conectar fluxo ap\xF3s o loop terminar"></div>
            </div>
          </div>
        `;
      } else if (node.type === "try_catch") {
        outputsHtml = `
          <div class="node-outputs-container">
            <div class="node-output-port">
              <span>Tentar (Try)</span>
              <div class="port-handle port-try" data-handle="try_body" data-node-id="${node.id}" title="Conectar execu\xE7\xE3o protegida"></div>
            </div>
            <div class="node-output-port">
              <span>Se Falhar (Catch)</span>
              <div class="port-handle port-catch" data-handle="catch_branch" data-node-id="${node.id}" title="Conectar tratamento de erro"></div>
            </div>
          </div>
        `;
      } else if (node.type === "switch") {
        const cases = node.data.cases || [];
        let casesHtml = cases.map((c, i) => `
          <div class="node-output-port">
            <span>${c.label || "Caso " + (i + 1)}</span>
            <div class="port-handle port-case" data-handle="${c.id}" data-node-id="${node.id}"></div>
          </div>
        `).join("");
        if (node.data.hasDefaultBranch !== false) {
          casesHtml += `
            <div class="node-output-port">
              <span>Padr\xE3o (Default)</span>
              <div class="port-handle port-default" data-handle="default" data-node-id="${node.id}"></div>
            </div>
          `;
        }
        outputsHtml = `<div class="node-outputs-container">${casesHtml}</div>`;
      }
      let nodeIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
      let catClass = "cat-flow";
      for (const cat of BLOCK_CATALOG) {
        const found = cat.items.find((it) => it.type === node.type);
        if (found) {
          nodeIcon = found.icon;
          catClass = cat.categoryClass;
          break;
        }
      }
      nodeEl.className = `graph-node ${catClass} ${selectedNodeId === node.id ? "selected" : ""}`;
      let codeBadgeHtml = "";
      const hasJsRule = (rules) => Array.isArray(rules) && rules.some((r) => r.evaluationMode === "js_eval");
      const hasJsInGroups = (groups) => Array.isArray(groups) && groups.some((g) => hasJsRule(g.rules));
      const isCodeNode = ["inject_javascript", "inject_html", "inject_css", "web_component"].includes(node.type) || node.type === "for_loop" && node.data.loopType === "js_generator" || node.type === "set_variable" && node.data.evaluationType === "js_eval" || node.type === "while_loop" && (hasJsRule(node.data.rules) || hasJsInGroups(node.data.conditionGroups)) || node.type === "switch" && Array.isArray(node.data.cases) && node.data.cases.some((c) => hasJsRule(c.rules) || hasJsInGroups(c.conditionGroups));
      if (isCodeNode) {
        const langMap = {
          inject_javascript: { label: "Editar JS", color: "#f59e0b" },
          inject_html: { label: "Editar HTML", color: "#ec4899" },
          inject_css: { label: "Editar CSS", color: "#06b6d4" },
          web_component: { label: "Editar Componente", color: "#8b5cf6" },
          for_loop: { label: "Editar JS", color: "#f59e0b" },
          set_variable: { label: "Editar Express\xE3o JS", color: "#f59e0b" },
          while_loop: { label: "Editar Condi\xE7\xE3o JS", color: "#f59e0b" },
          switch: { label: "Editar Condi\xE7\xE3o JS", color: "#f59e0b" }
        };
        const meta = langMap[node.type] || { label: "Editar C\xF3digo", color: "#6366f1" };
        codeBadgeHtml = `
          <button class="node-edit-code-btn" data-id="${node.id}" style="margin-top: 6px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.12); color: ${meta.color}; border-radius: 6px; padding: 4px 8px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.15s ease;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>${meta.label}</span>
          </button>
        `;
      }
      nodeEl.innerHTML = `
        <div class="node-handle node-handle-input" data-node-id="${node.id}" data-handle-type="input" title="Conectar entrada aqui"></div>
        <div class="graph-node-header">
          <div class="graph-node-title">
            <span class="graph-node-icon">${nodeIcon}</span>
            <span class="graph-node-title-text">${node.data.label || node.type}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 4px;">
            <button class="btn-xs expand-node-btn" data-id="${node.id}" title="Expandir configura\xE7\xF5es deste bloco em tela cheia" style="padding: 2px 5px; font-size: 10px; display: inline-flex; align-items: center; justify-content: center;">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
            </button>
            <button class="btn-xs delete-node-btn" data-id="${node.id}" title="Excluir bloco">\u2715</button>
          </div>
        </div>
        <div class="graph-node-body">
          Tipo: <strong>${node.type}</strong>
          <div class="graph-node-desc-preview" style="margin-top: 4px; font-size: 10px; color: #94a3b8; font-style: italic; display: ${node.data.description ? "block" : "none"}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${node.data.description || ""}</div>
          ${codeBadgeHtml}
        </div>
        ${!isMultiOutput ? `<div class="node-handle node-handle-output" data-node-id="${node.id}" data-handle="default" title="Conectar pr\xF3xima etapa"></div>` : ""}
        ${outputsHtml}
      `;
      nodeEl.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("delete-node-btn"))
          return;
        if (e.target.classList.contains("node-handle"))
          return;
        if (e.target.classList.contains("port-handle"))
          return;
        e.stopPropagation();
        this.callbacks.setSelectedNodeId(node.id);
        this.isDraggingNode = true;
        document.querySelectorAll(".graph-node").forEach((el) => el.classList.remove("selected"));
        nodeEl.classList.add("selected");
        this.callbacks.onNodeSelect(node.id);
        const startMouseX = e.clientX;
        const startMouseY = e.clientY;
        const startNodeX = node.position.x;
        const startNodeY = node.position.y;
        const onMouseMove = (moveEvt) => {
          if (!this.isDraggingNode)
            return;
          const deltaX = (moveEvt.clientX - startMouseX) / this.zoom;
          const deltaY = (moveEvt.clientY - startMouseY) / this.zoom;
          node.position.x = Math.round(startNodeX + deltaX);
          node.position.y = Math.round(startNodeY + deltaY);
          nodeEl.style.left = `${node.position.x}px`;
          nodeEl.style.top = `${node.position.y}px`;
          this.renderEdges();
          this.renderMinimap();
        };
        const onMouseUp = () => {
          this.isDraggingNode = false;
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
          this.renderMinimap();
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      });
      const outHandles = nodeEl.querySelectorAll(".node-handle-output, .port-handle");
      outHandles.forEach((handleEl) => {
        handleEl.addEventListener("mousedown", (e) => {
          e.stopPropagation();
          const targetHandle = handleEl.dataset.handle || "default";
          this.cancelConnection();
          this.connectingFromNodeId = node.id;
          this.connectingHandle = targetHandle;
          this.isCtrlConnectionMode = e.ctrlKey || e.metaKey;
          handleEl.classList.add("connecting-source");
          const onConnectingMove = (moveEvt) => {
            if (!this.connectingFromNodeId)
              return;
            const canvasRect = document.getElementById("canvasContainer").getBoundingClientRect();
            const sourceEl = document.getElementById(`rendered_${node.id}`);
            const isMultiOutput2 = ["if_element_exists", "while_loop", "for_loop", "try_catch", "switch"].includes(node.type);
            const hEl = sourceEl ? isMultiOutput2 ? sourceEl.querySelector(`.port-handle[data-handle="${targetHandle}"]`) : sourceEl.querySelector(".node-handle-output") || sourceEl.querySelector(`.port-handle[data-handle="${targetHandle}"]`) : null;
            const startPt = this.getHandleCenterPoint(hEl, node.position.x + 210, node.position.y + 40);
            const currentMouseCanvasX = (moveEvt.clientX - canvasRect.left - this.panOffset.x) / this.zoom;
            const currentMouseCanvasY = (moveEvt.clientY - canvasRect.top - this.panOffset.y) / this.zoom;
            this.renderTemporaryEdge(startPt.x, startPt.y, currentMouseCanvasX, currentMouseCanvasY);
          };
          const onConnectingUp = (upEvt) => {
            const targetEl = upEvt.target;
            let inHandleTarget = targetEl?.closest(".node-handle-input") || document.elementFromPoint(upEvt.clientX, upEvt.clientY)?.closest(".node-handle-input");
            if (!inHandleTarget) {
              const nodeUnderCursor = targetEl?.closest(".graph-node") || document.elementFromPoint(upEvt.clientX, upEvt.clientY)?.closest(".graph-node");
              if (nodeUnderCursor) {
                inHandleTarget = nodeUnderCursor.querySelector(".node-handle-input");
              }
            }
            if (!inHandleTarget) {
              const allInputs = document.querySelectorAll(".node-handle-input");
              let closestHandle = null;
              let minDistance = 35;
              allInputs.forEach((h) => {
                const rect = h.getBoundingClientRect();
                const centerHx = rect.left + rect.width / 2;
                const centerHy = rect.top + rect.height / 2;
                const dist = Math.hypot(upEvt.clientX - centerHx, upEvt.clientY - centerHy);
                if (dist < minDistance) {
                  minDistance = dist;
                  closestHandle = h;
                }
              });
              if (closestHandle) {
                inHandleTarget = closestHandle;
              }
            }
            if (inHandleTarget) {
              const targetNodeEl = inHandleTarget.closest(".graph-node, .canvas-node");
              const targetNodeId = targetNodeEl?.dataset.id || inHandleTarget.dataset.nodeId || (targetNodeEl?.id ? targetNodeEl.id.replace("rendered_", "") : null);
              if (targetNodeId && this.connectingFromNodeId) {
                if (this.connectingFromNodeId === targetNodeId) {
                  this.callbacks.showModalDialog(
                    "Opera\xE7\xE3o Inv\xE1lida",
                    "N\xE3o \xE9 permitido conectar um bloco diretamente a ele mesmo.",
                    "\u26A0\uFE0F"
                  );
                  this.callbacks.showToast("N\xE3o \xE9 poss\xEDvel conectar um bloco a si mesmo.", "warning");
                  this.cancelConnection();
                  return;
                }
                const timestamp = Date.now().toString(36);
                const randomPart = Math.random().toString(36).substring(2, 6);
                const edgeId = `e_${this.connectingFromNodeId}_${this.connectingHandle || "default"}_${targetNodeId}_${timestamp}_${randomPart}`;
                graph.edges.push({
                  id: edgeId,
                  source: this.connectingFromNodeId,
                  target: targetNodeId,
                  sourceHandle: this.connectingHandle || "default"
                });
                this.callbacks.showToast("Liga\xE7\xE3o conectada com sucesso!", "info");
                this.cancelConnection();
                this.renderEdges();
                this.renderMinimap();
                return;
              }
            }
            this.cancelConnection();
          };
          this.activeMoveHandler = onConnectingMove;
          this.activeUpHandler = onConnectingUp;
          document.getElementById("canvasContainer")?.classList.add("connecting-in-progress");
          window.addEventListener("mousemove", onConnectingMove);
          window.addEventListener("mouseup", onConnectingUp);
        });
      });
      nodeEl.querySelector(".node-edit-code-btn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.callbacks.setSelectedNodeId(node.id);
        this.callbacks.onNodeSelect(node.id);
        const data = node.data;
        if (node.type === "inject_javascript") {
          CodeEditorComponent.openCodeModal({
            title: `C\xF3digo JavaScript - ${data.label || "Injetar JS"}`,
            language: "javascript",
            value: data.code || 'console.log("Ol\xE1");',
            onSave: (val) => {
              data.code = val;
              this.callbacks.onNodeSelect(node.id);
              this.callbacks.showToast("C\xF3digo JS salvo!", "success");
            }
          });
        } else if (node.type === "inject_html") {
          CodeEditorComponent.openCodeModal({
            title: `C\xF3digo HTML - ${data.label || "Injetar HTML"}`,
            language: "html",
            value: data.html || "",
            onSave: (val) => {
              data.html = val;
              this.callbacks.onNodeSelect(node.id);
              this.callbacks.showToast("C\xF3digo HTML salvo!", "success");
            }
          });
        } else if (node.type === "inject_css") {
          CodeEditorComponent.openCodeModal({
            title: `C\xF3digo CSS - ${data.label || "Injetar CSS"}`,
            language: "css",
            value: data.css || "",
            onSave: (val) => {
              data.css = val;
              this.callbacks.onNodeSelect(node.id);
              this.callbacks.showToast("C\xF3digo CSS salvo!", "success");
            }
          });
        } else if (node.type === "for_loop") {
          CodeEditorComponent.openCodeModal({
            title: `C\xF3digo JS Gerador - ${data.label || "Loop For"}`,
            language: "javascript",
            value: data.jsExpression || "",
            onSave: (val) => {
              data.jsExpression = val;
              this.callbacks.onNodeSelect(node.id);
              this.callbacks.showToast("Express\xE3o JS salva!", "success");
            }
          });
        } else if (node.type === "set_variable") {
          CodeEditorComponent.openCodeModal({
            title: `Express\xE3o JavaScript - ${data.label || data.varName || "Definir Vari\xE1vel"}`,
            language: "javascript",
            value: data.valueExpression || "",
            onSave: (val) => {
              data.valueExpression = val;
              this.callbacks.onNodeSelect(node.id);
              this.callbacks.showToast("Express\xE3o JS salva!", "success");
            }
          });
        } else if (node.type === "while_loop" || node.type === "switch" || node.type === "web_component") {
          this.callbacks.onOpenNodeModal?.(node.id);
        }
      });
      nodeEl.querySelector(".expand-node-btn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.callbacks.setSelectedNodeId(node.id);
        this.callbacks.onNodeSelect(node.id);
        this.callbacks.onOpenNodeModal?.(node.id);
      });
      nodeEl.addEventListener("dblclick", (e) => {
        if (e.target.closest(".delete-node-btn") || e.target.closest(".node-handle") || e.target.closest(".node-edit-code-btn"))
          return;
        e.stopPropagation();
        this.callbacks.setSelectedNodeId(node.id);
        this.callbacks.onNodeSelect(node.id);
        this.callbacks.onOpenNodeModal?.(node.id);
      });
      nodeEl.querySelector(".delete-node-btn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteNode(node.id);
      });
      nodesLayer.appendChild(nodeEl);
    });
    this.renderEdges();
    this.renderMinimap();
  }
  /**
   * Deleta um nó específico do fluxo e remove todas as suas conexões associadas
   */
  deleteNode(nodeId) {
    const graph = this.callbacks.getGraph();
    const nodeExists = graph.nodes.some((n) => n.id === nodeId);
    if (!nodeExists)
      return;
    graph.nodes = graph.nodes.filter((n) => n.id !== nodeId);
    graph.edges = graph.edges.filter((ed) => ed.source !== nodeId && ed.target !== nodeId);
    if (this.callbacks.getSelectedNodeId() === nodeId) {
      this.callbacks.setSelectedNodeId(void 0);
    }
    this.render();
    this.callbacks.onNodeSelect(this.callbacks.getSelectedNodeId());
    this.callbacks.showToast("Bloco exclu\xEDdo.", "info");
  }
  /**
   * Finaliza e limpa completamente qualquer estado de conexão pendente
   */
  cancelConnection() {
    if (this.activeMoveHandler) {
      window.removeEventListener("mousemove", this.activeMoveHandler);
      this.activeMoveHandler = void 0;
    }
    if (this.activeUpHandler) {
      window.removeEventListener("mouseup", this.activeUpHandler);
      this.activeUpHandler = void 0;
    }
    this.removeTemporaryEdge();
    this.connectingFromNodeId = void 0;
    this.connectingHandle = void 0;
    this.isCtrlConnectionMode = false;
    document.getElementById("canvasContainer")?.classList.remove("connecting-in-progress");
    document.querySelectorAll(".connecting-source").forEach((el) => el.classList.remove("connecting-source"));
  }
  /**
   * Calcula o centro exato em coordenadas do Canvas de qualquer handle (porta de conexão)
   */
  getHandleCenterPoint(handleEl, fallbackX, fallbackY) {
    const viewport = document.getElementById("canvasViewport");
    if (!handleEl || !viewport) {
      return { x: fallbackX, y: fallbackY };
    }
    const handleRect = handleEl.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const centerX = (handleRect.left + handleRect.width / 2 - viewportRect.left) / this.zoom;
    const centerY = (handleRect.top + handleRect.height / 2 - viewportRect.top) / this.zoom;
    return { x: Math.round(centerX), y: Math.round(centerY) };
  }
  renderEdges() {
    const graph = this.callbacks.getGraph();
    const svgEdges = document.getElementById("edgesLayer");
    const svgControls = document.getElementById("edgesControlsLayer");
    svgEdges.innerHTML = "";
    if (svgControls)
      svgControls.innerHTML = "";
    const obstacles = graph.nodes.map((n) => {
      const el = document.getElementById(`rendered_${n.id}`);
      return el ? { x: n.position.x, y: n.position.y, w: el.offsetWidth || 210, h: el.offsetHeight || 80 } : null;
    }).filter((o) => !!o);
    graph.edges.forEach((edge) => {
      const sourceNode = graph.nodes.find((n) => n.id === edge.source);
      const targetNode = graph.nodes.find((n) => n.id === edge.target);
      if (!sourceNode || !targetNode)
        return;
      const sourceEl = document.getElementById(`rendered_${sourceNode.id}`);
      const targetEl = document.getElementById(`rendered_${targetNode.id}`);
      const isMultiOutput = ["if_element_exists", "while_loop", "for_loop", "try_catch", "switch"].includes(sourceNode.type);
      const outHandleEl = sourceEl ? isMultiOutput ? sourceEl.querySelector(`.port-handle[data-handle="${edge.sourceHandle || "default"}"]`) : sourceEl.querySelector(".node-handle-output") || sourceEl.querySelector(`.port-handle[data-handle="${edge.sourceHandle}"]`) : null;
      const inHandleEl = targetEl ? targetEl.querySelector(".node-handle-input") : null;
      const sourcePt = this.getHandleCenterPoint(outHandleEl, sourceNode.position.x + 210, sourceNode.position.y + 40);
      const targetPt = this.getHandleCenterPoint(inHandleEl, targetNode.position.x, targetNode.position.y + 40);
      const x1 = sourcePt.x;
      const y1 = sourcePt.y;
      const x2 = targetPt.x;
      const y2 = targetPt.y;
      const { pathData, midX, midY } = this.generateOrthogonalPath(x1, y1, x2, y2, obstacles);
      let strokeColor = "#6366f1";
      if (edge.sourceHandle === "true" || edge.sourceHandle === "loop_done")
        strokeColor = "#10b981";
      else if (edge.sourceHandle === "false" || edge.sourceHandle === "catch_branch")
        strokeColor = "#f43f5e";
      else if (edge.sourceHandle === "loop_body" || edge.sourceHandle === "try_body")
        strokeColor = "#38bdf8";
      else if (edge.sourceHandle && edge.sourceHandle.startsWith("case_"))
        strokeColor = "#f59e0b";
      const hitPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      hitPath.setAttribute("d", pathData);
      hitPath.setAttribute("fill", "none");
      hitPath.setAttribute("stroke", "transparent");
      hitPath.setAttribute("stroke-width", "20");
      hitPath.setAttribute("stroke-linecap", "round");
      hitPath.setAttribute("data-edge-id", edge.id);
      hitPath.style.cursor = "pointer";
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", strokeColor);
      path.setAttribute("stroke-width", "2.5");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("data-edge-id", edge.id);
      path.style.cursor = "pointer";
      if (this.selectedEdgeId === edge.id) {
        path.classList.add("selected-edge");
      }
      const selectThisEdge = (e) => {
        e.stopPropagation();
        if (this.selectedEdgeId === edge.id)
          return;
        this.callbacks.setSelectedNodeId(void 0);
        document.querySelectorAll(".graph-node").forEach((el) => el.classList.remove("selected"));
        this.callbacks.onNodeSelect(void 0);
        this.setSelectedEdgeId(edge.id);
        this.callbacks.showToast("Liga\xE7\xE3o selecionada. Pressione Delete para remover.", "info");
      };
      hitPath.addEventListener("click", selectThisEdge);
      hitPath.addEventListener("mousedown", (e) => e.stopPropagation());
      path.addEventListener("click", selectThisEdge);
      path.addEventListener("mousedown", (e) => e.stopPropagation());
      const deleteBadge = document.createElementNS("http://www.w3.org/2000/svg", "g");
      deleteBadge.setAttribute("class", "edge-delete-badge");
      deleteBadge.style.cursor = "pointer";
      const badgeCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      badgeCircle.setAttribute("cx", String(midX));
      badgeCircle.setAttribute("cy", String(midY));
      badgeCircle.setAttribute("r", "11");
      badgeCircle.setAttribute("fill", "#1e293b");
      badgeCircle.setAttribute("stroke", strokeColor);
      badgeCircle.setAttribute("stroke-width", "2");
      const badgeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      badgeText.setAttribute("x", String(midX));
      badgeText.setAttribute("y", String(midY + 4));
      badgeText.setAttribute("text-anchor", "middle");
      badgeText.setAttribute("font-size", "11");
      badgeText.setAttribute("font-weight", "bold");
      badgeText.setAttribute("fill", "#f43f5e");
      badgeText.textContent = "\u2715";
      deleteBadge.appendChild(badgeCircle);
      deleteBadge.appendChild(badgeText);
      const deleteThisEdge = (e) => {
        e.stopPropagation();
        this.deleteEdge(edge.id);
      };
      deleteBadge.addEventListener("click", deleteThisEdge);
      deleteBadge.addEventListener("mousedown", (e) => e.stopPropagation());
      svgEdges.appendChild(hitPath);
      svgEdges.appendChild(path);
      if (svgControls) {
        svgControls.appendChild(deleteBadge);
      } else {
        svgEdges.appendChild(deleteBadge);
      }
    });
  }
  generateOrthogonalPath(x1, y1, x2, y2, obstacles) {
    return CanvasPathUtils.generateOrthogonalPath(x1, y1, x2, y2, obstacles);
  }
  renderTemporaryEdge(x1, y1, x2, y2) {
    const svg = document.getElementById("edgesLayer");
    let tempPath = svg.querySelector("#tempEdgePath");
    if (!tempPath) {
      tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      tempPath.id = "tempEdgePath";
      tempPath.setAttribute("fill", "none");
      tempPath.setAttribute("stroke", "#60a5fa");
      tempPath.setAttribute("stroke-width", "2.5");
      tempPath.setAttribute("stroke-dasharray", "5,5");
      svg.appendChild(tempPath);
    }
    const { pathData } = this.generateOrthogonalPath(x1, y1, x2, y2);
    tempPath.setAttribute("d", pathData);
  }
  removeTemporaryEdge() {
    const tempPath = document.getElementById("tempEdgePath");
    tempPath?.remove();
  }
  renderMinimap() {
    this.minimap.render();
  }
  initCanvasEvents() {
    const canvas = document.getElementById("canvasContainer");
    if (!canvas)
      return;
    canvas.addEventListener("dragover", (e) => e.preventDefault());
    canvas.addEventListener("drop", (e) => {
      e.preventDefault();
      const raw = e.dataTransfer?.getData("application/json");
      if (!raw)
        return;
      const item = JSON.parse(raw);
      this.addNodeToCanvas(item, e.clientX, e.clientY);
    });
    canvas.addEventListener("mousedown", (e) => {
      if (e.target.closest(".graph-node") || e.target.closest(".canvas-floating-controls") || e.target.closest(".canvas-minimap") || e.target.closest(".edge-delete-badge") || e.target.tagName?.toLowerCase() === "path") {
        return;
      }
      this.callbacks.setSelectedNodeId(void 0);
      this.setSelectedEdgeId(void 0);
      document.querySelectorAll(".graph-node").forEach((el) => el.classList.remove("selected"));
      this.callbacks.onNodeSelect(void 0);
      this.isPanning = true;
      this.panStart = { x: e.clientX - this.panOffset.x, y: e.clientY - this.panOffset.y };
      const onPanMove = (moveEvt) => {
        if (!this.isPanning)
          return;
        this.panOffset.x = moveEvt.clientX - this.panStart.x;
        this.panOffset.y = moveEvt.clientY - this.panStart.y;
        this.updateCanvasTransform();
      };
      const onPanUp = () => {
        this.isPanning = false;
        window.removeEventListener("mousemove", onPanMove);
        window.removeEventListener("mouseup", onPanUp);
      };
      window.addEventListener("mousemove", onPanMove);
      window.addEventListener("mouseup", onPanUp);
    });
    canvas.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
        this.setZoom(this.zoom * zoomFactor, mouseX, mouseY);
      },
      { passive: false }
    );
    document.getElementById("btnZoomIn")?.addEventListener("click", () => {
      const rect = canvas.getBoundingClientRect();
      this.setZoom(this.zoom * 1.2, rect.width / 2, rect.height / 2);
    });
    document.getElementById("btnZoomOut")?.addEventListener("click", () => {
      const rect = canvas.getBoundingClientRect();
      this.setZoom(this.zoom / 1.2, rect.width / 2, rect.height / 2);
    });
    document.getElementById("btnZoomReset")?.addEventListener("click", () => {
      this.resetTransform();
    });
  }
};

// src/editor/modules/tabManager.ts
var WorkflowTabManager = class {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.initTabsUI();
  }
  savedAutomations = [];
  openTabs = [];
  activeTabId = "dashboard";
  getSavedAutomations() {
    return this.savedAutomations;
  }
  setSavedAutomations(list) {
    this.savedAutomations = list;
  }
  getOpenTabs() {
    return this.openTabs;
  }
  getActiveTabId() {
    return this.activeTabId;
  }
  setActiveTabId(id) {
    this.activeTabId = id;
    this.renderTabs();
  }
  registerOpenTab(graph) {
    const existing = this.openTabs.find((t) => t.metadata?.id === graph.metadata?.id);
    if (!existing) {
      this.openTabs.push(graph);
    } else {
      const idx = this.openTabs.indexOf(existing);
      this.openTabs[idx] = graph;
    }
    this.activeTabId = graph.metadata?.id || "studio";
    this.renderTabs();
  }
  updateFlowInTabsAndSaved(graph) {
    const sIdx = this.savedAutomations.findIndex((a) => a.metadata.id === graph.metadata.id);
    if (sIdx >= 0) {
      this.savedAutomations[sIdx] = JSON.parse(JSON.stringify(graph));
    } else {
      this.savedAutomations.push(JSON.parse(JSON.stringify(graph)));
    }
    const tIdx = this.openTabs.findIndex((t) => t.metadata?.id === graph.metadata.id);
    if (tIdx >= 0) {
      this.openTabs[tIdx] = JSON.parse(JSON.stringify(graph));
    }
    this.renderTabs();
  }
  async loadFromStorage(checkUrlParam = true) {
    if (chrome.storage?.local) {
      const data = await chrome.storage.local.get("web_automations");
      this.savedAutomations = data.web_automations || [];
      if (this.savedAutomations.length === 0) {
        this.savedAutomations = [JSON.parse(JSON.stringify(DEFAULT_AUTOMATION))];
        await chrome.storage.local.set({ web_automations: this.savedAutomations });
      }
    } else {
      this.savedAutomations = [JSON.parse(JSON.stringify(DEFAULT_AUTOMATION))];
    }
    if (checkUrlParam) {
      const urlParams = new URLSearchParams(window.location.search);
      const flowId = urlParams.get("flowId");
      if (flowId) {
        const matched = this.savedAutomations.find((a) => a.metadata?.id === flowId);
        if (matched) {
          this.callbacks.onOpenFlow(matched);
          return;
        } else {
          this.callbacks.showToast("Fluxo solicitado n\xE3o foi encontrado no armazenamento.", "error");
        }
      }
    }
    this.renderDashboard();
    this.renderTabs();
  }
  renderTabs() {
    const tabHome = document.getElementById("tabHomeBtn");
    if (tabHome) {
      tabHome.classList.toggle("active", this.activeTabId === "dashboard");
    }
    const container = document.getElementById("workflowTabsContainer");
    if (!container)
      return;
    container.innerHTML = "";
    this.openTabs.forEach((flow) => {
      const tabEl = document.createElement("div");
      const isActive = this.activeTabId === flow.metadata?.id;
      tabEl.className = `app-tab-item ${isActive ? "active" : ""}`;
      tabEl.title = flow.metadata?.name || "Fluxo";
      tabEl.innerHTML = `
        <span class="tab-label">${flow.metadata?.name || "Sem T\xEDtulo"}</span>
        <span class="app-tab-close" data-id="${flow.metadata?.id}" title="Fechar aba">\u2715</span>
      `;
      tabEl.addEventListener("click", (e) => {
        if (e.target.classList.contains("app-tab-close"))
          return;
        this.callbacks.onOpenFlow(flow);
      });
      tabEl.querySelector(".app-tab-close")?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.closeTab(flow.metadata?.id);
      });
      container.appendChild(tabEl);
    });
  }
  closeTab(flowId) {
    const idx = this.openTabs.findIndex((t) => t.metadata?.id === flowId);
    if (idx === -1)
      return;
    this.openTabs.splice(idx, 1);
    if (this.activeTabId === flowId) {
      if (this.openTabs.length > 0) {
        const nextFlow = this.openTabs[Math.max(0, idx - 1)];
        this.callbacks.onOpenFlow(nextFlow);
      } else {
        this.activeTabId = "dashboard";
        this.callbacks.onViewChange("dashboard");
      }
    }
    this.renderTabs();
  }
  renderDashboard(filterQuery = "") {
    const grid = document.getElementById("automationsGrid");
    if (!grid)
      return;
    grid.innerHTML = "";
    const query = filterQuery.toLowerCase().trim();
    const filtered = this.savedAutomations.filter((auto) => {
      if (!query)
        return true;
      const name = (auto.metadata?.name || "").toLowerCase();
      const desc = (auto.metadata?.description || "").toLowerCase();
      const tags = (auto.metadata?.tags || []).join(" ").toLowerCase();
      return name.includes(query) || desc.includes(query) || tags.includes(query);
    });
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #64748b;">
          <p style="font-size: 15px; font-weight: 600; margin-bottom: 8px;">Nenhuma automa\xE7\xE3o encontrada.</p>
          <p style="font-size: 13px;">Clique em "Novo Fluxo" para criar ou importe um arquivo .json.</p>
        </div>
      `;
      return;
    }
    filtered.forEach((auto) => {
      const startNode = auto.nodes.find((n) => n.type === "start");
      let triggerLabel = "manual";
      if (startNode?.data) {
        if (Array.isArray(startNode.data.triggers) && startNode.data.triggers.length > 0) {
          const names = startNode.data.triggers.map((t) => t.type);
          triggerLabel = names.length === 1 ? names[0] : `${names.length} gatilhos`;
        } else if (startNode.data.triggerType) {
          triggerLabel = startNode.data.triggerType;
        }
      }
      const dateFormatted = auto.metadata?.updatedAt ? new Date(auto.metadata.updatedAt).toLocaleDateString("pt-BR") : "Hoje";
      const card = document.createElement("div");
      card.className = "flow-card";
      card.innerHTML = `
        <div>
          <div class="flow-card-header">
            <h3 class="flow-card-title">${auto.metadata?.name || "Sem T\xEDtulo"}</h3>
            <span class="flow-tag">${triggerLabel}</span>
          </div>
          <p class="flow-card-desc">${auto.metadata?.description || "Fluxo de automa\xE7\xE3o visual."}</p>
          <div class="flow-card-meta">
            <span style="display:inline-flex;align-items:center;gap:4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              ${auto.nodes?.length || 0} blocos
            </span>
            <span>\u2022</span>
            <span style="display:inline-flex;align-items:center;gap:4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              ${dateFormatted}
            </span>
          </div>
        </div>
        <div class="flow-card-actions">
          <button class="btn-card-run" data-id="${auto.metadata.id}" title="Executar este fluxo imediatamente">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Executar
          </button>
          <button class="btn-card-edit" data-id="${auto.metadata.id}" title="Abrir em aba no Visual Flow Studio">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Abrir
          </button>
          <button class="btn-xs delete-flow-btn" data-id="${auto.metadata.id}" title="Excluir fluxo" style="margin-left: auto;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `;
      card.querySelector(".btn-card-run")?.addEventListener("click", () => {
        this.callbacks.onRunFlowDirectly(auto);
      });
      card.querySelector(".btn-card-edit")?.addEventListener("click", () => {
        this.callbacks.onOpenFlow(auto);
      });
      card.querySelector(".flow-card-title")?.addEventListener("click", () => {
        this.callbacks.onOpenFlow(auto);
      });
      card.querySelector(".delete-flow-btn")?.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (confirm(`Deseja realmente excluir a automa\xE7\xE3o "${auto.metadata?.name}"?`)) {
          this.savedAutomations = this.savedAutomations.filter((a) => a.metadata.id !== auto.metadata.id);
          this.closeTab(auto.metadata.id);
          if (chrome.storage?.local) {
            await chrome.storage.local.set({ web_automations: this.savedAutomations });
          }
          this.callbacks.showToast("Automa\xE7\xE3o exclu\xEDda.", "info");
          this.renderDashboard();
        }
      });
      grid.appendChild(card);
    });
  }
  initTabsUI() {
    const tabHome = document.getElementById("tabHomeBtn");
    tabHome?.addEventListener("click", () => {
      this.activeTabId = "dashboard";
      this.callbacks.onViewChange("dashboard");
      this.renderTabs();
    });
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
var DEFAULT_MODAL_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
function showModalDialog(title, message, icon = DEFAULT_MODAL_SVG) {
  const existing = document.querySelector(".flow-modal-backdrop");
  existing?.remove();
  const backdrop = document.createElement("div");
  backdrop.className = "flow-modal-backdrop";
  backdrop.innerHTML = `
    <div class="flow-modal-card">
      <div class="flow-modal-header">
        <div class="flow-modal-icon">${icon}</div>
        <div class="flow-modal-title">${title}</div>
      </div>
      <div class="flow-modal-body">${message}</div>
      <div class="flow-modal-footer">
        <button class="btn btn-primary flow-modal-ok-btn">Entendido</button>
      </div>
    </div>
  `;
  const closeBtn = backdrop.querySelector(".flow-modal-ok-btn");
  closeBtn?.addEventListener("click", () => backdrop.remove());
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop)
      backdrop.remove();
  });
  document.body.appendChild(backdrop);
}
function sanitizeGraph(graph) {
  const clone = JSON.parse(JSON.stringify(graph));
  clone.nodes.forEach((node) => {
    if (node.type === "start" && node.data) {
      const data = node.data;
      const cleanFloating = (fb) => {
        if (!fb)
          return;
        const type = fb.iconType || "emoji";
        if (type === "emoji") {
          delete fb.svgIcon;
          delete fb.imageIcon;
        } else if (type === "svg") {
          delete fb.buttonIcon;
          delete fb.imageIcon;
        } else if (type === "image") {
          delete fb.buttonIcon;
          delete fb.svgIcon;
        }
      };
      if (data.floatingButton)
        cleanFloating(data.floatingButton);
      if (Array.isArray(data.triggers)) {
        data.triggers.forEach((trig) => {
          if (trig.floatingButton)
            cleanFloating(trig.floatingButton);
        });
      }
    }
  });
  return clone;
}

// src/editor/modules/flowSettingsModal.ts
var FlowSettingsModal = class {
  static open(onSaveCallback) {
    const existing = document.querySelector(".flow-settings-modal-backdrop");
    existing?.remove();
    chrome.storage.local.get("floating_buttons_layout_settings", (stored) => {
      const currentConfig = stored.floating_buttons_layout_settings || {
        stackDirection: "vertical",
        maxColumns: 3,
        maxRows: 5,
        gap: 10
      };
      const backdrop = document.createElement("div");
      backdrop.className = "flow-modal-backdrop flow-settings-modal-backdrop";
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(8, 12, 20, 0.8);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100000;
        padding: 16px;
        font-family: var(--font-sans, system-ui, sans-serif);
        animation: fadeIn 0.15s ease-out;
      `;
      let stackDirection = currentConfig.stackDirection || "vertical";
      let maxColumns = currentConfig.maxColumns ?? 3;
      let maxRows = currentConfig.maxRows ?? 5;
      let gap = currentConfig.gap ?? 10;
      const render = () => {
        backdrop.innerHTML = `
          <div class="flow-settings-card" style="
            background: #0f172a;
            border: 1px solid #3b82f6;
            border-radius: 14px;
            max-width: 540px;
            width: 100%;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 25px rgba(59, 130, 246, 0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
          ">
            <!-- Header -->
            <div style="padding: 16px 20px; border-bottom: 1px solid #1e293b; display: flex; align-items: center; justify-content: space-between; background: #131d35;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(59, 130, 246, 0.2); color: #60a5fa; display: flex; align-items: center; justify-content: center; font-size: 16px;">
                  \u2699\uFE0F
                </div>
                <div>
                  <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #f8fafc;">Configura\xE7\xF5es do Visual Flow</h3>
                  <p style="margin: 2px 0 0; font-size: 12px; color: #94a3b8;">Comportamento e empilhamento dos bot\xF5es flutuantes</p>
                </div>
              </div>
              <button id="btnSettingsCloseX" style="background: transparent; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; padding: 4px 8px; border-radius: 6px;">\u2715</button>
            </div>

            <!-- Body -->
            <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
              <!-- Se\xE7\xE3o Bot\xF5es Flutuantes Multi-Execu\xE7\xE3o -->
              <div style="background: #090d16; border: 1px solid #1e293b; border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-size: 14px;">\u{1F5C2}\uFE0F</span>
                  <span style="font-size: 13px; font-weight: 700; color: #e2e8f0;">Container de Bot\xF5es Flutuantes (Triggers)</span>
                </div>
                <p style="font-size: 12px; color: #94a3b8; line-height: 1.4; margin: 0;">
                  Quando m\xFAltiplas automa\xE7\xF5es forem injetadas na mesma p\xE1gina web, seus bot\xF5es flutuantes ser\xE3o agrupados neste container para evitar sobreposi\xE7\xF5es desagrad\xE1veis.
                </p>

                <!-- Dire\xE7\xE3o de Empilhamento -->
                <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 4px;">
                  <label style="font-size: 11px; font-weight: 700; color: #cbd5e1; text-transform: uppercase;">Dire\xE7\xE3o do Empilhamento</label>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <button type="button" id="btnDirVertical" style="
                      padding: 10px;
                      background: ${stackDirection === "vertical" ? "#1e293b" : "#0b0f19"};
                      border: 1px solid ${stackDirection === "vertical" ? "#3b82f6" : "#1e293b"};
                      border-radius: 8px;
                      color: ${stackDirection === "vertical" ? "#ffffff" : "#94a3b8"};
                      cursor: pointer;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      gap: 4px;
                      transition: all 0.15s ease;
                    ">
                      <span style="font-size: 16px;">\u2B07\uFE0F</span>
                      <span style="font-size: 12px; font-weight: 600;">Vertical (Coluna)</span>
                      <span style="font-size: 10px; color: #64748b;">Empilha um abaixo do outro</span>
                    </button>
                    <button type="button" id="btnDirHorizontal" style="
                      padding: 10px;
                      background: ${stackDirection === "horizontal" ? "#1e293b" : "#0b0f19"};
                      border: 1px solid ${stackDirection === "horizontal" ? "#3b82f6" : "#1e293b"};
                      border-radius: 8px;
                      color: ${stackDirection === "horizontal" ? "#ffffff" : "#94a3b8"};
                      cursor: pointer;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      gap: 4px;
                      transition: all 0.15s ease;
                    ">
                      <span style="font-size: 16px;">\u27A1\uFE0F</span>
                      <span style="font-size: 12px; font-weight: 600;">Horizontal (Linha)</span>
                      <span style="font-size: 10px; color: #64748b;">Empilha lado a lado</span>
                    </button>
                  </div>
                </div>

                <!-- Limites de Linhas e Colunas -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 4px;">
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-size: 11px; font-weight: 700; color: #cbd5e1;">Limite de Colunas (Max):</label>
                    <input type="number" id="inputMaxColumns" min="1" max="10" value="${maxColumns}" style="
                      background: #172033;
                      color: white;
                      border: 1px solid #243049;
                      border-radius: 6px;
                      padding: 8px 10px;
                      font-size: 12px;
                    " />
                    <span style="font-size: 10px; color: #64748b;">Quebra ap\xF3s atingir o limite</span>
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-size: 11px; font-weight: 700; color: #cbd5e1;">Limite de Linhas (Max):</label>
                    <input type="number" id="inputMaxRows" min="1" max="20" value="${maxRows}" style="
                      background: #172033;
                      color: white;
                      border: 1px solid #243049;
                      border-radius: 6px;
                      padding: 8px 10px;
                      font-size: 12px;
                    " />
                    <span style="font-size: 10px; color: #64748b;">Quebra verticalmente</span>
                  </div>
                </div>

                <!-- Espa\xE7amento (Gap) -->
                <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <label style="font-size: 11px; font-weight: 700; color: #cbd5e1;">Espa\xE7amento Entre Bot\xF5es (Gap):</label>
                    <span id="labelGapValue" style="font-size: 11px; font-weight: bold; color: #60a5fa;">${gap}px</span>
                  </div>
                  <input type="range" id="rangeGap" min="4" max="32" value="${gap}" style="accent-color: #3b82f6;" />
                </div>

                <!-- Pr\xE9via din\xE2mica da pilha -->
                <div style="
                  background: #020617;
                  border: 1px dashed #334155;
                  border-radius: 8px;
                  padding: 12px;
                  display: flex;
                  flex-direction: column;
                  gap: 8px;
                  align-items: center;
                  justify-content: center;
                  min-height: 85px;
                ">
                  <span style="font-size: 10px; color: #64748b; font-family: monospace;">Pr\xE9-visualiza\xE7\xE3o do Container:</span>
                  <div id="settingsPreviewContainer" style="
                    display: flex;
                    flex-direction: ${stackDirection === "vertical" ? "column" : "row"};
                    flex-wrap: wrap;
                    gap: ${gap}px;
                    align-items: center;
                    justify-content: center;
                    max-width: ${stackDirection === "horizontal" ? `${maxColumns * 100}px` : "100%"};
                  ">
                    <div style="background: #4f46e5; color: white; padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: 600;">\u26A1 Fluxo A</div>
                    <div style="background: #059669; color: white; padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: 600;">\u{1F680} Fluxo B</div>
                    <div style="background: #d97706; color: white; padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: 600;">\u2699\uFE0F Fluxo C</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="padding: 14px 20px; border-top: 1px solid #1e293b; background: #131d35; display: flex; align-items: center; justify-content: flex-end; gap: 10px;">
              <button type="button" id="btnSettingsCancel" class="btn btn-secondary" style="padding: 7px 16px; font-size: 12px;">
                Cancelar
              </button>
              <button type="button" id="btnSettingsSave" class="btn btn-primary" style="padding: 7px 20px; font-size: 12px; background: #3b82f6; border-color: #3b82f6;">
                Salvar Configura\xE7\xF5es
              </button>
            </div>
          </div>
        `;
        backdrop.querySelector("#btnDirVertical")?.addEventListener("click", () => {
          stackDirection = "vertical";
          render();
        });
        backdrop.querySelector("#btnDirHorizontal")?.addEventListener("click", () => {
          stackDirection = "horizontal";
          render();
        });
        const inputCols = backdrop.querySelector("#inputMaxColumns");
        inputCols?.addEventListener("input", (e) => {
          maxColumns = Math.max(1, Number(e.target.value) || 1);
          updatePreview();
        });
        const inputRw = backdrop.querySelector("#inputMaxRows");
        inputRw?.addEventListener("input", (e) => {
          maxRows = Math.max(1, Number(e.target.value) || 1);
          updatePreview();
        });
        const rangeG = backdrop.querySelector("#rangeGap");
        const labelG = backdrop.querySelector("#labelGapValue");
        rangeG?.addEventListener("input", (e) => {
          gap = Number(e.target.value);
          if (labelG)
            labelG.textContent = `${gap}px`;
          updatePreview();
        });
        const updatePreview = () => {
          const preview = backdrop.querySelector("#settingsPreviewContainer");
          if (preview) {
            preview.style.flexDirection = stackDirection === "vertical" ? "column" : "row";
            preview.style.gap = `${gap}px`;
            preview.style.maxWidth = stackDirection === "horizontal" ? `${maxColumns * 100}px` : "100%";
          }
        };
        const closeDialog = () => backdrop.remove();
        backdrop.querySelector("#btnSettingsCloseX")?.addEventListener("click", closeDialog);
        backdrop.querySelector("#btnSettingsCancel")?.addEventListener("click", closeDialog);
        backdrop.querySelector("#btnSettingsSave")?.addEventListener("click", () => {
          const newSettings = {
            stackDirection,
            maxColumns,
            maxRows,
            gap
          };
          chrome.storage.local.set({ floating_buttons_layout_settings: newSettings }, () => {
            if (chrome.runtime?.sendMessage) {
              chrome.runtime.sendMessage({ action: "SYNC_TRIGGERS" }).catch(() => {
              });
            }
            onSaveCallback?.(newSettings);
            closeDialog();
          });
        });
      };
      render();
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop)
          backdrop.remove();
      });
      document.body.appendChild(backdrop);
    });
  }
};

// src/editor/editorApp.ts
var VisualEditorApp = class {
  currentView = "dashboard";
  graph;
  selectedNodeId;
  colorPickerManager;
  inspectorManager;
  canvasManager;
  tabManager;
  constructor() {
    this.graph = JSON.parse(JSON.stringify(DEFAULT_AUTOMATION));
    this.colorPickerManager = new ColorPickerManager(
      () => this.graph,
      (msg, type) => showToast(msg, type),
      () => {
        this.canvasManager.render();
      }
    );
    this.inspectorManager = new InspectorManager(
      {
        getGraph: () => this.graph,
        getSelectedNodeId: () => this.selectedNodeId,
        onNodeDataChanged: () => {
          this.canvasManager.render();
        },
        onRenderGraph: () => {
          this.canvasManager.render();
        },
        showToast: (msg, type) => showToast(msg, type)
      },
      this.colorPickerManager
    );
    this.canvasManager = new CanvasManager({
      getGraph: () => this.graph,
      getSelectedNodeId: () => this.selectedNodeId,
      setSelectedNodeId: (nodeId) => {
        this.selectedNodeId = nodeId;
      },
      onNodeSelect: (nodeId) => {
        this.selectedNodeId = nodeId;
        this.inspectorManager.renderInspector();
      },
      showToast: (msg, type) => showToast(msg, type),
      showModalDialog: (title, msg, icon) => showModalDialog(title, msg, icon),
      onOpenNodeModal: (nodeId) => {
        this.inspectorManager.openExpandedModal(nodeId);
      }
    });
    this.tabManager = new WorkflowTabManager({
      onOpenFlow: (flow) => this.openStudio(flow),
      onViewChange: (view) => this.switchView(view),
      onRunFlowDirectly: (flow) => this.runFlowDirectly(flow),
      showToast: (msg, type) => showToast(msg, type)
    });
    this.initBlockCatalogUI();
    this.initGlobalEvents();
    this.tabManager.loadFromStorage();
  }
  switchView(view) {
    this.currentView = view;
    document.getElementById("viewDashboard")?.classList.toggle("active", view === "dashboard");
    document.getElementById("viewStudio")?.classList.toggle("active", view === "studio");
    if (view === "dashboard") {
      this.tabManager.setActiveTabId("dashboard");
      if (window.location.search) {
        window.history.replaceState({}, "", window.location.pathname);
      }
      this.tabManager.loadFromStorage(false);
    }
    this.tabManager.renderTabs();
  }
  openStudio(graph) {
    this.graph = JSON.parse(JSON.stringify(graph));
    this.selectedNodeId = void 0;
    this.tabManager.registerOpenTab(this.graph);
    const titleInput = document.getElementById("flowTitleInput");
    if (titleInput)
      titleInput.value = this.graph.metadata?.name || "Minha Automa\xE7\xE3o";
    if (this.graph.metadata?.id) {
      const newUrl = `${window.location.pathname}?flowId=${encodeURIComponent(this.graph.metadata.id)}`;
      window.history.replaceState({}, "", newUrl);
    }
    this.switchView("studio");
    this.canvasManager.updateCanvasTransform();
    this.canvasManager.render();
    this.inspectorManager.renderInspector();
    this.tabManager.renderTabs();
  }
  createNewFlow() {
    const savedList = this.tabManager.getSavedAutomations();
    const newGraph = {
      schemaVersion: "1.0.0",
      metadata: {
        id: `auto_${Date.now()}`,
        name: `Novo Fluxo ${savedList.length + 1}`,
        description: "Fluxo criado no Visual Flow Studio",
        version: "1.0.0",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      settings: { stopOnError: true, defaultTimeoutMs: 15e3, logLevel: "info", parallelBranchesEnabled: false },
      variables: {},
      nodes: [
        {
          id: `start_${Date.now()}`,
          type: "start",
          category: "flow_logic",
          position: { x: 120, y: 180 },
          data: { label: "In\xEDcio", triggerType: "manual" }
        }
      ],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 }
    };
    savedList.push(newGraph);
    if (chrome.storage?.local) {
      chrome.storage.local.set({ web_automations: savedList });
    }
    this.openStudio(newGraph);
    showToast("Novo fluxo criado!", "info");
  }
  async saveCurrentFlow() {
    const titleInput = document.getElementById("flowTitleInput");
    if (titleInput && titleInput.value.trim()) {
      this.graph.metadata.name = titleInput.value.trim();
    }
    this.graph.metadata.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const cleanGraph = sanitizeGraph(this.graph);
    this.graph = cleanGraph;
    this.tabManager.updateFlowInTabsAndSaved(cleanGraph);
    if (chrome.storage?.local) {
      await chrome.storage.local.set({ web_automations: this.tabManager.getSavedAutomations() });
    }
    if (chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({
        action: "SAVE_AUTOMATION",
        payload: { graph: cleanGraph }
      }).catch(() => {
      });
    }
    const saveBtnLabel = document.getElementById("saveButtonLabel");
    if (saveBtnLabel)
      saveBtnLabel.textContent = "Salvo! \u2713";
    setTimeout(() => {
      if (saveBtnLabel)
        saveBtnLabel.textContent = "Salvar";
    }, 2e3);
    this.tabManager.renderTabs();
    this.inspectorManager.renderInspector();
    showToast(`Automa\xE7\xE3o "${this.graph.metadata.name}" salva com sucesso!`, "success");
  }
  async runFlowDirectly(graph) {
    showToast(`Executando "${graph.metadata?.name || "Automa\xE7\xE3o"}" no navegador...`, "info");
    if (chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage(
        {
          action: "EXECUTE_AUTOMATION",
          payload: { graph }
        },
        (res) => {
          if (res?.success) {
            showToast(`"${graph.metadata?.name || "Automa\xE7\xE3o"}" finalizada com sucesso!`, "success");
          } else if (res?.error) {
            showToast(`Erro ao executar: ${res.error}`, "error");
          }
        }
      );
    } else {
      showToast("Ambiente sem suporte a runtime.sendMessage.", "error");
    }
  }
  async runCurrentFlow() {
    showToast("Iniciando execu\xE7\xE3o do fluxo...", "info");
    if (chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage(
        {
          action: "EXECUTE_AUTOMATION",
          payload: { graph: this.graph }
        },
        (res) => {
          if (res?.success) {
            this.appendLog({ timestamp: Date.now(), level: "info", message: "Execu\xE7\xE3o conclu\xEDda com sucesso!" });
            this.renderVariables(res.variables || {});
            showToast("Fluxo executado com sucesso!", "success");
          } else if (res?.error) {
            this.appendLog({ timestamp: Date.now(), level: "error", message: res.error });
            showToast(`Erro na execu\xE7\xE3o: ${res.error}`, "error");
          }
        }
      );
    } else {
      this.appendLog({ timestamp: Date.now(), level: "warn", message: "Ambiente de desenvolvimento (API Chrome mockada)." });
    }
  }
  exportJson() {
    const cleanGraph = sanitizeGraph(this.graph);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cleanGraph, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `${(this.graph.metadata?.name || "automacao").replace(/\s+/g, "_")}.webautomation.json`);
    dlAnchor.click();
  }
  highlightActiveNode(nodeId) {
    document.querySelectorAll(".graph-node").forEach((el) => el.classList.remove("active-executing"));
    document.getElementById(`rendered_${nodeId}`)?.classList.add("active-executing");
  }
  unhighlightActiveNode(nodeId) {
    document.getElementById(`rendered_${nodeId}`)?.classList.remove("active-executing");
  }
  appendLog(log) {
    const consoleEl = document.getElementById("logsConsole");
    if (!consoleEl)
      return;
    const time = new Date(log.timestamp).toLocaleTimeString();
    const entry = document.createElement("div");
    entry.className = `log-entry ${log.level}`;
    entry.textContent = `[${time}] [${log.level.toUpperCase()}] ${log.message}`;
    consoleEl.appendChild(entry);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }
  renderVariables(vars) {
    const varEl = document.getElementById("variablesList");
    if (!varEl)
      return;
    varEl.innerHTML = `<pre style="font-family: var(--font-mono); font-size: 11px;">${JSON.stringify(vars, null, 2)}</pre>`;
  }
  initBlockCatalogUI() {
    const container = document.getElementById("categoriesContainer");
    if (!container)
      return;
    container.innerHTML = "";
    BLOCK_CATALOG.forEach((cat) => {
      const groupEl = document.createElement("div");
      groupEl.className = `category-group ${cat.categoryClass}`;
      groupEl.innerHTML = `<h4>${cat.categoryLabel}</h4>`;
      cat.items.forEach((item) => {
        const itemEl = document.createElement("div");
        itemEl.className = "block-item";
        itemEl.draggable = true;
        itemEl.dataset.type = item.type;
        itemEl.dataset.category = cat.category;
        itemEl.title = "Clique para adicionar ou arraste para o canvas";
        itemEl.innerHTML = `
          <div class="block-item-icon">${item.icon}</div>
          <div>
            <div class="block-item-title">${item.title}</div>
            <div class="block-item-desc">${item.desc}</div>
          </div>
        `;
        itemEl.addEventListener("click", () => {
          this.canvasManager.addNodeToCanvas(item);
        });
        itemEl.addEventListener("dragstart", (e) => {
          e.dataTransfer?.setData("application/json", JSON.stringify(item));
        });
        groupEl.appendChild(itemEl);
      });
      container.appendChild(groupEl);
    });
  }
  initGlobalEvents() {
    document.getElementById("btnCreateNewFlow")?.addEventListener("click", () => this.createNewFlow());
    document.getElementById("btnTabNewFlow")?.addEventListener("click", () => this.createNewFlow());
    document.getElementById("btnDashboardImport")?.addEventListener("click", () => {
      document.getElementById("jsonFileInput")?.click();
    });
    document.getElementById("dashboardSearchInput")?.addEventListener("input", (e) => {
      this.tabManager.renderDashboard(e.target.value);
    });
    document.getElementById("blockSearchInput")?.addEventListener("input", (e) => {
      const q = (e.target.value || "").toLowerCase().trim();
      document.querySelectorAll(".block-item").forEach((item) => {
        const title = (item.querySelector(".block-item-title")?.textContent || "").toLowerCase();
        const desc = (item.querySelector(".block-item-desc")?.textContent || "").toLowerCase();
        const match = title.includes(q) || desc.includes(q);
        item.style.display = match ? "flex" : "none";
      });
    });
    document.getElementById("btnSaveFlow")?.addEventListener("click", () => this.saveCurrentFlow());
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (this.currentView === "studio") {
          this.saveCurrentFlow();
        }
        return;
      }
      if (e.key === "Delete" || e.key === "Del" || e.key === "Backspace") {
        const target = e.target;
        const isEditingText = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
        if (!isEditingText && this.currentView === "studio") {
          const selectedEdge = this.canvasManager.getSelectedEdgeId();
          if (selectedEdge) {
            e.preventDefault();
            this.canvasManager.deleteEdge(selectedEdge);
          } else if (this.selectedNodeId) {
            e.preventDefault();
            this.canvasManager.deleteNode(this.selectedNodeId);
          }
        }
      }
    });
    window.addEventListener("popstate", () => {
      const urlParams = new URLSearchParams(window.location.search);
      const flowId = urlParams.get("flowId");
      if (flowId) {
        const matched = this.tabManager.getSavedAutomations().find((a) => a.metadata?.id === flowId);
        if (matched) {
          this.openStudio(matched);
        }
      } else {
        this.switchView("dashboard");
      }
    });
    document.getElementById("btnClearCanvas")?.addEventListener("click", () => {
      if (confirm("Deseja limpar todos os n\xF3s e liga\xE7\xF5es deste fluxo?")) {
        this.graph.nodes = [];
        this.graph.edges = [];
        this.selectedNodeId = void 0;
        this.canvasManager.render();
        this.inspectorManager.renderInspector();
        showToast("Canvas limpo.", "info");
      }
    });
    document.getElementById("btnRunFlow")?.addEventListener("click", () => this.runCurrentFlow());
    document.getElementById("btnExportJson")?.addEventListener("click", () => this.exportJson());
    document.getElementById("btnOpenFlowPalette")?.addEventListener("click", () => {
      this.colorPickerManager.openFlowPaletteModal(() => {
        this.canvasManager.render();
      });
    });
    document.getElementById("btnOpenSettings")?.addEventListener("click", () => {
      FlowSettingsModal.open(() => {
        showToast("Configura\xE7\xF5es do Visual Flow salvas com sucesso!", "success");
      });
    });
    document.getElementById("btnImportJson")?.addEventListener("click", () => {
      document.getElementById("jsonFileInput")?.click();
    });
    document.getElementById("jsonFileInput")?.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file)
        return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const imported = JSON.parse(evt.target?.result);
          if (imported.nodes && imported.edges) {
            this.openStudio(imported);
            this.saveCurrentFlow();
            showToast("Fluxo importado com sucesso!", "success");
          } else {
            alert("Formato de arquivo inv\xE1lido. Certifique-se de que \xE9 um .webautomation.json v\xE1lido.");
          }
        } catch (err) {
          alert("Erro ao carregar JSON: " + err.message);
        }
      };
      reader.readAsText(file);
    });
    const sidebarLeft = document.getElementById("sidebarLibrary");
    const sidebarRight = document.getElementById("sidebarInspector");
    const resizerLeft = document.getElementById("resizerLeft");
    const resizerRight = document.getElementById("resizerRight");
    const btnToggleLeft = document.getElementById("btnToggleSidebarLeft");
    const btnToggleRight = document.getElementById("btnToggleSidebarRight");
    const btnActivityBlocks = document.getElementById("btnActivityBlocks");
    const btnActivityAnalyzer = document.getElementById("btnActivityAnalyzer");
    HtmlElementAnalyzer.initMessageListener();
    btnActivityAnalyzer?.addEventListener("click", () => {
      HtmlElementAnalyzer.open();
    });
    const toggleSidebarLeft = (collapse) => {
      if (!sidebarLeft)
        return;
      const shouldCollapse = collapse !== void 0 ? collapse : !sidebarLeft.classList.contains("collapsed");
      sidebarLeft.classList.toggle("collapsed", shouldCollapse);
      btnActivityBlocks?.classList.toggle("active", !shouldCollapse);
      if (resizerLeft)
        resizerLeft.style.display = shouldCollapse ? "none" : "block";
    };
    btnActivityBlocks?.addEventListener("click", () => toggleSidebarLeft());
    btnToggleLeft?.addEventListener("click", () => toggleSidebarLeft(true));
    btnToggleRight?.addEventListener("click", () => {
      this.selectedNodeId = void 0;
      document.querySelectorAll(".graph-node").forEach((el) => el.classList.remove("selected"));
      this.inspectorManager.renderInspector();
    });
    document.getElementById("btnExpandInspectorModal")?.addEventListener("click", () => {
      if (this.selectedNodeId) {
        this.inspectorManager.openExpandedModal(this.selectedNodeId);
      }
    });
    if (resizerLeft && sidebarLeft) {
      let isResizingLeft = false;
      resizerLeft.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        isResizingLeft = true;
        resizerLeft.classList.add("resizing");
        document.body.classList.add("is-resizing-active");
        const onMouseMove = (moveEvent) => {
          if (!isResizingLeft)
            return;
          moveEvent.preventDefault();
          moveEvent.stopPropagation();
          const newWidth = Math.max(200, Math.min(520, moveEvent.clientX));
          sidebarLeft.style.width = `${newWidth}px`;
        };
        const onMouseUp = (upEvent) => {
          if (!isResizingLeft)
            return;
          upEvent.preventDefault();
          upEvent.stopPropagation();
          isResizingLeft = false;
          resizerLeft.classList.remove("resizing");
          document.body.classList.remove("is-resizing-active");
          window.removeEventListener("mousemove", onMouseMove, true);
          window.removeEventListener("mouseup", onMouseUp, true);
        };
        window.addEventListener("mousemove", onMouseMove, true);
        window.addEventListener("mouseup", onMouseUp, true);
      });
    }
    if (resizerRight && sidebarRight) {
      let isResizingRight = false;
      resizerRight.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        isResizingRight = true;
        resizerRight.classList.add("resizing");
        document.body.classList.add("is-resizing-active");
        const onMouseMove = (moveEvent) => {
          if (!isResizingRight)
            return;
          moveEvent.preventDefault();
          moveEvent.stopPropagation();
          const newWidth = Math.max(240, Math.min(650, window.innerWidth - moveEvent.clientX));
          sidebarRight.style.width = `${newWidth}px`;
        };
        const onMouseUp = (upEvent) => {
          if (!isResizingRight)
            return;
          upEvent.preventDefault();
          upEvent.stopPropagation();
          isResizingRight = false;
          resizerRight.classList.remove("resizing");
          document.body.classList.remove("is-resizing-active");
          window.removeEventListener("mousemove", onMouseMove, true);
          window.removeEventListener("mouseup", onMouseUp, true);
        };
        window.addEventListener("mousemove", onMouseMove, true);
        window.addEventListener("mouseup", onMouseUp, true);
      });
    }
    chrome.runtime?.onMessage?.addListener((msg) => {
      if (msg.type === "NODE_START") {
        this.highlightActiveNode(msg.nodeId);
      } else if (msg.type === "NODE_COMPLETE") {
        this.unhighlightActiveNode(msg.nodeId);
      } else if (msg.type === "LOG") {
        this.appendLog(msg.log);
      } else if (msg.type === "STATUS_CHANGE") {
        this.appendLog({ timestamp: Date.now(), level: "info", message: `Status alterado para: ${msg.status}` });
      }
    });
  }
};
window.addEventListener("DOMContentLoaded", () => {
  new VisualEditorApp();
});
//# sourceMappingURL=editorApp.js.map
