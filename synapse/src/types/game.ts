// ─── Core Types ────────────────────────────────────────────────────────────

export type NodeType =
  | 'basic'
  | 'source'
  | 'target'
  | 'mirror'
  | 'rotator'
  | 'teleport'
  | 'gravity'
  | 'inverter'
  | 'gate_and'
  | 'gate_or'
  | 'locked'
  | 'timed'
  | 'bridge'
  | 'relay'

export type Direction = 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW'

export type NodeState = 'inactive' | 'active' | 'locked' | 'blocked' | 'charging'

export type SignalColor = 'blue' | 'purple' | 'green' | 'amber' | 'white'

export interface GridNode {
  id: string
  row: number
  col: number
  type: NodeType
  state: NodeState
  rotation: number          // degrees: 0, 90, 180, 270
  connections: Direction[]  // which directions carry signals
  signalColor?: SignalColor
  teleportPair?: string     // id of paired teleport node
  timerMs?: number
  requiredInputs?: number   // for AND gate
  activeInputs?: number
  metadata?: Record<string, unknown>
}

export interface Connection {
  fromId: string
  toId: string
  active: boolean
  color?: SignalColor
}

export interface Puzzle {
  id: string
  title: string
  description?: string
  grid: GridNode[]
  rows: number
  cols: number
  connections: Connection[]
  mechanics: NodeType[]
  targetMoves: {
    perfect: number
    gold: number
    silver: number
    bronze: number
  }
  solution?: string[]       // ordered node IDs for optimal solution
  hints?: string[]
  authorId?: string
  communityRating?: number
  playCount?: number
}

export type RatingTier = 'perfect' | 'gold' | 'silver' | 'bronze' | 'none'

export interface LevelResult {
  puzzleId: string
  moveCount: number
  timeMs: number
  rating: RatingTier
  perfect: boolean
  stars: number
}

// ─── Campaign Level ─────────────────────────────────────────────────────────

export interface CampaignLevel {
  levelNumber: number
  puzzle: Puzzle
  worldId: string
  locked: boolean
  completed: boolean
  bestResult?: LevelResult
  newMechanic?: string
  story?: string
}

export interface World {
  id: string
  name: string
  description: string
  mechanic: string
  color: string
  glowColor: string
  levels: CampaignLevel[]
  unlocked: boolean
  completed: boolean
}

// ─── Game State ──────────────────────────────────────────────────────────────

export interface GameState {
  puzzle: Puzzle | null
  nodeStates: Record<string, NodeState>
  activeConnections: Connection[]
  moveHistory: string[][]   // each entry = list of node IDs activated in that move
  moveCount: number
  startTime: number | null
  completed: boolean
  rating: RatingTier
  mode: GameMode
}

export type GameMode = 'campaign' | 'daily' | 'endless' | 'ranked' | 'duel' | 'creator' | 'practice'

// ─── Player ─────────────────────────────────────────────────────────────────

export type RankTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster' | 'synapse'

export interface PlayerProfile {
  id: string
  username: string
  displayName: string
  avatarUrl?: string
  title?: string
  border?: string
  xp: number
  level: number
  rank: RankTier
  elo: number
  sparks: number
  prisms: number
  streaks: {
    daily: number
    win: number
    perfect: number
  }
  stats: PlayerStats
  badges: string[]
  createdAt: string
}

export interface PlayerStats {
  totalSolved: number
  totalPerfect: number
  totalMoves: number
  totalTimeMs: number
  campaignProgress: number
  dailyStreak: number
  bestDailyRank: number
  rankedWins: number
  rankedLosses: number
  puzzlesCreated: number
  communityRating: number
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  displayName: string
  avatarUrl?: string
  score: number
  moveCount?: number
  timeMs?: number
  ratingTier?: RankTier
}

// ─── Shop ────────────────────────────────────────────────────────────────────

export type CosmeticType =
  | 'theme'
  | 'board_skin'
  | 'icon'
  | 'animation'
  | 'cursor'
  | 'background'
  | 'victory'
  | 'avatar_frame'
  | 'title'

export interface ShopItem {
  id: string
  name: string
  description: string
  type: CosmeticType
  preview?: string
  sparkCost?: number
  prismCost?: number
  limited?: boolean
  expiresAt?: string
  seasonExclusive?: boolean
  new?: boolean
}

// ─── Battle Pass ─────────────────────────────────────────────────────────────

export interface BattlePassReward {
  level: number
  free: ShopItem | { sparks: number } | { prisms: number }
  premium?: ShopItem | { sparks: number } | { prisms: number }
}

export interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
  rewards: BattlePassReward[]
  currentLevel: number
  xpToNextLevel: number
}

// ─── Puzzle Creator ──────────────────────────────────────────────────────────

export interface CreatorState {
  puzzle: Puzzle
  selectedTool: NodeType | 'select' | 'connect' | 'delete'
  selectedNodeId: string | null
  history: Puzzle[]
  historyIndex: number
  testMode: boolean
}
