import type { Product, ProductDraft, ProductPage, SearchOptions } from './Product';

/**
 * Puerto del dominio para productos (CRUD completo).
 * Infrastructure provee el adaptador concreto contra la API.
 */
export interface ProductRepository {
  // Lectura (con paginacion: limit + skip)
  search(options?: SearchOptions, signal?: AbortSignal): Promise<ProductPage>;
  find(id: number, signal?: AbortSignal): Promise<Product>;
  // Escritura
  create(draft: ProductDraft, signal?: AbortSignal): Promise<Product>;
  update(id: number, draft: ProductDraft, signal?: AbortSignal): Promise<Product>;
  remove(id: number, signal?: AbortSignal): Promise<void>;
}
