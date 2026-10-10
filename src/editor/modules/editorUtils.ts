/**
 * Utilitários gerais do Editor: Notificações Toast, Modais de Alerta e Sanitização de Grafo
 */

import { WebAutomationGraph } from '../../../../BibliotecaDeDev/src/types/schema';

export function showToast(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info'): void {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.2s ease-out';
    setTimeout(() => toast.remove(), 200);
  }, 3500);
}

const DEFAULT_MODAL_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;

export function showModalDialog(title: string, message: string, icon: string = DEFAULT_MODAL_SVG): void {
  const existing = document.querySelector('.flow-modal-backdrop');
  existing?.remove();

  const backdrop = document.createElement('div');
  backdrop.className = 'flow-modal-backdrop';

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

  const closeBtn = backdrop.querySelector('.flow-modal-ok-btn');
  closeBtn?.addEventListener('click', () => backdrop.remove());
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.remove();
  });

  document.body.appendChild(backdrop);
}

/**
 * Remove propriedades obsoletas de ícones em todos os botões flutuantes do grafo
 */
export function sanitizeGraph(graph: WebAutomationGraph): WebAutomationGraph {
  const clone: WebAutomationGraph = JSON.parse(JSON.stringify(graph));
  clone.nodes.forEach((node) => {
    if (node.type === 'start' && node.data) {
      const data = node.data as any;
      const cleanFloating = (fb: any) => {
        if (!fb) return;
        const type = fb.iconType || 'emoji';
        if (type === 'emoji') {
          delete fb.svgIcon;
          delete fb.imageIcon;
        } else if (type === 'svg') {
          delete fb.buttonIcon;
          delete fb.imageIcon;
        } else if (type === 'image') {
          delete fb.buttonIcon;
          delete fb.svgIcon;
        }
      };

      if (data.floatingButton) cleanFloating(data.floatingButton);
      if (Array.isArray(data.triggers)) {
        data.triggers.forEach((trig: any) => {
          if (trig.floatingButton) cleanFloating(trig.floatingButton);
        });
      }
    }
  });
  return clone;
}
