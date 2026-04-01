import type { TableData, OrderStatus } from '@shared/types';
import OrderStatusBadge from './OrderStatusBadge';
import StatusDropdown from './StatusDropdown';

interface OrderDetailModalProps {
  isOpen: boolean;
  table: TableData | null;
  onClose: () => void;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
  onDeleteOrder: (orderId: number) => void;
}

export default function OrderDetailModal({ isOpen, table, onClose, onStatusChange, onDeleteOrder }: OrderDetailModalProps) {
  if (!isOpen || !table) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="order-detail-modal">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">테이블 {table.tableNumber} - 주문 상세</h2>
          <button onClick={onClose} data-testid="order-detail-close" className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        </div>
        <div className="p-4 space-y-4">
          {table.orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">#{order.orderNumber}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-2">
                  <StatusDropdown
                    currentStatus={order.status}
                    orderId={order.id}
                    onStatusChange={onStatusChange}
                  />
                  <button
                    onClick={() => onDeleteOrder(order.id)}
                    data-testid={`delete-order-${order.id}`}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="text-left py-1">메뉴</th>
                    <th className="text-right py-1">수량</th>
                    <th className="text-right py-1">단가</th>
                    <th className="text-right py-1">소계</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-1">{item.menuName}</td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">{item.unitPrice.toLocaleString()}원</td>
                      <td className="text-right">{item.subtotal.toLocaleString()}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-right font-bold mt-2">{order.totalAmount.toLocaleString()}원</div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex justify-between items-center">
          <span className="text-lg font-bold">총 주문액: {table.totalAmount.toLocaleString()}원</span>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">닫기</button>
        </div>
      </div>
    </div>
  );
}
