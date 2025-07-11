import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaContent } from '@/types';
import { formatDate } from '@/lib/utils';

interface MediaCardProps {
  content: MediaContent;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ content, isExpanded = false, onToggleExpand }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const getMediaIcon = () => {
    switch (content.type) {
      case 'video':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-indigo-600 bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
        );
      case 'audio':
      case 'podcast':
        return (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white bg-opacity-95 rounded-xl p-3 flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-gold-500 hover:bg-gold-600 text-white rounded-full p-2 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <div className="flex-1">
                <div className="h-1 bg-gray-200 rounded-full">
                  <div className="h-1 bg-gold-500 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <span className="text-xs text-charcoal">{content.duration}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.article
      layout
      className="media-card group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggleExpand}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={content.thumbnailUrl || '/api/placeholder/400/300'}
          alt={content.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/api/placeholder/400/300';
          }}
        />
        {content.type === 'video' && (
          <div className="absolute inset-0 bg-peach-500 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        )}
        {getMediaIcon()}
        {content.featured && (
          <span className="absolute top-4 right-4 bg-gold-500 text-white text-xs px-3 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            {content.type}
          </span>
          {content.duration && (
            <span className="text-xs text-gray-500">• {content.duration}</span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-indigo-700 mb-2 line-clamp-2">
          {content.title}
        </h3>
        
        <p className="text-sm text-charcoal mb-4 line-clamp-3">
          {content.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{content.author}</span>
          <span>{formatDate(content.date)}</span>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {content.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-lavender-100 text-indigo-600 rounded-full"
            >
              #{tag}
            </span>
          ))}
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
            className="border-t border-lavender-200 bg-lavender-50 p-6 overflow-hidden"
          >
            <div className="prose prose-sm max-w-none">
              <p className="text-charcoal">
                Full content would be displayed here. This could include embedded videos, 
                full blog posts, audio players, or other rich media content.
              </p>
              {content.type === 'video' && (
                <div className="aspect-video bg-gray-200 rounded-lg mt-4">
                  {/* Video embed would go here */}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default MediaCard; 