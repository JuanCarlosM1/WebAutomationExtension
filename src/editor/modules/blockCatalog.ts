/**
 * Catálogo de nós e blocos disponíveis no editor com ícones SVG modernos
 * seguindo a identidade visual do Visual Flow
 */
import { NodeType } from '../../../../BibliotecaDeDev/src/types/schema';

export interface BlockCatalogItem {
  type: NodeType;
  title: string;
  desc: string;
  icon: string;
  defaultData: any;
}

export interface BlockCategory {
  category: string;
  categoryLabel: string;
  categoryClass: string;
  items: BlockCatalogItem[];
}

export const BLOCK_CATALOG: BlockCategory[] = [
  {
    category: 'flow_logic',
    categoryLabel: 'A. Controle de Fluxo e Lógica',
    categoryClass: 'cat-flow',
    items: [
      {
        type: 'start',
        title: 'Bloco de Início',
        desc: 'Ponto de partida e gatilho',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
        defaultData: { label: 'Início', triggerType: 'manual' },
      },
      {
        type: 'delay',
        title: 'Atraso (Delay)',
        desc: 'Pausa fixa ou randômica',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        defaultData: { label: 'Aguardar', isRandom: false, fixedMs: 1500, randomRange: { minMs: 1000, maxMs: 3000 } },
      },
      {
        type: 'switch',
        title: 'Switch (Condicional)',
        desc: 'Desvia fluxo por condição ou código JS',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>',
        defaultData: {
          label: 'Condição',
          executionMode: 'first_match',
          cases: [
            {
              id: 'case_1',
              label: 'Caso 1',
              logicalOperator: 'and',
              rules: [{ id: 'rule_1', evaluationMode: 'comparison', leftOperand: '{{status}}', operator: 'equals', rightOperand: '200' }],
            },
          ],
          hasDefaultBranch: true,
        },
      },
      {
        type: 'while_loop',
        title: 'Loop While',
        desc: 'Enquanto condição ou JS for verdadeiro',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
        defaultData: {
          label: 'Loop While',
          logicalOperator: 'and',
          rules: [{ id: 'rule_1', evaluationMode: 'comparison', leftOperand: '{{i}}', operator: 'less_than', rightOperand: '10' }],
          maxIterations: 100,
        },
      },
      {
        type: 'for_loop',
        title: 'Loop For',
        desc: 'Itera sobre lista, contagem ou gerador JS',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
        defaultData: { label: 'Loop For', loopType: 'count', countExpression: 5, arrayExpression: '{{items}}', itemVarName: 'item', indexVarName: 'index', maxIterations: 100 },
      },
      {
        type: 'if_element_exists',
        title: 'Se Elemento Existir',
        desc: 'Desvio seletor CSS existe',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
        defaultData: { label: 'Elemento Existe?', selector: '.btn-primary', selectorType: 'css', timeoutMs: 3000 },
      },
      {
        type: 'try_catch',
        title: 'Tentar / Capturar',
        desc: 'Prevenção de falhas',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        defaultData: { label: 'Try/Catch', errorVarName: 'lastError' },
      },
      {
        type: 'group',
        title: 'Grupo de Blocos',
        desc: 'Agrupador visual',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
        defaultData: { label: 'Novo Grupo', childNodeIds: [], color: '#6366f1', description: '' },
      },
    ],
  },
  {
    category: 'browser_navigation',
    categoryLabel: 'B. Navegação (Browser API)',
    categoryClass: 'cat-nav',
    items: [
      {
        type: 'navigate',
        title: 'Ir para Página',
        desc: 'Navega para URL',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        defaultData: { label: 'Navegar', url: 'https://', waitUntil: 'load', timeoutMs: 30000 },
      },
      {
        type: 'tab_action',
        title: 'Ações de Aba',
        desc: 'Nova, trocar, fechar',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
        defaultData: { label: 'Aba', action: 'new_tab', url: 'https://google.com', active: true, queryType: 'title', queryValue: '', saveUrlToVar: '' },
      },
      {
        type: 'history_navigation',
        title: 'Histórico',
        desc: 'Voltar, avançar, recarregar',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 19 2 12 11 5 11 19"/><polygon points="22 19 13 12 22 5 22 19"/></svg>',
        defaultData: { label: 'Histórico', action: 'reload', ignoreCache: false },
      },
    ],
  },
  {
    category: 'dom_interaction',
    categoryLabel: 'C. Interação com DOM',
    categoryClass: 'cat-dom',
    items: [
      {
        type: 'click_element',
        title: 'Clicar em Elemento',
        desc: 'Clique simples, duplo ou dir.',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 15l5 5"/><circle cx="9" cy="9" r="7"/></svg>',
        defaultData: { label: 'Clicar', selector: 'button', selectorType: 'css', clickType: 'single', waitForElement: true, timeoutMs: 5000 },
      },
      {
        type: 'type_input',
        title: 'Digitar Texto',
        desc: 'Simulação humana ou colar',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="8" x2="6" y2="8"/><line x1="10" y1="8" x2="10" y2="8"/><line x1="14" y1="8" x2="14" y2="8"/><line x1="18" y1="8" x2="18" y2="8"/><line x1="7" y1="16" x2="17" y2="16"/></svg>',
        defaultData: { label: 'Digitar', selector: 'input', selectorType: 'css', text: '', mode: 'human_typing', minTypingDelayMs: 40, maxTypingDelayMs: 120, clearBeforeTyping: false, pressEnterAfter: false, timeoutMs: 5000 },
      },
      {
        type: 'press_key',
        title: 'Enviar Tecla',
        desc: 'Enter, Esc, Tab, etc.',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>',
        defaultData: { label: 'Pressionar Tecla', key: 'Enter', selector: '', selectorType: 'css' },
      },
      {
        type: 'hover_focus',
        title: 'Foco / Hover',
        desc: 'Passar mouse ou focar',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
        defaultData: { label: 'Foco/Hover', selector: '', selectorType: 'css', action: 'hover', timeoutMs: 5000 },
      },
      {
        type: 'scroll',
        title: 'Rolar Página',
        desc: 'Topo, final ou elemento',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
        defaultData: { label: 'Rolar', target: 'bottom', selector: '', selectorType: 'css', deltaX: 0, deltaY: 500, smooth: true },
      },
      {
        type: 'wait_for_element',
        title: 'Esperar Elemento',
        desc: 'Aguardar visível ou clicável',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>',
        defaultData: { label: 'Esperar', selector: '', selectorType: 'css', state: 'visible', timeoutMs: 10000 },
      },
    ],
  },
  {
    category: 'data_network',
    categoryLabel: 'D. Dados, Variáveis e Rede',
    categoryClass: 'cat-data',
    items: [
      {
        type: 'http_request',
        title: 'Requisição HTTP',
        desc: 'GET, POST, Headers, Body',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>',
        defaultData: { label: 'HTTP Request', url: 'https://api.example.com', method: 'GET', responseType: 'json', body: '', saveResponseToVar: 'apiResponse', saveStatusToVar: 'apiStatus', timeoutMs: 15000 },
      },
      {
        type: 'set_variable',
        title: 'Definir Variável',
        desc: 'Cria/modifica no estado',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
        defaultData: { label: 'Set Variable', varName: 'meuDado', evaluationType: 'literal', valueExpression: 'valor' },
      },
      {
        type: 'extract_data',
        title: 'Extrair Texto/Atrib.',
        desc: 'innerText, href, src',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>',
        defaultData: { label: 'Extrair', selector: 'h1', selectorType: 'css', extractType: 'innerText', attributeName: 'href', saveToVar: 'extractedHeading', timeoutMs: 5000 },
      },
      {
        type: 'scrape_list',
        title: 'Extrair Lista',
        desc: 'Scraping de múltiplos itens',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
        defaultData: { label: 'Scrape Lista', selector: '.card', selectorType: 'css', fields: [{ name: 'titulo', subSelector: '.title', extractType: 'innerText', attributeName: '' }], saveToVar: 'items', maxItems: 50, timeoutMs: 5000 },
      },
      {
        type: 'export_file',
        title: 'Exportar Arquivo',
        desc: 'Salvar em .csv ou .json',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
        defaultData: { label: 'Exportar', sourceVar: 'items', format: 'json', filename: 'dados.json', csvDelimiter: ',' },
      },
    ],
  },
  {
    category: 'injection_customization',
    categoryLabel: 'E. Injeção e Customização',
    categoryClass: 'cat-inject',
    items: [
      {
        type: 'inject_javascript',
        title: 'Injetar JavaScript',
        desc: 'Roda no Content ou Background',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
        defaultData: { label: 'Injetar JS', code: 'console.log("Olá Mundo");', context: 'content_script', saveResultToVar: '' },
      },
      {
        type: 'inject_html',
        title: 'Injetar HTML',
        desc: 'Insere elementos na página',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
        defaultData: { label: 'Injetar HTML', html: '<div class="banner">Aviso</div>', targetSelector: 'body', selectorType: 'css', position: 'beforeend' },
      },
      {
        type: 'inject_css',
        title: 'Injetar CSS',
        desc: 'Aplica estilos customizados',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
        defaultData: { label: 'Injetar CSS', css: 'body { background: #000 !important; }', target: 'page', styleId: 'custom-style' },
      },
      {
        type: 'web_component',
        title: 'Elementos Web',
        desc: 'HTML + CSS + JS unificados',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
        defaultData: { label: 'Web Component', html: '<button id="btn">Ok</button>', css: 'button { color: red; }', js: '', containerId: 'custom-widget', mode: 'shadow_dom' },
      },
      {
        type: 'note',
        title: 'Nota / Comentário',
        desc: 'Anotação visual no editor',
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
        defaultData: { label: 'Nota', content: 'Descreva seu fluxo aqui...' },
      },
    ],
  },
];
