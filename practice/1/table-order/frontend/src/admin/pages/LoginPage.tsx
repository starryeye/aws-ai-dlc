import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/authApi';
import { saveToken, saveStoreId, saveUsername } from '@shared/auth/authUtils';
import Spinner from '../components/Spinner';

export default function LoginPage() {
  const [storeCode, setStoreCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!storeCode || !username || !password) {
      toast.error('모든 필드를 입력해주세요');
      return;
    }
    setIsLoading(true);
    try {
      const res = await authApi.login({ storeCode, username, password, role: 'ADMIN' });
      saveToken(res.token);
      saveStoreId(res.storeId);
      saveUsername(username);
      dispatch({ type: 'LOGIN', payload: { token: res.token, storeId: res.storeId, username } });
      navigate('/admin/dashboard');
    } catch {
      toast.error('로그인에 실패했습니다. 정보를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">테이블오더 관리자</h1>
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
          <div>
            <label htmlFor="storeCode" className="block text-sm font-medium text-gray-700 mb-1">매장 코드</label>
            <input
              id="storeCode"
              type="text"
              value={storeCode}
              onChange={(e) => setStoreCode(e.target.value)}
              data-testid="login-store-code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="매장 코드를 입력하세요"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">사용자명</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="login-username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="사용자명을 입력하세요"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="login-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            data-testid="login-submit-button"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? <Spinner size="sm" /> : null}
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
