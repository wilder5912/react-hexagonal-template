import type { ProductRepository } from '../../domain/ProductRepository';
import type { Product } from '../../domain/Product';

// Caso de uso: obtener un producto por id.
export class FindProduct {
  constructor(private readonly repository: ProductRepository) {}

  execute(id: number, signal?: AbortSignal): Promise<Product> {
    return this.repository.find(id, signal);
  }
}
