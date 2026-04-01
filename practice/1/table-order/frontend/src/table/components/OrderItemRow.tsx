import type { CartItem } from '../types';
import { formatCurrency, calculateSubtotal } from '../utils/format';

interface OrderItemRowProps {
  item: CartItem;
}

export default function OrderItemRow({ item }: OrderItemRowProps) {
  return (
    <div
      data-testid={`order-item-${item.menuId}`}
      className="flex items-center justify-between py-2"
    >
      <span className="flex-1">{item.menuName}</span>
      <span className="w-12 text-center text-gray-600">{item.quantity}개</span>
      <span className="w-24 text-right font-medium">
        {formatCurrency(calculateSubtotal(item.unitPrice, item.quantity))}
      </span>
    </div>
  );
}
