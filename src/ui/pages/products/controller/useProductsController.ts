import { useState, type FormEvent } from 'react';
import { useProducts } from '../../../../app/hooks/useProducts';
import type { ProductDraft } from '../../../../modules/products';

const EMPTY_DRAFT: ProductDraft = { title: '', price: 0, category: '', stock: 0 };

/**
 * This controller keeps the products page dumb and focused on markup.
 * It owns pagination, edit state, form state, and the actions behind create/update/delete.
 */
export function useProductsController() {
  // Zero-based page index used by the products query hook.
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

  // `null` means "create mode". Any number means "edit that existing product".
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
    startCreate(); // Reset the form after a successful save so the UI goes back to create mode.
  }

  async function handleDelete(id: number) {
    await deleteProduct(id);
  }

  // Keep pagination safe by clamping the value instead of letting it drift out of range.
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
