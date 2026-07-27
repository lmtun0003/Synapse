import { describe, expect, it } from 'vitest'
import { dailySeed, generatePuzzle, mulberry32 } from './generate'
import { solvePuzzle } from './solver'

describe('generator', () => {
  it('is deterministic for a seed', () => {
    const a = generatePuzzle({ seed: 42, difficulty: 5, id: 'a' })
    const b = generatePuzzle({ seed: 42, difficulty: 5, id: 'b' })
    expect(a.width).toBe(b.width)
    expect(a.nodes.map((n) => n.active)).toEqual(b.nodes.map((n) => n.active))
  })

  it('produces solvable puzzles', () => {
    const puzzle = generatePuzzle({ seed: 7, difficulty: 4 })
    const result = solvePuzzle(puzzle, 12)
    expect(result.solvable).toBe(true)
  })

  it('mulberry32 stays in unit interval', () => {
    const rand = mulberry32(123)
    for (let i = 0; i < 20; i++) {
      const v = rand()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('daily seed is stable for a UTC date', () => {
    expect(dailySeed(new Date('2026-07-27T12:00:00Z'))).toBe(20260727)
  })
})
