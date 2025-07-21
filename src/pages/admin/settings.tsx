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

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  analyticsEnabled: boolean;
  newsletterEnabled: boolean;
  maintenanceMode: boolean;
  cacheTimeout: number;
}

export default function AdminSettings() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'Kamunity',
    siteDescription: 'Community begins with one spark',
    contactEmail: 'hello@kamunity.org',
    analyticsEnabled: true,
    newsletterEnabled: true,
    maintenanceMode: false,
    cacheTimeout: 300
  });
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
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

  const handleLogin = () => {
    netlifyIdentity.open();
  };

  const handleLogout = () => {
    netlifyIdentity.logout();
  };

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // TODO: Replace with real API call when ready
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setHasChanges(false);
      // TODO: Show success toast
    } catch (error) {
      console.error('Error saving settings:', error);
      // TODO: Show error toast
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    setSettings({
      siteName: 'Kamunity',
      siteDescription: 'Community begins with one spark',
      contactEmail: 'hello@kamunity.org',
      analyticsEnabled: true,
      newsletterEnabled: true,
      maintenanceMode: false,
      cacheTimeout: 300
    });
    setHasChanges(true);
  };

  if (loading) {
    return (
      <AdminLayout title="Settings - Kamunity" user={user} onSignOut={handleLogout}>
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
              <p className="text-gray-600">Sign in to access system settings</p>
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
    <AdminLayout title="Settings - Kamunity" user={user} onSignOut={handleLogout}>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
              <p className="text-gray-600">Configure your system preferences and options</p>
            </div>
            {hasChanges && (
              <span className="text-sm text-amber-600 font-medium">
                ⚠️ Unsaved changes
              </span>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* General Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">General Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter site name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter site description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter contact email"
                />
              </div>
            </div>
          </div>

          {/* Feature Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Feature Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Analytics Tracking</h4>
                  <p className="text-sm text-gray-500">Enable Google Analytics tracking</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.analyticsEnabled}
                    onChange={(e) => handleSettingChange('analyticsEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Newsletter Signup</h4>
                  <p className="text-sm text-gray-500">Enable email subscription forms</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.newsletterEnabled}
                    onChange={(e) => handleSettingChange('newsletterEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
                  <p className="text-sm text-gray-500">Show maintenance page to visitors</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Performance Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Performance Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cache Timeout (seconds)
                </label>
                <select
                  value={settings.cacheTimeout}
                  onChange={(e) => handleSettingChange('cacheTimeout', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value={60}>1 minute</option>
                  <option value={300}>5 minutes</option>
                  <option value={600}>10 minutes</option>
                  <option value={1800}>30 minutes</option>
                  <option value={3600}>1 hour</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  How long to cache API responses
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <button
              onClick={handleResetSettings}
              className="btn-secondary"
              disabled={saving}
            >
              Reset to Defaults
            </button>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setHasChanges(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className={`btn-primary ${hasChanges ? 'animate-pulse' : ''}`}
                disabled={saving || !hasChanges}
              >
                {saving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : hasChanges ? 'Save Changes' : 'All Saved'}
              </button>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
            <h3 className="text-xl font-semibold text-indigo-700 mb-6">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Environment</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Node Environment:</span>
                    <span className="font-medium">development</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Build Version:</span>
                    <span className="font-medium">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Deploy:</span>
                    <span className="font-medium">Today</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Features</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Analytics:</span>
                    <span className={`font-medium ${settings.analyticsEnabled ? 'text-green-600' : 'text-red-600'}`}>
                      {settings.analyticsEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Newsletter:</span>
                    <span className={`font-medium ${settings.newsletterEnabled ? 'text-green-600' : 'text-red-600'}`}>
                      {settings.newsletterEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maintenance:</span>
                    <span className={`font-medium ${settings.maintenanceMode ? 'text-amber-600' : 'text-green-600'}`}>
                      {settings.maintenanceMode ? 'Active' : 'Normal'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 