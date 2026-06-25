import { describe, it, expect, vi } from 'vitest';
import { JsonPlaceholderUserRepository } from './JsonPlaceholderUserRepository';
import type { HttpClient } from '../../../shared/http/httpClient';

// This test focuses on the adapter's real job:
// taking raw API data and turning it into the user shape our app expects.

describe('JsonPlaceholderUserRepository', () => {
  it('maps external JSON into the domain model', async () => {
    const http: HttpClient = {
      get: vi.fn().mockResolvedValue([
        {
          id: 1,
          name: 'Ada',
          email: 'ada@mail.com',
          username: 'ada',
          company: { name: 'Analytical Engines' },
          address: { city: 'London' },
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
        city: 'London',
      },
    ]);
  });

  it('uses default values when company and address are missing', async () => {
    const http: HttpClient = {
      get: vi.fn().mockResolvedValue([
        { id: 2, name: 'No data', email: 'x@mail.com', username: 'x' },
      ]),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    const repo = new JsonPlaceholderUserRepository(http);
    const [user] = await repo.search();

    expect(user.company).toBe('No company');
    expect(user.city).toBe('No city');
  });
});
