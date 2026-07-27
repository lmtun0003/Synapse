import { motion, AnimatePresence } from 'framer-motion'
import type { LevelResult, Puzzle } from '@/types/game'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/store/gameStore'

interface LevelCompleteModalProps {
  result: LevelResult
  puzzle: Puzzle
  onNextLevel: () => void
  onRetry: () => void
  onMenu: () => void
}

const RATING_CONFIG = {
  perfect: {
    title: 'PERFECT',
    subtitle: 'Flawless execution.',
    color: 'text-blue-400',
    glow: 'shadow-[0_0_60px_rgba(59,130,246,0.3)]',
    icon: '⚡',
    bg: 'from-blue-500/10 to-purple-500/5',
  },
  gold: {
    title: 'GOLD',
    subtitle: 'Excellent performance.',
    color: 'text-amber-400',
    glow: 'shadow-[0_0_60px_rgba(245,158,11,0.3)]',
    icon: '🥇',
    bg: 'from-amber-500/10 to-yellow-500/5',
  },
  silver: {
    title: 'SILVER',
    subtitle: 'Well played.',
    color: 'text-slate-300',
    glow: 'shadow-[0_0_40px_rgba(148,163,184,0.2)]',
    icon: '🥈',
    bg: 'from-slate-400/10 to-slate-500/5',
  },
  bronze: {
    title: 'BRONZE',
    subtitle: 'Keep practising.',
    color: 'text-orange-400',
    glow: 'shadow-[0_0_40px_rgba(205,127,50,0.2)]',
    icon: '🥉',
    bg: 'from-orange-700/10 to-orange-800/5',
  },
  none: {
    title: 'COMPLETE',
    subtitle: 'Puzzle solved!',
    color: 'text-white/60',
    glow: '',
    icon: '✓',
    bg: 'from-white/5 to-white/2',
  },
}

function StarDisplay({ stars }: { stars: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className={i < stars ? 'text-amber-400' : 'text-white/15'}
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 15,
            delay: 0.3 + i * 0.1,
          }}
          style={{ fontSize: i === 0 || i === 3 ? 24 : 32 }}
        >
          ★
        </motion.div>
      ))}
    </div>
  )
}

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  if (m > 0) return `${m}m ${s % 60}s`
  return `${s}s`
}

export function LevelCompleteModal({ result, puzzle, onNextLevel, onRetry, onMenu }: LevelCompleteModalProps) {
  const config = RATING_CONFIG[result.rating]
  const { player } = useGameStore()

  const xpGained = result.rating === 'perfect' ? 100 : result.rating === 'gold' ? 60 : result.rating === 'silver' ? 35 : 15
  const sparksGained = result.rating === 'perfect' ? 25 : result.rating === 'gold' ? 15 : result.rating === 'silver' ? 8 : 3

  return (
    <motion.div
      className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onMenu}
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ y: 80, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.05 }}
        onClick={e => e.stopPropagation()}
      >
        <GlassCard
          rounded="3xl"
          padding="none"
          className={`overflow-hidden ${config.glow}`}
        >
          {/* Header gradient */}
          <div className={`bg-gradient-to-br ${config.bg} px-6 pt-8 pb-4 text-center border-b border-white/6`}>
            {/* Icon */}
            <motion.div
              className="text-5xl mb-3"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 15, delay: 0.15 }}
            >
              {config.icon}
            </motion.div>

            {/* Stars */}
            <StarDisplay stars={result.stars} />

            {/* Title */}
            <motion.h2
              className={`text-2xl font-bold tracking-widest mt-3 ${config.color}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {config.title}
            </motion.h2>
            <motion.p
              className="text-white/40 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {config.subtitle}
            </motion.p>
          </div>

          {/* Stats */}
          <div className="px-6 py-5">
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Moves', value: result.moveCount },
                { label: 'Target', value: puzzle.targetMoves[result.rating === 'none' ? 'bronze' : result.rating] },
                { label: 'Time', value: formatTime(result.timeMs) },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center glass rounded-xl py-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                >
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-[11px] text-white/40 mt-0.5">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Rewards */}
            <motion.div
              className="flex items-center justify-center gap-4 py-3 px-4 bg-white/4 rounded-xl mb-5 border border-white/6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 text-sm">⚡</span>
                <span className="text-white text-sm font-semibold">+{xpGained} XP</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <span className="text-blue-400 text-sm">✦</span>
                <span className="text-white text-sm font-semibold">+{sparksGained} Sparks</span>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="flex flex-col gap-2.5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <Button variant="primary" size="lg" className="w-full" onClick={onNextLevel} glow>
                Next Level →
              </Button>
              <div className="flex gap-2.5">
                <Button variant="secondary" size="md" className="flex-1" onClick={onRetry}>
                  Retry
                </Button>
                <Button variant="ghost" size="md" className="flex-1" onClick={onMenu}>
                  Menu
                </Button>
              </div>
            </motion.div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
