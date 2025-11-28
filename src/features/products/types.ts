export type Product = {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
  tags?: string[]
  availabilityStatus?: string
  shippingInformation?: string
  warrantyInformation?: string
  dimensions?: {
    width: number
    height: number
    depth: number
  }
  weight?: number
  meta?: {
    createdAt?: string
    updatedAt?: string
  }
}

export type ProductsResponse = {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export type ProductListParams = {
  page: number
  pageSize: number
  search?: string
  brand?: string
  category?: string
  sort?: 'newest' | 'oldest'
}

