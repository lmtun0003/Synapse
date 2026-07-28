/**
 * Deterministic leaderboard model.
 *
 * There is no live backend yet, so a stable synthetic field of players is
 * generated from a fixed seed. The current player is spliced in by Elo so the
 * World / Country / State views and the monthly reward payouts behave
 * consistently across renders and reloads.
 */

export type LeaderboardScope = 'world' | 'country' | 'region'

export interface LeaderboardEntry {
  id: string
  name: string
  elo: number
  country: string
  region: string
  meta: string
  isPlayer?: boolean
}

export interface PlayerLocation {
  name: string
  elo: number
  country: string
  region: string
}

export interface RewardBundle {
  sparks: number
  prisms: number
}

export interface ScopeStanding {
  scope: LeaderboardScope
  rank: number
  total: number
  reward: RewardBundle
}

/** Country → states/regions used for scoping. */
export const COUNTRIES: Record<string, string[]> = {
  'United States': ['California', 'Texas', 'New York', 'Florida', 'Washington'],
  Japan: ['Tokyo', 'Osaka', 'Kyoto', 'Hokkaido'],
  Germany: ['Bavaria', 'Berlin', 'Hesse', 'Saxony'],
  'United Kingdom': ['England', 'Scotland', 'Wales'],
  Brazil: ['Sao Paulo', 'Rio de Janeiro', 'Bahia'],
  India: ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu'],
  Canada: ['Ontario', 'Quebec', 'British Columbia'],
  Australia: ['New South Wales', 'Victoria', 'Queensland'],
}

export const COUNTRY_NAMES = Object.keys(COUNTRIES)

const FIRST = [
  'Aria', 'Nox', 'Lumen', 'Vesper', 'Cyra', 'Zephyr', 'Iris', 'Orion',
  'Kai', 'Nova', 'Echo', 'Lyra', 'Sol', 'Wren', 'Onyx', 'Juno',
  'Milo', 'Sage', 'Rune', 'Vale', 'Peri', 'Dune', 'Astra', 'Cove',
]
const LAST = [
  'Quell', 'Vane', 'Marsh', 'Frost', 'Holt', 'Crane', 'Vex', 'Reed',
  'Ash', 'Locke', 'Pike', 'Thorn', 'Sky', 'Byrne', 'Wilde', 'Fenn',
]
const METAS = [
  'Perfect streak', 'Fewest moves', 'Fastest solve', 'Daily devotee',
  'Ranked veteran', 'Rising star', 'Consistency', 'Puzzle purist',
]

/** Small deterministic PRNG (mulberry32). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

let cachedPool: LeaderboardEntry[] | null = null

/** Build (and memoise) the synthetic field of competitors. */
export function generatePool(size = 480): LeaderboardEntry[] {
  if (cachedPool && cachedPool.length === size) return cachedPool
  const rand = mulberry32(987654321)
  const pool: LeaderboardEntry[] = []
  for (let i = 0; i < size; i++) {
    const country = COUNTRY_NAMES[Math.floor(rand() * COUNTRY_NAMES.length)]
    const regions = COUNTRIES[country]
    const region = regions[Math.floor(rand() * regions.length)]
    const first = FIRST[Math.floor(rand() * FIRST.length)]
    const last = LAST[Math.floor(rand() * LAST.length)]
    // Elo skewed toward the middle with a long upper tail.
    const base = 900 + Math.floor(rand() * 900)
    const bonus = Math.floor(rand() * rand() * 700)
    pool.push({
      id: `bot-${i}`,
      name: `${first} ${last}`,
      elo: base + bonus,
      country,
      region,
      meta: METAS[Math.floor(rand() * METAS.length)],
    })
  }
  cachedPool = pool
  return pool
}

function sortByElo(a: LeaderboardEntry, b: LeaderboardEntry): number {
  if (b.elo !== a.elo) return b.elo - a.elo
  return a.id.localeCompare(b.id)
}

function scopeFilter(
  entry: LeaderboardEntry,
  scope: LeaderboardScope,
  player: PlayerLocation,
): boolean {
  if (scope === 'world') return true
  if (scope === 'country') return entry.country === player.country
  return entry.country === player.country && entry.region === player.region
}

export interface LeaderboardView {
  scope: LeaderboardScope
  rows: LeaderboardEntry[]
  playerRank: number
  playerEntry: LeaderboardEntry
  total: number
}

/**
 * Rank the current player against the synthetic field for a given scope.
 * Returns the top `limit` rows plus the player's overall rank in that scope.
 */
export function buildLeaderboard(
  scope: LeaderboardScope,
  player: PlayerLocation,
  limit = 100,
): LeaderboardView {
  const playerEntry: LeaderboardEntry = {
    id: 'you',
    name: player.name,
    elo: player.elo,
    country: player.country,
    region: player.region,
    meta: 'You',
    isPlayer: true,
  }

  const field = generatePool()
    .filter((e) => scopeFilter(e, scope, player))
    .concat(playerEntry)
    .sort(sortByElo)

  const playerRank = field.findIndex((e) => e.isPlayer) + 1
  return {
    scope,
    rows: field.slice(0, limit),
    playerRank,
    playerEntry,
    total: field.length,
  }
}

/** World reward schedule as specified by the ranked design. */
export function worldRewardForRank(rank: number): RewardBundle {
  if (rank === 1) return { sparks: 5000, prisms: 200 }
  if (rank === 2) return { sparks: 3500, prisms: 150 }
  if (rank === 3) return { sparks: 2500, prisms: 100 }
  if (rank <= 10) return { sparks: 1000, prisms: 50 }
  return { sparks: 0, prisms: 0 }
}

const SCOPE_MULTIPLIER: Record<LeaderboardScope, number> = {
  world: 1,
  country: 0.5, // half of world
  region: 0.25, // half of country
}

/** Reward for a rank within a scope. Country = ½ world, State = ½ country. */
export function seasonReward(scope: LeaderboardScope, rank: number): RewardBundle {
  const base = worldRewardForRank(rank)
  const mult = SCOPE_MULTIPLIER[scope]
  return {
    sparks: Math.floor(base.sparks * mult),
    prisms: Math.floor(base.prisms * mult),
  }
}

/** YYYY-MM key used to gate monthly reward claims. */
export function currentMonthKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

/** Standings across all three scopes with their end-of-month rewards. */
export function seasonStandings(player: PlayerLocation): ScopeStanding[] {
  const scopes: LeaderboardScope[] = ['world', 'country', 'region']
  return scopes.map((scope) => {
    const view = buildLeaderboard(scope, player, 1)
    return {
      scope,
      rank: view.playerRank,
      total: view.total,
      reward: seasonReward(scope, view.playerRank),
    }
  })
}

export const SCOPE_LABEL: Record<LeaderboardScope, string> = {
  world: 'World',
  country: 'Country',
  region: 'State',
}
