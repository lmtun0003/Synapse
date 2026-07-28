import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { PlayerAvatar } from '@/components/ui/PlayerAvatar'
import { PrismBadge } from '@/components/ui/PrismIcon'
import { useGameStore } from '@/store/gameStore'
import { AVATARS, BORDERS, RARITY_CONFIG } from '@/data/avatars'
import { ACHIEVEMENTS, TIER_DEFS, getAchievementProgress } from '@/data/achievements'

const RANK_CONFIG = {
  bronze:      { icon: '🟤', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  silver:      { icon: '⚪', color: 'text-slate-300',  bg: 'bg-slate-400/10' },
  gold:        { icon: '🟡', color: 'text-amber-400',  bg: 'bg-amber-500/10' },
  platinum:    { icon: '💠', color: 'text-cyan-300',   bg: 'bg-cyan-500/10' },
  diamond:     { icon: '💎', color: 'text-blue-300',   bg: 'bg-blue-500/10' },
  master:      { icon: '🔮', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  grandmaster: { icon: '👑', color: 'text-red-400',    bg: 'bg-red-500/10' },
  synapse:     { icon: '⚡', color: 'text-blue-400',   bg: 'bg-blue-500/10' },
}

function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.35, level - 1))
}
function getXPProgress(xp: number, level: number) {
  let spent = 0
  for (let l = 1; l < level; l++) spent += xpForLevel(l)
  return { current: xp - spent, needed: xpForLevel(level) }
}

// ─── Avatar Picker Modal ──────────────────────────────────────────────────────

