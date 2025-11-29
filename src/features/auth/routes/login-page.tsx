import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/use-auth'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { PageHeader } from '@/shared/layout/page-header'

export function LoginPage() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      await login(username, password)
      navigate('/products', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    }
  }

  return (
    <section className="mx-auto max-w-md space-y-8">
      <PageHeader
        title="Sign In"
        description="Enter your credentials to access the product dashboard."
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100"
              role="alert"
            >
              <p className="font-semibold">Login failed</p>
              <p className="mt-1 text-red-200">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <label className="block text-sm">
              <span className="mb-2 block font-semibold text-slate-200">
                Username
              </span>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                aria-label="Username"
                required
                autoComplete="username"
                disabled={isLoading}
                autoFocus
              />
            </label>

            <label className="block text-sm">
              <span className="mb-2 block font-semibold text-slate-200">
                Password
              </span>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                aria-label="Password"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
            </label>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </div>

          <p className="text-center text-xs text-slate-400">
            For this assessment, any non-empty credentials will work.
          </p>
        </form>
      </Card>
    </section>
  )
}

