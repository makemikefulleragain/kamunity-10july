import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { MediaContent } from '@/types';
import { formatDate } from '@/lib/utils';
import ReactionBar from './ReactionBar';

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const renderMediaContent = () => {
    switch (content.type) {
      case 'blog':
        return (
          <div className="relative overflow-hidden rounded-lg bg-gray-100">
            {isInView && (
              <img
                ref={imgRef}
                src={content.thumbnailUrl || '/character-mascot.png'}
                alt={content.title}
                className={`w-full h-48 sm:h-56 object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
            )}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        );
      case 'video':
        return (
          <div className="relative overflow-hidden rounded-lg bg-gray-100 h-48 sm:h-56">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all transform hover:scale-110"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        );
      case 'podcast':
        return (
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 h-32 sm:h-40 flex items-center justify-center">
            <div className="text-center text-white">
              <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M13.828 7.172a1 1 0 011.414 0A5.983 5.983 0 0117 12a5.983 5.983 0 01-1.758 4.828 1 1 0 11-1.414-1.414A3.987 3.987 0 0015 12a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <div className="text-xs font-medium">PODCAST</div>
            </div>
            <div className="absolute bottom-2 left-2 right-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
                aria-label={isPlaying ? 'Pause podcast' : 'Play podcast'}
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
                  <div className="h-1 bg-white rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <span className="text-xs text-white hidden sm:inline">{content.duration}</span>
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
      className="bg-white rounded-xl shadow-md border border-lavender-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -2 }}
      onClick={onToggleExpand}
    >
      {/* Media Content */}
      {renderMediaContent()}

      {/* Content Body */}
      <div className="p-4 sm:p-6">
        {/* Type Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide
            ${content.type === 'blog' ? 'bg-blue-100 text-blue-800' : ''}
            ${content.type === 'video' ? 'bg-purple-100 text-purple-800' : ''}
            ${content.type === 'podcast' ? 'bg-pink-100 text-pink-800' : ''}
            ${content.type === 'post' ? 'bg-green-100 text-green-800' : ''}
          `}>
            {content.type}
          </span>
          
          {/* Featured Badge */}
          {content.featured && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-100 text-gold-800">
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-charcoal mb-3 sm:mb-4 line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer">
          {content.title}
        </h2>

        {/* Description */}
        <p className="text-fluid-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {content.description}
        </p>

        {/* Metadata */}
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

      {/* Reaction Bar - Always Visible */}
      <ReactionBar 
        content={content}
        onSubscribeClick={() => {}} 
      />
    </motion.article>
  );
};

export default MediaCard; 