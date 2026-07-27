import type { Puzzle, World, GridNode, Direction, NodeType, NodeState } from '@/types/game'

// ─── World 1: Awakening (Levels 1–20, Basic Activation) ─────────────────────

const world1Puzzles: Puzzle[] = [
  // Level 1 – Introduction: One source, one target
  {
    id: 'w1_l1',
    title: 'First Light',
    description: 'Activate the node to send a signal to the target.',
    rows: 3,
    cols: 3,
    mechanics: ['basic'],
    targetMoves: { perfect: 1, gold: 1, silver: 2, bronze: 3 },
    connections: [],
    grid: [
      { id: 'a', row: 1, col: 0, type: 'source', state: 'active', rotation: 0, connections: ['E'] },
      { id: 'b', row: 1, col: 1, type: 'basic',  state: 'inactive', rotation: 0, connections: ['E', 'W'] },
      { id: 'c', row: 1, col: 2, type: 'target', state: 'inactive', rotation: 0, connections: ['W'] },
    ],
    solution: ['b'],
    hints: ['Click the middle node to connect the source to the target.'],
  },
  // Level 2 – Branch: Signal splits two ways
  {
    id: 'w1_l2',
    title: 'Fork',
    description: 'The signal must reach both targets.',
    rows: 3,
    cols: 3,
    mechanics: ['basic'],
    targetMoves: { perfect: 2, gold: 3, silver: 4, bronze: 6 },
    connections: [],
    grid: [
      { id: 'src', row: 1, col: 0, type: 'source', state: 'active', rotation: 0, connections: ['E'] },
      { id: 'mid', row: 1, col: 1, type: 'basic',  state: 'inactive', rotation: 0, connections: ['N', 'S', 'W', 'E'] },
      { id: 't1',  row: 0, col: 1, type: 'target', state: 'inactive', rotation: 0, connections: ['S'] },
      { id: 't2',  row: 2, col: 1, type: 'target', state: 'inactive', rotation: 0, connections: ['N'] },
      { id: 't3',  row: 1, col: 2, type: 'basic',  state: 'inactive', rotation: 0, connections: ['W'] },
    ],
    solution: ['mid', 't3'],
    hints: ['Activate the center node – it connects in all directions.'],
  },
  // Level 3 – Chain
  {
    id: 'w1_l3',
    title: 'Chain Reaction',
    description: 'Activate nodes in sequence.',
    rows: 1,
    cols: 5,
    mechanics: ['basic'],
    targetMoves: { perfect: 3, gold: 4, silver: 5, bronze: 7 },
    connections: [],
    grid: [
      { id: 'n0', row: 0, col: 0, type: 'source', state: 'active', rotation: 0, connections: ['E'] },
      { id: 'n1', row: 0, col: 1, type: 'basic',  state: 'inactive', rotation: 0, connections: ['E', 'W'] },
      { id: 'n2', row: 0, col: 2, type: 'basic',  state: 'inactive', rotation: 0, connections: ['E', 'W'] },
      { id: 'n3', row: 0, col: 3, type: 'basic',  state: 'inactive', rotation: 0, connections: ['E', 'W'] },
      { id: 'n4', row: 0, col: 4, type: 'target', state: 'inactive', rotation: 0, connections: ['W'] },
    ],
    solution: ['n1', 'n2', 'n3'],
  },
  // Level 4 – Cross
  {
    id: 'w1_l4',
    title: 'Crossroads',
    description: 'Activate all nodes.',
    rows: 3,
    cols: 3,
    mechanics: ['basic'],
    targetMoves: { perfect: 4, gold: 5, silver: 6, bronze: 8 },
    connections: [],
    grid: [
      { id: 'c00', row: 0, col: 0, type: 'basic',  state: 'inactive', rotation: 0, connections: ['E', 'S'] },
      { id: 'c01', row: 0, col: 1, type: 'target', state: 'inactive', rotation: 0, connections: ['W', 'E', 'S'] },
      { id: 'c02', row: 0, col: 2, type: 'basic',  state: 'inactive', rotation: 0, connections: ['W', 'S'] },
      { id: 'c10', row: 1, col: 0, type: 'source', state: 'active',   rotation: 0, connections: ['N', 'E', 'S'] },
      { id: 'c11', row: 1, col: 1, type: 'basic',  state: 'inactive', rotation: 0, connections: ['N', 'S', 'E', 'W'] },
      { id: 'c12', row: 1, col: 2, type: 'target', state: 'inactive', rotation: 0, connections: ['N', 'S', 'W'] },
      { id: 'c20', row: 2, col: 0, type: 'basic',  state: 'inactive', rotation: 0, connections: ['N', 'E'] },
      { id: 'c21', row: 2, col: 1, type: 'target', state: 'inactive', rotation: 0, connections: ['N', 'W', 'E'] },
      { id: 'c22', row: 2, col: 2, type: 'basic',  state: 'inactive', rotation: 0, connections: ['N', 'W'] },
    ],
    solution: ['c11', 'c01', 'c12', 'c21'],
  },
  // Level 5 – Relay
  {
    id: 'w1_l5',
    title: 'Long Range',
    description: 'Bridge the gap with relay nodes.',
    rows: 3,
    cols: 5,
    mechanics: ['basic', 'relay'],
    targetMoves: { perfect: 3, gold: 4, silver: 5, bronze: 7 },
    connections: [],
    grid: [
      { id: 's',   row: 1, col: 0, type: 'source', state: 'active',   rotation: 0, connections: ['E'] },
      { id: 'r1',  row: 1, col: 1, type: 'relay',  state: 'inactive', rotation: 0, connections: ['E', 'W', 'N', 'S'] },
      { id: 'r2',  row: 1, col: 2, type: 'relay',  state: 'inactive', rotation: 0, connections: ['E', 'W', 'N', 'S'] },
      { id: 'r3',  row: 1, col: 3, type: 'relay',  state: 'inactive', rotation: 0, connections: ['E', 'W', 'N', 'S'] },
      { id: 't',   row: 1, col: 4, type: 'target', state: 'inactive', rotation: 0, connections: ['W'] },
      { id: 'b1',  row: 0, col: 2, type: 'basic',  state: 'inactive', rotation: 0, connections: ['S'] },
      { id: 'b2',  row: 2, col: 2, type: 'basic',  state: 'inactive', rotation: 0, connections: ['N'] },
    ],
    solution: ['r1', 'r2', 'r3'],
  },
]

