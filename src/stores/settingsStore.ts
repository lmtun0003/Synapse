import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setAudioEnabled, setAudioVolume } from '@/lib/audio'

export type ThemeMode = 'dark' | 'light' | 'system'

interface SettingsState {
  theme: ThemeMode
  soundEnabled: boolean
  musicEnabled: boolean
  volume: number
  hapticsEnabled: boolean
  reduceMotion: boolean
  colorBlindMode: boolean
  setTheme: (theme: ThemeMode) => void
  setSoundEnabled: (v: boolean) => void
  setMusicEnabled: (v: boolean) => void
  setVolume: (v: number) => void
  setHapticsEnabled: (v: boolean) => void
  setReduceMotion: (v: boolean) => void
  setColorBlindMode: (v: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      soundEnabled: true,
      musicEnabled: true,
      volume: 0.45,
      hapticsEnabled: true,
      reduceMotion: false,
      colorBlindMode: false,
      setTheme: (theme) => set({ theme }),
      setSoundEnabled: (soundEnabled) => {
        setAudioEnabled(soundEnabled)
        set({ soundEnabled })
      },
      setMusicEnabled: (musicEnabled) => set({ musicEnabled }),
      setVolume: (volume) => {
        setAudioVolume(volume)
        set({ volume })
      },
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setColorBlindMode: (colorBlindMode) => set({ colorBlindMode }),
    }),
    { name: 'synapse.settings.v1' },
  ),
)
