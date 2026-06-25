import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../app/stores/authStore';

/**
 * Guard de rutas: si no hay sesion, redirige a /login.
 * Envuelve las rutas privadas en el router.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
