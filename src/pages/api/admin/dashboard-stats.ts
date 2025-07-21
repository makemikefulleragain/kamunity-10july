import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { getSubscribers, getContacts } from '@/lib/database';

interface DashboardStats {
  subscribers: {
    total: number;
    active: number;
    thisMonth: number;
    growth: number; // percentage change from last month
  };
  content: {
    total: number;
    published: number;
    thisMonth: number;
  };
  reactions: {
    total: number;
    thisWeek: number;
    topReaction: string;
  };
  engagement: {
    totalPageViews: number;
    avgSessionTime: number;
    conversionRate: number;
  };
}

interface AdminApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Rate limiting store (consistent with other admin APIs)
const rateLimitStore = new Map();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 10;
  
  const key = `dashboard_stats_${ip}`;
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

// Get content statistics from content files
function getContentStats() {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'media');
    if (!fs.existsSync(contentDir)) {
      return { total: 0, published: 0, thisMonth: 0 };
    }
    
    const files = fs.readdirSync(contentDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    let thisMonthCount = 0;
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    mdFiles.forEach(file => {
      try {
        const filePath = path.join(contentDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const dateMatch = content.match(/date:\s*["']?([^"'\n]+)["']?/);
        
        if (dateMatch) {
          const contentDate = new Date(dateMatch[1]);
          if (contentDate >= thisMonth) {
            thisMonthCount++;
          }
        }
      } catch (error) {
        console.error(`Error reading content file ${file}:`, error);
      }
    });
    
    return {
      total: mdFiles.length,
      published: mdFiles.length, // Assume all are published
      thisMonth: thisMonthCount
    };
  } catch (error) {
    console.error('Error reading content directory:', error);
    return { total: 0, published: 0, thisMonth: 0 };
  }
}

// Get reaction statistics from reactions.json
function getReactionStats() {
  try {
    const reactionsPath = path.join(process.cwd(), 'data', 'reactions.json');
    if (!fs.existsSync(reactionsPath)) {
      return { total: 0, thisWeek: 0, topReaction: 'FUN' };
    }
    
    const reactionsContent = fs.readFileSync(reactionsPath, 'utf8');
    const reactionsData = JSON.parse(reactionsContent);
    
    let totalReactions = 0;
    const reactionCounts: { [key: string]: number } = {};
    
    // Aggregate all reactions
    Object.values(reactionsData.reactions || {}).forEach((contentReactions: any) => {
      Object.entries(contentReactions).forEach(([reactionType, count]) => {
        const numCount = Number(count);
        totalReactions += numCount;
        reactionCounts[reactionType] = (reactionCounts[reactionType] || 0) + numCount;
      });
    });
    
    // Find top reaction
    const topReaction = Object.entries(reactionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'FUN';
    
    // Estimate this week's reactions (simplified for demo)
    const thisWeekEstimate = Math.round(totalReactions * 0.3);
    
    return {
      total: totalReactions,
      thisWeek: thisWeekEstimate,
      topReaction
    };
  } catch (error) {
    console.error('Error reading reactions.json:', error);
    return { total: 0, thisWeek: 0, topReaction: 'FUN' };
  }
}

async function generateDashboardStats(): Promise<DashboardStats> {
  try {
    // Get real subscriber data
    const subscribers = await getSubscribers();
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    const activeSubscribers = subscribers.filter(s => s.status === 'active');
    const thisMonthSubscribers = subscribers.filter(s => {
      const subDate = new Date(s.createdAt || s.timestamp);
      return subDate >= thisMonth;
    });
    
    const lastMonthSubscribers = subscribers.filter(s => {
      const subDate = new Date(s.createdAt || s.timestamp);
      return subDate >= lastMonth && subDate <= lastMonthEnd;
    });
    
    // Calculate growth percentage
    const growth = lastMonthSubscribers.length > 0 
      ? ((thisMonthSubscribers.length - lastMonthSubscribers.length) / lastMonthSubscribers.length) * 100
      : thisMonthSubscribers.length > 0 ? 100 : 0;
    
    // Get content stats
    const contentStats = getContentStats();
    
    // Get reaction stats
    const reactionStats = getReactionStats();
    
    // Mock engagement data for now (could be enhanced with real analytics)
    const engagementStats = {
      totalPageViews: Math.round((subscribers.length * 15) + (reactionStats.total * 3)), // Estimate based on subscribers and reactions
      avgSessionTime: 145, // seconds - mock value
      conversionRate: subscribers.length > 0 ? (activeSubscribers.length / subscribers.length) * 100 : 0
    };
    
    return {
      subscribers: {
        total: subscribers.length,
        active: activeSubscribers.length,
        thisMonth: thisMonthSubscribers.length,
        growth: Math.round(growth * 10) / 10 // Round to 1 decimal place
      },
      content: contentStats,
      reactions: reactionStats,
      engagement: engagementStats
    };
  } catch (error) {
    console.error('Error generating dashboard stats:', error);
    
    // Return fallback stats
    return {
      subscribers: { total: 0, active: 0, thisMonth: 0, growth: 0 },
      content: { total: 0, published: 0, thisMonth: 0 },
      reactions: { total: 0, thisWeek: 0, topReaction: 'FUN' },
      engagement: { totalPageViews: 0, avgSessionTime: 0, conversionRate: 0 }
    };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<AdminApiResponse<DashboardStats>>) {
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
    
    const dashboardStats = await generateDashboardStats();

    // Set cache headers
    const cacheTime = process.env.NODE_ENV === 'development' ? 0 : 60; // 1 minute in production
    res.setHeader('Cache-Control', `public, s-maxage=${cacheTime}, stale-while-revalidate=120`);

    res.status(200).json({
      success: true,
      data: dashboardStats
    });

  } catch (error) {
    console.error('Error in dashboard stats API:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
} 