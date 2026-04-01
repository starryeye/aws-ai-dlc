import { describe, it, expect } from 'vitest';
import { menuReducer } from '../contexts/MenuContext';
import type { MenuItem } from '@shared/types';

const mockItem: MenuItem = {
  id: 1, name: '김치찌개', price: 8000, description: '매콤한 김치찌개',
  categoryId: 1, categoryName: '찌개류', imageUrl: 'https://example.com/img.jpg', displayOrder: 0,
};

const initialState = { categories: [], menuItems: [] as MenuItem[], isLoading: false, error: null };

describe('MenuContext reducer - Example-Based', () => {
  it('SET_MENU_ITEMS populates items', () => {
    const state = menuReducer(initialState, { type: 'SET_MENU_ITEMS', payload: [mockItem] });
    expect(state.menuItems).toHaveLength(1);
    expect(state.isLoading).toBe(false);
  });

  it('ADD_MENU_ITEM adds item', () => {
    const state = menuReducer({ ...initialState, menuItems: [mockItem] }, { type: 'ADD_MENU_ITEM', payload: { ...mockItem, id: 2, name: '된장찌개' } });
    expect(state.menuItems).toHaveLength(2);
  });

  it('UPDATE_MENU_ITEM updates existing item', () => {
    const state = menuReducer({ ...initialState, menuItems: [mockItem] }, { type: 'UPDATE_MENU_ITEM', payload: { ...mockItem, price: 9000 } });
    expect(state.menuItems[0].price).toBe(9000);
  });

  it('REMOVE_MENU_ITEM removes item', () => {
    const state = menuReducer({ ...initialState, menuItems: [mockItem] }, { type: 'REMOVE_MENU_ITEM', payload: 1 });
    expect(state.menuItems).toHaveLength(0);
  });
});
