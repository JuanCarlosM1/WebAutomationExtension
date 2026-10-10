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
        defaultData: { label: "Condi\xE7\xE3o", executionMode: "first_match", cases: [{ id: "case_1", label: "Caso 1", evaluationMode: "comparison", leftOperand: "{{status}}", operator: "equals", rightOperand: "200" }], hasDefaultBranch: true }
      },
      {
        type: "while_loop",
        title: "Loop While",
        desc: "Enquanto condi\xE7\xE3o ou JS for verdadeiro",
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
        defaultData: { label: "Loop While", evaluationMode: "comparison", leftOperand: "{{i}}", operator: "less_than", rightOperand: "10", maxIterations: 100 }
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
  openFlowPaletteModal() {
    const existing = document.querySelector(".flow-palette-modal-backdrop");
    existing?.remove();
    const palette = this.getFlowColorPalette();
    const backdrop = document.createElement("div");
    backdrop.className = "flow-modal-backdrop flow-palette-modal-backdrop";
    const renderPaletteModalContent = () => {
      backdrop.innerHTML = `
        <div class="flow-modal-card" style="max-width: 480px; width: 100%;">
          <div class="flow-modal-header">
            <div class="flow-modal-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
            </div>
            <div class="flow-modal-title">Grupo de Cores do Fluxo</div>
          </div>
          <div class="flow-modal-body" style="display: flex; flex-direction: column; gap: 12px;">
            <p style="font-size: 12px; color: #94a3b8; line-height: 1.4;">
              Defina as cores personalizadas deste fluxo. Todas as cores adicionadas aqui ficam acess\xEDveis instantaneamente em qualquer seletor de cor no editor.
            </p>
            <div class="custom-palette-list" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
              ${palette.map((color, idx) => `
                <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 6px; padding: 6px; display: flex; flex-direction: column; gap: 4px; align-items: center; position: relative;">
                  <button type="button" class="del-palette-color-btn" data-idx="${idx}" title="Remover" style="position: absolute; top: 2px; right: 4px; background: transparent; border: none; color: #ef4444; font-size: 13px; cursor: pointer; line-height: 1;">&times;</button>
                  <div style="width: 100%; height: 24px; background: ${color}; border-radius: 4px; border: 1px solid #00000030;"></div>
                  <span style="font-size: 10px; font-family: monospace; color: #cbd5e1;">${color}</span>
                </div>
              `).join("")}
            </div>

            <div style="display: flex; gap: 8px; align-items: center; padding-top: 8px; border-top: 1px solid #1e293b;">
              <input type="color" id="newPaletteColorPicker" value="#10b981" style="width: 32px; height: 30px; border: 1px solid #334155; border-radius: 4px; background: transparent; cursor: pointer;" />
              <input type="text" id="newPaletteColorInput" value="#10b981" placeholder="#10b981" style="flex: 1; padding: 6px 8px; font-size: 12px; font-family: monospace; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;" />
              <button type="button" id="btnAddColorToFlowPalette" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px; white-space: nowrap;">+ Adicionar Cor</button>
            </div>
          </div>
          <div class="flow-modal-footer">
            <button class="btn btn-primary flow-palette-close-btn">Salvar & Concluir</button>
          </div>
        </div>
      `;
      const pickerEl = backdrop.querySelector("#newPaletteColorPicker");
      const inputEl = backdrop.querySelector("#newPaletteColorInput");
      const addBtn = backdrop.querySelector("#btnAddColorToFlowPalette");
      pickerEl?.addEventListener("input", (e) => inputEl.value = e.target.value);
      inputEl?.addEventListener("input", (e) => {
        if (e.target.value.startsWith("#") && e.target.value.length === 7) {
          pickerEl.value = e.target.value;
        }
      });
      addBtn?.addEventListener("click", () => {
        const val = inputEl.value.trim();
        if (val) {
          if (!palette.includes(val)) {
            palette.push(val);
            this.getGraph().colorPalette = palette;
            renderPaletteModalContent();
            this.onPaletteChanged?.();
          } else {
            this.showToast("Esta cor j\xE1 existe na paleta do fluxo.", "info");
          }
        }
      });
      backdrop.querySelectorAll(".del-palette-color-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.dataset.idx);
          palette.splice(idx, 1);
          this.getGraph().colorPalette = palette;
          renderPaletteModalContent();
          this.onPaletteChanged?.();
        });
      });
      backdrop.querySelector(".flow-palette-close-btn")?.addEventListener("click", () => backdrop.remove());
    };
    renderPaletteModalContent();
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop)
        backdrop.remove();
    });
    document.body.appendChild(backdrop);
  }
  createPaintColorPicker(container, labelText, initialColor, onChange) {
    let currentColor = initialColor || "#6366f1";
    const group = document.createElement("div");
    group.className = "form-group paint-color-picker-group";
    group.style.cssText = "display: flex; flex-direction: column; gap: 4px; margin-bottom: 6px;";
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
    `;
    const infoDiv = document.createElement("div");
    infoDiv.style.cssText = "display: flex; flex-direction: column; flex: 1;";
    infoDiv.innerHTML = `
      <span style="font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 600;">Cor Atual</span>
      <span class="current-hex-label" style="font-size: 12px; font-family: monospace; color: #f1f5f9; font-weight: 600;">${currentColor || "#6366f1"}</span>
    `;
    const btnMoreColors = document.createElement("button");
    btnMoreColors.type = "button";
    btnMoreColors.className = "btn-xs";
    btnMoreColors.style.cssText = "padding: 5px 10px; font-size: 11px; font-weight: 600; background: #1e293b; border: 1px solid #334155; color: #93c5fd; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 4px; white-space: nowrap;";
    btnMoreColors.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
        Mais Cores...
      `;
    displayBar.appendChild(swatchCurrent);
    displayBar.appendChild(infoDiv);
    displayBar.appendChild(btnMoreColors);
    group.appendChild(displayBar);
    const popoverPanel = document.createElement("div");
    popoverPanel.style.cssText = "display: none; position: relative; z-index: 9999; background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 10px; flex-direction: column; gap: 8px; margin-top: 4px; box-shadow: 0 12px 32px rgba(0,0,0,0.7);";
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
          this.openFlowPaletteModal();
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
      gap: 10px;
      background: #0b0f19;
      border: 1.5px solid #3b82f6;
      border-radius: 12px;
      padding: 12px;
      margin-top: 8px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.75), 0 0 15px rgba(99, 102, 241, 0.2);
      width: 100%;
      box-sizing: border-box;
      position: relative;
    `;
    const spectrumCanvas = document.createElement("canvas");
    spectrumCanvas.width = 240;
    spectrumCanvas.height = 120;
    spectrumCanvas.style.cssText = "width: 100%; height: 120px; border-radius: 8px; cursor: crosshair; display: block; border: 1px solid #1e293b;";
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
      margin: 4px 0;
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
      const x = Math.max(0, Math.min(spectrumCanvas.width - 1, (e.clientX - rect.left) / rect.width * spectrumCanvas.width));
      const y = Math.max(0, Math.min(spectrumCanvas.height - 1, (e.clientY - rect.top) / rect.height * spectrumCanvas.height));
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
    nativeColorBtn.title = "Abrir / Fechar espectro de cores RGB";
    nativeColorBtn.style.cssText = "width: 34px; height: 32px; flex-shrink: 0; border: 1.5px solid #475569; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; background: conic-gradient(red, yellow, lime, cyan, blue, magenta, red); box-shadow: 0 1px 4px rgba(0,0,0,0.4); padding: 0; outline: none; transition: all 0.15s;";
    nativeColorBtn.addEventListener("mouseenter", () => nativeColorBtn.style.transform = "scale(1.05)");
    nativeColorBtn.addEventListener("mouseleave", () => nativeColorBtn.style.transform = "scale(1)");
    nativeColorBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isVisible = customSpectrumCard.style.display === "flex";
      if (!isVisible) {
        customSpectrumCard.style.display = "flex";
        nativeColorBtn.style.borderColor = "#6366f1";
        drawSpectrum(currentHue);
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
    hexInp.addEventListener("input", (e) => applySelectedColor(e.target.value));
    btnSaveToFlowPalette.addEventListener("click", () => {
      const palette = this.getFlowColorPalette();
      if (!palette.includes(currentColor)) {
        palette.push(currentColor);
        this.getGraph().colorPalette = palette;
        this.showToast(`Cor ${currentColor} adicionada ao grupo de cores do fluxo!`, "success");
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
    };
    btnMoreColors.addEventListener("click", (e) => {
      e.preventDefault();
      const isVisible = popoverPanel.style.display === "flex";
      if (!isVisible) {
        refreshPopover();
        popoverPanel.style.display = "flex";
      } else {
        popoverPanel.style.display = "none";
      }
    });
    group.appendChild(popoverPanel);
    container.appendChild(group);
  }
};

// src/editor/modules/inspectorManager.ts
var InspectorManager = class {
  constructor(callbacks, colorPicker) {
    this.callbacks = callbacks;
    this.colorPicker = colorPicker;
  }
  expandedTriggerIndices = /* @__PURE__ */ new Set([0]);
  renderInspector() {
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
        this.renderStartBlockProperties(form, data);
        break;
      case "delay":
        this.renderDelayProperties(form, data);
        break;
      case "switch":
        this.renderSwitchProperties(form, data);
        break;
      case "while_loop":
        this.renderWhileProperties(form, data);
        break;
      case "for_loop":
        this.renderForProperties(form, data);
        break;
      case "if_element_exists":
        this.renderIfElementProperties(form, data);
        break;
      case "try_catch":
        this.addTextInput(form, "Salvar Erro na Vari\xE1vel", data.errorVarName || "lastError", (val) => data.errorVarName = val);
        break;
      case "group":
        this.addTextInput(form, "Cor de Destaque", data.color || "#6366f1", (val) => data.color = val);
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
        this.renderTabActionProperties(form, data);
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
        this.renderClickProperties(form, data);
        break;
      case "type_input":
        this.renderTypeInputProperties(form, data);
        break;
      case "press_key":
        this.addTextInput(form, "Tecla (ex: Enter, Escape, Tab, ArrowDown)", data.key || "Enter", (val) => data.key = val);
        this.addTextInput(form, "Seletor Alvo (Opcional)", data.selector || "", (val) => data.selector = val);
        this.addSelectInput(form, "Tipo de Seletor", data.selectorType || "css", [
          { value: "css", label: "Seletor CSS" },
          { value: "xpath", label: "XPath" }
        ], (val) => data.selectorType = val);
        break;
      case "hover_focus":
        this.addTextInput(form, "Seletor do Elemento", data.selector || "", (val) => data.selector = val);
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
        this.renderScrollProperties(form, data);
        break;
      case "wait_for_element":
        this.addTextInput(form, "Seletor do Elemento", data.selector || "", (val) => data.selector = val);
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
        this.renderHttpRequestProperties(form, data);
        break;
      case "set_variable":
        this.addTextInput(form, "Nome da Vari\xE1vel", data.varName || "meuDado", (val) => data.varName = val);
        this.addSelectInput(form, "Tipo de Avalia\xE7\xE3o", data.evaluationType || "literal", [
          { value: "literal", label: "Valor Fixo Literal" },
          { value: "template", label: "Template com Interpola\xE7\xE3o {{var}}" },
          { value: "js_eval", label: "Express\xE3o JavaScript Din\xE2mica" }
        ], (val) => data.evaluationType = val);
        this.addTextareaInput(form, "Valor ou Express\xE3o", data.valueExpression ?? "", (val) => data.valueExpression = val);
        break;
      case "extract_data":
        this.renderExtractDataProperties(form, data);
        break;
      case "scrape_list":
        this.renderScrapeListProperties(form, data);
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
        this.addTextareaInput(form, "C\xF3digo JavaScript", data.code || 'console.log("Ol\xE1");', (val) => data.code = val);
        this.addTextInput(form, "Salvar Resultado na Vari\xE1vel (opcional)", data.saveResultToVar || "", (val) => data.saveResultToVar = val);
        break;
      case "inject_html":
        this.addTextInput(form, "Seletor do Elemento Alvo", data.targetSelector || "body", (val) => data.targetSelector = val);
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
        this.addTextareaInput(form, "Conte\xFAdo HTML", data.html || "", (val) => data.html = val);
        break;
      case "inject_css":
        this.addSelectInput(form, "Alvo do CSS", data.target || "page", [
          { value: "page", label: "P\xE1gina Inteira" },
          { value: "injected_component", label: "Componente Injetado" }
        ], (val) => data.target = val);
        this.addTextInput(form, "ID da Tag Style (opcional)", data.styleId || "custom-style", (val) => data.styleId = val);
        this.addTextareaInput(form, "C\xF3digo CSS", data.css || "", (val) => data.css = val);
        break;
      case "web_component":
        this.addTextInput(form, "ID do Container HTML", data.containerId || "custom-widget", (val) => data.containerId = val);
        this.addSelectInput(form, "Modo de Isolamento", data.mode || "shadow_dom", [
          { value: "shadow_dom", label: "Shadow DOM Isolado" },
          { value: "inline", label: "Inline no DOM" }
        ], (val) => data.mode = val);
        this.addTextareaInput(form, "C\xF3digo HTML", data.html || "", (val) => data.html = val);
        this.addTextareaInput(form, "C\xF3digo CSS", data.css || "", (val) => data.css = val);
        this.addTextareaInput(form, "C\xF3digo JavaScript", data.js || "", (val) => data.js = val);
        break;
      case "note":
        this.addTextareaInput(form, "Conte\xFAdo da Anota\xE7\xE3o", data.content || "", (val) => data.content = val);
        break;
    }
  }
  renderStartBlockProperties(form, data) {
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
      manual: "\u25B6 Manual (Disparo pelo Usu\xE1rio)",
      on_url_load: "\u{1F310} Ao Carregar URLs de Execu\xE7\xE3o",
      shortcut: "\u2328 Atalho de Teclado",
      schedule: "\u23F1 Em um Intervalo de Tempo",
      browser_startup: "\u{1F680} Ao Abrir o Browser",
      context_menu: "\u{1F5B1} Pelo Menu de Contexto",
      floating_button: "\u2728 Bot\xE3o Flutuante Personalizado",
      mcp: "\u{1F916} Via MCP (IA)"
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
      const isExpanded = this.expandedTriggerIndices.has(index);
      const card = document.createElement("div");
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
        const newExpanded = /* @__PURE__ */ new Set();
        this.expandedTriggerIndices.forEach((idx) => {
          if (idx < index)
            newExpanded.add(idx);
          else if (idx > index)
            newExpanded.add(idx - 1);
        });
        this.expandedTriggerIndices = newExpanded;
        data.triggerType = data.triggers[0]?.type || "manual";
        this.callbacks.onRenderGraph();
        this.renderInspector();
      });
      accordionHeader.appendChild(headerLeft);
      accordionHeader.appendChild(btnDel);
      accordionHeader.addEventListener("click", () => {
        if (this.expandedTriggerIndices.has(index)) {
          this.expandedTriggerIndices.delete(index);
        } else {
          this.expandedTriggerIndices.add(index);
        }
        this.renderInspector();
      });
      card.appendChild(accordionHeader);
      if (isExpanded) {
        const body = document.createElement("div");
        body.style.cssText = "padding: 10px; border-top: 1px solid #1e293b; display: flex; flex-direction: column; gap: 8px;";
        const selectDiv = document.createElement("div");
        selectDiv.style.cssText = "display: flex; flex-direction: column; gap: 4px;";
        const selectLabel = document.createElement("label");
        selectLabel.style.cssText = "font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;";
        selectLabel.textContent = "Tipo de Gatilho";
        const selectEl = document.createElement("select");
        selectEl.style.cssText = "width: 100%; padding: 5px 8px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;";
        const triggerOptions = [
          { value: "manual", label: "\u25B6 Manual (Disparo pelo Usu\xE1rio)" },
          { value: "on_url_load", label: "\u{1F310} Ao Carregar URLs de Execu\xE7\xE3o" },
          { value: "shortcut", label: "\u2328 Atalho de Teclado" },
          { value: "schedule", label: "\u23F1 Em um Intervalo de Tempo" },
          { value: "browser_startup", label: "\u{1F680} Ao Abrir o Browser" },
          { value: "context_menu", label: "\u{1F5B1} Pelo Menu de Contexto" },
          { value: "floating_button", label: "\u2728 Bot\xE3o Flutuante Personalizado" },
          { value: "mcp", label: "\u{1F916} Via MCP (IA)" }
        ];
        selectEl.innerHTML = triggerOptions.map((o) => `<option value="${o.value}" ${trig.type === o.value ? "selected" : ""}>${o.label}</option>`).join("");
        selectEl.addEventListener("change", (e) => {
          trig.type = e.target.value;
          data.triggerType = data.triggers[0]?.type || "manual";
          this.renderInspector();
        });
        selectDiv.appendChild(selectLabel);
        selectDiv.appendChild(selectEl);
        body.appendChild(selectDiv);
        if (trig.type === "on_url_load") {
          if (!Array.isArray(trig.urlPatterns)) {
            trig.urlPatterns = trig.urlPattern ? [trig.urlPattern] : ["*://*.google.com/*"];
          }
          this.renderUrlListSection(body, "URLs para Execu\xE7\xE3o", trig.urlPatterns, (newList) => {
            trig.urlPatterns = newList;
            trig.urlPattern = newList[0] || "";
          });
        } else if (trig.type === "shortcut") {
          this.addTextInput(body, "Atalho de Teclado (ex: Ctrl+Shift+U)", trig.shortcutKey || "run_default_automation", (val) => trig.shortcutKey = val);
        } else if (trig.type === "schedule") {
          this.addNumberInput(body, "Repetir a Cada (minutos)", trig.intervalMinutes ?? 15, (val) => trig.intervalMinutes = val);
          this.addTextInput(body, "Express\xE3o Cron (Opcional, ex: 0 * * * *)", trig.cronExpression || "", (val) => trig.cronExpression = val);
        } else if (trig.type === "context_menu") {
          this.addTextInput(body, "T\xEDtulo no Menu de Contexto", trig.contextMenuTitle || "Executar Esta Automa\xE7\xE3o", (val) => trig.contextMenuTitle = val);
        } else if (trig.type === "floating_button") {
          this.renderFloatingButtonTriggerConfig(body, trig);
        }
        card.appendChild(body);
      }
      triggersContainer.appendChild(card);
    });
    const btnAddTrigger = document.createElement("button");
    btnAddTrigger.type = "button";
    btnAddTrigger.className = "btn-xs";
    btnAddTrigger.style.cssText = "width: 100%; margin-top: 6px; padding: 8px; font-weight: 600; background: #3b82f620; border: 1px dashed #3b82f6; color: #60a5fa; cursor: pointer; border-radius: 6px;";
    btnAddTrigger.textContent = "\u2795 Adicionar Mais Uma Forma de Disparo";
    btnAddTrigger.addEventListener("click", () => {
      data.triggers.push({ type: "manual", enabled: true });
      this.expandedTriggerIndices.add(data.triggers.length - 1);
      data.triggerType = data.triggers[0]?.type || "manual";
      this.callbacks.onRenderGraph();
      this.renderInspector();
    });
    triggersContainer.appendChild(btnAddTrigger);
    form.appendChild(triggersContainer);
  }
  renderFloatingButtonTriggerConfig(body, trig) {
    if (!trig.floatingButton) {
      trig.floatingButton = {
        buttonText: "Executar Fluxo",
        iconType: "emoji",
        buttonIcon: "\u26A1",
        position: "bottom-right",
        offsetX: 24,
        offsetY: 24,
        backgroundColor: "#6366f1",
        textColor: "#ffffff",
        urlPattern: "*://*/*"
      };
    }
    const fb = trig.floatingButton;
    if (!fb.iconType)
      fb.iconType = "emoji";
    this.addTextInput(body, "Texto do Bot\xE3o", fb.buttonText || "", (val) => fb.buttonText = val);
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
        emojiInput.addEventListener("input", (e) => fb.buttonIcon = e.target.value);
        iconContentDiv.appendChild(emojiInput);
      } else if (fb.iconType === "svg") {
        const svgInput = document.createElement("textarea");
        svgInput.value = fb.svgIcon || '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>';
        svgInput.placeholder = '<svg viewBox="0 0 24 24" ...>...</svg>';
        svgInput.rows = 3;
        svgInput.style.cssText = "width: 100%; padding: 5px 8px; font-size: 11px; font-family: monospace; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px; resize: vertical;";
        svgInput.addEventListener("input", (e) => fb.svgIcon = e.target.value);
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
    });
    renderIconOptions();
    iconGroup.appendChild(iconTypeSelect);
    iconGroup.appendChild(iconContentDiv);
    body.appendChild(iconGroup);
    this.addSelectInput(body, "Posi\xE7\xE3o na Tela", fb.position || "bottom-right", [
      { value: "bottom-right", label: "Inferior Direito (Padr\xE3o)" },
      { value: "bottom-left", label: "Inferior Esquerdo" },
      { value: "top-right", label: "Superior Direito" },
      { value: "top-left", label: "Superior Esquerdo" }
    ], (val) => fb.position = val);
    this.addNumberInput(body, "Deslocamento X (px)", fb.offsetX ?? 24, (val) => fb.offsetX = val);
    this.addNumberInput(body, "Deslocamento Y (px)", fb.offsetY ?? 24, (val) => fb.offsetY = val);
    this.colorPicker.createPaintColorPicker(body, "Cor de Fundo", fb.backgroundColor || "#6366f1", (val) => fb.backgroundColor = val);
    this.colorPicker.createPaintColorPicker(body, "Cor do Texto", fb.textColor || "#ffffff", (val) => fb.textColor = val);
    if (!Array.isArray(trig.urlPatterns)) {
      trig.urlPatterns = fb.urlPattern ? [fb.urlPattern] : ["*://*/*"];
    }
    this.renderUrlListSection(body, "URLs Em Que o Bot\xE3o Ser\xE1 Exibido", trig.urlPatterns, (newList) => {
      trig.urlPatterns = newList;
      fb.urlPattern = newList[0] || "*://*/*";
    });
  }
  renderUrlListSection(container, labelText, currentList, onUpdate) {
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
        });
        const delUrlBtn = document.createElement("button");
        delUrlBtn.type = "button";
        delUrlBtn.innerHTML = "&times;";
        delUrlBtn.title = "Remover URL";
        delUrlBtn.style.cssText = "background: #ef444420; color: #ef4444; border: 1px solid #ef444440; border-radius: 4px; width: 22px; height: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center;";
        delUrlBtn.addEventListener("click", () => {
          currentList.splice(uIdx, 1);
          onUpdate(currentList);
          this.renderInspector();
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
      this.renderInspector();
    });
    urlSection.appendChild(btnAddUrl);
    container.appendChild(urlSection);
  }
  renderDelayProperties(form, data) {
    this.addCheckboxInput(form, "Usar Tempo Rand\xF4mico", !!data.isRandom, (val) => {
      data.isRandom = val;
      if (val && !data.randomRange)
        data.randomRange = { minMs: 1e3, maxMs: 3e3 };
      this.renderInspector();
    });
    if (!data.isRandom) {
      this.addNumberInput(form, "Atraso Fixo (ms)", data.fixedMs ?? 1500, (val) => data.fixedMs = val);
    } else {
      this.addNumberInput(form, "Atraso M\xEDnimo (ms)", data.randomRange?.minMs ?? 1e3, (val) => {
        if (!data.randomRange)
          data.randomRange = { minMs: 1e3, maxMs: 3e3 };
        data.randomRange.minMs = val;
      });
      this.addNumberInput(form, "Atraso M\xE1ximo (ms)", data.randomRange?.maxMs ?? 3e3, (val) => {
        if (!data.randomRange)
          data.randomRange = { minMs: 1e3, maxMs: 3e3 };
        data.randomRange.maxMs = val;
      });
    }
  }
  renderSwitchProperties(form, data) {
    this.addSelectInput(form, "Modo de Execu\xE7\xE3o", data.executionMode || "first_match", [
      { value: "first_match", label: "Executar o primeiro que satisfizer" },
      { value: "all_matches_parallel", label: "Executar todos que satisfizerem em paralelo" }
    ], (val) => data.executionMode = val);
    this.addCheckboxInput(form, "Possui Caminho Padr\xE3o (Default)", data.hasDefaultBranch !== false, (val) => data.hasDefaultBranch = val);
    const casesContainer = document.createElement("div");
    casesContainer.style.cssText = "border-top: 1px solid #243049; padding-top: 10px; margin-top: 10px;";
    casesContainer.innerHTML = '<div style="font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 8px;">Casos Condicionais</div>';
    if (!Array.isArray(data.cases))
      data.cases = [];
    data.cases.forEach((c, index) => {
      const mode = c.evaluationMode || (c.jsExpression && !c.operator ? "js_eval" : "comparison");
      const caseEl = document.createElement("div");
      caseEl.style.cssText = "background: #0b0f19; border: 1px solid #1e293b; padding: 8px; border-radius: 6px; margin-bottom: 8px;";
      caseEl.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <input type="text" placeholder="Nome do Caso" value="${c.label || "Caso #" + (index + 1)}" class="case-label-input" style="background:transparent;border:none;border-bottom:1px solid #243049;color:#e2e8f0;font-size:11px;font-weight:600;width:75%;outline:none;padding:2px 0;" />
          <button type="button" class="btn-xs delete-case-btn" data-idx="${index}" style="color:#ef4444;background:transparent;border:none;cursor:pointer;padding:2px 6px;">\u2715</button>
        </div>
        <div style="margin-bottom:6px;">
          <label style="font-size:10px;color:#94a3b8;display:block;margin-bottom:3px;">Tipo de Avalia\xE7\xE3o</label>
          <select class="case-eval-mode" style="width:100%;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;">
            <option value="comparison" ${mode === "comparison" ? "selected" : ""}>Compara\xE7\xE3o de Valores</option>
            <option value="js_eval" ${mode === "js_eval" ? "selected" : ""}>Express\xE3o / C\xF3digo JS</option>
          </select>
        </div>
        <div class="case-comparison-fields" style="display:${mode === "comparison" ? "block" : "none"};">
          <input type="text" placeholder="Operando Esquerdo (ex: {{status}})" value="${c.leftOperand || ""}" class="case-left" style="width:100%;margin-bottom:4px;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;" />
          <select class="case-op" style="width:100%;margin-bottom:4px;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;">
            <option value="equals" ${c.operator === "equals" ? "selected" : ""}>Igual</option>
            <option value="not_equals" ${c.operator === "not_equals" ? "selected" : ""}>Diferente</option>
            <option value="contains" ${c.operator === "contains" ? "selected" : ""}>Cont\xE9m</option>
            <option value="not_contains" ${c.operator === "not_contains" ? "selected" : ""}>N\xE3o Cont\xE9m</option>
            <option value="greater_than" ${c.operator === "greater_than" ? "selected" : ""}>Maior que</option>
            <option value="less_than" ${c.operator === "less_than" ? "selected" : ""}>Menor que</option>
            <option value="greater_or_equal" ${c.operator === "greater_or_equal" ? "selected" : ""}>Maior ou Igual</option>
            <option value="less_or_equal" ${c.operator === "less_or_equal" ? "selected" : ""}>Menor ou Igual</option>
            <option value="is_empty" ${c.operator === "is_empty" ? "selected" : ""}>Est\xE1 Vazio</option>
            <option value="is_not_empty" ${c.operator === "is_not_empty" ? "selected" : ""}>N\xE3o Est\xE1 Vazio</option>
          </select>
          <input type="text" placeholder="Operando Direito (ex: 200)" value="${c.rightOperand || ""}" class="case-right" style="width:100%;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;" />
        </div>
        <div class="case-js-fields" style="display:${mode === "js_eval" ? "block" : "none"};">
          <label style="font-size:10px;color:#94a3b8;display:block;margin-bottom:3px;">C\xF3digo JS Booleano (retorna true/false)</label>
          <textarea class="case-js-code" placeholder="ex: user.role === 'admin' && user.age > 18" style="width:100%;height:60px;padding:6px;font-size:11px;font-family:monospace;background:#172033;color:#38bdf8;border:1px solid #243049;border-radius:4px;resize:vertical;">${c.jsExpression || ""}</textarea>
        </div>
      `;
      caseEl.querySelector(".case-label-input")?.addEventListener("input", (e) => {
        c.label = e.target.value;
        this.callbacks.onRenderGraph();
      });
      const modeSelect = caseEl.querySelector(".case-eval-mode");
      const compFields = caseEl.querySelector(".case-comparison-fields");
      const jsFields = caseEl.querySelector(".case-js-fields");
      modeSelect?.addEventListener("change", (e) => {
        c.evaluationMode = e.target.value;
        if (c.evaluationMode === "js_eval") {
          compFields.style.display = "none";
          jsFields.style.display = "block";
        } else {
          compFields.style.display = "block";
          jsFields.style.display = "none";
        }
      });
      caseEl.querySelector(".case-left")?.addEventListener("input", (e) => c.leftOperand = e.target.value);
      caseEl.querySelector(".case-op")?.addEventListener("change", (e) => c.operator = e.target.value);
      caseEl.querySelector(".case-right")?.addEventListener("input", (e) => c.rightOperand = e.target.value);
      caseEl.querySelector(".case-js-code")?.addEventListener("input", (e) => c.jsExpression = e.target.value);
      caseEl.querySelector(".delete-case-btn")?.addEventListener("click", () => {
        data.cases.splice(index, 1);
        this.callbacks.onRenderGraph();
        this.renderInspector();
      });
      casesContainer.appendChild(caseEl);
    });
    const btnAddCase = document.createElement("button");
    btnAddCase.type = "button";
    btnAddCase.className = "btn-xs";
    btnAddCase.style.cssText = "width: 100%; margin-top: 4px; padding: 6px;";
    btnAddCase.textContent = "+ Adicionar Caso";
    btnAddCase.addEventListener("click", () => {
      data.cases.push({
        id: `case_${Date.now()}`,
        label: `Caso ${data.cases.length + 1}`,
        evaluationMode: "comparison",
        leftOperand: "",
        operator: "equals",
        rightOperand: "",
        jsExpression: ""
      });
      this.callbacks.onRenderGraph();
      this.renderInspector();
    });
    casesContainer.appendChild(btnAddCase);
    form.appendChild(casesContainer);
  }
  renderWhileProperties(form, data) {
    const mode = data.evaluationMode || (data.jsExpression && !data.operator ? "js_eval" : "comparison");
    this.addSelectInput(form, "Tipo de Condi\xE7\xE3o", mode, [
      { value: "comparison", label: "Compara\xE7\xE3o de Valores" },
      { value: "js_eval", label: "Express\xE3o / C\xF3digo JS" }
    ], (val) => {
      data.evaluationMode = val;
      this.renderInspector();
    });
    if (data.evaluationMode === "js_eval") {
      this.addTextareaInput(
        form,
        "C\xF3digo JS Booleano (enquanto retornar true, o loop continua)",
        data.jsExpression || "",
        (val) => data.jsExpression = val
      );
    } else {
      this.addTextInput(form, "Operando Esquerdo (ex: {{i}})", data.leftOperand || "", (val) => data.leftOperand = val);
      this.addSelectInput(form, "Operador Condicional", data.operator || "less_than", [
        { value: "less_than", label: "Menor que" },
        { value: "less_or_equal", label: "Menor ou Igual" },
        { value: "greater_than", label: "Maior que" },
        { value: "greater_or_equal", label: "Maior ou Igual" },
        { value: "equals", label: "Igual" },
        { value: "not_equals", label: "Diferente" }
      ], (val) => data.operator = val);
      this.addTextInput(form, "Operando Direito (ex: 10)", data.rightOperand || "", (val) => data.rightOperand = val);
    }
    this.addNumberInput(form, "Limite M\xE1ximo de Itera\xE7\xF5es (Seguran\xE7a)", data.maxIterations ?? 100, (val) => data.maxIterations = val);
  }
  renderForProperties(form, data) {
    this.addSelectInput(form, "Tipo de Loop", data.loopType || "count", [
      { value: "count", label: "Contagem de Vezes" },
      { value: "array", label: "Iterar sobre Lista/Array" },
      { value: "js_generator", label: "Gerador / Express\xE3o JS" }
    ], (val) => {
      data.loopType = val;
      this.renderInspector();
    });
    if (data.loopType === "count") {
      this.addTextInput(form, "Contagem / Vezes (ex: 5 ou {{total}})", String(data.countExpression ?? 5), (val) => data.countExpression = val);
    } else if (data.loopType === "js_generator") {
      this.addTextareaInput(
        form,
        "C\xF3digo JS (deve retornar um Array ou N\xFAmero de vezes)",
        data.jsExpression || "",
        (val) => data.jsExpression = val
      );
    } else {
      this.addTextInput(form, "Express\xE3o da Lista (ex: {{produtos}})", data.arrayExpression || "", (val) => data.arrayExpression = val);
    }
    this.addTextInput(form, "Vari\xE1vel do Item Atual", data.itemVarName || "item", (val) => data.itemVarName = val);
    this.addTextInput(form, "Vari\xE1vel do \xCDndice Atual", data.indexVarName || "index", (val) => data.indexVarName = val);
    this.addNumberInput(form, "Limite M\xE1ximo de Itera\xE7\xF5es", data.maxIterations ?? 100, (val) => data.maxIterations = val);
  }
  renderIfElementProperties(form, data) {
    this.addTextInput(form, "Seletor do Elemento", data.selector || "", (val) => data.selector = val);
    this.addSelectInput(form, "Tipo de Seletor", data.selectorType || "css", [
      { value: "css", label: "Seletor CSS" },
      { value: "xpath", label: "XPath" }
    ], (val) => data.selectorType = val);
    this.addNumberInput(form, "Tempo Limite de Espera (ms)", data.timeoutMs ?? 3e3, (val) => data.timeoutMs = val);
  }
  renderTabActionProperties(form, data) {
    this.addSelectInput(form, "A\xE7\xE3o de Aba", data.action || "new_tab", [
      { value: "new_tab", label: "Nova Aba" },
      { value: "switch_tab", label: "Trocar Aba" },
      { value: "close_tab", label: "Fechar Aba" },
      { value: "get_current_url", label: "Obter URL Atual" }
    ], (val) => {
      data.action = val;
      this.renderInspector();
    });
    if (data.action === "new_tab") {
      this.addTextInput(form, "URL Inicial", data.url || "https://google.com", (val) => data.url = val);
      this.addCheckboxInput(form, "Focar Imediatamente", data.active !== false, (val) => data.active = val);
      this.addTextInput(form, "Salvar URL em Vari\xE1vel (opcional)", data.saveUrlToVar || "", (val) => data.saveUrlToVar = val);
    } else if (data.action === "switch_tab" || data.action === "close_tab") {
      this.addSelectInput(form, "Crit\xE9rio de Busca", data.queryType || "title", [
        { value: "title", label: "Por T\xEDtulo da Aba" },
        { value: "index", label: "Por Posi\xE7\xE3o / \xCDndice" },
        { value: "url_match", label: "Por Correspond\xEAncia de URL" }
      ], (val) => data.queryType = val);
      this.addTextInput(form, "Valor da Busca", data.queryValue || "", (val) => data.queryValue = val);
    } else if (data.action === "get_current_url") {
      this.addTextInput(form, "Salvar URL na Vari\xE1vel", data.saveUrlToVar || "currentUrl", (val) => data.saveUrlToVar = val);
    }
  }
  renderClickProperties(form, data) {
    this.addTextInput(form, "Seletor do Elemento", data.selector || "", (val) => data.selector = val);
    this.addSelectInput(form, "Tipo de Seletor", data.selectorType || "css", [
      { value: "css", label: "Seletor CSS" },
      { value: "xpath", label: "XPath" }
    ], (val) => data.selectorType = val);
    this.addSelectInput(form, "Tipo de Clique", data.clickType || "single", [
      { value: "single", label: "Clique Simples (Bot\xE3o Esquerdo)" },
      { value: "double", label: "Clique Duplo" },
      { value: "contextmenu", label: "Clique com Bot\xE3o Direito" }
    ], (val) => data.clickType = val);
    this.addCheckboxInput(form, "Aguardar Elemento antes do Clique", data.waitForElement !== false, (val) => data.waitForElement = val);
    this.addNumberInput(form, "Tempo Limite (ms)", data.timeoutMs ?? 5e3, (val) => data.timeoutMs = val);
  }
  renderTypeInputProperties(form, data) {
    this.addTextInput(form, "Seletor do Campo", data.selector || "", (val) => data.selector = val);
    this.addSelectInput(form, "Tipo de Seletor", data.selectorType || "css", [
      { value: "css", label: "Seletor CSS" },
      { value: "xpath", label: "XPath" }
    ], (val) => data.selectorType = val);
    this.addTextareaInput(form, "Texto a Digitar (suporta {{var}})", data.text || "", (val) => data.text = val);
    this.addSelectInput(form, "Modo de Digita\xE7\xE3o", data.mode || "human_typing", [
      { value: "human_typing", label: "Digita\xE7\xE3o Humana Realista (com delay)" },
      { value: "paste", label: "Colar Imediato (Paste)" }
    ], (val) => {
      data.mode = val;
      this.renderInspector();
    });
    if (data.mode === "human_typing") {
      this.addNumberInput(form, "Atraso M\xEDnimo por Tecla (ms)", data.minTypingDelayMs ?? 40, (val) => data.minTypingDelayMs = val);
      this.addNumberInput(form, "Atraso M\xE1ximo por Tecla (ms)", data.maxTypingDelayMs ?? 120, (val) => data.maxTypingDelayMs = val);
    }
    this.addCheckboxInput(form, "Limpar campo antes de digitar", !!data.clearBeforeTyping, (val) => data.clearBeforeTyping = val);
    this.addCheckboxInput(form, "Pressionar Enter ap\xF3s digitar", !!data.pressEnterAfter, (val) => data.pressEnterAfter = val);
    this.addNumberInput(form, "Tempo Limite (ms)", data.timeoutMs ?? 5e3, (val) => data.timeoutMs = val);
  }
  renderScrollProperties(form, data) {
    this.addSelectInput(form, "Destino da Rolagem", data.target || "bottom", [
      { value: "bottom", label: "Rolar at\xE9 o Final da P\xE1gina" },
      { value: "top", label: "Rolar at\xE9 o Topo da P\xE1gina" },
      { value: "element", label: "Rolar at\xE9 o Elemento ficar Vis\xEDvel" },
      { value: "by_pixels", label: "Rolar por Quantidade de Pixels" }
    ], (val) => {
      data.target = val;
      this.renderInspector();
    });
    if (data.target === "element") {
      this.addTextInput(form, "Seletor do Elemento Alvo", data.selector || "", (val) => data.selector = val);
      this.addSelectInput(form, "Tipo de Seletor", data.selectorType || "css", [
        { value: "css", label: "Seletor CSS" },
        { value: "xpath", label: "XPath" }
      ], (val) => data.selectorType = val);
    } else if (data.target === "by_pixels") {
      this.addNumberInput(form, "Deslocamento Vertical (Delta Y)", data.deltaY ?? 500, (val) => data.deltaY = val);
      this.addNumberInput(form, "Deslocamento Horizontal (Delta X)", data.deltaX ?? 0, (val) => data.deltaX = val);
    }
    this.addCheckboxInput(form, "Rolagem Suave (Smooth)", data.smooth !== false, (val) => data.smooth = val);
  }
  renderHttpRequestProperties(form, data) {
    this.addTextInput(form, "URL da Requisi\xE7\xE3o", data.url || "https://", (val) => data.url = val);
    this.addSelectInput(form, "M\xE9todo HTTP", data.method || "GET", [
      { value: "GET", label: "GET" },
      { value: "POST", label: "POST" },
      { value: "PUT", label: "PUT" },
      { value: "PATCH", label: "PATCH" },
      { value: "DELETE", label: "DELETE" },
      { value: "HEAD", label: "HEAD" }
    ], (val) => {
      data.method = val;
      this.renderInspector();
    });
    if (data.method === "POST" || data.method === "PUT" || data.method === "PATCH") {
      this.addTextareaInput(form, "Corpo da Requisi\xE7\xE3o (Body)", data.body || "", (val) => data.body = val);
    }
    this.addSelectInput(form, "Tipo de Resposta", data.responseType || "json", [
      { value: "json", label: "JSON (Objeto/Array)" },
      { value: "text", label: "Texto Puro" }
    ], (val) => data.responseType = val);
    this.addTextInput(form, "Salvar Resposta na Vari\xE1vel", data.saveResponseToVar || "apiResponse", (val) => data.saveResponseToVar = val);
    this.addTextInput(form, "Salvar Status HTTP na Vari\xE1vel (opcional)", data.saveStatusToVar || "", (val) => data.saveStatusToVar = val);
    this.addNumberInput(form, "Tempo Limite (ms)", data.timeoutMs ?? 15e3, (val) => data.timeoutMs = val);
  }
  renderExtractDataProperties(form, data) {
    this.addTextInput(form, "Seletor do Elemento", data.selector || "", (val) => data.selector = val);
    this.addSelectInput(form, "Tipo de Seletor", data.selectorType || "css", [
      { value: "css", label: "Seletor CSS" },
      { value: "xpath", label: "XPath" }
    ], (val) => data.selectorType = val);
    this.addSelectInput(form, "Tipo de Extra\xE7\xE3o", data.extractType || "innerText", [
      { value: "innerText", label: "Texto Vis\xEDvel (innerText)" },
      { value: "innerHTML", label: "HTML Interno (innerHTML)" },
      { value: "value", label: "Valor do Campo (value)" },
      { value: "attribute", label: "Atributo HTML (ex: href, src)" }
    ], (val) => {
      data.extractType = val;
      this.renderInspector();
    });
    if (data.extractType === "attribute") {
      this.addTextInput(form, "Nome do Atributo (ex: href, src)", data.attributeName || "href", (val) => data.attributeName = val);
    }
    this.addTextInput(form, "Salvar Dado na Vari\xE1vel", data.saveToVar || "extractedData", (val) => data.saveToVar = val);
    this.addNumberInput(form, "Tempo Limite (ms)", data.timeoutMs ?? 5e3, (val) => data.timeoutMs = val);
  }
  renderScrapeListProperties(form, data) {
    this.addTextInput(form, "Seletor dos Itens / Cards", data.selector || ".card", (val) => data.selector = val);
    this.addSelectInput(form, "Tipo de Seletor", data.selectorType || "css", [
      { value: "css", label: "Seletor CSS" },
      { value: "xpath", label: "XPath" }
    ], (val) => data.selectorType = val);
    this.addTextInput(form, "Salvar Lista na Vari\xE1vel", data.saveToVar || "items", (val) => data.saveToVar = val);
    this.addNumberInput(form, "Limite M\xE1ximo de Itens", data.maxItems ?? 50, (val) => data.maxItems = val);
    this.addNumberInput(form, "Tempo Limite (ms)", data.timeoutMs ?? 5e3, (val) => data.timeoutMs = val);
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
        this.renderInspector();
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
      this.renderInspector();
    });
    fieldsContainer.appendChild(btnAddField);
    form.appendChild(fieldsContainer);
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
    group.innerHTML = `<label>${labelText}</label><textarea>${value ?? ""}</textarea>`;
    group.querySelector("textarea")?.addEventListener("input", (e) => onChange(e.target.value));
    container.appendChild(group);
  }
};

