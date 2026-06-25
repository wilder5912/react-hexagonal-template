import { useQuery } from '@tanstack/react-query';
import { usersModule } from '../modules';

/**
 * Hook de datos para la tabla de usuarios.
 * React Query se encarga de cache, reintentos y estados de carga.
 */
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: ({ signal }) => usersModule.searchAllUsers.execute(signal),
  });
}
