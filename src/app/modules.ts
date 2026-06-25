import { createAuthModule } from '../modules/auth';
import { createUsersModule } from '../modules/users';
import { createProductsModule } from '../modules/products';

/**
 * Instancias unicas de los modulos hexagonales para toda la app.
 * Los hooks de React importan desde aqui; asi la inyeccion de dependencias
 * queda centralizada y es facil de sustituir en tests.
 */
export const authModule = createAuthModule();
export const usersModule = createUsersModule();
export const productsModule = createProductsModule();
