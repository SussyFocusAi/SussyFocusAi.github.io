// src/components/sections/Footer.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Github, Mail, Heart, Sparkles, Lock, Shield, Zap, Instagram } from 'lucide-react';

const XIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FooterLink = ({ href, label, icon, badge }: { 
  href: string; 
  label: string; 
  icon?: React.ReactNode; 
  badge?: string; 
}) => (
  <li>
    {/* Using Next.js Link for internal navigation */}
    <Link 
      href={href}
      className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm flex items-center gap-2 group cursor-pointer"
    >
      {icon}
      <span className="group-hover:translate-x-1 transition-transform duration-200">{label}</span>
      {badge && (
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
          {badge}
        </span>
      )}
    </Link>
  </li>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerData = [
    { 
      title: 'Product', 
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Integrations', href: '/integrations' },
        { label: 'Live Demo', href: '/demo' },
      ],
    },
    { 
      title: 'Company', 
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers', badge: "We're hiring!" },
        { label: 'Blog', href: '/blog' },
        { label: 'Press Kit', href: '/press' },
      ],
    },
    { 
      title: 'Support', 
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Documentation', href: '/docs' },
        { label: 'FAQ', href: '/faq' },
        { label: 'System Status', href: '/status', icon: <Zap className="w-3.5 h-3.5 text-green-400" /> },
      ],
    },
    { 
      title: 'Legal', 
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Security', href: '/security', icon: <Lock className="w-3.5 h-3.5" /> },
        { label: 'Cookie Policy', href: '/cookie-policy' },
      ],
    },
  ];

  // External links remain separate using standard <a> tags
  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/focus_aiapp/', label: 'Instagram', hoverColor: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500' },
    { icon: XIcon, href: 'https://twitter.com/focusai', label: 'X', hoverColor: 'hover:bg-black' },
    { icon: Linkedin, href: 'https://linkedin.com/company/focusai', label: 'LinkedIn', hoverColor: 'hover:bg-blue-600' },
    { icon: Github, href: 'https://github.com/focusai', label: 'GitHub', hoverColor: 'hover:bg-gray-600' },
    { icon: Mail, href: 'mailto:contact@focusai.com', label: 'Email', hoverColor: 'hover:bg-purple-600' },
  ];

  const trustBadges = [
    { icon: Shield, label: 'SOC 2', color: 'text-green-400' },
    { icon: Lock, label: 'SSL Secure', color: 'text-green-400' },
    { icon: Sparkles, label: 'Privacy First', color: 'text-blue-400' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Link Grid */}
        {/* MODIFIED: grid-cols-1 for very small mobile, grid-cols-2 for small devices, then back to 6 columns */}
        <div className="py-10 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-6 gap-y-10 gap-x-8 md:gap-10 lg:gap-12">
          
          {/* Brand Section (Column 1) */}
          <div className="col-span-full md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 mr-3">
                <Image 
                  src="/icon.png" 
                  alt="FocusAI Logo" 
                  width={40} 
                  height={40} 
                  className="rounded-xl shadow-lg" 
                  priority 
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                FocusAI
              </span>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed max-w-xs">
              Stop procrastinating and start achieving your goals with AI-powered focus sessions and smart productivity tools.
            </p>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-2.5 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl ${social.hoverColor} transition-all duration-300 hover:scale-110 hover:border-transparent`}
                  aria-label={social.label}
                >
                  {typeof social.icon === 'function' ? <social.icon /> : <social.icon className="w-5 h-5" />}
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections (Columns 2-5) */}
          {footerData.map((section, idx) => (
            <div key={idx} className="col-span-1">
              <h3 className="text-white font-bold mb-3 text-xs sm:text-sm uppercase tracking-wider">{section.title}</h3>
              <ul className="space-y-2.5"> {/* Tighter spacing for mobile */}
                {section.links.map((link, linkIdx) => (
                  <FooterLink 
                    key={linkIdx}
                    href={link.href}
                    label={link.label}
                    icon={link.icon}
                    badge={link.badge}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dedicated Bottom Band (Clean and Horizontal) */}
        <div className="border-t border-gray-700/50 pt-6 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Trust Badges (Moved here for better mobile organization) */}
            <div className="flex flex-wrap gap-3 order-2 md:order-1">
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 px-3 py-1.5 rounded-lg">
                  <badge.icon className={`w-4 h-4 ${badge.color}`} />
                  <span className="text-xs text-gray-400">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Copyright & Metrics (Grouped) */}
            <div className="flex flex-col sm:flex-row items-center gap-4 order-1 md:order-2">
              
              {/* Copyright/Credit Block */}
              <div className="text-center sm:text-right">
                <p className="text-gray-500 text-xs flex items-center justify-center sm:justify-end">
                  Built with <Heart className="w-3 h-3 mx-1 text-red-500 animate-[pulse_2s_infinite]" /> for productivity enthusiasts
                </p>
                <p className="text-gray-400 text-sm">
                  &copy; {currentYear} FocusAI. All rights reserved.
                </p>
              </div>

              {/* Rating */}
              <div className="h-10 w-px bg-gray-700 hidden sm:block" /> {/* Separator only visible on sm+ */}
              
              <div className="text-center pt-2 sm:pt-0"> {/* Slight top padding for mobile stacking */}
                <p className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">4.9★</p>
                <p className="text-xs text-gray-500">App Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}