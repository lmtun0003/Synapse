export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  sparks: number
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-spark',
    title: 'First Spark',
    description: 'Complete your first puzzle.',
    icon: '✦',
    sparks: 10,
  },
  {
    id: 'perfect-10',
    title: 'Precision',
    description: 'Earn 10 Perfect ratings.',
    icon: '◎',
    sparks: 50,
  },
  {
    id: 'daily-streak-7',
    title: 'Week of Light',
    description: 'Maintain a 7-day daily streak.',
    icon: '◈',
    sparks: 75,
  },
  {
    id: 'chapter-1',
    title: 'Awakened',
    description: 'Complete Chapter 1.',
    icon: '◇',
    sparks: 100,
  },
  {
    id: 'ranked-gold',
    title: 'Gold Synapse',
    description: 'Reach Gold rank in Ranked mode.',
    icon: '⬡',
    sparks: 150,
  },
  {
    id: 'creator',
    title: 'Architect',
    description: 'Publish your first community puzzle.',
    icon: '▣',
    sparks: 40,
  },
]
