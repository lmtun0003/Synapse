import { Link } from 'react-router-dom'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/Button'
import { usePlayerStore } from '@/stores/playerStore'
import { RANK_THRESHOLDS } from '@/lib/elo'
import type { RankTier } from '@/engine/types'

const RANKS = Object.keys(RANK_THRESHOLDS) as RankTier[]

export function RankedPage() {
  const { elo, rank, winStreak } = usePlayerStore()

  return (
    <div className="py-6">
      <p className="text-xs uppercase tracking-[0.3em] text-faint">Ranked</p>
      <h1 className="mt-2 text-3xl font-light tracking-tight">Identical puzzles. Pure skill.</h1>
      <p className="mt-2 max-w-lg text-sm text-muted">
        Scoring weighs move efficiency, time, accuracy, and consistency. Elo from Bronze to Synapse.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <GlassPanel>
          <p className="text-xs text-faint">Elo</p>
          <p className="mt-2 text-3xl font-light">{elo}</p>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs text-faint">Rank</p>
          <p className="mt-2 text-3xl font-light">{rank}</p>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs text-faint">Win streak</p>
          <p className="mt-2 text-3xl font-light">{winStreak}</p>
        </GlassPanel>
      </div>

      <GlassPanel className="mt-6" padding="lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-light">Next trial</h2>
            <p className="mt-1 text-sm text-muted">Shared 5-minute puzzle buckets.</p>
          </div>
          <Link to="/play/ranked">
            <Button size="lg">Queue</Button>
          </Link>
        </div>
      </GlassPanel>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {RANKS.map((r) => (
          <div
            key={r}
            className="glass rounded-2xl p-4"
            style={{
              outline: r === rank ? '1px solid var(--color-accent)' : undefined,
            }}
          >
            <p className="text-sm font-medium">{r}</p>
            <p className="mt-1 text-xs text-faint">{RANK_THRESHOLDS[r]}+</p>
          </div>
        ))}
      </div>
    </div>
  )
}
