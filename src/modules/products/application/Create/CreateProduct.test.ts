import { describe, it, expect, vi } from 'vitest';
import { CreateProduct } from './CreateProduct';
import type { ProductRepository } from '../../domain/ProductRepository';
import type { Product, ProductDraft } from '../../domain/Product';

// This write-side CRUD test uses a fake repository, so we can verify behavior without network calls.
const draft: ProductDraft = { title: 'Teclado', price: 50, category: 'tech', stock: 10 };
const created: Product = { id: 123, ...draft };

function makeRepo(overrides: Partial<ProductRepository> = {}): ProductRepository {
  return {
    search: vi.fn(),
    find: vi.fn(),
    create: vi.fn().mockResolvedValue(created),
    update: vi.fn(),
    remove: vi.fn(),
    ...overrides,
  };
}

describe('CreateProduct', () => {
  it('crea el producto y devuelve el resultado del repositorio', async () => {
    const repository = makeRepo();
    const useCase = new CreateProduct(repository);

    const result = await useCase.execute(draft);

    expect(result).toEqual(created);
    expect(repository.create).toHaveBeenCalledWith(draft, undefined);
  });

  it('propaga el error si la creacion falla', async () => {
    const repository = makeRepo({
      create: vi.fn().mockRejectedValue(new Error('500')),
    });
    const useCase = new CreateProduct(repository);

    await expect(useCase.execute(draft)).rejects.toThrow('500');
  });
});
