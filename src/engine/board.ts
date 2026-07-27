import { opposite, reflect, rotateClockwise, DELTAS } from './directions'
import { rateSolve } from './rating'
import type {
  BoardState,
  Direction,
  MoveResult,
  PuzzleDefinition,
  PuzzleNode,
  SignalEvent,
} from './types'

let eventSeq = 0

function nextEventId(): string {
  eventSeq += 1
  return `evt-${eventSeq}`
}

export function cloneNodes(nodes: PuzzleNode[]): PuzzleNode[] {
  return nodes.map((n) => ({
    ...n,
    affectOffsets: n.affectOffsets.map((o) => ({ ...o })),
    inputIds: n.inputIds ? [...n.inputIds] : undefined,
  }))
}

export function createBoard(puzzle: PuzzleDefinition): BoardState {
  return {
    puzzleId: puzzle.id,
    width: puzzle.width,
    height: puzzle.height,
    nodes: cloneNodes(puzzle.nodes),
    moveCount: 0,
    history: [],
    status: 'playing',
    rating: 'none',
    elapsedMs: 0,
    signalEvents: [],
  }
}

export function nodeAt(nodes: PuzzleNode[], row: number, col: number): PuzzleNode | undefined {
  return nodes.find((n) => n.row === row && n.col === col)
}

export function isSolved(nodes: PuzzleNode[]): boolean {
  return nodes.every((n) => n.active === n.targetActive)
}

function toggleNode(node: PuzzleNode): void {
  if (node.mechanic === 'locked' && node.locked) return
  node.active = !node.active
}

function applyTimerTick(nodes: PuzzleNode[]): void {
  for (const n of nodes) {
    if (n.mechanic === 'timed' && typeof n.timer === 'number' && n.active) {
      n.timer -= 1
      if (n.timer <= 0) {
        n.active = false
        n.timer = 0
      }
    }
  }
}

function evaluateLogicGates(nodes: PuzzleNode[]): SignalEvent[] {
  const events: SignalEvent[] = []
  const byId = new Map(nodes.map((n) => [n.id, n]))

  for (const gate of nodes.filter((n) => n.mechanic === 'logic_gate')) {
    const inputs = (gate.inputIds ?? [])
      .map((id) => byId.get(id))
      .filter((n): n is PuzzleNode => Boolean(n))
    const values = inputs.map((i) => i.active)
    let result = false

    switch (gate.gateType) {
      case 'AND':
        result = values.length > 0 && values.every(Boolean)
        break
      case 'OR':
        result = values.some(Boolean)
        break
      case 'XOR':
        result = values.filter(Boolean).length === 1
        break
      case 'NAND':
        result = !(values.length > 0 && values.every(Boolean))
        break
      case 'NOR':
        result = !values.some(Boolean)
        break
      default:
        result = values.every(Boolean)
    }

    if (gate.active !== result) {
      gate.active = result
      for (const input of inputs) {
        events.push({
          id: nextEventId(),
          fromId: input.id,
          toId: gate.id,
          kind: 'power',
          timestamp: performance.now(),
        })
      }
    }
  }

  return events
}

function propagatePowerLinks(nodes: PuzzleNode[], sourceId: string): SignalEvent[] {
  const events: SignalEvent[] = []
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const source = byId.get(sourceId)
  if (!source) return events

  for (const link of nodes.filter((n) => n.mechanic === 'power_link')) {
    if (!(link.inputIds ?? []).includes(sourceId)) continue
    toggleNode(link)
    events.push({
      id: nextEventId(),
      fromId: sourceId,
      toId: link.id,
      kind: 'power',
      timestamp: performance.now(),
    })
  }

  return events
}

