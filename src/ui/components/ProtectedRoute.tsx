import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../app/stores/authStore';

/**
 * Simple guard for private pages.
 * If we do not have an authenticated session, we redirect to the login page instead of rendering the route.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
