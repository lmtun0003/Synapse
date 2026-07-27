import { describe, expect, it } from 'vitest'
import { expectedScore, rankFromElo, updateElo } from './elo'

describe('elo', () => {
  it('expects even odds for equal ratings', () => {
    expect(expectedScore(1500, 1500)).toBeCloseTo(0.5)
  })

  it('increases rating on win', () => {
    expect(updateElo(1000, 1000, 1)).toBeGreaterThan(1000)
  })

  it('maps thresholds to ranks', () => {
    expect(rankFromElo(1000)).toBe('Bronze')
    expect(rankFromElo(1500)).toBe('Gold')
    expect(rankFromElo(2400)).toBe('Synapse')
  })
})
