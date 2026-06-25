import type { UserRepository } from '../domain/UserRepository';
import type { User } from '../domain/User';

// Use case for retrieving the full users list.
export class SearchAllUsers {
  constructor(private readonly repository: UserRepository) {}

  execute(signal?: AbortSignal): Promise<User[]> {
    return this.repository.search(signal);
  }
}
