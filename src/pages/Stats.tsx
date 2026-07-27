import { GlassPanel } from '@/components/ui/GlassPanel'
import { usePlayerStore } from '@/stores/playerStore'
import { CAMPAIGN_LEVELS } from '@/data/levels'

export function StatsPage() {
  const { stats, levelProgress, dailyStreak, perfectStreak, winStreak } = usePlayerStore()
  const cleared = Object.keys(levelProgress).length
  const perfects = Object.values(levelProgress).filter((p) => p.perfect).length

  return (
    <div className="py-6">
      <p className="text-xs uppercase tracking-[0.3em] text-faint">Statistics</p>
      <h1 className="mt-2 text-3xl font-light tracking-tight">Your signal</h1>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Puzzles solved" value={stats.puzzlesSolved} />
        <StatCard label="Perfect scores" value={stats.perfectScores} />
        <StatCard label="Total moves" value={stats.totalMoves} />
        <StatCard
          label="Fastest solve"
          value={stats.fastestSolveMs ? `${(stats.fastestSolveMs / 1000).toFixed(1)}s` : '—'}
        />
        <StatCard label="Campaign cleared" value={`${cleared}/${CAMPAIGN_LEVELS.length}`} />
        <StatCard label="Campaign perfects" value={perfects} />
        <StatCard label="Daily streak" value={dailyStreak} />
        <StatCard label="Perfect streak" value={perfectStreak} />
        <StatCard label="Win streak" value={winStreak} />
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <GlassPanel>
      <p className="text-xs uppercase tracking-[0.18em] text-faint">{label}</p>
      <p className="mt-3 text-3xl font-light tracking-tight">{value}</p>
    </GlassPanel>
  )
}
