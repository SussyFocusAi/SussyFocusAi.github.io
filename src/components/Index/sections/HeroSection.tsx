import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, CheckCircle } from 'lucide-react';

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement>;
  isVisible: boolean;
}

export default function HeroSection({ heroRef, isVisible }: HeroSectionProps) {
  const [email, setEmail] = useState("");

  return (
    <>
      <style jsx>{`
        @keyframes float1 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(30px, -40px) rotate(90deg);
          }
          50% {
            transform: translate(-20px, -80px) rotate(180deg);
          }
          75% {
            transform: translate(-50px, -40px) rotate(270deg);
          }
        }

        @keyframes float2 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(-40px, 60px) rotate(120deg) scale(1.2);
          }
          66% {
            transform: translate(50px, 30px) rotate(240deg) scale(0.9);
          }
        }

        @keyframes float3 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          20% {
            transform: translate(40px, 30px) rotate(72deg);
          }
          40% {
            transform: translate(20px, -50px) rotate(144deg);
          }
          60% {
            transform: translate(-30px, -30px) rotate(216deg);
          }
          80% {
            transform: translate(-40px, 40px) rotate(288deg);
          }
        }

        @keyframes float4 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(-35px, -45px) scale(1.3);
          }
          50% {
            transform: translate(45px, -25px) scale(0.8);
          }
          75% {
            transform: translate(25px, 55px) scale(1.1);
          }
        }

        @keyframes float5 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          30% {
            transform: translate(50px, -30px) rotate(-90deg);
          }
          60% {
            transform: translate(-30px, 50px) rotate(-180deg);
          }
        }

        @keyframes float6 {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          50% {
            transform: translate(-60px, -60px) scale(1.5) rotate(180deg);
          }
        }

        .float-1 {
          animation: float1 20s ease-in-out infinite;
        }

        .float-2 {
          animation: float2 18s ease-in-out infinite;
        }

        .float-3 {
          animation: float3 25s ease-in-out infinite;
        }

        .float-4 {
          animation: float4 22s ease-in-out infinite;
        }

        .float-5 {
          animation: float5 15s ease-in-out infinite;
        }

        .float-6 {
          animation: float6 28s ease-in-out infinite;
        }
      `}</style>

      <section 
        ref={heroRef} 
        className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 px-4 sm:px-6" 
        id="hero"
      >
        <div className="container mx-auto max-w-7xl relative z-10">
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
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium whitespace-nowrap transform hover:scale-105 active:scale-95 flex items-center justify-center">
                Start Free Trial <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
              <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-500" />
              No credit card required • 14-day free trial
            </div>
          </div>
        </div>
        
        {/* Floating Elements with Random Movement */}
        <div className="hidden lg:block absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-30 blur-xl float-1"></div>
        <div className="hidden lg:block absolute top-32 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-25 blur-lg float-2"></div>
        <div className="hidden lg:block absolute bottom-32 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-20 blur-md float-3"></div>
        <div className="hidden lg:block absolute top-1/2 right-1/4 w-24 h-24 bg-pink-200 rounded-full opacity-20 blur-xl float-4"></div>
        <div className="hidden lg:block absolute bottom-20 right-32 w-14 h-14 bg-purple-300 rounded-full opacity-25 blur-lg float-5"></div>
        <div className="hidden lg:block absolute top-40 left-1/3 w-18 h-18 bg-cyan-200 rounded-full opacity-20 blur-md float-6"></div>
        
        {/* Additional smaller floating particles */}
        <div className="hidden lg:block absolute top-1/4 right-1/3 w-8 h-8 bg-purple-100 rounded-full opacity-30 blur-sm float-1" style={{animationDelay: '3s'}}></div>
        <div className="hidden lg:block absolute bottom-1/3 left-1/2 w-10 h-10 bg-blue-100 rounded-full opacity-25 blur-sm float-3" style={{animationDelay: '5s'}}></div>
        <div className="hidden lg:block absolute top-2/3 right-1/2 w-6 h-6 bg-indigo-100 rounded-full opacity-30 blur-sm float-5" style={{animationDelay: '7s'}}></div>
      </section>
    </>
  );
}