// ─── Avatar Definitions ──────────────────────────────────────────────────────
// 10 unique generated avatar icons, each with a name, SVG path data,
// color scheme, and unlock condition.

export interface AvatarDef {
  id: string
  name: string
  description: string
  colors: { bg: string; primary: string; secondary: string; glow: string }
  unlockCondition: string
  unlockValue?: number   // levels solved / elo / etc.
  free: boolean          // available from the start
}

export const AVATARS: AvatarDef[] = [
  {
    id: 'nebula',
    name: 'Nebula',
    description: 'A swirling cosmic cloud of electric blue and violet.',
    colors: { bg: '#0D1B3E', primary: '#3B82F6', secondary: '#8B5CF6', glow: 'rgba(59,130,246,0.6)' },
    unlockCondition: 'Default',
    free: true,
  },
  {
    id: 'circuit',
    name: 'Circuit',
    description: 'The precise geometry of a master engineer.',
    colors: { bg: '#0D2318', primary: '#10B981', secondary: '#6EE7B7', glow: 'rgba(16,185,129,0.6)' },
    unlockCondition: 'Solve 10 levels',
    unlockValue: 10,
    free: false,
  },
  {
    id: 'prism',
    name: 'Prism',
    description: 'Light fractured into infinite spectrum.',
    colors: { bg: '#1E1228', primary: '#EC4899', secondary: '#F59E0B', glow: 'rgba(236,72,153,0.6)' },
    unlockCondition: 'Achieve 5 Perfect ratings',
    unlockValue: 5,
    free: false,
  },
  {
    id: 'void',
    name: 'Void',
    description: 'Darkness with a single point of light.',
    colors: { bg: '#070708', primary: '#6366F1', secondary: '#A5B4FC', glow: 'rgba(99,102,241,0.6)' },
    unlockCondition: 'Reach Gold rank',
    free: false,
  },
  {
    id: 'inferno',
    name: 'Inferno',
    description: 'Raw heat and relentless pressure.',
    colors: { bg: '#2D0A00', primary: '#EF4444', secondary: '#F97316', glow: 'rgba(239,68,68,0.6)' },
    unlockCondition: 'Reach Platinum rank',
    free: false,
  },
  {
    id: 'quantum',
    name: 'Quantum',
    description: 'Exists in all states simultaneously.',
    colors: { bg: '#012030', primary: '#06B6D4', secondary: '#67E8F9', glow: 'rgba(6,182,212,0.6)' },
    unlockCondition: 'Solve 50 levels',
    unlockValue: 50,
    free: false,
  },
  {
    id: 'storm',
    name: 'Storm',
    description: 'Calm at the eye, chaos at the edge.',
    colors: { bg: '#111827', primary: '#94A3B8', secondary: '#E2E8F0', glow: 'rgba(148,163,184,0.5)' },
    unlockCondition: '7-day streak',
    unlockValue: 7,
    free: false,
  },
  {
    id: 'zenith',
    name: 'Zenith',
    description: 'The apex. Nowhere higher to climb.',
    colors: { bg: '#1C1300', primary: '#F59E0B', secondary: '#FCD34D', glow: 'rgba(245,158,11,0.6)' },
    unlockCondition: 'Reach Diamond rank',
    free: false,
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Northern lights woven into an identity.',
    colors: { bg: '#0A1628', primary: '#A78BFA', secondary: '#34D399', glow: 'rgba(167,139,250,0.6)' },
    unlockCondition: 'Complete World 5',
    free: false,
  },
  {
    id: 'nexus',
    name: 'Nexus',
    description: 'The convergence point of all signals.',
    colors: { bg: '#0C0C0E', primary: '#F1F5F9', secondary: '#CBD5E1', glow: 'rgba(241,245,249,0.4)' },
    unlockCondition: 'Complete Elite Campaign',
    free: false,
  },
]

// ─── Avatar Borders ───────────────────────────────────────────────────────────

