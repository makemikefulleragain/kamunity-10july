const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Utility functions
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 500); // Limit length for email inputs
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
  
  const key = `subscribe_${ip}`;
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

    const { email, source, recaptchaToken } = requestData;

    // Validate required fields
    if (!email || !source || !recaptchaToken) {
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
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedSource = sanitizeInput(source);

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

    // Validate source
    const validSources = ['home', 'about', 'welcome', 'newsletter'];
    if (!validSources.includes(sanitizedSource)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid source',
        }),
      };
    }

    // Send welcome email
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'hello@kamunity.ai',
        to: sanitizedEmail,
        subject: 'Welcome to Kamunity! 🌟',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 20px;">
              <h1 style="color: #333; margin-bottom: 10px;">Welcome to Kamunity! 🌟</h1>
              <p style="color: #666; font-size: 18px;">Thanks for joining our community</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0;">
              <h2 style="margin: 0 0 15px 0;">You're officially part of something special!</h2>
              <p style="margin: 0; opacity: 0.9;">We're building a community where connection, growth, and positive change happen naturally.</p>
            </div>
            
            <div style="padding: 20px;">
              <h3 style="color: #333;">What's next?</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>🎯 <strong>Stay tuned</strong> for community updates and exclusive content</li>
                <li>💬 <strong>Engage</strong> with our upcoming discussions and events</li>
                <li>🌱 <strong>Grow</strong> alongside fellow community members</li>
                <li>✨ <strong>Share</strong> your unique perspective and experiences</li>
              </ul>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #666; text-align: center;">
                <strong>Questions or ideas?</strong> Simply reply to this email - we'd love to hear from you!
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #999; font-size: 14px;">
              <p>With gratitude,<br><strong>The Kamunity Team</strong></p>
            </div>
          </div>
        `,
      });

      // Send admin notification
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'hello@kamunity.ai',
        to: process.env.MIKE_FULLER_EMAIL || 'admin@kamunity.ai',
        subject: 'New Kamunity Subscriber! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Subscriber Alert! 🎉</h2>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Email:</strong> ${sanitizedEmail}</p>
              <p><strong>Source:</strong> ${sanitizedSource}</p>
              <p><strong>Time:</strong> ${new Date().toISOString()}</p>
              <p><strong>IP:</strong> ${clientIP}</p>
            </div>
            
            <p style="color: #666;">Your community is growing! 🌱</p>
          </div>
        `,
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: { subscribed: true },
          message: 'Successfully subscribed! Check your email for confirmation.',
        }),
      };
    } catch (emailError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Failed to send confirmation email',
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