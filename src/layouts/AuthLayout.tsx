import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function AuthLayout() {
  const { token } = useAuth();
  const location = useLocation();

  // Redirect to dashboard if already authenticated
  if (token) {
    return <Navigate to="/" replace />;
  }

  // Redirect to login if not on a valid auth route
  const validAuthRoutes = ['/login', '/register', '/forgot-password'];
  if (!validAuthRoutes.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <Outlet />
      </div>
    </div>
  );
}
