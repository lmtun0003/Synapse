import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'

/**
 * Prism top-up modal. Each pack redirects to Stripe Checkout.
 *
 * Set `VITE_STRIPE_PRISMS_LINK` to a Stripe Payment Link to enable real
 * purchases; without it the buttons still redirect to Stripe's secure
 * checkout domain so the payment flow is wired end-to-end.
 */
const STRIPE_PRISMS_URL =
  (import.meta.env.VITE_STRIPE_PRISMS_LINK as string | undefined) ??
  'https://buy.stripe.com/'

interface PrismPack {
  id: string
  prisms: number
  price: string
  tag?: string
}

const PACKS: PrismPack[] = [
  { id: 'spark', prisms: 120, price: '$1.99' },
  { id: 'cache', prisms: 650, price: '$9.99', tag: 'Best value' },
  { id: 'vault', prisms: 1500, price: '$19.99', tag: 'Most Prisms' },
]

function checkout(pack: PrismPack) {
  const url = new URL(STRIPE_PRISMS_URL)
  url.searchParams.set('pack', pack.id)
  // Full redirect to Stripe for payment options.
  window.location.href = url.toString()
}

export function PrismsPurchaseModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(11,11,13,0.6)] p-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          onClick={onClose}
        >
          <motion.div
            className="glass-strong w-full max-w-md rounded-[1.75rem] p-7"
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(139,92,246,0.16)] text-lg text-[var(--color-secondary)]">
                ◆
              </span>
              <div>
                <h2 className="text-xl font-light tracking-tight">Get Prisms</h2>
                <p className="text-xs text-muted">Secure checkout via Stripe</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {PACKS.map((pack) => (
                <div
                  key={pack.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-[var(--color-secondary)]">◆</span>
                    <div>
                      <p className="font-medium">{pack.prisms} Prisms</p>
                      {pack.tag && (
                        <p className="text-xs text-[var(--color-accent)]">{pack.tag}</p>
                      )}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => checkout(pack)}>
                    {pack.price}
                  </Button>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-faint">
              Prisms are also earned free by completing campaign chapters (10 per chapter).
            </p>

            <div className="mt-5">
              <Button fullWidth variant="ghost" onClick={onClose}>
                Not now
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
