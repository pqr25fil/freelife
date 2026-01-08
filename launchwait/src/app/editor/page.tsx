'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Card } from '@/components/ui';
import { saveLandingPage, updateLandingPage, getLandingPageById } from '@/lib/storage';
import { slugify } from '@/lib/utils';
import { LandingPageConfig, DEFAULT_LANDING_CONFIG, Feature } from '@/types';
import { 
  Rocket, ArrowLeft, Eye, Save, Plus, Trash2,
  Palette, Type, Zap, Shield, Sparkles, 
  Users, Globe, Star, Heart, Target, Award, Loader2
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const iconOptions = [
  { name: 'Zap', icon: Zap },
  { name: 'Shield', icon: Shield },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Users', icon: Users },
  { name: 'Globe', icon: Globe },
  { name: 'Star', icon: Star },
  { name: 'Heart', icon: Heart },
  { name: 'Target', icon: Target },
  { name: 'Award', icon: Award },
  { name: 'Rocket', icon: Rocket },
];

const templatePresets = {
  gradient: {
    primaryColor: '#0ea5e9',
    secondaryColor: '#d946ef',
  },
  minimal: {
    primaryColor: '#374151',
    secondaryColor: '#6b7280',
  },
  dark: {
    primaryColor: '#1f2937',
    secondaryColor: '#7c3aed',
  },
  startup: {
    primaryColor: '#2563eb',
    secondaryColor: '#4f46e5',
  },
};

export default function EditorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<Omit<LandingPageConfig, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>({
    ...DEFAULT_LANDING_CONFIG,
  });
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/editor');
    }
  }, [status, router]);
  
  useEffect(() => {
    // Check if editing existing page
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      const page = getLandingPageById(id);
      if (page) {
        setEditId(id);
        setConfig({
          name: page.name,
          slug: page.slug,
          template: page.template,
          headline: page.headline,
          subheadline: page.subheadline,
          ctaText: page.ctaText,
          logoUrl: page.logoUrl,
          backgroundImage: page.backgroundImage,
          primaryColor: page.primaryColor,
          secondaryColor: page.secondaryColor,
          features: page.features,
          socialLinks: page.socialLinks,
        });
      }
    }
  }, []);
  
  const updateConfig = <K extends keyof typeof config>(key: K, value: typeof config[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    if (key === 'name') {
      setConfig(prev => ({ ...prev, slug: slugify(value as string) }));
    }
  };
  
  const selectTemplate = (template: LandingPageConfig['template']) => {
    const preset = templatePresets[template];
    setConfig(prev => ({
      ...prev,
      template,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
    }));
  };
  
  const addFeature = () => {
    const newFeature: Feature = {
      id: uuidv4(),
      icon: 'Zap',
      title: 'New Feature',
      description: 'Describe your feature here.',
    };
    setConfig(prev => ({
      ...prev,
      features: [...prev.features, newFeature],
    }));
  };
  
  const updateFeature = (id: string, updates: Partial<Feature>) => {
    setConfig(prev => ({
      ...prev,
      features: prev.features.map(f => f.id === id ? { ...f, ...updates } : f),
    }));
  };
  
  const deleteFeature = (id: string) => {
    setConfig(prev => ({
      ...prev,
      features: prev.features.filter(f => f.id !== id),
    }));
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const userId = (session?.user as { id?: string })?.id || session?.user?.email || 'anonymous';
      let page: LandingPageConfig;
      if (editId) {
        page = updateLandingPage(editId, config) as LandingPageConfig;
      } else {
        page = saveLandingPage(config, userId);
      }
      router.push(`/p/${page.slug}`);
    } catch (error) {
      console.error('Error saving page:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }
  
  // Not authenticated
  if (!session) {
    return null;
  }
  
  const getIconComponent = (iconName: string) => {
    const found = iconOptions.find(i => i.name === iconName);
    return found ? found.icon : Zap;
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-6">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                {editId ? 'Edit Page' : 'Create Landing Page'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href={`/p/${config.slug}`} target="_blank">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </Link>
              <Button size="sm" onClick={handleSave} isLoading={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {editId ? 'Update' : 'Save & Launch'}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card variant="elevated">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2 text-primary-500" />
                Basic Information
              </h2>
              <div className="space-y-4">
                <Input
                  label="Project Name"
                  value={config.name}
                  onChange={(e) => updateConfig('name', e.target.value)}
                  placeholder="My Awesome Startup"
                />
                <Input
                  label="URL Slug"
                  value={config.slug}
                  onChange={(e) => updateConfig('slug', slugify(e.target.value))}
                  placeholder="my-awesome-startup"
                />
                <div className="text-sm text-gray-500">
                  Your page URL: <span className="font-mono text-primary-600">launchwait.com/p/{config.slug || 'your-slug'}</span>
                </div>
              </div>
            </Card>
            
            {/* Template Selection */}
            <Card variant="elevated">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2 text-primary-500" />
                Choose Template
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(templatePresets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => selectTemplate(key as LandingPageConfig['template'])}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      config.template === key 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div 
                      className="h-20 rounded-lg mb-2"
                      style={{
                        background: `linear-gradient(135deg, ${preset.primaryColor}, ${preset.secondaryColor})`,
                      }}
                    />
                    <span className="font-medium capitalize">{key}</span>
                  </button>
                ))}
              </div>
            </Card>
            
            {/* Content */}
            <Card variant="elevated">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2 text-primary-500" />
                Page Content
              </h2>
              <div className="space-y-4">
                <Input
                  label="Headline"
                  value={config.headline}
                  onChange={(e) => updateConfig('headline', e.target.value)}
                  placeholder="The Future of Innovation Starts Here"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subheadline
                  </label>
                  <textarea
                    value={config.subheadline}
                    onChange={(e) => updateConfig('subheadline', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Join thousands of early adopters..."
                  />
                </div>
                <Input
                  label="CTA Button Text"
                  value={config.ctaText}
                  onChange={(e) => updateConfig('ctaText', e.target.value)}
                  placeholder="Join the Waitlist"
                />
              </div>
            </Card>
            
            {/* Colors */}
            <Card variant="elevated">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2 text-primary-500" />
                Brand Colors
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => updateConfig('primaryColor', e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => updateConfig('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                    />
                    <Input
                      value={config.secondaryColor}
                      onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Features */}
            <Card variant="elevated">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary-500" />
                  Features
                </h2>
                <Button variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Feature
                </Button>
              </div>
              <div className="space-y-4">
                {config.features.map((feature) => (
                  <div key={feature.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <select
                        value={feature.icon}
                        onChange={(e) => updateFeature(feature.id, { icon: e.target.value })}
                        className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {iconOptions.map((opt) => (
                          <option key={opt.name} value={opt.name}>{opt.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => deleteFeature(feature.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <Input
                      value={feature.title}
                      onChange={(e) => updateFeature(feature.id, { title: e.target.value })}
                      placeholder="Feature Title"
                      className="mb-2"
                    />
                    <textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(feature.id, { description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      placeholder="Feature description..."
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Live Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card variant="elevated" className="overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div 
                  className="p-8 min-h-[500px]"
                  style={{
                    background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`,
                  }}
                >
                  <div className="max-w-md mx-auto text-center text-white">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                      <Rocket className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 leading-tight">
                      {config.headline || 'Your Headline Here'}
                    </h2>
                    <p className="text-white/80 text-sm mb-6">
                      {config.subheadline || 'Your subheadline will appear here...'}
                    </p>
                    <div className="flex gap-2 mb-4">
                      <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm"
                        readOnly
                      />
                      <button 
                        className="px-4 py-2.5 bg-white rounded-lg font-semibold text-sm whitespace-nowrap"
                        style={{ color: config.primaryColor }}
                      >
                        {config.ctaText || 'Join'}
                      </button>
                    </div>
                    {config.features.length > 0 && (
                      <div className="mt-8 pt-8 border-t border-white/20">
                        <div className="grid grid-cols-1 gap-4">
                          {config.features.slice(0, 3).map((feature) => {
                            const IconComp = getIconComponent(feature.icon);
                            return (
                              <div key={feature.id} className="flex items-start text-left">
                                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mr-3 flex-shrink-0">
                                  <IconComp className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm">{feature.title}</h4>
                                  <p className="text-white/70 text-xs">{feature.description}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
