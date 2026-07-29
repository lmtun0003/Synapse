import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GlassCard } from '@/components/ui/GlassCard'
import { useGameStore } from '@/store/gameStore'

interface ToggleProps {
  enabled: boolean
  onChange: () => void
  label: string
  description?: string
  icon: string
}

function Toggle({ enabled, onChange, label, description, icon }: ToggleProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/6 last:border-0">
      <span className="text-xl w-7 text-center">{icon}</span>
      <div className="flex-1">
        <div className="text-white text-sm font-medium">{label}</div>
        {description && <div className="text-white/40 text-xs">{description}</div>}
      </div>
      <button
        onClick={onChange}
        className={[
          'relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none',
          enabled ? 'bg-blue-500' : 'bg-white/15',
        ].join(' ')}
      >
        <div className={[
          'absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300',
          enabled ? 'left-6' : 'left-1',
        ].join(' ')} />
      </button>
    </div>
  )
}

export function SettingsPage() {
  const navigate = useNavigate()
  const {
    theme, sfxEnabled, musicEnabled, hapticEnabled,
    setTheme, toggleSfx, toggleMusic,
    tutorialEnabled, setTutorialEnabled,
    resetWelcome, resetFirstGame,
  } = useGameStore()

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto px-4 py-6">
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white"
        >←</button>
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </motion.div>

      {/* Audio */}
      <GlassCard padding="md" rounded="2xl" animate delay={0.05} className="mb-4">
        <h2 className="text-white/50 text-xs uppercase tracking-widest mb-3">Audio</h2>
        <Toggle icon="🔊" label="Sound Effects" description="Node activations, UI interactions" enabled={sfxEnabled} onChange={toggleSfx} />
        <Toggle icon="🎵" label="Music" description="Ambient background soundtrack" enabled={musicEnabled} onChange={toggleMusic} />
        <Toggle icon="📳" label="Haptics" description="Vibration feedback on mobile" enabled={hapticEnabled} onChange={() => {}} />
      </GlassCard>

      {/* Display */}
      <GlassCard padding="md" rounded="2xl" animate delay={0.1} className="mb-4">
        <h2 className="text-white/50 text-xs uppercase tracking-widest mb-3">Display</h2>
        <div className="flex items-center gap-3 py-3 border-b border-white/6">
          <span className="text-xl w-7 text-center">🎨</span>
          <div className="flex-1">
            <div className="text-white text-sm font-medium">Theme</div>
            <div className="text-white/40 text-xs">Choose your visual style</div>
          </div>
          <div className="flex gap-2">
            {(['dark', 'light'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                  theme === t ? 'bg-blue-500 text-white' : 'glass text-white/50 hover:text-white',
                ].join(' ')}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <Toggle icon="⚡" label="High Performance" description="60 FPS cap to save battery" enabled={true} onChange={() => {}} />
        <Toggle icon="♿" label="Reduce Motion" description="Minimize animations for accessibility" enabled={false} onChange={() => {}} />
        <Toggle icon="🔍" label="Large Text" description="Increase font sizes throughout" enabled={false} onChange={() => {}} />
      </GlassCard>

      {/* Gameplay */}
      <GlassCard padding="md" rounded="2xl" animate delay={0.15} className="mb-4">
        <h2 className="text-white/50 text-xs uppercase tracking-widest mb-3">Gameplay</h2>
        <Toggle
          icon="🎓"
          label="Tutorial"
          description="Show step-by-step hints on first play"
          enabled={tutorialEnabled}
          onChange={() => {
            const next = !tutorialEnabled
            setTutorialEnabled(next)
            if (next) resetFirstGame()
          }}
        />
        <Toggle icon="💡" label="Show Hints" description="Display move hints when stuck" enabled={true} onChange={() => {}} />
        <Toggle icon="🔢" label="Show Move Count" description="Track your moves during play" enabled={true} onChange={() => {}} />
        <Toggle icon="⏱" label="Show Timer" description="Display elapsed time" enabled={true} onChange={() => {}} />
        <Toggle icon="↩" label="Confirm Undo" description="Ask before undoing moves" enabled={false} onChange={() => {}} />
      </GlassCard>

      {/* Onboarding */}
      <GlassCard padding="md" rounded="2xl" animate delay={0.18} className="mb-4">
        <h2 className="text-white/50 text-xs uppercase tracking-widest mb-3">Onboarding</h2>
        <div className="flex flex-col gap-1">
          <button
            className="flex items-center gap-3 py-2.5 text-left hover:bg-white/4 rounded-xl px-2 transition-colors"
            onClick={resetWelcome}
          >
            <span className="text-xl w-7 text-center">👋</span>
            <div className="flex-1">
              <span className="text-white/70 text-sm">Re-enable Welcome Screen</span>
              <div className="text-white/30 text-xs">Show the tutorial prompt on next launch</div>
            </div>
          </button>
        </div>
      </GlassCard>

      {/* Notifications */}
      <GlassCard padding="md" rounded="2xl" animate delay={0.2} className="mb-4">
        <h2 className="text-white/50 text-xs uppercase tracking-widest mb-3">Notifications</h2>
        <Toggle icon="📅" label="Daily Puzzle" description="Reminder for daily puzzle" enabled={true} onChange={() => {}} />
        <Toggle icon="🔔" label="Streak Reminders" description="Alerts to maintain your streak" enabled={true} onChange={() => {}} />
        <Toggle icon="🏆" label="Rank Changes" description="Notifications when rank changes" enabled={true} onChange={() => {}} />
      </GlassCard>

      {/* Account */}
      <GlassCard padding="md" rounded="2xl" animate delay={0.25} className="mb-4">
        <h2 className="text-white/50 text-xs uppercase tracking-widest mb-3">Account</h2>
        <div className="flex flex-col gap-2">
          {[
            { icon: '☁️', label: 'Sign In / Create Account', action: () => {} },
            { icon: '🔄', label: 'Sync Progress', action: () => {} },
            { icon: '📱', label: 'Linked Devices', action: () => {} },
            { icon: '🔒', label: 'Privacy Settings', action: () => {} },
          ].map(item => (
            <button
              key={item.label}
              className="flex items-center gap-3 py-2.5 text-left hover:bg-white/4 rounded-xl px-2 transition-colors"
              onClick={item.action}
            >
              <span className="text-xl w-7 text-center">{item.icon}</span>
              <span className="text-white/70 text-sm flex-1">{item.label}</span>
              <span className="text-white/25">›</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* About */}
      <GlassCard padding="md" rounded="2xl" animate delay={0.3}>
        <h2 className="text-white/50 text-xs uppercase tracking-widest mb-3">About</h2>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Version', value: '1.0.0' },
            { label: 'Privacy Policy', value: '›' },
            { label: 'Terms of Service', value: '›' },
            { label: 'Credits', value: '›' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <span className="text-white/50 text-sm">{item.label}</span>
              <span className="text-white/30 text-sm">{item.value}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
