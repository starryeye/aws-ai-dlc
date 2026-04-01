import { Link } from 'react-router-dom';
import CartBadge from './CartBadge';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const { cart } = useCart();

  return (
    <header
      data-testid="header"
      className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3"
    >
      <Link to="/table" className="text-lg font-bold" data-testid="header-logo">
        🍽️ 테이블오더
      </Link>
      <nav className="flex items-center gap-4">
        <Link to="/table/orders" data-testid="header-order-history-link">
          주문내역
        </Link>
        <Link to="/table/cart" data-testid="header-cart-link">
          <CartBadge count={cart.totalQuantity} />
        </Link>
      </nav>
    </header>
  );
}
