import type { HttpClient } from '../../../shared/http/httpClient';
import type { ProductRepository } from '../domain/ProductRepository';
import type { Product, ProductDraft, ProductPage, SearchOptions } from '../domain/Product';

// Raw response shape from DummyJSON before we map it into our domain model.
interface ApiProduct {
  id: number;
  title: string;
  price: number;
  category: string;
  stock: number;
}

interface ApiProductList {
  products: ApiProduct[];
  total: number;
}

const DEFAULT_LIMIT = 10;

function toDomain(api: ApiProduct): Product {
  // Keep the API-specific mapping in one place so the rest of the app only sees clean domain data.
  return {
    id: api.id,
    title: api.title,
    price: api.price,
    category: api.category ?? 'uncategorized',
    stock: api.stock ?? 0,
  };
}

export class ApiProductRepository implements ProductRepository {
  constructor(private readonly http: HttpClient) {}

  async search(options: SearchOptions = {}, signal?: AbortSignal): Promise<ProductPage> {
    // Axios turns `params` into the expected query string, e.g. ?limit=10&skip=20.
    const data = await this.http.get<ApiProductList>('/products', {
      params: {
        limit: options.limit ?? DEFAULT_LIMIT,
        skip: options.skip ?? 0,
      },
      signal,
    });

    return {
      items: data.products.map(toDomain),
      total: data.total,
    };
  }

  async find(id: number, signal?: AbortSignal): Promise<Product> {
    const data = await this.http.get<ApiProduct>(`/products/${id}`, { signal });
    return toDomain(data);
  }

  async create(draft: ProductDraft, signal?: AbortSignal): Promise<Product> {
    const data = await this.http.post<ApiProduct>('/products/add', draft, { signal });
    return toDomain(data);
  }

  async update(id: number, draft: ProductDraft, signal?: AbortSignal): Promise<Product> {
    const data = await this.http.put<ApiProduct>(`/products/${id}`, draft, { signal });
    return toDomain(data);
  }

  async remove(id: number, signal?: AbortSignal): Promise<void> {
    await this.http.delete(`/products/${id}`, { signal });
  }
}
