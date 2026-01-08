import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, getPlanFromPriceId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

// Type for subscription with period end
interface SubscriptionWithPeriod {
  id: string;
  current_period_end?: number;
  items: {
    data: Array<{
      price: {
        id: string;
      };
    }>;
  };
}

// Type for invoice with subscription
interface InvoiceWithSubscription {
  id: string;
  subscription?: string | null;
}

// Helper to safely get subscription period end
function getSubscriptionPeriodEnd(subscription: SubscriptionWithPeriod): Date {
  if (subscription.current_period_end) {
    return new Date(subscription.current_period_end * 1000);
  }
  // Fallback: 30 days from now
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === "subscription" && session.subscription) {
          const subscriptionResponse = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const subscription = subscriptionResponse as unknown as SubscriptionWithPeriod;

          const userId = session.metadata?.userId;
          if (!userId) break;

          const plan = getPlanFromPriceId(subscription.items.data[0]?.price.id);

          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0]?.price.id,
              stripeCurrentPeriodEnd: getSubscriptionPeriodEnd(subscription),
              plan,
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as unknown as SubscriptionWithPeriod;
        
        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (!user) break;

        const plan = getPlanFromPriceId(subscription.items.data[0]?.price.id);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: getSubscriptionPeriodEnd(subscription),
            plan,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as unknown as SubscriptionWithPeriod;
        
        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (!user) break;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            plan: "free",
          },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as unknown as InvoiceWithSubscription;
        
        if (invoice.subscription) {
          const subscriptionResponse = await stripe.subscriptions.retrieve(
            invoice.subscription
          );
          const subscription = subscriptionResponse as unknown as SubscriptionWithPeriod;

          const user = await prisma.user.findFirst({
            where: { stripeSubscriptionId: subscription.id },
          });

          if (!user) break;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              stripeCurrentPeriodEnd: getSubscriptionPeriodEnd(subscription),
            },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as unknown as InvoiceWithSubscription;
        
        // Handle failed payment - could send email, downgrade plan, etc.
        console.log("Payment failed for invoice:", invoice.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
