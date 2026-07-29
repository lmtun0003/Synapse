import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Badge'
import { usePlayerStore } from '@/stores/playerStore'
import {
  ACHIEVEMENTS,
  tierLabel,
  type Achievement,
  type AchievementMetric,
} from '@/data/achievements'
import { COUNTRIES, COUNTRY_NAMES } from '@/lib/leaderboard'

export function ProfilePage() {
  const player = usePlayerStore()
  const syncAchievements = usePlayerStore((s) => s.syncAchievements)
  const [editingShowcase, setEditingShowcase] = useState(false)

  // Catch level / Elo based tiers earned outside of a solve.
  useEffect(() => {
    syncAchievements()
  }, [syncAchievements])

  const metricValue = (metric: AchievementMetric): number => {
    switch (metric) {
      case 'puzzlesSolved':
        return player.stats.puzzlesSolved
      case 'perfectScores':
        return player.stats.perfectScores
      case 'level':
        return player.level
      case 'elo':
        return player.elo
      case 'maxDailyStreak':
        return player.stats.maxDailyStreak
    }
  }

  const toggleShowcase = (id: string) => {
    const current = player.showcasedAchievements
    if (current.includes(id)) {
      player.setShowcase(current.filter((x) => x !== id))
      return
    }
    // Only unlocked achievements can be featured.
    if ((player.achievementTiers[id] ?? 0) === 0) return
    if (current.length < 3) player.setShowcase([...current, id])
  }

  const regions = COUNTRIES[player.country] ?? []

  return (
    <div className="py-6">
      <p className="text-xs uppercase tracking-[0.3em] text-faint">Profile</p>
      <h1 className="mt-2 text-3xl font-light tracking-tight">{player.displayName}</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        <Pill>{player.title}</Pill>
        <Pill>Level {player.level}</Pill>
        <Pill>{player.rank}</Pill>
        <Pill>
          {player.region}, {player.country}
        </Pill>
      </div>

      <GlassPanel className="mt-8" padding="lg">
        <label className="block text-xs uppercase tracking-[0.2em] text-faint">
          Display name
          <input
            className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
            value={player.displayName}
            onChange={(e) => player.setDisplayName(e.target.value.slice(0, 24))}
          />
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-xs uppercase tracking-[0.2em] text-faint">
            Country
            <select
              className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
              value={player.country}
              onChange={(e) => {
                const country = e.target.value
                player.setLocation(country, COUNTRIES[country]?.[0] ?? '')
              }}
            >
              {COUNTRY_NAMES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs uppercase tracking-[0.2em] text-faint">
            State / Region
            <select
              className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
              value={player.region}
              onChange={(e) => player.setLocation(player.country, e.target.value)}
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="XP" value={player.xp} />
          <Stat label="Sparks" value={player.sparks} />
          <Stat label="Prisms" value={player.prisms} />
          <Stat label="Elo" value={player.elo} />
        </div>
      </GlassPanel>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-light">Achievements</h2>
            <p className="mt-1 text-sm text-muted">
              Every tier pays Sparks. Keep playing to climb — Diamond pays the most.
            </p>
          </div>
          <Button
            variant={editingShowcase ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setEditingShowcase((v) => !v)}
          >
            {editingShowcase ? 'Done' : 'Edit showcase'}
          </Button>
        </div>
        {editingShowcase && (
          <p className="mt-2 text-xs text-[var(--color-accent)]">
            Pick up to 3 achievements to feature on your public profile (
            {player.showcasedAchievements.length}/3).
          </p>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ACHIEVEMENTS.map((a) => (
            <AchievementCard
              key={a.id}
              achievement={a}
              claimedTiers={player.achievementTiers[a.id] ?? 0}
              value={metricValue(a.metric)}
              showcased={player.showcasedAchievements.includes(a.id)}
              editing={editingShowcase}
              onToggle={() => toggleShowcase(a.id)}
            />
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/profile/public">
          <Button>View public profile</Button>
        </Link>
        <Link to="/stats">
          <Button variant="secondary">Statistics</Button>
        </Link>
        <Link to="/settings">
          <Button variant="ghost">Settings</Button>
        </Link>
      </div>
    </div>
  )
}

function AchievementCard({
  achievement,
  claimedTiers,
  value,
  showcased,
  editing,
  onToggle,
}: {
  achievement: Achievement
  claimedTiers: number
  value: number
  showcased: boolean
  editing: boolean
  onToggle: () => void
}) {
  const maxTiers = achievement.tiers.length
  const unlocked = claimedTiers > 0
  const nextTier = achievement.tiers[claimedTiers]
  const prevThreshold = claimedTiers > 0 ? achievement.tiers[claimedTiers - 1].threshold : 0
  const pct = nextTier
    ? Math.min(
        100,
        Math.round(
          ((value - prevThreshold) / (nextTier.threshold - prevThreshold)) * 100,
        ),
      )
    : 100

  return (
    <button
      type="button"
      onClick={editing ? onToggle : undefined}
      className={`glass w-full rounded-2xl p-4 text-left transition-colors ${
        unlocked ? '' : 'opacity-55'
      } ${editing ? 'cursor-pointer hover:border-[var(--color-accent)]' : 'cursor-default'} ${
        showcased ? 'outline outline-1 outline-[var(--color-accent)]' : ''
      }`}
      style={{ border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl text-[var(--color-accent)]">{achievement.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium">{achievement.title}</p>
            <span className="shrink-0 text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {tierLabel(claimedTiers)}
              {unlocked ? ` · ${claimedTiers}/${maxTiers}` : ''}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">{achievement.description}</p>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-strong)]">
            <div
              className="h-full rounded-full bg-[var(--color-accent)] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-faint">
            {nextTier
              ? `${value}/${nextTier.threshold} → ${tierLabel(claimedTiers + 1)} (+${nextTier.sparks} ✦)`
              : `Maxed · ${value} total`}
          </p>
          {editing && !unlocked && (
            <p className="mt-2 text-xs text-faint">Unlock a tier to feature this</p>
          )}
          {showcased && !editing && (
            <p className="mt-2 text-xs text-[var(--color-accent)]">★ Featured</p>
          )}
        </div>
      </div>
    </button>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-faint">{label}</p>
      <p className="mt-1 text-2xl font-light">{value}</p>
    </div>
  )
}
