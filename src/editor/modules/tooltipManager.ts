/**
 * Gerenciador de Balão Flutuante (Tooltip Interativo e Explicativo)
 * Fornece dicas contextuais com títulos, explicações detalhadas e atalhos de teclado
 * para todos os botões e elementos importantes da extensão.
 */

export interface TooltipData {
  title?: string;
  description: string;
  shortcut?: string;
  category?: string;
}

export class TooltipManager {
  private tooltipEl: HTMLElement | null = null;
  private currentTarget: HTMLElement | null = null;
  private hideTimeout: any = null;

  constructor() {
    this.createTooltipElement();
    this.initEventListeners();
  }

  private createTooltipElement(): void {
    if (document.getElementById('appFloatingTooltip')) {
      this.tooltipEl = document.getElementById('appFloatingTooltip');
      return;
    }

    const el = document.createElement('div');
    el.id = 'appFloatingTooltip';
    el.className = 'app-floating-tooltip';
    el.setAttribute('role', 'tooltip');
    el.style.display = 'none';

    el.innerHTML = `
      <div class="floating-tooltip-header">
        <span class="floating-tooltip-title"></span>
        <span class="floating-tooltip-shortcut"></span>
      </div>
      <div class="floating-tooltip-desc"></div>
      <div class="floating-tooltip-arrow"></div>
    `;

    document.body.appendChild(el);
    this.tooltipEl = el;
  }

  private initEventListeners(): void {
    // Delegação de eventos no document.body para cobrir elementos dinâmicos (abas, cards, modais)
    document.body.addEventListener(
      'mouseenter',
      (e) => {
        const target = (e.target as HTMLElement)?.closest?.(
          '[data-tooltip-desc], [data-tooltip], [title], .activity-btn, .sidebar-toggle-btn, #btnDebugFlow, #btnRunFlow, #btnSaveFlow, #btnClearCanvas, #btnExportJson, #btnTabNewFlow'
        ) as HTMLElement;

        if (!target) return;

        // Se o elemento possui title nativo, converte para tooltip flutuante
        if (target.hasAttribute('title') && target.getAttribute('title')) {
          const titleVal = target.getAttribute('title') || '';
          if (!target.hasAttribute('data-tooltip-desc')) {
            target.setAttribute('data-tooltip-desc', titleVal);
          }
          // Salva e remove title temporariamente para evitar choque com o balão nativo do navegador
          target.setAttribute('data-original-title', titleVal);
          target.removeAttribute('title');
        }

        this.show(target);
      },
      true
    );

    document.body.addEventListener(
      'mouseleave',
      (e) => {
        const target = e.target as HTMLElement;
        if (target === this.currentTarget) {
          this.hide();
        }
      },
      true
    );

    // Esconde ao rolar ou clicar
    window.addEventListener('scroll', () => this.hide(), true);
    document.addEventListener('click', () => this.hide(), true);
  }

  public show(element: HTMLElement): void {
    if (!this.tooltipEl) return;
    clearTimeout(this.hideTimeout);

    const desc =
      element.getAttribute('data-tooltip-desc') ||
      element.getAttribute('data-tooltip') ||
      element.getAttribute('data-original-title');

    if (!desc || !desc.trim()) return;

    this.currentTarget = element;

    const title = element.getAttribute('data-tooltip-title') || this.inferTitle(element);
    const shortcut = element.getAttribute('data-tooltip-shortcut') || this.inferShortcut(element, desc);

    const titleEl = this.tooltipEl.querySelector('.floating-tooltip-title') as HTMLElement;
    const shortcutEl = this.tooltipEl.querySelector('.floating-tooltip-shortcut') as HTMLElement;
    const descEl = this.tooltipEl.querySelector('.floating-tooltip-desc') as HTMLElement;

    if (titleEl) {
      if (title) {
        titleEl.textContent = title;
        titleEl.style.display = 'block';
      } else {
        titleEl.style.display = 'none';
      }
    }

    if (shortcutEl) {
      if (shortcut) {
        shortcutEl.textContent = shortcut;
        shortcutEl.style.display = 'inline-block';
      } else {
        shortcutEl.style.display = 'none';
      }
    }

    if (descEl) {
      descEl.textContent = desc;
    }

    this.tooltipEl.style.display = 'flex';
    this.tooltipEl.classList.remove('tooltip-visible');

    // Posiciona após calcular o tamanho do balão
    requestAnimationFrame(() => {
      this.positionTooltip(element);
      this.tooltipEl?.classList.add('tooltip-visible');
    });
  }

