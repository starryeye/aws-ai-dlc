const TOKEN_KEY = 'auth_token';
const STORE_ID_KEY = 'store_id';
const USERNAME_KEY = 'username';

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(STORE_ID_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

export function saveStoreId(storeId: number): void {
  localStorage.setItem(STORE_ID_KEY, String(storeId));
}

export function getStoreId(): number | null {
  const val = localStorage.getItem(STORE_ID_KEY);
  return val ? Number(val) : null;
}

export function saveUsername(username: string): void {
  localStorage.setItem(USERNAME_KEY, username);
}

export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}
