import { useMemo, useState } from 'react'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/Button'
import { buildLevel, self } from '@/data/levels/builder'
import { solvePuzzle } from '@/engine/solver'
import { useGameStore } from '@/stores/gameStore'
import { useNavigate } from 'react-router-dom'

function randomCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export function CreatorPage() {
  const [title, setTitle] = useState('Untitled Signal')
  const [size, setSize] = useState(3)
  const [mask, setMask] = useState(() => Array.from({ length: 9 }, () => true))
  const [active, setActive] = useState(() => Array.from({ length: 9 }, () => false))
  const [code, setCode] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const loadPuzzle = useGameStore((s) => s.loadPuzzle)
  const navigate = useNavigate()

  const cells = size * size

  const puzzle = useMemo(() => {
    const grid = Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (__, c) => {
        const i = r * size + c
        if (!mask[i]) return null
        return self(Boolean(active[i]))
      }),
    )
    return buildLevel({
      id: `creator-${code ?? 'draft'}`,
      title,
      chapter: 0,
      levelNumber: 0,
      grid,
      par: { perfect: 3, gold: 4, silver: 6, bronze: 10 },
      mechanics: ['basic'],
    })
  }, [size, mask, active, title, code])

  const resize = (next: number) => {
    setSize(next)
    const n = next * next
    setMask(Array.from({ length: n }, () => true))
    setActive(Array.from({ length: n }, () => false))
  }

  const publish = () => {
    const result = solvePuzzle(puzzle, 10)
    if (!result.solvable || result.minMoves === null) {
      setMessage('Puzzle must be solvable before publishing.')
      setCode(null)
      return
    }
    const share = randomCode()
    setCode(share)
    setMessage(`Published · Perfect par ${result.minMoves} · Share code ${share}`)
    const crafted = {
      ...puzzle,
      id: `creator-${share}`,
      par: {
        perfect: result.minMoves,
        gold: result.minMoves + 1,
        silver: result.minMoves + 3,
        bronze: result.minMoves + 6,
      },
    }
    localStorage.setItem(`synapse.puzzle.${share}`, JSON.stringify(crafted))
  }

  const playtest = () => {
    loadPuzzle(puzzle, 'creator')
    navigate('/play/creator')
  }

  return (
    <div className="py-6">
      <p className="text-xs uppercase tracking-[0.3em] text-faint">Puzzle Creator</p>
      <h1 className="mt-2 text-3xl font-light tracking-tight">Design a signal</h1>
      <p className="mt-2 max-w-lg text-sm text-muted">
        Create, validate, share via code. Community rating and featured boards come next.
      </p>

      <GlassPanel className="mt-8" padding="lg">
        <label className="block text-xs uppercase tracking-[0.2em] text-faint">
          Title
          <input
            className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-base text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <div className="mt-5 flex gap-2">
          {[3, 4, 5].map((n) => (
            <Button key={n} size="sm" variant={size === n ? 'primary' : 'secondary'} onClick={() => resize(n)}>
              {n}×{n}
            </Button>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted">Toggle presence (click) · Shift-click to flip start active.</p>
        <div
          className="mt-4 grid gap-3"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, maxWidth: 320 }}
        >
          {Array.from({ length: cells }).map((_, i) => (
            <button
              key={i}
              type="button"
              className="aspect-square rounded-2xl border border-[var(--color-border)] transition-colors"
              style={{
                background: !mask[i]
                  ? 'transparent'
                  : active[i]
                    ? 'rgba(59,130,246,0.35)'
                    : 'var(--color-surface-strong)',
                opacity: mask[i] ? 1 : 0.25,
              }}
              onClick={(e) => {
                if (e.shiftKey) {
                  setActive((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                } else {
                  setMask((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                }
              }}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={playtest}>Playtest</Button>
          <Button variant="secondary" onClick={publish}>
            Publish
          </Button>
        </div>
        {message && <p className="mt-4 text-sm text-muted">{message}</p>}
      </GlassPanel>
    </div>
  )
}
