import type { AuthSession, Credentials } from './AuthUser';

/**
 * Authentication contract seen from the domain's point of view.
 * The domain only cares about what auth can do, not whether the implementation uses HTTP, mocks, or something else.
 */
export interface AuthRepository {
  // Turn user credentials into an authenticated session.
  login(credentials: Credentials, signal?: AbortSignal): Promise<AuthSession>;
  // End the session at the source when the backend supports it.
  logout(signal?: AbortSignal): Promise<void>;
}