// Level 6-20: generate programmatically with increasing grid sizes & configurations
for (let i = 6; i <= 20; i++) {
  const cols = Math.min(3 + Math.floor(i / 4), 7)
  const rows = Math.min(3 + Math.floor(i / 6), 5)
  world1Puzzles.push({
    id: `w1_l${i}`,
    title: `Awakening ${i}`,
    description: `Activate all target nodes.`,
    rows,
    cols,
    mechanics: ['basic'],
    targetMoves: {
      perfect: Math.floor(i * 0.6),
      gold: Math.floor(i * 0.8),
      silver: i,
      bronze: Math.floor(i * 1.5),
    },
    connections: [],
    grid: (() => {
      const nodes: GridNode[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isSource = r === Math.floor(rows / 2) && c === 0
          const isTarget = c === cols - 1
          const conns: Direction[] = []
          if (r > 0) conns.push('N')
          if (r < rows - 1) conns.push('S')
          if (c > 0) conns.push('W')
          if (c < cols - 1) conns.push('E')
          nodes.push({
            id: `w1_l${i}_${r}_${c}`,
            row: r, col: c,
            type: (isSource ? 'source' : isTarget ? 'target' : 'basic') as NodeType,
            state: (isSource ? 'active' : 'inactive') as NodeState,
            rotation: 0,
            connections: conns,
          })
        }
      }
      return nodes
    })(),
  })
}

