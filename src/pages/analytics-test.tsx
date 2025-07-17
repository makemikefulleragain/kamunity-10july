import React, { useState, useEffect } from 'react';
import { trackClick, trackEvent, trackFormEvent } from '@/utils/analytics';
import ClickTracker from '@/components/ClickTracker';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

const AnalyticsTest: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const testBasicEvent = () => {
    trackEvent('test_event', {
      event_category: 'testing',
      event_label: 'manual_test',
      value: 1
    });
    alert('Test event sent! Check your browser console and GA4 Real-time reports.');
  };

  const testClickEvent = () => {
    trackClick('button', 'test_click_button', {
      test_data: 'success',
      timestamp: new Date().toISOString()
    });
  };

  const testFormEvent = () => {
    trackFormEvent('test_form', 'submit', {
      test_field: 'email',
      success: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Analytics Testing Page
          </h1>
          <p className="text-gray-600 mb-8">
            Use this page to test if your Google Analytics tracking is working correctly.
          </p>

          {/* GA4 Configuration Status */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Configuration Status
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>GA4 ID:</strong> {' '}
                {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ? (
                  <span className="text-green-600">
                    ✅ {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}
                  </span>
                ) : (
                  <span className="text-red-600">
                    ❌ Not configured (Add NEXT_PUBLIC_GOOGLE_ANALYTICS_ID to environment variables)
                  </span>
                )}
              </div>
              <div>
                <strong>Analytics Script:</strong> {' '}
                {isClient ? (
                  typeof window !== 'undefined' && typeof window.gtag === 'function' ? (
                    <span className="text-green-600">✅ Loaded</span>
                  ) : (
                    <span className="text-yellow-600">⏳ Loading...</span>
                  )
                ) : (
                  <span className="text-gray-400">⏳ Initializing...</span>
                )}
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Basic Event Test */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-2">Basic Event Test</h3>
              <p className="text-sm text-gray-600 mb-4">
                Sends a simple test event to GA4
              </p>
              <button
                onClick={testBasicEvent}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Send Test Event
              </button>
            </div>

            {/* Click Event Test */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-2">Click Event Test</h3>
              <p className="text-sm text-gray-600 mb-4">
                Tests click tracking functionality
              </p>
              <button
                onClick={testClickEvent}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Test Click Tracking
              </button>
            </div>

            {/* Form Event Test */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-2">Form Event Test</h3>
              <p className="text-sm text-gray-600 mb-4">
                Tests form interaction tracking
              </p>
              <button
                onClick={testFormEvent}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Test Form Tracking
              </button>
            </div>
          </div>

          {/* ClickTracker Component Test */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">ClickTracker Component Test</h3>
            <ClickTracker
              elementType="test_card"
              elementName="analytics_test_card"
              className="p-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              additionalData={{ 
                test_source: 'analytics_test_page',
                card_type: 'interactive_demo'
              }}
              onClick={() => alert('ClickTracker component working!')}
            >
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-2">Click This Card</h4>
                <p className="text-sm opacity-90">
                  This demonstrates the ClickTracker component in action
                </p>
              </div>
            </ClickTracker>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              📋 How to Verify Tracking
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-yellow-700">
              <li>Click the test buttons above</li>
              <li>Open your browser's Developer Console (F12)</li>
              <li>Look for analytics event logs (in development mode)</li>
              <li>Go to your GA4 dashboard → Reports → Real-time</li>
              <li>You should see events appearing within 1-2 minutes</li>
            </ol>
            
            <div className="mt-4 p-3 bg-yellow-100 rounded">
              <p className="text-sm text-yellow-800">
                <strong>💡 Pro Tip:</strong> In development mode, you'll see a floating 📊 button 
                that shows real-time analytics events as they're tracked!
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              <a
                href="/"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                ← Back to Home
              </a>
              <a
                href="/about"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Test About Page
              </a>
              <a
                href="/contact"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Test Contact Form
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Development Analytics Dashboard */}
      <AnalyticsDashboard />
    </div>
  );
};

export default AnalyticsTest; 