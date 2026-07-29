import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/Button'
import { buildLevel, type CellConfig, type CellSpec } from '@/data/levels/builder'
import { CARDINAL } from '@/engine/board'
import { solvePuzzle } from '@/engine/solver'
import { useGameStore } from '@/stores/gameStore'
import type { Direction, PuzzleDefinition } from '@/engine/types'

/** A node the player can paint onto the grid. */
type PlaceTool =
  | 'basic'
  | 'pulse'
  | 'rotation'
  | 'mirror'
  | 'inverter'
  | 'teleporter'
type Tool = PlaceTool | 'erase' | 'lit'

interface CellDef {
  tool: PlaceTool
  active: boolean
  facing?: Direction
}

interface PaletteItem {
  id: Tool
  name: string
  glyph: string
  desc: string
}

const PALETTE: PaletteItem[] = [
  { id: 'basic', name: 'Signal', glyph: '●', desc: 'Toggles only itself.' },
  { id: 'pulse', name: 'Pulse', glyph: '✛', desc: 'Toggles its 4 neighbours.' },
  { id: 'rotation', name: 'Rotor', glyph: '▲', desc: 'Fires where it points, then turns.' },
  { id: 'mirror', name: 'Mirror', glyph: '⟋', desc: 'Reflects the signal diagonally.' },
  { id: 'inverter', name: 'Inverter', glyph: '⊘', desc: 'Flips neighbours + colour.' },
  { id: 'teleporter', name: 'Teleporter', glyph: '◎', desc: 'Auto-paired across the board.' },
  { id: 'lit', name: 'Toggle lit', glyph: '✦', desc: 'Set a node to start active.' },
  { id: 'erase', name: 'Erase', glyph: '×', desc: 'Remove a node.' },
]

const FACINGS: Direction[] = ['N', 'E', 'S', 'W']
const FACING_ROTATION: Record<Direction, number> = { N: 0, E: 90, S: 180, W: 270 }

function randomCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

function cellToSpec(cell: CellDef | null): CellSpec {
  if (!cell) return null
  const base: CellConfig = { active: cell.active }
  switch (cell.tool) {
    case 'basic':
      return { ...base, offsets: [] }
    case 'pulse':
      return { ...base, offsets: CARDINAL.map((o) => ({ ...o })) }
    case 'rotation':
      return { ...base, mechanic: 'rotation', facing: cell.facing ?? 'N', offsets: [] }
    case 'mirror':
      return {
        ...base,
        mechanic: 'mirror',
        facing: cell.facing ?? 'N',
        offsets: CARDINAL.map((o) => ({ ...o })),
      }
    case 'inverter':
      return { ...base, mechanic: 'inverter', offsets: CARDINAL.map((o) => ({ ...o })) }
    case 'teleporter':
      return { ...base, mechanic: 'teleporter', offsets: CARDINAL.map((o) => ({ ...o })) }
  }
}

