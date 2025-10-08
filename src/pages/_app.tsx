// src/pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import { useRouter as useCustomRouter } from '../hooks/useRouter';
import { AppProvider } from '../context/AppContext'; // ADD THIS

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const protectedRoutes = ['/dashboard', '/deadlines', '/analytics', '/chat', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => router.pathname.startsWith(route));

  useEffect(() => {
    if (status === 'loading') return;
    
    if (isProtectedRoute && !session) {
      router.push('/');
    }
  }, [session, status, router, isProtectedRoute]);

  if (isProtectedRoute && status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isProtectedRoute && !session) {
    return null;
  }

  return <>{children}</>;
}

export default function MyApp({ 
  Component, 
  pageProps: { session, ...pageProps } 
}: AppProps) {
  const router = useRouter();
  const { navigate } = useCustomRouter();
  
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
      case "/valentine": return "Happy Valentine's Day! 💖";
      case "/404": return "Page Not Found - FocusAI";
      default: return "FocusAI - Stop Procrastinating, Stay Focused";
    }
  };

  const showHeader = router.pathname !== '/404' && router.pathname !== '/valentine';

  return (
    <SessionProvider session={session}>
      <AppProvider> {/* ADD THIS WRAPPER */}
        <Head>
          <title>{getPageTitle()}</title>
          <meta name="description" content="AI-powered productivity platform that helps you stop procrastinating and stay on schedule" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <ProtectedRoute>
          <div className={`min-h-screen ${router.pathname === '/valentine' ? '' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
            {showHeader && (
              <Header
                currentPath={router.pathname}
                onNavigate={navigate}
                scrollToSection={scrollToSection}
                refs={router.pathname === "/" ? { heroRef, featuresRef, teamRef, pricingRef } : undefined}
              />
            )}
            
            <div className="transition-all duration-300 ease-in-out">
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
        </ProtectedRoute>
      </AppProvider> {/* CLOSE WRAPPER */}
    </SessionProvider>
  );
}