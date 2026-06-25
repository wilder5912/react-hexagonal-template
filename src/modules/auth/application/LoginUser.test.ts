import { describe, it, expect, vi } from 'vitest';
import { LoginUser } from './LoginUser';
import type { AuthRepository } from '../domain/AuthRepository';
import type { PasswordHasher } from '../domain/PasswordHasher';
import type { AuthSession } from '../domain/AuthUser';

// El caso de uso depende de DOS puertos (repository + hasher).
// Ambos se inyectan como dobles: el login se prueba sin red ni WebCrypto reales.

const session: AuthSession = {
  token: 'fake-token',
  user: { id: '1', username: 'emilys', email: 'emily@mail.com', name: 'Emily' },
};

function makeHasher(): PasswordHasher {
  return { hash: vi.fn().mockResolvedValue('hashed') };
}

describe('LoginUser', () => {
  it('devuelve la sesion que entrega el repositorio', async () => {
    const repository: AuthRepository = {
      login: vi.fn().mockResolvedValue(session),
      logout: vi.fn(),
    };

    const useCase = new LoginUser(repository, makeHasher());
    const result = await useCase.execute({ username: 'emilys', password: 'emilyspass' });

    expect(result).toEqual(session);
  });

  it('deriva la password con el hasher antes de pedir la sesion', async () => {
    const hasher = makeHasher();
    const repository: AuthRepository = {
      login: vi.fn().mockResolvedValue(session),
      logout: vi.fn(),
    };

    const useCase = new LoginUser(repository, hasher);
    await useCase.execute({ username: 'emilys', password: 'secreto' });

    expect(hasher.hash).toHaveBeenCalledWith('secreto');
    expect(repository.login).toHaveBeenCalledOnce();
  });

  it('propaga el error si el repositorio falla (credenciales invalidas)', async () => {
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
