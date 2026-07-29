import { CHAPTER_1 } from './chapter1'
import { CHAPTER_2 } from './chapter2'
import { CHAPTER_3 } from './chapter3'
import { CHAPTER_4 } from './chapter4'
import type { PuzzleDefinition } from '@/engine/types'

export const CAMPAIGN_LEVELS: PuzzleDefinition[] = [
  ...CHAPTER_1,
  ...CHAPTER_2,
  ...CHAPTER_3,
  ...CHAPTER_4,
]

export const CHAPTERS = [
  {
    id: 1,
    title: 'Awakening',
    subtitle: 'Basic activation',
    range: [1, 20] as const,
    mechanic: 'basic' as const,
  },
  {
    id: 2,
    title: 'Orientation',
    subtitle: 'Rotation',
    range: [21, 40] as const,
    mechanic: 'rotation' as const,
  },
  {
    id: 3,
    title: 'Reflection',
    subtitle: 'Mirrors',
    range: [41, 60] as const,
    mechanic: 'mirror' as const,
  },
  {
    id: 4,
    title: 'Attraction',
    subtitle: 'Gravity',
    range: [61, 80] as const,
    mechanic: 'gravity' as const,
  },
  {
    id: 5,
    title: 'Displacement',
    subtitle: 'Teleporters',
    range: [81, 100] as const,
    mechanic: 'teleporter' as const,
  },
  {
    id: 6,
    title: 'Synthesis',
    subtitle: 'Combined mechanics',
    range: [101, 200] as const,
    mechanic: 'logic_gate' as const,
  },
]

export function getLevelById(id: string): PuzzleDefinition | undefined {
  return CAMPAIGN_LEVELS.find((l) => l.id === id)
}

export function getLevelByNumber(n: number): PuzzleDefinition | undefined {
  return CAMPAIGN_LEVELS.find((l) => l.levelNumber === n)
}

export function getNextLevel(id: string): PuzzleDefinition | undefined {
  const idx = CAMPAIGN_LEVELS.findIndex((l) => l.id === id)
  if (idx < 0) return undefined
  return CAMPAIGN_LEVELS[idx + 1]
}

export type ChapterMeta = (typeof CHAPTERS)[number]

export function getChapterMeta(chapterId: number): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.id === chapterId)
}

export function levelsInChapter(chapterId: number): PuzzleDefinition[] {
  return CAMPAIGN_LEVELS.filter((l) => l.chapter === chapterId).sort(
    (a, b) => a.levelNumber - b.levelNumber,
  )
}

/** Position of a level within its chapter, e.g. Stage 3 / 20. */
export function getStageInfo(level: PuzzleDefinition): {
  stage: number
  totalStages: number
} {
  const chapterLevels = levelsInChapter(level.chapter)
  const stage = chapterLevels.findIndex((l) => l.id === level.id) + 1
  return { stage, totalStages: chapterLevels.length }
}

/** Whether this level is the first stage of its chapter. */
export function isChapterOpening(level: PuzzleDefinition): boolean {
  return getStageInfo(level).stage === 1
}
