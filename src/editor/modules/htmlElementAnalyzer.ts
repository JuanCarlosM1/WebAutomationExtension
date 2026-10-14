/**
 * Módulo Analisador e Seletor Visual de Elementos HTML
 * Permite inspecionar a página atual, selecionar elementos e gerar seletores CSS/XPath
 * simples, robustos e inteligentes, identificando o elemento selecionado, seus filhos e seu pai.
 */

export interface AnalyzedElementNode {
  tagName: string;
  id?: string;
  classes: string[];
  textSnippet?: string;
  selector: string;
  xpath: string;
  attributes: Record<string, string>;
  isTarget?: boolean;
}

export interface HtmlAnalysisResult {
  target: AnalyzedElementNode;
  parent?: AnalyzedElementNode;
  children: AnalyzedElementNode[];
}

export class HtmlElementAnalyzer {
  private static activeCallback?: (selector: string) => void;
  private static modalBackdrop?: HTMLElement;

  /**
   * Abre o Inspetor/Analisador de HTML.
   * Se for passado onSelectSelector, ao escolher um elemento, esse seletor é retornado no callback.
   */
  public static open(onSelectSelector?: (selector: string) => void): void {
    this.activeCallback = onSelectSelector;
    this.renderModal();
  }

  /**
   * Inicia o modo de seleção interativo na aba web ativa usando o content script
   */
  public static startLivePicker(onPicked?: (selector: string) => void): void {
    if (onPicked) {
      this.activeCallback = onPicked;
    }

    if (!chrome.tabs) {
      // Fallback em ambiente de dev/mock
      const mockSelector = prompt('Digite o seletor CSS do elemento ou use o Analisador:', '#main-content');
      if (mockSelector && this.activeCallback) {
        this.activeCallback(mockSelector);
      }
      return;
    }

    // Busca todas as abas para encontrar a última aba web real (ignora abas internas chrome://, edge:// ou a própria extensão)
    chrome.tabs.query({}, (tabs) => {
      const isWebTab = (t: chrome.tabs.Tab) => {
        const u = t.url || '';
        return (
          u.startsWith('http://') ||
          u.startsWith('https://') ||
          u.startsWith('file://')
        );
      };

      // 1. Tenta pegar a aba ativa da janela atual se for uma página web comum
      let targetTab = tabs.find((t) => t.active && isWebTab(t));

      // 2. Se a aba ativa for a própria extensão (editor.html), pega a aba web mais recente
      if (!targetTab) {
        targetTab = tabs
          .filter((t) => isWebTab(t))
          .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0];
      }

      if (!targetTab?.id) {
        alert(
          'Nenhuma aba de página web aberta (http/https/file) foi encontrada.\nPor favor, abra um site no navegador para selecionar elementos.'
        );
        return;
      }

      const targetTabId = targetTab.id;

      // Foca na aba alvo para que o usuário veja e selecione o elemento diretamente
      chrome.tabs.update(targetTabId, { active: true }, () => {
        // Envia mensagem para ativar o modo de mira no content script
        chrome.tabs.sendMessage(targetTabId, { action: 'START_ELEMENT_PICKER' }, (response) => {
          const err = chrome.runtime.lastError;
          if (err || !response?.success) {
            // Se o content driver ainda não foi injetado (por exemplo, página aberta antes da extensão ser instalada), injeta agora
            if (chrome.scripting?.executeScript) {
              chrome.scripting.executeScript(
                {
                  target: { tabId: targetTabId },
                  files: ['dist/contentDriver.js'],
                },
                () => {
                  if (chrome.runtime.lastError) {
                    // Ignora silenciosamente se o host não permitir injeção
                    return;
                  }
                  chrome.tabs.sendMessage(targetTabId, { action: 'START_ELEMENT_PICKER' }, () => {
                    // Limpa eventual lastError não verificado
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
  public static initMessageListener(): void {
    if (!chrome.runtime?.onMessage) return;

    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === 'ELEMENT_PICKED_EVENT') {
        const { selector, analysis } = message.payload || {};
        if (selector) {
          if (this.activeCallback) {
            this.activeCallback(selector);
          }
          // Abre ou atualiza o modal do analisador com os detalhes
          this.showAnalysisModal(analysis || { target: { selector, tagName: 'ELEMENT', classes: [] }, children: [] });
        }
      }
    });
  }

  private static panelPos?: { left: number; top: number };

  private static renderModal(): void {
    // Reaproveita o painel existente para não perder posição nem conteúdo
    if (this.modalBackdrop && document.body.contains(this.modalBackdrop)) return;
    document.querySelectorAll('.html-analyzer-modal').forEach((el) => el.remove());

    const panel = document.createElement('div');
    panel.className = 'html-analyzer-modal';
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
        <span style="font-size: 12px; font-weight: 700; color: #f8fafc;">🔍 Analisador HTML <span style="font-weight: 400; color: #64748b; font-size: 10px;">(CTRL + arrastar)</span></span>
        <button id="btnCloseAnalyzer" title="Fechar e desativar" style="background: transparent; border: none; color: #94a3b8; font-size: 15px; cursor: pointer; padding: 0 4px; border-radius: 4px;">✕</button>
      </div>
      <div id="analyzerBodyContent" style="padding: 8px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
        <button type="button" id="btnPickFromWebPage" class="btn btn-primary" style="background: #3b82f6; border-color: #3b82f6; padding: 6px 10px; font-size: 11px; font-weight: 600; cursor: pointer;">🎯 Ativar Mira na Página</button>
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

    panel.querySelector('#btnCloseAnalyzer')?.addEventListener('click', () => this.closeModal());

    panel.querySelector('#btnPickFromWebPage')?.addEventListener('click', () => {
      this.startLivePicker();
    });

    const runManual = () => {
      const input = (panel.querySelector('#analyzerManualInput') as HTMLInputElement)?.value.trim();
      if (!input) return;
      this.testAndShowLocalSelector(input);
    };
    panel.querySelector('#btnAnalyzeManual')?.addEventListener('click', runManual);
    panel.querySelector('#analyzerManualInput')?.addEventListener('keydown', (e: any) => {
      if (e.key === 'Enter') runManual();
    });

    // Arrastar com CTRL + clique em qualquer ponto do painel
    panel.addEventListener('mousedown', (e: MouseEvent) => {
      if (!e.ctrlKey || e.button !== 0) return;
      e.preventDefault();
      const rect = panel.getBoundingClientRect();
      const offX = e.clientX - rect.left;
      const offY = e.clientY - rect.top;
      const onMove = (me: MouseEvent) => {
        const left = Math.max(0, Math.min(window.innerWidth - rect.width, me.clientX - offX));
        const top = Math.max(0, Math.min(window.innerHeight - 40, me.clientY - offY));
        panel.style.left = `${left}px`;
        panel.style.top = `${top}px`;
        this.panelPos = { left, top };
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    });

    document.body.appendChild(panel);
    this.modalBackdrop = panel;
  }

  private static closeModal(): void {
    this.modalBackdrop?.remove();
    document.querySelectorAll('.html-analyzer-modal').forEach((el) => el.remove());
    this.modalBackdrop = undefined;
    // Desativa a mira na página web, se estiver ativa
    if (chrome.tabs?.query) {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((t) => {
          if (t.id && t.url && /^(https?|file):/.test(t.url)) {
            chrome.tabs.sendMessage(t.id, { action: 'STOP_ELEMENT_PICKER' }, () => void chrome.runtime.lastError);
          }
        });
      });
    }
  }

  /**
   * Exibe o modal com o resultado detalhado da análise (Pai, Alvo e Filhos)
   */
  public static showAnalysisModal(analysis: HtmlAnalysisResult): void {
    this.renderModal();
    const resultsContainer = document.getElementById('analyzerResultsContainer');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';

    // 1. Elemento Pai (se houver)
    if (analysis.parent) {
      resultsContainer.appendChild(this.createNodeCard('Elemento Pai (Container)', analysis.parent, '#64748b', 'pai'));
    }

    // 2. Elemento Alvo Principal Selecionado
    resultsContainer.appendChild(this.createNodeCard('Elemento Selecionado (Alvo Principal)', analysis.target, '#6366f1', 'alvo', true));

    // 3. Elementos Filhos (se houver)
    if (analysis.children && analysis.children.length > 0) {
      const childrenSection = document.createElement('div');
      childrenSection.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';
      childrenSection.innerHTML = `<label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Elementos Filhos (${analysis.children.length}):</label>`;

      analysis.children.slice(0, 6).forEach((child, idx) => {
        childrenSection.appendChild(this.createNodeCard(`Filho #${idx + 1} &lt;${child.tagName.toLowerCase()}&gt;`, child, '#06b6d4', 'filho'));
      });

      resultsContainer.appendChild(childrenSection);
    }
  }

  private static createNodeCard(
    title: string,
    node: AnalyzedElementNode,
    borderColor: string,
    type: 'pai' | 'alvo' | 'filho',
    isPrimary = false
  ): HTMLElement {
    const card = document.createElement('div');
    card.style.cssText = `
      background: ${isPrimary ? '#111c38' : '#090d16'};
      border: 1px solid ${borderColor};
      border-radius: 8px;
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      position: relative;
    `;

    const tagBadge = `&lt;<span style="color: #60a5fa; font-weight: bold;">${node.tagName.toLowerCase()}</span>&gt;`;
    const idSnippet = node.id ? `<span style="color: #f59e0b; font-family: monospace;">#${node.id}</span>` : '';
    const classSnippet = node.classes.length > 0 ? `<span style="color: #10b981; font-family: monospace;">.${node.classes.slice(0, 2).join('.')}</span>` : '';

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
          <code style="font-size: 11px; color: #38bdf8; font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${node.selector || 'tag'}</code>
        </div>
        <div style="display: flex; flex-direction: column; gap: 2px; overflow: hidden;">
          <span style="font-size: 10px; color: #94a3b8; font-weight: 700;">XPATH:</span>
          <code style="font-size: 11px; color: #fbbf24; font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${node.xpath || '//tag'}</code>
        </div>
      </div>
    `;

    const copyBtn = card.querySelector('.btn-copy-selector') as HTMLElement;
    copyBtn?.addEventListener('click', () => {
      const chosenSelector = node.selector;
      if (this.activeCallback) {
        this.activeCallback(chosenSelector);
      }
      navigator.clipboard?.writeText(chosenSelector);
      copyBtn.innerHTML = '<span>✓ Copiado!</span>';
      setTimeout(() => {
        copyBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span>Usar / Copiar</span>
        `;
      }, 1500);
    });

    return card;
  }

  private static testAndShowLocalSelector(rawInput: string): void {
    // Se for um seletor simples, cria o resultado
    const tagName = rawInput.startsWith('#') ? 'DIV' : rawInput.split(/[\.#\[]/)[0]?.toUpperCase() || 'ELEMENT';
    const hasId = rawInput.includes('#');
    const idVal = hasId ? rawInput.split('#')[1]?.split(/[\.\[\s]/)[0] : undefined;

    const analysis: HtmlAnalysisResult = {
      target: {
        tagName,
        id: idVal,
        classes: rawInput.includes('.') ? rawInput.split('.').slice(1).map(c => c.split(/[\#\[\s]/)[0]) : [],
        selector: rawInput,
        xpath: idVal ? `//*[@id="${idVal}"]` : `//${tagName.toLowerCase()}`,
        attributes: {},
      },
      children: [],
    };

    this.showAnalysisModal(analysis);
  }
}
