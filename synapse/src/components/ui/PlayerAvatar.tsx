import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { AVATARS, BORDERS } from '@/data/avatars'
import type { AvatarDef, BorderDef } from '@/data/avatars'

interface PlayerAvatarProps {
  avatarId: string
  borderId: string
  size?: number
  displayName: string
  className?: string
  animate?: boolean
}

// ─── Avatar Icon SVGs ─────────────────────────────────────────────────────────

function AvatarIcon({ id, size: s, colors }: { id: string; size: number; colors: AvatarDef['colors'] }) {
  const cx = s / 2
  const cy = s / 2
  const r = s * 0.35

  switch (id) {
    case 'nebula':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <defs>
            <radialGradient id={`ng_${s}`} cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor={colors.secondary} />
              <stop offset="100%" stopColor={colors.primary} />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={r * 1.1} fill={colors.bg} />
          <ellipse cx={cx - s*0.06} cy={cy} rx={r * 0.7} ry={r * 0.5} fill={`url(#ng_${s})`} opacity="0.9" />
          <ellipse cx={cx + s*0.06} cy={cy} rx={r * 0.5} ry={r * 0.7} fill={colors.secondary} opacity="0.5" />
          <circle cx={cx} cy={cy} r={s * 0.08} fill="white" opacity="0.9" />
        </svg>
      )
    case 'circuit':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={cx} cy={cy} r={r * 1.1} fill={colors.bg} />
          <line x1={cx - r*0.7} y1={cy} x2={cx + r*0.7} y2={cy} stroke={colors.primary} strokeWidth={s*0.05} />
          <line x1={cx} y1={cy - r*0.7} x2={cx} y2={cy + r*0.7} stroke={colors.primary} strokeWidth={s*0.05} />
          <circle cx={cx} cy={cy} r={s*0.1} fill={colors.primary} />
          {([[-r*0.7,0],[r*0.7,0],[0,-r*0.7],[0,r*0.7]] as [number,number][]).map(([dx, dy], i) => (
            <circle key={i} cx={cx+dx} cy={cy+dy} r={s*0.06} fill={colors.secondary} />
          ))}
        </svg>
      )
    case 'prism':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <defs>
            <linearGradient id={`pg_${s}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor={colors.secondary} />
            </linearGradient>
          </defs>
          <circle cx={cx} cy={cy} r={r * 1.1} fill={colors.bg} />
          <polygon points={`${cx},${cy-r*0.9} ${cx+r*0.8},${cy+r*0.5} ${cx-r*0.8},${cy+r*0.5}`} fill={`url(#pg_${s})`} opacity="0.9" />
          <line x1={cx} y1={cy-r*0.9} x2={cx} y2={cy+r*0.5} stroke="white" strokeWidth={s*0.02} opacity="0.5" />
        </svg>
      )
    case 'void':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <defs>
            <radialGradient id={`vg_${s}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity="0.4" />
              <stop offset="100%" stopColor={colors.bg} />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={r * 1.1} fill={colors.bg} />
          <circle cx={cx} cy={cy} r={r * 0.9} fill={`url(#vg_${s})`} />
          {([0,60,120,180,240,300] as number[]).map((a, i) => {
            const x = cx + r * 0.6 * Math.cos(a * Math.PI / 180)
            const y = cy + r * 0.6 * Math.sin(a * Math.PI / 180)
            return <circle key={i} cx={x} cy={y} r={s * 0.025} fill={colors.secondary} opacity={0.5 + i * 0.08} />
          })}
          <circle cx={cx} cy={cy} r={s * 0.09} fill={colors.primary} />
          <circle cx={cx} cy={cy} r={s * 0.04} fill="white" />
        </svg>
      )
    case 'inferno':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <defs>
            <radialGradient id={`ig_${s}`} cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="60%" stopColor={colors.secondary} />
              <stop offset="100%" stopColor={colors.primary} />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={r * 1.1} fill={colors.bg} />
          <path d={`M ${cx} ${cy+r*0.85} C ${cx-r*0.5} ${cy+r*0.2} ${cx-r*0.3} ${cy-r*0.3} ${cx} ${cy-r*0.9} C ${cx+r*0.2} ${cy-r*0.3} ${cx+r*0.5} ${cy+r*0.1} ${cx+r*0.3} ${cy+r*0.5} Z`} fill={`url(#ig_${s})`} />
        </svg>
      )
    case 'quantum':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <defs>
            <linearGradient id={`qg_${s}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.secondary} />
              <stop offset="100%" stopColor={colors.primary} />
            </linearGradient>
          </defs>
          <circle cx={cx} cy={cy} r={r * 1.1} fill={colors.bg} />
          {[0, 60, 120].map((angle, i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={r*0.85} ry={r*0.28} fill="none" stroke={`url(#qg_${s})`} strokeWidth={s*0.04} transform={`rotate(${angle} ${cx} ${cy})`} />
          ))}
          <circle cx={cx} cy={cy} r={s*0.08} fill={colors.primary} />
        </svg>
      )
    case 'storm':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={cx} cy={cy} r={r * 1.1} fill={colors.bg} />
          <path d={`M ${cx+r*0.3} ${cy-r*0.8} L ${cx-r*0.1} ${cy-r*0.1} L ${cx+r*0.3} ${cy-r*0.1} L ${cx-r*0.3} ${cy+r*0.8}`} stroke={colors.primary} strokeWidth={s*0.07} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'zenith':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <defs>
            <linearGradient id={`zg_${s}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="100%" stopColor={colors.secondary} />
            </linearGradient>
          </defs>
          <circle cx={cx} cy={cy} r={r * 1.1} fill={colors.bg} />
          {([0,45,90,135,180,225,270,315] as number[]).map((a, i) => {
            const rad = a * Math.PI / 180
            const len = i % 2 === 0 ? r * 0.85 : r * 0.5
            return <line key={i} x1={cx} y1={cy} x2={cx + len * Math.cos(rad)} y2={cy + len * Math.sin(rad)} stroke={`url(#zg_${s})`} strokeWidth={i % 2 === 0 ? s*0.055 : s*0.03} strokeLinecap="round" />
          })}
          <circle cx={cx} cy={cy} r={s*0.1} fill={colors.secondary} />
        </svg>
      )
    case 'aurora':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <defs>
            <linearGradient id={`aurag_${s}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="100%" stopColor={colors.secondary} />
            </linearGradient>
          </defs>
          <circle cx={cx} cy={cy} r={r * 1.1} fill={colors.bg} />
          <path d={`M ${cx-r} ${cy+r*0.2} Q ${cx-r*0.4} ${cy-r*0.8} ${cx} ${cy-r*0.3} Q ${cx+r*0.4} ${cy+r*0.2} ${cx+r} ${cy-r*0.4}`} stroke={`url(#aurag_${s})`} strokeWidth={s*0.06} fill="none" strokeLinecap="round" opacity="0.9" />
          <path d={`M ${cx-r} ${cy+r*0.5} Q ${cx} ${cy-r*0.2} ${cx+r} ${cy+r*0.1}`} stroke={colors.secondary} strokeWidth={s*0.04} fill="none" strokeLinecap="round" opacity="0.55" />
          <path d={`M ${cx-r} ${cy+r*0.75} Q ${cx} ${cy+r*0.1} ${cx+r} ${cy+r*0.4}`} stroke={colors.primary} strokeWidth={s*0.025} fill="none" strokeLinecap="round" opacity="0.35" />
        </svg>
      )
    case 'nexus':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={cx} cy={cy} r={r * 1.1} fill={colors.bg} />
          {([[cx, cy-r*0.75], [cx+r*0.65, cy+r*0.38], [cx-r*0.65, cy+r*0.38]] as [number,number][]).map(([x, y], i) => (
            <g key={i}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={colors.secondary} strokeWidth={s*0.035} opacity="0.7" />
              <circle cx={x} cy={y} r={s*0.07} fill={colors.primary} />
            </g>
          ))}
          <circle cx={cx} cy={cy} r={s*0.12} fill={colors.primary} />
          <circle cx={cx} cy={cy} r={s*0.055} fill="white" />
        </svg>
      )
    default:
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={cx} cy={cy} r={r * 1.1} fill={colors.bg} />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={s * 0.4} fontWeight="bold">
            {id[0].toUpperCase()}
          </text>
        </svg>
      )
  }
}

