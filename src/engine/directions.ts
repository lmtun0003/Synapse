import type { Direction } from './types'

export const DIRECTIONS: Direction[] = ['N', 'E', 'S', 'W']

export const DELTAS: Record<Direction, { dr: number; dc: number }> = {
  N: { dr: -1, dc: 0 },
  E: { dr: 0, dc: 1 },
  S: { dr: 1, dc: 0 },
  W: { dr: 0, dc: -1 },
}

export function rotateClockwise(dir: Direction): Direction {
  const i = DIRECTIONS.indexOf(dir)
  return DIRECTIONS[(i + 1) % 4]!
}

export function rotateCounterClockwise(dir: Direction): Direction {
  const i = DIRECTIONS.indexOf(dir)
  return DIRECTIONS[(i + 3) % 4]!
}

export function opposite(dir: Direction): Direction {
  const i = DIRECTIONS.indexOf(dir)
  return DIRECTIONS[(i + 2) % 4]!
}

export function reflect(dir: Direction, mirrorFacing: Direction): Direction {
  // Mirror facing is the normal of the mirror plane.
  // Vertical mirror (facing E or W) flips E/W; horizontal (N/S) flips N/S.
  if (mirrorFacing === 'E' || mirrorFacing === 'W') {
    if (dir === 'E') return 'W'
    if (dir === 'W') return 'E'
    return dir
  }
  if (dir === 'N') return 'S'
  if (dir === 'S') return 'N'
  return dir
}
