const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Utility functions
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 2000); // Limit length
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

function validateOrigin(headers) {
  const origin = headers.origin;
  const host = headers.host;
  
  // Allow same-origin requests
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      return originHost === host;
    } catch {
      return false;
    }
  }
  
  // Allow requests without origin header (same-origin)
  return !origin;
}

// Rate limiting (simple in-memory store for Netlify Functions)
const rateLimitStore = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;
  
  const key = `contact_${ip}`;
  const attempts = rateLimitStore.get(key) || [];
  
  // Clean old attempts
  const validAttempts = attempts.filter(time => now - time < windowMs);
  
  if (validAttempts.length >= maxAttempts) {
    return false;
  }
  
  validAttempts.push(now);
  rateLimitStore.set(key, validAttempts);
  
  return true;
}

function getClientIP(headers) {
  const forwarded = headers['x-forwarded-for'];
  const realIP = headers['x-real-ip'];
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed',
      }),
    };
  }

  try {
    // Validate origin
    if (!validateOrigin(event.headers)) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Forbidden',
        }),
      };
    }

    // Rate limiting
    const clientIP = getClientIP(event.headers);
    if (!checkRateLimit(clientIP)) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Too many requests. Please try again later.',
        }),
      };
    }

    // Validate environment
    if (!process.env.RESEND_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Service configuration error',
        }),
      };
    }

    // Parse request body
    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid request format',
        }),
      };
    }

    const { name, email, subject, message, recaptchaToken } = requestData;

    // Validate required fields
    if (!name || !email || !subject || !message || !recaptchaToken) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields',
        }),
      };
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedMessage = sanitizeInput(message);

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid email format',
        }),
      };
    }

    // Validate input lengths
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Name must be between 2 and 100 characters',
        }),
      };
    }

    if (sanitizedSubject.length < 5 || sanitizedSubject.length > 200) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Subject must be between 5 and 200 characters',
        }),
      };
    }

    if (sanitizedMessage.length < 10 || sanitizedMessage.length > 2000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Message must be between 10 and 2000 characters',
        }),
      };
    }

    // Send email using Resend
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'hello@kamunity.ai',
        to: process.env.MIKE_FULLER_EMAIL || 'admin@kamunity.ai',
        subject: `New Contact: ${sanitizedSubject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Contact Form Submission</h2>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #555;">Contact Details</h3>
              <p><strong>Name:</strong> ${sanitizedName}</p>
              <p><strong>Email:</strong> ${sanitizedEmail}</p>
              <p><strong>Subject:</strong> ${sanitizedSubject}</p>
            </div>
            
            <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #555;">Message</h3>
              <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px; font-size: 12px; color: #666;">
              <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
              <p><strong>IP:</strong> ${clientIP}</p>
            </div>
          </div>
        `,
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: { sent: true },
          message: 'Thank you for your message! We\'ll get back to you soon.',
        }),
      };
    } catch (emailError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Failed to send message',
        }),
      };
    }
  } catch (error) {
    // Don't expose internal errors
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
    };
  }
}; 