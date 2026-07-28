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
  CommunityPuzzle,
  PuzzleRating,
  GridNode,
  Direction,
  NodeType,
} from '@/types/game'
import {
  propagateSignals,
  checkWinCondition,
  buildInitialNodeStates,
  buildLevelResult,
} from '@/engine/gameEngine'
import { WORLDS } from '@/data/levels'
import { ACHIEVEMENTS as ACHIEVEMENTS_DATA, TIER_DEFS as ACHIEVEMENT_TIER_DEFS } from '@/data/achievements'

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
  avatarId: string
  borderId: string
  unlockedAvatars: string[]
  unlockedBorders: string[]
  playerAchievements: Record<string, { currentTier: number; currentProgress: number }>
  pinnedAchievements: string[]

  updatePlayer: (partial: Partial<PlayerProfile>) => void
  addXP: (amount: number) => void
  addSparks: (amount: number) => void
  updateStreak: () => void
  setAvatar: (id: string) => void
  setBorder: (id: string) => void
  unlockAvatar: (id: string) => void
  unlockBorder: (id: string) => void
  updateAchievementProgress: (id: string, value: number) => void
  pinAchievement: (id: string) => void
}

// ─── Community Slice ─────────────────────────────────────────────────────────

interface CommunitySlice {
  communityPuzzles: CommunityPuzzle[]
  myRatings: Record<string, PuzzleRating>    // puzzleId → rating
  publishedPuzzles: CommunityPuzzle[]        // puzzles authored by current player

  publishPuzzle: (puzzle: Puzzle, description?: string, tags?: string[]) => CommunityPuzzle
  ratePuzzle: (puzzleId: string, stars: number, comment?: string) => void
  loadCommunityPuzzles: () => void
}

// ─── Tutorial Slice ───────────────────────────────────────────────────────────

interface TutorialSlice {
  hasSeenWelcome: boolean           // first-launch prompt shown?
  tutorialEnabled: boolean          // master toggle
  hasPlayedFirstGame: boolean       // in-game tutorial shown?
  currentTutorialStep: number

  setHasSeenWelcome: () => void
  resetWelcome: () => void
  setTutorialEnabled: (v: boolean) => void
  setHasPlayedFirstGame: () => void
  resetFirstGame: () => void
  setTutorialStep: (step: number) => void
  dismissTutorial: () => void
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

type Store = GameSlice & ProgressSlice & PlayerSlice & CommunitySlice & TutorialSlice & UISlice

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
      avatarId: 'nebula',
      borderId: 'none',
      unlockedAvatars: ['nebula'],
      unlockedBorders: ['none'],
      playerAchievements: {},
      pinnedAchievements: [],

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

      setAvatar: (id) => set({ avatarId: id }),
      setBorder: (id) => set({ borderId: id }),
      unlockAvatar: (id) => set(s => ({ unlockedAvatars: s.unlockedAvatars.includes(id) ? s.unlockedAvatars : [...s.unlockedAvatars, id] })),
      unlockBorder: (id) => set(s => ({ unlockedBorders: s.unlockedBorders.includes(id) ? s.unlockedBorders : [...s.unlockedBorders, id] })),

      updateAchievementProgress: (id, value) => {
        const { playerAchievements } = get()
        const current = playerAchievements[id] ?? { currentTier: 0, currentProgress: 0 }
        const ach = ACHIEVEMENTS_DATA.find(a => a.id === id)
        if (!ach) return
        let newTier = current.currentTier
        for (let t = current.currentTier; t < ach.tiers.length; t++) {
          if (value >= ach.tiers[t].target) newTier = t + 1
          else break
        }
        const tierGained = newTier - current.currentTier
        if (tierGained > 0) {
          for (let t = current.currentTier; t < newTier; t++) {
            get().addSparks(ACHIEVEMENT_TIER_DEFS[t]?.sparkReward ?? 10)
          }
        }
        set({ playerAchievements: { ...playerAchievements, [id]: { currentTier: newTier, currentProgress: value } } })
      },

