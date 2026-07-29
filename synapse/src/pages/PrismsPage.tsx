import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useGameStore } from '@/store/gameStore'
import { getStripe, PRISM_PACKAGES, createPaymentRequest } from '@/lib/stripe'
import type { PrismPackage } from '@/lib/stripe'
import type { Stripe, PaymentRequest } from '@stripe/stripe-js'

// ─── Prism icon ──────────────────────────────────────────────────────────────

function PrismIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id="prism-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" fill="url(#prism-grad)" opacity="0.9" />
      <polygon points="12,2 22,8.5 12,11" fill="rgba(255,255,255,0.2)" />
      <polygon points="12,22 2,15.5 12,11" fill="rgba(0,0,0,0.15)" />
    </svg>
  )
}

// ─── Package card ─────────────────────────────────────────────────────────────

function PackageCard({
  pkg, selected, onSelect,
}: {
  pkg: PrismPackage
  selected: boolean
  onSelect: (pkg: PrismPackage) => void
}) {
  return (
    <motion.button
      onClick={() => onSelect(pkg)}
      className={clsx(
        'relative w-full text-left rounded-2xl border transition-all duration-200 overflow-hidden',
        'focus:outline-none',
        selected
          ? 'border-blue-500/50 shadow-[0_0_24px_rgba(59,130,246,0.2)]'
          : 'border-white/10 hover:border-white/20',
        pkg.highlight && !selected ? 'border-amber-500/30 bg-amber-500/3' : ''
      )}
      style={selected ? { background: 'rgba(59,130,246,0.08)' } : { background: 'rgba(255,255,255,0.03)' }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Best value banner */}
      {pkg.highlight && (
        <div
          className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl"
          style={{ background: pkg.badgeColor, color: 'white' }}
        >
          {pkg.badgeText}
        </div>
      )}

      <div className="flex items-center gap-4 p-4">
        {/* Prism count */}
        <div className="flex flex-col items-center flex-shrink-0 w-16">
          <div className="flex items-center gap-1 mb-0.5">
            <PrismIcon size={16} />
            <span className="text-white font-bold text-xl tabular-nums">{pkg.prisms}</span>
          </div>
          <span className="text-white/35 text-[10px] uppercase tracking-wider">Prisms</span>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-white/8 flex-shrink-0" />

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-white font-semibold text-sm">{pkg.label}</span>
            {!pkg.highlight && pkg.badgeText && (
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                style={{ color: pkg.badgeColor, background: pkg.badgeColor + '22' }}
              >
                {pkg.badgeText}
              </span>
            )}
          </div>
          <div className="text-white/35 text-xs">
            ${(pkg.priceUsd / pkg.prisms).toFixed(3)} per prism
            {pkg.savings && pkg.savings > 0 ? ` · ${pkg.savings}% off` : ''}
          </div>
        </div>

        {/* Price + selector */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <div className="text-white font-bold text-lg">${pkg.priceUsd.toFixed(2)}</div>
          </div>
          <div className={clsx(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
            selected ? 'border-blue-400 bg-blue-500' : 'border-white/25'
          )}>
            {selected && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </div>
      </div>
    </motion.button>
  )
}

// ─── Payment method button ────────────────────────────────────────────────────

function PaymentButton({
  pkg, stripe, onSuccess,
}: {
  pkg: PrismPackage
  stripe: Stripe | null
  onSuccess: (prisms: number) => void
}) {
  const [prState, setPrState] = useState<{ available: boolean; applePay: boolean; googlePay: boolean; paymentRequest: PaymentRequest | null } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasKey = !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

  useEffect(() => {
    if (!stripe || !hasKey) return
    createPaymentRequest(
      stripe,
      pkg,
      onSuccess,
      msg => setError(msg)
    ).then(setPrState)
  }, [stripe, pkg.id, hasKey])

  const handleNativePayment = () => {
    prState?.paymentRequest?.show()
  }

  const handleDemoPayment = () => {
    setLoading(true)
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      onSuccess(pkg.prisms)
    }, 1800)
  }

  if (!hasKey) {
    // Demo mode — no real Stripe key
    return (
      <div className="flex flex-col gap-2.5">
        <button
          onClick={handleDemoPayment}
          disabled={loading}
          className={clsx(
            'w-full py-4 rounded-2xl font-semibold text-white text-base transition-all',
            'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500',
            'shadow-[0_0_30px_rgba(59,130,246,0.4)] disabled:opacity-50 flex items-center justify-center gap-2'
          )}
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing…</>
          ) : (
            <><PrismIcon size={18} /> Purchase {pkg.prisms} Prisms — ${pkg.priceUsd.toFixed(2)}</>
          )}
        </button>

        {/* Apple Pay / Google Pay placeholders */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: '', label: ' Pay', bg: 'black', desc: 'Available on Safari/iOS' },
            { icon: '⬡', label: 'Google Pay', bg: '#1A73E8', desc: 'Available on Chrome/Android' },
          ].map(btn => (
            <div
              key={btn.label}
              className="py-3 rounded-xl text-center text-white text-sm font-semibold opacity-40 border border-white/10 cursor-not-allowed select-none"
              style={{ background: btn.bg }}
              title={`${btn.desc} — Add VITE_STRIPE_PUBLISHABLE_KEY to enable`}
            >
              {btn.icon} {btn.label}
            </div>
          ))}
        </div>
        <p className="text-white/25 text-xs text-center">
          Add <code className="text-white/40">VITE_STRIPE_PUBLISHABLE_KEY</code> to enable Apple Pay &amp; Google Pay
        </p>
      </div>
    )
  }

  // Real Stripe mode
  return (
    <div className="flex flex-col gap-2.5">
      {/* Native payment button (Apple Pay / Google Pay) */}
      {prState?.available && (
        <button
          onClick={handleNativePayment}
          className={clsx(
            'w-full py-4 rounded-2xl font-semibold text-white text-base transition-all flex items-center justify-center gap-2',
            prState.applePay
              ? 'bg-black border border-white/20 hover:bg-gray-900'
              : 'bg-[#1A73E8] hover:bg-[#1557B0]'
          )}
        >
          {prState.applePay ? (
            <> Pay</>
          ) : (
            <>⬡ Google Pay</>
          )}
        </button>
      )}

      {/* Standard button fallback */}
      <button
        onClick={() => setError('Card input UI — integrate @stripe/react-stripe-js CardElement')}
        disabled={loading}
        className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 shadow-[0_0_20px_rgba(59,130,246,0.35)] flex items-center justify-center gap-2"
      >
        <PrismIcon size={16} /> Pay ${pkg.priceUsd.toFixed(2)} with Card
      </button>

      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
    </div>
  )
}

