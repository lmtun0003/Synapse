import { useState } from 'react'
import { clsx } from 'clsx'
import { useGameStore } from '@/store/gameStore'
import { AdminLabel, AdminInput, AdminSelect, AdminCard } from './AdminShared'
import type { RankTier } from '@/types/game'

const RANK_TIERS: RankTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster', 'synapse']

const RANK_ICONS: Record<RankTier, string> = {
  bronze: '🟤', silver: '⚪', gold: '🟡', platinum: '💠',
  diamond: '💎', master: '🔮', grandmaster: '👑', synapse: '⚡',
}

function StatRow({ label, value, unit, onChange, min = 0, max = 999999, step = 1, color }: {
  label: string; value: number; unit?: string; onChange: (v: number) => void
  min?: number; max?: number; step?: number; color?: string
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
      <span className="text-white/55 text-sm flex-1">{label}</span>
      <div className="flex items-center gap-2">
        {unit && <span className={clsx('text-sm', color ?? 'text-white/40')}>{unit}</span>}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onChange(Math.max(min, value - step))}
            className="w-6 h-6 rounded-lg bg-white/6 hover:bg-white/12 text-white/60 hover:text-white text-xs transition-all flex items-center justify-center"
          >−</button>
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={e => onChange(Number(e.target.value))}
            className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white text-center focus:outline-none focus:border-blue-500/40"
          />
          <button
            onClick={() => onChange(Math.min(max, value + step))}
            className="w-6 h-6 rounded-lg bg-white/6 hover:bg-white/12 text-white/60 hover:text-white text-xs transition-all flex items-center justify-center"
          >+</button>
        </div>
      </div>
    </div>
  )
}