// ─── World 2: Rotation (Levels 21–40) ────────────────────────────────────────

const world2Puzzles: Puzzle[] = []
for (let i = 1; i <= 20; i++) {
  const levelNum = 20 + i
  world2Puzzles.push({
    id: `w2_l${levelNum}`,
    title: `Rotation ${i}`,
    description: 'Use rotation to redirect signals.',
    rows: 4,
    cols: 4,
    mechanics: ['basic', 'rotator'],
    targetMoves: {
      perfect: Math.floor(i * 0.8),
      gold: i,
      silver: Math.floor(i * 1.3),
      bronze: Math.floor(i * 1.8),
    },
    connections: [],
    grid: (() => {
      const nodes: GridNode[] = []
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const isSource = r === 1 && c === 0
          const isTarget = r === 2 && c === 3
          const isRotator = (r + c) % 3 === 0 && !isSource && !isTarget
          const conns: Direction[] = []
          if (!isRotator) {
            if (r > 0) conns.push('N')
            if (r < 3) conns.push('S')
            if (c > 0) conns.push('W')
            if (c < 3) conns.push('E')
          } else {
            conns.push('N', 'E')
          }
          nodes.push({
            id: `w2_l${levelNum}_${r}_${c}`,
            row: r, col: c,
            type: (isSource ? 'source' : isTarget ? 'target' : isRotator ? 'rotator' : 'basic') as NodeType,
            state: (isSource ? 'active' : 'inactive') as NodeState,
            rotation: isRotator ? (i % 4) * 90 : 0,
            connections: conns,
          })
        }
      }
      return nodes
    })(),
  })
}

// ─── World 3: Mirrors (Levels 41–60) ─────────────────────────────────────────

const world3Puzzles: Puzzle[] = []
for (let i = 1; i <= 20; i++) {
  const levelNum = 40 + i
  world3Puzzles.push({
    id: `w3_l${levelNum}`,
    title: `Reflection ${i}`,
    description: 'Use mirrors to redirect signals around obstacles.',
    rows: 4,
    cols: 5,
    mechanics: ['basic', 'mirror'],
    targetMoves: {
      perfect: Math.floor(i * 0.9),
      gold: Math.floor(i * 1.2),
      silver: Math.floor(i * 1.5),
      bronze: Math.floor(i * 2),
    },
    connections: [],
    grid: (() => {
      const nodes: GridNode[] = []
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 5; c++) {
          const isSource = r === 0 && c === 0
          const isTarget = r === 3 && c === 4
          const isMirror = (r === 1 && c === 2) || (r === 2 && c === 2)
          const conns: Direction[] = []
          if (isMirror) {
            conns.push('N', 'E')
          } else {
            if (r > 0) conns.push('N')
            if (r < 3) conns.push('S')
            if (c > 0) conns.push('W')
            if (c < 4) conns.push('E')
          }
          nodes.push({
            id: `w3_l${levelNum}_${r}_${c}`,
            row: r, col: c,
            type: (isSource ? 'source' : isTarget ? 'target' : isMirror ? 'mirror' : 'basic') as NodeType,
            state: (isSource ? 'active' : 'inactive') as NodeState,
            rotation: isMirror ? 45 : 0,
            connections: conns,
          })
        }
      }
      return nodes
    })(),
  })
}

// ─── World 4: Gravity (Levels 61–80) ─────────────────────────────────────────

