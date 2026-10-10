/**
 * Utilitários para conexões ortogonais e arestas (edges) no canvas
 */

export class CanvasPathUtils {
  /**
   * Calcula as coordenadas do centro de uma porta/handle para ligar arestas
   */
  public static getHandleCenterPoint(
    handleEl: HTMLElement | null,
    fallbackX: number,
    fallbackY: number
  ): { x: number; y: number } {
    if (!handleEl) return { x: fallbackX, y: fallbackY };

    const nodeEl = handleEl.closest('.graph-node') as HTMLElement;
    if (!nodeEl) return { x: fallbackX, y: fallbackY };

    const nodeLeft = parseFloat(nodeEl.style.left) || 0;
    const nodeTop = parseFloat(nodeEl.style.top) || 0;

    let localLeft = handleEl.offsetLeft;
    let localTop = handleEl.offsetTop;
    let curr = handleEl.offsetParent as HTMLElement;
    while (curr && curr !== nodeEl) {
      localLeft += curr.offsetLeft;
      localTop += curr.offsetTop;
      curr = curr.offsetParent as HTMLElement;
    }

    const width = handleEl.offsetWidth || 12;
    const height = handleEl.offsetHeight || 12;

    return {
      x: nodeLeft + localLeft + width / 2,
      y: nodeTop + localTop + height / 2,
    };
  }

  /**
   * Gera o caminho ortogonal suavizado SVG entre dois pontos (x1, y1) e (x2, y2)
   */
  public static generateOrthogonalPath(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): { pathData: string; midX: number; midY: number } {
    const r = 10;

    if (x2 >= x1 + 30) {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      // Se a diferença vertical for mínima, linha reta horizontal
      if (Math.abs(y2 - y1) < 2) {
        return {
          pathData: `M ${x1} ${y1} L ${x2} ${y2}`,
          midX,
          midY,
        };
      }

      const effectiveR = Math.min(r, Math.abs(y2 - y1) / 2, (x2 - x1) / 4);

      if (y2 > y1) {
        return {
          pathData: `M ${x1} ${y1} L ${midX - effectiveR} ${y1} Q ${midX} ${y1} ${midX} ${y1 + effectiveR} L ${midX} ${y2 - effectiveR} Q ${midX} ${y2} ${midX + effectiveR} ${y2} L ${x2} ${y2}`,
          midX,
          midY,
        };
      } else {
        return {
          pathData: `M ${x1} ${y1} L ${midX - effectiveR} ${y1} Q ${midX} ${y1} ${midX} ${y1 - effectiveR} L ${midX} ${y2 + effectiveR} Q ${midX} ${y2} ${midX + effectiveR} ${y2} L ${x2} ${y2}`,
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
}
