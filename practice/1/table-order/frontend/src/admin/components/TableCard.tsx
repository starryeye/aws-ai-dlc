import type { TableData } from '@shared/types';
import OrderStatusBadge from './OrderStatusBadge';

interface TableCardProps {
  table: TableData;
  isHighlighted: boolean;
  onClick: () => void;
}

export default function TableCard({ table, isHighlighted, onClick }: TableCardProps) {
  const recentOrders = table.orders.slice(-3);

  return (
    <div
      onClick={onClick}
      data-testid={`table-card-${table.tableId}`}
      className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-md ${
        isHighlighted ? 'ring-2 ring-blue-500 animate-pulse' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">테이블 {table.tableNumber}</h3>
        <span className="text-lg font-bold text-blue-600">
          {table.totalAmount.toLocaleString()}원
        </span>
      </div>
      <div className="space-y-2">
        {recentOrders.map((order) => (
          <div key={order.id} className="flex justify-between items-center text-sm text-gray-600">
            <span>#{order.orderNumber}</span>
            <OrderStatusBadge status={order.status} />
          </div>
        ))}
        {table.orders.length > 3 && (
          <p className="text-xs text-gray-400">외 {table.orders.length - 3}건</p>
        )}
        {table.orders.length === 0 && (
          <p className="text-sm text-gray-400">주문 없음</p>
        )}
      </div>
    </div>
  );
}
