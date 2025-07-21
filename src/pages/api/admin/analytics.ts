import { NextApiRequest, NextApiResponse } from 'next';
import { getGA4Service, getMockAnalyticsData } from '@/lib/ga4';

interface AnalyticsData {
  pageViews: {
    total: number;
    thisMonth: number;
    thisWeek: number;
    today: number;
  };
  subscribers: {
    total: number;
    thisMonth: number;
    thisWeek: number;
    conversionRate: number;
  };
  topPages: Array<{
    path: string;
    views: number;
    percentage: number;
  }>;
  sources: Array<{
    source: string;
    subscribers: number;
    percentage: number;
  }>;
  timeline: Array<{
    date: string;
    pageViews: number;
    subscribers: number;
  }>;
}

interface AdminApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Rate limiting store (same pattern as existing APIs)
const rateLimitStore = new Map();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 10; // Higher limit for admin API
  
  const key = `admin_analytics_${ip}`;
  const attempts = rateLimitStore.get(key) || [];
  
  // Clean old attempts
  const validAttempts = attempts.filter((time: number) => now - time < windowMs);
  
  if (validAttempts.length >= maxAttempts) {
    return false;
  }
  
  validAttempts.push(now);
  rateLimitStore.set(key, validAttempts);
  
  return true;
}

function getClientIP(headers: Record<string, string | string[] | undefined>): string {
  const forwarded = headers['x-forwarded-for'];
  const realIP = headers['x-real-ip'];
  
  if (forwarded) {
    return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return Array.isArray(realIP) ? realIP[0] : realIP;
  }
  
  return 'unknown';
}

function validateOrigin(headers: Record<string, string | string[] | undefined>): boolean {
  const origin = headers.origin;
  const host = headers.host;
  
  // Allow same-origin requests
  if (origin && host) {
    try {
      const originHost = new URL(Array.isArray(origin) ? origin[0] : origin).host;
      const hostValue = Array.isArray(host) ? host[0] : host;
      return originHost === hostValue;
    } catch {
      return false;
    }
  }
  
  // Allow requests without origin header (same-origin)
  return !origin;
}

async function generateAnalytics(timeRange: string): Promise<AnalyticsData> {
  const ga4Service = getGA4Service();
  
  // If GA4 is not available, use mock data
  if (!ga4Service) {
    console.log('GA4 service not available - using mock data');
    return generateMockAnalytics(timeRange);
  }

  try {
    // Determine date range for GA4
    let startDate = '30daysAgo';
    switch (timeRange) {
      case '7d': startDate = '7daysAgo'; break;
      case '30d': startDate = '30daysAgo'; break;
      case '90d': startDate = '90daysAgo'; break;
    }

    // Fetch real GA4 data
    const [basicMetrics, topPages, trafficSources, conversions] = await Promise.all([
      ga4Service.getBasicMetrics(startDate, 'today'),
      ga4Service.getTopPages(startDate, 'today', 5),
      ga4Service.getTrafficSources(startDate, 'today'),
      ga4Service.getConversions(startDate, 'today'),
    ]);

    // Generate timeline data (simplified - in production you'd fetch daily data)
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const timeline = [];
    const avgPageViewsPerDay = Math.floor(basicMetrics.pageViews / days);
    const avgSubscribersPerDay = Math.floor(conversions.total / days);

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some variation to daily data
      const randomFactor = 0.7 + Math.random() * 0.6;
      
      timeline.push({
        date: date.toISOString().split('T')[0],
        pageViews: Math.floor(avgPageViewsPerDay * randomFactor),
        subscribers: Math.floor(avgSubscribersPerDay * randomFactor),
        engagement: basicMetrics.engagementRate + (Math.random() - 0.5) * 0.2,
      });
    }

    return {
      pageViews: {
        total: basicMetrics.pageViews,
        thisMonth: Math.floor(basicMetrics.pageViews * 0.7),
        thisWeek: Math.floor(basicMetrics.pageViews * 0.25),
        today: Math.floor(basicMetrics.pageViews / days),
      },
      subscribers: {
        total: conversions.total,
        thisMonth: Math.floor(conversions.total * 0.7),
        thisWeek: Math.floor(conversions.total * 0.25),
        conversionRate: conversions.rate,
      },
      topPages: topPages.map(page => ({
        path: page.title || page.path,
        views: page.views,
        percentage: basicMetrics.pageViews > 0 ? Math.round((page.views / basicMetrics.pageViews) * 100) : 0,
      })),
      sources: [
        { source: 'Direct', subscribers: Math.floor(trafficSources.direct * 0.02), percentage: 0 },
        { source: 'Google Search', subscribers: Math.floor(trafficSources.organic * 0.02), percentage: 0 },
        { source: 'Social Media', subscribers: Math.floor(trafficSources.social * 0.02), percentage: 0 },
        { source: 'Referrals', subscribers: Math.floor(trafficSources.referral * 0.02), percentage: 0 },
      ].map(source => {
        const totalSubscribers = conversions.total;
        return {
          ...source,
          percentage: totalSubscribers > 0 ? Math.round((source.subscribers / totalSubscribers) * 100) : 0,
        };
      }),
      timeline,
    };

  } catch (error) {
    console.error('Error fetching GA4 analytics, falling back to mock:', error);
    return generateMockAnalytics(timeRange);
  }
}

