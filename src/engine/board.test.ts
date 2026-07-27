import { describe, expect, it } from 'vitest'
import { applyMove, createBoard, isSolved, undoMove } from './board'
import { buildLevel, self, pulse } from '@/data/levels/builder'

describe('puzzle engine', () => {
  it('solves a single self node in one move', () => {
    const puzzle = buildLevel({
      id: 't-1',
      title: 'T',
      chapter: 1,
      levelNumber: 1,
      par: { perfect: 1, gold: 1, silver: 2, bronze: 3 },
      grid: [[self(false)]],
    })
    const board = createBoard(puzzle)
    const result = applyMove(board, puzzle, puzzle.nodes[0]!.id)
    expect(result.solved).toBe(true)
    expect(result.rating).toBe('perfect')
    expect(result.state.moveCount).toBe(1)
  })

  it('propagates cardinal pulses', () => {
    const puzzle = buildLevel({
      id: 't-2',
      title: 'Pulse',
      chapter: 1,
      levelNumber: 2,
      par: { perfect: 1, gold: 2, silver: 3, bronze: 5 },
      grid: [
        [null, self(false), null],
        [self(false), pulse(false), self(false)],
        [null, self(false), null],
      ],
    })
    const center = puzzle.nodes.find((n) => n.mechanic === 'basic' && n.affectOffsets.length === 4)!
    const result = applyMove(createBoard(puzzle), puzzle, center.id)
    expect(result.solved).toBe(true)
    expect(isSolved(result.state.nodes)).toBe(true)
  })

  it('supports undo', () => {
    const puzzle = buildLevel({
      id: 't-3',
      title: 'Undo',
      chapter: 1,
      levelNumber: 3,
      par: { perfect: 1, gold: 2, silver: 3, bronze: 5 },
      grid: [[self(false)]],
    })
    let board = createBoard(puzzle)
    board = applyMove(board, puzzle, puzzle.nodes[0]!.id).state
    board = undoMove({ ...board, status: 'playing', rating: 'none' })
    expect(board.moveCount).toBe(0)
    expect(board.nodes[0]!.active).toBe(false)
  })

  it('fires rotation in current facing then turns', () => {
    const puzzle = buildLevel({
      id: 't-4',
      title: 'Rot',
      chapter: 2,
      levelNumber: 21,
      par: { perfect: 1, gold: 2, silver: 3, bronze: 5 },
      grid: [
        [
          self(false),
          { active: false, mechanic: 'rotation', facing: 'W', offsets: [] },
        ],
      ],
    })
    const rotor = puzzle.nodes.find((n) => n.mechanic === 'rotation')!
    const result = applyMove(createBoard(puzzle), puzzle, rotor.id)
    expect(result.solved).toBe(true)
    expect(result.state.nodes.find((n) => n.id === rotor.id)?.facing).toBe('N')
  })
})
