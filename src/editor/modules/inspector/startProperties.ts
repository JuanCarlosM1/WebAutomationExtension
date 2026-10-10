/**
 * Renderizador de propriedades e gatilhos do nó Start (Início do Fluxo):
 * - Gatilhos de URL (execução em sites específicos)
 * - Agendamento por intervalo (ms, s, min, h)
 * - Agendamento por data (dias da semana, dias do mês, calendário específico)
 * - Botão flutuante personalizado (emoji, SVG, imagem)
 */
import { InspectorInputHelpers } from '../inspectorInputHelpers';
import { ColorPickerManager } from '../colorPickerManager';

export interface StartPropertiesContext {
  renderInspector: (scrollToSelector?: string) => void;
  expandedTriggerIndices: Set<number>;
  colorPicker: ColorPickerManager;
  showToast: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

export class StartPropertiesRenderer {
  public static renderStartBlock(form: HTMLElement, data: any, ctx: StartPropertiesContext): void {
    if (!Array.isArray(data.triggers) || data.triggers.length === 0) {
      const initialType = data.triggerType || 'manual';
      data.triggers = [
        {
          type: initialType,
          enabled: true,
          urlPattern: data.urlPattern,
          urlPatterns: data.urlPatterns || (data.urlPattern ? [data.urlPattern] : []),
          shortcutKey: data.shortcutKey,
          intervalMinutes: data.intervalMinutes,
          cronExpression: data.cronExpression,
          contextMenuTitle: data.contextMenuTitle,
          floatingButton: data.floatingButton,
        },
      ];
    }

    const triggerLabelsMap: Record<string, string> = {
      manual: 'Manual (Disparo pelo Usuário)',
      on_url_load: 'Ao Carregar URLs de Execução',
      shortcut: 'Atalho de Teclado',
      schedule: 'Em um Intervalo de Tempo',
      date_schedule: 'Em Datas Específicas / Calendário',
      browser_startup: 'Ao Abrir o Browser',
      context_menu: 'Pelo Menu de Contexto',
      floating_button: 'Botão Flutuante Personalizado',
      mcp: 'Via MCP (IA)',
    };

    const triggersContainer = document.createElement('div');
    triggersContainer.style.cssText = 'margin-top: 10px; display: flex; flex-direction: column; gap: 8px;';

    const headerDiv = document.createElement('div');
    headerDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;';
    headerDiv.innerHTML = `
      <label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Formas de Disparo (${data.triggers.length})</label>
      <span style="font-size: 10px; color: #64748b;">Clique para expandir/recolher</span>
    `;
    triggersContainer.appendChild(headerDiv);

    data.triggers.forEach((trig: any, index: number) => {
      const isExpanded = ctx.expandedTriggerIndices.has(index);
      const card = document.createElement('div');
      card.className = 'start-trigger-card-item';
      card.setAttribute('data-trigger-index', String(index));
      card.style.cssText = `background: #0f172a; border: 1px solid ${isExpanded ? '#3b82f6' : '#1e293b'}; border-radius: 6px; overflow: hidden; transition: border-color 0.15s;`;

      const accordionHeader = document.createElement('div');
      accordionHeader.style.cssText = `padding: 8px 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: ${isExpanded ? '#1e293b70' : '#0f172a'}; user-select: none; gap: 8px;`;

      const headerLeft = document.createElement('div');
      headerLeft.style.cssText = 'display: flex; align-items: center; gap: 6px; flex: 1; overflow: hidden;';
      const iconSpan = document.createElement('span');
      iconSpan.style.cssText = 'font-size: 10px; color: #94a3b8; transition: transform 0.15s;';
      iconSpan.textContent = isExpanded ? '▼' : '▶';

      const titleSpan = document.createElement('span');
      titleSpan.style.cssText = `font-size: 12px; font-weight: ${isExpanded ? '600' : '500'}; color: ${isExpanded ? '#60a5fa' : '#cbd5e1'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
      titleSpan.textContent = triggerLabelsMap[trig.type] || trig.type;

      headerLeft.appendChild(iconSpan);
      headerLeft.appendChild(titleSpan);

      const btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.innerHTML = '&times;';
      btnDel.title = 'Remover este gatilho';
      btnDel.style.cssText = 'background: transparent; color: #ef4444; border: none; font-size: 16px; cursor: pointer; line-height: 1; padding: 2px 4px;';
      btnDel.addEventListener('click', (e) => {
        e.stopPropagation();
        if (data.triggers.length <= 1) {
          alert('O fluxo deve ter pelo menos 1 forma de disparo!');
          return;
        }
        data.triggers.splice(index, 1);
        ctx.renderInspector();
      });

      accordionHeader.appendChild(headerLeft);
      accordionHeader.appendChild(btnDel);

      accordionHeader.addEventListener('click', () => {
        if (ctx.expandedTriggerIndices.has(index)) {
          ctx.expandedTriggerIndices.delete(index);
        } else {
          ctx.expandedTriggerIndices.add(index);
        }
        ctx.renderInspector();
      });

      card.appendChild(accordionHeader);

      if (isExpanded) {
        const body = document.createElement('div');
        body.style.cssText = 'padding: 10px; border-top: 1px solid #1e293b; display: flex; flex-direction: column; gap: 8px;';

        InspectorInputHelpers.addSelectInput(
          body,
          'Tipo de Disparo',
          trig.type || 'manual',
          [
            { value: 'manual', label: 'Manual (Disparo pelo Usuário)' },
            { value: 'on_url_load', label: 'Ao Carregar URLs de Execução' },
            { value: 'shortcut', label: 'Atalho de Teclado' },
            { value: 'schedule', label: 'Em um Intervalo de Tempo' },
            { value: 'date_schedule', label: 'Em Datas Específicas / Calendário' },
            { value: 'browser_startup', label: 'Ao Abrir o Browser' },
            { value: 'context_menu', label: 'Pelo Menu de Contexto' },
            { value: 'floating_button', label: 'Botão Flutuante Personalizado' },
            { value: 'mcp', label: 'Via MCP (IA)' },
          ],
          (val) => {
            trig.type = val;
            ctx.renderInspector();
          }
        );

        InspectorInputHelpers.addCheckboxInput(body, 'Disparo Ativo', trig.enabled !== false, (val) => (trig.enabled = val));

        if (trig.type === 'on_url_load') {
          if (!Array.isArray(trig.urlPatterns)) {
            trig.urlPatterns = trig.urlPattern ? [trig.urlPattern] : ['https://*/*'];
          }
          this.renderUrlListSection(body, 'URLs de Execução Automática', trig.urlPatterns, (newList) => {
            trig.urlPatterns = newList;
            trig.urlPattern = newList[0] || 'https://*/*';
          }, ctx);
        } else if (trig.type === 'shortcut') {
          InspectorInputHelpers.addTextInput(body, 'Combinação de Teclas (ex: Ctrl+Shift+U)', trig.shortcutKey || 'Ctrl+Shift+U', (val) => (trig.shortcutKey = val));
        } else if (trig.type === 'schedule') {
          this.renderIntervalScheduleTriggerConfig(body, trig);
        } else if (trig.type === 'date_schedule') {
          this.renderDateScheduleTriggerConfig(body, trig, ctx);
        } else if (trig.type === 'context_menu') {
          InspectorInputHelpers.addTextInput(body, 'Título no Menu de Contexto', trig.contextMenuTitle || 'Executar Automação', (val) => (trig.contextMenuTitle = val));
        } else if (trig.type === 'floating_button') {
          this.renderFloatingButtonTriggerConfig(body, trig, ctx);
        }

        card.appendChild(body);
      }

      triggersContainer.appendChild(card);
    });

    const btnAddTrigger = document.createElement('button');
    btnAddTrigger.type = 'button';
    btnAddTrigger.className = 'btn-xs';
    btnAddTrigger.style.cssText = 'width: 100%; margin-top: 4px; padding: 6px;';
    btnAddTrigger.textContent = '+ Adicionar Outra Forma de Disparo';
    btnAddTrigger.addEventListener('click', () => {
      const newIndex = data.triggers.length;
      data.triggers.push({
        type: 'on_url_load',
        enabled: true,
        urlPatterns: ['https://*/*'],
      });
      ctx.expandedTriggerIndices.add(newIndex);
      ctx.renderInspector(`.start-trigger-card-item[data-trigger-index="${newIndex}"]`);
    });

    triggersContainer.appendChild(btnAddTrigger);
    form.appendChild(triggersContainer);
  }

  public static renderIntervalScheduleTriggerConfig(body: HTMLElement, trig: any): void {
    if (trig.intervalValue === undefined) {
      trig.intervalValue = trig.intervalMinutes ?? 15;
    }
    if (!trig.intervalUnit) {
      trig.intervalUnit = 'minutes';
    }

    const intervalRow = document.createElement('div');
    intervalRow.style.cssText = 'display: flex; flex-direction: column; gap: 4px;';

    const lbl = document.createElement('label');
    lbl.style.cssText = 'font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;';
    lbl.textContent = 'Repetir a Cada (Intervalo)';
    intervalRow.appendChild(lbl);

    const inputGroup = document.createElement('div');
    inputGroup.style.cssText = 'display: flex; gap: 6px; align-items: center;';

    const numInp = document.createElement('input');
    numInp.type = 'number';
    numInp.min = '1';
    numInp.value = String(trig.intervalValue);
    numInp.style.cssText = 'flex: 1; min-width: 0; padding: 6px 8px; font-size: 12px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;';
    numInp.addEventListener('input', (e: any) => {
      const val = Math.max(1, Number(e.target.value) || 1);
      trig.intervalValue = val;
      if (trig.intervalUnit === 'minutes') trig.intervalMinutes = val;
      else if (trig.intervalUnit === 'hours') trig.intervalMinutes = val * 60;
      else if (trig.intervalUnit === 'seconds') trig.intervalMinutes = Math.max(1, Math.round(val / 60));
      else if (trig.intervalUnit === 'ms') trig.intervalMinutes = Math.max(1, Math.round(val / 60000));
    });

    const unitSelect = document.createElement('select');
    unitSelect.style.cssText = 'width: 140px; padding: 6px 8px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px; cursor: pointer;';
    unitSelect.innerHTML = `
      <option value="ms" ${trig.intervalUnit === 'ms' ? 'selected' : ''}>Milissegundos (ms)</option>
      <option value="seconds" ${trig.intervalUnit === 'seconds' ? 'selected' : ''}>Segundos (s)</option>
      <option value="minutes" ${trig.intervalUnit === 'minutes' ? 'selected' : ''}>Minutos (min)</option>
      <option value="hours" ${trig.intervalUnit === 'hours' ? 'selected' : ''}>Horas (h)</option>
    `;
    unitSelect.addEventListener('change', (e: any) => {
      trig.intervalUnit = e.target.value;
      const val = Number(trig.intervalValue) || 1;
      if (trig.intervalUnit === 'minutes') trig.intervalMinutes = val;
      else if (trig.intervalUnit === 'hours') trig.intervalMinutes = val * 60;
      else if (trig.intervalUnit === 'seconds') trig.intervalMinutes = Math.max(1, Math.round(val / 60));
      else if (trig.intervalUnit === 'ms') trig.intervalMinutes = Math.max(1, Math.round(val / 60000));
    });

    inputGroup.appendChild(numInp);
    inputGroup.appendChild(unitSelect);
    intervalRow.appendChild(inputGroup);
    body.appendChild(intervalRow);

    InspectorInputHelpers.addTextInput(body, 'Expressão Cron (Opcional, ex: 0 * * * *)', trig.cronExpression || '', (val) => (trig.cronExpression = val));
  }

  public static renderDateScheduleTriggerConfig(body: HTMLElement, trig: any, ctx: StartPropertiesContext): void {
    if (!trig.dateSchedule) {
      trig.dateSchedule = {
        mode: 'weekdays',
        weekdays: [1, 2, 3, 4, 5],
        monthDays: [1, 15],
        fullDates: [],
        time: '09:00',
      };
    }
    const ds = trig.dateSchedule;
    if (!ds.mode) ds.mode = 'weekdays';
    if (!Array.isArray(ds.weekdays)) ds.weekdays = [1, 2, 3, 4, 5];
    if (!Array.isArray(ds.monthDays)) ds.monthDays = [1, 15];
    if (!Array.isArray(ds.fullDates)) ds.fullDates = [];
    if (!ds.time) ds.time = '09:00';

    const modeGroup = document.createElement('div');
    modeGroup.style.cssText = 'display: flex; flex-direction: column; gap: 4px;';
    const modeLabel = document.createElement('label');
    modeLabel.style.cssText = 'font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;';
    modeLabel.textContent = 'Modo de Seleção de Datas';

    const modeSelect = document.createElement('select');
    modeSelect.style.cssText = 'width: 100%; padding: 6px 8px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;';
    modeSelect.innerHTML = `
      <option value="weekdays" ${ds.mode === 'weekdays' ? 'selected' : ''}>Dias da Semana apenas (Seg, Ter, etc.)</option>
      <option value="month_days" ${ds.mode === 'month_days' ? 'selected' : ''}>Dias apenas entre dias do mês (1 a 31)</option>
      <option value="full_dates" ${ds.mode === 'full_dates' ? 'selected' : ''}>Datas completas (Calendário específico)</option>
    `;
    modeSelect.addEventListener('change', (e: any) => {
      ds.mode = e.target.value;
      ctx.renderInspector();
    });

    modeGroup.appendChild(modeLabel);
    modeGroup.appendChild(modeSelect);
    body.appendChild(modeGroup);

    InspectorInputHelpers.addTextInput(body, 'Horário de Execução no Dia (HH:MM)', ds.time || '09:00', (val) => (ds.time = val));

    const selectionCard = document.createElement('div');
    selectionCard.style.cssText = 'background: #0b0f19; border: 1px solid #1e293b; border-radius: 6px; padding: 10px; display: flex; flex-direction: column; gap: 8px;';

    if (ds.mode === 'weekdays') {
      const wLabel = document.createElement('div');
      wLabel.style.cssText = 'font-size: 10px; font-weight: 700; color: #93c5fd; text-transform: uppercase;';
      wLabel.textContent = 'Escolha os Dias da Semana:';
      selectionCard.appendChild(wLabel);

      const days = [
        { id: 0, short: 'Dom', full: 'Domingo' },
        { id: 1, short: 'Seg', full: 'Segunda-feira' },
        { id: 2, short: 'Ter', full: 'Terça-feira' },
        { id: 3, short: 'Qua', full: 'Quarta-feira' },
        { id: 4, short: 'Qui', full: 'Quinta-feira' },
        { id: 5, short: 'Sex', full: 'Sexta-feira' },
        { id: 6, short: 'Sáb', full: 'Sábado' },
      ];

      const daysGrid = document.createElement('div');
      daysGrid.style.cssText = 'display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;';

      days.forEach((day) => {
        const isSelected = ds.weekdays.includes(day.id);
        const dayBtn = document.createElement('button');
        dayBtn.type = 'button';
        dayBtn.textContent = day.short;
        dayBtn.title = day.full;
        dayBtn.style.cssText = `
          padding: 8px 2px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 4px;
          border: 1px solid ${isSelected ? '#3b82f6' : '#243049'};
          background: ${isSelected ? '#2563eb' : '#172033'};
          color: ${isSelected ? '#ffffff' : '#94a3b8'};
          cursor: pointer;
          transition: all 0.15s;
        `;
        dayBtn.addEventListener('click', () => {
          if (ds.weekdays.includes(day.id)) {
            if (ds.weekdays.length > 1) {
              ds.weekdays = ds.weekdays.filter((d: number) => d !== day.id);
            } else {
              ctx.showToast('Selecione pelo menos 1 dia da semana.', 'warning');
              return;
            }
          } else {
            ds.weekdays.push(day.id);
            ds.weekdays.sort();
          }
          ctx.renderInspector();
        });
        daysGrid.appendChild(dayBtn);
      });
      selectionCard.appendChild(daysGrid);
    } else if (ds.mode === 'month_days') {
      const mLabel = document.createElement('div');
      mLabel.style.cssText = 'font-size: 10px; font-weight: 700; color: #93c5fd; text-transform: uppercase;';
      mLabel.textContent = 'Escolha os Dias do Mês (1 a 31):';
      selectionCard.appendChild(mLabel);

      const monthGrid = document.createElement('div');
      monthGrid.style.cssText = 'display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;';

      for (let day = 1; day <= 31; day++) {
        const isSelected = ds.monthDays.includes(day);
        const dayBtn = document.createElement('button');
        dayBtn.type = 'button';
        dayBtn.textContent = String(day);
        dayBtn.style.cssText = `
          padding: 6px 0;
          font-size: 11px;
          font-weight: 600;
          border-radius: 4px;
          border: 1px solid ${isSelected ? '#10b981' : '#243049'};
          background: ${isSelected ? '#059669' : '#172033'};
          color: ${isSelected ? '#ffffff' : '#94a3b8'};
          cursor: pointer;
          transition: all 0.15s;
        `;
        dayBtn.addEventListener('click', () => {
          if (ds.monthDays.includes(day)) {
            if (ds.monthDays.length > 1) {
              ds.monthDays = ds.monthDays.filter((d: number) => d !== day);
            } else {
              ctx.showToast('Selecione pelo menos 1 dia do mês.', 'warning');
              return;
            }
          } else {
            ds.monthDays.push(day);
            ds.monthDays.sort((a: number, b: number) => a - b);
          }
          ctx.renderInspector();
        });
        monthGrid.appendChild(dayBtn);
      }
      selectionCard.appendChild(monthGrid);
    } else if (ds.mode === 'full_dates') {
      const cLabel = document.createElement('div');
      cLabel.style.cssText = 'font-size: 10px; font-weight: 700; color: #93c5fd; text-transform: uppercase;';
      cLabel.textContent = 'Adicionar Datas Específicas (Calendário Nativo):';
      selectionCard.appendChild(cLabel);

      const pickerRow = document.createElement('div');
      pickerRow.style.cssText = 'display: flex; gap: 8px; align-items: center;';

      const dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.className = 'native-date-picker-input';
      dateInput.style.cssText = 'flex: 1;';
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dateInput.value = `${yyyy}-${mm}-${dd}`;

      const btnAddDate = document.createElement('button');
      btnAddDate.type = 'button';
      btnAddDate.className = 'btn btn-secondary';
      btnAddDate.style.cssText = 'padding: 6px 12px; font-size: 11px; white-space: nowrap; display: flex; align-items: center; gap: 4px;';
      btnAddDate.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Adicionar Data
      `;

      const handleAddSelectedDate = () => {
        const val = dateInput.value;
        if (!val) {
          if (typeof (dateInput as any).showPicker === 'function') {
            try {
              (dateInput as any).showPicker();
            } catch {}
          }
          return;
        }
        if (!ds.fullDates.includes(val)) {
          ds.fullDates.push(val);
          ds.fullDates.sort();
          ctx.renderInspector();
        } else {
          ctx.showToast('Esta data já foi adicionada à lista.', 'info');
        }
      };

      btnAddDate.addEventListener('click', handleAddSelectedDate);
      dateInput.addEventListener('change', () => {
        handleAddSelectedDate();
      });

      pickerRow.appendChild(dateInput);
      pickerRow.appendChild(btnAddDate);
      selectionCard.appendChild(pickerRow);

      const tipText = document.createElement('span');
      tipText.style.cssText = 'font-size: 10px; color: #64748b; font-style: italic;';
      tipText.textContent = 'Clique no ícone de calendário no campo acima para abrir o calendário do navegador.';
      selectionCard.appendChild(tipText);

      const datesBadgeRow = document.createElement('div');
      datesBadgeRow.style.cssText = 'display: flex; flex-direction: column; gap: 4px; margin-top: 6px; border-top: 1px solid #1e293b; padding-top: 6px;';

      const badgeHeader = document.createElement('div');
      badgeHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
      badgeHeader.innerHTML = `
        <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Datas Selecionadas (${ds.fullDates.length})</span>
      `;
      if (ds.fullDates.length > 0) {
        const btnClear = document.createElement('button');
        btnClear.type = 'button';
        btnClear.textContent = 'Limpar Todas';
        btnClear.style.cssText = 'font-size: 10px; color: #ef4444; background: transparent; border: none; cursor: pointer; text-decoration: underline;';
        btnClear.addEventListener('click', () => {
          ds.fullDates = [];
          ctx.renderInspector();
        });
        badgeHeader.appendChild(btnClear);
      }
      datesBadgeRow.appendChild(badgeHeader);

      if (ds.fullDates.length === 0) {
        const noneSelected = document.createElement('span');
        noneSelected.style.cssText = 'font-size: 11px; color: #ef4444; font-style: italic;';
        noneSelected.textContent = 'Nenhuma data selecionada no calendário.';
        datesBadgeRow.appendChild(noneSelected);
      } else {
        const tagContainer = document.createElement('div');
        tagContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 4px; max-height: 100px; overflow-y: auto;';
        ds.fullDates.forEach((dt: string) => {
          const parts = dt.split('-');
          const formatted = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dt;

          const tag = document.createElement('span');
          tag.style.cssText = 'background: #7c3aed25; border: 1px solid #7c3aed60; color: #c4b5fd; font-size: 11px; font-family: monospace; padding: 3px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px;';
          tag.innerHTML = `<span>${formatted}</span><button type="button" title="Remover data" style="background:transparent;border:none;color:#ef4444;cursor:pointer;line-height:1;font-size:13px;padding:0;font-weight:bold;">&times;</button>`;
          tag.querySelector('button')?.addEventListener('click', () => {
            ds.fullDates = ds.fullDates.filter((x: string) => x !== dt);
            ctx.renderInspector();
          });
          tagContainer.appendChild(tag);
        });
        datesBadgeRow.appendChild(tagContainer);
      }
      selectionCard.appendChild(datesBadgeRow);
    }

    body.appendChild(selectionCard);
  }

  public static renderFloatingButtonTriggerConfig(body: HTMLElement, trig: any, ctx: StartPropertiesContext): void {
    if (!trig.floatingButton) {
      trig.floatingButton = {
        buttonText: 'Executar Fluxo',
        iconType: 'emoji',
        buttonIcon: '⚡',
        position: 'bottom-right',
        offsetX: 24,
        offsetY: 24,
        backgroundColor: '#6366f1',
        textColor: '#ffffff',
        urlPattern: '*://*/*',
      };
    }
    const fb = trig.floatingButton;
    if (!fb.iconType) fb.iconType = 'emoji';

    InspectorInputHelpers.addTextInput(body, 'Texto do Botão', fb.buttonText || '', (val) => (fb.buttonText = val));

    const iconGroup = document.createElement('div');
    iconGroup.style.cssText = 'background: #0b0f19; border: 1px solid #1e293b; border-radius: 6px; padding: 8px; display: flex; flex-direction: column; gap: 6px;';

    const iconHeader = document.createElement('label');
    iconHeader.style.cssText = 'font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;';
    iconHeader.textContent = 'Tipo de Ícone';
    iconGroup.appendChild(iconHeader);

    const iconTypeSelect = document.createElement('select');
    iconTypeSelect.style.cssText = 'width: 100%; padding: 5px 8px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;';
    iconTypeSelect.innerHTML = `
      <option value="emoji" ${fb.iconType === 'emoji' ? 'selected' : ''}>Emoji / Caractere</option>
      <option value="svg" ${fb.iconType === 'svg' ? 'selected' : ''}>Código SVG</option>
      <option value="image" ${fb.iconType === 'image' ? 'selected' : ''}>Imagem (Upload)</option>
    `;

    const iconContentDiv = document.createElement('div');
    iconContentDiv.style.cssText = 'margin-top: 4px;';

    const renderIconOptions = () => {
      iconContentDiv.innerHTML = '';
      if (fb.iconType === 'emoji') {
        const emojiInput = document.createElement('input');
        emojiInput.type = 'text';
        emojiInput.value = fb.buttonIcon || '⚡';
        emojiInput.placeholder = 'ex: ⚡, 🚀, ▶, ⚙️';
        emojiInput.style.cssText = 'width: 100%; padding: 5px 8px; font-size: 14px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;';
        emojiInput.addEventListener('input', (e: any) => (fb.buttonIcon = e.target.value));
        iconContentDiv.appendChild(emojiInput);
      } else if (fb.iconType === 'svg') {
        const svgInput = document.createElement('textarea');
        svgInput.value = fb.svgIcon || '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>';
        svgInput.placeholder = '<svg viewBox="0 0 24 24" ...>...</svg>';
        svgInput.rows = 3;
        svgInput.style.cssText = 'width: 100%; padding: 5px 8px; font-size: 11px; font-family: monospace; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px; resize: vertical;';
        svgInput.addEventListener('input', (e: any) => (fb.svgIcon = e.target.value));
        iconContentDiv.appendChild(svgInput);
      } else if (fb.iconType === 'image') {
        const uploadContainer = document.createElement('div');
        uploadContainer.style.cssText = 'display: flex; flex-direction: column; gap: 6px;';
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/png, image/jpeg, image/svg+xml, image/webp, image/gif';
        fileInput.style.cssText = 'font-size: 11px; color: #94a3b8; cursor: pointer;';

        const previewImg = document.createElement('img');
        previewImg.style.cssText = `width: 32px; height: 32px; object-fit: contain; border-radius: 4px; border: 1px solid #243049; background: #172033; display: ${fb.imageIcon ? 'block' : 'none'};`;
        if (fb.imageIcon) previewImg.src = fb.imageIcon;

        fileInput.addEventListener('change', (e: any) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (re) => {
              const base64 = re.target?.result as string;
              fb.imageIcon = base64;
              previewImg.src = base64;
              previewImg.style.display = 'block';
            };
            reader.readAsDataURL(file);
          }
        });

        uploadContainer.appendChild(fileInput);
        uploadContainer.appendChild(previewImg);
        iconContentDiv.appendChild(uploadContainer);
      }
    };

