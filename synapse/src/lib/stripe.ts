import { loadStripe } from '@stripe/stripe-js'
import type { Stripe, PaymentRequest, PaymentRequestPaymentMethodEvent } from '@stripe/stripe-js'

// ─── Configuration ────────────────────────────────────────────────────────────
// Set VITE_STRIPE_PUBLISHABLE_KEY in your .env.local to activate real payments.
// Format: pk_live_... (production) or pk_test_... (development)

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined

let stripePromise: ReturnType<typeof loadStripe> | null = null

export function getStripe(): ReturnType<typeof loadStripe> {
  if (!STRIPE_KEY) return Promise.resolve(null)
  if (!stripePromise) stripePromise = loadStripe(STRIPE_KEY)
  return stripePromise
}

// ─── Prism package definitions ────────────────────────────────────────────────

export interface PrismPackage {
  id: string
  prisms: number
  priceUsd: number          // in dollars
  priceCents: number        // in cents for Stripe
  label: string
  badgeText?: string
  badgeColor?: string
  perPrism: number          // cents per prism (for value comparison)
  savings?: number          // percentage saved vs base rate
  highlight?: boolean
}

// Base rate: $2.50 / 10 = $0.25 per prism
const BASE_RATE_CENTS = 25

export const PRISM_PACKAGES: PrismPackage[] = [
  {
    id: 'prisms_10',
    prisms: 10,
    priceUsd: 2.50,
    priceCents: 250,
    label: 'Starter',
    perPrism: 25,
    savings: 0,
  },
  {
    id: 'prisms_20',
    prisms: 20,
    priceUsd: 4.50,
    priceCents: 450,
    label: 'Basic',
    perPrism: Math.round(450 / 20),
    savings: Math.round((1 - 450 / 20 / BASE_RATE_CENTS) * 100),
    badgeText: '10% off',
    badgeColor: '#10B981',
  },
  {
    id: 'prisms_50',
    prisms: 50,
    priceUsd: 9.99,
    priceCents: 999,
    label: 'Value',
    perPrism: Math.round(999 / 50),
    savings: Math.round((1 - 999 / 50 / BASE_RATE_CENTS) * 100),
    badgeText: '20% off',
    badgeColor: '#3B82F6',
    highlight: true,
  },
  {
    id: 'prisms_150',
    prisms: 150,
    priceUsd: 14.99,
    priceCents: 1499,
    label: 'Popular',
    perPrism: Math.round(1499 / 150),
    savings: Math.round((1 - 1499 / 150 / BASE_RATE_CENTS) * 100),
    badgeText: 'Best Value',
    badgeColor: '#F59E0B',
    highlight: true,
  },
  {
    id: 'prisms_200',
    prisms: 200,
    priceUsd: 19.99,
    priceCents: 1999,
    label: 'Premium',
    perPrism: Math.round(1999 / 200),
    savings: Math.round((1 - 1999 / 200 / BASE_RATE_CENTS) * 100),
    badgeText: '60% off',
    badgeColor: '#8B5CF6',
  },
  {
    id: 'prisms_500',
    prisms: 500,
    priceUsd: 29.99,
    priceCents: 2999,
    label: 'Ultimate',
    perPrism: Math.round(2999 / 500),
    savings: Math.round((1 - 2999 / 500 / BASE_RATE_CENTS) * 100),
    badgeText: '76% off',
    badgeColor: '#EC4899',
  },
]

// ─── Payment Request (Apple Pay / Google Pay) ─────────────────────────────────

export interface PaymentRequestState {
  available: boolean
  applePay: boolean
  googlePay: boolean
  paymentRequest: PaymentRequest | null
}

export async function createPaymentRequest(
  stripe: Stripe,
  pkg: PrismPackage,
  onSuccess: (prisms: number) => void,
  onError: (msg: string) => void
): Promise<PaymentRequestState> {
  const pr = stripe.paymentRequest({
    country: 'US',
    currency: 'usd',
    total: {
      label: `SYNAPSE ${pkg.prisms} Prisms`,
      amount: pkg.priceCents,
    },
    requestPayerName: false,
    requestPayerEmail: false,
  })

  pr.on('paymentmethod', async (ev: PaymentRequestPaymentMethodEvent) => {
    // ── In production: ────────────────────────────────────────────────────────
    // 1. POST to your backend: { paymentMethodId: ev.paymentMethod.id, packageId: pkg.id }
    // 2. Backend creates PaymentIntent with Stripe secret key
    // 3. Backend confirms the PaymentIntent
    // 4. Backend returns { clientSecret, error }
    // 5. Confirm on client: stripe.confirmCardPayment(clientSecret, { payment_method: ev.paymentMethod.id })
    // 6. ev.complete('success') or ev.complete('fail')
    // ─────────────────────────────────────────────────────────────────────────

    // Mock success for demo (remove in production):
    ev.complete('success')
    onSuccess(pkg.prisms)
  })

  const result = await pr.canMakePayment()

  return {
    available: !!result,
    applePay: result?.applePay ?? false,
    googlePay: result?.googlePay ?? false,
    paymentRequest: result ? pr : null,
  }
}

// ─── Card payment fallback ────────────────────────────────────────────────────

export async function processCardPayment(
  _pkg: PrismPackage,
  _cardElement: unknown,
  onSuccess: (prisms: number) => void,
  onError: (msg: string) => void
): Promise<void> {
  // ── In production: ────────────────────────────────────────────────────────
  // 1. POST to backend to create PaymentIntent
  // 2. stripe.confirmCardPayment(clientSecret, { payment_method: { card: cardElement } })
  // 3. Check result.paymentIntent.status === 'succeeded'
  // ─────────────────────────────────────────────────────────────────────────
  onError('Card payments require a backend. Configure VITE_STRIPE_PUBLISHABLE_KEY and a server endpoint.')
}

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}
