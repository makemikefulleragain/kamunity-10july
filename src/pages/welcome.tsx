import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Welcome() {
  return (
    <Layout title="Welcome to Kamunity" showHeader={false} showFooter={false}>
      <div className="min-h-screen gradient-welcome flex items-center justify-center relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="ellipse-decoration w-96 h-96 -top-48 -left-48 animate-float" />
          <div className="ellipse-decoration w-64 h-64 top-1/3 right-1/4 animate-float" style={{ animationDelay: '2s' }} />
          <div className="ellipse-decoration w-80 h-80 bottom-0 right-0 animate-float" style={{ animationDelay: '4s' }} />
        </div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-6 max-w-3xl mx-auto relative z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-indigo-700 mb-6"
          >
            Ready to join something bigger?
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl italic text-gold-600 mb-12"
          >
            "Community begins with one spark."
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl hover:shadow-orange-300/20 hover:scale-105 group"
            >
              <span>Want to know more?</span>
              <svg 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Bottom decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
              fill="white"
              fillOpacity="0.5"
            />
          </svg>
        </div>
      </div>
    </Layout>
  );
} 