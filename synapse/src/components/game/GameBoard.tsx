import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import type { Puzzle } from '@/types/game'
import { GameNode } from './GameNode'
import { ConnectionLines } from './ConnectionLines'
import { useGameStore } from '@/store/gameStore'

interface GameBoardProps {
  puzzle: Puzzle
  className?: string
  readOnly?: boolean
}

const MIN_CELL = 52
const MAX_CELL = 88

export function GameBoard({ puzzle, className, readOnly = false }: GameBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cellSize, setCellSize] = useState(64)
  const [showSuccess, setShowSuccess] = useState(false)

  const { nodeStates, activeConnections, activateNode, completed, isAnimating } = useGameStore()

  // Responsive cell sizing
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      const byWidth = Math.floor((width - 32) / puzzle.cols)
      const byHeight = Math.floor((height - 32) / puzzle.rows)
      setCellSize(Math.min(MAX_CELL, Math.max(MIN_CELL, Math.min(byWidth, byHeight))))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [puzzle.rows, puzzle.cols])

  useEffect(() => {
    if (completed) {
      setShowSuccess(true)
      const t = setTimeout(() => setShowSuccess(false), 3000)
      return () => clearTimeout(t)
    }
  }, [completed])

  const handleActivate = useCallback((id: string) => {
    if (readOnly || completed) return
    activateNode(id)
  }, [readOnly, completed, activateNode])

  const boardWidth = puzzle.cols * cellSize
  const boardHeight = puzzle.rows * cellSize

  return (
    <div
      ref={containerRef}
      className={clsx('relative flex items-center justify-center w-full h-full', className)}
    >
      {/* Board container */}
      <motion.div
        className="relative select-none"
        style={{ width: boardWidth, height: boardHeight }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
          }}
        />

        {/* Connection lines (SVG layer) */}
        <ConnectionLines
          nodes={puzzle.grid}
          connections={activeConnections}
          cellSize={cellSize}
          rows={puzzle.rows}
          cols={puzzle.cols}
        />

        {/* Nodes */}
        {puzzle.grid.map((node, i) => (
          <GameNode
            key={node.id}
            node={node}
            state={nodeStates[node.id] ?? 'inactive'}
            isConnected={activeConnections.some(c => c.toId === node.id || c.fromId === node.id)}
            cellSize={cellSize}
            onActivate={handleActivate}
            animationDelay={i * 0.03}
          />
        ))}

        {/* Win overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'radial-gradient(circle at center, rgba(16,185,129,0.15) 0%, transparent 70%)',
              }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-6xl"
              >
                ✓
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Particle bursts on completion */}
        <AnimatePresence>
          {showSuccess && (
            <>
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2
                const dist = 80 + Math.random() * 60
                return (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: boardWidth / 2,
                      top: boardHeight / 2,
                      background: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'][i % 4],
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos(angle) * dist,
                      y: Math.sin(angle) * dist,
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.02 }}
                  />
                )
              })}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
