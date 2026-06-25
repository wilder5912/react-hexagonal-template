import { createHttpClient } from '../../shared/http/httpClient';
import { API_BASE_URLS } from '../../shared/config/apiConfig';
import { JsonPlaceholderUserRepository } from './infrastructure/JsonPlaceholderUserRepository';
import { SearchAllUsers } from './application/SearchAllUsers';
import { FindUser } from './application/FindUser';

/** Composition root del modulo users. */
export function createUsersModule() {
  const http = createHttpClient(API_BASE_URLS.jsonPlaceholder);
  const repository = new JsonPlaceholderUserRepository(http);

  return {
    searchAllUsers: new SearchAllUsers(repository),
    findUser: new FindUser(repository),
  };
}

export type UsersModule = ReturnType<typeof createUsersModule>;
export type { User } from './domain/User';
