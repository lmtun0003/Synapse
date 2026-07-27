import { describe, expect, it } from 'vitest'
import { CAMPAIGN_LEVELS } from '@/data/levels'
import { solvePuzzle } from './solver'
import { rateSolve } from './rating'

describe('campaign levels', () => {
  it('includes chapter 1 foundations', () => {
    expect(CAMPAIGN_LEVELS.filter((l) => l.chapter === 1).length).toBe(20)
  })

  it.each(CAMPAIGN_LEVELS.map((l) => [l.id, l] as const))(
    'level %s is solvable',
    (_id, puzzle) => {
      const result = solvePuzzle(puzzle, 14)
      expect(result.solvable).toBe(true)
      expect(result.minMoves).toBeGreaterThan(0)
      if (result.minMoves !== null) {
        // Perfect par should not be stricter than the true minimum.
        expect(puzzle.par.perfect).toBeGreaterThanOrEqual(result.minMoves)
        expect(rateSolve(puzzle, result.minMoves)).not.toBe('none')
      }
    },
  )
})
