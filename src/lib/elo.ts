import type { RankTier } from '@/engine/types'

/** Classic Elo update for ranked SYNAPSE matches. */
export function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + 10 ** ((ratingB - ratingA) / 400))
}

export function updateElo(
  rating: number,
  opponentRating: number,
  score: number,
  k = 32,
): number {
  const expected = expectedScore(rating, opponentRating)
  return Math.round(rating + k * (score - expected))
}

export function rankFromElo(elo: number): RankTier {
  if (elo >= 2400) return 'Synapse'
  if (elo >= 2200) return 'Grandmaster'
  if (elo >= 2000) return 'Master'
  if (elo >= 1800) return 'Diamond'
  if (elo >= 1600) return 'Platinum'
  if (elo >= 1400) return 'Gold'
  if (elo >= 1200) return 'Silver'
  return 'Bronze'
}

export const RANK_THRESHOLDS: Record<RankTier, number> = {
  Bronze: 0,
  Silver: 1200,
  Gold: 1400,
  Platinum: 1600,
  Diamond: 1800,
  Master: 2000,
  Grandmaster: 2200,
  Synapse: 2400,
}

export const DEFAULT_ELO = 1000
