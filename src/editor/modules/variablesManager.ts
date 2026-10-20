/**
 * Gerenciador de Variáveis Globais e Constantes do Fluxo
 * Permite criar, listar, editar, remover e travar (tornar constante/readonly) variáveis do fluxo.
 */

import { WebAutomationGraph, WorkflowVariableDefinition } from '../../../../BibliotecaDeDev/src/types/schema';
import { showToast, showModalDialog } from './editorUtils';

export interface VariablesManagerCallbacks {
  getGraph: () => WebAutomationGraph;
  onVariablesChanged: () => void;
  showToast: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

export class VariablesManager {
  constructor(private callbacks: VariablesManagerCallbacks) {}

  /**
   * Garante que o grafo tenha a estrutura de definições de variáveis sincronizada
   */
  public ensureVariableDefinitions(): WorkflowVariableDefinition[] {
    const graph = this.callbacks.getGraph();
    if (!graph.variableDefinitions) {
      graph.variableDefinitions = [];
    }

    // Sincroniza caso existam chaves em graph.variables que não estejam em variableDefinitions
    if (graph.variables && typeof graph.variables === 'object') {
      for (const [key, val] of Object.entries(graph.variables)) {
        if (!graph.variableDefinitions.some((v) => v.name === key)) {
          let type: 'string' | 'number' | 'boolean' | 'json' | 'array' = 'string';
          if (Array.isArray(val)) type = 'array';
          else if (typeof val === 'number') type = 'number';
          else if (typeof val === 'boolean') type = 'boolean';
          else if (typeof val === 'object' && val !== null) type = 'json';

          graph.variableDefinitions.push({
            name: key,
            value: val,
            type,
            readonly: false,
          });
        }
      }
    }

    return graph.variableDefinitions;
  }

  /**
   * Sincroniza o dicionário simples graph.variables a partir de variableDefinitions
   */
  private syncSimpleVariables(): void {
    const graph = this.callbacks.getGraph();
    if (!graph.variables) {
      graph.variables = {};
    }
    const defs = this.ensureVariableDefinitions();
    // Limpa e repovoa
    const newVars: Record<string, any> = {};
    for (const d of defs) {
      newVars[d.name] = d.value;
    }
    graph.variables = newVars;
  }

  /**
   * Retorna a lista de todas as variáveis do fluxo
   */
  public getAllVariables(): WorkflowVariableDefinition[] {
    return this.ensureVariableDefinitions();
  }

  /**
   * Adiciona uma nova variável
   */
  public addVariable(def: WorkflowVariableDefinition): boolean {
    const graph = this.callbacks.getGraph();
    const defs = this.ensureVariableDefinitions();

    const cleanName = def.name.trim();
    if (!cleanName) {
      this.callbacks.showToast('O nome da variável não pode ser vazio.', 'warning');
      return false;
    }

    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(cleanName)) {
      this.callbacks.showToast('Nome de variável inválido. Use letras, números, _ ou $.', 'warning');
      return false;
    }

    if (defs.some((v) => v.name === cleanName)) {
      this.callbacks.showToast(`A variável "${cleanName}" já existe.`, 'warning');
      return false;
    }

    defs.push({
      name: cleanName,
      value: def.value,
      type: def.type || 'string',
      readonly: Boolean(def.readonly),
      description: def.description?.trim() || '',
    });

    this.syncSimpleVariables();
    this.callbacks.onVariablesChanged();
    this.callbacks.showToast(`Variável "${cleanName}" criada com sucesso!`, 'success');
    return true;
  }

  /**
   * Atualiza uma variável existente
   */
  public updateVariable(name: string, updates: Partial<WorkflowVariableDefinition>): boolean {
    const defs = this.ensureVariableDefinitions();
    const target = defs.find((v) => v.name === name);
    if (!target) return false;

    if (target.readonly && updates.value !== undefined && updates.value !== target.value && updates.readonly === undefined) {
      this.callbacks.showToast(`A variável "${name}" é uma constante protegida contra alterações.`, 'error');
      return false;
    }

    if (updates.value !== undefined) target.value = updates.value;
    if (updates.type !== undefined) target.type = updates.type;
    if (updates.readonly !== undefined) target.readonly = updates.readonly;
    if (updates.description !== undefined) target.description = updates.description;

    this.syncSimpleVariables();
    this.callbacks.onVariablesChanged();
    this.callbacks.showToast(`Variável "${name}" atualizada com sucesso.`, 'info');
    return true;
  }

