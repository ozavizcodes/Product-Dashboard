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

/**
 * Create a new product (mock implementation).
 * In a real app, this would POST to the API.
 * For this assessment, we simulate the creation and return a new product.
 */
export type CreateProductInput = {
  title: string
  description: string
  price: number
  brand: string
  category: string
  stock: number
  rating?: number
  thumbnail?: string
  images?: string[]
}

export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Generate a unique ID to mock the backend flow
  const newId = Date.now()

  // Create the product with defaults for optional fields
  const newProduct: Product = {
    id: newId,
    title: input.title.trim(),
    description: input.description.trim(),
    price: Number(input.price),
    discountPercentage: 0,
    rating: input.rating ?? 0,
    stock: Number(input.stock),
    brand: input.brand.trim(),
    category: input.category.trim(),
    thumbnail:
      input.thumbnail?.trim() ||
      `https://picsum.photos/300/300?random=${newId}`,
    images: input.images ?? [],
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }

  return newProduct
}

