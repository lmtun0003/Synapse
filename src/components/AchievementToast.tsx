import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePlayerStore } from '@/stores/playerStore'
import { getAchievement } from '@/data/achievements'

/** Floating notifications for newly earned achievement tiers. */
export function AchievementToast() {
  const recentUnlocks = usePlayerStore((s) => s.recentUnlocks)
  const dismissUnlock = usePlayerStore((s) => s.dismissUnlock)

  useEffect(() => {
    if (recentUnlocks.length === 0) return
    const timers = recentUnlocks.map((u) =>
      window.setTimeout(() => dismissUnlock(`${u.id}-${u.tier}`), 5000),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [recentUnlocks, dismissUnlock])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {recentUnlocks.map((u) => {
          const ach = getAchievement(u.id)
          return (
            <motion.button
              type="button"
              key={`${u.id}-${u.tier}`}
              onClick={() => dismissUnlock(`${u.id}-${u.tier}`)}
              className="glass-strong pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl px-4 py-3 text-left"
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-lg text-[var(--color-accent)]">
                {ach?.icon ?? '✦'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  {u.tierName} tier unlocked
                </p>
                <p className="truncate text-sm font-medium">{u.title}</p>
              </div>
              <span className="shrink-0 text-sm text-[var(--color-accent)]">
                +{u.sparks} ✦
              </span>
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
