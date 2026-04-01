import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';

// Admin imports
import { AuthProvider as AdminAuthProvider } from './admin/contexts/AuthContext';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';
import Spinner from './admin/components/Spinner';

// Customer imports
import { AuthProvider as TableAuthProvider } from './table/contexts/AuthContext';
import { CartProvider } from './table/contexts/CartContext';
import AuthGuard from './table/components/AuthGuard';

// Lazy-loaded Admin pages
const LoginPage = lazy(() => import('./admin/pages/LoginPage'));
const DashboardPage = lazy(() => import('./admin/pages/DashboardPage'));
const TableManagementPage = lazy(() => import('./admin/pages/TableManagementPage'));
const MenuManagementPage = lazy(() => import('./admin/pages/MenuManagementPage'));

// Lazy-loaded Customer pages
const SetupPage = lazy(() => import('./table/pages/SetupPage'));
const MenuPage = lazy(() => import('./table/pages/MenuPage'));
const CartPage = lazy(() => import('./table/pages/CartPage'));
const OrderConfirmPage = lazy(() => import('./table/pages/OrderConfirmPage'));
const OrderSuccessPage = lazy(() => import('./table/pages/OrderSuccessPage'));
const OrderHistoryPage = lazy(() => import('./table/pages/OrderHistoryPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Suspense fallback={<div className="flex items-center justify-center h-screen"><Spinner /></div>}>
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/*" element={
            <AdminAuthProvider>
              <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="tables" element={<TableManagementPage />} />
                    <Route path="menus" element={<MenuManagementPage />} />
                  </Route>
                </Route>
              </Routes>
            </AdminAuthProvider>
          } />

          {/* Customer routes */}
          <Route path="/table/*" element={
            <TableAuthProvider>
              <CartProvider>
                <Routes>
                  <Route path="setup" element={<SetupPage />} />
                  <Route element={<AuthGuard />}>
                    <Route index element={<MenuPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="order/confirm" element={<OrderConfirmPage />} />
                    <Route path="order/success" element={<OrderSuccessPage />} />
                    <Route path="orders" element={<OrderHistoryPage />} />
                  </Route>
                </Routes>
              </CartProvider>
            </TableAuthProvider>
          } />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/table/setup" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
