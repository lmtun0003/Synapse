import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_ELO, rankFromElo, updateElo } from '@/lib/elo'
import { ratingSparks, ratingXp, isBetterRating } from '@/engine/rating'
import {
  ACHIEVEMENTS,
  tiersReached,
  sparksBetweenTiers,
  tierLabel,
  type AchievementMetric,
} from '@/data/achievements'
import {
  currentMonthKey,
  seasonStandings,
  type PlayerLocation,
  type RewardBundle,
} from '@/lib/leaderboard'
import type { MechanicKind, RankTier, RatingTier } from '@/engine/types'

export interface LevelProgress {
  bestRating: RatingTier
  bestMoves: number
  completions: number
  perfect: boolean
}

export interface AchievementUnlock {
  id: string
  title: string
  tier: number
  tierName: string
  sparks: number
}

export interface SeasonClaim {
  month: string
  total: RewardBundle
  breakdown: { scope: string; rank: number; reward: RewardBundle }[]
}

interface PlayerState {
  displayName: string
  country: string
  region: string
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
  /** Achievement id -> number of tiers claimed (0 = locked). */
  achievementTiers: Record<string, number>
  /** Achievement ids featured on the public profile (max 3). */
  showcasedAchievements: string[]
  /** Newly earned tiers awaiting a toast. */
  recentUnlocks: AchievementUnlock[]
  /** Node mechanics the player has already been introduced to. */
  seenMechanics: MechanicKind[]
  /** Month (YYYY-MM) the last season reward was claimed. */
  lastSeasonRewardMonth: string | null
  levelProgress: Record<string, LevelProgress>
  stats: {
    puzzlesSolved: number
    perfectScores: number
    totalMoves: number
    fastestSolveMs: number | null
    campaignsCompleted: number
    maxDailyStreak: number
  }
  setDisplayName: (name: string) => void
  setLocation: (country: string, region: string) => void
  recordSolve: (payload: {
    puzzleId: string
    rating: RatingTier
    moves: number
    elapsedMs: number
    mode: 'campaign' | 'daily' | 'endless' | 'ranked' | 'duel'
  }) => void
  purchaseItem: (id: string, currency: 'sparks' | 'prisms', price: number) => boolean
  equipCosmetic: (kind: 'theme' | 'board', id: string) => void
  markMechanicsSeen: (mechanics: MechanicKind[]) => void
  syncAchievements: () => AchievementUnlock[]
  setShowcase: (ids: string[]) => void
  dismissUnlock: (id: string) => void
  applyRankedResult: (won: boolean, opponentElo: number) => void
  claimSeasonRewards: () => SeasonClaim | null
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
      country: 'United States',
      region: 'California',
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
      achievementTiers: {},
      showcasedAchievements: [],
      recentUnlocks: [],
      seenMechanics: [],
      lastSeasonRewardMonth: null,
      levelProgress: {},
      stats: {
        puzzlesSolved: 0,
        perfectScores: 0,
        totalMoves: 0,
        fastestSolveMs: null,
        campaignsCompleted: 0,
        maxDailyStreak: 0,
      },
      setDisplayName: (displayName) => set({ displayName }),
      setLocation: (country, region) => set({ country, region }),
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
            maxDailyStreak: Math.max(state.stats.maxDailyStreak, dailyStreak),
          },
        })
        get().syncAchievements()
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
      markMechanicsSeen: (mechanics) => {
        const seen = new Set(get().seenMechanics)
        let changed = false
        for (const m of mechanics) {
          if (!seen.has(m)) {
            seen.add(m)
            changed = true
          }
        }
        if (changed) set({ seenMechanics: [...seen] })
      },
      syncAchievements: () => {
        const state = get()
        const metrics: Record<AchievementMetric, number> = {
          puzzlesSolved: state.stats.puzzlesSolved,
          perfectScores: state.stats.perfectScores,
          level: state.level,
          elo: state.elo,
          maxDailyStreak: state.stats.maxDailyStreak,
        }

        const nextTiers = { ...state.achievementTiers }
        const unlocks: AchievementUnlock[] = []
        let sparkGain = 0

        for (const ach of ACHIEVEMENTS) {
          const reached = tiersReached(ach, metrics[ach.metric])
          const claimed = nextTiers[ach.id] ?? 0
          if (reached > claimed) {
            sparkGain += sparksBetweenTiers(ach, claimed, reached)
            for (let t = claimed + 1; t <= reached; t++) {
              unlocks.push({
                id: ach.id,
                title: ach.title,
                tier: t,
                tierName: tierLabel(t),
                sparks: ach.tiers[t - 1]?.sparks ?? 0,
              })
            }
            nextTiers[ach.id] = reached
          }
        }

        if (unlocks.length === 0) return []

        set({
          achievementTiers: nextTiers,
          sparks: state.sparks + sparkGain,
          recentUnlocks: [...state.recentUnlocks, ...unlocks],
        })
        return unlocks
      },
      setShowcase: (ids) => set({ showcasedAchievements: ids.slice(0, 3) }),
      dismissUnlock: (id) =>
        set({
          recentUnlocks: get().recentUnlocks.filter(
            (u) => `${u.id}-${u.tier}` !== id,
          ),
        }),
      applyRankedResult: (won, opponentElo) => {
        const elo = updateElo(get().elo, opponentElo, won ? 1 : 0)
        set({
          elo,
          rank: rankFromElo(elo),
          winStreak: won ? get().winStreak + 1 : 0,
        })
        get().syncAchievements()
      },
      claimSeasonRewards: () => {
        const state = get()
        const month = currentMonthKey()
        if (state.lastSeasonRewardMonth === month) return null

        const location: PlayerLocation = {
          name: state.displayName,
          elo: state.elo,
          country: state.country,
          region: state.region,
        }
        const standings = seasonStandings(location)
        const total = standings.reduce(
          (acc, s) => ({
            sparks: acc.sparks + s.reward.sparks,
            prisms: acc.prisms + s.reward.prisms,
          }),
          { sparks: 0, prisms: 0 } as RewardBundle,
        )

        set({
          sparks: state.sparks + total.sparks,
          prisms: state.prisms + total.prisms,
          lastSeasonRewardMonth: month,
        })

        return {
          month,
          total,
          breakdown: standings.map((s) => ({
            scope: s.scope,
            rank: s.rank,
            reward: s.reward,
          })),
        }
      },
    }),
    { name: 'synapse.player.v1', version: 2 },
  ),
)
