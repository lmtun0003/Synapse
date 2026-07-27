import { buildLevel, self } from './builder'
import type { PuzzleDefinition } from '@/engine/types'

/** Levels 21–40 — Rotation. Facing nodes pulse in one direction. */
export const CHAPTER_2: PuzzleDefinition[] = [
  buildLevel({
    id: '2-1',
    title: 'Turn Once',
    chapter: 2,
    levelNumber: 21,
    intro: 'Rotation nodes fire in the direction they face — then turn.',
    hint: 'Face the dormant node, then fire.',
    mechanics: ['basic', 'rotation'],
    par: { perfect: 1, gold: 2, silver: 3, bronze: 5 },
    grid: [
      [
        self(false),
        {
          active: false,
          mechanic: 'rotation',
          facing: 'W',
          offsets: [],
        },
      ],
    ],
  }),
  buildLevel({
    id: '2-2',
    title: 'Compass',
    chapter: 2,
    levelNumber: 22,
    mechanics: ['basic', 'rotation'],
    par: { perfect: 4, gold: 5, silver: 7, bronze: 10 },
    grid: [
      [null, self(false), null],
      [
        self(false),
        { active: false, mechanic: 'rotation', facing: 'N', offsets: [] },
        self(false),
      ],
      [null, self(false), null],
    ],
  }),
  buildLevel({
    id: '2-3',
    title: 'Patient Arc',
    chapter: 2,
    levelNumber: 23,
    mechanics: ['basic', 'rotation'],
    par: { perfect: 3, gold: 4, silver: 5, bronze: 8 },
    grid: [
      [self(false), self(false), self(false)],
      [
        null,
        { active: true, mechanic: 'rotation', facing: 'E', offsets: [] },
        null,
      ],
    ],
  }),
  buildLevel({
    id: '2-4',
    title: 'Twin Rotors',
    chapter: 2,
    levelNumber: 24,
    mechanics: ['basic', 'rotation'],
    par: { perfect: 3, gold: 4, silver: 6, bronze: 9 },
    grid: [
      [
        { active: false, mechanic: 'rotation', facing: 'E', offsets: [] },
        self(false),
        { active: false, mechanic: 'rotation', facing: 'W', offsets: [] },
      ],
    ],
  }),
  buildLevel({
    id: '2-5',
    title: 'Orbit',
    chapter: 2,
    levelNumber: 25,
    mechanics: ['basic', 'rotation'],
    par: { perfect: 8, gold: 9, silver: 11, bronze: 14 },
    grid: [
      [self(false), self(false), self(false)],
      [
        self(false),
        { active: false, mechanic: 'rotation', facing: 'N', offsets: [] },
        self(false),
      ],
      [self(false), self(false), self(false)],
    ],
  }),
]
