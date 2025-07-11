import { useEffect } from 'react';

declare global {
  interface Window {
    $crisp: any;
    CRISP_WEBSITE_ID: string;
  }
}

const CrispChat: React.FC = () => {
  useEffect(() => {
    // Only load Crisp if we have a valid website ID
    const crispId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
    
    if (!crispId || crispId === 'YOUR_CRISP_ID_HERE') {
      console.log('Crisp Chat: No valid website ID provided, skipping initialization');
      return;
    }
    
    // Set Crisp website ID from environment variable
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = crispId;
    
    // Load Crisp chat script
    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);
    
    // Configure Crisp appearance
    window.$crisp.push(['config', 'color:theme', 'gold']);
    window.$crisp.push(['config', 'color:button', '#fbbf24']);
    window.$crisp.push(['config', 'position:reverse', false]);
    
    // Set chat nickname for Bunnykat
    window.$crisp.push(['set', 'session:segments', [['bunnykat-kai']]]);
    
    // Custom chat bubble behavior
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      if (scrolled && window.$crisp) {
        window.$crisp.push(['do', 'chat:show']);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return null;
};

export default CrispChat; 