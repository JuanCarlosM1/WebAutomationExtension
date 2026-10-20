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
import { DialogMenu } from '../dialogUtils';
import { CodeSyntaxHighlighter } from '../codeSyntaxHighlighter';

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

      // Separador visual de caminhos alternativos entre cada item
      if (index > 0) {
        const pathDivider = document.createElement('div');
        pathDivider.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 8px; margin: 4px 0;';
        pathDivider.innerHTML = `
          <div style="flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #334155, #334155);"></div>
          <span style="font-size: 8px; font-weight: 800; color: #64748b; letter-spacing: 0.8px; text-transform: uppercase; background: #0b1120; padding: 2px 8px; border-radius: 4px; border: 1px solid #1e293b;">CAMINHO ALTERNATIVO</span>
          <div style="flex: 1; height: 1px; background: linear-gradient(90deg, #334155, #334155, transparent);"></div>
        `;
        casesContainer.appendChild(pathDivider);
      }

      const isExpanded = ctx.expandedCaseIndices.has(index);
      const caseCard = document.createElement('div');
      caseCard.className = 'switch-case-card-item';
      caseCard.setAttribute('data-case-index', String(index));
      caseCard.style.cssText = `background: #0f172a; border: 1px solid ${isExpanded ? '#3b82f6' : '#1e293b'}; border-left: 4px solid ${isExpanded ? '#3b82f6' : '#6366f1'}; border-radius: 6px; overflow: hidden; transition: border-color 0.15s;`;

      const accordionHeader = document.createElement('div');
      accordionHeader.style.cssText = `padding: 8px 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: ${isExpanded ? '#1e293b70' : '#0f172a'}; user-select: none; gap: 8px;`;

      const headerLeft = document.createElement('div');
      headerLeft.style.cssText = 'display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0;';
      const iconSpan = document.createElement('span');
      iconSpan.style.cssText = 'font-size: 10px; color: #94a3b8; transition: transform 0.15s;';
      iconSpan.textContent = isExpanded ? '▼' : '▶';

      const titleSpan = document.createElement('span');
      titleSpan.style.cssText = `font-size: 12px; font-weight: ${isExpanded ? '600' : '500'}; color: ${isExpanded ? '#60a5fa' : '#cbd5e1'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
      titleSpan.textContent = c.label || `Caminho #${index + 1}`;

      headerLeft.appendChild(iconSpan);
      headerLeft.appendChild(titleSpan);

      const headerActions = document.createElement('div');
      headerActions.style.cssText = 'display: flex; align-items: center; gap: 4px;';

      // Botão para abrir o editor expandido deste caminho
      const btnExpandPath = document.createElement('button');
      btnExpandPath.type = 'button';
      btnExpandPath.title = 'Abrir editor expandido deste caminho (com seletor de caminhos)';
      btnExpandPath.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 3 21 3 21 9"></polyline>
          <polyline points="9 21 3 21 3 15"></polyline>
          <line x1="21" y1="3" x2="14" y2="10"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
      `;
      btnExpandPath.style.cssText =
        'background: transparent; color: #818cf8; border: none; font-size: 12px; cursor: pointer; line-height: 1; padding: 4px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; transition: color 0.15s;';
      btnExpandPath.addEventListener('mouseenter', () => (btnExpandPath.style.color = '#c7d2fe'));
      btnExpandPath.addEventListener('mouseleave', () => (btnExpandPath.style.color = '#818cf8'));
      btnExpandPath.addEventListener('click', (e) => {
        e.stopPropagation();
        FlowPropertiesRenderer.openExpandedPathModal(data, index, ctx);
      });

      const btnRename = document.createElement('button');
      btnRename.type = 'button';
      btnRename.title = 'Renomear este caminho';
      btnRename.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      `;
      btnRename.style.cssText =
        'background: transparent; color: #94a3b8; border: none; font-size: 12px; cursor: pointer; line-height: 1; padding: 4px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; transition: color 0.15s;';
      btnRename.addEventListener('mouseenter', () => (btnRename.style.color = '#38bdf8'));
      btnRename.addEventListener('mouseleave', () => (btnRename.style.color = '#94a3b8'));
      btnRename.addEventListener('click', async (e) => {
        e.stopPropagation();
        const currentName = c.label || `Caminho #${index + 1}`;
        const newName = await DialogMenu.prompt({
          title: 'Renomear Caminho Condicional',
          message: 'Digite o novo nome para este caminho:',
          defaultValue: currentName,
          placeholder: 'Ex: Sucesso, Status 200...',
          confirmText: 'Salvar Nome',
        });
        if (newName !== null && newName.trim()) {
          c.label = newName.trim();
          titleSpan.textContent = c.label;
          ctx.onNodeDataChanged();
          ctx.renderInspector();
        }
      });

      const btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.innerHTML = '&times;';
      btnDel.title = 'Remover este caminho';
      btnDel.style.cssText =
        'background: transparent; color: #ef4444; border: none; font-size: 16px; cursor: pointer; line-height: 1; padding: 2px 4px; transition: opacity 0.15s;';
      btnDel.addEventListener('click', async (e) => {
        e.stopPropagation();
        const caseName = c.label || `Caminho #${index + 1}`;
        const confirmed = await DialogMenu.confirm({
          title: 'Excluir Caminho do Switch',
          message: `Deseja realmente excluir o caminho "${caseName}"? Esta ação removerá o caminho e todas as condições associadas a ele.`,
          confirmText: 'Excluir Caminho',
          isDanger: true,
        });
        if (confirmed) {
          data.cases.splice(index, 1);
          ctx.onNodeDataChanged();
          ctx.renderInspector();
          ctx.showToast('Caminho removido com sucesso.', 'info');
        }
      });

      headerActions.appendChild(btnExpandPath);
      headerActions.appendChild(btnRename);
      headerActions.appendChild(btnDel);

      accordionHeader.appendChild(headerLeft);
      accordionHeader.appendChild(headerActions);

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
        body.style.cssText = 'padding: 12px; border-top: 1px solid #1e293b; display: flex; flex-direction: column; gap: 10px; background: rgba(15, 23, 42, 0.4);';

        // Campo de texto maior para o Nome / Rótulo do Caminho
        const pathNameGroup = document.createElement('div');
        pathNameGroup.style.cssText = 'display: flex; flex-direction: column; gap: 4px;';
        pathNameGroup.innerHTML = `
          <label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Nome do Caminho</label>
          <input type="text" class="switch-path-name-input" value="${c.label || ''}" placeholder="Ex: Caminho #${index + 1}, Sucesso, Status 200..." style="width: 100%; min-height: 38px; padding: 8px 12px; font-size: 13px; font-weight: 600; background: #172033; color: #f8fafc; border: 1px solid #243049; border-radius: 6px; outline: none; box-sizing: border-box; transition: border-color 0.2s;" />
        `;
        const pathInput = pathNameGroup.querySelector('.switch-path-name-input') as HTMLInputElement;
        pathInput?.addEventListener('focus', () => { pathInput.style.borderColor = '#6366f1'; });
        pathInput?.addEventListener('blur', () => { pathInput.style.borderColor = '#243049'; });
        pathInput?.addEventListener('input', (e: any) => {
          c.label = e.target.value;
          titleSpan.textContent = c.label || `Caminho #${index + 1}`;
          ctx.onNodeDataChanged();
        });
        body.appendChild(pathNameGroup);

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
        label: `Caminho #${newIdx + 1}`,
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
      groupEl.style.cssText = 'background: #080d1a; border: 1px solid #1e293b; border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px;';

      // Header do grupo: apenas o nome do grupo editável, sem instruções
      const groupHeader = document.createElement('div');
      groupHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; gap: 8px;';

      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.value = group.name || group.label || `Grupo ${gIdx + 1}`;
      nameInput.className = 'group-name-input';
      nameInput.placeholder = `Grupo ${gIdx + 1}`;
      nameInput.style.cssText = 'background: #172033; border: 1px solid #243049; color: #f1f5f9; font-size: 12px; font-weight: 700; padding: 6px 12px; min-height: 34px; border-radius: 6px; outline: none; flex: 1; max-width: 280px; box-sizing: border-box; transition: border-color 0.2s;';
      nameInput.addEventListener('focus', () => { nameInput.style.borderColor = '#6366f1'; });
      nameInput.addEventListener('blur', () => { nameInput.style.borderColor = '#243049'; });
      nameInput.addEventListener('input', (e: any) => {
        group.name = e.target.value;
        group.label = e.target.value;
        ctx.onNodeDataChanged();
      });

      groupHeader.appendChild(nameInput);

      if (dataObj.conditionGroups.length > 1) {
        const delGroupBtn = document.createElement('button');
        delGroupBtn.type = 'button';
        delGroupBtn.innerHTML = '&times; Excluir';
        delGroupBtn.style.cssText = 'background: transparent; color: #ef4444; border: none; font-size: 11px; font-weight: 600; cursor: pointer; padding: 2px 4px;';
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
        // Conector com a regra anterior (E / OU / Não E / Não OU), alternado com um clique
        if (rIdx === 0) {
          delete rule.connector;
        } else {
          if (!rule.connector) rule.connector = group.logicalOperator === 'or' ? 'or' : 'and';
          rulesList.appendChild(this.createConnectorButton(rule, ctx));
        }
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
      btnAddRuleInGroup.textContent = '+ Adicionar Expressão';
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

      // Conector entre grupos (E / OU / Não E / Não OU)
      if (!isLastGroup) {
        const connectorDiv = document.createElement('div');
        connectorDiv.className = 'group-separator';
        connectorDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 10px; margin: 12px 0;';

        const lineLeft = document.createElement('div');
        lineLeft.style.cssText = 'flex: 1; height: 0; border-top: 2px dashed #6366f190;';
        const lineRight = document.createElement('div');
        lineRight.style.cssText = 'flex: 1; height: 0; border-top: 2px dashed #6366f190;';

        const groupConnectorBtn = document.createElement('button');
        groupConnectorBtn.type = 'button';
        groupConnectorBtn.title = 'Clique para alternar operador entre grupos: E / OU / Não E / Não OU';

        const order = ['and', 'or', 'and_not', 'or_not'];
        const labels: Record<string, string> = { and: 'E', or: 'OU', and_not: 'NÃO E', or_not: 'NÃO OU' };
        const colors: Record<string, string> = { and: '#818cf8', or: '#f59e0b', and_not: '#ef4444', or_not: '#ec4899' };

        const refreshGroupBtn = () => {
          const cur = order.includes(group.nextOperator) ? group.nextOperator : 'or';
          groupConnectorBtn.textContent = `GRUPO: ${labels[cur]}`;
          groupConnectorBtn.style.cssText = `padding: 4px 14px; font-size: 10px; font-weight: 800; background: #1e1b4b; color: ${colors[cur]}; border: 1.5px solid ${colors[cur]}; border-radius: 16px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);`;
        };
        refreshGroupBtn();

        groupConnectorBtn.addEventListener('click', () => {
          const cur = order.includes(group.nextOperator) ? group.nextOperator : 'or';
          const idx = order.indexOf(cur);
          group.nextOperator = order[(idx + 1) % order.length];
          refreshGroupBtn();
          ctx.onNodeDataChanged();
        });

        connectorDiv.appendChild(lineLeft);
        connectorDiv.appendChild(groupConnectorBtn);
        connectorDiv.appendChild(lineRight);
        container.appendChild(connectorDiv);
      }
    });

    const btnAddGroup = document.createElement('button');
    btnAddGroup.type = 'button';
    btnAddGroup.className = 'btn-xs';
    btnAddGroup.style.cssText =
      'width: 100%; padding: 6px; background: rgba(99, 102, 241, 0.15); color: #a5b4fc; border: 1px dashed #6366f1; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600; margin-top: 4px;';
    btnAddGroup.textContent = '+ Adicionar Grupo';
    btnAddGroup.addEventListener('click', () => {
      dataObj.conditionGroups.push({
        id: `grp_${Date.now()}`,
        name: `Grupo ${dataObj.conditionGroups.length + 1}`,
        label: `Grupo ${dataObj.conditionGroups.length + 1}`,
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

  /**
   * Botão que alterna o conector de uma regra com a anterior: E → OU → Não E → Não OU → E ...
   */
  private static createConnectorButton(rule: any, ctx: FlowPropertiesContext): HTMLElement {
    const order = ['and', 'or', 'and_not', 'or_not'];
    const labels: Record<string, string> = { and: 'E', or: 'OU', and_not: 'NÃO E', or_not: 'NÃO OU' };
    const colors: Record<string, string> = { and: '#38bdf8', or: '#f59e0b', and_not: '#ef4444', or_not: '#ec4899' };

    const wrap = document.createElement('div');
    wrap.className = 'expression-separator';
    wrap.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 8px; margin: 3px 0;';
    const lineL = document.createElement('div');
    lineL.style.cssText = 'flex: 1; height: 0; border-top: 1px dotted rgba(56, 189, 248, 0.45);';
    const lineR = document.createElement('div');
    lineR.style.cssText = 'flex: 1; height: 0; border-top: 1px dotted rgba(56, 189, 248, 0.45);';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = 'Clique para alternar: E / OU / Não E / Não OU';
    const refresh = () => {
      const c = order.includes(rule.connector) ? rule.connector : 'and';
      btn.textContent = labels[c];
      btn.style.cssText = `padding: 2px 10px; font-size: 9px; font-weight: 700; background: #082f49; color: ${colors[c]}; border: 1px solid ${colors[c]}; border-radius: 8px; cursor: pointer; text-transform: uppercase;`;
    };
    refresh();
    btn.addEventListener('click', () => {
      const idx = order.indexOf(rule.connector);
      rule.connector = order[(idx + 1) % order.length];
      refresh();
      ctx.onNodeDataChanged();
    });

    wrap.appendChild(lineL);
    wrap.appendChild(btn);
    wrap.appendChild(lineR);
    return wrap;
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
      'background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 10px;';

    const mode = rule.evaluationMode || (rule.jsExpression && !rule.operator ? 'js_eval' : 'comparison');

    const ruleHeader = document.createElement('div');
    ruleHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
    ruleHeader.innerHTML = `
      <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Expressão #${ruleIdx + 1}</span>
    `;

    if (totalRules > 1) {
      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.innerHTML = '&times;';
      delBtn.title = 'Remover esta expressão';
      delBtn.style.cssText =
        'background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 16px; line-height: 1; padding: 0 4px;';
      delBtn.addEventListener('click', onDelete);
      ruleHeader.appendChild(delBtn);
    }
    ruleEl.appendChild(ruleHeader);

    // Seletor de Modo de Avaliação
    const modeSelectWrap = document.createElement('div');
    modeSelectWrap.style.cssText = 'display: flex; flex-direction: column; gap: 4px;';
    modeSelectWrap.innerHTML = `
      <label style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Tipo de Avaliação:</label>
    `;

    const modeSelect = document.createElement('select');
    modeSelect.className = 'rule-mode-select';
    modeSelect.style.cssText =
      'width: 100%; min-height: 36px; padding: 6px 12px; font-size: 12px; font-weight: 600; background: #172033; color: #f8fafc; border: 1px solid #243049; border-radius: 6px; outline: none; cursor: pointer; box-sizing: border-box;';
    modeSelect.innerHTML = `
      <option value="comparison" ${mode === 'comparison' ? 'selected' : ''}>Comparação de Valores</option>
      <option value="js_eval" ${mode === 'js_eval' ? 'selected' : ''}>Expressão / Código JS</option>
    `;
    modeSelectWrap.appendChild(modeSelect);
    ruleEl.appendChild(modeSelectWrap);

    // Campos de Comparação
    const compFields = document.createElement('div');
    compFields.className = 'rule-comparison-fields';
    compFields.style.cssText = `display: ${mode === 'comparison' ? 'flex' : 'none'}; flex-direction: column; gap: 8px;`;
    compFields.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <label style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Operando Esquerdo (variável ou valor)</label>
        <input type="text" placeholder="ex: {{status}}, {{item.id}}, {{contador}}" value="${rule.leftOperand || ''}" class="rule-left" style="width: 100%; min-height: 38px; padding: 8px 12px; font-size: 12px; font-family: var(--font-mono, monospace); background: #172033; color: white; border: 1px solid #243049; border-radius: 6px; box-sizing: border-box; outline: none; transition: border-color 0.2s;" />
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <label style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Operador de Comparação</label>
        <select class="rule-op" style="width: 100%; min-height: 38px; padding: 8px 12px; font-size: 12px; font-weight: 600; background: #172033; color: #93c5fd; border: 1px solid #243049; border-radius: 6px; box-sizing: border-box; cursor: pointer; outline: none;">
          <option value="equals" ${rule.operator === 'equals' ? 'selected' : ''}>Igual (==)</option>
          <option value="not_equals" ${rule.operator === 'not_equals' ? 'selected' : ''}>Diferente (!=)</option>
          <option value="contains" ${rule.operator === 'contains' ? 'selected' : ''}>Contém</option>
          <option value="not_contains" ${rule.operator === 'not_contains' ? 'selected' : ''}>Não Contém</option>
          <option value="greater_than" ${rule.operator === 'greater_than' ? 'selected' : ''}>Maior que (&gt;)</option>
          <option value="less_than" ${rule.operator === 'less_than' ? 'selected' : ''}>Menor que (&lt;)</option>
          <option value="greater_or_equal" ${rule.operator === 'greater_or_equal' ? 'selected' : ''}>Maior ou Igual (&gt;=)</option>
          <option value="less_or_equal" ${rule.operator === 'less_or_equal' ? 'selected' : ''}>Menor ou Igual (&lt;=)</option>
          <option value="is_empty" ${rule.operator === 'is_empty' ? 'selected' : ''}>Está Vazio</option>
          <option value="is_not_empty" ${rule.operator === 'is_not_empty' ? 'selected' : ''}>Não Está Vazio</option>
        </select>
      </div>
      <div class="rule-right-wrapper" style="display: ${rule.operator === 'is_empty' || rule.operator === 'is_not_empty' ? 'none' : 'flex'}; flex-direction: column; gap: 4px;">
        <label style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Operando Direito (valor de comparação)</label>
        <input type="text" placeholder="ex: 200, 'sucesso', true" value="${rule.rightOperand || ''}" class="rule-right" style="width: 100%; min-height: 38px; padding: 8px 12px; font-size: 12px; font-family: var(--font-mono, monospace); background: #172033; color: white; border: 1px solid #243049; border-radius: 6px; box-sizing: border-box; outline: none; transition: border-color 0.2s;" />
      </div>
    `;

    const leftInput = compFields.querySelector('.rule-left') as HTMLInputElement;
    leftInput?.addEventListener('input', (e: any) => {
      rule.leftOperand = e.target.value;
      ctx.onNodeDataChanged();
    });
    leftInput?.addEventListener('focus', () => { leftInput.style.borderColor = '#6366f1'; });
    leftInput?.addEventListener('blur', () => { leftInput.style.borderColor = '#243049'; });

    const rightWrapper = compFields.querySelector('.rule-right-wrapper') as HTMLElement;
    const rightInput = compFields.querySelector('.rule-right') as HTMLInputElement;
    rightInput?.addEventListener('input', (e: any) => {
      rule.rightOperand = e.target.value;
      ctx.onNodeDataChanged();
    });
    rightInput?.addEventListener('focus', () => { rightInput.style.borderColor = '#6366f1'; });
    rightInput?.addEventListener('blur', () => { rightInput.style.borderColor = '#243049'; });

    const opSelect = compFields.querySelector('.rule-op') as HTMLSelectElement;
    opSelect?.addEventListener('change', (e: any) => {
      rule.operator = e.target.value;
      const isUnary = rule.operator === 'is_empty' || rule.operator === 'is_not_empty';
      if (rightWrapper) rightWrapper.style.display = isUnary ? 'none' : 'flex';
      ctx.onNodeDataChanged();
    });

    // Campos de Código JS (não permite edição direta na barra lateral, apenas via Code Editor)
    const jsFields = document.createElement('div');
    jsFields.className = 'rule-js-fields';
    jsFields.style.cssText = `display: ${mode === 'js_eval' ? 'flex' : 'none'}; flex-direction: column; gap: 8px;`;

    InspectorInputHelpers.addCodeEditorInput(
      jsFields,
      `Expressão JavaScript (Expressão #${ruleIdx + 1})`,
      'javascript',
      rule.jsExpression || '',
      (newVal) => {
        rule.jsExpression = newVal;
        ctx.onNodeDataChanged();
      },
      ctx.onNodeDataChanged,
      ctx.showToast,
      '120px'
    );

    // Event listener crucial para alternar o modo entre Comparação e Código JS
    modeSelect.addEventListener('change', () => {
      const selectedMode = modeSelect.value;
      rule.evaluationMode = selectedMode;
      if (selectedMode === 'js_eval') {
        compFields.style.display = 'none';
        jsFields.style.display = 'flex';
        if (rule.jsExpression === undefined) {
          rule.jsExpression = '';
        }
      } else {
        compFields.style.display = 'flex';
        jsFields.style.display = 'none';
      }
      ctx.onNodeDataChanged();
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

  /**
   * Abre um editor expandido exclusivo para o caminho selecionado, permitindo alternar de caminho dentro do editor
   */
  public static openExpandedPathModal(data: any, initialPathIndex: number, ctx: FlowPropertiesContext): void {
    if (!Array.isArray(data.cases) || data.cases.length === 0) return;
    let currentIdx = Math.max(0, Math.min(initialPathIndex, data.cases.length - 1));

    const backdrop = document.createElement('div');
    backdrop.className = 'flow-modal-backdrop switch-path-modal-backdrop';
    backdrop.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(8, 12, 20, 0.82);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100000;
      padding: 16px;
      animation: fadeIn 0.15s ease-out;
    `;

    const card = document.createElement('div');
    card.className = 'switch-path-modal-card';
    card.style.cssText = `
      background: #090d16;
      border: 1px solid #6366f1;
      border-radius: 14px;
      width: 90%;
      max-width: 920px;
      height: 84vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(99, 102, 241, 0.3);
      overflow: hidden;
      animation: toastIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    const renderModal = () => {
      card.innerHTML = '';

      // Header
      const header = document.createElement('div');
      header.style.cssText = 'padding: 14px 20px; background: #0e1526; border-bottom: 1px solid #1e293b; display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-shrink: 0;';

      const headerLeft = document.createElement('div');
      headerLeft.style.cssText = 'display: flex; align-items: center; gap: 12px; flex: 1;';
      headerLeft.innerHTML = `
        <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(99, 102, 241, 0.2); border: 1px solid #6366f1; display: flex; align-items: center; justify-content: center; color: #818cf8; flex-shrink: 0;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span style="font-size: 13px; font-weight: 700; color: #f8fafc;">Editor de Caminho:</span>
          <select id="modalSwitchPathSelect" style="background: #1e293b; border: 1px solid #3b82f6; color: #93c5fd; font-weight: 700; font-size: 12px; padding: 4px 10px; border-radius: 6px; cursor: pointer; outline: none;">
            ${data.cases.map((c: any, i: number) => `<option value="${i}" ${i === currentIdx ? 'selected' : ''}>${c.label || `Caminho #${i + 1}`}</option>`).join('')}
          </select>
          <span style="font-size: 11px; color: #64748b; margin-left: 6px;">(Alterne entre caminhos diretamente por aqui)</span>
        </div>
      `;

      const btnCloseX = document.createElement('button');
      btnCloseX.type = 'button';
      btnCloseX.innerHTML = '&times;';
      btnCloseX.title = 'Fechar editor expandido';
      btnCloseX.style.cssText = 'background: transparent; border: none; color: #94a3b8; font-size: 22px; cursor: pointer; line-height: 1; padding: 2px 8px; border-radius: 4px;';
      btnCloseX.addEventListener('click', closeModal);

      header.appendChild(headerLeft);
      header.appendChild(btnCloseX);
      card.appendChild(header);

      // Body
      const body = document.createElement('div');
      body.style.cssText = 'flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 14px;';

      const currentPath = data.cases[currentIdx];
      if (currentPath) {
        // Campo de texto grande para o nome do caminho no modal expandido
        const modalPathNameGroup = document.createElement('div');
        modalPathNameGroup.style.cssText = 'background: #0d1527; border: 1px solid #1e293b; border-radius: 8px; padding: 14px 16px; display: flex; flex-direction: column; gap: 6px;';
        modalPathNameGroup.innerHTML = `
          <label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Nome do Caminho Selecionado:</label>
          <input type="text" id="modalCurrentPathLabel" value="${currentPath.label || ''}" placeholder="Ex: Sucesso, Erro 404, Status 200..." style="width: 100%; min-height: 40px; padding: 8px 14px; font-size: 14px; font-weight: 600; background: #172033; color: #f8fafc; border: 1px solid #3b82f6; border-radius: 6px; outline: none; box-sizing: border-box;" />
        `;
        const modalPathInput = modalPathNameGroup.querySelector('#modalCurrentPathLabel') as HTMLInputElement;
        modalPathInput?.addEventListener('input', (e: any) => {
          currentPath.label = e.target.value;
          const opt = card.querySelector(`#modalSwitchPathSelect option[value="${currentIdx}"]`);
          if (opt) opt.textContent = currentPath.label || `Caminho #${currentIdx + 1}`;
          ctx.onNodeDataChanged();
        });
        body.appendChild(modalPathNameGroup);

        const modalCtx: FlowPropertiesContext = {
          ...ctx,
          renderInspector: () => {
            renderModal();
            ctx.renderInspector();
          },
          onNodeDataChanged: () => {
            ctx.onNodeDataChanged();
          },
        };
        const builder = FlowPropertiesRenderer.renderConditionGroupsBuilder(currentPath, modalCtx);
        body.appendChild(builder);
      }

      card.appendChild(body);

      // Footer
      const footer = document.createElement('div');
      footer.style.cssText = 'padding: 12px 20px; background: #0e1526; border-top: 1px solid #1e293b; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;';
      footer.innerHTML = `
        <span style="font-size: 11px; color: #64748b;">Todas as alterações nas expressões e grupos deste caminho são salvas automaticamente.</span>
        <button id="btnDoneSwitchPathModal" class="btn btn-primary" style="padding: 7px 20px; font-size: 12px; font-weight: 600;">Concluir e Fechar</button>
      `;
      footer.querySelector('#btnDoneSwitchPathModal')?.addEventListener('click', closeModal);

      card.appendChild(footer);

      // Listener do select de caminhos
      card.querySelector('#modalSwitchPathSelect')?.addEventListener('change', (e: any) => {
        currentIdx = Number(e.target.value);
        renderModal();
      });
    };

    const closeModal = () => {
      backdrop.remove();
      ctx.renderInspector();
      ctx.onNodeDataChanged();
    };

    backdrop.appendChild(card);
    document.body.appendChild(backdrop);
    renderModal();
  }
}
