import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { useGameStore } from '@/store/gameStore'
import { ShopEditor } from '@/components/admin/ShopEditor'
import { CampaignEditor } from '@/components/admin/CampaignEditor'
import { PlayerEditor } from '@/components/admin/PlayerEditor'
import { AchievementsEditor } from '@/components/admin/AchievementsEditor'
import { ConfigPanel } from '@/components/admin/ConfigPanel'

// ─── PIN gate ─────────────────────────────────────────────────────────────────

const ADMIN_PIN = 'SYNAPSE'

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = () => {
    if (pin.toUpperCase() === ADMIN_PIN) {
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setPin('')
      setTimeout(() => { setError(false); setShake(false) }, 700)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B0D] p-6">
      <motion.div
        className="w-full max-w-xs"
        animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
            <span className="text-white text-2xl">⚡</span>
          </div>
          <h1 className="text-white text-xl font-bold">SYNAPSE Admin</h1>
          <p className="text-white/35 text-sm mt-1">Enter your access PIN to continue</p>
        </div>

        {/* PIN input */}
        <div className="mb-4">
          <input
            ref={inputRef}
            type="text"
            value={pin}
            onChange={e => { setPin(e.target.value.toUpperCase()); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Access PIN"
            maxLength={20}
            className={clsx(
              'w-full bg-white/5 border rounded-2xl px-5 py-4 text-white text-center text-lg font-mono tracking-widest',
              'placeholder-white/20 focus:outline-none transition-colors',
              error ? 'border-red-500/50 bg-red-500/5' : 'border-white/12 focus:border-blue-500/50'
            )}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
          />
          {error && (
            <motion.p
              className="text-red-400 text-xs text-center mt-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              Incorrect PIN
            </motion.p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!pin}
          className="w-full py-3.5 rounded-2xl text-white font-semibold bg-blue-500 hover:bg-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)]"
        >
          Unlock Admin Panel
        </button>

        <p className="text-white/20 text-xs text-center mt-4">
          Hint: it's the game's name
        </p>
      </motion.div>
    </div>
  )
}

// ─── Tab definitions ─────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview',     icon: '📊', label: 'Overview' },
  { id: 'shop',         icon: '🛍️', label: 'Shop' },
  { id: 'campaign',     icon: '⚡', label: 'Campaign' },
  { id: 'player',       icon: '👤', label: 'Player' },
  { id: 'achievements', icon: '🏅', label: 'Achievements' },
  { id: 'config',       icon: '⚙️', label: 'Config' },
]

// ─── Overview tab ─────────────────────────────────────────────────────────────

function Overview() {
  const { player, worlds, shopItems, gameConfig, playerAchievements } = useGameStore()
  const unlockedWorlds = worlds.filter(w => w.unlocked).length
  const completedLevels = worlds.reduce((s, w) => s + w.levels.filter(l => l.completed).length, 0)
  const totalLevels = worlds.reduce((s, w) => s + w.levels.length, 0)
  const unlockedAchs = Object.values(playerAchievements).filter(a => a.currentTier > 0).length

  const stats = [
    { label: 'Player Level', value: player.level, icon: '⭐', color: 'text-blue-400' },
    { label: 'Sparks ✦', value: player.sparks.toLocaleString(), icon: '✦', color: 'text-amber-400' },
    { label: 'Prisms ◈', value: player.prisms, icon: '◈', color: 'text-blue-400' },
    { label: 'Elo', value: player.elo, icon: '📈', color: 'text-purple-400' },
    { label: 'Levels Done', value: `${completedLevels}/${totalLevels}`, icon: '✓', color: 'text-green-400' },
    { label: 'Worlds Open', value: `${unlockedWorlds}/${worlds.length}`, icon: '🗺️', color: 'text-cyan-400' },
    { label: 'Shop Items', value: shopItems.length, icon: '🛍️', color: 'text-white/70' },
    { label: 'Achievements', value: `${unlockedAchs} unlocked`, icon: '🏅', color: 'text-white/70' },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="bg-white/3 border border-white/8 rounded-2xl p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className={clsx('text-2xl font-bold tabular-nums', s.color)}>{s.value}</div>
            <div className="text-white/35 text-xs mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Active config notice */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-4 mb-4">
        <div className="text-white/60 text-sm font-semibold mb-2">Active Config</div>
        <div className="grid grid-cols-2 gap-y-1.5 text-xs">
          {[
            ['XP Multiplier', `${gameConfig.xpMultiplier}×`],
            ['Spark Multiplier', `${gameConfig.sparkMultiplier}×`],
            ['Maintenance', gameConfig.maintenanceMode ? '⚠️ ON' : '✓ OFF'],
            ['Ads', gameConfig.adsEnabled ? '✓ ON' : 'OFF'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-white/35">{k}</span>
              <span className={clsx('font-medium', v === '⚠️ ON' ? 'text-red-400' : 'text-white/65')}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-4">
        <div className="text-white/60 text-sm font-semibold mb-2">Quick Actions</div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '2× Event', action: () => useGameStore.getState().setGameConfig({ xpMultiplier: 2, sparkMultiplier: 2 }) },
            { label: '+1000 Sparks', action: () => useGameStore.getState().addSparks(1000) },
            { label: 'Unlock All Worlds', action: () => useGameStore.setState(s => ({ worlds: s.worlds.map(w => ({ ...w, unlocked: true, levels: w.levels.map(l => ({ ...l, locked: false })) })) })) },
            { label: 'Reset Game', action: () => { if (confirm('Reset all game progress?')) localStorage.removeItem('synapse-game-store'); window.location.reload() } },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className="px-3 py-1.5 rounded-xl text-xs text-white/60 border border-white/10 hover:bg-white/8 hover:text-white transition-all"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export function AdminPage() {
  const navigate = useNavigate()
  const { adminUnlocked, unlockAdmin, lockAdmin } = useGameStore()
  const [activeTab, setActiveTab] = useState('overview')

  if (!adminUnlocked) {
    return <PinGate onUnlock={unlockAdmin} />
  }

  const TabContent = () => {
    switch (activeTab) {
      case 'overview':     return <Overview />
      case 'shop':         return <ShopEditor />
      case 'campaign':     return <CampaignEditor />
      case 'player':       return <PlayerEditor />
      case 'achievements': return <AchievementsEditor />
      case 'config':       return <ConfigPanel />
      default:             return <Overview />
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-[#0D0D10] sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm">⚡</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-none">SYNAPSE Admin</h1>
            <p className="text-white/30 text-[10px] mt-0.5">Game Management Console</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="px-3 py-1.5 rounded-xl text-xs text-white/50 hover:text-white border border-white/10 hover:bg-white/6 transition-all"
          >
            ← Game
          </button>
          <button
            onClick={lockAdmin}
            className="px-3 py-1.5 rounded-xl text-xs text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all"
          >
            Lock
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar navigation */}
        <nav className="w-48 flex-shrink-0 border-r border-white/8 bg-[#0D0D10] p-3 flex flex-col gap-1 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm transition-all text-left w-full',
                activeTab === tab.id
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/5'
              )}
            >
              <span className="text-base w-5 text-center flex-shrink-0">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute right-3 w-1 h-4 bg-blue-500 rounded-full"
                  layoutId="nav-indicator"
                />
              )}
            </button>
          ))}

          <div className="mt-auto pt-3 border-t border-white/6">
            <div className="text-white/20 text-[10px] px-3 leading-relaxed">
              Changes save instantly to localStorage and take effect in the game immediately.
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="p-6 max-w-3xl"
            >
              {/* Section header */}
              <div className="mb-6">
                <h2 className="text-white text-xl font-bold">
                  {TABS.find(t => t.id === activeTab)?.icon} {TABS.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-white/35 text-sm mt-0.5">
                  {activeTab === 'overview'     && 'Current game state at a glance.'}
                  {activeTab === 'shop'         && 'Add, edit, and remove items from the shop. Changes apply immediately.'}
                  {activeTab === 'campaign'     && 'Unlock worlds and adjust move targets for any level.'}
                  {activeTab === 'player'       && 'Edit the current player\'s stats, currencies, and rank.'}
                  {activeTab === 'achievements' && 'View and manually set achievement progress and tier unlocks.'}
                  {activeTab === 'config'       && 'Global game variables: multipliers, rewards, flags.'}
                </p>
              </div>

              <TabContent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
