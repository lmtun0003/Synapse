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

// ─── World 6: Convergence (mixed: rotation + mirrors) ─────────────────────────

const world6Puzzles: Puzzle[] = Array.from({ length: 15 }, (_, i) => {
  const levelNum = 101 + i
  const rows = 4 + Math.floor(i / 5)
  const cols = 4 + Math.floor(i / 4)
  return {
    id: `w6_l${levelNum}`,
    title: `Convergence ${i + 1}`,
    description: 'Combine rotation and mirrors to find the perfect path.',
    rows, cols,
    mechanics: ['basic', 'rotator', 'mirror'],
    targetMoves: { perfect: 5 + i, gold: 7 + i, silver: 10 + i, bronze: 15 + i },
    connections: [],
    grid: (() => {
      const nodes: GridNode[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isSource = r === 0 && c === 0
          const isTarget = (r === rows - 1 && c === cols - 1) || (r === 0 && c === cols - 1)
          const isMirror = r === Math.floor(rows / 2) && c === Math.floor(cols / 2)
          const isRotator = r === 1 && c === 1 && !isSource && !isTarget
          const conns: Direction[] = []
          if (r > 0) conns.push('N')
          if (r < rows - 1) conns.push('S')
          if (c > 0) conns.push('W')
          if (c < cols - 1) conns.push('E')
          nodes.push({
            id: `w6_l${levelNum}_${r}_${c}`,
            row: r, col: c,
            type: (isSource ? 'source' : isTarget ? 'target' : isMirror ? 'mirror' : isRotator ? 'rotator' : 'basic') as NodeType,
            state: (isSource ? 'active' : 'inactive') as NodeState,
            rotation: isMirror ? 45 : isRotator ? (i % 4) * 90 : 0,
            connections: isMirror ? ['N', 'E'] : conns,
          })
        }
      }
      return nodes
    })(),
  }
})

// ─── World 7: Paradox (mixed: gravity + teleport + inverter) ──────────────────

const world7Puzzles: Puzzle[] = Array.from({ length: 15 }, (_, i) => {
  const levelNum = 116 + i
  const rows = 5 + Math.floor(i / 5)
  const cols = 5 + Math.floor(i / 5)
  const tp1Id = `w7_l${levelNum}_tp1`
  const tp2Id = `w7_l${levelNum}_tp2`
  return {
    id: `w7_l${levelNum}`,
    title: `Paradox ${i + 1}`,
    description: 'Signals fall, jump, and invert. Plan every step.',
    rows, cols,
    mechanics: ['basic', 'gravity', 'teleport', 'inverter'],
    targetMoves: { perfect: 6 + i, gold: 9 + i, silver: 13 + i, bronze: 18 + i },
    connections: [],
    grid: (() => {
      const nodes: GridNode[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const nodeId = `w7_l${levelNum}_${r}_${c}`
          const isSource = r === 0 && c === 0
          const isTarget = (r === rows - 1 && c === cols - 1) || (r === rows - 1 && c === 0)
          const isTp1 = r === 0 && c === Math.floor(cols / 2)
          const isTp2 = r === rows - 1 && c === Math.floor(cols / 2)
          const isGravity = r === Math.floor(rows / 2) && c === 1
          const isInverter = r === Math.floor(rows / 2) && c === cols - 2
          const conns: Direction[] = []
          if (r > 0) conns.push('N')
          if (r < rows - 1) conns.push('S')
          if (c > 0) conns.push('W')
          if (c < cols - 1) conns.push('E')
          const node: GridNode = {
            id: isTp1 ? tp1Id : isTp2 ? tp2Id : nodeId,
            row: r, col: c,
            type: (isSource ? 'source' : isTarget ? 'target' : isTp1 || isTp2 ? 'teleport' : isGravity ? 'gravity' : isInverter ? 'inverter' : 'basic') as NodeType,
            state: (isSource ? 'active' : 'inactive') as NodeState,
            rotation: 0, connections: conns,
          }
          if (isTp1) node.teleportPair = tp2Id
          if (isTp2) node.teleportPair = tp1Id
          nodes.push(node)
        }
      }
      return nodes
    })(),
  }
})

// ─── World 8: Cascade (all mechanics mixed, 6×6 grids) ──────────────────────

