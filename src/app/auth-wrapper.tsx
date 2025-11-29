import { Outlet } from 'react-router-dom'
import { AuthProvider } from '@/lib/auth-context'

/**
 * Wrapper component that provides AuthContext to all routes.
 * Must be used inside RouterProvider since auth components use useNavigate.
 */
export function AuthWrapper() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

