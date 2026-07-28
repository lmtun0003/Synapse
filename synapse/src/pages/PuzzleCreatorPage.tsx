import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import type { GridNode, NodeType } from '@/types/game'
import { useGameStore } from '@/store/gameStore'

// ─── Node Definitions ─────────────────────────────────────────────────────────

interface NodeDef {
  type: NodeType | 'delete'
  icon: string
  label: string
  description: string
  color: string
  glow: string
  bg: string
  group: string
}

const NODE_PALETTE: NodeDef[] = [
  // Core
  { type: 'source',   icon: '◉', label: 'Source',   description: 'Always active. Signal origin.',        color: '#3B82F6', glow: 'rgba(59,130,246,0.5)',  bg: 'rgba(59,130,246,0.12)',  group: 'Core' },
  { type: 'target',   icon: '◎', label: 'Target',   description: 'Must receive signal to win.',          color: '#10B981', glow: 'rgba(16,185,129,0.5)',  bg: 'rgba(16,185,129,0.12)',  group: 'Core' },
  { type: 'basic',    icon: '○', label: 'Node',     description: 'Passes signal when activated.',        color: '#CBD5E1', glow: 'rgba(203,213,225,0.3)', bg: 'rgba(255,255,255,0.06)', group: 'Core' },
  { type: 'relay',    icon: '◈', label: 'Relay',    description: 'Broadcasts in all connected dirs.',    color: '#A78BFA', glow: 'rgba(167,139,250,0.5)', bg: 'rgba(167,139,250,0.12)', group: 'Core' },
  // Mechanics
  { type: 'mirror',   icon: '◇', label: 'Mirror',   description: 'Reflects signal 90° on contact.',      color: '#8B5CF6', glow: 'rgba(139,92,246,0.5)',  bg: 'rgba(139,92,246,0.12)',  group: 'Mechanics' },
  { type: 'rotator',  icon: '↻', label: 'Rotator',  description: 'Tapping rotates its connections.',      color: '#F59E0B', glow: 'rgba(245,158,11,0.5)',  bg: 'rgba(245,158,11,0.12)',  group: 'Mechanics' },
  { type: 'gravity',  icon: '▽', label: 'Gravity',  description: 'Forces signal to travel downward.',     color: '#F97316', glow: 'rgba(249,115,22,0.5)',  bg: 'rgba(249,115,22,0.12)',  group: 'Mechanics' },
  { type: 'teleport', icon: '⬡', label: 'Teleport', description: 'Paired nodes. Signal jumps between.',  color: '#EC4899', glow: 'rgba(236,72,153,0.5)',  bg: 'rgba(236,72,153,0.12)',  group: 'Mechanics' },
  { type: 'inverter', icon: '⊘', label: 'Inverter', description: 'Flips active ↔ inactive on contact.',  color: '#EF4444', glow: 'rgba(239,68,68,0.5)',   bg: 'rgba(239,68,68,0.12)',   group: 'Mechanics' },
  // Logic
  { type: 'gate_and', icon: '∧', label: 'AND Gate', description: 'Needs ALL inputs to activate.',        color: '#06B6D4', glow: 'rgba(6,182,212,0.5)',   bg: 'rgba(6,182,212,0.12)',   group: 'Logic' },
  { type: 'gate_or',  icon: '∨', label: 'OR Gate',  description: 'Needs any ONE input to activate.',     color: '#14B8A6', glow: 'rgba(20,184,166,0.5)',  bg: 'rgba(20,184,166,0.12)',  group: 'Logic' },
  // Special
  { type: 'locked',   icon: '🔒', label: 'Locked',  description: 'Permanent obstacle. Cannot activate.', color: '#475569', glow: 'rgba(71,85,105,0.4)',   bg: 'rgba(255,255,255,0.04)', group: 'Special' },
  { type: 'delete',   icon: '✕',  label: 'Delete',  description: 'Click a node to remove it.',           color: '#EF4444', glow: 'rgba(239,68,68,0.4)',   bg: 'rgba(239,68,68,0.06)',   group: 'Special' },
]

