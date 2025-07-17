import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import MediaCard from '@/components/MediaCard';
import AINewsfeedSummary from '@/components/AINewsfeedSummary';
import { SAMPLE_MEDIA_CONTENT } from '@/lib/constants';
import { MediaContent, MediaType, TimeFilter, ToneFilter } from '@/types';
import { isContentWithinTimeFilter } from '@/utils/dateUtils';

// Animated cycling text component with enhanced responsiveness
const CyclingText = () => {
  const words = ['Stories', 'Communities', 'Braveries', 'Clubs', 'Crazies', 'People', 'Kamunity'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2300); // 2.3 seconds

    return () => clearInterval(interval);
  }, [words.length]);

  // Find the longest word to maintain consistent width
  const longestWord = words.reduce((longest, current) => 
    current.length > longest.length ? current : longest
  );

  return (
    <span 
      className="inline-block text-left"
      style={{ minWidth: `${longestWord.length * 0.5}em` }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWordIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.4,
            ease: "easeInOut"
          }}
          className="inline-block bg-gradient-to-r from-peach-500 to-gold-500 bg-clip-text text-transparent font-bold"
        >
          {words[currentWordIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default function ContentFeed() {
  const [mediaContent, setMediaContent] = useState<MediaContent[]>(SAMPLE_MEDIA_CONTENT);
  const [filteredContent, setFilteredContent] = useState<MediaContent[]>(SAMPLE_MEDIA_CONTENT);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  // Filters - only time and perspective, no media type filtering
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('TODAY');
  const [perspectiveFilter, setPerspectiveFilter] = useState<ToneFilter | 'all'>('all');

  // Filter content based on active filters using date-based filtering
  useEffect(() => {
    let filtered = [...mediaContent];
    
    // Filter by time period using actual dates
    filtered = filtered.filter(content => isContentWithinTimeFilter(content.date, timeFilter));
    
    // Filter by perspective
    if (perspectiveFilter !== 'all') {
      filtered = filtered.filter(content => content.perspective === perspectiveFilter);
    }
    
    setFilteredContent(filtered);
  }, [mediaContent, timeFilter, perspectiveFilter]);

  const handleCardExpand = (contentId: string) => {
    setExpandedCard(expandedCard === contentId ? null : contentId);
  };

  // Handler for AI summary filter changes
  const handlePerspectiveFilterChange = (perspective: ToneFilter | 'all') => {
    setPerspectiveFilter(perspective);
  };

  const handleTimeFilterChange = (filter: TimeFilter) => {
    setTimeFilter(filter);
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout title="Content Feed - Kamunity">
      <div className="min-h-screen bg-white">
        {/* Hero Section with Enhanced Responsive Layout */}
        <section className="relative bg-gradient-to-br from-indigo-50 via-lavender-50 to-peach-50 py-fluid-16 px-4 sm:px-6 lg:px-12 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-8 -right-8 lg:-top-16 lg:-right-16 w-16 h-16 lg:w-32 lg:h-32 bg-gradient-to-br from-gold-300/20 to-gold-500/20 rounded-full blur-xl" />
            <div className="absolute top-1/2 -left-4 lg:-left-8 w-12 h-12 lg:w-24 lg:h-24 bg-gradient-to-br from-peach-300/20 to-peach-500/20 rounded-full blur-lg" />
            <div className="absolute bottom-8 right-1/4 lg:bottom-16 w-10 h-10 lg:w-20 lg:h-20 bg-gradient-to-br from-lavender-300/20 to-lavender-500/20 rounded-full blur-lg" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-ultra mx-auto relative z-10"
          >
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-center">
              
              {/* Right Content (1/3) with responsive image - MOBILE FIRST (shows first on mobile) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="lg:col-span-1 lg:order-2"
              >
                <div className="relative w-full max-w-sm mx-auto">
                  <div className="relative aspect-square lg:aspect-4/3 bg-gradient-to-br from-indigo-100 via-lavender-100 to-peach-100 rounded-2xl lg:rounded-3xl shadow-2xl border-4 border-white/50 backdrop-blur-sm overflow-hidden p-4 lg:p-8">
                    <div className="w-full h-full">
                      <img 
                        src="/images/content-hero-new.png" 
                        alt="Content Discovery Hero" 
                        className="w-full h-full object-contain rounded-xl lg:rounded-2xl"
                        style={{
                          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))'
                        }}
                        loading="eager"
                      />
                    </div>
                    
                    {/* Floating content icons with responsive sizing */}
                    <motion.div 
                      animate={{ y: [-10, 10, -10] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-2 right-2 lg:top-4 lg:right-4 w-8 h-8 lg:w-12 lg:h-12 bg-white/80 backdrop-blur-sm rounded-lg lg:rounded-xl shadow-lg flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 lg:w-6 lg:h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                      </svg>
                    </motion.div>
                    
                    <motion.div 
                      animate={{ y: [10, -10, 10] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4 w-6 h-6 lg:w-10 lg:h-10 bg-white/80 backdrop-blur-sm rounded-md lg:rounded-lg shadow-lg flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 lg:w-5 lg:h-5 text-peach-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </motion.div>
                  </div>
                  
                  {/* Decorative elements with responsive sizing */}
                  <div className="absolute -top-3 -right-3 lg:-top-6 lg:-right-6 w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-gold-400 to-gold-500 rounded-full opacity-80 animate-pulse" />
                  <div className="absolute -bottom-2 -left-2 lg:-bottom-4 lg:-left-4 w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-peach-400 to-peach-500 rounded-full opacity-80" />
                  <div className="absolute top-1/4 -left-1 lg:-left-2 w-4 h-4 lg:w-6 lg:h-6 bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-full opacity-60" />
                </div>
              </motion.div>

              {/* Left Content (2/3) with fluid typography - SHOWS SECOND ON MOBILE */}
              <div className="lg:col-span-2 lg:order-1 space-y-fluid-8">
                <div className="space-y-fluid-6">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-fluid-4xl lg:text-fluid-6xl font-bold leading-tight relative"
                  >
                    <span className="text-indigo-700">Discover The </span>
                    <CyclingText />
                    <br />
                    <span className="text-indigo-700">That Resonate With You</span>
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-fluid-lg lg:text-fluid-xl text-charcoal leading-relaxed max-w-3xl"
                  >
                    Explore a collection of inspiring stories, ideas, insights, and more from our vibrant community. From thought-provoking articles to engaging discussions, find exactly what speaks to your interests and mood.
                  </motion.p>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-wrap gap-3 lg:gap-4"
                >
                  <div className="flex items-center gap-2 lg:gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-3 py-2 lg:px-4 lg:py-3 border border-white/20">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse" />
                    <span className="text-fluid-xs lg:text-fluid-sm font-medium text-gray-700">regular Kamunity updates</span>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-3 py-2 lg:px-4 lg:py-3 border border-white/20">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" />
                    <span className="text-fluid-xs lg:text-fluid-sm font-medium text-gray-700">personalisation filters</span>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-3 py-2 lg:px-4 lg:py-3 border border-white/20">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full" />
                    <span className="text-fluid-xs lg:text-fluid-sm font-medium text-gray-700">Kai powered summaries</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* AI Newsfeed Summary Section */}
        <section className="py-fluid-12 px-4 sm:px-6 lg:px-12 bg-gray-50" data-filters-section>
          <AINewsfeedSummary
            activeContentTypes={['post', 'blog', 'video', 'audio', 'podcast']}
            onContentTypeChange={() => {}} // No-op since we're not using media type filtering
            timeFilter={timeFilter}
            onTimeFilterChange={handleTimeFilterChange}
            perspectiveFilter={perspectiveFilter}
            onPerspectiveFilterChange={handlePerspectiveFilterChange}
            filteredContentCount={filteredContent.length}
          />
        </section>

        {/* Content Grid with Ultra-wide Support */}
        <div className="py-fluid-12 px-4 sm:px-6 lg:px-12" data-content-grid>
          <div className="max-w-ultra mx-auto">
            {/* Filter Summary */}
            <div className="mb-fluid-8 text-center">
              <p className="text-fluid-base text-gray-600">
                Showing <span className="font-semibold text-indigo-600">{filteredContent.length}</span> {filteredContent.length === 1 ? 'item' : 'items'} 
                {timeFilter && ` from ${timeFilter.toLowerCase().replace('_', ' ')}`}
                {perspectiveFilter !== 'all' && ` with ${perspectiveFilter.toLowerCase()} perspective`}
              </p>
            </div>

            {filteredContent.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-fluid-20"
              >
                <div className="text-fluid-6xl mb-fluid-4">🔍</div>
                <h3 className="text-fluid-xl font-semibold text-gray-600 mb-fluid-2">
                  No content found
                </h3>
                <p className="text-fluid-base text-gray-500">
                  Try adjusting your filters to see more content
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
              >
                {filteredContent.map((content, index) => (
                  <motion.div
                    key={content.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="w-full"
                  >
                    <MediaCard
                      content={content}
                      isExpanded={expandedCard === content.id}
                      onToggleExpand={() => handleCardExpand(content.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Load More / Back to Filters */}
        <div className="text-center pb-fluid-12">
          <button
            className="btn-secondary text-fluid-sm lg:text-fluid-base px-fluid-6 py-fluid-3"
            onClick={() => {
              // Scroll to filters section
              const filtersSection = document.querySelector('[data-filters-section]');
              if (filtersSection) {
                filtersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            no more stories for now click to go back and change perspective or put your phone down
          </button>
        </div>
      </div>
    </Layout>
  );
} 