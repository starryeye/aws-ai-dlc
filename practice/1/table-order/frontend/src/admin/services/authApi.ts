import apiClient from '@shared/api/client';
import type { LoginRequest, TokenResponse } from '@shared/types';

export const authApi = {
  async login(data: LoginRequest): Promise<TokenResponse> {
    const res = await apiClient.post<TokenResponse>('/auth/login', data);
    return res.data;
  },
};
