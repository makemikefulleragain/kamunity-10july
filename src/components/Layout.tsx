import React from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import CrispChat from './CrispChat';
import CookieConsent from './CookieConsent';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Kamunity - Community begins with one spark',
  description = 'Join Kamunity to be part of something bigger. A community-driven platform fostering connection, growth, and positive change.',
  showHeader = true,
  showFooter = true
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL} />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#4f46e5" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        {showHeader && <Header />}
        <main className="flex-1">
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
      
      <CrispChat />
      <CookieConsent />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            className: 'toast-success border-2',
            iconTheme: {
              primary: '#f59e0b',
              secondary: '#fff',
            },
          },
          error: {
            className: 'toast-error border-2',
            iconTheme: {
              primary: '#f97316',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
};

export default Layout; 