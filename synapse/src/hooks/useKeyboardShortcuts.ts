import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'

export function useKeyboardShortcuts() {
  const { undoMove, resetPuzzle, puzzle } = useGameStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!puzzle) return

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undoMove()
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault()
        resetPuzzle()
        return
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [puzzle, undoMove, resetPuzzle])
}
