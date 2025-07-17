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

// Validate origin to prevent CSRF
function validateOrigin(req: NextApiRequest): boolean {
  const origin = req.headers.origin;
  const host = req.headers.host;
  
  // Allow same-origin requests
  if (origin && host) {
    const originHost = new URL(origin).host;
    return originHost === host;
  }
  
  // Allow requests without origin header (same-origin)
  return !origin;
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
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
      });
    }

    // Get client IP and apply rate limiting
    const clientIP = getClientIP(req);
    
    if (!contactRateLimit(clientIP)) {
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

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Validate input lengths
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
    } catch (dbError) {
      // Don't fail the request if database save fails
    }

    // Send admin notification email
    try {
      await sendAdminNotification(
        `New Contact: ${sanitizedSubject}`,
        `A new contact form has been submitted:
        
Name: ${sanitizedName}
Email: ${sanitizedEmail}
Subject: ${sanitizedSubject}

Message:
${sanitizedMessage}

Device: ${device.device} (${device.os} - ${device.browser})
Location: ${location.city}, ${location.region}, ${location.country}
IP: ${location.ip}
Time: ${new Date().toISOString()}`,
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
    } catch (emailError) {
      return res.status(500).json({
        success: false,
        error: 'Failed to send notification',
      });
    }

    return res.status(200).json({
      success: true,
      data: { sent: true },
      message: 'Thank you for your message! We\'ll get back to you soon.',
    });
  } catch (error) {
    // Don't expose internal errors to client
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
} 