      pinAchievement: (id) => set(s => ({
        pinnedAchievements: s.pinnedAchievements.includes(id)
          ? s.pinnedAchievements.filter(a => a !== id)
          : [...s.pinnedAchievements.slice(0, 3), id],
      })),

      // ── Community ────────────────────────────────────────────────────────
      communityPuzzles: SEED_COMMUNITY_PUZZLES,
      myRatings: {},
      publishedPuzzles: [],

      publishPuzzle: (puzzle, description, tags = []) => {
        const { player, communityPuzzles } = get()
        const difficulty = puzzle.rows <= 3 ? 'easy' : puzzle.rows <= 4 ? 'medium' : puzzle.rows <= 5 ? 'hard' : 'expert'
        const newPub: CommunityPuzzle = {
          id: `community_${Date.now()}`,
          puzzle: { ...puzzle, id: `community_${Date.now()}` },
          authorId: player.id,
          authorName: player.displayName,
          title: puzzle.title,
          description,
          shareCode: generateCode(),
          publishedAt: new Date().toISOString(),
          playCount: 0,
          ratingCount: 0,
          averageRating: 0,
          tags,
          difficulty,
        }
        set({
          communityPuzzles: [newPub, ...communityPuzzles],
          publishedPuzzles: [newPub, ...get().publishedPuzzles],
        })
        get().addSparks(10)
        return newPub
      },

      ratePuzzle: (puzzleId, stars, comment) => {
        const { myRatings, communityPuzzles, player } = get()
        const existing = myRatings[puzzleId]
        const newRating: PuzzleRating = {
          puzzleId, stars, comment,
          userId: player.id,
          ratedAt: new Date().toISOString(),
        }
        const updated = communityPuzzles.map(cp => {
          if (cp.id !== puzzleId) return cp
          const wasRated = !!existing
          const prevTotal = cp.averageRating * cp.ratingCount
          const newCount = wasRated ? cp.ratingCount : cp.ratingCount + 1
          const newTotal = wasRated ? prevTotal - existing.stars + stars : prevTotal + stars
          return { ...cp, ratingCount: newCount, averageRating: newTotal / newCount }
        })
        set({ communityPuzzles: updated, myRatings: { ...myRatings, [puzzleId]: newRating } })
      },

      loadCommunityPuzzles: () => {
        // In production this would fetch from Supabase
      },

      // ── Tutorial ─────────────────────────────────────────────────────────
      hasSeenWelcome: false,
      tutorialEnabled: true,
      hasPlayedFirstGame: false,
      currentTutorialStep: 0,

      setHasSeenWelcome: () => set({ hasSeenWelcome: true }),
      resetWelcome: () => set({ hasSeenWelcome: false, hasPlayedFirstGame: false, tutorialEnabled: true, currentTutorialStep: 0 }),
      setTutorialEnabled: (v) => set({ tutorialEnabled: v }),
      setHasPlayedFirstGame: () => set({ hasPlayedFirstGame: true }),
      resetFirstGame: () => set({ hasPlayedFirstGame: false, currentTutorialStep: 0 }),
      setTutorialStep: (step) => set({ currentTutorialStep: step }),
      dismissTutorial: () => set({ tutorialEnabled: false, hasPlayedFirstGame: true }),

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
        communityPuzzles: state.communityPuzzles,
        myRatings: state.myRatings,
        publishedPuzzles: state.publishedPuzzles,
        hasSeenWelcome: state.hasSeenWelcome,
        tutorialEnabled: state.tutorialEnabled,
        hasPlayedFirstGame: state.hasPlayedFirstGame,
        avatarId: state.avatarId,
        borderId: state.borderId,
        unlockedAvatars: state.unlockedAvatars,
        unlockedBorders: state.unlockedBorders,
        playerAchievements: state.playerAchievements,
        pinnedAchievements: state.pinnedAchievements,
      }),
    }
  )
)

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// ─── Seed Community Puzzles ───────────────────────────────────────────────────

function mkNode(id: string, r: number, c: number, type: NodeType, conns: Direction[]): GridNode {
  return { id, row: r, col: c, type, state: (type === 'source' ? 'active' : 'inactive') as NodeState, rotation: 0, connections: conns }
}

