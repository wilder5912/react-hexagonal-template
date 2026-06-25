import type { ProductRepository } from '../../domain/ProductRepository';
import type { Product } from '../../domain/Product';

// Use case for loading one product by id.
export class FindProduct {
  constructor(private readonly repository: ProductRepository) {}

  execute(id: number, signal?: AbortSignal): Promise<Product> {
    return this.repository.find(id, signal);
  }
}
