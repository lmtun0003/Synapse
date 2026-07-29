/** Metrics an achievement can track. Values are read from the player store. */
export type AchievementMetric =
  | 'puzzlesSolved'
  | 'perfectScores'
  | 'level'
  | 'elo'
  | 'maxDailyStreak'

export interface AchievementTier {
  /** Value of the metric required to reach this tier. */
  threshold: number
  /** Sparks awarded when this tier is first reached. Higher tiers pay more. */
  sparks: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  metric: AchievementMetric
  /** Ascending tiers. Reaching a tier keeps the achievement claimable to the next. */
  tiers: AchievementTier[]
}

/** Shared tier labels, ordered from lowest to highest. */
export const TIER_NAMES = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'] as const
export type TierName = (typeof TIER_NAMES)[number]

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'luminary',
    title: 'Luminary',
    description: 'Solve puzzles across every mode.',
    icon: '✦',
    metric: 'puzzlesSolved',
    tiers: [
      { threshold: 1, sparks: 10 },
      { threshold: 10, sparks: 40 },
      { threshold: 50, sparks: 100 },
      { threshold: 150, sparks: 250 },
      { threshold: 400, sparks: 600 },
    ],
  },
  {
    id: 'precision',
    title: 'Precision',
    description: 'Earn Perfect ratings.',
    icon: '◎',
    metric: 'perfectScores',
    tiers: [
      { threshold: 1, sparks: 15 },
      { threshold: 10, sparks: 60 },
      { threshold: 30, sparks: 150 },
      { threshold: 75, sparks: 350 },
      { threshold: 150, sparks: 700 },
    ],
  },
  {
    id: 'ascension',
    title: 'Ascension',
    description: 'Raise your account level.',
    icon: '◇',
    metric: 'level',
    tiers: [
      { threshold: 5, sparks: 20 },
      { threshold: 10, sparks: 60 },
      { threshold: 20, sparks: 150 },
      { threshold: 30, sparks: 300 },
      { threshold: 50, sparks: 600 },
    ],
  },
  {
    id: 'ladder',
    title: 'Ladder Climber',
    description: 'Push your Ranked Elo higher.',
    icon: '⬡',
    metric: 'elo',
    tiers: [
      { threshold: 1200, sparks: 25 },
      { threshold: 1400, sparks: 75 },
      { threshold: 1600, sparks: 175 },
      { threshold: 1800, sparks: 400 },
      { threshold: 2000, sparks: 800 },
    ],
  },
  {
    id: 'devotion',
    title: 'Devotion',
    description: 'Keep your daily streak alive.',
    icon: '◈',
    metric: 'maxDailyStreak',
    tiers: [
      { threshold: 3, sparks: 20 },
      { threshold: 7, sparks: 75 },
      { threshold: 14, sparks: 150 },
      { threshold: 30, sparks: 300 },
      { threshold: 60, sparks: 600 },
    ],
  },
]

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}

/** Number of tiers reached for a given metric value (0 = none unlocked). */
export function tiersReached(achievement: Achievement, value: number): number {
  let count = 0
  for (const tier of achievement.tiers) {
    if (value >= tier.threshold) count += 1
    else break
  }
  return count
}

/** Sum of spark rewards for tiers in the half-open range [fromTier, toTier). */
export function sparksBetweenTiers(
  achievement: Achievement,
  fromTier: number,
  toTier: number,
): number {
  let total = 0
  for (let i = fromTier; i < toTier; i++) {
    total += achievement.tiers[i]?.sparks ?? 0
  }
  return total
}

/** Label for a claimed-tier count, e.g. 0 -> "Locked", 3 -> "Gold". */
export function tierLabel(tierCount: number): string {
  if (tierCount <= 0) return 'Locked'
  return TIER_NAMES[Math.min(tierCount, TIER_NAMES.length) - 1]
}
