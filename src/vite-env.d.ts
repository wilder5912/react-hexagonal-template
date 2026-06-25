/// <reference types="vite/client" />

// Tipado de las variables de entorno expuestas por Vite (prefijo VITE_).
// Da autocompletado y errores si se usa una variable inexistente.
interface ImportMetaEnv {
  readonly VITE_API_USERS_URL: string;
  readonly VITE_API_AUTH_URL: string;
  readonly VITE_API_PRODUCTS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
