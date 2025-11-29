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
        <header className="border-b border-white/10 bg-gradient-to-r from-surface-100/60 via-surface-100/40 to-surface-100/60 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-3 py-3 sm:px-4 sm:py-4">
            <NavLink
              to="/products"
              className="flex items-center gap-2 sm:gap-3 transition-opacity hover:opacity-80"
            >
              <span className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 text-base sm:text-lg font-bold text-white shadow-lg shadow-brand-500/30">
                PD
              </span>
              <div className="hidden sm:block">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
                  Product Dashboard
                </p>
              </div>
            </NavLink>
            <nav aria-label="Primary navigation">
              <ul className="flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-medium">
                <li>
                  <NavLink
                    to="/products"
                    className={({ isActive }) =>
                      cn(
                        'rounded-lg px-2 py-1.5 sm:px-4 sm:py-2 transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-r from-brand-600/20 to-brand-500/20 text-white shadow-lg shadow-brand-500/20 border border-brand-500/30'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white',
                      )
                    }
                  >
                    Products
                  </NavLink>
                </li>
                {user && (
                  <li className="flex items-center gap-1.5 sm:gap-3 border-l border-white/10 pl-1.5 sm:pl-3">
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-xs font-semibold text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-slate-300">
                        {user.username}
                      </span>
                    </div>
                    <div className="sm:hidden">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-xs font-semibold text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      aria-label="Sign out"
                      className="ml-1 sm:ml-2 text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <span className="hidden sm:inline">Sign Out</span>
                      <span className="sm:hidden">Out</span>
                    </Button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </header>

        <main
          id="main-content"
          className="mx-auto w-full max-w-6xl flex-1 px-3 py-6 sm:px-4 sm:py-8 md:px-6 lg:px-8"
        >
          <Outlet />
        </main>

        <footer className="border-t border-white/10 bg-surface-100/60">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {currentYear} Product Dashboard by Ozavizcodes
            </p>
            <p>Built with React, Vite, TanStack Query & Tailwind CSS</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

