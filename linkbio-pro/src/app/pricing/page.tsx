import Link from "next/link";
import { Sparkles, Check, ArrowRight, HelpCircle } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: 0,
      features: [
        "Unlimited links",
        "Basic analytics",
        "5 pre-made themes",
        "Mobile-responsive page",
        "LinkBio Pro branding",
      ],
      notIncluded: [
        "Custom themes",
        "Remove branding",
        "Priority support",
      ],
      cta: "Get Started",
      href: "/register",
      popular: false,
    },
    {
      name: "Pro",
      description: "For creators who want more",
      price: 5,
      features: [
        "Everything in Free",
        "Remove LinkBio branding",
        "Custom themes & CSS",
        "Advanced analytics",
        "Link scheduling",
        "Priority email support",
        "Social icons",
      ],
      notIncluded: [],
      cta: "Start Free Trial",
      href: "/register",
      popular: true,
    },
    {
      name: "Business",
      description: "For teams and businesses",
      price: 15,
      features: [
        "Everything in Pro",
        "Custom domain",
        "Team collaboration",
        "API access",
        "Dedicated support",
        "White-label solution",
        "Custom integrations",
      ],
      notIncluded: [],
      cta: "Contact Sales",
      href: "/register",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "Can I try Pro features for free?",
      answer: "Yes! Every new account gets a 14-day free trial of Pro features. No credit card required.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal.",
    },
    {
      question: "Is there a limit on page views?",
      answer: "No! All plans include unlimited page views. We don't charge based on traffic.",
    },
    {
      question: "Can I switch plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">LinkBio Pro</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan for your needs. Start free and upgrade as you grow.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 text-left relative ${
                plan.popular
                  ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white scale-105 shadow-2xl shadow-violet-500/30"
                  : "bg-white border-2 border-gray-100"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </div>
              )}

              <h3 className={`text-xl font-bold mb-2 ${plan.popular ? "text-white" : "text-gray-900"}`}>
                {plan.name}
              </h3>
              <p className={`mb-6 ${plan.popular ? "text-violet-200" : "text-gray-500"}`}>
                {plan.description}
              </p>

              <div className="mb-8">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span className={plan.popular ? "text-violet-200" : "text-gray-500"}>
                  /month
                </span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 ${plan.popular ? "text-white" : "text-green-500"}`} />
                    <span className={plan.popular ? "text-violet-100" : "text-gray-600"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full text-center py-3.5 rounded-xl font-medium transition-all ${
                  plan.popular
                    ? "bg-white text-violet-600 hover:bg-violet-50"
                    : "border-2 border-gray-200 hover:bg-gray-50 text-gray-900"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Compare all features
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-medium text-gray-500">Feature</th>
                  <th className="text-center py-4 px-4 font-medium text-gray-500">Free</th>
                  <th className="text-center py-4 px-4 font-medium text-violet-600">Pro</th>
                  <th className="text-center py-4 px-4 font-medium text-gray-500">Business</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Unlimited links", free: true, pro: true, business: true },
                  { name: "Basic analytics", free: true, pro: true, business: true },
                  { name: "Pre-made themes", free: "5", pro: "20+", business: "20+" },
                  { name: "Custom themes", free: false, pro: true, business: true },
                  { name: "Custom CSS", free: false, pro: true, business: true },
                  { name: "Remove branding", free: false, pro: true, business: true },
                  { name: "Advanced analytics", free: false, pro: true, business: true },
                  { name: "Link scheduling", free: false, pro: true, business: true },
                  { name: "Custom domain", free: false, pro: false, business: true },
                  { name: "Team members", free: false, pro: false, business: "Unlimited" },
                  { name: "API access", free: false, pro: false, business: true },
                  { name: "Priority support", free: false, pro: true, business: true },
                  { name: "Dedicated support", free: false, pro: false, business: true },
                ].map((feature, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-900">{feature.name}</td>
                    <td className="text-center py-4 px-4">
                      {typeof feature.free === "boolean" ? (
                        feature.free ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )
                      ) : (
                        <span className="text-gray-900">{feature.free}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4 bg-violet-50">
                      {typeof feature.pro === "boolean" ? (
                        feature.pro ? (
                          <Check className="w-5 h-5 text-violet-600 mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )
                      ) : (
                        <span className="text-violet-600 font-medium">{feature.pro}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof feature.business === "boolean" ? (
                        feature.business ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )
                      ) : (
                        <span className="text-gray-900">{feature.business}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently asked questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-6 h-6 text-violet-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-violet-100 mb-8">
            Create your free page in under a minute
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-violet-600 px-8 py-4 rounded-xl font-medium text-lg hover:bg-violet-50 transition-colors"
          >
            Start For Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">LinkBio Pro</span>
          </div>
          <div className="flex items-center gap-6 text-gray-600">
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 LinkBio Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