const world4Puzzles: Puzzle[] = []
for (let i = 1; i <= 20; i++) {
  const levelNum = 60 + i
  world4Puzzles.push({
    id: `w4_l${levelNum}`,
    title: `Descent ${i}`,
    description: 'Signals fall with gravity. Think vertically.',
    rows: 5,
    cols: 4,
    mechanics: ['basic', 'gravity'],
    targetMoves: {
      perfect: Math.floor(i * 0.9),
      gold: i,
      silver: Math.floor(i * 1.4),
      bronze: Math.floor(i * 2),
    },
    connections: [],
    grid: (() => {
      const nodes: GridNode[] = []
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 4; c++) {
          const isSource = r === 0 && c === Math.floor(i % 4)
          const isTarget = r === 4 && c === (i % 4)
          const isGravity = r === 2 && c === 1
          const conns: Direction[] = ['S']
          if (c > 0) conns.push('W')
          if (c < 3) conns.push('E')
          nodes.push({
            id: `w4_l${levelNum}_${r}_${c}`,
            row: r, col: c,
            type: (isSource ? 'source' : isTarget ? 'target' : isGravity ? 'gravity' : 'basic') as NodeType,
            state: (isSource ? 'active' : 'inactive') as NodeState,
            rotation: 0,
            connections: conns,
          })
        }
      }
      return nodes
    })(),
  })
}

// ─── World 5: Teleporters (Levels 81–100) ────────────────────────────────────

const world5Puzzles: Puzzle[] = []
for (let i = 1; i <= 20; i++) {
  const levelNum = 80 + i
  world5Puzzles.push({
    id: `w5_l${levelNum}`,
    title: `Wormhole ${i}`,
    description: 'Jump signals across the board using teleporters.',
    rows: 5,
    cols: 5,
    mechanics: ['basic', 'teleport'],
    targetMoves: {
      perfect: Math.floor(i * 0.8),
      gold: Math.floor(i * 1.1),
      silver: Math.floor(i * 1.5),
      bronze: Math.floor(i * 2),
    },
    connections: [],
    grid: (() => {
      const nodes: GridNode[] = []
      const tp1Id = `w5_l${levelNum}_tp1`
      const tp2Id = `w5_l${levelNum}_tp2`
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          const nodeId = `w5_l${levelNum}_${r}_${c}`
          const isSource = r === 2 && c === 0
          const isTarget = r === 2 && c === 4
          const isTp1 = r === 0 && c === 1
          const isTp2 = r === 4 && c === 3
          const conns: Direction[] = []
          if (r > 0) conns.push('N')
          if (r < 4) conns.push('S')
          if (c > 0) conns.push('W')
          if (c < 4) conns.push('E')
          const node: GridNode = {
            id: isTp1 ? tp1Id : isTp2 ? tp2Id : nodeId,
            row: r, col: c,
            type: (isSource ? 'source' : isTarget ? 'target' : (isTp1 || isTp2) ? 'teleport' : 'basic') as NodeType,
            state: (isSource ? 'active' : 'inactive') as NodeState,
            rotation: 0,
            connections: conns,
          }
          if (isTp1) node.teleportPair = tp2Id
          if (isTp2) node.teleportPair = tp1Id
          nodes.push(node)
        }
      }
      return nodes
    })(),
  })
}

// ─── Worlds Data ──────────────────────────────────────────────────────────────

export const WORLDS: World[] = [
  {
    id: 'world1',
    name: 'Awakening',
    description: 'Learn the fundamentals of signal propagation.',
    mechanic: 'Basic Activation',
    color: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    unlocked: true,
    completed: false,
    levels: world1Puzzles.map((puzzle, i) => ({
      levelNumber: i + 1,
      puzzle,
      worldId: 'world1',
      locked: i > 0,
      completed: false,
    })),
  },
  {
    id: 'world2',
    name: 'Rotation',
    description: 'Harness rotation to redirect the flow.',
    mechanic: 'Rotators',
    color: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    unlocked: false,
    completed: false,
    levels: world2Puzzles.map((puzzle, i) => ({
      levelNumber: 21 + i,
      puzzle,
      worldId: 'world2',
      locked: true,
      completed: false,
    })),
  },
  {
    id: 'world3',
    name: 'Reflection',
    description: 'Bend signals with precision mirrors.',
    mechanic: 'Mirrors',
    color: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    unlocked: false,
    completed: false,
    levels: world3Puzzles.map((puzzle, i) => ({
      levelNumber: 41 + i,
      puzzle,
      worldId: 'world3',
      locked: true,
      completed: false,
    })),
  },
  {
    id: 'world4',
    name: 'Gravity',
    description: 'Think vertically — signals obey gravity.',
    mechanic: 'Gravity Wells',
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    unlocked: false,
    completed: false,
    levels: world4Puzzles.map((puzzle, i) => ({
      levelNumber: 61 + i,
      puzzle,
      worldId: 'world4',
      locked: true,
      completed: false,
    })),
  },
  {
    id: 'world5',
    name: 'Quantum',
    description: 'Jump across space with quantum teleporters.',
    mechanic: 'Teleporters',
    color: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    unlocked: false,
    completed: false,
    levels: world5Puzzles.map((puzzle, i) => ({
      levelNumber: 81 + i,
      puzzle,
      worldId: 'world5',
      locked: true,
      completed: false,
    })),
  },
]

