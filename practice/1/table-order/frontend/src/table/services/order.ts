import apiClient from './axios';
import type { OrderRequest, OrderResponse, Order } from '../types';

export async function createOrder(
  storeId: number,
  request: OrderRequest,
): Promise<OrderResponse> {
  const response = await apiClient.post<OrderResponse>(
    `/api/stores/${storeId}/orders`,
    request,
  );
  return response.data;
}

export async function getOrders(
  storeId: number,
  sessionId: string,
): Promise<Order[]> {
  const response = await apiClient.get<Order[]>(
    `/api/stores/${storeId}/orders`,
    { params: { sessionId } },
  );
  return response.data;
}
