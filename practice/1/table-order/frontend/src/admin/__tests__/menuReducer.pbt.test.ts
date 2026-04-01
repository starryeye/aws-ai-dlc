import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { menuReducer } from '../contexts/MenuContext';
import type { MenuItem } from '@shared/types';

const menuItemArb = fc.record({
  id: fc.nat(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  price: fc.integer({ min: 0, max: 100000 }),
  description: fc.option(fc.string({ maxLength: 200 }), { nil: undefined }),
  categoryId: fc.integer({ min: 1, max: 10 }),
  categoryName: fc.string({ minLength: 1, maxLength: 20 }),
  imageUrl: fc.option(fc.webUrl(), { nil: undefined }),
  displayOrder: fc.nat({ max: 100 }),
});

const initialState = {
  categories: [],
  menuItems: [] as MenuItem[],
  isLoading: false,
  error: null,
};

describe('MenuContext reducer - PBT', () => {
  // PBT-03: Invariant - ADD_MENU_ITEM increases count by 1
  it('ADD_MENU_ITEM increases menuItems length by 1', () => {
    fc.assert(
      fc.property(fc.array(menuItemArb, { maxLength: 10 }), menuItemArb, (items, newItem) => {
        const state = menuReducer({ ...initialState, menuItems: items }, { type: 'SET_MENU_ITEMS', payload: items });
        const after = menuReducer(state, { type: 'ADD_MENU_ITEM', payload: newItem });
        expect(after.menuItems.length).toBe(items.length + 1);
      }),
      { numRuns: 100, seed: 42 }
    );
  });

  // PBT-03: Invariant - REORDER preserves count
  it('REORDER_MENU_ITEMS preserves menuItems count', () => {
    fc.assert(
      fc.property(fc.array(menuItemArb, { minLength: 1, maxLength: 20 }), (items) => {
        const state = menuReducer(initialState, { type: 'SET_MENU_ITEMS', payload: items });
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        const after = menuReducer(state, { type: 'REORDER_MENU_ITEMS', payload: shuffled });
        expect(after.menuItems.length).toBe(items.length);
      }),
      { numRuns: 100, seed: 42 }
    );
  });

  // PBT-03: Invariant - REMOVE decreases count by 1
  it('REMOVE_MENU_ITEM decreases count by 1 when item exists', () => {
    fc.assert(
      fc.property(fc.array(menuItemArb, { minLength: 1, maxLength: 10 }), (items) => {
        const unique = items.filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i);
        if (unique.length === 0) return;
        const state = menuReducer(initialState, { type: 'SET_MENU_ITEMS', payload: unique });
        const after = menuReducer(state, { type: 'REMOVE_MENU_ITEM', payload: unique[0].id });
        expect(after.menuItems.length).toBe(unique.length - 1);
      }),
      { numRuns: 100, seed: 42 }
    );
  });
});
