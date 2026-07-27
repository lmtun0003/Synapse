import { CARDINAL } from './board'
import { solvePuzzle } from './solver'
import type { MechanicKind, PuzzleDefinition, PuzzleNode } from './types'

/** Deterministic PRNG (mulberry32) so daily / endless seeds are stable. */
export function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function dailySeed(date = new Date()): number {
  const y = date.getUTCFullYear()
  const m = date.getUTCMonth() + 1
  const d = date.getUTCDate()
  return y * 10_000 + m * 100 + d
}

interface GenerateOptions {
  seed: number
  difficulty: number
  id?: string
  title?: string
}

/**
 * Procedural generator for Endless / Daily modes.
 * Difficulty scales mechanics and board density — never randomness in outcomes.
 */
export function generatePuzzle(options: GenerateOptions): PuzzleDefinition {
  const rand = mulberry32(options.seed)
  const difficulty = Math.max(1, Math.min(20, options.difficulty))
  const size = Math.min(5, 3 + Math.floor((difficulty - 1) / 5))
  const mechanics = pickMechanics(difficulty)

  // Try a handful of candidates until one is solvable with a short BFS.
  for (let attempt = 0; attempt < 40; attempt++) {
    const puzzle = buildCandidate(rand, size, mechanics, options, attempt)
    const solved = solvePuzzle(puzzle, Math.min(10, 4 + difficulty))
    if (solved.solvable && solved.minMoves !== null && solved.minMoves > 0) {
      const perfect = solved.minMoves
      return {
        ...puzzle,
        par: {
          perfect,
          gold: perfect + 1,
          silver: perfect + 3,
          bronze: perfect + 6,
        },
      }
    }
  }

  // Guaranteed fallback: a simple line puzzle that is always solvable.
  return fallbackPuzzle(options, size)
}

function pickMechanics(difficulty: number): MechanicKind[] {
  const pool: MechanicKind[] = ['basic']
  if (difficulty >= 3) pool.push('rotation')
  if (difficulty >= 6) pool.push('mirror')
  if (difficulty >= 9) pool.push('gravity')
  if (difficulty >= 12) pool.push('teleporter')
  if (difficulty >= 15) pool.push('inverter')
  return pool
}

function buildCandidate(
  rand: () => number,
  size: number,
  mechanics: MechanicKind[],
  options: GenerateOptions,
  attempt: number,
): PuzzleDefinition {
  const nodes: PuzzleNode[] = []
  const count = size * size
  const activeMask = Math.floor(rand() * (1 << Math.min(count, 12)))

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const index = r * size + c
      const mechanic = mechanics[Math.floor(rand() * mechanics.length)] ?? 'basic'
      const id = `n-${r}-${c}`
      nodes.push({
        id,
        row: r,
        col: c,
        active: ((activeMask >> (index % 12)) & 1) === 1,
        targetActive: true,
        mechanic: mechanic === 'teleporter' && index % 2 === 0 ? 'basic' : mechanic,
        affectOffsets: CARDINAL.map((o) => ({ ...o })),
        facing: (['N', 'E', 'S', 'W'] as const)[Math.floor(rand() * 4)],
        interactive: true,
        color: 'neutral',
      })
    }
  }

  // Pair teleporters when present.
  const teles = nodes.filter((n) => n.mechanic === 'teleporter')
  if (teles.length >= 2) {
    teles[0]!.teleportTargetId = teles[1]!.id
    teles[1]!.teleportTargetId = teles[0]!.id
  } else {
    for (const t of teles) t.mechanic = 'basic'
  }

  // Goal: all active. Start from a scrambled state by flipping a few interactive nodes.
  // We store the scrambled state as the initial board by simulating conceptually:
  // keep active flags as generated; target is all true — ensure not already solved.
  if (nodes.every((n) => n.active)) {
    nodes[0]!.active = false
  }

  return {
    id: options.id ?? `gen-${options.seed}-${attempt}`,
    title: options.title ?? `Signal ${options.seed}`,
    chapter: 0,
    levelNumber: options.difficulty,
    width: size,
    height: size,
    nodes,
    par: { perfect: 3, gold: 4, silver: 6, bronze: 10 },
    mechanics,
    hint: 'Find the cleanest path through the noise.',
  }
}

function fallbackPuzzle(options: GenerateOptions, size: number): PuzzleDefinition {
  const nodes: PuzzleNode[] = []
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      nodes.push({
        id: `n-${r}-${c}`,
        row: r,
        col: c,
        active: !(r === 0 && c === 0),
        targetActive: true,
        mechanic: 'basic',
        affectOffsets: [],
        interactive: true,
        color: 'neutral',
      })
    }
  }
  // Center-ish node toggles self only — one move perfect.
  const tap = nodes[0]!
  tap.affectOffsets = []
  tap.interactive = true

  return {
    id: options.id ?? `gen-${options.seed}-fallback`,
    title: options.title ?? 'Pure Signal',
    chapter: 0,
    levelNumber: options.difficulty,
    width: size,
    height: size,
    nodes,
    par: { perfect: 1, gold: 2, silver: 3, bronze: 5 },
    mechanics: ['basic'],
  }
}
