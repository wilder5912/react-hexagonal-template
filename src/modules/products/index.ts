import { createHttpClient } from '../../shared/http/httpClient';
import { API_BASE_URLS } from '../../shared/config/apiConfig';
import { ApiProductRepository } from './infrastructure/ApiProductRepository';
import { SearchAllProducts } from './application/SearchAll/SearchAllProducts';
import { FindProduct } from './application/Find/FindProduct';
import { CreateProduct } from './application/Create/CreateProduct';
import { UpdateProduct } from './application/Update/UpdateProduct';
import { DeleteProduct } from './application/Delete/DeleteProduct';

/** Composition root del modulo products (CRUD completo). */
export function createProductsModule() {
  const http = createHttpClient(API_BASE_URLS.products);
  const repository = new ApiProductRepository(http);

  return {
    searchAllProducts: new SearchAllProducts(repository),
    findProduct: new FindProduct(repository),
    createProduct: new CreateProduct(repository),
    updateProduct: new UpdateProduct(repository),
    deleteProduct: new DeleteProduct(repository),
  };
}

export type ProductsModule = ReturnType<typeof createProductsModule>;
export type { Product, ProductDraft } from './domain/Product';
