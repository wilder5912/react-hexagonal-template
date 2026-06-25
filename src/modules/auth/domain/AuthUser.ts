// Core auth shapes used by the business layer.
// They stay intentionally simple and know nothing about React, routing, or HTTP details.

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
