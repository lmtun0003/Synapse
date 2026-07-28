import { motion } from 'framer-motion'
import clsx from 'clsx'
import type { PuzzleNode } from '@/engine/types'

interface NodeViewProps {
  node: PuzzleNode
  size: number
  onTap: (id: string) => void
  disabled?: boolean
}

const FACING_ROTATION = { N: 0, E: 90, S: 180, W: 270 } as const

export function NodeView({ node, size, onTap, disabled }: NodeViewProps) {
  const interactive = node.interactive && !disabled && !(node.mechanic === 'locked' && node.locked)

  return (
    <motion.button
      type="button"
      aria-label={`Node ${node.id}${node.active ? ' active' : ' inactive'}`}
      disabled={!interactive}
      onClick={() => onTap(node.id)}
      className={clsx(
        'relative flex items-center justify-center rounded-full focus-ring',
        interactive ? 'cursor-pointer' : 'cursor-default',
      )}
      style={{ width: size, height: size }}
      whileHover={interactive ? { scale: 1.06 } : undefined}
      whileTap={interactive ? { scale: 0.94 } : undefined}
      animate={{
        scale: node.active ? 1 : 0.92,
      }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
    >
      {/* Outer glow */}
      <motion.span
        className="absolute inset-[-18%] rounded-full"
        animate={{
          opacity: node.active ? 0.55 : 0,
          scale: node.active ? 1 : 0.7,
        }}
        style={{
          background:
            'radial-gradient(circle, rgba(59,130,246,0.45) 0%, transparent 70%)',
        }}
      />

      {/* Core */}
      <motion.span
        className={clsx(
          'absolute inset-[12%] rounded-full border',
          node.active
            ? 'border-[rgba(59,130,246,0.65)] bg-[rgba(59,130,246,0.35)]'
            : 'border-[var(--color-border-strong)] bg-[var(--color-surface-strong)]',
          node.mechanic === 'locked' && node.locked && 'border-[var(--color-warning)]',
        )}
        layout
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />

      {/* Inner kernel */}
      <motion.span
        className="absolute inset-[34%] rounded-full"
        animate={{
          backgroundColor: node.active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.18)',
          boxShadow: node.active
            ? '0 0 18px rgba(59,130,246,0.65)'
            : '0 0 0 rgba(0,0,0,0)',
        }}
      />

      {/* Mechanic glyphs */}
      {node.mechanic === 'rotation' && node.facing && (
        <motion.span
          className="absolute inset-0 flex items-start justify-center pt-[18%] text-[10px] text-[var(--color-accent)]"
          animate={{ rotate: FACING_ROTATION[node.facing] }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          ▲
        </motion.span>
      )}
      {node.mechanic === 'mirror' && (
        <span className="absolute text-[11px] text-[var(--color-secondary)]">⟋</span>
      )}
      {node.mechanic === 'teleporter' && (
        <span className="absolute text-[10px] text-[var(--color-accent)]">◎</span>
      )}
      {node.mechanic === 'gravity' && (
        <span className="absolute text-[10px] text-[var(--color-secondary)]">◉</span>
      )}
      {node.mechanic === 'inverter' && (
        <span className="absolute text-[10px] text-[var(--color-secondary)]">⊘</span>
      )}
      {node.mechanic === 'power_link' && (
        <span className="absolute text-[10px] text-[var(--color-success)]">⚡</span>
      )}
      {node.mechanic === 'locked' && node.locked && (
        <span className="absolute text-[10px] text-[var(--color-warning)]">⬡</span>
      )}
      {node.mechanic === 'logic_gate' && (
        <span className="absolute text-[9px] font-medium tracking-wider text-[var(--color-success)]">
          {node.gateType}
        </span>
      )}
      {node.mechanic === 'timed' && typeof node.timer === 'number' && (
        <span className="absolute text-[10px] text-[var(--color-warning)]">{node.timer}</span>
      )}
    </motion.button>
  )
}
