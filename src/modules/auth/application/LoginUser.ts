import type { AuthRepository } from '../domain/AuthRepository';
import type { PasswordHasher } from '../domain/PasswordHasher';
import type { AuthSession, Credentials } from '../domain/AuthUser';

/**
 * Login use case.
 * It coordinates the small business flow for signing in and stays isolated from UI and transport details.
 */
export class LoginUser {
  constructor(
    private readonly repository: AuthRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(credentials: Credentials, signal?: AbortSignal): Promise<AuthSession> {
    // We call the hasher here to show how the use case depends on a domain port rather than a concrete crypto library.
    // In a production system, real password verification still belongs on the backend.
    await this.hasher.hash(credentials.password);

    return this.repository.login(credentials, signal);
  }
}