// ─── Border Ring ─────────────────────────────────────────────────────────────

function BorderRing({ border, size }: { border: BorderDef; size: number }) {
  const strokeW = Math.max(2, Math.round(size * 0.07))

  if (border.style === 'none') return null

  if (border.style === 'fire') {
    return (
      <div className="absolute inset-0 rounded-full animate-spin-slow pointer-events-none" style={{ padding: strokeW, background: 'conic-gradient(#EF4444, #F97316, #FCD34D, #F97316, #EF4444)', borderRadius: '50%' }}>
        <div className="w-full h-full rounded-full" style={{ background: '#0B0B0D' }} />
      </div>
    )
  }
  if (border.style === 'rainbow') {
    return (
      <div className="absolute inset-0 rounded-full animate-spin-slow pointer-events-none" style={{ padding: strokeW, background: 'conic-gradient(#EF4444, #F59E0B, #10B981, #3B82F6, #8B5CF6, #EF4444)', borderRadius: '50%' }}>
        <div className="w-full h-full rounded-full" style={{ background: '#0B0B0D' }} />
      </div>
    )
  }
  if (border.style === 'pulse') {
    return (
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ border: `${strokeW}px solid ${border.colors?.[0]}`, boxShadow: `0 0 ${size * 0.2}px ${border.colors?.[0]}` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    )
  }
  if (border.style === 'gradient' || border.style === 'animated') {
    const grad = border.colors && border.colors.length > 1 ? `linear-gradient(135deg, ${border.colors.join(', ')})` : border.colors?.[0]
    return (
      <div className="absolute inset-0 rounded-full pointer-events-none" style={{ padding: strokeW, background: grad, borderRadius: '50%' }}>
        <div className="w-full h-full rounded-full" style={{ background: '#0B0B0D' }} />
      </div>
    )
  }
  return (
    <div className="absolute inset-0 rounded-full pointer-events-none" style={{ border: `${strokeW}px solid ${border.colors?.[0]}`, boxShadow: `0 0 ${size * 0.12}px ${border.colors?.[0]}60`, borderRadius: '50%' }} />
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PlayerAvatar({ avatarId, borderId, size = 48, displayName, className, animate: doAnimate }: PlayerAvatarProps) {
  const avatarDef = AVATARS.find(a => a.id === avatarId) ?? AVATARS[0]
  const borderDef = BORDERS.find(b => b.id === borderId) ?? BORDERS[0]
  const pad = borderDef.style !== 'none' ? Math.max(2, Math.round(size * 0.09)) : 0

  const inner = (
    <div className={clsx('relative flex-shrink-0', className)} style={{ width: size, height: size }}>
      <BorderRing border={borderDef} size={size} />
      <div className="absolute rounded-full overflow-hidden" style={{ inset: pad, background: avatarDef.colors.bg, boxShadow: `0 0 ${size * 0.22}px ${avatarDef.colors.glow}` }}>
        <AvatarIcon id={avatarDef.id} size={size - pad * 2} colors={avatarDef.colors} />
      </div>
    </div>
  )

  if (doAnimate) {
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
        {inner}
      </motion.div>
    )
  }
  return inner
}