  /**
   * Alterna a trava de constante/readonly de uma variável
   */
  public toggleReadonly(name: string): void {
    const defs = this.ensureVariableDefinitions();
    const target = defs.find((v) => v.name === name);
    if (!target) return;

    target.readonly = !target.readonly;
    this.syncSimpleVariables();
    this.callbacks.onVariablesChanged();
    const msg = target.readonly
      ? `Variável "${name}" agora é uma CONSTANTE protegida (somente leitura).`
      : `Variável "${name}" agora é MUTÁVEL (pode ser alterada por blocos).`;
    this.callbacks.showToast(msg, 'info');
  }

  /**
   * Remove uma variável
   */
  public deleteVariable(name: string): boolean {
    const defs = this.ensureVariableDefinitions();
    const index = defs.findIndex((v) => v.name === name);
    if (index === -1) return false;

    const item = defs[index];
    if (item.readonly) {
      const confirmForce = confirm(`A variável "${name}" está marcada como CONSTANTE protegida. Tem certeza que deseja removê-la?`);
      if (!confirmForce) return false;
    }

    defs.splice(index, 1);
    this.syncSimpleVariables();
    this.callbacks.onVariablesChanged();
    this.callbacks.showToast(`Variável "${name}" removida.`, 'info');
    return true;
  }

