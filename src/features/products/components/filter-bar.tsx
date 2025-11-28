import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { SORT_OPTIONS } from '@/features/products/constants'
import type { ProductFilterState } from '@/features/products/hooks/use-product-search-params'

type FilterBarProps = {
  filters: ProductFilterState
  brandOptions: string[]
  categoryOptions: string[]
  onFiltersChange: (next: Partial<ProductFilterState>) => void
  onReset: () => void
  isDisabled?: boolean
}

export function ProductFilterBar({
  filters,
  brandOptions,
  categoryOptions,
  onFiltersChange,
  onReset,
  isDisabled,
}: FilterBarProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: event.target.value, page: 1 })
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onFiltersChange({ search: filters.search.trim(), page: 1 })
  }

  const handleSelectChange = (
    key: 'brand' | 'category' | 'sort',
    value: string,
  ) => {
    onFiltersChange({
      [key]: value,
      page: 1,
    })
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label className="flex-1 text-sm">
          <span className="sr-only">Search products</span>
          <Input
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by product title..."
            aria-label="Search products by title"
            disabled={isDisabled}
          />
        </label>
        <Button type="submit" disabled={isDisabled}>
          Search
        </Button>
      </form>

      <div className="grid gap-3 md:grid-cols-4">
        <label className="text-xs uppercase tracking-wide text-slate-400">
          <span className="mb-2 block text-[0.7rem] font-semibold text-slate-400">
            Brand
          </span>
          <Select
            value={filters.brand}
            onChange={(event) =>
              handleSelectChange('brand', event.target.value)
            }
            disabled={isDisabled}
          >
            <option value="">All brands</option>
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Select>
        </label>

        <label className="text-xs uppercase tracking-wide text-slate-400">
          <span className="mb-2 block text-[0.7rem] font-semibold text-slate-400">
            Category
          </span>
          <Select
            value={filters.category}
            onChange={(event) =>
              handleSelectChange('category', event.target.value)
            }
            disabled={isDisabled}
          >
            <option value="">All categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </label>

        <label className="text-xs uppercase tracking-wide text-slate-400 md:col-span-2">
          <span className="mb-2 block text-[0.7rem] font-semibold text-slate-400">
            Sort by
          </span>
          <Select
            value={filters.sort}
            onChange={(event) => handleSelectChange('sort', event.target.value)}
            disabled={isDisabled}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <p>
          Search syncs with the URL so you can share a filtered view with other
          reviewers.
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={isDisabled}
        >
          Reset filters
        </Button>
      </div>
    </div>
  )
}

