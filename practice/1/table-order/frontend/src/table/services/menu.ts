import apiClient from './axios';
import type { Category, MenuItem } from '../types';

export async function getCategories(storeId: number): Promise<Category[]> {
  const response = await apiClient.get<Category[]>(
    `/api/stores/${storeId}/categories`,
  );
  return response.data;
}

export async function getMenuItems(storeId: number): Promise<MenuItem[]> {
  const response = await apiClient.get<MenuItem[]>(
    `/api/stores/${storeId}/menus`,
  );
  return response.data;
}
