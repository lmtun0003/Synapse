import { Link } from 'react-router-dom'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { RatingBadge, Pill } from '@/components/ui/Badge'
import { CHAPTERS, CAMPAIGN_LEVELS } from '@/data/levels'
import { MECHANIC_INFO } from '@/data/mechanics'
import { usePlayerStore } from '@/stores/playerStore'
import clsx from 'clsx'

export function CampaignPage() {
  const progress = usePlayerStore((s) => s.levelProgress)

  return (
    <div className="py-6">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-faint">Campaign</p>
        <h1 className="mt-2 text-3xl font-light tracking-tight">Progression</h1>
        <p className="mt-2 max-w-lg text-sm text-muted">
          Mechanics unfold gradually. Every board is handcrafted — never just larger.
        </p>
      </div>

      <div className="space-y-8">
        {CHAPTERS.map((chapter) => {
          const levels = CAMPAIGN_LEVELS.filter((l) => l.chapter === chapter.id).sort(
            (a, b) => a.levelNumber - b.levelNumber,
          )
          const completed = levels.filter((l) => progress[l.id]).length
          const unlocked =
            chapter.id === 1 ||
            CAMPAIGN_LEVELS.some(
              (l) => l.chapter === chapter.id - 1 && progress[l.id],
            ) ||
            levels.some((l) => progress[l.id])
          const featured = MECHANIC_INFO[chapter.mechanic]

          return (
            <GlassPanel key={chapter.id} padding="lg">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <Pill>Chapter {chapter.id}</Pill>
                  <h2 className="mt-3 text-2xl font-light">{chapter.title}</h2>
                  <p className="mt-1 text-sm text-muted">{chapter.subtitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-faint">
                    Stages {chapter.range[0]}–{chapter.range[1]}
                  </p>
                  {levels.length > 0 && (
                    <p className="mt-1 text-xs text-[var(--color-accent)]">
                      {completed}/{levels.length} complete
                    </p>
                  )}
                </div>
              </div>

              {/* Featured mechanic legend for the chapter. */}
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-sm text-[var(--color-accent)]">
                  {featured.glyph}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-faint">
                    Featured node · {featured.name}
                  </p>
                  <p className="mt-1 text-sm text-muted">{featured.effect}</p>
                </div>
              </div>

              {levels.length === 0 ? (
                <p className="mt-6 text-sm text-muted">
                  {unlocked
                    ? 'More handcrafted boards arrive as the season expands.'
                    : 'Complete the previous chapter to reveal this path.'}
                </p>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {levels.map((level, index) => {
                    const prev = levels[index - 1]
                    const isOpen =
                      index === 0
                        ? unlocked || chapter.id === 1
                        : Boolean(prev && progress[prev.id]) || Boolean(progress[level.id])
                    const p = progress[level.id]

                    return (
                      <Link
                        key={level.id}
                        to={isOpen ? `/play/campaign/${level.id}` : '#'}
                        className={clsx(!isOpen && 'pointer-events-none opacity-35')}
                        aria-disabled={!isOpen}
                      >
                        <div className="glass rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-faint">Stage {index + 1}</span>
                            {p && <RatingBadge rating={p.bestRating} />}
                          </div>
                          <p className="mt-3 text-sm font-medium">{level.title}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </GlassPanel>
          )
        })}
      </div>
    </div>
  )
}
