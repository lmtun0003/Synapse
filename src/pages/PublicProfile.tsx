import { Link } from 'react-router-dom'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Badge'
import { usePlayerStore } from '@/stores/playerStore'
import { ACHIEVEMENTS, getAchievement, tierLabel } from '@/data/achievements'

/**
 * Read-only card showing exactly what other players see when they open this
 * profile: identity, rank, and the showcased achievement tiers.
 */
export function PublicProfilePage() {
  const player = usePlayerStore()

  const earned = ACHIEVEMENTS.filter((a) => (player.achievementTiers[a.id] ?? 0) > 0)
  const totalTiers = ACHIEVEMENTS.reduce(
    (sum, a) => sum + (player.achievementTiers[a.id] ?? 0),
    0,
  )

  // Prefer the player's chosen showcase, falling back to their highest tiers.
  const showcaseIds =
    player.showcasedAchievements.length > 0
      ? player.showcasedAchievements
      : [...earned]
          .sort(
            (a, b) =>
              (player.achievementTiers[b.id] ?? 0) - (player.achievementTiers[a.id] ?? 0),
          )
          .slice(0, 3)
          .map((a) => a.id)

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.3em] text-faint">Public profile</p>
        <Link to="/profile">
          <Button variant="ghost" size="sm">
            ← Back to edit
          </Button>
        </Link>
      </div>

      <GlassPanel className="mt-4" padding="lg" strong>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-2xl text-[var(--color-accent)]">
              {player.displayName.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <h1 className="text-2xl font-light tracking-tight">{player.displayName}</h1>
              <p className="mt-1 text-sm text-muted">
                {player.title} · {player.region}, {player.country}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill>Level {player.level}</Pill>
            <Pill>{player.rank}</Pill>
            <Pill>{player.elo} Elo</Pill>
          </div>
        </div>
      </GlassPanel>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <GlassPanel>
          <p className="text-xs text-faint">Puzzles solved</p>
          <p className="mt-2 text-3xl font-light">{player.stats.puzzlesSolved}</p>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs text-faint">Perfect solves</p>
          <p className="mt-2 text-3xl font-light">{player.stats.perfectScores}</p>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs text-faint">Achievement tiers</p>
          <p className="mt-2 text-3xl font-light">{totalTiers}</p>
        </GlassPanel>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-light">Showcase</h2>
        {showcaseIds.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No achievements unlocked yet — solve puzzles to earn tiers.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {showcaseIds.map((id) => {
              const ach = getAchievement(id)
              if (!ach) return null
              const tiers = player.achievementTiers[id] ?? 0
              return (
                <GlassPanel key={id} className="text-center">
                  <span className="text-2xl text-[var(--color-accent)]">{ach.icon}</span>
                  <p className="mt-2 font-medium">{ach.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                    {tierLabel(tiers)} tier
                  </p>
                </GlassPanel>
              )
            })}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-light">All achievements</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {ACHIEVEMENTS.map((a) => {
            const tiers = player.achievementTiers[a.id] ?? 0
            return (
              <Pill
                key={a.id}
                className={tiers > 0 ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'opacity-50'}
              >
                {a.icon} {a.title} · {tierLabel(tiers)}
              </Pill>
            )
          })}
        </div>
      </section>
    </div>
  )
}
