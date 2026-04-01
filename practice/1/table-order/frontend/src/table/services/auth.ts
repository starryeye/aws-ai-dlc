import apiClient from './axios';
import type { LoginRequest, TokenResponse } from '../types';

export async function login(request: LoginRequest): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>(
    '/api/auth/login',
    request,
  );
  return response.data;
}

export async function validateToken(): Promise<boolean> {
  try {
    await apiClient.get('/api/auth/validate');
    return true;
  } catch {
    return false;
  }
}
