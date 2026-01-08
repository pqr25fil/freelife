'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button, Card } from '@/components/ui';
import { 
  Rocket, Zap, BarChart3, Palette, Mail, Globe, 
  Check, ArrowRight, Sparkles, Shield, Users, Download
} from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Beautiful Templates',
    description: 'Choose from professionally designed templates that convert visitors into subscribers.',
  },
  {
    icon: BarChart3,
    title: 'Built-in Analytics',
    description: 'Track page views, unique visitors, and conversion rates in real-time.',
  },
  {
    icon: Mail,
    title: 'Email Collection',
    description: 'Automatically collect and manage email subscribers with export functionality.',
  },
  {
    icon: Zap,
    title: 'Instant Setup',
    description: 'Create your waitlist page in under 5 minutes. No coding required.',
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    description: 'Use your own domain for a professional branded experience.',
  },
  {
    icon: Download,
    title: 'CSV Export',
    description: 'Export your subscriber list anytime as CSV for use in your favorite tools.',
  },
];

const templates = [
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Modern gradient aesthetics',
    gradient: 'from-primary-500 to-accent-500',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design',
    gradient: 'from-gray-800 to-gray-600',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Sleek dark theme',
    gradient: 'from-gray-900 to-purple-900',
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Professional startup look',
    gradient: 'from-blue-600 to-indigo-600',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for testing your idea',
    features: [
      '1 Landing Page',
      'Up to 100 Subscribers',
      'Basic Analytics',
      'LaunchWait Branding',
      'Email Support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 9,
    description: 'For growing startups',
    features: [
      'Unlimited Landing Pages',
      'Unlimited Subscribers',
      'Advanced Analytics',
      'No Branding',
      'Custom Domain',
      'CSV Export',
      'Priority Support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Business',
    price: 29,
    description: 'For teams and agencies',
    features: [
      'Everything in Pro',
      'Team Collaboration',
      'API Access',
      'Webhook Integration',
      'White Label',
      'Dedicated Support',
      'Custom Integrations',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const stats = [
  { value: '10K+', label: 'Startups Launched' },
  { value: '1M+', label: 'Emails Collected' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'Customer Rating' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-primary-500 mr-2" />
              <span className="text-sm font-medium text-primary-700">
                Launch your startup with style
              </span>
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Beautiful Waitlist Pages{' '}
              <span className="gradient-text">in Minutes</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Create stunning landing pages, collect emails, and track analytics. 
              Everything you need to validate your startup idea and build your audience.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/editor">
                <Button size="lg" className="w-full sm:w-auto">
                  Create Your Page <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#templates">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Templates
                </Button>
              </Link>
            </div>
            
            {/* Hero Image / Preview */}
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl p-12 text-white">
                  <div className="max-w-md mx-auto text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Rocket className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Your Startup Name</h2>
                    <p className="text-white/80 mb-8">Join thousands of early adopters and be the first to experience our product.</p>
                    <div className="flex gap-2">
                      <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                        readOnly
                      />
                      <button className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold">
                        Join Waitlist
                      </button>
                    </div>
                    <p className="text-sm text-white/60 mt-4">1,234 people already on the waitlist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Launch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features to help you collect leads and grow your audience before launch.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} variant="bordered" hover className="group">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Templates Section */}
      <section id="templates" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Template
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start with a beautifully designed template and customize it to match your brand.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <Link href="/editor" key={template.id}>
                <Card variant="elevated" hover className="overflow-hidden group">
                  <div className={`h-40 bg-gradient-to-br ${template.gradient} rounded-lg mb-4 flex items-center justify-center`}>
                    <Rocket className="w-12 h-12 text-white/50 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Launch in 3 Simple Steps
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Choose Template', description: 'Pick a template that matches your brand and vision.' },
              { step: '2', title: 'Customize', description: 'Add your content, colors, and logo. No coding needed.' },
              { step: '3', title: 'Launch', description: 'Share your page and start collecting email subscribers.' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                variant="elevated" 
                className={`relative ${plan.highlighted ? 'border-2 border-primary-500 scale-105' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    {plan.price > 0 && <span className="text-gray-600">/month</span>}
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/editor">
                  <Button 
                    variant={plan.highlighted ? 'primary' : 'outline'} 
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Social Proof */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Founders Worldwide
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Chen', role: 'Founder, TechFlow', quote: 'LaunchWait helped us collect 5,000 emails before launch. The conversion rate was incredible!' },
              { name: 'Marcus Johnson', role: 'CEO, DataSync', quote: 'Beautiful templates and super easy to set up. We were live in under 10 minutes.' },
              { name: 'Elena Rodriguez', role: 'Co-founder, GreenTech', quote: 'The analytics dashboard is a game changer. We knew exactly where our traffic was coming from.' },
            ].map((testimonial, index) => (
              <Card key={index} variant="bordered" className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <p className="text-gray-600 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-bg rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Launch Your Startup?</h2>
            <p className="text-xl text-white/80 mb-8">
              Create your waitlist page in minutes and start building your audience today.
            </p>
            <Link href="/editor">
              <Button 
                size="lg" 
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                Create Your Page for Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
