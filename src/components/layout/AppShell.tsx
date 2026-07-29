import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useEffect } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { usePlayerStore } from '@/stores/playerStore'
import { AchievementToast } from '@/components/AchievementToast'

const NAV = [
  { to: '/', label: 'Home', icon: '◈' },
  { to: '/campaign', label: 'Campaign', icon: '◎' },
  { to: '/daily', label: 'Daily', icon: '✦' },
  { to: '/ranked', label: 'Ranked', icon: '⬡' },
  { to: '/profile', label: 'Profile', icon: '◇' },
]

export function AppShell() {
  const location = useLocation()
  const theme = useSettingsStore((s) => s.theme)
  const sparks = usePlayerStore((s) => s.sparks)
  const prisms = usePlayerStore((s) => s.prisms)
  const hideNav = location.pathname.startsWith('/play')

  useEffect(() => {
    const root = document.documentElement
    const preferLight =
      theme === 'light' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches)
    root.classList.toggle('light', preferLight)
  }, [theme])

  return (
    <div className="bg-app relative min-h-dvh text-[var(--color-text)]">
      <AchievementToast />
      {!hideNav && (
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 pb-2 pt-6">
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-medium tracking-[0.28em]">SYNAPSE</span>
            <span className="hidden text-xs text-faint sm:inline">Every Move Changes Everything</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted">
              <span className="text-[var(--color-accent)]">✦</span>
              <span>{sparks}</span>
              <span className="text-faint">Sparks</span>
            </div>
            <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted">
              <span className="text-[var(--color-secondary)]">◆</span>
              <span>{prisms}</span>
              <span className="text-faint">Prisms</span>
            </div>
          </div>
        </header>
      )}

      <main className={clsx('mx-auto w-full max-w-6xl px-5', hideNav ? 'pb-8' : 'pb-28')}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>

      {!hideNav && (
        <nav className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="glass-strong mx-auto flex max-w-lg items-center justify-between rounded-full px-2 py-2">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'flex min-w-[64px] flex-col items-center gap-1 rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.14em] transition-colors',
                    isActive
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                  )
                }
              >
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
