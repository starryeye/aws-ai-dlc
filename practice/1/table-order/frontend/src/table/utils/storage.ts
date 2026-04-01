import type { StoredCredentials, CartItem } from '../types';

const KEYS = {
  CREDENTIALS: 'table-order-credentials',
  CART: 'table-order-cart',
  SESSION: 'table-order-session',
} as const;

// === Credentials ===

export function getCredentials(): StoredCredentials | null {
  try {
    const raw = localStorage.getItem(KEYS.CREDENTIALS);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCredentials;
    if (!parsed.token || !parsed.storeId || !parsed.tableId) {
      clearAll();
      return null;
    }
    return parsed;
  } catch {
    clearAll();
    return null;
  }
}

export function saveCredentials(credentials: StoredCredentials): void {
  localStorage.setItem(KEYS.CREDENTIALS, JSON.stringify(credentials));
}

// === Session ===

export function getSessionId(): string | null {
  const value = localStorage.getItem(KEYS.SESSION);
  if (!value || value.trim() === '') return null;
  return value;
}

export function saveSessionId(sessionId: string): void {
  localStorage.setItem(KEYS.SESSION, sessionId);
}

// === Cart ===

export function getCartItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEYS.CART);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(KEYS.CART, JSON.stringify([]));
      return [];
    }
    return parsed as CartItem[];
  } catch {
    localStorage.setItem(KEYS.CART, JSON.stringify([]));
    return [];
  }
}

export function saveCartItems(items: CartItem[]): void {
  localStorage.setItem(KEYS.CART, JSON.stringify(items));
}

export function clearCart(): void {
  localStorage.removeItem(KEYS.CART);
}

// === Clear All ===

export function clearAll(): void {
  localStorage.removeItem(KEYS.CREDENTIALS);
  localStorage.removeItem(KEYS.CART);
  localStorage.removeItem(KEYS.SESSION);
}
