import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
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
    basic: 'text-white/70 border-white/20',
    source: 'text-blue-400 border-blue-500/50 bg-blue-500/10',
    target: 'text-green-400 border-green-500/50 bg-green-500/10',
    mirror: 'text-purple-400 border-purple-500/50 bg-purple-500/10',
    rotator: 'text-amber-400 border-amber-500/50 bg-amber-500/10',
    teleport: 'text-pink-400 border-pink-500/50 bg-pink-500/10',
    inverter: 'text-red-400 border-red-500/50 bg-red-500/10',
    locked: 'text-white/30 border-white/10 bg-white/3',
    gravity: 'text-orange-400 border-orange-500/50 bg-orange-500/10',
    relay: 'text-violet-400 border-violet-500/50 bg-violet-500/10',
  }

  return (
    <div
      className="relative select-none"
      style={{ width: cols * CELL_SIZE, height: rows * CELL_SIZE }}
    >
      {/* Grid cells */}
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const node = nodeMap.get(`${r},${c}`)
          const key = `${r},${c}`
          return (
            <button
              key={key}
              className={clsx(
                'absolute border rounded-xl flex items-center justify-center text-base transition-all duration-150',
                'hover:bg-white/8 focus:outline-none',
                node
                  ? NODE_COLORS[node.type] ?? 'text-white/70 border-white/20'
                  : 'border-white/8 bg-white/2 text-white/10 hover:border-white/20'
              )}
              style={{
                left: c * CELL_SIZE + 3,
                top: r * CELL_SIZE + 3,
                width: CELL_SIZE - 6,
                height: CELL_SIZE - 6,
              }}
              onClick={() => onCellClick(r, c)}
            >
              {node ? NODE_ICONS[node.type] ?? '?' : '+'}
            </button>
          )
        })
      )}
    </div>
  )
}

export function PuzzleCreatorPage() {
  const navigate = useNavigate()
  const { startGame } = useGameStore()
  const [rows, setRows] = useState(4)
  const [cols, setCols] = useState(4)
  const [nodes, setNodes] = useState<GridNode[]>([])
  const [selectedTool, setSelectedTool] = useState<NodeType | 'select' | 'delete'>('source')
  const [title, setTitle] = useState('')
  const [testMode, setTestMode] = useState(false)
  const [perfectMoves, setPerfectMoves] = useState(4)
  const [shareCode, setShareCode] = useState<string | null>(null)

  const handleCellClick = useCallback((row: number, col: number) => {
    const existingIdx = nodes.findIndex(n => n.row === row && n.col === col)

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

    if (existingIdx >= 0) {
      setNodes(prev => prev.map((n, i) => i === existingIdx ? newNode : n))
    } else {
      setNodes(prev => [...prev, newNode])
    }
  }, [nodes, selectedTool])

  const handleTest = () => {
    const puzzle = {
      id: 'creator_test',
      title: title || 'My Puzzle',
      rows, cols,
      mechanics: ['basic' as NodeType],
      targetMoves: { perfect: perfectMoves, gold: perfectMoves + 2, silver: perfectMoves + 4, bronze: perfectMoves + 8 },
      connections: [],
      grid: nodes,
    }
    startGame(puzzle, 'practice')
    navigate('/play')
  }

  const handleShare = () => {
    const data = { rows, cols, nodes: nodes.map(n => ({ ...n })), perfectMoves, title }
    const code = btoa(JSON.stringify(data)).slice(0, 12).toUpperCase()
    setShareCode(code)
    navigator.clipboard?.writeText(code)
  }

  const handleClear = () => setNodes([])

  const nodeCount = nodes.length
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
          <h1 className="text-xl font-bold text-white">Puzzle Creator</h1>
          <p className="text-white/40 text-xs">Design, test, and share your puzzles</p>
        </div>
        <Badge variant="blue" size="sm">{nodeCount} nodes</Badge>
      </motion.div>

      {/* Grid size controls */}
      <GlassCard padding="sm" rounded="xl" className="mb-4">
        <div className="flex items-center gap-4">
          <span className="text-white/50 text-xs">Grid Size</span>
          <div className="flex items-center gap-2">
            {[3, 4, 5, 6].map(n => (
              <button
                key={`row-${n}`}
                onClick={() => setRows(n)}
                className={clsx(
                  'w-7 h-7 rounded-lg text-xs font-medium transition-all',
                  rows === n ? 'bg-blue-500 text-white' : 'glass text-white/50 hover:text-white'
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <span className="text-white/30">×</span>
          <div className="flex items-center gap-2">
            {[3, 4, 5, 6, 7].map(n => (
              <button
                key={`col-${n}`}
                onClick={() => setCols(n)}
                className={clsx(
                  'w-7 h-7 rounded-lg text-xs font-medium transition-all',
                  cols === n ? 'bg-blue-500 text-white' : 'glass text-white/50 hover:text-white'
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Tool palette */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {TOOLS.map(tool => (
          <button
            key={tool.type}
            onClick={() => setSelectedTool(tool.type)}
            className={clsx(
              'flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border transition-all',
              selectedTool === tool.type
                ? 'bg-white/12 border-white/25'
                : 'glass border-white/8 hover:bg-white/7'
            )}
          >
            <span className={clsx('text-base', tool.color)}>{tool.icon}</span>
            <span className="text-white/50 text-[9px]">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="flex justify-center mb-4">
        <motion.div
          className="glass rounded-2xl p-4"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <CreatorGrid
            rows={rows}
            cols={cols}
            nodes={nodes}
            selectedTool={selectedTool}
            onCellClick={handleCellClick}
          />
        </motion.div>
      </div>

      {/* Validation */}
      <div className="flex gap-2 mb-4">
        {[
          { ok: hasSource, label: 'Source node', icon: '◉' },
          { ok: hasTarget, label: 'Target node', icon: '◎' },
        ].map(v => (
          <div key={v.label} className={clsx(
            'flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs',
            v.ok ? 'bg-green-500/8 border-green-500/25 text-green-400' : 'bg-red-500/8 border-red-500/20 text-red-400/70'
          )}>
            <span>{v.icon}</span>
            <span>{v.ok ? '✓' : '✗'} {v.label}</span>
          </div>
        ))}
      </div>

      {/* Settings */}
      <GlassCard padding="sm" rounded="xl" className="mb-4">
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-xs">Perfect moves:</span>
          <div className="flex items-center gap-2">
            {[2, 3, 4, 5, 6, 8, 10].map(n => (
              <button
                key={n}
                onClick={() => setPerfectMoves(n)}
                className={clsx(
                  'w-7 h-7 rounded-lg text-xs transition-all',
                  perfectMoves === n ? 'bg-blue-500 text-white' : 'glass text-white/50'
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Share code */}
      {shareCode && (
        <motion.div
          className="glass border border-green-500/25 rounded-xl px-4 py-3 mb-4 flex items-center gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-green-400">✓</span>
          <div>
            <div className="text-white text-sm font-mono font-semibold">{shareCode}</div>
            <div className="text-white/40 text-xs">Copied to clipboard!</div>
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-2.5">
        <div className="flex gap-2.5">
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={!canTest}
            onClick={handleTest}
            glow={canTest}
          >
            ▶ Test Puzzle
          </Button>
          <Button
            variant="secondary"
            size="lg"
            disabled={!canTest}
            onClick={handleShare}
          >
            Share
          </Button>
        </div>
        <Button variant="ghost" size="md" onClick={handleClear} className="w-full">
          Clear All
        </Button>
      </div>
    </div>
  )
}
