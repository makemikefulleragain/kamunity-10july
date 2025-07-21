import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { GoogleAuth } from 'google-auth-library';

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
      // Initialize the client with service account credentials
      const auth = new GoogleAuth({
        keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE, // Path to service account JSON
        scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
      });

      this.analyticsDataClient = new BetaAnalyticsDataClient({ auth });
    } catch (error) {
      console.error('Failed to initialize GA4 client:', error);
      
      // Fallback: Try using environment variables for credentials
      if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
        try {
          const auth = new GoogleAuth({
            credentials: {
              client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
              private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
          });

          this.analyticsDataClient = new BetaAnalyticsDataClient({ auth });
        } catch (fallbackError) {
          console.error('Fallback GA4 initialization failed:', fallbackError);
        }
      }
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