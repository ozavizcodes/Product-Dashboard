import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  fetchProduct,
  fetchProducts,
  createProduct,
  type CreateProductInput,
} from '@/features/products/data/product-service'
import type { Product, ProductListParams, ProductsResponse } from '@/features/products/types'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductListParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (productId: string | number) => [...productKeys.details(), productId] as const,
}

export function createProductListQueryOptions(params: ProductListParams) {
  return queryOptions({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProducts(params),
    placeholderData: keepPreviousData,
  })
}

export function createProductDetailQueryOptions(productId: string | number) {
  return queryOptions({
    queryKey: productKeys.detail(productId),
    queryFn: () => fetchProduct(productId),
  })
}

/**
 * Hook for creating a new product with optimistic cache updates.
 * After successful creation, adds the new product to all product list caches
 * so it appears immediately without needing to refetch from the API.
 */
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(input),
    onSuccess: (newProduct) => {
      // Optimistically update all product list queries by adding the new product
      queryClient.setQueriesData<ProductsResponse>(
        { queryKey: productKeys.lists() },
        (oldData) => {
          if (!oldData) return oldData

          // Add the new product to the beginning of the products array
          return {
            ...oldData,
            products: [newProduct, ...oldData.products],
            total: oldData.total + 1,
          }
        },
      )

      // Also set the detail query for the new product so it's cached
      queryClient.setQueryData(
        productKeys.detail(newProduct.id),
        newProduct,
      )
    },
  })
}

