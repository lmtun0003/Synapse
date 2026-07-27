import { Link } from 'react-router-dom'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/stores/gameStore'

export function EndlessPage() {
  const difficulty = useGameStore((s) => s.endlessDifficulty)

  return (
    <div className="py-6">
      <p className="text-xs uppercase tracking-[0.3em] text-faint">Endless Mode</p>
      <h1 className="mt-2 text-3xl font-light tracking-tight">Infinite replay</h1>
      <p className="mt-2 max-w-lg text-sm text-muted">
        Procedural boards with intelligent difficulty scaling. Mechanics layer in as you climb.
      </p>

      <GlassPanel className="mt-8" padding="lg">
        <p className="text-xs uppercase tracking-[0.2em] text-faint">Current depth</p>
        <p className="mt-2 text-4xl font-light">{difficulty}</p>
        <p className="mt-2 text-sm text-muted">
          Difficulty introduces rotation, mirrors, gravity, and teleporters — never just board size.
        </p>
        <div className="mt-6">
          <Link to="/play/endless">
            <Button size="lg">Enter the field</Button>
          </Link>
        </div>
      </GlassPanel>
    </div>
  )
}