// ─── Success overlay ──────────────────────────────────────────────────────────

function SuccessOverlay({ prisms, onDone }: { prisms: number; onDone: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
    >
      <motion.div
        className="text-center px-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.05 }}
      >
        {/* Particle bursts */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{ left: '50%', top: '50%', background: ['#3B82F6','#8B5CF6','#10B981','#F59E0B'][i % 4] }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: Math.cos(angle) * 120, y: Math.sin(angle) * 120, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 + i * 0.03 }}
            />
          )
        })}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 15, delay: 0.15 }}
          className="mb-5"
        >
          <PrismIcon size={64} className="mx-auto" />
        </motion.div>

        <motion.h2
          className="text-white text-3xl font-bold mb-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          +{prisms} Prisms!
        </motion.h2>
        <motion.p
          className="text-white/50 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Added to your account.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Button variant="primary" size="lg" onClick={onDone} glow>Continue →</Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function PrismsPage() {
  const navigate = useNavigate()
  const { player, updatePlayer } = useGameStore()
  const [selected, setSelected] = useState<PrismPackage>(PRISM_PACKAGES[3]) // default: Popular
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [successPrisms, setSuccessPrisms] = useState<number | null>(null)

  useEffect(() => {
    getStripe().then(s => setStripe(s))
  }, [])

  const handleSuccess = useCallback((prisms: number) => {
    updatePlayer({ prisms: player.prisms + prisms })
    setSuccessPrisms(prisms)
  }, [player.prisms, updatePlayer])

  const handleDone = () => {
    setSuccessPrisms(null)
    navigate(-1)
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <motion.div className="flex items-center gap-3 mb-6" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white">←</button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <PrismIcon size={20} /> Get Prisms
          </h1>
          <p className="text-white/40 text-xs">Premium currency for exclusive cosmetics</p>
        </div>
        {/* Current balance */}
        <div className="glass rounded-xl px-3 py-2 flex items-center gap-1.5 border border-blue-500/20">
          <PrismIcon size={14} />
          <span className="text-white font-semibold text-sm">{player.prisms}</span>
        </div>
      </motion.div>

      {/* What are prisms */}
      <GlassCard padding="md" rounded="2xl" animate delay={0.05} className="mb-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(59,130,246,0.4) 0%, transparent 60%)' }} />
        <div className="relative flex items-start gap-4">
          <div className="flex-shrink-0">
            <PrismIcon size={40} />
          </div>
          <div>
            <h2 className="text-white font-bold text-base mb-1">Premium Currency</h2>
            <p className="text-white/50 text-xs leading-relaxed">
              Prisms unlock exclusive legendary cosmetics — animated boards, elite avatar frames, premium themes, and limited collections. No gameplay advantages, ever.
            </p>
            <div className="flex flex-wrap gap-2 mt-2.5">
              {['Legendary Themes', 'Animated Boards', 'Elite Borders', 'Battle Pass'].map(f => (
                <span key={f} className="text-[10px] text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">{f}</span>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* How to earn free prisms */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 glass rounded-xl mb-5 border border-white/6">
        <span className="text-amber-400">💡</span>
        <p className="text-white/50 text-xs">
          Earn free Prisms by completing Campaign worlds and Battle Pass season levels.
        </p>
      </div>

      {/* Package selector */}
      <h2 className="text-white/50 text-xs uppercase tracking-widest mb-3">Choose a Package</h2>
      <div className="flex flex-col gap-2.5 mb-6">
        {PRISM_PACKAGES.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
          >
            <PackageCard pkg={pkg} selected={selected.id === pkg.id} onSelect={setSelected} />
          </motion.div>
        ))}
      </div>

      {/* Order summary */}
      <GlassCard padding="md" rounded="2xl" className="mb-5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm">Order Summary</span>
          <Badge variant="blue" size="xs">{selected.label}</Badge>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-white/6">
          <div className="flex items-center gap-2">
            <PrismIcon size={16} />
            <span className="text-white text-sm">{selected.prisms} Prisms</span>
          </div>
          <span className="text-white font-semibold">${selected.priceUsd.toFixed(2)}</span>
        </div>
        {selected.savings && selected.savings > 0 ? (
          <div className="flex items-center justify-between py-2 text-xs text-green-400">
            <span>You save</span>
            <span>{selected.savings}% vs base rate</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between pt-2 text-xs text-white/30">
          <span>Per prism</span>
          <span>${(selected.priceUsd / selected.prisms).toFixed(3)}</span>
        </div>
      </GlassCard>

      {/* Payment */}
      <div className="mb-4">
        <h2 className="text-white/50 text-xs uppercase tracking-widest mb-3">Payment</h2>
        <PaymentButton pkg={selected} stripe={stripe} onSuccess={handleSuccess} />
      </div>

      {/* Legal */}
      <p className="text-white/20 text-[10px] text-center leading-relaxed px-4">
        By completing this purchase you agree to our Terms of Service. All sales are final. Prisms are non-transferable and have no cash value. Processed securely by Stripe.
      </p>

      {/* Success overlay */}
      <AnimatePresence>
        {successPrisms !== null && (
          <SuccessOverlay prisms={successPrisms} onDone={handleDone} />
        )}
      </AnimatePresence>
    </div>
  )
}
