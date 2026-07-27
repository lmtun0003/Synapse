import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { RatingBadge } from '@/components/ui/Badge'
import type { RatingTier } from '@/engine/types'

interface WinOverlayProps {
  rating: RatingTier
  moves: number
  parPerfect: number
  onNext?: () => void
  onRetry: () => void
  onExit: () => void
  showNext?: boolean
}

export function WinOverlay({
  rating,
  moves,
  parPerfect,
  onNext,
  onRetry,
  onExit,
  showNext = true,
}: WinOverlayProps) {
  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center bg-[rgba(11,11,13,0.55)] p-6 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="glass-strong w-full max-w-sm rounded-[1.75rem] p-8 text-center"
        initial={{ y: 24, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-muted">Signal Complete</p>
        <h2 className="mt-3 text-3xl font-light tracking-tight">Aligned</h2>
        <div className="mt-5 flex justify-center">
          <RatingBadge rating={rating} />
        </div>
        <p className="mt-5 text-sm text-muted">
          {moves} move{moves === 1 ? '' : 's'}
          <span className="text-faint"> · </span>
          Perfect at {parPerfect}
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {showNext && onNext && (
            <Button fullWidth onClick={onNext}>
              Continue
            </Button>
          )}
          <Button fullWidth variant="secondary" onClick={onRetry}>
            Refine
          </Button>
          <Button fullWidth variant="ghost" onClick={onExit}>
            Exit
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
