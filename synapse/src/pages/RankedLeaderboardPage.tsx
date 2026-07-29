import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { PlayerAvatar } from '@/components/ui/PlayerAvatar'
import { useGameStore } from '@/store/gameStore'

// ─── Monthly Reward Table ─────────────────────────────────────────────────────

const WORLD_REWARDS = [
  { rank: 1,       label: '#1',        sparks: 5000, prisms: 200, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/25' },
  { rank: 2,       label: '#2',        sparks: 3500, prisms: 150, color: 'text-slate-300', bg: 'bg-slate-400/8',  border: 'border-slate-400/20' },
  { rank: 3,       label: '#3',        sparks: 2500, prisms: 100, color: 'text-orange-400',bg: 'bg-orange-600/8', border: 'border-orange-600/20' },
  { rank: 10,      label: 'Top 10',    sparks: 1000, prisms: 50,  color: 'text-blue-400',  bg: 'bg-blue-500/8',   border: 'border-blue-500/20' },
]

// ─── Mock data ────────────────────────────────────────────────────────────────

const GLOBAL_TOP = [
  { rank:1,  username:'NeuralAce',   displayName:'NeuralAce',   elo:3120, wins:847, country:'🇺🇸', state:'California',  avatarId:'nexus',   borderId:'fire'    },
  { rank:2,  username:'GridMaster',  displayName:'GridMaster',  elo:2980, wins:723, country:'🇯🇵', state:'Tokyo',       avatarId:'quantum', borderId:'synapse_glow' },
  { rank:3,  username:'SynapseX',    displayName:'SynapseX',    elo:2761, wins:612, country:'🇩🇪', state:'Bavaria',     avatarId:'void',    borderId:'diamond_animated' },
  { rank:4,  username:'LogicFlow',   displayName:'LogicFlow',   elo:2643, wins:541, country:'🇬🇧', state:'London',      avatarId:'prism',   borderId:'rainbow' },
  { rank:5,  username:'CircuitAI',   displayName:'CircuitAI',   elo:2544, wins:489, country:'🇰🇷', state:'Seoul',       avatarId:'circuit', borderId:'cyan_pulse' },
  { rank:6,  username:'QuantumLeap', displayName:'QuantumLeap', elo:2390, wins:432, country:'🇨🇦', state:'Ontario',     avatarId:'aurora',  borderId:'purple_gradient' },
  { rank:7,  username:'NodeBreaker', displayName:'NodeBreaker', elo:2287, wins:398, country:'🇧🇷', state:'São Paulo',   avatarId:'storm',   borderId:'gold_gradient' },
  { rank:8,  username:'SignalVoid',  displayName:'SignalVoid',  elo:2156, wins:356, country:'🇦🇺', state:'NSW',         avatarId:'zenith',  borderId:'blue_solid' },
  { rank:9,  username:'PuzzleSage',  displayName:'PuzzleSage',  elo:2034, wins:312, country:'🇫🇷', state:'Île-de-France',avatarId:'inferno', borderId:'none' },
  { rank:10, username:'AlgoMind',    displayName:'AlgoMind',    elo:1987, wins:278, country:'🇮🇳', state:'Maharashtra', avatarId:'nebula',  borderId:'green_solid' },
  { rank:11, username:'WaveFunc',    displayName:'WaveFunc',    elo:1921, wins:244, country:'🇸🇬', state:'Singapore',   avatarId:'nebula',  borderId:'none' },
  { rank:12, username:'ByteKnight',  displayName:'ByteKnight',  elo:1876, wins:221, country:'🇸🇪', state:'Stockholm',   avatarId:'circuit', borderId:'none' },
]

const COUNTRY_TOP = GLOBAL_TOP.filter(e => e.country === '🇺🇸').map((e, i) => ({ ...e, rank: i + 1 }))
const STATE_TOP = GLOBAL_TOP.filter(e => e.state === 'California').map((e, i) => ({ ...e, rank: i + 1 }))

// ─── Rank Tier helper ─────────────────────────────────────────────────────────

function eloToTier(elo: number) {
  if (elo >= 2800) return { label: 'Synapse',      icon: '⚡', color: 'text-blue-400'   }
  if (elo >= 2400) return { label: 'Grandmaster',  icon: '👑', color: 'text-red-400'    }
  if (elo >= 2000) return { label: 'Master',       icon: '🔮', color: 'text-purple-400' }
  if (elo >= 1600) return { label: 'Diamond',      icon: '💎', color: 'text-blue-300'   }
  if (elo >= 1300) return { label: 'Platinum',     icon: '💠', color: 'text-cyan-300'   }
  if (elo >= 1100) return { label: 'Gold',         icon: '🟡', color: 'text-amber-400'  }
  if (elo >= 950)  return { label: 'Silver',       icon: '⚪', color: 'text-slate-300'  }
  return { label: 'Bronze', icon: '🟤', color: 'text-orange-400' }
}

// ─── Monthly Reward Panel ──────────────────────────────────────────────────────

function RewardPanel({ scope }: { scope: 'global' | 'country' | 'state' }) {
  const multiplier = scope === 'global' ? 1 : scope === 'country' ? 0.5 : 0.25

  return (
    <div className="glass rounded-2xl p-4 mb-4 border border-amber-500/15">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-amber-400">🏅</span>
        <span className="text-white font-semibold text-sm">Monthly Rewards</span>
        <Badge variant="amber" size="xs">{scope === 'global' ? 'World' : scope === 'country' ? 'Country ÷2' : 'State ÷4'}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {WORLD_REWARDS.map(r => {
          const sparks = Math.round(r.sparks * multiplier)
          const prisms = Math.round(r.prisms * multiplier)
          return (
            <div key={r.rank} className={clsx('rounded-xl px-3 py-2 border', r.bg, r.border)}>
              <div className={clsx('text-xs font-bold', r.color)}>{r.label}</div>
              <div className="text-white text-xs mt-0.5">
                <span className="text-amber-400">✦ {sparks.toLocaleString()}</span>
                <span className="text-white/30"> · </span>
                <span className="text-blue-400">◈ {prisms}</span>
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-white/25 text-[10px] mt-2">Rewards distributed at the end of each calendar month.</p>
    </div>
  )
}

// ─── Row ─────────────────────────────────────────────────────────────────────

function LeaderRow({ entry, showLocation, i }: { entry: typeof GLOBAL_TOP[0]; showLocation: string; i: number }) {
  const tier = eloToTier(entry.elo)
  const medalColors = ['bg-amber-400/20 text-amber-400','bg-slate-300/20 text-slate-300','bg-orange-600/20 text-orange-400']

  return (
    <motion.div
      className={clsx('flex items-center gap-3 p-3 rounded-2xl border transition-all', entry.rank <= 3 ? 'bg-white/5 border-white/12' : 'glass border-white/6')}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.04 }}
    >
      {/* Rank */}
      <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0', entry.rank <= 3 ? medalColors[entry.rank-1] : 'bg-white/5 text-white/40')}>
        {entry.rank}
      </div>

      {/* Avatar */}
      <PlayerAvatar avatarId={entry.avatarId} borderId={entry.borderId} size={36} displayName={entry.displayName} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-semibold truncate">{entry.displayName}</div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">{entry.country}</span>
          {showLocation === 'global' && <span className="text-white/30 text-xs truncate">{entry.state}</span>}
          <span className={clsx('text-xs', tier.color)}>{tier.icon} {tier.label}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="text-right flex-shrink-0">
        <div className="text-white text-sm font-bold tabular-nums">{entry.elo}</div>
        <div className="text-white/30 text-xs">{entry.wins}W</div>
      </div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type ScopeTab = 'global' | 'country' | 'state'

export function RankedLeaderboardPage() {
  const navigate = useNavigate()
  const [scope, setScope] = useState<ScopeTab>('global')
  const { player } = useGameStore()

  const data = scope === 'global' ? GLOBAL_TOP : scope === 'country' ? COUNTRY_TOP : STATE_TOP
  const scopeLabel = scope === 'global' ? '🌍 Global' : scope === 'country' ? `${GLOBAL_TOP[0].country} Country` : '📍 Local State'

  // Time until end of month
  const now = new Date()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const daysLeft = Math.ceil((endOfMonth.getTime() - now.getTime()) / 86400000)

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <motion.div className="flex items-center gap-3 mb-5" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate('/ranked')} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white">←</button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Leaderboard</h1>
          <p className="text-white/40 text-xs">Top 100 · Resets in {daysLeft} day{daysLeft !== 1 ? 's' : ''}</p>
        </div>
        <Badge variant="amber" size="sm" glow>{daysLeft}d left</Badge>
      </motion.div>

      {/* Scope tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl mb-4">
        {(['global', 'country', 'state'] as ScopeTab[]).map(s => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={clsx('flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all', scope === s ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60')}
          >
            {s === 'global' ? '🌍 Global' : s === 'country' ? '🏳️ Country' : '📍 State'}
          </button>
        ))}
      </div>

      {/* Monthly rewards */}
      <RewardPanel scope={scope} />

      {/* Top 3 podium */}
      {data.length >= 3 && (
        <div className="flex items-end justify-center gap-3 h-28 mb-5">
          {[data[1], data[0], data[2]].map((entry, i) => {
            const heights = ['h-20', 'h-28', 'h-16']
            const labels = ['2nd','1st','3rd']
            const bgColors = ['bg-gradient-to-b from-slate-400/15 to-transparent border-slate-400/25','bg-gradient-to-b from-amber-400/20 to-transparent border-amber-400/30','bg-gradient-to-b from-orange-600/15 to-transparent border-orange-600/20']
            return (
              <motion.div
                key={entry.rank}
                className={clsx('flex-1 rounded-2xl border flex flex-col items-center justify-end pb-3 relative', heights[i], bgColors[i])}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="absolute top-2 right-2 text-white/20 text-[10px]">{labels[i]}</div>
                <PlayerAvatar avatarId={entry.avatarId} borderId={entry.borderId} size={28} displayName={entry.displayName} />
                <div className="text-white text-[10px] font-semibold truncate mt-1 px-2 max-w-full">{entry.displayName}</div>
                <div className="text-white/40 text-[9px]">{entry.elo}</div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Your rank */}
      <div className="glass rounded-xl p-3 mb-4 flex items-center gap-3 border border-blue-500/20">
        <span className="text-blue-400 text-xs font-medium">Your Rank</span>
        <div className="flex-1" />
        <span className="text-white/40 text-xs">Unranked</span>
        <span className="text-white text-sm font-bold">{player.elo} Elo</span>
      </div>

      {/* Full list */}
      <div className="flex flex-col gap-2">
        {data.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🌐</div>
            <div className="text-white font-semibold mb-1">No data for this scope</div>
            <div className="text-white/40 text-sm">Rankings will appear here as players compete.</div>
          </div>
        ) : (
          data.map((entry, i) => (
            <LeaderRow key={entry.username} entry={entry} showLocation={scope} i={i} />
          ))
        )}
      </div>
    </div>
  )
}
