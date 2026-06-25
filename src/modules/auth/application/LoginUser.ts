import type { AuthRepository } from '../domain/AuthRepository';
import type { PasswordHasher } from '../domain/PasswordHasher';
import type { AuthSession, Credentials } from '../domain/AuthUser';

/**
 * Caso de uso: iniciar sesion.
 * Orquesta el dominio y pide la sesion al puerto. No sabe de axios ni React.
 */
export class LoginUser {
  constructor(
    private readonly repository: AuthRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(credentials: Credentials, signal?: AbortSignal): Promise<AuthSession> {
    // Demostracion del puerto de encriptado: derivamos una huella de la password.
    // (En produccion el hash real se valida en el BACKEND; esto es ilustrativo.)
    await this.hasher.hash(credentials.password);

    return this.repository.login(credentials, signal);
  }
}
