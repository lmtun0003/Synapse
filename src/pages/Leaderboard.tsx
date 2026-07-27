import { GlassPanel } from '@/components/ui/GlassPanel'
import { Pill } from '@/components/ui/Badge'
import { usePlayerStore } from '@/stores/playerStore'

const TABS = ['Global', 'Country', 'Friends', 'Weekly', 'Monthly', 'All Time'] as const

/** Placeholder rows until Supabase leaderboards are connected. */
function mockRows(seedName: string, elo: number) {
  return [
    { name: 'Aria', score: elo + 420, meta: 'Perfect ×48' },
    { name: 'Nox', score: elo + 310, meta: 'Streak 21' },
    { name: seedName, score: elo, meta: 'You' },
    { name: 'Lumen', score: elo - 80, meta: 'Fewest moves' },
    { name: 'Vesper', score: elo - 140, meta: 'Fastest solve' },
  ].sort((a, b) => b.score - a.score)
}

export function LeaderboardPage() {
  const { displayName, elo } = usePlayerStore()
  const rows = mockRows(displayName, elo)

  return (
    <div className="py-6">
      <p className="text-xs uppercase tracking-[0.3em] text-faint">Leaderboards</p>
      <h1 className="mt-2 text-3xl font-light tracking-tight">The field</h1>
      <p className="mt-2 max-w-lg text-sm text-muted">
        Global, country, friends · weekly to all-time · fastest, fewest moves, streaks, perfects.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((tab, i) => (
          <Pill key={tab} className={i === 0 ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : ''}>
            {tab}
          </Pill>
        ))}
      </div>

      <GlassPanel className="mt-6" padding="none">
        <ul className="divide-y divide-[var(--color-border)]">
          {rows.map((row, index) => (
            <li key={row.name} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <span className="w-6 text-sm text-faint">{index + 1}</span>
                <div>
                  <p className="font-medium">{row.name}</p>
                  <p className="text-xs text-muted">{row.meta}</p>
                </div>
              </div>
              <p className="text-sm text-[var(--color-accent)]">{row.score}</p>
            </li>
          ))}
        </ul>
      </GlassPanel>
    </div>
  )
}