const world8Puzzles: Puzzle[] = Array.from({ length: 15 }, (_, i) => {
  const levelNum = 131 + i
  const size = 6 + Math.floor(i / 8)
  return {
    id: `w8_l${levelNum}`,
    title: `Cascade ${i + 1}`,
    description: 'Every mechanic at play. The board is against you.',
    rows: size, cols: size,
    mechanics: ['basic', 'rotator', 'mirror', 'gravity', 'teleport'],
    targetMoves: { perfect: 8 + i, gold: 12 + i, silver: 17 + i, bronze: 24 + i },
    connections: [],
    grid: (() => {
      const nodes: GridNode[] = []
      const tp1Id = `w8_l${levelNum}_tp1`
      const tp2Id = `w8_l${levelNum}_tp2`
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const id = r === 1 && c === 1 ? tp1Id : r === size-2 && c === size-2 ? tp2Id : `w8_l${levelNum}_${r}_${c}`
          const isSource = r === 0 && c === 0
          const isTarget = (r === 0 && c === size-1) || (r === size-1 && c === 0) || (r === size-1 && c === size-1)
          const isTp1 = r === 1 && c === 1
          const isTp2 = r === size-2 && c === size-2
          const isMirror = r === Math.floor(size/2) && c === Math.floor(size/2)
          const isGravity = r === 2 && c === size-2
          const conns: Direction[] = []
          if (r > 0) conns.push('N')
          if (r < size-1) conns.push('S')
          if (c > 0) conns.push('W')
          if (c < size-1) conns.push('E')
          const node: GridNode = {
            id,
            row: r, col: c,
            type: (isSource ? 'source' : isTarget ? 'target' : isTp1||isTp2 ? 'teleport' : isMirror ? 'mirror' : isGravity ? 'gravity' : 'basic') as NodeType,
            state: (isSource ? 'active' : 'inactive') as NodeState,
            rotation: isMirror ? 45 : 0,
            connections: isMirror ? ['N', 'E'] : conns,
          }
          if (isTp1) node.teleportPair = tp2Id
          if (isTp2) node.teleportPair = tp1Id
          nodes.push(node)
        }
      }
      return nodes
    })(),
  }
})

// ─── World 9: Nexus (all mechanics, asymmetric grids) ────────────────────────

const world9Puzzles: Puzzle[] = Array.from({ length: 15 }, (_, i) => {
  const levelNum = 146 + i
  const rows = 5 + Math.floor(i / 4)
  const cols = 7 + Math.floor(i / 4)
  return {
    id: `w9_l${levelNum}`,
    title: `Nexus ${i + 1}`,
    description: 'Wide rectangular grids. Signal must travel far.',
    rows, cols,
    mechanics: ['basic', 'relay', 'mirror', 'rotator', 'gravity'],
    targetMoves: { perfect: 10 + i, gold: 14 + i, silver: 19 + i, bronze: 27 + i },
    connections: [],
    grid: (() => {
      const nodes: GridNode[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isSource = r === Math.floor(rows/2) && c === 0
          const isTarget = (r === 0 && c === cols-1) || (r === rows-1 && c === cols-1)
          const isMirror = (r + c) % 7 === 3 && !isSource && !isTarget
          const isRelay = (r + c) % 5 === 0 && !isSource && !isTarget && !isMirror
          const conns: Direction[] = []
          if (r > 0) conns.push('N')
          if (r < rows-1) conns.push('S')
          if (c > 0) conns.push('W')
          if (c < cols-1) conns.push('E')
          nodes.push({
            id: `w9_l${levelNum}_${r}_${c}`,
            row: r, col: c,
            type: (isSource ? 'source' : isTarget ? 'target' : isMirror ? 'mirror' : isRelay ? 'relay' : 'basic') as NodeType,
            state: (isSource ? 'active' : 'inactive') as NodeState,
            rotation: isMirror ? 45 : 0,
            connections: isMirror ? ['N', 'E'] : conns,
          })
        }
      }
      return nodes
    })(),
  }
})

// ─── World 10: Synthesis (maximum difficulty mixed, 7×7+) ────────────────────

