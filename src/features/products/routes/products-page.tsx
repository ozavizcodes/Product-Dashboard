import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/shared/layout/page-header'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { createProductListQueryOptions } from '@/features/products/data/product-queries'
import {
  PRODUCT_PAGE_SIZE,
  PRODUCTS_DATASET_LIMIT,
} from '@/features/products/constants'
import { ProductFilterBar } from '@/features/products/components/filter-bar'
import { Pagination } from '@/features/products/components/pagination'
import { useProductSearchParams } from '@/features/products/hooks/use-product-search-params'
import type { Product } from '@/features/products/types'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function getComparableTimestamp(product: Product) {
  const value = product.meta?.createdAt ?? product.meta?.updatedAt
  if (!value) {
    return product.id
  }
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? product.id : timestamp
}

function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function ProductsPage() {
  const navigate = useNavigate()
  const { filters, updateFilters, resetFilters } = useProductSearchParams()
  const { page, search, brand, category, sort } = filters

  const { data, isPending, isError, error, refetch } = useQuery(
    createProductListQueryOptions({
      page: 1,
      pageSize: PRODUCTS_DATASET_LIMIT,
      search: search || undefined,
    }),
  )

  const products = useMemo(() => data?.products ?? [], [data])

  const brandOptions = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.brand))).sort()
  }, [products])

  const categoryOptions = useMemo(() => {
    return Array.from(
      new Set(products.map((product) => product.category)),
    ).sort()
  }, [products])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return products.filter((product) => {
      if (brand && product.brand !== brand) return false
      if (category && product.category !== category) return false
      if (normalizedSearch) {
        const haystack = `${product.title} ${product.brand}`.toLowerCase()
        if (!haystack.includes(normalizedSearch)) return false
      }
      return true
    })
  }, [products, brand, category, search])

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const delta = getComparableTimestamp(a) - getComparableTimestamp(b)
      return sort === 'newest' ? -delta : delta
    })
  }, [filteredProducts, sort])

  const totalItems = sortedProducts.length
  const totalPages = Math.max(1, Math.ceil(totalItems / PRODUCT_PAGE_SIZE))
  const pageIndex = Math.min(page, totalPages)

  useEffect(() => {
    if (page > totalPages) {
      updateFilters({ page: totalPages })
    }
  }, [page, totalPages, updateFilters])

  const pagedProducts = useMemo(() => {
    const start = (pageIndex - 1) * PRODUCT_PAGE_SIZE
    return sortedProducts.slice(start, start + PRODUCT_PAGE_SIZE)
  }, [sortedProducts, pageIndex])

  const handleNavigateToProduct = (productId: number) => {
    navigate(`/product/${productId}`)
  }

  return (
    <section className="space-y-8">
      <PageHeader
        title="Products"
        description="Browse the entire catalog with pagination, filters, sorting, and accessible interactions."
        actions={
          <Button
            variant="secondary"
            onClick={() => navigate('/products/new')}
          >
            New product
          </Button>
        }
      />

      <Card>
        <ProductFilterBar
          filters={filters}
          brandOptions={brandOptions}
          categoryOptions={categoryOptions}
          onFiltersChange={updateFilters}
          onReset={resetFilters}
          isDisabled={isPending}
        />
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <p>
            {totalItems} result{totalItems === 1 ? '' : 's'} · sorted by{' '}
            {sort === 'newest' ? 'newest first' : 'oldest first'} · page {pageIndex} of{' '}
            {totalPages}
          </p>
          <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isPending}>
            Refresh data
          </Button>
        </div>

        {isPending ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
            <p className="font-semibold">Unable to load products.</p>
            <p className="mt-1 text-red-200">
              {(error as Error)?.message ?? 'Unknown error.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button size="sm" onClick={() => refetch()}>
                Retry
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
              >
                Reset filters
              </Button>
            </div>
          </div>
        ) : pagedProducts.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-300">
            <p className="text-base font-semibold text-white">
              No products match your filters.
            </p>
            <p className="mt-2 text-slate-400">
              Try adjusting the search term, brand, or category filters.
            </p>
            <Button className="mt-4" variant="ghost" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="text-left text-xs uppercase tracking-widest text-slate-400">
                <tr>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Product
                  </th>
                  <th scope="col" className="py-3 px-4 font-semibold">
                    Brand
                  </th>
                  <th scope="col" className="py-3 px-4 font-semibold">
                    Category
                  </th>
                  <th scope="col" className="py-3 px-4 font-semibold">
                    Price
                  </th>
                  <th scope="col" className="py-3 px-4 font-semibold">
                    Rating
                  </th>
                  <th scope="col" className="py-3 px-4 font-semibold">
                    Stock
                  </th>
                  <th scope="col" className="py-3 pl-4 font-semibold">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pagedProducts.map((product) => (
                  <tr
                    key={product.id}
                    tabIndex={0}
                    role="button"
                    onClick={() => handleNavigateToProduct(product.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        handleNavigateToProduct(product.id)
                      }
                    }}
                    className="cursor-pointer bg-white/0 transition hover:bg-white/5 focus:bg-white/10"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.thumbnail}
                          alt=""
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-lg object-cover"
                          loading="lazy"
                        />
                        <div>
                          <p className="font-semibold text-white">
                            {product.title}
                          </p>
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-300">
                      {product.brand}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-300">
                      {product.category}
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-white">
                      {currencyFormatter.format(product.price)}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-300">
                      {product.rating.toFixed(1)} / 5
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-300">
                      {product.stock}
                    </td>
                    <td className="py-4 pl-4 text-sm text-slate-300">
                      {formatDate(product.meta?.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {!isError ? (
        <Card>
          <Pagination
            page={pageIndex}
            totalPages={totalPages}
            pageSize={PRODUCT_PAGE_SIZE}
            totalItems={totalItems}
            onPageChange={(nextPage) => updateFilters({ page: nextPage })}
          />
        </Card>
      ) : null}
    </section>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5).keys()].map((key) => (
        <div
          key={key}
          className="flex items-center gap-4 rounded-lg border border-white/5 bg-white/5 p-4"
        >
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

