import type { HttpClient } from '../../../shared/http/httpClient';
import type { UserRepository } from '../domain/UserRepository';
import type { User } from '../domain/User';

// Forma cruda del JSON externo (jsonplaceholder).
interface ApiUser {
  id: number;
  name: string;
  email: string;
  username: string;
  company?: { name: string };
  address?: { city: string };
}

function toDomain(api: ApiUser): User {
  // Mapper: traduce el JSON externo al modelo de dominio.
  return {
    id: api.id,
    name: api.name,
    email: api.email,
    username: api.username,
    company: api.company?.name ?? 'Sin empresa',
    city: api.address?.city ?? 'Sin ciudad',
  };
}

export class JsonPlaceholderUserRepository implements UserRepository {
  constructor(private readonly http: HttpClient) {}

  async search(signal?: AbortSignal): Promise<User[]> {
    const data = await this.http.get<ApiUser[]>('/users', { signal });
    return data.map(toDomain);
  }

  async find(id: number, signal?: AbortSignal): Promise<User> {
    const data = await this.http.get<ApiUser>(`/users/${id}`, { signal });
    return toDomain(data);
  }
}
