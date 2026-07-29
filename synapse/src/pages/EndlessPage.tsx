import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useGameStore } from '@/store/gameStore'
import { generatePuzzle } from '@/engine/gameEngine'

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', icon: '🌱', desc: '3×3 grids, basic mechanics', difficulty: 0.2, rows: 3, cols: 3 },
  { id: 'medium', label: 'Medium', icon: '⚡', desc: '4×4 grids, moderate challenge', difficulty: 0.5, rows: 4, cols: 4 },
  { id: 'hard', label: 'Hard', icon: '🔥', desc: '5×5 grids, complex patterns', difficulty: 0.75, rows: 5, cols: 5 },
  { id: 'extreme', label: 'Extreme', icon: '💀', desc: '6×6 grids, maximum complexity', difficulty: 0.95, rows: 6, cols: 6 },
]

export function EndlessPage() {
  const navigate = useNavigate()
  const { startGame } = useGameStore()
  const [selected, setSelected] = useState(0)
  const [session, setSession] = useState({ puzzleCount: 0, bestStreak: 0, currentStreak: 0 })

  const handleStart = () => {
    const diff = DIFFICULTIES[selected]
    const puzzle = generatePuzzle({
      rows: diff.rows,
      cols: diff.cols,
      difficulty: diff.difficulty,
      mechanicsPool: ['basic'],
    })
    startGame(puzzle, 'endless')
    navigate('/play')
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto px-4 py-6">
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white"
        >←</button>
        <div>
          <h1 className="text-xl font-bold text-white">Endless Mode</h1>
          <p className="text-white/40 text-xs">Infinite procedurally generated puzzles</p>
        </div>
      </motion.div>

      {/* Session stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Solved', value: session.puzzleCount },
          { label: 'Streak', value: session.currentStreak },
          { label: 'Best', value: session.bestStreak },
        ].map((s, i) => (
          <GlassCard key={s.label} padding="sm" rounded="xl" animate delay={i * 0.07}>
            <div className="text-center">
              <div className="text-white text-xl font-bold">{s.value}</div>
              <div className="text-white/40 text-[11px]">{s.label}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Difficulty selection */}
      <h2 className="text-white/50 text-xs uppercase tracking-widest mb-3">Select Difficulty</h2>
      <div className="flex flex-col gap-2.5 mb-6">
        {DIFFICULTIES.map((diff, i) => (
          <motion.button
            key={diff.id}
            onClick={() => setSelected(i)}
            className={[
              'w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200',
              selected === i
                ? 'bg-white/10 border-white/25 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                : 'glass border-white/8 hover:bg-white/7',
            ].join(' ')}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl">{diff.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{diff.label}</span>
                <Badge variant="blue" size="xs">{diff.rows}×{diff.cols}</Badge>
              </div>
              <div className="text-white/40 text-xs mt-0.5">{diff.desc}</div>
            </div>
            <div className={[
              'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
              selected === i ? 'border-blue-400 bg-blue-500' : 'border-white/20',
            ].join(' ')}>
              {selected === i && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Description */}
      <motion.div
        className="glass rounded-2xl p-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-white font-semibold text-sm mb-2">How it works</h3>
        <ul className="text-white/40 text-sm space-y-1.5">
          <li>• Puzzles are generated fresh each time</li>
          <li>• Solve as many as you can in a row</li>
          <li>• Your streak resets on failure</li>
          <li>• Difficulty scales as your streak grows</li>
          <li>• No time pressure — think carefully</li>
        </ul>
      </motion.div>

      <Button variant="primary" size="xl" className="w-full" onClick={handleStart} glow>
        ▶ Start Endless
      </Button>
    </div>
  )
}
