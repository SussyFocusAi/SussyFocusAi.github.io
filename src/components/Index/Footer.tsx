// src/components/sections/Footer.tsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-6 bg-gray-900 text-white">
      <div className="container mx-auto max-w-7xl text-center">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
            <span className="text-white font-bold text-xs sm:text-sm">F</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            FocusAI
          </span>
        </div>
        <p className="text-gray-400 text-sm sm:text-base">© 2025 FocusAI. All rights reserved. Made with ❤️ for productivity enthusiasts.</p>
        <p className="text-gray-500 text-xs sm:text-sm mt-2">Stop procrastinating. Start achieving. Transform your life.</p>
      </div>
    </footer>
  );
}