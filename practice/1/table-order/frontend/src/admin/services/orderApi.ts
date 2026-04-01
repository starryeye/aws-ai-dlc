import apiClient from '@shared/api/client';
import type { Order, StatusRequest } from '@shared/types';

export const orderApi = {
  async getOrdersByStore(storeId: number): Promise<Order[]> {
    const res = await apiClient.get<Order[]>(`/stores/${storeId}/orders/all`);
    return res.data;
  },
  async updateOrderStatus(storeId: number, orderId: number, data: StatusRequest): Promise<Order> {
    const res = await apiClient.patch<Order>(`/stores/${storeId}/orders/${orderId}/status`, data);
    return res.data;
  },
  async deleteOrder(storeId: number, orderId: number): Promise<void> {
    await apiClient.delete(`/stores/${storeId}/orders/${orderId}`);
  },
};
