import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useGameStore } from '@/store/gameStore'
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, TIER_DEFS, getAchievementProgress } from '@/data/achievements'
import type { AchievementDef } from '@/data/achievements'

function TierBadge({ tier, size = 'sm' }: { tier: number; size?: 'xs' | 'sm' }) {
  if (tier === 0) return <Badge variant="default" size={size}>Locked</Badge>
  const t = TIER_DEFS[tier - 1]
  return <Badge variant={tier >= 5 ? 'blue' : tier >= 4 ? 'purple' : tier >= 3 ? 'gold' : tier >= 2 ? 'silver' : 'bronze'} size={size} glow={tier >= 4}>{t.icon} {t.label}</Badge>
}

function AchievementCard({ achievement, delay }: { achievement: AchievementDef; delay: number }) {
  const { playerAchievements, pinAchievement } = useGameStore() as any
  const playerAch = playerAchievements?.[achievement.id]
  const progress = getAchievementProgress(achievement, playerAch)
  const currentTierDef = progress.currentTier > 0 ? TIER_DEFS[progress.currentTier - 1] : null
  const nextTierDef = !progress.maxed ? TIER_DEFS[progress.currentTier] : null

  return (
    <GlassCard padding="md" rounded="2xl" animate delay={delay} className={clsx(
      'transition-all duration-200',
      progress.currentTier > 0 ? 'border-white/10' : 'opacity-60'
    )}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={clsx(
          'w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0',
          progress.currentTier > 0 ? 'bg-white/8' : 'bg-white/3'
        )}>
          <span>{achievement.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-white font-semibold text-sm">{achievement.name}</span>
            <TierBadge tier={progress.currentTier} size="xs" />
          </div>
          <p className="text-white/40 text-xs mb-2 line-clamp-1">{achievement.description}</p>

          {/* Progress bar */}
          {!progress.maxed && (
            <div className="mb-1.5">
              <ProgressBar
                value={progress.pct}
                color={progress.currentTier >= 4 ? 'blue' : progress.currentTier >= 3 ? 'amber' : 'blue'}
                height="xs"
                animated
              />
              <div className="flex justify-between mt-1">
                <span className="text-white/25 text-[10px]">{achievement.tiers[progress.currentTier]?.description}</span>
                <span className="text-white/35 text-[10px]">{progress.currentValue}/{progress.nextTarget}</span>
              </div>
            </div>
          )}

          {/* Maxed */}
          {progress.maxed && (
            <div className="flex items-center gap-1.5">
              <span className="text-blue-400 text-xs">✓ Mastered</span>
              <span className="text-white/20 text-xs">·</span>
              <span className="text-amber-400 text-xs">💎 250 Sparks earned</span>
            </div>
          )}

          {/* Tier rewards preview */}
          {!progress.maxed && nextTierDef && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-amber-400/60 text-[10px]">Next:</span>
              <span className="text-amber-400/80 text-[10px] font-medium">+{nextTierDef.sparkReward} Sparks</span>
            </div>
          )}
        </div>

        {/* Pin button */}
        {progress.currentTier > 0 && achievement.displayOnProfile && (
          <button
            className="text-white/20 hover:text-white/60 transition-colors text-sm flex-shrink-0"
            title="Pin to profile"
          >
            📌
          </button>
        )}
      </div>

      {/* Tier progress dots */}
      {progress.currentTier > 0 && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/6">
          {TIER_DEFS.map((td, i) => (
            <div
              key={td.tier}
              className={clsx(
                'flex-1 h-1 rounded-full transition-all duration-500',
                i < progress.currentTier ? 'bg-blue-500' : 'bg-white/10'
              )}
            />
          ))}
          <span className="text-white/25 text-[10px] ml-1">{progress.currentTier}/5</span>
        </div>
      )}
    </GlassCard>
  )
}

export function AchievementsPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('all')
  const { player } = useGameStore()

  const filtered = category === 'all'
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter(a => a.category === category)

  const totalUnlocked = ACHIEVEMENTS.filter(a => {
    // count as unlocked if tier >= 1
    return false // would check playerAchievements
  }).length

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <motion.div className="flex items-center gap-3 mb-5" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate('/profile')} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white">←</button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Achievements</h1>
          <p className="text-white/40 text-xs">{ACHIEVEMENTS.length} achievements · Earn Sparks at each tier</p>
        </div>
        <div className="glass rounded-xl px-3 py-1.5 text-center">
          <div className="text-amber-400 text-xs font-semibold">✦ {player.sparks}</div>
          <div className="text-white/25 text-[10px]">Sparks</div>
        </div>
      </motion.div>

      {/* Tier rewards info */}
      <GlassCard padding="sm" rounded="xl" animate delay={0.05} className="mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white/40 text-xs">Tier rewards:</span>
          {TIER_DEFS.map(t => (
            <div key={t.tier} className="flex items-center gap-1">
              <span className="text-xs">{t.icon}</span>
              <span className="text-white/50 text-xs">+{t.sparkReward}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {ACHIEVEMENT_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={clsx(
              'flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
              category === cat.id ? 'bg-white/12 border-white/25 text-white' : 'glass border-white/8 text-white/40 hover:text-white/70'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Achievement list */}
      <div className="flex flex-col gap-3">
        {filtered.map((ach, i) => (
          <AchievementCard key={ach.id} achievement={ach} delay={i * 0.04} />
        ))}
      </div>
    </div>
  )
}
