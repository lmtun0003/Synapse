import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/store/gameStore'

const RANK_CONFIG = {
  bronze:      { icon: '🟤', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  silver:      { icon: '⚪', color: 'text-slate-300', bg: 'bg-slate-400/10' },
  gold:        { icon: '🟡', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  platinum:    { icon: '💠', color: 'text-cyan-300', bg: 'bg-cyan-500/10' },
  diamond:     { icon: '💎', color: 'text-blue-300', bg: 'bg-blue-500/10' },
  master:      { icon: '🔮', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  grandmaster: { icon: '👑', color: 'text-red-400', bg: 'bg-red-500/10' },
  synapse:     { icon: '⚡', color: 'text-blue-400', bg: 'bg-blue-500/10' },
}

function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.35, level - 1))
}

function getXPProgress(xp: number, level: number) {
  let spent = 0
  for (let l = 1; l < level; l++) spent += xpForLevel(l)
  return { current: xp - spent, needed: xpForLevel(level) }
}

const ACHIEVEMENTS = [
  { id: 'first_solve', icon: '⚡', name: 'First Light', desc: 'Complete your first puzzle', earned: true },
  { id: 'perfect_1', icon: '🎯', name: 'Perfectionist', desc: 'Achieve a Perfect rating', earned: false },
  { id: 'streak_7', icon: '🔥', name: 'Week Warrior', desc: '7-day daily streak', earned: false },
  { id: 'solve_10', icon: '📚', name: 'Scholar', desc: 'Solve 10 puzzles', earned: false },
  { id: 'solve_100', icon: '🧠', name: 'Neural Net', desc: 'Solve 100 puzzles', earned: false },
  { id: 'ranked_win', icon: '🏆', name: 'Competitor', desc: 'Win your first ranked match', earned: false },
  { id: 'creator', icon: '✏️', name: 'Architect', desc: 'Create and share a puzzle', earned: false },
  { id: 'community', icon: '⭐', name: 'Community Star', desc: 'Get 10 community ratings', earned: false },
]

export function ProfilePage() {
  const navigate = useNavigate()
  const { player } = useGameStore()
  const rank = RANK_CONFIG[player.rank]
  const { current, needed } = getXPProgress(player.xp, player.level)
  const [tab, setTab] = useState<'stats' | 'achievements' | 'history'>('stats')

  const winRate = player.stats.rankedWins + player.stats.rankedLosses > 0
    ? Math.round((player.stats.rankedWins / (player.stats.rankedWins + player.stats.rankedLosses)) * 100)
    : 0

  const avgMoves = player.stats.totalSolved > 0
    ? Math.round(player.stats.totalMoves / player.stats.totalSolved)
    : 0

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white"
        >←</button>
        <h1 className="text-xl font-bold text-white">Profile</h1>
      </motion.div>

      {/* Player card */}
      <GlassCard padding="lg" rounded="2xl" animate delay={0.05} className="mb-5 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 90% 10%, rgba(59,130,246,0.08) 0%, transparent 60%)' }}
        />
        <div className="relative">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {player.displayName[0]}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-xl ${rank.bg} flex items-center justify-center text-sm border border-white/10`}>
                {rank.icon}
              </div>
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">{player.displayName}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="blue" size="xs">Level {player.level}</Badge>
                <span className={`text-sm font-semibold ${rank.color}`}>
                  {player.rank.charAt(0).toUpperCase() + player.rank.slice(1)}
                </span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-amber-400 text-sm font-bold">✦ {player.sparks.toLocaleString()}</div>
              <div className="text-blue-400 text-xs">{player.prisms} ◈</div>
            </div>
          </div>

          {/* XP Progress */}
          <ProgressBar
            value={current}
            max={needed}
            color="gradient"
            height="md"
            glow
            animated
            label={`${current} / ${needed} XP to Level ${player.level + 1}`}
          />

          {/* Streaks */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: '🔥', label: 'Daily Streak', value: player.streaks.daily },
              { icon: '⚡', label: 'Win Streak', value: player.streaks.win },
              { icon: '🎯', label: 'Perfect Streak', value: player.streaks.perfect },
            ].map(s => (
              <div key={s.label} className="glass rounded-xl p-2.5 text-center">
                <div className="text-lg">{s.icon}</div>
                <div className="text-white font-bold text-lg">{s.value}</div>
                <div className="text-white/30 text-[10px] leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl mb-4">
        {(['stats', 'achievements', 'history'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all',
              tab === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60',
            ].join(' ')}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Stats tab */}
      {tab === 'stats' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { label: 'Puzzles Solved', value: player.stats.totalSolved, icon: '✓', color: 'text-green-400' },
            { label: 'Perfect Ratings', value: player.stats.totalPerfect, icon: '⚡', color: 'text-blue-400' },
            { label: 'Avg. Moves', value: avgMoves, icon: '🎯', color: 'text-purple-400' },
            { label: 'Win Rate', value: `${winRate}%`, icon: '📊', color: 'text-amber-400' },
            { label: 'Ranked Wins', value: player.stats.rankedWins, icon: '🏆', color: 'text-amber-400' },
            { label: 'Elo Rating', value: player.elo, icon: '⭐', color: 'text-yellow-400' },
            { label: 'Campaign %', value: `${Math.round(player.stats.campaignProgress)}%`, icon: '📍', color: 'text-blue-300' },
            { label: 'Best Daily Rank', value: player.stats.bestDailyRank || '—', icon: '📅', color: 'text-green-400' },
          ].map((s, i) => (
            <GlassCard key={s.label} padding="sm" rounded="xl" animate delay={i * 0.04}>
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-white/30 text-xs leading-tight">{s.label}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      )}

      {/* Achievements tab */}
      {tab === 'achievements' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          {ACHIEVEMENTS.map((a, i) => (
            <GlassCard
              key={a.id}
              padding="sm"
              rounded="xl"
              animate
              delay={i * 0.05}
              className={a.earned ? '' : 'opacity-40'}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{a.icon}</span>
                <div className="flex-1">
                  <div className="text-white text-sm font-semibold">{a.name}</div>
                  <div className="text-white/40 text-xs">{a.desc}</div>
                </div>
                {a.earned && <Badge variant="green" size="xs">✓ Earned</Badge>}
              </div>
            </GlassCard>
          ))}
        </motion.div>
      )}

      {/* History tab */}
      {tab === 'history' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 text-center"
        >
          <div className="text-4xl mb-3">📊</div>
          <div className="text-white font-semibold mb-1">Solve History</div>
          <div className="text-white/40 text-sm">Your detailed history will appear here as you play more puzzles.</div>
        </motion.div>
      )}

      <div className="mt-5">
        <Button variant="secondary" size="md" className="w-full" onClick={() => navigate('/settings')}>
          ⚙️ Settings
        </Button>
      </div>
    </div>
  )
}
