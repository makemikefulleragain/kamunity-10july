// Media content types
export type MediaType = 'post' | 'blog' | 'video' | 'audio' | 'podcast';

export interface MediaContent {
  id: string;
  type: MediaType;
  title: string;
  description: string;
  thumbnailUrl?: string;
  contentUrl: string;
  author: string;
  date: string;
  duration?: string; // For video/audio/podcast
  tags: string[];
  featured?: boolean;
  timePeriod: 'TODAY' | 'LAST WEEK' | 'LAST MONTH' | 'LAST YEAR';
  perspective: 'FUN' | 'FACTUAL' | 'UNUSUAL' | 'CURIOUS' | 'SPICY' | 'NICE';
  logoCard?: boolean; // For cards that should display logos with object-contain
}

// Filter types for content feed
export type TimeFilter = 'TODAY' | 'LAST WEEK' | 'LAST MONTH' | 'LAST YEAR';
export type ToneFilter = 'FUN' | 'FACTUAL' | 'UNUSUAL' | 'CURIOUS' | 'SPICY' | 'NICE';

// About Us timeline nodes
export interface TimelineNode {
  id: string;
  label: string;
  title: string;
  description: string;
  icon?: string;
}

// Form data types
export interface EmailFormData {
  email: string;
  source: 'home' | 'about' | 'welcome';
  timestamp: string;
}

// Admin types
export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  source: string;
  status: 'active' | 'unsubscribed';
}

export interface ChatMessage {
  id: string;
  visitorId: string;
  message: string;
  timestamp: string;
  isVisitor: boolean;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Toast notification types
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
} 