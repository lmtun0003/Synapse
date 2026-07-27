import { applyMove, createBoard, isSolved } from './board'
import type { PuzzleDefinition, SolveResult } from './types'

/**
 * BFS minimum-move solver for small handcrafted puzzles.
 * Used to validate level solvability and compute perfect par.
 * Caps explored states to keep generation / tests responsive.
 */
export function solvePuzzle(puzzle: PuzzleDefinition, maxDepth = 12): SolveResult {
  const start = createBoard(puzzle)
  if (isSolved(start.nodes)) {
    return { solvable: true, minMoves: 0, sequence: [] }
  }

  const interactive = start.nodes.filter((n) => n.interactive).map((n) => n.id)
  const queue: Array<{ key: string; sequence: string[] }> = [
    { key: serialize(start.nodes), sequence: [] },
  ]
  const visited = new Set<string>([queue[0]!.key])
  let head = 0
  const MAX_STATES = 50_000

  while (head < queue.length && visited.size < MAX_STATES) {
    const current = queue[head]!
    head += 1

    if (current.sequence.length >= maxDepth) continue

    // Rebuild state from start by replaying sequence (deterministic, avoids deep clones).
    let board = createBoard(puzzle)
    for (const id of current.sequence) {
      board = applyMove(board, puzzle, id).state
    }

    for (const nodeId of interactive) {
      const result = applyMove(board, puzzle, nodeId)
      const key = serialize(result.state.nodes)
      if (visited.has(key)) continue
      visited.add(key)
      const sequence = [...current.sequence, nodeId]
      if (result.solved) {
        return { solvable: true, minMoves: sequence.length, sequence }
      }
      queue.push({ key, sequence })
    }
  }

  return { solvable: false, minMoves: null, sequence: null }
}

function serialize(nodes: Array<{ id: string; active: boolean; row: number; col: number; facing?: string; locked?: boolean; timer?: number; color?: string }>): string {
  return nodes
    .map(
      (n) =>
        `${n.id}:${n.active ? 1 : 0}:${n.row},${n.col}:${n.facing ?? ''}:${n.locked ? 1 : 0}:${n.timer ?? ''}:${n.color ?? ''}`,
    )
    .join('|')
}

/** Assert a puzzle is solvable within a move budget — used by level unit tests. */
export function assertSolvable(puzzle: PuzzleDefinition, maxDepth = 12): void {
  const result = solvePuzzle(puzzle, maxDepth)
  if (!result.solvable) {
    throw new Error(`Puzzle ${puzzle.id} is not solvable within ${maxDepth} moves`)
  }
}
