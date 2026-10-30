import { describe, it, expect, vi, beforeEach } from 'vitest';
import { showToast, showModalDialog, sanitizeGraph } from '../../src/editor/modules/editorUtils';
import { DialogMenu } from '../../src/editor/modules/dialogUtils';
import { DEFAULT_AUTOMATION } from '../../src/defaultAutomation';
import { WebAutomationGraph } from '../../../BibliotecaDeDev/src/types/schema';

describe('Editor Utilities & Default Automation', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="toastContainer"></div>';
    vi.useRealTimers();
  });

  describe('showToast', () => {
    it('deve adicionar elemento de toast no container com o tipo e mensagem corretos', () => {
      showToast('Operação realizada com sucesso!', 'success');

      const container = document.getElementById('toastContainer');
      expect(container?.children.length).toBe(1);

      const toast = container?.children[0] as HTMLElement;
      expect(toast.textContent).toBe('Operação realizada com sucesso!');
      expect(toast.className).toContain('toast-success');
    });

    it('deve ignorar toasts duplicados se chamados com menos de 1500ms de intervalo', () => {
      showToast('Mensagem idêntica', 'info');
      showToast('Mensagem idêntica', 'info');

      const container = document.getElementById('toastContainer');
      expect(container?.children.length).toBe(1);
    });

    it('clicar no toast deve removê-lo', async () => {
      vi.useFakeTimers();
      showToast('Clique aqui para fechar', 'warning');

      const container = document.getElementById('toastContainer');
      const toast = container?.children[0] as HTMLElement;
      toast.click();

      vi.advanceTimersByTime(200);
      expect(container?.children.length).toBe(0);
    });
  });

  describe('showModalDialog', () => {
    it('deve exibir um modal backdrop com título, mensagem e fechar ao clicar no botão Entendido', () => {
      showModalDialog('Aviso Importante', 'Conteúdo da mensagem do modal');

      const backdrop = document.querySelector('.flow-modal-backdrop');
      expect(backdrop).toBeDefined();

      const title = backdrop?.querySelector('.flow-modal-title');
      const body = backdrop?.querySelector('.flow-modal-body');
      expect(title?.textContent).toBe('Aviso Importante');
      expect(body?.textContent).toBe('Conteúdo da mensagem do modal');

      const okBtn = backdrop?.querySelector('.flow-modal-ok-btn') as HTMLButtonElement;
      okBtn.click();

      expect(document.querySelector('.flow-modal-backdrop')).toBeNull();
    });
  });

  describe('sanitizeGraph', () => {
    it('deve limpar propriedades obsoletas de ícones em botões flutuantes', () => {
      const graph: WebAutomationGraph = {
        schemaVersion: '1.0.0',
        metadata: { id: 'g1', name: 'G1', version: '1', createdAt: '', updatedAt: '' },
        settings: { stopOnError: true, defaultTimeoutMs: 1000, logLevel: 'info', parallelBranchesEnabled: false },
        variables: {},
        nodes: [
          {
            id: 'start_1',
            type: 'start',
            category: 'flow_logic',
            position: { x: 0, y: 0 },
            data: {
              label: 'Start',
              floatingButton: {
                iconType: 'emoji',
                buttonIcon: '🚀',
                svgIcon: '<svg></svg>',
                imageIcon: 'http://img.png',
              } as any,
              triggers: [
                {
                  type: 'floating_button',
                  floatingButton: {
                    iconType: 'svg',
                    buttonIcon: '⚡',
                    svgIcon: '<svg>check</svg>',
                    imageIcon: 'http://img.png',
                  } as any,
                },
              ],
            },
          },
        ],
        edges: [],
      };

      const sanitized = sanitizeGraph(graph);
      const startNode = sanitized.nodes[0].data as any;

      // iconType 'emoji' -> removeu svgIcon e imageIcon
      expect(startNode.floatingButton.svgIcon).toBeUndefined();
      expect(startNode.floatingButton.imageIcon).toBeUndefined();
      expect(startNode.floatingButton.buttonIcon).toBe('🚀');

      // iconType 'svg' -> removeu buttonIcon e imageIcon
      expect(startNode.triggers[0].floatingButton.buttonIcon).toBeUndefined();
      expect(startNode.triggers[0].floatingButton.imageIcon).toBeUndefined();
      expect(startNode.triggers[0].floatingButton.svgIcon).toBe('<svg>check</svg>');
    });
  });

  describe('DEFAULT_AUTOMATION', () => {
    it('deve conter estrutura válida de grafo com nós essenciais da demonstração', () => {
      expect(DEFAULT_AUTOMATION.schemaVersion).toBe('1.0.0');
      expect(DEFAULT_AUTOMATION.metadata.id).toBe('auto_wiki_scraping_default');
      expect(DEFAULT_AUTOMATION.nodes.length).toBeGreaterThanOrEqual(5);

      const nodeTypes = DEFAULT_AUTOMATION.nodes.map((n) => n.type);
      expect(nodeTypes).toContain('start');
      expect(nodeTypes).toContain('navigate');
      expect(nodeTypes).toContain('type_input');
      expect(nodeTypes).toContain('wait_for_element');
      expect(nodeTypes).toContain('extract_data');
      expect(nodeTypes).toContain('inject_html');

      expect(DEFAULT_AUTOMATION.edges.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('DialogMenu (dialogUtils.ts)', () => {
    it('DialogMenu.confirm resolve true ao confirmar', async () => {
      const confirmPromise = DialogMenu.confirm({
        title: 'Confirmar Exclusão',
        message: 'Tem certeza?',
        confirmText: 'Sim, excluir',
      });

      const confirmBtn = document.querySelector('#dialogBtnConfirm') as HTMLButtonElement;
      expect(confirmBtn).toBeDefined();
      confirmBtn.click();

      await expect(confirmPromise).resolves.toBe(true);
    });

    it('DialogMenu.confirm resolve false ao cancelar', async () => {
      const confirmPromise = DialogMenu.confirm({
        title: 'Confirmar Ação',
        message: 'Deseja prosseguir?',
        cancelText: 'Cancelar',
      });

      const cancelBtn = document.querySelector('#dialogBtnCancel') as HTMLButtonElement;
      cancelBtn.click();

      await expect(confirmPromise).resolves.toBe(false);
    });

    it('DialogMenu.prompt retorna texto digitado ao submeter', async () => {
      const promptPromise = DialogMenu.prompt({
        title: 'Novo Nome',
        message: 'Digite o nome do fluxo:',
        defaultValue: 'Meu Fluxo',
      });

      const input = document.querySelector('#dialogPromptInput') as HTMLInputElement;
      expect(input.value).toBe('Meu Fluxo');
      input.value = 'Fluxo Alterado';

      const confirmBtn = document.querySelector('#dialogBtnConfirm') as HTMLButtonElement;
      confirmBtn.click();

      await expect(promptPromise).resolves.toBe('Fluxo Alterado');
    });

    it('DialogMenu.alert resolve ao fechar', async () => {
      const alertPromise = DialogMenu.alert({
        title: 'Sucesso',
        message: 'Operação concluída',
        type: 'success',
      });

      const okBtn = document.querySelector('#dialogBtnOk') as HTMLButtonElement;
      okBtn.click();

      await expect(alertPromise).resolves.toBeUndefined();
    });
  });
});

