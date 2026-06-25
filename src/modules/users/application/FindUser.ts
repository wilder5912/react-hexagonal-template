import type { UserRepository } from '../domain/UserRepository';
import type { User } from '../domain/User';

// Caso de uso: obtener un usuario por id.
export class FindUser {
  constructor(private readonly repository: UserRepository) {}

  execute(id: number, signal?: AbortSignal): Promise<User> {
    return this.repository.find(id, signal);
  }
}
