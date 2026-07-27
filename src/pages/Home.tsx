import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/Button'
import { usePlayerStore } from '@/stores/playerStore'
import { CAMPAIGN_LEVELS } from '@/data/levels'

const MODES = [
  { to: '/campaign', title: 'Campaign', copy: 'Handcrafted progression through every mechanic.', accent: 'var(--color-accent)' },
  { to: '/daily', title: 'Daily Puzzle', copy: 'One shared board. Worldwide. Resets in 24h.', accent: 'var(--color-secondary)' },
  { to: '/endless', title: 'Endless', copy: 'Infinite boards that scale with your skill.', accent: 'var(--color-success)' },
  { to: '/ranked', title: 'Ranked', copy: 'Elo ladder from Bronze to Synapse.', accent: 'var(--color-warning)' },
  { to: '/duel', title: 'Duel', copy: 'Solve the same puzzle. Watch only progress.', accent: 'var(--color-accent)' },
  { to: '/creator', title: 'Creator', copy: 'Design, share, and rate community puzzles.', accent: 'var(--color-secondary)' },
]

export function HomePage() {
  const { level, title, rank, stats, levelProgress } = usePlayerStore()
  const cleared = Object.keys(levelProgress).length
  const continueId =
    CAMPAIGN_LEVELS.find((l) => !levelProgress[l.id])?.id ?? CAMPAIGN_LEVELS[0]?.id

  return (
    <div className="relative pb-8 pt-4">
      <section className="relative flex min-h-[72vh] flex-col justify-end overflow-hidden rounded-[2rem] px-6 pb-10 pt-16 sm:px-10">
        <motion.div
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 35%, rgba(59,130,246,0.22), transparent 70%), radial-gradient(circle at 70% 60%, rgba(139,92,246,0.12), transparent 40%)',
          }}
        />

        {/* Abstract node constellation — visual anchor */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative h-64 w-64 sm:h-80 sm:w-80">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: i === 2 ? 14 : 8,
                  height: i === 2 ? 14 : 8,
                  left: `${20 + i * 14}%`,
                  top: `${30 + Math.sin(i) * 25}%`,
                  boxShadow: '0 0 24px rgba(59,130,246,0.55)',
                }}
                animate={{ opacity: [0.35, 1, 0.35], y: [0, -6, 0] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
            <motion.div
              className="absolute inset-[18%] rounded-full border border-[rgba(59,130,246,0.25)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>

        <div className="relative z-10 max-w-xl">
          <motion.p
            className="text-xs uppercase tracking-[0.45em] text-muted"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Logic · Puzzle · Intelligence
          </motion.p>
          <motion.h1
            className="mt-4 text-5xl font-light tracking-[0.2em] sm:text-6xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            SYNAPSE
          </motion.h1>
          <motion.p
            className="mt-4 max-w-md text-base font-light text-muted sm:text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            Every Move Changes Everything.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to={continueId ? `/play/campaign/${continueId}` : '/campaign'}>
              <Button size="lg">Continue</Button>
            </Link>
            <Link to="/daily">
              <Button size="lg" variant="secondary">
                Daily Puzzle
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <GlassPanel>
          <p className="text-xs uppercase tracking-[0.2em] text-faint">Level</p>
          <p className="mt-2 text-3xl font-light">{level}</p>
          <p className="text-sm text-muted">{title}</p>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs uppercase tracking-[0.2em] text-faint">Rank</p>
          <p className="mt-2 text-3xl font-light">{rank}</p>
          <p className="text-sm text-muted">{stats.puzzlesSolved} solved</p>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs uppercase tracking-[0.2em] text-faint">Collection</p>
          <p className="mt-2 text-3xl font-light">
            {Math.round((cleared / Math.max(CAMPAIGN_LEVELS.length, 1)) * 100)}%
          </p>
          <p className="text-sm text-muted">
            {cleared}/{CAMPAIGN_LEVELS.length} boards
          </p>
        </GlassPanel>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-light tracking-tight">Modes</h2>
            <p className="mt-1 text-sm text-muted">One purpose per path. No clutter.</p>
          </div>
          <Link to="/shop" className="text-sm text-[var(--color-accent)]">
            Shop
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {MODES.map((mode, i) => (
            <Link key={mode.to} to={mode.to}>
              <GlassPanel
                className="h-full transition-transform hover:-translate-y-0.5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <div
                  className="mb-4 h-1 w-10 rounded-full"
                  style={{ background: mode.accent }}
                />
                <h3 className="text-lg font-medium tracking-wide">{mode.title}</h3>
                <p className="mt-2 text-sm text-muted">{mode.copy}</p>
              </GlassPanel>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <Link to="/leaderboard">
          <GlassPanel className="hover:-translate-y-0.5">
            <h3 className="font-medium">Leaderboards</h3>
            <p className="mt-1 text-sm text-muted">Global, friends, streaks.</p>
          </GlassPanel>
        </Link>
        <Link to="/stats">
          <GlassPanel className="hover:-translate-y-0.5">
            <h3 className="font-medium">Statistics</h3>
            <p className="mt-1 text-sm text-muted">Precision, pace, mastery.</p>
          </GlassPanel>
        </Link>
        <Link to="/settings">
          <GlassPanel className="hover:-translate-y-0.5">
            <h3 className="font-medium">Settings</h3>
            <p className="mt-1 text-sm text-muted">Theme, audio, accessibility.</p>
          </GlassPanel>
        </Link>
      </section>
    </div>
  )
}
