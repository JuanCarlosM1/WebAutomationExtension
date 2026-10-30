import { describe, it, expect, vi, beforeEach } from 'vitest';

type Mod = typeof import('../../../src/editor/modules/editorUtils');
let mod: Mod;

beforeEach(async () => {
  vi.resetModules();
  mod = await import('../../../src/editor/modules/editorUtils');
});

function addContainer() {
  const c = document.createElement('div');
  c.id = 'toastContainer';
  document.body.appendChild(c);
  return c;
}

describe('showToast', () => {
  it('não faz nada sem #toastContainer', () => {
    expect(() => mod.showToast('x')).not.toThrow();
    expect(document.querySelectorAll('.toast').length).toBe(0);
  });

  it('cria toast com tipo padrão info', () => {
    const c = addContainer();
    mod.showToast('Olá');
    const t = c.querySelector('.toast') as HTMLElement;
    expect(t.className).toBe('toast toast-info');
    expect(t.textContent).toBe('Olá');
    expect(t.title).toBe('Clique para fechar');
  });

  it.each(['success', 'error', 'warning'] as const)('aplica classe do tipo %s', (type) => {
    const c = addContainer();
    mod.showToast('m-' + type, type);
    expect(c.querySelector(`.toast-${type}`)).not.toBeNull();
  });

  it('ignora mensagem duplicada dentro de 1500ms e permite depois', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    const c = addContainer();
    mod.showToast('dup');
    mod.showToast('dup');
    expect(c.children.length).toBe(1);
    mod.showToast('outra');
    expect(c.children.length).toBe(2);
    vi.advanceTimersByTime(1499);
    mod.showToast('dup');
    expect(c.children.length).toBe(2);
    vi.advanceTimersByTime(1);
    mod.showToast('dup');
    expect(c.children.length).toBe(3);
  });

  it('auto-remove após 2200ms + 150ms de animação', () => {
    vi.useFakeTimers();
    const c = addContainer();
    mod.showToast('auto');
    const t = c.querySelector('.toast') as HTMLElement;
    vi.advanceTimersByTime(2199);
    expect(t.style.opacity).toBe('');
    vi.advanceTimersByTime(1);
    expect(t.style.opacity).toBe('0');
    expect(t.style.transform).toBe('translateY(10px)');
    expect(c.contains(t)).toBe(true);
    vi.advanceTimersByTime(150);
    expect(c.contains(t)).toBe(false);
  });

  it('fecha ao clicar', () => {
    vi.useFakeTimers();
    const c = addContainer();
    mod.showToast('click');
    const t = c.querySelector('.toast') as HTMLElement;
    t.click();
    expect(t.style.opacity).toBe('0');
    vi.advanceTimersByTime(150);
    expect(c.children.length).toBe(0);
  });
});

describe('showModalDialog', () => {
  it('renderiza título, mensagem e ícone padrão', () => {
    mod.showModalDialog('Título', '<b>corpo</b>');
    const bd = document.querySelector('.flow-modal-backdrop') as HTMLElement;
    expect(bd.querySelector('.flow-modal-title')!.textContent).toBe('Título');
    expect(bd.querySelector('.flow-modal-body b')!.textContent).toBe('corpo');
    expect(bd.querySelector('.flow-modal-icon svg')).not.toBeNull();
  });

  it('aceita ícone customizado e substitui modal existente', () => {
    mod.showModalDialog('A', 'a');
    mod.showModalDialog('B', 'b', '🔥');
    const all = document.querySelectorAll('.flow-modal-backdrop');
    expect(all.length).toBe(1);
    expect(all[0].querySelector('.flow-modal-icon')!.textContent).toBe('🔥');
    expect(all[0].querySelector('.flow-modal-title')!.textContent).toBe('B');
  });

  it('fecha pelo botão OK', () => {
    mod.showModalDialog('A', 'a');
    (document.querySelector('.flow-modal-ok-btn') as HTMLButtonElement).click();
    expect(document.querySelector('.flow-modal-backdrop')).toBeNull();
  });

  it('fecha clicando no backdrop, mas não no card', () => {
    mod.showModalDialog('A', 'a');
    (document.querySelector('.flow-modal-card') as HTMLElement).click();
    expect(document.querySelector('.flow-modal-backdrop')).not.toBeNull();
    (document.querySelector('.flow-modal-backdrop') as HTMLElement).click();
    expect(document.querySelector('.flow-modal-backdrop')).toBeNull();
  });
});

describe('sanitizeGraph', () => {
  const fb = () => ({ buttonIcon: '🚀', svgIcon: '<svg/>', imageIcon: 'data:img' });

  it('não muta o grafo original', () => {
    const g: any = { nodes: [{ id: 's', type: 'start', data: { floatingButton: fb() } }], edges: [] };
    const out = mod.sanitizeGraph(g);
    expect(out).not.toBe(g);
    expect(g.nodes[0].data.floatingButton.svgIcon).toBe('<svg/>');
  });

  it('emoji (padrão) remove svgIcon e imageIcon', () => {
    const g: any = { nodes: [{ id: 's', type: 'start', data: { floatingButton: fb() } }], edges: [] };
    const out: any = mod.sanitizeGraph(g);
    expect(out.nodes[0].data.floatingButton).toEqual({ buttonIcon: '🚀' });
  });

  it('svg remove buttonIcon e imageIcon', () => {
    const g: any = {
      nodes: [{ id: 's', type: 'start', data: { floatingButton: { ...fb(), iconType: 'svg' } } }],
      edges: [],
    };
    expect((mod.sanitizeGraph(g) as any).nodes[0].data.floatingButton).toEqual({ iconType: 'svg', svgIcon: '<svg/>' });
  });

  it('image remove buttonIcon e svgIcon (também nos triggers)', () => {
    const g: any = {
      nodes: [
        {
          id: 's',
          type: 'start',
          data: { triggers: [{ floatingButton: { ...fb(), iconType: 'image' } }, { type: 'x' }] },
        },
      ],
      edges: [],
    };
    const out: any = mod.sanitizeGraph(g);
    expect(out.nodes[0].data.triggers[0].floatingButton).toEqual({ iconType: 'image', imageIcon: 'data:img' });
    expect(out.nodes[0].data.triggers[1]).toEqual({ type: 'x' });
  });

  it('iconType desconhecido mantém tudo; nós não-start e sem data são ignorados', () => {
    const g: any = {
      nodes: [
        { id: 's', type: 'start', data: { floatingButton: { ...fb(), iconType: 'other' } } },
        { id: 'c', type: 'click', data: { floatingButton: fb() } },
        { id: 's2', type: 'start' },
      ],
      edges: [],
    };
    const out: any = mod.sanitizeGraph(g);
    expect(out.nodes[0].data.floatingButton).toEqual({ ...fb(), iconType: 'other' });
    expect(out.nodes[1].data.floatingButton).toEqual(fb());
    expect(out.nodes[2]).toEqual({ id: 's2', type: 'start' });
  });

  it('reexporta DialogMenu', () => {
    expect(typeof mod.DialogMenu.confirm).toBe('function');
  });
});
