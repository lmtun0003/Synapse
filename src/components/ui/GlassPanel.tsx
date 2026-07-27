import { motion, type HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'
import type { ReactNode } from 'react'

interface GlassPanelProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  strong?: boolean
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function GlassPanel({
  children,
  strong = false,
  className,
  padding = 'md',
  ...props
}: GlassPanelProps) {
  return (
    <motion.div
      className={clsx(
        strong ? 'glass-strong' : 'glass',
        'rounded-[var(--radius-panel)]',
        paddingMap[padding],
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
