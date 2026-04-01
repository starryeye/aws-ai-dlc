import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { OrderProvider, useOrders } from '../contexts/OrderContext';
import { useSse } from '../hooks/useSse';
import { orderApi } from '../services/orderApi';
import ConnectionStatus from '../components/ConnectionStatus';
import TableCardGrid from '../components/TableCardGrid';
import OrderDetailModal from '../components/OrderDetailModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Spinner from '../components/Spinner';
import type { TableData, OrderStatus } from '@shared/types';

function DashboardContent() {
  const { state: authState } = useAuth();
  const { state, dispatch } = useOrders();
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; orderId: number | null }>({ isOpen: false, orderId: null });

  const storeId = authState.storeId!;

  const loadOrders = useCallback(async () => {
    try {
      const orders = await orderApi.getOrdersByStore(storeId);
      dispatch({ type: 'SET_ORDERS', payload: orders });
    } catch {
      toast.error('주문 목록을 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }, [storeId, dispatch]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useSse({ storeId, dispatch, onReconnect: loadOrders });

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await orderApi.updateOrderStatus(storeId, orderId, { status: newStatus });
      dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status: newStatus } });
      toast.success('주문 상태가 변경되었습니다');
    } catch {
      toast.error('상태 변경에 실패했습니다');
    }
  };

  const handleDeleteOrder = (orderId: number) => {
    setConfirmState({ isOpen: true, orderId });
  };

  const confirmDelete = async () => {
    if (!confirmState.orderId) return;
    try {
      const order = state.orders.find((o) => o.id === confirmState.orderId);
      await orderApi.deleteOrder(storeId, confirmState.orderId);
      if (order) dispatch({ type: 'REMOVE_ORDER', payload: { orderId: confirmState.orderId, tableId: order.tableId } });
      toast.success('주문이 삭제되었습니다');
    } catch {
      toast.error('주문 삭제에 실패했습니다');
    } finally {
      setConfirmState({ isOpen: false, orderId: null });
    }
  };

  const tables = Array.from(state.tableMap.values());

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div data-testid="dashboard-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">실시간 주문 대시보드</h1>
        <ConnectionStatus isConnected={state.isConnected} />
      </div>
      {state.error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{state.error}</div>}
      {tables.length === 0 ? (
        <p className="text-gray-500 text-center py-12">현재 활성 주문이 없습니다</p>
      ) : (
        <TableCardGrid tables={tables} highlightedOrderIds={state.highlightedOrderIds} onTableClick={setSelectedTable} />
      )}
      <OrderDetailModal
        isOpen={!!selectedTable}
        table={selectedTable}
        onClose={() => setSelectedTable(null)}
        onStatusChange={handleStatusChange}
        onDeleteOrder={handleDeleteOrder}
      />
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="주문 삭제"
        message="이 주문을 삭제하시겠습니까?"
        confirmLabel="삭제"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmState({ isOpen: false, orderId: null })}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <OrderProvider>
      <DashboardContent />
    </OrderProvider>
  );
}
