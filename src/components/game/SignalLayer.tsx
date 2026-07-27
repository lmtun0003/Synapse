import { AnimatePresence, motion } from 'framer-motion'
import type { PuzzleNode, SignalEvent } from '@/engine/types'

interface SignalLayerProps {
  nodes: PuzzleNode[]
  events: SignalEvent[]
  cellSize: number
  gap: number
  originX: number
  originY: number
}

export function SignalLayer({
  nodes,
  events,
  cellSize,
  gap,
  originX,
  originY,
}: SignalLayerProps) {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const stride = cellSize + gap

  return (
    <svg className="pointer-events-none absolute inset-0 overflow-visible">
      <AnimatePresence>
        {events
          .filter((e) => e.fromId !== e.toId)
          .map((event) => {
            const from = byId.get(event.fromId)
            const to = byId.get(event.toId)
            if (!from || !to) return null
            const x1 = originX + from.col * stride + cellSize / 2
            const y1 = originY + from.row * stride + cellSize / 2
            const x2 = originX + to.col * stride + cellSize / 2
            const y2 = originY + to.row * stride + cellSize / 2
            const color =
              event.kind === 'teleport'
                ? 'rgba(139,92,246,0.9)'
                : event.kind === 'invert'
                  ? 'rgba(251,191,36,0.9)'
                  : 'rgba(59,130,246,0.9)'

            return (
              <motion.line
                key={event.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              />
            )
          })}
      </AnimatePresence>
    </svg>
  )
}
