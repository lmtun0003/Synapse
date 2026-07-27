import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface ProgressBarProps {
  value: number    // 0–100
  max?: number
  color?: 'blue' | 'purple' | 'green' | 'amber' | 'gradient'
  height?: 'xs' | 'sm' | 'md'
  animated?: boolean
  glow?: boolean
  className?: string
  label?: string
}

export function ProgressBar({
  value,
  max = 100,
  color = 'blue',
  height = 'sm',
  animated = true,
  glow = false,
  className,
  label,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  const trackColors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    gradient: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
  }

  const glowMap = {
    blue: 'shadow-[0_0_8px_rgba(59,130,246,0.6)]',
    purple: 'shadow-[0_0_8px_rgba(139,92,246,0.6)]',
    green: 'shadow-[0_0_8px_rgba(16,185,129,0.6)]',
    amber: 'shadow-[0_0_8px_rgba(245,158,11,0.6)]',
    gradient: 'shadow-[0_0_8px_rgba(139,92,246,0.4)]',
  }

  const heights = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5',
  }

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-white/50">{label}</span>
          <span className="text-xs text-white/50">{Math.round(pct)}%</span>
        </div>
      )}
      <div className={clsx('w-full rounded-full overflow-hidden', heights[height], 'bg-white/8')}>
        <motion.div
          className={clsx(
            'h-full rounded-full',
            trackColors[color],
            glow ? glowMap[color] : ''
          )}
          initial={animated ? { width: 0 } : { width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}
