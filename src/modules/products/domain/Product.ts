// Modelo de dominio de Producto.
export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  stock: number;
}

// Datos necesarios para crear/editar (sin id: lo asigna el origen al crear).
export interface ProductDraft {
  title: string;
  price: number;
  category: string;
  stock: number;
}

// Opciones de paginacion que la UI envia al listar.
export interface SearchOptions {
  limit?: number;
  skip?: number;
}

// Resultado paginado: los items de la pagina + el total disponible en el origen.
export interface ProductPage {
  items: Product[];
  total: number;
}
