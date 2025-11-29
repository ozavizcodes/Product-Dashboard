import { createContext } from 'react'
import type { AuthUser } from './auth'

export type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<AuthUser>
  logout: () => void
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)

