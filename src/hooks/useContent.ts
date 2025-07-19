import { useState, useEffect } from 'react';
import { ContentItem } from '@/pages/api/content';

export function useContent(filters?: {
  featured?: boolean;
  perspective?: string;
  type?: string;
  timePeriod?: string;
  id?: string;
}) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();
        
        if (filters?.featured) {
          params.append('featured', 'true');
        }
        
        if (filters?.perspective && filters.perspective !== 'all') {
          params.append('perspective', filters.perspective);
        }
        
        if (filters?.type && filters.type !== 'all') {
          params.append('type', filters.type);
        }
        
        if (filters?.timePeriod && filters.timePeriod !== 'all') {
          params.append('timePeriod', filters.timePeriod);
        }
        
        if (filters?.id) {
          params.append('id', filters.id);
        }

        // Add cache busting in development
        if (process.env.NODE_ENV === 'development') {
          params.append('_t', Date.now().toString());
        }

        const response = await fetch(`/api/content?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.status}`);
        }

        const data = await response.json();
        setContent(data);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [filters?.featured, filters?.perspective, filters?.type, filters?.timePeriod, filters?.id]);

  return { content, loading, error, refetch: () => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (filters?.featured) params.append('featured', 'true');
        if (filters?.perspective && filters.perspective !== 'all') params.append('perspective', filters.perspective);
        if (filters?.type && filters.type !== 'all') params.append('type', filters.type);
        if (filters?.timePeriod && filters.timePeriod !== 'all') params.append('timePeriod', filters.timePeriod);
        if (filters?.id) params.append('id', filters.id);
        
        if (process.env.NODE_ENV === 'development') {
          params.append('_t', Date.now().toString());
        }

        const response = await fetch(`/api/content?${params.toString()}`);
        const data = await response.json();
        setContent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }};
} 