import { useState } from 'react'
import { clsx } from 'clsx'
import { useGameStore } from '@/store/gameStore'
import { ACHIEVEMENTS, TIER_DEFS, getAchievementProgress } from '@/data/achievements'
import { AdminCard } from './AdminShared'

export function AchievementsEditor() {
  const { playerAchievements, updateAchievementProgress } = useGameStore()
  const [tierDrafts, setTierDrafts] = useState<Record<string, number[]>>(
    () => Object.fromEntries(TIER_DEFS.map((t, i) => [t.tier, [t.sparkReward]]))
  )

  const setProgress = (id: string, value: number) => {
    updateAchievementProgress(id, value)
  }

  const unlockTier = (id: string, tier: number) => {
    const ach = ACHIEVEMENTS.find(a => a.id === id)
    if (!ach) return
    const target = ach.tiers[tier - 1]?.target ?? 0
    updateAchievementProgress(id, target + 1)
  }

  const resetAchievement = (id: string) => {
    updateAchievementProgress(id, 0)
  }

  return (
    <div>
      {/* Tier reward overview */}
      <AdminCard title="Tier Spark Rewards" className="mb-5">
        <p className="text-white/40 text-xs mb-4">These are the Spark rewards given when a player reaches each tier. Edit them in the Config tab → Achievements section.</p>
        <div className="grid grid-cols-5 gap-2">
          {TIER_DEFS.map(t => (
            <div key={t.tier} className="text-center bg-white/3 rounded-xl p-2.5 border border-white/6">
              <div className="text-lg mb-0.5">{t.icon}</div>
              <div className="text-white/70 text-xs font-medium capitalize">{t.label}</div>
              <div className="text-amber-400 text-sm font-bold mt-1">+{t.sparkReward}✦</div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Achievement progress editor */}
      <div className="flex flex-col gap-3">
        {ACHIEVEMENTS.map(ach => {
          const prog = getAchievementProgress(ach, playerAchievements[ach.id])
          const currentTier = prog.currentTier

          return (
            <div key={ach.id} className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-2xl flex-shrink-0">{ach.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{ach.name}</span>
                    <span className={clsx(
                      'text-[10px] font-medium px-1.5 py-0.5 rounded-md border',
                      currentTier === 0 ? 'text-white/30 border-white/10 bg-white/3' :
                      currentTier >= 5 ? 'text-blue-400 border-blue-500/25 bg-blue-500/10' :
                      'text-amber-400 border-amber-500/25 bg-amber-500/10'
                    )}>
                      {currentTier === 0 ? 'Locked' : currentTier >= 5 ? '💎 Maxed' : `Tier ${currentTier}/5`}
                    </span>
                  </div>
                  <div className="text-white/35 text-xs capitalize">{ach.category} · {ach.description}</div>
                </div>
                <div className="flex items-center gap-1.5 text-white/40 text-xs">
                  <span>{prog.currentValue}</span>
                  <span>/</span>
                  <span>{prog.nextTarget}</span>
                </div>
              </div>

              {/* Tier buttons */}
              <div className="flex items-center gap-1.5 px-4 pb-3 flex-wrap">
                {ach.tiers.map((t, i) => {
                  const reached = currentTier > i
                  const next = currentTier === i
                  return (
                    <button
                      key={i}
                      onClick={() => reached ? resetAchievement(ach.id) : unlockTier(ach.id, i + 1)}
                      title={reached ? 'Click to reset to this tier' : `Unlock Tier ${i + 1}: ${t.description}`}
                      className={clsx(
                        'px-2.5 py-1 rounded-lg text-[11px] transition-all border',
                        reached
                          ? 'bg-blue-500/15 border-blue-500/30 text-blue-400 hover:bg-red-500/10 hover:border-red-500/25 hover:text-red-400'
                          : next
                          ? 'bg-white/6 border-white/15 text-white/60 hover:bg-green-500/10 hover:border-green-500/25 hover:text-green-400'
                          : 'bg-white/2 border-white/6 text-white/20'
                      )}
                    >
                      {TIER_DEFS[i].icon} T{i + 1}
                    </button>
                  )
                })}
                <button
                  onClick={() => resetAchievement(ach.id)}
                  className="px-2 py-1 rounded-lg text-[11px] text-red-400/50 hover:text-red-400 border border-red-500/10 hover:border-red-500/25 hover:bg-red-500/8 transition-all ml-auto"
                >
                  Reset
                </button>
              </div>

              {/* Manual progress input */}
              <div className="px-4 pb-3 flex items-center gap-2">
                <span className="text-white/30 text-xs">Set progress:</span>
                <input
                  type="number"
                  value={prog.currentValue}
                  min={0}
                  onChange={e => setProgress(ach.id, Number(e.target.value))}
                  className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-blue-500/40"
                />
                <span className="text-white/20 text-xs">/ {ach.tiers[ach.tiers.length - 1].target}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
