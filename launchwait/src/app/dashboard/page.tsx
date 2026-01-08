'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { 
  getLandingPages, 
  deleteLandingPage, 
  getSubscribers, 
  getAnalytics,
  exportSubscribersCSV 
} from '@/lib/storage';
import { formatNumber, formatDate, downloadFile, copyToClipboard } from '@/lib/utils';
import { LandingPageConfig, Analytics } from '@/types';
import { 
  Plus, Eye, Edit, Trash2, Download, Copy, Check,
  BarChart3, Users, MousePointer, TrendingUp,
  Rocket, ExternalLink, ArrowLeft, Search
} from 'lucide-react';

export default function DashboardPage() {
  const [pages, setPages] = useState<LandingPageConfig[]>([]);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [subscribers, setSubscribers] = useState<{ email: string; subscribedAt: Date }[]>([]);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadPages();
  }, []);
  
  useEffect(() => {
    if (selectedPage) {
      const pageAnalytics = getAnalytics(selectedPage);
      setAnalytics(pageAnalytics);
      const pageSubs = getSubscribers(selectedPage);
      setSubscribers(pageSubs.map(s => ({ email: s.email, subscribedAt: new Date(s.subscribedAt) })));
    } else {
      setAnalytics(null);
      setSubscribers([]);
    }
  }, [selectedPage]);
  
  const loadPages = () => {
    const loadedPages = getLandingPages();
    setPages(loadedPages);
    if (loadedPages.length > 0 && !selectedPage) {
      setSelectedPage(loadedPages[0].id);
    }
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      deleteLandingPage(id);
      loadPages();
      if (selectedPage === id) {
        setSelectedPage(null);
      }
    }
  };
  
  const handleExport = () => {
    if (!selectedPage) return;
    const csv = exportSubscribersCSV(selectedPage);
    const page = pages.find(p => p.id === selectedPage);
    downloadFile(csv, `${page?.slug || 'subscribers'}-emails.csv`, 'text/csv');
  };
  
  const handleCopyLink = async (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    await copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const filteredPages = pages.filter(page => 
    page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const selectedPageData = pages.find(p => p.id === selectedPage);
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-6">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Home
              </Link>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mr-3">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              </div>
            </div>
            <Link href="/editor">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Page
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pages.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No landing pages yet</h2>
            <p className="text-gray-600 mb-8">Create your first waitlist page to start collecting emails.</p>
            <Link href="/editor">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Page
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Pages List */}
            <div className="lg:col-span-1">
              <Card variant="elevated" className="sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Your Pages</h2>
                  <span className="text-sm text-gray-500">{pages.length} pages</span>
                </div>
                
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search pages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                {/* Pages */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredPages.map((page) => (
                    <div
                      key={page.id}
                      onClick={() => setSelectedPage(page.id)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedPage === page.id
                          ? 'bg-primary-50 border-2 border-primary-500'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{page.name}</h3>
                          <p className="text-sm text-gray-500 truncate">/p/{page.slug}</p>
                        </div>
                        <div 
                          className="w-8 h-8 rounded-lg flex-shrink-0 ml-2"
                          style={{
                            background: `linear-gradient(135deg, ${page.primaryColor}, ${page.secondaryColor})`,
                          }}
                        />
                      </div>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Users className="w-3 h-3 mr-1" />
                        {getSubscribers(page.id).length} subscribers
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {selectedPageData && (
                <>
                  {/* Page Header */}
                  <Card variant="elevated">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedPageData.name}</h2>
                        <p className="text-gray-500">{selectedPageData.headline}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyLink(selectedPageData.slug)}
                        >
                          {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                          {copied ? 'Copied!' : 'Copy Link'}
                        </Button>
                        <Link href={`/p/${selectedPageData.slug}`} target="_blank">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/editor?id=${selectedPageData.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(selectedPageData.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Stats Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card variant="elevated" className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Eye className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(analytics?.totalViews || 0)}
                      </p>
                      <p className="text-sm text-gray-500">Total Views</p>
                    </Card>
                    <Card variant="elevated" className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(subscribers.length)}
                      </p>
                      <p className="text-sm text-gray-500">Subscribers</p>
                    </Card>
                    <Card variant="elevated" className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <MousePointer className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(analytics?.uniqueViews || 0)}
                      </p>
                      <p className="text-sm text-gray-500">Unique Visitors</p>
                    </Card>
                    <Card variant="elevated" className="text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {(analytics?.conversionRate || 0).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-500">Conversion Rate</p>
                    </Card>
                  </div>
                  
                  {/* Subscribers Table */}
                  <Card variant="elevated">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Subscribers</h3>
                      {subscribers.length > 0 && (
                        <Button variant="outline" size="sm" onClick={handleExport}>
                          <Download className="w-4 h-4 mr-1" />
                          Export CSV
                        </Button>
                      )}
                    </div>
                    
                    {subscribers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No subscribers yet</p>
                        <p className="text-sm">Share your page to start collecting emails!</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Subscribed</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subscribers.slice(0, 10).map((sub, index) => (
                              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-900">{sub.email}</td>
                                <td className="py-3 px-4 text-gray-500 text-sm">
                                  {formatDate(sub.subscribedAt)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {subscribers.length > 10 && (
                          <p className="text-center text-sm text-gray-500 py-4">
                            Showing 10 of {subscribers.length} subscribers. Export CSV to see all.
                          </p>
                        )}
                      </div>
                    )}
                  </Card>
                  
                  {/* Quick Share */}
                  <Card variant="elevated">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Page</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 p-3 bg-gray-100 rounded-lg font-mono text-sm text-gray-700 overflow-x-auto">
                        {typeof window !== 'undefined' && `${window.location.origin}/p/${selectedPageData.slug}`}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleCopyLink(selectedPageData.slug)}
                      >
                        {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                        Copy
                      </Button>
                      <Link href={`/p/${selectedPageData.slug}`} target="_blank">
                        <Button>
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Open
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
