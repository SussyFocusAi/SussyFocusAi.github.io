// src/pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { useRouter } from 'next/router';
import { useRef } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import { useRouter as useCustomRouter } from '../hooks/useRouter';

export default function MyApp({ 
  Component, 
  pageProps: { session, ...pageProps } 
}: AppProps) {
  const router = useRouter();
  const { navigate } = useCustomRouter();
  
  // Create refs for homepage scrolling
  const heroRef = useRef<HTMLDivElement>(null!);
  const featuresRef = useRef<HTMLDivElement>(null!);
  const teamRef = useRef<HTMLDivElement>(null!);
  const pricingRef = useRef<HTMLDivElement>(null!);

  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement>) => {
    elementRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getPageTitle = () => {
    switch (router.pathname) {
      case "/chat": return "AI Coach - FocusAI";
      case "/dashboard": return "Dashboard - FocusAI";
      case "/deadlines": return "Deadlines - FocusAI";
      case "/analytics": return "Analytics - FocusAI";
      case "/404": return "Page Not Found - FocusAI";
      default: return "FocusAI - Stop Procrastinating, Stay Focused";
    }
  };

  // Pages that shouldn't show the header
  const showHeader = router.pathname !== '/404';

  return (
    <SessionProvider session={session}>
      <Head>
        <title>{getPageTitle()}</title>
        <meta name="description" content="AI-powered productivity platform that helps you stop procrastinating and stay on schedule" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Only show Header if NOT on 404 page */}
        {showHeader && (
          <Header
            currentPath={router.pathname}
            onNavigate={navigate}
            scrollToSection={scrollToSection}
            refs={router.pathname === "/" ? { heroRef, featuresRef, teamRef, pricingRef } : undefined}
          />
        )}
        
        <div className="transition-all duration-300 ease-in-out">
          {/* Pass refs to HomePage only */}
          {router.pathname === "/" ? (
            <Component 
              {...pageProps} 
              heroRef={heroRef}
              featuresRef={featuresRef}
              teamRef={teamRef}
              pricingRef={pricingRef}
            />
          ) : (
            <Component {...pageProps} />
          )}
        </div>
      </div>

      <SpeedInsights />
      <Analytics />
    </SessionProvider>
  );
}