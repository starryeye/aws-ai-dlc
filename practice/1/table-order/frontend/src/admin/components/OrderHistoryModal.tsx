import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { tableApi } from '../services/tableApi';
import DateFilter from './DateFilter';
import Spinner from './Spinner';
import type { OrderHistory } from '@shared/types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  storeId: number;
  tableId: number;
  tableNumber: string;
  onClose: () => void;
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export default function OrderHistoryModal({ isOpen, storeId, tableId, tableNumber, onClose }: OrderHistoryModalProps) {
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState(todayStr());
  const [dateTo, setDateTo] = useState(todayStr());

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await tableApi.getTableHistory(storeId, tableId, dateFrom, dateTo);
      setHistory(data);
    } catch {
      toast.error('과거 내역을 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }, [storeId, tableId, dateFrom, dateTo]);

  useEffect(() => {
    if (isOpen) loadHistory();
  }, [isOpen, loadHistory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="order-history-modal">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">테이블 {tableNumber} - 과거 주문 내역</h2>
          <button onClick={onClose} data-testid="history-close" className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <DateFilter dateFrom={dateFrom} dateTo={dateTo} onChange={(f, t) => { setDateFrom(f); setDateTo(t); }} />
          </div>
          {isLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">해당 기간의 주문 내역이 없습니다</p>
          ) : (
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="border rounded p-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">#{h.orderNumber}</span>
                    <span className="text-gray-500">{new Date(h.orderedAt).toLocaleString('ko-KR')}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {h.items.map((item) => (
                      <span key={item.id} className="mr-3">{item.menuName} x{item.quantity}</span>
                    ))}
                  </div>
                  <div className="text-right font-bold text-sm mt-1">{h.totalAmount.toLocaleString()}원</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t text-right">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">닫기</button>
        </div>
      </div>
    </div>
  );
}
