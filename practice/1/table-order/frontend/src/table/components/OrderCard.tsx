import type { Order } from '../types';
import { formatCurrency } from '../utils/format';

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING: { label: '대기중', className: 'bg-yellow-100 text-yellow-800' },
  PREPARING: { label: '준비중', className: 'bg-blue-100 text-blue-800' },
  COMPLETED: { label: '완료', className: 'bg-green-100 text-green-800' },
};

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const status = STATUS_MAP[order.status] ?? {
    label: order.status,
    className: 'bg-gray-100 text-gray-800',
  };

  const time = new Date(order.createdAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const menuSummary = order.items
    .map((item) => `${item.menuName} ${item.quantity}`)
    .join(', ');

  return (
    <div
      data-testid={`order-card-${order.id}`}
      className="rounded-lg border bg-white p-4 shadow-sm"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium">{order.orderNumber}</span>
        <span className="text-sm text-gray-500">{time}</span>
      </div>
      <p className="mb-2 text-sm text-gray-600">{menuSummary}</p>
      <div className="flex items-center justify-between">
        <span className="font-bold">{formatCurrency(order.totalAmount)}</span>
        <span
          data-testid={`order-card-status-${order.id}`}
          className={`rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
        >
          {status.label}
        </span>
      </div>
    </div>
  );
}
