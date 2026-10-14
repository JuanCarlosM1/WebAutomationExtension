/**
 * Gerenciador do Canvas interativo do Visual Flow Studio
 * Responsável por:
 * - Pan & Zoom no canvas
 * - Renderização dos blocos e portas (handles)
 * - Arrastar blocos (drag & drop)
 * - Conexões ortogonais entre blocos (edges)
 * - Minimapa interativo
 */

import { AnyAutomationNode, AutomationEdge, WebAutomationGraph } from '../../../../BibliotecaDeDev/src/types/schema';
import { BLOCK_CATALOG } from './blockCatalog';
import { CodeEditorComponent } from './codeEditorComponent';
import { CanvasPathUtils } from './canvasPathUtils';
import { CanvasMinimap } from './canvasMinimap';

export interface CanvasManagerCallbacks {
  getGraph: () => WebAutomationGraph;
  getSelectedNodeId: () => string | undefined;
  setSelectedNodeId: (nodeId: string | undefined) => void;
  onNodeSelect: (nodeId: string | undefined) => void;
  showToast: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  showModalDialog: (title: string, message: string, icon?: string) => void;
  onOpenNodeModal?: (nodeId: string) => void;
}

export class CanvasManager {
  private zoom = 1.0;
  private panOffset = { x: 0, y: 0 };
  private isPanning = false;
  private panStart = { x: 0, y: 0 };

  private isDraggingNode = false;
  private selectedEdgeId?: string;
  private connectingFromNodeId?: string;
  private connectingHandle?: string;
  private isCtrlConnectionMode: boolean = false;
  private activeMoveHandler?: (e: MouseEvent) => void;
  private activeUpHandler?: (e: MouseEvent) => void;
  private minimap: CanvasMinimap;

  constructor(private callbacks: CanvasManagerCallbacks) {
    this.minimap = new CanvasMinimap({
      getNodes: () => this.callbacks.getGraph().nodes,
      getEdges: () => this.callbacks.getGraph().edges,
      getSelectedNodeId: () => this.callbacks.getSelectedNodeId(),
      getZoom: () => this.zoom,
      getPanOffset: () => ({ ...this.panOffset }),
      onNavigate: (newPanX, newPanY) => {
        this.panOffset.x = newPanX;
        this.panOffset.y = newPanY;
        this.updateCanvasTransform();
      },
    });

    this.initCanvasEvents();
  }

  public getSelectedEdgeId(): string | undefined {
    return this.selectedEdgeId;
  }

  public setSelectedEdgeId(edgeId: string | undefined): void {
    this.selectedEdgeId = edgeId;
    this.highlightSelectedEdge();
  }

  public deleteEdge(edgeId: string): void {
    const graph = this.callbacks.getGraph();
    const edgeExists = graph.edges.some((ed) => ed.id === edgeId);
    if (!edgeExists) return;

    graph.edges = graph.edges.filter((ed) => ed.id !== edgeId);
    if (this.selectedEdgeId === edgeId) {
      this.selectedEdgeId = undefined;
    }
    this.renderEdges();
    this.renderMinimap();
    this.callbacks.showToast('Ligação excluída!', 'info');
  }

  private highlightSelectedEdge(): void {
    const paths = document.querySelectorAll('.edges-svg-layer path');
    paths.forEach((p) => {
      if (p.getAttribute('stroke') === 'transparent') return;
      if (p.getAttribute('data-edge-id') === this.selectedEdgeId) {
        p.classList.add('selected-edge');
      } else {
        p.classList.remove('selected-edge');
      }
    });
  }

  public getZoom(): number {
    return this.zoom;
  }

  public getPanOffset(): { x: number; y: number } {
    return { ...this.panOffset };
  }

  public resetTransform(): void {
    this.zoom = 1.0;
    this.panOffset = { x: 0, y: 0 };
    this.updateCanvasTransform();
  }

  public updateCanvasTransform(): void {
    const viewport = document.getElementById('canvasViewport');
    if (viewport) {
      viewport.style.transform = `translate(${this.panOffset.x}px, ${this.panOffset.y}px) scale(${this.zoom})`;
    }
    const btnReset = document.getElementById('btnZoomReset');
    if (btnReset) {
      btnReset.textContent = `${Math.round(this.zoom * 100)}%`;
    }
    this.renderMinimap();
  }

  public setZoom(newZoom: number, originX?: number, originY?: number): void {
    const prevZoom = this.zoom;
    this.zoom = Math.min(2.5, Math.max(0.3, newZoom));

    if (originX !== undefined && originY !== undefined) {
      const scaleFactor = this.zoom / prevZoom;
      this.panOffset.x = originX - (originX - this.panOffset.x) * scaleFactor;
      this.panOffset.y = originY - (originY - this.panOffset.y) * scaleFactor;
    }

    this.updateCanvasTransform();
  }

