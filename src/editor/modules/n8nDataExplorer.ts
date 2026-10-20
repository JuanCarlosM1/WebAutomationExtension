/**
 * Explorador de Dados e Variáveis estilo N8N para o Editor Expandido
 * Permite visualizar dados de nós anteriores ($node e $json) e variáveis ($vars),
 * além de copiar ou inserir expressões com 1 clique nos campos em edição.
 */

import { AnyAutomationNode, WebAutomationGraph, WorkflowVariableDefinition } from '../../../../BibliotecaDeDev/src/types/schema';

export interface N8NDataExplorerOptions {
  graph: WebAutomationGraph;
  currentNode: AnyAutomationNode;
  runtimeNodeOutputs?: Record<string, any>;
  onInsertExpression: (expression: string) => void;
  onShowToast: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  onSaveNodeMockOutput?: (nodeId: string, outputData: any) => void;
}

export class N8NDataExplorer {
  /**
   * Encontra nós predecessores ao nó atual no grafo (caminho upstream)
   */
  public static getPredecessorNodes(graph: WebAutomationGraph, targetNodeId: string): { direct: AnyAutomationNode[]; ancestors: AnyAutomationNode[] } {
    const directIds = new Set<string>();
    for (const edge of graph.edges) {
      if (edge.target === targetNodeId) {
        directIds.add(edge.source);
      }
    }

    const allAncestorIds = new Set<string>();
    const queue = Array.from(directIds);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (!allAncestorIds.has(currentId)) {
        allAncestorIds.add(currentId);
        for (const edge of graph.edges) {
          if (edge.target === currentId && !allAncestorIds.has(edge.source)) {
            queue.push(edge.source);
          }
        }
      }
    }

    const directNodes = graph.nodes.filter((n) => directIds.has(n.id));
    const ancestorNodes = graph.nodes.filter((n) => allAncestorIds.has(n.id) && !directIds.has(n.id));

