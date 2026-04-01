import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Order, TableData } from '@shared/types';

interface OrderState {
  orders: Order[];
  tableMap: Map<number, TableData>;
  isConnected: boolean;
  error: string | null;
  highlightedOrderIds: Set<number>;
}

export type OrderAction =
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: number; status: Order['status'] } }
  | { type: 'REMOVE_ORDER'; payload: { orderId: number; tableId: number } }
  | { type: 'RESET_TABLE'; payload: { tableId: number } }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'HIGHLIGHT_ORDER'; payload: number }
  | { type: 'REMOVE_HIGHLIGHT'; payload: number };

function buildTableMap(orders: Order[]): Map<number, TableData> {
  const map = new Map<number, TableData>();
  for (const order of orders) {
    const existing = map.get(order.tableId);
    if (existing) {
      existing.orders.push(order);
      existing.totalAmount += order.totalAmount;
      if (!existing.latestOrderTime || order.createdAt > existing.latestOrderTime) {
        existing.latestOrderTime = order.createdAt;
      }
    } else {
      map.set(order.tableId, {
        tableId: order.tableId,
        tableNumber: order.tableNumber,
        orders: [order],
        totalAmount: order.totalAmount,
        latestOrderTime: order.createdAt,
      });
    }
  }
  return map;
}

export function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'SET_ORDERS': {
      return { ...state, orders: action.payload, tableMap: buildTableMap(action.payload) };
    }
    case 'ADD_ORDER': {
      const newOrders = [...state.orders, action.payload];
      return { ...state, orders: newOrders, tableMap: buildTableMap(newOrders) };
    }
    case 'UPDATE_ORDER_STATUS': {
      const updated = state.orders.map((o) =>
        o.id === action.payload.orderId ? { ...o, status: action.payload.status } : o
      );
      return { ...state, orders: updated, tableMap: buildTableMap(updated) };
    }
    case 'REMOVE_ORDER': {
      const filtered = state.orders.filter((o) => o.id !== action.payload.orderId);
      return { ...state, orders: filtered, tableMap: buildTableMap(filtered) };
    }
    case 'RESET_TABLE': {
      const filtered = state.orders.filter((o) => o.tableId !== action.payload.tableId);
      return { ...state, orders: filtered, tableMap: buildTableMap(filtered) };
    }
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'HIGHLIGHT_ORDER':
      return { ...state, highlightedOrderIds: new Set([...state.highlightedOrderIds, action.payload]) };
    case 'REMOVE_HIGHLIGHT': {
      const next = new Set(state.highlightedOrderIds);
      next.delete(action.payload);
      return { ...state, highlightedOrderIds: next };
    }
    default:
      return state;
  }
}

const initialState: OrderState = {
  orders: [],
  tableMap: new Map(),
  isConnected: false,
  error: null,
  highlightedOrderIds: new Set(),
};

interface OrderContextValue {
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  return <OrderContext.Provider value={{ state, dispatch }}>{children}</OrderContext.Provider>;
}

export function useOrders(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}
