import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('kamunity-cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('kamunity-cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('kamunity-cookie-consent', 'declined');
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-lavender-200 p-6 md:flex md:items-center md:justify-between">
              <div className="mb-4 md:mb-0 md:mr-6">
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                  🍪 Cookie Notice
                </h3>
                <p className="text-sm text-charcoal">
                  We use cookies to enhance your experience on Kamunity. By continuing to use our site, 
                  you agree to our use of cookies for analytics and personalization.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAccept}
                  className="btn-primary text-sm"
                  aria-label="Accept cookies"
                >
                  Accept All
                </button>
                <button
                  onClick={handleDecline}
                  className="px-6 py-3 rounded-2xl font-medium text-sm text-indigo-600 bg-lavender-100 hover:bg-lavender-200 transition-all duration-300"
                  aria-label="Decline cookies"
                >
                  Essential Only
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent; 