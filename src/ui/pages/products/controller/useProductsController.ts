import { useState, type FormEvent } from 'react';
import { useProducts } from '../../../../app/hooks/useProducts';
import type { ProductDraft } from '../../../../modules/products';

const EMPTY_DRAFT: ProductDraft = { title: '', price: 0, category: '', stock: 0 };

/**
 * Controlador de la pagina de productos: tabla + formulario de crear/editar + borrar.
 * Toda la logica de UI vive aqui; la pagina solo pinta.
 */
export function useProductsController() {
  // Pagina actual (empieza en 0). Se la pasamos al hook de datos.
  const [page, setPage] = useState(0);
  const {
    products,
    total,
    totalPages,
    isLoading,
    isError,
    createProduct,
    updateProduct,
    deleteProduct,
    isMutating,
  } = useProducts(page);

  // Si editingId es null estamos creando; si tiene valor, editando ese producto.
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<ProductDraft>(EMPTY_DRAFT);

  function startCreate() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  }

  function startEdit(id: number) {
    const product = products?.find((p) => p.id === id);
    if (!product) return;
    setEditingId(id);
    setDraft({
      title: product.title,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingId === null) {
      await createProduct(draft);
    } else {
      await updateProduct({ id: editingId, draft });
    }
    startCreate(); // limpia el formulario
  }

  async function handleDelete(id: number) {
    await deleteProduct(id);
  }

  // Navegacion de paginas (sin pasarse de los limites).
  function nextPage() {
    setPage((p) => Math.min(p + 1, totalPages - 1));
  }
  function prevPage() {
    setPage((p) => Math.max(p - 1, 0));
  }

  return {
    products,
    total,
    page,
    totalPages,
    isLoading,
    isError,
    isMutating,
    editingId,
    draft,
    setDraft,
    startCreate,
    startEdit,
    handleSubmit,
    handleDelete,
    nextPage,
    prevPage,
  };
}
