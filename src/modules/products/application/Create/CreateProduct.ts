import type { ProductRepository } from '../../domain/ProductRepository';
import type { Product, ProductDraft } from '../../domain/Product';

// Use case for creating a new product.
export class CreateProduct {
  constructor(private readonly repository: ProductRepository) {}

  execute(draft: ProductDraft, signal?: AbortSignal): Promise<Product> {
    return this.repository.create(draft, signal);
  }
}
