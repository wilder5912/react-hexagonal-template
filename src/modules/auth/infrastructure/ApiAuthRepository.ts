import type { HttpClient } from '../../../shared/http/httpClient';
import type { AuthRepository } from '../domain/AuthRepository';
import type { AuthSession, Credentials } from '../domain/AuthUser';

// Forma cruda que devuelve DummyJSON al hacer login.
interface ApiLoginResponse {
  accessToken: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Adaptador: implementa el puerto AuthRepository contra una API REST real.
 * Traduce el JSON externo al modelo de dominio (AuthSession).
 */
export class ApiAuthRepository implements AuthRepository {
  constructor(private readonly http: HttpClient) {}

  async login(credentials: Credentials, signal?: AbortSignal): Promise<AuthSession> {
    const data = await this.http.post<ApiLoginResponse>(
      '/login',
      { username: credentials.username, password: credentials.password },
      { signal },
    );

    return {
      token: data.accessToken,
      user: {
        id: String(data.id),
        username: data.username,
        email: data.email,
        name: `${data.firstName} ${data.lastName}`.trim(),
      },
    };
  }

  async logout(): Promise<void> {
    // DummyJSON no tiene endpoint de logout; el borrado del token
    // se gestiona en el store. Aqui quedaria la llamada real si existiera.
    return Promise.resolve();
  }
}
