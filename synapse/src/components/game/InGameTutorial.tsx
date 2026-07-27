import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'

interface TutorialStep {
  icon: string
  title: string
  body: string
  position: 'top' | 'bottom'
}

const STEPS: TutorialStep[] = [
  {
    icon: '◉',
    title: 'Source Node',
    body: 'The blue node is your signal source. It\'s always active and broadcasts in all connected directions.',
    position: 'bottom',
  },
  {
    icon: '◎',
    title: 'Target Node',
    body: 'Activate every green target node to solve the puzzle. They light up when a signal reaches them.',
    position: 'bottom',
  },
  {
    icon: '○',
    title: 'Basic Nodes',
    body: 'Tap any node to activate it. An activated node passes the signal along to its neighbours.',
    position: 'bottom',
  },
  {
    icon: '↩',
    title: 'Fewer Moves = Better Rating',
    body: 'Solve in as few taps as possible. Hit the Perfect target to earn the ⚡ Perfect rating.',
    position: 'top',
  },
  {
    icon: '✓',
    title: "You're ready!",
    body: 'Tap a node to begin. Use ↩ to undo or Reset to start over. Good luck!',
    position: 'top',
  },
]

interface InGameTutorialProps {
  visible: boolean
}

export function InGameTutorial({ visible }: InGameTutorialProps) {
  const {
    currentTutorialStep,
    setTutorialStep,
    setHasPlayedFirstGame,
    dismissTutorial,
  } = useGameStore()

  const step = STEPS[currentTutorialStep]
  const isLast = currentTutorialStep >= STEPS.length - 1
  const progress = ((currentTutorialStep + 1) / STEPS.length) * 100

  const handleNext = () => {
    if (isLast) {
      setHasPlayedFirstGame()
      dismissTutorial()
    } else {
      setTutorialStep(currentTutorialStep + 1)
    }
  }

  return (
    <AnimatePresence>
      {visible && step && (
        <motion.div
          key={currentTutorialStep}
          className={`absolute left-0 right-0 z-40 px-3 pointer-events-none ${
            step.position === 'bottom' ? 'bottom-0' : 'top-0'
          }`}
          initial={{ opacity: 0, y: step.position === 'bottom' ? 16 : -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: step.position === 'bottom' ? 16 : -16 }}
          transition={{ type: 'spring', stiffness: 360, damping: 30 }}
        >
          <div
            className="pointer-events-auto rounded-2xl border border-white/12 overflow-hidden"
            style={{
              background: 'rgba(11,11,13,0.92)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 0 40px rgba(0,0,0,0.6)',
            }}
          >
            {/* Progress bar */}
            <div className="h-0.5 bg-white/8">
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: `${(currentTutorialStep / STEPS.length) * 100}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>

            <div className="px-4 py-4">
              {/* Step indicator + dismiss */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 text-base">{step.icon}</span>
                  <div className="flex gap-1">
                    {STEPS.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          i <= currentTutorialStep
                            ? 'w-4 bg-blue-400'
                            : 'w-1.5 bg-white/15'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={dismissTutorial}
                  className="text-white/25 hover:text-white/60 transition-colors text-xs px-2 py-1 rounded-lg hover:bg-white/6"
                >
                  Skip all
                </button>
              </div>

              {/* Content */}
              <h3 className="text-white font-semibold text-sm mb-1">{step.title}</h3>
              <p className="text-white/50 text-xs leading-relaxed mb-4">{step.body}</p>

              {/* Action */}
              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 active:bg-white/16 rounded-xl py-2.5 text-white text-sm font-medium transition-colors"
              >
                {isLast ? '▶ Start Playing' : 'Next →'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
