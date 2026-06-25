import type { ProductRepository } from '../../domain/ProductRepository';

// Caso de uso: eliminar un producto (DELETE).
export class DeleteProduct {
  constructor(private readonly repository: ProductRepository) {}

  execute(id: number, signal?: AbortSignal): Promise<void> {
    return this.repository.remove(id, signal);
  }
}
