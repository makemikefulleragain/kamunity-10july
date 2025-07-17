import type { NextApiRequest, NextApiResponse } from 'next';
import { sendThankYouEmail, sendAdminNotification } from '@/lib/email';
import { validateEmail, createRateLimiter, sanitizeInput } from '@/lib/utils';
import { saveSubscriber, parseDeviceInfo, getLocationInfo } from '@/lib/database';
import { ApiResponse, EmailFormData } from '@/types';
import { RATE_LIMITS } from '@/lib/constants';

// Create rate limiter for email subscriptions
const emailRateLimit = createRateLimiter(
  RATE_LIMITS.EMAIL_SUBSCRIPTION.maxAttempts,
  RATE_LIMITS.EMAIL_SUBSCRIPTION.windowMs
);

// Note: reCAPTCHA verification removed for better user experience
// Forms now work without CAPTCHA while maintaining security through rate limiting

// Get client IP for rate limiting
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const realIP = req.headers['x-real-ip'];
  
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  
  if (typeof realIP === 'string') {
    return realIP;
  }
  
  return req.socket.remoteAddress || 'unknown';
}

// Validate request origin
function validateOrigin(req: NextApiRequest): boolean {
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  
  const allowedOrigins = [
    'https://kamunity.org',
    'https://www.kamunity.org',
    'http://localhost:3000', // Development only
    process.env.NEXT_PUBLIC_SITE_URL || ''
  ].filter(Boolean);
  
  // In development, be more lenient
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  return allowedOrigins.some(allowed => 
    origin === allowed || (referer && referer.startsWith(allowed))
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ subscribed: boolean }>>
) {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    // Validate origin to prevent CSRF
    if (!validateOrigin(req)) {
      console.warn('Invalid origin for subscription request:', req.headers.origin);
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
      });
    }

    // Get client IP for rate limiting
    const clientIP = getClientIP(req);
    
    // Apply rate limiting
    if (!emailRateLimit(clientIP)) {
      console.warn('Rate limit exceeded for IP:', clientIP);
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
      });
    }

    // Validate and sanitize input
    const { 
      email, 
      source, 
      recaptchaToken, 
      timestamp,
      deviceInfo,
      screenWidth,
      screenHeight 
    } = req.body;

    if (!email || !source || !recaptchaToken) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email).toLowerCase().trim();
    const sanitizedSource = sanitizeInput(source);

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Validate source
    const validSources = ['home', 'about', 'welcome', 'newsletter'];
    if (!validSources.includes(sanitizedSource)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid source',
      });
    }

    // Note: reCAPTCHA verification removed - security maintained through rate limiting and input validation

    // Parse device information
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const device = parseDeviceInfo(userAgent, screenWidth, screenHeight);
    
    // Get location information
    const location = await getLocationInfo(clientIP);

    // Save to database
    try {
      const subscriberData = await saveSubscriber(
        sanitizedEmail,
        sanitizedSource,
        device,
        location
      );

      console.log('Subscriber saved to database:', subscriberData.id);
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Don't fail the request if database save fails
    }

    // Create form data for email
    const formData: EmailFormData = {
      email: sanitizedEmail,
      source: sanitizedSource as EmailFormData['source'],
      timestamp: timestamp || new Date().toISOString(),
    };

    // Send thank you email
    const emailSent = await sendThankYouEmail(formData);

    if (!emailSent) {
      console.error('Failed to send confirmation email for:', sanitizedEmail);
      return res.status(500).json({
        success: false,
        error: 'Failed to send confirmation email',
      });
    }

    // Send admin notification email
    try {
      await sendAdminNotification(
        'New Subscriber - Kamunity',
        `A new subscriber has joined Kamunity!
        
Email: ${sanitizedEmail}
Source: ${sanitizedSource}
Device: ${device.device} (${device.os} - ${device.browser})
Location: ${location.city}, ${location.region}, ${location.country}
IP: ${location.ip}
Time: ${formData.timestamp}`,
        {
          subscriber: {
            email: sanitizedEmail,
            source: sanitizedSource,
            device,
            location
          }
        }
      );
    } catch (notificationError) {
      console.error('Failed to send admin notification:', notificationError);
      // Don't fail the request if notification fails
    }

    // Log successful subscription
    console.log(`New subscription: ${sanitizedEmail} from ${sanitizedSource} at ${formData.timestamp}`);

    return res.status(200).json({
      success: true,
      data: { subscribed: true },
      message: 'Successfully subscribed! Check your email for confirmation.',
    });
  } catch (error) {
    console.error('Subscription error:', error);
    
    // Don't expose internal errors to client
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
} 