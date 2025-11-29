import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/shared/layout/app-layout'
import { AuthWrapper } from '@/app/auth-wrapper'
import { ProtectedRoute } from '@/lib/protected-route'
import { PublicRoute } from '@/lib/public-route'
import { LoginPage } from '@/features/auth/routes/login-page'
import { ProductsPage } from '@/features/products/routes/products-page'
import { ProductDetailPage } from '@/features/products/routes/product-detail-page'
import { CreateProductPage } from '@/features/products/routes/create-product-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthWrapper />,
    children: [
      {
        path: '/login',
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
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
            element: (
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/product/:productId',
            element: (
              <ProtectedRoute>
                <ProductDetailPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/products/new',
            element: (
              <ProtectedRoute>
                <CreateProductPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/products" replace /> },
])

