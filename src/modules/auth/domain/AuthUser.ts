// Modelo de dominio: el usuario autenticado y su token.
// No conoce HTTP ni React; es solo la "verdad" del negocio.

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  name: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

export interface Credentials {
  username: string;
  password: string;
}