export interface BorderDef {
  id: string
  name: string
  description: string
  style: 'none' | 'solid' | 'gradient' | 'animated' | 'fire' | 'pulse' | 'rainbow'
  colors?: string[]
  unlockCondition: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  free: boolean
}

export const BORDERS: BorderDef[] = [
  {
    id: 'none',
    name: 'Borderless',
    description: 'Clean. No border.',
    style: 'none',
    unlockCondition: 'Default',
    rarity: 'common',
    free: true,
  },
  {
    id: 'blue_solid',
    name: 'Signal Blue',
    description: 'A steady electric blue frame.',
    style: 'solid',
    colors: ['#3B82F6'],
    unlockCondition: 'Solve 5 levels',
    rarity: 'common',
    free: false,
  },
  {
    id: 'green_solid',
    name: 'Node Green',
    description: 'Crisp target-node green.',
    style: 'solid',
    colors: ['#10B981'],
    unlockCondition: 'Complete World 1',
    rarity: 'common',
    free: false,
  },
  {
    id: 'purple_gradient',
    name: 'Deep Space',
    description: 'Blue-to-purple gradient border.',
    style: 'gradient',
    colors: ['#3B82F6', '#8B5CF6'],
    unlockCondition: 'Complete World 2',
    rarity: 'uncommon',
    free: false,
  },
  {
    id: 'gold_gradient',
    name: 'Gold Rush',
    description: 'Warm amber-to-gold shimmer.',
    style: 'gradient',
    colors: ['#F59E0B', '#FCD34D'],
    unlockCondition: 'Get 10 Gold ratings',
    rarity: 'uncommon',
    free: false,
  },
  {
    id: 'cyan_pulse',
    name: 'Quantum Pulse',
    description: 'Cyan border that slowly breathes.',
    style: 'pulse',
    colors: ['#06B6D4'],
    unlockCondition: 'Reach Platinum rank',
    rarity: 'rare',
    free: false,
  },
  {
    id: 'rainbow',
    name: 'Spectrum',
    description: 'Continuously cycling rainbow.',
    style: 'rainbow',
    colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'],
    unlockCondition: 'Complete all 5 Worlds',
    rarity: 'rare',
    free: false,
  },
  {
    id: 'diamond_animated',
    name: 'Diamond Edge',
    description: 'Animated prismatic diamond shimmer.',
    style: 'animated',
    colors: ['#93C5FD', '#C4B5FD', '#86EFAC', '#FDE68A'],
    unlockCondition: 'Reach Diamond rank',
    rarity: 'epic',
    free: false,
  },
  {
    id: 'synapse_glow',
    name: 'Synapse Aura',
    description: 'Deep blue-white aura that radiates outward.',
    style: 'animated',
    colors: ['#3B82F6', '#FFFFFF'],
    unlockCondition: 'Reach Master rank',
    rarity: 'epic',
    free: false,
  },
  {
    id: 'fire',
    name: 'Eternal Fire',
    description: 'Animated fire border — earned by conquering the Elite.',
    style: 'fire',
    colors: ['#EF4444', '#F97316', '#FCD34D'],
    unlockCondition: 'Complete Elite Campaign',
    rarity: 'legendary',
    free: false,
  },
]

export const RARITY_CONFIG = {
  common:    { label: 'Common',    color: 'text-white/50',  bg: 'bg-white/5',      border: 'border-white/10' },
  uncommon:  { label: 'Uncommon',  color: 'text-green-400', bg: 'bg-green-500/8',  border: 'border-green-500/20' },
  rare:      { label: 'Rare',      color: 'text-blue-400',  bg: 'bg-blue-500/8',   border: 'border-blue-500/20' },
  epic:      { label: 'Epic',      color: 'text-purple-400',bg: 'bg-purple-500/8', border: 'border-purple-500/20' },
  legendary: { label: 'Legendary', color: 'text-amber-400', bg: 'bg-amber-500/8',  border: 'border-amber-500/25' },
}