export function PlayerEditor() {
  const { player, updatePlayer, addSparks } = useGameStore()
  const [displayName, setDisplayName] = useState(player.displayName)
  const [nameDirty, setNameDirty] = useState(false)

  const updateStat = (key: string, val: number) => {
    updatePlayer({ stats: { ...player.stats, [key]: val } } as any)
  }

  const applyName = () => {
    updatePlayer({ displayName: displayName.trim() || 'Player', username: displayName.trim() || 'Player' })
    setNameDirty(false)
  }

  return (
    <div>
      {/* Overview */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Level', value: player.level, color: 'text-blue-400' },
          { label: 'Sparks ✦', value: player.sparks, color: 'text-amber-400' },
          { label: 'Prisms ◈', value: player.prisms, color: 'text-blue-400' },
          { label: 'Elo', value: player.elo, color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="bg-white/3 rounded-xl p-3 text-center border border-white/8">
            <div className={clsx('text-lg font-bold', s.color)}>{s.value.toLocaleString()}</div>
            <div className="text-white/30 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {/* Identity */}
        <AdminCard title="Identity">
          <AdminLabel>Display Name</AdminLabel>
          <div className="flex gap-2">
            <AdminInput
              value={displayName}
              onChange={e => { setDisplayName(e.target.value); setNameDirty(true) }}
              placeholder="Player name"
            />
            {nameDirty && (
              <button onClick={applyName} className="px-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm flex-shrink-0 transition-colors">
                Apply
              </button>
            )}
          </div>
        </AdminCard>

        {/* Currencies */}
        <AdminCard title="Currencies">
          <StatRow
            label="Sparks"
            value={player.sparks}
            unit="✦"
            color="text-amber-400"
            step={100}
            min={0}
            max={9999999}
            onChange={v => updatePlayer({ sparks: v })}
          />
          <StatRow
            label="Prisms"
            value={player.prisms}
            unit="◈"
            color="text-blue-400"
            step={10}
            min={0}
            max={99999}
            onChange={v => updatePlayer({ prisms: v })}
          />
          <StatRow
            label="XP"
            value={player.xp}
            unit="⚡"
            step={100}
            min={0}
            max={9999999}
            onChange={v => updatePlayer({ xp: v })}
          />

          {/* Quick add buttons */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-white/6">
            <span className="text-white/40 text-xs self-center">Quick add:</span>
            {[100, 500, 1000, 5000].map(n => (
              <button
                key={n}
                onClick={() => addSparks(n)}
                className="px-3 py-1 rounded-lg text-xs text-amber-400 border border-amber-500/20 bg-amber-500/8 hover:bg-amber-500/15 transition-all"
              >
                +{n.toLocaleString()} ✦
              </button>
            ))}
          </div>
        </AdminCard>

        {/* Rank */}
        <AdminCard title="Rank & Elo">
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <AdminLabel>Rank Tier</AdminLabel>
              <AdminSelect
                value={player.rank}
                onChange={e => updatePlayer({ rank: e.target.value as RankTier })}
              >
                {RANK_TIERS.map(r => (
                  <option key={r} value={r}>{RANK_ICONS[r]} {r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </AdminSelect>
            </div>
            <div className="flex-1">
              <AdminLabel>Elo Rating</AdminLabel>
              <AdminInput
                type="number"
                value={player.elo}
                min={0}
                max={9999}
                step={25}
                onChange={e => updatePlayer({ elo: Number(e.target.value) })}
              />
            </div>
          </div>
        </AdminCard>

        {/* Streaks */}
        <AdminCard title="Streaks">
          <StatRow label="Daily Streak 🔥" value={player.streaks.daily} min={0} max={9999} onChange={v => updatePlayer({ streaks: { ...player.streaks, daily: v } })} />
          <StatRow label="Win Streak ⚡"   value={player.streaks.win}   min={0} max={9999} onChange={v => updatePlayer({ streaks: { ...player.streaks, win: v } })} />
          <StatRow label="Perfect Streak 🎯" value={player.streaks.perfect} min={0} max={9999} onChange={v => updatePlayer({ streaks: { ...player.streaks, perfect: v } })} />
        </AdminCard>

        {/* Stats */}
        <AdminCard title="Game Stats">
          <StatRow label="Puzzles Solved"   value={player.stats.totalSolved}   min={0} step={1}  onChange={v => updateStat('totalSolved', v)} />
          <StatRow label="Perfect Ratings"  value={player.stats.totalPerfect}  min={0} step={1}  onChange={v => updateStat('totalPerfect', v)} />
          <StatRow label="Ranked Wins"      value={player.stats.rankedWins}    min={0} step={1}  onChange={v => updateStat('rankedWins', v)} />
          <StatRow label="Ranked Losses"    value={player.stats.rankedLosses}  min={0} step={1}  onChange={v => updateStat('rankedLosses', v)} />
          <StatRow label="Daily Streak"     value={player.stats.dailyStreak}   min={0} step={1}  onChange={v => updateStat('dailyStreak', v)} />
          <StatRow label="Total Moves"      value={player.stats.totalMoves}    min={0} step={10} onChange={v => updateStat('totalMoves', v)} />
        </AdminCard>

        {/* Danger zone */}
        <div className="border border-red-500/20 rounded-2xl p-4 bg-red-500/3">
          <div className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">⚠️ Danger Zone</div>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'Reset XP & Level', action: () => updatePlayer({ xp: 0, level: 1 }) },
              { label: 'Reset Currencies', action: () => updatePlayer({ sparks: 150, prisms: 0 }) },
              { label: 'Reset Streaks', action: () => updatePlayer({ streaks: { daily: 0, win: 0, perfect: 0 } }) },
              { label: 'Reset All Stats', action: () => updatePlayer({ stats: { totalSolved: 0, totalPerfect: 0, totalMoves: 0, totalTimeMs: 0, campaignProgress: 0, dailyStreak: 0, bestDailyRank: 0, rankedWins: 0, rankedLosses: 0, puzzlesCreated: 0, communityRating: 0 }, xp: 0, level: 1, sparks: 150, prisms: 0 }) },
            ].map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                className="px-3 py-1.5 rounded-xl text-xs text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 transition-all"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
