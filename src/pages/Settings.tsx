import { GlassPanel } from '@/components/ui/GlassPanel'
import { useSettingsStore, type ThemeMode } from '@/stores/settingsStore'

export function SettingsPage() {
  const settings = useSettingsStore()

  return (
    <div className="py-6">
      <p className="text-xs uppercase tracking-[0.3em] text-faint">Settings</p>
      <h1 className="mt-2 text-3xl font-light tracking-tight">Preferences</h1>

      <div className="mt-8 space-y-4">
        <GlassPanel>
          <p className="text-sm font-medium">Appearance</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(['dark', 'light', 'system'] as ThemeMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => settings.setTheme(mode)}
                className="rounded-full px-4 py-2 text-sm capitalize"
                style={{
                  background:
                    settings.theme === mode ? 'var(--color-accent-soft)' : 'var(--color-surface)',
                  color: settings.theme === mode ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel>
          <Toggle
            label="Sound effects"
            checked={settings.soundEnabled}
            onChange={settings.setSoundEnabled}
          />
          <Toggle
            label="Ambient music"
            checked={settings.musicEnabled}
            onChange={settings.setMusicEnabled}
          />
          <label className="mt-4 block text-sm text-muted">
            Volume
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.volume}
              onChange={(e) => settings.setVolume(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--color-accent)]"
            />
          </label>
        </GlassPanel>

        <GlassPanel>
          <Toggle
            label="Haptics"
            checked={settings.hapticsEnabled}
            onChange={settings.setHapticsEnabled}
          />
          <Toggle
            label="Reduce motion"
            checked={settings.reduceMotion}
            onChange={settings.setReduceMotion}
          />
          <Toggle
            label="Colour-blind assist"
            checked={settings.colorBlindMode}
            onChange={settings.setColorBlindMode}
          />
        </GlassPanel>

        <GlassPanel>
          <p className="text-sm font-medium">Controls</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Click / tap — activate node</li>
            <li>Ctrl/⌘Z — undo</li>
            <li>R — reset board</li>
            <li>Esc — exit puzzle</li>
            <li>Controller — face buttons map to confirm / undo (native shells)</li>
          </ul>
        </GlassPanel>
      </div>
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between py-3 text-left"
      onClick={() => onChange(!checked)}
    >
      <span className="text-sm">{label}</span>
      <span
        className="relative h-6 w-11 rounded-full transition-colors"
        style={{
          background: checked ? 'var(--color-accent)' : 'var(--color-surface-strong)',
        }}
      >
        <span
          className="absolute top-1 h-4 w-4 rounded-full bg-white transition-all"
          style={{ left: checked ? 22 : 4 }}
        />
      </span>
    </button>
  )
}
