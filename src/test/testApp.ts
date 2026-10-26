/**
 * Script da Página de Testes & Debug da Extensão (test.html)
 * Permite ao desenvolvedor de automações testar todos os tipos de blocos
 * e funcionalidades do motor em um ambiente controlado e isolado.
 */

document.addEventListener('DOMContentLoaded', () => {
  const eventLogsContainer = document.getElementById('eventLogsContainer');
  const btnClearLogs = document.getElementById('btnClearTestLogs');
  const btnClearInputs = document.getElementById('btnClearInputs');
  const btnToggleBlankMode = document.getElementById('btnToggleBlankMode') as HTMLButtonElement;
  const btnCreateDelayedElement = document.getElementById('btnCreateDelayedElement');
  const testElementsContainer = document.getElementById('testElementsContainer');
  const blankModeWatermark = document.getElementById('blankModeWatermark');
  const dynamicElementSlot = document.getElementById('dynamicElementSlot');
  const btnOpenStudio = document.getElementById('btnOpenStudio');
  const clickFeedback = document.getElementById('clickFeedback');

  let isBlankMode = false;

  function logEvent(actionName: string, detail: string, type: 'info' | 'success' | 'warn' = 'info') {
    if (!eventLogsContainer) return;
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `test-log-entry ${type}`;
    entry.innerHTML = `<span class="time">[${time}]</span> <span class="action">${actionName}:</span> <span class="detail">${detail}</span>`;
    eventLogsContainer.appendChild(entry);
    eventLogsContainer.scrollTop = eventLogsContainer.scrollHeight;
  }

  // Monitorar inputs de formulário
  document.querySelectorAll('input, textarea, select').forEach((el) => {
    el.addEventListener('input', (e: any) => {
      const id = el.id || el.getAttribute('name') || el.tagName.toLowerCase();
      logEvent('INPUT', `#${id} alterado para "${e.target.value}"`, 'info');
    });

    el.addEventListener('change', (e: any) => {
      const id = el.id || el.getAttribute('name') || el.tagName.toLowerCase();
      const val = (el as HTMLInputElement).type === 'checkbox' ? (el as HTMLInputElement).checked : e.target.value;
      logEvent('CHANGE', `#${id} valor confirmado: "${val}"`, 'info');
    });

    el.addEventListener('focus', () => {
      const id = el.id || el.getAttribute('name') || el.tagName.toLowerCase();
      logEvent('FOCUS', `Elemento #${id} recebeu foco`, 'info');
    });
  });

  // Monitorar botões de teste
  const btnSimple = document.getElementById('btnTestSimple');
  btnSimple?.addEventListener('click', () => {
    logEvent('CLIQUE', 'Botão Simples (#btnTestSimple) acionado com sucesso!', 'success');
    if (clickFeedback) clickFeedback.textContent = 'Botão Simples clicado em ' + new Date().toLocaleTimeString();
  });

  const btnDouble = document.getElementById('btnTestDouble');
  btnDouble?.addEventListener('dblclick', () => {
    logEvent('DUPLO CLIQUE', 'Botão Duplo (#btnTestDouble) acionado com sucesso!', 'success');
    if (clickFeedback) clickFeedback.textContent = 'Duplo clique confirmado em ' + new Date().toLocaleTimeString();
  });

  const btnRight = document.getElementById('btnTestRight');
  btnRight?.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    logEvent('CLIQUE DIREITO', 'Botão Direito (#btnTestRight) acionado (contextmenu disparado)!', 'success');
    if (clickFeedback) clickFeedback.textContent = 'Clique direito confirmado em ' + new Date().toLocaleTimeString();
  });

  const btnSubmit = document.getElementById('btnTestSubmit');
  btnSubmit?.addEventListener('click', (e) => {
    e.preventDefault();
    logEvent('SUBMIT', 'Formulário de teste (#testForm) submetido!', 'success');
    if (clickFeedback) clickFeedback.textContent = 'Formulário submetido em ' + new Date().toLocaleTimeString();
  });

  // Criar elemento com delay de 3 segundos (para testar esperar elemento)
  btnCreateDelayedElement?.addEventListener('click', () => {
    if (!dynamicElementSlot) return;
    dynamicElementSlot.innerHTML = '<span style="color: #94a3b8; font-size: 11px;">Aguardando 3 segundos para criar o elemento...</span>';
    logEvent('AGENDADO', 'Elemento dinâmico (#dynamicTargetElement) será injetado em 3 segundos...', 'warn');

    setTimeout(() => {
      dynamicElementSlot.innerHTML = `
        <div id="dynamicTargetElement" class="dynamic-box" style="padding: 10px 14px; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 8px; color: #34d399; font-weight: 600; font-size: 12px; display: inline-flex; align-items: center; gap: 8px; animation: fadeIn 0.3s ease;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Elemento Criado Dinamicamente (#dynamicTargetElement)
        </div>
      `;
      logEvent('INJETADO', 'Elemento dinâmico (#dynamicTargetElement) apareceu no DOM!', 'success');
    }, 3000);
  });

  // Alternar Modo Totalmente em Branco / Modo Elementos de Teste
  btnToggleBlankMode?.addEventListener('click', () => {
    isBlankMode = !isBlankMode;
    if (testElementsContainer) testElementsContainer.style.display = isBlankMode ? 'none' : 'grid';
    if (blankModeWatermark) blankModeWatermark.style.display = isBlankMode ? 'flex' : 'none';

    btnToggleBlankMode.textContent = isBlankMode ? 'Exibir Elementos de Teste' : 'Modo Totalmente em Branco';
    logEvent('MODO', `Página alternada para: ${isBlankMode ? 'Totalmente em Branco' : 'Elementos de Teste'}`, 'info');
  });

  // Limpar formulário de teste
  btnClearInputs?.addEventListener('click', () => {
    document.querySelectorAll<HTMLInputElement>('#testForm input, #testForm textarea').forEach((input) => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      } else {
        input.value = '';
      }
    });
    logEvent('LIMPAR', 'Todos os campos de teste foram limpos.', 'info');
  });

  // Limpar logs
  btnClearLogs?.addEventListener('click', () => {
    if (eventLogsContainer) {
      eventLogsContainer.innerHTML = '<div class="test-log-entry info"><span class="time">[' + new Date().toLocaleTimeString() + ']</span> <span class="detail">Console de eventos DOM reiniciado.</span></div>';
    }
  });

  // Botão Abrir Estúdio
  btnOpenStudio?.addEventListener('click', () => {
    const editorUrl = chrome.runtime?.getURL ? chrome.runtime.getURL('editor.html') : 'editor.html';
    window.open(editorUrl, '_blank');
  });

  logEvent('INÍCIO', 'Página de testes da extensão carregada e pronta para automação.', 'success');
});
