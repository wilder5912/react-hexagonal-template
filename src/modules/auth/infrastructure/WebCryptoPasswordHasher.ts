import type { PasswordHasher } from '../domain/PasswordHasher';

/**
 * Implementacion de PasswordHasher usando WebCrypto (SHA-256).
 * Nativo del navegador, sin dependencias externas.
 */
export class WebCryptoPasswordHasher implements PasswordHasher {
  async hash(value: string): Promise<string> {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
