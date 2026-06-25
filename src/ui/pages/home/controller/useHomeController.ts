import { useAuth } from '../../../../app/hooks/useAuth';

/** Controlador de la home: estado de sesion para saludar y mostrar el CTA. */
export function useHomeController() {
  const { user, isAuthenticated } = useAuth();
  return { user, isAuthenticated };
}
