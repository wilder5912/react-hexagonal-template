import { useAuth } from '../../../../app/hooks/useAuth';

/** Small controller for the home screen greeting and login call-to-action. */
export function useHomeController() {
  const { user, isAuthenticated } = useAuth();
  return { user, isAuthenticated };
}
