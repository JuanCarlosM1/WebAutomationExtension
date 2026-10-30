import { describe, it, expect } from 'vitest';
import { DialogMenu } from '../../../src/editor/modules/dialogUtils';

const key = (k: string) => window.dispatchEvent(new KeyboardEvent('keydown', { key: k, cancelable: true }));
const backdrops = () => document.querySelectorAll('.flow-dialog-backdrop');

describe('DialogMenu.confirm', () => {
  it('aceita string e usa textos padrão', async () => {
    const p = DialogMenu.confirm('Tem certeza?');
    const bd = backdrops();
    expect(bd.length).toBe(1);
    const card = bd[0].querySelector('.flow-dialog-card') as HTMLElement;
    expect(card.textContent).toContain('Confirmação Necessária');
    expect(card.textContent).toContain('Tem certeza?');
    expect(card.querySelector('#dialogBtnConfirm')!.textContent).toBe('Confirmar');
    expect(card.querySelector('#dialogBtnCancel')!.textContent).toBe('Cancelar');
    // isDanger padrão = true -> borda vermelha
    expect(card.style.cssText).toContain('rgb(239, 68, 68)');
    expect(card.textContent).toContain('⚠️');
    expect(document.activeElement).toBe(card.querySelector('#dialogBtnConfirm'));
    (card.querySelector('#dialogBtnConfirm') as HTMLButtonElement).click();
    await expect(p).resolves.toBe(true);
    expect(backdrops().length).toBe(0);
  });

  it('usa opções customizadas e isDanger=false', async () => {
    const p = DialogMenu.confirm({ message: 'm', title: 'T', confirmText: 'Sim', cancelText: 'Não', isDanger: false });
    const card = document.querySelector('.flow-dialog-card') as HTMLElement;
    expect(card.querySelector('h3')!.textContent).toBe('T');
    expect(card.querySelector('#dialogBtnConfirm')!.textContent).toBe('Sim');
    expect(card.querySelector('#dialogBtnCancel')!.textContent).toBe('Não');
    expect(card.textContent).toContain('❓');
    expect(card.style.cssText).toContain('rgb(59, 130, 246)');
    (card.querySelector('#dialogBtnCancel') as HTMLButtonElement).click();
    await expect(p).resolves.toBe(false);
  });

  it('Escape resolve false e Enter resolve true', async () => {
    const p1 = DialogMenu.confirm('a');
    key('Escape');
    await expect(p1).resolves.toBe(false);
    const p2 = DialogMenu.confirm('b');
    key('Enter');
    await expect(p2).resolves.toBe(true);
    expect(backdrops().length).toBe(0);
  });

  it('outras teclas são ignoradas', async () => {
    const p = DialogMenu.confirm('a');
    key('a');
    expect(backdrops().length).toBe(1);
    key('Enter');
    await p;
  });

  it('clique no backdrop cancela, mas clique no card não', async () => {
    const p = DialogMenu.confirm('a');
    const bd = backdrops()[0] as HTMLElement;
    (bd.querySelector('.flow-dialog-card') as HTMLElement).click();
    expect(backdrops().length).toBe(1);
    bd.click();
    await expect(p).resolves.toBe(false);
  });

  it('remove o listener de teclado após fechar', async () => {
    const p = DialogMenu.confirm('a');
    key('Enter');
    await p;
    const p2 = DialogMenu.confirm('b');
    key('Escape');
    await expect(p2).resolves.toBe(false);
  });

  it('fecha diálogos existentes ao abrir um novo', () => {
    DialogMenu.confirm('a');
    DialogMenu.alert('b');
    expect(backdrops().length).toBe(1);
    expect(backdrops()[0].textContent).toContain('b');
    key('Enter');
  });
});

