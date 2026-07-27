import { buildLevel, self } from './builder'
import type { PuzzleDefinition } from '@/engine/types'

/** Levels 41+ sample — Mirrors. */
export const CHAPTER_3: PuzzleDefinition[] = [
  buildLevel({
    id: '3-1',
    title: 'Reflection',
    chapter: 3,
    levelNumber: 41,
    intro: 'Mirrors redirect your signal.',
    mechanics: ['basic', 'mirror'],
    par: { perfect: 1, gold: 2, silver: 3, bronze: 5 },
    grid: [
      [
        self(true),
        {
          active: false,
          mechanic: 'mirror',
          facing: 'E',
          offsets: [{ dr: 0, dc: -1 }],
        },
        self(false),
      ],
    ],
  }),
  buildLevel({
    id: '3-2',
    title: 'Looking Glass',
    chapter: 3,
    levelNumber: 42,
    mechanics: ['basic', 'mirror'],
    par: { perfect: 2, gold: 3, silver: 5, bronze: 8 },
    grid: [
      [self(true), self(false)],
      [
        {
          active: false,
          mechanic: 'mirror',
          facing: 'N',
          offsets: [{ dr: -1, dc: 0 }],
        },
        self(true),
      ],
    ],
  }),
]
