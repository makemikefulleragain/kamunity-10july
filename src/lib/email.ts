// Server-side only - DO NOT import this in client components!
import { Resend } from 'resend';
import { EmailFormData } from '@/types';
import { sanitizeInput } from './utils';

// Initialize Resend with API key
const initializeResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Resend API key not found in environment variables');
    return null;
  }
  
  return new Resend(apiKey);
};

/**
 * Generate HTML template for thank you email
 */
const getThankYouEmailHtml = (email: string, source: string): string => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kamunity.org';
  const currentYear = new Date().getFullYear();
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Kamunity</title>
  <style>
    body { 
      font-family: 'Inter', Arial, sans-serif; 
      line-height: 1.6; 
      color: #2d2d2d; 
      margin: 0; 
      padding: 0;
      background-color: #f9fafb;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px; 
    }
    .header { 
      background: linear-gradient(135deg, #E6E6FA 0%, #FFF 100%); 
      padding: 30px; 
      text-align: center; 
      border-radius: 16px 16px 0 0; 
      border: 1px solid #e0e0e0;
    }
    .content { 
      background: #fff; 
      padding: 30px; 
      border: 1px solid #e0e0e0; 
      border-top: none;
    }
    .footer { 
      background: #f8fafc;
      text-align: center; 
      padding: 20px;
      color: #666; 
      font-size: 14px; 
      border: 1px solid #e0e0e0;
      border-top: none;
      border-radius: 0 0 16px 16px;
    }
    h1 { 
      color: #4338ca; 
      margin-bottom: 10px; 
      font-size: 28px;
    }
    .tagline { 
      color: #f59e0b; 
      font-style: italic; 
      font-size: 18px; 
      margin-bottom: 0;
    }
    .button { 
      display: inline-block; 
      background: #4f46e5; 
      color: white; 
      padding: 12px 30px; 
      text-decoration: none; 
      border-radius: 8px; 
      margin-top: 20px; 
      font-weight: 500;
    }
    .button:hover { 
      background: #4338ca; 
    }
    .security-note {
      background: #f0f9ff;
      border: 1px solid #0ea5e9;
      border-radius: 8px;
      padding: 16px;
      margin-top: 20px;
      font-size: 14px;
    }
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
      <a href="${siteUrl}" class="button">Visit Kamunity</a>
      
      <div class="security-note">
        <strong>🔒 Your Privacy Matters:</strong> We respect your privacy and will never share your email address with third parties. You can unsubscribe at any time.
      </div>
    </div>
    <div class="footer">
      <p><strong>© ${currentYear} Kamunity. All rights reserved.</strong></p>
      <p>You're receiving this email because you signed up at kamunity.org from: ${source}</p>
      <p>If you didn't sign up for this, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
`;
};

/**
 * Send thank you email to new subscriber using Resend
 */
export async function sendThankYouEmail(formData: EmailFormData): Promise<boolean> {
  try {
    // Initialize Resend
    const resend = initializeResend();
    if (!resend) {
      return false;
    }
    
    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(formData.email);
    const sanitizedSource = sanitizeInput(formData.source);
    
    // Validate email format again
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      console.error('Invalid email format in sendThankYouEmail:', sanitizedEmail);
      return false;
    }
    
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@kamunity.org';
    const ccEmail = process.env.MIKE_FULLER_EMAIL;
    
    // Prepare email message for Resend
    const emailData: any = {
      from: `Kamunity Team <${fromEmail}>`,
      to: [sanitizedEmail],
      subject: 'Welcome to Kamunity - Your Journey Begins! 🌟',
      text: `Welcome to Kamunity!\n\nThank you for joining us. Community begins with one spark.\n\nWe're excited to have you as part of our growing community. Stay tuned for updates on our latest developments and initiatives.\n\nBest regards,\nThe Kamunity Team\n\n${process.env.NEXT_PUBLIC_SITE_URL || 'https://kamunity.ai'}`,
      html: getThankYouEmailHtml(sanitizedEmail, sanitizedSource),
    };
    
    // Add CC if configured
    if (ccEmail && ccEmail !== 'admin@kamunity.org') {
      emailData.cc = [ccEmail];
    }
    
    // Send email using Resend
    const { data, error } = await resend.emails.send(emailData);
    
    if (error) {
      console.error('Resend email error:', error);
      return false;
    }
    
    console.log('Thank you email sent successfully via Resend:', sanitizedEmail, 'ID:', data?.id);
    
    // Log for analytics (remove in production or use proper logging service)
    console.log(`New subscriber: ${sanitizedEmail} from ${sanitizedSource} at ${formData.timestamp}`);
    
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

/**
 * Send notification email to admin using Resend
 */
export async function sendAdminNotification(
  subject: string, 
  message: string, 
  metadata?: Record<string, any>
): Promise<boolean> {
  try {
    const resend = initializeResend();
    if (!resend) {
      return false;
    }
    
    const adminEmail = process.env.MIKE_FULLER_EMAIL;
    if (!adminEmail || adminEmail === 'admin@kamunity.org') {
      console.log('Admin email not configured, skipping notification');
      return false;
    }
    
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@kamunity.org';
    
    const emailData = {
      from: `Kamunity System <${fromEmail}>`,
      to: [adminEmail],
      subject: `[Kamunity] ${sanitizeInput(subject)}`,
      text: `${sanitizeInput(message)}\n\nMetadata: ${JSON.stringify(metadata, null, 2)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4338ca;">${sanitizeInput(subject)}</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <pre style="white-space: pre-wrap; font-family: inherit;">${sanitizeInput(message)}</pre>
          </div>
          ${metadata ? `
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0;">Additional Information:</h4>
              <pre style="font-size: 12px; overflow-x: auto;">${JSON.stringify(metadata, null, 2)}</pre>
            </div>
          ` : ''}
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>This notification was sent automatically by the Kamunity system.</p>
          </div>
        </div>
      `
    };
    
    const { data, error } = await resend.emails.send(emailData);
    
    if (error) {
      console.error('Resend admin notification error:', error);
      return false;
    }
    
    console.log('Admin notification sent successfully via Resend, ID:', data?.id);
    return true;
  } catch (error) {
    console.error('Admin notification email error:', error);
    return false;
  }
} 