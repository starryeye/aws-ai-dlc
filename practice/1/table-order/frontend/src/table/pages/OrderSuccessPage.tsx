import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

interface LocationState {
  orderNumber: string;
  totalAmount: number;
}

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!state) {
      navigate('/table', { replace: true });
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/table', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state, navigate]);

  if (!state) return null;

  return (
    <div
      data-testid="order-success-page"
      className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center"
    >
      <span className="mb-4 text-5xl">✅</span>
      <h2 className="mb-2 text-2xl font-bold">주문 완료</h2>
      <p className="mb-1 text-gray-600">
        주문번호:{' '}
        <span data-testid="order-success-number" className="font-medium">
          {state.orderNumber}
        </span>
      </p>
      <p className="mb-6 text-gray-600">
        총 금액:{' '}
        <span data-testid="order-success-amount" className="font-medium">
          {formatCurrency(state.totalAmount)}
        </span>
      </p>
      <p className="mb-6 text-sm text-gray-400">
        <span data-testid="order-success-countdown">{countdown}</span>초 후
        메뉴로 이동합니다
      </p>
      <button
        data-testid="order-success-go-menu-button"
        onClick={() => navigate('/table', { replace: true })}
        className="rounded bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        style={{ minHeight: '44px' }}
      >
        메뉴로 돌아가기
      </button>
    </div>
  );
}
