import { describe, it, expect } from 'vitest';
import { authReducer } from '../contexts/AuthContext';

const initialState = { token: null, storeId: null, username: null, isAuthenticated: false, isLoading: true };

describe('AuthContext reducer - Example-Based', () => {
  it('LOGIN sets authenticated state', () => {
    const state = authReducer(initialState, { type: 'LOGIN', payload: { token: 'jwt-token', storeId: 1, username: 'admin' } });
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('jwt-token');
    expect(state.storeId).toBe(1);
    expect(state.isLoading).toBe(false);
  });

  it('LOGOUT clears state', () => {
    const loggedIn = authReducer(initialState, { type: 'LOGIN', payload: { token: 'jwt', storeId: 1, username: 'admin' } });
    const state = authReducer(loggedIn, { type: 'LOGOUT' });
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('TOKEN_EXPIRED clears state', () => {
    const loggedIn = authReducer(initialState, { type: 'LOGIN', payload: { token: 'jwt', storeId: 1, username: 'admin' } });
    const state = authReducer(loggedIn, { type: 'TOKEN_EXPIRED' });
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
  });
});
