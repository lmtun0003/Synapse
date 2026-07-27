import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
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
import { WelcomeModal } from '@/components/ui/WelcomeModal'
import { useGameStore } from '@/store/gameStore'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/campaign" element={<CampaignPage />} />
        <Route path="/play" element={<GamePage />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/endless" element={<EndlessPage />} />
        <Route path="/ranked" element={<RankedPage />} />
        <Route path="/creator" element={<PuzzleCreatorPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/settings" element={<SettingsPage />} />
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