  /**
   * Renderiza a barra lateral dedicada de variáveis (sidebarVariables)
   */
  public renderVariablesSidebar(container?: HTMLElement): void {
    const target = container || document.getElementById('variablesSidebarContent');
    if (!target) return;
    target.innerHTML = '';

    const defs = this.ensureVariableDefinitions();

    // Top action card: Criar nova variável
    const newVarSection = document.createElement('div');
    newVarSection.style.cssText = 'background: #090d16; border: 1px solid #1e293b; border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 10px;';
    newVarSection.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 12px; font-weight: 700; color: #f1f5f9; display: flex; align-items: center; gap: 6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nova Variável do Fluxo
        </span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div>
          <label style="font-size: 11px; font-weight: 600; color: #94a3b8; display: block; margin-bottom: 4px;">Nome da Variável</label>
          <input type="text" id="newVarNameInput" placeholder="ex: apiUrl, tokenAuth, retryCount" style="width: 100%; box-sizing: border-box; background: #131c2e; border: 1px solid #243049; border-radius: 6px; padding: 7px 10px; color: #f8fafc; font-size: 12px; font-family: monospace;" />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label style="font-size: 11px; font-weight: 600; color: #94a3b8; display: block; margin-bottom: 4px;">Tipo de Dado</label>
            <select id="newVarTypeSelect" style="width: 100%; box-sizing: border-box; background: #131c2e; border: 1px solid #243049; border-radius: 6px; padding: 7px 10px; color: #f8fafc; font-size: 12px;">
              <option value="string">Texto (String)</option>
              <option value="number">Número (Number)</option>
              <option value="boolean">Booleano (Boolean)</option>
              <option value="array">Array (Lista de Itens)</option>
              <option value="json">JSON (Objeto)</option>
            </select>
          </div>
          <div>
            <label style="font-size: 11px; font-weight: 600; color: #94a3b8; display: block; margin-bottom: 4px;">Valor Inicial</label>
            <input type="text" id="newVarValueInput" placeholder="ex: [1, 2, 3] ou texto" style="width: 100%; box-sizing: border-box; background: #131c2e; border: 1px solid #243049; border-radius: 6px; padding: 7px 10px; color: #f8fafc; font-size: 12px;" />
          </div>
        </div>
        <div>
          <label style="font-size: 11px; font-weight: 600; color: #94a3b8; display: block; margin-bottom: 4px;">Descrição (Opcional)</label>
          <input type="text" id="newVarDescInput" placeholder="Para que serve esta variável..." style="width: 100%; box-sizing: border-box; background: #131c2e; border: 1px solid #243049; border-radius: 6px; padding: 7px 10px; color: #f8fafc; font-size: 12px;" />
        </div>
        <div style="background: rgba(30, 41, 59, 0.4); border: 1px solid #1e293b; border-radius: 6px; padding: 8px 10px; margin-top: 2px;">
          <label style="display: flex; align-items: flex-start; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="newVarReadonlyCheck" style="margin-top: 2px; accent-color: #f59e0b;" />
            <div>
              <span style="font-size: 12px; font-weight: 600; color: #f59e0b; display: flex; align-items: center; gap: 4px;">
                🔒 Impedir mudança dos dados (Constante / Somente Leitura)
              </span>
              <span style="font-size: 10px; color: #64748b; display: block; margin-top: 2px; line-height: 1.3;">
                Ao marcar esta opção, nenhum bloco (como set_variable ou scripts) poderá sobrescrever o valor desta variável durante a execução.
              </span>
            </div>
          </label>
        </div>
        <button type="button" id="btnCreateVariable" class="btn btn-primary" style="margin-top: 4px; padding: 8px 14px; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Adicionar Variável ao Fluxo
        </button>
      </div>
    `;

    target.appendChild(newVarSection);

    // Evento de criação
    const btnCreate = newVarSection.querySelector('#btnCreateVariable') as HTMLButtonElement;
    btnCreate?.addEventListener('click', () => {
      const nameInput = newVarSection.querySelector('#newVarNameInput') as HTMLInputElement;
      const typeSelect = newVarSection.querySelector('#newVarTypeSelect') as HTMLSelectElement;
      const valueInput = newVarSection.querySelector('#newVarValueInput') as HTMLInputElement;
      const descInput = newVarSection.querySelector('#newVarDescInput') as HTMLInputElement;
      const readonlyCheck = newVarSection.querySelector('#newVarReadonlyCheck') as HTMLInputElement;

      let rawVal: any = valueInput.value;
      const type = typeSelect.value as any;
      if (type === 'number') rawVal = Number(rawVal) || 0;
      else if (type === 'boolean') rawVal = rawVal === 'true' || rawVal === '1';
      else if (type === 'array') {
        try {
          const parsed = JSON.parse(rawVal || '[]');
          rawVal = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          const str = String(rawVal || '').trim();
          if (str) {
            rawVal = str.split(',').map((it) => it.trim()).filter((it) => it.length > 0);
          } else {
            rawVal = [];
          }
        }
      } else if (type === 'json') {
        try {
          rawVal = JSON.parse(rawVal || '{}');
        } catch {
          this.callbacks.showToast('JSON inválido no valor inicial.', 'error');
          return;
        }
      }

      const success = this.addVariable({
        name: nameInput.value,
        type,
        value: rawVal,
        readonly: readonlyCheck.checked,
        description: descInput.value,
      });

      if (success) {
        nameInput.value = '';
        valueInput.value = '';
        descInput.value = '';
        readonlyCheck.checked = false;
        this.renderVariablesSidebar(target);
      }
    });

    // Seção da lista de variáveis existentes
    const listHeader = document.createElement('div');
    listHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-top: 8px;';
    listHeader.innerHTML = `
      <span style="font-size: 12px; font-weight: 700; color: #cbd5e1; text-transform: uppercase;">
        Variáveis Cadastradas (${defs.length})
      </span>
      <span style="font-size: 11px; color: #64748b;">Arraste ou copie {{ $vars.nome }}</span>
    `;
    target.appendChild(listHeader);

    if (defs.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.style.cssText = 'background: #0f172a; border: 1px dashed #334155; border-radius: 8px; padding: 18px; text-align: center; color: #64748b; font-size: 12px;';
      emptyState.textContent = 'Nenhuma variável definida ainda neste fluxo.';
      target.appendChild(emptyState);
      return;
    }

    const listContainer = document.createElement('div');
    listContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

    defs.forEach((def) => {
      const card = document.createElement('div');
      const isLocked = !!def.readonly;
      const tagExpr = `{{ $vars.${def.name} }}`;
      card.draggable = true;
      card.title = `Arraste para soltar em qualquer campo ou copie (${tagExpr})`;
      card.style.cssText = `background: #0f172a; border: 1px solid ${isLocked ? '#f59e0b44' : '#1e293b'}; border-left: 3px solid ${isLocked ? '#f59e0b' : '#3b82f6'}; border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; cursor: grab; transition: opacity 0.2s;`;

      card.addEventListener('dragstart', (e) => {
        e.dataTransfer?.setData('text/plain', tagExpr);
        e.dataTransfer?.setData('application/x-n8n-tag', tagExpr);
        card.style.opacity = '0.5';
      });
      card.addEventListener('dragend', () => {
        card.style.opacity = '1';
      });

      let valPreview = '';
      if (def.type === 'array' && Array.isArray(def.value)) {
        valPreview = `Array(${def.value.length}): ${JSON.stringify(def.value)}`;
      } else if (typeof def.value === 'object') {
        valPreview = JSON.stringify(def.value);
      } else {
        valPreview = String(def.value ?? '');
      }

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-family: monospace; font-size: 12px; font-weight: 700; color: #60a5fa;">${def.name}</span>
            <span style="font-size: 10px; background: #1e293b; color: #94a3b8; padding: 1px 5px; border-radius: 4px; text-transform: uppercase;">${def.type || 'str'}</span>
            ${isLocked ? '<span style="font-size: 10px; background: rgba(245, 158, 11, 0.15); color: #f59e0b; padding: 1px 6px; border-radius: 4px; font-weight: 600;">🔒 Constante</span>' : ''}
          </div>
          <div style="display: flex; gap: 4px;">
            <button type="button" class="btn-copy-var" title="Copiar tag ${tagExpr}" style="background: #1e293b; border: 1px solid #334155; color: #cbd5e1; border-radius: 4px; padding: 2px 6px; font-size: 11px; cursor: pointer;">📋</button>
            <button type="button" class="btn-toggle-lock" title="${isLocked ? 'Desbloquear constante (tornar mutável)' : 'Travar como constante (impedir alteração)'}" style="background: ${isLocked ? 'rgba(245, 158, 11, 0.2)' : '#1e293b'}; border: 1px solid ${isLocked ? '#f59e0b' : '#334155'}; color: ${isLocked ? '#f59e0b' : '#94a3b8'}; border-radius: 4px; padding: 2px 6px; font-size: 11px; cursor: pointer;">${isLocked ? '🔒' : '🔓'}</button>
            <button type="button" class="btn-del-var" title="Excluir variável" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; border-radius: 4px; padding: 2px 6px; font-size: 11px; cursor: pointer;">✕</button>
          </div>
        </div>
        <div style="font-size: 11px; color: #cbd5e1; font-family: monospace; background: #090d16; padding: 4px 8px; border-radius: 4px; word-break: break-all; max-height: 50px; overflow-y: auto;">
          ${valPreview}
        </div>
        ${def.description ? `<div style="font-size: 10px; color: #64748b;">${def.description}</div>` : ''}
      `;

      card.querySelector('.btn-copy-var')?.addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(tagExpr);
        this.callbacks.showToast(`Tag ${tagExpr} copiada para a área de transferência!`, 'success');
      });

      card.querySelector('.btn-toggle-lock')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleReadonly(def.name);
        this.renderVariablesSidebar(target);
      });

      card.querySelector('.btn-del-var')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.deleteVariable(def.name)) {
          this.renderVariablesSidebar(target);
        }
      });

      listContainer.appendChild(card);
    });

    target.appendChild(listContainer);
  }
}
