import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import EmailCapture from '@/components/EmailCapture';

// Character variations data
const KAI_VARIATIONS = [
  {
    id: 'original',
    name: 'Kai',
    title: 'The Community Guide',
    image: '/images/home-hero3.png',
    background: 'from-indigo-100 via-lavender-100 to-peach-100',
    description: 'Our original community guide, here to help you navigate and connect with fellow Kamunity members.',
    personality: 'Welcoming, wise, and always ready to lend a helping hand.'
  },
  {
    id: 'explorer',
    name: 'Explorer Kai',
    title: 'The Content Discoverer',
    image: '/images/content-hero-new.png',
    background: 'from-emerald-100 via-teal-100 to-cyan-100',
    description: 'When there are new stories and content to explore, Explorer Kai is your perfect companion.',
    personality: 'Curious, adventurous, and always finding hidden gems in our community.'
  },
  {
    id: 'connector',
    name: 'Connector Kai',
    title: 'The Relationship Builder',
    image: '/character-mascot.png',
    background: 'from-rose-100 via-pink-100 to-purple-100',
    description: 'Specializing in bringing people together and fostering meaningful connections.',
    personality: 'Empathetic, intuitive, and passionate about community harmony.'
  }
];

// Crew members data
const CREW_MEMBERS = [
  {
    id: 'luna',
    name: 'Luna',
    title: 'The Flow Keeper',
    role: 'Planning & Organization',
    image: '/character-mascot.png',
    background: 'from-blue-100 via-indigo-100 to-purple-100',
    description: 'Luna ensures everything flows smoothly in our community. From event planning to keeping discussions on track, she\'s the organizational heart that keeps Kamunity humming.',
    personality: 'Methodical, reliable, and surprisingly creative when it comes to solving complex community challenges.',
    favoriteQuote: '"A community is like a garden - it thrives with careful tending and the right environment."',
    specialties: ['Event Coordination', 'Workflow Optimization', 'Community Guidelines']
  },
  {
    id: 'pixel',
    name: 'Pixel',
    title: 'The Community Whisperer', 
    role: 'Support & Connection',
    image: '/character-mascot.png',
    background: 'from-green-100 via-emerald-100 to-teal-100',
    description: 'Pixel has an uncanny ability to sense when community members need support or encouragement. They\'re often the first to welcome newcomers and help resolve conflicts with grace.',
    personality: 'Intuitive, compassionate, and always knows exactly what to say to make someone feel heard and valued.',
    favoriteQuote: '"Every person has a story worth sharing and a perspective worth hearing."',
    specialties: ['Conflict Resolution', 'Member Support', 'Inclusive Communication']
  },
  {
    id: 'spark',
    name: 'Spark',
    title: 'The Catalyst',
    role: 'Innovation & Growth',
    image: '/character-mascot.png',
    background: 'from-orange-100 via-amber-100 to-yellow-100',
    description: 'When the community needs fresh ideas or a burst of creative energy, Spark is there to ignite new possibilities. They turn "what if" into "let\'s do it" with infectious enthusiasm.',
    personality: 'Energetic, visionary, and always three steps ahead with ideas that bring the community to new heights.',
    favoriteQuote: '"The best communities aren\'t built on what they are, but on what they dare to become."',
    specialties: ['Innovation Labs', 'Growth Strategy', 'Creative Collaboration']
  }
];

