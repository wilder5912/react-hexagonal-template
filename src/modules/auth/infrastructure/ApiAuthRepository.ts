import type { HttpClient } from '../../../shared/http/httpClient';
import type { AuthRepository } from '../domain/AuthRepository';
import type { AuthSession, Credentials } from '../domain/AuthUser';

// The login API does not return our domain shape directly, so we describe its raw response here first.
interface ApiLoginResponse {
  accessToken: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Real auth adapter backed by HTTP.
 * Its job is to call the external API and translate that response into the AuthSession shape the rest of the app understands.
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
    // DummyJSON does not expose a logout endpoint.
    // In this demo, clearing the local session is enough. A real API call would be added here if needed.
    return Promise.resolve();
  }
}
