import type { MechanicKind } from '@/engine/types'

/**
 * Human-readable reference for every node mechanic.
 * Descriptions mirror the deterministic behaviour implemented in
 * `src/engine/board.ts` so players can learn exactly what a node does.
 */
export interface MechanicInfo {
  kind: MechanicKind
  name: string
  /** Glyph shown on the node face (kept in sync with NodeView). */
  glyph: string
  /** One-line summary. */
  tagline: string
  /** How the player interacts with it. */
  howItWorks: string
  /** The concrete effect on the board when it fires. */
  effect: string
}

export const MECHANIC_INFO: Record<MechanicKind, MechanicInfo> = {
  basic: {
    kind: 'basic',
    name: 'Signal Node',
    glyph: '●',
    tagline: 'The core of every board.',
    howItWorks: 'Tap it to flip its signal on or off.',
    effect:
      'Toggles itself. Pulse variants also flip every orthogonally adjacent node in one tap.',
  },
  rotation: {
    kind: 'rotation',
    name: 'Rotor',
    glyph: '▲',
    tagline: 'Fires where it points, then turns.',
    howItWorks: 'Tap to fire a signal in the direction the arrow faces.',
    effect:
      'Toggles the single node it points at, then rotates 90° clockwise ready for your next tap.',
  },
  mirror: {
    kind: 'mirror',
    name: 'Mirror',
    glyph: '⟋',
    tagline: 'Bends the signal across its diagonal.',
    howItWorks: 'Tap to send signals out along reflected directions.',
    effect:
      'Reflects each outgoing signal across its diagonal, toggling the neighbour in the mirrored direction instead of the straight one.',
  },
  gravity: {
    kind: 'gravity',
    name: 'Gravity Well',
    glyph: '◉',
    tagline: 'Pulls loose nodes toward it.',
    howItWorks: 'Activate it, then every move it draws nearby nodes closer.',
    effect:
      'While active, pulls unlocked nodes one cell along its axis toward the well each move.',
  },
  teleporter: {
    kind: 'teleporter',
    name: 'Teleporter',
    glyph: '◎',
    tagline: 'Linked across the board.',
    howItWorks: 'Tap it to also fire its paired twin, wherever it sits.',
    effect:
      'Toggles its linked twin and the twin’s neighbours, and unlocks the twin if it was sealed.',
  },
  inverter: {
    kind: 'inverter',
    name: 'Inverter',
    glyph: '⊘',
    tagline: 'Flips state and colour.',
    howItWorks: 'Tap to invert the neighbours around it.',
    effect:
      'Toggles each neighbour and swaps its colour channel between blue and purple.',
  },
  logic_gate: {
    kind: 'logic_gate',
    name: 'Logic Gate',
    glyph: 'AND',
    tagline: 'Lights only when its inputs agree.',
    howItWorks: 'You can’t tap it directly — feed its wired input nodes.',
    effect:
      'Recomputes AND / OR / XOR / NAND / NOR from its inputs after every move and lights when the condition is met.',
  },
  power_link: {
    kind: 'power_link',
    name: 'Power Link',
    glyph: '⚡',
    tagline: 'Mirrors its source.',
    howItWorks: 'Wired to a source node — fire the source to drive the link.',
    effect: 'Toggles automatically whenever its wired source node is tapped.',
  },
  locked: {
    kind: 'locked',
    name: 'Locked Node',
    glyph: '⬡',
    tagline: 'Sealed until a signal frees it.',
    howItWorks: 'Cannot be tapped directly — reach it with another signal first.',
    effect:
      'A stray pulse, rotor, or teleport unlocks it (without toggling). Once open it behaves like a normal node.',
  },
  timed: {
    kind: 'timed',
    name: 'Timed Node',
    glyph: '3',
    tagline: 'Counts down once lit.',
    howItWorks: 'Activate it, then keep it fed before the timer runs out.',
    effect:
      'Displays a countdown; when it reaches zero the node powers off unless refreshed by another signal.',
  },
}

export function mechanicInfo(kind: MechanicKind): MechanicInfo {
  return MECHANIC_INFO[kind]
}

/** Mechanics whose introduction deserves a dedicated explainer (basic is self-evident from level 1). */
export function tutorialMechanics(mechanics: MechanicKind[]): MechanicKind[] {
  return mechanics.filter((m) => m !== 'basic')
}
