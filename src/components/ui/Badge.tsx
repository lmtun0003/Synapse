import clsx from 'clsx'
import type { RatingTier } from '@/engine/types'

const ratingStyles: Record<RatingTier, string> = {
  none: 'bg-[var(--color-surface)] text-[var(--color-text-muted)]',
  bronze: 'bg-[rgba(205,127,50,0.18)] text-[#d4a574]',
  silver: 'bg-[rgba(192,192,192,0.16)] text-[#c8c8d0]',
  gold: 'bg-[rgba(251,191,36,0.16)] text-[var(--color-warning)]',
  perfect: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]',
}

export function RatingBadge({ rating }: { rating: RatingTier }) {
  if (rating === 'none') return null
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]',
        ratingStyles[rating],
      )}
    >
      {rating}
    </span>
  )
}

export function Pill({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs text-[var(--color-text-muted)]',
        className,
      )}
    >
      {children}
    </span>
  )
}
