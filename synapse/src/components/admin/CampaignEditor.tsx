import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { clsx } from 'clsx'
import { useGameStore } from '@/store/gameStore'
import { AdminLabel, AdminInput, AdminCard } from './AdminShared'
import type { World } from '@/types/game'

function MoveTargetEditor({ puzzleId, targets, onChange }: {
  puzzleId: string
  targets: { perfect: number; gold: number; silver: number; bronze: number }
  onChange: (t: typeof targets) => void
}) {
  const [draft, setDraft] = useState({ ...targets })
  const dirty = JSON.stringify(draft) !== JSON.stringify(targets)

  const update = (key: keyof typeof draft, val: number) => setDraft(d => ({ ...d, [key]: val }))

  return (
    <div className="bg-white/3 rounded-xl p-3 border border-white/6">
      <div className="grid grid-cols-4 gap-2 mb-2">
        {(['perfect', 'gold', 'silver', 'bronze'] as const).map(tier => {
          const colors = { perfect: 'text-blue-400', gold: 'text-amber-400', silver: 'text-slate-300', bronze: 'text-orange-400' }
          return (
            <div key={tier}>
              <label className={clsx('block text-[10px] font-medium mb-1 capitalize', colors[tier])}>{tier}</label>
              <input
                type="number"
                min={1}
                max={99}
                value={draft[tier]}
                onChange={e => update(tier, Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500/40 text-center"
              />
            </div>
          )
        })}
      </div>
      {dirty && (
        <button
          onClick={() => onChange(draft)}
          className="w-full text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg py-1.5 transition-all"
        >
          Apply
        </button>
      )}
    </div>
  )
}

function WorldRow({ world, worldIdx, onToggle, onUpdateLevel }: {
  world: World
  worldIdx: number
  onToggle: (worldId: string) => void
  onUpdateLevel: (worldId: string, levelNum: number, targets: World['levels'][0]['puzzle']['targetMoves']) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const completedCount = world.levels.filter(l => l.completed).length

  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden">
      {/* World header */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: world.color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm">W{worldIdx + 1}: {world.name}</span>
            <span className="text-white/25 text-xs">{world.levels.length} levels</span>
            <span className="text-white/25 text-xs">·</span>
            <span className="text-white/40 text-xs">{completedCount}/{world.levels.length} done</span>
          </div>
          <div className="text-white/35 text-xs truncate">{world.mechanic}</div>
        </div>

        {/* Unlock toggle */}
        <button
          onClick={() => onToggle(world.id)}
          className={clsx(
            'px-3 py-1 rounded-lg text-xs font-medium transition-all border',
            world.unlocked
              ? 'bg-green-500/10 border-green-500/25 text-green-400'
              : 'bg-white/5 border-white/15 text-white/40 hover:text-white'
          )}
        >
          {world.unlocked ? '✓ Unlocked' : '🔒 Locked'}
        </button>

        {/* Expand levels */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white flex items-center justify-center text-xs transition-all flex-shrink-0"
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Level list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/6"
          >
            <div className="max-h-64 overflow-y-auto divide-y divide-white/4">
              {world.levels.map(level => (
                <div key={level.levelNumber} className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white/50 text-xs font-medium w-16 flex-shrink-0">
                      Level {level.levelNumber}
                    </span>
                    <span className="text-white/30 text-xs truncate flex-1">{level.puzzle.title}</span>
                    {level.completed && <span className="text-green-400 text-[10px]">✓</span>}
                    {level.locked && <span className="text-white/25 text-[10px]">🔒</span>}
                  </div>
                  <MoveTargetEditor
                    puzzleId={level.puzzle.id}
                    targets={level.puzzle.targetMoves}
                    onChange={(t) => onUpdateLevel(world.id, level.levelNumber, t)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function CampaignEditor() {
  const { worlds, setCurrentLevel } = useGameStore()
  const store = useGameStore()
  const [search, setSearch] = useState('')

  const handleToggleWorld = (worldId: string) => {
    // Toggle world unlocked state in Zustand
    useGameStore.setState(s => ({
      worlds: s.worlds.map(w =>
        w.id === worldId ? { ...w, unlocked: !w.unlocked } : w
      ),
    }))
  }

  const handleUpdateLevel = (worldId: string, levelNum: number, targets: World['levels'][0]['puzzle']['targetMoves']) => {
    useGameStore.setState(s => ({
      worlds: s.worlds.map(w =>
        w.id !== worldId ? w : {
          ...w,
          levels: w.levels.map(l =>
            l.levelNumber === levelNum
              ? { ...l, puzzle: { ...l.puzzle, targetMoves: targets } }
              : l
          ),
        }
      ),
    }))
  }

  const unlockAll = () => {
    useGameStore.setState(s => ({
      worlds: s.worlds.map(w => ({
        ...w,
        unlocked: true,
        levels: w.levels.map((l, i) => ({ ...l, locked: false })),
      })),
    }))
  }

  const lockAll = () => {
    useGameStore.setState(s => ({
      worlds: s.worlds.map((w, wi) => ({
        ...w,
        unlocked: wi === 0,
        levels: w.levels.map((l, li) => ({ ...l, locked: wi === 0 ? li > 0 : true })),
      })),
    }))
  }

  const filteredWorlds = worlds.filter(w =>
    !search || w.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white/4 rounded-xl p-3 text-center border border-white/8">
          <div className="text-white text-xl font-bold">{worlds.length}</div>
          <div className="text-white/40 text-xs">Worlds</div>
        </div>
        <div className="bg-green-500/5 rounded-xl p-3 text-center border border-green-500/15">
          <div className="text-green-400 text-xl font-bold">{worlds.filter(w => w.unlocked).length}</div>
          <div className="text-white/40 text-xs">Unlocked</div>
        </div>
        <div className="bg-blue-500/5 rounded-xl p-3 text-center border border-blue-500/15">
          <div className="text-blue-400 text-xl font-bold">{worlds.reduce((s, w) => s + w.levels.length, 0)}</div>
          <div className="text-white/40 text-xs">Total Levels</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 mb-4">
        <AdminInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search worlds…"
          className="flex-1"
        />
        <button
          onClick={unlockAll}
          className="px-3 py-2 rounded-xl text-xs text-green-400 border border-green-500/25 bg-green-500/8 hover:bg-green-500/15 transition-all flex-shrink-0"
        >
          Unlock All
        </button>
        <button
          onClick={lockAll}
          className="px-3 py-2 rounded-xl text-xs text-white/40 border border-white/12 hover:bg-white/8 transition-all flex-shrink-0"
        >
          Reset Locks
        </button>
      </div>

      {/* World list */}
      <div className="flex flex-col gap-3">
        {filteredWorlds.map((world, i) => (
          <WorldRow
            key={world.id}
            world={world}
            worldIdx={i}
            onToggle={handleToggleWorld}
            onUpdateLevel={handleUpdateLevel}
          />
        ))}
      </div>
    </div>
  )
}