    return { direct: directNodes, ancestors: ancestorNodes };
  }

  /**
   * Gera uma amostra padrão estruturada de acordo com o tipo de bloco para quando o usuário optar por dados simulados
   */
  public static generateDefaultMock(node: AnyAutomationNode): any {
    const data = node.data as any;
    const now = Date.now();
    const isoDate = new Date(now).toISOString();

    switch (node.type) {
      case 'start':
        return {
          started: true,
          trigger: data.triggerType || (data.triggers?.[0]?.type) || 'manual',
          url: 'https://exemplo.com/pagina',
          currentUrl: 'https://exemplo.com/pagina',
          timestamp: now,
          isoDate,
          variables: {},
        };

      case 'delay':
        return {
          delayed: true,
          delayedMs: data.fixedMs ?? 1500,
          delayedSeconds: Number(((data.fixedMs ?? 1500) / 1000).toFixed(2)),
          isRandom: Boolean(data.isRandom),
          completedAt: now,
          isoDate,
        };

      case 'switch':
        return {
          matched: true,
          matchedCase: data.cases?.[0]?.id || 'case_1',
          matchedCaseId: data.cases?.[0]?.id || 'case_1',
          matchedCaseLabel: data.cases?.[0]?.label || 'Caso 1',
          branch: data.cases?.[0]?.id || 'case_1',
          evaluatedAt: now,
        };

      case 'while_loop':
        return {
          completed: true,
          iterations: 5,
          maxIterationsReached: false,
          completedAt: now,
        };

      case 'for_loop':
        return {
          completed: true,
          totalIterations: typeof data.countExpression === 'number' ? data.countExpression : 10,
          loopType: data.loopType || 'count',
          itemVar: data.itemVarName || 'item',
          indexVar: data.indexVarName || 'index',
          completedAt: now,
        };

      case 'if_element_exists':
        return {
          exists: true,
          selector: data.selector || '.btn-primary',
          selectorType: data.selectorType || 'css',
          branch: 'true',
          checkedAt: now,
        };

      case 'try_catch':
        return {
          succeeded: true,
          branch: 'try_body',
          error: null,
          errorVar: data.errorVarName || 'lastError',
          completedAt: now,
        };

      case 'navigate':
        return {
          navigated: true,
          url: data.url || 'https://exemplo.com',
          currentUrl: data.url || 'https://exemplo.com',
          requestedUrl: data.url || 'https://exemplo.com',
          waitUntil: data.waitUntil || 'load',
          timestamp: now,
        };

      case 'tab_action':
        return {
          success: true,
          action: data.action || 'new_tab',
          tabId: 2,
          url: data.url || 'https://exemplo.com',
          currentUrl: data.url || 'https://exemplo.com',
          timestamp: now,
        };

      case 'history_navigation':
        return {
          navigated: true,
          action: data.action || 'reload',
          currentUrl: 'https://exemplo.com',
          url: 'https://exemplo.com',
          ignoreCache: Boolean(data.ignoreCache),
          timestamp: now,
        };

      case 'click_element':
        return {
          clicked: true,
          selector: data.selector || 'button',
          selectorType: data.selectorType || 'css',
          clickType: data.clickType || 'single',
          coordinates: null,
          currentUrl: 'https://exemplo.com',
          url: 'https://exemplo.com',
          timestamp: now,
        };

      case 'type_input':
        return {
          typed: true,
          selector: data.selector || 'input',
          selectorType: data.selectorType || 'css',
          text: data.text || 'Texto Exemplo',
          value: data.text || 'Texto Exemplo',
          textLength: (data.text || 'Texto Exemplo').length,
          mode: data.mode || 'human_typing',
          clearedBefore: Boolean(data.clearBeforeTyping),
          pressedEnter: Boolean(data.pressEnterAfter),
          timestamp: now,
        };

      case 'press_key':
        return {
          pressed: true,
          key: data.key || 'Enter',
          modifiers: data.modifiers || [],
          selector: data.selector || null,
          selectorType: data.selectorType || 'css',
          timestamp: now,
        };

      case 'hover_focus':
        return {
          success: true,
          action: data.action || 'hover',
          selector: data.selector || '.card',
          selectorType: data.selectorType || 'css',
          timestamp: now,
        };

      case 'scroll':
        return {
          scrolled: true,
          target: data.target || 'bottom',
          selector: data.selector || null,
          selectorType: data.selectorType || 'css',
          deltaX: data.deltaX ?? 0,
          deltaY: data.deltaY ?? 500,
          smooth: Boolean(data.smooth !== false),
          timestamp: now,
        };

      case 'wait_for_element':
        return {
          found: true,
          selector: data.selector || '#element',
          selectorType: data.selectorType || 'css',
          state: data.state || 'visible',
          timeoutMs: data.timeoutMs || 5000,
          timestamp: now,
        };

      case 'set_variable': {
        const vName = data.varName || 'meuDado';
        const vVal = data.valueExpression || 'valor';
        return {
          varName: vName,
          value: vVal,
          [vName]: vVal,
          type: typeof vVal,
          isReadonly: Boolean(data.readonly),
          updatedAt: now,
        };
      }

      case 'extract_data': {
        const sampleText = 'Exemplo de texto capturado no DOM';
        const result: Record<string, any> = {
          value: sampleText,
          extracted: sampleText,
          selector: data.selector || 'h1',
          selectorType: data.selectorType || 'css',
          extractType: data.extractType || 'innerText',
          attributeName: data.attributeName || null,
          length: sampleText.length,
          extractedAt: now,
        };
        if (data.saveToVar) {
          result[data.saveToVar] = sampleText;
        }
        return result;
      }

      case 'scrape_list': {
        const sampleItems = [
          { id: 1, titulo: 'Produto A', preco: 'R$ 99,00' },
          { id: 2, titulo: 'Produto B', preco: 'R$ 149,00' },
        ];
        const result: Record<string, any> = {
          items: sampleItems,
          count: sampleItems.length,
          total: sampleItems.length,
          firstItem: sampleItems[0],
          lastItem: sampleItems[1],
          fields: (data.fields || []).map((f: any) => f.name || 'campo'),
          selector: data.selector || '.card',
          scrapedAt: now,
        };
        if (data.saveToVar) {
          result[data.saveToVar] = sampleItems;
        }
        return result;
      }

      case 'http_request': {
        const sampleData = { id: 101, name: 'Resultado da API', success: true };
        const result: Record<string, any> = {
          data: sampleData,
          response: sampleData,
          status: 200,
          statusText: 'OK',
          ok: true,
          headers: { 'content-type': 'application/json' },
          url: data.url || 'https://api.exemplo.com/dados',
          method: data.method || 'GET',
          timestamp: now,
        };
        if (data.saveResponseToVar) {
          result[data.saveResponseToVar] = sampleData;
        }
        if (data.saveStatusToVar) {
          result[data.saveStatusToVar] = 200;
        }
        return result;
      }

      case 'export_file':
        return {
          exported: true,
          filename: data.filename || 'dados.json',
          format: data.format || 'json',
          size: 1024,
          mimeType: data.format === 'csv' ? 'text/csv' : 'application/json',
          sourceVar: data.sourceVar || 'items',
          itemsCount: 10,
          timestamp: now,
        };

      case 'inject_javascript': {
        const sampleResult = { status: 'ok', data: 'Executado com sucesso' };
        const result: Record<string, any> = {
          ...sampleResult,
          result: sampleResult,
          executed: true,
          context: data.context || 'content_script',
          timestamp: now,
        };
        if (data.saveResultToVar) {
          result[data.saveResultToVar] = sampleResult;
        }
        return result;
      }

      case 'inject_html':
        return {
          injected: true,
          targetSelector: data.targetSelector || 'body',
          selectorType: data.selectorType || 'css',
          position: data.position || 'beforeend',
          htmlLength: (data.html || '').length,
          timestamp: now,
        };

      case 'inject_css':
        return {
          injected: true,
          target: data.target || 'page',
          styleId: data.styleId || 'custom-style',
          cssLength: (data.css || '').length,
          timestamp: now,
        };

      case 'web_component':
        return {
          injected: true,
          containerId: data.containerId || 'custom-widget',
          mode: data.mode || 'shadow_dom',
          hasScript: Boolean(data.js),
          hasStyle: Boolean(data.css),
          timestamp: now,
        };

      default:
        return { success: true, timestamp: now };
    }
  }

  /**
   * Obtém os dados de saída de um nó diferenciando dados reais de dados simulados (mock).
   * Mock NÃO é mais regra/forçado por padrão: só é retornado se o usuário tiver habilitado explicitamente.
   */
  public static getNodeOutputResult(
    node: AnyAutomationNode,
    runtimeOutputs?: Record<string, any>
  ): { data: any; source: 'runtime' | 'mock' | 'none' } {
    // 1. Dados reais em memória da última execução
    if (runtimeOutputs && runtimeOutputs[node.id] !== undefined) {
      return { data: runtimeOutputs[node.id], source: 'runtime' };
    }
    const data = node.data as any;
    // 2. Dados reais persistidos no grafo
    if (data.lastOutput !== undefined) {
      return { data: data.lastOutput, source: 'runtime' };
    }
    // 3. Dados simulados (Mock) apenas se explicitamente habilitado pelo usuário
    if (data.useMockOutput) {
      if (data.outputData !== undefined) {
        return { data: data.outputData, source: 'mock' };
      }
      return { data: this.generateDefaultMock(node), source: 'mock' };
    }
    // 4. Sem dados reais nem mock habilitado
    return { data: null, source: 'none' };
  }

  public static getNodeOutputData(node: AnyAutomationNode, runtimeOutputs?: Record<string, any>): any {
    return this.getNodeOutputResult(node, runtimeOutputs).data;
  }

  /**
   * Renderiza o painel do explorador de dados no container
   */
  public static render(container: HTMLElement, options: N8NDataExplorerOptions): void {
    container.innerHTML = '';

    const { graph, currentNode, runtimeNodeOutputs, onInsertExpression, onShowToast, onSaveNodeMockOutput } = options;

    const { direct, ancestors } = this.getPredecessorNodes(graph, currentNode.id);
    const allPredecessors = [...direct, ...ancestors];

    // Variáveis
    const variables: WorkflowVariableDefinition[] = graph.variableDefinitions || [];
    if (graph.variables && variables.length === 0) {
      for (const [k, v] of Object.entries(graph.variables)) {
        variables.push({ name: k, value: v, type: typeof v as any, readonly: false });
      }
    }

    let activeTab: 'predecessors' | 'variables' = 'predecessors';
    let searchQuery = '';

    const rootWrapper = document.createElement('div');
    rootWrapper.style.cssText = 'display: flex; flex-direction: column; height: 100%; gap: 10px; font-family: inherit;';

    // Header com busca e abas
    const headerEl = document.createElement('div');
    headerEl.style.cssText = 'display: flex; flex-direction: column; gap: 8px; border-bottom: 1px solid #1e293b; padding-bottom: 10px;';

    headerEl.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 12px; font-weight: 700; color: #f8fafc; display: flex; align-items: center; gap: 6px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
          Dados Anteriores & Variáveis (N8N)
        </span>
        <span style="font-size: 10px; color: #64748b;">Arraste ou clique para inserir</span>
      </div>
      <div style="position: relative;">
        <input type="text" id="n8nExplorerSearch" placeholder="Filtrar campos ou variáveis..." style="
          width: 100%;
          box-sizing: border-box;
          background: #0b0f19;
          border: 1px solid #1e293b;
          border-radius: 6px;
          padding: 6px 10px;
          color: #f8fafc;
          font-size: 11px;
          outline: none;
        " />
      </div>
      <div style="display: flex; gap: 4px; background: #0b0f19; padding: 3px; border-radius: 6px; border: 1px solid #1e293b;">
        <button type="button" id="tabPredecessorsBtn" style="
          flex: 1;
          padding: 5px 8px;
          border: none;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          background: #1e293b;
          color: #60a5fa;
          transition: all 0.15s;
        ">Blocos Anteriores (${allPredecessors.length})</button>
        <button type="button" id="tabVarsBtn" style="
          flex: 1;
          padding: 5px 8px;
          border: none;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          background: transparent;
          color: #94a3b8;
          transition: all 0.15s;
        ">Variáveis ($vars) (${variables.length})</button>
      </div>
    `;

    rootWrapper.appendChild(headerEl);

    // Container de conteúdo com scroll
    const contentList = document.createElement('div');
    contentList.style.cssText = 'flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 4px;';
    rootWrapper.appendChild(contentList);

    // Ao abrir um bloco, apenas os dados do bloco imediatamente anterior (direto) devem iniciar expandidos
    const expandedNodeIds = new Set<string>();
    if (direct.length > 0) {
      direct.forEach((d) => expandedNodeIds.add(d.id));
    } else if (allPredecessors.length > 0) {
      expandedNodeIds.add(allPredecessors[0].id);
    }

    const renderContent = () => {
      contentList.innerHTML = '';
      const query = searchQuery.toLowerCase().trim();

      if (activeTab === 'predecessors') {
        if (allPredecessors.length === 0) {
          const empty = document.createElement('div');
          empty.style.cssText = 'background: #0b0f19; border: 1px dashed #334155; border-radius: 8px; padding: 16px; text-align: center; color: #64748b; font-size: 11px;';
          empty.innerHTML = `
            <div style="font-size: 18px; margin-bottom: 4px;">🔗</div>
            <div>Nenhum bloco anterior conectado a este bloco.</div>
            <div style="font-size: 10px; color: #475569; margin-top: 4px;">Conecte as saídas de outros blocos à entrada deste para compartilhar dados estilo N8N.</div>
          `;
          contentList.appendChild(empty);
          return;
        }

        // Barra de ação rápida para expandir/recolher todos
        if (allPredecessors.length > 1) {
          const actionsBar = document.createElement('div');
          actionsBar.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 2px 4px; font-size: 10px; color: #64748b; margin-bottom: 2px;';
          actionsBar.innerHTML = `
            <span>${allPredecessors.length} blocos precedentes</span>
            <div style="display: flex; gap: 8px;">
              <button type="button" id="btnExpandAllPreds" style="background: none; border: none; color: #60a5fa; cursor: pointer; padding: 0; font-size: 10px;">Expandir todos</button>
              <span style="color: #334155;">•</span>
              <button type="button" id="btnCollapseAllPreds" style="background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0; font-size: 10px;">Recolher todos</button>
            </div>
          `;
          actionsBar.querySelector('#btnExpandAllPreds')?.addEventListener('click', () => {
            allPredecessors.forEach((p) => expandedNodeIds.add(p.id));
            renderContent();
          });
          actionsBar.querySelector('#btnCollapseAllPreds')?.addEventListener('click', () => {
            expandedNodeIds.clear();
            renderContent();
          });
          contentList.appendChild(actionsBar);
        }

        allPredecessors.forEach((pred) => {
          const isDirect = direct.some((d) => d.id === pred.id);
          const nodeLabel = pred.data?.label || pred.type;
          const outputResult = N8NDataExplorer.getNodeOutputResult(pred, runtimeNodeOutputs);
          const outputData = outputResult.data;

          // Propriedades e busca
          let properties: { path: string; value: any; type: string }[] = [];
          let filteredProps: { path: string; value: any; type: string }[] = [];
          if (outputData) {
            properties = N8NDataExplorer.flattenObject(outputData);
            filteredProps = properties.filter((p) => {
              if (!query) return true;
              return (
                p.path.toLowerCase().includes(query) ||
                nodeLabel.toLowerCase().includes(query) ||
                String(p.value).toLowerCase().includes(query)
              );
            });
          }

          let isExpanded = expandedNodeIds.has(pred.id);
          // Se houver busca ativa e o nó tiver correspondências, expande automaticamente
          if (query && (filteredProps.length > 0 || nodeLabel.toLowerCase().includes(query))) {
            isExpanded = true;
          }

          // Card do bloco
          const blockCard = document.createElement('div');
          blockCard.style.cssText = 'background: #0b0f19; border: 1px solid #1e293b; border-radius: 8px; overflow: hidden;';

          const cardHeader = document.createElement('div');
          cardHeader.style.cssText = `
            padding: 8px 10px;
            background: #111827;
            ${isExpanded ? 'border-bottom: 1px solid #1e293b;' : ''}
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            cursor: pointer;
            user-select: none;
            transition: background 0.15s ease;
          `;
          cardHeader.addEventListener('mouseenter', () => (cardHeader.style.background = '#172033'));
          cardHeader.addEventListener('mouseleave', () => (cardHeader.style.background = '#111827'));

          cardHeader.innerHTML = `
            <div style="display: flex; align-items: center; gap: 6px; min-width: 0; flex-wrap: wrap;">
              <span class="pred-accordion-chevron" style="display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; transition: transform 0.2s ease; transform: ${isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'}; color: #818cf8;">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </span>
              <span style="font-size: 11px; font-weight: 700; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${nodeLabel}</span>
              <span style="font-size: 9px; background: #1e293b; color: #818cf8; padding: 1px 4px; border-radius: 3px; text-transform: uppercase;">${pred.type}</span>
              ${isDirect ? '<span style="font-size: 9px; background: rgba(16, 185, 129, 0.15); color: #34d399; padding: 1px 4px; border-radius: 3px; font-weight: 600;" title="Bloco imediatamente anterior">$json</span>' : ''}
              ${
                outputResult.source === 'runtime'
                  ? '<span style="font-size: 9px; background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 1px 5px; border-radius: 3px; font-weight: 600;" title="Dados reais da última execução">🟢 Real</span>'
                  : outputResult.source === 'mock'
                  ? '<span style="font-size: 9px; background: rgba(245, 158, 11, 0.2); color: #f59e0b; padding: 1px 5px; border-radius: 3px; font-weight: 600;" title="Dados simulados (Mock habilitado)">🟡 Mock</span>'
                  : '<span style="font-size: 9px; background: rgba(100, 116, 139, 0.2); color: #94a3b8; padding: 1px 5px; border-radius: 3px;" title="Nenhum dado real registrado ainda">⚪ Sem dados</span>'
              }
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <button type="button" class="btn-copy-node-all" title="Copiar acesso a todo o objeto: {{ $node['${nodeLabel}'].json }}" style="
                background: #1e293b; border: 1px solid #334155; color: #94a3b8; border-radius: 4px; padding: 2px 6px; font-size: 10px; cursor: pointer;
              ">Copiar Nó</button>
            </div>
          `;

          cardHeader.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).closest('.btn-copy-node-all') || (e.target as HTMLElement).closest('.btn-enable-pred-mock')) {
              return;
            }
            if (expandedNodeIds.has(pred.id)) {
              expandedNodeIds.delete(pred.id);
            } else {
              expandedNodeIds.add(pred.id);
            }
            renderContent();
          });

          cardHeader.querySelector('.btn-copy-node-all')?.addEventListener('click', (e) => {
            e.stopPropagation();
            const expr = `{{ $node["${nodeLabel}"].json }}`;
            navigator.clipboard.writeText(expr);
            onShowToast(`Copiado: ${expr}`, 'success');
          });

          blockCard.appendChild(cardHeader);

          // Propriedades do outputData renderizadas quando expandido
          if (isExpanded) {
            const bodyEl = document.createElement('div');
            bodyEl.style.cssText = 'padding: 8px; display: flex; flex-direction: column; gap: 4px; font-family: monospace; font-size: 11px;';

            if (outputResult.source === 'none' || !outputData) {
              bodyEl.innerHTML = `
                <div style="padding: 10px; background: #080c14; border-radius: 4px; display: flex; flex-direction: column; gap: 6px; text-align: center;">
                  <span style="font-size: 11px; color: #64748b;">Nenhuma execução registrada para este bloco ainda.</span>
                  <button type="button" class="btn-enable-pred-mock" style="margin: 0 auto; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); color: #f59e0b; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; cursor: pointer;">
                    ⚡ Habilitar dados simulados (Mock)
                  </button>
                </div>
              `;
              bodyEl.querySelector('.btn-enable-pred-mock')?.addEventListener('click', (e) => {
                e.stopPropagation();
                (pred.data as any).useMockOutput = true;
                (pred.data as any).outputData = N8NDataExplorer.generateDefaultMock(pred);
                onSaveNodeMockOutput?.(pred.id, (pred.data as any).outputData);
                onShowToast(`Dados simulados ativados para "${nodeLabel}"`, 'info');
                renderContent();
              });
            } else {
              if (filteredProps.length === 0) {
                bodyEl.innerHTML = '<div style="color: #64748b; font-size: 10px; padding: 4px;">Nenhum campo correspondente à busca.</div>';
              } else {
                filteredProps.forEach((prop) => {
                  const row = document.createElement('div');
                  const tagExpr = isDirect ? `{{ $json.${prop.path} }}` : `{{ $node["${nodeLabel}"].json.${prop.path} }}`;
                  const valDisplay = typeof prop.value === 'object' ? JSON.stringify(prop.value) : String(prop.value);

                  row.draggable = true;
                  row.title = `Arraste para soltar no campo desejado ou clique em + Inserir (${tagExpr})`;
                  row.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 6px;
                    padding: 4px 6px;
                    background: #080c14;
                    border: 1px solid #1a2333;
                    border-radius: 4px;
                    cursor: grab;
                    transition: border-color 0.15s, opacity 0.2s;
                  `;
                  row.addEventListener('mouseenter', () => (row.style.borderColor = '#3b82f6'));
                  row.addEventListener('mouseleave', () => (row.style.borderColor = '#1a2333'));

                  row.addEventListener('dragstart', (e) => {
                    e.dataTransfer?.setData('text/plain', tagExpr);
                    e.dataTransfer?.setData('application/x-n8n-tag', tagExpr);
                    row.style.opacity = '0.5';
                  });
                  row.addEventListener('dragend', () => {
                    row.style.opacity = '1';
                  });

                  row.innerHTML = `
                    <div style="min-width: 0; display: flex; align-items: center; gap: 6px; flex: 1;">
                      <span style="color: #60a5fa; font-weight: 600;">${prop.path}</span>
                      <span style="color: #64748b; font-size: 9px;">(${prop.type})</span>
                      <span style="color: #94a3b8; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 110px;">: ${valDisplay}</span>
                    </div>
                    <div style="display: flex; gap: 4px;">
                      <button type="button" class="btn-insert-tag" title="Inserir no campo ativo: ${tagExpr}" style="
                        background: #1e293b; border: 1px solid #3b82f6; color: #93c5fd; border-radius: 4px; padding: 2px 5px; font-size: 10px; font-weight: 600; cursor: pointer;
                      ">+ Inserir</button>
                      <button type="button" class="btn-copy-tag" title="Copiar para clipboard: ${tagExpr}" style="
                        background: #1e293b; border: 1px solid #334155; color: #cbd5e1; border-radius: 4px; padding: 2px 5px; font-size: 10px; cursor: pointer;
                      ">📋</button>
                    </div>
                  `;

                  row.querySelector('.btn-insert-tag')?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    onInsertExpression(tagExpr);
                    onShowToast(`Inserido: ${tagExpr}`, 'info');
                  });

                  row.querySelector('.btn-copy-tag')?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(tagExpr);
                    onShowToast(`Copiado: ${tagExpr}`, 'success');
                  });

                  bodyEl.appendChild(row);
                });
              }
            }

            blockCard.appendChild(bodyEl);
          }

          contentList.appendChild(blockCard);
        });
      } else {
        // Tab de Variáveis
        if (variables.length === 0) {
          const empty = document.createElement('div');
          empty.style.cssText = 'background: #0b0f19; border: 1px dashed #334155; border-radius: 8px; padding: 16px; text-align: center; color: #64748b; font-size: 11px;';
          empty.textContent = 'Nenhuma variável global definida no fluxo.';
          contentList.appendChild(empty);
          return;
        }

        const filteredVars = variables.filter((v) => {
          if (!query) return true;
          return v.name.toLowerCase().includes(query) || String(v.value).toLowerCase().includes(query);
        });

        if (filteredVars.length === 0) {
          contentList.innerHTML = '<div style="color: #64748b; font-size: 11px; padding: 8px;">Nenhuma variável correspondente à busca.</div>';
          return;
        }

        filteredVars.forEach((v) => {
          const varCard = document.createElement('div');
          const isConst = !!v.readonly;
          const tagExpr = `{{ $vars.${v.name} }}`;

          varCard.draggable = true;
          varCard.title = `Arraste para soltar no campo desejado ou clique em + Inserir (${tagExpr})`;
          varCard.style.cssText = `
            background: #0b0f19;
            border: 1px solid ${isConst ? '#f59e0b44' : '#1e293b'};
            border-left: 3px solid ${isConst ? '#f59e0b' : '#3b82f6'};
            border-radius: 6px;
            padding: 8px 10px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            font-family: monospace;
            cursor: grab;
            transition: opacity 0.2s;
          `;

          varCard.addEventListener('dragstart', (e) => {
            e.dataTransfer?.setData('text/plain', tagExpr);
            e.dataTransfer?.setData('application/x-n8n-tag', tagExpr);
            varCard.style.opacity = '0.5';
          });
          varCard.addEventListener('dragend', () => {
            varCard.style.opacity = '1';
          });

          let valDisplay = '';
          if (v.type === 'array' && Array.isArray(v.value)) {
            valDisplay = `Array(${v.value.length}): ${JSON.stringify(v.value)}`;
          } else if (typeof v.value === 'object') {
            valDisplay = JSON.stringify(v.value);
          } else {
            valDisplay = String(v.value ?? '');
          }

          varCard.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 11px; font-weight: 700; color: #60a5fa;">${v.name}</span>
                <span style="font-size: 9px; background: #1e293b; color: #94a3b8; padding: 1px 4px; border-radius: 3px; text-transform: uppercase;">${v.type || 'str'}</span>
                ${isConst ? '<span style="font-size: 9px; background: rgba(245, 158, 11, 0.15); color: #f59e0b; padding: 1px 4px; border-radius: 3px; font-weight: 600;">🔒 Constante</span>' : ''}
              </div>
              <div style="display: flex; gap: 4px;">
                <button type="button" class="btn-insert-var" title="Inserir no campo ativo: ${tagExpr}" style="
                  background: #1e293b; border: 1px solid #3b82f6; color: #93c5fd; border-radius: 4px; padding: 2px 5px; font-size: 10px; font-weight: 600; cursor: pointer;
                ">+ Inserir</button>
                <button type="button" class="btn-copy-var" title="Copiar: ${tagExpr}" style="
                  background: #1e293b; border: 1px solid #334155; color: #cbd5e1; border-radius: 4px; padding: 2px 5px; font-size: 10px; cursor: pointer;
                ">📋</button>
              </div>
            </div>
            <div style="font-size: 10px; color: #94a3b8; background: #080c14; padding: 3px 6px; border-radius: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${valDisplay}
            </div>
          `;

          varCard.querySelector('.btn-insert-var')?.addEventListener('click', (e) => {
            e.stopPropagation();
            onInsertExpression(tagExpr);
            onShowToast(`Inserido: ${tagExpr}`, 'info');
          });

          varCard.querySelector('.btn-copy-var')?.addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(tagExpr);
            onShowToast(`Copiado: ${tagExpr}`, 'success');
          });

          contentList.appendChild(varCard);
        });
      }
    };


    // Listeners das abas e busca
    const tabPreds = headerEl.querySelector('#tabPredecessorsBtn') as HTMLButtonElement;
    const tabVars = headerEl.querySelector('#tabVarsBtn') as HTMLButtonElement;
    const searchInput = headerEl.querySelector('#n8nExplorerSearch') as HTMLInputElement;

    tabPreds?.addEventListener('click', () => {
      activeTab = 'predecessors';
      tabPreds.style.background = '#1e293b';
      tabPreds.style.color = '#60a5fa';
      tabVars.style.background = 'transparent';
      tabVars.style.color = '#94a3b8';
      renderContent();
    });

    tabVars?.addEventListener('click', () => {
      activeTab = 'variables';
      tabVars.style.background = '#1e293b';
      tabVars.style.color = '#60a5fa';
      tabPreds.style.background = 'transparent';
      tabPreds.style.color = '#94a3b8';
      renderContent();
    });

    searchInput?.addEventListener('input', (e: any) => {
      searchQuery = e.target.value;
      renderContent();
    });

    renderContent();
    container.appendChild(rootWrapper);
  }

  /**
   * Transforma um objeto ou array aninhado em lista plana de caminhos e tipos
   */
  private static flattenObject(obj: any, prefix = ''): Array<{ path: string; value: any; type: string }> {
    if (obj === null || obj === undefined) {
      return [{ path: prefix || 'value', value: 'null', type: 'null' }];
    }

    if (typeof obj !== 'object') {
      return [{ path: prefix || 'value', value: obj, type: typeof obj }];
    }

    const results: Array<{ path: string; value: any; type: string }> = [];

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        results.push({ path: prefix || 'items', value: '[]', type: 'array' });
      } else {
        // Mostra o array geral e os campos do primeiro item como referência
        results.push({ path: prefix ? `${prefix}[0]` : '[0]', value: obj[0], type: 'item' });
        if (typeof obj[0] === 'object' && obj[0] !== null) {
          const sub = this.flattenObject(obj[0], prefix ? `${prefix}[0]` : '[0]');
          results.push(...sub);
        }
      }
      return results;
    }

    for (const [key, val] of Object.entries(obj)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      if (typeof val === 'object' && val !== null) {
        if (Array.isArray(val)) {
          results.push({ path: fullPath, value: `Array(${val.length})`, type: 'array' });
          if (val.length > 0 && typeof val[0] === 'object') {
            results.push(...this.flattenObject(val[0], `${fullPath}[0]`));
          }
        } else {
          results.push(...this.flattenObject(val, fullPath));
        }
      } else {
        let type = typeof val;
        results.push({ path: fullPath, value: val, type });
      }
    }

    return results;
  }
}
