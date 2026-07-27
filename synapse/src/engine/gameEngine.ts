import type {
  GridNode,
  Puzzle,
  NodeState,
  Connection,
  Direction,
  RatingTier,
  LevelResult,
} from '@/types/game'

// ─── Directional Helpers ────────────────────────────────────────────────────

const DIRECTION_DELTA: Record<Direction, [number, number]> = {
  N:  [-1,  0],
  S:  [ 1,  0],
  E:  [ 0,  1],
  W:  [ 0, -1],
  NE: [-1,  1],
  NW: [-1, -1],
  SE: [ 1,  1],
  SW: [ 1, -1],
}

const OPPOSITE: Record<Direction, Direction> = {
  N: 'S', S: 'N', E: 'W', W: 'E',
  NE: 'SW', SW: 'NE', NW: 'SE', SE: 'NW',
}

/** Rotate a direction by 90° increments clockwise */
function rotateDirection(dir: Direction, degrees: number): Direction {
  const order: Direction[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const steps = Math.round(degrees / 45) % 8
  const idx = order.indexOf(dir)
  return order[(idx + steps + 8) % 8]
}

/** Get effective connections after applying node rotation */
function getEffectiveConnections(node: GridNode): Direction[] {
  if (node.rotation === 0) return node.connections
  return node.connections.map(d => rotateDirection(d, node.rotation))
}

/** Build a lookup map: `${row},${col}` → GridNode */
function buildGrid(nodes: GridNode[]): Map<string, GridNode> {
  const map = new Map<string, GridNode>()
  for (const n of nodes) {
    map.set(`${n.row},${n.col}`, n)
  }
  return map
}

// ─── Signal Propagation ──────────────────────────────────────────────────────

export interface PropagationResult {
  activatedIds: Set<string>
  connections: Connection[]
  blocked: Set<string>
}

/**
 * Flood-fills the grid starting from all source/active nodes and determines
 * which nodes become active given the current interaction.
 */
export function propagateSignals(
  nodes: GridNode[],
  nodeStates: Record<string, NodeState>,
  clickedNodeId: string,
  rows: number,
  cols: number
): PropagationResult {
  const grid = buildGrid(nodes)
  const nodeMap = new Map(nodes.map(n => [n.id, n]))
  const activatedIds = new Set<string>()
  const blocked = new Set<string>()
  const connections: Connection[] = []

  // Clone states for this propagation pass
  const states: Record<string, NodeState> = { ...nodeStates }

  // Toggle clicked node
  const clicked = nodeMap.get(clickedNodeId)
  if (!clicked || states[clickedNodeId] === 'locked') return { activatedIds, connections, blocked }

  if (states[clickedNodeId] === 'active') {
    states[clickedNodeId] = 'inactive'
  } else {
    states[clickedNodeId] = 'active'
    activatedIds.add(clickedNodeId)
  }

  // BFS propagation
  const queue: GridNode[] = []
  const visited = new Set<string>()

  // Seed queue from all currently active + newly activated nodes
  for (const node of nodes) {
    const st = node.id === clickedNodeId ? states[clickedNodeId] : nodeStates[node.id]
    if (st === 'active' && (node.type === 'source' || node.type === 'basic' || node.id === clickedNodeId)) {
      queue.push(node)
      visited.add(node.id)
    }
  }

  const newStates: Record<string, NodeState> = { ...states }

  while (queue.length > 0) {
    const current = queue.shift()!
    const effConns = getEffectiveConnections(current)

    for (const dir of effConns) {
      const [dr, dc] = DIRECTION_DELTA[dir]
      const nr = current.row + dr
      const nc = current.col + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue

      const neighbor = grid.get(`${nr},${nc}`)
      if (!neighbor) continue
      if (newStates[neighbor.id] === 'locked') {
        blocked.add(neighbor.id)
        continue
      }

      // Check if neighbor accepts signal from this direction
      const neighborEffConns = getEffectiveConnections(neighbor)
      const incoming = OPPOSITE[dir]

      let accepts = false
      switch (neighbor.type) {
        case 'basic':
        case 'target':
        case 'relay':
          accepts = neighborEffConns.includes(incoming) || neighborEffConns.length === 0
          break
        case 'mirror':
          accepts = true // mirror reflects, handled by connection routing
          break
        case 'inverter':
          accepts = true
          break
        case 'gate_and':
          neighbor.activeInputs = (neighbor.activeInputs ?? 0) + 1
          accepts = neighbor.activeInputs >= (neighbor.requiredInputs ?? 2)
          break
        case 'gate_or':
          accepts = true
          break
        case 'teleport':
          accepts = true
          break
        default:
          accepts = true
      }

      if (!accepts) continue

      connections.push({
        fromId: current.id,
        toId: neighbor.id,
        active: true,
      })

      if (!visited.has(neighbor.id)) {
        visited.add(neighbor.id)

        if (neighbor.type === 'inverter') {
          // Inverter: if active → deactivate, if inactive → activate
          if (newStates[neighbor.id] === 'active') {
            newStates[neighbor.id] = 'inactive'
          } else {
            newStates[neighbor.id] = 'active'
            activatedIds.add(neighbor.id)
          }
        } else if (neighbor.type === 'teleport' && neighbor.teleportPair) {
          newStates[neighbor.id] = 'active'
          activatedIds.add(neighbor.id)
          // Teleport the signal to the pair
          const pair = nodeMap.get(neighbor.teleportPair)
          if (pair && !visited.has(pair.id)) {
            newStates[pair.id] = 'active'
            activatedIds.add(pair.id)
            queue.push(pair)
            visited.add(pair.id)
          }
        } else {
          newStates[neighbor.id] = 'active'
          activatedIds.add(neighbor.id)
          queue.push(neighbor)
        }
      }
    }
  }

  return { activatedIds, connections, blocked }
}

// ─── Win Condition ───────────────────────────────────────────────────────────

export function checkWinCondition(
  nodes: GridNode[],
  nodeStates: Record<string, NodeState>
): boolean {
  const targetNodes = nodes.filter(n => n.type === 'target')
  if (targetNodes.length === 0) {
    // If no explicit targets, all non-source nodes must be active
    return nodes.every(n => n.type === 'source' || nodeStates[n.id] === 'active')
  }
  return targetNodes.every(n => nodeStates[n.id] === 'active')
}

// ─── Rating ──────────────────────────────────────────────────────────────────

export function calculateRating(
  moveCount: number,
  timeMs: number,
  puzzle: Puzzle
): RatingTier {
  const { perfect, gold, silver, bronze } = puzzle.targetMoves
  if (moveCount <= perfect) return 'perfect'
  if (moveCount <= gold) return 'gold'
  if (moveCount <= silver) return 'silver'
  if (moveCount <= bronze) return 'bronze'
  return 'none'
}

export function calculateStars(rating: RatingTier): number {
  switch (rating) {
    case 'perfect': return 4
    case 'gold': return 3
    case 'silver': return 2
    case 'bronze': return 1
    default: return 0
  }
}

export function buildLevelResult(
  puzzleId: string,
  moveCount: number,
  timeMs: number,
  puzzle: Puzzle
): LevelResult {
  const rating = calculateRating(moveCount, timeMs, puzzle)
  return {
    puzzleId,
    moveCount,
    timeMs,
    rating,
    perfect: rating === 'perfect',
    stars: calculateStars(rating),
  }
}

// ─── Initial State Builder ───────────────────────────────────────────────────

export function buildInitialNodeStates(puzzle: Puzzle): Record<string, NodeState> {
  const states: Record<string, NodeState> = {}
  for (const node of puzzle.grid) {
    if (node.type === 'source') {
      states[node.id] = 'active'
    } else if (node.type === 'locked') {
      states[node.id] = 'locked'
    } else {
      states[node.id] = 'inactive'
    }
  }
  return states
}

// ─── Procedural Puzzle Generator ─────────────────────────────────────────────

export interface GeneratorOptions {
  rows: number
  cols: number
  difficulty: number     // 0–1
  mechanicsPool: string[]
  seed?: number
}

/** Simple seeded PRNG (xorshift) */
function seededRandom(seed: number) {
  let s = seed || Date.now()
  return () => {
    s ^= s << 13
    s ^= s >> 17
    s ^= s << 5
    return (s >>> 0) / 0xffffffff
  }
}

export function generatePuzzle(opts: GeneratorOptions): Puzzle {
  const rng = seededRandom(opts.seed ?? Date.now())
  const { rows, cols, difficulty } = opts
  const nodeCount = rows * cols

  const nodes: GridNode[] = []
  const allDirections: Direction[] = ['N', 'S', 'E', 'W']

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = `${r}_${c}`
      const isSource = r === Math.floor(rows / 2) && c === 0
      const isTarget = r === Math.floor(rows / 2) && c === cols - 1

      // Assign connections: connect towards center for non-edge nodes
      const connections: Direction[] = []
      if (r > 0) connections.push('N')
      if (r < rows - 1) connections.push('S')
      if (c > 0) connections.push('W')
      if (c < cols - 1) connections.push('E')

      // Prune some connections for difficulty
      const keepFraction = 0.4 + (1 - difficulty) * 0.5
      const finalConns = connections.filter(() => rng() < keepFraction)
      if (finalConns.length === 0 && connections.length > 0) {
        finalConns.push(connections[Math.floor(rng() * connections.length)])
      }

      nodes.push({
        id,
        row: r,
        col: c,
        type: isSource ? 'source' : isTarget ? 'target' : 'basic',
        state: isSource ? 'active' : 'inactive',
        rotation: 0,
        connections: finalConns,
      })
    }
  }

  const targetMoves = Math.max(2, Math.floor(nodeCount * 0.3 + difficulty * 5))

  return {
    id: `gen_${Date.now()}`,
    title: 'Endless Puzzle',
    grid: nodes,
    rows,
    cols,
    connections: [],
    mechanics: ['basic'],
    targetMoves: {
      perfect: targetMoves,
      gold: targetMoves + 2,
      silver: targetMoves + 4,
      bronze: targetMoves + 7,
    },
  }
}
