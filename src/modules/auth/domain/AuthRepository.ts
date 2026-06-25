import type { AuthSession, Credentials } from './AuthUser';

/**
 * Puerto del dominio para autenticacion.
 * Infrastructure provee el adaptador concreto (API real, mock, etc.).
 */
export interface AuthRepository {
  // Intercambia credenciales por una sesion (usuario + token).
  login(credentials: Credentials, signal?: AbortSignal): Promise<AuthSession>;
  // Invalida la sesion en el origen (si la API lo soporta).
  logout(signal?: AbortSignal): Promise<void>;
}