function AvatarPickerModal({ onClose }: { onClose: () => void }) {
  const { avatarId, borderId, unlockedAvatars, setAvatar } = useGameStore()

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <GlassCard padding="none" rounded="3xl" className="overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/6">
            <h2 className="text-white font-bold">Choose Avatar</h2>
            <button onClick={onClose} className="text-white/30 hover:text-white transition-colors text-lg">✕</button>
          </div>
          <div className="p-5 grid grid-cols-5 gap-3">
            {AVATARS.map(av => {
              const unlocked = unlockedAvatars.includes(av.id)
              const selected = av.id === avatarId
              return (
                <motion.button
                  key={av.id}
                  onClick={() => unlocked && setAvatar(av.id)}
                  className={clsx(
                    'relative flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all',
                    selected ? 'bg-blue-500/15 border-blue-500/40' : unlocked ? 'glass border-white/10 hover:bg-white/8' : 'border-white/5 opacity-40 cursor-not-allowed'
                  )}
                  whileHover={unlocked ? { scale: 1.06 } : {}}
                  whileTap={unlocked ? { scale: 0.93 } : {}}
                >
                  <PlayerAvatar avatarId={av.id} borderId="none" size={44} displayName={av.name} />
                  <span className="text-white/60 text-[9px] text-center leading-tight truncate w-full">{av.name}</span>
                  {!unlocked && <span className="absolute top-1 right-1 text-[10px]">🔒</span>}
                  {selected && <span className="absolute top-1 right-1 text-blue-400 text-[10px]">✓</span>}
                </motion.button>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

// ─── Border Picker Modal ──────────────────────────────────────────────────────

function BorderPickerModal({ onClose }: { onClose: () => void }) {
  const { avatarId, borderId, unlockedBorders, setBorder } = useGameStore()

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <GlassCard padding="none" rounded="3xl" className="overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/6">
            <h2 className="text-white font-bold">Choose Border</h2>
            <button onClick={onClose} className="text-white/30 hover:text-white transition-colors text-lg">✕</button>
          </div>
          <div className="p-5 flex flex-col gap-2.5 max-h-96 overflow-y-auto">
            {BORDERS.map(b => {
              const unlocked = unlockedBorders.includes(b.id)
              const selected = b.id === borderId
              const rc = RARITY_CONFIG[b.rarity]
              return (
                <motion.button
                  key={b.id}
                  onClick={() => unlocked && setBorder(b.id)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all',
                    selected ? 'bg-blue-500/12 border-blue-500/35' : unlocked ? 'glass border-white/8 hover:bg-white/7' : 'border-white/4 opacity-40 cursor-not-allowed'
                  )}
                  whileHover={unlocked ? { scale: 1.01 } : {}}
                >
                  <PlayerAvatar avatarId={avatarId} borderId={unlocked ? b.id : 'none'} size={40} displayName="preview" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium">{b.name}</span>
                      <span className={clsx('text-[10px] font-medium', rc.color)}>{rc.label}</span>
                    </div>
                    <span className="text-white/35 text-xs">{b.description}</span>
                    {!unlocked && <div className="text-white/30 text-xs mt-0.5">🔒 {b.unlockCondition}</div>}
                  </div>
                  {selected && <span className="text-blue-400 text-sm flex-shrink-0">✓</span>}
                </motion.button>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

// ─── Pinned Achievement ───────────────────────────────────────────────────────

function PinnedAchievement({ id }: { id: string }) {
  const { playerAchievements } = useGameStore()
  const ach = ACHIEVEMENTS.find(a => a.id === id)
  if (!ach) return null
  const progress = getAchievementProgress(ach, playerAchievements[id])
  const tierDef = progress.currentTier > 0 ? TIER_DEFS[progress.currentTier - 1] : null

  return (
    <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
      <span className="text-base">{ach.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-white text-xs font-semibold truncate">{ach.name}</div>
        {tierDef && <div className={clsx('text-[10px]', progress.currentTier >= 4 ? 'text-blue-400' : 'text-white/40')}>{tierDef.icon} {tierDef.label}</div>}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ProfilePage() {
  const navigate = useNavigate()
  const { player, avatarId, borderId, pinnedAchievements, playerAchievements } = useGameStore()
  const [tab, setTab] = useState<'stats' | 'achievements' | 'history'>('stats')
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [showBorderPicker, setShowBorderPicker] = useState(false)

  const rank = RANK_CONFIG[player.rank]
  const { current, needed } = getXPProgress(player.xp, player.level)
  const winRate = player.stats.rankedWins + player.stats.rankedLosses > 0
    ? Math.round((player.stats.rankedWins / (player.stats.rankedWins + player.stats.rankedLosses)) * 100) : 0
  const avgMoves = player.stats.totalSolved > 0
    ? Math.round(player.stats.totalMoves / player.stats.totalSolved) : 0

  // How many achievements have any tier
  const unlockedCount = Object.values(playerAchievements).filter(a => a.currentTier > 0).length

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <motion.div className="flex items-center gap-3 mb-5" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate('/')} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white">←</button>
        <h1 className="text-xl font-bold text-white">Profile</h1>
      </motion.div>

      {/* Player identity card */}
      <GlassCard padding="lg" rounded="2xl" animate delay={0.05} className="mb-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 90% 10%, rgba(59,130,246,0.3) 0%, transparent 60%)' }} />
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            {/* Avatar — tap to change */}
            <div className="relative flex-shrink-0">
              <motion.button
                onClick={() => setShowAvatarPicker(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative"
              >
                <PlayerAvatar avatarId={avatarId} borderId={borderId} size={68} displayName={player.displayName} animate />
                {/* Edit badge */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-[#0B0B0D]">
                  <span className="text-white text-[10px]">✏️</span>
                </div>
              </motion.button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-white text-lg font-bold">{player.displayName}</h2>
                <Badge variant="blue" size="xs">Lv.{player.level}</Badge>
              </div>
              <div className={clsx('flex items-center gap-1.5 text-sm font-semibold mt-0.5', rank.color)}>
                {rank.icon} {player.rank.charAt(0).toUpperCase() + player.rank.slice(1)}
                <span className="text-white/25">·</span>
                <span className="text-white/40 text-xs font-normal">{player.elo} Elo</span>
              </div>
              {/* Border button */}
              <button
                onClick={() => setShowBorderPicker(true)}
                className="mt-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors border border-white/10 hover:border-white/20 px-2 py-0.5 rounded-lg"
              >
                Border: {BORDERS.find(b => b.id === borderId)?.name ?? 'None'} ›
              </button>
            </div>

            <div className="text-right flex-shrink-0 flex flex-col gap-1">
              <div className="text-amber-400 text-sm font-bold">✦ {player.sparks.toLocaleString()}</div>
              <PrismBadge count={player.prisms} size="xs" showButton onBuy={() => navigate('/prisms')} />
            </div>
          </div>

          {/* XP */}
          <ProgressBar value={current} max={needed} color="gradient" height="md" glow animated label={`${current} / ${needed} XP → Lv.${player.level + 1}`} />

          {/* Streaks */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: '🔥', label: 'Daily', value: player.streaks.daily },
              { icon: '⚡', label: 'Win', value: player.streaks.win },
              { icon: '🎯', label: 'Perfect', value: player.streaks.perfect },
            ].map(s => (
              <div key={s.label} className="glass rounded-xl p-2.5 text-center">
                <div className="text-lg">{s.icon}</div>
                <div className="text-white font-bold">{s.value}</div>
                <div className="text-white/30 text-[10px]">{s.label} Streak</div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Pinned achievements */}
      {pinnedAchievements.length > 0 && (
        <motion.div className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <div className="text-white/30 text-xs uppercase tracking-widest mb-2">Pinned</div>
          <div className="grid grid-cols-2 gap-2">
            {pinnedAchievements.map(id => <PinnedAchievement key={id} id={id} />)}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl mb-4">
        {(['stats', 'achievements', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={clsx('flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all', tab === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60')}>
            {t === 'achievements' ? `Achievements (${unlockedCount})` : t}
          </button>
        ))}
      </div>

      {/* Stats tab */}
      {tab === 'stats' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
          {[
            { label: 'Puzzles Solved', value: player.stats.totalSolved, icon: '✓', color: 'text-green-400' },
            { label: 'Perfect Ratings', value: player.stats.totalPerfect, icon: '⚡', color: 'text-blue-400' },
            { label: 'Avg. Moves', value: avgMoves || '—', icon: '🎯', color: 'text-purple-400' },
            { label: 'Win Rate', value: `${winRate}%`, icon: '📊', color: 'text-amber-400' },
            { label: 'Ranked Wins', value: player.stats.rankedWins, icon: '🏆', color: 'text-amber-400' },
            { label: 'Elo Rating', value: player.elo, icon: '⭐', color: 'text-yellow-400' },
          ].map((s, i) => (
            <GlassCard key={s.label} padding="sm" rounded="xl" animate delay={i * 0.04}>
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <div className={clsx('text-base font-bold', s.color)}>{s.value}</div>
                  <div className="text-white/30 text-xs">{s.label}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      )}

      {/* Achievements tab */}
      {tab === 'achievements' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2.5">
          <button
            onClick={() => navigate('/achievements')}
            className="w-full glass rounded-xl p-4 flex items-center gap-3 border border-white/8 hover:bg-white/7 transition-colors text-left"
          >
            <span className="text-2xl">🏅</span>
            <div className="flex-1">
              <div className="text-white font-semibold text-sm">View All Achievements</div>
              <div className="text-white/40 text-xs">{unlockedCount}/{ACHIEVEMENTS.length} unlocked · Earn Sparks at each tier</div>
            </div>
            <span className="text-white/25">›</span>
          </button>

          {/* Quick preview of first few */}
          {ACHIEVEMENTS.slice(0, 4).map((ach, i) => {
            const prog = getAchievementProgress(ach, playerAchievements[ach.id])
            const td = prog.currentTier > 0 ? TIER_DEFS[prog.currentTier - 1] : null
            return (
              <GlassCard key={ach.id} padding="sm" rounded="xl" animate delay={i * 0.05}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{ach.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white text-sm font-medium truncate">{ach.name}</span>
                      {td && <span className="text-[10px] text-amber-400">{td.icon}</span>}
                    </div>
                    <ProgressBar value={prog.pct} color="blue" height="xs" animated className="mt-1" />
                  </div>
                  <span className="text-white/25 text-xs tabular-nums">{prog.currentValue}</span>
                </div>
              </GlassCard>
            )
          })}
        </motion.div>
      )}

      {/* History tab */}
      {tab === 'history' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">📊</div>
          <div className="text-white font-semibold mb-1">Solve History</div>
          <div className="text-white/40 text-sm">Your detailed history will appear here as you play.</div>
        </motion.div>
      )}

      <div className="mt-5">
        <Button variant="secondary" size="md" className="w-full" onClick={() => navigate('/settings')}>⚙️ Settings</Button>
      </div>

      {/* Pickers */}
      <AnimatePresence>
        {showAvatarPicker && <AvatarPickerModal onClose={() => setShowAvatarPicker(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showBorderPicker && <BorderPickerModal onClose={() => setShowBorderPicker(false)} />}
      </AnimatePresence>
    </div>
  )
}
