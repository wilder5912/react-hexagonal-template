import { useQuery } from '@tanstack/react-query';
import { usersModule } from '../modules';

/**
 * Thin query hook for the users screen.
 * It keeps the component simple and leaves caching/loading concerns to React Query.
 */
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: ({ signal }) => usersModule.searchAllUsers.execute(signal),
  });
}
