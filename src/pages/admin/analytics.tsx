import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import netlifyIdentity from 'netlify-identity-widget';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/admin/AdminLayout';

interface User {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
  app_metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface AnalyticsData {
  totalPageViews: number;
  totalSessions: number;
  totalUsers: number;
  conversionRate: number;
  topPages: Array<{
    path: string;
    views: number;
    percentage: number;
  }>;
  trafficSources: Array<{
    source: string;
    users: number;
    percentage: number;
  }>;
  timeSeriesData: Array<{
    date: string;
    pageViews: number;
    users: number;
    sessions: number;
  }>;
  realtimeUsers: number;
}

interface ReactionAnalytics {
  totalReactions: number;
  reactionsByType: {
    [reactionType: string]: {
      count: number;
      percentage: number;
      trend: 'up' | 'down' | 'stable';
    };
  };
  contentPerformance: Array<{
    contentId: string;
    title: string;
    totalReactions: number;
    reactionBreakdown: { [reactionType: string]: number };
    engagementScore: number;
    topReaction: string;
  }>;
  userBehaviorMetrics: {
    averageReactionsPerUser: number;
    mostActiveTimeOfDay: string;
    peakEngagementDays: string[];
    reactionPatterns: {
      quickReactors: number;
      thoughtfulReactors: number;
      multiReactors: number;
    };
  };
  contentInsights: {
    highPerformingContent: Array<{
      contentId: string;
      title: string;
      engagementScore: number;
      dominantReaction: string;
    }>;
    underperformingContent: Array<{
      contentId: string;
      title: string;
      engagementScore: number;
      suggestedImprovements: string[];
    }>;
  };
}

type TimeRange = '7d' | '30d' | '90d';

export default function AdminAnalytics() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [reactionAnalytics, setReactionAnalytics] = useState<ReactionAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [reactionLoading, setReactionLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const router = useRouter();

  // Authentication setup
  useEffect(() => {
    netlifyIdentity.init();
    
    const currentUser = netlifyIdentity.currentUser();
    setUser(currentUser);
    setLoading(false);

    netlifyIdentity.on('login', (user: User) => {
      setUser(user);
      netlifyIdentity.close();
    });

    netlifyIdentity.on('logout', () => {
      setUser(null);
      router.push('/admin');
    });

    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, [router]);

  // Fetch analytics when user is authenticated
  useEffect(() => {
    if (user) {
      fetchAnalytics();
      fetchReactionAnalytics();
    }
  }, [user, timeRange]);

  // Auto-refresh reaction analytics every 30 seconds when user is active
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      // Only refresh if not currently loading
      if (!reactionLoading && !analyticsLoading) {
        fetchReactionAnalytics();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user, reactionLoading, analyticsLoading]);

  const handleLogin = () => {
    netlifyIdentity.open();
  };

  const handleLogout = () => {
    netlifyIdentity.logout();
  };

  // Hybrid data approach - mock data with real API structure
  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      // TODO: Replace with real API call when ready
      // const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);
      // const data = await response.json();
      
      // Mock data for now (easy switch to real API later)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const multiplier = timeRange === '7d' ? 1 : timeRange === '30d' ? 4 : 12;
      
      const mockAnalytics: AnalyticsData = {
        totalPageViews: 7500 * multiplier + Math.floor(Math.random() * 1000),
        totalSessions: 2100 * multiplier + Math.floor(Math.random() * 300),
        totalUsers: 1800 * multiplier + Math.floor(Math.random() * 250),
        conversionRate: 1.57 + (Math.random() - 0.5) * 0.3,
        realtimeUsers: Math.floor(Math.random() * 25) + 5,
        topPages: [
          { path: '/', views: 2639, percentage: 35.2 },
          { path: '/about', views: 1885, percentage: 25.1 },
          { path: '/content', views: 1508, percentage: 20.1 },
          { path: '/kai-crew', views: 905, percentage: 12.1 },
          { path: '/contact', views: 563, percentage: 7.5 }
        ],
        trafficSources: [
          { source: 'Direct', users: 890, percentage: 49.4 },
          { source: 'Google', users: 456, percentage: 25.3 },
          { source: 'Social', users: 234, percentage: 13.0 },
          { source: 'Referral', users: 220, percentage: 12.3 }
        ],
        timeSeriesData: Array.from({ length: days }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (days - 1 - i));
          const baseViews = 150 + Math.sin(i * 0.3) * 50;
          const variance = Math.random() * 80 - 40;
          return {
            date: date.toISOString().split('T')[0],
            pageViews: Math.max(50, Math.floor(baseViews + variance)),
            users: Math.max(20, Math.floor((baseViews + variance) * 0.6)),
            sessions: Math.max(30, Math.floor((baseViews + variance) * 0.8))
          };
        })
      };

      setAnalytics(mockAnalytics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Fetch reaction analytics
  const fetchReactionAnalytics = async () => {
    setReactionLoading(true);
    try {
      const response = await fetch(`/api/admin/reaction-analytics?timeRange=${timeRange}`);
      const data = await response.json();
      
      if (data.success) {
        setReactionAnalytics(data.data);
        setLastUpdated(new Date()); // Update timestamp when reaction data is refreshed
      } else {
        console.error('Error fetching reaction analytics:', data.error);
      }
    } catch (error) {
      console.error('Error fetching reaction analytics:', error);
    } finally {
      setReactionLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTimeRangeLabel = (range: TimeRange) => {
    switch (range) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      default: return 'Last 30 days';
    }
  };

  // Loading state
  if (loading) {
    return (
      <AdminLayout title="Analytics Dashboard - Kamunity" user={user} onSignOut={handleLogout}>
        <div className="min-h-full flex items-center justify-center">
          <div className="text-center">
            <div className="spinner w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Authentication check
  if (!user) {
    return (
      <AdminLayout title="Admin Login - Kamunity" user={null}>
        <div className="min-h-full flex items-center justify-center bg-gray-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-indigo-700 mb-2">Admin Access</h1>
              <p className="text-gray-600">Sign in to access analytics dashboard</p>
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full btn-primary"
            >
              Sign In with Netlify Identity
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don't have admin access? Contact the site administrator.
              </p>
            </div>
          </motion.div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analytics Dashboard - Kamunity" user={user} onSignOut={handleLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Track your community growth and engagement</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button
                onClick={() => {
                  fetchAnalytics();
                  fetchReactionAnalytics();
                }}
                className="btn-primary"
                disabled={analyticsLoading || reactionLoading}
              >
                {(analyticsLoading || reactionLoading) ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
          {lastUpdated && (
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
                {(analyticsLoading || reactionLoading) && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-600">Updating...</span>
                  </div>
                )}
              </div>
          )}
        </div>

        {/* MOCK DATA WARNING */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                🚨 GA4 ANALYTICS: MOCK DATA - NOT REAL
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Page views, traffic sources, and conversion data below are simulated. Only subscriber and emoji reaction data are authentic.</p>
              </div>
            </div>
          </div>
        </div>

        {analyticsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="spinner w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        ) : analytics ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Page Views</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.totalPageViews)}</p>
                    <p className="text-xs text-gray-500">{getTimeRangeLabel(timeRange)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.totalUsers)}</p>
                    <p className="text-xs text-gray-500">{getTimeRangeLabel(timeRange)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate.toFixed(2)}%</p>
                    <p className="text-xs text-gray-500">vs last period</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Real-time Users</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.realtimeUsers}</p>
                    <p className="text-xs text-gray-500">Currently online</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Traffic & Subscribers Over Time */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic & Subscribers Over Time</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📈</div>
                    <p className="text-gray-500 mb-2">Chart visualization ready</p>
                    <p className="text-xs text-gray-400">
                      {analytics.timeSeriesData.length} data points loaded
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Avg Page Views</p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {Math.round(analytics.timeSeriesData.reduce((sum, d) => sum + d.pageViews, 0) / analytics.timeSeriesData.length)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Avg Users</p>
                    <p className="text-lg font-semibold text-green-600">
                      {Math.round(analytics.timeSeriesData.reduce((sum, d) => sum + d.users, 0) / analytics.timeSeriesData.length)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Pages */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
                <div className="space-y-4">
                  {analytics.topPages.map((page, index) => (
                    <div key={page.path} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 mr-3">#{index + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{page.path}</p>
                          <p className="text-xs text-gray-500">{page.views.toLocaleString()} views</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${page.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12 text-right">
                          {page.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {analytics.trafficSources.map((source) => (
                  <div key={source.source} className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      source.source === 'Direct' ? 'bg-blue-100' :
                      source.source === 'Google' ? 'bg-green-100' :
                      source.source === 'Social' ? 'bg-purple-100' :
                      'bg-gray-100'
                    }`}>
                      {source.source === 'Direct' && '🔗'}
                      {source.source === 'Google' && '🔍'}
                      {source.source === 'Social' && '📱'}
                      {source.source === 'Referral' && '🌐'}
                    </div>
                    <h4 className="font-semibold text-gray-900">{source.source}</h4>
                    <p className="text-2xl font-bold text-indigo-600 my-1">{source.users}</p>
                    <p className="text-sm text-gray-500">{source.percentage.toFixed(1)}% of traffic</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reaction Analytics Section */}
            {reactionAnalytics && (
              <>
                {/* Reaction Overview */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-100 mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Emoji Reaction Analytics</h3>
                      <p className="text-gray-600">Community engagement through emoji reactions</p>
                    </div>
                    <div className="text-3xl">🎯</div>
                  </div>

                  {/* Reaction Metrics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <span className="text-2xl">❤️</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">Total Reactions</p>
                          <p className="text-xl font-bold text-gray-900">{reactionAnalytics.totalReactions.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <span className="text-2xl">👤</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">Avg per User</p>
                          <p className="text-xl font-bold text-gray-900">{reactionAnalytics.userBehaviorMetrics.averageReactionsPerUser}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <span className="text-2xl">⏰</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">Peak Time</p>
                          <p className="text-sm font-bold text-gray-900">{reactionAnalytics.userBehaviorMetrics.mostActiveTimeOfDay}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reaction Types Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Reaction Types Distribution</h3>
                    <div className="space-y-4">
                      {Object.entries(reactionAnalytics.reactionsByType).map(([type, data]) => {
                        const emojiMap: { [key: string]: string } = {
                          'FUN': '😄',
                          'FACTUAL': '🎯',
                          'SPICY': '🌶️',
                          'NICE': '💝',
                          'UNUSUAL': '🤔',
                          'CURIOUS': '🔍'
                        };
                        
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{emojiMap[type] || '❓'}</span>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{type}</p>
                                <p className="text-xs text-gray-500">{data.count} reactions</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full"
                                  style={{ width: `${Math.min(data.percentage, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900 w-12 text-right">
                                {data.percentage.toFixed(1)}%
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                data.trend === 'up' ? 'bg-green-100 text-green-700' :
                                data.trend === 'down' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {data.trend === 'up' ? '↗️' : data.trend === 'down' ? '↘️' : '→'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* User Behavior Patterns */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">User Behavior Patterns</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Reaction Speed</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Quick Reactors (⚡)</span>
                            <span className="text-sm font-medium">{reactionAnalytics.userBehaviorMetrics.reactionPatterns.quickReactors}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Thoughtful Reactors (🤔)</span>
                            <span className="text-sm font-medium">{reactionAnalytics.userBehaviorMetrics.reactionPatterns.thoughtfulReactors}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Multi Reactors (🔥)</span>
                            <span className="text-sm font-medium">{reactionAnalytics.userBehaviorMetrics.reactionPatterns.multiReactors}%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Peak Engagement Days</h4>
                        <div className="flex flex-wrap gap-2">
                          {reactionAnalytics.userBehaviorMetrics.peakEngagementDays.map((day) => (
                            <span key={day} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Performance Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                  {/* Top Performing Content */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">🏆 Top Performing Content</h3>
                    <div className="space-y-4">
                      {reactionAnalytics.contentInsights.highPerformingContent.map((content, index) => {
                        const emojiMap: { [key: string]: string } = {
                          'FUN': '😄',
                          'FACTUAL': '🎯',
                          'SPICY': '🌶️',
                          'NICE': '💝',
                          'UNUSUAL': '🤔',
                          'CURIOUS': '🔍'
                        };
                        
                        return (
                          <div key={content.contentId} className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <span className="text-lg mr-2">#{index + 1}</span>
                                <span className="text-lg mr-2">{emojiMap[content.dominantReaction] || '❓'}</span>
                              </div>
                              <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                Score: {content.engagementScore}
                              </span>
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm mb-1">{content.title}</h4>
                            <p className="text-xs text-gray-600">Dominant reaction: {content.dominantReaction}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Content Needing Attention */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">💡 Content Insights</h3>
                    <div className="space-y-4">
                      {reactionAnalytics.contentInsights.underperformingContent.map((content) => (
                        <div key={content.contentId} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-lg">📊</span>
                            <span className="text-sm font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                              Score: {content.engagementScore}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 text-sm mb-2">{content.title}</h4>
                          <div className="space-y-1">
                            {content.suggestedImprovements.map((suggestion, index) => (
                              <p key={index} className="text-xs text-gray-600">• {suggestion}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Reaction Analytics Loading State */}
            {reactionLoading && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-8">
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="spinner w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading reaction analytics...</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-500">No analytics data available</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 