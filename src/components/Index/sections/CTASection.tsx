// src/components/sections/CTASection.tsx
import React, { useState } from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';
import Button from '../../Button';

export default function CTASection() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="space-y-6 sm:space-y-8">
          <TrendingUp className="w-12 sm:w-16 h-12 sm:h-16 mx-auto text-purple-300 animate-bounce" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">Stop Procrastinating</span>?
          </h2>
          <p className="text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto px-4">
            Join thousands of students and professionals who've transformed their productivity and achieved their biggest goals with FocusAI
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 focus:scale-105"
            />
            <Button variant="white" className="whitespace-nowrap font-semibold transform transition-all duration-300 hover:scale-105 active:scale-95">
              Start Your Journey <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
            </Button>
          </div>
          <div className="text-xs sm:text-sm text-purple-200">
            ✨ 14-day free trial • No credit card required • Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
}