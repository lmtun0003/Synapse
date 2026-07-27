import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import type { GridNode, NodeType } from '@/types/game'
import { useGameStore } from '@/store/gameStore'

const TOOLS: { type: NodeType | 'select' | 'delete'; icon: string; label: string; color: string }[] = [
  { type: 'select',   icon: '⊹',  label: 'Select',   color: 'text-white/60' },
  { type: 'basic',    icon: '○',  label: 'Basic',    color: 'text-white' },
  { type: 'source',   icon: '◉',  label: 'Source',   color: 'text-blue-400' },
  { type: 'target',   icon: '◎',  label: 'Target',   color: 'text-green-400' },
  { type: 'mirror',   icon: '◇',  label: 'Mirror',   color: 'text-purple-400' },
  { type: 'rotator',  icon: '↻',  label: 'Rotator',  color: 'text-amber-400' },
  { type: 'teleport', icon: '⬡',  label: 'Teleport', color: 'text-pink-400' },
  { type: 'inverter', icon: '⊘',  label: 'Inverter', color: 'text-red-400' },
  { type: 'locked',   icon: '🔒', label: 'Lock',     color: 'text-white/40' },
  { type: 'delete',   icon: '✕',  label: 'Delete',   color: 'text-red-400' },
]

const CELL_SIZE = 52

function CreatorGrid({
  rows,
  cols,
  nodes,
  selectedTool,
  onCellClick,
}: {
  rows: number
  cols: number
  nodes: GridNode[]
  selectedTool: NodeType | 'select' | 'delete'
  onCellClick: (row: number, col: number) => void
}) {
  const nodeMap = new Map(nodes.map(n => [`${n.row},${n.col}`, n]))
  const NODE_ICONS: Record<string, string> = {
    basic: '○', source: '◉', target: '◎', mirror: '◇',
    rotator: '↻', teleport: '⬡', inverter: '⊘', locked: '🔒',
    timed: '⏱', bridge: '⟷', relay: '◈', gate_and: '∧', gate_or: '∨', gravity: '▽',
  }
  const NODE_COLORS: Record<string, string> = {
    basic:    'text-white/60 border-white/20 bg-white/4',
    source:   'text-blue-400 border-blue-500/50 bg-blue-500/12',
    target:   'text-green-400 border-green-500/50 bg-green-500/12',
    mirror:   'text-purple-400 border-purple-500/50 bg-purple-500/12',
    rotator:  'text-amber-400 border-amber-500/50 bg-amber-500/12',
    teleport: 'text-pink-400 border-pink-500/50 bg-pink-500/12',
    inverter: 'text-red-400 border-red-500/50 bg-red-500/12',
    locked:   'text-white/30 border-white/10 bg-white/3',
    gravity:  'text-orange-400 border-orange-500/50 bg-orange-500/12',
    relay:    'text-violet-400 border-violet-500/50 bg-violet-500/12',
  }

  return (
    <div
      className="relative select-none"
      style={{ width: cols * CELL_SIZE, height: rows * CELL_SIZE }}
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const node = nodeMap.get(`${r},${c}`)
          return (
            <motion.button
              key={`${r},${c}`}
              className={clsx(
                'absolute border-2 rounded-xl flex items-center justify-center text-base transition-all duration-100',
                'hover:bg-white/10 focus:outline-none',
                node
                  ? NODE_COLORS[node.type] ?? 'text-white/60 border-white/20 bg-white/4'
                  : 'border-dashed border-white/10 bg-white/2 text-white/12 hover:border-white/25 hover:text-white/25'
              )}
              style={{
                left: c * CELL_SIZE + 3,
                top: r * CELL_SIZE + 3,
                width: CELL_SIZE - 6,
                height: CELL_SIZE - 6,
              }}
              onClick={() => onCellClick(r, c)}
              whileTap={{ scale: 0.92 }}
            >
              {node ? NODE_ICONS[node.type] ?? '?' : '＋'}
            </motion.button>
          )
        })
      )}
    </div>
  )
}

