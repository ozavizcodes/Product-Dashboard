import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '@/shared/layout/page-header'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { Spinner } from '@/shared/ui/spinner'
import { Button } from '@/shared/ui/button'
import { productKeys } from '@/features/products/data/product-queries'
import { fetchProduct } from '@/features/products/data/product-service'
import type { Product } from '@/features/products/types'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Determines if a product ID is from a locally created product.
 * Locally created products use Date.now() as their ID, which will be a large timestamp.
 */
function isLocallyCreatedProduct(productId: string | number): boolean {
  const id = typeof productId === 'string' ? Number.parseInt(productId, 10) : productId
  // If ID is a timestamp (greater than Jan 1, 2001 in milliseconds), it's locally created
  return !Number.isNaN(id) && id > 1000000000000
}

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const queryClient = useQueryClient()

  const {
    data: product,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: productKeys.detail(productId ?? ''),
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required')

      // For locally created products, check cache first
      if (isLocallyCreatedProduct(productId)) {
        const cachedProduct = queryClient.getQueryData<Product>(
          productKeys.detail(productId),
        )
        if (cachedProduct) {
          return cachedProduct
        }
        // If not in cache, this product was created but cache was cleared
        // Try to find it in any product list cache
        const allListQueries = queryClient.getQueriesData({
          queryKey: productKeys.lists(),
        })
        for (const [, data] of allListQueries) {
          const productsResponse = data as { products: Product[] }
          const foundProduct = productsResponse?.products?.find(
            (p) => String(p.id) === String(productId),
          )
          if (foundProduct) {
            // Cache it for future use
            queryClient.setQueryData(productKeys.detail(productId), foundProduct)
            return foundProduct
          }
        }
        throw new Error(
          `Product with id '${productId}' was created locally but is not available. Please navigate back to the products list.`,
        )
      }
      // For API products, fetch from the API
      return fetchProduct(productId)
    },
    enabled: Boolean(productId),
  })

  if (!productId) {
    return (
      <section className="space-y-6">
        <PageHeader
          title="Product Not Found"
          description="No product ID was provided. Please select a product from the list."
        />
        <Card>
          <div className="space-y-4 text-center">
            <p className="text-slate-300">Unable to display product details.</p>
            <Button variant="secondary" asChild>
              <Link to="/products">← Back to Products</Link>
            </Button>
          </div>
        </Card>
      </section>
    )
  }

  if (isPending) {
    return (
      <section className="space-y-6">
        <PageHeader title="Loading Product" description="Fetching product details..." />
        <Card>
          <div className="flex min-h-[400px] items-center justify-center">
            <Spinner label="Loading product insights…" />
          </div>
        </Card>
      </section>
    )
  }

  if (isError || !product) {
    return (
      <section className="space-y-6">
        <PageHeader title="Error Loading Product" />
        <Card>
          <div className="space-y-4">
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
              <p className="font-semibold text-red-100">Unable to load product</p>
              <p className="mt-1 text-sm text-red-200">
                {(error as Error)?.message ?? 'An unexpected error occurred.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" asChild>
                <Link to="/products">← Back to Products</Link>
              </Button>
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          </div>
        </Card>
      </section>
    )
  }

  const stockStatus =
    product.stock > 50
      ? { label: 'In Stock', variant: 'success' as const }
      : product.stock > 0
        ? { label: 'Low Stock', variant: 'warning' as const }
        : { label: 'Out of Stock', variant: 'error' as const }

  const ratingStars = Math.round(product.rating)

  const isUserCreated = isLocallyCreatedProduct(product.id)

  return (
    <section className="space-y-8">
      <PageHeader
        title={product.title}
        description={product.description}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {isUserCreated && (
              <Badge variant="success" className="text-xs">
                ✨ User Created
              </Badge>
            )}
            <Button variant="ghost" asChild>
              <Link to="/products">← Back to Products</Link>
            </Button>
          </div>
        }
      />

      {/* Main Product Info */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Product Image */}
        <Card className="lg:col-span-1">
          <div className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-surface-200 to-surface-300">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          {product.images && product.images.length > 0 && (
            <div className="mt-3 sm:mt-4 grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, idx) => (
                <div
                  key={idx}
                  className="aspect-square overflow-hidden rounded-md bg-surface-200"
                >
                  <img
                    src={image}
                    alt={`${product.title} view ${idx + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Product Details */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
          {/* KPI Cards */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-brand-600/20 to-brand-700/10 border-brand-500/30 p-3 sm:p-4">
              <div className="space-y-1.5 sm:space-y-2">
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-brand-300">
                  Price
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {currencyFormatter.format(product.price)}
                </p>
                {product.discountPercentage > 0 && (
                  <p className="text-[10px] sm:text-xs text-brand-300">
                    {product.discountPercentage}% off
                  </p>
                )}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-accent-success/20 to-accent-success/10 border-accent-success/30 p-3 sm:p-4">
              <div className="space-y-1.5 sm:space-y-2">
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-accent-success/80">
                  Stock
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{product.stock}</p>
                <Badge variant={stockStatus.variant} className="text-[10px] sm:text-xs">
                  {stockStatus.label}
                </Badge>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-accent-warning/20 to-accent-warning/10 border-accent-warning/30 p-3 sm:p-4">
              <div className="space-y-1.5 sm:space-y-2">
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-accent-warning/80">
                  Rating
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    {product.rating.toFixed(1)}
                  </p>
                  <div className="flex text-yellow-400 text-xs sm:text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < ratingStars ? '★' : '☆'}</span>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400">out of 5.0</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-surface-300/50 to-surface-200/30 border-white/10 p-3 sm:p-4">
              <div className="space-y-1.5 sm:space-y-2">
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Created
                </p>
                <p className="text-base sm:text-lg font-semibold text-white">
                  {formatDate(product.meta?.createdAt)}
                </p>
                {product.meta?.updatedAt && (
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    Updated {formatDate(product.meta.updatedAt)}
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Product Metadata */}
          <Card className="p-4 sm:p-6">
            <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
              Product Information
            </h3>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Brand</p>
                <p className="font-semibold text-white">{product.brand}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Category</p>
                <p className="font-semibold text-white capitalize">
                  {product.category.replace(/-/g, ' ')}
                </p>
              </div>
              {product.weight && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">Weight</p>
                  <p className="font-semibold text-white">{product.weight} kg</p>
                </div>
              )}
              {product.dimensions && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">Dimensions</p>
                  <p className="font-semibold text-white">
                    {product.dimensions.width} × {product.dimensions.height} ×{' '}
                    {product.dimensions.depth} cm
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Additional Details */}
          {(product.availabilityStatus ||
            product.shippingInformation ||
            product.warrantyInformation) && (
            <Card>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                Additional Information
              </h3>
              <div className="space-y-3">
                {product.availabilityStatus && (
                  <div className="flex items-start justify-between border-b border-white/5 pb-3">
                    <p className="text-sm text-slate-400">Availability</p>
                    <Badge variant="success" className="ml-4">
                      {product.availabilityStatus}
                    </Badge>
                  </div>
                )}
                {product.shippingInformation && (
                  <div className="flex items-start justify-between border-b border-white/5 pb-3">
                    <p className="text-sm text-slate-400">Shipping</p>
                    <p className="ml-4 text-right text-sm text-white">
                      {product.shippingInformation}
                    </p>
                  </div>
                )}
                {product.warrantyInformation && (
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-slate-400">Warranty</p>
                    <p className="ml-4 text-right text-sm text-white">
                      {product.warrantyInformation}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
