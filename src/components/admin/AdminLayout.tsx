import { useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { ADMIN_NAV_ITEMS } from '@/lib/constants';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  user?: {
    email: string;
    user_metadata?: any;
  } | null;
  onSignOut?: () => void;
}

export default function AdminLayout({ children, title, user, onSignOut }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const isActivePage = (href: string) => {
    if (href === '/admin') {
      return router.pathname === '/admin';
    }
    return router.pathname === href;
  };

  const getPageDescription = (href: string, label: string) => {
    const descriptions: Record<string, string> = {
      '/admin': 'Overview and quick access',
      '/admin/subscribers': 'Manage email subscribers',
      '/admin/content': 'Content management system',
      '/admin/analytics': 'Performance insights',
      '/admin/settings': 'System configuration'
    };
    return descriptions[href] || `Manage ${label.toLowerCase()}`;
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Kamunity Admin Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="h-screen flex bg-gray-50">
        {/* Mobile sidebar backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-gray-200">
          {/* Desktop Sidebar Content */}
          <div className="flex-1 flex flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <div className="flex items-center">
                <span className="text-xl font-bold text-indigo-600">Kamunity</span>
                <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-medium">
                  Admin
                </span>
              </div>
            </div>

            {/* User Info */}
            {user && (
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-sm">
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.user_metadata?.full_name || 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {ADMIN_NAV_ITEMS.map((item) => {
                const isActive = isActivePage(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                    }`}
                  >
                    <span className="text-xl mr-3 transition-transform group-hover:scale-110">
                      {item.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span>{item.label}</span>
                        {isActive && (
                          <span className="ml-2 w-2 h-2 bg-indigo-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {getPageDescription(item.href, item.label)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer Actions */}
            <div className="px-4 py-4 border-t border-gray-200">
              {/* Quick Actions */}
              <div className="space-y-1">
                <Link
                  href="/content"
                  className="flex items-center px-3 py-2 text-xs text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="mr-2">👀</span>
                  View Public Site
                </Link>
                <button
                  onClick={() => window.open('/admin/index.html', '_blank')}
                  className="w-full flex items-center px-3 py-2 text-xs text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="mr-2">📝</span>
                  Netlify CMS
                </button>
              </div>

              {/* Sign Out */}
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="w-full flex items-center px-3 py-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors mt-2"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <motion.div
          initial={false}
          animate={{
            x: sidebarOpen ? 0 : '-100%'
          }}
          className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl flex flex-col"
        >
          {/* Mobile Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">Kamunity</span>
              <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-medium">
                Admin
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile User Info */}
          {user && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-sm">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.user_metadata?.full_name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = isActivePage(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-xl mr-3 transition-transform group-hover:scale-110">
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="ml-2 w-2 h-2 bg-indigo-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {getPageDescription(item.href, item.label)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-2">
            {/* Quick Actions */}
            <div className="space-y-1">
              <Link
                href="/content"
                className="flex items-center px-3 py-2 text-xs text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="mr-2">👀</span>
                View Public Site
              </Link>
              <button
                onClick={() => window.open('/admin/index.html', '_blank')}
                className="w-full flex items-center px-3 py-2 text-xs text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="mr-2">📝</span>
                Netlify CMS
              </button>
            </div>

            {/* Sign Out */}
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="w-full flex items-center px-3 py-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            )}
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="font-semibold text-gray-900">
                {ADMIN_NAV_ITEMS.find(item => isActivePage(item.href))?.label || 'Admin'}
              </span>
              <div className="w-10"></div> {/* Spacer for center alignment */}
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
} 