import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error'

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-white border border-white/20',
  success: 'bg-accent-success/20 text-accent-success border border-accent-success/30',
  warning: 'bg-accent-warning/20 text-accent-warning border border-accent-warning/30',
  error: 'bg-accent-error/20 text-accent-error border border-accent-error/30',
}

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  )
}

