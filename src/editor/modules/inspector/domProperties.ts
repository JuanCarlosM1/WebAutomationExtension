/**
 * Renderizador de propriedades para nós de ação no DOM e navegador:
 * - tab_action
 * - click_element
 * - type_input
 * - scroll
 */
import { InspectorInputHelpers } from '../inspectorInputHelpers';

export interface DomPropertiesContext {
  renderInspector: () => void;
}

export class DomPropertiesRenderer {
  public static renderTabAction(form: HTMLElement, data: any, ctx: DomPropertiesContext): void {
    InspectorInputHelpers.addSelectInput(
      form,
      'Ação de Aba',
      data.action || 'new_tab',
      [
        { value: 'new_tab', label: 'Nova Aba' },
        { value: 'switch_tab', label: 'Trocar Aba' },
        { value: 'close_tab', label: 'Fechar Aba' },
        { value: 'get_current_url', label: 'Obter URL Atual' },
      ],
      (val) => {
        data.action = val;
        ctx.renderInspector();
      }
    );

    if (data.action === 'new_tab') {
      InspectorInputHelpers.addTextInput(form, 'URL Inicial', data.url || 'https://google.com', (val) => (data.url = val));
      InspectorInputHelpers.addCheckboxInput(form, 'Focar Imediatamente', data.active !== false, (val) => (data.active = val));
      InspectorInputHelpers.addTextInput(form, 'Salvar URL em Variável (opcional)', data.saveUrlToVar || '', (val) => (data.saveUrlToVar = val));
    } else if (data.action === 'switch_tab' || data.action === 'close_tab') {
      InspectorInputHelpers.addSelectInput(
        form,
        'Critério de Busca',
        data.queryType || 'title',
        [
          { value: 'title', label: 'Por Título da Aba' },
          { value: 'index', label: 'Por Posição / Índice' },
          { value: 'url_match', label: 'Por Correspondência de URL' },
        ],
        (val) => (data.queryType = val)
      );
      InspectorInputHelpers.addTextInput(form, 'Valor da Busca', data.queryValue || '', (val) => (data.queryValue = val));
    } else if (data.action === 'get_current_url') {
      InspectorInputHelpers.addTextInput(form, 'Salvar URL na Variável', data.saveUrlToVar || 'currentUrl', (val) => (data.saveUrlToVar = val));
    }
  }

  public static renderClick(form: HTMLElement, data: any): void {
    InspectorInputHelpers.addTextInput(form, 'Seletor do Elemento', data.selector || '', (val) => (data.selector = val));
    InspectorInputHelpers.addSelectInput(
      form,
      'Tipo de Seletor',
      data.selectorType || 'css',
      [
        { value: 'css', label: 'Seletor CSS' },
        { value: 'xpath', label: 'XPath' },
      ],
      (val) => (data.selectorType = val)
    );
    InspectorInputHelpers.addSelectInput(
      form,
      'Tipo de Clique',
      data.clickType || 'single',
      [
        { value: 'single', label: 'Clique Simples (Botão Esquerdo)' },
        { value: 'double', label: 'Clique Duplo' },
        { value: 'contextmenu', label: 'Clique com Botão Direito' },
      ],
      (val) => (data.clickType = val)
    );
    InspectorInputHelpers.addCheckboxInput(form, 'Aguardar Elemento antes do Clique', data.waitForElement !== false, (val) => (data.waitForElement = val));
    InspectorInputHelpers.addNumberInput(form, 'Tempo Limite (ms)', data.timeoutMs ?? 5000, (val) => (data.timeoutMs = val));
  }

  public static renderTypeInput(form: HTMLElement, data: any, ctx: DomPropertiesContext): void {
    InspectorInputHelpers.addTextInput(form, 'Seletor do Campo', data.selector || '', (val) => (data.selector = val));
    InspectorInputHelpers.addSelectInput(
      form,
      'Tipo de Seletor',
      data.selectorType || 'css',
      [
        { value: 'css', label: 'Seletor CSS' },
        { value: 'xpath', label: 'XPath' },
      ],
      (val) => (data.selectorType = val)
    );
    InspectorInputHelpers.addTextareaInput(form, 'Texto a Digitar (suporta {{var}})', data.text || '', (val) => (data.text = val));
    InspectorInputHelpers.addSelectInput(
      form,
      'Modo de Digitação',
      data.mode || 'human_typing',
      [
        { value: 'human_typing', label: 'Digitação Humana Realista (com delay)' },
        { value: 'paste', label: 'Colar Imediato (Paste)' },
      ],
      (val) => {
        data.mode = val;
        ctx.renderInspector();
      }
    );

    if (data.mode === 'human_typing') {
      InspectorInputHelpers.addNumberInput(form, 'Atraso Mínimo por Tecla (ms)', data.minTypingDelayMs ?? 40, (val) => (data.minTypingDelayMs = val));
      InspectorInputHelpers.addNumberInput(form, 'Atraso Máximo por Tecla (ms)', data.maxTypingDelayMs ?? 120, (val) => (data.maxTypingDelayMs = val));
    }

    InspectorInputHelpers.addCheckboxInput(form, 'Limpar campo antes de digitar', !!data.clearBeforeTyping, (val) => (data.clearBeforeTyping = val));
    InspectorInputHelpers.addCheckboxInput(form, 'Pressionar Enter após digitar', !!data.pressEnterAfter, (val) => (data.pressEnterAfter = val));
    InspectorInputHelpers.addNumberInput(form, 'Tempo Limite (ms)', data.timeoutMs ?? 5000, (val) => (data.timeoutMs = val));
  }

  public static renderScroll(form: HTMLElement, data: any, ctx: DomPropertiesContext): void {
    InspectorInputHelpers.addSelectInput(
      form,
      'Destino da Rolagem',
      data.target || 'bottom',
      [
        { value: 'bottom', label: 'Rolar até o Final da Página' },
        { value: 'top', label: 'Rolar até o Topo da Página' },
        { value: 'element', label: 'Rolar até o Elemento ficar Visível' },
        { value: 'by_pixels', label: 'Rolar por Quantidade de Pixels' },
      ],
      (val) => {
        data.target = val;
        ctx.renderInspector();
      }
    );

    if (data.target === 'element') {
      InspectorInputHelpers.addTextInput(form, 'Seletor do Elemento Alvo', data.selector || '', (val) => (data.selector = val));
      InspectorInputHelpers.addSelectInput(
        form,
        'Tipo de Seletor',
        data.selectorType || 'css',
        [
          { value: 'css', label: 'Seletor CSS' },
          { value: 'xpath', label: 'XPath' },
        ],
        (val) => (data.selectorType = val)
      );
    } else if (data.target === 'by_pixels') {
      InspectorInputHelpers.addNumberInput(form, 'Deslocamento Vertical (Delta Y)', data.deltaY ?? 500, (val) => (data.deltaY = val));
      InspectorInputHelpers.addNumberInput(form, 'Deslocamento Horizontal (Delta X)', data.deltaX ?? 0, (val) => (data.deltaX = val));
    }

    InspectorInputHelpers.addCheckboxInput(form, 'Rolagem Suave (Smooth)', data.smooth !== false, (val) => (data.smooth = val));
  }
}
