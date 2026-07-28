import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useGameStore } from '@/store/gameStore'

const RANK_TIERS = [
  { id: 'bronze',       label: 'Bronze',      icon: '🟤', eloMin: 0,    eloMax: 949,  color: 'text-orange-400' },
  { id: 'silver',       label: 'Silver',      icon: '⚪', eloMin: 950,  eloMax: 1099, color: 'text-slate-300' },
  { id: 'gold',         label: 'Gold',        icon: '🟡', eloMin: 1100, eloMax: 1299, color: 'text-amber-400' },
  { id: 'platinum',     label: 'Platinum',    icon: '💠', eloMin: 1300, eloMax: 1599, color: 'text-cyan-300' },
  { id: 'diamond',      label: 'Diamond',     icon: '💎', eloMin: 1600, eloMax: 1999, color: 'text-blue-300' },
  { id: 'master',       label: 'Master',      icon: '🔮', eloMin: 2000, eloMax: 2399, color: 'text-purple-400' },
  { id: 'grandmaster',  label: 'Grandmaster', icon: '👑', eloMin: 2400, eloMax: 2799, color: 'text-red-400' },
  { id: 'synapse',      label: 'Synapse',     icon: '⚡', eloMin: 2800, eloMax: 9999, color: 'text-blue-400' },
]

const MOCK_LEADERBOARD = [
  { rank: 1, username: 'NeuralAce',  elo: 3120, wins: 847, tier: 'synapse' },
  { rank: 2, username: 'GridMaster', elo: 2980, wins: 723, tier: 'synapse' },
  { rank: 3, username: 'SynapseX',   elo: 2761, wins: 612, tier: 'grandmaster' },
  { rank: 4, username: 'LogicFlow',  elo: 2643, wins: 541, tier: 'grandmaster' },
  { rank: 5, username: 'CircuitAI',  elo: 2544, wins: 489, tier: 'grandmaster' },
]

export function RankedPage() {
  const navigate = useNavigate()
  const { player } = useGameStore()

  const currentTier = RANK_TIERS.find(t => t.id === player.rank) ?? RANK_TIERS[0]
  const nextTier = RANK_TIERS[RANK_TIERS.indexOf(currentTier) + 1]
  const eloProgress = nextTier
    ? ((player.elo - currentTier.eloMin) / (nextTier.eloMin - currentTier.eloMin)) * 100
    : 100

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto px-4 py-6">
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white"
        >←</button>
        <div>
          <h1 className="text-xl font-bold text-white">Ranked</h1>
          <p className="text-white/40 text-xs">Compete globally for the highest Elo</p>
        </div>
      </motion.div>

      {/* Current rank card */}
      <GlassCard padding="lg" rounded="2xl" animate delay={0.05} className="mb-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(circle at 80% 20%, rgba(245,158,11,0.4) 0%, transparent 60%)' }}
        />
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{currentTier.icon}</div>
            <div>
              <div className={`text-2xl font-bold ${currentTier.color}`}>{currentTier.label}</div>
              <div className="text-white/40 text-sm">{player.elo} Elo</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-white text-sm font-semibold">{player.stats.rankedWins}W</div>
              <div className="text-white/40 text-xs">{player.stats.rankedLosses}L</div>
            </div>
          </div>

          {nextTier && (
            <>
              <ProgressBar
                value={eloProgress}
                color="amber"
                height="sm"
                glow
                animated
                label={`${player.elo} / ${nextTier.eloMin} Elo → ${nextTier.label}`}
              />
            </>
          )}
        </div>
      </GlassCard>

      {/* Rank tiers overview */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {RANK_TIERS.map((tier, i) => (
          <motion.div
            key={tier.id}
            className={[
              'flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center',
              tier.id === player.rank
                ? 'border-white/25 bg-white/10'
                : RANK_TIERS.indexOf(tier) < RANK_TIERS.indexOf(currentTier)
                ? 'border-white/8 bg-white/3 opacity-60'
                : 'border-white/6 bg-white/2 opacity-40',
            ].join(' ')}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: tier.id === player.rank ? 1 : 0.5, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="text-lg">{tier.icon}</span>
            <span className={`text-[10px] font-medium ${tier.color}`}>{tier.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Global leaderboard */}
      <h2 className="text-white/50 text-xs uppercase tracking-widest mb-3">Top Players</h2>
      <div className="flex flex-col gap-2 mb-6">
        {MOCK_LEADERBOARD.map((entry, i) => {
          const tier = RANK_TIERS.find(t => t.id === entry.tier)
          return (
            <GlassCard key={entry.rank} padding="sm" rounded="xl" animate delay={0.1 + i * 0.05}>
              <div className="flex items-center gap-3">
                <span className={[
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                  i === 0 ? 'bg-amber-400/20 text-amber-400' :
                  i === 1 ? 'bg-slate-300/20 text-slate-300' :
                  i === 2 ? 'bg-orange-700/20 text-orange-400' :
                  'bg-white/5 text-white/40',
                ].join(' ')}>
                  {entry.rank}
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {entry.username[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{entry.username}</div>
                  <div className={`text-xs ${tier?.color ?? 'text-white/40'}`}>{tier?.icon} {tier?.label}</div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm font-semibold">{entry.elo}</div>
                  <div className="text-white/30 text-xs">{entry.wins} wins</div>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>

      {/* Play ranked */}
      <GlassCard padding="md" rounded="2xl" border className="mb-4">
        <h3 className="text-white font-semibold mb-1">How Ranking Works</h3>
        <p className="text-white/40 text-xs mb-3">Solve puzzles against real opponents. Ranked by moves, then time. Win = +Elo, Loss = -Elo.</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { icon: '🎯', label: 'Fewest Moves', sub: 'Primary metric' },
            { icon: '⏱', label: 'Fastest Time', sub: 'Tiebreaker' },
            { icon: '📊', label: 'Elo System', sub: 'Fair matching' },
          ].map(f => (
            <div key={f.label} className="glass rounded-lg p-2">
              <div className="text-lg mb-0.5">{f.icon}</div>
              <div className="text-white text-[11px] font-medium">{f.label}</div>
              <div className="text-white/30 text-[10px]">{f.sub}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="flex gap-2.5">
        <Button variant="primary" size="lg" className="flex-1" glow>
          🏆 Find Match
        </Button>
        <Button variant="secondary" size="lg" onClick={() => navigate('/ranked/leaderboard')}>
          Top 100
        </Button>
      </div>
    </div>
  )
}
