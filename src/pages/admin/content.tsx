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

interface ContentStats {
  totalItems: number;
  featuredItems: number;
  recentItems: number;
  byType: Record<string, number>;
}

export default function AdminContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportMessage, setExportMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

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

  useEffect(() => {
    if (user) {
      fetchContentStats();
    }
  }, [user]);

  const handleLogin = () => {
    netlifyIdentity.open();
  };

  const handleLogout = () => {
    netlifyIdentity.logout();
  };

  const fetchContentStats = async () => {
    setStatsLoading(true);
    try {
      // Hybrid approach - using existing content API
      const response = await fetch('/api/content');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const stats: ContentStats = {
          totalItems: data.length,
          recentItems: data.filter(item => {
            const itemDate = new Date(item.date);
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return itemDate >= oneWeekAgo;
          }).length,
          featuredItems: data.filter(item => item.featured).length,
          byType: data.reduce((acc: Record<string, number>, item) => {
            acc[item.type] = (acc[item.type] || 0) + 1;
            return acc;
          }, {})
        };
        setContentStats(stats);
      }
    } catch (error) {
      console.error('Error fetching content stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setExportLoading(true);
    setExportMessage(null);
    
    try {
      const response = await fetch('/api/admin/export-content', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user?.id || 'dev-token'}`, // Simple auth for now
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status} ${response.statusText}`);
      }

      // Get the CSV content
      const csvContent = await response.text();
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `kamunity-content-export-${timestamp}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      setExportMessage({
        type: 'success',
        text: `Content exported successfully as ${filename}`
      });
      
    } catch (error) {
      console.error('Error exporting content:', error);
      setExportMessage({
        type: 'error',
        text: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setExportLoading(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setExportMessage(null);
      }, 5000);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Content Management - Kamunity" user={user} onSignOut={handleLogout}>
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
        <div className="min-h-full flex items-center justify-center bg-gray-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-indigo-700 mb-2">Admin Access</h1>
              <p className="text-gray-600">Sign in to access content management</p>
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
    <AdminLayout title="Content Management - Kamunity" user={user} onSignOut={handleLogout}>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
              <p className="text-gray-600">Manage your content with Netlify CMS</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleExportCSV}
                disabled={exportLoading}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  exportLoading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {exportLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Export Status Message */}
          {exportMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 p-4 rounded-lg border ${
                exportMessage.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-center">
                {exportMessage.type === 'success' ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="font-medium">{exportMessage.text}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Content Stats */}
        {contentStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Content</h3>
              <p className="text-3xl font-bold text-indigo-600">{contentStats.totalItems}</p>
              <p className="text-sm text-gray-500 mt-1">All content items</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Featured</h3>
              <p className="text-3xl font-bold text-green-600">{contentStats.featuredItems}</p>
              <p className="text-sm text-gray-500 mt-1">Featured content</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent</h3>
              <p className="text-3xl font-bold text-blue-600">{contentStats.recentItems}</p>
              <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Content Types</h3>
              <p className="text-3xl font-bold text-purple-600">{Object.keys(contentStats.byType).length}</p>
              <p className="text-sm text-gray-500 mt-1">Different types</p>
            </div>
          </div>
        )}

        {/* Main Content Bridge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-indigo-700 mb-4">Netlify CMS</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access the full-featured content management system to create, edit, and manage your content items.
              </p>
              <button
                onClick={() => window.open('/admin/index.html', '_blank')}
                className="btn-primary w-full mb-4"
              >
                🚀 Open Content Manager
              </button>
              <p className="text-xs text-gray-500">
                Opens in a new tab with your existing Netlify CMS setup
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <button
                onClick={() => window.open('/admin/index.html', '_blank')}
                className="w-full flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">➕</span>
                  <span className="font-medium text-indigo-700">Create New Content</span>
                </div>
              </button>
              
              <button
                onClick={() => window.open('/content', '_blank')}
                className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">👀</span>
                  <span className="font-medium text-green-700">View Content Feed</span>
                </div>
              </button>

              <button
                onClick={fetchContentStats}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                disabled={statsLoading}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">🔄</span>
                  <span className="font-medium text-blue-700">
                    {statsLoading ? 'Refreshing...' : 'Refresh Stats'}
                  </span>
                </div>
              </button>

              <button
                onClick={handleExportCSV}
                className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                disabled={exportLoading}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">📊</span>
                  <span className="font-medium text-green-700">
                    {exportLoading ? 'Exporting...' : 'Export to CSV'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 