function applyGravity(nodes: PuzzleNode[], width: number, height: number): SignalEvent[] {
  const events: SignalEvent[] = []
  // Active gravity nodes pull inactive nodes one step toward them along their facing axis.
  const gravityNodes = nodes.filter((n) => n.mechanic === 'gravity' && n.active && n.facing)

  for (const g of gravityNodes) {
    const pullDir = opposite(g.facing as Direction)
    const delta = DELTAS[pullDir]

    for (const n of nodes) {
      if (n.id === g.id || n.mechanic === 'locked') continue
      const nextRow = n.row + delta.dr
      const nextCol = n.col + delta.dc
      if (nextRow < 0 || nextCol < 0 || nextRow >= height || nextCol >= width) continue
      // Only pull if the node is aligned with the gravity well and empty destination.
      const aligned =
        (delta.dr !== 0 && n.col === g.col && Math.sign(g.row - n.row) === delta.dr) ||
        (delta.dc !== 0 && n.row === g.row && Math.sign(g.col - n.col) === delta.dc)
      if (!aligned) continue
      if (nodeAt(nodes, nextRow, nextCol)) continue

      events.push({
        id: nextEventId(),
        fromId: n.id,
        toId: g.id,
        kind: 'gravity',
        timestamp: performance.now(),
      })
      n.row = nextRow
      n.col = nextCol
    }
  }

  return events
}

/**
 * Apply a player tap on a node. Returns the new board state and signal events.
 * Mechanics cascade deterministically — no randomness.
 */
