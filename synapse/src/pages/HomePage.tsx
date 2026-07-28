import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useGameStore } from '@/store/gameStore'

const RANK_COLORS = {
  bronze: 'text-orange-400',
  silver: 'text-slate-300',
  gold: 'text-amber-400',
  platinum: 'text-cyan-300',
  diamond: 'text-blue-300',
  master: 'text-purple-400',
  grandmaster: 'text-red-400',
  synapse: 'text-gradient-blue',
}

const RANK_ICONS = {
  bronze: '🟤',
  silver: '⚪',
  gold: '🟡',
  platinum: '💠',
  diamond: '💎',
  master: '🔮',
  grandmaster: '👑',
  synapse: '⚡',
}

function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.35, level - 1))
}

function getXPProgress(xp: number, level: number): { current: number; needed: number } {
  let spent = 0
  for (let l = 1; l < level; l++) spent += xpForLevel(l)
  const current = xp - spent
  const needed = xpForLevel(level)
  return { current, needed }
}

const MENU_ITEMS = [
  {
    id: 'campaign',
    icon: '⚡',
    label: 'Campaign',
    sub: 'Handcrafted Levels',
    color: 'blue',
    href: '/campaign',
    description: 'Journey through 100+ carefully crafted puzzles',
  },
  {
    id: 'daily',
    icon: '📅',
    label: 'Daily Puzzle',
    sub: 'New every day',
    color: 'green',
    href: '/daily',
    description: 'The world\'s same puzzle, every day',
    badge: 'NEW',
  },
  {
    id: 'endless',
    icon: '∞',
    label: 'Endless',
    sub: 'Infinite puzzles',
    color: 'purple',
    href: '/endless',
    description: 'Procedurally generated, infinitely replayable',
  },
  {
    id: 'ranked',
    icon: '🏆',
    label: 'Ranked',
    sub: 'Compete globally',
    color: 'amber',
    href: '/ranked',
    description: 'Climb the Elo leaderboard',
  },
  {
    id: 'creator',
    icon: '✏️',
    label: 'Creator',
    sub: 'Build your own',
    color: 'purple',
    href: '/creator',
    description: 'Design and share your puzzles',
  },
  {
    id: 'community',
    icon: '🌐',
    label: 'Community',
    sub: 'Browse & rate puzzles',
    color: 'green',
    href: '/community',
    description: 'Play and rate community-created puzzles',
    badge: 'NEW',
  },
]

interface MenuCardProps {
  item: typeof MENU_ITEMS[0]
  delay: number
}

function MenuCard({ item, delay }: MenuCardProps) {
  const navigate = useNavigate()

  const colorMap = {
    blue: { dot: 'bg-blue-500', glow: 'blue' as const, badge: 'blue' as const },
    green: { dot: 'bg-green-500', glow: 'green' as const, badge: 'green' as const },
    purple: { dot: 'bg-purple-500', glow: 'purple' as const, badge: 'purple' as const },
    amber: { dot: 'bg-amber-500', glow: 'amber' as const, badge: 'amber' as const },
  }
  const { dot, glow, badge } = colorMap[item.color as keyof typeof colorMap]

  return (
    <GlassCard
      hover
      glow={glow}
      padding="md"
      rounded="2xl"
      animate
      delay={delay}
      onClick={() => navigate(item.href)}
      className="cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl ${dot} bg-opacity-20 flex items-center justify-center text-xl flex-shrink-0`}
          style={{ background: `color-mix(in srgb, ${dot.replace('bg-', 'var(--')})) 15%, transparent)` }}>
          <span>{item.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm">{item.label}</span>
            {item.badge && <Badge variant={badge} size="xs">{item.badge}</Badge>}
          </div>
          <div className="text-white/40 text-xs mt-0.5">{item.description}</div>
        </div>
        <span className="text-white/20 text-lg">›</span>
      </div>
    </GlassCard>
  )
}

export function HomePage() {
  const navigate = useNavigate()
  const { player, worlds } = useGameStore()
  const { current, needed } = getXPProgress(player.xp, player.level)
  const totalLevels = worlds.reduce((s, w) => s + w.levels.length, 0)
  const completedLevels = worlds.reduce(
    (s, w) => s + w.levels.filter(l => l.completed).length, 0
  )

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient-blue">SYNAPSE</h1>
            <p className="text-white/30 text-xs tracking-widest mt-0.5">EVERY MOVE CHANGES EVERYTHING</p>
          </div>
          <motion.button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {player.displayName[0].toUpperCase()}
          </motion.button>
        </div>

        {/* Player Card */}
        <GlassCard padding="md" rounded="2xl" animate delay={0.05}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {player.displayName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm truncate">{player.displayName}</span>
                <Badge variant="blue" size="xs">Lv.{player.level}</Badge>
              </div>
              <div className={`text-xs font-medium ${RANK_COLORS[player.rank]}`}>
                {RANK_ICONS[player.rank]} {player.rank.charAt(0).toUpperCase() + player.rank.slice(1)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-amber-400 text-xs font-semibold">✦ {player.sparks.toLocaleString()}</div>
              <div className="text-white/30 text-xs">Sparks</div>
            </div>
          </div>

          {/* XP Bar */}
          <ProgressBar
            value={current}
            max={needed}
            color="gradient"
            height="sm"
            glow
            animated
            label={`${current} / ${needed} XP`}
          />

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label: 'Solved', value: player.stats.totalSolved },
              { label: 'Streak', value: `${player.streaks.daily}🔥` },
              { label: 'Perfect', value: player.stats.totalPerfect },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-white text-sm font-semibold">{stat.value}</div>
                <div className="text-white/30 text-[10px]">{stat.label}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Campaign progress banner */}
      {completedLevels > 0 && (
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard padding="sm" rounded="xl" border>
            <div className="flex items-center gap-3">
              <span className="text-blue-400 text-lg">⚡</span>
              <div className="flex-1">
                <div className="flex justify-between text-xs text-white/50 mb-1">
                  <span>Campaign Progress</span>
                  <span>{completedLevels}/{totalLevels}</span>
                </div>
                <ProgressBar value={completedLevels} max={totalLevels} color="blue" height="xs" animated />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Main menu */}
      <div className="flex flex-col gap-2.5 flex-1">
        {MENU_ITEMS.map((item, i) => (
          <MenuCard key={item.id} item={item} delay={0.1 + i * 0.06} />
        ))}
      </div>

      {/* Bottom nav */}
      <motion.div
        className="flex items-center justify-around mt-6 pt-4 border-t border-white/6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {[
          { icon: '🏆', label: 'Leaderboard', href: '/leaderboard' },
          { icon: '🛍️', label: 'Shop', href: '/shop' },
          { icon: '⚙️', label: 'Settings', href: '/settings' },
          { icon: '🔧', label: 'Admin', href: '/admin' },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => navigate(item.href)}
            className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] tracking-wide">{item.label}</span>
          </button>
        ))}
      </motion.div>
    </div>
  )
}
