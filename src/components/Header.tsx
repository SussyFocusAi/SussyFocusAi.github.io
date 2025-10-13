// src/components/Header.tsx - Fixed scroll lock issue
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

  const authModal = useAuthModal();

  const handleNavClick = (section: keyof NonNullable<typeof refs>) => {
    setIsMobileMenuOpen(false);
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

  // Handle scroll lock for mobile menu
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
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isMobileMenuOpen]);

  // Fix scroll lock on window resize (mobile to desktop transition)
  useEffect(() => {
    const handleResize = () => {
      // If window becomes desktop size (md breakpoint = 768px), close mobile menu
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        // Force unlock scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Force unlock scroll on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

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
    if (isMobile) {
      const isActive = item.type === 'current';
      return (
        <button
          key={index}
          onClick={() => {
            if (item.type === 'scroll') handleNavClick(item.section as keyof NonNullable<typeof refs>);
            else if (item.type === 'link') handleLinkClick(item.href);
          }}
          disabled={item.type === 'current'}
          className={`w-full px-4 py-3.5 rounded-xl font-medium transition-all text-left touch-manipulation ${
            isActive
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
          }`}
        >
          {item.label}
        </button>
      );
    }

    const baseClasses = "font-medium transition-all duration-200 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-blue-600 after:transition-all after:duration-200 hover:after:w-full cursor-pointer";
    
    const activeClasses = "text-purple-600 after:w-full";
    const inactiveClasses = "text-gray-600 hover:text-purple-600 hover:scale-105";

    if (item.type === 'scroll') {
      return (
        <button
          key={index}
          onClick={() => handleNavClick(item.section as keyof NonNullable<typeof refs>)}
          className={`${baseClasses} ${inactiveClasses}`}
        >
          {item.label}
        </button>
      );
    }

    if (item.type === 'current') {
      return (
        <span
          key={index}
          className={`${baseClasses} ${activeClasses} cursor-default`}
        >
          {item.label}
        </span>
      );
    }

    return (
      <button
        key={index}
        onClick={() => handleLinkClick(item.href)}
        className={`${baseClasses} ${inactiveClasses}`}
      >
        {item.label}
      </button>
    );
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between h-14">
            <button 
              onClick={handleLogoClick}
              className="hover:scale-105 transition-transform duration-200 flex items-center"
            >
              <div className="flex items-center space-x-3">
                <img
                  src="/icon.png"              
                  alt="FocusAI logo"
                  className="w-12 h-12 rounded-lg object-cover shadow-sm"
                />
                <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  FocusAI
                </span>
              </div>
            </button>
            
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item, index) => renderNavItem(item, index, false))}
            </nav>
            
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

            <button 
              id="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors z-50 relative touch-manipulation"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="fixed inset-0 bg-white z-50 md:hidden flex flex-col"
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 flex-shrink-0 bg-white">
            <div className="flex items-center space-x-2">
              <img
                src="/icon.png"              
                alt="FocusAI logo"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                FocusAI
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-6">
            {currentPath !== '/' && (
              <button
                onClick={handleLogoClick}
                className="flex items-center gap-3 w-full px-4 py-3.5 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 rounded-xl font-medium mb-4 border-2 border-dashed border-gray-300 touch-manipulation"
              >
                <Home className="w-5 h-5 text-purple-600" />
                Go to Home
              </button>
            )}

            <div className="space-y-2 mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-3">Navigation</h3>
              {navigationItems.map((item, index) => renderNavItem(item, index, true))}
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              {session ? (
                <>
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 border-2 border-purple-100">
                    <div className="flex items-center gap-3 mb-4">
                      {session.user?.image ? (
                        <img 
                          src={session.user.image} 
                          alt={session.user?.name || 'User'} 
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-7 h-7 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{session.user?.name || 'User'}</p>
                        <p className="text-sm text-gray-600 truncate">{session.user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsSettingsModalOpen(true);
                        }}
                        className="flex flex-col items-center justify-center gap-1.5 px-3 py-3 bg-white hover:bg-gray-50 rounded-xl font-medium text-sm text-gray-700 transition-colors touch-manipulation shadow-sm"
                      >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </button>
                      
                      <button
                        onClick={handleSignOut}
                        className="flex flex-col items-center justify-center gap-1.5 px-3 py-3 bg-white hover:bg-red-50 rounded-xl font-medium text-sm text-red-600 transition-colors touch-manipulation shadow-sm"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      authModal.openSignIn();
                    }}
                    className="w-full py-3.5 text-center font-semibold text-gray-700 bg-white hover:bg-gray-50 rounded-xl border-2 border-gray-200 transition-all touch-manipulation"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      authModal.openSignUp();
                    }}
                    className="w-full py-3.5 text-center font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg transition-all touch-manipulation"
                  >
                    Get Started Free
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
      
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

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