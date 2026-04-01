import type { OrderStatus } from '@shared/types';

interface StatusDropdownProps {
  currentStatus: OrderStatus;
  orderId: number;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
  disabled?: boolean;
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'PENDING', label: '대기중' },
  { value: 'PREPARING', label: '준비중' },
  { value: 'COMPLETED', label: '완료' },
];

export default function StatusDropdown({ currentStatus, orderId, onStatusChange, disabled }: StatusDropdownProps) {
  return (
    <select
      value={currentStatus}
      onChange={(e) => onStatusChange(orderId, e.target.value as OrderStatus)}
      disabled={disabled || currentStatus === 'COMPLETED'}
      data-testid={`status-dropdown-${orderId}`}
      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {statusOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
