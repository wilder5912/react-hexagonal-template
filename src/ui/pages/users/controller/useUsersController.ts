import { useUsers } from '../../../../app/hooks/useUsers';

/** Controlador de la pagina de usuarios: expone los datos de la tabla. */
export function useUsersController() {
  const { data: users, isLoading, isError } = useUsers();
  return { users, isLoading, isError };
}
