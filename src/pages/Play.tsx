import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Board } from '@/components/game/Board'
import { WinOverlay } from '@/components/game/WinOverlay'
import { MechanicIntro } from '@/components/game/MechanicIntro'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Badge'
import { useGameStore, type GameMode } from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'
import { getChapterMeta, getStageInfo, isChapterOpening } from '@/data/levels'
import { tutorialMechanics } from '@/data/mechanics'
import type { MechanicKind } from '@/engine/types'

export function PlayPage() {
  const { mode = 'campaign', levelId } = useParams<{ mode: GameMode; levelId?: string }>()
  const navigate = useNavigate()
  const {
    puzzle,
    board,
    lastEvents,
    duelOpponentProgress,
    loadCampaignLevel,
    loadDaily,
    loadEndless,
    loadRanked,
    loadDuel,
    tapNode,
    undo,
    reset,
    nextCampaign,
    tickOpponent,
  } = useGameStore()
  const recordSolve = usePlayerStore((s) => s.recordSolve)
  const markMechanicsSeen = usePlayerStore((s) => s.markMechanicsSeen)
  const startedAt = useGameStore((s) => s.startedAt)
  const recorded = useRef(false)

  const [introMechanics, setIntroMechanics] = useState<MechanicKind[]>([])
  const [legendOpen, setLegendOpen] = useState(false)

  useEffect(() => {
    recorded.current = false
    if (mode === 'campaign' && levelId) loadCampaignLevel(levelId)
    else if (mode === 'daily') loadDaily()
    else if (mode === 'endless') loadEndless()
    else if (mode === 'ranked') loadRanked()
    else if (mode === 'duel') loadDuel()
  }, [mode, levelId, loadCampaignLevel, loadDaily, loadEndless, loadRanked, loadDuel])

  // Surface an explainer whenever a puzzle introduces a mechanic the player
  // has not yet encountered.
  useEffect(() => {
    if (!puzzle) return
    const seen = usePlayerStore.getState().seenMechanics
    const fresh = tutorialMechanics(puzzle.mechanics).filter((m) => !seen.includes(m))
    setIntroMechanics(fresh)
  }, [puzzle])

  useEffect(() => {
    if (mode !== 'duel') return
    const id = window.setInterval(() => tickOpponent(), 1200)
    return () => window.clearInterval(id)
  }, [mode, tickOpponent])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'z' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        undo()
      }
      if (e.key === 'r' && !e.metaKey && !e.ctrlKey) reset()
      if (e.key === 'Escape') navigate(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, reset, navigate])

  useEffect(() => {
    if (!board || board.status !== 'won' || !puzzle || recorded.current) return
    recorded.current = true
    const elapsedMs = startedAt ? performance.now() - startedAt : 0
    recordSolve({
      puzzleId: puzzle.id,
      rating: board.rating,
      moves: board.moveCount,
      elapsedMs,
      mode: mode === 'creator' ? 'campaign' : mode,
    })
  }, [board, puzzle, mode, startedAt, recordSolve])

  if (!puzzle || !board) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted">
        Tuning the signal…
      </div>
    )
  }

  const isCampaign = mode === 'campaign'
  const chapterMeta = isCampaign ? getChapterMeta(puzzle.chapter) : undefined
  const stageInfo = isCampaign ? getStageInfo(puzzle) : null
  const chapterOpening = isCampaign && isChapterOpening(puzzle)
  const puzzleMechanics = tutorialMechanics(puzzle.mechanics)

  const dismissIntro = () => {
    markMechanicsSeen(puzzle.mechanics)
    setIntroMechanics([])
  }

  return (
    <div className="relative min-h-dvh py-4">
      {introMechanics.length > 0 && (
        <MechanicIntro
          mechanics={introMechanics}
          chapter={
            chapterOpening && chapterMeta
              ? {
                  id: chapterMeta.id,
                  title: chapterMeta.title,
                  subtitle: chapterMeta.subtitle,
                }
              : undefined
          }
          onClose={dismissIntro}
        />
      )}
      {legendOpen && (
        <MechanicIntro
          mechanics={puzzleMechanics.length > 0 ? puzzleMechanics : ['basic']}
          variant="legend"
          onClose={() => setLegendOpen(false)}
        />
      )}

      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <Link to={isCampaign ? '/campaign' : '/'} className="text-xs text-muted hover:text-[var(--color-text)]">
            ← Back
          </Link>
          {isCampaign && chapterMeta && stageInfo && (
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">
              Chapter {chapterMeta.id} · {chapterMeta.title} · Stage {stageInfo.stage}/
              {stageInfo.totalStages}
            </p>
          )}
          <h1 className="mt-1 text-xl font-light tracking-wide">{puzzle.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Pill>{mode}</Pill>
            <Pill>
              Moves {board.moveCount}
              {puzzle.par.perfect ? ` / ${puzzle.par.perfect}` : ''}
            </Pill>
            {puzzleMechanics.length > 0 && (
              <button
                type="button"
                onClick={() => setLegendOpen(true)}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
              >
                <span aria-hidden>ⓘ</span> How nodes work
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={undo} disabled={board.history.length === 0}>
            Undo
          </Button>
          <Button variant="secondary" size="sm" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>

      {puzzle.hint && board.moveCount === 0 && (
        <p className="mb-6 text-center text-sm text-muted">{puzzle.hint}</p>
      )}

      <div className="relative flex min-h-[50vh] items-center justify-center py-8">
        <Board
          board={board}
          events={lastEvents}
          onTap={(id) => tapNode(id)}
          disabled={board.status !== 'playing'}
        />
        {board.status === 'won' && (
          <WinOverlay
            rating={board.rating}
            moves={board.moveCount}
            parPerfect={puzzle.par.perfect}
            showNext={mode === 'campaign' || mode === 'endless'}
            onNext={() => {
              if (mode === 'endless') {
                loadEndless()
                recorded.current = false
                return
              }
              const next = nextCampaign()
              if (next) {
                recorded.current = false
                navigate(`/play/campaign/${next}`, { replace: true })
              } else navigate('/campaign')
            }}
            onRetry={() => {
              reset()
              recorded.current = false
            }}
            onExit={() => navigate(mode === 'campaign' ? '/campaign' : '/')}
          />
        )}
      </div>

      {mode === 'duel' && (
        <div className="mx-auto mt-4 max-w-md">
          <div className="mb-2 flex justify-between text-xs text-muted">
            <span>Opponent</span>
            <span>{Math.round(duelOpponentProgress)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-strong)]">
            <div
              className="h-full rounded-full bg-[var(--color-secondary)] transition-all duration-500"
              style={{ width: `${duelOpponentProgress}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-faint">
            Opponent progress only — solutions stay hidden.
          </p>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-faint">
        Shortcuts: Ctrl/⌘Z undo · R reset · Esc exit
      </p>
    </div>
  )
}
