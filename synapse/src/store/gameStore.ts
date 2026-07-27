import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  Puzzle,
  NodeState,
  Connection,
  GameMode,
  RatingTier,
  PlayerProfile,
  World,
  LevelResult,
  RankTier,
} from '@/types/game'
import {
  propagateSignals,
  checkWinCondition,
  buildInitialNodeStates,
  buildLevelResult,
} from '@/engine/gameEngine'
import { WORLDS } from '@/data/levels'

// ─── Game Slice ──────────────────────────────────────────────────────────────

interface GameSlice {
  puzzle: Puzzle | null
  nodeStates: Record<string, NodeState>
  activeConnections: Connection[]
  moveHistory: string[][]
  moveCount: number
  startTime: number | null
  completed: boolean
  rating: RatingTier
  mode: GameMode
  lastResult: LevelResult | null
  isAnimating: boolean

  startGame: (puzzle: Puzzle, mode?: GameMode) => void
  activateNode: (nodeId: string) => void
  undoMove: () => void
  resetPuzzle: () => void
  setAnimating: (v: boolean) => void
}

// ─── Progress Slice ──────────────────────────────────────────────────────────

interface ProgressSlice {
  worlds: World[]
  levelResults: Record<string, LevelResult>
  currentWorld: string
  currentLevel: number

  completeLevel: (result: LevelResult) => void
  unlockLevel: (levelNum: number) => void
  setCurrentLevel: (worldId: string, levelNum: number) => void
}

// ─── Player Slice ────────────────────────────────────────────────────────────

interface PlayerSlice {
  player: PlayerProfile
  updatePlayer: (partial: Partial<PlayerProfile>) => void
  addXP: (amount: number) => void
  addSparks: (amount: number) => void
  updateStreak: () => void
}

// ─── UI Slice ────────────────────────────────────────────────────────────────

interface UISlice {
  theme: 'dark' | 'light'
  sfxEnabled: boolean
  musicEnabled: boolean
  hapticEnabled: boolean
  showTutorial: boolean
  activeModal: string | null

  setTheme: (t: 'dark' | 'light') => void
  toggleSfx: () => void
  toggleMusic: () => void
  openModal: (id: string) => void
  closeModal: () => void
  setShowTutorial: (v: boolean) => void
}

// ─── Combined Store ──────────────────────────────────────────────────────────

type Store = GameSlice & ProgressSlice & PlayerSlice & UISlice

const DEFAULT_PLAYER: PlayerProfile = {
  id: 'local_player',
  username: 'Player',
  displayName: 'Player',
  xp: 0,
  level: 1,
  rank: 'bronze',
  elo: 1000,
  sparks: 150,
  prisms: 0,
  streaks: { daily: 0, win: 0, perfect: 0 },
  badges: [],
  stats: {
    totalSolved: 0,
    totalPerfect: 0,
    totalMoves: 0,
    totalTimeMs: 0,
    campaignProgress: 0,
    dailyStreak: 0,
    bestDailyRank: 0,
    rankedWins: 0,
    rankedLosses: 0,
    puzzlesCreated: 0,
    communityRating: 0,
  },
  createdAt: new Date().toISOString(),
}

function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.35, level - 1))
}

function calculateLevel(totalXp: number): number {
  let level = 1
  let xpNeeded = 0
  while (xpNeeded + xpForLevel(level) <= totalXp) {
    xpNeeded += xpForLevel(level)
    level++
    if (level > 999) break
  }
  return level
}

function rankFromElo(elo: number): RankTier {
  if (elo >= 2800) return 'synapse'
  if (elo >= 2400) return 'grandmaster'
  if (elo >= 2000) return 'master'
  if (elo >= 1600) return 'diamond'
  if (elo >= 1300) return 'platinum'
  if (elo >= 1100) return 'gold'
  if (elo >= 950) return 'silver'
  return 'bronze'
}

