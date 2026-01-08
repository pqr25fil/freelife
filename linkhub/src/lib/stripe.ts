import Stripe from "stripe";

// Lazy initialization to avoid build errors
let stripeInstance: Stripe | null = null;

export const getStripe = () => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    });
  }
  return stripeInstance;
};

// For backward compatibility
export const stripe = {
  get customers() { return getStripe().customers; },
  get subscriptions() { return getStripe().subscriptions; },
  get checkout() { return getStripe().checkout; },
  get billingPortal() { return getStripe().billingPortal; },
  get webhooks() { return getStripe().webhooks; },
};

export const PLANS = {
  pro: {
    name: "Pro",
    description: "Безлимитные ссылки, все темы, расширенная аналитика",
    price: 5,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      "Безлимитные ссылки",
      "Все премиум темы",
      "Расширенная аналитика",
      "Приоритетная поддержка",
      "Без брендинга LinkHub",
      "Кастомный домен (скоро)",
    ],
  },
};

export async function createOrRetrieveCustomer(
  userId: string,
  email: string,
  stripeCustomerId?: string | null
): Promise<string> {
  if (stripeCustomerId) {
    return stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });

  return customer.id;
}
