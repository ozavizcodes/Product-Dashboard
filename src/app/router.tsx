import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/shared/layout/app-layout'
import { ProductsPage } from '@/features/products/routes/products-page'
import { ProductDetailPage } from '@/features/products/routes/product-detail-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/products" replace />,
      },
      {
        path: '/products',
        element: <ProductsPage />,
      },
      {
        path: '/product/:productId',
        element: <ProductDetailPage />,
      },
    ],
  },
  { path: '*', element: <Navigate to="/products" replace /> },
])

