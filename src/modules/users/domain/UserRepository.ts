import type { User } from './User';

/** User data contract used by the application layer. */
export interface UserRepository {
  search(signal?: AbortSignal): Promise<User[]>;
  find(id: number, signal?: AbortSignal): Promise<User>;
}
