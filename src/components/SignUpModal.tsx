// src/components/SignUpModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, Chrome, Github, CheckCircle, AlertCircle, XCircle, Phone, Apple, Linkedin, Facebook } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn?: () => void;
  onSignUpSuccess?: () => void;
  isTransitioning?: boolean;
}

interface Toast {
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

type SignUpMethod = 'email' | 'phone';

export default function SignUpModal({ isOpen, onClose, onSwitchToSignIn, onSignUpSuccess, isTransitioning = false }: SignUpModalProps) {
  const router = useRouter();
  const [signUpMethod, setSignUpMethod] = useState<SignUpMethod>('email');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+1',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      // Prevent background scroll on all devices
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && !isTransitioning) {
      setFormData({ name: '', email: '', phone: '', countryCode: '+1', password: '', confirmPassword: '', agreeToTerms: false });
      setErrors({});
      setIsLoading(false);
      setToast(null);
    }
  }, [isOpen, isTransitioning]);

  const showToast = (toastData: Toast) => setToast(toastData);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10,15}$/.test(phone.replace(/\D/g, ''));
  const validatePassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(password);

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

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (signUpMethod === 'email') {
      if (!formData.email || !validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (!formData.phone || !validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    if (!formData.password || !validatePassword(formData.password)) {
      newErrors.password = 'Password must be 8+ characters with uppercase, lowercase, and number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service';
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
      const payload = signUpMethod === 'email' 
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { name: formData.name, phone: formData.countryCode + formData.phone, password: formData.password };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!res.ok) {
        showToast({
          type: 'error',
          title: 'Signup Failed',
          message: data.message || 'Unable to create account. Please try again.'
        });
        return;
      }

      showToast({
        type: 'success',
        title: 'Account Created!',
        message: 'Signing you in...'
      });

      const signInData = signUpMethod === 'email'
        ? { email: formData.email, password: formData.password }
        : { phone: formData.countryCode + formData.phone, password: formData.password };

      const signInResult = await signIn('credentials', {
        ...signInData,
        redirect: false,
      });

      if (signInResult?.error) {
        showToast({
          type: 'info',
          title: 'Account Created',
          message: 'Please sign in with your new credentials.'
        });
        setTimeout(() => {
          onClose();
          onSwitchToSignIn?.();
        }, 2000);
      } else if (signInResult?.ok) {
        showToast({
          type: 'success',
          title: 'Welcome to FocusAI!',
          message: 'Redirecting to your dashboard...'
        });
        setTimeout(() => {
          onClose();
          onSignUpSuccess?.();
          router.push('/dashboard?welcome=true');
        }, 1500);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      showToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Unable to reach server. Please check your connection.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'github' | 'apple' | 'linkedin' | 'facebook') => {
    try {
      showToast({
        type: 'info',
        title: 'Redirecting...',
        message: `Opening ${provider} sign in...`
      });

      const result = await signIn(provider, {
        callbackUrl: window.location.origin + '/dashboard?welcome=true',
      });
      
      if (result?.ok) {
        onClose();
        onSignUpSuccess?.();
      }
    } catch (error) {
      console.error(`${provider} sign up error:`, error);
      showToast({
        type: 'error',
        title: `${provider} Sign Up Failed`,
        message: 'Please try again or use email signup.'
      });
    }
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
      } animate-in slide-in-from-bottom-4 duration-300`}>
        
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
              Join FocusAI!
            </h2>
            <p className="text-sm lg:text-base text-gray-600 mt-2">Create your account and start achieving more</p>
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
              onClick={() => setSignUpMethod('email')}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                signUpMethod === 'email' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setSignUpMethod('phone')}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                signUpMethod === 'phone' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Phone
            </button>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full pl-11 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${
                  errors.name ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
            </div>
            {errors.name && <p className="text-sm text-red-600 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" />{errors.name}</p>}
          </div>

          {/* Email or Phone Field */}
          {signUpMethod === 'email' ? (
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
                placeholder="Create a strong password"
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
            {!errors.password && formData.password && (
              <p className="text-xs text-gray-500 ml-1">✓ 8+ characters, uppercase, lowercase, and number</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={`w-full pl-11 pr-12 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-600 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" />{errors.confirmPassword}</p>}
            {!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p className="text-xs text-green-600 flex items-center gap-1.5 ml-1">
                <CheckCircle className="w-3.5 h-3.5" /> Passwords match
              </p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-0.5 w-5 h-5 text-purple-600 border-2 border-gray-300 rounded-md focus:ring-4 focus:ring-purple-500/20 transition-all cursor-pointer"
              />
              <span className="text-sm text-gray-600 leading-relaxed">
                I agree to the{' '}
                <button type="button" className="text-purple-600 hover:text-purple-700 font-semibold underline underline-offset-2" onClick={() => showToast({ type: 'info', title: 'Terms of Service' })}>
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-purple-600 hover:text-purple-700 font-semibold underline underline-offset-2" onClick={() => showToast({ type: 'info', title: 'Privacy Policy' })}>
                  Privacy Policy
                </button>
              </span>
            </label>
            {errors.agreeToTerms && <p className="text-sm text-red-600 flex items-center gap-1.5 ml-8"><AlertCircle className="w-4 h-4" />{errors.agreeToTerms}</p>}
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Account...
              </span>
            ) : (
              'Create Account'
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

          {/* Social Sign Up Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => handleSocialSignUp('google')} className="flex items-center justify-center gap-2.5 px-4 py-3.5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 group">
              <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">Google</span>
            </button>
            <button type="button" onClick={() => handleSocialSignUp('github')} className="flex items-center justify-center gap-2.5 px-4 py-3.5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 group">
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">GitHub</span>
            </button>
            <button type="button" onClick={() => handleSocialSignUp('apple')} className="flex items-center justify-center gap-2.5 px-4 py-3.5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 group">
              <Apple className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">Apple</span>
            </button>
            <button type="button" onClick={() => handleSocialSignUp('linkedin')} className="flex items-center justify-center gap-2.5 px-4 py-3.5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 group">
              <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-700">LinkedIn</span>
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center pt-6 border-t-2 border-gray-100">
            <p className="text-base text-gray-600">
              Already have an account?{' '}
              <button type="button" onClick={onSwitchToSignIn} className="text-purple-600 hover:text-purple-700 font-bold transition-colors underline underline-offset-2">
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}