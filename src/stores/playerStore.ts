import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_ELO, rankFromElo, updateElo } from '@/lib/elo'
import { ratingSparks, ratingXp, isBetterRating } from '@/engine/rating'
import type { RankTier, RatingTier } from '@/engine/types'

export interface LevelProgress {
  bestRating: RatingTier
  bestMoves: number
  completions: number
  perfect: boolean
}

interface PlayerState {
  displayName: string
  xp: number
  level: number
  title: string
  sparks: number
  prisms: number
  elo: number
  rank: RankTier
  dailyStreak: number
  perfectStreak: number
  winStreak: number
  lastDailyDate: string | null
  ownedCosmetics: string[]
  equippedTheme: string
  equippedBoard: string
  achievements: string[]
  levelProgress: Record<string, LevelProgress>
  stats: {
    puzzlesSolved: number
    perfectScores: number
    totalMoves: number
    fastestSolveMs: number | null
    campaignsCompleted: number
  }
  setDisplayName: (name: string) => void
  recordSolve: (payload: {
    puzzleId: string
    rating: RatingTier
    moves: number
    elapsedMs: number
    mode: 'campaign' | 'daily' | 'endless' | 'ranked' | 'duel'
  }) => void
  purchaseItem: (id: string, currency: 'sparks' | 'prisms', price: number) => boolean
  equipCosmetic: (kind: 'theme' | 'board', id: string) => void
  unlockAchievement: (id: string, sparks: number) => void
  applyRankedResult: (won: boolean, opponentElo: number) => void
}

function xpToLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 50)) + 1
}

function titleForLevel(level: number): string {
  if (level >= 50) return 'Synapse'
  if (level >= 40) return 'Grandmaster'
  if (level >= 30) return 'Architect'
  if (level >= 20) return 'Conductor'
  if (level >= 10) return 'Operator'
  if (level >= 5) return 'Initiate'
  return 'Spark'
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      displayName: 'Player',
      xp: 0,
      level: 1,
      title: 'Spark',
      sparks: 100,
      prisms: 0,
      elo: DEFAULT_ELO,
      rank: rankFromElo(DEFAULT_ELO),
      dailyStreak: 0,
      perfectStreak: 0,
      winStreak: 0,
      lastDailyDate: null,
      ownedCosmetics: ['theme-midnight'],
      equippedTheme: 'theme-midnight',
      equippedBoard: 'board-default',
      achievements: [],
      levelProgress: {},
      stats: {
        puzzlesSolved: 0,
        perfectScores: 0,
        totalMoves: 0,
        fastestSolveMs: null,
        campaignsCompleted: 0,
      },
      setDisplayName: (displayName) => set({ displayName }),
      recordSolve: ({ puzzleId, rating, moves, elapsedMs, mode }) => {
        const state = get()
        const prev = state.levelProgress[puzzleId]
        const bestRating =
          prev && isBetterRating(prev.bestRating, rating) ? prev.bestRating : rating
        const bestMoves = prev ? Math.min(prev.bestMoves, moves) : moves
        const xpGain = ratingXp(rating)
        const sparkGain = ratingSparks(rating)
        const xp = state.xp + xpGain
        const level = xpToLevel(xp)
        const perfectStreak = rating === 'perfect' ? state.perfectStreak + 1 : 0
        const winStreak = state.winStreak + 1

        let dailyStreak = state.dailyStreak
        let lastDailyDate = state.lastDailyDate
        if (mode === 'daily') {
          const today = new Date().toISOString().slice(0, 10)
          if (lastDailyDate) {
            const prevDate = new Date(lastDailyDate)
            const diff = Math.round(
              (Date.parse(today) - prevDate.getTime()) / 86_400_000,
            )
            dailyStreak = diff === 1 ? dailyStreak + 1 : diff === 0 ? dailyStreak : 1
          } else {
            dailyStreak = 1
          }
          lastDailyDate = today
        }

        set({
          xp,
          level,
          title: titleForLevel(level),
          sparks: state.sparks + sparkGain,
          perfectStreak,
          winStreak,
          dailyStreak,
          lastDailyDate,
          levelProgress: {
            ...state.levelProgress,
            [puzzleId]: {
              bestRating,
              bestMoves,
              completions: (prev?.completions ?? 0) + 1,
              perfect: bestRating === 'perfect' || rating === 'perfect',
            },
          },
          stats: {
            puzzlesSolved: state.stats.puzzlesSolved + 1,
            perfectScores:
              state.stats.perfectScores + (rating === 'perfect' ? 1 : 0),
            totalMoves: state.stats.totalMoves + moves,
            fastestSolveMs:
              state.stats.fastestSolveMs === null
                ? elapsedMs
                : Math.min(state.stats.fastestSolveMs, elapsedMs),
            campaignsCompleted: state.stats.campaignsCompleted,
          },
        })
      },
      purchaseItem: (id, currency, price) => {
        const state = get()
        if (state.ownedCosmetics.includes(id)) return false
        if (currency === 'sparks' && state.sparks < price) return false
        if (currency === 'prisms' && state.prisms < price) return false
        set({
          sparks: currency === 'sparks' ? state.sparks - price : state.sparks,
          prisms: currency === 'prisms' ? state.prisms - price : state.prisms,
          ownedCosmetics: [...state.ownedCosmetics, id],
        })
        return true
      },
      equipCosmetic: (kind, id) => {
        if (kind === 'theme') set({ equippedTheme: id })
        else set({ equippedBoard: id })
      },
      unlockAchievement: (id, sparks) => {
        const state = get()
        if (state.achievements.includes(id)) return
        set({
          achievements: [...state.achievements, id],
          sparks: state.sparks + sparks,
        })
      },
      applyRankedResult: (won, opponentElo) => {
        const elo = updateElo(get().elo, opponentElo, won ? 1 : 0)
        set({
          elo,
          rank: rankFromElo(elo),
          winStreak: won ? get().winStreak + 1 : 0,
        })
      },
    }),
    { name: 'synapse.player.v1' },
  ),
)
