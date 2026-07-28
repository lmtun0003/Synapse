import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { getNodeGuide } from '@/data/nodeGuides'
import type { NodeType } from '@/types/game'

interface NodeIntroModalProps {
  nodeType: NodeType
  worldName: string
  onDismiss: () => void
}

export function NodeIntroModal({ nodeType, worldName, onDismiss }: NodeIntroModalProps) {
  const guide = getNodeGuide(nodeType)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
      onClick={onDismiss}
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <GlassCard padding="none" rounded="3xl" className="overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b border-white/6"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.05) 100%)' }}
          >
            {/* World badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-white/30 text-xs uppercase tracking-widest">New Node Unlocked</span>
              <span className="text-white/20 text-xs">·</span>
              <span className="text-blue-400 text-xs font-medium">{worldName}</span>
            </div>

            {/* Icon + name */}
            <div className="flex items-center gap-4">
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.1 }}
              >
                <span className={guide.color}>{guide.icon}</span>
              </motion.div>
              <div>
                <motion.h2
                  className="text-white font-bold text-xl leading-tight"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {guide.name}
                </motion.h2>
                <motion.p
                  className="text-white/45 text-sm mt-0.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {guide.tagline}
                </motion.p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* How it works */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="text-white/40 text-[11px] uppercase tracking-wider mb-1.5">How it works</div>
              <p className="text-white/75 text-sm leading-relaxed">{guide.howItWorks}</p>
            </motion.div>

            {/* Example */}
            <motion.div
              className="px-3.5 py-3 rounded-xl border border-white/6 bg-white/3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
            >
              <div className="text-white/30 text-[11px] uppercase tracking-wider mb-1">Example</div>
              <p className="text-white/60 text-xs font-mono leading-relaxed">{guide.example}</p>
            </motion.div>

            {/* Tip */}
            <motion.div
              className="flex items-start gap-3 px-3.5 py-3 rounded-xl bg-amber-500/5 border border-amber-500/15"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
            >
              <span className="text-amber-400 text-sm flex-shrink-0 mt-0.5">💡</span>
              <p className="text-amber-300/80 text-xs leading-relaxed">{guide.tip}</p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44 }}
            >
              <Button variant="primary" size="lg" className="w-full" onClick={onDismiss} glow>
                Got it — Let's go
              </Button>
            </motion.div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}


// ─── Chapter Start Banner ─────────────────────────────────────────────────────
// Shows briefly at the start of each new world.

interface ChapterBannerProps {
  worldNumber: number
  worldName: string
  mechanic: string
  worldColor: string
  onDismiss: () => void
}

export function ChapterBanner({ worldNumber, worldName, mechanic, worldColor, onDismiss }: ChapterBannerProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
      onClick={onDismiss}
    >
      <motion.div
        className="text-center px-8"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.05, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      >
        {/* Chapter label */}
        <motion.div
          className="text-white/30 text-xs uppercase tracking-[0.3em] mb-4"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Chapter {worldNumber}
        </motion.div>

        {/* World name */}
        <motion.h1
          className="text-5xl font-bold tracking-tight mb-3"
          style={{ color: worldColor, textShadow: `0 0 60px ${worldColor}80` }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          {worldName}
        </motion.h1>

        {/* New mechanic */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
        >
          <div className="h-px w-12 bg-white/15" />
          <span className="text-white/50 text-sm">Introduces</span>
          <span className="text-white font-semibold text-sm">{mechanic}</span>
          <div className="h-px w-12 bg-white/15" />
        </motion.div>

        {/* Tap hint */}
        <motion.p
          className="text-white/20 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          Tap anywhere to begin
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
