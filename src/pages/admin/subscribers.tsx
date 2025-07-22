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

interface Subscriber {
  id: string;
  email: string;
  source: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribedDate: string;
  lastActivity: string;
}

interface SubscriberStats {
  total: number;
  active: number;
  thisMonth: number;
  sources: number;
}

export default function AdminSubscribers() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<SubscriberStats>({ total: 0, active: 0, thisMonth: 0, sources: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
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

  // Fetch subscribers when user is authenticated
  useEffect(() => {
    if (user) {
      fetchSubscribers();
    }
  }, [user]);

  // Auto-refresh subscribers every 60 seconds when user is active
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      // Only refresh if not currently loading
      if (!subscribersLoading) {
        fetchSubscribers();
      }
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [user, subscribersLoading]);

  const handleLogin = () => {
    netlifyIdentity.open();
  };

  const handleLogout = () => {
    netlifyIdentity.logout();
  };

  // Fetch real subscriber data from the API
  const fetchSubscribers = async () => {
    setSubscribersLoading(true);
    try {
      const response = await fetch('/api/admin/subscribers');
      const data = await response.json();
      
      if (data.success && data.data) {
        // Map the API data to our component's expected format
        const apiSubscribers = data.data.map((sub: any) => ({
          id: sub.id,
          email: sub.email,
          source: sub.source,
          status: sub.status as 'active' | 'unsubscribed' | 'bounced',
          subscribedDate: sub.subscribedAt, // API uses subscribedAt, component expects subscribedDate
          lastActivity: sub.subscribedAt // Use subscription date as last activity for now
        }));

        // Calculate real stats from actual data
        const realStats: SubscriberStats = {
          total: apiSubscribers.length,
          active: apiSubscribers.filter((s: any) => s.status === 'active').length,
          thisMonth: apiSubscribers.filter((s: any) => {
          const subDate = new Date(s.subscribedDate);
          const thisMonth = new Date();
          thisMonth.setDate(1);
          return subDate >= thisMonth;
        }).length,
          sources: new Set(apiSubscribers.map((s: any) => s.source)).size
      };

        setSubscribers(apiSubscribers);
        setStats(realStats);
      } else {
        console.error('Error fetching subscribers:', data.error);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setSubscribersLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Email', 'Source', 'Status', 'Subscribed Date', 'Last Activity'];
    const csvData = [
      headers.join(','),
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.source,
        sub.status,
        new Date(sub.subscribedDate).toLocaleDateString(),
        new Date(sub.lastActivity).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter and pagination logic
  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubscribers.length / pageSize);
  const paginatedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Loading state
  if (loading) {
    return (
      <AdminLayout title="Subscriber Management - Kamunity" user={user} onSignOut={handleLogout}>
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
              <p className="text-gray-600">Sign in to access subscriber management</p>
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
    <AdminLayout title="Subscriber Management - Kamunity" user={user} onSignOut={handleLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscriber Management</h1>
          <p className="text-gray-600">Manage email subscribers and export data</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">All time</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-xs text-gray-500">Currently subscribed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
                <p className="text-xs text-gray-500">New subscribers</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sources</p>
                <p className="text-2xl font-bold text-gray-900">{stats.sources}</p>
                <p className="text-xs text-gray-500">Different sources</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by email or source..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
              <button
                onClick={exportCSV}
                className="btn-secondary flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
              <button
                onClick={fetchSubscribers}
                className="btn-primary"
                disabled={subscribersLoading}
              >
                {subscribersLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscribersLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="spinner w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading subscribers...</p>
                    </td>
                  </tr>
                ) : paginatedSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <p className="text-gray-500">No subscribers found</p>
                    </td>
                  </tr>
                ) : (
                  paginatedSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subscriber.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          subscriber.source === 'newsletter' ? 'bg-purple-100 text-purple-800' :
                          subscriber.source === 'about' ? 'bg-blue-100 text-blue-800' :
                          subscriber.source === 'home' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {subscriber.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          subscriber.status === 'active' ? 'bg-green-100 text-green-800' :
                          subscriber.status === 'unsubscribed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {subscriber.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(subscriber.subscribedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(subscriber.lastActivity).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                        <button className="text-red-600 hover:text-red-900">Unsubscribe</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * pageSize, filteredSubscribers.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredSubscribers.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 