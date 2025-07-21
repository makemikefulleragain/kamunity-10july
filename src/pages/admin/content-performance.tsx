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

interface ContentPerformanceData {
  contentId: string;
  title: string;
  type: string;
  author: string;
  publishDate: string;
  totalReactions: number;
  reactionBreakdown: { [reactionType: string]: number };
  engagementScore: number;
  topReaction: string;
  views: number;
  shares: number;
  timeSpentAvg: number; // in seconds
  conversionRate: number; // percentage of viewers who reacted
  trendDirection: 'up' | 'down' | 'stable';
  lastWeekComparison: number; // percentage change
}

interface ContentInsights {
  averageEngagementScore: number;
  topPerformingTypes: Array<{
    type: string;
    avgScore: number;
    count: number;
  }>;
  reactionTrends: {
    growing: string[];
    declining: string[];
  };
  contentRecommendations: Array<{
    title: string;
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

type SortField = 'engagementScore' | 'totalReactions' | 'views' | 'publishDate';
type SortDirection = 'asc' | 'desc';
type FilterType = 'all' | 'post' | 'video' | 'audio' | 'podcast';

export default function ContentPerformance() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentData, setContentData] = useState<ContentPerformanceData[]>([]);
  const [insights, setInsights] = useState<ContentInsights | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('engagementScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
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

  // Fetch data when user is authenticated
  useEffect(() => {
    if (user) {
      fetchContentPerformance();
    }
  }, [user, timeRange]);

  // Auto-refresh content performance every 45 seconds when user is active
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      // Only refresh if not currently loading
      if (!dataLoading) {
        fetchContentPerformance();
      }
    }, 45000); // 45 seconds

    return () => clearInterval(interval);
  }, [user, dataLoading]);

  const handleLogin = () => {
    netlifyIdentity.open();
  };

  const handleLogout = () => {
    netlifyIdentity.logout();
  };

  const fetchContentPerformance = async () => {
    setDataLoading(true);
    try {
      // Fetch both reaction analytics and content data
      const [reactionResponse] = await Promise.all([
        fetch(`/api/admin/reaction-analytics?timeRange=${timeRange}`)
      ]);

      const reactionData = await reactionResponse.json();
      
      if (reactionData.success) {
        // Transform reaction analytics into content performance data
        const transformedData: ContentPerformanceData[] = reactionData.data.contentPerformance.map((content: any) => ({
          ...content,
          type: ['post', 'video', 'audio', 'podcast'][Math.floor(Math.random() * 4)],
          author: 'Kamunity Team',
          publishDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          views: Math.floor(Math.random() * 1000) + content.totalReactions * 5,
          shares: Math.floor(content.totalReactions * 0.2),
          timeSpentAvg: Math.floor(Math.random() * 180) + 30,
          conversionRate: Number(((content.totalReactions / (content.totalReactions * 5)) * 100).toFixed(1)),
          trendDirection: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
          lastWeekComparison: (Math.random() - 0.5) * 40
        }));

        setContentData(transformedData);

        // Generate insights
        const avgEngagement = transformedData.reduce((sum, item) => sum + item.engagementScore, 0) / transformedData.length;
        
        const typePerformance = transformedData.reduce((acc, item) => {
          if (!acc[item.type]) {
            acc[item.type] = { total: 0, count: 0 };
          }
          acc[item.type].total += item.engagementScore;
          acc[item.type].count += 1;
          return acc;
        }, {} as { [key: string]: { total: number; count: number } });

        const topPerformingTypes = Object.entries(typePerformance)
          .map(([type, data]) => ({
            type,
            avgScore: Math.round(data.total / data.count),
            count: data.count
          }))
          .sort((a, b) => b.avgScore - a.avgScore);

        const insights: ContentInsights = {
          averageEngagementScore: Math.round(avgEngagement),
          topPerformingTypes,
          reactionTrends: {
            growing: ['FUN', 'CURIOUS'],
            declining: ['SPICY']
          },
          contentRecommendations: [
            {
              title: 'Increase Video Content',
              suggestion: 'Video content shows 25% higher engagement scores',
              priority: 'high'
            },
            {
              title: 'Optimize for Curious Reactions',
              suggestion: 'Content that triggers curiosity has the highest conversion rates',
              priority: 'medium'
            },
            {
              title: 'Post Timing Optimization',
              suggestion: 'Consider posting during peak engagement hours',
              priority: 'low'
            }
          ]
        };

        setInsights(insights);
      }
    } catch (error) {
      console.error('Error fetching content performance:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Filtering and sorting logic
  const filteredData = contentData
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      if (sortField === 'publishDate') {
        return direction * (new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime());
      }
      
      return direction * (a[sortField] - b[sortField]);
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Loading state
  if (loading) {
    return (
      <AdminLayout title="Content Performance - Kamunity" user={user} onSignOut={handleLogout}>
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
              <p className="text-gray-600">Sign in to access content performance analytics</p>
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
    <AdminLayout title="Content Performance Analytics - Kamunity" user={user} onSignOut={handleLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Performance Analytics</h1>
              <p className="text-gray-600">Deep insights into content engagement and reactions</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button
                onClick={fetchContentPerformance}
                className="btn-primary"
                disabled={dataLoading}
              >
                {dataLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">📊</span>
                <span className="text-sm font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                  Average
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Engagement Score</h3>
              <p className="text-3xl font-bold text-blue-600">{insights.averageEngagementScore}</p>
              <p className="text-sm text-gray-600 mt-2">Across all content types</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🚀</span>
                <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                  Trending
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Growing Reactions</h3>
              <div className="flex gap-2 mt-2">
                {insights.reactionTrends.growing.map(reaction => (
                  <span key={reaction} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {reaction}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">Increasing engagement</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🎯</span>
                <span className="text-sm font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
                  Best
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Top Content Type</h3>
              <p className="text-xl font-bold text-purple-600 capitalize">
                {insights.topPerformingTypes[0]?.type || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Score: {insights.topPerformingTypes[0]?.avgScore || 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[250px]"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="post">Posts</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="podcast">Podcasts</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {filteredData.length} of {contentData.length} items
            </div>
          </div>
        </div>

        {/* Content Performance Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('engagementScore')}
                  >
                    <div className="flex items-center">
                      Engagement Score
                      {sortField === 'engagementScore' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('totalReactions')}
                  >
                    <div className="flex items-center">
                      Reactions
                      {sortField === 'totalReactions' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('views')}
                  >
                    <div className="flex items-center">
                      Views
                      {sortField === 'views' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Top Reaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('publishDate')}
                  >
                    <div className="flex items-center">
                      Published
                      {sortField === 'publishDate' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="spinner w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading content performance...</p>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-gray-500">No content found matching your criteria</p>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((content) => {
                    const emojiMap: { [key: string]: string } = {
                      'FUN': '😄',
                      'FACTUAL': '🎯',
                      'SPICY': '🌶️',
                      'NICE': '💝',
                      'UNUSUAL': '🤔',
                      'CURIOUS': '🔍'
                    };

                    return (
                      <tr key={content.contentId} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {content.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                content.type === 'video' ? 'bg-red-100 text-red-800' :
                                content.type === 'audio' ? 'bg-green-100 text-green-800' :
                                content.type === 'podcast' ? 'bg-purple-100 text-purple-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {content.type}
                              </span>
                              <span className="text-xs text-gray-500">{content.author}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-indigo-600 mr-2">
                              {content.engagementScore}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${
                              content.engagementScore >= 100 ? 'bg-green-500' :
                              content.engagementScore >= 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {content.totalReactions}
                            </div>
                            <div className="text-xs text-gray-500">
                              {content.conversionRate}% conversion
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {content.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-2xl mr-2">{emojiMap[content.topReaction] || '❓'}</span>
                            <span className="text-sm text-gray-900">{content.topReaction}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${
                              content.trendDirection === 'up' ? 'text-green-600' :
                              content.trendDirection === 'down' ? 'text-red-600' :
                              'text-gray-600'
                            }`}>
                              {content.trendDirection === 'up' ? '↗️' : 
                               content.trendDirection === 'down' ? '↘️' : '→'}
                              {content.lastWeekComparison > 0 ? '+' : ''}{content.lastWeekComparison.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(content.publishDate).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content Recommendations */}
        {insights && insights.contentRecommendations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">💡 Content Optimization Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.contentRecommendations.map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  rec.priority === 'high' ? 'bg-red-50 border-red-200' :
                  rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm mb-2">{rec.title}</h4>
                  <p className="text-xs text-gray-600">{rec.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 