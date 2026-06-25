import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsModule } from '../modules';
import type { ProductDraft } from '../../modules/products';

const PRODUCTS_KEY = ['products'];
const PAGE_SIZE = 10;

/**
 * Hook del CRUD de productos con paginacion.
 * - useQuery para la lista (cache por pagina).
 * - useMutation para crear/editar/borrar; al terminar invalida la cache.
 *
 * @param page Pagina actual (empieza en 0).
 */
export function useProducts(page = 0) {
  const queryClient = useQueryClient();

  const list = useQuery({
    // La pagina entra en la key: cada pagina se cachea por separado.
    queryKey: [...PRODUCTS_KEY, page],
    queryFn: ({ signal }) =>
      productsModule.searchAllProducts.execute(
        { limit: PAGE_SIZE, skip: page * PAGE_SIZE },
        signal,
      ),
  });

  // Tras cualquier escritura, invalida TODAS las paginas de productos.
  const invalidate = () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });

  const createMutation = useMutation({
    mutationFn: (draft: ProductDraft) => productsModule.createProduct.execute(draft),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, draft }: { id: number; draft: ProductDraft }) =>
      productsModule.updateProduct.execute(id, draft),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productsModule.deleteProduct.execute(id),
    onSuccess: invalidate,
  });

  const total = list.data?.total ?? 0;

  return {
    products: list.data?.items,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
    isLoading: list.isLoading,
    isError: list.isError,
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
    isMutating:
      createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}