  public addNodeToCanvas(item: any, clientX?: number, clientY?: number): void {
    const graph = this.callbacks.getGraph();
    const canvas = document.getElementById('canvasContainer')!;
    const rect = canvas.getBoundingClientRect();

    let nodeX: number;
    let nodeY: number;

    if (clientX !== undefined && clientY !== undefined) {
      nodeX = (clientX - rect.left - this.panOffset.x) / this.zoom - 105;
      nodeY = (clientY - rect.top - this.panOffset.y) / this.zoom - 25;
    } else {
      const visibleCenterX = (rect.width / 2 - this.panOffset.x) / this.zoom;
      const visibleCenterY = (rect.height / 2 - this.panOffset.y) / this.zoom;
      nodeX = visibleCenterX - 100 + (Math.random() * 60 - 30);
      nodeY = visibleCenterY - 40 + (Math.random() * 60 - 30);
    }

    // Regra: só 1 bloco de início
    if (item.type === 'start') {
      const alreadyHasStart = graph.nodes.some((n) => n.type === 'start');
      if (alreadyHasStart) {
        this.callbacks.showModalDialog(
          'Regra de Workflow: Bloco de Início Duplicado',
          'Cada workflow só pode possuir exatamente <strong>1 Bloco de Início</strong> (gatilho). Caso queira trocar o tipo de gatilho, altere os parâmetros do bloco de início existente no painel à direita.',
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>'
        );
        this.callbacks.showToast('Só é permitido 1 Bloco de Início por workflow!', 'error');
        return;
      }
    }

    const newNode: AnyAutomationNode = {
      id: `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: item.type,
      category: item.category || 'flow_logic',
      position: { x: Math.round(Math.max(20, nodeX)), y: Math.round(Math.max(20, nodeY)) },
      data: JSON.parse(JSON.stringify(item.defaultData)),
    };

    graph.nodes.push(newNode);
    this.callbacks.setSelectedNodeId(newNode.id);
    this.render();
    this.callbacks.onNodeSelect(newNode.id);
    this.callbacks.showToast(`Bloco "${item.title}" adicionado!`, 'info');
  }

  public render(): void {
    const graph = this.callbacks.getGraph();
    const selectedNodeId = this.callbacks.getSelectedNodeId();
    const nodesLayer = document.getElementById('nodesLayer');
    if (!nodesLayer) return;
    nodesLayer.innerHTML = '';

    graph.nodes.forEach((node) => {
      const nodeEl = document.createElement('div');
      nodeEl.className = `graph-node ${selectedNodeId === node.id ? 'selected' : ''}`;
      nodeEl.style.left = `${node.position.x}px`;
      nodeEl.style.top = `${node.position.y}px`;
      nodeEl.id = `rendered_${node.id}`;
      nodeEl.dataset.id = node.id;

      let outputsHtml = '';
      const isMultiOutput = ['if_element_exists', 'while_loop', 'for_loop', 'try_catch', 'switch'].includes(node.type);

      if (node.type === 'if_element_exists') {
        outputsHtml = `
          <div class="node-outputs-container">
            <div class="node-output-port">
              <span>Se Existir (True)</span>
              <div class="port-handle port-true" data-handle="true" data-node-id="${node.id}" title="Conectar saída Se Existir"></div>
            </div>
            <div class="node-output-port">
              <span>Se Não Existir (False)</span>
              <div class="port-handle port-false" data-handle="false" data-node-id="${node.id}" title="Conectar saída Se Não Existir"></div>
            </div>
          </div>
        `;
      } else if (node.type === 'while_loop' || node.type === 'for_loop') {
        outputsHtml = `
          <div class="node-outputs-container">
            <div class="node-output-port">
              <span>Corpo do Loop</span>
              <div class="port-handle port-body" data-handle="loop_body" data-node-id="${node.id}" title="Conectar corpo da iteração"></div>
            </div>
            <div class="node-output-port">
              <span>Ao Concluir</span>
              <div class="port-handle port-done" data-handle="loop_done" data-node-id="${node.id}" title="Conectar fluxo após o loop terminar"></div>
            </div>
          </div>
        `;
      } else if (node.type === 'try_catch') {
        outputsHtml = `
          <div class="node-outputs-container">
            <div class="node-output-port">
              <span>Tentar (Try)</span>
              <div class="port-handle port-try" data-handle="try_body" data-node-id="${node.id}" title="Conectar execução protegida"></div>
            </div>
            <div class="node-output-port">
              <span>Se Falhar (Catch)</span>
              <div class="port-handle port-catch" data-handle="catch_branch" data-node-id="${node.id}" title="Conectar tratamento de erro"></div>
            </div>
          </div>
        `;
      } else if (node.type === 'switch') {
        const cases = (node.data as any).cases || [];
        let casesHtml = cases.map((c: any, i: number) => `
          <div class="node-output-port">
            <span>${c.label || 'Caso ' + (i + 1)}</span>
            <div class="port-handle port-case" data-handle="${c.id}" data-node-id="${node.id}"></div>
          </div>
        `).join('');

        if ((node.data as any).hasDefaultBranch !== false) {
          casesHtml += `
            <div class="node-output-port">
              <span>Padrão (Default)</span>
              <div class="port-handle port-default" data-handle="default" data-node-id="${node.id}"></div>
            </div>
          `;
        }
        outputsHtml = `<div class="node-outputs-container">${casesHtml}</div>`;
      }

      // Encontrar ícone e categoria no catálogo
      let nodeIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
      let catClass = 'cat-flow';
      for (const cat of BLOCK_CATALOG) {
        const found = cat.items.find((it) => it.type === node.type);
        if (found) {
          nodeIcon = found.icon;
          catClass = cat.categoryClass;
          break;
        }
      }

      nodeEl.className = `graph-node ${catClass} ${selectedNodeId === node.id ? 'selected' : ''}`;

      // Botão ou prévia de código no corpo do nó se for bloco com código JS, HTML ou CSS
      let codeBadgeHtml = '';
      const hasJsRule = (rules: any[]) => Array.isArray(rules) && rules.some((r) => r.evaluationMode === 'js_eval');
      const hasJsInGroups = (groups: any[]) => Array.isArray(groups) && groups.some((g) => hasJsRule(g.rules));
      const isCodeNode = ['inject_javascript', 'inject_html', 'inject_css', 'web_component'].includes(node.type) ||
        (node.type === 'for_loop' && (node.data as any).loopType === 'js_generator') ||
        (node.type === 'set_variable' && (node.data as any).evaluationType === 'js_eval') ||
        (node.type === 'while_loop' && (hasJsRule((node.data as any).rules) || hasJsInGroups((node.data as any).conditionGroups))) ||
        (node.type === 'switch' && Array.isArray((node.data as any).cases) && (node.data as any).cases.some((c: any) => hasJsRule(c.rules) || hasJsInGroups(c.conditionGroups)));

      if (isCodeNode) {
        const langMap: Record<string, { label: string; color: string }> = {
          inject_javascript: { label: 'Editar JS', color: '#f59e0b' },
          inject_html: { label: 'Editar HTML', color: '#ec4899' },
          inject_css: { label: 'Editar CSS', color: '#06b6d4' },
          web_component: { label: 'Editar Componente', color: '#8b5cf6' },
          for_loop: { label: 'Editar JS', color: '#f59e0b' },
          set_variable: { label: 'Editar Expressão JS', color: '#f59e0b' },
          while_loop: { label: 'Editar Condição JS', color: '#f59e0b' },
          switch: { label: 'Editar Condição JS', color: '#f59e0b' },
        };
        const meta = langMap[node.type] || { label: 'Editar Código', color: '#6366f1' };
        codeBadgeHtml = `
          <button class="node-edit-code-btn" data-id="${node.id}" style="margin-top: 6px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.12); color: ${meta.color}; border-radius: 6px; padding: 4px 8px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.15s ease;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>${meta.label}</span>
          </button>
        `;
      }

      nodeEl.innerHTML = `
        <div class="node-handle node-handle-input" data-node-id="${node.id}" data-handle-type="input" title="Conectar entrada aqui"></div>
        <div class="graph-node-header">
          <div class="graph-node-title">
            <span class="graph-node-icon">${nodeIcon}</span>
            <span class="graph-node-title-text">${node.data.label || node.type}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 4px;">
            <button class="btn-xs expand-node-btn" data-id="${node.id}" title="Expandir configurações deste bloco em tela cheia" style="padding: 2px 5px; font-size: 10px; display: inline-flex; align-items: center; justify-content: center;">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
            </button>
            <button class="btn-xs delete-node-btn" data-id="${node.id}" title="Excluir bloco">✕</button>
          </div>
        </div>
        <div class="graph-node-body">
          Tipo: <strong>${node.type}</strong>
          <div class="graph-node-desc-preview" style="margin-top: 4px; font-size: 10px; color: #94a3b8; font-style: italic; display: ${node.data.description ? 'block' : 'none'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${node.data.description || ''}</div>
          ${codeBadgeHtml}
        </div>
        ${!isMultiOutput ? `<div class="node-handle node-handle-output" data-node-id="${node.id}" data-handle="default" title="Conectar próxima etapa"></div>` : ''}
        ${outputsHtml}
      `;

      // Mover nó (Drag & Drop)
      nodeEl.addEventListener('mousedown', (e) => {
        if ((e.target as HTMLElement).classList.contains('delete-node-btn')) return;
        if ((e.target as HTMLElement).classList.contains('node-handle')) return;
        if ((e.target as HTMLElement).classList.contains('port-handle')) return;

        e.stopPropagation();
        this.callbacks.setSelectedNodeId(node.id);
        this.isDraggingNode = true;

        document.querySelectorAll('.graph-node').forEach((el) => el.classList.remove('selected'));
        nodeEl.classList.add('selected');
        this.callbacks.onNodeSelect(node.id);

        const startMouseX = e.clientX;
        const startMouseY = e.clientY;
        const startNodeX = node.position.x;
        const startNodeY = node.position.y;

        const onMouseMove = (moveEvt: MouseEvent) => {
          if (!this.isDraggingNode) return;
          const deltaX = (moveEvt.clientX - startMouseX) / this.zoom;
          const deltaY = (moveEvt.clientY - startMouseY) / this.zoom;

          node.position.x = Math.round(startNodeX + deltaX);
          node.position.y = Math.round(startNodeY + deltaY);

          nodeEl.style.left = `${node.position.x}px`;
          nodeEl.style.top = `${node.position.y}px`;
          this.renderEdges();
          this.renderMinimap();
        };

        const onMouseUp = () => {
          this.isDraggingNode = false;
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          this.renderMinimap();
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });

      // Iniciar Conexão (Clique ou Drag)
      const outHandles = nodeEl.querySelectorAll('.node-handle-output, .port-handle');
      outHandles.forEach((handleEl) => {
        handleEl.addEventListener('mousedown', (e: MouseEvent) => {
          e.stopPropagation();
          const targetHandle = (handleEl as HTMLElement).dataset.handle || 'default';

          // Cancela qualquer conexão pendente anterior
          this.cancelConnection();

          this.connectingFromNodeId = node.id;
          this.connectingHandle = targetHandle;
          this.isCtrlConnectionMode = e.ctrlKey || e.metaKey;

          handleEl.classList.add('connecting-source');

          const onConnectingMove = (moveEvt: MouseEvent) => {
            if (!this.connectingFromNodeId) return;
            const canvasRect = document.getElementById('canvasContainer')!.getBoundingClientRect();
            const sourceEl = document.getElementById(`rendered_${node.id}`);
            const isMultiOutput = ['if_element_exists', 'while_loop', 'for_loop', 'try_catch', 'switch'].includes(node.type);
            const hEl = sourceEl
              ? (isMultiOutput
                  ? (sourceEl.querySelector(`.port-handle[data-handle="${targetHandle}"]`) as HTMLElement)
                  : ((sourceEl.querySelector('.node-handle-output') || sourceEl.querySelector(`.port-handle[data-handle="${targetHandle}"]`)) as HTMLElement))
              : null;

            const startPt = this.getHandleCenterPoint(hEl, node.position.x + 210, node.position.y + 40);

            const currentMouseCanvasX = (moveEvt.clientX - canvasRect.left - this.panOffset.x) / this.zoom;
            const currentMouseCanvasY = (moveEvt.clientY - canvasRect.top - this.panOffset.y) / this.zoom;

            this.renderTemporaryEdge(startPt.x, startPt.y, currentMouseCanvasX, currentMouseCanvasY);
          };

          const onConnectingUp = (upEvt: MouseEvent) => {
            const targetEl = upEvt.target as HTMLElement;
            // 1. Tenta encontrar a porta de entrada sob o cursor diretamente
            let inHandleTarget = (targetEl?.closest('.node-handle-input') as HTMLElement | null)
              || (document.elementFromPoint(upEvt.clientX, upEvt.clientY)?.closest('.node-handle-input') as HTMLElement | null);

            // 2. Se soltou no corpo do bloco ou próximo ao bloco, encontra a porta de entrada (.node-handle-input) daquele bloco
            if (!inHandleTarget) {
              const nodeUnderCursor = (targetEl?.closest('.graph-node') as HTMLElement | null)
                || (document.elementFromPoint(upEvt.clientX, upEvt.clientY)?.closest('.graph-node') as HTMLElement | null);
              if (nodeUnderCursor) {
                inHandleTarget = nodeUnderCursor.querySelector('.node-handle-input') as HTMLElement | null;
              }
            }

            // 3. Se ainda não encontrou, busca por proximidade (raio de 30px) de qualquer handle de entrada
            if (!inHandleTarget) {
              const allInputs = document.querySelectorAll('.node-handle-input');
              let closestHandle: HTMLElement | null = null;
              let minDistance = 35; // tolerância de 35px para snap perfeito no centro
              allInputs.forEach((h) => {
                const rect = (h as HTMLElement).getBoundingClientRect();
                const centerHx = rect.left + rect.width / 2;
                const centerHy = rect.top + rect.height / 2;
                const dist = Math.hypot(upEvt.clientX - centerHx, upEvt.clientY - centerHy);
                if (dist < minDistance) {
                  minDistance = dist;
                  closestHandle = h as HTMLElement;
                }
              });
              if (closestHandle) {
                inHandleTarget = closestHandle;
              }
            }

            if (inHandleTarget) {
              const targetNodeEl = inHandleTarget.closest('.graph-node, .canvas-node') as HTMLElement | null;
              const targetNodeId = targetNodeEl?.dataset.id
                || inHandleTarget.dataset.nodeId
                || (targetNodeEl?.id ? targetNodeEl.id.replace('rendered_', '') : null);

              if (targetNodeId && this.connectingFromNodeId) {
                if (this.connectingFromNodeId === targetNodeId) {
                  this.callbacks.showModalDialog(
                    'Operação Inválida',
                    'Não é permitido conectar um bloco diretamente a ele mesmo.',
                    '⚠️'
                  );
                  this.callbacks.showToast('Não é possível conectar um bloco a si mesmo.', 'warning');
                  this.cancelConnection();
                  return;
                }

                // ID único para permitir múltiplas conexões a partir do mesmo ou para o mesmo bloco
                const timestamp = Date.now().toString(36);
                const randomPart = Math.random().toString(36).substring(2, 6);
                const edgeId = `e_${this.connectingFromNodeId}_${this.connectingHandle || 'default'}_${targetNodeId}_${timestamp}_${randomPart}`;

                graph.edges.push({
                  id: edgeId,
                  source: this.connectingFromNodeId,
                  target: targetNodeId,
                  sourceHandle: this.connectingHandle || 'default',
                });
                this.callbacks.showToast('Ligação conectada com sucesso!', 'info');

                // Remove linha temporária imediatamente e renderiza as arestas finais perfeitamente fixadas no centro dos handles
                this.cancelConnection();
                this.renderEdges();
                this.renderMinimap();
                return;
              }
            }

            // Se o mouse foi solto fora de um handle de entrada, cancela e remove a linha temporária
            this.cancelConnection();
          };

          this.activeMoveHandler = onConnectingMove;
          this.activeUpHandler = onConnectingUp;

          document.getElementById('canvasContainer')?.classList.add('connecting-in-progress');
          window.addEventListener('mousemove', onConnectingMove);
          window.addEventListener('mouseup', onConnectingUp);
        });
      });

      // Botão direto no nó para abrir editor de código sobre o canvas
      nodeEl.querySelector('.node-edit-code-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.callbacks.setSelectedNodeId(node.id);
        this.callbacks.onNodeSelect(node.id);

        const data = node.data as any;
        if (node.type === 'inject_javascript') {
          CodeEditorComponent.openCodeModal({
            title: `Código JavaScript - ${data.label || 'Injetar JS'}`,
            language: 'javascript',
            value: data.code || 'console.log("Olá");',
            onSave: (val) => {
              data.code = val;
              this.callbacks.onNodeSelect(node.id);
              this.callbacks.showToast('Código JS salvo!', 'success');
            },
          });
        } else if (node.type === 'inject_html') {
          CodeEditorComponent.openCodeModal({
            title: `Código HTML - ${data.label || 'Injetar HTML'}`,
            language: 'html',
            value: data.html || '',
            onSave: (val) => {
              data.html = val;
              this.callbacks.onNodeSelect(node.id);
              this.callbacks.showToast('Código HTML salvo!', 'success');
            },
          });
        } else if (node.type === 'inject_css') {
          CodeEditorComponent.openCodeModal({
            title: `Código CSS - ${data.label || 'Injetar CSS'}`,
            language: 'css',
            value: data.css || '',
            onSave: (val) => {
              data.css = val;
              this.callbacks.onNodeSelect(node.id);
              this.callbacks.showToast('Código CSS salvo!', 'success');
            },
          });
        } else if (node.type === 'for_loop') {
          CodeEditorComponent.openCodeModal({
            title: `Código JS Gerador - ${data.label || 'Loop For'}`,
            language: 'javascript',
            value: data.jsExpression || '',
            onSave: (val) => {
              data.jsExpression = val;
              this.callbacks.onNodeSelect(node.id);
              this.callbacks.showToast('Expressão JS salva!', 'success');
            },
          });
        } else if (node.type === 'set_variable') {
          CodeEditorComponent.openCodeModal({
            title: `Expressão JavaScript - ${data.label || data.varName || 'Definir Variável'}`,
            language: 'javascript',
            value: data.valueExpression || '',
            onSave: (val) => {
              data.valueExpression = val;
              this.callbacks.onNodeSelect(node.id);
              this.callbacks.showToast('Expressão JS salva!', 'success');
            },
          });
        } else if (node.type === 'while_loop' || node.type === 'switch' || node.type === 'web_component') {
          // Para blocos com múltiplas partes ou regras condicionais, abre o modal centralizado do bloco
          this.callbacks.onOpenNodeModal?.(node.id);
        }
      });

      // Expandir nó em modal centralizado
      nodeEl.querySelector('.expand-node-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.callbacks.setSelectedNodeId(node.id);
        this.callbacks.onNodeSelect(node.id);
        this.callbacks.onOpenNodeModal?.(node.id);
      });

      // Duplo clique no nó também expande em tela centralizada
      nodeEl.addEventListener('dblclick', (e) => {
        if ((e.target as HTMLElement).closest('.delete-node-btn') ||
            (e.target as HTMLElement).closest('.node-handle') ||
            (e.target as HTMLElement).closest('.node-edit-code-btn')) return;
        e.stopPropagation();
        this.callbacks.setSelectedNodeId(node.id);
        this.callbacks.onNodeSelect(node.id);
        this.callbacks.onOpenNodeModal?.(node.id);
      });

      // Deletar nó
      nodeEl.querySelector('.delete-node-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteNode(node.id);
      });

      nodesLayer.appendChild(nodeEl);
    });

    this.renderEdges();
    this.renderMinimap();
  }

  /**
   * Deleta um nó específico do fluxo e remove todas as suas conexões associadas
   */
  public deleteNode(nodeId: string): void {
    const graph = this.callbacks.getGraph();
    const nodeExists = graph.nodes.some((n) => n.id === nodeId);
    if (!nodeExists) return;

    graph.nodes = graph.nodes.filter((n) => n.id !== nodeId);
    graph.edges = graph.edges.filter((ed) => ed.source !== nodeId && ed.target !== nodeId);

    if (this.callbacks.getSelectedNodeId() === nodeId) {
      this.callbacks.setSelectedNodeId(undefined);
    }

    this.render();
    this.callbacks.onNodeSelect(this.callbacks.getSelectedNodeId());
    this.callbacks.showToast('Bloco excluído.', 'info');
  }

  /**
   * Finaliza e limpa completamente qualquer estado de conexão pendente
   */
  public cancelConnection(): void {
    if (this.activeMoveHandler) {
      window.removeEventListener('mousemove', this.activeMoveHandler);
      this.activeMoveHandler = undefined;
    }
    if (this.activeUpHandler) {
      window.removeEventListener('mouseup', this.activeUpHandler);
      this.activeUpHandler = undefined;
    }
    this.removeTemporaryEdge();
    this.connectingFromNodeId = undefined;
    this.connectingHandle = undefined;
    this.isCtrlConnectionMode = false;
    document.getElementById('canvasContainer')?.classList.remove('connecting-in-progress');
    document.querySelectorAll('.connecting-source').forEach((el) => el.classList.remove('connecting-source'));
  }

  /**
   * Calcula o centro exato em coordenadas do Canvas de qualquer handle (porta de conexão)
   */
  private getHandleCenterPoint(handleEl: HTMLElement | null, fallbackX: number, fallbackY: number): { x: number; y: number } {
    const viewport = document.getElementById('canvasViewport');
    if (!handleEl || !viewport) {
      return { x: fallbackX, y: fallbackY };
    }

    const handleRect = handleEl.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();

    // Posição central do círculo do handle no espaço interno do viewport (independente de zoom e pan)
    const centerX = (handleRect.left + handleRect.width / 2 - viewportRect.left) / this.zoom;
    const centerY = (handleRect.top + handleRect.height / 2 - viewportRect.top) / this.zoom;

    return { x: Math.round(centerX), y: Math.round(centerY) };
  }

  public renderEdges(): void {
    const graph = this.callbacks.getGraph();
    const svgEdges = document.getElementById('edgesLayer')!;
    const svgControls = document.getElementById('edgesControlsLayer');
    svgEdges.innerHTML = '';
    if (svgControls) svgControls.innerHTML = '';

    graph.edges.forEach((edge) => {
      const sourceNode = graph.nodes.find((n) => n.id === edge.source);
      const targetNode = graph.nodes.find((n) => n.id === edge.target);
      if (!sourceNode || !targetNode) return;

      const sourceEl = document.getElementById(`rendered_${sourceNode.id}`);
      const targetEl = document.getElementById(`rendered_${targetNode.id}`);

      const isMultiOutput = ['if_element_exists', 'while_loop', 'for_loop', 'try_catch', 'switch'].includes(sourceNode.type);
      const outHandleEl = sourceEl
        ? (isMultiOutput
            ? (sourceEl.querySelector(`.port-handle[data-handle="${edge.sourceHandle || 'default'}"]`) as HTMLElement)
            : ((sourceEl.querySelector('.node-handle-output') || sourceEl.querySelector(`.port-handle[data-handle="${edge.sourceHandle}"]`)) as HTMLElement))
        : null;

      const inHandleEl = targetEl
        ? (targetEl.querySelector('.node-handle-input') as HTMLElement)
        : null;

      const sourcePt = this.getHandleCenterPoint(outHandleEl, sourceNode.position.x + 210, sourceNode.position.y + 40);
      const targetPt = this.getHandleCenterPoint(inHandleEl, targetNode.position.x, targetNode.position.y + 40);

      const x1 = sourcePt.x;
      const y1 = sourcePt.y;
      const x2 = targetPt.x;
      const y2 = targetPt.y;

      const { pathData, midX, midY } = this.generateOrthogonalPath(x1, y1, x2, y2);

      let strokeColor = '#6366f1';
      if (edge.sourceHandle === 'true' || edge.sourceHandle === 'loop_done') strokeColor = '#10b981';
      else if (edge.sourceHandle === 'false' || edge.sourceHandle === 'catch_branch') strokeColor = '#f43f5e';
      else if (edge.sourceHandle === 'loop_body' || edge.sourceHandle === 'try_body') strokeColor = '#38bdf8';
      else if (edge.sourceHandle && edge.sourceHandle.startsWith('case_')) strokeColor = '#f59e0b';

      // 1. Linha invisível mais grossa para facilitar o clique com o mouse na corda
      const hitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      hitPath.setAttribute('d', pathData);
      hitPath.setAttribute('fill', 'none');
      hitPath.setAttribute('stroke', 'transparent');
      hitPath.setAttribute('stroke-width', '20');
      hitPath.setAttribute('stroke-linecap', 'round');
      hitPath.setAttribute('data-edge-id', edge.id);
      hitPath.style.cursor = 'pointer';

      // 2. Linha visual da corda
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', strokeColor);
      path.setAttribute('stroke-width', '2.5');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('data-edge-id', edge.id);
      path.style.cursor = 'pointer';

      if (this.selectedEdgeId === edge.id) {
        path.classList.add('selected-edge');
      }

      // Função para selecionar a corda
      const selectThisEdge = (e: MouseEvent) => {
        e.stopPropagation();
        if (this.selectedEdgeId === edge.id) return;
        this.callbacks.setSelectedNodeId(undefined);
        document.querySelectorAll('.graph-node').forEach((el) => el.classList.remove('selected'));
        this.callbacks.onNodeSelect(undefined);
        this.setSelectedEdgeId(edge.id);
        this.callbacks.showToast('Ligação selecionada. Pressione Delete para remover.', 'info');
      };

      hitPath.addEventListener('click', selectThisEdge);
      hitPath.addEventListener('mousedown', (e: MouseEvent) => e.stopPropagation());
      path.addEventListener('click', selectThisEdge);
      path.addEventListener('mousedown', (e: MouseEvent) => e.stopPropagation());

      // Badge visual de deletar (botão ✕)
      const deleteBadge = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      deleteBadge.setAttribute('class', 'edge-delete-badge');
      deleteBadge.style.cursor = 'pointer';

      const badgeCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      badgeCircle.setAttribute('cx', String(midX));
      badgeCircle.setAttribute('cy', String(midY));
      badgeCircle.setAttribute('r', '11');
      badgeCircle.setAttribute('fill', '#1e293b');
      badgeCircle.setAttribute('stroke', strokeColor);
      badgeCircle.setAttribute('stroke-width', '2');

      const badgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      badgeText.setAttribute('x', String(midX));
      badgeText.setAttribute('y', String(midY + 4));
      badgeText.setAttribute('text-anchor', 'middle');
      badgeText.setAttribute('font-size', '11');
      badgeText.setAttribute('font-weight', 'bold');
      badgeText.setAttribute('fill', '#f43f5e');
      badgeText.textContent = '✕';

      deleteBadge.appendChild(badgeCircle);
      deleteBadge.appendChild(badgeText);

      const deleteThisEdge = (e: MouseEvent) => {
        e.stopPropagation();
        this.deleteEdge(edge.id);
      };

      deleteBadge.addEventListener('click', deleteThisEdge);
      deleteBadge.addEventListener('mousedown', (e: MouseEvent) => e.stopPropagation());

      // svgEdges desenha a linha de clique hitPath e a linha visual (z-index 5, atrás dos blocos para nunca cobrir handles)
      svgEdges.appendChild(hitPath);
      svgEdges.appendChild(path);

      // svgControls recebe o badge de deletar (z-index 25, acima dos blocos para fácil exclusão)
      if (svgControls) {
        svgControls.appendChild(deleteBadge);
      } else {
        svgEdges.appendChild(deleteBadge);
      }
    });
  }

  public generateOrthogonalPath(x1: number, y1: number, x2: number, y2: number): { pathData: string; midX: number; midY: number } {
    return CanvasPathUtils.generateOrthogonalPath(x1, y1, x2, y2);
  }

  public renderTemporaryEdge(x1: number, y1: number, x2: number, y2: number): void {
    const svg = document.getElementById('edgesLayer')!;
    let tempPath = svg.querySelector('#tempEdgePath') as SVGPathElement;
    if (!tempPath) {
      tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      tempPath.id = 'tempEdgePath';
      tempPath.setAttribute('fill', 'none');
      tempPath.setAttribute('stroke', '#60a5fa');
      tempPath.setAttribute('stroke-width', '2.5');
      tempPath.setAttribute('stroke-dasharray', '5,5');
      svg.appendChild(tempPath);
    }
    const { pathData } = this.generateOrthogonalPath(x1, y1, x2, y2);
    tempPath.setAttribute('d', pathData);
  }

  public removeTemporaryEdge(): void {
    const tempPath = document.getElementById('tempEdgePath');
    tempPath?.remove();
  }

  public renderMinimap(): void {
    this.minimap.render();
  }

  private initCanvasEvents(): void {
    const canvas = document.getElementById('canvasContainer');
    if (!canvas) return;

    // Drag over & drop
    canvas.addEventListener('dragover', (e) => e.preventDefault());
    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      const raw = e.dataTransfer?.getData('application/json');
      if (!raw) return;

      const item = JSON.parse(raw);
      this.addNodeToCanvas(item, e.clientX, e.clientY);
    });

    // Pan do Canvas
    canvas.addEventListener('mousedown', (e) => {
      if (
        (e.target as HTMLElement).closest('.graph-node') ||
        (e.target as HTMLElement).closest('.canvas-floating-controls') ||
        (e.target as HTMLElement).closest('.canvas-minimap') ||
        (e.target as HTMLElement).closest('.edge-delete-badge') ||
        (e.target as SVGElement).tagName?.toLowerCase() === 'path'
      ) {
        return;
      }

      this.callbacks.setSelectedNodeId(undefined);
      this.setSelectedEdgeId(undefined);
      document.querySelectorAll('.graph-node').forEach((el) => el.classList.remove('selected'));
      this.callbacks.onNodeSelect(undefined);

      this.isPanning = true;
      this.panStart = { x: e.clientX - this.panOffset.x, y: e.clientY - this.panOffset.y };

      const onPanMove = (moveEvt: MouseEvent) => {
        if (!this.isPanning) return;
        this.panOffset.x = moveEvt.clientX - this.panStart.x;
        this.panOffset.y = moveEvt.clientY - this.panStart.y;
        this.updateCanvasTransform();
      };

      const onPanUp = () => {
        this.isPanning = false;
        window.removeEventListener('mousemove', onPanMove);
        window.removeEventListener('mouseup', onPanUp);
      };

      window.addEventListener('mousemove', onPanMove);
      window.addEventListener('mouseup', onPanUp);
    });

    // Zoom com a roda do mouse
    canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
        this.setZoom(this.zoom * zoomFactor, mouseX, mouseY);
      },
      { passive: false }
    );

    // Controles de zoom nos botões flutuantes
    document.getElementById('btnZoomIn')?.addEventListener('click', () => {
      const rect = canvas.getBoundingClientRect();
      this.setZoom(this.zoom * 1.2, rect.width / 2, rect.height / 2);
    });

    document.getElementById('btnZoomOut')?.addEventListener('click', () => {
      const rect = canvas.getBoundingClientRect();
      this.setZoom(this.zoom / 1.2, rect.width / 2, rect.height / 2);
    });

    document.getElementById('btnZoomReset')?.addEventListener('click', () => {
      this.resetTransform();
    });
  }
}