export const useGameStore = create<Store>()(
  persist(
    (set, get) => ({
      // ── Game State ──────────────────────────────────────────────────────
      puzzle: null,
      nodeStates: {},
      activeConnections: [],
      moveHistory: [],
      moveCount: 0,
      startTime: null,
      completed: false,
      rating: 'none',
      mode: 'campaign',
      lastResult: null,
      isAnimating: false,

      startGame: (puzzle, mode = 'campaign') => {
        const nodeStates = buildInitialNodeStates(puzzle)
        set({
          puzzle,
          nodeStates,
          activeConnections: [],
          moveHistory: [],
          moveCount: 0,
          startTime: Date.now(),
          completed: false,
          rating: 'none',
          mode,
          lastResult: null,
        })
      },

      activateNode: (nodeId) => {
        const { puzzle, nodeStates, moveCount, startTime, completed, isAnimating } = get()
        if (!puzzle || completed || isAnimating) return

        const { activatedIds, connections } = propagateSignals(
          puzzle.grid,
          nodeStates,
          nodeId,
          puzzle.rows,
          puzzle.cols
        )

        const newStates = { ...nodeStates }
        // Toggle clicked
        newStates[nodeId] = newStates[nodeId] === 'active' ? 'inactive' : 'active'
        // Apply propagated activations
        for (const id of activatedIds) {
          newStates[id] = 'active'
        }

        const newMoveCount = moveCount + 1
        const isWon = checkWinCondition(puzzle.grid, newStates)
        const timeMs = Date.now() - (startTime ?? Date.now())

        let result: LevelResult | null = null
        let rating: RatingTier = 'none'
        if (isWon) {
          result = buildLevelResult(puzzle.id, newMoveCount, timeMs, puzzle)
          rating = result.rating
          get().completeLevel(result)
          get().addXP(getRatingXP(rating))
          get().addSparks(getRatingSparks(rating))
        }

        set({
          nodeStates: newStates,
          activeConnections: connections,
          moveCount: newMoveCount,
          moveHistory: [...get().moveHistory, [nodeId]],
          completed: isWon,
          rating,
          lastResult: result,
        })
      },

      undoMove: () => {
        const { moveHistory, puzzle } = get()
        if (!puzzle || moveHistory.length === 0) return
        const newHistory = moveHistory.slice(0, -1)
        // Rebuild state from scratch by replaying
        const nodeStates = buildInitialNodeStates(puzzle)
        for (const [nodeId] of newHistory) {
          propagateSignals(puzzle.grid, nodeStates, nodeId, puzzle.rows, puzzle.cols)
          nodeStates[nodeId] = nodeStates[nodeId] === 'active' ? 'inactive' : 'active'
        }
        set({
          nodeStates,
          moveHistory: newHistory,
          moveCount: newHistory.length,
          completed: false,
          rating: 'none',
        })
      },

      resetPuzzle: () => {
        const { puzzle } = get()
        if (!puzzle) return
        set({
          nodeStates: buildInitialNodeStates(puzzle),
          activeConnections: [],
          moveHistory: [],
          moveCount: 0,
          startTime: Date.now(),
          completed: false,
          rating: 'none',
          lastResult: null,
        })
      },

      setAnimating: (v) => set({ isAnimating: v }),

      // ── Progress ────────────────────────────────────────────────────────
      worlds: WORLDS,
      levelResults: {},
      currentWorld: 'world1',
      currentLevel: 1,

      completeLevel: (result) => {
        const { worlds, levelResults } = get()
        const existing = levelResults[result.puzzleId]
        const isImprovement = !existing || result.moveCount < existing.moveCount

        const newResults = {
          ...levelResults,
          [result.puzzleId]: isImprovement ? result : existing,
        }

        // Unlock next level
        const newWorlds = worlds.map(world => ({
          ...world,
          levels: world.levels.map(level => {
            if (level.puzzle.id === result.puzzleId) {
              return { ...level, completed: true, bestResult: isImprovement ? result : level.bestResult }
            }
            // Unlock next level in same world
            const prevLevel = world.levels.find(l => l.puzzle.id === result.puzzleId)
            if (prevLevel && level.levelNumber === prevLevel.levelNumber + 1) {
              return { ...level, locked: false }
            }
            return level
          }),
        }))

        // Unlock next world if world is complete
        const updatedWorlds = newWorlds.map((world, wi) => {
          const allDone = world.levels.every(l => l.completed || l.locked === false)
          if (allDone && newWorlds[wi + 1]) {
            const next = { ...newWorlds[wi + 1], unlocked: true }
            next.levels = next.levels.map((l, li) => li === 0 ? { ...l, locked: false } : l)
            return world
          }
          return world
        })

        set({ levelResults: newResults, worlds: newWorlds })

        // Update stats
        const { player } = get()
        set({
          player: {
            ...player,
            stats: {
              ...player.stats,
              totalSolved: player.stats.totalSolved + 1,
              totalPerfect: player.stats.totalPerfect + (result.perfect ? 1 : 0),
              totalMoves: player.stats.totalMoves + result.moveCount,
              totalTimeMs: player.stats.totalTimeMs + result.timeMs,
            },
          },
        })
      },

      unlockLevel: (levelNum) => {
        set(state => ({
          worlds: state.worlds.map(w => ({
            ...w,
            levels: w.levels.map(l =>
              l.levelNumber === levelNum ? { ...l, locked: false } : l
            ),
          })),
        }))
      },

      setCurrentLevel: (worldId, levelNum) => set({ currentWorld: worldId, currentLevel: levelNum }),

      // ── Player ──────────────────────────────────────────────────────────
      player: DEFAULT_PLAYER,

      updatePlayer: (partial) => set(s => ({ player: { ...s.player, ...partial } })),

      addXP: (amount) => {
        const { player } = get()
        const newXp = player.xp + amount
        const newLevel = calculateLevel(newXp)
        set({ player: { ...player, xp: newXp, level: newLevel } })
      },

      addSparks: (amount) => {
        const { player } = get()
        set({ player: { ...player, sparks: player.sparks + amount } })
      },

      updateStreak: () => {
        const { player } = get()
        const newStreak = player.stats.dailyStreak + 1
        set({
          player: {
            ...player,
            stats: { ...player.stats, dailyStreak: newStreak },
            streaks: { ...player.streaks, daily: newStreak },
          },
        })
      },

      // ── UI ──────────────────────────────────────────────────────────────
      theme: 'dark',
      sfxEnabled: true,
      musicEnabled: true,
      hapticEnabled: true,
      showTutorial: true,
      activeModal: null,

      setTheme: (t) => set({ theme: t }),
      toggleSfx: () => set(s => ({ sfxEnabled: !s.sfxEnabled })),
      toggleMusic: () => set(s => ({ musicEnabled: !s.musicEnabled })),
      openModal: (id) => set({ activeModal: id }),
      closeModal: () => set({ activeModal: null }),
      setShowTutorial: (v) => set({ showTutorial: v }),
    }),
    {
      name: 'synapse-game-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        worlds: state.worlds,
        levelResults: state.levelResults,
        player: state.player,
        theme: state.theme,
        sfxEnabled: state.sfxEnabled,
        musicEnabled: state.musicEnabled,
        hapticEnabled: state.hapticEnabled,
        showTutorial: state.showTutorial,
      }),
    }
  )
)

function getRatingXP(rating: RatingTier): number {
  switch (rating) {
    case 'perfect': return 100
    case 'gold': return 60
    case 'silver': return 35
    case 'bronze': return 15
    default: return 5
  }
}

function getRatingSparks(rating: RatingTier): number {
  switch (rating) {
    case 'perfect': return 25
    case 'gold': return 15
    case 'silver': return 8
    case 'bronze': return 3
    default: return 1
  }
}
