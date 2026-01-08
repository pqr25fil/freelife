'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getLandingPageBySlug, addSubscriber, getSubscribers, recordPageView } from '@/lib/storage';
import { isValidEmail } from '@/lib/utils';
import { LandingPageConfig, DEFAULT_LANDING_CONFIG, Feature } from '@/types';
import { 
  Rocket, Mail, Check, AlertCircle, 
  Zap, Shield, Sparkles, Users, Globe, Star, Heart, Target, Award,
  Twitter, Linkedin, Instagram, Github
} from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
  Zap, Shield, Sparkles, Users, Globe, Star, Heart, Target, Award, Rocket
};

export default function LandingPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [config, setConfig] = useState<LandingPageConfig | null>(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    // Try to get page from storage
    const page = getLandingPageBySlug(slug);
    if (page) {
      setConfig(page);
      const subs = getSubscribers(page.id);
      setSubscriberCount(subs.length);
      // Record page view
      recordPageView(page.id);
    } else {
      // Use demo config for preview
      setConfig({
        ...DEFAULT_LANDING_CONFIG,
        id: 'demo',
        userId: 'demo',
        slug: slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }, [slug]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (config && config.id !== 'demo') {
        addSubscriber(email, config.id, document.referrer || undefined);
        setSubscriberCount(prev => prev + 1);
      }
      
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Zap;
  };
  
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="text-primary-500 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`,
      }}
    >
      <div className="min-h-screen flex flex-col">
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-2xl w-full text-center text-white">
            {/* Logo */}
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              {config.logoUrl ? (
                <img src={config.logoUrl} alt={config.name} className="w-12 h-12 object-contain" />
              ) : (
                <Rocket className="w-10 h-10" />
              )}
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {config.headline}
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-white/80 mb-10 max-w-lg mx-auto">
              {config.subheadline}
            </p>
            
            {/* Email Form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-white rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{ color: config.primaryColor }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Joining...
                      </span>
                    ) : (
                      config.ctaText
                    )}
                  </button>
                </div>
                {error && (
                  <div className="flex items-center justify-center mt-3 text-red-200">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </form>
            ) : (
              <div className="max-w-md mx-auto mb-8 p-6 rounded-xl bg-white/10 border border-white/20">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">You&apos;re on the list!</h3>
                <p className="text-white/80">
                  Thanks for joining! We&apos;ll notify you when we launch.
                </p>
              </div>
            )}
            
            {/* Subscriber Count */}
            {subscriberCount > 0 && (
              <p className="text-white/60 mb-12">
                <Users className="w-4 h-4 inline mr-2" />
                {subscriberCount.toLocaleString()} {subscriberCount === 1 ? 'person has' : 'people have'} joined the waitlist
              </p>
            )}
            
            {/* Features */}
            {config.features.length > 0 && (
              <div className="grid sm:grid-cols-3 gap-6 mt-16">
                {config.features.map((feature) => {
                  const IconComp = getIcon(feature.icon);
                  return (
                    <div 
                      key={feature.id} 
                      className="p-6 rounded-xl bg-white/10 border border-white/10 text-left"
                    >
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                      >
                        <IconComp className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-white/70">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Social Links */}
            {config.socialLinks.length > 0 && (
              <div className="flex items-center justify-center space-x-4 mt-12">
                {config.socialLinks.map((link, index) => {
                  const icons: { [key: string]: React.ElementType } = {
                    twitter: Twitter,
                    linkedin: Linkedin,
                    instagram: Instagram,
                    github: Github,
                  };
                  const SocialIcon = icons[link.platform] || Globe;
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <SocialIcon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="py-6 text-center text-white/50 text-sm">
          <p>
            Powered by{' '}
            <Link href="/" className="underline hover:text-white/80 transition-colors">
              LaunchWait
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
