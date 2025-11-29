import { Navigate } from 'react-router-dom'
import { useAuth } from './use-auth'

type PublicRouteProps = {
  children: React.ReactNode
}

/**
 * PublicRoute component that redirects authenticated users away from public pages
 * (like login) to the main app.
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null // Or a loading spinner
  }

  if (isAuthenticated) {
    return <Navigate to="/products" replace />
  }

  return <>{children}</>
}

