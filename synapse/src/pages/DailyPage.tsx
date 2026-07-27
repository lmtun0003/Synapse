import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useGameStore } from '@/store/gameStore'
import { DAILY_PUZZLE_TEMPLATE } from '@/data/levels'

function getDailyPuzzleId(): string {
  const today = new Date()
  return `daily_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`
}

function getTimeUntilReset(): string {
  const now = new Date()
  const reset = new Date(now)
  reset.setDate(reset.getDate() + 1)
  reset.setHours(0, 0, 0, 0)
  const diff = reset.getTime() - now.getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const MOCK_LEADERBOARD = [
  { rank: 1, username: 'NeuralAce', moves: 4, time: '0:42', rating: 'perfect' as const },
  { rank: 2, username: 'GridMaster', moves: 4, time: '0:55', rating: 'perfect' as const },
  { rank: 3, username: 'SynapseX', moves: 5, time: '1:02', rating: 'gold' as const },
  { rank: 4, username: 'LogicFlow', moves: 5, time: '1:18', rating: 'gold' as const },
  { rank: 5, username: 'You', moves: 0, time: '—', rating: 'none' as const, isYou: true },
]

export function DailyPage() {
  const navigate = useNavigate()
  const { startGame, levelResults, player } = useGameStore()
  const [timeLeft, setTimeLeft] = useState(getTimeUntilReset())
  const [tab, setTab] = useState<'play' | 'leaderboard'>('play')
  const puzzleId = getDailyPuzzleId()
  const alreadySolved = !!levelResults['daily']

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeUntilReset()), 1000)
    return () => clearInterval(t)
  }, [])

  const handlePlay = () => {
    startGame({ ...DAILY_PUZZLE_TEMPLATE, id: 'daily' }, 'daily')
    navigate('/play')
  }

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

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
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Daily Puzzle</h1>
          <p className="text-white/40 text-xs">{todayDate}</p>
        </div>
      </motion.div>

      {/* Daily card */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard padding="lg" rounded="2xl" border className="relative overflow-hidden">
          {/* Background accent */}
          <div className="absolute inset-0 opacity-20"
            style={{
              background: 'radial-gradient(ellipse at top right, rgba(16,185,129,0.3) 0%, transparent 60%)',
            }}
          />

          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Today's Challenge</div>
                <h2 className="text-2xl font-bold text-white">Puzzle #{Math.floor(Date.now() / 86400000) % 1000 + 1}</h2>
              </div>
              {alreadySolved ? (
                <Badge variant="green" size="sm" glow>✓ Solved</Badge>
              ) : (
                <Badge variant="blue" size="sm">Active</Badge>
              )}
            </div>

            {/* Puzzle preview (stylised grid) */}
            <div className="grid grid-cols-4 gap-1.5 mb-4 p-3 glass rounded-xl">
              {Array.from({ length: 16 }).map((_, i) => {
                const isSource = i === 0
                const isTarget = i === 3 || i === 12 || i === 15
                const isRelay = i === 5 || i === 9
                return (
                  <div key={i} className={[
                    'aspect-square rounded-lg border flex items-center justify-center text-[10px]',
                    isSource ? 'bg-blue-500/30 border-blue-500/50 text-blue-400' :
                    isTarget ? 'bg-green-500/20 border-green-500/40 text-green-400' :
                    isRelay ? 'bg-violet-500/20 border-violet-500/30 text-violet-400' :
                    'bg-white/4 border-white/8 text-white/20',
                  ].join(' ')}>
                    {isSource ? '◉' : isTarget ? '◎' : isRelay ? '◈' : '·'}
                  </div>
                )
              })}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Perfect', value: `${DAILY_PUZZLE_TEMPLATE.targetMoves.perfect} moves` },
                { label: 'Grid', value: `${DAILY_PUZZLE_TEMPLATE.rows}×${DAILY_PUZZLE_TEMPLATE.cols}` },
                { label: 'Mechanics', value: DAILY_PUZZLE_TEMPLATE.mechanics.length.toString() },
              ].map(s => (
                <div key={s.label} className="text-center glass rounded-lg py-2">
                  <div className="text-white text-sm font-semibold">{s.value}</div>
                  <div className="text-white/30 text-[10px]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Streak */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-amber-500/8 border border-amber-500/20 rounded-xl">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="text-white text-sm font-semibold">{player.streaks.daily} day streak</div>
                <div className="text-white/40 text-xs">Complete today's puzzle to continue!</div>
              </div>
            </div>

            <Button
              variant={alreadySolved ? 'secondary' : 'primary'}
              size="lg"
              className="w-full"
              onClick={handlePlay}
              glow={!alreadySolved}
            >
              {alreadySolved ? '🔄 Play Again' : '▶ Play Now'}
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Reset timer */}
      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-white/30 text-xs">New puzzle in</div>
        <div className="text-white/70 text-xl font-mono font-semibold tracking-widest">{timeLeft}</div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl mb-4">
        {(['play', 'leaderboard'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70',
            ].join(' ')}
          >
            {t === 'play' ? '🎮 Info' : '🏆 Leaderboard'}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      {tab === 'leaderboard' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          {MOCK_LEADERBOARD.map((entry, i) => (
            <GlassCard
              key={entry.rank}
              padding="sm"
              rounded="xl"
              animate
              delay={i * 0.05}
              className={(entry as any).isYou ? 'border-blue-500/30 bg-blue-500/5' : ''}
            >
              <div className="flex items-center gap-3">
                <span className={[
                  'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                  i === 0 ? 'bg-amber-400/20 text-amber-400' :
                  i === 1 ? 'bg-slate-300/20 text-slate-300' :
                  i === 2 ? 'bg-orange-700/20 text-orange-400' :
                  'bg-white/5 text-white/40',
                ].join(' ')}>
                  {entry.rank}
                </span>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{entry.username}</div>
                  <div className="text-white/30 text-xs">{entry.time}</div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm font-semibold">{entry.moves > 0 ? `${entry.moves} moves` : '—'}</div>
                  {entry.rating !== 'none' && (
                    <Badge
                      variant={entry.rating === 'perfect' ? 'blue' : entry.rating === 'gold' ? 'gold' : 'silver'}
                      size="xs"
                    >
                      {entry.rating}
                    </Badge>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      )}

      {tab === 'play' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4"
        >
          <h3 className="text-white font-semibold mb-2">How it works</h3>
          <ul className="text-white/50 text-sm space-y-2">
            <li>• Everyone in the world solves the same puzzle</li>
            <li>• Rankings are based on fewest moves, then time</li>
            <li>• Leaderboard resets every 24 hours</li>
            <li>• Daily streaks reward consistent players</li>
            <li>• Share your result without spoiling the solution</li>
          </ul>
        </motion.div>
      )}
    </div>
  )
}
