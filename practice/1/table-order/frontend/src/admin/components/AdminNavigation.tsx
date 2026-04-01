import { NavLink, useNavigate } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  TableCellsIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { removeToken } from '@shared/auth/authUtils';

const navItems = [
  { to: '/admin/dashboard', label: '대시보드', icon: ClipboardDocumentListIcon },
  { to: '/admin/tables', label: '테이블 관리', icon: TableCellsIcon },
  { to: '/admin/menus', label: '메뉴 관리', icon: BookOpenIcon },
];

export default function AdminNavigation() {
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    dispatch({ type: 'LOGOUT' });
    navigate('/admin/login');
  };

  return (
    <nav className="w-60 bg-white shadow-lg flex flex-col" data-testid="admin-navigation">
      <div className="p-4 border-b">
        <h1 className="text-lg font-bold text-gray-800">테이블오더 관리자</h1>
      </div>
      <ul className="flex-1 py-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              data-testid={`nav-${to.split('/').pop()}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          data-testid="logout-button"
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          로그아웃
        </button>
      </div>
    </nav>
  );
}
