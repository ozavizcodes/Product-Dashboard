import { useState, useEffect, type ReactNode } from 'react'
import { login, logout, getCurrentUser, type AuthUser } from './auth'
import { AuthContext } from './auth-context-internal'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing auth on mount
  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true)
    try {
      const authenticatedUser = await login(username, password)
      setUser(authenticatedUser)
      return authenticatedUser
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        login: handleLogin,
        logout: handleLogout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}


