// Core product shape used throughout the business layer.
export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  stock: number;
}

// The editable fields for create/update forms. No id here because the backend owns that.
export interface ProductDraft {
  title: string;
  price: number;
  category: string;
  stock: number;
}

// Listing options used to request just one slice of the full product collection.
export interface SearchOptions {
  limit?: number;
  skip?: number;
}

// A paginated response combines the current items with the total count available on the server.
export interface ProductPage {
  items: Product[];
  total: number;
}
