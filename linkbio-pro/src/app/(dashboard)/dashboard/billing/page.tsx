"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  Check,
  ArrowLeft,
  CreditCard,
  Calendar,
  Zap,
  Crown,
  Building,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripeCurrentPeriodEnd: string | null;
}

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    price: 0,
    icon: Zap,
    features: [
      "Unlimited links",
      "Basic analytics",
      "5 pre-made themes",
      "Mobile-responsive page",
    ],
    notIncluded: ["Custom themes", "Remove branding", "Priority support"],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For creators who want more",
    price: 5,
    icon: Crown,
    popular: true,
    features: [
      "Everything in Free",
      "Remove LinkBio branding",
      "Custom themes & CSS",
      "Advanced analytics",
      "Priority support",
    ],
    notIncluded: [],
  },
  {
    id: "business",
    name: "Business",
    description: "For teams and businesses",
    price: 15,
    icon: Building,
    features: [
      "Everything in Pro",
      "Custom domain",
      "Team collaboration",
      "API access",
      "Dedicated support",
    ],
    notIncluded: [],
  },
];

function BillingContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [managingBilling, setManagingBilling] = useState(false);

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchUser();
    }
  }, [status, router, fetchUser]);

  const handleUpgrade = async (planId: string) => {
    if (planId === "free" || planId === user?.plan) return;

    setUpgrading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("Something went wrong");
    } finally {
      setUpgrading(null);
    }
  };

  const handleManageBilling = async () => {
    setManagingBilling(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Portal error:", error);
      alert("Something went wrong");
    } finally {
      setManagingBilling(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  const currentPlan = plans.find((p) => p.id === user?.plan) || plans[0];
  const periodEnd = user?.stripeCurrentPeriodEnd
    ? new Date(user.stripeCurrentPeriodEnd)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Billing</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Success/Cancel Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">
              Payment successful! Your plan has been upgraded.
            </p>
          </div>
        )}

        {canceled && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <XCircle className="w-5 h-5 text-amber-600" />
            <p className="text-amber-800">
              Payment was canceled. No changes were made to your plan.
            </p>
          </div>
        )}

        {/* Current Plan */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-violet-600" />
              Current Plan
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    user?.plan === "pro"
                      ? "bg-gradient-to-br from-violet-600 to-indigo-600"
                      : user?.plan === "business"
                      ? "bg-gradient-to-br from-amber-500 to-orange-500"
                      : "bg-gray-100"
                  }`}
                >
                  <currentPlan.icon
                    className={`w-7 h-7 ${
                      user?.plan !== "free" ? "text-white" : "text-gray-600"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{currentPlan.name} Plan</h3>
                  <p className="text-gray-500">
                    ${currentPlan.price}/month
                    {periodEnd && user?.plan !== "free" && (
                      <span className="ml-2">
                        · Renews on {periodEnd.toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {user?.stripeSubscriptionId && (
                <Button
                  variant="outline"
                  onClick={handleManageBilling}
                  disabled={managingBilling}
                >
                  {managingBilling ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Calendar className="w-4 h-4 mr-2" />
                  )}
                  Manage Subscription
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = user?.plan === plan.id;
            const canUpgrade = plan.id !== "free" && !isCurrentPlan;

            return (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular
                    ? "border-2 border-violet-500 shadow-lg shadow-violet-500/10"
                    : ""
                } ${isCurrentPlan ? "ring-2 ring-green-500" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    CURRENT
                  </div>
                )}

                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      plan.id === "pro"
                        ? "bg-gradient-to-br from-violet-600 to-indigo-600"
                        : plan.id === "business"
                        ? "bg-gradient-to-br from-amber-500 to-orange-500"
                        : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        plan.id !== "free" ? "text-white" : "text-gray-600"
                      }`}
                    />
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : canUpgrade ? (
                    <Button
                      className="w-full"
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={upgrading === plan.id}
                    >
                      {upgrading === plan.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Upgrade to ${plan.name}`
                      )}
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      Free Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Billing FAQ</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription at any time. You'll keep access until the end of your billing period.",
              },
              {
                q: "What happens when I upgrade?",
                a: "You'll be charged the prorated difference for the remaining time in your billing cycle.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee for all paid plans.",
              },
              {
                q: "How do I contact support?",
                a: "Pro and Business users get priority support via email at support@linkbio.pro",
              },
            ].map((faq, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-1">{faq.q}</h3>
                  <p className="text-sm text-gray-500">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    }>
      <BillingContent />
    </Suspense>
  );
}
