import apiClient from '@shared/api/client';
import type { TableInfo, OrderHistory } from '@shared/types';

export const tableApi = {
  async getTables(storeId: number): Promise<TableInfo[]> {
    const res = await apiClient.get<TableInfo[]>(`/stores/${storeId}/tables`);
    return res.data;
  },
  async completeTable(storeId: number, tableId: number): Promise<void> {
    await apiClient.post(`/stores/${storeId}/tables/${tableId}/complete`);
  },
  async getTableHistory(storeId: number, tableId: number, dateFrom?: string, dateTo?: string): Promise<OrderHistory[]> {
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    const res = await apiClient.get<OrderHistory[]>(`/stores/${storeId}/tables/${tableId}/history?${params}`);
    return res.data;
  },
};
