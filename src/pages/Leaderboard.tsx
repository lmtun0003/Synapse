import { useMemo, useState } from 'react'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Pill } from '@/components/ui/Badge'
import { usePlayerStore } from '@/stores/playerStore'
import {
  buildLeaderboard,
  seasonReward,
  SCOPE_LABEL,
  type LeaderboardScope,
} from '@/lib/leaderboard'

const SCOPES: LeaderboardScope[] = ['world', 'country', 'region']
const REWARD_RANKS = [1, 2, 3, 10]

export function LeaderboardPage() {
  const { displayName, elo, country, region } = usePlayerStore()
  const [scope, setScope] = useState<LeaderboardScope>('world')

  const view = useMemo(
    () => buildLeaderboard(scope, { name: displayName, elo, country, region }),
    [scope, displayName, elo, country, region],
  )

  const playerInTop = view.rows.some((r) => r.isPlayer)

  const scopeSubtitle: Record<LeaderboardScope, string> = {
    world: 'Everyone, everywhere.',
    country: country,
    region: `${region}, ${country}`,
  }

  return (
    <div className="py-6">
      <p className="text-xs uppercase tracking-[0.3em] text-faint">Leaderboards</p>
      <h1 className="mt-2 text-3xl font-light tracking-tight">The field</h1>
      <p className="mt-2 max-w-lg text-sm text-muted">
        Top 100 by Elo — World, your Country, and your State. Season rewards drop at
        the end of every month.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {SCOPES.map((s) => (
          <button key={s} type="button" onClick={() => setScope(s)}>
            <Pill
              className={
                s === scope
                  ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                  : ''
              }
            >
              {SCOPE_LABEL[s]}
            </Pill>
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-faint">
        {SCOPE_LABEL[scope]} · {scopeSubtitle[scope]} · You are ranked{' '}
        <span className="text-[var(--color-accent)]">#{view.playerRank}</span> of{' '}
        {view.total}
      </p>

      <GlassPanel className="mt-4" padding="none">
        <ul className="max-h-[60vh] divide-y divide-[var(--color-border)] overflow-y-auto">
          {view.rows.map((row, index) => (
            <li
              key={row.id}
              className={`flex items-center justify-between px-6 py-3.5 ${
                row.isPlayer ? 'bg-[var(--color-accent-soft)]' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-8 text-sm ${
                    index < 3 ? 'text-[var(--color-accent)]' : 'text-faint'
                  }`}
                >
                  {index + 1}
                </span>
                <div>
                  <p className={`font-medium ${row.isPlayer ? 'text-[var(--color-accent)]' : ''}`}>
                    {row.name}
                  </p>
                  <p className="text-xs text-muted">
                    {scope === 'world'
                      ? `${row.region}, ${row.country}`
                      : scope === 'country'
                        ? row.region
                        : row.meta}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[var(--color-accent)]">{row.elo}</p>
            </li>
          ))}
        </ul>
      </GlassPanel>

      {!playerInTop && (
        <p className="mt-3 text-center text-xs text-muted">
          Your position: <span className="text-[var(--color-accent)]">#{view.playerRank}</span> ·{' '}
          {elo} Elo — climb into the top 100 to appear on the board.
        </p>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-light">End-of-month rewards</h2>
        <p className="mt-1 text-sm text-muted">
          Country rewards are half of World; State rewards are half of Country.
        </p>
        <GlassPanel className="mt-4" padding="none">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-[0.16em] text-faint">
                <th className="px-5 py-3">Rank</th>
                {SCOPES.map((s) => (
                  <th key={s} className="px-5 py-3">
                    {SCOPE_LABEL[s]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REWARD_RANKS.map((rank) => (
                <tr key={rank} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-5 py-3 font-medium">
                    {rank === 10 ? 'Top 10' : `#${rank}`}
                  </td>
                  {SCOPES.map((s) => {
                    const r = seasonReward(s, rank)
                    return (
                      <td key={s} className="px-5 py-3 text-muted">
                        <span className="text-[var(--color-accent)]">{r.sparks}</span> ✦ ·{' '}
                        <span className="text-[var(--color-secondary)]">{r.prisms}</span> ◆
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </GlassPanel>
      </section>
    </div>
  )
}
