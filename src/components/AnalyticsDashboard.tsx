import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnalyticsEvent {
  timestamp: string;
  eventType: string;
  category: string;
  label?: string;
  value?: number;
  customData?: Record<string, any>;
}

const AnalyticsDashboard: React.FC = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // In development, capture gtag calls to show in dashboard
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      const originalGtag = window.gtag;
      const capturedEvents: AnalyticsEvent[] = [];

      window.gtag = (...args: any[]) => {
        if (args[0] === 'event') {
          const [, eventType, params] = args;
          capturedEvents.push({
            timestamp: new Date().toISOString(),
            eventType,
            category: params?.event_category || 'unknown',
            label: params?.event_label,
            value: params?.value,
            customData: params,
          });
          setEvents([...capturedEvents]);
        }
        
        // Call original gtag if it exists
        if (originalGtag) {
          originalGtag(...args);
        }
      };
    }
  }, []);

  // Don't render on server side or in production
  if (!isClient || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const clearEvents = () => {
    setEvents([]);
  };

  const recentEvents = events.slice(-10).reverse();

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        📊
      </motion.button>

      {/* Dashboard Panel */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-4 z-40 w-96 max-h-96 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
            <h3 className="font-semibold text-gray-900">Analytics Events</h3>
            <div className="flex space-x-2">
              <button
                onClick={clearEvents}
                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
              >
                Clear
              </button>
              <button
                onClick={toggleVisibility}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Events List */}
          <div className="overflow-y-auto max-h-80">
            {recentEvents.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No events tracked yet. Interact with the page to see events.
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {recentEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-blue-600">
                        {event.eventType}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Category: {event.category}</div>
                      {event.label && <div>Label: {event.label}</div>}
                      {event.value !== undefined && <div>Value: {event.value}</div>}
                    </div>

                    {event.customData && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer">
                          Custom Data
                        </summary>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(event.customData, null, 2)}
                        </pre>
                      </details>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 border-t text-xs text-gray-500">
            Total events: {events.length} | Showing last 10
          </div>
        </motion.div>
      )}
    </>
  );
};

export default AnalyticsDashboard; 