export function applyMove(
  state: BoardState,
  puzzle: PuzzleDefinition,
  nodeId: string,
): MoveResult {
  if (state.status !== 'playing') {
    return { state, solved: state.status === 'won', rating: state.rating, events: [] }
  }

  const nodes = cloneNodes(state.nodes)
  const target = nodes.find((n) => n.id === nodeId)
  if (!target || !target.interactive) {
    return { state, solved: false, rating: 'none', events: [] }
  }
  if (target.mechanic === 'locked' && target.locked) {
    return { state, solved: false, rating: 'none', events: [] }
  }

  const events: SignalEvent[] = []
  const snapshot = { nodes: cloneNodes(state.nodes), moveCount: state.moveCount }

  // Primary toggle — the tapped node always flips.
  toggleNode(target)
  events.push({
    id: nextEventId(),
    fromId: target.id,
    toId: target.id,
    kind: 'toggle',
    timestamp: performance.now(),
  })

  // Inverter flips colour + activation of neighbours
  if (target.mechanic === 'inverter') {
    for (const offset of target.affectOffsets) {
      const neighbour = nodeAt(nodes, target.row + offset.dr, target.col + offset.dc)
      if (!neighbour) continue
      toggleNode(neighbour)
      neighbour.color = neighbour.color === 'blue' ? 'purple' : 'blue'
      events.push({
        id: nextEventId(),
        fromId: target.id,
        toId: neighbour.id,
        kind: 'invert',
        timestamp: performance.now(),
      })
    }
  } else if (target.mechanic === 'mirror' && target.facing) {
    // Mirror redirects the signal along reflected directions.
    for (const offset of target.affectOffsets) {
      let dir: Direction =
        offset.dr === -1 ? 'N' : offset.dr === 1 ? 'S' : offset.dc === 1 ? 'E' : 'W'
      dir = reflect(dir, target.facing)
      const delta = DELTAS[dir]
      const neighbour = nodeAt(nodes, target.row + delta.dr, target.col + delta.dc)
      if (!neighbour) continue
      toggleNode(neighbour)
      events.push({
        id: nextEventId(),
        fromId: target.id,
        toId: neighbour.id,
        kind: 'toggle',
        timestamp: performance.now(),
      })
    }
  } else if (target.mechanic === 'teleporter' && target.teleportTargetId) {
    const dest = nodes.find((n) => n.id === target.teleportTargetId)
    if (dest) {
      toggleNode(dest)
      // Also unlock locked destinations.
      if (dest.mechanic === 'locked') dest.locked = false
      events.push({
        id: nextEventId(),
        fromId: target.id,
        toId: dest.id,
        kind: 'teleport',
        timestamp: performance.now(),
      })
      for (const offset of dest.affectOffsets) {
        const neighbour = nodeAt(nodes, dest.row + offset.dr, dest.col + offset.dc)
        if (!neighbour) continue
        toggleNode(neighbour)
        events.push({
          id: nextEventId(),
          fromId: dest.id,
          toId: neighbour.id,
          kind: 'toggle',
          timestamp: performance.now(),
        })
      }
    }
  } else if (target.mechanic === 'rotation' && target.facing) {
    // Fire along current facing, then rotate clockwise for the next tap.
    const delta = DELTAS[target.facing]
    const neighbour = nodeAt(nodes, target.row + delta.dr, target.col + delta.dc)
    if (neighbour) {
      if (neighbour.mechanic === 'locked' && neighbour.locked) {
        neighbour.locked = false
        events.push({
          id: nextEventId(),
          fromId: target.id,
          toId: neighbour.id,
          kind: 'power',
          timestamp: performance.now(),
        })
      } else {
        toggleNode(neighbour)
        events.push({
          id: nextEventId(),
          fromId: target.id,
          toId: neighbour.id,
          kind: 'toggle',
          timestamp: performance.now(),
        })
      }
    }
    target.facing = rotateClockwise(target.facing)
  } else {
    // Standard / gravity / timed / power_link: toggle affect offsets.
    for (const offset of target.affectOffsets) {
      const neighbour = nodeAt(nodes, target.row + offset.dr, target.col + offset.dc)
      if (!neighbour) continue
      if (neighbour.mechanic === 'locked' && neighbour.locked) {
        // Hitting a locked node with a signal unlocks it without toggling.
        neighbour.locked = false
        events.push({
          id: nextEventId(),
          fromId: target.id,
          toId: neighbour.id,
          kind: 'power',
          timestamp: performance.now(),
        })
        continue
      }
      toggleNode(neighbour)
      if (neighbour.mechanic === 'timed' && neighbour.active) {
        neighbour.timer = neighbour.timer && neighbour.timer > 0 ? neighbour.timer : 3
      }
      events.push({
        id: nextEventId(),
        fromId: target.id,
        toId: neighbour.id,
        kind: 'toggle',
        timestamp: performance.now(),
      })
    }
  }

  events.push(...propagatePowerLinks(nodes, target.id))
  events.push(...evaluateLogicGates(nodes))
  events.push(...applyGravity(nodes, state.width, state.height))
  applyTimerTick(nodes)

  // Re-evaluate gates after gravity / timers for consistency.
  events.push(...evaluateLogicGates(nodes))

  const moveCount = state.moveCount + 1
  const solved = isSolved(nodes)
  const rating = solved ? rateSolve(puzzle, moveCount) : 'none'

  const next: BoardState = {
    ...state,
    nodes,
    moveCount,
    history: [...state.history, snapshot],
    status: solved ? 'won' : 'playing',
    rating,
    signalEvents: events,
  }

  return { state: next, solved, rating, events }
}

export function undoMove(state: BoardState): BoardState {
  if (state.history.length === 0 || state.status === 'won') return state
  const history = [...state.history]
  const prev = history.pop()!
  return {
    ...state,
    nodes: cloneNodes(prev.nodes),
    moveCount: prev.moveCount,
    history,
    status: 'playing',
    rating: 'none',
    signalEvents: [],
  }
}

export function resetBoard(puzzle: PuzzleDefinition): BoardState {
  return createBoard(puzzle)
}

/** Cardinal neighbour offsets helper for level authors. */
export const CARDINAL = [
  { dr: -1, dc: 0 },
  { dr: 1, dc: 0 },
  { dr: 0, dc: -1 },
  { dr: 0, dc: 1 },
] as const

export const SELF = [{ dr: 0, dc: 0 }] as const