describe('DialogMenu.alert', () => {
  it.each([
    ['info', 'ℹ️', 'Informação', 'rgb(59, 130, 246)'],
    ['error', '❌', 'Atenção / Erro', 'rgb(239, 68, 68)'],
    ['warning', '⚠️', 'Aviso', 'rgb(245, 158, 11)'],
    ['success', '✅', 'Informação', 'rgb(16, 185, 129)'],
  ] as const)('tipo %s usa ícone, título e cor corretos', async (type, icon, title, color) => {
    const p = DialogMenu.alert({ message: 'msg', type });
    const card = document.querySelector('.flow-dialog-card') as HTMLElement;
    expect(card.textContent).toContain(icon);
    expect(card.querySelector('h3')!.textContent).toBe(title);
    expect(card.style.cssText).toContain(color);
    (card.querySelector('#dialogBtnOk') as HTMLButtonElement).click();
    await expect(p).resolves.toBeUndefined();
  });

  it('aceita string, título e texto custom', async () => {
    const p = DialogMenu.alert({ message: 'x', title: 'Meu', confirmText: 'OK!' });
    const card = document.querySelector('.flow-dialog-card') as HTMLElement;
    expect(card.querySelector('h3')!.textContent).toBe('Meu');
    expect(card.querySelector('#dialogBtnOk')!.textContent).toBe('OK!');
    expect(document.activeElement).toBe(card.querySelector('#dialogBtnOk'));
    key('Escape');
    await p;
    const p2 = DialogMenu.alert('simples');
    expect(document.querySelector('#dialogBtnOk')!.textContent).toBe('Entendido');
    key('Enter');
    await p2;
    expect(backdrops().length).toBe(0);
  });

  it('clique no backdrop fecha; outras teclas não', async () => {
    const p = DialogMenu.alert('x');
    key('x');
    expect(backdrops().length).toBe(1);
    (backdrops()[0] as HTMLElement).click();
    await p;
    expect(backdrops().length).toBe(0);
  });
});

describe('DialogMenu.prompt', () => {
  it('retorna o valor digitado ao confirmar', async () => {
    const p = DialogMenu.prompt({ message: 'Nome?', defaultValue: 'abc', placeholder: 'ph' });
    const input = document.querySelector('#dialogPromptInput') as HTMLInputElement;
    expect(input.value).toBe('abc');
    expect(input.placeholder).toBe('ph');
    expect(document.activeElement).toBe(input);
    input.value = 'novo';
    (document.querySelector('#dialogBtnConfirm') as HTMLButtonElement).click();
    await expect(p).resolves.toBe('novo');
  });

  it('usa padrões quando string', async () => {
    const p = DialogMenu.prompt('Pergunta');
    const card = document.querySelector('.flow-dialog-card') as HTMLElement;
    expect(card.querySelector('h3')!.textContent).toBe('Entrada de Dados');
    expect(card.querySelector('#dialogBtnConfirm')!.textContent).toBe('Salvar');
    expect(card.querySelector('#dialogBtnCancel')!.textContent).toBe('Cancelar');
    expect((card.querySelector('#dialogPromptInput') as HTMLInputElement).value).toBe('');
    key('Enter');
    await expect(p).resolves.toBe('');
  });

  it('cancelar, Escape e backdrop retornam null', async () => {
    let p = DialogMenu.prompt({ message: 'a', title: 'T', confirmText: 'C', cancelText: 'X' });
    expect(document.querySelector('#dialogBtnCancel')!.textContent).toBe('X');
    (document.querySelector('#dialogBtnCancel') as HTMLButtonElement).click();
    await expect(p).resolves.toBeNull();
    p = DialogMenu.prompt('b');
    key('Escape');
    await expect(p).resolves.toBeNull();
    p = DialogMenu.prompt('c');
    (backdrops()[0] as HTMLElement).click();
    await expect(p).resolves.toBeNull();
    p = DialogMenu.prompt('d');
    (document.querySelector('#dialogPromptInput') as HTMLElement).click();
    expect(backdrops().length).toBe(1);
    key('Enter');
    await p;
  });
});

describe('DialogMenu.closeExisting', () => {
  it('remove todos os backdrops', () => {
    for (let i = 0; i < 3; i++) {
      const d = document.createElement('div');
      d.className = 'flow-dialog-backdrop';
      document.body.appendChild(d);
    }
    DialogMenu.closeExisting();
    expect(backdrops().length).toBe(0);
  });
});
