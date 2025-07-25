const { Resend } = require('resend');
const fs = require('fs').promises;
const path = require('path');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Generate secure ID function
function generateSecureId(length = 16) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

// Parse device info
function parseDeviceInfo(userAgent, screenWidth, screenHeight) {
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

// Get location info (basic implementation)
function getLocationInfo(ip) {
  const locationInfo = { ip };
  
  if (ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    locationInfo.country = 'Local';
    locationInfo.region = 'Development';
    locationInfo.city = 'Localhost';
  } else {
    locationInfo.country = 'Unknown';
    locationInfo.region = 'Unknown';
    locationInfo.city = 'Unknown';
  }
  
  return locationInfo;
}

// Save subscriber to JSON file
async function saveSubscriber(email, source, device, location) {
  const dataDir = path.join(process.cwd(), 'data');
  const subscribersFile = path.join(dataDir, 'subscribers.json');
  
  // Ensure data directory exists
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  const subscriber = {
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
    let subscribers = [];
    try {
      const data = await fs.readFile(subscribersFile, 'utf8');
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
    await fs.writeFile(subscribersFile, JSON.stringify(subscribers, null, 2));
    
    return subscriber;
  } catch (error) {
    console.error('Error saving subscriber:', error);
    throw new Error('Failed to save subscriber data');
  }
}

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

    const { 
      email, 
      source, 
      recaptchaToken, 
      timestamp,
      screenWidth,
      screenHeight 
    } = requestData;

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

    // Parse device information
    const userAgent = event.headers['user-agent'] || 'Unknown';
    const device = parseDeviceInfo(userAgent, screenWidth, screenHeight);
    
    // Get location information
    const location = getLocationInfo(clientIP);

    // Save to database/JSON file
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