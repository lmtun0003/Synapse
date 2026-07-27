import { useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Board } from '@/components/game/Board'
import { WinOverlay } from '@/components/game/WinOverlay'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Badge'
import { useGameStore, type GameMode } from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'
import { ACHIEVEMENTS } from '@/data/achievements'

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
  const unlockAchievement = usePlayerStore((s) => s.unlockAchievement)
  const startedAt = useGameStore((s) => s.startedAt)
  const recorded = useRef(false)

  useEffect(() => {
    recorded.current = false
    if (mode === 'campaign' && levelId) loadCampaignLevel(levelId)
    else if (mode === 'daily') loadDaily()
    else if (mode === 'endless') loadEndless()
    else if (mode === 'ranked') loadRanked()
    else if (mode === 'duel') loadDuel()
  }, [mode, levelId, loadCampaignLevel, loadDaily, loadEndless, loadRanked, loadDuel])

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
    if (usePlayerStore.getState().stats.puzzlesSolved === 1) {
      const a = ACHIEVEMENTS.find((x) => x.id === 'first-spark')
      if (a) unlockAchievement(a.id, a.sparks)
    }
  }, [board, puzzle, mode, startedAt, recordSolve, unlockAchievement])

  if (!puzzle || !board) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted">
        Tuning the signal…
      </div>
    )
  }

  return (
    <div className="relative min-h-dvh py-4">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <Link to={mode === 'campaign' ? '/campaign' : '/'} className="text-xs text-muted hover:text-[var(--color-text)]">
            ← Back
          </Link>
          <h1 className="mt-2 text-xl font-light tracking-wide">{puzzle.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Pill>{mode}</Pill>
            <Pill>
              Moves {board.moveCount}
              {puzzle.par.perfect ? ` / ${puzzle.par.perfect}` : ''}
            </Pill>
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
