/**
 * Renderizador de propriedades para nós de controle de fluxo:
 * - delay
 * - switch
 * - while_loop
 * - for_loop
 * - if_element_exists
 */
import { InspectorInputHelpers } from '../inspectorInputHelpers';
import { CodeEditorComponent } from '../codeEditorComponent';

export interface FlowPropertiesContext {
  renderInspector: (scrollToSelector?: string) => void;
  expandedCaseIndices: Set<number>;
  onNodeDataChanged: () => void;
  showToast: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

export class FlowPropertiesRenderer {
  public static renderDelay(form: HTMLElement, data: any, ctx: FlowPropertiesContext): void {
    InspectorInputHelpers.addCheckboxInput(form, 'Usar Tempo Randômico', !!data.isRandom, (val) => {
      data.isRandom = val;
      if (val && !data.randomRange) data.randomRange = { minMs: 1000, maxMs: 3000 };
      ctx.renderInspector();
    });

    if (!data.isRandom) {
      InspectorInputHelpers.addNumberInput(form, 'Atraso Fixo (ms)', data.fixedMs ?? 1500, (val) => (data.fixedMs = val));
    } else {
      InspectorInputHelpers.addNumberInput(form, 'Atraso Mínimo (ms)', data.randomRange?.minMs ?? 1000, (val) => {
        if (!data.randomRange) data.randomRange = { minMs: 1000, maxMs: 3000 };
        data.randomRange.minMs = val;
      });
      InspectorInputHelpers.addNumberInput(form, 'Atraso Máximo (ms)', data.randomRange?.maxMs ?? 3000, (val) => {
        if (!data.randomRange) data.randomRange = { minMs: 1000, maxMs: 3000 };
        data.randomRange.maxMs = val;
      });
    }
  }

