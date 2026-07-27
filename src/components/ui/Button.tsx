import { motion, type HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { playSound } from '@/lib/audio'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-accent)] text-white shadow-[0_8px_24px_rgba(59,130,246,0.35)] hover:brightness-110',
  secondary:
    'bg-[var(--color-surface-strong)] text-[var(--color-text)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]',
  ghost: 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]',
  danger: 'bg-[rgba(248,113,113,0.15)] text-[var(--color-danger)] border border-[rgba(248,113,113,0.25)]',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm rounded-xl',
  md: 'h-11 px-5 text-sm rounded-2xl',
  lg: 'h-13 px-7 text-base rounded-2xl',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-colors focus-ring disabled:opacity-40 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      onClick={(e) => {
        playSound('ui')
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