const GROUPS = ['Core', 'Mechanics', 'Logic', 'Special']

// ─── Creator Grid Canvas ─────────────────────────────────────────────────────

const CELL = 54

function CreatorGrid({
  rows, cols, nodes, selectedType, onCellClick,
}: {
  rows: number; cols: number; nodes: GridNode[]
  selectedType: NodeType | 'delete'
  onCellClick: (r: number, c: number) => void
}) {
  const nodeMap = new Map(nodes.map(n => [`${n.row},${n.col}`, n]))
  const nodeDef = (type: NodeType): NodeDef => NODE_PALETTE.find(d => d.type === type) ?? NODE_PALETTE[2]

  return (
    <div
      className="relative select-none"
      style={{ width: cols * CELL, height: rows * CELL }}
    >
      {/* Background dots */}
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const node = nodeMap.get(`${r},${c}`)
          const def = node ? nodeDef(node.type) : null
          return (
            <motion.button
              key={`${r},${c}`}
              className={clsx(
                'absolute rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-100',
                'focus:outline-none overflow-hidden',
                node ? '' : 'border-dashed border-white/12 bg-white/2 hover:border-white/30 hover:bg-white/5'
              )}
              style={{
                left: c * CELL + 3, top: r * CELL + 3,
                width: CELL - 6, height: CELL - 6,
                background: node ? def!.bg : undefined,
                borderColor: node ? def!.color + '80' : undefined,
                boxShadow: node ? `0 0 10px ${def!.glow}` : undefined,
              }}
              onClick={() => onCellClick(r, c)}
              whileTap={{ scale: 0.9 }}
            >
              {node ? (
                <>
                  <span className="text-lg leading-none" style={{ color: def!.color }}>{def!.icon}</span>
                  <span className="text-[9px] mt-0.5 font-medium" style={{ color: def!.color + 'CC' }}>{def!.label}</span>
                </>
              ) : (
                <span className="text-white/15 text-xs">+</span>
              )}
            </motion.button>
          )
        })
      )}
    </div>
  )
}

// ─── Node Palette Side Panel ──────────────────────────────────────────────────

