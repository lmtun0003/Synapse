import { create } from 'zustand'
import { applyMove, createBoard, resetBoard, undoMove } from '@/engine/board'
import { generatePuzzle, dailySeed } from '@/engine/generate'
import { getLevelById, getNextLevel } from '@/data/levels'
import { playSound } from '@/lib/audio'
import { haptic } from '@/lib/haptics'
import type { BoardState, PuzzleDefinition, RatingTier, SignalEvent } from '@/engine/types'

export type GameMode = 'campaign' | 'daily' | 'endless' | 'ranked' | 'duel' | 'creator'

interface GameStore {
  mode: GameMode
  puzzle: PuzzleDefinition | null
  board: BoardState | null
  startedAt: number | null
  lastEvents: SignalEvent[]
  endlessDifficulty: number
  duelOpponentProgress: number
  loadCampaignLevel: (id: string) => void
  loadDaily: () => void
  loadEndless: () => void
  loadRanked: () => void
  loadDuel: () => void
  loadPuzzle: (puzzle: PuzzleDefinition, mode: GameMode) => void
  tapNode: (nodeId: string) => { solved: boolean; rating: RatingTier } | null
  undo: () => void
  reset: () => void
  nextCampaign: () => string | null
  tickOpponent: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  mode: 'campaign',
  puzzle: null,
  board: null,
  startedAt: null,
  lastEvents: [],
  endlessDifficulty: 1,
  duelOpponentProgress: 0,

  loadPuzzle: (puzzle, mode) => {
    set({
      mode,
      puzzle,
      board: createBoard(puzzle),
      startedAt: performance.now(),
      lastEvents: [],
      duelOpponentProgress: 0,
    })
  },

  loadCampaignLevel: (id) => {
    const puzzle = getLevelById(id)
    if (!puzzle) return
    get().loadPuzzle(puzzle, 'campaign')
  },

  loadDaily: () => {
    const seed = dailySeed()
    const puzzle = generatePuzzle({
      seed,
      difficulty: 8,
      id: `daily-${seed}`,
      title: 'Daily Signal',
    })
    get().loadPuzzle(puzzle, 'daily')
  },

  loadEndless: () => {
    const difficulty = get().endlessDifficulty
    const seed = (Date.now() ^ (difficulty * 9973)) >>> 0
    const puzzle = generatePuzzle({
      seed,
      difficulty,
      id: `endless-${seed}`,
      title: `Endless ${difficulty}`,
    })
    get().loadPuzzle(puzzle, 'endless')
  },

  loadRanked: () => {
    // Identical puzzle per time bucket so all players share the board.
    const bucket = Math.floor(Date.now() / (5 * 60_000))
    const puzzle = generatePuzzle({
      seed: bucket * 13,
      difficulty: 10,
      id: `ranked-${bucket}`,
      title: 'Ranked Trial',
    })
    get().loadPuzzle(puzzle, 'ranked')
  },

  loadDuel: () => {
    const seed = Math.floor(Date.now() / 60_000)
    const puzzle = generatePuzzle({
      seed: seed * 7,
      difficulty: 7,
      id: `duel-${seed}`,
      title: 'Duel',
    })
    get().loadPuzzle(puzzle, 'duel')
  },

  tapNode: (nodeId) => {
    const { board, puzzle } = get()
    if (!board || !puzzle || board.status !== 'playing') return null
    const result = applyMove(board, puzzle, nodeId)
    playSound(result.events.some((e) => e.kind !== 'toggle') ? 'signal' : 'tap')
    haptic('light')
    set({ board: result.state, lastEvents: result.events })
    if (result.solved) {
      playSound('success')
      haptic('success')
      if (get().mode === 'endless') {
        set({ endlessDifficulty: get().endlessDifficulty + 1 })
      }
    }
    return { solved: result.solved, rating: result.rating }
  },

  undo: () => {
    const { board } = get()
    if (!board) return
    playSound('ui')
    set({ board: undoMove(board), lastEvents: [] })
  },

  reset: () => {
    const { puzzle } = get()
    if (!puzzle) return
    playSound('ui')
    set({
      board: resetBoard(puzzle),
      startedAt: performance.now(),
      lastEvents: [],
      duelOpponentProgress: 0,
    })
  },

  nextCampaign: () => {
    const { puzzle } = get()
    if (!puzzle) return null
    const next = getNextLevel(puzzle.id)
    if (!next) return null
    get().loadCampaignLevel(next.id)
    return next.id
  },

  tickOpponent: () => {
    if (get().mode !== 'duel') return
    set({ duelOpponentProgress: Math.min(100, get().duelOpponentProgress + 3 + Math.random() * 5) })
  },
}))