const SEED_COMMUNITY_PUZZLES: CommunityPuzzle[] = [
  {
    id: 'cp_001',
    title: 'Spiral Path',
    description: 'A classic spiral — can you find the perfect route?',
    authorId: 'neural_ace',
    authorName: 'NeuralAce',
    shareCode: 'SPIRAL01',
    publishedAt: '2026-07-25T10:00:00Z',
    playCount: 1247,
    ratingCount: 384,
    averageRating: 4.7,
    tags: ['beginner', 'classic'],
    difficulty: 'easy',
    featured: true,
    puzzle: {
      id: 'cp_001',
      title: 'Spiral Path',
      rows: 3, cols: 4,
      mechanics: ['basic'],
      targetMoves: { perfect: 3, gold: 4, silver: 5, bronze: 7 },
      connections: [],
      grid: [
        mkNode('s',  0, 0, 'source', ['E', 'S']),
        mkNode('n1', 0, 1, 'basic',  ['W', 'E']),
        mkNode('n2', 0, 2, 'basic',  ['W', 'E']),
        mkNode('t1', 0, 3, 'target', ['W', 'S']),
        mkNode('n3', 1, 0, 'basic',  ['N', 'S']),
        mkNode('n4', 1, 1, 'basic',  ['N', 'S', 'E']),
        mkNode('n5', 1, 2, 'basic',  ['E', 'W']),
        mkNode('n6', 1, 3, 'basic',  ['N', 'S', 'W']),
        mkNode('t2', 2, 0, 'target', ['N', 'E']),
        mkNode('n7', 2, 1, 'basic',  ['W', 'E']),
        mkNode('n8', 2, 2, 'basic',  ['W', 'E']),
        mkNode('t3', 2, 3, 'target', ['N', 'W']),
      ],
    },
  },
  {
    id: 'cp_002',
    title: 'Mirror Maze',
    description: 'Reflect your signals through a tight corridor.',
    authorId: 'grid_master',
    authorName: 'GridMaster',
    shareCode: 'MIRR0R02',
    publishedAt: '2026-07-24T14:30:00Z',
    playCount: 892,
    ratingCount: 256,
    averageRating: 4.5,
    tags: ['mirrors', 'intermediate'],
    difficulty: 'medium',
    featured: true,
    puzzle: {
      id: 'cp_002',
      title: 'Mirror Maze',
      rows: 4, cols: 4,
      mechanics: ['basic', 'mirror'],
      targetMoves: { perfect: 4, gold: 6, silver: 8, bronze: 11 },
      connections: [],
      grid: [
        mkNode('s',   0, 0, 'source', ['E', 'S']),
        mkNode('n01', 0, 1, 'basic',  ['W', 'E']),
        mkNode('m1',  0, 2, 'mirror', ['N', 'E']),
        mkNode('n03', 0, 3, 'basic',  ['W', 'S']),
        mkNode('n10', 1, 0, 'basic',  ['N', 'S']),
        mkNode('n11', 1, 1, 'basic',  ['N', 'S', 'E', 'W']),
        mkNode('n12', 1, 2, 'basic',  ['N', 'S', 'E', 'W']),
        mkNode('n13', 1, 3, 'basic',  ['N', 'S', 'W']),
        mkNode('m2',  2, 0, 'mirror', ['S', 'E']),
        mkNode('n21', 2, 1, 'basic',  ['N', 'S', 'E', 'W']),
        mkNode('n22', 2, 2, 'basic',  ['N', 'S', 'E', 'W']),
        mkNode('t1',  2, 3, 'target', ['N', 'S', 'W']),
        mkNode('n30', 3, 0, 'basic',  ['N', 'E']),
        mkNode('n31', 3, 1, 'basic',  ['W', 'E']),
        mkNode('n32', 3, 2, 'basic',  ['W', 'E']),
        mkNode('t2',  3, 3, 'target', ['W']),
      ],
    },
  },
  {
    id: 'cp_003',
    title: 'Quantum Leap',
    description: 'Use teleporters to bridge the impossible gap.',
    authorId: 'synapse_x',
    authorName: 'SynapseX',
    shareCode: 'QLEAP003',
    publishedAt: '2026-07-23T09:15:00Z',
    playCount: 654,
    ratingCount: 178,
    averageRating: 4.8,
    tags: ['teleport', 'expert'],
    difficulty: 'hard',
    featured: false,
    puzzle: {
      id: 'cp_003',
      title: 'Quantum Leap',
      rows: 4, cols: 5,
      mechanics: ['basic', 'teleport'],
      targetMoves: { perfect: 5, gold: 7, silver: 10, bronze: 14 },
      connections: [],
      grid: [
        mkNode('s',   0, 0, 'source',  ['E', 'S']),
        mkNode('n01', 0, 1, 'basic',   ['W', 'E']),
        mkNode('n02', 0, 2, 'basic',   ['W', 'S']),
        mkNode('n03', 0, 3, 'basic',   ['W', 'E']),
        mkNode('n04', 0, 4, 'basic',   ['W', 'S']),
        mkNode('n10', 1, 0, 'basic',   ['N', 'S']),
        mkNode('tp1', 1, 1, 'teleport',['N', 'S', 'E', 'W']),
        mkNode('n12', 1, 2, 'basic',   ['N', 'S']),
        mkNode('tp2', 1, 3, 'teleport',['N', 'S', 'E', 'W']),
        mkNode('n14', 1, 4, 'basic',   ['N', 'S']),
        mkNode('n20', 2, 0, 'basic',   ['N', 'S']),
        mkNode('n21', 2, 1, 'basic',   ['N', 'S', 'E']),
        mkNode('n22', 2, 2, 'basic',   ['N', 'S', 'E', 'W']),
        mkNode('n23', 2, 3, 'basic',   ['N', 'S', 'E', 'W']),
        mkNode('n24', 2, 4, 'basic',   ['N', 'S', 'W']),
        mkNode('t1',  3, 0, 'target',  ['N', 'E']),
        mkNode('n31', 3, 1, 'basic',   ['W', 'E']),
        mkNode('n32', 3, 2, 'basic',   ['W', 'E']),
        mkNode('n33', 3, 3, 'basic',   ['W', 'E']),
        mkNode('t2',  3, 4, 'target',  ['W']),
      ],
    },
  },
  {
    id: 'cp_004',
    title: 'The Inverter',
    description: 'Deactivate to activate. Think backwards.',
    authorId: 'logic_flow',
    authorName: 'LogicFlow',
    shareCode: 'INVRT004',
    publishedAt: '2026-07-22T16:45:00Z',
    playCount: 423,
    ratingCount: 112,
    averageRating: 4.3,
    tags: ['inverter', 'tricky'],
    difficulty: 'medium',
    featured: false,
    puzzle: {
      id: 'cp_004',
      title: 'The Inverter',
      rows: 3, cols: 4,
      mechanics: ['basic', 'inverter'],
      targetMoves: { perfect: 3, gold: 4, silver: 6, bronze: 9 },
      connections: [],
      grid: [
        mkNode('s',  0, 0, 'source',  ['E', 'S']),
        mkNode('n1', 0, 1, 'basic',   ['W', 'E', 'S']),
        mkNode('iv', 0, 2, 'inverter',['W', 'E', 'S']),
        mkNode('t1', 0, 3, 'target',  ['W', 'S']),
        mkNode('n4', 1, 0, 'basic',   ['N', 'S', 'E']),
        mkNode('n5', 1, 1, 'basic',   ['N', 'S', 'E', 'W']),
        mkNode('n6', 1, 2, 'basic',   ['N', 'S', 'E', 'W']),
        mkNode('n7', 1, 3, 'basic',   ['N', 'S', 'W']),
        mkNode('t2', 2, 0, 'target',  ['N', 'E']),
        mkNode('n9', 2, 1, 'basic',   ['W', 'E']),
        mkNode('na', 2, 2, 'basic',   ['W', 'E']),
        mkNode('t3', 2, 3, 'target',  ['W']),
      ],
    },
  },
  {
    id: 'cp_005',
    title: 'Gravity Falls',
    description: 'Every signal must fall before it can rise.',
    authorId: 'algo_mind',
    authorName: 'AlgoMind',
    shareCode: 'GRAV0005',
    publishedAt: '2026-07-21T11:00:00Z',
    playCount: 331,
    ratingCount: 89,
    averageRating: 4.1,
    tags: ['gravity', 'vertical'],
    difficulty: 'medium',
    featured: false,
    puzzle: {
      id: 'cp_005',
      title: 'Gravity Falls',
      rows: 4, cols: 3,
      mechanics: ['basic', 'gravity'],
      targetMoves: { perfect: 4, gold: 5, silver: 7, bronze: 10 },
      connections: [],
      grid: [
        mkNode('s',  0, 1, 'source',  ['S', 'E', 'W']),
        mkNode('n1', 0, 0, 'basic',   ['E', 'S']),
        mkNode('n2', 0, 2, 'basic',   ['W', 'S']),
        mkNode('g1', 1, 0, 'gravity', ['S', 'E']),
        mkNode('n4', 1, 1, 'basic',   ['N', 'S', 'E', 'W']),
        mkNode('g2', 1, 2, 'gravity', ['S', 'W']),
        mkNode('n6', 2, 0, 'basic',   ['N', 'S', 'E']),
        mkNode('n7', 2, 1, 'basic',   ['N', 'S', 'E', 'W']),
        mkNode('n8', 2, 2, 'basic',   ['N', 'S', 'W']),
        mkNode('t1', 3, 0, 'target',  ['N', 'E']),
        mkNode('t2', 3, 1, 'target',  ['N', 'E', 'W']),
        mkNode('t3', 3, 2, 'target',  ['N', 'W']),
      ],
    },
  },
  {
    id: 'cp_006',
    title: 'Crossfire',
    description: 'Two signals. One crossing point. No mistakes.',
    authorId: 'circuit_ai',
    authorName: 'CircuitAI',
    shareCode: 'XFIRE006',
    publishedAt: '2026-07-20T08:00:00Z',
    playCount: 789,
    ratingCount: 201,
    averageRating: 4.6,
    tags: ['advanced', 'precise'],
    difficulty: 'hard',
    featured: false,
    puzzle: {
      id: 'cp_006',
      title: 'Crossfire',
      rows: 4, cols: 4,
      mechanics: ['basic', 'relay'],
      targetMoves: { perfect: 5, gold: 7, silver: 9, bronze: 13 },
      connections: [],
      grid: [
        mkNode('s1',  0, 0, 'source', ['E', 'S']),
        mkNode('n01', 0, 1, 'basic',  ['W', 'E']),
        mkNode('n02', 0, 2, 'basic',  ['W', 'S']),
        mkNode('t1',  0, 3, 'target', ['W', 'S']),
        mkNode('n10', 1, 0, 'basic',  ['N', 'S']),
        mkNode('r1',  1, 1, 'relay',  ['N', 'S', 'E', 'W']),
        mkNode('r2',  1, 2, 'relay',  ['N', 'S', 'E', 'W']),
        mkNode('n13', 1, 3, 'basic',  ['N', 'S', 'W']),
        mkNode('n20', 2, 0, 'basic',  ['N', 'S', 'E']),
        mkNode('r3',  2, 1, 'relay',  ['N', 'S', 'E', 'W']),
        mkNode('r4',  2, 2, 'relay',  ['N', 'S', 'E', 'W']),
        mkNode('n23', 2, 3, 'basic',  ['N', 'S', 'W']),
        mkNode('t2',  3, 0, 'target', ['N', 'E']),
        mkNode('n31', 3, 1, 'basic',  ['W', 'E']),
        mkNode('n32', 3, 2, 'basic',  ['W', 'E']),
        mkNode('s2',  3, 3, 'source', ['W', 'N']),
      ],
    },
  },
]

// patch teleport pairs on cp_003
const tp1 = SEED_COMMUNITY_PUZZLES[2].puzzle.grid.find(n => n.id === 'tp1')
const tp2 = SEED_COMMUNITY_PUZZLES[2].puzzle.grid.find(n => n.id === 'tp2')
if (tp1) tp1.teleportPair = 'tp2'
if (tp2) tp2.teleportPair = 'tp1'

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
