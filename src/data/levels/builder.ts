import { CARDINAL } from '@/engine/board'
import type { Direction, MechanicKind, PuzzleDefinition, PuzzleNode } from '@/engine/types'

export interface CellConfig {
  active?: boolean
  target?: boolean
  mechanic?: MechanicKind
  facing?: Direction
  interactive?: boolean
  locked?: boolean
  timer?: number
  gateType?: PuzzleNode['gateType']
  inputs?: string[]
  teleport?: string
  color?: PuzzleNode['color']
  offsets?: Array<{ dr: number; dc: number }>
  self?: boolean
}

/** Grid cell: config object, or null for an empty slot. */
export type CellSpec = CellConfig | null

export interface LevelDraft {
  id: string
  title: string
  chapter: number
  levelNumber: number
  grid: CellSpec[][]
  par: PuzzleDefinition['par']
  hint?: string
  intro?: string
  mechanics?: MechanicKind[]
}

/**
 * Declarative level authoring helper.
 * Grid cells map to nodes; `null` leaves an empty cell.
 */
export function buildLevel(draft: LevelDraft): PuzzleDefinition {
  const height = draft.grid.length
  const width = draft.grid[0]?.length ?? 0
  const nodes: PuzzleNode[] = []
  const mechanics = new Set<MechanicKind>()

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const cell = draft.grid[r]?.[c]
      if (cell == null) continue
      const mechanic = cell.mechanic ?? 'basic'
      mechanics.add(mechanic)
      const id = `c${draft.levelNumber}-${r}-${c}`
      const offsets = cell.offsets
        ? cell.offsets.map((o) => ({ ...o }))
        : cell.self
          ? []
          : CARDINAL.map((o) => ({ ...o }))

      nodes.push({
        id,
        row: r,
        col: c,
        active: cell.active ?? false,
        targetActive: cell.target ?? true,
        mechanic,
        affectOffsets: offsets,
        facing: cell.facing,
        teleportTargetId: cell.teleport,
        gateType: cell.gateType,
        inputIds: cell.inputs,
        color: cell.color ?? 'neutral',
        locked: cell.locked,
        timer: cell.timer,
        interactive: cell.interactive ?? true,
      })
    }
  }

  return {
    id: draft.id,
    title: draft.title,
    chapter: draft.chapter,
    levelNumber: draft.levelNumber,
    width,
    height,
    nodes,
    par: draft.par,
    mechanics: draft.mechanics ?? [...mechanics],
    hint: draft.hint,
    intro: draft.intro,
  }
}

/** Compact helper: self-only toggle node. */
export const self = (active = false): CellConfig => ({
  active,
  self: true,
  offsets: [],
})

/** Compact helper: cardinal-neighbour toggle node. */
export const pulse = (active = false): CellConfig => ({
  active,
  offsets: CARDINAL.map((o) => ({ ...o })),
})
