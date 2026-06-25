import type { UserRepository } from '../domain/UserRepository';
import type { User } from '../domain/User';

// Use case for retrieving a single user by id.
export class FindUser {
  constructor(private readonly repository: UserRepository) {}

  execute(id: number, signal?: AbortSignal): Promise<User> {
    return this.repository.find(id, signal);
  }
}
