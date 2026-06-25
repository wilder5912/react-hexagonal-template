import { createAuthModule } from '../modules/auth';
import { createUsersModule } from '../modules/users';
import { createProductsModule } from '../modules/products';

/**
 * This is the app's "wiring" file.
 * We create one instance of each hexagonal module here and let the React hooks consume them.
 * Keeping that setup in one place makes the app easier to follow and simpler to swap in tests.
 */
export const authModule = createAuthModule();
export const usersModule = createUsersModule();
export const productsModule = createProductsModule();
