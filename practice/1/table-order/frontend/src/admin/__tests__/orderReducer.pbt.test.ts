import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { orderReducer, type OrderAction } from '../contexts/OrderContext';
import type { Order, OrderStatus } from '@shared/types';

// PBT-07: Domain-specific generators
const orderStatusArb = fc.constantFrom<OrderStatus>('PENDING', 'PREPARING', 'COMPLETED');

const orderItemArb = fc.record({
  id: fc.nat(),
  menuId: fc.nat(),
  menuName: fc.string({ minLength: 1, maxLength: 20 }),
  quantity: fc.integer({ min: 1, max: 99 }),
  unitPrice: fc.integer({ min: 100, max: 100000 }),
  subtotal: fc.integer({ min: 100, max: 9900000 }),
});

const orderArb = fc.record({
  id: fc.nat(),
  orderNumber: fc.string({ minLength: 1, maxLength: 10 }),
  tableId: fc.integer({ min: 1, max: 30 }),
  tableNumber: fc.stringOf(fc.constantFrom('1', '2', '3', '4', '5', '6', '7', '8', '9', '0'), { minLength: 1, maxLength: 3 }),
  sessionId: fc.uuid(),
  items: fc.array(orderItemArb, { minLength: 1, maxLength: 5 }),
  totalAmount: fc.integer({ min: 100, max: 1000000 }),
  status: orderStatusArb,
  createdAt: fc.date().map((d) => d.toISOString()),
});

const initialState = {
  orders: [] as Order[],
  tableMap: new Map(),
  isConnected: false,
  error: null,
  highlightedOrderIds: new Set<number>(),
};

describe('OrderContext reducer - PBT', () => {
  // PBT-03: Invariant - tableMap totalAmount matches sum of orders
  it('tableMap totalAmount equals sum of table orders after SET_ORDERS', () => {
    fc.assert(
      fc.property(fc.array(orderArb, { maxLength: 20 }), (orders) => {
        const state = orderReducer(initialState, { type: 'SET_ORDERS', payload: orders });
        for (const [tableId, tableData] of state.tableMap) {
          const tableOrders = orders.filter((o) => o.tableId === tableId);
          const expectedTotal = tableOrders.reduce((sum, o) => sum + o.totalAmount, 0);
          expect(tableData.totalAmount).toBe(expectedTotal);
          expect(tableData.orders.length).toBe(tableOrders.length);
        }
      }),
      { numRuns: 100, seed: 42 } // PBT-08: seed for reproducibility
    );
  });

  // PBT-03: Invariant - ADD_ORDER increases order count by 1
  it('ADD_ORDER increases total order count by 1', () => {
    fc.assert(
      fc.property(fc.array(orderArb, { maxLength: 10 }), orderArb, (existingOrders, newOrder) => {
        const stateWithOrders = orderReducer(initialState, { type: 'SET_ORDERS', payload: existingOrders });
        const stateAfterAdd = orderReducer(stateWithOrders, { type: 'ADD_ORDER', payload: newOrder });
        expect(stateAfterAdd.orders.length).toBe(existingOrders.length + 1);
      }),
      { numRuns: 100, seed: 42 }
    );
  });

  // PBT-04: Idempotence - UPDATE_ORDER_STATUS twice yields same result
  it('UPDATE_ORDER_STATUS is idempotent', () => {
    fc.assert(
      fc.property(fc.array(orderArb, { minLength: 1, maxLength: 10 }), orderStatusArb, (orders, newStatus) => {
        const state = orderReducer(initialState, { type: 'SET_ORDERS', payload: orders });
        const orderId = orders[0].id;
        const action: OrderAction = { type: 'UPDATE_ORDER_STATUS', payload: { orderId, status: newStatus } };
        const once = orderReducer(state, action);
        const twice = orderReducer(once, action);
        expect(twice.orders).toEqual(once.orders);
      }),
      { numRuns: 100, seed: 42 }
    );
  });

  // PBT-03: Invariant - REMOVE_ORDER decreases count by 1
  it('REMOVE_ORDER decreases order count by 1 when order exists', () => {
    fc.assert(
      fc.property(fc.array(orderArb, { minLength: 1, maxLength: 10 }), (orders) => {
        const uniqueOrders = orders.filter((o, i, arr) => arr.findIndex((x) => x.id === o.id) === i);
        if (uniqueOrders.length === 0) return;
        const state = orderReducer(initialState, { type: 'SET_ORDERS', payload: uniqueOrders });
        const toRemove = uniqueOrders[0];
        const after = orderReducer(state, { type: 'REMOVE_ORDER', payload: { orderId: toRemove.id, tableId: toRemove.tableId } });
        expect(after.orders.length).toBe(uniqueOrders.length - 1);
      }),
      { numRuns: 100, seed: 42 }
    );
  });
});
