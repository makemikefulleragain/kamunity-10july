import type { NextApiRequest, NextApiResponse } from 'next';
import { sendAdminNotification } from '@/lib/email';
import { validateEmail, createRateLimiter, sanitizeInput } from '@/lib/utils';
import { saveContact, parseDeviceInfo, getLocationInfo } from '@/lib/database';
import { ApiResponse } from '@/types';
import { RATE_LIMITS } from '@/lib/constants';

// Create rate limiter for contact form
const contactRateLimit = createRateLimiter(
  RATE_LIMITS.CONTACT_FORM.maxAttempts,
  RATE_LIMITS.CONTACT_FORM.windowMs
);

// Note: reCAPTCHA verification removed for better user experience
// Security maintained through rate limiting, input validation, and origin checks

// Get client IP
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
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_SITE_URL || ''
  ].filter(Boolean);
  
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  return allowedOrigins.some(allowed => 
    origin === allowed || (referer && referer.startsWith(allowed))
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ sent: boolean }>>
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
    // Validate origin
    if (!validateOrigin(req)) {
      console.warn('Invalid origin for contact request:', req.headers.origin);
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
      });
    }

    // Get client IP and apply rate limiting
    const clientIP = getClientIP(req);
    
    if (!contactRateLimit(clientIP)) {
      console.warn('Rate limit exceeded for contact form IP:', clientIP);
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
      });
    }

    // Extract and validate input
    const { 
      name, 
      email, 
      subject, 
      message, 
      recaptchaToken,
      screenWidth,
      screenHeight 
    } = req.body;

    if (!name || !email || !subject || !message || !recaptchaToken) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email).toLowerCase().trim();
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedMessage = sanitizeInput(message);

    // Validate inputs
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Name must be between 2 and 100 characters',
      });
    }

    if (sanitizedSubject.length < 5 || sanitizedSubject.length > 200) {
      return res.status(400).json({
        success: false,
        error: 'Subject must be between 5 and 200 characters',
      });
    }

    if (sanitizedMessage.length < 10 || sanitizedMessage.length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Message must be between 10 and 2000 characters',
      });
    }

    // Note: reCAPTCHA verification removed - security maintained through rate limiting and validation

    // Parse device information
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const device = parseDeviceInfo(userAgent, screenWidth, screenHeight);
    
    // Get location information
    const location = await getLocationInfo(clientIP);

    // Save to database
    try {
      const contactData = await saveContact(
        sanitizedName,
        sanitizedEmail,
        sanitizedSubject,
        sanitizedMessage,
        device,
        location
      );

      console.log('Contact saved to database:', contactData.id);
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Don't fail the request if database save fails
    }

    // Send admin notification email
    try {
      const emailSent = await sendAdminNotification(
        `New Contact Form: ${sanitizedSubject}`,
        `A new contact form submission has been received:

Name: ${sanitizedName}
Email: ${sanitizedEmail}
Subject: ${sanitizedSubject}

Message:
${sanitizedMessage}

---
Device Info:
- Device: ${device.device} (${device.os} - ${device.browser})
- Screen: ${device.screen.width}x${device.screen.height}

Location Info:
- IP: ${location.ip}
- Location: ${location.city}, ${location.region}, ${location.country}

Time: ${new Date().toISOString()}

Please reply to this person at: ${sanitizedEmail}`,
        {
          contact: {
            name: sanitizedName,
            email: sanitizedEmail,
            subject: sanitizedSubject,
            message: sanitizedMessage,
            device,
            location
          }
        }
      );

      if (!emailSent) {
        console.error('Failed to send admin notification for contact form');
        return res.status(500).json({
          success: false,
          error: 'Failed to send your message',
        });
      }
    } catch (emailError) {
      console.error('Failed to send contact notification:', emailError);
      return res.status(500).json({
        success: false,
        error: 'Failed to send your message',
      });
    }

    // Log successful contact
    console.log(`New contact form: ${sanitizedEmail} - ${sanitizedSubject}`);

    return res.status(200).json({
      success: true,
      data: { sent: true },
      message: 'Thank you for your message! We\'ll get back to you soon.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
} 