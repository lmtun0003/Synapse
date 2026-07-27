import { useGameStore } from '@/store/gameStore'

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection'

const PATTERNS: Record<HapticPattern, VibratePattern> = {
  light:     10,
  medium:    25,
  heavy:     50,
  selection: [10, 30, 10],
  success:   [20, 50, 30, 50, 60],
  error:     [100, 50, 100],
}

export function useHaptics() {
  const { hapticEnabled } = useGameStore()

  const haptic = (pattern: HapticPattern = 'light') => {
    if (!hapticEnabled) return
    if (!('vibrate' in navigator)) return
    navigator.vibrate(PATTERNS[pattern])
  }

  return { haptic }
}
