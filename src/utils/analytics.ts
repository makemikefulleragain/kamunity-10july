// Google Analytics 4 tracking utilities
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Check if GA is loaded
export const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Track page views
export const trackPageView = (url: string, title?: string): void => {
  if (!isGALoaded()) return;
  
  window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!, {
    page_title: title || document.title,
    page_location: url,
    send_page_view: true
  });
};

// Track custom events
export const trackEvent = (
  eventName: string,
  parameters?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    custom_parameters?: Record<string, any>;
  }
): void => {
  if (!isGALoaded()) return;

  const eventParams = {
    event_category: parameters?.event_category || 'engagement',
    event_label: parameters?.event_label,
    value: parameters?.value,
    ...parameters?.custom_parameters,
  };

  window.gtag('event', eventName, eventParams);
  
  // Only log in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Analytics Event:', eventName, eventParams);
  }
};

// Track clicks on specific elements
export const trackClick = (
  elementType: string,
  elementName: string,
  additionalData?: Record<string, any>
): void => {
  trackEvent('click', {
    event_category: 'user_interaction',
    event_label: `${elementType}_${elementName}`,
    custom_parameters: {
      element_type: elementType,
      element_name: elementName,
      timestamp: new Date().toISOString(),
      ...additionalData,
    },
  });
};

// Track navigation
export const trackNavigation = (fromPage: string, toPage: string): void => {
  trackEvent('page_navigation', {
    event_category: 'navigation',
    event_label: `${fromPage}_to_${toPage}`,
    custom_parameters: {
      from_page: fromPage,
      to_page: toPage,
    },
  });
};

// Track form interactions
export const trackFormEvent = (
  formType: string,
  eventType: 'start' | 'submit' | 'success' | 'error',
  additionalData?: Record<string, any>
): void => {
  trackEvent(`form_${eventType}`, {
    event_category: 'form_interaction',
    event_label: formType,
    custom_parameters: {
      form_type: formType,
      event_type: eventType,
      ...additionalData,
    },
  });
};

// Track scroll depth
export const trackScrollDepth = (percentage: number, page: string): void => {
  trackEvent('scroll_depth', {
    event_category: 'engagement',
    event_label: page,
    value: percentage,
    custom_parameters: {
      scroll_percentage: percentage,
      page: page,
    },
  });
};

// Track file downloads
export const trackDownload = (fileName: string, fileType: string): void => {
  trackEvent('file_download', {
    event_category: 'downloads',
    event_label: fileName,
    custom_parameters: {
      file_name: fileName,
      file_type: fileType,
    },
  });
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText?: string): void => {
  trackEvent('external_link_click', {
    event_category: 'outbound_links',
    event_label: url,
    custom_parameters: {
      external_url: url,
      link_text: linkText,
    },
  });
};

// Track video interactions
export const trackVideo = (
  action: 'play' | 'pause' | 'complete',
  videoTitle: string,
  progress?: number
): void => {
  trackEvent(`video_${action}`, {
    event_category: 'video_interaction',
    event_label: videoTitle,
    value: progress,
    custom_parameters: {
      video_title: videoTitle,
      video_action: action,
      progress_percentage: progress,
    },
  });
};

// Track search interactions
export const trackSearch = (
  searchTerm: string,
  resultsCount?: number,
  filters?: Record<string, any>
): void => {
  trackEvent('search', {
    event_category: 'search_interaction',
    event_label: searchTerm,
    value: resultsCount,
    custom_parameters: {
      search_term: searchTerm,
      results_count: resultsCount,
      applied_filters: filters,
    },
  });
};

// Track user engagement milestones
export const trackEngagementMilestone = (
  milestone: string,
  timeSpent?: number
): void => {
  trackEvent('engagement_milestone', {
    event_category: 'user_engagement',
    event_label: milestone,
    value: timeSpent,
    custom_parameters: {
      milestone: milestone,
      time_spent_seconds: timeSpent,
    },
  });
};

// Utility to track all clicks automatically (can be attached to buttons/links)
export const withClickTracking = (
  elementType: string,
  elementName: string,
  onClick?: () => void
) => {
  return () => {
    trackClick(elementType, elementName);
    onClick?.();
  };
}; 