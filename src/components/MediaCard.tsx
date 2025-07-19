import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { MediaContent } from '@/types';
import { formatDate } from '@/lib/utils';

interface MediaCardProps {
  content: MediaContent;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ content, isExpanded = false, onToggleExpand }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getMediaIcon = () => {
    switch (content.type) {
      case 'video':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-indigo-600 bg-opacity-90 rounded-full p-3 sm:p-4 hover:bg-opacity-100 transition-all touch-manipulation">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
        );
      case 'audio':
      case 'podcast':
        return (
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
            <div className="bg-white bg-opacity-95 rounded-xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                }}
                className="bg-gold-500 hover:bg-gold-600 text-white rounded-full p-1.5 sm:p-2 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <div className="flex-1">
                <div className="h-1 bg-gray-200 rounded-full">
                  <div className="h-1 bg-gold-500 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <span className="text-xs text-charcoal hidden sm:inline">{content.duration}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };



  return (
    <motion.article
      ref={cardRef}
      layout
      className="media-card group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggleExpand}
    >
      {/* Thumbnail with Lazy Loading */}
      <div className="relative aspect-video overflow-hidden">
        {isInView ? (
          <img
            ref={imgRef}
            src={content.thumbnailUrl || '/character-mascot.png'}
            alt={content.title}
            className={`w-full h-full transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${content.logoCard ? 'object-contain bg-white p-2 sm:p-4' : 'object-cover'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/character-mascot.png';
              setImageLoaded(true);
            }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {imageLoaded && content.type === 'video' && (
          <div className="absolute inset-0 bg-peach-500 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        )}
        
        {imageLoaded && getMediaIcon()}
        
        {content.featured && (
          <span className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gold-500 text-white text-xs px-2 py-1 sm:px-3 sm:py-1 rounded-full font-medium">
            Featured
          </span>
        )}
      </div>

      {/* Content with Fluid Typography */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <span className="text-fluid-xs font-medium text-indigo-600 uppercase tracking-wide">
            {content.type}
          </span>
          {content.duration && (
            <span className="text-fluid-xs text-gray-500">• {content.duration}</span>
          )}
        </div>
        
        <h3 className="text-fluid-base sm:text-fluid-lg font-semibold text-indigo-700 mb-2 line-clamp-2 leading-tight">
          {content.title}
        </h3>
        
        <p className="text-fluid-sm text-charcoal mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
          {content.description}
        </p>

        <div className="flex items-center justify-between text-fluid-xs text-gray-500">
          <span className="truncate mr-2">{content.author}</span>
          <span className="flex-shrink-0">{formatDate(content.date)}</span>
        </div>

        {/* Tags with responsive layout */}
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
          {content.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-fluid-xs px-2 py-1 bg-lavender-100 text-indigo-600 rounded-full"
            >
              #{tag}
            </span>
          ))}
          {content.tags.length > 3 && (
            <span className="text-fluid-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
              +{content.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-lavender-200 bg-lavender-50 p-4 sm:p-6 overflow-hidden"
          >
            <div className="prose prose-sm max-w-none text-fluid-sm text-charcoal leading-relaxed">
              <ReactMarkdown 
                rehypePlugins={[rehypeSanitize]}
              >
                {content.body || 'No content available.'}
              </ReactMarkdown>
              {content.type === 'video' && (
                <div className="aspect-video bg-gray-200 rounded-lg mt-3 sm:mt-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              
              {/* Show all tags in expanded view */}
              <div className="mt-4 flex flex-wrap gap-2">
                {content.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-fluid-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default MediaCard; 