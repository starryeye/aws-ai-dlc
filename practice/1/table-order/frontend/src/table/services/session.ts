import apiClient from './axios';
import type { TableSession } from '../types';

export async function getOrCreateSession(
  storeId: number,
  tableId: number,
): Promise<TableSession> {
  const response = await apiClient.get<TableSession>(
    `/api/stores/${storeId}/tables/${tableId}/session`,
  );
  return response.data;
}