// src/editor/modules/canvasManager.ts
var CanvasManager = class {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.initCanvasEvents();
    this.initMinimapEvents();
  }
  zoom = 1;
  panOffset = { x: 0, y: 0 };
  isPanning = false;
  panStart = { x: 0, y: 0 };
  isDraggingNode = false;
  connectingFromNodeId;
  connectingHandle;
  isCtrlConnectionMode = false;
  activeMoveHandler;
  activeUpHandler;
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
      nodeEl.innerHTML = `
        <div class="node-handle node-handle-input" data-node-id="${node.id}" data-handle-type="input" title="Conectar entrada aqui"></div>
        <div class="graph-node-header">
          <div class="graph-node-title">
            <span class="graph-node-icon">${nodeIcon}</span>
            <span class="graph-node-title-text">${node.data.label || node.type}</span>
          </div>
          <button class="btn-xs delete-node-btn" data-id="${node.id}">\u2715</button>
        </div>
        <div class="graph-node-body">
          Tipo: <strong>${node.type}</strong>
          <div class="graph-node-desc-preview" style="margin-top: 4px; font-size: 10px; color: #94a3b8; font-style: italic; display: ${node.data.description ? "block" : "none"}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${node.data.description || ""}</div>
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
            const isTargetInHandle = targetEl?.classList.contains("node-handle-input");
            if (!isTargetInHandle) {
              this.cancelConnection();
            }
          };
          this.activeMoveHandler = onConnectingMove;
          this.activeUpHandler = onConnectingUp;
          window.addEventListener("mousemove", onConnectingMove);
          window.addEventListener("mouseup", onConnectingUp);
        });
      });
      const inHandle = nodeEl.querySelector(".node-handle-input");
      inHandle?.addEventListener("mouseup", (e) => {
        e.stopPropagation();
        if (this.connectingFromNodeId) {
          if (this.connectingFromNodeId === node.id) {
            this.callbacks.showModalDialog(
              "Opera\xE7\xE3o Inv\xE1lida",
              "N\xE3o \xE9 permitido conectar um bloco diretamente a ele mesmo.",
              "\u26A0\uFE0F"
            );
            this.callbacks.showToast("N\xE3o \xE9 poss\xEDvel conectar um bloco a si mesmo.", "warning");
            this.cancelConnection();
          } else {
            const edgeId = `e_${this.connectingFromNodeId}_${this.connectingHandle || "default"}_${node.id}`;
            const alreadyConnected = graph.edges.some(
              (edge) => edge.source === this.connectingFromNodeId && edge.target === node.id && edge.sourceHandle === this.connectingHandle
            );
            if (alreadyConnected) {
              this.callbacks.showToast("Estes dois blocos j\xE1 est\xE3o conectados!", "warning");
            } else {
              graph.edges.push({
                id: edgeId,
                source: this.connectingFromNodeId,
                target: node.id,
                sourceHandle: this.connectingHandle || "default"
              });
              this.renderEdges();
              this.renderMinimap();
              this.callbacks.showToast("Liga\xE7\xE3o conectada com sucesso!", "info");
            }
            const keepConnecting = this.isCtrlConnectionMode || e.ctrlKey || e.metaKey;
            if (!keepConnecting) {
              this.cancelConnection();
            }
          }
        }
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
      const { pathData, midX, midY } = this.generateOrthogonalPath(x1, y1, x2, y2);
      let strokeColor = "#6366f1";
      if (edge.sourceHandle === "true" || edge.sourceHandle === "loop_done")
        strokeColor = "#10b981";
      else if (edge.sourceHandle === "false" || edge.sourceHandle === "catch_branch")
        strokeColor = "#f43f5e";
      else if (edge.sourceHandle === "loop_body" || edge.sourceHandle === "try_body")
        strokeColor = "#38bdf8";
      else if (edge.sourceHandle && edge.sourceHandle.startsWith("case_"))
        strokeColor = "#f59e0b";
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", strokeColor);
      path.setAttribute("stroke-width", "2.5");
      path.setAttribute("stroke-linecap", "round");
      path.style.cursor = "pointer";
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
        graph.edges = graph.edges.filter((ed) => ed.id !== edge.id);
        this.renderEdges();
        this.renderMinimap();
        this.callbacks.showToast("Liga\xE7\xE3o exclu\xEDda!", "info");
      };
      deleteBadge.addEventListener("click", deleteThisEdge);
      deleteBadge.addEventListener("mousedown", (e) => e.stopPropagation());
      svgEdges.appendChild(path);
      if (svgControls) {
        svgControls.appendChild(deleteBadge);
      } else {
        svgEdges.appendChild(deleteBadge);
      }
    });
  }
  generateOrthogonalPath(x1, y1, x2, y2) {
    const r = 10;
    if (x2 >= x1 + 30) {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      if (Math.abs(y2 - y1) <= r * 2) {
        return {
          pathData: `M ${x1} ${y1} L ${x2} ${y2}`,
          midX,
          midY
        };
      }
      if (y2 > y1) {
        return {
          pathData: `M ${x1} ${y1} L ${midX - r} ${y1} Q ${midX} ${y1} ${midX} ${y1 + r} L ${midX} ${y2 - r} Q ${midX} ${y2} ${midX + r} ${y2} L ${x2} ${y2}`,
          midX,
          midY
        };
      } else {
        return {
          pathData: `M ${x1} ${y1} L ${midX - r} ${y1} Q ${midX} ${y1} ${midX} ${y1 - r} L ${midX} ${y2 + r} Q ${midX} ${y2} ${midX + r} ${y2} L ${x2} ${y2}`,
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
    const minimapSvg = document.getElementById("minimapSvg");
    const indicator = document.getElementById("minimapIndicator");
    const minimapBody = document.getElementById("minimapBody");
    const canvas = document.getElementById("canvasContainer");
    if (!minimapSvg || !indicator || !minimapBody || !canvas)
      return;
    minimapSvg.innerHTML = "";
    const graph = this.callbacks.getGraph();
    const nodes = graph.nodes;
    if (nodes.length === 0) {
      indicator.style.display = "none";
      return;
    }
    indicator.style.display = "block";
    const mmWidth = minimapBody.clientWidth || 190;
    const mmHeight = minimapBody.clientHeight || 108;
    const canvasRect = canvas.getBoundingClientRect();
    const visibleLeft = -this.panOffset.x / this.zoom;
    const visibleTop = -this.panOffset.y / this.zoom;
    const visibleRight = visibleLeft + canvasRect.width / this.zoom;
    const visibleBottom = visibleTop + canvasRect.height / this.zoom;
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
    graph.edges.forEach((edge) => {
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
    const selectedId = this.callbacks.getSelectedNodeId();
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
    const indW = canvasRect.width / this.zoom * mmScale;
    const indH = canvasRect.height / this.zoom * mmScale;
    indicator.style.left = `${Math.max(0, indX)}px`;
    indicator.style.top = `${Math.max(0, indY)}px`;
    indicator.style.width = `${Math.min(mmWidth, indW)}px`;
    indicator.style.height = `${Math.min(mmHeight, indH)}px`;
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
      if (e.target.closest(".graph-node") || e.target.closest(".canvas-floating-controls") || e.target.closest(".canvas-minimap")) {
        return;
      }
      this.callbacks.setSelectedNodeId(void 0);
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
  initMinimapEvents() {
    const minimap = document.getElementById("canvasMinimap");
    const minimapBody = document.getElementById("minimapBody");
    const canvas = document.getElementById("canvasContainer");
    if (!minimap || !minimapBody || !canvas)
      return;
    const navigateToMinimapPoint = (e) => {
      const graph = this.callbacks.getGraph();
      const nodes = graph.nodes;
      if (nodes.length === 0)
        return;
      const bodyRect = minimapBody.getBoundingClientRect();
      const clickX = e.clientX - bodyRect.left;
      const clickY = e.clientY - bodyRect.top;
      const mmWidth = bodyRect.width;
      const mmHeight = bodyRect.height;
      const canvasRect = canvas.getBoundingClientRect();
      const visibleLeft = -this.panOffset.x / this.zoom;
      const visibleTop = -this.panOffset.y / this.zoom;
      const visibleRight = visibleLeft + canvasRect.width / this.zoom;
      const visibleBottom = visibleTop + canvasRect.height / this.zoom;
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
      this.panOffset.x = canvasRect.width / 2 - targetWorldX * this.zoom;
      this.panOffset.y = canvasRect.height / 2 - targetWorldY * this.zoom;
      this.updateCanvasTransform();
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
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container)
    return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.2s ease-out";
    setTimeout(() => toast.remove(), 200);
  }, 3500);
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
    this.colorPickerManager = new ColorPickerManager({
      getGraph: () => this.graph,
      showToast: (msg, type) => showToast(msg, type)
    });
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
      showModalDialog: (title, msg, icon) => showModalDialog(title, msg, icon)
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
    const saveBtnLabel = document.getElementById("saveButtonLabel");
    if (saveBtnLabel)
      saveBtnLabel.textContent = "Salvo! \u2713";
    setTimeout(() => {
      if (saveBtnLabel)
        saveBtnLabel.textContent = "Salvar";
    }, 2e3);
    this.tabManager.renderTabs();
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
      if (e.key === "Delete" || e.key === "Del") {
        const target = e.target;
        const isEditingText = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
        if (!isEditingText && this.currentView === "studio" && this.selectedNodeId) {
          e.preventDefault();
          this.canvasManager.deleteNode(this.selectedNodeId);
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
