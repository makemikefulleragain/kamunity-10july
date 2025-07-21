import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { MediaContent } from '@/types';
import { trackFormEvent } from '@/utils/analytics';

interface ReactionBarProps {
  content: MediaContent;
  onSubscribeClick: () => void;
}

// Community-native emoji mappings
const REACTIONS = {
  'FUN': { 
    emoji: '😄', 
    label: 'Fun',
    color: 'hover:bg-yellow-50 hover:border-yellow-200'
  },
  'FACTUAL': { 
    emoji: '🎯', 
    label: 'Spot On',
    color: 'hover:bg-blue-50 hover:border-blue-200'
  },
  'SPICY': { 
    emoji: '🌶️', 
    label: 'Spicy',
    color: 'hover:bg-red-50 hover:border-red-200'
  },
  'NICE': { 
    emoji: '💝', 
    label: 'Nice',
    color: 'hover:bg-pink-50 hover:border-pink-200'
  },
  'UNUSUAL': { 
    emoji: '🤔', 
    label: 'Weird',
    color: 'hover:bg-purple-50 hover:border-purple-200'
  },
  'CURIOUS': { 
    emoji: '🔍', 
    label: 'Intriguing',
    color: 'hover:bg-orange-50 hover:border-orange-200'
  }
} as const;

const ReactionBar: React.FC<ReactionBarProps> = ({ content, onSubscribeClick }) => {
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [shareTooltip, setShareTooltip] = useState(false);

  // Handle reaction selection
  const handleReactionSelect = useCallback((reactionKey: string, event: React.MouseEvent) => {
    // Prevent event from bubbling up to card click handler
    event.stopPropagation();
    event.preventDefault();

    // Update user reaction (only one reaction per user)
    setUserReaction(reactionKey);
    
    // Update reaction counts (simplified for demo)
    setReactions(prev => ({
      ...prev,
      [reactionKey]: (prev[reactionKey] || 0) + 1
    }));

    // Show feedback toast
    const reaction = REACTIONS[reactionKey as keyof typeof REACTIONS];
    toast.success(`${reaction.emoji} ${reaction.label}!`, {
      duration: 2000,
      position: 'bottom-center'
    });

    // Track analytics
    trackFormEvent('content_reaction', 'success', {
      content_id: content.id,
      reaction: reactionKey,
      content_type: content.type
    });
  }, [content.id, content.type]);

  // Handle share functionality
  const handleShare = useCallback(async (event: React.MouseEvent) => {
    // Prevent event from bubbling up to card click handler
    event.stopPropagation();
    event.preventDefault();

    const shareUrl = `${window.location.origin}/content?id=${content.id}`;
    const shareText = `Check out "${content.title}" on Kamunity`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: content.title,
          text: shareText,
          url: shareUrl,
        });
        
        trackFormEvent('content_share', 'success', {
          content_id: content.id,
          content_type: content.type,
          share_method: 'native_share'
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareTooltip(true);
        setTimeout(() => setShareTooltip(false), 2000);
        
        toast.success('Link copied to clipboard!', {
          duration: 2000,
          position: 'bottom-center'
        });
        
        trackFormEvent('content_share', 'success', {
          content_id: content.id,
          content_type: content.type,
          share_method: 'copy_link'
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Unable to share. Please try again.');
    }
  }, [content.id, content.title, content.type]);

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3">
      {/* Top Row: Vibe Check Text (2/3) + Share Button (1/3) */}
      <div className="flex items-center justify-between mb-3">
        {/* Vibe Check Text - 2/3 */}
        <div className="flex-grow pr-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎯</span>
            <p className="text-base font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              what's the vibe check?
            </p>
            <span className="text-lg animate-pulse">✨</span>
          </div>
        </div>

        {/* Share Button - 1/3 */}
        <div className="relative">
          <motion.button
            onClick={handleShare}
            className="
              flex items-center space-x-2 px-3 py-2 rounded-full 
              bg-white border-2 border-gray-200 hover:border-indigo-300 
              hover:bg-indigo-50 transition-all
              min-h-[44px] touch-manipulation
            "
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            aria-label="Share this content"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="text-sm font-medium hidden sm:inline">Share</span>
          </motion.button>

          {/* Share Tooltip */}
          {shareTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10"
            >
              Link copied!
              <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Row: Emoji Reactions */}
      <div className="flex items-center gap-2 flex-wrap">
        {Object.entries(REACTIONS).map(([key, reaction]) => (
          <motion.button
            key={key}
            onClick={(e) => handleReactionSelect(key, e)}
            className={`
              flex flex-col items-center px-2 py-2 rounded-lg border-2 
              transition-all min-h-[50px] min-w-[40px] touch-manipulation
              ${userReaction === key 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-transparent hover:border-gray-200 hover:bg-white'
              }
              ${reaction.color}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`React with ${reaction.label}`}
          >
            <span className="text-lg mb-1">{reaction.emoji}</span>
            <span className="text-xs font-medium text-gray-600">
              {reaction.label}
            </span>
            {reactions[key] && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded-full min-w-[16px] text-center font-medium mt-1">
                {reactions[key]}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ReactionBar; 