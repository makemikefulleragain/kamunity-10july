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
        {/* Hero Section - Optimized Layout */}
        <div className="relative bg-gradient-to-br from-indigo-50 via-lavender-50 to-peach-50 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="lg:grid lg:grid-cols-3 min-h-[600px] items-stretch">
              {/* Left Content - 2/3 width */}
              <div className="lg:col-span-2 px-6 lg:px-12 py-16 lg:py-24 flex items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-2xl w-full"
                >
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-indigo-700 mb-6 leading-tight">
                    Hello Kamunity World
                  </h1>
                  <p className="text-xl lg:text-2xl text-charcoal mb-6 leading-relaxed font-light">
                    ​Imagine a space where every voice matters, where your chats and ideas spark real change, and where community is at the heart of progress.
                  </p>
                  <p className="text-lg lg:text-xl text-indigo-600 font-semibold mb-10">
                    We do, everyday! ​And now we're building it. 
                  </p>
                  <p className="text-xl lg:text-2xl text-charcoal mb-6 leading-relaxed font-light">
                    A place to bring your purpose, people and ideas for good, and get it done!  A Kamunity of verified support, tools, and tips so we all have more good times and good communities, whatever that means to you and yours                  
                  </p>
                  <p className="text-lg lg:text-xl text-indigo-600 font-semibold mb-10">
                  Your Community, Your Voice, Your Passion, Together
                  </p>
                </motion.div>
              </div>

              {/* Right Image Area - 1/3 width */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="lg:col-span-1 px-6 lg:px-8 py-16 flex items-center justify-center"
              >
                <div className="relative w-full max-w-sm">
                  {/* Character Mascot Container - Aligned with text height */}
                  <div className="h-80 bg-gradient-to-br from-indigo-100 via-lavender-100 to-peach-100 rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white/50 backdrop-blur-sm relative overflow-hidden">
                    {/* Character Image */}
                    <div className="w-full h-full flex items-center justify-center p-6">
                      <img 
                        src="/character-mascot.png" 
                        alt="Kamunity Character Mascot" 
                        className="w-full h-full object-contain max-w-xs"
                        style={{
                          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Enhanced decorative elements */}
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-500 rounded-full opacity-80 animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-peach-400 to-peach-500 rounded-full opacity-80" />
                  <div className="absolute top-1/4 -left-2 w-6 h-6 bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-full opacity-60" />
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Background decorative elements */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200/30 to-lavender-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-peach-200/30 to-gold-200/30 rounded-full blur-3xl" />
        </div>

        {/* Would You Like to Know More Section */}
        <section className="py-12 px-6 lg:px-12 bg-gradient-to-r from-indigo-50 to-lavender-50 border-b border-indigo-100">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mb-8">
                <h2 className="text-4xl lg:text-5xl font-bold text-indigo-700 mb-6">
                  WOULD YOU LIKE TO KNOW MORE?
                </h2>
                <p className="text-xl lg:text-2xl text-charcoal mb-8 max-w-3xl mx-auto leading-relaxed">
                  We're just about to come out of super secret stealth mode, but if you're keen, you could get a sneaky early peek and maybe try one of the many personalised Kamunity Rooms we've already built for other people doing both good and fun things. 
                </p>
              </div>
              
              <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-indigo-100 max-w-2xl mx-auto">
                <EmailCapture source="home" className="w-full" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Content Section */}
        <section className="py-16 px-6 lg:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-indigo-700 mb-12 text-center">
                Featured Content
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaContent
                  .filter(content => content.featured)
                  .slice(0, 3)
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
        <section className="py-16 px-6 lg:px-12 bg-lavender-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-indigo-700 mb-6">
              Ready to Discover More?
            </h2>
            <p className="text-lg text-charcoal mb-8">
              Learn about our journey, our vision, our missions, and how you can be part of the Kamunity story.
            </p>
            <Link
              href="/about"
              className="btn-primary inline-flex items-center gap-2"
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