import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useGameStore } from '@/store/gameStore'
import { COSMETIC_TYPE_LABELS } from '@/data/shopItems'

const BATTLE_PASS_TIERS = [
  { level: 1, free: { type: 'sparks', amount: 50 }, premium: { type: 'theme', name: 'Eclipse' } },
  { level: 5, free: { type: 'badge', name: 'Season 1' }, premium: { type: 'board_skin', name: 'Void Grid' } },
  { level: 10, free: { type: 'sparks', amount: 100 }, premium: { type: 'animated_icon', name: 'Nexus' } },
  { level: 25, free: { type: 'title', name: 'Pathfinder' }, premium: { type: 'particle', name: 'Aurora' } },
  { level: 50, free: { type: 'sparks', amount: 250 }, premium: { type: 'board_skin', name: 'Quantum Void' } },
  { level: 100, free: { type: 'title', name: 'Veteran' }, premium: { type: 'legendary_theme', name: 'Singularity' } },
]

export function ShopPage() {
  const navigate = useNavigate()
  const { player, shopItems } = useGameStore()
  const [tab, setTab] = useState<'shop' | 'battlepass'>('shop')
  const [filter, setFilter] = useState('All')

  const filters = ['All', 'theme', 'board_skin', 'icon', 'victory', 'cursor', 'background', 'Limited']
  const filterLabel: Record<string, string> = { All: 'All', theme: 'Themes', board_skin: 'Board Skins', icon: 'Icons', victory: 'Victory', cursor: 'Cursors', background: 'Backgrounds', Limited: 'Limited' }

  const filtered = filter === 'All'
    ? shopItems
    : filter === 'Limited'
    ? shopItems.filter(i => i.limited)
    : shopItems.filter(i => i.type === filter)

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between gap-3 mb-5"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white"
          >←</button>
          <div>
            <h1 className="text-xl font-bold text-white">Shop</h1>
            <p className="text-white/40 text-xs">Cosmetics only. No pay-to-win.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-1.5">
            <span className="text-amber-400 text-sm">✦</span>
            <span className="text-white text-sm font-semibold">{player.sparks}</span>
          </div>
          <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-1.5">
            <span className="text-blue-400 text-sm">◈</span>
            <span className="text-white text-sm font-semibold">{player.prisms}</span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl mb-4">
        {(['shop', 'battlepass'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all',
              tab === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60',
            ].join(' ')}
          >
            {t === 'battlepass' ? '⚔️ Battle Pass' : '🛍️ Shop'}
          </button>
        ))}
      </div>

      {tab === 'shop' && (
        <>
          {/* Featured banner */}
          <motion.div
            className="relative overflow-hidden rounded-2xl mb-4 p-5"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.2) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
          >
            <Badge variant="blue" size="xs" className="mb-2">FEATURED</Badge>
            <h3 className="text-white font-bold text-lg mb-1">Nebula Collection</h3>
            <p className="text-white/50 text-xs mb-3">Limited time cosmic-themed cosmetics</p>
            <Button variant="primary" size="sm" glow>View Collection →</Button>
            <div className="absolute right-4 top-4 text-5xl opacity-30">🌌</div>
          </motion.div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={[
                  'flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all border',
                  filter === f
                    ? 'bg-white/12 border-white/25 text-white'
                    : 'glass border-white/8 text-white/40 hover:text-white/70',
                ].join(' ')}
              >
                {filterLabel[f] ?? f}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((item, i) => (
              <GlassCard
                key={item.id}
                padding="none"
                rounded="2xl"
                hover
                glow="blue"
                animate
                delay={i * 0.07}
                className="overflow-hidden cursor-pointer"
              >
                {/* Preview */}
                <div className="h-24 flex items-center justify-center bg-gradient-to-br from-white/4 to-white/1 text-5xl relative">
                  {item.preview}
                  {item.new && <Badge variant="blue" size="xs" className="absolute top-2 left-2">NEW</Badge>}
                  {item.limited && <Badge variant="amber" size="xs" className="absolute top-2 right-2">LIMITED</Badge>}
                </div>
                {/* Info */}
                <div className="p-3">
                  <div className="text-white text-sm font-semibold truncate">{item.name}</div>
                  <div className="text-white/30 text-[11px] mb-2 truncate">{COSMETIC_TYPE_LABELS[item.type] ?? item.type}</div>
                  <div className="flex items-center justify-between">
                    {item.sparkCost ? (
                      <span className="text-amber-400 text-sm font-semibold">✦ {item.sparkCost}</span>
                    ) : (
                      <span className="text-blue-400 text-sm font-semibold">◈ {item.prismCost}</span>
                    )}
                    <button className="text-[11px] text-blue-400 hover:text-blue-300 font-medium">Buy</button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </>
      )}

      {tab === 'battlepass' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Battle pass promo */}
          <div
            className="rounded-2xl p-5 mb-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(59,130,246,0.15) 100%)', border: '1px solid rgba(139,92,246,0.3)' }}
          >
            <div className="absolute right-4 top-4 text-5xl opacity-20">⚔️</div>
            <Badge variant="purple" size="sm" glow className="mb-2">SEASON 1</Badge>
            <h3 className="text-white font-bold text-xl mb-1">Battle Pass</h3>
            <p className="text-white/50 text-sm mb-1">100 reward levels. 60 days.</p>
            <p className="text-blue-400 font-bold text-lg mb-3">◈ 800 Prisms</p>
            <Button variant="gold" size="md" glow>Unlock Premium</Button>
          </div>

          {/* Reward preview */}
          <h3 className="text-white/50 text-xs uppercase tracking-widest mb-3">Reward Preview</h3>
          <div className="flex flex-col gap-2.5">
            {BATTLE_PASS_TIERS.map((tier, i) => (
              <GlassCard key={tier.level} padding="sm" rounded="xl" animate delay={i * 0.06}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-white/60 text-xs font-bold flex-shrink-0">
                    {tier.level}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-white/50 text-[11px]">Free</div>
                      <div className="text-white text-xs font-medium capitalize">
                        {typeof tier.free === 'object' && 'amount' in tier.free
                          ? `✦ ${tier.free.amount} Sparks`
                          : `${(tier.free as any).name}`
                        }
                      </div>
                    </div>
                    <div className="w-px h-8 bg-white/8" />
                    <div className="flex-1 opacity-50">
                      <div className="text-purple-400 text-[11px]">Premium ◈</div>
                      <div className="text-white text-xs font-medium capitalize">{(tier.premium as any).name}</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
