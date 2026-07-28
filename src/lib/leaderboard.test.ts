import { describe, expect, it } from 'vitest'
import {
  buildLeaderboard,
  currentMonthKey,
  seasonReward,
  seasonStandings,
  worldRewardForRank,
} from './leaderboard'

describe('leaderboard rewards', () => {
  it('pays the specified world schedule', () => {
    expect(worldRewardForRank(1)).toEqual({ sparks: 5000, prisms: 200 })
    expect(worldRewardForRank(2)).toEqual({ sparks: 3500, prisms: 150 })
    expect(worldRewardForRank(3)).toEqual({ sparks: 2500, prisms: 100 })
    expect(worldRewardForRank(7)).toEqual({ sparks: 1000, prisms: 50 })
    expect(worldRewardForRank(10)).toEqual({ sparks: 1000, prisms: 50 })
    expect(worldRewardForRank(11)).toEqual({ sparks: 0, prisms: 0 })
  })

  it('halves rewards for country and quarters for state', () => {
    expect(seasonReward('world', 1)).toEqual({ sparks: 5000, prisms: 200 })
    expect(seasonReward('country', 1)).toEqual({ sparks: 2500, prisms: 100 })
    expect(seasonReward('region', 1)).toEqual({ sparks: 1250, prisms: 50 })
  })

  it('formats the current month key as YYYY-MM', () => {
    expect(currentMonthKey(new Date('2026-03-09T00:00:00Z'))).toBe('2026-03')
    expect(currentMonthKey(new Date('2026-11-30T00:00:00Z'))).toBe('2026-11')
  })
})

describe('leaderboard ranking', () => {
  const player = {
    name: 'Tester',
    country: 'United States',
    region: 'California',
    elo: 9999,
  }

  it('ranks an elite player at the top of the world board', () => {
    const view = buildLeaderboard('world', player)
    expect(view.playerRank).toBe(1)
    expect(view.rows[0].isPlayer).toBe(true)
  })

  it('scopes country and state to the player location', () => {
    const country = buildLeaderboard('country', player)
    expect(country.rows.every((r) => r.country === 'United States' || r.isPlayer)).toBe(true)

    const region = buildLeaderboard('region', player)
    expect(
      region.rows.every(
        (r) => (r.country === 'United States' && r.region === 'California') || r.isPlayer,
      ),
    ).toBe(true)
  })

  it('is deterministic across calls', () => {
    const a = buildLeaderboard('world', player)
    const b = buildLeaderboard('world', player)
    expect(a.rows.map((r) => r.id)).toEqual(b.rows.map((r) => r.id))
  })

  it('produces standings for all three scopes', () => {
    const standings = seasonStandings(player)
    expect(standings.map((s) => s.scope)).toEqual(['world', 'country', 'region'])
    standings.forEach((s) => expect(s.rank).toBeGreaterThan(0))
  })
})