  public static renderSwitch(form: HTMLElement, data: any, ctx: FlowPropertiesContext): void {
    InspectorInputHelpers.addSelectInput(
      form,
      'Modo de Execução',
      data.executionMode || 'first_match',
      [
        { value: 'first_match', label: 'Executar o primeiro que satisfizer' },
        { value: 'all_matches_parallel', label: 'Executar todos que satisfizerem em paralelo' },
      ],
      (val) => (data.executionMode = val)
    );

    InspectorInputHelpers.addCheckboxInput(
      form,
      'Possui Caminho Padrão (Default)',
      data.hasDefaultBranch !== false,
      (val) => (data.hasDefaultBranch = val)
    );

    const casesContainer = document.createElement('div');
    casesContainer.style.cssText =
      'border-top: 1px solid #243049; padding-top: 10px; margin-top: 10px; display: flex; flex-direction: column; gap: 8px;';

    const casesHeader = document.createElement('div');
    casesHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;';
    casesHeader.innerHTML = `
      <label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Caminhos Condicionais (${Array.isArray(data.cases) ? data.cases.length : 0})</label>
      <span style="font-size: 10px; color: #64748b;">Clique para expandir/recolher</span>
    `;
    casesContainer.appendChild(casesHeader);

    if (!Array.isArray(data.cases)) data.cases = [];

    data.cases.forEach((c: any, index: number) => {
      if (!Array.isArray(c.rules) || c.rules.length === 0) {
        c.rules = [
          {
            id: `rule_${Date.now()}_0`,
            evaluationMode: c.evaluationMode || (c.jsExpression && !c.operator ? 'js_eval' : 'comparison'),
            leftOperand: c.leftOperand || '',
            operator: c.operator || 'equals',
            rightOperand: c.rightOperand || '',
            jsExpression: c.jsExpression || '',
          },
        ];
      }

      const isExpanded = ctx.expandedCaseIndices.has(index);
      const caseCard = document.createElement('div');
      caseCard.className = 'switch-case-card-item';
      caseCard.setAttribute('data-case-index', String(index));
      caseCard.style.cssText = `background: #0f172a; border: 1px solid ${isExpanded ? '#3b82f6' : '#1e293b'}; border-radius: 6px; overflow: hidden; transition: border-color 0.15s;`;

      const accordionHeader = document.createElement('div');
      accordionHeader.style.cssText = `padding: 8px 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: ${isExpanded ? '#1e293b70' : '#0f172a'}; user-select: none; gap: 8px;`;

      const headerLeft = document.createElement('div');
      headerLeft.style.cssText = 'display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0;';
      const iconSpan = document.createElement('span');
      iconSpan.style.cssText = 'font-size: 10px; color: #94a3b8; transition: transform 0.15s;';
      iconSpan.textContent = isExpanded ? '▼' : '▶';

      const titleSpan = document.createElement('span');
      titleSpan.style.cssText = `font-size: 12px; font-weight: ${isExpanded ? '600' : '500'}; color: ${isExpanded ? '#60a5fa' : '#cbd5e1'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
      titleSpan.textContent = c.label || `Caso #${index + 1}`;

      headerLeft.appendChild(iconSpan);
      headerLeft.appendChild(titleSpan);

      const btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.innerHTML = '&times;';
      btnDel.title = 'Remover este caminho';
      btnDel.style.cssText =
        'background: transparent; color: #ef4444; border: none; font-size: 16px; cursor: pointer; line-height: 1; padding: 2px 4px;';
      btnDel.addEventListener('click', (e) => {
        e.stopPropagation();
        data.cases.splice(index, 1);
        ctx.renderInspector();
      });

      accordionHeader.appendChild(headerLeft);
      accordionHeader.appendChild(btnDel);

      accordionHeader.addEventListener('click', () => {
        if (ctx.expandedCaseIndices.has(index)) {
          ctx.expandedCaseIndices.delete(index);
        } else {
          ctx.expandedCaseIndices.add(index);
        }
        ctx.renderInspector();
      });

      caseCard.appendChild(accordionHeader);

      if (isExpanded) {
        const body = document.createElement('div');
        body.style.cssText = 'padding: 10px; border-top: 1px solid #1e293b; display: flex; flex-direction: column; gap: 8px;';

        InspectorInputHelpers.addTextInput(body, 'Título do Caminho', c.label || '', (val) => {
          c.label = val;
          titleSpan.textContent = val || `Caso #${index + 1}`;
          ctx.onNodeDataChanged();
        });

        if (c.rules.length > 1) {
          const logicRow = document.createElement('div');
          logicRow.style.cssText =
            'display: flex; align-items: center; justify-content: space-between; background: #0b0f19; padding: 6px 8px; border-radius: 4px; border: 1px solid #1e293b;';
          logicRow.innerHTML = '<span style="font-size: 11px; color: #94a3b8; font-weight: 600;">Combinar Expressões:</span>';

          const logicSelect = document.createElement('select');
          logicSelect.style.cssText =
            'padding: 3px 6px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;';
          logicSelect.innerHTML = `
            <option value="and" ${(c.logicalOperator || 'and') === 'and' ? 'selected' : ''}>Satisfazer TODAS (E)</option>
            <option value="or" ${c.logicalOperator === 'or' ? 'selected' : ''}>Satisfazer QUALQUER UMA (OU)</option>
          `;
          logicSelect.addEventListener('change', (e: any) => {
            c.logicalOperator = e.target.value;
          });
          logicRow.appendChild(logicSelect);
          body.appendChild(logicRow);
        }

        const rulesList = document.createElement('div');
        rulesList.style.cssText = 'display: flex; flex-direction: column; gap: 6px;';

        c.rules.forEach((rule: any, ruleIdx: number) => {
          const ruleEl = this.createRuleEditorElement(rule, ruleIdx, c.rules.length, () => {
            c.rules.splice(ruleIdx, 1);
            if (c.rules.length === 0) {
              c.rules.push({
                id: `rule_${Date.now()}`,
                evaluationMode: 'comparison',
                leftOperand: '',
                operator: 'equals',
                rightOperand: '',
              });
            }
            ctx.renderInspector();
          }, ctx);
          rulesList.appendChild(ruleEl);
        });

        body.appendChild(rulesList);

        const btnAddRule = document.createElement('button');
        btnAddRule.type = 'button';
        btnAddRule.className = 'btn-xs';
        btnAddRule.style.cssText =
          'width: 100%; padding: 5px; background: #1e293b; color: #93c5fd; border: 1px dashed #3b82f6; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: 600;';
        btnAddRule.textContent = '+ Adicionar Outra Expressão Condicional';
        btnAddRule.addEventListener('click', () => {
          c.rules.push({
            id: `rule_${Date.now()}`,
            evaluationMode: 'comparison',
            leftOperand: '',
            operator: 'equals',
            rightOperand: '',
            jsExpression: '',
          });
          ctx.renderInspector();
        });
        body.appendChild(btnAddRule);

        caseCard.appendChild(body);
      }

      casesContainer.appendChild(caseCard);
    });

    const btnAddCase = document.createElement('button');
    btnAddCase.type = 'button';
    btnAddCase.className = 'btn-xs';
    btnAddCase.style.cssText = 'width: 100%; margin-top: 4px; padding: 6px;';
    btnAddCase.textContent = '+ Adicionar Caminho Condicional';
    btnAddCase.addEventListener('click', () => {
      const newIdx = data.cases.length;
      data.cases.push({
        id: `case_${Date.now()}`,
        label: `Caso #${newIdx + 1}`,
        rules: [
          {
            id: `rule_${Date.now()}_0`,
            evaluationMode: 'comparison',
            leftOperand: '',
            operator: 'equals',
            rightOperand: '',
            jsExpression: '',
          },
        ],
        logicalOperator: 'and',
      });
      ctx.expandedCaseIndices.add(newIdx);
      ctx.renderInspector(`.switch-case-card-item[data-case-index="${newIdx}"]`);
    });

    casesContainer.appendChild(btnAddCase);
    form.appendChild(casesContainer);
  }

