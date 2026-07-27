import { Link } from 'react-router-dom'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/Button'
import { usePlayerStore } from '@/stores/playerStore'
import { dailySeed } from '@/engine/generate'

export function DailyPage() {
  const { dailyStreak, lastDailyDate, levelProgress } = usePlayerStore()
  const seed = dailySeed()
  const id = `daily-${seed}`
  const doneToday = Boolean(levelProgress[id]) || lastDailyDate === new Date().toISOString().slice(0, 10)

  return (
    <div className="py-6">
      <p className="text-xs uppercase tracking-[0.3em] text-faint">Daily Puzzle</p>
      <h1 className="mt-2 text-3xl font-light tracking-tight">One board. Everyone.</h1>
      <p className="mt-2 max-w-lg text-sm text-muted">
        The entire world receives the same puzzle. Leaderboards reset every 24 hours. Streaks reward consistency.
      </p>

      <GlassPanel className="mt-8" padding="lg">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-faint">Today</p>
            <p className="mt-2 text-2xl font-light">Signal {seed}</p>
            <p className="mt-2 text-sm text-muted">
              Streak · {dailyStreak} day{dailyStreak === 1 ? '' : 's'}
            </p>
          </div>
          <Link to="/play/daily">
            <Button size="lg">{doneToday ? 'Replay' : 'Begin'}</Button>
          </Link>
        </div>
      </GlassPanel>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <GlassPanel>
          <p className="text-xs text-faint">Reward</p>
          <p className="mt-2 text-lg font-light">Bonus Sparks</p>
          <p className="mt-1 text-sm text-muted">Streak multipliers apply at 3, 7, 30 days.</p>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs text-faint">Fairness</p>
          <p className="mt-2 text-lg font-light">No randomness</p>
          <p className="mt-1 text-sm text-muted">Seeded identically for every player.</p>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs text-faint">Share</p>
          <p className="mt-2 text-lg font-light">Results only</p>
          <p className="mt-1 text-sm text-muted">Moves and rating — never the solution.</p>
        </GlassPanel>
      </div>
    </div>
  )
}
