import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === "subscription" && session.subscription) {
          const subscriptionData = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          const userId = session.metadata?.userId;
          if (!userId) {
            console.error("No userId in session metadata");
            break;
          }

          // Get current period end from subscription
          const currentPeriodEnd = (subscriptionData as unknown as { current_period_end: number }).current_period_end;

          await prisma.user.update({
            where: { id: userId },
            data: {
              isPro: true,
              stripeSubscriptionId: subscriptionData.id,
              stripePriceId: subscriptionData.items.data[0].price.id,
              stripeCurrentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
            },
          });

          console.log(`User ${userId} upgraded to Pro`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const subscriptionId = (invoice as { subscription?: string }).subscription;
        
        if (subscriptionId) {
          const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId);

          const currentPeriodEnd = (subscriptionData as unknown as { current_period_end: number }).current_period_end;
          const userId = subscriptionData.metadata?.userId;
          const customerId = (invoice as { customer?: string }).customer;
          
          if (!userId) {
            // Try to find user by customer ID
            const user = await prisma.user.findFirst({
              where: { stripeCustomerId: customerId as string },
            });
            
            if (user) {
              await prisma.user.update({
                where: { id: user.id },
                data: {
                  isPro: true,
                  stripeCurrentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
                },
              });
            }
          } else {
            await prisma.user.update({
              where: { id: userId },
              data: {
                isPro: true,
                stripeCurrentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
              },
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const subscriptionId = (invoice as { subscription?: string }).subscription;
        const customerId = (invoice as { customer?: string }).customer;
        
        if (subscriptionId) {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: customerId as string },
          });

          if (user) {
            console.log(`Payment failed for user ${user.id}`);
            // Optionally send email notification
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const currentPeriodEnd = (subscription as unknown as { current_period_end: number }).current_period_end;
        
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: subscription.customer as string },
        });

        if (user) {
          const isActive = ["active", "trialing"].includes(subscription.status);
          
          await prisma.user.update({
            where: { id: user.id },
            data: {
              isPro: isActive,
              stripeCurrentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: subscription.customer as string },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              isPro: false,
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
            },
          });

          console.log(`User ${user.id} subscription cancelled`);
        }
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