  public static createRuleEditorElement(
    rule: any,
    ruleIdx: number,
    totalRules: number,
    onDelete: () => void,
    ctx: FlowPropertiesContext
  ): HTMLElement {
    const ruleEl = document.createElement('div');
    ruleEl.style.cssText =
      'background: #0b0f19; border: 1px solid #1e293b; border-radius: 5px; padding: 8px; display: flex; flex-direction: column; gap: 6px;';

    const mode = rule.evaluationMode || (rule.jsExpression && !rule.operator ? 'js_eval' : 'comparison');

    const ruleHeader = document.createElement('div');
    ruleHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
    ruleHeader.innerHTML = `
      <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Expressão #${ruleIdx + 1}</span>
    `;

    if (totalRules > 1) {
      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.innerHTML = '&times;';
      delBtn.title = 'Remover esta expressão';
      delBtn.style.cssText =
        'background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 14px; line-height: 1; padding: 0 4px;';
      delBtn.addEventListener('click', onDelete);
      ruleHeader.appendChild(delBtn);
    }
    ruleEl.appendChild(ruleHeader);

    const modeSelect = document.createElement('select');
    modeSelect.style.cssText =
      'width: 100%; padding: 4px 6px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;';
    modeSelect.innerHTML = `
      <option value="comparison" ${mode === 'comparison' ? 'selected' : ''}>Comparação de Valores</option>
      <option value="js_eval" ${mode === 'js_eval' ? 'selected' : ''}>Expressão / Código JS</option>
    `;
    ruleEl.appendChild(modeSelect);

    const compFields = document.createElement('div');
    compFields.style.cssText = `display: ${mode === 'comparison' ? 'flex' : 'none'}; flex-direction: column; gap: 4px;`;
    compFields.innerHTML = `
      <input type="text" placeholder="Operando Esquerdo (ex: {{status}})" value="${rule.leftOperand || ''}" class="rule-left" style="width: 100%; padding: 4px 6px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;" />
      <select class="rule-op" style="width: 100%; padding: 4px 6px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;">
        <option value="equals" ${rule.operator === 'equals' ? 'selected' : ''}>Igual</option>
        <option value="not_equals" ${rule.operator === 'not_equals' ? 'selected' : ''}>Diferente</option>
        <option value="contains" ${rule.operator === 'contains' ? 'selected' : ''}>Contém</option>
        <option value="not_contains" ${rule.operator === 'not_contains' ? 'selected' : ''}>Não Contém</option>
        <option value="greater_than" ${rule.operator === 'greater_than' ? 'selected' : ''}>Maior que</option>
        <option value="less_than" ${rule.operator === 'less_than' ? 'selected' : ''}>Menor que</option>
        <option value="greater_or_equal" ${rule.operator === 'greater_or_equal' ? 'selected' : ''}>Maior ou Igual</option>
        <option value="less_or_equal" ${rule.operator === 'less_or_equal' ? 'selected' : ''}>Menor ou Igual</option>
        <option value="is_empty" ${rule.operator === 'is_empty' ? 'selected' : ''}>Está Vazio</option>
        <option value="is_not_empty" ${rule.operator === 'is_not_empty' ? 'selected' : ''}>Não Está Vazio</option>
      </select>
      <input type="text" placeholder="Operando Direito (ex: 200)" value="${rule.rightOperand || ''}" class="rule-right" style="width: 100%; padding: 4px 6px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;" />
    `;

    const jsFields = document.createElement('div');
    jsFields.style.cssText = `display: ${mode === 'js_eval' ? 'flex' : 'none'}; flex-direction: column; gap: 4px;`;
    jsFields.innerHTML = `
      <div style="display: flex; gap: 4px;">
        <input type="text" class="rule-js-code" placeholder="Expressão JS (ex: status === 200)" value="${InspectorInputHelpers.escapeSnippet(rule.jsExpression || '')}" style="flex: 1; padding: 4px 6px; font-size: 11px; font-family: monospace; background: #172033; color: #38bdf8; border: 1px solid #243049; border-radius: 4px;" />
        <button type="button" class="btn-open-rule-editor" title="Abrir no editor JS completo sobre o canvas" style="padding: 2px 6px; background: rgba(99, 102, 241, 0.2); border: 1px solid #6366f1; color: #818cf8; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </button>
      </div>
    `;

    modeSelect.addEventListener('change', (e: any) => {
      rule.evaluationMode = e.target.value;
      if (rule.evaluationMode === 'js_eval') {
        compFields.style.display = 'none';
        jsFields.style.display = 'flex';
      } else {
        compFields.style.display = 'flex';
        jsFields.style.display = 'none';
      }
    });

    compFields.querySelector('.rule-left')?.addEventListener('input', (e: any) => {
      rule.leftOperand = e.target.value;
    });
    compFields.querySelector('.rule-op')?.addEventListener('change', (e: any) => {
      rule.operator = e.target.value;
    });
    compFields.querySelector('.rule-right')?.addEventListener('input', (e: any) => {
      rule.rightOperand = e.target.value;
    });

    const jsInput = jsFields.querySelector('.rule-js-code') as HTMLInputElement;
    jsInput?.addEventListener('input', (e: any) => {
      rule.jsExpression = e.target.value;
    });

    jsFields.querySelector('.btn-open-rule-editor')?.addEventListener('click', () => {
      CodeEditorComponent.openCodeModal({
        title: `Expressão JavaScript (Regra #${ruleIdx + 1})`,
        language: 'javascript',
        value: rule.jsExpression || '',
        onSave: (newVal) => {
          rule.jsExpression = newVal;
          if (jsInput) jsInput.value = newVal;
          ctx.onNodeDataChanged();
          ctx.showToast('Expressão JS salva!', 'success');
        },
      });
    });

    ruleEl.appendChild(compFields);
    ruleEl.appendChild(jsFields);

    return ruleEl;
  }

