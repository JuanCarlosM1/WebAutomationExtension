import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TooltipManager } from '../../src/editor/modules/tooltipManager';
import { ALL_BLOCKS_TEST_AUTOMATION, DEFAULT_AUTOMATION } from '../../src/defaultAutomation';
import { BLOCK_CATALOG } from '../../src/editor/modules/blockCatalog';
import { VisualEditorApp } from '../../src/editor/editorApp';

describe('TooltipManager & Debugger Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('TooltipManager (Balão Flutuante)', () => {
    it('deve inicializar o elemento #appFloatingTooltip no body', () => {
      new TooltipManager();
      const el = document.getElementById('appFloatingTooltip');
      expect(el).not.toBeNull();
      expect(el?.className).toContain('app-floating-tooltip');
      expect(el?.style.display).toBe('none');
    });

    it('deve exibir o balão flutuante ao passar o mouse sobre elemento com data-tooltip-desc', () => {
      const manager = new TooltipManager();
      const btn = document.createElement('button');
      btn.id = 'btnSaveFlow';
      btn.setAttribute('data-tooltip-title', 'Salvar Fluxo');
      btn.setAttribute('data-tooltip-desc', 'Salva todas as alterações.');
      btn.setAttribute('data-tooltip-shortcut', 'Ctrl+S');
      document.body.appendChild(btn);

      manager.show(btn);

      const tooltip = document.getElementById('appFloatingTooltip')!;
      expect(tooltip.style.display).toBe('flex');
      expect(tooltip.querySelector('.floating-tooltip-title')?.textContent).toBe('Salvar Fluxo');
      expect(tooltip.querySelector('.floating-tooltip-desc')?.textContent).toBe('Salva todas as alterações.');
      expect(tooltip.querySelector('.floating-tooltip-shortcut')?.textContent).toBe('Ctrl+S');
    });

    it('deve converter title nativo em tooltip flutuante e restaurá-lo após hide', () => {
      const manager = new TooltipManager();
      const btn = document.createElement('button');
      btn.id = 'btnRunFlow';
      btn.setAttribute('title', 'Executar fluxo no navegador');
      document.body.appendChild(btn);

      // Simula mouseenter
      btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      expect(btn.getAttribute('data-tooltip-desc')).toBe('Executar fluxo no navegador');
      expect(btn.hasAttribute('title')).toBe(false);

      // Ao esconder, restaura o title nativo
      manager.hide();
      expect(btn.getAttribute('title')).toBe('Executar fluxo no navegador');
    });

    it('deve inferir título e atalho para botões conhecidos da extensão', () => {
      const manager = new TooltipManager();
      const btn = document.createElement('button');
      btn.id = 'btnClearCanvas';
      btn.setAttribute('data-tooltip-desc', 'Limpa o canvas');
      document.body.appendChild(btn);

      manager.show(btn);

      const tooltip = document.getElementById('appFloatingTooltip')!;
      expect(tooltip.querySelector('.floating-tooltip-title')?.textContent).toBe('Limpar Canvas');
    });
  });

  describe('Fluxo Completo para Testar Todos os Blocos (ALL_BLOCKS_TEST_AUTOMATION)', () => {
    it('deve conter todos os blocos disponíveis no catálogo de blocos', () => {
      const allCatalogBlocks = BLOCK_CATALOG.flatMap((cat) => cat.items);
      const catalogTypes = new Set(allCatalogBlocks.map((b) => b.type));
      const testFlowTypes = new Set(ALL_BLOCKS_TEST_AUTOMATION.nodes.map((n) => n.type));

      const missing = [...catalogTypes].filter((t) => !testFlowTypes.has(t));
      expect(missing).toEqual([]);
      expect(ALL_BLOCKS_TEST_AUTOMATION.nodes.length).toBeGreaterThanOrEqual(catalogTypes.size);
    });

    it('deve possuir metadados válidos e ligações conectadas', () => {
      expect(ALL_BLOCKS_TEST_AUTOMATION.metadata.id).toBe('auto_test_all_blocks_showcase');
      expect(ALL_BLOCKS_TEST_AUTOMATION.metadata.name).toBe('Teste de Todos os Blocos');
      expect(ALL_BLOCKS_TEST_AUTOMATION.edges.length).toBeGreaterThan(15);
      expect(ALL_BLOCKS_TEST_AUTOMATION.nodes.find((n) => n.type === 'start')).toBeDefined();
    });
  });

  describe('Depuração e Formatação de Logs (Debugger Sidebar & Logs)', () => {
    it('deve formatar log com badge de título do bloco e descrição em tooltip sem exibir IDs brutos', () => {
      const consoleEl = document.createElement('div');
      consoleEl.id = 'logsConsole';
      document.body.appendChild(consoleEl);

      const mockApp = Object.create(VisualEditorApp.prototype);
      mockApp.graph = JSON.parse(JSON.stringify(DEFAULT_AUTOMATION));
      mockApp.logs = [];
      mockApp.lastLogKey = '';
      mockApp.lastLogTime = 0;

      // Chama appendLog com nodeId, nodeTitle e nodeDescription
      mockApp.appendLog({
        timestamp: 1600000000000,
        level: 'info',
        message: "Bloco 'Início' (ID: node_1) executado com sucesso.",
        nodeId: 'node_1',
        nodeTitle: 'Início',
        nodeDescription: 'Ponto de partida do fluxo de automação',
      });

      const entry = consoleEl.querySelector('.log-entry') as HTMLElement;
      expect(entry).not.toBeNull();
      expect(entry.className).toContain('log-entry info');

      // Deve ter badge do bloco com title e data-tooltip-desc
      const badge = entry.querySelector('.log-block-badge') as HTMLElement;
      expect(badge).not.toBeNull();
      expect(badge.textContent).toBe('Início');
      expect(badge.getAttribute('title')).toBe('Ponto de partida do fluxo de automação');
      expect(badge.getAttribute('data-tooltip-desc')).toBe('Ponto de partida do fluxo de automação');

      // Não pode conter ID bruto no texto da mensagem
      const messageSpan = entry.querySelector('.log-message-text') as HTMLElement;
      expect(messageSpan.textContent).not.toContain('node_1');
      expect(messageSpan.textContent).not.toContain('(ID: node_1)');
      expect(messageSpan.textContent).toContain("Bloco 'Início' executado com sucesso.");
    });

    it('deve deduplicar logs idênticos recebidos consecutivamente em curto intervalo', () => {
      const consoleEl = document.createElement('div');
      consoleEl.id = 'logsConsole';
      document.body.appendChild(consoleEl);

      const mockApp = Object.create(VisualEditorApp.prototype);
      mockApp.graph = JSON.parse(JSON.stringify(DEFAULT_AUTOMATION));
      mockApp.logs = [];
      mockApp.lastLogKey = '';
      mockApp.lastLogTime = 0;

      const logData = {
        timestamp: Date.now(),
        level: 'info',
        message: 'Status alterado para: running',
      };

      // Dispara 3 vezes em seguida (simulando múltiplos listeners do Chrome runtime)
      mockApp.appendLog(logData);
      mockApp.appendLog(logData);
      mockApp.appendLog(logData);

      // Apenas 1 deve ser adicionado ao console e à lista interna
      const entries = consoleEl.querySelectorAll('.log-entry');
      expect(entries.length).toBe(1);
      expect(mockApp.logs.length).toBe(1);
    });

    it('deve limpar os logs ao chamar clearLogs()', () => {
      const consoleEl = document.createElement('div');
      consoleEl.id = 'logsConsole';
      document.body.appendChild(consoleEl);

      const mockApp = Object.create(VisualEditorApp.prototype);
      mockApp.graph = JSON.parse(JSON.stringify(DEFAULT_AUTOMATION));
      mockApp.logs = [{ timestamp: Date.now(), level: 'info', message: 'teste' }];
      mockApp.lastLogKey = 'teste';
      mockApp.lastLogTime = Date.now();

      mockApp.clearLogs();

      expect(mockApp.logs.length).toBe(0);
      expect(mockApp.lastLogKey).toBe('');
      expect(consoleEl.textContent).toContain('Console limpo.');
    });

    it('deve abrir a barra lateral de depuração diretamente', () => {
      const sidebarDebug = document.createElement('aside');
      sidebarDebug.id = 'sidebarDebug';
      sidebarDebug.className = 'sidebar-debug collapsed';
      document.body.appendChild(sidebarDebug);

      const btnActivityDebug = document.createElement('button');
      btnActivityDebug.id = 'btnActivityDebug';
      document.body.appendChild(btnActivityDebug);

      const mockApp = Object.create(VisualEditorApp.prototype);
      mockApp.currentView = 'studio';
      mockApp.loadScopedHistory = vi.fn();

      mockApp.openDebugSidebar();

      expect(sidebarDebug.classList.contains('collapsed')).toBe(false);
      expect(btnActivityDebug.classList.contains('active')).toBe(true);
      expect(mockApp.loadScopedHistory).toHaveBeenCalled();
    });

    it('deve sincronizar e exibir os logs históricos gravados no console ao renderizar em Modo Fantasma', () => {
      const consoleEl = document.createElement('div');
      consoleEl.id = 'logsConsole';
      document.body.appendChild(consoleEl);

      const titleTextEl = document.createElement('span');
      titleTextEl.id = 'logsConsoleTitleText';
      titleTextEl.textContent = 'Console de Execução';
      document.body.appendChild(titleTextEl);

      const mockApp = Object.create(VisualEditorApp.prototype);
      mockApp.graph = JSON.parse(JSON.stringify(DEFAULT_AUTOMATION));
      mockApp.logs = [];

      const ghostHistoryItem: any = {
        id: 'run_123',
        timestamp: 1730590545000,
        automationName: 'Fluxo para Testes',
        logs: [
          {
            timestamp: 1730590545000,
            level: 'info',
            message: 'Iniciando automação "Fluxo para Testes"',
          },
          {
            timestamp: 1730590546000,
            level: 'error',
            message: 'Erro no nó "Injetar JS": Element is not defined',
            nodeId: 'node_inject',
            nodeTitle: 'Injetar JS',
            nodeDescription: 'Executa código JavaScript na página',
          },
        ],
      };

      mockApp.renderLogsToConsole(ghostHistoryItem.logs, true, ghostHistoryItem);

      expect(titleTextEl.textContent).toContain('Fantasma');
      const entries = consoleEl.querySelectorAll('.log-entry');
      expect(entries.length).toBe(2);
      expect(entries[0].className).toContain('log-entry info');
      expect(entries[0].textContent).toContain('Iniciando automação');
      expect(entries[1].className).toContain('log-entry error');
      expect(entries[1].textContent).toContain('Injetar JS');
      expect(entries[1].textContent).toContain('Element is not defined');
    });

    it('enterGhostMode abre barra lateral de depuração e popula os logs históricos', () => {
      const consoleEl = document.createElement('div');
      consoleEl.id = 'logsConsole';
      document.body.appendChild(consoleEl);

      const titleTextEl = document.createElement('span');
      titleTextEl.id = 'logsConsoleTitleText';
      titleTextEl.textContent = 'Console de Execução';
      document.body.appendChild(titleTextEl);

      const mockApp = Object.create(VisualEditorApp.prototype);
      mockApp.cleanFlowName = (n: string) => n;
      mockApp.tabManager = {
        registerOpenTab: vi.fn(),
      };
      mockApp.openStudio = vi.fn();
      mockApp.openDebugSidebar = vi.fn();
      mockApp.renderLogsToConsole = VisualEditorApp.prototype.renderLogsToConsole;
      mockApp.canvasManager = {
        setSelectedNodeIds: vi.fn(),
      };
      mockApp.inspectorManager = {
        renderInspector: vi.fn(),
      };

      const ghostHistoryItem: any = {
        id: 'run_999',
        timestamp: 1730590000000,
        automationName: 'Fluxo Crítico',
        graphSnapshot: {
          metadata: { id: 'auto_1', name: 'Fluxo Crítico', version: '1.0.0' },
          nodes: [{ id: 'node_err', type: 'inject_javascript', data: { label: 'Injetar JS' } }],
          edges: [],
        },
        blockSnapshots: {
          node_err: { status: 'failed', error: 'Element is not defined' },
        },
        logs: [
          { timestamp: 1730590000000, level: 'error', message: 'Element is not defined', nodeId: 'node_err', nodeTitle: 'Injetar JS' },
        ],
      };

      mockApp.enterGhostMode(ghostHistoryItem);

      expect(mockApp.tabManager.registerOpenTab).toHaveBeenCalled();
      expect(mockApp.openStudio).toHaveBeenCalled();
      expect(mockApp.openDebugSidebar).toHaveBeenCalled();
      expect(titleTextEl.textContent).toContain('Fantasma');
      expect(consoleEl.textContent).toContain('Element is not defined');
    });

    it('exitGhostMode restaura os logs da automação ativa no console', () => {
      const consoleEl = document.createElement('div');
      consoleEl.id = 'logsConsole';
      document.body.appendChild(consoleEl);

      const titleTextEl = document.createElement('span');
      titleTextEl.id = 'logsConsoleTitleText';
      document.body.appendChild(titleTextEl);

      const mockApp = Object.create(VisualEditorApp.prototype);
      mockApp.isGhostMode = true;
      mockApp.cleanFlowName = (n: string) => n;
      mockApp.graph = { metadata: { id: 'flow_active', name: 'Meu Fluxo' }, nodes: [] };
      mockApp.tabExecutionLogs = new Map([
        ['flow_active', [{ timestamp: 1730000000000, level: 'info', message: 'Log da automação ativa' }]],
      ]);
      mockApp.setEditorActionsReadOnly = vi.fn();
      mockApp.canvasManager = { setGhostMode: vi.fn(), render: vi.fn() };
      mockApp.inspectorManager = { setGhostMode: vi.fn(), renderInspector: vi.fn() };
      mockApp.loadScopedHistory = vi.fn();
      mockApp.renderLogsToConsole = VisualEditorApp.prototype.renderLogsToConsole;

      mockApp.exitGhostMode(false);

      expect(mockApp.isGhostMode).toBe(false);
      expect(titleTextEl.textContent).toBe('Console de Execução');
      expect(consoleEl.textContent).toContain('Log da automação ativa');
    });
  });
});

