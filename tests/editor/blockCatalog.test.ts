import { describe, it, expect } from 'vitest';
import { BLOCK_CATALOG } from '../../src/editor/modules/blockCatalog';

describe('Block Catalog (blockCatalog.ts)', () => {
  it('o catálogo deve conter categorias estruturadas', () => {
    expect(BLOCK_CATALOG.length).toBeGreaterThanOrEqual(4);

    for (const cat of BLOCK_CATALOG) {
      expect(cat.category).toBeDefined();
      expect(cat.categoryLabel).toBeDefined();
      expect(cat.categoryClass).toBeDefined();
      expect(Array.isArray(cat.items)).toBe(true);
      expect(cat.items.length).toBeGreaterThan(0);
    }
  });

  it('todos os itens de blocos devem possuir type, title, desc, icon e defaultData', () => {
    const allItems = BLOCK_CATALOG.flatMap((cat) => cat.items);
    expect(allItems.length).toBeGreaterThanOrEqual(15);

    const typesSet = new Set<string>();

    for (const item of allItems) {
      expect(item.type).toBeDefined();
      expect(typeof item.type).toBe('string');
      expect(item.title).toBeDefined();
      expect(item.desc).toBeDefined();
      expect(item.icon).toContain('<svg');
      expect(item.defaultData).toBeDefined();

      // Não deve haver tipos duplicados
      expect(typesSet.has(item.type)).toBe(false);
      typesSet.add(item.type);
    }
  });

  it('deve conter blocos essenciais como start, delay, switch, click_element, navigate', () => {
    const allTypes = BLOCK_CATALOG.flatMap((cat) => cat.items).map((i) => i.type);
    expect(allTypes).toContain('start');
    expect(allTypes).toContain('delay');
    expect(allTypes).toContain('switch');
    expect(allTypes).toContain('click_element');
    expect(allTypes).toContain('navigate');
    expect(allTypes).toContain('extract_data');
    expect(allTypes).toContain('type_input');
  });
});
