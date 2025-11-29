import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-card backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.05]',
        className,
      )}
      {...props}
    />
  )
}