const world10Puzzles: Puzzle[] = Array.from({ length: 15 }, (_, i) => {
  const levelNum = 161 + i
  const rows = 6 + Math.floor(i / 3)
  const cols = 6 + Math.floor(i / 3)
  const tp1Id = `w10_l${levelNum}_tp1`
  const tp2Id = `w10_l${levelNum}_tp2`
  return {
    id: `w10_l${levelNum}`,
    title: `Synthesis ${i + 1}`,
    description: 'The final test before the Elite. Every mechanic, maximum grid.',
    rows, cols,
    mechanics: ['basic', 'rotator', 'mirror', 'gravity', 'teleport', 'inverter', 'relay'],
    targetMoves: { perfect: 12 + i, gold: 17 + i, silver: 23 + i, bronze: 32 + i },
    connections: [],
    grid: (() => {
      const nodes: GridNode[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const nodeId = `w10_l${levelNum}_${r}_${c}`
          const isSource = r === 0 && c === 0
          const isTarget = (r === rows-1 && c === cols-1) || (r === 0 && c === cols-1) || (r === rows-1 && c === 0)
          const isTp1 = r === 1 && c === Math.floor(cols/2)
          const isTp2 = r === rows-2 && c === Math.floor(cols/2)
          const isMirror = r === Math.floor(rows/2) && c === Math.floor(cols*0.3)
          const isGravity = r === 2 && c === cols-2
          const isInverter = r === rows-3 && c === 2
          const isRotator = r === Math.floor(rows/2) && c === cols-2
          const conns: Direction[] = []
          if (r > 0) conns.push('N')
          if (r < rows-1) conns.push('S')
          if (c > 0) conns.push('W')
          if (c < cols-1) conns.push('E')
          const id = isTp1 ? tp1Id : isTp2 ? tp2Id : nodeId
          const node: GridNode = {
            id,
            row: r, col: c,
            type: (isSource ? 'source' : isTarget ? 'target' : isTp1||isTp2 ? 'teleport' : isMirror ? 'mirror' : isGravity ? 'gravity' : isInverter ? 'inverter' : isRotator ? 'rotator' : 'basic') as NodeType,
            state: (isSource ? 'active' : 'inactive') as NodeState,
            rotation: isMirror ? 45 : isRotator ? (i % 4) * 90 : 0,
            connections: isMirror ? ['N', 'E'] : conns,
          }
          if (isTp1) node.teleportPair = tp2Id
          if (isTp2) node.teleportPair = tp1Id
          nodes.push(node)
        }
      }
      return nodes
    })(),
  }
})

// ─── ELITE: Grandmaster Campaign (10 stages, 8×8–10×10, all mechanics) ───────

const elitePuzzles: Puzzle[] = Array.from({ length: 10 }, (_, i) => {
  const rows = 8 + Math.floor(i / 3)
  const cols = 8 + Math.floor(i / 3)
  const tp1Id = `elite_l${i+1}_tp1`
  const tp2Id = `elite_l${i+1}_tp2`
  const tp3Id = `elite_l${i+1}_tp3`
  const tp4Id = `elite_l${i+1}_tp4`
  return {
    id: `elite_l${i + 1}`,
    title: `Grandmaster ${romanNumeral(i + 1)}`,
    description: i < 5
      ? 'This is the Elite Campaign. Only the top 5% will complete it.'
      : 'The signals converge. Every node matters. No room for error.',
    rows, cols,
    mechanics: ['basic', 'source', 'target', 'relay', 'mirror', 'rotator', 'teleport', 'gravity', 'inverter'],
    targetMoves: { perfect: 15 + i * 3, gold: 20 + i * 4, silver: 28 + i * 5, bronze: 40 + i * 6 },
    connections: [],
    grid: (() => {
      const nodes: GridNode[] = []
      const mid = Math.floor(cols / 2)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const nodeId = `elite_l${i+1}_${r}_${c}`
          const isSource = (r === 0 && c === 0) || (r === rows-1 && c === cols-1)
          const isTarget = (r === 0 && c === cols-1) || (r === rows-1 && c === 0) || (r === Math.floor(rows/2) && c === mid)
          const isTp1 = r === 1 && c === 2
          const isTp2 = r === rows-2 && c === cols-3
          const isTp3 = r === 1 && c === cols-2
          const isTp4 = r === rows-2 && c === 1
          const isMirror1 = r === 2 && c === mid
          const isMirror2 = r === rows-3 && c === mid
          const isGravity = r === 3 && c === 1
          const isInverter = r === rows-4 && c === cols-2
          const isRotator = r === Math.floor(rows/2) && c === 2
          const isLocked = (r === 2 && c === 3) || (r === rows-3 && c === cols-4)
          const conns: Direction[] = []
          if (r > 0) conns.push('N')
          if (r < rows-1) conns.push('S')
          if (c > 0) conns.push('W')
          if (c < cols-1) conns.push('E')
          const id = isTp1 ? tp1Id : isTp2 ? tp2Id : isTp3 ? tp3Id : isTp4 ? tp4Id : nodeId
          const node: GridNode = {
            id,
            row: r, col: c,
            type: (isSource ? 'source' : isTarget ? 'target' : isTp1||isTp2 ? 'teleport' : isTp3||isTp4 ? 'teleport' : isMirror1||isMirror2 ? 'mirror' : isGravity ? 'gravity' : isInverter ? 'inverter' : isRotator ? 'rotator' : isLocked ? 'locked' : 'basic') as NodeType,
            state: (isSource ? 'active' : isLocked ? 'locked' : 'inactive') as NodeState,
            rotation: (isMirror1||isMirror2) ? 45 : isRotator ? (i % 4) * 90 : 0,
            connections: (isMirror1||isMirror2) ? ['N', 'E'] : conns,
          }
          if (isTp1) node.teleportPair = tp2Id
          if (isTp2) node.teleportPair = tp1Id
          if (isTp3) node.teleportPair = tp4Id
          if (isTp4) node.teleportPair = tp3Id
          nodes.push(node)
        }
      }
      return nodes
    })(),
  }
})

