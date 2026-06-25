import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../../modules/auth';

/**
 * Store global de autenticacion (Zustand).
 * Guarda la sesion y la persiste en localStorage para sobrevivir recargas.
 * El httpClient lee `auth_token` de localStorage para inyectar el Bearer.
 */
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (user: AuthUser, token: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setSession: (user, token) => {
        localStorage.setItem('auth_token', token);
        set({ user, token, isAuthenticated: true });
      },
      clearSession: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-storage' },
  ),
);
