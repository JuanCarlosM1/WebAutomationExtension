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

  private static renderModal(): void {
    this.closeModal();

    const backdrop = document.createElement('div');
    backdrop.className = 'flow-modal-backdrop html-analyzer-modal';
    backdrop.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(10, 15, 26, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100000;
      padding: 16px;
      font-family: var(--font-sans, system-ui, sans-serif);
      animation: fadeIn 0.15s ease-out;
    `;

    backdrop.innerHTML = `
      <div class="analyzer-card" style="
        background: #0f172a;
        border: 1px solid #334155;
        border-radius: 12px;
        max-width: 840px;
        width: 100%;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8), 0 0 30px rgba(99,102,241,0.2);
        overflow: hidden;
      ">
        <!-- Header -->
        <div style="padding: 16px 20px; border-bottom: 1px solid #1e293b; display: flex; align-items: center; justify-content: space-between; background: #131d35;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(99, 102, 241, 0.2); color: #818cf8; display: flex; align-items: center; justify-content: center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #f8fafc;">Analisador de Elementos HTML</h3>
              <p style="margin: 2px 0 0; font-size: 11px; color: #94a3b8;">Capture e analise seletores limpos e simples de qualquer elemento web, pai e filhos</p>
            </div>
          </div>
          <button id="btnCloseAnalyzer" style="background: transparent; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; padding: 4px 8px; border-radius: 6px;">✕</button>
        </div>

        <!-- Body -->
        <div style="padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px;" id="analyzerBodyContent">
          <!-- Ação Principal: Iniciar Seleção na Página Ativa -->
          <div style="background: #172554; border: 1px solid #3b82f6; border-radius: 8px; padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
            <div>
              <h4 style="margin: 0; font-size: 13px; font-weight: 700; color: #93c5fd;">Capturar Elemento na Página Web</h4>
              <p style="margin: 4px 0 0; font-size: 11px; color: #cbd5e1;">Clique no botão ao lado para apontar e clicar em qualquer elemento da página aberta.</p>
            </div>
            <button type="button" id="btnPickFromWebPage" class="btn btn-primary" style="background: #3b82f6; border-color: #3b82f6; padding: 8px 16px; font-size: 12px; font-weight: 600; white-space: nowrap; display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>Ativar Mira na Página</span>
            </button>
          </div>

          <!-- Campo de Teste / Inserção Manual de Seletor ou Código HTML -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label style="font-size: 11px; font-weight: 700; color: #cbd5e1; text-transform: uppercase;">Ou digite/cole o Seletor CSS ou Código HTML para inspecionar:</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="analyzerManualInput" placeholder="ex: #meu-elemento, button.btn-primary, input[name='email']" style="flex: 1; padding: 8px 12px; font-size: 12px; background: #090d16; color: white; border: 1px solid #334155; border-radius: 6px;" />
              <button type="button" id="btnAnalyzeManual" class="btn btn-secondary" style="padding: 8px 16px; font-size: 12px; font-weight: 600; white-space: nowrap;">
                Analisar Seletor
              </button>
            </div>
          </div>

          <!-- Área de Resultados / Árvore de Hierarquia (Alvo, Pai e Filhos) -->
          <div id="analyzerResultsContainer" style="display: flex; flex-direction: column; gap: 12px;">
            <div style="background: #090d16; border: 1px dashed #334155; border-radius: 8px; padding: 24px; text-align: center; color: #64748b; font-size: 12px;">
              🔍 Nenhum elemento analisado ainda. Clique em <strong>"Ativar Mira na Página"</strong> ou digite um seletor acima.
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 12px 20px; border-top: 1px solid #1e293b; background: #131d35; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 11px; color: #64748b;">Dica: Seletores com ID (#id) ou atributos únicos são sempre priorizados para evitar fragilidade.</span>
          <button type="button" id="btnCloseAnalyzerBottom" class="btn btn-secondary" style="padding: 6px 16px; font-size: 12px;">Fechar</button>
        </div>
      </div>
    `;

    backdrop.querySelector('#btnCloseAnalyzer')?.addEventListener('click', () => this.closeModal());
    backdrop.querySelector('#btnCloseAnalyzerBottom')?.addEventListener('click', () => this.closeModal());

    backdrop.querySelector('#btnPickFromWebPage')?.addEventListener('click', () => {
      this.closeModal();
      this.startLivePicker();
    });

    backdrop.querySelector('#btnAnalyzeManual')?.addEventListener('click', () => {
      const input = (backdrop.querySelector('#analyzerManualInput') as HTMLInputElement)?.value.trim();
      if (!input) return;
      this.testAndShowLocalSelector(input);
    });

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.closeModal();
    });

    document.body.appendChild(backdrop);
    this.modalBackdrop = backdrop;
  }

  private static closeModal(): void {
    this.modalBackdrop?.remove();
    document.querySelectorAll('.html-analyzer-modal').forEach((el) => el.remove());
    this.modalBackdrop = undefined;
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
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      position: relative;
    `;

    const tagBadge = `&lt;<span style="color: #60a5fa; font-weight: bold;">${node.tagName.toLowerCase()}</span>&gt;`;
    const idSnippet = node.id ? `<span style="color: #f59e0b; font-family: monospace;">#${node.id}</span>` : '';
    const classSnippet = node.classes.length > 0 ? `<span style="color: #10b981; font-family: monospace;">.${node.classes.slice(0, 2).join('.')}</span>` : '';

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; background: ${borderColor}25; color: ${borderColor}; border: 1px solid ${borderColor}50; padding: 2px 6px; border-radius: 4px;">${type}</span>
          <span style="font-size: 12px; font-weight: 600; color: #f8fafc;">${title}</span>
          <span style="font-size: 11px; font-family: monospace; color: #94a3b8;">${tagBadge} ${idSnippet} ${classSnippet}</span>
        </div>
        <button type="button" class="btn-copy-selector btn btn-secondary" style="padding: 4px 10px; font-size: 11px; display: flex; align-items: center; gap: 4px; cursor: pointer;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span>Usar / Copiar</span>
        </button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px;">
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
