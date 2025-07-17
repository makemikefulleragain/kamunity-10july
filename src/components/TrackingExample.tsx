import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  trackClick, 
  trackFormEvent, 
  trackExternalLink, 
  trackDownload,
  trackVideo,
  withClickTracking 
} from '@/utils/analytics';
import { useScrollTracking } from '@/utils/scrollTracking';
import ClickTracker from './ClickTracker';

const TrackingExample: React.FC = () => {
  const router = useRouter();
  
  // Automatically track scroll depth on this page
  useScrollTracking('tracking_example');

  const handleButtonClick = () => {
    trackClick('button', 'cta_button', {
      position: 'hero_section',
      variant: 'primary'
    });
  };

  const handleExternalLinkClick = (url: string, linkText: string) => {
    trackExternalLink(url, linkText);
  };

  const handleDownload = (fileName: string) => {
    trackDownload(fileName, fileName.split('.').pop() || 'unknown');
  };

  const handleVideoPlay = () => {
    trackVideo('play', 'hero_video');
  };

  const handleFormStart = () => {
    trackFormEvent('newsletter', 'start');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Analytics Tracking Examples
      </h1>

      {/* 1. Basic Click Tracking */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Basic Click Tracking</h2>
        
        <button
          onClick={handleButtonClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Track This Click
        </button>

        {/* Using the withClickTracking utility */}
        <button
          onClick={withClickTracking('button', 'utility_button', () => {
            console.log('Additional action after tracking');
          })}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-4"
        >
          Track with Utility
        </button>
      </section>

      {/* 2. Click Tracker Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Click Tracker Component</h2>
        
        <ClickTracker
          elementType="card"
          elementName="product_card"
          className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
          additionalData={{ product_id: '123', category: 'electronics' }}
          onClick={() => console.log('Card clicked!')}
        >
          <div>
            <h3 className="font-semibold">Product Card</h3>
            <p className="text-gray-600">Click anywhere on this card to track the interaction</p>
          </div>
        </ClickTracker>
      </section>

      {/* 3. External Link Tracking */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. External Link Tracking</h2>
        
        <a
          href="https://google.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleExternalLinkClick('https://google.com', 'Google Search')}
          className="text-blue-600 hover:underline"
        >
          Visit Google (tracked external link)
        </a>
      </section>

      {/* 4. Download Tracking */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Download Tracking</h2>
        
        <button
          onClick={() => handleDownload('user-guide.pdf')}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Download PDF (tracked)
        </button>
      </section>

      {/* 5. Video Interaction Tracking */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">5. Video Interaction Tracking</h2>
        
        <div className="relative">
          <video
            controls
            onPlay={handleVideoPlay}
            className="w-full max-w-md"
          >
            <source src="/videos/sample.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* 6. Form Tracking */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">6. Form Interaction Tracking</h2>
        
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            onFocus={handleFormStart}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              trackFormEvent('newsletter', 'submit', {
                email_provided: true,
                form_location: 'tracking_example'
              });
            }}
            className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Subscribe (tracked)
          </button>
        </form>
      </section>

      {/* 7. Motion Component with Tracking */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">7. Animated Component with Tracking</h2>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => trackClick('animated_card', 'hover_card')}
          className="p-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg cursor-pointer"
        >
          <h3 className="text-xl font-semibold">Animated Tracked Card</h3>
          <p>Hover and click to see animation + tracking</p>
        </motion.div>
      </section>

      {/* 8. Navigation Tracking */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">8. Navigation Tracking</h2>
        
        <div className="space-x-4">
          <button
            onClick={() => {
              trackClick('navigation', 'home_button');
              router.push('/');
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Go to Home (tracked navigation)
          </button>
          
          <button
            onClick={() => {
              trackClick('navigation', 'about_button');
              router.push('/about');
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Go to About (tracked navigation)
          </button>
        </div>
      </section>

      {/* Info about automatic tracking */}
      <section className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Automatic Tracking Features
        </h3>
        <ul className="text-blue-800 space-y-1">
          <li>• <strong>Page Views:</strong> Automatically tracked on route changes</li>
          <li>• <strong>Scroll Depth:</strong> Tracks 25%, 50%, 75%, 100% milestones</li>
          <li>• <strong>Form Events:</strong> Enhanced tracking in EmailCapture and ContactForm</li>
          <li>• <strong>Error Tracking:</strong> Automatic error event tracking</li>
        </ul>
      </section>
    </div>
  );
};

export default TrackingExample; 