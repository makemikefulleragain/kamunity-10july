import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [isTabletLandscape, setIsTabletLandscape] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Handle client-side mounting to prevent SSR mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Detect device orientation and size for adaptive navigation
  useEffect(() => {
    if (!isMounted) return;

    const checkOrientation = () => {
      // Only run on client-side
      if (typeof window === 'undefined') return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;
      
      // Tablet landscape: width between 768-1024px and landscape orientation
      setIsTabletLandscape(width >= 768 && width <= 1024 && isLandscape);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, [isMounted]);

  // Touch handling for gesture-based navigation
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isRightSwipe = distance > minSwipeDistance;
    
    // Close menu on right swipe (swipe to dismiss)
    if (isRightSwipe && isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'News', href: '/content' },
    { name: 'Kai & Crew', href: '/kai-crew' },
    { name: 'Contact', href: '/contact' },
    { name: 'Admin', href: '/admin' },
  ];

  const isActive = (path: string) => router.pathname === path;

  // Determine which navigation style to use (SSR-safe)
  const shouldShowDesktopNav = isMounted && (isTabletLandscape || (typeof window !== 'undefined' && window.innerWidth >= 1024));

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <nav className="max-w-ultra mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24 lg:h-32">
          {/* Logo with fluid sizing */}
          <Link href="/" className="flex items-center space-x-2">
            {!logoFailed ? (
              <img
                src="/kamunity-logo.png"
                alt="Kamunity Logo"
                className="h-12 sm:h-16 lg:h-20 w-auto"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <div className="h-12 sm:h-16 lg:h-20 flex items-center text-fluid-2xl lg:text-fluid-4xl font-bold text-indigo-700">
                Kamunity
              </div>
            )}
          </Link>

          {/* Adaptive Navigation - Desktop/Tablet Landscape */}
          <div className="hidden md:flex lg:flex items-center space-x-4 lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 lg:px-4 lg:py-3 rounded-lg text-fluid-sm lg:text-fluid-lg font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-indigo-700 bg-indigo-50'
                    : 'text-gray-700 hover:text-indigo-700 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/welcome"
              className="btn-primary text-fluid-sm lg:text-fluid-lg px-fluid-4 py-fluid-2 lg:px-fluid-6 lg:py-fluid-3"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 sm:p-3 rounded-lg text-gray-700 hover:text-indigo-700 hover:bg-gray-50 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation with Gesture Support */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden py-4 border-t border-gray-100 overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex flex-col space-y-2"
              >
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-fluid-base font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-indigo-700 bg-indigo-50'
                          : 'text-gray-700 hover:text-indigo-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile CTA Button */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="pt-4"
                >
                  <Link
                    href="/welcome"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary block text-center text-fluid-base"
                  >
                    Get Started
                  </Link>
                </motion.div>

                {/* Swipe hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="pt-2 text-center"
                >
                  <p className="text-fluid-xs text-gray-400">
                    Swipe right to close menu
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header; 