import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type SpinnerProps = HTMLAttributes<HTMLDivElement> & {
  label?: string
}

export function Spinner({ label = 'Loading', className, ...props }: SpinnerProps) {
  return (
    <div className={cn('flex items-center gap-3 text-sm text-slate-300', className)} {...props}>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      <span>{label}</span>
    </div>
  )
}

