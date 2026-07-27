import type { PuzzleDefinition, RatingTier } from './types'

/**
 * Compute rating from move count against puzzle par thresholds.
 * Perfect requires nearly flawless optimisation (par.perfect).
 */
export function rateSolve(puzzle: PuzzleDefinition, moves: number): RatingTier {
  const { perfect, gold, silver, bronze } = puzzle.par
  if (moves <= perfect) return 'perfect'
  if (moves <= gold) return 'gold'
  if (moves <= silver) return 'silver'
  if (moves <= bronze) return 'bronze'
  return 'none'
}

export function ratingXp(tier: RatingTier): number {
  switch (tier) {
    case 'perfect':
      return 100
    case 'gold':
      return 60
    case 'silver':
      return 35
    case 'bronze':
      return 15
    default:
      return 5
  }
}

export function ratingSparks(tier: RatingTier): number {
  switch (tier) {
    case 'perfect':
      return 25
    case 'gold':
      return 15
    case 'silver':
      return 8
    case 'bronze':
      return 3
    default:
      return 1
  }
}

export const RATING_ORDER: RatingTier[] = ['none', 'bronze', 'silver', 'gold', 'perfect']

export function isBetterRating(a: RatingTier, b: RatingTier): boolean {
  return RATING_ORDER.indexOf(a) > RATING_ORDER.indexOf(b)
}
