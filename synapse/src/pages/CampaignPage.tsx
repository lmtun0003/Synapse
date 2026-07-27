import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useGameStore } from '@/store/gameStore'
import type { World, CampaignLevel } from '@/types/game'

function WorldCard({ world, isSelected, onClick }: { world: World; isSelected: boolean; onClick: () => void }) {
  const completed = world.levels.filter(l => l.completed).length
  const total = world.levels.length
  const pct = (completed / total) * 100

  return (
    <motion.button
      onClick={onClick}
      className={clsx(
        'relative flex-shrink-0 w-28 rounded-2xl p-3.5 text-left transition-all duration-300',
        'border focus:outline-none',
        isSelected
          ? 'border-white/25 bg-white/10'
          : 'border-white/8 bg-white/4 hover:bg-white/7',
        !world.unlocked ? 'opacity-40' : ''
      )}
      whileHover={world.unlocked ? { scale: 1.02 } : {}}
      whileTap={world.unlocked ? { scale: 0.97 } : {}}
    >
      {!world.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/30">
          <span className="text-white/40 text-lg">🔒</span>
        </div>
      )}
      <div
        className="w-8 h-8 rounded-xl mb-2 flex items-center justify-center text-sm"
        style={{ background: `${world.color}22`, border: `1px solid ${world.color}44` }}
      >
        <span style={{ color: world.color }}>◈</span>
      </div>
      <div className="text-white text-xs font-semibold leading-tight mb-1">{world.name}</div>
      <div className="text-white/30 text-[10px] mb-2">{world.mechanic}</div>
      <ProgressBar value={completed} max={total} color="blue" height="xs" animated={false} />
      <div className="text-white/30 text-[9px] mt-1">{completed}/{total}</div>
    </motion.button>
  )
}

const STAR_CONFIG = [
  { stars: 4, icon: '⚡', label: 'Perfect', color: 'text-blue-400' },
  { stars: 3, icon: '⭐', label: 'Gold', color: 'text-amber-400' },
  { stars: 2, icon: '⭐', label: 'Silver', color: 'text-slate-300' },
  { stars: 1, icon: '⭐', label: 'Bronze', color: 'text-orange-400' },
]

function LevelButton({ level, onClick }: { level: CampaignLevel; onClick: () => void }) {
  const stars = level.bestResult?.stars ?? 0
  const isPerfect = stars === 4
  const isCompleted = level.completed

  return (
    <motion.button
      onClick={() => !level.locked && onClick()}
      className={clsx(
        'relative w-full aspect-square rounded-2xl border flex flex-col items-center justify-center gap-1',
        'transition-all duration-200 focus:outline-none',
        level.locked
          ? 'border-white/6 bg-white/2 cursor-not-allowed opacity-30'
          : isCompleted
          ? 'border-white/15 bg-white/6 cursor-pointer hover:bg-white/10'
          : 'border-white/10 bg-white/3 cursor-pointer hover:bg-white/7',
        isPerfect ? 'border-blue-500/40 shadow-[0_0_16px_rgba(59,130,246,0.2)]' : '',
      )}
      whileHover={!level.locked ? { scale: 1.04 } : {}}
      whileTap={!level.locked ? { scale: 0.95 } : {}}
    >
      {level.locked ? (
        <span className="text-white/20 text-lg">🔒</span>
      ) : (
        <>
          <span className={clsx(
            'text-sm font-bold',
            isPerfect ? 'text-blue-400' : isCompleted ? 'text-white' : 'text-white/50'
          )}>
            {level.levelNumber}
          </span>
          {isCompleted && (
            <div className="flex gap-px">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className={clsx('text-[6px]', i < stars ? 'text-amber-400' : 'text-white/15')}>★</span>
              ))}
            </div>
          )}
          {isPerfect && (
            <span className="text-[8px] text-blue-400">⚡</span>
          )}
        </>
      )}
    </motion.button>
  )
}

export function CampaignPage() {
  const navigate = useNavigate()
  const { worlds, setCurrentLevel, startGame } = useGameStore()
  const [selectedWorldIdx, setSelectedWorldIdx] = useState(0)
  const selectedWorld = worlds[selectedWorldIdx]

  const handleLevelClick = (level: CampaignLevel) => {
    if (level.locked) return
    setCurrentLevel(selectedWorld.id, level.levelNumber)
    startGame(level.puzzle, 'campaign')
    navigate('/play')
  }

  const completed = selectedWorld.levels.filter(l => l.completed).length
  const total = selectedWorld.levels.length

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
          className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Campaign</h1>
          <p className="text-white/40 text-xs">Select a world to play</p>
        </div>
      </motion.div>

      {/* World selector */}
      <div className="flex gap-3 overflow-x-auto pb-3 mb-5 -mx-4 px-4 scrollbar-hide">
        {worlds.map((w, i) => (
          <WorldCard
            key={w.id}
            world={w}
            isSelected={i === selectedWorldIdx}
            onClick={() => w.unlocked && setSelectedWorldIdx(i)}
          />
        ))}
      </div>

      {/* World info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedWorld.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <GlassCard padding="md" rounded="2xl" className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-white font-bold text-lg">{selectedWorld.name}</h2>
                <p className="text-white/40 text-xs">{selectedWorld.description}</p>
              </div>
              <Badge variant="blue" size="sm">{selectedWorld.mechanic}</Badge>
            </div>
            <ProgressBar value={completed} max={total} color="blue" height="sm" glow animated label={`${completed}/${total} Levels`} />
          </GlassCard>

          {/* Level grid */}
          <div className="grid grid-cols-5 gap-2">
            {selectedWorld.levels.map(level => (
              <LevelButton
                key={level.levelNumber}
                level={level}
                onClick={() => handleLevelClick(level)}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
