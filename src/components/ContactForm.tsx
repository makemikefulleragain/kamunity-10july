import { useState, useCallback, useEffect } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { validateEmail } from '@/lib/utils';

interface ContactFormProps {
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<{
    screenWidth: number;
    screenHeight: number;
  } | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Collect device information on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDeviceInfo({
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      });
    }
  }, []);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (!formData.name.trim() || formData.name.length < 2) {
      toast.error('Please enter your full name (at least 2 characters)');
      return false;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (!formData.subject.trim() || formData.subject.length < 5) {
      toast.error('Please enter a subject (at least 5 characters)');
      return false;
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      toast.error('Please enter your message (at least 10 characters)');
      return false;
    }

    if (formData.message.length > 2000) {
      toast.error('Message is too long (maximum 2000 characters)');
      return false;
    }

    return true;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!executeRecaptcha) {
      toast.error('reCAPTCHA not loaded');
      return;
    }

    setIsLoading(true);

    try {
      // Get reCAPTCHA token
      const token = await executeRecaptcha('contact_form');

      // Use Netlify Function in production, API route in development
      const endpoint = process.env.NODE_ENV === 'production' 
        ? '/.netlify/functions/contact' 
        : '/api/contact';

      // Prepare submission data
      const submissionData = {
        ...formData,
        recaptchaToken: token,
        screenWidth: deviceInfo?.screenWidth,
        screenHeight: deviceInfo?.screenHeight,
      };

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
        toast.success('Thank you for your message! We\'ll get back to you soon.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Track successful contact form submission
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'contact_form_submit', {
            event_category: 'engagement',
            event_label: formData.subject,
            value: 1
          });
        }
      } else {
        toast.error(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Unable to send your message. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, executeRecaptcha, deviceInfo, validateForm]);

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-indigo-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="input w-full"
            required
            disabled={isLoading}
            maxLength={100}
            aria-describedby="name-help"
          />
          <p id="name-help" className="text-xs text-gray-500 mt-1">
            At least 2 characters required
          </p>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-indigo-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            className="input w-full"
            required
            disabled={isLoading}
            aria-describedby="email-help"
          />
          <p id="email-help" className="text-xs text-gray-500 mt-1">
            We'll use this to respond to your message
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-indigo-700 mb-2">
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          placeholder="What's this about?"
          className="input w-full"
          required
          disabled={isLoading}
          maxLength={200}
          aria-describedby="subject-help"
        />
        <p id="subject-help" className="text-xs text-gray-500 mt-1">
          Brief summary of your message (5-200 characters)
        </p>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-indigo-700 mb-2">
          Your Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Tell us what's on your mind..."
          rows={6}
          className="input w-full resize-y"
          required
          disabled={isLoading}
          maxLength={2000}
          aria-describedby="message-help"
        />
        <div className="flex justify-between items-center mt-1">
          <p id="message-help" className="text-xs text-gray-500">
            Detailed message (10-2000 characters)
          </p>
          <span className="text-xs text-gray-400">
            {formData.message.length}/2000
          </span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className={`btn-primary ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            <>
              Send Message
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </>
          )}
        </button>
      </div>

      <div className="text-xs text-gray-500 mt-4">
        <p>
          * Required fields. By submitting this form, you agree to our privacy policy. 
          Your information will only be used to respond to your inquiry.
        </p>
      </div>
    </motion.form>
  );
};

export default ContactForm; 