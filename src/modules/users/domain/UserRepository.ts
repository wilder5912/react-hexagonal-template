import type { User } from './User';

/** Puerto del dominio para acceder a usuarios. */
export interface UserRepository {
  search(signal?: AbortSignal): Promise<User[]>;
  find(id: number, signal?: AbortSignal): Promise<User>;
}
