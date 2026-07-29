// ─── Global Game Configuration ────────────────────────────────────────────────
// All values here are editable at runtime via the Admin panel.

export interface GameConfig {
  // Reward multipliers
  xpMultiplier: number           // global XP earn multiplier (default 1.0)
  sparkMultiplier: number        // global Spark earn multiplier (default 1.0)
  prismEarnRate: number          // prisms per season rank-up (default 5)

  // Daily puzzle
  dailyStreakBonusSparks: number  // bonus sparks for maintaining streak (default 10)
  dailyPerfectBonusSparks: number // bonus on perfect daily solve (default 15)

  // Ranked
  eloGainWin: number             // base elo gain on win (default 25)
  eloLossDefeat: number          // base elo loss on defeat (default 20)

  // Battle pass
  battlePassSeasonDays: number   // season length in days (default 60)
  battlePassLevels: number       // total reward levels (default 100)
  battlePassPrismCost: number    // cost to unlock premium (default 800)

  // Elite campaign reward
  eliteCompletionSparks: number  // sparks for completing elite (default 2000)
  eliteCompletionPrisms: number  // prisms for completing elite (default 200)

  // Monthly ranked rewards (world)
  monthlyRank1Sparks: number
  monthlyRank1Prisms: number
  monthlyRank2Sparks: number
  monthlyRank2Prisms: number
  monthlyRank3Sparks: number
  monthlyRank3Prisms: number
  monthlyTop10Sparks: number
  monthlyTop10Prisms: number

  // Misc flags
  maintenanceMode: boolean
  newPlayerSparks: number        // sparks given on first launch (default 150)
  adsEnabled: boolean
  rankDecayEnabled: boolean
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  xpMultiplier: 1.0,
  sparkMultiplier: 1.0,
  prismEarnRate: 5,

  dailyStreakBonusSparks: 10,
  dailyPerfectBonusSparks: 15,

  eloGainWin: 25,
  eloLossDefeat: 20,

  battlePassSeasonDays: 60,
  battlePassLevels: 100,
  battlePassPrismCost: 800,

  eliteCompletionSparks: 2000,
  eliteCompletionPrisms: 200,

  monthlyRank1Sparks: 5000,
  monthlyRank1Prisms: 200,
  monthlyRank2Sparks: 3500,
  monthlyRank2Prisms: 150,
  monthlyRank3Sparks: 2500,
  monthlyRank3Prisms: 100,
  monthlyTop10Sparks: 1000,
  monthlyTop10Prisms: 50,

  maintenanceMode: false,
  newPlayerSparks: 150,
  adsEnabled: false,
  rankDecayEnabled: false,
}

export const CONFIG_SECTIONS = [
  {
    id: 'rewards',
    label: '✦ Rewards',
    fields: ['xpMultiplier', 'sparkMultiplier', 'prismEarnRate', 'newPlayerSparks'] as const,
  },
  {
    id: 'daily',
    label: '📅 Daily',
    fields: ['dailyStreakBonusSparks', 'dailyPerfectBonusSparks'] as const,
  },
  {
    id: 'ranked',
    label: '🏆 Ranked',
    fields: ['eloGainWin', 'eloLossDefeat'] as const,
  },
  {
    id: 'battlepass',
    label: '⚔️ Battle Pass',
    fields: ['battlePassSeasonDays', 'battlePassLevels', 'battlePassPrismCost'] as const,
  },
  {
    id: 'elite',
    label: '👑 Elite',
    fields: ['eliteCompletionSparks', 'eliteCompletionPrisms'] as const,
  },
  {
    id: 'monthly',
    label: '📊 Monthly Ranked',
    fields: ['monthlyRank1Sparks', 'monthlyRank1Prisms', 'monthlyRank2Sparks', 'monthlyRank2Prisms', 'monthlyRank3Sparks', 'monthlyRank3Prisms', 'monthlyTop10Sparks', 'monthlyTop10Prisms'] as const,
  },
]

export const CONFIG_FIELD_META: Record<keyof GameConfig, { label: string; type: 'number' | 'boolean'; min?: number; max?: number; step?: number; description?: string }> = {
  xpMultiplier:             { label: 'XP Multiplier',               type: 'number',  min: 0.1, max: 10,    step: 0.1, description: 'Multiplied on all XP earned' },
  sparkMultiplier:          { label: 'Spark Multiplier',            type: 'number',  min: 0.1, max: 10,    step: 0.1, description: 'Multiplied on all Sparks earned' },
  prismEarnRate:            { label: 'Prism Earn Rate',             type: 'number',  min: 0,   max: 50,    step: 1 },
  dailyStreakBonusSparks:   { label: 'Daily Streak Bonus ✦',        type: 'number',  min: 0,   max: 200,   step: 5 },
  dailyPerfectBonusSparks:  { label: 'Daily Perfect Bonus ✦',       type: 'number',  min: 0,   max: 200,   step: 5 },
  eloGainWin:               { label: 'Elo Gain (Win)',              type: 'number',  min: 1,   max: 100,   step: 1 },
  eloLossDefeat:            { label: 'Elo Loss (Defeat)',           type: 'number',  min: 1,   max: 100,   step: 1 },
  battlePassSeasonDays:     { label: 'Season Length (days)',        type: 'number',  min: 7,   max: 180,   step: 1 },
  battlePassLevels:         { label: 'Battle Pass Levels',         type: 'number',  min: 10,  max: 200,   step: 10 },
  battlePassPrismCost:      { label: 'Battle Pass Cost ◈',         type: 'number',  min: 0,   max: 2000,  step: 50 },
  eliteCompletionSparks:    { label: 'Elite Completion ✦',          type: 'number',  min: 0,   max: 10000, step: 100 },
  eliteCompletionPrisms:    { label: 'Elite Completion ◈',          type: 'number',  min: 0,   max: 1000,  step: 10 },
  monthlyRank1Sparks:       { label: '#1 World ✦',                  type: 'number',  min: 0,   max: 20000, step: 100 },
  monthlyRank1Prisms:       { label: '#1 World ◈',                  type: 'number',  min: 0,   max: 2000,  step: 10 },
  monthlyRank2Sparks:       { label: '#2 World ✦',                  type: 'number',  min: 0,   max: 20000, step: 100 },
  monthlyRank2Prisms:       { label: '#2 World ◈',                  type: 'number',  min: 0,   max: 2000,  step: 10 },
  monthlyRank3Sparks:       { label: '#3 World ✦',                  type: 'number',  min: 0,   max: 20000, step: 100 },
  monthlyRank3Prisms:       { label: '#3 World ◈',                  type: 'number',  min: 0,   max: 2000,  step: 10 },
  monthlyTop10Sparks:       { label: 'Top 10 World ✦',              type: 'number',  min: 0,   max: 10000, step: 50 },
  monthlyTop10Prisms:       { label: 'Top 10 World ◈',              type: 'number',  min: 0,   max: 1000,  step: 5 },
  maintenanceMode:          { label: 'Maintenance Mode',            type: 'boolean', description: 'Shows maintenance screen to all users' },
  newPlayerSparks:          { label: 'New Player Sparks ✦',         type: 'number',  min: 0,   max: 5000,  step: 50 },
  adsEnabled:               { label: 'Rewarded Ads',                type: 'boolean', description: 'Show optional rewarded ads' },
  rankDecayEnabled:         { label: 'Rank Decay',                  type: 'boolean', description: 'Inactive players lose Elo over time' },
}
