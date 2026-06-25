import type { ProductRepository } from '../../domain/ProductRepository';
import type { ProductPage, SearchOptions } from '../../domain/Product';

// Caso de uso: listar productos paginados (limit + skip).
export class SearchAllProducts {
  constructor(private readonly repository: ProductRepository) {}

  execute(options?: SearchOptions, signal?: AbortSignal): Promise<ProductPage> {
    return this.repository.search(options, signal);
  }
}
