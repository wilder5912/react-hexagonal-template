import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../../modules/auth';

/**
 * Central place for the logged-in user and token.
 * We persist it so a browser refresh does not log the user out immediately.
 * The HTTP client reads `auth_token` from localStorage and adds it to protected requests.
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
