import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import netlifyIdentity from 'netlify-identity-widget';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { ADMIN_NAV_ITEMS } from '@/lib/constants';

interface User {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
  app_metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

  const handleLogin = () => {
    netlifyIdentity.open();
  };

  const handleLogout = () => {
    netlifyIdentity.logout();
  };

  if (loading) {
    return (
      <Layout title="Admin Dashboard - Kamunity">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="spinner w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="Admin Login - Kamunity">
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
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard - Kamunity">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-indigo-700">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADMIN_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-center">
                    <span className="text-3xl mr-4">{item.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-700">{item.label}</h3>
                      <p className="text-gray-600 text-sm">Manage {item.label.toLowerCase()}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-indigo-700 mb-6">Quick Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Subscribers</h3>
                <p className="text-3xl font-bold text-indigo-600">0</p>
                <p className="text-sm text-gray-500 mt-1">Email subscribers</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Content Items</h3>
                <p className="text-3xl font-bold text-green-600">8</p>
                <p className="text-sm text-gray-500 mt-1">Sample content</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Page Views</h3>
                <p className="text-3xl font-bold text-orange-600">-</p>
                <p className="text-sm text-gray-500 mt-1">Analytics needed</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-indigo-700 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center text-gray-500 py-8">
                <p>No recent activity to display.</p>
                <p className="text-sm mt-2">Activity will appear here once users start engaging with the platform.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 