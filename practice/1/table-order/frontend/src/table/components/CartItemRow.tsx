import type { CartItem } from '../types';
import { formatCurrency, calculateSubtotal } from '../utils/format';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (menuId: number, quantity: number) => void;
  onRemove: (menuId: number) => void;
}

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const subtotal = calculateSubtotal(item.unitPrice, item.quantity);

  return (
    <div
      data-testid={`cart-item-${item.menuId}`}
      className="flex items-center justify-between border-b py-3"
    >
      <div className="flex-1">
        <p className="font-medium">{item.menuName}</p>
        <p className="text-sm text-gray-500">
          {formatCurrency(item.unitPrice)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          data-testid={`cart-item-decrease-${item.menuId}`}
          onClick={() => onUpdateQuantity(item.menuId, item.quantity - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border text-lg"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label={`${item.menuName} 수량 감소`}
        >
          -
        </button>
        <span
          data-testid={`cart-item-quantity-${item.menuId}`}
          className="w-8 text-center font-medium"
        >
          {item.quantity}
        </span>
        <button
          data-testid={`cart-item-increase-${item.menuId}`}
          onClick={() => onUpdateQuantity(item.menuId, item.quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border text-lg"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label={`${item.menuName} 수량 증가`}
        >
          +
        </button>
      </div>
      <div className="ml-4 flex items-center gap-2">
        <span className="w-20 text-right font-medium">
          {formatCurrency(subtotal)}
        </span>
        <button
          data-testid={`cart-item-remove-${item.menuId}`}
          onClick={() => onRemove(item.menuId)}
          className="text-red-500 hover:text-red-700"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label={`${item.menuName} 삭제`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
