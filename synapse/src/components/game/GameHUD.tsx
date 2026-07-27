import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import type { Puzzle, RatingTier } from '@/types/game'
import { useGameStore } from '@/store/gameStore'

interface GameHUDProps {
  puzzle: Puzzle
  onBack: () => void
  onReset: () => void
  onUndo: () => void
  onHint?: () => void
}

const RATING_THRESHOLDS = (puzzle: Puzzle) => [
  { label: '⚡ Perfect', moves: puzzle.targetMoves.perfect, color: 'text-blue-400' },
  { label: '🥇 Gold',   moves: puzzle.targetMoves.gold,    color: 'text-amber-400' },
  { label: '🥈 Silver', moves: puzzle.targetMoves.silver,  color: 'text-slate-300' },
  { label: '🥉 Bronze', moves: puzzle.targetMoves.bronze,  color: 'text-orange-400' },
]

function getRatingColor(rating: RatingTier): string {
  switch (rating) {
    case 'perfect': return 'text-blue-400'
    case 'gold': return 'text-amber-400'
    case 'silver': return 'text-slate-300'
    case 'bronze': return 'text-orange-400'
    default: return 'text-white/40'
  }
}

export function GameHUD({ puzzle, onBack, onReset, onUndo, onHint }: GameHUDProps) {
  const { moveCount, completed, rating, moveHistory } = useGameStore()
  const thresholds = RATING_THRESHOLDS(puzzle)

  // Determine current rating based on moves
  const currentRating: RatingTier =
    moveCount === 0 ? 'none' :
    moveCount <= puzzle.targetMoves.perfect ? 'perfect' :
    moveCount <= puzzle.targetMoves.gold ? 'gold' :
    moveCount <= puzzle.targetMoves.silver ? 'silver' :
    moveCount <= puzzle.targetMoves.bronze ? 'bronze' : 'none'

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium px-2 py-1 rounded-lg hover:bg-white/5"
        >
          ← Back
        </button>

        <div className="text-center">
          <div className="text-white/40 text-xs font-medium tracking-wider uppercase">
            {puzzle.title}
          </div>
        </div>

        <button
          onClick={onReset}
          className="text-white/50 hover:text-white transition-colors text-sm font-medium px-2 py-1 rounded-lg hover:bg-white/5"
        >
          Reset
        </button>
      </div>

      {/* Move counter + rating display */}
      <div className="flex items-center justify-between gap-3">
        {/* Moves */}
        <motion.div
          className="glass rounded-xl px-4 py-2.5 flex items-center gap-3"
          layout
        >
          <div>
            <div className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Moves</div>
            <motion.div
              key={moveCount}
              className="text-2xl font-bold text-white tabular-nums"
              initial={{ scale: 1.3, color: '#3B82F6' }}
              animate={{ scale: 1, color: '#FFFFFF' }}
              transition={{ duration: 0.3 }}
            >
              {moveCount}
            </motion.div>
          </div>
          {currentRating !== 'none' && (
            <motion.div
              key={currentRating}
              className={clsx('text-sm font-semibold', getRatingColor(currentRating))}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {currentRating === 'perfect' ? '⚡' : currentRating === 'gold' ? '🥇' : currentRating === 'silver' ? '🥈' : '🥉'}
            </motion.div>
          )}
        </motion.div>

        {/* Rating targets */}
        <div className="flex items-center gap-2">
          {thresholds.map(t => (
            <div
              key={t.label}
              className={clsx(
                'text-center px-2.5 py-1.5 rounded-lg transition-all duration-200',
                moveCount > 0 && moveCount <= t.moves
                  ? 'bg-white/10 ' + t.color
                  : 'text-white/25'
              )}
            >
              <div className="text-[10px] font-medium">{t.moves}</div>
              <div className="text-[9px] opacity-70">{t.label.split(' ')[0]}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onUndo}
            disabled={moveHistory.length === 0}
            className="glass rounded-xl px-3 py-2.5 text-white/60 hover:text-white disabled:opacity-30 transition-colors text-sm"
            title="Undo (Ctrl+Z)"
          >
            ↩
          </button>
          {onHint && (
            <button
              onClick={onHint}
              className="glass rounded-xl px-3 py-2.5 text-white/60 hover:text-amber-400 transition-colors text-sm"
              title="Hint"
            >
              💡
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
