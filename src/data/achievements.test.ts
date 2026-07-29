import { describe, expect, it } from 'vitest'
import {
  ACHIEVEMENTS,
  getAchievement,
  sparksBetweenTiers,
  tierLabel,
  tiersReached,
} from './achievements'

const sample = ACHIEVEMENTS[0]

describe('achievement tiers', () => {
  it('has ascending thresholds and non-decreasing spark rewards', () => {
    for (const ach of ACHIEVEMENTS) {
      for (let i = 1; i < ach.tiers.length; i++) {
        expect(ach.tiers[i].threshold).toBeGreaterThan(ach.tiers[i - 1].threshold)
        expect(ach.tiers[i].sparks).toBeGreaterThanOrEqual(ach.tiers[i - 1].sparks)
      }
    }
  })

  it('counts reached tiers from a metric value', () => {
    expect(tiersReached(sample, 0)).toBe(0)
    expect(tiersReached(sample, sample.tiers[0].threshold)).toBe(1)
    expect(tiersReached(sample, sample.tiers[2].threshold)).toBe(3)
    expect(tiersReached(sample, Number.MAX_SAFE_INTEGER)).toBe(sample.tiers.length)
  })

  it('sums sparks for a half-open tier range', () => {
    const expected = sample.tiers[0].sparks + sample.tiers[1].sparks
    expect(sparksBetweenTiers(sample, 0, 2)).toBe(expected)
    expect(sparksBetweenTiers(sample, 0, 0)).toBe(0)
  })

  it('labels tier counts', () => {
    expect(tierLabel(0)).toBe('Locked')
    expect(tierLabel(1)).toBe('Bronze')
    expect(tierLabel(5)).toBe('Diamond')
  })

  it('resolves achievements by id', () => {
    expect(getAchievement(sample.id)?.title).toBe(sample.title)
    expect(getAchievement('nope')).toBeUndefined()
  })
})
