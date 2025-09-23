// src/hooks/useRouter.tsx
import { useState, useEffect } from 'react';

export const useRouter = () => {
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    // Set initial path
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    // Update browser URL without reload
    window.history.pushState({}, '', path);
  };

  const goBack = () => {
    window.history.back();
  };

  return {
    currentPath,
    navigate,
    goBack
  };
};