function generateMockAnalytics(timeRange: string): AnalyticsData {
  const now = new Date();
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  
  // Generate timeline data
  const timeline = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Simulate realistic patterns
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const basePageViews = isWeekend ? 150 : 250;
    const baseSubscribers = isWeekend ? 2 : 4;
    
    // Add some randomness and growth trend
    const randomFactor = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
    const growthFactor = 1 + (days - i) * 0.01; // Slight growth over time
    
    timeline.push({
      date: date.toISOString().split('T')[0],
      pageViews: Math.round(basePageViews * randomFactor * growthFactor),
      subscribers: Math.round(baseSubscribers * randomFactor * growthFactor)
    });
  }
  
  // Calculate totals
  const totalPageViews = timeline.reduce((sum, day) => sum + day.pageViews, 0);
  const totalSubscribers = timeline.reduce((sum, day) => sum + day.subscribers, 0);
  
  // Calculate recent periods
  const thisWeekData = timeline.slice(-7);
  const thisMonthData = timeline.slice(-30);
  
  const thisWeekPageViews = thisWeekData.reduce((sum, day) => sum + day.pageViews, 0);
  const thisWeekSubscribers = thisWeekData.reduce((sum, day) => sum + day.subscribers, 0);
  
  const thisMonthPageViews = thisMonthData.reduce((sum, day) => sum + day.pageViews, 0);
  const thisMonthSubscribers = thisMonthData.reduce((sum, day) => sum + day.subscribers, 0);
  
  // Mock top pages data
  const topPages = [
    { path: '/', views: Math.round(totalPageViews * 0.35), percentage: 35 },
    { path: '/about', views: Math.round(totalPageViews * 0.25), percentage: 25 },
    { path: '/content', views: Math.round(totalPageViews * 0.20), percentage: 20 },
    { path: '/kai-crew', views: Math.round(totalPageViews * 0.12), percentage: 12 },
    { path: '/contact', views: Math.round(totalPageViews * 0.08), percentage: 8 }
  ];
  
  // Mock subscriber sources
  const sources = [
    { source: 'home', subscribers: Math.round(totalSubscribers * 0.40), percentage: 40 },
    { source: 'about', subscribers: Math.round(totalSubscribers * 0.30), percentage: 30 },
    { source: 'welcome', subscribers: Math.round(totalSubscribers * 0.20), percentage: 20 },
    { source: 'newsletter', subscribers: Math.round(totalSubscribers * 0.10), percentage: 10 }
  ];
  
  // Calculate conversion rate (subscribers / page views * 100)
  const conversionRate = totalPageViews > 0 ? Number(((totalSubscribers / totalPageViews) * 100).toFixed(2)) : 0;
  
  return {
    pageViews: {
      total: totalPageViews,
      thisMonth: thisMonthPageViews,
      thisWeek: thisWeekPageViews,
      today: timeline[timeline.length - 1]?.pageViews || 0
    },
    subscribers: {
      total: totalSubscribers,
      thisMonth: thisMonthSubscribers,
      thisWeek: thisWeekSubscribers,
      conversionRate
    },
    topPages,
    sources,
    timeline
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<AdminApiResponse<AnalyticsData>>) {
  // Set CORS headers (same pattern as existing APIs)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true });
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    // Validate origin (same pattern as existing APIs)
    if (!validateOrigin(req.headers)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
      });
    }

    // Rate limiting
    const clientIP = getClientIP(req.headers);
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
      });
    }

    // Get time range from query params
    const { timeRange = '30d' } = req.query;
    const validTimeRanges = ['7d', '30d', '90d'];
    const selectedTimeRange = validTimeRanges.includes(timeRange as string) ? timeRange as string : '30d';

    // TODO: Add Netlify Identity validation here
    // TODO: Integrate with real Google Analytics 4 API
    // For now, generate mock data
    
    const analyticsData = await generateAnalytics(selectedTimeRange);

    // Set cache headers (shorter cache for analytics data)
    const cacheTime = process.env.NODE_ENV === 'development' ? 0 : 300; // 5 minutes in production
    res.setHeader('Cache-Control', `public, s-maxage=${cacheTime}, stale-while-revalidate=600`);

    res.status(200).json({
      success: true,
      data: analyticsData
    });

  } catch (error) {
    console.error('Error in analytics API:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
} 