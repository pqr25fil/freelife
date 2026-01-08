import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    description: "Perfect for getting started",
    price: 0,
    priceId: null,
    features: [
      "Unlimited links",
      "Basic analytics",
      "5 pre-made themes",
      "Mobile-responsive page",
    ],
    limits: {
      customThemes: false,
      removeBranding: false,
      analytics: "basic",
      customDomain: false,
    },
  },
  pro: {
    name: "Pro",
    description: "For creators who want more",
    price: 5,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "Everything in Free",
      "Remove LinkBio branding",
      "Custom themes & CSS",
      "Advanced analytics",
      "Priority support",
    ],
    limits: {
      customThemes: true,
      removeBranding: true,
      analytics: "advanced",
      customDomain: false,
    },
  },
  business: {
    name: "Business",
    description: "For teams and businesses",
    price: 15,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    features: [
      "Everything in Pro",
      "Custom domain",
      "Team collaboration",
      "API access",
      "Dedicated support",
    ],
    limits: {
      customThemes: true,
      removeBranding: true,
      analytics: "advanced",
      customDomain: true,
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;

export function getPlanFromPriceId(priceId: string | null): PlanType {
  if (!priceId) return "free";
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) return "business";
  return "free";
}
