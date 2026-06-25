import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProducts } from '../../../../app/hooks/useProducts';
import { productSchema, type ProductFormValues } from './productSchema';

const EMPTY_DRAFT: ProductFormValues = { title: '', price: 0, category: '', stock: 0 };

/**
 * This controller keeps the products page dumb and focused on markup.
 * It owns pagination, edit state, and the actions behind create/update/delete.
 *
 * The form itself is handled by react-hook-form + zod: `register` wires inputs,
 * `errors` exposes validation messages, and `submit` only runs once the schema passes.
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

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: EMPTY_DRAFT,
  });

  function startCreate() {
    setEditingId(null);
    reset(EMPTY_DRAFT); // Clear the form and any validation errors.
  }

  function startEdit(id: number) {
    const product = products?.find((p) => p.id === id);
    if (!product) return;
    setEditingId(id);
    reset({
      title: product.title,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
  }

  // Only runs when validation passes; `values` is already typed and coerced by zod.
  const submit = rhfHandleSubmit(async (values) => {
    if (editingId === null) {
      await createProduct(values);
    } else {
      await updateProduct({ id: editingId, draft: values });
    }
    startCreate(); // Reset the form after a successful save so the UI goes back to create mode.
  });

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
    register,
    errors,
    submit,
    startCreate,
    startEdit,
    handleDelete,
    nextPage,
    prevPage,
  };
}
