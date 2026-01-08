export interface LandingPageConfig {
  id: string;
  name: string;
  slug: string;
  template: 'minimal' | 'gradient' | 'dark' | 'startup';
  headline: string;
  subheadline: string;
  ctaText: string;
  logoUrl?: string;
  backgroundImage?: string;
  primaryColor: string;
  secondaryColor: string;
  features: Feature[];
  socialLinks: SocialLink[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'github' | 'discord';
  url: string;
}

export interface Subscriber {
  id: string;
  email: string;
  landingPageId: string;
  subscribedAt: Date;
  referrer?: string;
}

export interface Analytics {
  landingPageId: string;
  totalViews: number;
  uniqueViews: number;
  totalSubscribers: number;
  conversionRate: number;
  viewsByDay: { date: string; views: number }[];
  subscribersByDay: { date: string; count: number }[];
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  highlighted?: boolean;
  ctaText: string;
}

export const DEFAULT_LANDING_CONFIG: Omit<LandingPageConfig, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'My Startup',
  slug: 'my-startup',
  template: 'gradient',
  headline: 'The Future of Innovation Starts Here',
  subheadline: 'Join thousands of early adopters and be the first to experience our revolutionary product. Sign up for exclusive early access.',
  ctaText: 'Join the Waitlist',
  primaryColor: '#0ea5e9',
  secondaryColor: '#d946ef',
  features: [
    {
      id: '1',
      icon: 'Zap',
      title: 'Lightning Fast',
      description: 'Built for speed and performance from the ground up.',
    },
    {
      id: '2',
      icon: 'Shield',
      title: 'Secure by Design',
      description: 'Enterprise-grade security you can trust.',
    },
    {
      id: '3',
      icon: 'Sparkles',
      title: 'AI-Powered',
      description: 'Smart features that learn and adapt to your needs.',
    },
  ],
  socialLinks: [],
};

export const TEMPLATES = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design',
    preview: '/templates/minimal.png',
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Modern gradient aesthetics',
    preview: '/templates/gradient.png',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Sleek dark theme',
    preview: '/templates/dark.png',
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Professional startup look',
    preview: '/templates/startup.png',
  },
] as const;
