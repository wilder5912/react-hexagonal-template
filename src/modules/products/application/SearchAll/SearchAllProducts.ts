import type { ProductRepository } from '../../domain/ProductRepository';
import type { ProductPage, SearchOptions } from '../../domain/Product';

// Use case for fetching one paginated slice of products.
export class SearchAllProducts {
  constructor(private readonly repository: ProductRepository) {}

  execute(options?: SearchOptions, signal?: AbortSignal): Promise<ProductPage> {
    return this.repository.search(options, signal);
  }
}
