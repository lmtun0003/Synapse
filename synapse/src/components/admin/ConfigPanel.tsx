import { useGameStore } from '@/store/gameStore'
import { CONFIG_SECTIONS, CONFIG_FIELD_META } from '@/data/gameConfig'
import { AdminToggle, AdminCard } from './AdminShared'
import type { GameConfig } from '@/data/gameConfig'
import { DEFAULT_GAME_CONFIG } from '@/data/gameConfig'

function NumberField({ fieldKey, config, onChange }: {
  fieldKey: keyof GameConfig
  config: GameConfig
  onChange: (key: keyof GameConfig, val: number | boolean) => void
}) {
  const meta = CONFIG_FIELD_META[fieldKey]
  if (meta.type !== 'number') return null

  const value = config[fieldKey] as number

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
      <div className="flex-1">
        <div className="text-white/70 text-sm">{meta.label}</div>
        {meta.description && <div className="text-white/30 text-xs mt-0.5">{meta.description}</div>}
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(fieldKey, Math.max(meta.min ?? 0, value - (meta.step ?? 1)))}
          className="w-6 h-6 rounded-lg bg-white/6 hover:bg-white/12 text-white/50 hover:text-white text-xs transition-all flex items-center justify-center"
        >−</button>
        <input
          type="number"
          value={value}
          min={meta.min}
          max={meta.max}
          step={meta.step ?? 1}
          onChange={e => onChange(fieldKey, Number(e.target.value))}
          className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white text-center focus:outline-none focus:border-blue-500/40"
        />
        <button
          onClick={() => onChange(fieldKey, Math.min(meta.max ?? 99999, value + (meta.step ?? 1)))}
          className="w-6 h-6 rounded-lg bg-white/6 hover:bg-white/12 text-white/50 hover:text-white text-xs transition-all flex items-center justify-center"
        >+</button>
      </div>
    </div>
  )
}

export function ConfigPanel() {
  const { gameConfig, setGameConfig } = useGameStore()

  const handleChange = (key: keyof GameConfig, val: number | boolean) => {
    setGameConfig({ [key]: val })
  }

  const resetToDefaults = () => {
    setGameConfig(DEFAULT_GAME_CONFIG)
  }

  // Separate boolean fields for each section
  const boolFields = Object.entries(CONFIG_FIELD_META)
    .filter(([, m]) => m.type === 'boolean')
    .map(([k]) => k as keyof GameConfig)

  return (
    <div>
      {/* Maintenance mode banner */}
      {gameConfig.maintenanceMode && (
        <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-4 mb-5 flex items-center gap-3">
          <span className="text-red-400 text-xl">⚠️</span>
          <div>
            <div className="text-red-300 font-semibold text-sm">Maintenance Mode Active</div>
            <div className="text-red-400/60 text-xs">All users see the maintenance screen. Disable below.</div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <AdminCard title="Quick Actions" className="mb-5">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setGameConfig({ xpMultiplier: 2, sparkMultiplier: 2 })}
            className="px-3 py-2 rounded-xl text-xs text-green-400 border border-green-500/20 bg-green-500/8 hover:bg-green-500/15 transition-all"
          >
            🎉 2× XP + Spark Weekend
          </button>
          <button
            onClick={() => setGameConfig({ xpMultiplier: 1, sparkMultiplier: 1 })}
            className="px-3 py-2 rounded-xl text-xs text-white/50 border border-white/12 hover:bg-white/6 transition-all"
          >
            Reset Multipliers
          </button>
          <button
            onClick={resetToDefaults}
            className="px-3 py-2 rounded-xl text-xs text-amber-400 border border-amber-500/20 bg-amber-500/8 hover:bg-amber-500/15 transition-all"
          >
            ↩ Reset All to Default
          </button>
        </div>
      </AdminCard>

      {/* Number config sections */}
      {CONFIG_SECTIONS.map(section => (
        <AdminCard key={section.id} title={section.label} className="mb-4">
          {(section.fields as readonly (keyof GameConfig)[]).map(fieldKey => (
            <NumberField key={fieldKey} fieldKey={fieldKey} config={gameConfig} onChange={handleChange} />
          ))}
        </AdminCard>
      ))}

      {/* Boolean flags */}
      <AdminCard title="⚙️ Feature Flags" className="mb-4">
        {boolFields.map(key => {
          const meta = CONFIG_FIELD_META[key]
          return (
            <AdminToggle
              key={key}
              label={meta.label}
              description={meta.description}
              enabled={gameConfig[key] as boolean}
              onChange={() => handleChange(key, !gameConfig[key])}
            />
          )
        })}
      </AdminCard>

      {/* Live preview */}
      <AdminCard title="📊 Live Values" className="mb-4">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: 'XP × Multiplier', value: `${gameConfig.xpMultiplier}×` },
            { label: 'Spark × Multiplier', value: `${gameConfig.sparkMultiplier}×` },
            { label: 'Daily Perfect Bonus', value: `+${gameConfig.dailyPerfectBonusSparks} ✦` },
            { label: 'Elo Gain (Win)', value: `+${gameConfig.eloGainWin}` },
            { label: 'Battle Pass Cost', value: `◈ ${gameConfig.battlePassPrismCost}` },
            { label: 'Elite Reward', value: `${gameConfig.eliteCompletionSparks}✦ + ${gameConfig.eliteCompletionPrisms}◈` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-1.5 border-b border-white/4">
              <span className="text-white/40">{label}</span>
              <span className="text-white/80 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  )
}
