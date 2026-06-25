import type { UserRepository } from '../domain/UserRepository';
import type { User } from '../domain/User';

// Caso de uso: listar todos los usuarios.
export class SearchAllUsers {
  constructor(private readonly repository: UserRepository) {}

  execute(signal?: AbortSignal): Promise<User[]> {
    return this.repository.search(signal);
  }
}