  public static renderWhile(form: HTMLElement, data: any, ctx: FlowPropertiesContext): void {
    if (!Array.isArray(data.rules) || data.rules.length === 0) {
      data.rules = [
        {
          id: `rule_${Date.now()}_0`,
          evaluationMode: data.evaluationMode || (data.jsExpression && !data.operator ? 'js_eval' : 'comparison'),
          leftOperand: data.leftOperand || '',
          operator: data.operator || 'less_than',
          rightOperand: data.rightOperand || '',
          jsExpression: data.jsExpression || '',
        },
      ];
    }

    const whileContainer = document.createElement('div');
    whileContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;';
    header.innerHTML = `
      <label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Condições de Continuação (${data.rules.length})</label>
    `;
    whileContainer.appendChild(header);

    if (data.rules.length > 1) {
      const logicRow = document.createElement('div');
      logicRow.style.cssText =
        'display: flex; align-items: center; justify-content: space-between; background: #0f172a; padding: 6px 8px; border-radius: 4px; border: 1px solid #1e293b;';
      logicRow.innerHTML = '<span style="font-size: 11px; color: #94a3b8; font-weight: 600;">Combinar Expressões:</span>';

      const logicSelect = document.createElement('select');
      logicSelect.style.cssText =
        'padding: 3px 6px; font-size: 11px; background: #172033; color: white; border: 1px solid #243049; border-radius: 4px;';
      logicSelect.innerHTML = `
        <option value="and" ${(data.logicalOperator || 'and') === 'and' ? 'selected' : ''}>Satisfazer TODAS (E)</option>
        <option value="or" ${data.logicalOperator === 'or' ? 'selected' : ''}>Satisfazer QUALQUER UMA (OU)</option>
      `;
      logicSelect.addEventListener('change', (e: any) => {
        data.logicalOperator = e.target.value;
      });
      logicRow.appendChild(logicSelect);
      whileContainer.appendChild(logicRow);
    }

    const rulesContainer = document.createElement('div');
    rulesContainer.style.cssText = 'display: flex; flex-direction: column; gap: 6px;';

    data.rules.forEach((rule: any, ruleIdx: number) => {
      const ruleEl = this.createRuleEditorElement(rule, ruleIdx, data.rules.length, () => {
        data.rules.splice(ruleIdx, 1);
        if (data.rules.length === 0) {
          data.rules.push({
            id: `rule_${Date.now()}`,
            evaluationMode: 'comparison',
            leftOperand: '',
            operator: 'less_than',
            rightOperand: '',
          });
        }
        ctx.renderInspector();
      }, ctx);
      rulesContainer.appendChild(ruleEl);
    });

    whileContainer.appendChild(rulesContainer);

    const btnAddRule = document.createElement('button');
    btnAddRule.type = 'button';
    btnAddRule.className = 'btn-xs';
    btnAddRule.style.cssText =
      'width: 100%; padding: 5px; background: #1e293b; color: #93c5fd; border: 1px dashed #3b82f6; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: 600; margin-top: 4px;';
    btnAddRule.textContent = '+ Adicionar Outra Expressão / Condição';
    btnAddRule.addEventListener('click', () => {
      data.rules.push({
        id: `rule_${Date.now()}`,
        evaluationMode: 'comparison',
        leftOperand: '',
        operator: 'less_than',
        rightOperand: '',
        jsExpression: '',
      });
      ctx.renderInspector();
    });
    whileContainer.appendChild(btnAddRule);

    form.appendChild(whileContainer);

    InspectorInputHelpers.addNumberInput(
      form,
      'Limite Máximo de Iterações (Segurança)',
      data.maxIterations ?? 100,
      (val) => (data.maxIterations = val)
    );
  }

