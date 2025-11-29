import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:gap-4 border-b border-white/10 pb-4 sm:pb-6 md:flex-row md:items-center md:justify-between',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="bg-gradient-to-r from-white via-white to-slate-300 bg-clip-text text-xl sm:text-2xl md:text-3xl font-bold text-transparent break-words">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 sm:mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-400">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap gap-2 sm:gap-3 shrink-0">{actions}</div>
      ) : null}
    </div>
  )
}

