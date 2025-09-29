// src/components/Header.tsx - Improved with consistent sizing and better mobile UX
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, Settings, Menu, X, Home } from 'lucide-react';
import AuthModalController, { useAuthModal } from './AuthModalController';
import SettingsModal from './SettingModal';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  scrollToSection?: (elementRef: React.RefObject<HTMLDivElement>) => void;
  refs?: {
    heroRef: React.RefObject<HTMLDivElement>;
    featuresRef: React.RefObject<HTMLDivElement>;
    teamRef: React.RefObject<HTMLDivElement>;
    pricingRef: React.RefObject<HTMLDivElement>;
  };
}

const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, scrollToSection, refs }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Use the new auth modal system
  const authModal = useAuthModal();

  const handleNavClick = (section: keyof NonNullable<typeof refs>) => {
    setIsMobileMenuOpen(false); // Close mobile menu
    if (currentPath !== '/') {
      router.push('/');
      setTimeout(() => {
        if (scrollToSection && refs && refs[section]) {
          scrollToSection(refs[section]);
        }
      }, 300);
    } else if (scrollToSection && refs && refs[section]) {
      setTimeout(() => {
        scrollToSection(refs[section]);
      }, 100);
    }
  };

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const handleLinkClick = (path: string) => {
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const handleAuthSuccess = () => {
    console.log('User authenticated successfully!');
    router.push('/dashboard');
  };

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && event.target instanceof Element) {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuButton = document.getElementById('mobile-menu-button');
        if (mobileMenu && !mobileMenu.contains(event.target) && 
            menuButton && !menuButton.contains(event.target)) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const getNavigationItems = () => {
    if (session) {
      if (currentPath === '/chat') {
        return [
          { type: 'link', href: '/dashboard', label: 'Dashboard' },
          { type: 'link', href: '/deadlines', label: 'Deadlines' },
          { type: 'link', href: '/analytics', label: 'Analytics' },
          { type: 'current', href: '/chat', label: 'AI Coach' }
        ];
      }

      if (currentPath === '/dashboard') {
        return [
          { type: 'current', href: '/dashboard', label: 'Dashboard' },
          { type: 'link', href: '/deadlines', label: 'Deadlines' },
          { type: 'link', href: '/analytics', label: 'Analytics' },
          { type: 'link', href: '/chat', label: 'AI Coach' }
        ];
      }

      if (currentPath === '/deadlines') {
        return [
          { type: 'link', href: '/dashboard', label: 'Dashboard' },
          { type: 'current', href: '/deadlines', label: 'Deadlines' },
          { type: 'link', href: '/analytics', label: 'Analytics' },
          { type: 'link', href: '/chat', label: 'AI Coach' }
        ];
      }

      if (currentPath === '/analytics') {
        return [
          { type: 'link', href: '/dashboard', label: 'Dashboard' },
          { type: 'link', href: '/deadlines', label: 'Deadlines' },
          { type: 'current', href: '/analytics', label: 'Analytics' },
          { type: 'link', href: '/chat', label: 'AI Coach' }
        ];
      }

      return [
        { type: 'link', href: '/dashboard', label: 'Dashboard' },
        { type: 'link', href: '/deadlines', label: 'Deadlines' },
        { type: 'link', href: '/analytics', label: 'Analytics' },
        { type: 'link', href: '/chat', label: 'AI Coach' }
      ];
    }

    return [
      { type: 'scroll', section: 'heroRef', label: 'Home' },
      { type: 'scroll', section: 'featuresRef', label: 'Features' },
      { type: 'scroll', section: 'teamRef', label: 'Team' },
      { type: 'scroll', section: 'pricingRef', label: 'Pricing' }
    ];
  };

  const navigationItems = getNavigationItems();

  const renderNavItem = (item: any, index: number, isMobile = false) => {
    const baseClasses = isMobile 
      ? "block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 rounded-lg font-medium"
      : "font-medium transition-all duration-200 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-blue-600 after:transition-all after:duration-200 hover:after:w-full cursor-pointer";
    
    const activeClasses = isMobile 
      ? "bg-purple-100 text-purple-600 font-semibold"
      : "text-purple-600 after:w-full";
    
    const inactiveClasses = isMobile 
      ? "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
      : "text-gray-600 hover:text-purple-600 hover:scale-105";

    if (item.type === 'scroll') {
      return (
        <button
          key={index}
          onClick={() => handleNavClick(item.section as keyof NonNullable<typeof refs>)}
          className={`${baseClasses} ${inactiveClasses} ${isMobile ? 'w-full text-left' : ''}`}
        >
          {item.label}
        </button>
      );
    }

    if (item.type === 'current') {
      return (
        <span
          key={index}
          className={`${baseClasses} ${activeClasses} ${isMobile ? 'cursor-default' : 'cursor-default'}`}
        >
          {item.label}
        </span>
      );
    }

    return (
      <button
        key={index}
        onClick={() => handleLinkClick(item.href)}
        className={`${baseClasses} ${inactiveClasses} ${isMobile ? 'w-full text-left' : ''}`}
      >
        {item.label}
      </button>
    );
  };

  return (
    <>
      {/* Larger header height and padding to match dashboard */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between h-14"> {/* Increased height for consistency */}
            {/* Logo - consistent sizing */}
            <button 
              onClick={handleLogoClick}
              className="hover:scale-105 transition-transform duration-200 flex items-center"
            >
              <div className="flex items-center space-x-3">
                <img
                  src="/icon.png"              
                  alt="FocusAI logo"
                  className="w-12 h-12 rounded-lg object-cover shadow-sm" // Larger logo to match dashboard
                />
                <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  FocusAI
                </span>
              </div>
            </button>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item, index) => renderNavItem(item, index, false))}
            </nav>
            
            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {status === 'loading' ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">Loading...</span>
                </div>
              ) : session ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {session.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user?.name || 'User'} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-gray-700">
                      {session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0] || 'User'}
                    </span>
                  </button>

                  {/* Desktop User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{session.user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{session.user?.email}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsSettingsModalOpen(true);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button 
                    onClick={authModal.openSignIn}
                    className="px-5 py-2.5 text-base font-medium text-gray-600 hover:text-purple-600 transition-all duration-200 hover:scale-105"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={authModal.openSignUp}
                    className="px-7 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-base font-medium"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              id="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors z-50 relative"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="fixed inset-0 bg-white z-50 md:hidden overflow-y-auto"
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img
                src="/icon.png"              
                alt="FocusAI logo"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                FocusAI
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* Quick Home Button for mobile */}
            {currentPath !== '/' && (
              <button
                onClick={handleLogoClick}
                className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 rounded-lg font-medium"
              >
                <Home className="w-5 h-5" />
                Go to Home
              </button>
            )}

            {/* Mobile Navigation */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Navigation</h3>
              {navigationItems.map((item, index) => renderNavItem(item, index, true))}
            </div>

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              {session ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-4 px-4 py-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                    {session.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user?.name || 'User'} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{session.user?.name || 'User'}</p>
                      <p className="text-sm text-gray-600">{session.user?.email}</p>
                    </div>
                  </div>
                  
                  {/* User Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsSettingsModalOpen(true);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors font-medium"
                    >
                      <Settings className="w-5 h-5" />
                      Settings
                    </button>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3 transition-colors font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      authModal.openSignIn();
                    }}
                    className="w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors border border-gray-200"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      authModal.openSignUp();
                    }}
                    className="w-full px-4 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg font-medium text-center"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
      
      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Enhanced Auth Modal System */}
      <AuthModalController
        isOpen={authModal.isOpen}
        initialModal={authModal.initialModal}
        onClose={authModal.close}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default Header;