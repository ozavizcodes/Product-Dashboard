import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/use-auth'
import { Button } from '@/shared/ui/button'

export function AppLayout() {
  const currentYear = new Date().getFullYear()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-surface-50 text-slate-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition"
      >
        Skip to main content
      </a>
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-white/10 bg-surface-100/40 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
            <NavLink to="/products" className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-lg font-bold text-white shadow-card">
                PD
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-200">
                  Product Dashboard
                </p>
                <p className="text-xs text-slate-400">
                  Lotus Beta Analytics · Assessment
                </p>
              </div>
            </NavLink>
            <nav aria-label="Primary navigation">
              <ul className="flex items-center gap-4 text-sm font-medium text-slate-300">
                <li>
                  <NavLink
                    to="/products"
                    className={({ isActive }) =>
                      cn(
                        'rounded-md px-3 py-2 transition',
                        isActive
                          ? 'bg-white/10 text-white shadow-card'
                          : 'hover:text-white',
                      )
                    }
                  >
                    Products
                  </NavLink>
                </li>
                {user && (
                  <li className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      {user.username}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      aria-label="Sign out"
                    >
                      Sign Out
                    </Button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </header>

        <main
          id="main-content"
          className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8"
        >
          <Outlet />
        </main>

        <footer className="border-t border-white/10 bg-surface-100/60">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {currentYear} Product Dashboard Assessment by Ozavizcodes
            </p>
            <p>Built with React, Vite, TanStack Query & Tailwind CSS</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

