import { describe, it, expect } from 'vitest';
import { CanvasPathUtils } from '../../src/editor/modules/canvasPathUtils';

describe('Canvas Path Utils (canvasPathUtils.ts)', () => {
  it('generateOrthogonalPath deve gerar caminho SVG com curvas suavizadas quando x2 >= x1 + 30', () => {
    const res = CanvasPathUtils.generateOrthogonalPath(100, 100, 300, 200);

    expect(res).toBeDefined();
    expect(res.pathData).toContain('M 100 100');
    expect(res.pathData).toContain('Q');
    expect(res.pathData).toContain('300 200');
    expect(res.midX).toBe(200);
    expect(res.midY).toBe(150);
  });

  it('generateOrthogonalPath com pontos alinhados horizontalmente deve gerar linha direta L', () => {
    const res = CanvasPathUtils.generateOrthogonalPath(100, 100, 300, 100);

    expect(res.pathData).toBe('M 100 100 L 300 100');
    expect(res.midX).toBe(200);
    expect(res.midY).toBe(100);
  });

  it('generateOrthogonalPath quando x2 < x1 + 30 deve gerar rota de contorno com curva em S', () => {
    const res = CanvasPathUtils.generateOrthogonalPath(300, 100, 100, 250);

    expect(res.pathData).toContain('M 300 100');
    expect(res.pathData).toContain('L');
    expect(res.pathData).toContain('100 250');
  });

  it('getHandleCenterPoint deve retornar fallback se handleEl for nulo', () => {
    const pt = CanvasPathUtils.getHandleCenterPoint(null, 50, 60);
    expect(pt).toEqual({ x: 50, y: 60 });
  });

  it('generateOrthogonalPath desviando de obstáculos', () => {
    const obstacles = [{ x: 180, y: 80, w: 50, h: 60 }];
    const res = CanvasPathUtils.generateOrthogonalPath(100, 100, 300, 100, obstacles);

    expect(res).toBeDefined();
    expect(res.pathData).toContain('M');
  });
});
