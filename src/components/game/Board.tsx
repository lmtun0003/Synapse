import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { NodeView } from './NodeView'
import { SignalLayer } from './SignalLayer'
import type { BoardState, SignalEvent } from '@/engine/types'

interface BoardProps {
  board: BoardState
  events: SignalEvent[]
  onTap: (nodeId: string) => void
  disabled?: boolean
}

export function Board({ board, events, onTap, disabled }: BoardProps) {
  const maxDim = Math.max(board.width, board.height)
  const cellSize = maxDim <= 3 ? 72 : maxDim <= 4 ? 64 : 56
  const gap = 18
  const width = board.width * cellSize + (board.width - 1) * gap
  const height = board.height * cellSize + (board.height - 1) * gap

  const occupied = useMemo(
    () => new Set(board.nodes.map((n) => `${n.row}:${n.col}`)),
    [board.nodes],
  )

  return (
    <motion.div
      className="relative mx-auto"
      style={{ width, height }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Soft board plane */}
      <div
        className="absolute inset-[-28px] rounded-[2rem] border border-[var(--color-border)]"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
          boxShadow: 'var(--shadow-float)',
        }}
      />

      {/* Grid ghosts for empty cells */}
      {Array.from({ length: board.height }).map((_, r) =>
        Array.from({ length: board.width }).map((__, c) => {
          if (occupied.has(`${r}:${c}`)) return null
          return (
            <div
              key={`g-${r}-${c}`}
              className="absolute rounded-full border border-[var(--color-border)] opacity-30"
              style={{
                width: cellSize * 0.35,
                height: cellSize * 0.35,
                left: c * (cellSize + gap) + cellSize * 0.325,
                top: r * (cellSize + gap) + cellSize * 0.325,
              }}
            />
          )
        }),
      )}

      <SignalLayer
        nodes={board.nodes}
        events={events}
        cellSize={cellSize}
        gap={gap}
        originX={0}
        originY={0}
      />

      {board.nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute"
          layout
          style={{
            left: node.col * (cellSize + gap),
            top: node.row * (cellSize + gap),
            width: cellSize,
            height: cellSize,
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          <NodeView node={node} size={cellSize} onTap={onTap} disabled={disabled} />
        </motion.div>
      ))}
    </motion.div>
  )
}
