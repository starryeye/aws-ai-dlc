import apiClient from '@shared/api/client';
import type { Category, MenuItem, MenuItemRequest, MenuOrderRequest } from '@shared/types';

export const menuApi = {
  async getCategories(storeId: number): Promise<Category[]> {
    const res = await apiClient.get<Category[]>(`/stores/${storeId}/categories`);
    return res.data;
  },
  async getMenuItems(storeId: number, categoryId?: number): Promise<MenuItem[]> {
    const params = categoryId ? `?categoryId=${categoryId}` : '';
    const res = await apiClient.get<MenuItem[]>(`/stores/${storeId}/menus${params}`);
    return res.data;
  },
  async createMenuItem(storeId: number, data: MenuItemRequest): Promise<MenuItem> {
    const res = await apiClient.post<MenuItem>(`/stores/${storeId}/menus`, data);
    return res.data;
  },
  async updateMenuItem(storeId: number, menuId: number, data: MenuItemRequest): Promise<MenuItem> {
    const res = await apiClient.patch<MenuItem>(`/stores/${storeId}/menus/${menuId}`, data);
    return res.data;
  },
  async deleteMenuItem(storeId: number, menuId: number): Promise<void> {
    await apiClient.delete(`/stores/${storeId}/menus/${menuId}`);
  },
  async updateMenuOrder(storeId: number, data: MenuOrderRequest[]): Promise<void> {
    await apiClient.patch(`/stores/${storeId}/menus/order`, data);
  },
};
