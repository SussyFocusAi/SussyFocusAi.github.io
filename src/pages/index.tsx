import React, { useRef, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import { useRouter } from "../hooks/useRouter";

// Import all page components
import HomePage from "../components/pages/home";
import ChatPage from "../components/pages/chat";
import DashboardPage from "../components/pages/dashboard";
import DeadlinesPage from "../components/pages/deadlines";
import AnalyticsPage from "../components/pages/analytics";

export default function App() {
  const { currentPath, navigate } = useRouter();

  // Refs for smooth scrolling on homepage (non-nullable)
  const heroRef = useRef<HTMLDivElement>(null!);
  const featuresRef = useRef<HTMLDivElement>(null!);
  const teamRef = useRef<HTMLDivElement>(null!);
  const pricingRef = useRef<HTMLDivElement>(null!);

  // Scroll helper
  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement>) => {
    elementRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => navigate(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  // Page title
  const getPageTitle = () => {
    switch (currentPath) {
      case "/chat": return "AI Coach - FocusAI";
      case "/dashboard": return "Dashboard - FocusAI";
      case "/deadlines": return "Deadlines - FocusAI";
      case "/analytics": return "Analytics - FocusAI";
      default: return "FocusAI - Stop Procrastinating, Stay Focused";
    }
  };

  // Render page
  const renderCurrentPage = () => {
    switch (currentPath) {
      case "/chat": return <ChatPage />;
      case "/dashboard": return <DashboardPage />;
      case "/deadlines": return <DeadlinesPage />;
      case "/analytics": return <AnalyticsPage />;
      default:
        return (
          <HomePage
            heroRef={heroRef}
            featuresRef={featuresRef}
            teamRef={teamRef}
            pricingRef={pricingRef}
          />
        );
    }
  };

  return (
    <>
      <Head>
        <title>{getPageTitle()}</title>
        <meta
          name="description"
          content="AI-powered productivity platform that helps you stop procrastinating and stay on schedule"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header
          currentPath={currentPath}
          onNavigate={navigate}
          scrollToSection={scrollToSection}
          refs={currentPath === "/" ? { heroRef, featuresRef, teamRef, pricingRef } : undefined}
        />

        <div className="transition-all duration-300 ease-in-out">{renderCurrentPage()}</div>
      </div>
    </>
  );
}
