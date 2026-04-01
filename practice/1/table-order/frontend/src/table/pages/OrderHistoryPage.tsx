import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getOrders } from '../services/order';
import OrderCard from '../components/OrderCard';
import type { Order } from '../types';

export default function OrderHistoryPage() {
  const { credentials, sessionId } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!credentials || !sessionId) return;
    setIsLoading(true);
    try {
      const data = await getOrders(credentials.storeId, sessionId);
      setOrders(data);
    } catch {
      // 에러 시 빈 상태 유지
    } finally {
      setIsLoading(false);
    }
  }, [credentials, sessionId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (isLoading) {
    return (
      <div data-testid="order-history-skeleton" className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div data-testid="order-history-page" className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">주문 내역</h2>
        <button
          data-testid="order-history-refresh-button"
          onClick={fetchOrders}
          className="rounded border px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
          style={{ minHeight: '44px' }}
        >
          새로고침
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="py-12 text-center text-gray-500">
          아직 주문 내역이 없습니다
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
