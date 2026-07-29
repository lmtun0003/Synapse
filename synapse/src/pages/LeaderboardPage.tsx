import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'

const MOCK_DATA = {
  global: [
    { rank: 1, username: 'NeuralAce',   elo: 3120, solved: 1247, perfect: 892, country: '🇺🇸' },
    { rank: 2, username: 'GridMaster',  elo: 2980, solved: 1089, perfect: 756, country: '🇯🇵' },
    { rank: 3, username: 'SynapseX',    elo: 2761, solved: 987,  perfect: 645, country: '🇩🇪' },
    { rank: 4, username: 'LogicFlow',   elo: 2643, solved: 876,  perfect: 543, country: '🇬🇧' },
    { rank: 5, username: 'CircuitAI',   elo: 2544, solved: 765,  perfect: 432, country: '🇰🇷' },
    { rank: 6, username: 'QuantumLeap', elo: 2390, solved: 698,  perfect: 387, country: '🇨🇦' },
    { rank: 7, username: 'NodeBreaker', elo: 2287, solved: 623,  perfect: 312, country: '🇧🇷' },
    { rank: 8, username: 'SignalVoid',  elo: 2156, solved: 589,  perfect: 278, country: '🇦🇺' },
    { rank: 9, username: 'PuzzleSage',  elo: 2034, solved: 534,  perfect: 234, country: '🇫🇷' },
    { rank: 10, username: 'AlgoMind',   elo: 1987, solved: 498,  perfect: 198, country: '🇮🇳' },
  ],
}

const TABS = [
  { id: 'global', label: '🌍 Global' },
  { id: 'daily', label: '📅 Daily' },
  { id: 'weekly', label: '📊 Weekly' },
  { id: 'friends', label: '👥 Friends' },
]

const RANK_TIERS = {
  synapse: { icon: '⚡', color: 'text-blue-400', eloMin: 2800 },
  grandmaster: { icon: '👑', color: 'text-red-400', eloMin: 2400 },
  master: { icon: '🔮', color: 'text-purple-400', eloMin: 2000 },
  diamond: { icon: '💎', color: 'text-blue-300', eloMin: 1600 },
  platinum: { icon: '💠', color: 'text-cyan-300', eloMin: 1300 },
  gold: { icon: '🟡', color: 'text-amber-400', eloMin: 1100 },
  silver: { icon: '⚪', color: 'text-slate-300', eloMin: 950 },
  bronze: { icon: '🟤', color: 'text-orange-400', eloMin: 0 },
}

function getTierFromElo(elo: number) {
  const tiers = Object.entries(RANK_TIERS).sort((a, b) => b[1].eloMin - a[1].eloMin)
  for (const [id, tier] of tiers) {
    if (elo >= tier.eloMin) return { id, ...tier }
  }
  return { id: 'bronze', ...RANK_TIERS.bronze }
}

export function LeaderboardPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('global')

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
          <h1 className="text-xl font-bold text-white">Leaderboard</h1>
          <p className="text-white/40 text-xs">Top players worldwide</p>
        </div>
      </motion.div>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-3 mb-6 h-28">
        {[MOCK_DATA.global[1], MOCK_DATA.global[0], MOCK_DATA.global[2]].map((entry, i) => {
          const heights = ['h-20', 'h-28', 'h-16']
          const positions = ['2nd', '1st', '3rd']
          const bgColors = [
            'bg-gradient-to-b from-slate-400/20 to-slate-400/5 border-slate-400/30',
            'bg-gradient-to-b from-amber-400/25 to-amber-400/5 border-amber-400/35',
            'bg-gradient-to-b from-orange-600/20 to-orange-600/5 border-orange-600/30',
          ]
          const tier = getTierFromElo(entry.elo)

          return (
            <motion.div
              key={entry.rank}
              className={`flex-1 rounded-2xl border ${bgColors[i]} ${heights[i]} flex flex-col items-center justify-end pb-3 relative overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.1 }}
            >
              <div className="text-white/20 absolute top-2 right-2 text-xs">{positions[i]}</div>
              <div className="text-lg mb-1">{tier.icon}</div>
              <div className="text-white text-xs font-semibold truncate px-2 max-w-full">{entry.username}</div>
              <div className="text-white/40 text-[10px]">{entry.elo}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl mb-4 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              'flex-shrink-0 flex-1 py-2 rounded-lg text-xs font-medium transition-all',
              tab === t.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Leaderboard list */}
      <div className="flex flex-col gap-2">
        {tab === 'friends' ? (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">👥</div>
            <div className="text-white font-semibold mb-1">No Friends Yet</div>
            <div className="text-white/40 text-sm">Add friends to see their rankings here.</div>
          </div>
        ) : (
          MOCK_DATA.global.map((entry, i) => {
            const tier = getTierFromElo(entry.elo)
            return (
              <GlassCard
                key={entry.rank}
                padding="sm"
                rounded="xl"
                animate
                delay={i * 0.04}
              >
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
                  <span className="text-lg">{entry.country}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {entry.username[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{entry.username}</div>
                    <div className={`text-xs ${tier.color}`}>{tier.icon} {tier.id.charAt(0).toUpperCase() + tier.id.slice(1)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm font-semibold tabular-nums">{entry.elo}</div>
                    <div className="text-white/30 text-xs">{entry.perfect} ⚡</div>
                  </div>
                </div>
              </GlassCard>
            )
          })
        )}
      </div>
    </div>
  )
}
