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
    <div className="space-y-5">
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label className="flex-1 text-sm">
          <span className="sr-only">Search products</span>
          <div className="relative">
            <Input
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search by product title or brand..."
              aria-label="Search products by title"
              disabled={isDisabled}
              className="pl-10"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
          </div>
        </label>
        <Button type="submit" disabled={isDisabled} className="min-w-[100px]">
          Search
        </Button>
      </form>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-4">
        <label className="text-xs uppercase tracking-wide">
          <span className="mb-1.5 sm:mb-2 block text-xs font-bold text-slate-300">
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

        <label className="text-xs uppercase tracking-wide">
          <span className="mb-1.5 sm:mb-2 block text-xs font-bold text-slate-300">
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

        <label className="text-xs uppercase tracking-wide sm:col-span-2 md:col-span-2">
          <span className="mb-1.5 sm:mb-2 block text-xs font-bold text-slate-300">
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

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
        <p className="text-xs text-slate-400">
          Filters sync with URL for easy sharing
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={isDisabled}
          className="text-xs"
        >
          ↻ Reset All
        </Button>
      </div>
    </div>
  )
}

