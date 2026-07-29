import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: ReactNode
  iconRight?: ReactNode
  loading?: boolean
  glow?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading,
  glow,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'relative inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50'

  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white rounded-xl',
    secondary: 'glass border border-white/10 hover:bg-white/10 text-white rounded-xl',
    ghost: 'hover:bg-white/8 text-white/70 hover:text-white rounded-xl',
    danger: 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-xl',
    gold: 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black rounded-xl font-semibold',
  }

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-7 text-base',
    xl: 'h-14 px-10 text-lg',
  }

  const glowClasses = glow ? {
    primary: 'shadow-[0_0_24px_rgba(59,130,246,0.5)]',
    secondary: '',
    ghost: '',
    danger: '',
    gold: 'shadow-[0_0_24px_rgba(245,158,11,0.5)]',
  }[variant] : ''

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={clsx(base, variants[variant], sizes[size], glowClasses, {
        'opacity-40 cursor-not-allowed': disabled || loading,
        'cursor-pointer': !disabled && !loading,
      }, className)}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
      {!loading && iconRight}
    </motion.button>
  )
}
