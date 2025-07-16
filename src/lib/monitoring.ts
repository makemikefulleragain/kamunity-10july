// Monitoring and error tracking utilities for Kamunity

// Error logging interface
interface ErrorReport {
  message: string;
  stack?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, any>;
}

// Performance metrics interface
interface PerformanceMetrics {
  page: string;
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  timestamp: string;
}

// User interaction tracking
interface UserInteraction {
  action: string;
  element?: string;
  page: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Security incident tracking
interface SecurityIncident {
  type: 'failed_auth' | 'rate_limit' | 'invalid_origin' | 'xss_attempt' | 'sql_injection' | 'other';
  ip: string;
  userAgent?: string;
  endpoint?: string;
  details: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Log client-side errors to monitoring service
 */
export function logError(error: Error, metadata?: Record<string, any>): void {
  const errorReport: ErrorReport = {
    message: error.message,
    stack: error.stack,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    timestamp: new Date().toISOString(),
    metadata
  };

  // In production, send to error tracking service (Sentry, LogRocket, etc.)
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to external service
    sendToMonitoringService('error', errorReport);
  } else {
    console.error('Error logged:', errorReport);
  }
}

/**
 * Track performance metrics
 */
export function trackPerformance(page: string): void {
  if (typeof window === 'undefined') return;

  // Wait for page load
  window.addEventListener('load', () => {
    const metrics: PerformanceMetrics = {
      page,
      loadTime: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
      domContentLoaded: window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart,
      timestamp: new Date().toISOString()
    };

    // Get Web Vitals if available
    if ('PerformanceObserver' in window) {
      try {
        // First Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            metrics.firstContentfulPaint = entries[0].startTime;
          }
        }).observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            metrics.largestContentfulPaint = entries[entries.length - 1].startTime;
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
          let cls = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
          metrics.cumulativeLayoutShift = cls;
        }).observe({ entryTypes: ['layout-shift'] });

        // First Input Delay
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            metrics.firstInputDelay = (entries[0] as any).processingStart - entries[0].startTime;
          }
        }).observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('Performance Observer not fully supported:', error);
      }
    }

    // Send metrics after a delay to capture all measurements
    setTimeout(() => {
      if (process.env.NODE_ENV === 'production') {
        sendToMonitoringService('performance', metrics);
      } else {
        console.log('Performance metrics:', metrics);
      }
    }, 1000);
  });
}

/**
 * Track user interactions for analytics
 */
export function trackInteraction(action: string, element?: string, metadata?: Record<string, any>): void {
  const interaction: UserInteraction = {
    action,
    element,
    page: typeof window !== 'undefined' ? window.location.pathname : '',
    timestamp: new Date().toISOString(),
    metadata
  };

  if (process.env.NODE_ENV === 'production') {
    sendToMonitoringService('interaction', interaction);
  } else {
    console.log('User interaction:', interaction);
  }

  // Also send to Google Analytics if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: 'engagement',
      event_label: element,
      custom_parameter_1: metadata ? JSON.stringify(metadata) : undefined
    });
  }
}

/**
 * Log security incidents (server-side)
 */
export function logSecurityIncident(incident: Omit<SecurityIncident, 'timestamp'>): void {
  const securityReport: SecurityIncident = {
    ...incident,
    timestamp: new Date().toISOString()
  };

  // Log to console immediately
  console.warn('Security incident:', securityReport);

  // In production, send to security monitoring service
  if (process.env.NODE_ENV === 'production') {
    sendToMonitoringService('security', securityReport);
  }

  // Alert for critical incidents
  if (incident.severity === 'critical') {
    alertCriticalIncident(securityReport);
  }
}

/**
 * Health check for API endpoints
 */
export async function healthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, boolean>;
  timestamp: string;
}> {
  const services: Record<string, boolean> = {};
  
  try {
    // Check Resend connectivity
    try {
      services.resend = !!process.env.RESEND_API_KEY;
    } catch {
      services.resend = false;
    }

    // Check email configuration
    try {
      services.email_config = !!(process.env.RESEND_FROM_EMAIL && process.env.MIKE_FULLER_EMAIL);
    } catch {
      services.email_config = false;
    }

    // Check file system access for database
    try {
      const fs = await import('fs/promises');
      await fs.access(process.cwd());
      services.database = true;
    } catch {
      services.database = false;
    }

    // Check Crisp configuration
    services.crisp = !!process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

    const healthyServices = Object.values(services).filter(Boolean).length;
    const totalServices = Object.keys(services).length;
    
    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyServices === totalServices) {
      status = 'healthy';
    } else if (healthyServices >= totalServices * 0.7) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      services,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      status: 'unhealthy',
      services,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Monitor API response times
 */
export function monitorAPICall(endpoint: string, startTime: number, success: boolean, error?: string): void {
  const duration = Date.now() - startTime;
  
  const apiMetrics = {
    endpoint,
    duration,
    success,
    error,
    timestamp: new Date().toISOString()
  };

  if (process.env.NODE_ENV === 'production') {
    sendToMonitoringService('api', apiMetrics);
  } else {
    console.log('API call metrics:', apiMetrics);
  }

  // Alert for slow API calls (>5 seconds)
  if (duration > 5000) {
    console.warn(`Slow API call detected: ${endpoint} took ${duration}ms`);
  }
}

/**
 * Send data to monitoring service
 */
async function sendToMonitoringService(type: string, data: any): Promise<void> {
  try {
    // In a real application, you would send to:
    // - Sentry for error tracking
    // - DataDog/New Relic for performance monitoring
    // - Custom analytics endpoint
    // - Google Analytics for user interactions
    
    // For now, we'll store locally and could batch send later
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kamunity_monitoring') || '[]';
      const monitoring = JSON.parse(stored);
      monitoring.push({ type, data, timestamp: new Date().toISOString() });
      
      // Keep only last 100 entries
      if (monitoring.length > 100) {
        monitoring.splice(0, monitoring.length - 100);
      }
      
      localStorage.setItem('kamunity_monitoring', JSON.stringify(monitoring));
    }
  } catch (error) {
    console.error('Failed to send monitoring data:', error);
  }
}

/**
 * Alert for critical security incidents
 */
async function alertCriticalIncident(incident: SecurityIncident): Promise<void> {
  try {
    // In production, send immediate alerts via:
    // - Email to admin
    // - Slack webhook
    // - PagerDuty/OpsGenie
    // - SMS alerts
    
    console.error('CRITICAL SECURITY INCIDENT:', incident);
    
    // Could send email notification here
    // await sendAdminNotification('CRITICAL SECURITY ALERT', ...);
  } catch (error) {
    console.error('Failed to send critical incident alert:', error);
  }
}

/**
 * React Error Boundary helper
 */
export class ErrorBoundary extends Error {
  constructor(message: string, public componentStack?: string) {
    super(message);
    this.name = 'ErrorBoundary';
  }
}

/**
 * Setup global error handlers
 */
export function setupGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') return;

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(new Error(`Unhandled promise rejection: ${event.reason}`), {
      type: 'unhandledrejection',
      reason: event.reason
    });
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    logError(new Error(event.message), {
      type: 'global_error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Monitor network errors
  window.addEventListener('online', () => {
    trackInteraction('network_online');
  });

  window.addEventListener('offline', () => {
    trackInteraction('network_offline');
  });
}

/**
 * Get monitoring dashboard data
 */
export function getMonitoringData(): any[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('kamunity_monitoring') || '[]';
    return JSON.parse(stored);
  } catch {
    return [];
  }
} 