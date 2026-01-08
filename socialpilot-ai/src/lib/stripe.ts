import Stripe from 'stripe'

// Only create Stripe client if secret key is available
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true })
  : null as unknown as Stripe

export const PLANS = {
  FREE: {
    name: 'Бесплатно',
    generations: 5,
    priceId: null,
  },
  PRO: {
    name: 'Pro',
    generations: 100,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    price: 990,
  },
  UNLIMITED: {
    name: 'Unlimited',
    generations: Infinity,
    priceId: process.env.STRIPE_UNLIMITED_PRICE_ID,
    price: 2490,
  },
} as const

export type PlanType = keyof typeof PLANS

export function getPlanLimits(plan: string) {
  return PLANS[plan as PlanType] || PLANS.FREE
}

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  priceId: string,
  plan: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured')
  }
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: userEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      plan,
    },
    success_url: `${process.env.AUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.AUTH_URL}/pricing?canceled=true`,
  })

  return session
}

export async function createBillingPortalSession(customerId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured')
  }
  
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.AUTH_URL}/dashboard`,
  })

  return session
}
