import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { MECHANIC_INFO } from '@/data/mechanics'
import type { MechanicKind } from '@/engine/types'

interface MechanicIntroProps {
  mechanics: MechanicKind[]
  /** Optional chapter framing shown above the mechanic cards. */
  chapter?: { id: number; title: string; subtitle: string }
  /** Heading — defaults to a "new mechanic" framing. */
  title?: string
  variant?: 'intro' | 'legend'
  onClose: () => void
}

export function MechanicIntro({
  mechanics,
  chapter,
  title,
  variant = 'intro',
  onClose,
}: MechanicIntroProps) {
  if (mechanics.length === 0) return null
  const isNew = variant === 'intro'
  const heading = title ?? (mechanics.length > 1 ? 'New mechanics' : 'New mechanic')

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(11,11,13,0.6)] p-6 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        className="glass-strong w-full max-w-md rounded-[1.75rem] p-7"
        initial={{ y: 24, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {chapter && (
          <div className="mb-5 border-b border-[var(--color-border)] pb-4">
            <p className="text-xs uppercase tracking-[0.3em] text-faint">
              Chapter {chapter.id}
            </p>
            <h3 className="mt-1 text-2xl font-light tracking-tight">{chapter.title}</h3>
            <p className="mt-1 text-sm text-muted">{chapter.subtitle}</p>
          </div>
        )}

        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
          {isNew ? heading : 'How these nodes work'}
        </p>

        <div className="mt-4 space-y-3">
          {mechanics.map((kind) => {
            const info = MECHANIC_INFO[kind]
            return (
              <div key={kind} className="glass rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-sm font-medium text-[var(--color-accent)]">
                    {info.glyph}
                  </span>
                  <div>
                    <p className="font-medium">{info.name}</p>
                    <p className="text-xs text-muted">{info.tagline}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted">{info.howItWorks}</p>
                <p className="mt-2 text-sm">
                  <span className="text-faint">Effect: </span>
                  <span className="text-[var(--color-text)]">{info.effect}</span>
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-6">
          <Button fullWidth onClick={onClose}>
            {isNew ? 'Begin' : 'Got it'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
