import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  glow?: 'blue' | 'purple' | 'green' | 'amber' | 'none'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  border?: boolean
  animate?: boolean
  delay?: number
}

export function GlassCard({
  children,
  hover = false,
  glow = 'none',
  padding = 'md',
  rounded = '2xl',
  border = true,
  animate = false,
  delay = 0,
  className,
  ...props
}: GlassCardProps) {
  const glowMap = {
    blue: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:border-blue-500/30',
    purple: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] hover:border-purple-500/30',
    green: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:border-green-500/30',
    amber: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] hover:border-amber-500/30',
    none: '',
  }

  const paddingMap = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  }

  const roundedMap = {
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  }

  const Comp = animate ? motion.div : 'div'
  const animProps = animate
    ? {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
      }
    : {}

  return (
    <Comp
      className={clsx(
        'glass transition-all duration-300',
        paddingMap[padding],
        roundedMap[rounded],
        border ? 'border border-white/8' : '',
        hover ? `cursor-pointer ${glowMap[glow]}` : '',
        className
      )}
      {...(animate ? animProps : {})}
      {...(props as any)}
    >
      {children}
    </Comp>
  )
}
