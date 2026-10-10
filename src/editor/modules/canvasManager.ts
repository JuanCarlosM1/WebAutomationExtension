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

export interface CanvasManagerCallbacks {
  getGraph: () => WebAutomationGraph;
  getSelectedNodeId: () => string | undefined;
  setSelectedNodeId: (nodeId: string | undefined) => void;
  onNodeSelect: (nodeId: string | undefined) => void;
  showToast: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  showModalDialog: (title: string, message: string, icon?: string) => void;
}

export class CanvasManager {
  private zoom = 1.0;
  private panOffset = { x: 0, y: 0 };
  private isPanning = false;
  private panStart = { x: 0, y: 0 };

  private isDraggingNode = false;
  private connectingFromNodeId?: string;
  private connectingHandle?: string;
  private isCtrlConnectionMode: boolean = false;
  private activeMoveHandler?: (e: MouseEvent) => void;
  private activeUpHandler?: (e: MouseEvent) => void;

  constructor(private callbacks: CanvasManagerCallbacks) {
    this.initCanvasEvents();
    this.initMinimapEvents();
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

      nodeEl.innerHTML = `
        <div class="node-handle node-handle-input" data-node-id="${node.id}" data-handle-type="input" title="Conectar entrada aqui"></div>
        <div class="graph-node-header">
          <div class="graph-node-title">
            <span class="graph-node-icon">${nodeIcon}</span>
            <span class="graph-node-title-text">${node.data.label || node.type}</span>
          </div>
          <button class="btn-xs delete-node-btn" data-id="${node.id}">✕</button>
        </div>
        <div class="graph-node-body">
          Tipo: <strong>${node.type}</strong>
          <div class="graph-node-desc-preview" style="margin-top: 4px; font-size: 10px; color: #94a3b8; font-style: italic; display: ${node.data.description ? 'block' : 'none'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${node.data.description || ''}</div>
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
            // Se o mouse foi solto fora de um handle de entrada, cancela imediatamente
            const targetEl = upEvt.target as HTMLElement;
            const isTargetInHandle = targetEl?.classList.contains('node-handle-input');

            if (!isTargetInHandle) {
              this.cancelConnection();
            }
          };

          this.activeMoveHandler = onConnectingMove;
          this.activeUpHandler = onConnectingUp;

          window.addEventListener('mousemove', onConnectingMove);
          window.addEventListener('mouseup', onConnectingUp);
        });
      });

      // Conectar no Handle de Entrada
      const inHandle = nodeEl.querySelector('.node-handle-input');
      inHandle?.addEventListener('mouseup', (e: MouseEvent) => {
        e.stopPropagation();
        if (this.connectingFromNodeId) {
          if (this.connectingFromNodeId === node.id) {
            this.callbacks.showModalDialog(
              'Operação Inválida',
              'Não é permitido conectar um bloco diretamente a ele mesmo.',
              '⚠️'
            );
            this.callbacks.showToast('Não é possível conectar um bloco a si mesmo.', 'warning');
            this.cancelConnection();
          } else {
            const edgeId = `e_${this.connectingFromNodeId}_${this.connectingHandle || 'default'}_${node.id}`;
            const alreadyConnected = graph.edges.some(
              (edge) => edge.source === this.connectingFromNodeId && edge.target === node.id && edge.sourceHandle === this.connectingHandle
            );

            if (alreadyConnected) {
              this.callbacks.showToast('Estes dois blocos já estão conectados!', 'warning');
            } else {
              graph.edges.push({
                id: edgeId,
                source: this.connectingFromNodeId,
                target: node.id,
                sourceHandle: this.connectingHandle || 'default',
              });
              this.renderEdges();
              this.renderMinimap();
              this.callbacks.showToast('Ligação conectada com sucesso!', 'info');
            }

            // Regra estrita: se não estiver com CTRL/Meta pressionado, finaliza imediatamente
            const keepConnecting = this.isCtrlConnectionMode || e.ctrlKey || e.metaKey;
            if (!keepConnecting) {
              this.cancelConnection();
            }
          }
        }
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

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', strokeColor);
      path.setAttribute('stroke-width', '2.5');
      path.setAttribute('stroke-linecap', 'round');
      path.style.cursor = 'pointer';

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
        graph.edges = graph.edges.filter((ed) => ed.id !== edge.id);
        this.renderEdges();
        this.renderMinimap();
        this.callbacks.showToast('Ligação excluída!', 'info');
      };

      deleteBadge.addEventListener('click', deleteThisEdge);
      deleteBadge.addEventListener('mousedown', (e: MouseEvent) => e.stopPropagation());

      svgEdges.appendChild(path);
      if (svgControls) {
        svgControls.appendChild(deleteBadge);
      } else {
        svgEdges.appendChild(deleteBadge);
      }
    });
  }

  public generateOrthogonalPath(x1: number, y1: number, x2: number, y2: number): { pathData: string; midX: number; midY: number } {
    const r = 10;

    if (x2 >= x1 + 30) {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      if (Math.abs(y2 - y1) <= r * 2) {
        return {
          pathData: `M ${x1} ${y1} L ${x2} ${y2}`,
          midX,
          midY,
        };
      }

      if (y2 > y1) {
        return {
          pathData: `M ${x1} ${y1} L ${midX - r} ${y1} Q ${midX} ${y1} ${midX} ${y1 + r} L ${midX} ${y2 - r} Q ${midX} ${y2} ${midX + r} ${y2} L ${x2} ${y2}`,
          midX,
          midY,
        };
      } else {
        return {
          pathData: `M ${x1} ${y1} L ${midX - r} ${y1} Q ${midX} ${y1} ${midX} ${y1 - r} L ${midX} ${y2 + r} Q ${midX} ${y2} ${midX + r} ${y2} L ${x2} ${y2}`,
          midX,
          midY,
        };
      }
    } else {
      const margin = 24;
      const startX = x1 + margin;
      const endX = x2 - margin;
      const midY = (y1 + y2) / 2;

      const pathData = `M ${x1} ${y1} L ${startX - r} ${y1} Q ${startX} ${y1} ${startX} ${y1 > y2 ? y1 - r : y1 + r} L ${startX} ${midY + (y1 > y2 ? r : -r)} Q ${startX} ${midY} ${startX - r} ${midY} L ${endX + r} ${midY} Q ${endX} ${midY} ${endX} ${y1 > y2 ? midY - r : midY + r} L ${endX} ${y2 + (y1 > y2 ? r : -r)} Q ${endX} ${y2} ${endX + r} ${y2} L ${x2} ${y2}`;
      return {
        pathData,
        midX: (startX + endX) / 2,
        midY,
      };
    }
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
    const minimapSvg = document.getElementById('minimapSvg');
    const indicator = document.getElementById('minimapIndicator');
    const minimapBody = document.getElementById('minimapBody');
    const canvas = document.getElementById('canvasContainer');
    if (!minimapSvg || !indicator || !minimapBody || !canvas) return;

    minimapSvg.innerHTML = '';

    const graph = this.callbacks.getGraph();
    const nodes = graph.nodes;
    if (nodes.length === 0) {
      indicator.style.display = 'none';
      return;
    }
    indicator.style.display = 'block';

    const mmWidth = minimapBody.clientWidth || 190;
    const mmHeight = minimapBody.clientHeight || 108;

    const canvasRect = canvas.getBoundingClientRect();
    const visibleLeft = -this.panOffset.x / this.zoom;
    const visibleTop = -this.panOffset.y / this.zoom;
    const visibleRight = visibleLeft + canvasRect.width / this.zoom;
    const visibleBottom = visibleTop + canvasRect.height / this.zoom;

    let minX = Math.min(visibleLeft, ...nodes.map((n) => n.position.x));
    let minY = Math.min(visibleTop, ...nodes.map((n) => n.position.y));
    let maxX = Math.max(visibleRight, ...nodes.map((n) => n.position.x + 220));
    let maxY = Math.max(visibleBottom, ...nodes.map((n) => n.position.y + 120));

    const padding = 150;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    const graphWidth = maxX - minX || 1;
    const graphHeight = maxY - minY || 1;

    const scaleX = mmWidth / graphWidth;
    const scaleY = mmHeight / graphHeight;
    const mmScale = Math.min(scaleX, scaleY);

    const offsetX = (mmWidth - graphWidth * mmScale) / 2;
    const offsetY = (mmHeight - graphHeight * mmScale) / 2;

    const toMmX = (x: number) => (x - minX) * mmScale + offsetX;
    const toMmY = (y: number) => (y - minY) * mmScale + offsetY;

    // Conexões no minimapa
    graph.edges.forEach((edge) => {
      const src = nodes.find((n) => n.id === edge.source);
      const tgt = nodes.find((n) => n.id === edge.target);
      if (!src || !tgt) return;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(toMmX(src.position.x + 110)));
      line.setAttribute('y1', String(toMmY(src.position.y + 45)));
      line.setAttribute('x2', String(toMmX(tgt.position.x + 110)));
      line.setAttribute('y2', String(toMmY(tgt.position.y + 45)));
      line.setAttribute('stroke', '#6366f1');
      line.setAttribute('stroke-width', '1.2');
      line.setAttribute('opacity', '0.6');
      minimapSvg.appendChild(line);
    });

    // Nós no minimapa
    const selectedId = this.callbacks.getSelectedNodeId();
    nodes.forEach((node) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const nx = toMmX(node.position.x);
      const ny = toMmY(node.position.y);
      const nw = Math.max(8, 210 * mmScale);
      const nh = Math.max(5, 75 * mmScale);

      rect.setAttribute('x', String(nx));
      rect.setAttribute('y', String(ny));
      rect.setAttribute('width', String(nw));
      rect.setAttribute('height', String(nh));
      rect.setAttribute('rx', '2');
      rect.setAttribute('fill', selectedId === node.id ? '#818cf8' : '#334155');
      rect.setAttribute('stroke', selectedId === node.id ? '#c7d2fe' : '#475569');
      rect.setAttribute('stroke-width', '1');
      minimapSvg.appendChild(rect);
    });

    // Retângulo da área visível
    const indX = toMmX(visibleLeft);
    const indY = toMmY(visibleTop);
    const indW = (canvasRect.width / this.zoom) * mmScale;
    const indH = (canvasRect.height / this.zoom) * mmScale;

    indicator.style.left = `${Math.max(0, indX)}px`;
    indicator.style.top = `${Math.max(0, indY)}px`;
    indicator.style.width = `${Math.min(mmWidth, indW)}px`;
    indicator.style.height = `${Math.min(mmHeight, indH)}px`;
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
        (e.target as HTMLElement).closest('.canvas-minimap')
      ) {
        return;
      }

      this.callbacks.setSelectedNodeId(undefined);
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

  private initMinimapEvents(): void {
    const minimap = document.getElementById('canvasMinimap');
    const minimapBody = document.getElementById('minimapBody');
    const canvas = document.getElementById('canvasContainer');
    if (!minimap || !minimapBody || !canvas) return;

    const navigateToMinimapPoint = (e: MouseEvent) => {
      const graph = this.callbacks.getGraph();
      const nodes = graph.nodes;
      if (nodes.length === 0) return;

      const bodyRect = minimapBody.getBoundingClientRect();
      const clickX = e.clientX - bodyRect.left;
      const clickY = e.clientY - bodyRect.top;

      const mmWidth = bodyRect.width;
      const mmHeight = bodyRect.height;
      const canvasRect = canvas.getBoundingClientRect();

      const visibleLeft = -this.panOffset.x / this.zoom;
      const visibleTop = -this.panOffset.y / this.zoom;
      const visibleRight = visibleLeft + canvasRect.width / this.zoom;
      const visibleBottom = visibleTop + canvasRect.height / this.zoom;

      let minX = Math.min(visibleLeft, ...nodes.map((n) => n.position.x)) - 150;
      let minY = Math.min(visibleTop, ...nodes.map((n) => n.position.y)) - 150;
      let maxX = Math.max(visibleRight, ...nodes.map((n) => n.position.x + 220)) + 150;
      let maxY = Math.max(visibleBottom, ...nodes.map((n) => n.position.y + 120)) + 150;

      const graphWidth = maxX - minX || 1;
      const graphHeight = maxY - minY || 1;
      const mmScale = Math.min(mmWidth / graphWidth, mmHeight / graphHeight);
      const offsetX = (mmWidth - graphWidth * mmScale) / 2;
      const offsetY = (mmHeight - graphHeight * mmScale) / 2;

      const targetWorldX = minX + (clickX - offsetX) / mmScale;
      const targetWorldY = minY + (clickY - offsetY) / mmScale;

      this.panOffset.x = canvasRect.width / 2 - targetWorldX * this.zoom;
      this.panOffset.y = canvasRect.height / 2 - targetWorldY * this.zoom;

      this.updateCanvasTransform();
    };

    minimapBody.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      navigateToMinimapPoint(e);

      const onMinimapMove = (moveEvt: MouseEvent) => {
        navigateToMinimapPoint(moveEvt);
      };

      const onMinimapUp = () => {
        window.removeEventListener('mousemove', onMinimapMove);
        window.removeEventListener('mouseup', onMinimapUp);
      };

      window.addEventListener('mousemove', onMinimapMove);
      window.addEventListener('mouseup', onMinimapUp);
    });
  }
}
