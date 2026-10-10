/**
 * Gerenciador de paleta e seletores de cores com espectro RGB
 */
import { WebAutomationGraph } from '../../../../BibliotecaDeDev/src/types/schema';

export class ColorPickerManager {
  constructor(
    private getGraph: () => WebAutomationGraph,
    private showToast: (msg: string, type: 'info' | 'success' | 'error' | 'warning') => void,
    private onPaletteChanged?: () => void
  ) {}

  public getFlowColorPalette(): string[] {
    const graph = this.getGraph();
    if (!Array.isArray(graph.colorPalette)) {
      graph.colorPalette = [
        '#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'
      ];
    }
    return graph.colorPalette;
  }

  public openFlowPaletteModal(): void {
    const existing = document.querySelector('.flow-palette-modal-backdrop');
    existing?.remove();

    const palette = this.getFlowColorPalette();
    const backdrop = document.createElement('div');
    backdrop.className = 'flow-modal-backdrop flow-palette-modal-backdrop';

    const renderPaletteModalContent = () => {
      backdrop.innerHTML = `
        <div class="flow-modal-card" style="max-width: 480px; width: 100%;">
          <div class="flow-modal-header">
            <div class="flow-modal-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
            </div>
            <div class="flow-modal-title">Grupo de Cores do Fluxo</div>
          </div>
          <div class="flow-modal-body" style="display: flex; flex-direction: column; gap: 12px;">
            <p style="font-size: 12px; color: #94a3b8; line-height: 1.4;">
              Defina as cores personalizadas deste fluxo. Todas as cores adicionadas aqui ficam acessíveis instantaneamente em qualquer seletor de cor no editor.
            </p>
            <div class="custom-palette-list" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
              ${palette.map((color, idx) => `
                <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 6px; padding: 6px; display: flex; flex-direction: column; gap: 4px; align-items: center; position: relative;">
                  <button type="button" class="del-palette-color-btn" data-idx="${idx}" title="Remover" style="position: absolute; top: 2px; right: 4px; background: transparent; border: none; color: #ef4444; font-size: 13px; cursor: pointer; line-height: 1;">&times;</button>
                  <div style="width: 100%; height: 24px; background: ${color}; border-radius: 4px; border: 1px solid #00000030;"></div>
                  <span style="font-size: 10px; font-family: monospace; color: #cbd5e1;">${color}</span>
                </div>
              `).join('')}
            </div>

            <div style="display: flex; gap: 8px; align-items: center; padding-top: 8px; border-top: 1px solid #1e293b;">
              <input type="color" id="newPaletteColorPicker" value="#10b981" style="width: 32px; height: 30px; border: 1px solid #334155; border-radius: 4px; background: transparent; cursor: pointer;" />
              <input type="text" id="newPaletteColorInput" value="#10b981" placeholder="#10b981" style="flex: 1; padding: 6px 8px; font-size: 12px; font-family: monospace; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;" />
              <button type="button" id="btnAddColorToFlowPalette" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px; white-space: nowrap;">+ Adicionar Cor</button>
            </div>
          </div>
          <div class="flow-modal-footer">
            <button class="btn btn-primary flow-palette-close-btn">Salvar & Concluir</button>
          </div>
        </div>
      `;

      const pickerEl = backdrop.querySelector('#newPaletteColorPicker') as HTMLInputElement;
      const inputEl = backdrop.querySelector('#newPaletteColorInput') as HTMLInputElement;
      const addBtn = backdrop.querySelector('#btnAddColorToFlowPalette');

      pickerEl?.addEventListener('input', (e: any) => inputEl.value = e.target.value);
      inputEl?.addEventListener('input', (e: any) => {
        if (e.target.value.startsWith('#') && e.target.value.length === 7) {
          pickerEl.value = e.target.value;
        }
      });

      addBtn?.addEventListener('click', () => {
        const val = inputEl.value.trim();
        if (val) {
          if (!palette.includes(val)) {
            palette.push(val);
            this.getGraph().colorPalette = palette;
            renderPaletteModalContent();
            this.onPaletteChanged?.();
          } else {
            this.showToast('Esta cor já existe na paleta do fluxo.', 'info');
          }
        }
      });

      backdrop.querySelectorAll('.del-palette-color-btn').forEach((btn: any) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.idx);
          palette.splice(idx, 1);
          this.getGraph().colorPalette = palette;
          renderPaletteModalContent();
          this.onPaletteChanged?.();
        });
      });

      backdrop.querySelector('.flow-palette-close-btn')?.addEventListener('click', () => backdrop.remove());
    };

    renderPaletteModalContent();
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.remove();
    });
    document.body.appendChild(backdrop);
  }

  public createPaintColorPicker(
    container: HTMLElement,
    labelText: string,
    initialColor: string,
    onChange: (col: string) => void
  ): void {
    let currentColor = initialColor || '#6366f1';

    const group = document.createElement('div');
    group.className = 'form-group paint-color-picker-group';
    group.style.cssText = 'display: flex; flex-direction: column; gap: 4px; margin-bottom: 6px;';

    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
    header.innerHTML = `
      <label style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">${labelText}</label>
    `;
    group.appendChild(header);

    const displayBar = document.createElement('div');
    displayBar.style.cssText = 'display: flex; align-items: center; gap: 8px; background: #0b0f19; border: 1px solid #1e293b; border-radius: 6px; padding: 6px 8px;';

    const swatchCurrent = document.createElement('div');
    swatchCurrent.style.cssText = `
      width: 28px;
      height: 28px;
      border-radius: 4px;
      background: ${currentColor || '#6366f1'};
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
      flex-shrink: 0;
    `;

    const infoDiv = document.createElement('div');
    infoDiv.style.cssText = 'display: flex; flex-direction: column; flex: 1;';
    infoDiv.innerHTML = `
      <span style="font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 600;">Cor Atual</span>
      <span class="current-hex-label" style="font-size: 12px; font-family: monospace; color: #f1f5f9; font-weight: 600;">${currentColor || '#6366f1'}</span>
    `;

    const btnMoreColors = document.createElement('button');
    btnMoreColors.type = 'button';
    btnMoreColors.className = 'btn-xs';
    btnMoreColors.style.cssText = 'padding: 5px 10px; font-size: 11px; font-weight: 600; background: #1e293b; border: 1px solid #334155; color: #93c5fd; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 4px; white-space: nowrap;';
      btnMoreColors.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
        Mais Cores...
      `;

    displayBar.appendChild(swatchCurrent);
    displayBar.appendChild(infoDiv);
    displayBar.appendChild(btnMoreColors);
    group.appendChild(displayBar);

    const popoverPanel = document.createElement('div');
    popoverPanel.style.cssText = 'display: none; position: relative; z-index: 9999; background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 10px; flex-direction: column; gap: 8px; margin-top: 4px; box-shadow: 0 12px 32px rgba(0,0,0,0.7);';

    const mainBaseColors = [
      '#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4',
      '#ffffff', '#c3c3c3', '#b97a57', '#ffaec9', '#ffc90e', '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7'
    ];

    const modernColors = [
      '#6366f1', '#4f46e5', '#3b82f6', '#0ea5e9', '#06b6d4', '#10b981', '#14b8a6', '#84cc16', '#eab308', '#f59e0b',
      '#ef4444', '#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#64748b', '#475569', '#334155', '#1e293b'
    ];

    const applySelectedColor = (newCol: string) => {
      currentColor = newCol;
      swatchCurrent.style.background = newCol;
      const hexLbl = infoDiv.querySelector('.current-hex-label');
      if (hexLbl) hexLbl.textContent = newCol;
      hexInp.value = newCol;
      onChange(newCol);
    };

    const buildGrid = (title: string, colors: string[], canAddCustom: boolean = false) => {
      const sec = document.createElement('div');
      sec.style.cssText = 'display: flex; flex-direction: column; gap: 4px;';

      const secHeader = document.createElement('div');
      secHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
      secHeader.innerHTML = `<span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">${title}</span>`;

      if (canAddCustom) {
        const btnManage = document.createElement('button');
        btnManage.type = 'button';
        btnManage.style.cssText = 'background: #1e293b; border: 1px solid #334155; color: #93c5fd; font-size: 10px; font-weight: 600; cursor: pointer; padding: 2px 7px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; transition: background 0.15s;';
        btnManage.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> <span>Editar</span>`;
        btnManage.addEventListener('mouseenter', () => btnManage.style.background = '#334155');
        btnManage.addEventListener('mouseleave', () => btnManage.style.background = '#1e293b');
        btnManage.addEventListener('click', (e) => {
          e.preventDefault();
          this.openFlowPaletteModal();
        });
        secHeader.appendChild(btnManage);
      }
      sec.appendChild(secHeader);

      const grid = document.createElement('div');
      grid.style.cssText = 'display: grid; grid-template-columns: repeat(10, 1fr); gap: 3px;';

      colors.forEach((c) => {
        const sw = document.createElement('button');
        sw.type = 'button';
        sw.title = c;
        sw.style.cssText = `
          width: 100%;
          height: 18px;
          background: ${c};
          border: 1px solid ${c.toLowerCase() === '#ffffff' ? '#475569' : '#00000040'};
          border-radius: 2px;
          cursor: pointer;
          padding: 0;
          transition: transform 0.1s;
        `;
        sw.addEventListener('mouseenter', () => sw.style.transform = 'scale(1.2)');
        sw.addEventListener('mouseleave', () => sw.style.transform = 'scale(1)');
        sw.addEventListener('click', (e) => {
          e.preventDefault();
          applySelectedColor(c);
        });
        grid.appendChild(sw);
      });

      sec.appendChild(grid);
      return sec;
    };

    const customSpectrumCard = document.createElement('div');
    customSpectrumCard.style.cssText = `
      display: none;
      flex-direction: column;
      gap: 10px;
      background: #0b0f19;
      border: 1.5px solid #3b82f6;
      border-radius: 12px;
      padding: 12px;
      margin-top: 8px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.75), 0 0 15px rgba(99, 102, 241, 0.2);
      width: 100%;
      box-sizing: border-box;
      position: relative;
    `;

    const spectrumCanvas = document.createElement('canvas');
    spectrumCanvas.width = 240;
    spectrumCanvas.height = 120;
    spectrumCanvas.style.cssText = 'width: 100%; height: 120px; border-radius: 8px; cursor: crosshair; display: block; border: 1px solid #1e293b;';

    const hueSlider = document.createElement('input');
    hueSlider.type = 'range';
    hueSlider.min = '0';
    hueSlider.max = '360';
    hueSlider.value = '239';
    hueSlider.style.cssText = `
      width: 100%;
      height: 12px;
      border-radius: 6px;
      outline: none;
      -webkit-appearance: none;
      background: linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);
      cursor: pointer;
      margin: 4px 0;
    `;

    let currentHue = 239;
    const drawSpectrum = (hue: number) => {
      const ctx = spectrumCanvas.getContext('2d');
      if (!ctx) return;
      const w = spectrumCanvas.width;
      const h = spectrumCanvas.height;

      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillRect(0, 0, w, h);

      const whiteGrad = ctx.createLinearGradient(0, 0, w, 0);
      whiteGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      whiteGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = whiteGrad;
      ctx.fillRect(0, 0, w, h);

      const blackGrad = ctx.createLinearGradient(0, 0, 0, h);
      blackGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      blackGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = blackGrad;
      ctx.fillRect(0, 0, w, h);
    };

    const pickColorFromCanvas = (e: MouseEvent) => {
      const rect = spectrumCanvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(spectrumCanvas.width - 1, ((e.clientX - rect.left) / rect.width) * spectrumCanvas.width));
      const y = Math.max(0, Math.min(spectrumCanvas.height - 1, ((e.clientY - rect.top) / rect.height) * spectrumCanvas.height));
      const ctx = spectrumCanvas.getContext('2d');
      if (!ctx) return;
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
      applySelectedColor(hex);
    };

    let isCanvasDragging = false;
    spectrumCanvas.addEventListener('mousedown', (e) => {
      isCanvasDragging = true;
      pickColorFromCanvas(e);
    });
    window.addEventListener('mousemove', (e) => {
      if (isCanvasDragging) pickColorFromCanvas(e);
    });
    window.addEventListener('mouseup', () => {
      isCanvasDragging = false;
    });

    hueSlider.addEventListener('input', () => {
      currentHue = Number(hueSlider.value);
      drawSpectrum(currentHue);
    });

    const nativeColorBtn = document.createElement('button');
    nativeColorBtn.type = 'button';
    nativeColorBtn.title = 'Abrir / Fechar espectro de cores RGB';
    nativeColorBtn.style.cssText = 'width: 34px; height: 32px; flex-shrink: 0; border: 1.5px solid #475569; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; background: conic-gradient(red, yellow, lime, cyan, blue, magenta, red); box-shadow: 0 1px 4px rgba(0,0,0,0.4); padding: 0; outline: none; transition: all 0.15s;';
    nativeColorBtn.addEventListener('mouseenter', () => nativeColorBtn.style.transform = 'scale(1.05)');
    nativeColorBtn.addEventListener('mouseleave', () => nativeColorBtn.style.transform = 'scale(1)');

    nativeColorBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isVisible = customSpectrumCard.style.display === 'flex';
      if (!isVisible) {
        customSpectrumCard.style.display = 'flex';
        nativeColorBtn.style.borderColor = '#6366f1';
        drawSpectrum(currentHue);
      } else {
        customSpectrumCard.style.display = 'none';
        nativeColorBtn.style.borderColor = '#475569';
      }
    });

    const hexInp = document.createElement('input');
    hexInp.type = 'text';
    hexInp.value = currentColor || '#6366f1';
    hexInp.placeholder = '#ffffff';
    hexInp.style.cssText = 'width: 72px; min-width: 0; flex: 1 1 auto; padding: 5px 6px; font-size: 11px; font-family: monospace; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px; box-sizing: border-box;';

    const btnSaveToFlowPalette = document.createElement('button');
    btnSaveToFlowPalette.type = 'button';
    btnSaveToFlowPalette.title = 'Salvar esta cor no grupo de cores do fluxo';
    btnSaveToFlowPalette.style.cssText = 'flex-shrink: 0; padding: 5px 8px; font-size: 10px; font-weight: 600; background: #3b82f620; border: 1px solid #3b82f660; color: #93c5fd; border-radius: 4px; cursor: pointer; white-space: nowrap; transition: background 0.15s;';
    btnSaveToFlowPalette.textContent = '+ Salvar no Fluxo';
    btnSaveToFlowPalette.addEventListener('mouseenter', () => btnSaveToFlowPalette.style.background = '#3b82f635');
    btnSaveToFlowPalette.addEventListener('mouseleave', () => btnSaveToFlowPalette.style.background = '#3b82f620');

    hexInp.addEventListener('input', (e: any) => applySelectedColor(e.target.value));

    btnSaveToFlowPalette.addEventListener('click', () => {
      const palette = this.getFlowColorPalette();
      if (!palette.includes(currentColor)) {
        palette.push(currentColor);
        this.getGraph().colorPalette = palette;
        this.showToast(`Cor ${currentColor} adicionada ao grupo de cores do fluxo!`, 'success');
        refreshPopover();
      } else {
        this.showToast('Esta cor já está no grupo de cores do fluxo.', 'info');
      }
    });

    customSpectrumCard.appendChild(spectrumCanvas);
    customSpectrumCard.appendChild(hueSlider);

    const editorCompletoRow = document.createElement('div');
    editorCompletoRow.style.cssText = 'display: flex; align-items: center; gap: 6px; padding-top: 6px; border-top: 1px solid #1e293b; width: 100%; box-sizing: border-box; position: relative; z-index: 10000;';

    editorCompletoRow.appendChild(nativeColorBtn);
    editorCompletoRow.appendChild(hexInp);
    editorCompletoRow.appendChild(btnSaveToFlowPalette);

    const refreshPopover = () => {
      popoverPanel.innerHTML = '';
      const flowPalette = this.getFlowColorPalette();
      if (flowPalette.length > 0) {
        popoverPanel.appendChild(buildGrid('Cores do Fluxo', flowPalette, true));
      }
      popoverPanel.appendChild(buildGrid('Cores Principais', mainBaseColors));
      popoverPanel.appendChild(buildGrid('Cores Modernas', modernColors));
      popoverPanel.appendChild(editorCompletoRow);
      popoverPanel.appendChild(customSpectrumCard);
    };

    btnMoreColors.addEventListener('click', (e) => {
      e.preventDefault();
      const isVisible = popoverPanel.style.display === 'flex';
      if (!isVisible) {
        refreshPopover();
        popoverPanel.style.display = 'flex';
      } else {
        popoverPanel.style.display = 'none';
      }
    });

    group.appendChild(popoverPanel);
    container.appendChild(group);
  }
}
