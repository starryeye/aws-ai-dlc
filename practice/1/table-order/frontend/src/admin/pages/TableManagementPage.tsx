import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { tableApi } from '../services/tableApi';
import { orderApi } from '../services/orderApi';
import ConfirmDialog from '../components/ConfirmDialog';
import OrderHistoryModal from '../components/OrderHistoryModal';
import Spinner from '../components/Spinner';
import type { TableInfo } from '@shared/types';

export default function TableManagementPage() {
  const { state: authState } = useAuth();
  const storeId = authState.storeId!;
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; type: 'delete' | 'complete' | null; tableId: number | null; orderId: number | null }>({
    isOpen: false, type: null, tableId: null, orderId: null,
  });
  const [historyState, setHistoryState] = useState<{ isOpen: boolean; tableId: number; tableNumber: string }>({
    isOpen: false, tableId: 0, tableNumber: '',
  });

  const loadTables = useCallback(async () => {
    try {
      const data = await tableApi.getTables(storeId);
      setTables(data);
    } catch {
      toast.error('테이블 목록을 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => { loadTables(); }, [loadTables]);

  const handleComplete = (tableId: number) => {
    setConfirmState({ isOpen: true, type: 'complete', tableId, orderId: null });
  };

  const handleConfirm = async () => {
    try {
      if (confirmState.type === 'complete' && confirmState.tableId) {
        await tableApi.completeTable(storeId, confirmState.tableId);
        toast.success('테이블 이용이 완료되었습니다');
      } else if (confirmState.type === 'delete' && confirmState.orderId) {
        await orderApi.deleteOrder(storeId, confirmState.orderId);
        toast.success('주문이 삭제되었습니다');
      }
      loadTables();
    } catch {
      toast.error('처리에 실패했습니다');
    } finally {
      setConfirmState({ isOpen: false, type: null, tableId: null, orderId: null });
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div data-testid="table-management-page">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">테이블 관리</h1>
      {tables.length === 0 ? (
        <p className="text-gray-500 text-center py-12">등록된 테이블이 없습니다</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div key={table.id} className="bg-white rounded-lg shadow p-4" data-testid={`table-mgmt-card-${table.id}`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">테이블 {table.tableNumber}</h3>
                <span className={`text-sm px-2 py-0.5 rounded-full ${table.sessionActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {table.sessionActive ? '이용중' : '비활성'}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <p>주문 수: {table.orderCount}건</p>
                <p>총 주문액: {table.totalAmount.toLocaleString()}원</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleComplete(table.id)}
                  disabled={!table.sessionActive}
                  data-testid={`complete-table-${table.id}`}
                  className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  이용 완료
                </button>
                <button
                  onClick={() => setHistoryState({ isOpen: true, tableId: table.id, tableNumber: table.tableNumber })}
                  data-testid={`history-table-${table.id}`}
                  className="flex-1 px-3 py-1.5 text-sm bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  과거 내역
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.type === 'complete' ? '테이블 이용 완료' : '주문 삭제'}
        message={confirmState.type === 'complete' ? '테이블 이용을 완료하시겠습니까? 주문 내역이 과거 이력으로 이동됩니다.' : '이 주문을 삭제하시겠습니까?'}
        confirmLabel={confirmState.type === 'complete' ? '완료' : '삭제'}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmState({ isOpen: false, type: null, tableId: null, orderId: null })}
      />
      <OrderHistoryModal
        isOpen={historyState.isOpen}
        storeId={storeId}
        tableId={historyState.tableId}
        tableNumber={historyState.tableNumber}
        onClose={() => setHistoryState({ isOpen: false, tableId: 0, tableNumber: '' })}
      />
    </div>
  );
}
