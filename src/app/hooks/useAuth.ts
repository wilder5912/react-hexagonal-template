import { useMutation } from '@tanstack/react-query';
import { authModule } from '../modules';
import { useAuthStore } from '../stores/authStore';
import type { Credentials } from '../../modules/auth';

/**
 * Hook de autenticacion: expone login/logout a la UI.
 * React Query maneja el estado de la peticion (loading/error);
 * Zustand guarda la sesion resultante.
 */
export function useAuth() {
  const { user, isAuthenticated, setSession, clearSession } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: Credentials) => authModule.loginUser.execute(credentials),
    onSuccess: (session) => {
      setSession(session.user, session.token);
    },
  });

  async function logout() {
    await authModule.logoutUser.execute();
    clearSession();
  }

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
  };
}