export const ALL_LEVELS = WORLDS.flatMap(w => w.levels)

export const DAILY_PUZZLE_TEMPLATE: Puzzle = {
  id: 'daily',
  title: "Today's Challenge",
  description: 'A new puzzle every day. Can you achieve Perfect?',
  rows: 4,
  cols: 4,
  mechanics: ['basic', 'relay'],
  targetMoves: { perfect: 4, gold: 6, silver: 8, bronze: 12 },
  connections: [],
  grid: [
    { id: 'd_s',   row: 0, col: 0, type: 'source', state: 'active',   rotation: 0, connections: ['E', 'S'] },
    { id: 'd_n01', row: 0, col: 1, type: 'basic',  state: 'inactive', rotation: 0, connections: ['W', 'E', 'S'] },
    { id: 'd_n02', row: 0, col: 2, type: 'relay',  state: 'inactive', rotation: 0, connections: ['W', 'E', 'S'] },
    { id: 'd_n03', row: 0, col: 3, type: 'target', state: 'inactive', rotation: 0, connections: ['W', 'S'] },
    { id: 'd_n10', row: 1, col: 0, type: 'basic',  state: 'inactive', rotation: 0, connections: ['N', 'E', 'S'] },
    { id: 'd_n11', row: 1, col: 1, type: 'basic',  state: 'inactive', rotation: 0, connections: ['N', 'E', 'S', 'W'] },
    { id: 'd_n12', row: 1, col: 2, type: 'basic',  state: 'inactive', rotation: 0, connections: ['N', 'E', 'S', 'W'] },
    { id: 'd_n13', row: 1, col: 3, type: 'basic',  state: 'inactive', rotation: 0, connections: ['N', 'S', 'W'] },
    { id: 'd_n20', row: 2, col: 0, type: 'basic',  state: 'inactive', rotation: 0, connections: ['N', 'E', 'S'] },
    { id: 'd_n21', row: 2, col: 1, type: 'relay',  state: 'inactive', rotation: 0, connections: ['N', 'E', 'S', 'W'] },
    { id: 'd_n22', row: 2, col: 2, type: 'basic',  state: 'inactive', rotation: 0, connections: ['N', 'E', 'S', 'W'] },
    { id: 'd_n23', row: 2, col: 3, type: 'basic',  state: 'inactive', rotation: 0, connections: ['N', 'S', 'W'] },
    { id: 'd_n30', row: 3, col: 0, type: 'target', state: 'inactive', rotation: 0, connections: ['N', 'E'] },
    { id: 'd_n31', row: 3, col: 1, type: 'basic',  state: 'inactive', rotation: 0, connections: ['N', 'E', 'W'] },
    { id: 'd_n32', row: 3, col: 2, type: 'basic',  state: 'inactive', rotation: 0, connections: ['N', 'E', 'W'] },
    { id: 'd_n33', row: 3, col: 3, type: 'target', state: 'inactive', rotation: 0, connections: ['N', 'W'] },
  ],
}
