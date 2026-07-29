import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { GameBoard } from '@/components/game/GameBoard'
import { GameHUD } from '@/components/game/GameHUD'
import { LevelCompleteModal } from '@/components/game/LevelCompleteModal'
import { InGameTutorial } from '@/components/game/InGameTutorial'
import { PuzzleRatingModal } from '@/components/game/PuzzleRatingModal'
import { useGameStore } from '@/store/gameStore'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

export function GamePage() {
  const navigate = useNavigate()
  const {
    puzzle,
    mode,
    completed,
    lastResult,
    resetPuzzle,
    undoMove,
    worlds,
    currentWorld,
    currentLevel,
    startGame,
    setCurrentLevel,
    // tutorial
    tutorialEnabled,
    hasPlayedFirstGame,
    setHasPlayedFirstGame,
    setTutorialStep,
    // community
    communityPuzzles,
    myRatings,
  } = useGameStore()

  const [showRating, setShowRating] = useState(false)

  useKeyboardShortcuts()

  // Show in-game tutorial on first play if tutorial is enabled
  const showTutorial = tutorialEnabled && !hasPlayedFirstGame && mode === 'campaign'

  // When campaign puzzle completes, check if it's a community puzzle and prompt rating
  useEffect(() => {
    if (completed && puzzle) {
      const isCommunityPuzzle = communityPuzzles.some(cp => cp.id === puzzle.id)
      const alreadyRated = !!myRatings[puzzle.id]
      if (isCommunityPuzzle && !alreadyRated) {
        // Show rating modal after a short delay (after completion animation)
        const t = setTimeout(() => setShowRating(true), 2200)
        return () => clearTimeout(t)
      }
    }
  }, [completed, puzzle, communityPuzzles, myRatings])

  // Reset tutorial step when starting a new game
  useEffect(() => {
    if (puzzle && showTutorial) {
      setTutorialStep(0)
    }
  }, [puzzle?.id])

  useEffect(() => {
    if (!puzzle) navigate('/')
  }, [puzzle, navigate])

  if (!puzzle) return null

  const handleBack = () => {
    if (mode === 'campaign') navigate('/campaign')
    else if (mode === 'daily') navigate('/daily')
    else if (mode === 'endless') navigate('/endless')
    else navigate('/')
  }

  const handleNextLevel = () => {
    if (mode !== 'campaign') { navigate('/'); return }
    const world = worlds.find(w => w.id === currentWorld)
    const nextLevel = world?.levels.find(l => l.levelNumber === currentLevel + 1)
    if (nextLevel && !nextLevel.locked) {
      setCurrentLevel(currentWorld, nextLevel.levelNumber)
      startGame(nextLevel.puzzle, 'campaign')
      if (!hasPlayedFirstGame) setHasPlayedFirstGame()
    } else {
      navigate('/campaign')
    }
  }

  const handleMenu = () => {
    if (mode === 'campaign') navigate('/campaign')
    else navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto px-4 py-5">
      {/* HUD */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <GameHUD
          puzzle={puzzle}
          onBack={handleBack}
          onReset={resetPuzzle}
          onUndo={undoMove}
          onHint={puzzle.hints && puzzle.hints.length > 0 ? () => {} : undefined}
        />
      </motion.div>

      {/* Game Board + Tutorial overlay wrapper */}
      <div className="flex-1 relative flex items-center justify-center">
        <GameBoard puzzle={puzzle} className="w-full h-full" />
        <InGameTutorial visible={showTutorial} />
      </div>

      {/* Description */}
      {puzzle.description && (
        <motion.p
          className="text-center text-white/30 text-xs mt-4 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {puzzle.description}
        </motion.p>
      )}

      {/* Level Complete Modal */}
      <AnimatePresence>
        {completed && lastResult && !showRating && (
          <LevelCompleteModal
            result={lastResult}
            puzzle={puzzle}
            onNextLevel={handleNextLevel}
            onRetry={resetPuzzle}
            onMenu={handleMenu}
          />
        )}
      </AnimatePresence>

      {/* Community Puzzle Rating Modal */}
      <AnimatePresence>
        {showRating && puzzle && (
          <PuzzleRatingModal
            puzzleId={puzzle.id}
            puzzleTitle={puzzle.title}
            onDone={() => {
              setShowRating(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