function NodePalette({
  selected, onSelect,
}: {
  selected: NodeType | 'delete'
  onSelect: (type: NodeType | 'delete') => void
}) {
  const [expanded, setExpanded] = useState<string | null>('Core')

  return (
    <div className="flex flex-col gap-2 w-36 flex-shrink-0">
      <div className="text-white/30 text-[10px] uppercase tracking-widest px-1 mb-0.5">Nodes</div>

      {GROUPS.map(group => {
        const items = NODE_PALETTE.filter(n => n.group === group)
        const isOpen = expanded === group
        const hasSelected = items.some(i => i.type === selected)

        return (
          <div key={group} className="rounded-xl overflow-hidden border border-white/8">
            {/* Group header */}
            <button
              className={clsx(
                'w-full flex items-center justify-between px-3 py-2 text-left transition-colors',
                hasSelected ? 'bg-white/8' : 'bg-white/3 hover:bg-white/5'
              )}
              onClick={() => setExpanded(isOpen ? null : group)}
            >
              <span className={clsx('text-xs font-semibold', hasSelected ? 'text-white' : 'text-white/50')}>{group}</span>
              <span className="text-white/30 text-[10px]">{isOpen ? '▲' : '▼'}</span>
            </button>

            {/* Node buttons */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden"
                >
                  <div className="p-1.5 flex flex-col gap-1 bg-black/20">
                    {items.map(def => {
                      const isSelected = selected === def.type
                      return (
                        <motion.button
                          key={def.type}
                          onClick={() => onSelect(def.type as NodeType | 'delete')}
                          className={clsx(
                            'w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all text-left',
                            'border focus:outline-none',
                            isSelected
                              ? 'border-opacity-60'
                              : 'border-transparent hover:bg-white/5'
                          )}
                          style={isSelected ? {
                            background: def.bg,
                            borderColor: def.color + '80',
                            boxShadow: `0 0 8px ${def.glow}`,
                          } : {}}
                          whileTap={{ scale: 0.95 }}
                          title={def.description}
                        >
                          <span
                            className="text-base w-5 text-center flex-shrink-0 leading-none"
                            style={{ color: isSelected ? def.color : def.color + '80' }}
                          >
                            {def.icon}
                          </span>
                          <div className="min-w-0">
                            <div className={clsx('text-xs font-medium leading-tight truncate', isSelected ? 'text-white' : 'text-white/55')}>
                              {def.label}
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      {/* Help tip */}
      <div className="mt-2 px-2 py-2.5 rounded-xl bg-white/2 border border-white/6 text-white/25 text-[10px] leading-relaxed">
        Select a node type then click any cell to place it. Click an existing node to replace it.
      </div>
    </div>
  )
}

// ─── Publish Modal ────────────────────────────────────────────────────────────

const TAG_OPTIONS = ['beginner', 'advanced', 'mirrors', 'teleport', 'inverter', 'gravity', 'rotator', 'classic', 'tricky', 'precise']

function PublishModal({ puzzleTitle, onPublish, onClose }: {
  puzzleTitle: string
  onPublish: (description: string, tags: string[]) => void
  onClose: () => void
}) {
  const [description, setDescription] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const toggleTag = (tag: string) => setSelectedTags(prev =>
    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag].slice(0, 4)
  )

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <GlassCard padding="none" rounded="3xl" className="overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-white/6">
            <h2 className="text-white font-bold text-lg mb-0.5">Publish Puzzle</h2>
            <p className="text-white/40 text-sm truncate">{puzzleTitle}</p>
          </div>
          <div className="px-6 py-5 flex flex-col gap-4">
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Description</label>
              <textarea
                rows={2}
                placeholder="Describe your puzzle…"
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={120}
                className="w-full glass rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none resize-none border border-white/8 focus:border-white/20"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Tags <span className="normal-case text-white/25">(up to 4)</span></label>
              <div className="flex flex-wrap gap-1.5">
                {TAG_OPTIONS.map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)}
                    className={clsx('px-2.5 py-1 rounded-lg text-xs border transition-all',
                      selectedTags.includes(tag) ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'glass border-white/10 text-white/40 hover:text-white/70'
                    )}>#{tag}</button>
                ))}
              </div>
            </div>
            <div className="text-white/30 text-xs bg-white/3 rounded-xl px-3 py-2.5 border border-white/6">
              ✦ Publishing earns you <span className="text-amber-400">+10 Sparks</span>. Players can rate your puzzle after completing it.
            </div>
            <div className="flex gap-2.5">
              <Button variant="ghost" size="md" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button variant="primary" size="md" className="flex-1" onClick={() => onPublish(description, selectedTags)} glow>🚀 Publish</Button>
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
  const [selectedType, setSelectedType] = useState<NodeType | 'delete'>('source')
  const [title, setTitle] = useState('')
  const [perfectMoves, setPerfectMoves] = useState(4)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [publishedCode, setPublishedCode] = useState<string | null>(null)
  const [tab, setTab] = useState<'build' | 'published'>('build')

  const handleCellClick = useCallback((row: number, col: number) => {
    if (selectedType === 'delete') {
      setNodes(prev => prev.filter(n => !(n.row === row && n.col === col)))
      return
    }
    const type = selectedType as NodeType
    const newNode: GridNode = {
      id: `creator_${row}_${col}`,
      row, col, type,
      state: type === 'source' ? 'active' : 'inactive',
      rotation: 0,
      connections: ['N', 'S', 'E', 'W'],
    }
    setNodes(prev => {
      const idx = prev.findIndex(n => n.row === row && n.col === col)
      return idx >= 0 ? prev.map((n, i) => i === idx ? newNode : n) : [...prev, newNode]
    })
  }, [selectedType])

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

  const handlePublish = (description: string, tags: string[]) => {
    const puzzle = { ...buildPuzzle(), id: `community_${Date.now()}` }
    const cp = publishPuzzle(puzzle, description, tags)
    setPublishedCode(cp.shareCode)
    setShowPublishModal(false)
    navigator.clipboard?.writeText(cp.shareCode).catch(() => {})
  }

  const hasSource = nodes.some(n => n.type === 'source')
  const hasTarget = nodes.some(n => n.type === 'target')
  const canTest = hasSource && hasTarget

  // Selected node def for preview
  const selectedDef = NODE_PALETTE.find(d => d.type === selectedType)

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-5"
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
      >
        <button onClick={() => navigate('/')} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white">←</button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Creator</h1>
          <p className="text-white/40 text-xs">Design, test, and share your puzzles</p>
        </div>
        <button onClick={() => navigate('/community')} className="glass rounded-xl px-3 py-1.5 text-white/60 hover:text-white text-xs font-medium border border-white/8">
          Browse →
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl mb-5">
        {(['build', 'published'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={clsx('flex-1 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60')}>
            {t === 'build' ? '✏️ Build' : `📦 Published (${publishedPuzzles.length})`}
          </button>
        ))}
      </div>

      {/* Published tab */}
      {tab === 'published' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
          {publishedPuzzles.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <div className="text-4xl mb-3">📦</div>
              <div className="text-white font-semibold mb-1">Nothing published yet</div>
              <div className="text-white/40 text-sm">Build a puzzle and hit Publish to share it.</div>
            </div>
          ) : (
            publishedPuzzles.map((cp, i) => (
              <GlassCard key={cp.id} padding="sm" rounded="xl" animate delay={i * 0.06}>
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm truncate">{cp.title}</div>
                    <div className="text-white/40 text-xs">{cp.playCount} plays · ⭐ {cp.averageRating > 0 ? cp.averageRating.toFixed(1) : '—'} ({cp.ratingCount})</div>
                  </div>
                  <Badge variant="default" size="xs" className="font-mono">{cp.shareCode}</Badge>
                  <button className="text-white/30 hover:text-white text-xs glass rounded-lg px-2 py-1" onClick={() => navigate('/community')}>View</button>
                </div>
              </GlassCard>
            ))
          )}
        </motion.div>
      )}

      {/* Build tab */}
      {tab === 'build' && (
        <div className="flex gap-5">
          {/* ── Left: Node Palette ─────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
            <NodePalette selected={selectedType} onSelect={setSelectedType} />
          </motion.div>

          {/* ── Right: Canvas + controls ──────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Selected node preview bar */}
            {selectedDef && (
              <motion.div
                key={selectedDef.type}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl mb-3 border"
                style={{ background: selectedDef.bg, borderColor: selectedDef.color + '50' }}
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                <span className="text-lg" style={{ color: selectedDef.color }}>{selectedDef.icon}</span>
                <div>
                  <div className="text-white text-sm font-semibold">{selectedDef.label}</div>
                  <div className="text-white/45 text-xs">{selectedDef.description}</div>
                </div>
                {selectedDef.type === 'delete' && (
                  <span className="ml-auto text-red-400/60 text-xs">Click nodes to remove</span>
                )}
              </motion.div>
            )}

            {/* Title input */}
            <input
              type="text"
              placeholder="Puzzle title…"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none border border-white/8 focus:border-white/20 mb-3"
            />

            {/* Grid size */}
            <GlassCard padding="sm" rounded="xl" className="mb-3">
              <div className="flex items-center gap-3 flex-wrap text-xs">
                <span className="text-white/40">Rows</span>
                <div className="flex gap-1">
                  {[3,4,5,6].map(n => (
                    <button key={n} onClick={() => setRows(n)}
                      className={clsx('w-7 h-7 rounded-lg font-medium transition-all', rows === n ? 'bg-blue-500 text-white' : 'glass text-white/50 hover:text-white')}>
                      {n}
                    </button>
                  ))}
                </div>
                <span className="text-white/25">×</span>
                <span className="text-white/40">Cols</span>
                <div className="flex gap-1">
                  {[3,4,5,6,7].map(n => (
                    <button key={n} onClick={() => setCols(n)}
                      className={clsx('w-7 h-7 rounded-lg font-medium transition-all', cols === n ? 'bg-blue-500 text-white' : 'glass text-white/50 hover:text-white')}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Canvas */}
            <div className="flex justify-center mb-3">
              <motion.div
                className="glass rounded-2xl p-3 border border-white/8"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
              >
                <CreatorGrid
                  rows={rows} cols={cols}
                  nodes={nodes}
                  selectedType={selectedType}
                  onCellClick={handleCellClick}
                />
              </motion.div>
            </div>

            {/* Node count + validation */}
            <div className="flex gap-2 mb-3 text-xs">
              <div className="flex-1 glass rounded-xl px-3 py-2 text-white/40">
                {nodes.length} node{nodes.length !== 1 ? 's' : ''} placed
              </div>
              {[
                { ok: hasSource, label: '◉ Source', color: '#3B82F6' },
                { ok: hasTarget, label: '◎ Target', color: '#10B981' },
              ].map(v => (
                <div key={v.label}
                  className={clsx('flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors', v.ok ? 'border-green-500/25 bg-green-500/8 text-green-400' : 'border-red-500/15 bg-red-500/5 text-red-400/60')}>
                  <span>{v.ok ? '✓' : '✗'}</span>
                  <span style={{ color: v.ok ? v.color : undefined }}>{v.label}</span>
                </div>
              ))}
            </div>

            {/* Perfect moves */}
            <GlassCard padding="sm" rounded="xl" className="mb-3">
              <div className="flex items-center gap-3 flex-wrap text-xs">
                <span className="text-white/40">Perfect in</span>
                <div className="flex gap-1">
                  {[2,3,4,5,6,8,10].map(n => (
                    <button key={n} onClick={() => setPerfectMoves(n)}
                      className={clsx('w-7 h-7 rounded-lg transition-all', perfectMoves === n ? 'bg-blue-500 text-white' : 'glass text-white/50')}>
                      {n}
                    </button>
                  ))}
                </div>
                <span className="text-white/25">moves</span>
              </div>
            </GlassCard>

            {/* Success banner */}
            <AnimatePresence>
              {publishedCode && (
                <motion.div
                  className="glass border border-blue-500/30 rounded-xl px-4 py-3 mb-3 flex items-center gap-3"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                >
                  <span className="text-blue-400 text-lg">🚀</span>
                  <div className="flex-1">
                    <div className="text-white text-sm font-semibold">Published!</div>
                    <div className="text-white/40 text-xs">Code: <span className="font-mono text-white/70">{publishedCode}</span> (copied)</div>
                  </div>
                  <button onClick={() => navigate('/community')} className="text-blue-400 text-xs hover:text-blue-300">Browse →</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-2.5">
              <Button variant="primary" size="lg" className="flex-1" disabled={!canTest} onClick={handleTest} glow={canTest}>▶ Test</Button>
              <Button variant="gold" size="lg" disabled={!canTest} onClick={() => setShowPublishModal(true)}>Publish</Button>
              <button
                onClick={() => { setNodes([]); setTitle(''); setPublishedCode(null) }}
                className="px-3 py-2 glass rounded-xl text-white/30 hover:text-white/60 text-xs transition-colors"
                title="Clear all"
              >✕ Clear</button>
            </div>
          </div>
        </div>
      )}

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
