import { motion, AnimatePresence } from 'framer-motion'
import type { Connection, GridNode } from '@/types/game'

interface ConnectionLinesProps {
  nodes: GridNode[]
  connections: Connection[]
  cellSize: number
  rows: number
  cols: number
}

function getCenterXY(node: GridNode, cellSize: number) {
  return {
    x: node.col * cellSize + cellSize / 2,
    y: node.row * cellSize + cellSize / 2,
  }
}

function createCurvedPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return `M ${x1} ${y1}`
  const curve = len * 0.15
  const cx = mx - (dy / len) * curve
  const cy = my + (dx / len) * curve
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`
}

export function ConnectionLines({
  nodes,
  connections,
  cellSize,
  rows,
  cols,
}: ConnectionLinesProps) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]))
  const svgW = cols * cellSize
  const svgH = rows * cellSize

  // Build background grid lines
  const gridLines: { x1: number; y1: number; x2: number; y2: number }[] = []
  for (const node of nodes) {
    const { x, y } = getCenterXY(node, cellSize)
    // Horizontal neighbor
    const right = nodeMap.get(`${node.row}_${node.col + 1}`) ||
      nodes.find(n => n.row === node.row && n.col === node.col + 1)
    if (right) {
      const { x: rx, y: ry } = getCenterXY(right, cellSize)
      gridLines.push({ x1: x, y1: y, x2: rx, y2: ry })
    }
    // Vertical neighbor
    const below = nodes.find(n => n.row === node.row + 1 && n.col === node.col)
    if (below) {
      const { x: bx, y: by } = getCenterXY(below, cellSize)
      gridLines.push({ x1: x, y1: y, x2: bx, y2: by })
    }
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={svgW}
      height={svgH}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id="glow-blue">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="signal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
        </linearGradient>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="4"
          refX="3"
          refY="2"
          orient="auto"
        >
          <polygon points="0 0, 6 2, 0 4" fill="url(#signal-grad)" opacity="0.8" />
        </marker>
      </defs>

      {/* Background grid lines */}
      {gridLines.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}

      {/* Active signal connections */}
      <AnimatePresence>
        {connections.filter(c => c.active).map(conn => {
          const fromNode = nodeMap.get(conn.fromId)
          const toNode = nodeMap.get(conn.toId)
          if (!fromNode || !toNode) return null

          const from = getCenterXY(fromNode, cellSize)
          const to = getCenterXY(toNode, cellSize)
          const pathD = createCurvedPath(from.x, from.y, to.x, to.y)
          const connId = `${conn.fromId}-${conn.toId}`

          return (
            <g key={connId} filter="url(#glow-blue)">
              {/* Glow background */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="rgba(59,130,246,0.25)"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
              {/* Main signal line */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="url(#signal-grad)"
                strokeWidth="2"
                strokeLinecap="round"
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
              />
              {/* Travelling particle */}
              <motion.circle
                r="3"
                fill="white"
                opacity="0.9"
                initial={{ offsetDistance: '0%' } as any}
                animate={{ offsetDistance: '100%' } as any}
                style={{ offsetPath: `path("${pathD}")` } as any}
                transition={{ duration: 0.4, ease: 'easeIn' }}
              />
            </g>
          )
        })}
      </AnimatePresence>
    </svg>
  )
}
