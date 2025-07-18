import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import EmailCapture from '@/components/EmailCapture';
import KaiButton from '@/components/KaiButton';
import { TIMELINE_NODES } from '@/lib/constants';

export default function About() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <Layout title="About Us - Kamunity">
      <div className="min-h-screen bg-white">
        {/* Hero Section with Enhanced Responsive Layout */}
        <section 
          className="relative py-fluid-16 px-4 sm:px-6 lg:px-12 overflow-hidden"
          style={{
            backgroundImage: 'url(/images/about-hero.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent"></div>
          
          <div className="absolute inset-0 overflow-hidden">
            <div className="ellipse-decoration w-48 h-48 lg:w-96 lg:h-96 -top-24 -right-24 lg:-top-48 lg:-right-48 animate-float opacity-20" />
            <div className="ellipse-decoration w-32 h-32 lg:w-64 lg:h-64 bottom-0 left-1/4 animate-float opacity-20" style={{ animationDelay: '3s' }} />
          </div>
          
          <div className="max-w-ultra mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center"
            >
              
              {/* Character Image - Right 1/3 with responsive sizing - MOBILE FIRST (shows first on mobile) */}
              <div className="lg:col-span-1 lg:order-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="relative w-full max-w-md mx-auto"
                >
                  {/* Character Mascot Container - 50% bigger than home page */}
                  <div className="aspect-square lg:aspect-4/3 xl:aspect-square bg-gradient-to-br from-indigo-100 via-lavender-100 to-peach-100 rounded-2xl lg:rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white/50 backdrop-blur-sm relative overflow-hidden">
                    {/* Hero Image with better responsive handling */}
                    <div className="w-full h-full p-3 lg:p-6 relative">
                      <img 
                        src="/character-mascot.png" 
                        alt="Kamunity mascot character" 
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
                  
                  {/* Enhanced decorative elements with 50% bigger sizing */}
                  <div className="absolute -top-4 -right-4 lg:-top-8 lg:-right-8 w-12 h-12 lg:w-18 lg:h-18 bg-gradient-to-br from-gold-400 to-gold-500 rounded-full opacity-80 animate-pulse" />
                  <div className="absolute -bottom-3 -left-3 lg:-bottom-6 lg:-left-6 w-9 h-9 lg:w-12 lg:h-12 bg-gradient-to-br from-peach-400 to-peach-500 rounded-full opacity-80" />
                  <div className="absolute top-1/4 -left-2 lg:-left-3 w-6 h-6 lg:w-9 lg:h-9 bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-full opacity-60" />
                </motion.div>
              </div>

              {/* Text Content - Left 2/3 with fluid typography - SHOWS SECOND ON MOBILE */}
              <div className="lg:col-span-2 lg:order-1">
                <h1 className="text-fluid-4xl lg:text-fluid-6xl font-bold text-indigo-700 mb-fluid-6">
                  Our Story
                </h1>
                
                {/* First two paragraphs with light background */}
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 mb-fluid-6 shadow-sm">
                  <p className="text-fluid-lg text-black leading-relaxed mb-fluid-6">
                    Kamunity was born from a simple belief built over way too many years: <span className="text-amber-600 font-medium">when good people come together with 
                    purpose and passion, extraordinary things happen.</span> 
                  </p>
                  
                  <p className="text-fluid-lg text-black leading-relaxed">
                    We're not building a platform: we're helping good people do more good things in the world (and fun things, same/same)
                  </p>
                </div>
                
                {/* Highlighted Key Message */}
                <div className="bg-white/90 backdrop-blur-sm border-l-4 border-gold-400 p-4 sm:p-6 rounded-r-lg mb-fluid-6 shadow-lg">
                  <p className="text-fluid-xl lg:text-fluid-2xl font-semibold text-indigo-700 leading-relaxed">
                    All for you and your community, no matter what community it is, and no matter what good or fun thing you're doing
                  </p>
                </div>
                
                {/* Last paragraph with light background */}
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-sm">
                  <p className="text-fluid-lg text-black leading-relaxed">
                    Basically, we're the kind of people that would back you on the dance floor, no matter what song was playing!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-fluid-16 px-4 sm:px-6 lg:px-12">
          <div className="max-w-ultra mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-fluid-3xl lg:text-fluid-5xl font-bold text-indigo-700 text-center mb-fluid-6">
                Our Journey
              </h2>
              <p className="text-center text-fluid-base lg:text-fluid-lg text-charcoal mb-fluid-12">
                Click a golden circle to read about the steps so far
              </p>
              
              {/* Unified Timeline - Single Implementation */}
              <div className="relative">
                
                {/* Timeline Line - Desktop Only */}
                <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-pastel-pink-200 via-pastel-pink-300 to-pastel-pink-400 hidden lg:block" />
                
                {/* Timeline Nodes - Responsive Layout */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-6 lg:space-y-0 lg:gap-4">
                  {TIMELINE_NODES.map((node, index) => (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex-1 relative"
                    >
                      {/* Circle and Label Container */}
                      <div className="text-center mb-4 lg:mb-6">
                        {/* Circle Button - Same on all devices */}
                        <button
                          onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
                          className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 lg:w-16 lg:h-16 bg-gold-400 hover:bg-gold-500 rounded-full flex items-center justify-center text-xl sm:text-2xl lg:text-2xl transition-all duration-300 hover:scale-110 shadow-lg mx-auto touch-manipulation focus:outline-none focus:ring-4 focus:ring-gold-200"
                          aria-label={`Learn more about ${node.label}`}
                          aria-expanded={activeNode === node.id}
                        >
                          {node.icon}
                        </button>
                        
                        {/* Node Label */}
                        <h3 className={`text-fluid-lg sm:text-fluid-xl lg:text-fluid-lg xl:text-fluid-xl font-semibold mt-3 lg:mt-4 ${
                          node.id === 'vision' || node.id === 'launch'
                            ? 'text-gold-600' 
                            : 'text-indigo-700'
                        }`}>
                          {node.label}
                        </h3>
                      </div>

                      {/* Mobile/Tablet Content - Appears under each circle */}
                      <div className="lg:hidden">
                        <AnimatePresence>
                          {activeNode === node.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                              transition={{ 
                                duration: 0.4,
                                ease: "easeInOut",
                                height: { duration: 0.3 }
                              }}
                              className="overflow-hidden"
                              style={{ originY: 0 }}
                            >
                              <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 border-2 border-gold-200 mx-auto max-w-md sm:max-w-lg">
                                <h4 className="text-fluid-lg sm:text-fluid-xl font-semibold text-indigo-700 mb-3">
                                  {node.title}
                                </h4>
                                <p className="text-fluid-sm sm:text-fluid-base text-charcoal leading-relaxed">
                                  {node.description}
                                </p>
                                
                                {/* Close button for mobile */}
                                <button
                                  onClick={() => setActiveNode(null)}
                                  className="mt-4 px-4 py-2 text-sm bg-gold-100 hover:bg-gold-200 text-gold-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold-300"
                                  aria-label="Close description"
                                >
                                  Close
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Desktop Content Area - Centralized below all circles */}
                <div className="hidden lg:block mt-12">
                  <AnimatePresence mode="wait">
                    {activeNode && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        {TIMELINE_NODES.map((node) => (
                          activeNode === node.id && (
                            <motion.div 
                              key={node.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              className="bg-white rounded-xl lg:rounded-2xl shadow-xl p-6 lg:p-8 border-2 border-gold-200"
                            >
                              <h4 className="text-fluid-xl lg:text-fluid-2xl font-semibold text-indigo-700 mb-4">
                                {node.title}
                              </h4>
                              <p className="text-fluid-base lg:text-fluid-lg text-charcoal leading-relaxed max-w-4xl">
                                {node.description}
                              </p>
                            </motion.div>
                          )
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Banner */}
        <div className="bg-peach-100 py-fluid-6 px-4 sm:px-6 border-t border-peach-200">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-fluid-base lg:text-fluid-lg text-indigo-700 font-medium">
              Want in on the next chapter the the story?
            </p>
            <EmailCapture source="about" buttonText="Join Kamunity" className="w-full sm:w-auto" />
          </div>
        </div>

        {/* Content Feed CTA */}
        <section className="py-fluid-16 px-4 sm:px-6 lg:px-12 bg-gray-50">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl lg:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12"
            >
              <h2 className="text-fluid-2xl lg:text-fluid-3xl font-bold text-gold-600 mb-fluid-6">
                WOULD YOU LIKE TO KNOW MORE?
              </h2>
              <p className="text-fluid-base lg:text-fluid-lg text-charcoal mb-fluid-8 max-w-3xl mx-auto">
                We have lots of stories from our clubs and communities that you might like, find funny, and maybe even vibe with your interests and values.
              </p>
              <Link
                href="/content"
                className="btn-primary inline-flex items-center gap-2 text-fluid-base lg:text-fluid-lg px-fluid-6 py-fluid-3"
              >
                <span>Explore Kamunity Stories</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
}