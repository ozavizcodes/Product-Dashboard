import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md'

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/25 hover:from-brand-500 hover:to-brand-400 focus-visible:ring-brand-400/50 transition-all duration-200',
  secondary:
    'bg-white/10 text-white border border-white/20 shadow-lg hover:bg-white/20 hover:border-white/30 focus-visible:ring-white/40 transition-all duration-200',
  ghost:
    'text-slate-300 hover:bg-white/10 hover:text-white focus-visible:ring-white/30 focus-visible:text-white transition-all duration-200',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      asChild = false,
      type,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = Boolean(disabled || isLoading)

    if (asChild) {
      
      return (
        <Slot
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-50 disabled:cursor-not-allowed disabled:opacity-60',
            variantStyles[variant],
            sizeStyles[size],
            className,
          )}
          aria-disabled={isDisabled || undefined}
          data-disabled={isDisabled ? '' : undefined}
          {...rest}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-50 disabled:cursor-not-allowed disabled:opacity-60',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={isDisabled}
        type={type ?? 'button'}
        aria-disabled={isDisabled || undefined}
        data-disabled={isDisabled ? '' : undefined}
        {...rest}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
        ) : null}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

