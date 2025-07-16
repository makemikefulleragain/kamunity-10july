const { Resend } = require('resend');

// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

// Email template
const getThankYouEmailHtml = (email) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Kamunity</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #2d2d2d; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #E6E6FA 0%, #FFF 100%); padding: 30px; text-align: center; border-radius: 16px; }
    .content { background: #fff; padding: 30px; margin-top: 20px; border: 1px solid #e0e0e0; border-radius: 16px; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    h1 { color: #4338ca; margin-bottom: 10px; }
    .tagline { color: #f59e0b; font-style: italic; font-size: 18px; }
    .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
    .button:hover { background: #4338ca; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Kamunity!</h1>
      <p class="tagline">Community begins with one spark.</p>
    </div>
    <div class="content">
      <p>Hi there!</p>
      <p>Thank you for your interest in Kamunity. We're thrilled to have you join us on this journey of building something bigger together.</p>
      <p>We'll keep you updated on our latest developments, community initiatives, and exciting content. Get ready to be part of a movement that values connection, growth, and positive change.</p>
      <p>In the meantime, feel free to explore our website and engage with Kai, our friendly chat companion who's always ready to help!</p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://kamunity.ai'}" class="button">Visit Kamunity</a>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Kamunity. All rights reserved.</p>
      <p>You're receiving this email because you signed up at kamunity.ai</p>
    </div>
  </div>
</body>
</html>
`;

exports.handler = async (event, context) => {
  console.log('Subscribe function called');
  console.log('Environment check:', {
    hasResendKey: !!process.env.RESEND_API_KEY,
            fromEmail: process.env.RESEND_FROM_EMAIL || 'hello@kamunity.ai',
    adminEmail: process.env.MIKE_FULLER_EMAIL || 'not set'
  });

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

  try {
    console.log('Parsing request body...');
    const { email, source, recaptchaToken, timestamp } = JSON.parse(event.body);
    console.log('Request data:', { email, source, hasToken: !!recaptchaToken });

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedSource = sanitizeInput(source);

    // Validate input
    if (!sanitizedEmail || !sanitizedSource) {
      console.log('Missing required fields');
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

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      console.log('Invalid email format:', sanitizedEmail);
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
    console.log('Processing subscription without reCAPTCHA verification');

    // Initialize Resend
    console.log('Initializing Resend...');
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Prepare email message
          const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@kamunity.ai';
    const adminEmail = process.env.MIKE_FULLER_EMAIL;

    console.log('Preparing email message...');
    const msg = {
      to: [sanitizedEmail],
      from: `Kamunity Team <${fromEmail}>`,
      cc: adminEmail && adminEmail !== 'admin@kamunity.ai' ? [adminEmail] : undefined,
      subject: 'Welcome to Kamunity - Your Journey Begins!',
      text: `Welcome to Kamunity! Thank you for joining us. Community begins with one spark.`,
      html: getThankYouEmailHtml(sanitizedEmail),
    };

    console.log('Sending email via Resend...');
    const { data, error } = await resend.emails.send(msg);
    
    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Email send failed: ${JSON.stringify(error)}`);
    }

    console.log('Email sent successfully:', data);
    console.log('Thank you email sent successfully to:', sanitizedEmail);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        data: { subscribed: true },
        message: 'Successfully subscribed! Check your email for confirmation.',
      }),
    };
  } catch (error) {
    console.error('Subscription error details:', {
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