// Database utility for storing subscriber and contact data
// Using JSON files for now - can be upgraded to proper database later

import { promises as fs } from 'fs';
import path from 'path';
import { generateSecureId } from './utils';

export interface DeviceInfo {
  userAgent: string;
  os: string;
  browser: string;
  device: string;
  isMobile: boolean;
  screen: {
    width: number;
    height: number;
  };
}

export interface LocationInfo {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
}

export interface SubscriberData {
  id: string;
  email: string;
  source: string;
  timestamp: string;
  device: DeviceInfo;
  location: LocationInfo;
  status: 'active' | 'unsubscribed';
  createdAt: string;
  updatedAt: string;
}

export interface ContactData {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  device: DeviceInfo;
  location: LocationInfo;
  status: 'new' | 'replied' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

// File paths for data storage
const DATA_DIR = path.join(process.cwd(), 'data');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

// Parse user agent to get device info
export function parseDeviceInfo(userAgent: string, screenWidth?: number, screenHeight?: number): DeviceInfo {
  const ua = userAgent.toLowerCase();
  
  // Detect OS
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('linux')) os = 'Linux';
  
  // Detect browser
  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
  // Detect device type
  let device = 'Desktop';
  const isMobile = ua.includes('mobile') || ua.includes('android') || ua.includes('iphone');
  if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet';
  else if (isMobile) device = 'Mobile';
  
  return {
    userAgent,
    os,
    browser,
    device,
    isMobile,
    screen: {
      width: screenWidth || 0,
      height: screenHeight || 0,
    }
  };
}

// Get location info from IP (basic implementation)
export async function getLocationInfo(ip: string): Promise<LocationInfo> {
  const locationInfo: LocationInfo = { ip };
  
  try {
    // In production, you'd use a proper IP geolocation service
    // For now, return basic info
    if (ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      locationInfo.country = 'Local';
      locationInfo.region = 'Development';
      locationInfo.city = 'Localhost';
    } else {
      // You can integrate with services like:
      // - ipapi.co
      // - ipgeolocation.io
      // - MaxMind GeoIP
      locationInfo.country = 'Unknown';
      locationInfo.region = 'Unknown';
      locationInfo.city = 'Unknown';
    }
  } catch (error) {
    console.error('Error getting location info:', error);
  }
  
  return locationInfo;
}

// Save subscriber data
export async function saveSubscriber(
  email: string,
  source: string,
  device: DeviceInfo,
  location: LocationInfo
): Promise<SubscriberData> {
  await ensureDataDir();
  
  const subscriber: SubscriberData = {
    id: generateSecureId(16),
    email,
    source,
    timestamp: new Date().toISOString(),
    device,
    location,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  try {
    // Read existing subscribers
    let subscribers: SubscriberData[] = [];
    try {
      const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf8');
      subscribers = JSON.parse(data);
    } catch {
      // File doesn't exist yet
    }
    
    // Check if email already exists
    const existingIndex = subscribers.findIndex(s => s.email === email);
    if (existingIndex >= 0) {
      // Update existing subscriber
      subscribers[existingIndex] = {
        ...subscribers[existingIndex],
        source,
        device,
        location,
        status: 'active',
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Add new subscriber
      subscribers.push(subscriber);
    }
    
    // Save to file
    await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
    
    return subscriber;
  } catch (error) {
    console.error('Error saving subscriber:', error);
    throw new Error('Failed to save subscriber data');
  }
}

// Save contact data
export async function saveContact(
  name: string,
  email: string,
  subject: string,
  message: string,
  device: DeviceInfo,
  location: LocationInfo
): Promise<ContactData> {
  await ensureDataDir();
  
  const contact: ContactData = {
    id: generateSecureId(16),
    name,
    email,
    subject,
    message,
    timestamp: new Date().toISOString(),
    device,
    location,
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  try {
    // Read existing contacts
    let contacts: ContactData[] = [];
    try {
      const data = await fs.readFile(CONTACTS_FILE, 'utf8');
      contacts = JSON.parse(data);
    } catch {
      // File doesn't exist yet
    }
    
    // Add new contact
    contacts.push(contact);
    
    // Save to file
    await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
    
    return contact;
  } catch (error) {
    console.error('Error saving contact:', error);
    throw new Error('Failed to save contact data');
  }
}

// Get all subscribers
export async function getSubscribers(): Promise<SubscriberData[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Get all contacts
export async function getContacts(): Promise<ContactData[]> {
  try {
    const data = await fs.readFile(CONTACTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Get subscriber stats
export async function getSubscriberStats() {
  const subscribers = await getSubscribers();
  
  const total = subscribers.length;
  const active = subscribers.filter(s => s.status === 'active').length;
  const sourceBreakdown = subscribers.reduce((acc, s) => {
    acc[s.source] = (acc[s.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const deviceBreakdown = subscribers.reduce((acc, s) => {
    acc[s.device.device] = (acc[s.device.device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total,
    active,
    sourceBreakdown,
    deviceBreakdown,
  };
}

// Get contact stats
export async function getContactStats() {
  const contacts = await getContacts();
  
  const total = contacts.length;
  const byStatus = contacts.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total,
    byStatus,
  };
} 