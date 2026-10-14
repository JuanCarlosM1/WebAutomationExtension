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
      this.ensureConditionGroups(c);

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

        // Construtor Visual de Condições Combinadas (Grupos E e OU)
        const groupsBuilder = this.renderConditionGroupsBuilder(c, ctx);
        body.appendChild(groupsBuilder);

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
        conditionGroups: [
          {
            id: `grp_${Date.now()}_0`,
            logicalOperator: 'and',
            nextOperator: 'or',
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
          },
        ],
      });
      ctx.expandedCaseIndices.add(newIdx);
      ctx.renderInspector(`.switch-case-card-item[data-case-index="${newIdx}"]`);
    });

    casesContainer.appendChild(btnAddCase);
    form.appendChild(casesContainer);
  }

  /**
   * Garante a inicialização consistente de conditionGroups a partir de dados existentes ou legados
   */
  private static ensureConditionGroups(target: any): void {
    if (!Array.isArray(target.conditionGroups) || target.conditionGroups.length === 0) {
      if (Array.isArray(target.rules) && target.rules.length > 0) {
        target.conditionGroups = [
          {
            id: `grp_${Date.now()}_0`,
            logicalOperator: target.logicalOperator || 'and',
            nextOperator: 'or',
            rules: JSON.parse(JSON.stringify(target.rules)),
          },
        ];
      } else {
        target.conditionGroups = [
          {
            id: `grp_${Date.now()}_0`,
            logicalOperator: 'and',
            nextOperator: 'or',
            rules: [
              {
                id: `rule_${Date.now()}_0`,
                evaluationMode: target.evaluationMode || (target.jsExpression && !target.operator ? 'js_eval' : 'comparison'),
                leftOperand: target.leftOperand || '',
                operator: target.operator || 'equals',
                rightOperand: target.rightOperand || '',
                jsExpression: target.jsExpression || '',
              },
            ],
          },
        ];
      }
    }
  }

  /**
   * Renderiza o construtor visual de grupos de condições com AND e OR:
   * ( (Expressão 1 AND Expressão 2) OU (Expressão 3 AND Expressão 4) OR Expressão 5 )
   */
  public static renderConditionGroupsBuilder(dataObj: any, ctx: FlowPropertiesContext): HTMLElement {
    this.ensureConditionGroups(dataObj);
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 8px; margin-top: 4px;';

    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
    header.innerHTML = `
      <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Lógica Combinada (E / OU)</span>
      <span style="font-size: 10px; color: #60a5fa;">${dataObj.conditionGroups.length} Grupo(s)</span>
    `;
    container.appendChild(header);

    dataObj.conditionGroups.forEach((group: any, gIdx: number) => {
      const isLastGroup = gIdx === dataObj.conditionGroups.length - 1;
      const groupEl = document.createElement('div');
      groupEl.style.cssText = 'background: #080d1a; border: 1px solid #1e293b; border-radius: 6px; padding: 8px; display: flex; flex-direction: column; gap: 6px;';

      // Header do grupo com seletor TODAS (E) ou QUALQUER UMA (OU)
      const groupHeader = document.createElement('div');
      groupHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';

      const titleAndLogic = document.createElement('div');
      titleAndLogic.style.cssText = 'display: flex; align-items: center; gap: 6px;';
      titleAndLogic.innerHTML = `
        <span style="font-size: 11px; font-weight: 700; color: #cbd5e1;">( Grupo #${gIdx + 1}:</span>
      `;

      const logicSelect = document.createElement('select');
      logicSelect.style.cssText = 'padding: 2px 6px; font-size: 10px; font-weight: 600; background: #172033; color: #93c5fd; border: 1px solid #3b82f6; border-radius: 4px; cursor: pointer;';
      logicSelect.innerHTML = `
        <option value="and" ${(group.logicalOperator || 'and') === 'and' ? 'selected' : ''}>Satisfazer TODAS (E / AND)</option>
        <option value="or" ${group.logicalOperator === 'or' ? 'selected' : ''}>Satisfazer QUALQUER UMA (OU / OR)</option>
      `;
      logicSelect.addEventListener('change', (e: any) => {
        group.logicalOperator = e.target.value;
        ctx.onNodeDataChanged();
      });
      titleAndLogic.appendChild(logicSelect);

      const closeBracketSpan = document.createElement('span');
      closeBracketSpan.style.cssText = 'font-size: 11px; font-weight: 700; color: #cbd5e1;';
      closeBracketSpan.textContent = ')';
      titleAndLogic.appendChild(closeBracketSpan);

      groupHeader.appendChild(titleAndLogic);

      if (dataObj.conditionGroups.length > 1) {
        const delGroupBtn = document.createElement('button');
        delGroupBtn.type = 'button';
        delGroupBtn.innerHTML = '&times; Excluir Grupo';
        delGroupBtn.style.cssText = 'background: transparent; color: #ef4444; border: none; font-size: 10px; font-weight: 600; cursor: pointer;';
        delGroupBtn.addEventListener('click', () => {
          dataObj.conditionGroups.splice(gIdx, 1);
          ctx.renderInspector();
          ctx.onNodeDataChanged();
        });
        groupHeader.appendChild(delGroupBtn);
      }

      groupEl.appendChild(groupHeader);

      // Lista de regras dentro deste grupo
      const rulesList = document.createElement('div');
      rulesList.style.cssText = 'display: flex; flex-direction: column; gap: 6px; padding-left: 4px;';

      if (!Array.isArray(group.rules) || group.rules.length === 0) {
        group.rules = [
          {
            id: `rule_${Date.now()}_0`,
            evaluationMode: 'comparison',
            leftOperand: '',
            operator: 'equals',
            rightOperand: '',
          },
        ];
      }

      group.rules.forEach((rule: any, rIdx: number) => {
        const ruleEl = this.createRuleEditorElement(
          rule,
          rIdx,
          group.rules.length,
          () => {
            group.rules.splice(rIdx, 1);
            if (group.rules.length === 0) {
              group.rules.push({
                id: `rule_${Date.now()}`,
                evaluationMode: 'comparison',
                leftOperand: '',
                operator: 'equals',
                rightOperand: '',
              });
            }
            ctx.renderInspector();
            ctx.onNodeDataChanged();
          },
          ctx
        );
        rulesList.appendChild(ruleEl);
      });

      groupEl.appendChild(rulesList);

      const btnAddRuleInGroup = document.createElement('button');
      btnAddRuleInGroup.type = 'button';
      btnAddRuleInGroup.className = 'btn-xs';
      btnAddRuleInGroup.style.cssText =
        'width: 100%; padding: 4px; background: rgba(59, 130, 246, 0.1); color: #93c5fd; border: 1px dashed #3b82f6; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: 600;';
      btnAddRuleInGroup.textContent = `+ Adicionar Expressão ao Grupo #${gIdx + 1}`;
      btnAddRuleInGroup.addEventListener('click', () => {
        group.rules.push({
          id: `rule_${Date.now()}`,
          evaluationMode: 'comparison',
          leftOperand: '',
          operator: 'equals',
          rightOperand: '',
          jsExpression: '',
        });
        ctx.renderInspector();
        ctx.onNodeDataChanged();
      });
      groupEl.appendChild(btnAddRuleInGroup);

      container.appendChild(groupEl);

      // Conector entre grupos (E / OU)
      if (!isLastGroup) {
        const connectorDiv = document.createElement('div');
        connectorDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 8px; margin: 2px 0;';

        const lineLeft = document.createElement('div');
        lineLeft.style.cssText = 'flex: 1; height: 1px; background: #334155;';
        const lineRight = document.createElement('div');
        lineRight.style.cssText = 'flex: 1; height: 1px; background: #334155;';

        const connectorSelect = document.createElement('select');
        connectorSelect.style.cssText = 'padding: 2px 8px; font-size: 10px; font-weight: 700; background: #1e293b; color: #f59e0b; border: 1px solid #d97706; border-radius: 12px; cursor: pointer; text-transform: uppercase;';
        connectorSelect.innerHTML = `
          <option value="or" ${(group.nextOperator || 'or') === 'or' ? 'selected' : ''}>OU (OR)</option>
          <option value="and" ${group.nextOperator === 'and' ? 'selected' : ''}>E (AND)</option>
        `;
        connectorSelect.addEventListener('change', (e: any) => {
          group.nextOperator = e.target.value;
          ctx.onNodeDataChanged();
        });

        connectorDiv.appendChild(lineLeft);
        connectorDiv.appendChild(connectorSelect);
        connectorDiv.appendChild(lineRight);
        container.appendChild(connectorDiv);
      }
    });

    const btnAddGroup = document.createElement('button');
    btnAddGroup.type = 'button';
    btnAddGroup.className = 'btn-xs';
    btnAddGroup.style.cssText =
      'width: 100%; padding: 6px; background: rgba(99, 102, 241, 0.15); color: #a5b4fc; border: 1px dashed #6366f1; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600; margin-top: 4px;';
    btnAddGroup.textContent = '+ Adicionar Outro Grupo ( (Expressão...) OU / E ...)';
    btnAddGroup.addEventListener('click', () => {
      dataObj.conditionGroups.push({
        id: `grp_${Date.now()}`,
        logicalOperator: 'and',
        nextOperator: 'or',
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
      });
      ctx.renderInspector();
      ctx.onNodeDataChanged();
    });
    container.appendChild(btnAddGroup);

    return container;
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
      'background: #0f172a; border: 1px solid #1e293b; border-radius: 5px; padding: 8px; display: flex; flex-direction: column; gap: 6px;';

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
      ctx.onNodeDataChanged();
    });

    compFields.querySelector('.rule-left')?.addEventListener('input', (e: any) => {
      rule.leftOperand = e.target.value;
      ctx.onNodeDataChanged();
    });
    compFields.querySelector('.rule-op')?.addEventListener('change', (e: any) => {
      rule.operator = e.target.value;
      ctx.onNodeDataChanged();
    });
    compFields.querySelector('.rule-right')?.addEventListener('input', (e: any) => {
      rule.rightOperand = e.target.value;
      ctx.onNodeDataChanged();
    });

    const jsInput = jsFields.querySelector('.rule-js-code') as HTMLInputElement;
    jsInput?.addEventListener('input', (e: any) => {
      rule.jsExpression = e.target.value;
      ctx.onNodeDataChanged();
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
    this.ensureConditionGroups(data);

    const whileContainer = document.createElement('div');
    whileContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

    // Construtor Visual de Condições Combinadas (Grupos E e OU)
    const groupsBuilder = this.renderConditionGroupsBuilder(data, ctx);
    whileContainer.appendChild(groupsBuilder);

    form.appendChild(whileContainer);

    InspectorInputHelpers.addNumberInput(
      form,
      'Limite Máximo de Iterações (Segurança)',
      data.maxIterations ?? 100,
      (val) => {
        data.maxIterations = val;
        ctx.onNodeDataChanged();
      }
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
    InspectorInputHelpers.addSelectorInput(form, 'Seletor do Elemento', data.selector || '', (val) => (data.selector = val));
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
