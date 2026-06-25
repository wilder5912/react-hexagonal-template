import type { AuthRepository } from '../domain/AuthRepository';

// Caso de uso: cerrar sesion.
export class LogoutUser {
  constructor(private readonly repository: AuthRepository) {}

  execute(signal?: AbortSignal): Promise<void> {
    return this.repository.logout(signal);
  }
}
