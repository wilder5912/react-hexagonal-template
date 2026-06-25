import { describe, it, expect, vi } from 'vitest';
import { SearchAllUsers } from './SearchAllUsers';
import type { UserRepository } from '../domain/UserRepository';
import type { User } from '../domain/User';

// This is the nice part of the hexagonal approach:
// the use case depends on a contract, not on Axios or a real API,
// so testing it with a fake repository stays fast and straightforward.

const fakeUsers: User[] = [
  { id: 1, name: 'Ada', email: 'ada@mail.com', username: 'ada', company: 'X', city: 'London' },
  { id: 2, name: 'Alan', email: 'alan@mail.com', username: 'alan', company: 'Y', city: 'Bletchley' },
];

describe('SearchAllUsers', () => {
  it('returns the users provided by the repository', async () => {
    // Tiny fake that satisfies the repository contract without touching the network.
    const repository: UserRepository = {
      search: vi.fn().mockResolvedValue(fakeUsers),
      find: vi.fn(),
    };

    const useCase = new SearchAllUsers(repository);
    const result = await useCase.execute();

    expect(result).toEqual(fakeUsers);
    expect(repository.search).toHaveBeenCalledOnce();
  });

  it('propagates the AbortSignal to the repository', async () => {
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
