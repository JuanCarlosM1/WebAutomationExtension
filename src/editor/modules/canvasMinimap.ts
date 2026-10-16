/**
 * Módulo do Minimapa Interativo do Canvas
 */
import { AnyAutomationNode, AutomationEdge } from '../../../../BibliotecaDeDev/src/types/schema';

export interface MinimapOptions {
  getNodes: () => AnyAutomationNode[];
  getEdges: () => AutomationEdge[];
  getSelectedNodeId: () => string | undefined;
  getSelectedNodeIds?: () => string[];
  getZoom: () => number;
  getPanOffset: () => { x: number; y: number };
  onNavigate: (newPanX: number, newPanY: number) => void;
}

export class CanvasMinimap {
  constructor(private options: MinimapOptions) {
    this.initEvents();
  }

  public render(): void {
    const minimapSvg = document.getElementById('minimapSvg');
    const indicator = document.getElementById('minimapIndicator');
    const minimapBody = document.getElementById('minimapBody');
    const canvas = document.getElementById('canvasContainer');
    if (!minimapSvg || !indicator || !minimapBody || !canvas) return;

    minimapSvg.innerHTML = '';

    const nodes = this.options.getNodes();
    if (nodes.length === 0) {
      indicator.style.display = 'none';
      return;
    }
    indicator.style.display = 'block';

    const mmWidth = minimapBody.clientWidth || 190;
    const mmHeight = minimapBody.clientHeight || 108;

    const zoom = this.options.getZoom();
    const panOffset = this.options.getPanOffset();

    const canvasRect = canvas.getBoundingClientRect();
    const visibleLeft = -panOffset.x / zoom;
    const visibleTop = -panOffset.y / zoom;
    const visibleRight = visibleLeft + canvasRect.width / zoom;
    const visibleBottom = visibleTop + canvasRect.height / zoom;

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
    const edges = this.options.getEdges();
    edges.forEach((edge) => {
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
    const selectedId = this.options.getSelectedNodeId();
    const selectedIds = new Set(this.options.getSelectedNodeIds ? this.options.getSelectedNodeIds() : (selectedId ? [selectedId] : []));
    nodes.forEach((node) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const nx = toMmX(node.position.x);
      const ny = toMmY(node.position.y);
      const nw = Math.max(8, 210 * mmScale);
      const nh = Math.max(5, 75 * mmScale);

      const isSelected = selectedIds.has(node.id);
      rect.setAttribute('x', String(nx));
      rect.setAttribute('y', String(ny));
      rect.setAttribute('width', String(nw));
      rect.setAttribute('height', String(nh));
      rect.setAttribute('rx', '2');
      rect.setAttribute('fill', isSelected ? '#818cf8' : '#334155');
      rect.setAttribute('stroke', isSelected ? '#c7d2fe' : '#475569');
      rect.setAttribute('stroke-width', isSelected ? '1.5' : '1');
      minimapSvg.appendChild(rect);
    });

    // Retângulo da área visível
    const indX = toMmX(visibleLeft);
    const indY = toMmY(visibleTop);
    const indW = (canvasRect.width / zoom) * mmScale;
    const indH = (canvasRect.height / zoom) * mmScale;

    indicator.style.left = `${Math.max(0, indX)}px`;
    indicator.style.top = `${Math.max(0, indY)}px`;
    indicator.style.width = `${Math.min(mmWidth, indW)}px`;
    indicator.style.height = `${Math.min(mmHeight, indH)}px`;
  }

  private initEvents(): void {
    const minimapBody = document.getElementById('minimapBody');
    const canvas = document.getElementById('canvasContainer');
    if (!minimapBody || !canvas) return;

    const navigateToMinimapPoint = (e: MouseEvent) => {
      const nodes = this.options.getNodes();
      if (nodes.length === 0) return;

      const bodyRect = minimapBody.getBoundingClientRect();
      const clickX = e.clientX - bodyRect.left;
      const clickY = e.clientY - bodyRect.top;

      const mmWidth = bodyRect.width;
      const mmHeight = bodyRect.height;
      const canvasRect = canvas.getBoundingClientRect();
      const zoom = this.options.getZoom();
      const panOffset = this.options.getPanOffset();

      const visibleLeft = -panOffset.x / zoom;
      const visibleTop = -panOffset.y / zoom;
      const visibleRight = visibleLeft + canvasRect.width / zoom;
      const visibleBottom = visibleTop + canvasRect.height / zoom;

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

      const newPanX = canvasRect.width / 2 - targetWorldX * zoom;
      const newPanY = canvasRect.height / 2 - targetWorldY * zoom;

      this.options.onNavigate(newPanX, newPanY);
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
