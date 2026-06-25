import type { ProductRepository } from '../../domain/ProductRepository';

// Use case for removing a product.
export class DeleteProduct {
  constructor(private readonly repository: ProductRepository) {}

  execute(id: number, signal?: AbortSignal): Promise<void> {
    return this.repository.remove(id, signal);
  }
}
