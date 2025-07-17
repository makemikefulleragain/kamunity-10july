import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import EmailCapture from '@/components/EmailCapture';
import MediaCard from '@/components/MediaCard';
import { SAMPLE_MEDIA_CONTENT } from '@/lib/constants';
import { MediaContent } from '@/types';

export default function Home() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [mediaContent, setMediaContent] = useState<MediaContent[]>(SAMPLE_MEDIA_CONTENT);

  const handleCardExpand = (contentId: string) => {
    setExpandedCard(expandedCard === contentId ? null : contentId);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero Section - Enhanced Responsive Layout */}
        <div className="relative bg-gradient-to-br from-indigo-50 via-lavender-50 to-peach-50 overflow-hidden">
          <div className="max-w-ultra mx-auto">
            <div className="lg:grid lg:grid-cols-3 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] items-stretch">
              
              {/* Right Image Area - 1/3 width with improved aspect ratios - MOBILE FIRST (shows first on mobile) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="lg:col-span-1 lg:order-2 px-4 sm:px-6 lg:px-8 py-fluid-8 lg:py-fluid-12 flex items-center justify-center"
              >
                <div className="relative w-full max-w-sm">
                  {/* Character Mascot Container - Responsive sizing */}
                  <div className="aspect-square lg:aspect-4/3 xl:aspect-square bg-gradient-to-br from-indigo-100 via-lavender-100 to-peach-100 rounded-2xl lg:rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white/50 backdrop-blur-sm relative overflow-hidden">
                    {/* Hero Image with better responsive handling */}
                    <div className="w-full h-full p-2 lg:p-4">
                      <img 
                        src="/images/home-hero3.png" 
                        alt="Kamunity Home Hero" 
                        className="w-full h-full object-contain rounded-xl lg:rounded-2xl"
                        style={{
                          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                        }}
                        loading="eager"
                      />
                    </div>
                  </div>
                  
                  {/* Enhanced decorative elements with fluid sizing */}
                  <div className="absolute -top-3 -right-3 lg:-top-6 lg:-right-6 w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-gold-400 to-gold-500 rounded-full opacity-80 animate-pulse" />
                  <div className="absolute -bottom-2 -left-2 lg:-bottom-4 lg:-left-4 w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-peach-400 to-peach-500 rounded-full opacity-80" />
                  <div className="absolute top-1/4 -left-1 lg:-left-2 w-4 h-4 lg:w-6 lg:h-6 bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-full opacity-60" />
                </div>
              </motion.div>

              {/* Left Content - 2/3 width with fluid typography - SHOWS SECOND ON MOBILE */}
              <div className="lg:col-span-2 lg:order-1 px-4 sm:px-6 lg:px-12 py-fluid-8 lg:py-fluid-24 flex items-center">
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
                {mediaContent
                  .filter(content => content.featured)
                  .slice(0, 4) // Show 4 cards for ultra-wide support
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
                  ))}
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