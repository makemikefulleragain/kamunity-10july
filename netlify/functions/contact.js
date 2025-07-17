const { Resend } = require('resend');

// Email validation
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

// Input sanitization
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

// Parse user agent to get device info
function parseDeviceInfo(userAgent, screenWidth, screenHeight) {
  const ua = userAgent.toLowerCase();
  
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('linux')) os = 'Linux';
  
  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
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

// Get location info from IP
function getLocationInfo(ip) {
  if (ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return {
      ip,
      country: 'Local',
      region: 'Development',
      city: 'Localhost'
    };
  } else {
    return {
      ip,
      country: 'Unknown',
      region: 'Unknown',
      city: 'Unknown'
    };
  }
}

exports.handler = async (event, context) => {
  console.log('Contact function called');
  console.log('Environment check:', {
    hasResendKey: !!process.env.RESEND_API_KEY,
            fromEmail: process.env.RESEND_FROM_EMAIL || 'hello@kamunity.org',
    adminEmail: process.env.MIKE_FULLER_EMAIL || 'not set'
  });

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed',
      }),
    };
  }

  try {
    const { 
      name, 
      email, 
      subject, 
      message, 
      recaptchaToken,
      screenWidth,
      screenHeight 
    } = JSON.parse(event.body);

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email).toLowerCase().trim();
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedMessage = sanitizeInput(message);

    // Validate input
    if (!sanitizedName || !sanitizedEmail || !sanitizedSubject || !sanitizedMessage) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields',
        }),
      };
    }

    // Validate inputs
    if (!validateEmail(sanitizedEmail)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Invalid email format',
        }),
      };
    }

    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Name must be between 2 and 100 characters',
        }),
      };
    }

    if (sanitizedSubject.length < 5 || sanitizedSubject.length > 200) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Subject must be between 5 and 200 characters',
        }),
      };
    }

    if (sanitizedMessage.length < 10 || sanitizedMessage.length > 2000) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Message must be between 10 and 2000 characters',
        }),
      };
    }

    // Check if Resend API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not found in environment variables');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Email service not configured',
        }),
      };
    }

    // Skip reCAPTCHA verification - allow all submissions
    console.log('Processing contact form without reCAPTCHA verification');

    // Parse device and location info
    const userAgent = event.headers['user-agent'] || 'Unknown';
    const device = parseDeviceInfo(userAgent, screenWidth, screenHeight);
    
    const clientIP = event.headers['x-forwarded-for']?.split(',')[0] || 
                     event.headers['x-real-ip'] || 
                     'unknown';
    const location = getLocationInfo(clientIP);

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send admin notification email
          const adminEmail = process.env.MIKE_FULLER_EMAIL || process.env.RESEND_FROM_EMAIL;
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@kamunity.org';
    
    const msg = {
      to: [adminEmail],
      from: `Kamunity Contact Form <${fromEmail}>`,
      subject: `New Contact Form: ${sanitizedSubject}`,
      text: `A new contact form submission has been received:

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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4338ca;">New Contact Form Submission</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${sanitizedName}</p>
            <p><strong>Email:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
            <p><strong>Subject:</strong> ${sanitizedSubject}</p>
          </div>
          
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Message</h3>
            <p style="white-space: pre-line;">${sanitizedMessage}</p>
          </div>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1f2937; margin-top: 0;">Technical Information</h4>
            <p><strong>Device:</strong> ${device.device} (${device.os} - ${device.browser})</p>
            <p><strong>Screen:</strong> ${device.screen.width}x${device.screen.height}</p>
            <p><strong>IP:</strong> ${location.ip}</p>
            <p><strong>Location:</strong> ${location.city}, ${location.region}, ${location.country}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>Reply to:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a>
            </p>
          </div>
        </div>
      `,
    };

    console.log('Sending contact form notification...');
    const { error } = await resend.emails.send(msg);
    
    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Email send failed: ${JSON.stringify(error)}`);
    }
    
    console.log('Contact form notification sent to admin');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        data: { sent: true },
        message: 'Thank you for your message! We\'ll get back to you soon.',
      }),
    };
  } catch (error) {
    console.error('Contact form error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
    };
  }
}; 