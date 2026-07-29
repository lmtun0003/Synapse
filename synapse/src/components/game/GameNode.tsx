import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import type { GridNode, NodeState, NodeType } from '@/types/game'

interface GameNodeProps {
  node: GridNode
  state: NodeState
  isConnected?: boolean
  isSelected?: boolean
  cellSize: number
  onActivate: (id: string) => void
  animationDelay?: number
}

const NODE_ICONS: Record<NodeType, string> = {
  basic: '',
  source: '◉',
  target: '◎',
  mirror: '◇',
  rotator: '↻',
  teleport: '⬡',
  gravity: '▽',
  inverter: '⊘',
  gate_and: '∧',
  gate_or: '∨',
  locked: '🔒',
  timed: '⏱',
  bridge: '⟷',
  relay: '◈',
}

const NODE_COLORS: Record<NodeType, { active: string; inactive: string; glow: string }> = {
  basic:    { active: 'bg-blue-500 border-blue-400', inactive: 'bg-white/5 border-white/15', glow: 'shadow-[0_0_16px_rgba(59,130,246,0.7)]' },
  source:   { active: 'bg-blue-400 border-blue-300', inactive: 'bg-blue-900/40 border-blue-500/40', glow: 'shadow-[0_0_24px_rgba(59,130,246,0.8)]' },
  target:   { active: 'bg-green-400 border-green-300', inactive: 'bg-green-900/20 border-green-500/30', glow: 'shadow-[0_0_24px_rgba(16,185,129,0.8)]' },
  mirror:   { active: 'bg-purple-400 border-purple-300', inactive: 'bg-purple-900/20 border-purple-500/30', glow: 'shadow-[0_0_16px_rgba(139,92,246,0.7)]' },
  rotator:  { active: 'bg-amber-400 border-amber-300', inactive: 'bg-amber-900/20 border-amber-500/30', glow: 'shadow-[0_0_16px_rgba(245,158,11,0.7)]' },
  teleport: { active: 'bg-pink-400 border-pink-300', inactive: 'bg-pink-900/20 border-pink-500/30', glow: 'shadow-[0_0_20px_rgba(236,72,153,0.7)]' },
  gravity:  { active: 'bg-orange-400 border-orange-300', inactive: 'bg-orange-900/20 border-orange-500/30', glow: 'shadow-[0_0_16px_rgba(251,146,60,0.7)]' },
  inverter: { active: 'bg-red-400 border-red-300', inactive: 'bg-red-900/20 border-red-500/30', glow: 'shadow-[0_0_16px_rgba(248,113,113,0.7)]' },
  gate_and: { active: 'bg-cyan-400 border-cyan-300', inactive: 'bg-cyan-900/20 border-cyan-500/30', glow: 'shadow-[0_0_16px_rgba(34,211,238,0.7)]' },
  gate_or:  { active: 'bg-teal-400 border-teal-300', inactive: 'bg-teal-900/20 border-teal-500/30', glow: 'shadow-[0_0_16px_rgba(45,212,191,0.7)]' },
  locked:   { active: 'bg-white/10 border-white/20', inactive: 'bg-white/5 border-white/10', glow: '' },
  timed:    { active: 'bg-yellow-400 border-yellow-300', inactive: 'bg-yellow-900/20 border-yellow-500/30', glow: 'shadow-[0_0_16px_rgba(250,204,21,0.7)]' },
  bridge:   { active: 'bg-indigo-400 border-indigo-300', inactive: 'bg-indigo-900/20 border-indigo-500/30', glow: 'shadow-[0_0_16px_rgba(129,140,248,0.7)]' },
  relay:    { active: 'bg-violet-400 border-violet-300', inactive: 'bg-violet-900/20 border-violet-500/30', glow: 'shadow-[0_0_16px_rgba(167,139,250,0.7)]' },
}

export function GameNode({
  node,
  state,
  isConnected,
  isSelected,
  cellSize,
  onActivate,
  animationDelay = 0,
}: GameNodeProps) {
  const isActive = state === 'active'
  const isLocked = state === 'locked'
  const colors = NODE_COLORS[node.type]
  const icon = NODE_ICONS[node.type]

  const nodeSize = Math.round(cellSize * 0.72)
  const fontSize = Math.round(nodeSize * 0.38)

  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{
        left: node.col * cellSize + (cellSize - nodeSize) / 2,
        top: node.row * cellSize + (cellSize - nodeSize) / 2,
        width: nodeSize,
        height: nodeSize,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22, delay: animationDelay }}
    >
      {/* Outer glow ring for active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="glow-ring"
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: colors.glow.replace('shadow-[', '').replace(']', '') }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Pulse ring for source nodes */}
      {node.type === 'source' && (
        <motion.div
          className="absolute rounded-full border border-blue-400/40"
          style={{ width: nodeSize + 12, height: nodeSize + 12 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Main node body */}
      <motion.button
        className={clsx(
          'relative flex items-center justify-center rounded-xl border-2 transition-colors duration-200',
          'focus:outline-none select-none',
          isActive ? `${colors.active} ${colors.glow}` : colors.inactive,
          isLocked ? 'cursor-not-allowed' : 'cursor-pointer',
          isSelected ? 'ring-2 ring-white/50 ring-offset-2 ring-offset-transparent' : '',
          node.type === 'source' ? 'cursor-default' : '',
        )}
        style={{
          width: nodeSize,
          height: nodeSize,
          fontSize,
          transform: node.type === 'rotator' ? `rotate(${node.rotation}deg)` : undefined,
        }}
        onClick={() => !isLocked && node.type !== 'source' && onActivate(node.id)}
        whileHover={(!isLocked && node.type !== 'source') ? { scale: 1.06 } : {}}
        whileTap={(!isLocked && node.type !== 'source') ? { scale: 0.93 } : {}}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        aria-label={`${node.type} node, ${isActive ? 'active' : 'inactive'}`}
        role="button"
      >
        {/* Inner glow for active state */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-xl opacity-30"
            style={{
              background: 'radial-gradient(circle at center, white, transparent 70%)',
            }}
          />
        )}

        {/* Node icon */}
        {icon && (
          <span
            className={clsx(
              'relative z-10 select-none font-bold',
              isActive ? 'text-white' : 'text-white/40'
            )}
            style={{ fontSize, lineHeight: 1 }}
          >
            {icon}
          </span>
        )}

        {/* Signal burst animation on activation */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              key="burst"
              className="absolute inset-0 rounded-xl bg-white"
              initial={{ opacity: 0.5, scale: 0.5 }}
              animate={{ opacity: 0, scale: 1.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ pointerEvents: 'none' }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Connection indicator dot */}
      {isConnected && !isActive && (
        <motion.div
          className="absolute w-1.5 h-1.5 rounded-full bg-blue-400"
          style={{ bottom: -4, right: -4 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  )
}
