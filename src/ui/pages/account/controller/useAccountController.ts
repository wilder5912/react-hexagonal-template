import { useAuth } from '../../../../app/hooks/useAuth';

/** Controlador de la pagina de cuenta: expone el usuario de la sesion. */
export function useAccountController() {
  const { user } = useAuth();
  return { user };
}