    iconTypeSelect.addEventListener('change', (e: any) => {
      const newType = e.target.value;
      fb.iconType = newType;
      if (newType === 'emoji') {
        delete fb.svgIcon;
        delete fb.imageIcon;
        if (!fb.buttonIcon) fb.buttonIcon = '⚡';
      } else if (newType === 'svg') {
        delete fb.buttonIcon;
        delete fb.imageIcon;
        if (!fb.svgIcon) fb.svgIcon = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>';
      } else if (newType === 'image') {
        delete fb.buttonIcon;
        delete fb.svgIcon;
      }
      renderIconOptions();
    });

    renderIconOptions();
    iconGroup.appendChild(iconTypeSelect);
    iconGroup.appendChild(iconContentDiv);
    body.appendChild(iconGroup);

    InspectorInputHelpers.addSelectInput(
      body,
      'Posição na Tela',
      fb.position || 'bottom-right',
      [
        { value: 'bottom-right', label: 'Inferior Direito (Padrão)' },
        { value: 'bottom-left', label: 'Inferior Esquerdo' },
        { value: 'top-right', label: 'Superior Direito' },
        { value: 'top-left', label: 'Superior Esquerdo' },
      ],
      (val) => (fb.position = val)
    );
    InspectorInputHelpers.addNumberInput(body, 'Deslocamento X (px)', fb.offsetX ?? 24, (val) => (fb.offsetX = val));
    InspectorInputHelpers.addNumberInput(body, 'Deslocamento Y (px)', fb.offsetY ?? 24, (val) => (fb.offsetY = val));

