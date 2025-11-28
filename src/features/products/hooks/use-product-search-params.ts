import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

const DEFAULT_SORT = 'newest' as const

export type ProductFilterState = {
  page: number
  search: string
  brand: string
  category: string
  sort: 'newest' | 'oldest'
}

export function useProductSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<ProductFilterState>(() => {
    const page = Number(searchParams.get('page')) || 1
    const search = searchParams.get('search') ?? ''
    const brand = searchParams.get('brand') ?? ''
    const category = searchParams.get('category') ?? ''
    const sort = (searchParams.get('sort') as 'newest' | 'oldest') ?? DEFAULT_SORT

    return {
      page: Math.max(page, 1),
      search,
      brand,
      category,
      sort,
    }
  }, [searchParams])

  const updateFilters = useCallback(
    (updates: Partial<ProductFilterState>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)

        Object.entries(updates).forEach(([key, value]) => {
          if (
            value === undefined ||
            value === '' ||
            (key === 'page' && value === 1) ||
            (key === 'sort' && value === DEFAULT_SORT)
          ) {
            next.delete(key)
          } else {
            next.set(key, String(value))
          }
        })

        return next
      })
    },
    [setSearchParams],
  )

  const resetFilters = useCallback(() => {
    setSearchParams({})
  }, [setSearchParams])

  return { filters, updateFilters, resetFilters }
}

