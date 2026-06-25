import type { PasswordHasher } from '../domain/PasswordHasher';

/**
 * Browser-native PasswordHasher implementation using WebCrypto (SHA-256).
 * It keeps the example dependency-free while showing how an infrastructure adapter can satisfy the domain port.
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
