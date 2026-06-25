/**
 * Puerto para encriptado/derivacion de contrasenas.
 *
 * IMPORTANTE: en una app real el hash de password se hace en el BACKEND.
 * Hashear en el frontend NO sustituye HTTPS ni la seguridad del servidor.
 * Aqui se modela como puerto del dominio para:
 *   - poder firmar/derivar valores en cliente cuando haga falta,
 *   - dejar el patron listo para inyectar una implementacion real.
 */
export interface PasswordHasher {
  // Devuelve un hash (hex) del valor dado. Asincrono porque WebCrypto lo es.
  hash(value: string): Promise<string>;
}
