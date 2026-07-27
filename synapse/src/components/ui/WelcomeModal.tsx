import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/store/gameStore'

interface WelcomeModalProps {
  onDone: () => void
}

export function WelcomeModal({ onDone }: WelcomeModalProps) {
  const { setHasSeenWelcome, setTutorialEnabled } = useGameStore()

  const handleYes = () => {
    setTutorialEnabled(true)
    setHasSeenWelcome()
    onDone()
  }

  const handleSkip = () => {
    setTutorialEnabled(false)
    setHasSeenWelcome()
    onDone()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
    >
      <motion.div
        className="w-full max-w-xs"
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 12 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.05 }}
      >
        {/* Logo mark */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
        >
          <div className="relative w-20 h-20">
            {/* Animated ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-500/30"
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)]">
              <span className="text-white text-2xl font-bold">⚡</span>
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          className="text-center mb-7"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h1 className="text-white text-2xl font-bold tracking-tight mb-1.5">
            Welcome to SYNAPSE
          </h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Every move changes everything.
          </p>
          <p className="text-white/35 text-sm mt-3 leading-relaxed">
            Would you like a quick tutorial to learn the basics?
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-col gap-2.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleYes}
            glow
          >
            Show me how to play
          </Button>
          <Button
            variant="ghost"
            size="md"
            className="w-full text-white/40"
            onClick={handleSkip}
          >
            Skip — I know what I'm doing
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