  public static renderFor(form: HTMLElement, data: any, ctx: FlowPropertiesContext): void {
    InspectorInputHelpers.addSelectInput(
      form,
      'Tipo de Loop',
      data.loopType || 'count',
      [
        { value: 'count', label: 'Contagem de Vezes' },
        { value: 'array', label: 'Iterar sobre Lista/Array' },
        { value: 'js_generator', label: 'Gerador / Expressão JS' },
      ],
      (val) => {
        data.loopType = val;
        ctx.renderInspector();
      }
    );

    if (data.loopType === 'count') {
      InspectorInputHelpers.addTextInput(
        form,
        'Contagem / Vezes (ex: 5 ou {{total}})',
        String(data.countExpression ?? 5),
        (val) => (data.countExpression = val)
      );
    } else if (data.loopType === 'js_generator') {
      InspectorInputHelpers.addCodeEditorInput(
        form,
        'Código JS (deve retornar um Array ou Número de vezes)',
        'javascript',
        data.jsExpression || '',
        (val) => (data.jsExpression = val),
        ctx.onNodeDataChanged,
        ctx.showToast,
        '180px'
      );
    } else {
      InspectorInputHelpers.addTextInput(
        form,
        'Expressão da Lista (ex: {{produtos}})',
        data.arrayExpression || '',
        (val) => (data.arrayExpression = val)
      );
    }

    InspectorInputHelpers.addTextInput(form, 'Variável do Item Atual', data.itemVarName || 'item', (val) => (data.itemVarName = val));
    InspectorInputHelpers.addTextInput(form, 'Variável do Índice Atual', data.indexVarName || 'index', (val) => (data.indexVarName = val));
    InspectorInputHelpers.addNumberInput(form, 'Limite Máximo de Iterações', data.maxIterations ?? 100, (val) => (data.maxIterations = val));
  }

  public static renderIfElement(form: HTMLElement, data: any): void {
    InspectorInputHelpers.addTextInput(form, 'Seletor do Elemento', data.selector || '', (val) => (data.selector = val));
    InspectorInputHelpers.addSelectInput(
      form,
      'Tipo de Seletor',
      data.selectorType || 'css',
      [
        { value: 'css', label: 'Seletor CSS' },
        { value: 'xpath', label: 'XPath' },
      ],
      (val) => (data.selectorType = val)
    );
    InspectorInputHelpers.addNumberInput(form, 'Tempo Limite de Espera (ms)', data.timeoutMs ?? 3000, (val) => (data.timeoutMs = val));
  }
}
