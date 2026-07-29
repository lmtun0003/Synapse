import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { HomePage } from '@/pages/Home'
import { CampaignPage } from '@/pages/Campaign'
import { PlayPage } from '@/pages/Play'
import { DailyPage } from '@/pages/Daily'
import { EndlessPage } from '@/pages/Endless'
import { RankedPage } from '@/pages/Ranked'
import { DuelPage } from '@/pages/Duel'
import { CreatorPage } from '@/pages/Creator'
import { ShopPage } from '@/pages/Shop'
import { ProfilePage } from '@/pages/Profile'
import { PublicProfilePage } from '@/pages/PublicProfile'
import { LeaderboardPage } from '@/pages/Leaderboard'
import { StatsPage } from '@/pages/Stats'
import { SettingsPage } from '@/pages/Settings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'campaign', element: <CampaignPage /> },
      { path: 'daily', element: <DailyPage /> },
      { path: 'endless', element: <EndlessPage /> },
      { path: 'ranked', element: <RankedPage /> },
      { path: 'duel', element: <DuelPage /> },
      { path: 'creator', element: <CreatorPage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/public', element: <PublicProfilePage /> },
      { path: 'leaderboard', element: <LeaderboardPage /> },
      { path: 'stats', element: <StatsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'play/:mode/:levelId?', element: <PlayPage /> },
    ],
  },
])
