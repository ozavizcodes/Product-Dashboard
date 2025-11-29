import { Navigate } from 'react-router-dom'
import { useAuth } from './use-auth'
import { Spinner } from '@/shared/ui/spinner'

type ProtectedRouteProps = {
  children: React.ReactNode
}

/**
 * ProtectedRoute component that ensures only authenticated users can access
 * the wrapped route. Redirects to /login if not authenticated.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

