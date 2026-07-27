import { Link } from 'react-router-dom'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Badge'
import { usePlayerStore } from '@/stores/playerStore'
import { ACHIEVEMENTS } from '@/data/achievements'

export function ProfilePage() {
  const player = usePlayerStore()

  return (
    <div className="py-6">
      <p className="text-xs uppercase tracking-[0.3em] text-faint">Profile</p>
      <h1 className="mt-2 text-3xl font-light tracking-tight">{player.displayName}</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        <Pill>{player.title}</Pill>
        <Pill>Level {player.level}</Pill>
        <Pill>{player.rank}</Pill>
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
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="XP" value={player.xp} />
          <Stat label="Sparks" value={player.sparks} />
          <Stat label="Prisms" value={player.prisms} />
          <Stat label="Elo" value={player.elo} />
        </div>
      </GlassPanel>

      <section className="mt-8">
        <h2 className="text-xl font-light">Achievements</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = player.achievements.includes(a.id)
            return (
              <GlassPanel key={a.id} className={unlocked ? '' : 'opacity-45'}>
                <div className="flex items-start gap-3">
                  <span className="text-xl text-[var(--color-accent)]">{a.icon}</span>
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="mt-1 text-sm text-muted">{a.description}</p>
                  </div>
                </div>
              </GlassPanel>
            )
          })}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-faint">{label}</p>
      <p className="mt-1 text-2xl font-light">{value}</p>
    </div>
  )
}
