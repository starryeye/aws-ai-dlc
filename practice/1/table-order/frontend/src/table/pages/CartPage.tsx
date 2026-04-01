import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartItemRow from '../components/CartItemRow';
import { formatCurrency } from '../utils/format';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <div data-testid="cart-page" className="p-4">
      <h2 className="mb-4 text-xl font-bold">장바구니</h2>

      {cart.items.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500">장바구니가 비어있습니다</p>
          <button
            data-testid="cart-go-menu-button"
            onClick={() => navigate('/table')}
            className="mt-4 rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            style={{ minHeight: '44px' }}
          >
            메뉴 보러가기
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            {cart.items.map((item) => (
              <CartItemRow
                key={item.menuId}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          <button
            data-testid="cart-clear-button"
            onClick={clearCart}
            className="mb-6 text-sm text-gray-500 underline"
            style={{ minHeight: '44px' }}
          >
            장바구니 비우기
          </button>

          <div className="border-t pt-4">
            <div className="mb-4 flex items-center justify-between text-lg font-bold">
              <span>총 금액</span>
              <span data-testid="cart-total-amount">
                {formatCurrency(cart.totalAmount)}
              </span>
            </div>
            <button
              data-testid="cart-order-button"
              onClick={() => navigate('/table/order/confirm')}
              className="w-full rounded bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
              style={{ minHeight: '44px' }}
            >
              주문하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
