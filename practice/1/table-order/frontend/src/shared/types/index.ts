// === Auth ===
export interface LoginRequest {
  storeCode: string;
  username: string;
  password: string;
  role: 'TABLE' | 'ADMIN';
}

export interface TokenResponse {
  token: string;
  expiresIn: number;
  role: string;
  storeId: number;
}

export interface UserInfo {
  storeId: number;
  role: string;
  tableId?: number;
  username: string;
}

// === Category ===
export interface Category {
  id: number;
  name: string;
  displayOrder: number;
}

// === Menu ===
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  categoryName: string;
  imageUrl?: string;
  displayOrder: number;
}

export interface MenuItemRequest {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  imageUrl?: string;
  displayOrder?: number;
}

export interface MenuOrderRequest {
  menuId: number;
  displayOrder: number;
}

// === Order ===
export interface Order {
  id: number;
  orderNumber: string;
  tableId: number;
  tableNumber: string;
  sessionId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  menuId: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus = 'PENDING' | 'PREPARING' | 'COMPLETED';

export interface StatusRequest {
  status: OrderStatus;
}

// === Table ===
export interface TableInfo {
  id: number;
  tableNumber: string;
  sessionId?: string;
  sessionActive: boolean;
  totalAmount: number;
  orderCount: number;
}

export interface TableSummary {
  tableId: number;
  tableNumber: string;
  totalAmount: number;
  orders: Order[];
}

export interface OrderHistory {
  id: number;
  orderNumber: string;
  tableNumber: string;
  items: OrderItem[];
  totalAmount: number;
  orderedAt: string;
  completedAt: string;
}

// === SSE ===
export interface OrderEvent {
  eventType: 'NEW_ORDER' | 'STATUS_CHANGED' | 'ORDER_DELETED' | 'TABLE_COMPLETED';
  orderId?: number;
  tableId: number;
  tableNumber: string;
  data: Order | null;
}

// === Frontend-only ===
export interface TableData {
  tableId: number;
  tableNumber: string;
  orders: Order[];
  totalAmount: number;
  latestOrderTime?: string;
}

export interface DateFilter {
  dateFrom: string;
  dateTo: string;
}
