import { describe, it, expect } from 'vitest';
import { orderReducer } from '../contexts/OrderContext';
import type { Order } from '@shared/types';

const mockOrder: Order = {
  id: 1, orderNumber: 'ORD-001', tableId: 1, tableNumber: '1',
  sessionId: 'sess-1', items: [{ id: 1, menuId: 1, menuName: '김치찌개', quantity: 2, unitPrice: 8000, subtotal: 16000 }],
  totalAmount: 16000, status: 'PENDING', createdAt: '2026-04-01T12:00:00Z',
};

const initialState = {
  orders: [] as Order[], tableMap: new Map(), isConnected: false, error: null, highlightedOrderIds: new Set<number>(),
};

describe('OrderContext reducer - Example-Based', () => {
  it('SET_ORDERS populates orders and tableMap', () => {
    const state = orderReducer(initialState, { type: 'SET_ORDERS', payload: [mockOrder] });
    expect(state.orders).toHaveLength(1);
    expect(state.tableMap.get(1)?.totalAmount).toBe(16000);
  });

  it('ADD_ORDER adds order to state', () => {
    const state = orderReducer(initialState, { type: 'SET_ORDERS', payload: [mockOrder] });
    const newOrder = { ...mockOrder, id: 2, orderNumber: 'ORD-002', totalAmount: 10000 };
    const after = orderReducer(state, { type: 'ADD_ORDER', payload: newOrder });
    expect(after.orders).toHaveLength(2);
    expect(after.tableMap.get(1)?.totalAmount).toBe(26000);
  });

  it('UPDATE_ORDER_STATUS changes status', () => {
    const state = orderReducer(initialState, { type: 'SET_ORDERS', payload: [mockOrder] });
    const after = orderReducer(state, { type: 'UPDATE_ORDER_STATUS', payload: { orderId: 1, status: 'PREPARING' } });
    expect(after.orders[0].status).toBe('PREPARING');
  });

  it('REMOVE_ORDER removes order and recalculates total', () => {
    const state = orderReducer(initialState, { type: 'SET_ORDERS', payload: [mockOrder] });
    const after = orderReducer(state, { type: 'REMOVE_ORDER', payload: { orderId: 1, tableId: 1 } });
    expect(after.orders).toHaveLength(0);
  });

  it('RESET_TABLE removes all orders for table', () => {
    const order2 = { ...mockOrder, id: 2, tableId: 2, tableNumber: '2' };
    const state = orderReducer(initialState, { type: 'SET_ORDERS', payload: [mockOrder, order2] });
    const after = orderReducer(state, { type: 'RESET_TABLE', payload: { tableId: 1 } });
    expect(after.orders).toHaveLength(1);
    expect(after.orders[0].tableId).toBe(2);
  });
});
