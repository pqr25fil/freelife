import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Link2, 
  BarChart3, 
  Palette, 
  Zap,
  Check,
  Star,
  Users,
  MousePointerClick
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">LinkBio Pro</span>
          </div>
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Trusted by 10,000+ creators
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            One link for
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}everything{" "}
            </span>
            you create
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create a beautiful, customizable page to share all your important links.
            Perfect for Instagram, TikTok, Twitter, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-medium text-lg hover:from-violet-700 hover:to-indigo-700 transition-all shadow-xl shadow-violet-500/25"
            >
              Create Your Page
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-medium text-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="max-w-5xl mx-auto mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Dashboard Preview */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg" />
                  <div>
                    <p className="font-medium">Dashboard</p>
                    <p className="text-xs text-gray-500">Manage your links</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {["Instagram", "YouTube", "Portfolio", "Contact"].map((item, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                      <span className="font-medium text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Phone Preview */}
              <div className="flex justify-center">
                <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
                  <div className="bg-gradient-to-br from-violet-100 to-indigo-100 rounded-[2rem] w-64 h-[450px] overflow-hidden">
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full mb-4" />
                      <h3 className="font-bold">@yourusername</h3>
                      <p className="text-sm text-gray-600 mt-1">Creator & Designer</p>
                      <div className="mt-6 space-y-3">
                        {["My Website", "Shop Now", "Latest Video"].map((item, i) => (
                          <div key={i} className="bg-white rounded-xl p-3 text-sm font-medium shadow-sm">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">10K+</div>
            <div className="text-gray-600">Creators</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">1M+</div>
            <div className="text-gray-600">Link Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to help you grow your audience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Link2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Unlimited Links</h3>
              <p className="text-gray-600">
                Add as many links as you need. Social profiles, websites, videos, music, and more.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Detailed Analytics</h3>
              <p className="text-gray-600">
                Track clicks, views, and visitor locations. Understand what content performs best.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Palette className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Themes</h3>
              <p className="text-gray-600">
                Choose from beautiful pre-made themes or create your own unique style.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Optimized for speed. Your page loads instantly for the best user experience.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Team Collaboration</h3>
              <p className="text-gray-600">
                Invite team members to help manage your links and content together.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <MousePointerClick className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Click Tracking</h3>
              <p className="text-gray-600">
                See exactly which links get the most engagement and optimize accordingly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Start free, upgrade when you need more
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Unlimited links", "Basic themes", "Basic analytics", "LinkBio.pro branding"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full text-center py-3 rounded-xl border-2 border-gray-200 font-medium hover:bg-gray-50 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-8 text-left text-white relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-lg font-bold mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$5</span>
                <span className="text-violet-200">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Everything in Free", "Remove branding", "Custom themes", "Priority support", "Advanced analytics"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-violet-100">
                    <Check className="w-5 h-5 text-white" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full text-center py-3 rounded-xl bg-white text-violet-600 font-medium hover:bg-violet-50 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Business */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Business</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$15</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Everything in Pro", "Team members", "Custom domain", "API access", "Dedicated support"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full text-center py-3 rounded-xl border-2 border-gray-200 font-medium hover:bg-gray-50 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
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
            Join thousands of creators who trust LinkBio Pro
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-violet-600 px-8 py-4 rounded-xl font-medium text-lg hover:bg-violet-50 transition-colors"
          >
            Create Your Free Page
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
