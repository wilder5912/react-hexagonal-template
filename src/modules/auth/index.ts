import { createHttpClient } from '../../shared/http/httpClient';
import { API_BASE_URLS } from '../../shared/config/apiConfig';
import { ApiAuthRepository } from './infrastructure/ApiAuthRepository';
import { WebCryptoPasswordHasher } from './infrastructure/WebCryptoPasswordHasher';
import { LoginUser } from './application/LoginUser';
import { LogoutUser } from './application/LogoutUser';

/**
 * Composition root del modulo auth.
 * Arma infraestructura + casos de uso y expone una API simple para la UI.
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

// Re-export de tipos de dominio para uso comodo en la UI.
export type { AuthSession, AuthUser, Credentials } from './domain/AuthUser';
