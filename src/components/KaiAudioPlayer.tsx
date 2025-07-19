import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TimeFilter, ToneFilter } from '@/types';
import { 
  generateTTSAudio, 
  createNarrationScript, 
  getCachedAudio, 
  setCachedAudio, 
  generateCacheKey,
  generateContentHash
} from '@/utils/audioGenerator';

interface KaiAudioPlayerProps {
  timeFilter: TimeFilter;
  perspectiveFilter: ToneFilter | 'all';
}

const KaiAudioPlayer: React.FC<KaiAudioPlayerProps> = ({
  timeFilter,
  perspectiveFilter
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes default
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeTab = perspectiveFilter !== 'all' ? perspectiveFilter : 'FUN';

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Handle smooth transitions when filters change during playback
  const handleFilterTransition = useCallback(async () => {
    if (!isPlaying) return; // Only transition if audio is currently playing
    
    // Stop current audio immediately
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    // Set transition state
    setIsPlaying(false);
    setIsTransitioning(true);
    setCurrentTime(0);
    
    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    // Start new audio after brief pause - will be handled by separate effect
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    
  }, [isPlaying]);

  // Detect filter changes and handle transitions
  useEffect(() => {
    handleFilterTransition();
  }, [timeFilter, perspectiveFilter, handleFilterTransition]);

  const getSummaryText = () => {
    const timeText = timeFilter === 'TODAY' ? "today" : timeFilter.toLowerCase().replace('last ', '');
    const tab = activeTab.toLowerCase();
    
    const summaries = {
      'fun': {
        'today': "Today's fun content has been absolutely delightful! Our community shared hilarious memes about weekend coding fails, viral TikTok dance challenges that somehow incorporate programming concepts, and adorable pet photos from members' home offices.",
        'week': "This week's fun highlights showcase our community's creativity at its peak! Meme Monday generated over 500 shares with tech-themed content, while Wednesday's pet photo contest saw 75 adorable submissions.",
        'month': "This month's fun content reveals incredible community engagement! Our monthly meme contest reached 1,200 submissions with themes ranging from AI humor to work-from-home realities.",
        'year': "This year's fun content timeline shows remarkable evolution in community humor and creativity! Starting with simple memes and growing into sophisticated multimedia content, we've seen over 10,000 fun posts gain significant traction."
      },
      'factual': {
        'today': "Today's factual content provides crucial community updates and industry insights. The Community Garden initiative received final approval with budget allocation confirmed for spring implementation.",
        'week': "This week's factual updates showcase significant community progress and external partnerships. The Community Garden project moved into phase two with soil preparation beginning Tuesday.",
        'month': "This month's factual content demonstrates substantial growth and achievement across all community initiatives. The Community Garden project completion timeline advanced by two weeks due to volunteer enthusiasm.",
        'year': "This year's factual analysis reveals transformative community evolution and measurable impact. Membership doubled from 500 to 1,000 active participants, while engagement metrics increased 300% across all platforms."
      },
      'unusual': {
        'today': "Today's unusual content sparked fascinating discussions about unconventional approaches to common problems. A member's experiment with coding in complete darkness yielded surprising productivity insights.",
        'week': "This week's unusual discoveries challenged conventional thinking across multiple domains. Experimental work schedules including 'twilight coding sessions' showed 40% productivity increases for night owls.",
        'month': "This month's unusual content exploration revealed hidden talents and unexpected solutions throughout our community. Alternative learning methods gained traction, including coding through music composition.",
        'year': "This year's unusual content timeline showcases our community's willingness to embrace unconventional wisdom and creative thinking. From experimental problem-solving methodologies to alternative career paths."
      },
      'curious': {
        'today': "Today's curious content sparked deep exploration into emerging technologies and philosophical questions. Discussions about quantum computing applications in everyday life attracted 150+ engaged participants.",
        'week': "This week's curious explorations delved into cutting-edge research and thought-provoking questions that challenge our understanding. Deep learning algorithm discussions evolved into philosophical debates about consciousness.",
        'month': "This month's curious content fostered intellectual growth through diverse topic exploration and collaborative research initiatives. Emerging technology trend analysis sessions brought together experts from multiple fields.",
        'year': "This year's curious content journey reflects our community's commitment to lifelong learning and intellectual exploration. From quantum physics discussions to consciousness studies, we've maintained an atmosphere of respectful inquiry."
      },
      'spicy': {
        'today': "Today's spicy content generated heated but respectful debates on controversial technology topics. Net neutrality discussions brought passionate arguments from multiple perspectives.",
        'week': "This week's spicy topics maintained high engagement while preserving community respect and productive discourse. Technology regulation debates attracted industry professionals sharing insider perspectives.",
        'month': "This month's spicy content tackled complex issues requiring nuanced discussion and multiple perspective consideration. Technology ethics debates expanded into industry-wide policy recommendation development.",
        'year': "This year's spicy content demonstrates our community's ability to engage with controversial topics while maintaining respect and productive outcomes. Major debates shaped our collective understanding of technology's role in society."
      },
      'nice': {
        'today': "Today's nice content spread positivity and encouragement throughout our community. Celebration posts for member achievements dominated feeds, including job promotions, project completions, and personal milestones.",
        'week': "This week's nice content created a supportive atmosphere that strengthened community bonds. Mentorship program launches connected 50+ member pairs for skill sharing and career guidance.",
        'month': "This month's nice content demonstrates the power of community support and encouragement. Volunteer appreciation posts highlighted contributions to various community initiatives and projects.",
        'year': "This year's nice content reflects our community's commitment to positivity and mutual support. From celebrating individual achievements to organizing community-wide support initiatives, we've maintained a culture of encouragement."
      }
    };
    
    return summaries[tab as keyof typeof summaries]?.[timeText as keyof typeof summaries.factual] || summaries['factual']['today'];
  };

  const getHighlights = () => {
    const highlights = {
      'fun': [
        "Gaming tournament attracted 120+ participants across multiple platforms",
        "Meme contest generated over 500 community shares this week",
        "Comedy night featured 15 members performing tech-themed stand-up routines"
      ],
      'factual': [
        "Community Garden initiative received final approval with budget allocation",
        "Tech Meetup scheduled for Friday featuring three keynote speakers",
        "New member orientation welcomed 12 professionals from diverse backgrounds"
      ],
      'unusual': [
        "Coding in complete darkness experiment yielded surprising productivity insights",
        "Interpretive dance programming tutorial went unexpectedly viral",
        "Classical musician successfully transitioned to data science career"
      ],
      'curious': [
        "Quantum computing discussions attracted 150+ engaged participants",
        "AI ethics debates emerged from real-world implementation examples",
        "Space exploration technology connected astronomy and engineering professionals"
      ],
      'spicy': [
        "Net neutrality discussions brought passionate multi-perspective arguments",
        "Data privacy conversations challenged current corporate practices",
        "Cryptocurrency environmental impact led to solutions brainstorming"
      ],
      'nice': [
        "Celebration posts highlighted member job promotions and achievements",
        "Mentorship program connected 50+ member pairs for guidance",
        "Community support initiatives organized for members in need"
      ]
    };
    
    return highlights[activeTab.toLowerCase() as keyof typeof highlights] || highlights['factual'];
  };

  const handlePlayPause = async () => {
    if (isTransitioning) return; // Prevent action during transitions

    if (currentAudioRef.current && isPlaying) {
      // Pause current audio
      currentAudioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
    } else {
      try {
        setIsLoading(true);

        // Generate content hash for caching
        const highlights = getHighlights();
        const summaryText = getSummaryText();
        const contentHash = generateContentHash(highlights, summaryText);
        const cacheKey = generateCacheKey(activeTab, timeFilter, contentHash);

        // Check cache first
        let audioUrl = getCachedAudio(cacheKey);
        
        if (!audioUrl) {
          // Generate new audio
          const script = createNarrationScript(highlights, summaryText, activeTab, timeFilter);
          audioUrl = await generateTTSAudio(script, activeTab, timeFilter);
          setCachedAudio(cacheKey, audioUrl);
        }

        // Create and play audio
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;

        audio.onloadedmetadata = () => {
          setDuration(Math.floor(audio.duration));
        };

        audio.ontimeupdate = () => {
          setCurrentTime(Math.floor(audio.currentTime));
        };

        audio.onplay = () => {
          setIsPlaying(true);
          setIsLoading(false);
        };

        audio.onended = () => {
          setIsPlaying(false);
          setCurrentTime(0);
          currentAudioRef.current = null;
        };

        audio.onerror = () => {
          setIsPlaying(false);
          setIsLoading(false);
          currentAudioRef.current = null;
          console.error('Audio playback failed');
        };

        await audio.play();

      } catch (error) {
        console.error('TTS generation failed:', error);
        setIsPlaying(false);
        setIsLoading(false);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-indigo-100 max-w-md mx-auto"
    >
      <h4 className="text-fluid-sm lg:text-fluid-base font-semibold text-indigo-700 mb-fluid-4 text-center">
        Listen to Summary
      </h4>
      
      {/* Player Controls */}
      <div className="space-y-fluid-4">
        {/* Play Button and Avatar */}
        <div className="flex items-center justify-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            disabled={isTransitioning}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors shadow-lg touch-manipulation ${
              isTransitioning 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
            }`}
            aria-label={isTransitioning ? 'Switching audio...' : isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isTransitioning ? (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isLoading ? (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isPlaying ? (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          
          {/* Presenter Avatar */}
          <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-peach-100 to-lavender-100 rounded-full border-3 border-white shadow-lg flex items-center justify-center overflow-hidden transition-all duration-300 ${
            isTransitioning ? 'animate-pulse' : isLoading ? 'animate-pulse scale-110' : isPlaying ? 'animate-spin' : ''
          }`}>
            <img 
              src="/character-mascot.png" 
              alt="Kai AI Presenter" 
              className={`w-8 h-8 sm:w-10 sm:h-10 object-contain transition-transform duration-300 ${
                isPlaying ? 'animate-none' : ''
              }`}
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
              loading="lazy"
            />
          </div>
        </div>
        
        {/* Progress Bar and Time */}
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-fluid-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default KaiAudioPlayer; 