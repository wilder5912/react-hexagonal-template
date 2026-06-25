import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsModule } from '../modules';
import type { ProductDraft } from '../../modules/products';

const PRODUCTS_KEY = ['products'];
const PAGE_SIZE = 10;

/**
 * Connects the products module to the screen.
 * Reading uses one cached query per page, while writes use mutations and then refresh the product lists.
 *
 * @param page Zero-based page index used to fetch the current slice of products.
 */
export function useProducts(page = 0) {
  const queryClient = useQueryClient();

  const list = useQuery({
    // Putting the page in the query key gives each page its own cache entry.
    queryKey: [...PRODUCTS_KEY, page],
    queryFn: ({ signal }) =>
      productsModule.searchAllProducts.execute(
        { limit: PAGE_SIZE, skip: page * PAGE_SIZE },
        signal,
      ),
  });

  // Any create/update/delete can affect the list, so we refresh every cached products page.
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
