import { useUsers } from '../../../../app/hooks/useUsers';

/** Keeps the users page focused on rendering by exposing only the data it needs. */
export function useUsersController() {
  const { data: users, isLoading, isError } = useUsers();
  return { users, isLoading, isError };
}
