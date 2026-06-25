import { useAuth } from '../../../../app/hooks/useAuth';

/** Simple account controller that exposes the current session user. */
export function useAccountController() {
  const { user } = useAuth();
  return { user };
}