export default function KaiCrew() {
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);
  const [selectedCrewMember, setSelectedCrewMember] = useState<string | null>(null);

  return (
    <Layout title="Kai & Crew - Kamunity">
      <div className="min-h-screen bg-white">
        {/* Hero Section - Content Page Style */}
        <section className="relative bg-gradient-to-br from-indigo-50 via-lavender-50 to-peach-50 py-fluid-16 px-4 sm:px-6 lg:px-12 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-8 -right-8 lg:-top-16 lg:-right-16 w-16 h-16 lg:w-32 lg:h-32 bg-gradient-to-br from-gold-300/20 to-gold-500/20 rounded-full blur-xl" />
            <div className="absolute top-1/2 -left-4 lg:-left-8 w-12 h-12 lg:w-24 lg:h-24 bg-gradient-to-br from-peach-300/20 to-peach-500/20 rounded-full blur-lg" />
            <div className="absolute bottom-8 right-1/4 lg:bottom-16 w-10 h-10 lg:w-20 lg:h-20 bg-gradient-to-br from-lavender-300/20 to-lavender-500/20 rounded-full blur-lg" />
          </div>
          
          <div className="max-w-ultra mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center"
            >
              
              {/* Character Image - Right 1/3 */}
              <div className="lg:col-span-1 lg:order-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="relative w-full max-w-md mx-auto"
                >
                  {/* Kai Character Container */}
                  <div className="aspect-square lg:aspect-4/3 xl:aspect-square bg-gradient-to-br from-indigo-100 via-lavender-100 to-peach-100 rounded-2xl lg:rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white/50 backdrop-blur-sm relative overflow-hidden">
                    <div className="w-full h-full p-3 lg:p-6">
                      <img 
                        src="/images/home-hero3.png" 
                        alt="Kai, our community mascot" 
                        className="w-full h-full object-contain rounded-xl lg:rounded-2xl"
                        style={{
                          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                        }}
                        loading="eager"
                      />
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -bottom-3 -left-3 lg:-bottom-6 lg:-left-6 w-9 h-9 lg:w-12 lg:h-12 bg-gradient-to-br from-peach-400 to-peach-500 rounded-full opacity-80" />
                  <div className="absolute top-1/4 -left-2 lg:-left-3 w-6 h-6 lg:w-9 lg:h-9 bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-full opacity-60" />
                </motion.div>
              </div>

              {/* Text Content - Left 2/3 */}
              <div className="lg:col-span-2 lg:order-1">
                <h1 className="text-fluid-4xl lg:text-fluid-6xl font-bold text-indigo-700 mb-fluid-6">
                  Meet Kai & Crew
                </h1>
                
                {/* Kai Introduction */}
                <p className="text-fluid-lg lg:text-fluid-xl text-charcoal leading-relaxed mb-fluid-6 max-w-3xl">
                  <span className="text-amber-600 font-medium">Kai</span> is more than just our mascot – they're the living spirit of what Kamunity represents. As <span className="text-indigo-600 font-medium">your community guide</span>, Kai embodies the ancient concept of <em>kami-kai</em> (神会) – a sacred gathering where purpose meets passion.
                </p>
                
                <p className="text-fluid-lg lg:text-fluid-xl text-charcoal leading-relaxed mb-fluid-8 max-w-3xl">
                  Whether you need a <span className="text-indigo-600 font-medium">friendly introduction</span>, help finding your tribe, or just someone who gets what community really means, Kai is here to <span className="text-amber-600 font-medium">keep the flow</span> and remind us that the best communities happen when good people come together with shared intention.
                </p>
                
                {/* Key Message */}
                <p className="text-fluid-xl lg:text-fluid-2xl font-semibold text-indigo-700 leading-relaxed max-w-4xl">
                  Think of Kai as <span className="text-amber-600">your backstage pass to belonging</span> – here to help you find your place, make your mark, and feel at home in our growing community.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Kai Variations Section */}
        <section className="py-fluid-16 px-4 sm:px-6 lg:px-12 bg-gray-50">
          <div className="max-w-ultra mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-fluid-3xl lg:text-fluid-5xl font-bold text-indigo-700 text-center mb-fluid-6">
                Different Sides of Kai
              </h2>
              <p className="text-center text-fluid-base lg:text-fluid-lg text-charcoal mb-fluid-12 max-w-3xl mx-auto">
                Kai adapts to different community moments and moods. Click on any version to learn more about their unique personality.
              </p>
              
              {/* Kai Variations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-fluid-8">
                {KAI_VARIATIONS.map((variation, index) => (
                  <motion.div
                    key={variation.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col"
                  >
                    <div 
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-indigo-200 cursor-pointer"
                      onClick={() => setSelectedVariation(selectedVariation === variation.id ? null : variation.id)}
                    >
                      {/* Character Image */}
                      <div className={`aspect-square bg-gradient-to-br ${variation.background} rounded-xl mb-4 flex items-center justify-center p-4`}>
                        <img 
                          src={variation.image} 
                          alt={variation.name}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                      
                      {/* Character Info */}
                      <h3 className="text-fluid-xl font-semibold text-indigo-700 mb-2">{variation.name}</h3>
                      <p className="text-fluid-sm font-medium text-amber-600 mb-3">{variation.title}</p>
                      <p className="text-fluid-sm text-charcoal leading-relaxed mb-4">{variation.description}</p>
                      
                      {/* Click to find out more button */}
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 opacity-70 hover:opacity-100">
                        Click to find out more
                      </button>
                    </div>

                    {/* Individual Card Expanded Content - Appears directly below each card */}
                    <AnimatePresence>
                      {selectedVariation === variation.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden mt-4"
                        >
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="bg-gradient-to-br from-indigo-50 to-lavender-50 rounded-xl shadow-xl p-4 lg:p-6 border-2 border-indigo-200"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="text-fluid-lg lg:text-fluid-xl font-semibold text-indigo-700">
                                {variation.name}: {variation.title}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedVariation(null);
                                }}
                                className="text-gray-500 hover:text-gray-700 p-1 transition-colors flex-shrink-0 ml-2"
                                aria-label="Close details"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-fluid-sm lg:text-fluid-base text-charcoal leading-relaxed">
                              <strong>Personality:</strong> {variation.personality}
                            </p>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Crew Section */}
        <section className="py-fluid-16 px-4 sm:px-6 lg:px-12 bg-white">
          <div className="max-w-ultra mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-fluid-3xl lg:text-fluid-5xl font-bold text-indigo-700 text-center mb-fluid-6">
                Kai's Crew
              </h2>
              <p className="text-center text-fluid-base lg:text-fluid-lg text-charcoal mb-fluid-12 max-w-3xl mx-auto">
                Meet the specialized team members who help Kai keep our community thriving. Each brings their own expertise and personality to make Kamunity the best it can be.
              </p>
              
              {/* Crew Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {CREW_MEMBERS.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col"
                  >
                    <div 
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 lg:p-8 border-2 border-transparent hover:border-indigo-200 h-full cursor-pointer group"
                      onClick={() => setSelectedCrewMember(selectedCrewMember === member.id ? null : member.id)}
                    >
                      {/* Member Image */}
                      <div className={`aspect-square bg-gradient-to-br ${member.background} rounded-xl mb-6 flex items-center justify-center p-4 w-32 h-32 mx-auto`}>
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      {/* Member Info */}
                      <div className="text-center">
                        <h3 className="text-fluid-2xl font-bold text-indigo-700 mb-2">{member.name}</h3>
                        <p className="text-fluid-lg font-semibold text-amber-600 mb-2">{member.title}</p>
                        <p className="text-fluid-sm font-medium text-gray-600 mb-4">{member.role}</p>
                        <p className="text-fluid-sm text-charcoal leading-relaxed mb-4">{member.description}</p>
                        
                        {/* Click to find out more button */}
                        <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 opacity-70 hover:opacity-100">
                          Click to find out more
                        </button>
                      </div>
                    </div>

                    {/* Individual Crew Card Expanded Content - Appears directly below each card */}
                    <AnimatePresence>
                      {selectedCrewMember === member.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden mt-4"
                        >
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="bg-gradient-to-br from-indigo-50 to-lavender-50 rounded-xl shadow-xl p-4 lg:p-6 border-2 border-indigo-200"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <h4 className="text-fluid-lg lg:text-fluid-xl font-bold text-indigo-700">
                                {member.name} - {member.title}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCrewMember(null);
                                }}
                                className="text-gray-500 hover:text-gray-700 p-1 transition-colors flex-shrink-0 ml-2"
                                aria-label="Close details"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h5 className="text-fluid-sm font-semibold text-amber-600 mb-2">Personality</h5>
                                <p className="text-fluid-xs lg:text-fluid-sm text-charcoal leading-relaxed">
                                  {member.personality}
                                </p>
                              </div>
                              <div>
                                <h5 className="text-fluid-sm font-semibold text-amber-600 mb-2">Favorite Quote</h5>
                                <blockquote className="text-fluid-xs lg:text-fluid-sm text-indigo-700 italic leading-relaxed">
                                  {member.favoriteQuote}
                                </blockquote>
                              </div>
                              <div>
                                <h5 className="text-fluid-sm font-semibold text-amber-600 mb-2">Specialties</h5>
                                <ul className="space-y-1">
                                  {member.specialties.map((specialty, idx) => (
                                    <li key={idx} className="flex items-center text-fluid-xs lg:text-fluid-sm text-charcoal">
                                      <svg className="w-3 h-3 text-indigo-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                      {specialty}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
              Ready to Join the Community?
            </h2>
            <p className="text-fluid-base lg:text-fluid-lg text-charcoal mb-fluid-8 max-w-2xl mx-auto">
              Kai and the crew are excited to welcome you to Kamunity. Whether you're here to share, learn, or just connect with amazing people, there's a place for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <EmailCapture source="about" buttonText="Join Kamunity" className="w-full sm:w-auto" />
              <Link
                href="/"
                className="btn-secondary inline-flex items-center gap-2 text-fluid-base lg:text-fluid-lg px-fluid-6 py-fluid-3"
              >
                <span>Explore Our Community</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
} 