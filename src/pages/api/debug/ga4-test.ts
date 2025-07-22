import { NextApiRequest, NextApiResponse } from 'next';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { GoogleAuth } from 'google-auth-library';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const debug = {
    timestamp: new Date().toISOString(),
    environment: 'production',
    checks: {} as any
  };

  try {
    // Check 1: Environment Variables
    debug.checks.env_vars = {
      GA4_PROPERTY_ID: !!process.env.NEXT_PUBLIC_GA4_PROPERTY_ID,
      GA4_PROPERTY_ID_VALUE: process.env.NEXT_PUBLIC_GA4_PROPERTY_ID || 'missing',
      SERVICE_ACCOUNT_EMAIL: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      SERVICE_ACCOUNT_EMAIL_VALUE: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'missing',
      PRIVATE_KEY_EXISTS: !!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
      PRIVATE_KEY_LENGTH: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.length || 0,
      PRIVATE_KEY_STARTS_WITH: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.substring(0, 50) || 'missing'
    };

    // Check 2: Google Auth Creation
    try {
      const auth = new GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
      });

      debug.checks.auth_creation = { success: true };

      // Check 3: Analytics Client Creation  
      try {
        const analyticsDataClient = new BetaAnalyticsDataClient({ auth });
        debug.checks.client_creation = { success: true };

        // Check 4: Simple GA4 API Call
        try {
          const [response] = await analyticsDataClient.runReport({
            property: `properties/${process.env.NEXT_PUBLIC_GA4_PROPERTY_ID}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            metrics: [{ name: 'screenPageViews' }],
          });

          const pageViews = response.rows?.[0]?.metricValues?.[0]?.value || '0';
          debug.checks.api_call = { 
            success: true, 
            pageViews: parseInt(pageViews),
            rowCount: response.rows?.length || 0 
          };

        } catch (apiError: any) {
          debug.checks.api_call = { 
            success: false, 
            error: apiError.message,
            code: apiError.code,
            details: apiError.details 
          };
        }

      } catch (clientError: any) {
        debug.checks.client_creation = { 
          success: false, 
          error: clientError.message 
        };
      }

    } catch (authError: any) {
      debug.checks.auth_creation = { 
        success: false, 
        error: authError.message 
      };
    }

    return res.status(200).json({
      success: true,
      debug
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
      debug
    });
  }
} 