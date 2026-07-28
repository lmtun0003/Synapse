import type { NodeType } from '@/types/game'

export interface NodeGuide {
  type: NodeType
  name: string
  icon: string
  color: string
  tagline: string
  howItWorks: string
  tip: string
  example: string
  introducedIn: string   // World name
}

export const NODE_GUIDES: Record<NodeType, NodeGuide> = {
  basic: {
    type: 'basic',
    name: 'Signal Node',
    icon: '○',
    color: 'text-white',
    tagline: 'The building block of every puzzle.',
    howItWorks: 'When activated, a Signal Node passes its signal outward through all of its connected directions. Tap it to activate. Tap again to deactivate — this reverses any signals it was carrying.',
    tip: 'Think ahead — deactivating a node removes the signal from everything it was powering.',
    example: 'Source ── ○ ── Target: tap the middle node and the signal flows through.',
    introducedIn: 'World 1: Awakening',
  },
  source: {
    type: 'source',
    name: 'Source Node',
    icon: '◉',
    color: 'text-blue-400',
    tagline: 'The origin of every signal.',
    howItWorks: 'A Source Node is always active and constantly broadcasts a signal in all of its connected directions. You cannot tap it to toggle it — it is permanently on.',
    tip: 'Every puzzle has at least one Source. Trace the signal from the Source outward to understand the flow.',
    example: 'The pulsing blue node is your Source. Everything originates here.',
    introducedIn: 'World 1: Awakening',
  },
  target: {
    type: 'target',
    name: 'Target Node',
    icon: '◎',
    color: 'text-green-400',
    tagline: 'The destination. Light them all.',
    howItWorks: 'A Target Node must receive a signal to count as activated. You win the puzzle when every Target Node is active simultaneously. Targets cannot be tapped directly — they respond to signals from connected neighbours.',
    tip: 'Count the targets before you start. Plan a route that reaches all of them.',
    example: 'The hollow green ring is a Target. Route the signal to it to win.',
    introducedIn: 'World 1: Awakening',
  },
  relay: {
    type: 'relay',
    name: 'Relay Node',
    icon: '◈',
    color: 'text-violet-400',
    tagline: 'Amplifies the signal further.',
    howItWorks: 'A Relay Node accepts a signal from any direction and re-broadcasts it in all its connected directions simultaneously. It is like a Signal Node but with a stronger range of output directions.',
    tip: 'Use Relays to branch a single signal into multiple paths at once.',
    example: 'Signal ── ◈ ──► N, S, E, W all simultaneously.',
    introducedIn: 'World 1: Awakening',
  },
  mirror: {
    type: 'mirror',
    name: 'Mirror Node',
    icon: '◇',
    color: 'text-purple-400',
    tagline: 'Bends the signal at an angle.',
    howItWorks: 'A Mirror Node reflects a signal at 90°. A signal entering from the West exits through the North (or South, depending on mirror orientation). The rotation of the mirror determines which axis it reflects on.',
    tip: 'Look at the mirror\'s rotation angle. A 45° mirror reflects W→N and S→E. A 135° mirror reflects W→S and N→E.',
    example: 'East signal hits mirror → exits North.',
    introducedIn: 'World 3: Reflection',
  },
  rotator: {
    type: 'rotator',
    name: 'Rotator Node',
    icon: '↻',
    color: 'text-amber-400',
    tagline: 'Activating it rotates its connections.',
    howItWorks: 'A Rotator Node has directional connections that ROTATE 90° clockwise each time you tap it. This changes which neighbours it connects to, completely redirecting the signal flow.',
    tip: 'Tap a Rotator multiple times to cycle through all four connection orientations.',
    example: 'Connections N→E: tap once → E→S: tap twice → S→W.',
    introducedIn: 'World 2: Rotation',
  },
  teleport: {
    type: 'teleport',
    name: 'Teleport Node',
    icon: '⬡',
    color: 'text-pink-400',
    tagline: 'Jumps the signal across the board instantly.',
    howItWorks: 'Teleport Nodes come in pairs (same pink colour). When a signal enters one Teleport Node, it instantly exits from its paired Teleport Node on the other side of the board, in the same direction.',
    tip: 'Look for two matching pink hexagons. Getting signal into one delivers it out of the other.',
    example: 'Signal enters ⬡ at (0,1) → exits ⬡ at (4,3) instantly.',
    introducedIn: 'World 5: Quantum',
  },
  gravity: {
    type: 'gravity',
    name: 'Gravity Node',
    icon: '▽',
    color: 'text-orange-400',
    tagline: 'Pulls signals downward.',
    howItWorks: 'A Gravity Node forces any signal passing through it to continue moving downward (South) regardless of the signal\'s original direction. It effectively converts any incoming signal into a downward one.',
    tip: 'Plan your routes vertically. Gravity Nodes are useful when you need to redirect signals from horizontal paths downward.',
    example: 'East signal hits ▽ → signal continues South.',
    introducedIn: 'World 4: Gravity',
  },
  inverter: {
    type: 'inverter',
    name: 'Inverter Node',
    icon: '⊘',
    color: 'text-red-400',
    tagline: 'Reverses active and inactive.',
    howItWorks: 'An Inverter Node flips the state of any connected node when it receives a signal. If a neighbour is active, the Inverter makes it inactive. If it is inactive, the Inverter makes it active. This creates powerful chain reactions.',
    tip: 'Inverters can "turn off" nodes you don\'t need active, creating precise control over the signal flow.',
    example: 'Active node ← ⊘ receives signal → node becomes inactive.',
    introducedIn: 'World 6: Inversion',
  },
  gate_and: {
    type: 'gate_and',
    name: 'AND Gate',
    icon: '∧',
    color: 'text-cyan-400',
    tagline: 'Requires ALL inputs to activate.',
    howItWorks: 'An AND Gate only becomes active and passes a signal when it receives signals from ALL of its required input directions simultaneously. If even one input is missing, the gate stays closed.',
    tip: 'AND Gates force you to solve multiple sub-paths first. Make sure all feeding nodes are active before the gate will open.',
    example: '∧ needs signals from both West AND North to activate.',
    introducedIn: 'World 7: Logic',
  },
  gate_or: {
    type: 'gate_or',
    name: 'OR Gate',
    icon: '∨',
    color: 'text-teal-400',
    tagline: 'Activates on ANY single input.',
    howItWorks: 'An OR Gate activates and passes its signal when it receives at least ONE input signal from any of its connected directions. Multiple inputs just reinforce it — one is enough.',
    tip: 'OR Gates give you flexibility. You only need to power one of the input paths.',
    example: '∨ activates if it receives a signal from West OR North (or both).',
    introducedIn: 'World 7: Logic',
  },
  locked: {
    type: 'locked',
    name: 'Locked Node',
    icon: '🔒',
    color: 'text-white/40',
    tagline: 'Cannot be interacted with.',
    howItWorks: 'A Locked Node is permanently fixed — you cannot tap it and signals cannot pass through it. It acts as an obstacle that forces you to route signals around it.',
    tip: 'Locked Nodes define the shape and difficulty of the puzzle. They create barriers that make certain direct paths impossible.',
    example: 'A Locked Node blocks the direct East path — you must route North then East.',
    introducedIn: 'Mixed Worlds',
  },
  timed: {
    type: 'timed',
    name: 'Timed Node',
    icon: '⏱',
    color: 'text-yellow-400',
    tagline: 'Stays active for a limited time.',
    howItWorks: 'A Timed Node activates when it receives a signal but automatically deactivates after a set number of moves. You must complete the puzzle before time runs out on any Timed Nodes in your chain.',
    tip: 'Activate Timed Nodes last, or plan to complete the puzzle in fewer moves than the timer.',
    example: 'Timed Node (3 moves): activate it, then complete the puzzle within 3 moves.',
    introducedIn: 'Elite Campaign',
  },
  bridge: {
    type: 'bridge',
    name: 'Bridge Node',
    icon: '⟷',
    color: 'text-indigo-400',
    tagline: 'Carries two signals that cross without mixing.',
    howItWorks: 'A Bridge Node allows two separate signals to cross through the same node without interfering. A horizontal signal passes through East-West and a vertical signal passes North-South — independently.',
    tip: 'Use Bridge Nodes to cross signal paths that would otherwise block each other.',
    example: 'East signal passes E→W, North signal passes N→S — neither affects the other.',
    introducedIn: 'Elite Campaign',
  },
}

export function getNodeGuide(type: NodeType): NodeGuide {
  return NODE_GUIDES[type] ?? NODE_GUIDES.basic
}
