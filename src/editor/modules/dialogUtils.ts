/**
 * Sistema Universal de Menus e Diálogos Visuais (Substitutos de alert, confirm e prompt)
 * Totalmente estilizável, acessível por teclado (Enter, Escape), sem bloquear a UI do navegador.
 */

export interface DialogOptions {
  title?: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  defaultValue?: string;
  placeholder?: string;
}

export class DialogMenu {
  /**
   * Exibe um menu de confirmação assíncrono (substituto de confirm)
   */
  public static confirm(options: DialogOptions | string): Promise<boolean> {
    const opts: DialogOptions = typeof options === 'string' ? { message: options } : options;
    return new Promise((resolve) => {
      this.closeExisting();

      const backdrop = document.createElement('div');
      backdrop.className = 'flow-dialog-backdrop';
      backdrop.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(4, 7, 15, 0.78);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2147483647;
        padding: 16px;
        animation: dialogFadeIn 0.15s ease-out;
        font-family: var(--font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
      `;

      const title = opts.title || 'Confirmação Necessária';
      const confirmText = opts.confirmText || 'Confirmar';
      const cancelText = opts.cancelText || 'Cancelar';
      const isDanger = opts.isDanger !== false;

      const card = document.createElement('div');
      card.className = 'flow-dialog-card';
      card.style.cssText = `
        background: #0f172a;
        border: 1px solid ${isDanger ? '#ef4444' : '#3b82f6'};
        border-radius: 12px;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.75), 0 0 25px ${isDanger ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'};
        max-width: 440px;
        width: 100%;
        overflow: hidden;
        animation: dialogScaleIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
      `;

      card.innerHTML = `
        <div style="padding: 14px 18px; border-bottom: 1px solid #1e293b; background: #131d35; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 16px;">${isDanger ? '⚠️' : '❓'}</span>
          <h3 style="margin: 0; font-size: 13px; font-weight: 700; color: #f8fafc; flex: 1;">${title}</h3>
        </div>
        <div style="padding: 18px; font-size: 12px; line-height: 1.5; color: #cbd5e1;">
          ${opts.message}
        </div>
        <div style="padding: 12px 18px; border-top: 1px solid #1e293b; background: #0b1120; display: flex; justify-content: flex-end; gap: 8px;">
          <button type="button" id="dialogBtnCancel" style="
            background: #1e293b; color: #cbd5e1; border: 1px solid #334155; border-radius: 6px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s;
          ">${cancelText}</button>
          <button type="button" id="dialogBtnConfirm" style="
            background: ${isDanger ? '#ef4444' : '#3b82f6'}; color: white; border: none; border-radius: 6px; padding: 7px 16px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s;
          ">${confirmText}</button>
        </div>
      `;

      backdrop.appendChild(card);
      document.body.appendChild(backdrop);

      const btnCancel = card.querySelector('#dialogBtnCancel') as HTMLButtonElement;
      const btnConfirm = card.querySelector('#dialogBtnConfirm') as HTMLButtonElement;

      const cleanup = (result: boolean) => {
        window.removeEventListener('keydown', onKey);
        backdrop.remove();
        resolve(result);
      };

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          cleanup(false);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          cleanup(true);
        }
      };

      btnCancel.addEventListener('click', () => cleanup(false));
      btnConfirm.addEventListener('click', () => cleanup(true));
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) cleanup(false);
      });

      window.addEventListener('keydown', onKey);
      btnConfirm.focus();
    });
  }

  /**
   * Exibe um menu de alerta assíncrono (substituto de alert)
   */
  public static alert(options: DialogOptions | string): Promise<void> {
    const opts: DialogOptions = typeof options === 'string' ? { message: options } : options;
    return new Promise((resolve) => {
      this.closeExisting();

      const backdrop = document.createElement('div');
      backdrop.className = 'flow-dialog-backdrop';
      backdrop.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(4, 7, 15, 0.78);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2147483647;
        padding: 16px;
        animation: dialogFadeIn 0.15s ease-out;
        font-family: var(--font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
      `;

      const type = opts.type || 'info';
      let icon = 'ℹ️';
      let borderColor = '#3b82f6';
      if (type === 'error') {
        icon = '❌';
        borderColor = '#ef4444';
      } else if (type === 'warning') {
        icon = '⚠️';
        borderColor = '#f59e0b';
      } else if (type === 'success') {
        icon = '✅';
        borderColor = '#10b981';
      }

      const title = opts.title || (type === 'error' ? 'Atenção / Erro' : type === 'warning' ? 'Aviso' : 'Informação');
      const confirmText = opts.confirmText || 'Entendido';

      const card = document.createElement('div');
      card.className = 'flow-dialog-card';
      card.style.cssText = `
        background: #0f172a;
        border: 1px solid ${borderColor};
        border-radius: 12px;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.75), 0 0 25px ${borderColor}33;
        max-width: 440px;
        width: 100%;
        overflow: hidden;
        animation: dialogScaleIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
      `;

      card.innerHTML = `
        <div style="padding: 14px 18px; border-bottom: 1px solid #1e293b; background: #131d35; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 16px;">${icon}</span>
          <h3 style="margin: 0; font-size: 13px; font-weight: 700; color: #f8fafc; flex: 1;">${title}</h3>
        </div>
        <div style="padding: 18px; font-size: 12px; line-height: 1.5; color: #cbd5e1; white-space: pre-line;">
          ${opts.message}
        </div>
        <div style="padding: 12px 18px; border-top: 1px solid #1e293b; background: #0b1120; display: flex; justify-content: flex-end;">
          <button type="button" id="dialogBtnOk" style="
            background: #3b82f6; color: white; border: none; border-radius: 6px; padding: 7px 20px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s;
          ">${confirmText}</button>
        </div>
      `;

      backdrop.appendChild(card);
      document.body.appendChild(backdrop);

      const btnOk = card.querySelector('#dialogBtnOk') as HTMLButtonElement;

      const cleanup = () => {
        window.removeEventListener('keydown', onKey);
        backdrop.remove();
        resolve();
      };

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key === 'Enter') {
          e.preventDefault();
          cleanup();
        }
      };

      btnOk.addEventListener('click', cleanup);
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) cleanup();
      });

      window.addEventListener('keydown', onKey);
      btnOk.focus();
    });
  }

  /**
   * Exibe um menu com campo de entrada de texto (substituto de prompt)
   */
  public static prompt(options: DialogOptions | string): Promise<string | null> {
    const opts: DialogOptions = typeof options === 'string' ? { message: options } : options;
    return new Promise((resolve) => {
      this.closeExisting();

      const backdrop = document.createElement('div');
      backdrop.className = 'flow-dialog-backdrop';
      backdrop.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(4, 7, 15, 0.78);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2147483647;
        padding: 16px;
        animation: dialogFadeIn 0.15s ease-out;
        font-family: var(--font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
      `;

      const title = opts.title || 'Entrada de Dados';
      const confirmText = opts.confirmText || 'Salvar';
      const cancelText = opts.cancelText || 'Cancelar';
      const defaultValue = opts.defaultValue || '';
      const placeholder = opts.placeholder || '';

      const card = document.createElement('div');
      card.className = 'flow-dialog-card';
      card.style.cssText = `
        background: #0f172a;
        border: 1px solid #3b82f6;
        border-radius: 12px;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.75), 0 0 25px rgba(59, 130, 246, 0.2);
        max-width: 440px;
        width: 100%;
        overflow: hidden;
        animation: dialogScaleIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
      `;

      card.innerHTML = `
        <div style="padding: 14px 18px; border-bottom: 1px solid #1e293b; background: #131d35; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 16px;">✏️</span>
          <h3 style="margin: 0; font-size: 13px; font-weight: 700; color: #f8fafc; flex: 1;">${title}</h3>
        </div>
        <div style="padding: 18px; font-size: 12px; line-height: 1.5; color: #cbd5e1; display: flex; flex-direction: column; gap: 10px;">
          <span>${opts.message}</span>
          <input type="text" id="dialogPromptInput" value="${defaultValue}" placeholder="${placeholder}" style="
            width: 100%; box-sizing: border-box; padding: 8px 12px; font-size: 12px; background: #090d16; color: #f8fafc; border: 1px solid #334155; border-radius: 6px; outline: none; transition: border-color 0.15s;
          " />
        </div>
        <div style="padding: 12px 18px; border-top: 1px solid #1e293b; background: #0b1120; display: flex; justify-content: flex-end; gap: 8px;">
          <button type="button" id="dialogBtnCancel" style="
            background: #1e293b; color: #cbd5e1; border: 1px solid #334155; border-radius: 6px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s;
          ">${cancelText}</button>
          <button type="button" id="dialogBtnConfirm" style="
            background: #3b82f6; color: white; border: none; border-radius: 6px; padding: 7px 16px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s;
          ">${confirmText}</button>
        </div>
      `;

      backdrop.appendChild(card);
      document.body.appendChild(backdrop);

      const input = card.querySelector('#dialogPromptInput') as HTMLInputElement;
      const btnCancel = card.querySelector('#dialogBtnCancel') as HTMLButtonElement;
      const btnConfirm = card.querySelector('#dialogBtnConfirm') as HTMLButtonElement;

      input.focus();
      input.select();

      const cleanup = (val: string | null) => {
        window.removeEventListener('keydown', onKey);
        backdrop.remove();
        resolve(val);
      };

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          cleanup(null);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          cleanup(input.value);
        }
      };

      btnCancel.addEventListener('click', () => cleanup(null));
      btnConfirm.addEventListener('click', () => cleanup(input.value));
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) cleanup(null);
      });

      window.addEventListener('keydown', onKey);
    });
  }

  public static closeExisting(): void {
    document.querySelectorAll('.flow-dialog-backdrop').forEach((el) => el.remove());
  }
}
