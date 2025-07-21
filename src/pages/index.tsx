import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import EmailCapture from '@/components/EmailCapture';
import MediaCard from '@/components/MediaCard';
import KaiButton from '@/components/KaiButton';
import { useContent } from '@/hooks/useContent';
import { MediaContent } from '@/types';

export default function Home() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [mediaContent, setMediaContent] = useState<MediaContent[]>([]);
  
  // Fetch content using the custom hook
  const { content: cmsContent, loading, error } = useContent({ featured: true });
  
  // Update media content when CMS content changes
  useEffect(() => {
    if (cmsContent && cmsContent.length > 0) {
      // Convert CMS content to MediaContent format
      const convertedContent: MediaContent[] = cmsContent.map(item => ({
        id: item.id,
        type: item.type as any,
        title: item.title,
        description: item.description,
        body: item.body, // Include body content for expanded view
        thumbnailUrl: item.thumbnailUrl,
        contentUrl: item.contentUrl,
        author: item.author,
        date: item.date,
        duration: item.duration,
        tags: item.tags,
        featured: item.featured,
        timePeriod: item.timePeriod as any,
        perspective: (Array.isArray(item.perspective) ? item.perspective[0] : item.perspective) as any,
        logoCard: item.logoCard
      }));
      
      setMediaContent(convertedContent);
    }
  }, [cmsContent]);

  const handleCardExpand = (contentId: string) => {
    setExpandedCard(expandedCard === contentId ? null : contentId);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero Section - 50/50 Layout with Audio Player */}
        <div className="relative bg-gradient-to-br from-indigo-50 via-lavender-50 to-peach-50 overflow-hidden">
          <div className="max-w-ultra mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] items-stretch">
              
              {/* Character Image Section - MOBILE: 1st, DESKTOP: Right Side Top */}
              <div className="order-1 lg:order-2 lg:row-span-1 px-4 sm:px-6 lg:px-8 pt-fluid-4 pb-fluid-4 lg:pt-fluid-6 lg:pb-fluid-4 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="flex items-center justify-center"
                >
                  <div className="relative w-full max-w-sm lg:max-w-md">
                    {/* Character Mascot Container */}
                    <div className="aspect-square bg-gradient-to-br from-indigo-100 via-lavender-100 to-peach-100 rounded-2xl lg:rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white/50 backdrop-blur-sm relative overflow-hidden">
                      {/* Hero Image */}
                      <div className="w-full h-full p-3 lg:p-6 relative">
                        <img 
                          src="/images/home-hero3.png" 
                          alt="Kamunity Home Hero" 
                          className="w-full h-full object-contain rounded-xl lg:rounded-2xl"
                          style={{
                            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                          }}
                          loading="eager"
                        />
                        
                        {/* Kai Button positioned over image */}
                        <KaiButton />
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 lg:-top-8 lg:-right-8 w-12 h-12 lg:w-18 lg:h-18 bg-gradient-to-br from-gold-400 to-gold-500 rounded-full opacity-80 animate-pulse" />
                    <div className="absolute -bottom-3 -left-3 lg:-bottom-6 lg:-left-6 w-9 h-9 lg:w-12 lg:h-12 bg-gradient-to-br from-peach-400 to-peach-500 rounded-full opacity-80" />
                    <div className="absolute top-1/4 -left-2 lg:-left-3 w-6 h-6 lg:w-9 lg:h-9 bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-full opacity-60" />
                  </div>
                </motion.div>
              </div>

              {/* Text Content - MOBILE: 2nd, DESKTOP: Left Side */}
              <div className="order-2 lg:order-1 lg:row-span-2 px-4 sm:px-6 lg:px-12 pt-fluid-4 pb-fluid-8 lg:pt-fluid-6 lg:pb-fluid-24 flex items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-4xl w-full"
                >
                  <h1 className="text-fluid-4xl lg:text-fluid-6xl xl:text-fluid-7xl font-bold text-indigo-700 mb-fluid-6 leading-tight">
                    Hello Kamunity World
                  </h1>
                  <p className="text-fluid-lg lg:text-fluid-2xl text-charcoal mb-fluid-6 leading-relaxed font-light max-w-3xl">
                    ​Imagine a space where every voice matters, where your chats and ideas spark good times and real change, and where community is at the heart of it all, again
                  </p>
                  <p className="text-fluid-base lg:text-fluid-xl text-indigo-600 font-semibold mb-fluid-8 max-w-3xl">
                    We do, everyday! ​And now we're building it... 
                  </p>
                  <p className="text-fluid-lg lg:text-fluid-2xl text-charcoal mb-fluid-6 leading-relaxed font-light max-w-3xl">
                    A place to bring your purpose, people and ideas for good times and good communities, and get it done!  A Kamunity of verified support, tools, and tips making it easier and more fun to do more good, whatever that means to you and yours                  
                  </p>
                  <p className="text-fluid-base lg:text-fluid-xl text-indigo-600 font-semibold mb-fluid-8 max-w-3xl">
                  Your Community, Your Voice, Your Passion, Together
                  </p>
                </motion.div>
              </div>

                             {/* Audio Player Section - MOBILE: 3rd, DESKTOP: Right Side Bottom */}
              <div className="order-3 lg:order-2 lg:row-span-1 px-4 sm:px-6 lg:px-8 pt-fluid-4 pb-fluid-8 lg:pt-fluid-4 lg:pb-fluid-12 flex items-start lg:items-center justify-center">
                {/* Kamunity News Today Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl p-6 lg:p-8 border border-indigo-100 w-full max-w-sm lg:max-w-md"
                >
                  <h3 className="text-fluid-xl lg:text-fluid-2xl font-bold text-indigo-700 mb-4">
                    KAMUNITY NEWS TODAY
                  </h3>
                  <p className="text-fluid-base lg:text-fluid-lg text-charcoal mb-6 leading-relaxed">
                    Meet the Kamunity News Team and find out whats happening in the Kamunity Today.
                  </p>
                  
                  {/* Audio Player */}
                  <div className="mb-6">
                    <audio 
                      controls 
                      className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg"
                      style={{
                        filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                      }}
                    >
                      <source src="/audio/KAMUNITY_NEWS_TODAY.mp3" type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  
                  {/* Visit News Room Link */}
                  <Link 
                    href="/content"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-fluid-base lg:text-fluid-lg transition-colors duration-200 hover:underline"
                  >
                    <span>📰 visit the news room</span>
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Background decorative elements with responsive sizing */}
          <div className="absolute -top-20 -right-20 lg:-top-40 lg:-right-40 w-40 h-40 lg:w-80 lg:h-80 bg-gradient-to-br from-indigo-200/30 to-lavender-200/30 rounded-full blur-2xl lg:blur-3xl" />
          <div className="absolute -bottom-20 -left-20 lg:-bottom-40 lg:-left-40 w-48 h-48 lg:w-96 lg:h-96 bg-gradient-to-br from-peach-200/30 to-gold-200/30 rounded-full blur-2xl lg:blur-3xl" />
        </div>

        {/* Would You Like to Know More Section */}
        <section className="py-fluid-12 px-4 sm:px-6 lg:px-12 bg-gradient-to-r from-indigo-50 to-lavender-50 border-b border-indigo-100">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mb-fluid-8">
                <h2 className="text-fluid-3xl lg:text-fluid-5xl font-bold text-indigo-700 mb-fluid-6">
                  WOULD YOU LIKE TO KNOW MORE?
                </h2>
                <p className="text-fluid-lg lg:text-fluid-2xl text-charcoal mb-fluid-8 max-w-4xl mx-auto leading-relaxed">
                  We're just about to come out of super secret stealth mode, but if you're keen, you could get a sneaky early peek and maybe try one of the many personalised Kamunity Rooms we've already built for other people doing both good and fun things. 
                </p>
              </div>
              
              <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 border border-indigo-100 max-w-2xl mx-auto">
                <EmailCapture source="home" className="w-full" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Content Section - Enhanced Grid for Ultra-wide */}
        <section className="py-fluid-16 px-4 sm:px-6 lg:px-12 bg-white">
          <div className="max-w-ultra mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-fluid-3xl lg:text-fluid-5xl font-bold text-indigo-700 mb-fluid-12 text-center">
                Featured Content
              </h2>
              {/* Enhanced grid: 1 col mobile, 2 cols tablet, 3 cols desktop, 4 cols ultra-wide */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {loading ? (
                  // Loading placeholder cards
                  [...Array(4)].map((_, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
                  ))
                ) : error ? (
                  <div className="col-span-full text-center text-red-600">
                    Error loading content: {error}
                  </div>
                ) : (
                  mediaContent
                    .slice(0, 4) // Show 4 cards for ultra-wide support (already filtered by featured: true)
                    .map((content, index) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <MediaCard
                        content={content}
                        isExpanded={expandedCard === content.id}
                        onToggleExpand={() => handleCardExpand(content.id)}
                      />
                      </motion.div>
                    ))
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-fluid-16 px-4 sm:px-6 lg:px-12 bg-lavender-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-fluid-2xl lg:text-fluid-3xl font-bold text-indigo-700 mb-fluid-6">
              Ready to Discover More?
            </h2>
            <p className="text-fluid-base lg:text-fluid-lg text-charcoal mb-fluid-8 max-w-2xl mx-auto">
              Learn about our journey, our vision, our missions, and how you can be part of the Kamunity story.
            </p>
            <Link
              href="/about"
              className="btn-primary inline-flex items-center gap-2 text-fluid-base lg:text-fluid-lg px-fluid-6 py-fluid-3"
            >
              <span>About Us</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
} 