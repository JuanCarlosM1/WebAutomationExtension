import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HtmlElementAnalyzer, HtmlAnalysisResult } from '../../src/editor/modules/htmlElementAnalyzer';
import { installChromeMock, ChromeMock } from '../helpers/chromeMock';

describe('HTML Element Analyzer (htmlElementAnalyzer.ts)', () => {
  let chromeMock: ChromeMock;

  beforeEach(() => {
    chromeMock = installChromeMock();
    document.body.innerHTML = `
      <div id="mainContainer">
        <button id="btnTest" class="primary-btn">Test Button</button>
      </div>
    `;
  });

  it('open deve renderizar o painel modal do analisador no DOM', () => {
    HtmlElementAnalyzer.open();

    const modal = document.querySelector('.html-analyzer-modal');
    expect(modal).toBeDefined();
    expect(modal?.innerHTML).toContain('Analisador');
  });

  it('openInNewTab deve chamar tabs.create com analyzer.html', () => {
    HtmlElementAnalyzer.openInNewTab();

    expect(chromeMock.tabs.create).toHaveBeenCalledWith({
      url: expect.stringContaining('analyzer.html'),
    });
  });

  it('showAnalysisModal deve renderizar os detalhes do elemento analisado', () => {
    const analysis: HtmlAnalysisResult = {
      target: {
        tagName: 'BUTTON',
        id: 'btnTest',
        classes: ['primary-btn'],
        textSnippet: 'Test Button',
        selector: '#btnTest',
        xpath: '//button[@id="btnTest"]',
        attributes: { id: 'btnTest', class: 'primary-btn' },
      },
      children: [],
    };

    HtmlElementAnalyzer.showAnalysisModal(analysis);

    const modal = document.querySelector('.html-analyzer-modal');
    expect(modal).toBeDefined();
    expect(modal?.innerHTML).toContain('#btnTest');
    expect(modal?.innerHTML.toLowerCase()).toContain('button');
  });

  it('startLivePicker deve buscar aba ativa e enviar comando OPEN_HTML_ANALYZER', async () => {
    chromeMock.tabs.query.mockImplementation((_q: any, cb?: any) => {
      cb?.([{ id: 7, url: 'https://exemplo.com', active: true }]);
    });
    chromeMock.tabs.sendMessage.mockImplementation((_tabId: number, _msg: any, cb?: any) => {
      cb?.({ success: true });
    });

    await HtmlElementAnalyzer.startLivePicker();

    expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(
      7,
      expect.objectContaining({ action: 'OPEN_HTML_ANALYZER' }),
      expect.any(Function)
    );
  });
});
