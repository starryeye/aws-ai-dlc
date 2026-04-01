import type { OrderStatus } from '@shared/types';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: '대기중', className: 'bg-pending-light text-pending-dark' },
  PREPARING: { label: '준비중', className: 'bg-preparing-light text-preparing-dark' },
  COMPLETED: { label: '완료', className: 'bg-completed-light text-completed-dark' },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}
      data-testid={`status-badge-${status.toLowerCase()}`}
    >
      {config.label}
    </span>
  );
}
