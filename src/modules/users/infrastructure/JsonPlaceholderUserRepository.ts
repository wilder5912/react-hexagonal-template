import type { HttpClient } from '../../../shared/http/httpClient';
import type { UserRepository } from '../domain/UserRepository';
import type { User } from '../domain/User';

// Raw response shape from JSONPlaceholder before we convert it into our domain model.
interface ApiUser {
  id: number;
  name: string;
  email: string;
  username: string;
  company?: { name: string };
  address?: { city: string };
}

function toDomain(api: ApiUser): User {
  // Keep the translation here so the rest of the app can work with a stable user shape.
  return {
    id: api.id,
    name: api.name,
    email: api.email,
    username: api.username,
    company: api.company?.name ?? 'No company',
    city: api.address?.city ?? 'No city',
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
