import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/Button'
import { usePlayerStore } from '@/stores/playerStore'
import { RANK_THRESHOLDS } from '@/lib/elo'
import { currentMonthKey, seasonStandings, SCOPE_LABEL } from '@/lib/leaderboard'
import type { RankTier } from '@/engine/types'
import type { SeasonClaim } from '@/stores/playerStore'

const RANKS = Object.keys(RANK_THRESHOLDS) as RankTier[]

export function RankedPage() {
  const { elo, rank, winStreak, displayName, country, region, lastSeasonRewardMonth } =
    usePlayerStore()
  const claimSeasonRewards = usePlayerStore((s) => s.claimSeasonRewards)
  const [claim, setClaim] = useState<SeasonClaim | null>(null)

  const month = currentMonthKey()
  const alreadyClaimed = lastSeasonRewardMonth === month

  const standings = useMemo(
    () => seasonStandings({ name: displayName, elo, country, region }),
    [displayName, elo, country, region],
  )

  const projectedTotal = standings.reduce(
    (acc, s) => ({
      sparks: acc.sparks + s.reward.sparks,
      prisms: acc.prisms + s.reward.prisms,
    }),
    { sparks: 0, prisms: 0 },
  )

  const onClaim = () => {
    const result = claimSeasonRewards()
    if (result) setClaim(result)
  }

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
          <div className="flex gap-2">
            <Link to="/leaderboard">
              <Button variant="secondary" size="lg">
                Leaderboard
              </Button>
            </Link>
            <Link to="/play/ranked">
              <Button size="lg">Queue</Button>
            </Link>
          </div>
        </div>
      </GlassPanel>

      {/* Monthly season rewards */}
      <GlassPanel className="mt-6" padding="lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-light">Season rewards · {month}</h2>
            <p className="mt-1 text-sm text-muted">
              Paid out from your standing in each leaderboard.
            </p>
          </div>
          <Button onClick={onClaim} disabled={alreadyClaimed}>
            {alreadyClaimed ? 'Claimed this month' : 'Claim rewards'}
          </Button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {standings.map((s) => (
            <div key={s.scope} className="glass rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-faint">
                {SCOPE_LABEL[s.scope]}
              </p>
              <p className="mt-1 text-sm">
                Rank <span className="text-[var(--color-accent)]">#{s.rank}</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                {s.reward.sparks > 0 || s.reward.prisms > 0 ? (
                  <>
                    <span className="text-[var(--color-accent)]">{s.reward.sparks}</span> ✦ ·{' '}
                    <span className="text-[var(--color-secondary)]">{s.reward.prisms}</span> ◆
                  </>
                ) : (
                  <span className="text-faint">Outside reward brackets</span>
                )}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-faint">
          {alreadyClaimed
            ? 'Come back next month for the next payout.'
            : `Projected total: ${projectedTotal.sparks} ✦ · ${projectedTotal.prisms} ◆`}
        </p>

        {claim && <ClaimSummary claim={claim} />}
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

function ClaimSummary({ claim }: { claim: SeasonClaim }) {
  return (
    <div className="mt-5 rounded-2xl border border-[var(--color-accent)] bg-[var(--color-accent-soft)] p-4">
      <p className="text-sm font-medium text-[var(--color-accent)]">
        Rewards claimed · {claim.total.sparks} ✦ + {claim.total.prisms} ◆
      </p>
      <ul className="mt-2 space-y-1 text-xs text-muted">
        {claim.breakdown.map((b) => (
          <li key={b.scope}>
            {SCOPE_LABEL[b.scope as keyof typeof SCOPE_LABEL]} · #{b.rank} →{' '}
            {b.reward.sparks} ✦ · {b.reward.prisms} ◆
          </li>
        ))}
      </ul>
    </div>
  )
}
