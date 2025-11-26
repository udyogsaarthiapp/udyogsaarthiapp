import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://udyogsaarthi.gov.in'),
  title: 'Udyog Saarthi - Accessible Job Portal',
  description: 'Accessible job and training portal designed for people with disabilities. Find inclusive employment opportunities and skill development programs.',
  keywords: 'accessibility, jobs, disabilities, inclusive employment, training, career development',
  authors: [{ name: 'Udyog Saarthi Team' }],
  creator: 'Government of India',
  publisher: 'Ministry of Social Justice and Empowerment',
  robots: 'index, follow',
  
  // Open Graph / Facebook
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://udyogsaarthi.gov.in',
    title: 'Udyog Saarthi - Accessible Job Portal',
    description: 'Find accessible job opportunities and training programs designed for people with disabilities.',
    siteName: 'Udyog Saarthi',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Udyog Saarthi - Accessible Job Portal',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    site: '@UdyogSaarthi',
    creator: '@UdyogSaarthi',
    title: 'Udyog Saarthi - Accessible Job Portal',
    description: 'Find accessible job opportunities and training programs designed for people with disabilities.',
    images: ['/twitter-image.png'],
  },
  
  // Additional meta tags
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Udyog Saarthi',
    'application-name': 'Udyog Saarthi',
    'msapplication-TileColor': '#2563eb',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical fonts */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* PWA meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Udyog Saarthi" />
        <meta name="apple-mobile-web-app-title" content="Udyog Saarthi" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        
        {/* Structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Udyog Saarthi",
              "description": "Accessible job and training portal for people with disabilities",
              "url": "https://udyogsaarthi.gov.in",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
              },
              "creator": {
                "@type": "Organization",
                "name": "Government of India",
                "url": "https://www.india.gov.in"
              },
              "accessibility": {
                "@type": "Thing",
                "name": "WCAG 2.1 AA Compliant",
                "description": "Fully accessible web application following WCAG 2.1 AA standards"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Skip to content link for keyboard users */}
        <a
          href="#main-content"
          className="skip-to-content focus:left-6 focus:top-6"
          tabIndex={0}
        >
          Skip to main content
        </a>
        
        {/* Main application */}
        <div id="root" className="min-h-screen bg-gray-50">
          <main id="main-content" role="main" tabIndex={-1}>
            {children}
          </main>
        </div>
        
        {/* ARIA live region for dynamic announcements */}
        <div
          id="aria-live-region"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        ></div>
        
        {/* Emergency accessibility notice */}
        <noscript>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fbbf24',
            color: '#000',
            padding: '1rem',
            textAlign: 'center',
            zIndex: 9999
          }}>
            This application requires JavaScript for optimal accessibility features. 
            Please enable JavaScript or contact support at 1800-11-7878 for assistance.
          </div>
        </noscript>
      </body>
    </html>
  );
}