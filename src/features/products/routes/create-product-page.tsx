import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateProduct } from '@/features/products/data/product-queries'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { PageHeader } from '@/shared/layout/page-header'
import { PRODUCT_CATEGORIES, PRODUCT_BRANDS } from '@/features/products/constants'

type FormErrors = {
  title?: string
  description?: string
  price?: string
  brand?: string
  category?: string
  stock?: string
}

export function CreateProductPage() {
  const navigate = useNavigate()
  const createProductMutation = useCreateProduct()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    brand: '',
    category: '',
    stock: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    const price = Number.parseFloat(formData.price)
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required'
    } else if (Number.isNaN(price) || price <= 0) {
      newErrors.price = 'Price must be a positive number'
    }

    if (!formData.brand) {
      newErrors.brand = 'Brand is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    const stock = Number.parseInt(formData.stock, 10)
    if (!formData.stock.trim()) {
      newErrors.stock = 'Stock is required'
    } else if (Number.isNaN(stock) || stock < 0) {
      newErrors.stock = 'Stock must be a non-negative number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await createProductMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        brand: formData.brand,
        category: formData.category,
        stock: Number.parseInt(formData.stock, 10),
      })

      // Navigate back to products list after successful prod creation
      navigate('/products', { replace: true })
    } catch (error) {
      // Error is handled by the mutation, but we could show a toast here
      console.error('Failed to create product:', error)
    }
  }

  const handleChange = (
    field: keyof typeof formData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <section className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="Create New Product"
        description="Add a new product to the catalog. All fields are required."
        actions={
          <Button
            variant="ghost"
            onClick={() => navigate('/products')}
            disabled={createProductMutation.isPending}
          >
            Cancel
          </Button>
        }
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {createProductMutation.isError && (
            <div
              className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100"
              role="alert"
            >
              <p className="font-semibold">Failed to create product</p>
              <p className="mt-1 text-red-200">
                {createProductMutation.error instanceof Error
                  ? createProductMutation.error.message
                  : 'An unexpected error occurred. Please try again.'}
              </p>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              <span className="mb-2 block font-semibold text-slate-200">
                Product Title <span className="text-red-400">*</span>
              </span>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., iPhone 15 Pro"
                aria-label="Product title"
                aria-invalid={errors.title ? 'true' : 'false'}
                aria-describedby={errors.title ? 'title-error' : undefined}
                required
                disabled={createProductMutation.isPending}
              />
              {errors.title && (
                <p id="title-error" className="mt-1 text-xs text-red-400">
                  {errors.title}
                </p>
              )}
            </label>

            <label className="block text-sm sm:col-span-2">
              <span className="mb-2 block font-semibold text-slate-200">
                Description <span className="text-red-400">*</span>
              </span>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the product in detail..."
                aria-label="Product description"
                aria-invalid={errors.description ? 'true' : 'false'}
                aria-describedby={
                  errors.description ? 'description-error' : undefined
                }
                required
                disabled={createProductMutation.isPending}
                rows={4}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/50 disabled:cursor-not-allowed disabled:opacity-60"
              />
              {errors.description && (
                <p id="description-error" className="mt-1 text-xs text-red-400">
                  {errors.description}
                </p>
              )}
            </label>

            <label className="block text-sm">
              <span className="mb-2 block font-semibold text-slate-200">
                Price (USD) <span className="text-red-400">*</span>
              </span>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="0.00"
                aria-label="Product price"
                aria-invalid={errors.price ? 'true' : 'false'}
                aria-describedby={errors.price ? 'price-error' : undefined}
                required
                disabled={createProductMutation.isPending}
              />
              {errors.price && (
                <p id="price-error" className="mt-1 text-xs text-red-400">
                  {errors.price}
                </p>
              )}
            </label>

            <label className="block text-sm">
              <span className="mb-2 block font-semibold text-slate-200">
                Stock Quantity <span className="text-red-400">*</span>
              </span>
              <Input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                placeholder="0"
                aria-label="Stock quantity"
                aria-invalid={errors.stock ? 'true' : 'false'}
                aria-describedby={errors.stock ? 'stock-error' : undefined}
                required
                disabled={createProductMutation.isPending}
              />
              {errors.stock && (
                <p id="stock-error" className="mt-1 text-xs text-red-400">
                  {errors.stock}
                </p>
              )}
            </label>

            <label className="block text-sm">
              <span className="mb-2 block font-semibold text-slate-200">
                Brand <span className="text-red-400">*</span>
              </span>
              <Select
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                aria-label="Product brand"
                aria-invalid={errors.brand ? 'true' : 'false'}
                aria-describedby={errors.brand ? 'brand-error' : undefined}
                required
                disabled={createProductMutation.isPending}
              >
                <option value="">Select a brand</option>
                {PRODUCT_BRANDS.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </Select>
              {errors.brand && (
                <p id="brand-error" className="mt-1 text-xs text-red-400">
                  {errors.brand}
                </p>
              )}
            </label>

            <label className="block text-sm">
              <span className="mb-2 block font-semibold text-slate-200">
                Category <span className="text-red-400">*</span>
              </span>
              <Select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                aria-label="Product category"
                aria-invalid={errors.category ? 'true' : 'false'}
                aria-describedby={errors.category ? 'category-error' : undefined}
                required
                disabled={createProductMutation.isPending}
              >
                <option value="">Select a category</option>
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              {errors.category && (
                <p id="category-error" className="mt-1 text-xs text-red-400">
                  {errors.category}
                </p>
              )}
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/products')}
              disabled={createProductMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createProductMutation.isPending}
              disabled={createProductMutation.isPending}
            >
              Create Product
            </Button>
          </div>
        </form>
      </Card>
    </section>
  )
}

