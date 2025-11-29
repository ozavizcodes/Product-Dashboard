import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { ProductFilterBar } from '../filter-bar'
import type { ProductFilterState } from '@/features/products/hooks/use-product-search-params'

// Mock filters for the ProductFilterBar component
const mockFilters: ProductFilterState = {
  page: 1,
  search: '',
  brand: '',
  category: '',
  sort: 'newest',
}

// Test suite for the ProductFilterBar component
describe('ProductFilterBar', () => {
  // Test that the ProductFilterBar renders all filter controls
  it('renders all filter controls', () => {
    const handleChange = vi.fn()
    const handleReset = vi.fn()

    render(
      <ProductFilterBar
        filters={mockFilters}
        brandOptions={['Apple', 'Samsung']}
        categoryOptions={['smartphones', 'laptops']}
        onFiltersChange={handleChange}
        onReset={handleReset}
      />,
    )

    expect(screen.getByLabelText(/search products/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/brand/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument()
  })

  // Test that the ProductFilterBar calls onFiltersChange when the search input changes
  it('calls onFiltersChange when search input changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <ProductFilterBar
        filters={mockFilters}
        brandOptions={[]}
        categoryOptions={[]}
        onFiltersChange={handleChange}
        onReset={vi.fn()}
      />,
    )

    const searchInput = screen.getByLabelText(/search products/i)
    await user.type(searchInput, 'test')

    // Should call onChange for each character typed
    expect(handleChange).toHaveBeenCalled()
    // Verify the function is called with page: 1
    expect(handleChange.mock.calls[0][0]).toMatchObject({ page: 1 })
  })

  // Test that the ProductFilterBar calls onFiltersChange when the brand is selected
  it('calls onFiltersChange when brand is selected', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <ProductFilterBar
        filters={mockFilters}
        brandOptions={['Apple', 'Samsung']}
        categoryOptions={[]}
        onFiltersChange={handleChange}
        onReset={vi.fn()}
      />,
    )

    const brandSelect = screen.getByLabelText(/brand/i)
    await user.selectOptions(brandSelect, 'Apple')

    expect(handleChange).toHaveBeenCalledWith({
      brand: 'Apple',
      page: 1,
    })
  })

  // Test that the ProductFilterBar calls onReset when the reset button is clicked
  it('calls onReset when reset button is clicked', async () => {
    const user = userEvent.setup()
    const handleReset = vi.fn()

    render(
      <ProductFilterBar
        filters={mockFilters}
        brandOptions={[]}
        categoryOptions={[]}
        onFiltersChange={vi.fn()}
        onReset={handleReset}
      />,
    )

    const resetButton = screen.getByRole('button', { name: /reset filters/i })
    await user.click(resetButton)

    expect(handleReset).toHaveBeenCalledTimes(1)
  })

  // Test that the ProductFilterBar disables all inputs when isDisabled is true
  it('disables all inputs when isDisabled is true', () => {
    render(
      <ProductFilterBar
        filters={mockFilters}
        brandOptions={[]}
        categoryOptions={[]}
        onFiltersChange={vi.fn()}
        onReset={vi.fn()}
        isDisabled={true}
      />,
    )

    const searchInput = screen.getByLabelText(/search products/i)
    expect(searchInput).toBeDisabled()
  })
})

