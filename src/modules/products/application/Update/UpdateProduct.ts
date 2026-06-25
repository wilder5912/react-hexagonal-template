import type { ProductRepository } from '../../domain/ProductRepository';
import type { Product, ProductDraft } from '../../domain/Product';

// Use case for updating an existing product.
export class UpdateProduct {
  constructor(private readonly repository: ProductRepository) {}

  execute(id: number, draft: ProductDraft, signal?: AbortSignal): Promise<Product> {
    return this.repository.update(id, draft, signal);
  }
}
