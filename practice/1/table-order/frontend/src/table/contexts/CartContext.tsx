import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { CartItem, CartState, MenuItem } from '../types';
import {
  getCartItems,
  saveCartItems,
  clearCart as storageClearCart,
} from '../utils/storage';
import { calculateTotalAmount } from '../utils/format';

interface CartContextType {
  cart: CartState;
  addItem: (menuItem: MenuItem) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  removeItem: (menuId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

function buildCartState(items: CartItem[]): CartState {
  return {
    items,
    totalAmount: calculateTotalAmount(items),
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(() =>
    buildCartState(getCartItems()),
  );

  const syncAndSet = useCallback((items: CartItem[]) => {
    saveCartItems(items);
    setCart(buildCartState(items));
  }, []);

  const addItem = useCallback(
    (menuItem: MenuItem) => {
      const current = [...cart.items];
      const existing = current.find((item) => item.menuId === menuItem.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        current.push({
          menuId: menuItem.id,
          menuName: menuItem.name,
          unitPrice: menuItem.price,
          quantity: 1,
        });
      }
      syncAndSet(current);
    },
    [cart.items, syncAndSet],
  );

  const updateQuantity = useCallback(
    (menuId: number, quantity: number) => {
      if (quantity <= 0) {
        syncAndSet(cart.items.filter((item) => item.menuId !== menuId));
      } else {
        const updated = cart.items.map((item) =>
          item.menuId === menuId ? { ...item, quantity } : item,
        );
        syncAndSet(updated);
      }
    },
    [cart.items, syncAndSet],
  );

  const removeItem = useCallback(
    (menuId: number) => {
      syncAndSet(cart.items.filter((item) => item.menuId !== menuId));
    },
    [cart.items, syncAndSet],
  );

  const clearCart = useCallback(() => {
    storageClearCart();
    setCart(buildCartState([]));
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