    ctx.colorPicker.createPaintColorPicker(body, 'Cor de Fundo', fb.backgroundColor || '#6366f1', (val) => (fb.backgroundColor = val));
    ctx.colorPicker.createPaintColorPicker(body, 'Cor do Texto', fb.textColor || '#ffffff', (val) => (fb.textColor = val));

    if (!Array.isArray(trig.urlPatterns)) {
      trig.urlPatterns = fb.urlPattern ? [fb.urlPattern] : ['*://*/*'];
    }
    this.renderUrlListSection(body, 'URLs Em Que o Botão Será Exibido', trig.urlPatterns, (newList) => {
      trig.urlPatterns = newList;
      fb.urlPattern = newList[0] || '*://*/*';
    }, ctx);
  }

  public static renderUrlListSection(
    container: HTMLElement,
    labelText: string,
    currentList: string[],
    onUpdate: (newList: string[]) => void,
    ctx: StartPropertiesContext
  ): void {
    const urlSection = document.createElement('div');
    urlSection.style.cssText = 'display: flex; flex-direction: column; gap: 4px; margin-top: 4px;';

    const secHeader = document.createElement('div');
    secHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
    secHeader.innerHTML = `
      <label style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">${labelText} (${currentList.length})</label>
    `;
    urlSection.appendChild(secHeader);

    const itemsDiv = document.createElement('div');
    itemsDiv.style.cssText = 'display: flex; flex-direction: column; gap: 4px;';

    if (currentList.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.style.cssText = 'font-size: 11px; color: #64748b; font-style: italic;';
      emptyMsg.textContent = 'Nenhuma URL definida (executa em qualquer página).';
      itemsDiv.appendChild(emptyMsg);
    } else {
      currentList.forEach((urlVal, uIdx) => {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; gap: 4px; align-items: center;';

        const inp = document.createElement('input');
        inp.type = 'text';
        inp.value = urlVal;
        inp.placeholder = 'ex: *://*.google.com/* ou https://exemplo.com/painel';
        inp.style.cssText = 'flex: 1; padding: 4px 6px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;';
        inp.addEventListener('input', (e: any) => {
          currentList[uIdx] = e.target.value;
          onUpdate(currentList);
        });

        const delUrlBtn = document.createElement('button');
        delUrlBtn.type = 'button';
        delUrlBtn.innerHTML = '&times;';
        delUrlBtn.title = 'Remover URL';
        delUrlBtn.style.cssText = 'background: #ef444420; color: #ef4444; border: 1px solid #ef444440; border-radius: 4px; width: 22px; height: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center;';
        delUrlBtn.addEventListener('click', () => {
          currentList.splice(uIdx, 1);
          onUpdate(currentList);
          ctx.renderInspector();
        });

        row.appendChild(inp);
        row.appendChild(delUrlBtn);
        itemsDiv.appendChild(row);
      });
    }

    urlSection.appendChild(itemsDiv);

    const btnAddUrl = document.createElement('button');
    btnAddUrl.type = 'button';
    btnAddUrl.className = 'btn-xs';
    btnAddUrl.style.cssText = 'width: 100%; margin-top: 4px; padding: 4px 6px; font-size: 11px; background: #1e293b; border: 1px solid #334155; color: #94a3b8; cursor: pointer; border-radius: 4px;';
    btnAddUrl.textContent = '+ Adicionar URL para Execução';
    btnAddUrl.addEventListener('click', () => {
      currentList.push('*://*/*');
      onUpdate(currentList);
      ctx.renderInspector();
    });
    urlSection.appendChild(btnAddUrl);

    container.appendChild(urlSection);
  }
}
