import { describe, it, expect, vi } from 'vitest';
import { LoginUser } from './LoginUser';
import type { AuthRepository } from '../domain/AuthRepository';
import type { PasswordHasher } from '../domain/PasswordHasher';
import type { AuthSession } from '../domain/AuthUser';

// Login depends on two contracts: the repository and the hasher.
// Because both are injected, we can test the behavior without real HTTP calls or browser crypto.

const session: AuthSession = {
  token: 'fake-token',
  user: { id: '1', username: 'emilys', email: 'emily@mail.com', name: 'Emily' },
};

function makeHasher(): PasswordHasher {
  return { hash: vi.fn().mockResolvedValue('hashed') };
}

describe('LoginUser', () => {
  it('returns the session provided by the repository', async () => {
    const repository: AuthRepository = {
      login: vi.fn().mockResolvedValue(session),
      logout: vi.fn(),
    };

    const useCase = new LoginUser(repository, makeHasher());
    const result = await useCase.execute({ username: 'emilys', password: 'emilyspass' });

    expect(result).toEqual(session);
  });

  it('derives the password with the hasher before requesting the session', async () => {
    const hasher = makeHasher();
    const repository: AuthRepository = {
      login: vi.fn().mockResolvedValue(session),
      logout: vi.fn(),
    };

    const useCase = new LoginUser(repository, hasher);
    await useCase.execute({ username: 'emilys', password: 'secret' });

    expect(hasher.hash).toHaveBeenCalledWith('secret');
    expect(repository.login).toHaveBeenCalledOnce();
  });

  it('propagates the error if the repository fails (invalid credentials)', async () => {
    const repository: AuthRepository = {
      login: vi.fn().mockRejectedValue(new Error('401')),
      logout: vi.fn(),
    };

    const useCase = new LoginUser(repository, makeHasher());

    await expect(
      useCase.execute({ username: 'mal', password: 'mal' }),
    ).rejects.toThrow('401');
  });
});
