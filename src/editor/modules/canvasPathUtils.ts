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
   * Roteia uma corda ortogonal evitando atravessar blocos (obstáculos).
   * Usa A* sobre uma grade esparsa formada pelas bordas dos obstáculos, penalizando curvas.
   * Retorna null se não houver rota (o chamador usa o caminho padrão).
   */
  private static routeAroundObstacles(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    obstacles: { x: number; y: number; w: number; h: number }[]
  ): { x: number; y: number }[] | null {
    const pad = 14;
    const stub = 20;
    const s = { x: x1 + stub, y: y1 };
    const t = { x: x2 - stub, y: y2 };

    const rects = obstacles
      .map((o) => ({ l: o.x - pad, t: o.y - pad, r: o.x + o.w + pad, b: o.y + o.h + pad }))
      .filter((o) => {
        const inside = (p: { x: number; y: number }) => p.x > o.l && p.x < o.r && p.y > o.t && p.y < o.b;
        return !inside(s) && !inside(t);
      });
    if (rects.length === 0) return null;

    const xsSet = new Set<number>([s.x, t.x]);
    const ysSet = new Set<number>([s.y, t.y]);
    rects.forEach((o) => {
      xsSet.add(o.l);
      xsSet.add(o.r);
      ysSet.add(o.t);
      ysSet.add(o.b);
    });
    const xs = Array.from(xsSet).sort((a, b) => a - b);
    const ys = Array.from(ysSet).sort((a, b) => a - b);

    const blockedSeg = (ax: number, ay: number, bx: number, by: number): boolean => {
      const minX = Math.min(ax, bx);
      const maxX = Math.max(ax, bx);
      const minY = Math.min(ay, by);
      const maxY = Math.max(ay, by);
      return rects.some((o) => maxX > o.l && minX < o.r && maxY > o.t && minY < o.b && !(minX === maxX && (minX <= o.l || minX >= o.r)) && !(minY === maxY && (minY <= o.t || minY >= o.b)));
    };

    const nx = xs.length;
    const ny = ys.length;
    const si = xs.indexOf(s.x);
    const sj = ys.indexOf(s.y);
    const ti = xs.indexOf(t.x);
    const tj = ys.indexOf(t.y);
    const dirs = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];
    const key = (i: number, j: number, d: number) => (i * ny + j) * 4 + d;
    const bendCost = 40;

    const dist = new Map<number, number>();
    const prev = new Map<number, number>();
    const open: { k: number; i: number; j: number; d: number; f: number; g: number }[] = [];
    const h = (i: number, j: number) => Math.abs(xs[i] - xs[ti]) + Math.abs(ys[j] - ys[tj]);

    const startK = key(si, sj, 0);
    dist.set(startK, 0);
    open.push({ k: startK, i: si, j: sj, d: 0, f: h(si, sj), g: 0 });

    let endK = -1;
    let guard = 0;
    while (open.length && guard++ < 60000) {
      let bi = 0;
      for (let q = 1; q < open.length; q++) if (open[q].f < open[bi].f) bi = q;
      const cur = open.splice(bi, 1)[0];
      if (cur.g > (dist.get(cur.k) ?? Infinity)) continue;
      if (cur.i === ti && cur.j === tj) {
        endK = cur.k;
        break;
      }
      for (let d = 0; d < 4; d++) {
        const ni = cur.i + dirs[d][0];
        const nj = cur.j + dirs[d][1];
        if (ni < 0 || nj < 0 || ni >= nx || nj >= ny) continue;
        if (blockedSeg(xs[cur.i], ys[cur.j], xs[ni], ys[nj])) continue;
        const len = Math.abs(xs[ni] - xs[cur.i]) + Math.abs(ys[nj] - ys[cur.j]);
        const g = cur.g + len + (d !== cur.d ? bendCost : 0);
        const nk = key(ni, nj, d);
        if (g < (dist.get(nk) ?? Infinity)) {
          dist.set(nk, g);
          prev.set(nk, cur.k);
          open.push({ k: nk, i: ni, j: nj, d, g, f: g + h(ni, nj) });
        }
      }
    }
    if (endK < 0) return null;

    const pts: { x: number; y: number }[] = [];
    let k: number | undefined = endK;
    while (k !== undefined) {
      const cell = Math.floor(k / 4);
      pts.push({ x: xs[Math.floor(cell / ny)], y: ys[cell % ny] });
      k = prev.get(k);
    }
    pts.reverse();

    // Remove pontos colineares
    const simplified = [{ x: x1, y: y1 }, ...pts, { x: x2, y: y2 }].filter((p, idx, arr) => {
      if (idx === 0 || idx === arr.length - 1) return true;
      const a = arr[idx - 1];
      const b = arr[idx + 1];
      return !((a.x === p.x && p.x === b.x) || (a.y === p.y && p.y === b.y));
    });
    return simplified;
  }

  private static polylineToRoundedPath(pts: { x: number; y: number }[], r: number): { pathData: string; midX: number; midY: number } {
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const a = pts[i - 1];
      const p = pts[i];
      const b = pts[i + 1];
      const l1 = Math.abs(p.x - a.x) + Math.abs(p.y - a.y);
      const l2 = Math.abs(b.x - p.x) + Math.abs(b.y - p.y);
      const rr = Math.min(r, l1 / 2, l2 / 2);
      const ux = Math.sign(p.x - a.x);
      const uy = Math.sign(p.y - a.y);
      const vx = Math.sign(b.x - p.x);
      const vy = Math.sign(b.y - p.y);
      d += ` L ${p.x - ux * rr} ${p.y - uy * rr} Q ${p.x} ${p.y} ${p.x + vx * rr} ${p.y + vy * rr}`;
    }
    const last = pts[pts.length - 1];
    d += ` L ${last.x} ${last.y}`;

    // Ponto médio ao longo do comprimento total (posição do botão de excluir)
    let total = 0;
    for (let i = 1; i < pts.length; i++) total += Math.abs(pts[i].x - pts[i - 1].x) + Math.abs(pts[i].y - pts[i - 1].y);
    let acc = 0;
    let midX = pts[0].x;
    let midY = pts[0].y;
    for (let i = 1; i < pts.length; i++) {
      const seg = Math.abs(pts[i].x - pts[i - 1].x) + Math.abs(pts[i].y - pts[i - 1].y);
      if (acc + seg >= total / 2) {
        const f = seg === 0 ? 0 : (total / 2 - acc) / seg;
        midX = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * f;
        midY = pts[i - 1].y + (pts[i].y - pts[i - 1].y) * f;
        break;
      }
      acc += seg;
    }
    return { pathData: d, midX, midY };
  }

  /**
   * Gera o caminho ortogonal suavizado SVG entre dois pontos (x1, y1) e (x2, y2).
   * Se obstacles for informado, tenta desviar dos blocos.
   */
  public static generateOrthogonalPath(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    obstacles?: { x: number; y: number; w: number; h: number }[]
  ): { pathData: string; midX: number; midY: number } {
    const r = 10;

    if (obstacles && obstacles.length > 0) {
      let defaultClear = false;
      if (x2 >= x1 + 30) {
        const mx = (x1 + x2) / 2;
        const segs: [number, number, number, number][] = [
          [x1, y1, mx, y1],
          [mx, y1, mx, y2],
          [mx, y2, x2, y2],
        ];
        const touches = (o: { x: number; y: number; w: number; h: number }, px: number, py: number) =>
          px >= o.x - 10 && px <= o.x + o.w + 10 && py >= o.y - 10 && py <= o.y + o.h + 10;
        defaultClear = !segs.some(([ax, ay, bx, by]) =>
          obstacles.some((o) => {
            if (touches(o, x1, y1) || touches(o, x2, y2)) return false;
            const p = 6;
            return Math.max(ax, bx) > o.x - p && Math.min(ax, bx) < o.x + o.w + p && Math.max(ay, by) > o.y - p && Math.min(ay, by) < o.y + o.h + p;
          })
        );
      }
      if (!defaultClear) {
        const route = this.routeAroundObstacles(x1, y1, x2, y2, obstacles);
        if (route && route.length >= 2) {
          return this.polylineToRoundedPath(route, r);
        }
      }
    }

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
