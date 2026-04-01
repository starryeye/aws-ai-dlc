import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { StoredCredentials } from '../types';
import { login as apiLogin, validateToken } from '../services/auth';
import { getOrCreateSession } from '../services/session';
import {
  getCredentials,
  saveCredentials,
  saveSessionId,
  getSessionId,
  clearAll,
} from '../utils/storage';

interface AuthContextType {
  credentials: StoredCredentials | null;
  sessionId: string | null;
  isInitialized: boolean;
  login: (
    storeCode: string,
    tableNumber: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<StoredCredentials | null>(
    null,
  );
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function initAuth() {
      const stored = getCredentials();
      if (stored) {
        const valid = await validateToken();
        if (valid) {
          setCredentials(stored);
          setSessionId(getSessionId());
        } else {
          clearAll();
        }
      }
      setIsInitialized(true);
    }
    initAuth();
  }, []);

  const login = useCallback(
    async (storeCode: string, tableNumber: string, password: string) => {
      const response = await apiLogin({
        storeCode,
        username: tableNumber,
        password,
        role: 'TABLE',
      });

      const tableId = parseInt(tableNumber, 10);
      const creds: StoredCredentials = {
        storeCode,
        tableNumber,
        password,
        token: response.token,
        storeId: response.storeId,
        tableId,
      };

      saveCredentials(creds);
      setCredentials(creds);

      const session = await getOrCreateSession(response.storeId, tableId);
      saveSessionId(session.sessionId);
      setSessionId(session.sessionId);
    },
    [],
  );

  const logout = useCallback(() => {
    clearAll();
    setCredentials(null);
    setSessionId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ credentials, sessionId, isInitialized, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
