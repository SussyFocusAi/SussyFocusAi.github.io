// src/components/sections/HeroSection.tsx - Debug version
import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, CheckCircle } from 'lucide-react';
import Button from '../../Button';

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement>;
  isVisible: boolean;
}

export default function HeroSection({ heroRef, isVisible }: HeroSectionProps) {
  const [email, setEmail] = useState("");

  // Debug logging
  useEffect(() => {
    console.log('🏠 HeroSection mounted');
    console.log('🏠 heroRef received:', heroRef);
    console.log('🏠 heroRef.current:', heroRef.current);
  }, []);

  useEffect(() => {
    if (heroRef.current) {
      console.log('✅ HeroSection ref attached to element:', heroRef.current);
      console.log('✅ Element ID:', heroRef.current.id);
      console.log('✅ Element class:', heroRef.current.className);
    } else {
      console.log('❌ HeroSection ref not attached yet');
    }
  }, [heroRef.current]);

  return (
    <section 
      ref={heroRef} 
      className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 px-4 sm:px-6" 
      id="hero"
    >
      <div className="container mx-auto max-w-7xl">
        <div className={`text-center space-y-6 sm:space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 animate-pulse">
            <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
            Join 67+ users who stopped procrastinating
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight px-2">
            Stop <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">Procrastinating</span>
            <br />
            Start <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">Achieving</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
            Transform your productivity with AI-powered scheduling, personalized coaching, and smart reminders that actually work. No more missed deadlines, no more overwhelm.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-lg mx-auto px-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg transition-all duration-300 focus:scale-105"
            />
            <Button className="whitespace-nowrap transform transition-all duration-300 hover:scale-105 active:scale-95">
              Start Free Trial <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
            <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-500" />
            No credit card required • 14-day free trial
          </div>
        </div>
      </div>
      
      {/* Floating Elements - Hidden on mobile */}
      <div className="hidden lg:block absolute top-1/4 left-10 w-16 lg:w-20 h-16 lg:h-20 bg-purple-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0s'}}></div>
      <div className="hidden lg:block absolute top-1/3 right-20 w-12 lg:w-16 h-12 lg:h-16 bg-blue-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2s'}}></div>
      <div className="hidden lg:block absolute bottom-1/4 left-1/4 w-8 lg:w-12 h-8 lg:h-12 bg-indigo-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '4s'}}></div>
    </section>
  );
}