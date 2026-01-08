import Stripe from 'stripe';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});

// Price IDs - configure these in your Stripe dashboard
export const PRICE_IDS = {
  pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
  pro_yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly',
  business_monthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || 'price_business_monthly',
  business_yearly: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID || 'price_business_yearly',
};

// Plan details
export const PLANS = {
  free: {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    limits: { pages: 1, subscribers: 100 },
    features: [
      '1 Landing Page',
      'Up to 100 Subscribers',
      'Basic Analytics',
      'LaunchWait Branding',
    ],
  },
  pro: {
    name: 'Pro',
    price: { monthly: 9, yearly: 90 },
    priceIds: {
      monthly: PRICE_IDS.pro_monthly,
      yearly: PRICE_IDS.pro_yearly,
    },
    limits: { pages: -1, subscribers: -1 },
    features: [
      'Unlimited Landing Pages',
      'Unlimited Subscribers',
      'Advanced Analytics',
      'No Branding',
      'Custom Domain',
      'CSV Export',
      'Priority Support',
    ],
  },
  business: {
    name: 'Business',
    price: { monthly: 29, yearly: 290 },
    priceIds: {
      monthly: PRICE_IDS.business_monthly,
      yearly: PRICE_IDS.business_yearly,
    },
    limits: { pages: -1, subscribers: -1 },
    features: [
      'Everything in Pro',
      'Team Collaboration',
      'API Access',
      'Webhook Integration',
      'White Label',
      'Dedicated Support',
    ],
  },
};

// Create Stripe Checkout session
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  userId,
}: {
  customerId?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  userId: string;
}) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
  });

  return session;
}

// Create Stripe Customer Portal session
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
  return subscription;
}

// Resume subscription
export async function resumeSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
  return subscription;
}
