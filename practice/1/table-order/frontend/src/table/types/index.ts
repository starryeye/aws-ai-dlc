// === 인증 관련 ===

export interface LoginRequest {
  storeCode: string;
  username: string;
  password: string;
  role: 'TABLE';
}

export interface TokenResponse {
  token: string;
  expiresIn: number;
  role: 'TABLE';
  storeId: number;
}

export interface UserInfo {
  storeId: number;
  role: 'TABLE';
  tableId: number;
  username: string;
}

export interface StoredCredentials {
  storeCode: string;
  tableNumber: string;
  password: string;
  token: string;
  storeId: number;
  tableId: number;
}

// === 메뉴 관련 ===

export interface Category {
  id: number;
  name: string;
  displayOrder: number;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string | null;
  categoryId: number;
  categoryName: string;
  imageUrl: string | null;
  displayOrder: number;
}

// === 장바구니 관련 ===

export interface CartItem {
  menuId: number;
  menuName: string;
  unitPrice: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
}

// === 주문 관련 ===

export interface OrderRequest {
  tableId: number;
  sessionId: string;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  menuId: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderResponse {
  orderId: number;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

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

// === 세션 관련 ===

export interface TableSession {
  sessionId: string;
  storeId: number;
  tableId: number;
  active: boolean;
}

// === 공통 ===

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}
