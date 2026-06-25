// Central place for API base URLs.
// We prefer environment variables, but keep safe defaults so the sample app still runs without extra setup.

export const API_BASE_URLS = {
  // Read-only demo API for users.
  jsonPlaceholder:
    import.meta.env.VITE_API_USERS_URL ?? 'https://jsonplaceholder.typicode.com',
  // Demo login endpoint from DummyJSON. It returns a real JWT token for sample credentials.
  auth: import.meta.env.VITE_API_AUTH_URL ?? 'https://dummyjson.com/auth',
  // Demo products API used by the CRUD example.
  products: import.meta.env.VITE_API_PRODUCTS_URL ?? 'https://dummyjson.com',
} as const;
