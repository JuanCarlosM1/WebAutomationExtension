/**
 * Modal de Configurações do Visual Flow & Layout dos Botões Flutuantes
 * Permite ajustar a direção de empilhamento (vertical/horizontal), limites de linhas e colunas, e gap entre botões.
 */

import { FloatingContainerLayoutConfig } from '../../../../BibliotecaDeDev/src/types/schema';

export class FlowSettingsModal {
  public static open(onSaveCallback?: (settings: FloatingContainerLayoutConfig) => void): void {
    const existing = document.querySelector('.flow-settings-modal-backdrop');
    existing?.remove();

    chrome.storage.local.get('floating_buttons_layout_settings', (stored) => {
      const currentConfig: FloatingContainerLayoutConfig = stored.floating_buttons_layout_settings || {
        stackDirection: 'vertical',
        maxColumns: 3,
        maxRows: 5,
        gap: 10,
      };

      const backdrop = document.createElement('div');
      backdrop.className = 'flow-modal-backdrop flow-settings-modal-backdrop';
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(8, 12, 20, 0.8);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100000;
        padding: 16px;
        font-family: var(--font-sans, system-ui, sans-serif);
        animation: fadeIn 0.15s ease-out;
      `;

      let stackDirection = currentConfig.stackDirection || 'vertical';
      let maxColumns = currentConfig.maxColumns ?? 3;
      let maxRows = currentConfig.maxRows ?? 5;
      let gap = currentConfig.gap ?? 10;

      const render = () => {
        backdrop.innerHTML = `
          <div class="flow-settings-card" style="
            background: #0f172a;
            border: 1px solid #3b82f6;
            border-radius: 14px;
            max-width: 540px;
            width: 100%;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 25px rgba(59, 130, 246, 0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
          ">
            <!-- Header -->
            <div style="padding: 16px 20px; border-bottom: 1px solid #1e293b; display: flex; align-items: center; justify-content: space-between; background: #131d35;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(59, 130, 246, 0.2); color: #60a5fa; display: flex; align-items: center; justify-content: center; font-size: 16px;">
                  ⚙️
                </div>
                <div>
                  <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #f8fafc;">Configurações do Visual Flow</h3>
                  <p style="margin: 2px 0 0; font-size: 12px; color: #94a3b8;">Comportamento e empilhamento dos botões flutuantes</p>
                </div>
              </div>
              <button id="btnSettingsCloseX" style="background: transparent; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; padding: 4px 8px; border-radius: 6px;">✕</button>
            </div>

            <!-- Body -->
            <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
              <!-- Seção Botões Flutuantes Multi-Execução -->
              <div style="background: #090d16; border: 1px solid #1e293b; border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-size: 14px;">🗂️</span>
                  <span style="font-size: 13px; font-weight: 700; color: #e2e8f0;">Container de Botões Flutuantes (Triggers)</span>
                </div>
                <p style="font-size: 12px; color: #94a3b8; line-height: 1.4; margin: 0;">
                  Quando múltiplas automações forem injetadas na mesma página web, seus botões flutuantes serão agrupados neste container para evitar sobreposições desagradáveis.
                </p>

                <!-- Direção de Empilhamento -->
                <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 4px;">
                  <label style="font-size: 11px; font-weight: 700; color: #cbd5e1; text-transform: uppercase;">Direção do Empilhamento</label>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <button type="button" id="btnDirVertical" style="
                      padding: 10px;
                      background: ${stackDirection === 'vertical' ? '#1e293b' : '#0b0f19'};
                      border: 1px solid ${stackDirection === 'vertical' ? '#3b82f6' : '#1e293b'};
                      border-radius: 8px;
                      color: ${stackDirection === 'vertical' ? '#ffffff' : '#94a3b8'};
                      cursor: pointer;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      gap: 4px;
                      transition: all 0.15s ease;
                    ">
                      <span style="font-size: 16px;">⬇️</span>
                      <span style="font-size: 12px; font-weight: 600;">Vertical (Coluna)</span>
                      <span style="font-size: 10px; color: #64748b;">Empilha um abaixo do outro</span>
                    </button>
                    <button type="button" id="btnDirHorizontal" style="
                      padding: 10px;
                      background: ${stackDirection === 'horizontal' ? '#1e293b' : '#0b0f19'};
                      border: 1px solid ${stackDirection === 'horizontal' ? '#3b82f6' : '#1e293b'};
                      border-radius: 8px;
                      color: ${stackDirection === 'horizontal' ? '#ffffff' : '#94a3b8'};
                      cursor: pointer;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      gap: 4px;
                      transition: all 0.15s ease;
                    ">
                      <span style="font-size: 16px;">➡️</span>
                      <span style="font-size: 12px; font-weight: 600;">Horizontal (Linha)</span>
                      <span style="font-size: 10px; color: #64748b;">Empilha lado a lado</span>
                    </button>
                  </div>
                </div>

                <!-- Limites de Linhas e Colunas -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 4px;">
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-size: 11px; font-weight: 700; color: #cbd5e1;">Limite de Colunas (Max):</label>
                    <input type="number" id="inputMaxColumns" min="1" max="10" value="${maxColumns}" style="
                      background: #172033;
                      color: white;
                      border: 1px solid #243049;
                      border-radius: 6px;
                      padding: 8px 10px;
                      font-size: 12px;
                    " />
                    <span style="font-size: 10px; color: #64748b;">Quebra após atingir o limite</span>
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-size: 11px; font-weight: 700; color: #cbd5e1;">Limite de Linhas (Max):</label>
                    <input type="number" id="inputMaxRows" min="1" max="20" value="${maxRows}" style="
                      background: #172033;
                      color: white;
                      border: 1px solid #243049;
                      border-radius: 6px;
                      padding: 8px 10px;
                      font-size: 12px;
                    " />
                    <span style="font-size: 10px; color: #64748b;">Quebra verticalmente</span>
                  </div>
                </div>

                <!-- Espaçamento (Gap) -->
                <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <label style="font-size: 11px; font-weight: 700; color: #cbd5e1;">Espaçamento Entre Botões (Gap):</label>
                    <span id="labelGapValue" style="font-size: 11px; font-weight: bold; color: #60a5fa;">${gap}px</span>
                  </div>
                  <input type="range" id="rangeGap" min="4" max="32" value="${gap}" style="accent-color: #3b82f6;" />
                </div>

                <!-- Prévia dinâmica da pilha -->
                <div style="
                  background: #020617;
                  border: 1px dashed #334155;
                  border-radius: 8px;
                  padding: 12px;
                  display: flex;
                  flex-direction: column;
                  gap: 8px;
                  align-items: center;
                  justify-content: center;
                  min-height: 85px;
                ">
                  <span style="font-size: 10px; color: #64748b; font-family: monospace;">Pré-visualização do Container:</span>
                  <div id="settingsPreviewContainer" style="
                    display: flex;
                    flex-direction: ${stackDirection === 'vertical' ? 'column' : 'row'};
                    flex-wrap: wrap;
                    gap: ${gap}px;
                    align-items: center;
                    justify-content: center;
                    max-width: ${stackDirection === 'horizontal' ? `${maxColumns * 100}px` : '100%'};
                  ">
                    <div style="background: #4f46e5; color: white; padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: 600;">⚡ Fluxo A</div>
                    <div style="background: #059669; color: white; padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: 600;">🚀 Fluxo B</div>
                    <div style="background: #d97706; color: white; padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: 600;">⚙️ Fluxo C</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="padding: 14px 20px; border-top: 1px solid #1e293b; background: #131d35; display: flex; align-items: center; justify-content: flex-end; gap: 10px;">
              <button type="button" id="btnSettingsCancel" class="btn btn-secondary" style="padding: 7px 16px; font-size: 12px;">
                Cancelar
              </button>
              <button type="button" id="btnSettingsSave" class="btn btn-primary" style="padding: 7px 20px; font-size: 12px; background: #3b82f6; border-color: #3b82f6;">
                Salvar Configurações
              </button>
            </div>
          </div>
        `;

        // Listeners dos botões de direção
        backdrop.querySelector('#btnDirVertical')?.addEventListener('click', () => {
          stackDirection = 'vertical';
          render();
        });
        backdrop.querySelector('#btnDirHorizontal')?.addEventListener('click', () => {
          stackDirection = 'horizontal';
          render();
        });

        // Input maxColumns
        const inputCols = backdrop.querySelector('#inputMaxColumns') as HTMLInputElement;
        inputCols?.addEventListener('input', (e: any) => {
          maxColumns = Math.max(1, Number(e.target.value) || 1);
          updatePreview();
        });

        // Input maxRows
        const inputRw = backdrop.querySelector('#inputMaxRows') as HTMLInputElement;
        inputRw?.addEventListener('input', (e: any) => {
          maxRows = Math.max(1, Number(e.target.value) || 1);
          updatePreview();
        });

        // Range Gap
        const rangeG = backdrop.querySelector('#rangeGap') as HTMLInputElement;
        const labelG = backdrop.querySelector('#labelGapValue') as HTMLElement;
        rangeG?.addEventListener('input', (e: any) => {
          gap = Number(e.target.value);
          if (labelG) labelG.textContent = `${gap}px`;
          updatePreview();
        });

        const updatePreview = () => {
          const preview = backdrop.querySelector('#settingsPreviewContainer') as HTMLElement;
          if (preview) {
            preview.style.flexDirection = stackDirection === 'vertical' ? 'column' : 'row';
            preview.style.gap = `${gap}px`;
            preview.style.maxWidth = stackDirection === 'horizontal' ? `${maxColumns * 100}px` : '100%';
          }
        };

        // Cancelar / Fechar
        const closeDialog = () => backdrop.remove();
        backdrop.querySelector('#btnSettingsCloseX')?.addEventListener('click', closeDialog);
        backdrop.querySelector('#btnSettingsCancel')?.addEventListener('click', closeDialog);

        // Salvar
        backdrop.querySelector('#btnSettingsSave')?.addEventListener('click', () => {
          const newSettings: FloatingContainerLayoutConfig = {
            stackDirection,
            maxColumns,
            maxRows,
            gap,
          };
          chrome.storage.local.set({ floating_buttons_layout_settings: newSettings }, () => {
            if (chrome.runtime?.sendMessage) {
              chrome.runtime.sendMessage({ action: 'SYNC_TRIGGERS' }).catch(() => {});
            }
            onSaveCallback?.(newSettings);
            closeDialog();
          });
        });
      };

      render();

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.remove();
      });

      document.body.appendChild(backdrop);
    });
  }
}
