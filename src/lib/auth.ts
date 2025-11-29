/**
 * Simple mock authentication service.
 *
 * For this assessment, we store a fake token in localStorage.
 * In a real app, this would call an API and validate credentials.
 */

const AUTH_TOKEN_KEY = 'product-dashboard-auth-token'

export type AuthUser = {
  username: string
  token: string
}

/**
 * Attempts to log in with username and password.
 * For this mock, any non-empty credentials are accepted.
 */
export function login(username: string, password: string): Promise<AuthUser> {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (username.trim() && password.trim()) {
        const token = `mock-token-${Date.now()}-${Math.random().toString(36).substring(7)}`
        const user: AuthUser = { username: username.trim(), token }
        localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(user))
        resolve(user)
      } else {
        reject(new Error('Username and password are required'))
      }
    }, 500)
  })
}

/**
 * Logs out the current user by removing the token from storage.
 */
export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

/**
 * Retrieves the current authenticated user from storage.
 * Returns null if no valid token exists.
 */
export function getCurrentUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!stored) return null
    const user = JSON.parse(stored) as AuthUser
    // Basic validation: ensure token exists
    if (user.token && user.username) {
      return user
    }
    return null
  } catch {
    return null
  }
}

/**
 * Checks if a user is currently authenticated.
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

