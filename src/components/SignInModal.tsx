// src/components/SignInModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Mail, Lock, Chrome, Github, CheckCircle, AlertCircle, XCircle, Phone, Apple, Linkedin, Facebook } from 'lucide-react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp?: () => void;
  onSignInSuccess?: () => void;
  isTransitioning?: boolean;
}

interface Toast {
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

type SignInMethod = 'email' | 'phone';

export default function SignInModal({ isOpen, onClose, onSwitchToSignUp, onSignInSuccess, isTransitioning = false }: SignInModalProps) {
  const router = useRouter();
  const [signInMethod, setSignInMethod] = useState<SignInMethod>('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    countryCode: '+1',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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

  useEffect(() => {
    if (isOpen && !isTransitioning) {
      setFormData({ email: '', phone: '', countryCode: '+1', password: '', rememberMe: false });
      setErrors({});
      setIsLoading(false);
      setToast(null);
    }
  }, [isOpen, isTransitioning]);

  const showToast = (toastData: Toast) => setToast(toastData);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10,15}$/.test(phone.replace(/\D/g, ''));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (signInMethod === 'email') {
      if (!formData.email || !validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    } else {
      if (!formData.phone || !validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    if (!formData.password || formData.password.length < 6) {
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
    setToast(null);
    
    try {
      const credentials = signInMethod === 'email'
        ? { email: formData.email, password: formData.password }
        : { phone: formData.countryCode + formData.phone, password: formData.password };

      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        showToast({
          type: 'error',
          title: 'Sign In Failed',
          message: 'Invalid credentials. Please try again.'
        });
      } else if (result?.ok) {
        const session = await getSession();
        console.log('Sign in successful:', session);
        
        showToast({
          type: 'success',
          title: 'Welcome back!',
          message: 'Redirecting to your dashboard...'
        });

        setTimeout(() => {
          onClose();
          onSignInSuccess?.();
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      showToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Unable to reach server. Please check your connection.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'apple' | 'linkedin' | 'facebook') => {
    try {
      showToast({
        type: 'info',
        title: 'Redirecting...',
        message: `Opening ${provider} sign in...`
      });

      const result = await signIn(provider, {
        callbackUrl: window.location.origin + '/dashboard',
        redirect: false,
      });
      
      if (result?.ok) {
        onClose();
        onSignInSuccess?.();
      } else if (result?.error) {
        showToast({
          type: 'error',
          title: `${provider} Sign In Failed`,
          message: 'Please check your configuration or try again.'
        });
      }
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      showToast({
        type: 'error',
        title: `${provider} Sign In Failed`,
        message: 'Please try again or use email sign in.'
      });
    }
  };

  const handleForgotPassword = () => {
    showToast({
      type: 'info',
      title: 'Password Reset',
      message: 'Password reset functionality coming soon! Check your email.'
    });
  };

  const ToastIcon = () => {
    if (!toast) return null;
    const icons = {
      success: <CheckCircle className="w-5 h-5 text-green-600" />,
      error: <XCircle className="w-5 h-5 text-red-600" />,
      info: <AlertCircle className="w-5 h-5 text-blue-600" />
    };
    return icons[toast.type];
  };

  const toastStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-[90vw] sm:max-w-md lg:max-w-lg xl:max-w-xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 ${
        isTransitioning ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      } animate-in slide-in-from-bottom-4 duration-300 scrollbar-hide`} style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        
        {/* Toast */}
        {toast && (
          <div className="p-4 border-b animate-in slide-in-from-top duration-300">
            <div className={`rounded-xl border p-4 ${toastStyles[toast.type]} shadow-sm`}>
              <div className="flex items-start gap-3">
                <ToastIcon />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold">{toast.title}</h4>
                  {toast.message && <p className="text-xs mt-1 opacity-90">{toast.message}</p>}
                </div>
                <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="relative p-6 lg:p-8 border-b border-gray-100">
          <div className="pr-10">
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome back!
            </h2>
            <p className="text-sm lg:text-base text-gray-600 mt-2">Sign in to your FocusAI account</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:rotate-90"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
          
          {/* Method Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setSignInMethod('email')}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                signInMethod === 'email' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setSignInMethod('phone')}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                signInMethod === 'phone' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Phone
            </button>
          </div>

          {/* Email or Phone Field */}
          {signInMethod === 'email' ? (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${
                    errors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" />{errors.email}</p>}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
              <div className="flex gap-3">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  className="w-24 px-3 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                >
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+81">🇯🇵 +81</option>
                </select>
                <div className="relative group flex-1">
                  <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    className={`w-full pl-11 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${
                      errors.phone ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>
              </div>
              {errors.phone && <p className="text-sm text-red-600 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" />{errors.phone}</p>}
            </div>
          )}

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`w-full pl-11 pr-12 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${
                  errors.password ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" />{errors.password}</p>}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 border-2 border-gray-300 rounded focus:ring-4 focus:ring-purple-500/20 transition-all cursor-pointer"
              />
              <span className="ml-2.5 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm text-purple-600 hover:text-purple-700 font-semibold transition-colors underline underline-offset-2"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing you in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-2.5 px-4 py-3.5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 group">
              <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">Google</span>
            </button>
            <button type="button" onClick={() => handleSocialLogin('github')} className="flex items-center justify-center gap-2.5 px-4 py-3.5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 group">
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">GitHub</span>
            </button>
            <button type="button" onClick={() => handleSocialLogin('apple')} className="flex items-center justify-center gap-2.5 px-4 py-3.5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 group">
              <Apple className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">Apple</span>
            </button>
            <button type="button" onClick={() => handleSocialLogin('linkedin')} className="flex items-center justify-center gap-2.5 px-4 py-3.5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 group">
              <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">LinkedIn</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-6 border-t-2 border-gray-100">
            <p className="text-base text-gray-600">
              Don't have an account?{' '}
              <button type="button" onClick={onSwitchToSignUp} className="text-purple-600 hover:text-purple-700 font-bold transition-colors underline underline-offset-2">
                Sign up for free
              </button>
            </p>
          </div>
        </form>
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}