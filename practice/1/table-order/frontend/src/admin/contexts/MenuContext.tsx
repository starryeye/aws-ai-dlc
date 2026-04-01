import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Category, MenuItem } from '@shared/types';

interface MenuState {
  categories: Category[];
  menuItems: MenuItem[];
  isLoading: boolean;
  error: string | null;
}

export type MenuAction =
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_MENU_ITEMS'; payload: MenuItem[] }
  | { type: 'ADD_MENU_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_MENU_ITEM'; payload: MenuItem }
  | { type: 'REMOVE_MENU_ITEM'; payload: number }
  | { type: 'REORDER_MENU_ITEMS'; payload: MenuItem[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export function menuReducer(state: MenuState, action: MenuAction): MenuState {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_MENU_ITEMS':
      return { ...state, menuItems: action.payload, isLoading: false };
    case 'ADD_MENU_ITEM':
      return { ...state, menuItems: [...state.menuItems, action.payload] };
    case 'UPDATE_MENU_ITEM':
      return { ...state, menuItems: state.menuItems.map((m) => m.id === action.payload.id ? action.payload : m) };
    case 'REMOVE_MENU_ITEM':
      return { ...state, menuItems: state.menuItems.filter((m) => m.id !== action.payload) };
    case 'REORDER_MENU_ITEMS':
      return { ...state, menuItems: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const initialState: MenuState = { categories: [], menuItems: [], isLoading: true, error: null };

interface MenuContextValue { state: MenuState; dispatch: React.Dispatch<MenuAction>; }

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(menuReducer, initialState);
  return <MenuContext.Provider value={{ state, dispatch }}>{children}</MenuContext.Provider>;
}

export function useMenu(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
}
