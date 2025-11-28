import { Button } from '@/shared/ui/button'

type PaginationProps = {
  page: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
}: PaginationProps) {
  const canGoPrev = page > 1
  const canGoNext = page < totalPages
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-300 sm:flex-row">
      <p>
        Showing <span className="font-semibold text-white">{start}</span>-
        <span className="font-semibold text-white">{end}</span> of{' '}
        <span className="font-semibold text-white">{totalItems}</span> products
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={!canGoPrev}
        >
          Previous
        </Button>
        <span className="text-xs uppercase tracking-wide text-slate-400">
          Page{' '}
          <span className="font-semibold text-white">
            {totalPages === 0 ? 0 : page}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-white">{totalPages}</span>
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={!canGoNext}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

