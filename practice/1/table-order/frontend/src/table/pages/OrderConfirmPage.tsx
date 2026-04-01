import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../services/order';
import OrderItemRow from '../components/OrderItemRow';
import { formatCurrency } from '../utils/format';
import type { OrderItemRequest } from '../types';

export default function OrderConfirmPage() {
  const navigate = useNavigate();
  const { credentials, sessionId } = useAuth();
  const { cart, clearCart } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 장바구니가 비어있으면 장바구니로 리다이렉트
  if (cart.items.length === 0) {
    navigate('/table/cart', { replace: true });
    return null;
  }

  async function handleConfirm() {
    if (!credentials || !sessionId || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const items: OrderItemRequest[] = cart.items.map((item) => ({
        menuId: item.menuId,
        menuName: item.menuName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));

      const response = await createOrder(credentials.storeId, {
        tableId: credentials.tableId,
        sessionId,
        items,
      });

      clearCart();
      navigate('/table/order/success', {
        replace: true,
        state: {
          orderNumber: response.orderNumber,
          totalAmount: response.totalAmount,
        },
      });
    } catch {
      setError('주문에 실패했습니다. 잠시 후 다시 시도해주세요');
      setIsSubmitting(false);
    }
  }

  return (
    <div data-testid="order-confirm-page" className="p-4">
      <h2 className="mb-4 text-xl font-bold">주문 확인</h2>

      <p className="mb-4 text-gray-600">
        테이블 {credentials?.tableNumber}
      </p>

      <div className="mb-4 divide-y rounded-lg border bg-white p-4">
        {cart.items.map((item) => (
          <OrderItemRow key={item.menuId} item={item} />
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between text-lg font-bold">
        <span>총 금액</span>
        <span data-testid="order-confirm-total">
          {formatCurrency(cart.totalAmount)}
        </span>
      </div>

      {error && (
        <p data-testid="order-confirm-error" className="mb-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        data-testid="order-confirm-submit-button"
        onClick={handleConfirm}
        disabled={isSubmitting}
        className="w-full rounded bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        style={{ minHeight: '44px' }}
      >
        {isSubmitting ? '주문 처리 중...' : '주문 확정'}
      </button>
    </div>
  );
}
