// src/components/SignInModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Mail, Lock, Chrome, Github } from 'lucide-react';
import { signIn, getSession } from 'next-auth/react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp?: () => void;
  onSignInSuccess?: () => void;
  isTransitioning?: boolean;
}

export default function SignInModal({ isOpen, onClose, onSwitchToSignUp, onSignInSuccess, isTransitioning = false }: SignInModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset form when modal opens (but not during transitions)
  useEffect(() => {
    if (isOpen && !isTransitioning) {
      setFormData({ email: '', password: '', rememberMe: false });
      setErrors({});
      setIsLoading(false);
    }
  }, [isOpen, isTransitioning]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setErrors({ general: 'Invalid email or password. Try demo@focusai.com / demo123' });
      } else if (result?.ok) {
        // Success! Get the updated session
        const session = await getSession();
        console.log('Sign in successful:', session);
        
        onClose();
        onSignInSuccess?.();
        
        // Show success message
        alert(`Welcome back, ${session?.user?.name || 'User'}!`);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const result = await signIn(provider, {
        callbackUrl: window.location.origin + '/dashboard',
        redirect: false,
      });
      
      if (result?.ok) {
        onClose();
        onSignInSuccess?.();
      } else if (result?.error) {
        alert(`${provider} sign in failed. Make sure OAuth is configured in your .env.local file.`);
      }
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      alert(`${provider} sign in failed. Please try again.`);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-[90vw] sm:max-w-md lg:max-w-lg xl:max-w-xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 ${
        isTransitioning ? 'scale-95 opacity-75' : 'scale-100 opacity-100'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 lg:p-8 border-b border-gray-100">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Welcome back!</h2>
            <p className="text-sm lg:text-base text-gray-600 mt-1">Sign in to your FocusAI account</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Demo Credentials Notice */}
        <div className="mx-6 lg:mx-8 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs lg:text-sm text-blue-700">
            <strong>Demo:</strong> email: <code className="bg-blue-100 px-1 rounded">demo@focusai.com</code> password: <code className="bg-blue-100 px-1 rounded">demo123</code>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-5">
          {/* General Error */}
          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-3 lg:py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-12 py-3 lg:py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
              onClick={() => alert('Forgot password functionality coming soon!')}
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 lg:py-4 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center gap-2 px-4 py-3 lg:py-4 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <Chrome className="w-4 h-4" />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              className="flex items-center justify-center gap-2 px-4 py-3 lg:py-4 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-6 border-t border-gray-100">
            <p className="text-sm lg:text-base text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Sign up for free
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}