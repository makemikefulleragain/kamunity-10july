import { BetaAnalyticsDataClient } from '@google-analytics/data';

// GA4 Analytics Service
class GA4Service {
  private analyticsDataClient: BetaAnalyticsDataClient | null = null;
  private propertyId: string;

  constructor(propertyId: string) {
    this.propertyId = propertyId;
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      // Use full credentials object - this approach works!
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

      this.analyticsDataClient = new BetaAnalyticsDataClient({ credentials });
    } catch (error) {
      console.error('Failed to initialize GA4 client:', error);
    }
  }

  // Check if client is ready
  private isClientReady(): boolean {
    return this.analyticsDataClient !== null;
  }

  // Get basic analytics metrics
  async getBasicMetrics(startDate = '30daysAgo', endDate = 'today') {
    if (!this.isClientReady()) {
      throw new Error('GA4 client not initialized');
    }

    try {
      const [response] = await this.analyticsDataClient!.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'users' },
          { name: 'newUsers' },
          { name: 'sessions' },
          { name: 'engagementRate' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
        ],
      });

      const metrics = response.rows?.[0]?.metricValues || [];
      
      return {
        pageViews: parseInt(metrics[0]?.value || '0'),
        users: parseInt(metrics[1]?.value || '0'),
        newUsers: parseInt(metrics[2]?.value || '0'),
        sessions: parseInt(metrics[3]?.value || '0'),
        engagementRate: parseFloat(metrics[4]?.value || '0'),
        averageSessionDuration: parseFloat(metrics[5]?.value || '0'),
        bounceRate: parseFloat(metrics[6]?.value || '0'),
      };
    } catch (error) {
      console.error('Error fetching basic metrics:', error);
      throw error;
    }
  }

  // Get real-time active users
  async getRealTimeUsers() {
    if (!this.isClientReady()) {
      return 0;
    }

    try {
      const [response] = await this.analyticsDataClient!.runRealtimeReport({
        property: `properties/${this.propertyId}`,
        metrics: [{ name: 'activeUsers' }],
      });

      return parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0');
    } catch (error) {
      console.error('Error fetching real-time users:', error);
      return 0;
    }
  }

  // Get top pages
  async getTopPages(startDate = '30daysAgo', endDate = 'today', maxResults = 10) {
    if (!this.isClientReady()) {
      return [];
    }

    try {
      const [response] = await this.analyticsDataClient!.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: maxResults,
      });

      return (response.rows || []).map((row, index) => ({
        rank: index + 1,
        path: row.dimensionValues?.[0]?.value || '',
        title: row.dimensionValues?.[1]?.value || '',
        views: parseInt(row.metricValues?.[0]?.value || '0'),
      }));
    } catch (error) {
      console.error('Error fetching top pages:', error);
      return [];
    }
  }

  // Get traffic sources
  async getTrafficSources(startDate = '30daysAgo', endDate = 'today') {
    if (!this.isClientReady()) {
      return { direct: 0, organic: 0, social: 0, referral: 0 };
    }

    try {
      const [response] = await this.analyticsDataClient!.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
      });

      const sources = { direct: 0, organic: 0, social: 0, referral: 0 };
      
      (response.rows || []).forEach(row => {
        const channel = row.dimensionValues?.[0]?.value?.toLowerCase() || '';
        const sessions = parseInt(row.metricValues?.[0]?.value || '0');

        if (channel.includes('direct')) sources.direct += sessions;
        else if (channel.includes('organic') || channel.includes('search')) sources.organic += sessions;
        else if (channel.includes('social')) sources.social += sessions;
        else sources.referral += sessions;
      });

      return sources;
    } catch (error) {
      console.error('Error fetching traffic sources:', error);
      return { direct: 0, organic: 0, social: 0, referral: 0 };
    }
  }

  // Get page-specific analytics for content performance
  async getPageAnalytics(pagePath: string, startDate = '30daysAgo', endDate = 'today') {
    if (!this.isClientReady()) {
      return { views: 0, users: 0, averageTime: 0, bounceRate: 0 };
    }

    try {
      const [response] = await this.analyticsDataClient!.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        dimensionFilter: {
          filter: {
            fieldName: 'pagePath',
            stringFilter: { matchType: 'EXACT', value: pagePath },
          },
        },
        metrics: [
          { name: 'screenPageViews' },
          { name: 'users' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
        ],
      });

      const metrics = response.rows?.[0]?.metricValues || [];
      
      return {
        views: parseInt(metrics[0]?.value || '0'),
        users: parseInt(metrics[1]?.value || '0'),
        averageTime: parseFloat(metrics[2]?.value || '0'),
        bounceRate: parseFloat(metrics[3]?.value || '0'),
      };
    } catch (error) {
      console.error(`Error fetching analytics for ${pagePath}:`, error);
      return { views: 0, users: 0, averageTime: 0, bounceRate: 0 };
    }
  }

  // Get conversion metrics (subscribers/sign-ups)
  async getConversions(startDate = '30daysAgo', endDate = 'today') {
    if (!this.isClientReady()) {
      return { total: 0, rate: 0 };
    }

    try {
      // Look for form_submit events (our subscription tracking)
      const [response] = await this.analyticsDataClient!.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'eventName' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            stringFilter: { matchType: 'CONTAINS', value: 'form_submit' },
          },
        },
        metrics: [{ name: 'eventCount' }],
      });

      const totalConversions = (response.rows || []).reduce((sum, row) => {
        return sum + parseInt(row.metricValues?.[0]?.value || '0');
      }, 0);

      // Get total users for conversion rate calculation
      const basicMetrics = await this.getBasicMetrics(startDate, endDate);
      const conversionRate = basicMetrics.users > 0 ? (totalConversions / basicMetrics.users) * 100 : 0;

      return {
        total: totalConversions,
        rate: parseFloat(conversionRate.toFixed(2)),
      };
    } catch (error) {
      console.error('Error fetching conversions:', error);
      return { total: 0, rate: 0 };
    }
  }
}

// Export a singleton instance
let ga4Service: GA4Service | null = null;

export const getGA4Service = (): GA4Service | null => {
  if (!process.env.NEXT_PUBLIC_GA4_PROPERTY_ID) {
    console.warn('GA4_PROPERTY_ID not set - using mock data');
    return null;
  }

  if (!ga4Service) {
    ga4Service = new GA4Service(process.env.NEXT_PUBLIC_GA4_PROPERTY_ID);
  }

  return ga4Service;
};

// Fallback data for when GA4 is not available
export const getMockAnalyticsData = () => ({
  basicMetrics: {
    pageViews: 2286,
    users: 1850,
    newUsers: 1234,
    sessions: 2100,
    engagementRate: 0.72,
    averageSessionDuration: 145,
    bounceRate: 0.28,
  },
  realTimeUsers: 27,
  topPages: [
    { rank: 1, path: '/', title: 'Home', views: 1639 },
    { rank: 2, path: '/about', title: 'About', views: 865 },
    { rank: 3, path: '/content', title: 'Content', views: 508 },
    { rank: 4, path: '/kai-crew', title: 'Kai Crew', views: 305 },
    { rank: 5, path: '/contact', title: 'Contact', views: 163 },
  ],
  trafficSources: { direct: 890, organic: 456, social: 234, referral: 220 },
  conversions: { total: 42, rate: 1.72 },
});

export default GA4Service; 