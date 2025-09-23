// src/components/AuthModalController.tsx
import React, { useState } from 'react';
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';

interface AuthModalControllerProps {
  initialModal?: 'signin' | 'signup' | null;
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

export default function AuthModalController({ 
  initialModal = null, 
  isOpen, 
  onClose, 
  onAuthSuccess 
}: AuthModalControllerProps) {
  const [activeModal, setActiveModal] = useState<'signin' | 'signup' | null>(initialModal);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle modal switching with smooth transition
  const handleSwitchModal = (targetModal: 'signin' | 'signup') => {
    if (activeModal === targetModal) return;
    
    setIsTransitioning(true);
    
    // Start transition
    setTimeout(() => {
      setActiveModal(targetModal);
      
      // End transition
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  const handleClose = () => {
    setActiveModal(null);
    setIsTransitioning(false);
    onClose();
  };

  const handleAuthSuccess = () => {
    handleClose();
    onAuthSuccess?.();
  };

  // Update active modal when initialModal changes and modal opens
  React.useEffect(() => {
    if (isOpen && initialModal) {
      setActiveModal(initialModal);
      setIsTransitioning(false);
    }
  }, [isOpen, initialModal]);

  if (!isOpen) return null;

  return (
    <>
      <SignInModal
        isOpen={activeModal === 'signin'}
        onClose={handleClose}
        onSwitchToSignUp={() => handleSwitchModal('signup')}
        onSignInSuccess={handleAuthSuccess}
        isTransitioning={isTransitioning}
      />
      <SignUpModal
        isOpen={activeModal === 'signup'}
        onClose={handleClose}
        onSwitchToSignIn={() => handleSwitchModal('signin')}
        onSignUpSuccess={handleAuthSuccess}
        isTransitioning={isTransitioning}
      />
    </>
  );
}

// Hook for easy usage
export function useAuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [initialModal, setInitialModal] = useState<'signin' | 'signup' | null>(null);

  const openSignIn = () => {
    setInitialModal('signin');
    setIsOpen(true);
  };

  const openSignUp = () => {
    setInitialModal('signup');
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setTimeout(() => setInitialModal(null), 300); // Wait for animation
  };

  return {
    isOpen,
    initialModal,
    openSignIn,
    openSignUp,
    close,
  };
}