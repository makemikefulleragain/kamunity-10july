import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  source: string;
  status: 'active' | 'unsubscribed';
}

interface AdminApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Rate limiting store (same pattern as existing APIs)
const rateLimitStore = new Map();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 10; // Higher limit for admin API
  
  const key = `admin_subscribers_${ip}`;
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

async function readSubscribersFromFile(): Promise<Subscriber[]> {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const subscribersFile = path.join(dataDir, 'subscribers.json');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Create empty subscribers file if it doesn't exist
    if (!fs.existsSync(subscribersFile)) {
      fs.writeFileSync(subscribersFile, JSON.stringify([]));
      return [];
    }
    
    const fileContent = fs.readFileSync(subscribersFile, 'utf8');
    const subscribers = JSON.parse(fileContent);
    
    // Validate subscriber structure
    return subscribers.filter((sub: any) => 
      sub.id && sub.email && sub.subscribedAt && sub.source
    ).map((sub: any) => ({
      id: sub.id,
      email: sub.email,
      subscribedAt: sub.subscribedAt,
      source: sub.source,
      status: sub.status || 'active'
    }));
    
  } catch (error) {
    console.error('Error reading subscribers file:', error);
    return [];
  }
}

// Mock data generator for development (following plan's enhanced JSON storage)
function generateMockSubscribers(): Subscriber[] {
  const sources = ['home', 'about', 'welcome', 'newsletter'];
  const mockData: Subscriber[] = [];
  
  // Generate 25 mock subscribers for testing
  for (let i = 1; i <= 25; i++) {
    const subscribedDate = new Date();
    subscribedDate.setDate(subscribedDate.getDate() - Math.floor(Math.random() * 90)); // Random date within last 90 days
    
    mockData.push({
      id: `sub_${i.toString().padStart(3, '0')}`,
      email: `user${i}@example.com`,
      subscribedAt: subscribedDate.toISOString(),
      source: sources[Math.floor(Math.random() * sources.length)],
      status: Math.random() > 0.1 ? 'active' : 'unsubscribed' // 90% active
    });
  }
  
  return mockData;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<AdminApiResponse<Subscriber[]>>) {
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

  // Only allow GET requests for now
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

    // TODO: Add Netlify Identity validation here
    // For now, we'll skip auth validation but keep the structure ready
    
    // Read subscribers from file
    let subscribers = await readSubscribersFromFile();
    
    // If no subscribers found, use mock data for development
    if (subscribers.length === 0 && process.env.NODE_ENV === 'development') {
      subscribers = generateMockSubscribers();
      
      // Save mock data to file for persistence
      try {
        const dataDir = path.join(process.cwd(), 'data');
        const subscribersFile = path.join(dataDir, 'subscribers.json');
        fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
      } catch (error) {
        console.error('Error saving mock data:', error);
      }
    }

    // Sort by most recent first
    subscribers.sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime());

    // Set cache headers (shorter cache for admin data)
    const cacheTime = process.env.NODE_ENV === 'development' ? 0 : 60; // 1 minute in production
    res.setHeader('Cache-Control', `public, s-maxage=${cacheTime}, stale-while-revalidate=120`);

    res.status(200).json({
      success: true,
      data: subscribers,
      meta: {
        total: subscribers.length,
        page: 1,
        limit: subscribers.length
      }
    });

  } catch (error) {
    console.error('Error in subscribers API:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
} 