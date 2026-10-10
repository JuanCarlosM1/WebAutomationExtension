/**
 * Renderizador de propriedades para nós de dados:
 * - http_request
 * - extract_data
 * - scrape_list
 */
import { InspectorInputHelpers } from '../inspectorInputHelpers';

export interface DataPropertiesContext {
  renderInspector: () => void;
}

export class DataPropertiesRenderer {
  public static renderHttpRequest(form: HTMLElement, data: any, ctx: DataPropertiesContext): void {
    InspectorInputHelpers.addTextInput(form, 'URL da Requisição', data.url || 'https://', (val) => (data.url = val));
    InspectorInputHelpers.addSelectInput(
      form,
      'Método HTTP',
      data.method || 'GET',
      [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'PATCH', label: 'PATCH' },
        { value: 'DELETE', label: 'DELETE' },
        { value: 'HEAD', label: 'HEAD' },
      ],
      (val) => {
        data.method = val;
        ctx.renderInspector();
      }
    );

    if (data.method === 'POST' || data.method === 'PUT' || data.method === 'PATCH') {
      InspectorInputHelpers.addTextareaInput(form, 'Corpo da Requisição (Body)', data.body || '', (val) => (data.body = val));
    }

    InspectorInputHelpers.addSelectInput(
      form,
      'Tipo de Resposta',
      data.responseType || 'json',
      [
        { value: 'json', label: 'JSON (Objeto/Array)' },
        { value: 'text', label: 'Texto Puro' },
      ],
      (val) => (data.responseType = val)
    );

    InspectorInputHelpers.addTextInput(form, 'Salvar Resposta na Variável', data.saveResponseToVar || 'apiResponse', (val) => (data.saveResponseToVar = val));
    InspectorInputHelpers.addTextInput(form, 'Salvar Status HTTP na Variável (opcional)', data.saveStatusToVar || '', (val) => (data.saveStatusToVar = val));
    InspectorInputHelpers.addNumberInput(form, 'Tempo Limite (ms)', data.timeoutMs ?? 15000, (val) => (data.timeoutMs = val));
  }

  public static renderExtractData(form: HTMLElement, data: any, ctx: DataPropertiesContext): void {
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
      'Tipo de Extração',
      data.extractType || 'innerText',
      [
        { value: 'innerText', label: 'Texto Visível (innerText)' },
        { value: 'innerHTML', label: 'HTML Interno (innerHTML)' },
        { value: 'value', label: 'Valor do Campo (value)' },
        { value: 'attribute', label: 'Atributo HTML (ex: href, src)' },
      ],
      (val) => {
        data.extractType = val;
        ctx.renderInspector();
      }
    );

    if (data.extractType === 'attribute') {
      InspectorInputHelpers.addTextInput(form, 'Nome do Atributo (ex: href, src)', data.attributeName || 'href', (val) => (data.attributeName = val));
    }

    InspectorInputHelpers.addTextInput(form, 'Salvar Dado na Variável', data.saveToVar || 'extractedData', (val) => (data.saveToVar = val));
    InspectorInputHelpers.addNumberInput(form, 'Tempo Limite (ms)', data.timeoutMs ?? 5000, (val) => (data.timeoutMs = val));
  }

  public static renderScrapeList(form: HTMLElement, data: any, ctx: DataPropertiesContext): void {
    InspectorInputHelpers.addTextInput(form, 'Seletor dos Itens / Cards', data.selector || '.card', (val) => (data.selector = val));
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
    InspectorInputHelpers.addTextInput(form, 'Salvar Lista na Variável', data.saveToVar || 'items', (val) => (data.saveToVar = val));
    InspectorInputHelpers.addNumberInput(form, 'Limite Máximo de Itens', data.maxItems ?? 50, (val) => (data.maxItems = val));
    InspectorInputHelpers.addNumberInput(form, 'Tempo Limite (ms)', data.timeoutMs ?? 5000, (val) => (data.timeoutMs = val));

    const fieldsContainer = document.createElement('div');
    fieldsContainer.style.cssText = 'border-top: 1px solid #243049; padding-top: 10px; margin-top: 10px;';
    fieldsContainer.innerHTML = '<div style="font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 8px;">Campos Extraídos por Item</div>';

    if (!Array.isArray(data.fields)) data.fields = [];
    data.fields.forEach((f: any, idx: number) => {
      const fieldEl = document.createElement('div');
      fieldEl.style.cssText = 'background: #0b0f19; border: 1px solid #1e293b; padding: 8px; border-radius: 6px; margin-bottom: 8px;';
      fieldEl.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:11px;font-weight:600;">Campo #${idx + 1}</span>
          <button class="btn-xs delete-field-btn" data-idx="${idx}">✕</button>
        </div>
        <input type="text" placeholder="Nome da Chave (ex: preco)" value="${f.name || ''}" class="field-name" style="width:100%;margin-bottom:4px;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;" />
        <input type="text" placeholder="Sub-seletor (ex: .price ou vazio)" value="${f.subSelector || ''}" class="field-sub" style="width:100%;margin-bottom:4px;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;" />
        <select class="field-type" style="width:100%;margin-bottom:4px;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;">
          <option value="innerText" ${f.extractType === 'innerText' ? 'selected' : ''}>Texto (innerText)</option>
          <option value="attribute" ${f.extractType === 'attribute' ? 'selected' : ''}>Atributo</option>
          <option value="innerHTML" ${f.extractType === 'innerHTML' ? 'selected' : ''}>HTML (innerHTML)</option>
          <option value="value" ${f.extractType === 'value' ? 'selected' : ''}>Valor (value)</option>
        </select>
        <input type="text" placeholder="Nome do Atributo (ex: href)" value="${f.attributeName || ''}" class="field-attr ${f.extractType !== 'attribute' ? 'hidden' : ''}" style="width:100%;padding:4px 6px;font-size:11px;background:#172033;color:white;border:1px solid #243049;border-radius:4px;" />
      `;

      fieldEl.querySelector('.field-name')?.addEventListener('input', (e: any) => (f.name = e.target.value));
      fieldEl.querySelector('.field-sub')?.addEventListener('input', (e: any) => (f.subSelector = e.target.value));
      fieldEl.querySelector('.field-type')?.addEventListener('change', (e: any) => {
        f.extractType = e.target.value;
        const attrInput = fieldEl.querySelector('.field-attr');
        if (attrInput) {
          if (f.extractType === 'attribute') attrInput.classList.remove('hidden');
          else attrInput.classList.add('hidden');
        }
      });
      fieldEl.querySelector('.field-attr')?.addEventListener('input', (e: any) => (f.attributeName = e.target.value));
      fieldEl.querySelector('.delete-field-btn')?.addEventListener('click', () => {
        data.fields.splice(idx, 1);
        ctx.renderInspector();
      });

      fieldsContainer.appendChild(fieldEl);
    });

    const btnAddField = document.createElement('button');
    btnAddField.type = 'button';
    btnAddField.className = 'btn-xs';
    btnAddField.style.cssText = 'width: 100%; margin-top: 4px; padding: 6px;';
    btnAddField.textContent = '+ Adicionar Campo ao Scraper';
    btnAddField.addEventListener('click', () => {
      data.fields.push({ name: `campo_${data.fields.length + 1}`, subSelector: '', extractType: 'innerText', attributeName: '' });
      ctx.renderInspector();
    });
    fieldsContainer.appendChild(btnAddField);
    form.appendChild(fieldsContainer);
  }
}
