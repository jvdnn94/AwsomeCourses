// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';

import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/authContext';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated,isAdmin, loading } = useAuth();
  

  // نمایش لودینگ در حالی که وضعیت احراز هویت چک می‌شود
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 ml-2" />
        <span className="text-gray-600">در حال بررسی...</span>
      </div>
    );
  }

  // اگر کاربر لاگین نیست، به صفحه ورود هدایت کن
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // اگر نیاز به دسترسی ادمین است ولی کاربر ادمین نیست
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // در غیر این صورت، محتوای داخلی را نمایش بده
  return <Outlet />;
};

export default ProtectedRoute;