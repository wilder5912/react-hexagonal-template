// Configuracion central de las APIs externas.
// Los valores vienen de variables de entorno (.env) via import.meta.env.
// Se deja un fallback para que la app funcione aunque falte el .env.

export const API_BASE_URLS = {
  // API de ejemplo para usuarios (read). Devuelve datos de prueba.
  jsonPlaceholder:
    import.meta.env.VITE_API_USERS_URL ?? 'https://jsonplaceholder.typicode.com',
  // Endpoint de login real de prueba (DummyJSON): devuelve un token JWT real.
  // Credenciales demo: username "emilys" / password "emilyspass".
  auth: import.meta.env.VITE_API_AUTH_URL ?? 'https://dummyjson.com/auth',
  // API de productos (DummyJSON) para el ejemplo de CRUD completo.
  products: import.meta.env.VITE_API_PRODUCTS_URL ?? 'https://dummyjson.com',
} as const;
