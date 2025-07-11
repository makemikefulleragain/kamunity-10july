import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to combine class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Email validation function
 * Uses a more comprehensive regex pattern for better validation
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // More comprehensive email regex following RFC 5322 standards
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Additional checks
  if (email.length > 254) return false; // RFC 5321 limit
  if (email.startsWith('.') || email.endsWith('.')) return false;
  if (email.includes('..')) return false; // No consecutive dots
  
  return emailRegex.test(email);
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(d);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Debounce function to limit API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate a secure random string
 */
export function generateSecureId(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Rate limiting check for API calls
 */
export function createRateLimiter(maxAttempts: number, windowMs: number) {
  const attempts = new Map<string, { count: number; firstAttempt: number }>();
  
  return function checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = attempts.get(identifier);
    
    if (!userAttempts) {
      attempts.set(identifier, { count: 1, firstAttempt: now });
      return true;
    }
    
    // Reset if window has passed
    if (now - userAttempts.firstAttempt > windowMs) {
      attempts.set(identifier, { count: 1, firstAttempt: now });
      return true;
    }
    
    // Check if over limit
    if (userAttempts.count >= maxAttempts) {
      return false;
    }
    
    // Increment counter
    userAttempts.count++;
    return true;
  };
}

/**
 * Validate URL to prevent open redirect attacks
 */
export function validateRedirectUrl(url: string, allowedDomains: string[]): boolean {
  try {
    const urlObj = new URL(url);
    return allowedDomains.includes(urlObj.hostname);
  } catch {
    return false;
  }
} 