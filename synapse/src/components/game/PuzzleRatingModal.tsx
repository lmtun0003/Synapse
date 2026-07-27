import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/store/gameStore'

interface PuzzleRatingModalProps {
  puzzleId: string
  puzzleTitle: string
  onDone: () => void
}

const LABELS = ['', 'Not great', 'Okay', 'Good', 'Great', 'Brilliant!']
const LABEL_COLORS = ['', 'text-red-400', 'text-amber-400/70', 'text-amber-400', 'text-green-400', 'text-blue-400']

export function PuzzleRatingModal({ puzzleId, puzzleTitle, onDone }: PuzzleRatingModalProps) {
  const { ratePuzzle, myRatings } = useGameStore()
  const existing = myRatings[puzzleId]

  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(existing?.stars ?? 0)
  const [comment, setComment] = useState(existing?.comment ?? '')
  const [submitted, setSubmitted] = useState(false)

  const display = hovered > 0 ? hovered : selected

  const handleSubmit = () => {
    if (selected === 0) return
    ratePuzzle(puzzleId, selected, comment.trim() || undefined)
    setSubmitted(true)
    setTimeout(onDone, 1200)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
      onClick={onDone}
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <GlassCard padding="none" rounded="3xl" className="overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-white/6 text-center">
            <div className="text-2xl mb-2">✦</div>
            <h2 className="text-white font-bold text-lg">Rate this Puzzle</h2>
            <p className="text-white/40 text-sm mt-0.5 truncate px-2">{puzzleTitle}</p>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="thanks"
                className="px-6 py-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className="text-5xl mb-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.1 }}
                >
                  ✓
                </motion.div>
                <div className="text-green-400 font-semibold text-lg">Thanks!</div>
                <div className="text-white/40 text-sm mt-1">Rating submitted.</div>
              </motion.div>
            ) : (
              <motion.div key="form" className="px-6 py-5">
                {/* Stars */}
                <div className="flex items-center justify-center gap-3 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const n = i + 1
                    const filled = n <= display
                    return (
                      <motion.button
                        key={n}
                        className={[
                          'transition-colors duration-100 focus:outline-none',
                          filled ? 'text-amber-400' : 'text-white/20',
                        ].join(' ')}
                        style={{ fontSize: 36 }}
                        onMouseEnter={() => setHovered(n)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setSelected(n)}
                        whileHover={{ scale: 1.18 }}
                        whileTap={{ scale: 0.88 }}
                      >
                        ★
                      </motion.button>
                    )
                  })}
                </div>

                {/* Label */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={display}
                    className={`text-center text-sm font-medium h-5 mb-4 ${LABEL_COLORS[display] ?? 'text-white/30'}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    {display > 0 ? LABELS[display] : 'Tap to rate'}
                  </motion.p>
                </AnimatePresence>

                {/* Optional comment */}
                <textarea
                  rows={2}
                  placeholder="Leave a comment (optional)…"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  maxLength={160}
                  className="w-full glass rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none resize-none border border-white/8 focus:border-white/20 transition-colors mb-4"
                />

                {/* Actions */}
                <div className="flex gap-2.5">
                  <Button
                    variant="ghost"
                    size="md"
                    className="flex-1"
                    onClick={onDone}
                  >
                    Skip
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1"
                    disabled={selected === 0}
                    onClick={handleSubmit}
                    glow={selected > 0}
                  >
                    Submit
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
