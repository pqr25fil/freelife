'use client';

import { LandingPageConfig, Subscriber, Analytics } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  LANDING_PAGES: 'launchwait_landing_pages',
  SUBSCRIBERS: 'launchwait_subscribers',
  ANALYTICS: 'launchwait_analytics',
};

// Landing Pages
export function getLandingPages(): LandingPageConfig[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.LANDING_PAGES);
  return data ? JSON.parse(data) : [];
}

export function getLandingPageById(id: string): LandingPageConfig | null {
  const pages = getLandingPages();
  return pages.find((p) => p.id === id) || null;
}

export function getLandingPageBySlug(slug: string): LandingPageConfig | null {
  const pages = getLandingPages();
  return pages.find((p) => p.slug === slug) || null;
}

export function saveLandingPage(
  page: Omit<LandingPageConfig, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  userId: string = 'anonymous'
): LandingPageConfig {
  const pages = getLandingPages();
  const newPage: LandingPageConfig = {
    ...page,
    id: uuidv4(),
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  pages.push(newPage);
  localStorage.setItem(STORAGE_KEYS.LANDING_PAGES, JSON.stringify(pages));
  return newPage;
}

export function getLandingPagesByUserId(userId: string): LandingPageConfig[] {
  const pages = getLandingPages();
  return pages.filter((p) => p.userId === userId);
}

export function updateLandingPage(id: string, updates: Partial<LandingPageConfig>): LandingPageConfig | null {
  const pages = getLandingPages();
  const index = pages.findIndex((p) => p.id === id);
  if (index === -1) return null;
  
  pages[index] = {
    ...pages[index],
    ...updates,
    updatedAt: new Date(),
  };
  localStorage.setItem(STORAGE_KEYS.LANDING_PAGES, JSON.stringify(pages));
  return pages[index];
}

export function deleteLandingPage(id: string): boolean {
  const pages = getLandingPages();
  const filtered = pages.filter((p) => p.id !== id);
  if (filtered.length === pages.length) return false;
  localStorage.setItem(STORAGE_KEYS.LANDING_PAGES, JSON.stringify(filtered));
  return true;
}

// Subscribers
export function getSubscribers(landingPageId?: string): Subscriber[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
  const subscribers: Subscriber[] = data ? JSON.parse(data) : [];
  if (landingPageId) {
    return subscribers.filter((s) => s.landingPageId === landingPageId);
  }
  return subscribers;
}

export function addSubscriber(email: string, landingPageId: string, referrer?: string): Subscriber {
  const subscribers = getSubscribers();
  
  // Check if already subscribed
  const existing = subscribers.find(
    (s) => s.email === email && s.landingPageId === landingPageId
  );
  if (existing) return existing;
  
  const newSubscriber: Subscriber = {
    id: uuidv4(),
    email,
    landingPageId,
    subscribedAt: new Date(),
    referrer,
  };
  subscribers.push(newSubscriber);
  localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
  
  // Update analytics
  incrementSubscriberCount(landingPageId);
  
  return newSubscriber;
}

export function deleteSubscriber(id: string): boolean {
  const subscribers = getSubscribers();
  const filtered = subscribers.filter((s) => s.id !== id);
  if (filtered.length === subscribers.length) return false;
  localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(filtered));
  return true;
}

export function exportSubscribersCSV(landingPageId: string): string {
  const subscribers = getSubscribers(landingPageId);
  const headers = ['Email', 'Subscribed At', 'Referrer'];
  const rows = subscribers.map((s) => [
    s.email,
    new Date(s.subscribedAt).toISOString(),
    s.referrer || '',
  ]);
  return [headers, ...rows].map((row) => row.join(',')).join('\n');
}

// Analytics
export function getAnalytics(landingPageId: string): Analytics {
  if (typeof window === 'undefined') {
    return createEmptyAnalytics(landingPageId);
  }
  const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
  const allAnalytics: Analytics[] = data ? JSON.parse(data) : [];
  const analytics = allAnalytics.find((a) => a.landingPageId === landingPageId);
  return analytics || createEmptyAnalytics(landingPageId);
}

function createEmptyAnalytics(landingPageId: string): Analytics {
  return {
    landingPageId,
    totalViews: 0,
    uniqueViews: 0,
    totalSubscribers: 0,
    conversionRate: 0,
    viewsByDay: [],
    subscribersByDay: [],
  };
}

export function recordPageView(landingPageId: string): void {
  if (typeof window === 'undefined') return;
  
  const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
  const allAnalytics: Analytics[] = data ? JSON.parse(data) : [];
  let analytics = allAnalytics.find((a) => a.landingPageId === landingPageId);
  
  const today = new Date().toISOString().split('T')[0];
  
  if (!analytics) {
    analytics = createEmptyAnalytics(landingPageId);
    allAnalytics.push(analytics);
  }
  
  analytics.totalViews += 1;
  
  // Check for unique view (simple implementation using sessionStorage)
  const viewedKey = `viewed_${landingPageId}`;
  if (!sessionStorage.getItem(viewedKey)) {
    analytics.uniqueViews += 1;
    sessionStorage.setItem(viewedKey, 'true');
  }
  
  // Update views by day
  const todayEntry = analytics.viewsByDay.find((v) => v.date === today);
  if (todayEntry) {
    todayEntry.views += 1;
  } else {
    analytics.viewsByDay.push({ date: today, views: 1 });
  }
  
  // Recalculate conversion rate
  if (analytics.uniqueViews > 0) {
    analytics.conversionRate = (analytics.totalSubscribers / analytics.uniqueViews) * 100;
  }
  
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(allAnalytics));
}

function incrementSubscriberCount(landingPageId: string): void {
  const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
  const allAnalytics: Analytics[] = data ? JSON.parse(data) : [];
  let analytics = allAnalytics.find((a) => a.landingPageId === landingPageId);
  
  const today = new Date().toISOString().split('T')[0];
  
  if (!analytics) {
    analytics = createEmptyAnalytics(landingPageId);
    allAnalytics.push(analytics);
  }
  
  analytics.totalSubscribers += 1;
  
  // Update subscribers by day
  const todayEntry = analytics.subscribersByDay.find((s) => s.date === today);
  if (todayEntry) {
    todayEntry.count += 1;
  } else {
    analytics.subscribersByDay.push({ date: today, count: 1 });
  }
  
  // Recalculate conversion rate
  if (analytics.uniqueViews > 0) {
    analytics.conversionRate = (analytics.totalSubscribers / analytics.uniqueViews) * 100;
  }
  
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(allAnalytics));
}
