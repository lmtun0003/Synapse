interface PrismIconProps {
  size?: number
  className?: string
}

export function PrismIcon({ size = 16, className }: PrismIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <defs>
        <linearGradient id="pi-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" fill="url(#pi-g)" opacity="0.92" />
      <polygon points="12,2 22,8.5 12,10.5" fill="rgba(255,255,255,0.22)" />
      <polygon points="12,22 2,15.5 12,10.5" fill="rgba(0,0,0,0.12)" />
      <polygon points="22,8.5 22,15.5 12,10.5" fill="rgba(139,92,246,0.18)" />
    </svg>
  )
}

// Inline text-friendly version
export function PrismBadge({ count, size = 'sm', showButton, onBuy }: {
  count: number
  size?: 'xs' | 'sm' | 'md'
  showButton?: boolean
  onBuy?: () => void
}) {
  const sizes = { xs: 12, sm: 14, md: 18 }
  const textSizes = { xs: 'text-xs', sm: 'text-sm', md: 'text-base' }

  return (
    <div className="flex items-center gap-1.5">
      <PrismIcon size={sizes[size]} />
      <span className={`text-blue-300 font-semibold ${textSizes[size]}`}>{count.toLocaleString()}</span>
      {showButton && (
        <button
          onClick={onBuy}
          className="ml-1 text-[10px] text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400/50 px-1.5 py-0.5 rounded-lg transition-all bg-blue-500/5 hover:bg-blue-500/10"
        >
          + Get
        </button>
      )}
    </div>
  )
}
