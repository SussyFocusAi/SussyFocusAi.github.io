// src/components/sections/Footer.tsx
import React from 'react';
import { Instagram, Twitter, Linkedin, Github, Mail, Heart } from 'lucide-react';
import Image from 'next/image'; // For using your icon.png

export default function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 bg-gray-900 text-white">
      <div className="container mx-auto max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              {/* Replace the F icon with your logo */}
              <div className="w-8 h-8 mr-3">
                <Image src="/icon.png" alt="FocusAI Logo" width={32} height={32} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                FocusAI
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Transform your productivity with AI-powered focus sessions, smart task management, and personalized insights. Stop procrastinating and start achieving your goals.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/focus_aiapp/" className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors duration-200" aria-label="Follow us on Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/focusai" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-500 transition-colors duration-200" aria-label="Follow us on Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/focusai" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors duration-200" aria-label="Connect on LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com/focusai" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-600 transition-colors duration-200" aria-label="View our GitHub">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Legal Links (moved from bottom) */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-400 hover:text-purple-400 transition-colors duration-200" onClick={() => alert('Privacy Policy - Coming Soon!')}>
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-purple-400 transition-colors duration-200" onClick={() => alert('Terms of Service - Coming Soon!')}>
                  Terms of Service
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-purple-400 transition-colors duration-200" onClick={() => alert('Cookie Policy - Coming Soon!')}>
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@focusai.com" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/help" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">Help Center</a>
              </li>
              <li>
                <a href="/docs" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">Documentation</a>
              </li>
              <li>
                <a href="/status" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">System Status</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 FocusAI. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-1 flex items-center justify-center">
            Made with <Heart className="w-3 h-3 mx-1 text-red-500" /> for productivity enthusiasts
          </p>
          <p className="text-gray-500 text-sm italic mt-4">
            "Stop procrastinating. Start achieving. Transform your life."
          </p>
        </div>
      </div>
    </footer>
  );
}
