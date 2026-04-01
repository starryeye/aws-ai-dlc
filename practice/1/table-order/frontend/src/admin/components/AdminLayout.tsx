import { Outlet } from 'react-router-dom';
import AdminNavigation from './AdminNavigation';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNavigation />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
