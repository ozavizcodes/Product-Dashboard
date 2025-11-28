import type {
  Product,
  ProductListParams,
  ProductsResponse,
} from '@/features/products/types'

const BASE_URL = 'https://dummyjson.com/products'

function buildProductsUrl(params: ProductListParams) {
  const { page, pageSize, search } = params
  const skip = Math.max(page - 1, 0) * pageSize
  const endpoint = search ? `${BASE_URL}/search` : BASE_URL

  const url = new URL(endpoint)
  url.searchParams.set('limit', String(pageSize))
  url.searchParams.set('skip', String(skip))

  if (search) {
    url.searchParams.set('q', search)
  }

  url.searchParams.set(
    'select',
    [
      'id',
      'title',
      'description',
      'price',
      'rating',
      'stock',
      'brand',
      'category',
      'thumbnail',
      'images',
      'availabilityStatus',
      'shippingInformation',
      'warrantyInformation',
      'dimensions',
      'weight',
      'meta',
    ].join(','),
  )

  return url.toString()
}

async function handleResponse<T>(response: Response) {
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Request failed (${response.status}): ${
        errorText || response.statusText
      }`,
    )
  }
  return (await response.json()) as T
}

export async function fetchProducts(
  params: ProductListParams,
): Promise<ProductsResponse> {
  const url = buildProductsUrl(params)
  return handleResponse<ProductsResponse>(await fetch(url))
}

export async function fetchProduct(id: string | number): Promise<Product> {
  const response = await fetch(`${BASE_URL}/${id}`)
  return handleResponse<Product>(response)
}

