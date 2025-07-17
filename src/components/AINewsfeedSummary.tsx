import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MediaType, TimeFilter, ToneFilter } from '@/types';

interface AINewsfeedSummaryProps {
  activeContentTypes: MediaType[];
  onContentTypeChange: (types: MediaType[]) => void;
  timeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
  perspectiveFilter: ToneFilter | 'all';
  onPerspectiveFilterChange: (perspective: ToneFilter | 'all') => void;
  filteredContentCount?: number; // Optional prop for content count
}

const AINewsfeedSummary: React.FC<AINewsfeedSummaryProps> = ({
  activeContentTypes,
  onContentTypeChange,
  timeFilter,
  onTimeFilterChange,
  perspectiveFilter,
  onPerspectiveFilterChange,
  filteredContentCount = 0
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes default
  const [activeTab, setActiveTab] = useState<ToneFilter>('FUN');
  const audioRef = useRef<HTMLAudioElement>(null);

  const timeFilters: { value: TimeFilter; label: string }[] = [
    { value: 'TODAY', label: 'TODAY' },
    { value: 'LAST WEEK', label: 'LAST WEEK' },
    { value: 'LAST MONTH', label: 'LAST MONTH' },
    { value: 'LAST YEAR', label: 'LAST YEAR' }
  ];

  const contentTabs: { value: ToneFilter; label: string; color: string }[] = [
    { value: 'FUN', label: 'FUN', color: 'bg-green-500' },
    { value: 'FACTUAL', label: 'FACTUAL', color: 'bg-indigo-600' },
    { value: 'UNUSUAL', label: 'UNUSUAL', color: 'bg-purple-500' },
    { value: 'CURIOUS', label: 'CURIOUS', color: 'bg-orange-500' },
    { value: 'SPICY', label: 'SPICY', color: 'bg-red-500' },
    { value: 'NICE', label: 'NICE', color: 'bg-pink-500' }
  ];

  // Update perspective filter when tab changes
  const handleTabChange = (tab: ToneFilter) => {
    setActiveTab(tab);
    onPerspectiveFilterChange(tab);
  };

  // Sync active tab with perspective filter
  useEffect(() => {
    if (perspectiveFilter !== 'all') {
      setActiveTab(perspectiveFilter);
    }
  }, [perspectiveFilter]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      // In a real implementation, this would pause TTS
    } else {
      setIsPlaying(true);
      // In a real implementation, this would start TTS
      // For now, we'll simulate with a timer
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSummaryText = () => {
    const timeText = timeFilter === 'TODAY' ? "today" : timeFilter.toLowerCase().replace('last ', '');
    const tab = activeTab.toLowerCase();
    
    const summaries = {
      'fun': {
        'today': "Today's fun content has been absolutely delightful! Our community shared hilarious memes about weekend coding fails, viral TikTok dance challenges that somehow incorporate programming concepts, and adorable pet photos from members' home offices. The 'Funny Friday Facts' thread exploded with over 200 comments featuring the most entertaining coding bugs and their solutions. Gaming discussions dominated with heated debates about the best retro games for team building, while food enthusiasts shared their wildest recipe experiments inspired by coding functions.",
        'week': "This week's fun highlights showcase our community's creativity at its peak! Meme Monday generated over 500 shares with tech-themed content, while Wednesday's pet photo contest saw 75 adorable submissions. Gaming tournaments brought together 120 participants across multiple platforms, and our cooking challenges inspired 30 unique 'algorithm-inspired' recipes. Comedy gold emerged from debugging stories, office setup tours, and spontaneous dance-off videos that went viral within our community.",
        'month': "This month's fun content reveals incredible community engagement! Our monthly meme contest reached 1,200 submissions with themes ranging from AI humor to work-from-home realities. Gaming guilds formed naturally, hosting tournaments that attracted 300+ participants. Pet adoption announcements, celebration posts for personal milestones, and creative hobby showcases dominated feeds. The highlight was our virtual comedy night featuring 15 community members performing original tech-themed stand-up routines.",
        'year': "This year's fun content timeline shows remarkable evolution in community humor and creativity! Starting with simple memes and growing into sophisticated multimedia content, we've seen over 10,000 fun posts gain significant traction. Major highlights include monthly themed contests, seasonal gaming tournaments attracting thousands, viral cooking challenges, and the emergence of community-created entertainment series. Our fun content has become a cornerstone of member retention and engagement."
      },
      'factual': {
        'today': "Today's factual content provides crucial community updates and industry insights. The Community Garden initiative received final approval with budget allocation confirmed for spring implementation. Tech Meetup scheduling finalized for next Friday featuring three keynote speakers from major tech companies. New member orientation welcomed 12 professionals from diverse backgrounds, while the Book Club announced their next selection: 'Digital Transformation in Modern Workplaces'. Industry trend discussions covered AI advancements, remote work policies, and sustainability in tech.",
        'week': "This week's factual updates showcase significant community progress and external partnerships. The Community Garden project moved into phase two with soil preparation beginning Tuesday. Tech infrastructure improvements completed with 99.9% uptime achieved. Partnership announcements with three local universities for internship programs, while member surveys revealed 85% satisfaction rates with current offerings. New policy implementations for content moderation and community guidelines received unanimous board approval.",
        'month': "This month's factual content demonstrates substantial growth and achievement across all community initiatives. The Community Garden project completion timeline advanced by two weeks due to volunteer enthusiasm. Membership growth hit 15% with retention rates at an all-time high of 92%. Educational partnerships expanded to include five institutions, while professional development workshops saw 400+ attendees. Financial transparency reports show healthy community reserves and sustainable growth projections for the coming year.",
        'year': "This year's factual analysis reveals transformative community evolution and measurable impact. Membership doubled from 500 to 1,000 active participants, while engagement metrics increased 300% across all platforms. The Community Garden became a model for other organizations, generating media coverage and replication requests. Educational initiatives produced 50 certified graduates, with 85% securing career advancement. Financial milestones included reaching sustainability targets six months ahead of schedule."
      },
      'unusual': {
        'today': "Today's unusual content sparked fascinating discussions about unconventional approaches to common problems. A member's experiment with coding in complete darkness yielded surprising productivity insights, while another's attempt to teach programming concepts through interpretive dance went unexpectedly viral. Unusual career transition stories dominated, including a former circus performer turned UX designer and a classical musician who became a data scientist. Strange bug reports included code that only worked during full moons and applications that performed better when played specific music genres.",
        'week': "This week's unusual discoveries challenged conventional thinking across multiple domains. Experimental work schedules including 'twilight coding sessions' showed 40% productivity increases for night owls. Unconventional team building exercises using escape rooms and cooking challenges strengthened collaboration metrics significantly. Bizarre problem-solving approaches like 'rubber duck debugging' evolved into full philosophical discussions about consciousness and communication. Creative workspace innovations included standing desks made from recycled materials and collaboration spaces designed like artist studios.",
        'month': "This month's unusual content exploration revealed hidden talents and unexpected solutions throughout our community. Alternative learning methods gained traction, including coding through music composition, visual art programming, and storytelling algorithms. Unconventional partnerships emerged between seemingly unrelated professionals, creating innovative project collaborations. Strange-but-successful experiments included meditation-based problem solving, gamified learning approaches that increased retention by 60%, and unconventional networking events that broke traditional professional boundaries while maintaining respect and inclusivity.",
        'year': "This year's unusual content timeline showcases our community's willingness to embrace unconventional wisdom and creative thinking. From experimental problem-solving methodologies to alternative career paths that defied traditional expectations, we've celebrated diversity in approach and thought. Major unusual achievements include successful project completions using non-traditional methodologies, creative collaborations that bridged multiple industries, and innovative solutions that emerged from thinking outside conventional frameworks. These approaches have become integral to our community's problem-solving culture."
      },
      'curious': {
        'today': "Today's curious content sparked deep exploration into emerging technologies and philosophical questions. Discussions about quantum computing applications in everyday life attracted 150+ engaged participants. AI ethics debates emerged from real-world implementation examples, while space exploration technology discussions connected astronomy enthusiasts with engineering professionals. Fascinating research sharing included studies on remote work psychology, digital minimalism impacts, and the intersection of technology with human creativity and emotional intelligence.",
        'week': "This week's curious explorations delved into cutting-edge research and thought-provoking questions that challenge our understanding. Deep learning algorithm discussions evolved into philosophical debates about consciousness and machine understanding. Environmental technology solutions sparked collaborative brainstorming sessions with actionable outcomes. Historical technology evolution analysis connected past innovations with future possibilities, while interdisciplinary conversations merged psychology, technology, and human behavior insights to create comprehensive understanding frameworks.",
        'month': "This month's curious content fostered intellectual growth through diverse topic exploration and collaborative research initiatives. Emerging technology trend analysis sessions brought together experts from multiple fields for comprehensive discussions. Scientific breakthrough sharing included peer-reviewed research summaries accessible to non-experts. Cultural technology impact studies examined global perspectives on digital transformation, while future-focused conversations explored potential scenarios for technology integration in education, healthcare, and community building with thoughtful consideration of ethical implications.",
        'year': "This year's curious content journey reflects our community's commitment to lifelong learning and intellectual exploration. From quantum physics discussions to consciousness studies, from environmental solutions to space exploration, we've maintained an atmosphere of respectful inquiry and collaborative learning. Major curious achievements include guest expert sessions with 50+ industry leaders, collaborative research projects that produced publishable insights, and learning circles that helped members explore new fields while contributing their unique perspectives to collective knowledge."
      },
      'spicy': {
        'today': "Today's spicy content generated heated but respectful debates on controversial technology topics. Net neutrality discussions brought passionate arguments from multiple perspectives, while data privacy conversations challenged current corporate practices. Heated exchanges about cryptocurrency's environmental impact led to productive solutions brainstorming. Controversial AI implementation debates sparked three-hour discussion threads, while workplace policy disagreements resulted in constructive compromise proposals that addressed multiple stakeholder concerns.",
        'week': "This week's spicy topics maintained high engagement while preserving community respect and productive discourse. Technology regulation debates attracted industry professionals sharing insider perspectives on policy implications. Controversial hiring practice discussions led to actionable diversity and inclusion initiatives. Open source versus proprietary software debates evolved into collaborative projects combining both approaches. Remote work policy discussions generated passionate exchanges that ultimately produced comprehensive guidelines for hybrid work environments.",
        'month': "This month's spicy content tackled complex issues requiring nuanced discussion and multiple perspective consideration. Technology ethics debates expanded into industry-wide policy recommendation development. Controversial startup funding discussions examined power dynamics in tech investment, while gig economy labor rights conversations produced actionable advocacy strategies. Climate technology debates balanced innovation needs with environmental responsibility, resulting in community-driven sustainability initiatives that gained external recognition.",
        'year': "This year's spicy content demonstrates our community's ability to tackle controversial topics while maintaining respect and producing constructive outcomes. From tech industry labor practices to algorithmic bias, from digital rights to environmental responsibility, we've engaged with difficult questions without sacrificing community cohesion. Major spicy achievements include policy papers that influenced local legislation, collaborative advocacy efforts that created measurable change, and respectful debate frameworks that other communities have adopted as models for constructive discourse."
      },
      'nice': {
        'today': "Today's nice content showcased the warmth and supportiveness that defines our community spirit. Celebration posts for member achievements including new job announcements, graduation celebrations, and personal milestone recognition generated hundreds of congratulatory responses. Random acts of kindness stories inspired others to continue spreading positivity both online and offline. Gratitude threads highlighted community impact on individual lives, while encouragement exchanges supported members facing challenges with genuine care and practical assistance.",
        'week': "This week's nice highlights demonstrate our community's commitment to mutual support and celebration. Member appreciation posts recognized contributions from volunteers, mentors, and active participants. Success story sharing included career advancement announcements, project completion celebrations, and personal growth achievements. Supportive exchanges helped members navigate challenges while maintaining optimism and community connection. Kindness initiatives extended beyond digital spaces into real-world community service and mutual aid networks.",
        'month': "This month's nice content reveals the deep connections and genuine care that characterize our community relationships. Major celebration events included member anniversaries, community milestone recognitions, and collective achievement acknowledgments. Support network activation helped members through difficult times while respecting privacy and maintaining dignity. Mentorship success stories showcased meaningful professional and personal development relationships, while community service initiatives demonstrated our collective commitment to positive impact beyond our immediate community boundaries.",
        'year': "This year's nice content timeline illustrates the evolution of genuine community care and mutual support. From individual celebrations to collective achievements, we've maintained an environment where kindness and support flourish naturally. Major nice achievements include mentorship programs that produced 100+ successful partnerships, community service initiatives that impacted 1,000+ lives, celebration events that brought members together across geographic boundaries, and support networks that provided meaningful assistance during challenging times while preserving dignity and respect."
      }
    };
    
    return summaries[tab as keyof typeof summaries]?.[timeText as keyof typeof summaries.fun] || summaries[tab as keyof typeof summaries]?.['today'] || "Community activity has been vibrant with engaging discussions and strong participation across all content types.";
  };

  const getPulseTitle = () => {
    const timeText = timeFilter === 'TODAY' ? 'Today' : timeFilter.replace('LAST ', 'This ');
    return `${timeText}'s ${activeTab.charAt(0) + activeTab.slice(1).toLowerCase()} Pulse`;
  };

  const getHighlights = () => {
    const highlights = {
      'fun': [
        "Gaming tournament attracted 120+ participants across platforms",
        "Meme contest generated over 500 community shares",
        "Comedy night featured 15 members performing tech humor"
      ],
      'factual': [
        "Community Garden project advanced two weeks ahead",
        "Tech Meetup confirmed with three keynote speakers", 
        "New member orientation welcomed 12 professionals"
      ],
      'unusual': [
        "Coding in darkness experiment yielded 40% productivity gains",
        "Interpretive dance programming tutorial went viral",
        "Former circus performer transitioned to UX design"
      ],
      'curious': [
        "Quantum computing discussion attracted 150+ participants",
        "AI ethics debate generated three policy proposals",
        "Environmental technology brainstorming produced solutions"
      ],
      'spicy': [
        "Net neutrality debate sparked productive compromises",
        "Data privacy discussion challenged corporate practices",
        "Tech regulation conversation influenced local policy"
      ],
      'nice': [
        "Member achievements celebrated with 200+ responses",
        "Mentorship program matched 100+ partnerships",
        "Community service initiatives impacted 1,000+ lives"
      ]
    };
    
    return highlights[activeTab.toLowerCase() as keyof typeof highlights] || highlights['factual'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl lg:rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6 mx-auto max-w-ultra"
    >
      {/* Mobile-First Responsive Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Content Section - Full width on mobile, 3/5 on desktop */}
        <div className="lg:flex-grow lg:w-3/5 space-y-fluid-6">
          
          {/* Title Section - Desktop Only */}
          <div className="hidden lg:block text-left">
            <h1 className="text-fluid-4xl xl:text-fluid-5xl font-bold text-indigo-700 leading-tight">
              Kai's Kamunity Newsfeed
            </h1>
          </div>
          
          {/* Filters Section - Shows first on mobile */}
          <div className="space-y-fluid-4">
            {/* Mobile Title - Shows above filters on mobile only */}
            <div className="lg:hidden text-center">
              <h1 className="text-fluid-2xl font-bold text-indigo-700 leading-tight mb-fluid-4">
                Kai's Kamunity Newsfeed
              </h1>
            </div>

            {/* Time Filter Tabs */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {timeFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => onTimeFilterChange(filter.value)}
                  className={`px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-fluid-xs lg:text-fluid-sm font-medium transition-colors touch-manipulation ${
                    timeFilter === filter.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Content Type Tabs */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {contentTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={`px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-fluid-xs lg:text-fluid-sm font-medium whitespace-nowrap transition-colors touch-manipulation ${
                    activeTab === tab.value
                      ? `${tab.color} text-white`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Count Link */}
            <div className="text-center lg:text-left">
              <button
                onClick={() => {
                  // Scroll to content section
                  const contentSection = document.querySelector('[data-content-grid]');
                  if (contentSection) {
                    contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="text-fluid-sm text-gray-600 hover:text-indigo-600 transition-colors underline decoration-dotted underline-offset-4 hover:decoration-solid"
              >
                Showing <span className="font-semibold text-indigo-600">{filteredContentCount}</span> {filteredContentCount === 1 ? 'item' : 'items'} 
                {timeFilter && ` from ${timeFilter.toLowerCase().replace('_', ' ')}`}
                {perspectiveFilter !== 'all' && ` with ${perspectiveFilter.toLowerCase()} perspective`}
              </button>
            </div>
          </div>

          {/* Mobile Key Highlights - Shows second on mobile */}
          <div className="lg:hidden bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
            <h4 className="text-fluid-sm lg:text-fluid-base font-semibold text-gray-800 mb-fluid-4">
              {(() => {
                const timeText = timeFilter === 'TODAY' ? 'Today' : timeFilter.replace('LAST ', 'This ');
                const perspectiveText = activeTab.charAt(0) + activeTab.slice(1).toLowerCase();
                return `${timeText}'s ${perspectiveText} Three Key Highlights`;
              })()}
            </h4>
            <ul className="space-y-3">
              {getHighlights().map((highlight: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-fluid-xs lg:text-fluid-sm text-gray-600">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Main Content Summary - Shows third on mobile */}
          <div className="space-y-fluid-4">
            <h3 className="text-fluid-lg lg:text-fluid-xl font-semibold text-indigo-600">
              {getPulseTitle()}
            </h3>
            <div className="max-h-48 sm:max-h-64 lg:max-h-80 overflow-y-auto">
              <p className="text-fluid-sm lg:text-fluid-base text-gray-700 leading-relaxed">
                {getSummaryText()}
              </p>
            </div>
          </div>

          {/* Mobile Audio Player - Shows fourth on mobile */}
          <div className="lg:hidden bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-indigo-100">
            <h4 className="text-fluid-sm lg:text-fluid-base font-semibold text-indigo-700 mb-fluid-6 text-center">
              Listen to Summary
            </h4>
            
            {/* Player Controls */}
            <div className="space-y-fluid-6">
              {/* Play Button and Avatar */}
              <div className="flex items-center justify-center gap-6">
                {/* Play/Pause Button */}
                <button
                  onClick={handlePlayPause}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-full flex items-center justify-center transition-colors shadow-lg touch-manipulation"
                  aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
                
                {/* Presenter Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-peach-100 to-lavender-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="/character-mascot.png" 
                    alt="Kai AI Presenter" 
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                    loading="lazy"
                  />
                </div>
              </div>
              
              {/* Progress Bar and Time */}
              <div className="space-y-3">
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
          </div>
        </div>
        
        {/* Desktop Sidebar - Only shows on desktop */}
        <div className="hidden lg:block lg:w-2/5 lg:flex-shrink-0 space-y-fluid-6">
          
          {/* Desktop Key Highlights */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
            <h4 className="text-fluid-sm lg:text-fluid-base font-semibold text-gray-800 mb-fluid-4">
              Three Key Highlights:
            </h4>
            <ul className="space-y-3">
              {getHighlights().map((highlight: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-fluid-xs lg:text-fluid-sm text-gray-600">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Desktop Audio Player */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-indigo-100">
            <h4 className="text-fluid-sm lg:text-fluid-base font-semibold text-indigo-700 mb-fluid-6 text-center">
              Listen to Summary
            </h4>
            
            {/* Player Controls */}
            <div className="space-y-fluid-6">
              {/* Play Button and Avatar */}
              <div className="flex items-center justify-center gap-6">
                {/* Play/Pause Button */}
                <button
                  onClick={handlePlayPause}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-full flex items-center justify-center transition-colors shadow-lg touch-manipulation"
                  aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
                
                {/* Presenter Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-peach-100 to-lavender-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="/character-mascot.png" 
                    alt="Kai AI Presenter" 
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                    loading="lazy"
                  />
                </div>
              </div>
              
              {/* Progress Bar and Time */}
              <div className="space-y-3">
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
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AINewsfeedSummary; 