export function CreatorPage() {
  const [title, setTitle] = useState('Untitled Signal')
  const [size, setSize] = useState(3)
  const [cells, setCells] = useState<Array<CellDef | null>>(() =>
    Array.from({ length: 9 }, () => ({ tool: 'basic', active: false }) as CellDef),
  )
  const [tool, setTool] = useState<Tool>('basic')
  const [facing, setFacing] = useState<Direction>('N')
  const [code, setCode] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const loadPuzzle = useGameStore((s) => s.loadPuzzle)
  const navigate = useNavigate()

  const nodeCount = cells.filter(Boolean).length

  const puzzle = useMemo<PuzzleDefinition>(() => {
    const grid: CellSpec[][] = Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (__, c) => cellToSpec(cells[r * size + c] ?? null)),
    )
    const built = buildLevel({
      id: `creator-${code ?? 'draft'}`,
      title,
      chapter: 0,
      levelNumber: 0,
      grid,
      par: { perfect: 3, gold: 4, silver: 6, bronze: 10 },
    })

    // Auto-pair teleporters in reading order so they link across the board.
    const teles = built.nodes.filter((n) => n.mechanic === 'teleporter')
    for (let i = 0; i + 1 < teles.length; i += 2) {
      teles[i].teleportTargetId = teles[i + 1].id
      teles[i + 1].teleportTargetId = teles[i].id
    }
    return built
  }, [size, cells, title, code])

  const resize = (next: number) => {
    setSize(next)
    setCells(Array.from({ length: next * next }, () => ({ tool: 'basic', active: false })))
    setCode(null)
    setMessage('')
  }

  const paintCell = (i: number) => {
    setCode(null)
    setMessage('')
    setCells((prev) =>
      prev.map((cell, idx) => {
        if (idx !== i) return cell
        if (tool === 'erase') return null
        if (tool === 'lit') return cell ? { ...cell, active: !cell.active } : cell
        return {
          tool,
          active: cell?.active ?? false,
          facing: tool === 'rotation' || tool === 'mirror' ? facing : undefined,
        }
      }),
    )
  }

  const publish = () => {
    if (nodeCount === 0) {
      setMessage('Add at least one node before publishing.')
      return
    }
    const result = solvePuzzle(puzzle, 12)
    if (!result.solvable || result.minMoves === null || result.minMoves === 0) {
      setMessage('Puzzle must be solvable (and not already solved) before publishing.')
      setCode(null)
      return
    }
    const share = randomCode()
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
    setCode(share)
    setMessage(`Published · Perfect par ${result.minMoves} · Share code ${share}`)
  }

  const playtest = () => {
    if (nodeCount === 0) {
      setMessage('Add at least one node before playtesting.')
      return
    }
    loadPuzzle(puzzle, 'creator')
    navigate('/play/creator')
  }

  const showFacing = tool === 'rotation' || tool === 'mirror'

  return (
    <div className="py-6">
      <p className="text-xs uppercase tracking-[0.3em] text-faint">Puzzle Creator</p>
      <h1 className="mt-2 text-3xl font-light tracking-tight">Design a signal</h1>
      <p className="mt-2 max-w-lg text-sm text-muted">
        Pick a node from the palette, then place it on the grid. Validate and share via code.
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
            <Button
              key={n}
              size="sm"
              variant={size === n ? 'primary' : 'secondary'}
              onClick={() => resize(n)}
            >
              {n}×{n}
            </Button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-6 md:flex-row">
          {/* Palette */}
          <div className="md:w-56 md:shrink-0">
            <p className="text-xs uppercase tracking-[0.2em] text-faint">Nodes</p>
            <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-1">
              {PALETTE.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTool(item.id)}
                  className={clsx(
                    'flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors',
                    tool === item.id
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]',
                  )}
                >
                  <span
                    className={clsx(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm',
                      tool === item.id
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-[var(--color-surface-strong)] text-[var(--color-text)]',
                    )}
                  >
                    {item.glyph}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{item.name}</span>
                    <span className="block truncate text-xs text-muted">{item.desc}</span>
                  </span>
                </button>
              ))}
            </div>

            {showFacing && (
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.2em] text-faint">Facing</p>
                <div className="mt-2 flex gap-2">
                  {FACINGS.map((f) => (
                    <Button
                      key={f}
                      size="sm"
                      variant={facing === f ? 'primary' : 'secondary'}
                      onClick={() => setFacing(f)}
                    >
                      {f}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Grid */}
          <div className="flex-1">
            <p className="text-sm text-muted">
              Selected: <span className="text-[var(--color-text)]">{PALETTE.find((p) => p.id === tool)?.name}</span> · tap a cell to apply.
            </p>
            <div
              className="mt-4 grid gap-3"
              style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, maxWidth: 360 }}
            >
              {Array.from({ length: size * size }).map((_, i) => {
                const cell = cells[i]
                const item = cell ? PALETTE.find((p) => p.id === cell.tool) : undefined
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`cell ${i}`}
                    onClick={() => paintCell(i)}
                    className="relative flex aspect-square items-center justify-center rounded-2xl border border-[var(--color-border)] transition-colors hover:border-[var(--color-accent)]"
                    style={{
                      background: cell
                        ? cell.active
                          ? 'rgba(59,130,246,0.35)'
                          : 'var(--color-surface-strong)'
                        : 'transparent',
                      opacity: cell ? 1 : 0.45,
                    }}
                  >
                    {cell && (
                      <span
                        className="text-lg text-[var(--color-text)]"
                        style={
                          cell.tool === 'rotation' && cell.facing
                            ? { transform: `rotate(${FACING_ROTATION[cell.facing]}deg)` }
                            : undefined
                        }
                      >
                        {item?.glyph}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <p className="mt-3 text-xs text-faint">
              Goal for players: light every node. {nodeCount} node{nodeCount === 1 ? '' : 's'} placed.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={playtest}>Playtest</Button>
          <Button variant="secondary" onClick={publish}>
            Publish
          </Button>
        </div>
        {message && <p className="mt-4 text-sm text-muted">{message}</p>}
        {code && (
          <p className="mt-1 text-sm text-[var(--color-accent)]">Share code: {code}</p>
        )}
      </GlassPanel>
    </div>
  )
}
