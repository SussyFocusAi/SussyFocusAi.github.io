// src/components/pages/HomePage.tsx
"use client";
import React, { useState, useEffect } from "react";

// Import all the section components
import HeroSection from "../Index/sections/HeroSection";
import VideoSection from "../Index/sections/VideoSection";
import StatsSection from "../Index/sections/StatsSection";
import FeaturesSection from "../Index/sections/FeaturesSection";
import TestimonialsSection from "../Index/sections/TestimonialsSection";
import TeamSection from "../Index/sections/TeamSection";
import PricingSection from "../Index/sections/PricingSection";
import CTASection from "../Index/sections/CTASection";
import Footer from "../Index/Footer";


interface HomePageProps {
  heroRef: React.RefObject<HTMLDivElement>;
  featuresRef: React.RefObject<HTMLDivElement>;
  teamRef: React.RefObject<HTMLDivElement>;
  pricingRef: React.RefObject<HTMLDivElement>;
  onScrollToSection: (section: string) => void;  // Add this
}

export default function HomePage({ heroRef, featuresRef, teamRef, pricingRef }: HomePageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate stats counter
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev < 3 ? prev + 1 : 0));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen font-sans overflow-x-hidden">
      <HeroSection heroRef={heroRef} isVisible={isVisible} />
      <VideoSection />
      <StatsSection currentStat={currentStat} />
      <FeaturesSection featuresRef={featuresRef} />
      <TestimonialsSection />
      <TeamSection teamRef={teamRef} />
      <PricingSection pricingRef={pricingRef} />
      <CTASection />
      <Footer />
    </main>
  );
}