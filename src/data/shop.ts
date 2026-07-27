export type Currency = 'sparks' | 'prisms'

export interface ShopItem {
  id: string
  name: string
  description: string
  category: 'theme' | 'board' | 'icon' | 'animation' | 'effect' | 'pack'
  currency: Currency
  price: number
  premium?: boolean
  seasonal?: boolean
}

export const SHOP_CATALOG: ShopItem[] = [
  {
    id: 'theme-midnight',
    name: 'Midnight Glass',
    description: 'Deep charcoal panels with soft blue refraction.',
    category: 'theme',
    currency: 'sparks',
    price: 200,
  },
  {
    id: 'theme-aurora',
    name: 'Aurora',
    description: 'Cool dawn gradients across the board plane.',
    category: 'theme',
    currency: 'sparks',
    price: 350,
  },
  {
    id: 'board-ion',
    name: 'Ion Lattice',
    description: 'Animated edge filaments for every node.',
    category: 'board',
    currency: 'prisms',
    price: 5,
    premium: true,
  },
  {
    id: 'anim-nova',
    name: 'Nova Burst',
    description: 'Victory particles that bloom outward.',
    category: 'animation',
    currency: 'sparks',
    price: 150,
  },
  {
    id: 'icon-prism',
    name: 'Prism Avatar',
    description: 'A crystalline profile mark.',
    category: 'icon',
    currency: 'prisms',
    price: 3,
    premium: true,
  },
  {
    id: 'pack-reflections',
    name: 'Reflections Pack',
    description: '12 handcrafted mirror puzzles.',
    category: 'pack',
    currency: 'sparks',
    price: 500,
  },
  {
    id: 'effect-halo',
    name: 'Halo Border',
    description: 'Soft luminous profile border.',
    category: 'effect',
    currency: 'prisms',
    price: 8,
    premium: true,
    seasonal: true,
  },
]

export const BATTLE_PASS = {
  season: 1,
  name: 'Season of Signals',
  durationDays: 60,
  levels: 100,
  description: 'Cosmetic-only rewards. No gameplay advantages.',
}
