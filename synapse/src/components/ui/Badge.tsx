import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'gold' | 'silver' | 'bronze'
  size?: 'xs' | 'sm' | 'md'
  glow?: boolean
  className?: string
}

export function Badge({ children, variant = 'default', size = 'sm', glow, className }: BadgeProps) {
  const variants = {
    default: 'bg-white/8 text-white/60 border-white/10',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
    green: 'bg-green-500/15 text-green-400 border-green-500/25',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    red: 'bg-red-500/15 text-red-400 border-red-500/25',
    gold: 'bg-gradient-to-r from-amber-500/20 to-yellow-400/20 text-amber-300 border-amber-400/30',
    silver: 'bg-slate-400/15 text-slate-300 border-slate-400/25',
    bronze: 'bg-orange-700/15 text-orange-400 border-orange-600/25',
  }

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px] rounded-md',
    sm: 'px-2.5 py-1 text-xs rounded-lg',
    md: 'px-3 py-1.5 text-sm rounded-xl',
  }

  const glowMap = {
    default: '',
    blue: glow ? 'shadow-[0_0_8px_rgba(59,130,246,0.3)]' : '',
    purple: glow ? 'shadow-[0_0_8px_rgba(139,92,246,0.3)]' : '',
    green: glow ? 'shadow-[0_0_8px_rgba(16,185,129,0.3)]' : '',
    amber: glow ? 'shadow-[0_0_8px_rgba(245,158,11,0.3)]' : '',
    red: glow ? 'shadow-[0_0_8px_rgba(239,68,68,0.3)]' : '',
    gold: glow ? 'shadow-[0_0_12px_rgba(245,158,11,0.4)]' : '',
    silver: glow ? 'shadow-[0_0_8px_rgba(148,163,184,0.3)]' : '',
    bronze: glow ? 'shadow-[0_0_8px_rgba(205,127,50,0.3)]' : '',
  }

  return (
    <span className={clsx(
      'inline-flex items-center gap-1 font-medium border tracking-wide',
      variants[variant],
      sizes[size],
      glowMap[variant],
      className
    )}>
      {children}
    </span>
  )
}

interface RatingBadgeProps {
  rating: 'perfect' | 'gold' | 'silver' | 'bronze' | 'none'
  size?: 'xs' | 'sm' | 'md'
  showIcon?: boolean
}

export function RatingBadge({ rating, size = 'sm', showIcon = true }: RatingBadgeProps) {
  const config = {
    perfect: { variant: 'blue' as const, label: 'Perfect', icon: '⚡' },
    gold: { variant: 'gold' as const, label: 'Gold', icon: '🥇' },
    silver: { variant: 'silver' as const, label: 'Silver', icon: '🥈' },
    bronze: { variant: 'bronze' as const, label: 'Bronze', icon: '🥉' },
    none: { variant: 'default' as const, label: 'None', icon: '' },
  }
  const { variant, label, icon } = config[rating]
  return (
    <Badge variant={variant} size={size} glow={rating !== 'none'}>
      {showIcon && icon} {label}
    </Badge>
  )
}
