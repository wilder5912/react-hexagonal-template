import type { AuthRepository } from '../domain/AuthRepository';

// Minimal logout use case: delegate the sign-out action to the auth repository.
export class LogoutUser {
  constructor(private readonly repository: AuthRepository) {}

  execute(signal?: AbortSignal): Promise<void> {
    return this.repository.logout(signal);
  }
}
