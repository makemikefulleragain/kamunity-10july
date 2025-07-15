import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function App({ Component, pageProps }: AppProps) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  
  // Don't render reCAPTCHA provider if no valid key is available
  if (!recaptchaKey || recaptchaKey === 'placeholder_key' || recaptchaKey === 'YOUR_RECAPTCHA_KEY') {
    console.warn('reCAPTCHA not configured - forms will not work properly');
    return <Component {...pageProps} />;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      <Component {...pageProps} />
    </GoogleReCaptchaProvider>
  );
} 