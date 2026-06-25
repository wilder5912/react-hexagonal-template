import type { Product, ProductDraft, ProductPage, SearchOptions } from './Product';

/**
 * Product repository contract used by the business layer.
 * This keeps the use cases focused on product actions instead of API details.
 */
export interface ProductRepository {
  // Read operations, including paginated listing.
  search(options?: SearchOptions, signal?: AbortSignal): Promise<ProductPage>;
  find(id: number, signal?: AbortSignal): Promise<Product>;
  // Write operations.
  create(draft: ProductDraft, signal?: AbortSignal): Promise<Product>;
  update(id: number, draft: ProductDraft, signal?: AbortSignal): Promise<Product>;
  remove(id: number, signal?: AbortSignal): Promise<void>;
}
