import { describe, it, expect, vi } from 'vitest';
import { JsonPlaceholderUserRepository } from './JsonPlaceholderUserRepository';
import type { HttpClient } from '../../../shared/http/httpClient';

// Test del ADAPTADOR: que traduzca bien el JSON externo al modelo de dominio.
// Inyectamos un HttpClient falso para no llamar a la API real.

describe('JsonPlaceholderUserRepository', () => {
  it('mapea el JSON externo al modelo de dominio', async () => {
    const http: HttpClient = {
      get: vi.fn().mockResolvedValue([
        {
          id: 1,
          name: 'Ada',
          email: 'ada@mail.com',
          username: 'ada',
          company: { name: 'Analytical Engines' },
          address: { city: 'Londres' },
        },
      ]),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    const repo = new JsonPlaceholderUserRepository(http);
    const users = await repo.search();

    expect(users).toEqual([
      {
        id: 1,
        name: 'Ada',
        email: 'ada@mail.com',
        username: 'ada',
        company: 'Analytical Engines',
        city: 'Londres',
      },
    ]);
  });

  it('usa valores por defecto cuando faltan company y address', async () => {
    const http: HttpClient = {
      get: vi.fn().mockResolvedValue([
        { id: 2, name: 'Sin datos', email: 'x@mail.com', username: 'x' },
      ]),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    const repo = new JsonPlaceholderUserRepository(http);
    const [user] = await repo.search();

    expect(user.company).toBe('Sin empresa');
    expect(user.city).toBe('Sin ciudad');
  });
});
