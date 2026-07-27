import { buildLevel, self } from './builder'
import type { PuzzleDefinition } from '@/engine/types'

/** Advanced mechanic samples — Gravity, Teleporters, Locked, Logic. */
export const CHAPTER_4: PuzzleDefinition[] = [
  buildLevel({
    id: '4-1',
    title: 'Pull',
    chapter: 4,
    levelNumber: 61,
    intro: 'Gravity wells shift the board itself.',
    mechanics: ['basic', 'gravity'],
    par: { perfect: 1, gold: 2, silver: 3, bronze: 5 },
    grid: [
      [self(false)],
      [
        {
          active: false,
          mechanic: 'gravity',
          facing: 'N',
          offsets: [{ dr: -1, dc: 0 }],
        },
      ],
    ],
  }),
  buildLevel({
    id: '4-2',
    title: 'Jump Point',
    chapter: 4,
    levelNumber: 81,
    intro: 'Teleporters carry the signal across the void.',
    mechanics: ['basic', 'teleporter'],
    par: { perfect: 1, gold: 2, silver: 3, bronze: 5 },
    grid: [
      [
        {
          active: false,
          mechanic: 'teleporter',
          teleport: 'c81-0-2',
          offsets: [],
        },
        null,
        {
          active: false,
          mechanic: 'teleporter',
          teleport: 'c81-0-0',
          offsets: [{ dr: 1, dc: 0 }],
          interactive: false,
        },
      ],
      [null, null, self(false)],
    ],
  }),
  buildLevel({
    id: '4-3',
    title: 'Locked Signal',
    chapter: 4,
    levelNumber: 100,
    intro: 'Some nodes refuse the signal until unlocked.',
    mechanics: ['basic', 'locked'],
    par: { perfect: 2, gold: 3, silver: 4, bronze: 6 },
    grid: [
      [
        { active: false, offsets: [{ dr: 0, dc: 1 }] },
        {
          active: false,
          mechanic: 'locked',
          locked: true,
          offsets: [],
          interactive: true,
        },
      ],
    ],
  }),
  buildLevel({
    id: '4-4',
    title: 'Logic Heart',
    chapter: 4,
    levelNumber: 110,
    intro: 'AND gates awaken only when every input sings.',
    mechanics: ['basic', 'logic_gate'],
    par: { perfect: 2, gold: 3, silver: 4, bronze: 6 },
    grid: [
      [
        { active: false, offsets: [], self: true },
        {
          active: false,
          mechanic: 'logic_gate',
          gateType: 'AND',
          inputs: ['c110-0-0', 'c110-0-2'],
          interactive: false,
          offsets: [],
        },
        { active: false, offsets: [], self: true },
      ],
    ],
  }),
]
