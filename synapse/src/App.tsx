import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { HomePage } from '@/pages/HomePage'
import { CampaignPage } from '@/pages/CampaignPage'
import { GamePage } from '@/pages/GamePage'
import { DailyPage } from '@/pages/DailyPage'
import { EndlessPage } from '@/pages/EndlessPage'
import { RankedPage } from '@/pages/RankedPage'
import { PuzzleCreatorPage } from '@/pages/PuzzleCreatorPage'
import { CommunityPage } from '@/pages/CommunityPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { LeaderboardPage } from '@/pages/LeaderboardPage'
import { ShopPage } from '@/pages/ShopPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { AchievementsPage } from '@/pages/AchievementsPage'
import { RankedLeaderboardPage } from '@/pages/RankedLeaderboardPage'
import { WelcomeModal } from '@/components/ui/WelcomeModal'
import { useGameStore } from '@/store/gameStore'

/**
 * Thin animated shell wrapping every route.
 * – Fast fade-in (0.15s) so navigation feels instant.
 * – Persistent background fill (#0B0B0D) so the screen is NEVER black
 *   between route transitions, even if a page's own background is transparent.
 */
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{ background: '#0B0B0D', minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    // mode="sync" — exit and enter animations overlap so there is no gap.
    // Combined with PageShell's solid background, this eliminates black flashes.
    <AnimatePresence mode="sync">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageShell><HomePage /></PageShell>} />
        <Route path="/campaign" element={<PageShell><CampaignPage /></PageShell>} />
        <Route path="/play" element={<PageShell><GamePage /></PageShell>} />
        <Route path="/daily" element={<PageShell><DailyPage /></PageShell>} />
        <Route path="/endless" element={<PageShell><EndlessPage /></PageShell>} />
        <Route path="/ranked" element={<PageShell><RankedPage /></PageShell>} />
        <Route path="/creator" element={<PageShell><PuzzleCreatorPage /></PageShell>} />
        <Route path="/community" element={<PageShell><CommunityPage /></PageShell>} />
        <Route path="/profile" element={<PageShell><ProfilePage /></PageShell>} />
        <Route path="/leaderboard" element={<PageShell><LeaderboardPage /></PageShell>} />
        <Route path="/shop" element={<PageShell><ShopPage /></PageShell>} />
        <Route path="/settings" element={<PageShell><SettingsPage /></PageShell>} />
        <Route path="/achievements" element={<PageShell><AchievementsPage /></PageShell>} />
        <Route path="/ranked/leaderboard" element={<PageShell><RankedLeaderboardPage /></PageShell>} />
      </Routes>
    </AnimatePresence>
  )
}

function AppShell() {
  const { hasSeenWelcome, setHasSeenWelcome } = useGameStore()

  return (
    <>
      <AnimatedRoutes />
      <AnimatePresence>
        {!hasSeenWelcome && (
          <WelcomeModal onDone={setHasSeenWelcome} />
        )}
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