// ─── Publish Modal ────────────────────────────────────────────────────────────

const DIFFICULTY_OPTIONS = [
  { id: 'easy',   label: 'Easy',   icon: '🌱' },
  { id: 'medium', label: 'Medium', icon: '⚡' },
  { id: 'hard',   label: 'Hard',   icon: '🔥' },
  { id: 'expert', label: 'Expert', icon: '💀' },
]

const TAG_OPTIONS = ['beginner', 'advanced', 'mirrors', 'teleport', 'inverter', 'gravity', 'rotator', 'classic', 'tricky', 'precise']

function PublishModal({
  puzzleTitle,
  onPublish,
  onClose,
}: {
  puzzleTitle: string
  onPublish: (description: string, tags: string[]) => void
  onClose: () => void
}) {
  const [description, setDescription] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag].slice(0, 4)
    )
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <GlassCard padding="none" rounded="3xl" className="overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-white/6">
            <h2 className="text-white font-bold text-lg mb-0.5">Publish Puzzle</h2>
            <p className="text-white/40 text-sm truncate">{puzzleTitle}</p>
          </div>

          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Description */}
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Describe your puzzle…"
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={120}
                className="w-full glass rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none resize-none border border-white/8 focus:border-white/20 transition-colors"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">
                Tags <span className="normal-case text-white/25">(up to 4)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TAG_OPTIONS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={clsx(
                      'px-2.5 py-1 rounded-lg text-xs border transition-all',
                      selectedTags.includes(tag)
                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                        : 'glass border-white/10 text-white/40 hover:text-white/70'
                    )}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="text-white/30 text-xs bg-white/3 rounded-xl px-3 py-2.5 border border-white/6">
              ✦ Publishing earns you <span className="text-amber-400">+10 Sparks</span>. Players can rate your puzzle after completing it.
            </div>

            {/* Buttons */}
            <div className="flex gap-2.5">
              <Button variant="ghost" size="md" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => onPublish(description, selectedTags)}
                glow
              >
                🚀 Publish
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function PuzzleCreatorPage() {
  const navigate = useNavigate()
  const { startGame, publishPuzzle, publishedPuzzles } = useGameStore()

  const [rows, setRows] = useState(4)
  const [cols, setCols] = useState(4)
  const [nodes, setNodes] = useState<GridNode[]>([])
  const [selectedTool, setSelectedTool] = useState<NodeType | 'select' | 'delete'>('source')
  const [title, setTitle] = useState('')
  const [perfectMoves, setPerfectMoves] = useState(4)
  const [shareCode, setShareCode] = useState<string | null>(null)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [publishedCode, setPublishedCode] = useState<string | null>(null)
  const [tab, setTab] = useState<'build' | 'published'>('build')

  const handleCellClick = useCallback((row: number, col: number) => {
    if (selectedTool === 'delete') {
      setNodes(prev => prev.filter(n => !(n.row === row && n.col === col)))
      return
    }
    if (selectedTool === 'select') return

    const type = selectedTool as NodeType
    const newNode: GridNode = {
      id: `creator_${row}_${col}`,
      row, col, type,
      state: type === 'source' ? 'active' : 'inactive',
      rotation: 0,
      connections: ['N', 'S', 'E', 'W'],
    }

    setNodes(prev => {
      const existingIdx = prev.findIndex(n => n.row === row && n.col === col)
      if (existingIdx >= 0) return prev.map((n, i) => i === existingIdx ? newNode : n)
      return [...prev, newNode]
    })
  }, [selectedTool])

  const buildPuzzle = () => ({
    id: 'creator_test',
    title: title.trim() || 'Untitled Puzzle',
    rows, cols,
    mechanics: ['basic' as NodeType],
    targetMoves: { perfect: perfectMoves, gold: perfectMoves + 2, silver: perfectMoves + 4, bronze: perfectMoves + 8 },
    connections: [],
    grid: nodes,
  })

  const handleTest = () => {
    startGame(buildPuzzle(), 'practice')
    navigate('/play')
  }

  const handleShare = () => {
    const data = { rows, cols, nodes: nodes.map(n => ({ ...n })), perfectMoves, title }
    const code = btoa(JSON.stringify(data)).slice(0, 12).toUpperCase()
    setShareCode(code)
    navigator.clipboard?.writeText(code).catch(() => {})
  }

  const handlePublish = (description: string, tags: string[]) => {
    const puzzle = { ...buildPuzzle(), id: `community_${Date.now()}` }
    const cp = publishPuzzle(puzzle, description, tags)
    setPublishedCode(cp.shareCode)
    setShowPublishModal(false)
    navigator.clipboard?.writeText(cp.shareCode).catch(() => {})
  }

  const handleClear = () => { setNodes([]); setTitle('') }

  const hasSource = nodes.some(n => n.type === 'source')
  const hasTarget = nodes.some(n => n.type === 'target')
  const canTest = hasSource && hasTarget

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-5"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white"
        >←</button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Creator</h1>
          <p className="text-white/40 text-xs">Design, test, and share your puzzles</p>
        </div>
        <button
          onClick={() => navigate('/community')}
          className="glass rounded-xl px-3 py-1.5 text-white/60 hover:text-white text-xs font-medium transition-colors border border-white/8"
        >
          Browse →
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl mb-4">
        {(['build', 'published'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize',
              tab === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
            )}
          >
            {t === 'build' ? '✏️ Build' : `📦 Published (${publishedPuzzles.length})`}
          </button>
        ))}
      </div>

      {/* Published tab */}
      {tab === 'published' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          {publishedPuzzles.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <div className="text-4xl mb-3">📦</div>
              <div className="text-white font-semibold mb-1">No published puzzles yet</div>
              <div className="text-white/40 text-sm">Build a puzzle and hit Publish to share it with the community.</div>
            </div>
          ) : (
            publishedPuzzles.map((cp, i) => (
              <GlassCard key={cp.id} padding="sm" rounded="xl" animate delay={i * 0.06}>
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm truncate">{cp.title}</div>
                    <div className="text-white/40 text-xs mt-0.5">
                      {cp.playCount} plays · ⭐ {cp.averageRating > 0 ? cp.averageRating.toFixed(1) : '—'} ({cp.ratingCount} ratings)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" size="xs" className="font-mono">{cp.shareCode}</Badge>
                    <button
                      className="text-white/30 hover:text-white text-xs glass rounded-lg px-2 py-1"
                      onClick={() => navigate('/community')}
                    >
                      View
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </motion.div>
      )}

      {/* Build tab */}
      {tab === 'build' && (
        <>
          {/* Title input */}
          <input
            type="text"
            placeholder="Puzzle title…"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="glass rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none border border-white/8 focus:border-white/20 transition-colors mb-3"
          />

          {/* Grid size */}
          <GlassCard padding="sm" rounded="xl" className="mb-3">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-white/50 text-xs">Rows</span>
              <div className="flex items-center gap-1.5">
                {[3, 4, 5, 6].map(n => (
                  <button key={n} onClick={() => setRows(n)}
                    className={clsx('w-7 h-7 rounded-lg text-xs font-medium transition-all', rows === n ? 'bg-blue-500 text-white' : 'glass text-white/50 hover:text-white')}>
                    {n}
                  </button>
                ))}
              </div>
              <span className="text-white/30 text-xs">×</span>
              <span className="text-white/50 text-xs">Cols</span>
              <div className="flex items-center gap-1.5">
                {[3, 4, 5, 6, 7].map(n => (
                  <button key={n} onClick={() => setCols(n)}
                    className={clsx('w-7 h-7 rounded-lg text-xs font-medium transition-all', cols === n ? 'bg-blue-500 text-white' : 'glass text-white/50 hover:text-white')}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Tool palette */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
            {TOOLS.map(tool => (
              <button
                key={tool.type}
                onClick={() => setSelectedTool(tool.type)}
                className={clsx(
                  'flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border transition-all',
                  selectedTool === tool.type ? 'bg-white/12 border-white/25' : 'glass border-white/8 hover:bg-white/7'
                )}
              >
                <span className={clsx('text-base', tool.color)}>{tool.icon}</span>
                <span className="text-white/50 text-[9px]">{tool.label}</span>
              </button>
            ))}
          </div>

          {/* Canvas */}
          <div className="flex justify-center mb-3">
            <motion.div
              className="glass rounded-2xl p-3 border border-white/8"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <CreatorGrid
                rows={rows} cols={cols}
                nodes={nodes}
                selectedTool={selectedTool}
                onCellClick={handleCellClick}
              />
            </motion.div>
          </div>

          {/* Validation pills */}
          <div className="flex gap-2 mb-3">
            {[
              { ok: hasSource, label: 'Source node', icon: '◉' },
              { ok: hasTarget, label: 'Target node', icon: '◎' },
            ].map(v => (
              <div key={v.label} className={clsx(
                'flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs',
                v.ok ? 'bg-green-500/8 border-green-500/25 text-green-400' : 'bg-red-500/6 border-red-500/15 text-red-400/60'
              )}>
                <span>{v.icon}</span>
                <span>{v.ok ? '✓' : '✗'} {v.label}</span>
              </div>
            ))}
          </div>

          {/* Perfect moves */}
          <GlassCard padding="sm" rounded="xl" className="mb-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-white/50 text-xs">Perfect in</span>
              <div className="flex items-center gap-1.5">
                {[2, 3, 4, 5, 6, 8, 10].map(n => (
                  <button key={n} onClick={() => setPerfectMoves(n)}
                    className={clsx('w-7 h-7 rounded-lg text-xs transition-all', perfectMoves === n ? 'bg-blue-500 text-white' : 'glass text-white/50')}>
                    {n}
                  </button>
                ))}
              </div>
              <span className="text-white/30 text-xs">moves</span>
            </div>
          </GlassCard>

          {/* Success states */}
          <AnimatePresence>
            {publishedCode && (
              <motion.div
                className="glass border border-blue-500/30 rounded-xl px-4 py-3 mb-3 flex items-center gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <span className="text-blue-400 text-lg">🚀</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold">Published!</div>
                  <div className="text-white/40 text-xs">Share code: <span className="font-mono text-white/70">{publishedCode}</span> (copied)</div>
                </div>
                <button onClick={() => navigate('/community')} className="text-blue-400 text-xs hover:text-blue-300">
                  Browse →
                </button>
              </motion.div>
            )}

            {shareCode && !publishedCode && (
              <motion.div
                className="glass border border-green-500/25 rounded-xl px-4 py-3 mb-3 flex items-center gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <span className="text-green-400">✓</span>
                <div>
                  <div className="text-white text-sm font-mono font-semibold">{shareCode}</div>
                  <div className="text-white/40 text-xs">Share code copied!</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex flex-col gap-2.5">
            <div className="flex gap-2.5">
              <Button variant="primary" size="lg" className="flex-1" disabled={!canTest} onClick={handleTest} glow={canTest}>
                ▶ Test
              </Button>
              <Button variant="secondary" size="lg" disabled={!canTest} onClick={handleShare}>
                Link
              </Button>
              <Button variant="gold" size="lg" disabled={!canTest} onClick={() => setShowPublishModal(true)}>
                Publish
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClear} className="w-full text-white/30 hover:text-white/60">
              Clear all
            </Button>
          </div>
        </>
      )}

      {/* Publish modal */}
      <AnimatePresence>
        {showPublishModal && (
          <PublishModal
            puzzleTitle={title.trim() || 'Untitled Puzzle'}
            onPublish={handlePublish}
            onClose={() => setShowPublishModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
