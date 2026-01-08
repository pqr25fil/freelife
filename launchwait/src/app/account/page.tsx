'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Input } from '@/components/ui';
import { PLANS } from '@/lib/stripe';
import {
  User, Mail, CreditCard, Shield, LogOut, ArrowLeft,
  Check, Crown, Zap, Building2, Loader2, ExternalLink,
  Rocket, CheckCircle, XCircle
} from 'lucide-react';

function AccountContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/account');
    }
  }, [status, router]);
  
  const currentPlan = (session?.user as { plan?: string })?.plan || 'free';
  
  const handleUpgrade = async (plan: string) => {
    setIsLoading(true);
    setSelectedPlan(plan);
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, interval: billingInterval }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };
  
  const handleManageSubscription = async () => {
    setPortalLoading(true);
    
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to open billing portal');
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('An error occurred');
    } finally {
      setPortalLoading(false);
    }
  };
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }
  
  if (!session) {
    return null;
  }
  
  const planIcons = {
    free: Zap,
    pro: Crown,
    business: Building2,
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mr-6">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Dashboard
              </Link>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mr-3">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Account Settings</h1>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Your subscription has been activated successfully!</span>
          </div>
        )}
        
        {canceled && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center text-yellow-700">
            <XCircle className="w-5 h-5 mr-2" />
            <span>Checkout was canceled. No changes were made.</span>
          </div>
        )}
        
        {/* Profile Section */}
        <Card variant="elevated" className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <User className="w-5 h-5 mr-2 text-primary-500" />
            Profile Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Name"
                value={session.user?.name || ''}
                disabled
                icon={<User className="w-5 h-5" />}
              />
            </div>
            <div>
              <Input
                label="Email"
                value={session.user?.email || ''}
                disabled
                icon={<Mail className="w-5 h-5" />}
              />
            </div>
          </div>
        </Card>
        
        {/* Current Plan */}
        <Card variant="elevated" className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-primary-500" />
            Current Plan
          </h2>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl">
            <div className="flex items-center">
              {(() => {
                const PlanIcon = planIcons[currentPlan as keyof typeof planIcons] || Zap;
                return (
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mr-4">
                    <PlanIcon className="w-6 h-6 text-white" />
                  </div>
                );
              })()}
              <div>
                <h3 className="text-xl font-bold text-gray-900 capitalize">{currentPlan} Plan</h3>
                <p className="text-gray-600">
                  {currentPlan === 'free' 
                    ? 'Upgrade to unlock more features'
                    : 'Thank you for being a subscriber!'
                  }
                </p>
              </div>
            </div>
            {currentPlan !== 'free' && (
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                isLoading={portalLoading}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
            )}
          </div>
        </Card>
        
        {/* Upgrade Plans */}
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-primary-500" />
              {currentPlan === 'free' ? 'Upgrade Your Plan' : 'Change Plan'}
            </h2>
            
            {/* Billing Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingInterval === 'monthly'
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingInterval === 'yearly'
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly <span className="text-green-600 text-xs">Save 17%</span>
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className={`p-6 rounded-xl border-2 ${currentPlan === 'free' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
              <div className="flex items-center mb-4">
                <Zap className="w-6 h-6 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold">Free</h3>
                {currentPlan === 'free' && (
                  <span className="ml-auto text-xs bg-primary-500 text-white px-2 py-1 rounded-full">Current</span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                {PLANS.free.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              {currentPlan !== 'free' && (
                <Button variant="outline" className="w-full" disabled>
                  Downgrade
                </Button>
              )}
            </div>
            
            {/* Pro Plan */}
            <div className={`p-6 rounded-xl border-2 ${currentPlan === 'pro' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'} relative`}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-medium rounded-full">
                Popular
              </div>
              <div className="flex items-center mb-4">
                <Crown className="w-6 h-6 text-primary-500 mr-2" />
                <h3 className="text-lg font-semibold">Pro</h3>
                {currentPlan === 'pro' && (
                  <span className="ml-auto text-xs bg-primary-500 text-white px-2 py-1 rounded-full">Current</span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  ${billingInterval === 'monthly' ? PLANS.pro.price.monthly : Math.round(PLANS.pro.price.yearly / 12)}
                </span>
                <span className="text-gray-600">/month</span>
                {billingInterval === 'yearly' && (
                  <span className="block text-sm text-gray-500">billed annually</span>
                )}
              </div>
              <ul className="space-y-2 mb-6">
                {PLANS.pro.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              {currentPlan !== 'pro' && (
                <Button 
                  className="w-full" 
                  onClick={() => handleUpgrade('pro')}
                  isLoading={isLoading && selectedPlan === 'pro'}
                >
                  {currentPlan === 'business' ? 'Downgrade to Pro' : 'Upgrade to Pro'}
                </Button>
              )}
              {currentPlan === 'pro' && (
                <Button variant="outline" className="w-full" onClick={handleManageSubscription}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              )}
            </div>
            
            {/* Business Plan */}
            <div className={`p-6 rounded-xl border-2 ${currentPlan === 'business' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
              <div className="flex items-center mb-4">
                <Building2 className="w-6 h-6 text-accent-500 mr-2" />
                <h3 className="text-lg font-semibold">Business</h3>
                {currentPlan === 'business' && (
                  <span className="ml-auto text-xs bg-primary-500 text-white px-2 py-1 rounded-full">Current</span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  ${billingInterval === 'monthly' ? PLANS.business.price.monthly : Math.round(PLANS.business.price.yearly / 12)}
                </span>
                <span className="text-gray-600">/month</span>
                {billingInterval === 'yearly' && (
                  <span className="block text-sm text-gray-500">billed annually</span>
                )}
              </div>
              <ul className="space-y-2 mb-6">
                {PLANS.business.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              {currentPlan !== 'business' && (
                <Button 
                  variant="secondary"
                  className="w-full" 
                  onClick={() => handleUpgrade('business')}
                  isLoading={isLoading && selectedPlan === 'business'}
                >
                  Upgrade to Business
                </Button>
              )}
              {currentPlan === 'business' && (
                <Button variant="outline" className="w-full" onClick={handleManageSubscription}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              )}
            </div>
          </div>
          
          {/* Note */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <strong>Note:</strong> This is a demo. In production, you would configure real Stripe price IDs and webhook endpoints.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
