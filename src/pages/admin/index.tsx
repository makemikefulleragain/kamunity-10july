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

interface DashboardStats {
  subscribers: {
    total: number;
    active: number;
    thisMonth: number;
    growth: number;
  };
  content: {
    total: number;
    published: number;
    thisMonth: number;
  };
  reactions: {
    total: number;
    thisWeek: number;
    topReaction: string;
  };
  engagement: {
    totalPageViews: number;
    avgSessionTime: number;
    conversionRate: number;
  };
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Initialize Netlify Identity
    netlifyIdentity.init();
    
    // Check if user is logged in
    const currentUser = netlifyIdentity.currentUser();
    setUser(currentUser);
    setLoading(false);

    // Event listeners
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

  // Fetch dashboard stats when user is authenticated
  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  // Auto-refresh dashboard stats every 2 minutes when user is active
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      // Only refresh if not currently loading
      if (!statsLoading) {
        fetchDashboardStats();
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [user, statsLoading]);

  // Fetch real dashboard statistics
  const fetchDashboardStats = async () => {
    setStatsLoading(true);
    try {
      const response = await fetch('/api/admin/dashboard-stats');
      const data = await response.json();
      
      if (data.success && data.data) {
        setDashboardStats(data.data);
      } else {
        console.error('Error fetching dashboard stats:', data.error);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleLogin = () => {
    netlifyIdentity.open();
  };

  const handleLogout = () => {
    netlifyIdentity.logout();
  };

  if (loading) {
    return (
      <AdminLayout title="Admin Dashboard - Kamunity" user={user} onSignOut={handleLogout}>
        <div className="min-h-full flex items-center justify-center">
          <div className="text-center">
            <div className="spinner w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout title="Admin Login - Kamunity" user={null}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-indigo-700 mb-2">Admin Access</h1>
              <p className="text-gray-600">Sign in to access the Kamunity admin dashboard</p>
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
    <AdminLayout title="Admin Dashboard - Kamunity" user={user} onSignOut={handleLogout}>
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Here's what's happening with your community today.</p>
        </div>

        {/* MOCK DATA WARNING */}
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                ⚠️ PAGE VIEWS & GROWTH: MOCK DATA
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p><strong>REAL:</strong> Subscribers ({dashboardStats?.subscribers.total || 0}), Content ({dashboardStats?.content.total || 0}), Emoji Reactions ({dashboardStats?.reactions.total || 0})</p>
                <p><strong>FAKE:</strong> Page Views, Growth Rate, Conversion Rate (GA4 integration pending)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                  <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">REAL</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? '...' : dashboardStats?.subscribers.total || 0}
                  </p>
                  {statsLoading && (
                    <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-600">Page Views</p>
                  <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">MOCK</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? '...' : dashboardStats?.engagement.totalPageViews.toLocaleString() || '0'}
                  </p>
                  {statsLoading && (
                    <div className="w-4 h-4 border-2 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-600">Content Items</p>
                  <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">REAL</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? '...' : dashboardStats?.content.total || 0}
                  </p>
                  {statsLoading && (
                    <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-xl">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                  <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">MOCK</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-bold ${
                    !dashboardStats ? 'text-gray-900' :
                    dashboardStats.subscribers.growth > 0 ? 'text-green-600' :
                    dashboardStats.subscribers.growth < 0 ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {statsLoading ? '...' : 
                     dashboardStats ? 
                       `${dashboardStats.subscribers.growth > 0 ? '+' : ''}${dashboardStats.subscribers.growth.toFixed(1)}%` : 
                       '+0%'
                    }
                  </p>
                  {statsLoading && (
                    <div className="w-4 h-4 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => window.open('/cms/index.html', '_blank')}
                className="w-full flex items-center justify-between p-3 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">📝</span>
                  <span className="font-medium text-indigo-700">Create New Content</span>
                </div>
              </button>
              
              <button 
                className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">📊</span>
                  <span className="font-medium text-green-700">Export Subscriber Data</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New subscriber joined</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Content published</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">All Systems Operational</h4>
              <p className="text-sm text-gray-600">Everything running smoothly</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Performance Excellent</h4>
              <p className="text-sm text-gray-600">Fast response times</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Security Active</h4>
              <p className="text-sm text-gray-600">All protections enabled</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 