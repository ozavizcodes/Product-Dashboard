import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '@/shared/layout/page-header'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { Spinner } from '@/shared/ui/spinner'
import { Button } from '@/shared/ui/button'
import { createProductDetailQueryOptions } from '@/features/products/data/product-queries'

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()

  const {
    data: product,
    isPending,
    isError,
    error,
  } = useQuery({
    ...createProductDetailQueryOptions(productId ?? ''),
    enabled: Boolean(productId),
  })

  if (!productId) {
    return (
      <section className="space-y-6 text-sm text-slate-300">
        <PageHeader
          title="Product details"
          description="Select an item from the products table to see the enriched payload, KPI tiles, and actions."
        />
        <Card>
          <p>No product id supplied. Head back to the products list.</p>
          <Link
            to="/products"
            className="mt-4 inline-flex text-sm font-semibold text-brand-300 hover:text-brand-100"
          >
            ← Back to list
          </Link>
        </Card>
      </section>
    )
  }

  if (isPending) {
    return (
      <section className="space-y-6">
        <PageHeader title="Product details" />
        <Card>
          <Spinner label="Loading product insights…" />
        </Card>
      </section>
    )
  }

  if (isError || !product) {
    return (
      <section className="space-y-6">
        <PageHeader title="Product details" />
        <Card className="space-y-4">
          <p className="text-sm text-red-100">
            {(error as Error)?.message ?? 'Unable to load product details.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" asChild>
              <Link to="/products">Back to products</Link>
            </Button>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </Card>
      </section>
    )
  }

  const createdAt = product.meta?.createdAt
    ? new Date(product.meta.createdAt).toLocaleDateString()
    : 'Unknown'

  return (
    <section className="space-y-8">
      <PageHeader
        title={product.title}
        description={product.description}
        actions={
            <Button variant="ghost" asChild>
              <Link to="/products">← Back to products</Link>
            </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400">
                Price
              </p>
              <p className="text-2xl font-semibold text-white">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <Badge variant="success">
              {product.availabilityStatus ?? 'Status TBD'}
            </Badge>
          </div>
          <p className="text-xs text-slate-400">
            Created at {createdAt} · Rating {product.rating}/5 · Stock{' '}
            {product.stock}
          </p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Brand</span>
            <span className="font-semibold text-white">{product.brand}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Category</span>
            <span className="font-semibold text-white">{product.category}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Weight</span>
            <span className="font-semibold text-white">
              {product.weight ? `${product.weight} kg` : '—'}
            </span>
          </div>
        </Card>
      </div>

      <Card className="space-y-2 text-sm text-slate-300">
       
      </Card>
    </section>
  )
}

