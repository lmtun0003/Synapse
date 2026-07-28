// ─── Achievement Tiers ───────────────────────────────────────────────────────

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'

export interface AchievementTierDef {
  tier: AchievementTier
  label: string
  color: string
  bg: string
  border: string
  sparkReward: number
  icon: string
  requirement: number   // quantity needed for this tier
}

export const TIER_DEFS: AchievementTierDef[] = [
  { tier: 'bronze',   label: 'Bronze I',   color: 'text-orange-400', bg: 'bg-orange-700/12', border: 'border-orange-600/25', sparkReward: 10,  icon: '🥉', requirement: 1 },
  { tier: 'silver',   label: 'Silver II',  color: 'text-slate-300',  bg: 'bg-slate-400/12',  border: 'border-slate-400/25',  sparkReward: 25,  icon: '🥈', requirement: 2 },
  { tier: 'gold',     label: 'Gold III',   color: 'text-amber-400',  bg: 'bg-amber-500/12',  border: 'border-amber-500/25',  sparkReward: 50,  icon: '🥇', requirement: 3 },
  { tier: 'platinum', label: 'Platinum IV',color: 'text-cyan-300',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/25',   sparkReward: 100, icon: '💠', requirement: 4 },
  { tier: 'diamond',  label: 'Diamond V',  color: 'text-blue-300',   bg: 'bg-blue-400/10',   border: 'border-blue-400/25',   sparkReward: 250, icon: '💎', requirement: 5 },
]

// ─── Achievement Definitions ─────────────────────────────────────────────────

export interface AchievementDef {
  id: string
  category: 'campaign' | 'ranked' | 'daily' | 'social' | 'mastery' | 'collection' | 'special'
  icon: string
  name: string
  description: string
  // Each tier has a target value. Completing all 5 tiers completes the achievement.
  tiers: { target: number; description: string }[]
  stat: string   // which PlayerStats field to check
  displayOnProfile: boolean
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // ── Campaign ────────────────────────────────────────────────────────────────
  {
    id: 'first_solve',
    category: 'campaign',
    icon: '⚡',
    name: 'First Signal',
    description: 'Complete your first puzzle.',
    tiers: [
      { target: 1,   description: 'Solve 1 puzzle' },
      { target: 10,  description: 'Solve 10 puzzles' },
      { target: 50,  description: 'Solve 50 puzzles' },
      { target: 100, description: 'Solve 100 puzzles' },
      { target: 500, description: 'Solve 500 puzzles' },
    ],
    stat: 'totalSolved',
    displayOnProfile: true,
  },
  {
    id: 'perfectionist',
    category: 'mastery',
    icon: '🎯',
    name: 'Perfectionist',
    description: 'Achieve perfect ratings.',
    tiers: [
      { target: 1,  description: 'Get 1 Perfect rating' },
      { target: 5,  description: 'Get 5 Perfect ratings' },
      { target: 25, description: 'Get 25 Perfect ratings' },
      { target: 50, description: 'Get 50 Perfect ratings' },
      { target: 100,description: 'Get 100 Perfect ratings' },
    ],
    stat: 'totalPerfect',
    displayOnProfile: true,
  },
  {
    id: 'campaign_complete',
    category: 'campaign',
    icon: '🗺️',
    name: 'World Explorer',
    description: 'Complete campaign worlds.',
    tiers: [
      { target: 20,  description: 'Complete World 1 (20 levels)' },
      { target: 40,  description: 'Complete World 2 (40 levels)' },
      { target: 60,  description: 'Complete World 3 (60 levels)' },
      { target: 80,  description: 'Complete World 4 (80 levels)' },
      { target: 100, description: 'Complete World 5 (100 levels)' },
    ],
    stat: 'campaignProgress',
    displayOnProfile: true,
  },
  {
    id: 'speed_demon',
    category: 'mastery',
    icon: '⏱',
    name: 'Speed Demon',
    description: 'Solve puzzles in record time.',
    tiers: [
      { target: 1,   description: 'Solve a puzzle in under 10 seconds' },
      { target: 5,   description: 'Solve 5 puzzles in under 10 seconds' },
      { target: 20,  description: 'Solve 20 puzzles in under 15 seconds' },
      { target: 50,  description: 'Solve 50 puzzles in under 20 seconds' },
      { target: 100, description: 'Solve 100 puzzles in under 30 seconds' },
    ],
    stat: 'totalSolved',
    displayOnProfile: false,
  },
  // ── Daily ───────────────────────────────────────────────────────────────────
  {
    id: 'daily_streak',
    category: 'daily',
    icon: '🔥',
    name: 'Ignition',
    description: 'Maintain a daily puzzle streak.',
    tiers: [
      { target: 3,  description: '3-day streak' },
      { target: 7,  description: '7-day streak' },
      { target: 30, description: '30-day streak' },
      { target: 60, description: '60-day streak' },
      { target: 100,description: '100-day streak' },
    ],
    stat: 'dailyStreak',
    displayOnProfile: true,
  },
  {
    id: 'daily_top',
    category: 'daily',
    icon: '📅',
    name: 'Daily Champion',
    description: 'Rank in the top 10 on daily puzzles.',
    tiers: [
      { target: 1,  description: 'Finish top 10 once' },
      { target: 5,  description: 'Finish top 10 five times' },
      { target: 10, description: 'Finish top 10 ten times' },
      { target: 25, description: 'Finish top 10 twenty-five times' },
      { target: 50, description: 'Finish #1 once' },
    ],
    stat: 'bestDailyRank',
    displayOnProfile: true,
  },
  // ── Ranked ──────────────────────────────────────────────────────────────────
  {
    id: 'ranked_wins',
    category: 'ranked',
    icon: '🏆',
    name: 'Competitor',
    description: 'Win ranked matches.',
    tiers: [
      { target: 1,  description: 'Win 1 ranked match' },
      { target: 10, description: 'Win 10 ranked matches' },
      { target: 50, description: 'Win 50 ranked matches' },
      { target: 100,description: 'Win 100 ranked matches' },
      { target: 500,description: 'Win 500 ranked matches' },
    ],
    stat: 'rankedWins',
    displayOnProfile: true,
  },
  {
    id: 'rank_climber',
    category: 'ranked',
    icon: '📈',
    name: 'Rank Climber',
    description: 'Reach higher ranks.',
    tiers: [
      { target: 1,  description: 'Reach Silver' },
      { target: 2,  description: 'Reach Gold' },
      { target: 3,  description: 'Reach Platinum' },
      { target: 4,  description: 'Reach Diamond' },
      { target: 5,  description: 'Reach Master' },
    ],
    stat: 'rankedWins',
    displayOnProfile: true,
  },
  // ── Social ──────────────────────────────────────────────────────────────────
  {
    id: 'creator',
    category: 'social',
    icon: '✏️',
    name: 'Architect',
    description: 'Create and publish puzzles.',
    tiers: [
      { target: 1,  description: 'Publish 1 puzzle' },
      { target: 5,  description: 'Publish 5 puzzles' },
      { target: 10, description: 'Publish 10 puzzles' },
      { target: 25, description: 'Publish 25 puzzles' },
      { target: 50, description: 'Publish 50 puzzles' },
    ],
    stat: 'puzzlesCreated',
    displayOnProfile: false,
  },
  {
    id: 'community_star',
    category: 'social',
    icon: '⭐',
    name: 'Community Star',
    description: 'Receive ratings on your puzzles.',
    tiers: [
      { target: 5,   description: 'Get 5 ratings on your puzzles' },
      { target: 25,  description: 'Get 25 ratings on your puzzles' },
      { target: 100, description: 'Get 100 ratings' },
      { target: 250, description: 'Get 250 ratings' },
      { target: 500, description: 'Get 500 ratings' },
    ],
    stat: 'communityRating',
    displayOnProfile: false,
  },
  // ── Special ─────────────────────────────────────────────────────────────────
  {
    id: 'elite_conqueror',
    category: 'special',
    icon: '👑',
    name: 'Elite Conqueror',
    description: 'Complete the Elite Grandmaster campaign.',
    tiers: [
      { target: 1,  description: 'Complete Stage 1 of Elite' },
      { target: 3,  description: 'Complete Stage 3 of Elite' },
      { target: 5,  description: 'Complete Stage 5 of Elite' },
      { target: 8,  description: 'Complete Stage 8 of Elite' },
      { target: 10, description: 'Complete all 10 Elite stages' },
    ],
    stat: 'totalSolved',
    displayOnProfile: true,
  },
  {
    id: 'no_undo',
    category: 'mastery',
    icon: '🧠',
    name: 'Pure Mind',
    description: 'Solve puzzles without using undo.',
    tiers: [
      { target: 5,  description: 'Solve 5 puzzles without undo' },
      { target: 20, description: 'Solve 20 puzzles without undo' },
      { target: 50, description: 'Solve 50 puzzles without undo' },
      { target: 100,description: 'Solve 100 puzzles without undo' },
      { target: 200,description: 'Solve 200 puzzles without undo' },
    ],
    stat: 'totalSolved',
    displayOnProfile: false,
  },
]

export const ACHIEVEMENT_CATEGORIES = [
  { id: 'all',        label: 'All' },
  { id: 'campaign',   label: '⚡ Campaign' },
  { id: 'ranked',     label: '🏆 Ranked' },
  { id: 'daily',      label: '📅 Daily' },
  { id: 'mastery',    label: '🎯 Mastery' },
  { id: 'social',     label: '🌐 Social' },
  { id: 'special',    label: '👑 Special' },
]

// ─── Player Achievement State ─────────────────────────────────────────────────

export interface PlayerAchievement {
  id?: string
  currentTier: number          // 0 = not started, 1–5 = tier reached
  currentProgress: number      // raw count towards next tier
  completedAt?: string[]       // ISO timestamps per tier
  pinnedOnProfile?: boolean
}

export function getAchievementProgress(
  achievement: AchievementDef,
  playerAchievement?: PlayerAchievement
): {
  currentTier: number
  nextTarget: number
  currentValue: number
  pct: number
  maxed: boolean
} {
  const current = playerAchievement?.currentProgress ?? 0
  const currentTier = playerAchievement?.currentTier ?? 0
  const maxed = currentTier >= achievement.tiers.length

  if (maxed) return { currentTier, nextTarget: achievement.tiers[achievement.tiers.length - 1].target, currentValue: current, pct: 100, maxed: true }

  const nextTarget = achievement.tiers[currentTier]?.target ?? 1
  const prevTarget = currentTier > 0 ? achievement.tiers[currentTier - 1].target : 0
  const pct = Math.min(100, ((current - prevTarget) / (nextTarget - prevTarget)) * 100)

  return { currentTier, nextTarget, currentValue: current, pct, maxed: false }
}
