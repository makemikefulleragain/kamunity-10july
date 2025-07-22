import { NextApiRequest, NextApiResponse } from 'next';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const debug = {
    timestamp: new Date().toISOString(),
    environment: 'production',
    approach: 'full_json_credentials',
    checks: {} as any
  };

  try {
    // Check environment variables
    debug.checks.env_vars = {
      GA4_PROPERTY_ID: !!process.env.NEXT_PUBLIC_GA4_PROPERTY_ID,
      GA4_PROPERTY_ID_VALUE: process.env.NEXT_PUBLIC_GA4_PROPERTY_ID || 'missing',
    };

    // Create full credentials object
    const credentials = {
      type: "service_account",
      project_id: "kamunity-analytics",
      private_key_id: "e78c0f9e4d1bc15f49a0ff809f11fd159f075cd3",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0T0Vjj5NmR8Bg\nlLnU5Ku23G/TQ4USMEUHeCibrYEftiTpSonZXI5rHxgwtAiSohxNm2/VloEfay/M\nb8UfxlJx1q/V9HqSiRbJIHfpFbkXL3GbABXWKOhi7sD5KGGCyXM1MatY/rHUVU5y\ncMTEIfqDHIXKnffepYl/6090oSP7XKb1miv265rTT9QdhBG6fyxW+i0PAeQClqQC\nKjKOm7JRuWFjeKuq8KfsspMVitvivFVvlWWNb2WOutGuuQYCrBi/kJO4UUdiQqe3\nqHee4+q+IFrnFjwv0xHiF+sEcFa8ZD8mBcHHTxuhQFr7nSe8UyWAH6kQQtiB7tmL\nun92jXjXAgMBAAECggEADeaYnmLYxcddVPTSWM/iTyAyfNKVRUA0ai2Az/Ox4zx7\nHwMwmnHQxwBoMIUIrilSTkdf+VL3lHECh9vMEjWLcJxRBQkqk/Z+q7XVmMIkeV2e\ngAkjJdYUiGAIv4y168vVFnJEWAGWuxxyhk8cVFScSBRgWi0QiXkwnwyInSC5Me0i\n4TJyPWQoLvcClGHdyCPm21OLLs56LFTn6fDZoMHGSDJDKa0ovF737ovfwHIFcpC7\nxBZ1lyRofX0CjUDjZYxW5JlDLSfL/i8bFHVCmrhuibYcGm1yDhAxY4EmBdJ8vfZE\n4I5N5SVMBfEv4q9t1EVYokitzE4/3MCtHHib1fjbiQKBgQDufJNOBfkIL0oEdYBJ\nZvtnV9i3m/FNPjBGfhXroB5EQ+gj6gemp8Qj2ZFK7u5hiNfCqsUL7FZ+gvPyEhXB\nFi2jmjRE0ADQpgUEK2carjn4k4DVb6cStSSBx8bWL4i23p8hlkem3xxUM8vDKCWB\nxbSPrM/Z9sZcSN8ldBqeFjf0TwKBgQDBjP+zXO0fSfNXJeB1aGFxLiFbY2z1K9wh\nbnS4WLHrgmbyIlosOldKKRQ+vFi9gdXc4TopQvTLfOSjjpSX3tox6aP200nYGEYw\nOWvYUU+q+IFILoVBEJIQiUCc5uqvx1LRD8v3HOUpTlWrQ4Dx9Ih/s8fJX/aJMZx3\nTv5V1SOo+QKBgCsEI1nGcAXO6c3mF86lmaEpUjjEEwE4v2JnqbKHfg4YJY4cz2Z7\nCkDhJHjcofjLwwck4EfnSC6nljLKmkvqoS7KSLVEw3DfETaQUZeZZ3FzwaA99GfG\nbqBOFYpappE9lHxta90ojEO/1/gKjMFclNX5eMA658qLhlxuFcMABPW3AoGAVFBc\nz0Cq1xd61rrcRaj70bb7tvjf7Ql3MmUQmYGht+std0s5psyfW+H7PL0Fl0Ao7rh6\ngqD1THOSkiE5X9Mnj9isoYg3QdiJMtbAwRHit6LbhpslV0ulpWh06iS5lWsqC4Jr\nIrHGrjC+pwWX9U7F64Ngg7u3BNrEw0B5EODxUNkCgYEAoa5PR0l6HSCskVxTUp51\n42v1SZT2nSnFADHPGZwAg1udXjDcG5f2hnuQt2C83IxMlW6qRikD+7W/8gmO+JvR\nm9sPc1wZGOpaXZ6UYkIMK9EvmcLLipUmEUuDLFwOT9f5eCdvg8WDqwtYIm8fuFXS\neshoWKy7ZB/Rmm0Lf50y7d8=\n-----END PRIVATE KEY-----",
      client_email: "kamunity-analytics-reader@kamunity-analytics.iam.gserviceaccount.com",
      client_id: "110032659068086627894",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/kamunity-analytics-reader%40kamunity-analytics.iam.gserviceaccount.com",
      universe_domain: "googleapis.com"
    };

    debug.checks.credentials_created = { success: true };

    // Test analytics client creation
    try {
      const analyticsDataClient = new BetaAnalyticsDataClient({
        credentials
      });

      debug.checks.client_creation = { success: true };

      // Test simple API call
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