import { createHttpClient } from '../../shared/http/httpClient';
import { API_BASE_URLS } from '../../shared/config/apiConfig';
import { ApiAuthRepository } from './infrastructure/ApiAuthRepository';
import { WebCryptoPasswordHasher } from './infrastructure/WebCryptoPasswordHasher';
import { LoginUser } from './application/LoginUser';
import { LogoutUser } from './application/LogoutUser';

/**
 * Auth module composition root.
 * This is where we decide which concrete repository and hasher the auth use cases should use.
 */
export function createAuthModule() {
  const http = createHttpClient(API_BASE_URLS.auth);
  const repository = new ApiAuthRepository(http);
  const hasher = new WebCryptoPasswordHasher();

  return {
    loginUser: new LoginUser(repository, hasher),
    logoutUser: new LogoutUser(repository),
  };
}

export type AuthModule = ReturnType<typeof createAuthModule>;

// Re-export the domain types so UI code can import them from one friendly place.
export type { AuthSession, AuthUser, Credentials } from './domain/AuthUser';