  public hide(): void {
    if (!this.tooltipEl || !this.currentTarget) return;

    // Restaura o title nativo para acessibilidade
    if (this.currentTarget.hasAttribute('data-original-title')) {
      const orig = this.currentTarget.getAttribute('data-original-title') || '';
      this.currentTarget.setAttribute('title', orig);
    }

    this.currentTarget = null;
    this.tooltipEl.classList.remove('tooltip-visible');
    this.hideTimeout = setTimeout(() => {
      if (this.tooltipEl && !this.currentTarget) {
        this.tooltipEl.style.display = 'none';
      }
    }, 150);
  }

  private positionTooltip(target: HTMLElement): void {
    if (!this.tooltipEl) return;

    const rect = target.getBoundingClientRect();
    const tooltipRect = this.tooltipEl.getBoundingClientRect();

    let top = 0;
    let left = 0;
    let placement = 'bottom';

    // Se estiver na barra de atividades vertical à esquerda, exibe à direita
    if (target.closest('.activity-bar-left') || rect.left < 80) {
      placement = 'right';
      left = rect.right + 10;
      top = rect.top + rect.height / 2 - tooltipRect.height / 2;
    } else if (rect.top - tooltipRect.height - 10 > 0) {
      // Exibe acima se houver espaço
      placement = 'top';
      top = rect.top - tooltipRect.height - 8;
      left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    } else {
      // Exibe abaixo
      placement = 'bottom';
      top = rect.bottom + 8;
      left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    }

    // Ajustes para não vazar da tela
    left = Math.max(12, Math.min(window.innerWidth - tooltipRect.width - 12, left));
    top = Math.max(8, Math.min(window.innerHeight - tooltipRect.height - 8, top));

    this.tooltipEl.style.top = `${Math.round(top)}px`;
    this.tooltipEl.style.left = `${Math.round(left)}px`;
    this.tooltipEl.dataset.placement = placement;
  }

  private inferTitle(element: HTMLElement): string {
    const text = element.textContent?.trim();
    if (text && text.length < 25 && !text.includes('\n')) {
      return text;
    }
    const id = element.id || '';
    if (id === 'btnClearCanvas') return 'Limpar Canvas';
    if (id === 'btnSaveFlow') return 'Salvar Fluxo';
    if (id === 'btnExportJson') return 'Exportar Automação';
    if (id === 'btnDebugFlow') return 'Depurar Fluxo';
    if (id === 'btnRunFlow') return 'Executar Fluxo';
    if (id === 'btnTabNewFlow') return 'Nova Aba de Início';
    if (id === 'btnActivityBlocks') return 'Biblioteca de Blocos';
    if (id === 'btnActivityColors') return 'Cores do Fluxo';
    if (id === 'btnActivityVariables') return 'Variáveis do Fluxo';
    if (id === 'btnActivityDebug') return 'Console & Depuração';
    if (id === 'btnActivityAnalyzer') return 'Analisador HTML';
    if (id === 'btnActivitySettings') return 'Configurações';
    if (id === 'btnExpandDebugModal') return 'Expandir Depuração';
    if (id === 'btnRunDebugActiveTab') return 'Depurar na Página Ativa';
    return '';
  }

  private inferShortcut(element: HTMLElement, desc: string): string {
    const id = element.id || '';
    if (id === 'btnSaveFlow' || desc.includes('Ctrl+S')) return 'Ctrl+S';
    if (id === 'btnCloseDebugModal' || id === 'btnCloseExpandedModal') return 'Esc';
    if (id === 'btnTabNewFlow') return '+';
    if (desc.includes('Delete')) return 'Del';
    return '';
  }
}

