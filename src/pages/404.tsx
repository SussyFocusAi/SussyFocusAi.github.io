// pages/404.tsx (or src/pages/404.tsx if using src directory)
import React from 'react';
import { useRouter } from 'next/router';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function Custom404() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-9xl sm:text-[12rem] font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent opacity-20 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Search className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-sm text-gray-500">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
          
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button
              onClick={() => router.push('/')}
              className="text-purple-600 hover:text-purple-700 hover:underline transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-purple-600 hover:text-purple-700 hover:underline transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                const element = document.querySelector('[data-section="features"]');
                if (element) {
                  router.push('/');
                  setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
                } else {
                  router.push('/#features');
                }
              }}
              className="text-purple-600 hover:text-purple-700 hover:underline transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => {
                const element = document.querySelector('[data-section="pricing"]');
                if (element) {
                  router.push('/');
                  setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
                } else {
                  router.push('/#pricing');
                }
              }}
              className="text-purple-600 hover:text-purple-700 hover:underline transition-colors"
            >
              Pricing
            </button>
          </div>
        </div>

        {/* FocusAI Branding */}
        <div className="mt-8">
          <div className="flex items-center justify-center space-x-2 opacity-60">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">F</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              FocusAI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}