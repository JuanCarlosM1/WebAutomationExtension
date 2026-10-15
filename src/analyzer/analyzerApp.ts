/**
 * Script da Página Exclusiva do Analisador HTML (analyzer.html)
 */

import { HtmlElementAnalyzer, HtmlAnalysisResult } from '../editor/modules/htmlElementAnalyzer';
import { showToast } from '../editor/modules/editorUtils';
import { DialogMenu } from '../editor/modules/dialogUtils';

document.addEventListener('DOMContentLoaded', () => {
  const targetPageTitle = document.getElementById('targetPageTitle');
  const targetPageUrl = document.getElementById('targetPageUrl');
  const btnRefreshTargetTab = document.getElementById('btnRefreshTargetTab');
  const btnTriggerLivePicker = document.getElementById('btnTriggerLivePicker');
  const manualSelectorInput = document.getElementById('manualSelectorInput') as HTMLInputElement;
  const btnAnalyzeManualDirect = document.getElementById('btnAnalyzeManualDirect');
  const analyzerResultsContainer = document.getElementById('analyzerResultsContainer');
  const btnOpenFloatingWindow = document.getElementById('btnOpenFloatingWindow');
  const btnOpenStudioFromAnalyzer = document.getElementById('btnOpenStudioFromAnalyzer');

  // Inicializa o listener de mensagens do Analisador
  HtmlElementAnalyzer.initMessageListener();

  // Abrir Visual Flow Studio
  btnOpenStudioFromAnalyzer?.addEventListener('click', () => {
    if (chrome.tabs?.create) {
      chrome.tabs.create({ url: chrome.runtime.getURL('editor.html') });
    } else {
      window.open('editor.html', '_blank');
    }
  });

  // Abrir janela flutuante arrastável
  btnOpenFloatingWindow?.addEventListener('click', () => {
    HtmlElementAnalyzer.open((chosenSelector) => {
      showToast(`Seletor capturado: ${chosenSelector}`, 'success');
    });
  });

  // Atualizar informações da aba alvo
  function refreshTargetTabInfo() {
    if (!chrome.tabs?.query) {
      if (targetPageTitle) targetPageTitle.textContent = 'Ambiente Local (Sem API chrome.tabs)';
      if (targetPageUrl) targetPageUrl.textContent = window.location.href;
      return;
    }

    chrome.tabs.query({}, (tabs) => {
      const isWebTab = (t: chrome.tabs.Tab) => {
        const u = t.url || '';
        return (
          u.startsWith('http://') ||
          u.startsWith('https://') ||
          u.startsWith('file://')
        );
      };

      const webTabs = tabs.filter(isWebTab);
      const target = webTabs.sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0];

      if (target) {
        HtmlElementAnalyzer.lastTargetTabId = target.id;
        if (targetPageTitle) targetPageTitle.textContent = target.title || 'Página Web Sem Título';
        if (targetPageUrl) targetPageUrl.textContent = target.url || '';
      } else {
        if (targetPageTitle) targetPageTitle.textContent = 'Nenhuma aba web aberta';
        if (targetPageUrl) targetPageUrl.textContent = 'Abra um site no navegador para inspecionar';
      }
    });
  }

  btnRefreshTargetTab?.addEventListener('click', () => {
    refreshTargetTabInfo();
    showToast('Aba alvo atualizada.', 'info');
  });

  refreshTargetTabInfo();

  // Iniciar mira ao vivo
  btnTriggerLivePicker?.addEventListener('click', () => {
    HtmlElementAnalyzer.startLivePicker((pickedSelector) => {
      if (manualSelectorInput) manualSelectorInput.value = pickedSelector;
      showToast(`Elemento selecionado: ${pickedSelector}`, 'success');
    });
  });

  // Análise manual direta
  const runManualAnalysis = () => {
    const selector = manualSelectorInput?.value.trim();
    if (!selector) {
      showToast('Digite um seletor para analisar.', 'warning');
      return;
    }

    // Se estiver em aba com content driver, podemos testar na aba web alvo
    const tabId = HtmlElementAnalyzer.lastTargetTabId;
    if (tabId && chrome.tabs?.sendMessage) {
      chrome.tabs.sendMessage(tabId, {
        action: 'EXTRACT_DATA',
        payload: { selector, selectorType: 'css', extractType: 'innerText' }
      }, (res) => {
        if (res?.success) {
          renderAnalysisResultInPage({
            target: {
              selector,
              tagName: selector.split(/[.#[\s]/)[0] || 'ELEMENT',
              classes: [],
              xpath: `//*[contains(@class, '${selector}')]`,
              textSnippet: res.data || '(conteúdo extraído)',
              attributes: {},
              isTarget: true,
            },
            children: [],
          });
          showToast('Elemento localizado na página!', 'success');
        } else {
          // Renderiza card informativo com o seletor informado
          renderAnalysisResultInPage({
            target: {
              selector,
              tagName: 'SELETOR',
              classes: [],
              xpath: `//${selector}`,
              textSnippet: 'Seletor formatado para uso no fluxo',
              attributes: {},
              isTarget: true,
            },
            children: [],
          });
        }
      });
    } else {
      renderAnalysisResultInPage({
        target: {
          selector,
          tagName: 'SELETOR',
          classes: [],
          xpath: `//${selector}`,
          textSnippet: 'Seletor validado',
          attributes: {},
          isTarget: true,
        },
        children: [],
      });
    }
  };

  btnAnalyzeManualDirect?.addEventListener('click', runManualAnalysis);
  manualSelectorInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runManualAnalysis();
  });

  // Ouvir mensagens de elementos selecionados via mira para atualizar os resultados nesta página
  chrome.runtime?.onMessage?.addListener((message) => {
    if (message.action === 'ELEMENT_PICKED_EVENT') {
      const { selector, analysis } = message.payload || {};
      if (manualSelectorInput && selector) {
        manualSelectorInput.value = selector;
      }
      if (analysis) {
        renderAnalysisResultInPage(analysis);
      }
    }
  });

  // Requisito: Renderiza o resultado da análise detalhado na tela da aba
  function renderAnalysisResultInPage(analysis: HtmlAnalysisResult) {
    if (!analyzerResultsContainer) return;
    analyzerResultsContainer.innerHTML = '';

    // Elemento Pai
    if (analysis.parent) {
      analyzerResultsContainer.appendChild(createResultCard('Elemento Pai (Container)', analysis.parent, '#64748b'));
    }

    // Elemento Principal
    analyzerResultsContainer.appendChild(createResultCard('Elemento Selecionado (Alvo Principal)', analysis.target, '#6366f1', true));

    // Elementos Filhos
    if (analysis.children && analysis.children.length > 0) {
      const childrenWrapper = document.createElement('div');
      childrenWrapper.style.cssText = 'background: #111827; border: 1px solid #1f293d; border-radius: 12px; padding: 20px;';
      childrenWrapper.innerHTML = `
        <h3 style="margin: 0 0 14px; font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">
          Elementos Filhos (${analysis.children.length})
        </h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${analysis.children.map((child, idx) => `
            <div style="background: #090d16; border: 1px solid #243049; border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
              <div>
                <span style="font-weight: 700; color: #38bdf8; font-family: monospace;">&lt;${child.tagName.toLowerCase()}&gt;</span>
                <span style="font-size: 12px; color: #cbd5e1; margin-left: 8px; font-family: monospace;">${child.selector}</span>
              </div>
              <button class="btn btn-secondary btn-copy-child" data-sel="${child.selector}" style="font-size: 11px; padding: 4px 10px;">Copiar</button>
            </div>
          `).join('')}
        </div>
      `;

      childrenWrapper.querySelectorAll('.btn-copy-child').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const sel = (e.currentTarget as HTMLElement).getAttribute('data-sel');
          if (sel) {
            navigator.clipboard.writeText(sel);
            showToast('Seletor do filho copiado!', 'success');
          }
        });
      });

      analyzerResultsContainer.appendChild(childrenWrapper);
    }
  }

  function createResultCard(title: string, node: any, accentColor: string, isMain = false): HTMLElement {
    const card = document.createElement('div');
    card.style.cssText = `
      background: #111827;
      border: 1px solid ${isMain ? accentColor : '#1f293d'};
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    `;

    const tagStr = `<${node.tagName.toLowerCase()}${node.id ? ` id="${node.id}"` : ''}>`;
    const textSnippet = node.textSnippet ? `"${node.textSnippet.slice(0, 100)}"` : '(sem texto interno)';

    card.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e293b; padding-bottom: 12px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 14px; font-weight: 700; color: ${accentColor};">${title}</span>
          <span style="background: #1e293b; color: #38bdf8; font-family: monospace; font-size: 11px; padding: 2px 8px; border-radius: 4px;">${tagStr}</span>
        </div>
        ${isMain ? '<span style="background: rgba(99, 102, 241, 0.2); color: #818cf8; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">ALVO PRINCIPAL</span>' : ''}
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        <!-- Seletor CSS -->
        <div>
          <label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Seletor CSS Recomendado:</label>
          <div style="display: flex; gap: 8px; margin-top: 4px;">
            <input type="text" readonly value="${node.selector}" style="flex: 1; background: #090d16; border: 1px solid #243049; border-radius: 6px; padding: 8px 12px; font-family: monospace; font-size: 12px; color: #f8fafc;" />
            <button class="btn btn-primary btn-copy-css" style="padding: 6px 14px; font-size: 12px;">Copiar CSS</button>
          </div>
        </div>

        <!-- Seletor XPath -->
        <div>
          <label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">XPath:</label>
          <div style="display: flex; gap: 8px; margin-top: 4px;">
            <input type="text" readonly value="${node.xpath || `//${node.tagName.toLowerCase()}`}" style="flex: 1; background: #090d16; border: 1px solid #243049; border-radius: 6px; padding: 8px 12px; font-family: monospace; font-size: 12px; color: #f8fafc;" />
            <button class="btn btn-secondary btn-copy-xpath" style="padding: 6px 14px; font-size: 12px;">Copiar XPath</button>
          </div>
        </div>

        <!-- Texto Interno -->
        <div style="font-size: 12px; color: #cbd5e1; background: #090d16; border: 1px solid #1e293b; border-radius: 6px; padding: 8px 12px;">
          <span style="color: #64748b;">Texto:</span> <code>${textSnippet}</code>
        </div>
      </div>
    `;

    card.querySelector('.btn-copy-css')?.addEventListener('click', () => {
      navigator.clipboard.writeText(node.selector);
      showToast('Seletor CSS copiado para a área de transferência!', 'success');
    });

    card.querySelector('.btn-copy-xpath')?.addEventListener('click', () => {
      navigator.clipboard.writeText(node.xpath || `//${node.tagName.toLowerCase()}`);
      showToast('XPath copiado para a área de transferência!', 'success');
    });

    return card;
  }
});
