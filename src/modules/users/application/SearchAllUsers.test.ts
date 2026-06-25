import { describe, it, expect, vi } from 'vitest';
import { SearchAllUsers } from './SearchAllUsers';
import type { UserRepository } from '../domain/UserRepository';
import type { User } from '../domain/User';

// Aqui se ve el PAGO de la arquitectura hexagonal:
// el caso de uso depende del PUERTO (UserRepository), no de Axios ni de una API.
// Por eso podemos inyectar un repositorio FALSO y testear sin red.

const fakeUsers: User[] = [
  { id: 1, name: 'Ada', email: 'ada@mail.com', username: 'ada', company: 'X', city: 'Londres' },
  { id: 2, name: 'Alan', email: 'alan@mail.com', username: 'alan', company: 'Y', city: 'Bletchley' },
];

describe('SearchAllUsers', () => {
  it('devuelve los usuarios que entrega el repositorio', async () => {
    // Doble de prueba: implementa el puerto sin tocar la red.
    const repository: UserRepository = {
      search: vi.fn().mockResolvedValue(fakeUsers),
      find: vi.fn(),
    };

    const useCase = new SearchAllUsers(repository);
    const result = await useCase.execute();

    expect(result).toEqual(fakeUsers);
    expect(repository.search).toHaveBeenCalledOnce();
  });

  it('propaga el AbortSignal al repositorio', async () => {
    const repository: UserRepository = {
      search: vi.fn().mockResolvedValue([]),
      find: vi.fn(),
    };
    const controller = new AbortController();

    const useCase = new SearchAllUsers(repository);
    await useCase.execute(controller.signal);

    expect(repository.search).toHaveBeenCalledWith(controller.signal);
  });
});
