import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageWrapperProps {
  children: ReactNode
  className?: string
}

/**
 * Wraps every page with a consistent background fill and smooth
 * enter/exit animation. Prevents the black flash that occurs when
 * AnimatePresence transitions between routes.
 */
export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <motion.div
      className={`min-h-screen w-full ${className}`}
      style={{ background: 'var(--bg-primary, #0B0B0D)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
