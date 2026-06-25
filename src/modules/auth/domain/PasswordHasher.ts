/**
 * Contract for hashing or deriving sensitive values on the client.
 *
 * Important note: this does not replace proper backend-side auth or HTTPS.
 * It exists here mainly to demonstrate the port/adaptor style and to leave room for real client-side derivation when needed.
 */
export interface PasswordHasher {
  // Returns a hex hash of the input. It is async because browser crypto APIs are async too.
  hash(value: string): Promise<string>;
}
