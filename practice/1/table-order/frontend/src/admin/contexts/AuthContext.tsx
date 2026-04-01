import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { getToken, getStoreId, getUsername } from '@shared/auth/authUtils';

interface AuthState {
  token: string | null;
  storeId: number | null;
  username: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'LOGIN'; payload: { token: string; storeId: number; username: string } }
  | { type: 'LOGOUT' }
  | { type: 'TOKEN_VALIDATED' }
  | { type: 'TOKEN_EXPIRED' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  token: null,
  storeId: null,
  username: null,
  isAuthenticated: false,
  isLoading: true,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        token: action.payload.token,
        storeId: action.payload.storeId,
        username: action.payload.username,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
    case 'TOKEN_EXPIRED':
      return { ...initialState, isLoading: false };
    case 'TOKEN_VALIDATED':
      return { ...state, isAuthenticated: true, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface AuthContextValue {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = getToken();
    const storeId = getStoreId();
    const username = getUsername();
    if (token && storeId && username) {
      dispatch({ type: 'LOGIN', payload: { token, storeId, username } });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
