import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { validateEmail } from '@/lib/utils';

interface EmailCaptureProps {
  source: 'home' | 'about' | 'welcome' | 'newsletter';
  buttonText?: string;
  className?: string;
}

const EmailCapture: React.FC<EmailCaptureProps> = ({ 
  source, 
  buttonText = 'Want to know more?',
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<{
    screenWidth: number;
    screenHeight: number;
  } | null>(null);

  // Collect device information on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDeviceInfo({
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      });
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Use Netlify Function in production, API route in development
      const endpoint = process.env.NODE_ENV === 'production' 
        ? '/.netlify/functions/subscribe' 
        : '/api/subscribe';

      // Prepare submission data with device information (no reCAPTCHA)
      const submissionData = {
        email,
        source,
        recaptchaToken: 'no-recaptcha', // Placeholder for backend compatibility
        timestamp: new Date().toISOString(),
        screenWidth: deviceInfo?.screenWidth,
        screenHeight: deviceInfo?.screenHeight,
      };

      console.log('Submitting to:', endpoint);

      // Submit to API
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Thank you! Check your email for a welcome message.');
        setEmail('');
        
        // Track successful subscription for analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'subscription', {
            event_category: 'engagement',
            event_label: source,
            value: 1
          });
        }
      } else {
        console.error('Subscription failed:', data);
        toast.error(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Unable to process your request. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [email, source, deviceInfo]);

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`flex flex-col sm:flex-row gap-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="input flex-1"
        required
        disabled={isLoading}
        aria-label="Email address"
      />
      <button
        type="submit"
        className={`btn-primary ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg hover:animate-glow'}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : buttonText}
      </button>
    </motion.form>
  );
};

export default EmailCapture; 