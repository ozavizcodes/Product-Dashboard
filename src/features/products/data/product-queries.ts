import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { fetchProduct, fetchProducts } from '@/features/products/data/product-service'
import type { ProductListParams } from '@/features/products/types'

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