function romanNumeral(n: number): string {
  const r = ['I','II','III','IV','V','VI','VII','VIII','IX','X']
  return r[n - 1] ?? String(n)
}

export const WORLDS: World[] = [
  { id: 'world1', name: 'Awakening',   description: 'Learn the fundamentals of signal propagation.', mechanic: 'Basic Activation', color: '#3B82F6', glowColor: 'rgba(59,130,246,0.4)', unlocked: true,  completed: false, levels: world1Puzzles.map((puzzle, i) => ({ levelNumber: i+1,   puzzle, worldId: 'world1', locked: i > 0, completed: false })) },
  { id: 'world2', name: 'Rotation',    description: 'Harness rotation to redirect the flow.',        mechanic: 'Rotators',        color: '#8B5CF6', glowColor: 'rgba(139,92,246,0.4)', unlocked: false, completed: false, levels: world2Puzzles.map((puzzle, i) => ({ levelNumber: 21+i,   puzzle, worldId: 'world2', locked: true, completed: false })) },
  { id: 'world3', name: 'Reflection',  description: 'Bend signals with precision mirrors.',          mechanic: 'Mirrors',         color: '#10B981', glowColor: 'rgba(16,185,129,0.4)', unlocked: false, completed: false, levels: world3Puzzles.map((puzzle, i) => ({ levelNumber: 41+i,   puzzle, worldId: 'world3', locked: true, completed: false })) },
  { id: 'world4', name: 'Gravity',     description: 'Think vertically — signals obey gravity.',      mechanic: 'Gravity Wells',   color: '#F59E0B', glowColor: 'rgba(245,158,11,0.4)', unlocked: false, completed: false, levels: world4Puzzles.map((puzzle, i) => ({ levelNumber: 61+i,   puzzle, worldId: 'world4', locked: true, completed: false })) },
  { id: 'world5', name: 'Quantum',     description: 'Jump across space with quantum teleporters.',   mechanic: 'Teleporters',     color: '#EC4899', glowColor: 'rgba(236,72,153,0.4)', unlocked: false, completed: false, levels: world5Puzzles.map((puzzle, i) => ({ levelNumber: 81+i,   puzzle, worldId: 'world5', locked: true, completed: false })) },
  { id: 'world6', name: 'Convergence', description: 'Rotation meets reflection. Adapt.',             mechanic: 'Rotation + Mirrors', color: '#6366F1', glowColor: 'rgba(99,102,241,0.4)', unlocked: false, completed: false, levels: world6Puzzles.map((puzzle, i) => ({ levelNumber: 101+i,  puzzle, worldId: 'world6', locked: true, completed: false })) },
  { id: 'world7', name: 'Paradox',     description: 'Fall. Jump. Invert. Nothing is certain.',       mechanic: 'Gravity + Teleport + Inverter', color: '#EF4444', glowColor: 'rgba(239,68,68,0.4)', unlocked: false, completed: false, levels: world7Puzzles.map((puzzle, i) => ({ levelNumber: 116+i, puzzle, worldId: 'world7', locked: true, completed: false })) },
  { id: 'world8', name: 'Cascade',     description: 'All mechanics flow at once.',                   mechanic: 'Full Mix',        color: '#06B6D4', glowColor: 'rgba(6,182,212,0.4)',  unlocked: false, completed: false, levels: world8Puzzles.map((puzzle, i) => ({ levelNumber: 131+i, puzzle, worldId: 'world8', locked: true, completed: false })) },
  { id: 'world9', name: 'Nexus',       description: 'Wide grids. Long signals. Precise routing.',    mechanic: 'Relay + Mix',     color: '#A78BFA', glowColor: 'rgba(167,139,250,0.4)', unlocked: false, completed: false, levels: world9Puzzles.map((puzzle, i) => ({ levelNumber: 146+i, puzzle, worldId: 'world9', locked: true, completed: false })) },
  { id: 'world10',name: 'Synthesis',   description: 'The final test before the Elite.',              mechanic: 'Master Mix',      color: '#F59E0B', glowColor: 'rgba(245,158,11,0.4)', unlocked: false, completed: false, levels: world10Puzzles.map((puzzle, i) => ({ levelNumber: 161+i, puzzle, worldId: 'world10', locked: true, completed: false })) },
  {
    id: 'elite',
    name: 'Elite: Grandmaster',
    description: 'Only the top 5% will complete all 10 stages. Proceed carefully.',
    mechanic: 'All Nodes · Maximum Difficulty',
    color: '#F59E0B',
    glowColor: 'rgba(245,158,11,0.6)',
    unlocked: false,
    completed: false,
    levels: elitePuzzles.map((puzzle, i) => ({
      levelNumber: 200 + i,
      puzzle,
      worldId: 'elite',
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
