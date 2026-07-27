/**
 * SYNAPSE Puzzle Engine — Core Types
 * Pure domain models with no UI or framework dependencies.
 */

/** Node mechanic kinds introduced gradually across the campaign. */
export type MechanicKind =
  | 'basic'
  | 'rotation'
  | 'mirror'
  | 'gravity'
  | 'teleporter'
  | 'inverter'
  | 'logic_gate'
  | 'power_link'
  | 'locked'
  | 'timed'

export type LogicGateType = 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR'

export type Direction = 'N' | 'E' | 'S' | 'W'

export type NodeColor = 'neutral' | 'blue' | 'purple' | 'amber' | 'green'

export type RatingTier = 'none' | 'bronze' | 'silver' | 'gold' | 'perfect'

export type RankTier =
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Diamond'
  | 'Master'
  | 'Grandmaster'
  | 'Synapse'

/** A single cell on the puzzle grid. */
export interface PuzzleNode {
  id: string
  row: number
  col: number
  /** Whether the node currently emits / is activated. */
  active: boolean
  /** Target activation state required for a perfect solve. Defaults to true. */
  targetActive: boolean
  mechanic: MechanicKind
  /** Orthogonally adjacent cells this node toggles when activated (relative offsets). */
  affectOffsets: Array<{ dr: number; dc: number }>
  /** Rotation facing for rotation / mirror / gravity nodes. */
  facing?: Direction
  /** Paired teleporter destination node id. */
  teleportTargetId?: string
  /** Logic gate configuration. */
  gateType?: LogicGateType
  /** Input node ids for logic gates / power links. */
  inputIds?: string[]
  /** Colour channel used by inversion / colour puzzles. */
  color?: NodeColor
  /** Locked nodes require a key-signal before they can be toggled. */
  locked?: boolean
  /** Timed nodes deactivate after N moves unless refreshed. */
  timer?: number
  /** Whether this node can be directly tapped by the player. */
  interactive: boolean
  /** Visual / solver metadata. */
  label?: string
}

export interface PuzzleDefinition {
  id: string
  title: string
  chapter: number
  levelNumber: number
  width: number
  height: number
  nodes: PuzzleNode[]
  /** Par moves for rating thresholds. */
  par: {
    perfect: number
    gold: number
    silver: number
    bronze: number
  }
  /** Mechanics featured in this puzzle (for unlock UI). */
  mechanics: MechanicKind[]
  /** Short flavour / tutorial hint. */
  hint?: string
  /** Optional narrative beat shown before play. */
  intro?: string
}

export interface BoardState {
  puzzleId: string
  width: number
  height: number
  nodes: PuzzleNode[]
  moveCount: number
  history: BoardSnapshot[]
  status: 'playing' | 'won' | 'failed'
  rating: RatingTier
  elapsedMs: number
  signalEvents: SignalEvent[]
}

export interface BoardSnapshot {
  nodes: PuzzleNode[]
  moveCount: number
}

export interface SignalEvent {
  id: string
  fromId: string
  toId: string
  kind: 'toggle' | 'teleport' | 'invert' | 'power' | 'gravity'
  timestamp: number
}

export interface MoveResult {
  state: BoardState
  solved: boolean
  rating: RatingTier
  events: SignalEvent[]
}

export interface SolveResult {
  solvable: boolean
  minMoves: number | null
  sequence: string[] | null
}
