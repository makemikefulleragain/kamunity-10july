import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import EmailCapture from '@/components/EmailCapture';
import { TIMELINE_NODES } from '@/lib/constants';

export default function About() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <Layout title="About Us - Kamunity">
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-20 px-6 lg:px-12 bg-gradient-to-br from-lavender-50 to-white overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="ellipse-decoration w-96 h-96 -top-48 -right-48 animate-float" />
            <div className="ellipse-decoration w-64 h-64 bottom-0 left-1/4 animate-float" style={{ animationDelay: '3s' }} />
          </div>
          
          <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center"
          >
              {/* Text Content - Left 2/3 */}
              <div className="lg:col-span-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-indigo-700 mb-6">
              Our Story
            </h1>
                                <p className="text-xl text-charcoal leading-relaxed mb-6">
                  Kamunity was born from a simple belief built over way too many years: <span className="text-indigo-700 font-medium">when good people come together with 
                  purpose and passion, extraordinary things happen.</span> 
                </p>
                
                <p className="text-xl text-charcoal leading-relaxed mb-6">
                  We're not building a platform: we're helping good people do more good things in the world (and fun things, same/same)
                </p>
                
                {/* Highlighted Key Message */}
                <div className="bg-gradient-to-r from-peach-50 to-gold-50 border-l-4 border-gold-400 p-6 rounded-r-lg mb-6 shadow-sm">
                  <p className="text-2xl font-semibold text-indigo-700 leading-relaxed">
                    All for you and your community, no matter what community it is, and no matter what good or fun thing you're doing
                  </p>
                </div>
                <p className="text-xl text-charcoal leading-relaxed">
                  Basically, we're the kind of people that would back you on the dance floor, no matter what song was playing!
                </p>
              </div>
              
              {/* Image Placeholder - Right 1/3 */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative"
                >
                  <div className="aspect-square bg-gradient-to-br from-peach-100 to-gold-100 rounded-2xl shadow-lg flex items-center justify-center border-2 border-peach-200">
                    <div className="text-center">
                      <div className="text-6xl mb-4">✨</div>
                      <p className="text-gold-600 font-semibold text-lg">Our Story</p>
                      <p className="text-charcoal text-sm">Image Coming Soon</p>
                    </div>
                  </div>
                </motion.div>
              </div>
          </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-indigo-700 text-center mb-6">
                Our Journey
              </h2>
              <p className="text-center text-lg text-charcoal mb-12">
                Click a golden circle to read about the steps so far
              </p>
              
              {/* Horizontal Timeline */}
              <div className="relative">
                {/* Timeline Container */}
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-pastel-pink-200 via-pastel-pink-300 to-pastel-pink-400 hidden md:block" />
                  
                  {/* Timeline Nodes - Horizontal Layout */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 md:gap-4">
                    {TIMELINE_NODES.map((node, index) => (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="flex-1 text-center"
                      >
                        {/* Node */}
                        <div className="relative mb-6">
                          <button
                            onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
                            className="relative z-10 w-16 h-16 bg-gold-400 hover:bg-gold-500 rounded-full flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 shadow-lg mx-auto"
                            aria-label={`Learn more about ${node.label}`}
                          >
                            {node.icon}
                          </button>
                        </div>
                        
                        {/* Node Label */}
                        <div className="mb-4">
                          <h3 className={`text-xl md:text-2xl font-semibold mb-2 ${
                            node.id === 'vision' || node.id === 'missions' 
                              ? 'text-gold-600' 
                              : 'text-indigo-700'
                          }`}>
                            {node.label}
                          </h3>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Expanded Content Area */}
                <div className="mt-8">
                  <AnimatePresence>
                    {activeNode && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {TIMELINE_NODES.map((node) => (
                          activeNode === node.id && (
                            <div key={node.id} className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border-2 border-gold-200">
                              <h4 className="text-2xl font-semibold text-indigo-700 mb-4">
                                {node.title}
                              </h4>
                              <p className="text-charcoal leading-relaxed">
                                {node.description}
                              </p>
                            </div>
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
        <div className="bg-peach-100 py-6 px-6 border-t border-peach-200">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-lg text-indigo-700 font-medium">
              Want in on the next chapter the the story?
            </p>
            <EmailCapture source="about" buttonText="Join Kamunity" className="w-full sm:w-auto" />
          </div>
        </div>

        {/* Content Feed CTA */}
        <section className="py-16 px-6 lg:px-12 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-xl p-8 lg:p-12"
            >
              <h2 className="text-3xl font-bold text-gold-600 mb-6">
                WOULD YOU LIKE TO KNOW MORE?
              </h2>
              <p className="text-lg text-charcoal mb-8">
                We have lots of stories from our clubs and communities that you might like, find funny, and maybe even vibe with your interests and values.
              </p>
              <Link
                href="/content"
                className="btn-primary inline-flex items-center gap-2"
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