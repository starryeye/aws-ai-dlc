import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SetupPage() {
  const navigate = useNavigate();
  const { credentials, isInitialized, login } = useAuth();

  const [storeCode, setStoreCode] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 이미 인증된 상태면 메뉴로 이동
  if (isInitialized && credentials) {
    navigate('/table', { replace: true });
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!storeCode.trim()) {
      setError('매장 식별자를 입력해주세요');
      return;
    }
    if (!tableNumber.trim()) {
      setError('테이블 번호를 입력해주세요');
      return;
    }
    if (!password.trim()) {
      setError('비밀번호를 입력해주세요');
      return;
    }

    setIsLoading(true);
    try {
      await login(storeCode.trim(), tableNumber.trim(), password);
      navigate('/table', { replace: true });
    } catch {
      setError('매장 정보 또는 비밀번호가 올바르지 않습니다');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        data-testid="setup-form"
        className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <h1 className="text-center text-2xl font-bold">🍽️ 테이블오더</h1>

        <div>
          <label htmlFor="storeCode" className="mb-1 block text-sm font-medium">
            매장 식별자
          </label>
          <input
            id="storeCode"
            type="text"
            value={storeCode}
            onChange={(e) => setStoreCode(e.target.value)}
            data-testid="setup-store-code-input"
            className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="tableNumber"
            className="mb-1 block text-sm font-medium"
          >
            테이블 번호
          </label>
          <input
            id="tableNumber"
            type="text"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            data-testid="setup-table-number-input"
            className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="setup-password-input"
            className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none"
            disabled={isLoading}
          />
        </div>

        {error && (
          <p data-testid="setup-error-message" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          data-testid="setup-submit-button"
          disabled={isLoading}
          className="w-full rounded bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          style={{ minHeight: '44px' }}
        >
          {isLoading ? '설정 중...' : '설정 완료'}
        </button>
      </form>
    </div>
  );
}
