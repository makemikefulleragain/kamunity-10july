import { NextApiRequest, NextApiResponse } from 'next';
import { getGA4Service, getMockAnalyticsData } from '@/lib/ga4';

interface GA4AnalyticsData {
  basicMetrics: {
    pageViews: number;
    users: number;
    newUsers: number;
    sessions: number;
    engagementRate: number;
    averageSessionDuration: number;
    bounceRate: number;
  };
  realTimeUsers: number;
  topPages: Array<{
    rank: number;
    path: string;
    title: string;
    views: number;
  }>;
  trafficSources: {
    direct: number;
    organic: number;
    social: number;
    referral: number;
  };
  conversions: {
    total: number;
    rate: number;
  };
  isRealData: boolean;
  lastUpdated: string;
}

interface AdminApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Rate limiting store
const rateLimitStore = new Map();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 20; // Higher limit for analytics API
  
  const key = `ga4_analytics_${ip}`;
  const attempts = rateLimitStore.get(key) || [];
  
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
  
  if (origin && host) {
    try {
      const originHost = new URL(Array.isArray(origin) ? origin[0] : origin).host;
      const hostValue = Array.isArray(host) ? host[0] : host;
      return originHost === hostValue;
    } catch {
      return false;
    }
  }
  
  return !origin;
}

async function fetchGA4Analytics(timeRange: string = '30d'): Promise<GA4AnalyticsData> {
  const ga4Service = getGA4Service();
  
  // Determine date range
  let startDate = '30daysAgo';
  let endDate = 'today';
  
  switch (timeRange) {
    case '7d':
      startDate = '7daysAgo';
      break;
    case '30d':
      startDate = '30daysAgo';
      break;
    case '90d':
      startDate = '90daysAgo';
      break;
  }

  if (!ga4Service) {
    console.log('GA4 service not available - using mock data');
    const mockData = getMockAnalyticsData();
    return {
      ...mockData,
      isRealData: false,
      lastUpdated: new Date().toISOString(),
    };
  }

  try {
    console.log('Fetching real GA4 analytics data...');
    
    // Fetch all data in parallel for better performance
    const [basicMetrics, realTimeUsers, topPages, trafficSources, conversions] = await Promise.all([
      ga4Service.getBasicMetrics(startDate, endDate),
      ga4Service.getRealTimeUsers(),
      ga4Service.getTopPages(startDate, endDate, 5),
      ga4Service.getTrafficSources(startDate, endDate),
      ga4Service.getConversions(startDate, endDate),
    ]);

    console.log('Successfully fetched GA4 data:', { 
      pageViews: basicMetrics.pageViews, 
      users: basicMetrics.users,
      realTimeUsers 
    });

    return {
      basicMetrics,
      realTimeUsers,
      topPages,
      trafficSources,
      conversions,
      isRealData: true,
      lastUpdated: new Date().toISOString(),
    };

  } catch (error) {
    console.error('Error fetching GA4 data, falling back to mock:', error);
    
    // Fallback to mock data if GA4 fails
    const mockData = getMockAnalyticsData();
    return {
      ...mockData,
      isRealData: false,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<AdminApiResponse<GA4AnalyticsData>>
) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  };

  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

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
    // Validate origin
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

    // TODO: Add Netlify Identity validation here
    
    const timeRange = (req.query.timeRange as string) || '30d';
    const analyticsData = await fetchGA4Analytics(timeRange);

    // Set cache headers - shorter cache for real-time data
    const cacheTime = analyticsData.isRealData ? 300 : 3600; // 5 minutes for real data, 1 hour for mock
    res.setHeader('Cache-Control', `public, s-maxage=${cacheTime}, stale-while-revalidate=600`);

    res.status(200).json({
      success: true,
      data: analyticsData,
      message: analyticsData.isRealData ? 'Real GA4 data' : 'Mock data (GA4 not configured)',
    });

  } catch (error) {
    console.error('Error in GA4 analytics API:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
} 