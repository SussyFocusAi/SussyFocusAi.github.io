// src/components/SettingsModal.tsx - With Profile Picture Upload
import React, { useState, useEffect, useRef } from 'react';
import { X, User, Bell, Shield, Palette, CreditCard, Loader2, Gift, Crown, Users, Zap, Check, LogOut, Trash2, Download, Lock, Globe, Sun, Moon, ChevronRight, Camera, Upload } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemMessage, setRedeemMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  const [settings, setSettings] = useState({
    name: '',
    email: '',
    profileImage: '',
    timezone: 'America/New_York',
    language: 'en',
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    taskReminders: true,
    dailyDigest: true,
    theme: 'light',
    accentColor: 'purple',
    compactMode: false,
    profileVisibility: 'private',
    dataSharing: false,
    analytics: true,
    plan: 'free',
    planExpiry: null as string | null,
  });

  // Fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isOpen || !session?.user?.id) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/user/settings?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setSettings(prev => ({ 
            ...prev, 
            ...data, 
            name: data.name || session.user?.name || '', 
            email: data.email || session.user?.email || '',
            profileImage: data.profileImage || session.user?.image || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [isOpen, session]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', session?.user?.id || '');

      const response = await fetch('/api/user/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, profileImage: data.imageUrl }));
        alert('Profile picture updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to upload image: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    if (confirm('Are you sure you want to remove your profile picture?')) {
      setSettings(prev => ({ ...prev, profileImage: '' }));
    }
  };

  const handleSave = async () => {
    if (!session?.user?.id) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, ...settings }),
      });
      
      if (response.ok) {
        alert('Settings saved successfully!');
        onClose();
      } else {
        const data = await response.json();
        alert(`Failed to save settings: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRedeemCode = async () => {
    if (!redeemCode.trim()) {
      setRedeemMessage({ type: 'error', text: 'Please enter a code' });
      return;
    }
    
    setIsRedeeming(true);
    setRedeemMessage(null);
    
    try {
      const response = await fetch('/api/user/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user?.id, code: redeemCode.trim().toUpperCase() }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setRedeemMessage({ type: 'success', text: data.message || 'Code redeemed successfully!' });
        setRedeemCode('');
        setSettings(prev => ({ 
          ...prev, 
          plan: data.plan || 'pro', 
          planExpiry: data.expiryDate 
        }));
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setRedeemMessage({ type: 'error', text: data.message || 'Invalid code' });
      }
    } catch (error) {
      console.error('Error redeeming code:', error);
      setRedeemMessage({ type: 'error', text: 'Failed to redeem code. Please try again.' });
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
    onClose();
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

    const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];


  const planInfo = {
    free: { name: 'Free Plan', icon: Zap, color: 'from-gray-400 to-gray-500', features: ['Basic task management', 'Simple reminders', 'Up to 10 projects', 'Community support'] },
    pro: { name: 'Pro Plan', icon: Crown, color: 'from-purple-500 to-blue-500', features: ['Everything in Free', 'Full AI scheduling', 'Unlimited projects', 'Priority support', 'Advanced analytics'] },
    team: { name: 'Team Plan', icon: Users, color: 'from-blue-500 to-cyan-500', features: ['Everything in Pro', 'Team collaboration', 'Admin controls', 'Dedicated manager', 'SLA guarantee'] }
  };

  const currentPlan = planInfo[settings.plan as keyof typeof planInfo] || planInfo.free;
  const PlanIcon = currentPlan.icon;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white w-full h-full sm:h-auto sm:rounded-2xl shadow-2xl sm:max-w-5xl sm:max-h-[90vh] flex flex-col sm:m-4 overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0 bg-white">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Settings</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Manage your account</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Mobile Tab Selector - Fixed */}
        <div className="sm:hidden border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-max px-4 py-3 flex flex-col items-center gap-1 border-b-2 transition-colors touch-manipulation ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden sm:block w-56 lg:w-64 border-r border-gray-200 p-3 overflow-y-auto flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-sm ${
                      activeTab === tab.id ? 'bg-purple-50 text-purple-700 border border-purple-200 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              <div className="pt-3 mt-3 border-t border-gray-200 space-y-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Loading your settings...</p>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-6 pb-32">
                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-semibold">Profile Information</h3>
                    
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-100">
                      <div className="relative group">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          {settings.profileImage ? (
                            <img 
                              src={settings.profileImage} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                              <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingImage}
                          className="absolute bottom-0 right-0 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all transform hover:scale-110 disabled:opacity-50"
                        >
                          {isUploadingImage ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Camera className="w-5 h-5" />
                          )}
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-semibold text-gray-900 text-lg mb-2">Profile Picture</h4>
                        <p className="text-sm text-gray-600 mb-4">Upload a profile picture to personalize your account. Max size: 5MB.</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingImage}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            {isUploadingImage ? 'Uploading...' : 'Upload Photo'}
                          </button>
                          {settings.profileImage && (
                            <button
                              onClick={handleRemoveImage}
                              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm font-medium transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input type="text" value={settings.name} onChange={(e) => updateSetting('name', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" value={settings.email} onChange={(e) => updateSetting('email', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Timezone */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                          <div className="relative">
                            <select
                              value={settings.timezone}
                              onChange={(e) => updateSetting('timezone', e.target.value)}
                              className="w-full appearance-none bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg px-4 py-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm hover:shadow-md"
                            >
                              <option value="America/New_York">Eastern Time</option>
                              <option value="America/Chicago">Central Time</option>
                              <option value="America/Denver">Mountain Time</option>
                              <option value="America/Los_Angeles">Pacific Time</option>
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500 pointer-events-none transform rotate-90" />
                          </div>
                        </div>

                        {/* Language */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                          <div className="relative">
                            <select
                              value={settings.language}
                              onChange={(e) => updateSetting('language', e.target.value)}
                              className="w-full appearance-none bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg px-4 py-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm hover:shadow-md"
                            >
                              <option value="en">English</option>
                              <option value="es">Español</option>
                              <option value="fr">Français</option>
                              <option value="de">Deutsch</option>
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500 pointer-events-none transform rotate-90" />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* ... REST OF THE TABS (Account, Notifications, Appearance, Privacy) remain the same ... */}
                {activeTab === 'account' && (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-semibold">Account & Billing</h3>
                    
                    <div className={`relative bg-gradient-to-br ${currentPlan.color} text-white rounded-xl p-4 sm:p-6 overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                              <PlanIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                              <h4 className="text-lg sm:text-2xl font-bold">{currentPlan.name}</h4>
                              <p className="text-xs sm:text-sm opacity-90">
                                {settings.plan === 'free' ? 'Active' : settings.planExpiry ? `Expires: ${new Date(settings.planExpiry).toLocaleDateString()}` : 'Active'}
                              </p>
                            </div>
                          </div>
                          {settings.plan === 'free' && (
                            <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-semibold transition-all text-xs sm:text-sm touch-manipulation whitespace-nowrap">
                              Upgrade
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {currentPlan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm">
                              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 sm:p-6 border-2 border-purple-200">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Have a gift code?</h4>
                          <p className="text-xs text-gray-600 mt-0.5">Redeem to unlock premium features</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={redeemCode}
                          onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                          placeholder="ENTER-CODE"
                          className="w-full px-3 py-2.5 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                          disabled={isRedeeming}
                        />
                        <button
                          onClick={handleRedeemCode}
                          disabled={isRedeeming || !redeemCode.trim()}
                          className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 text-sm touch-manipulation"
                        >
                          {isRedeeming ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Redeem Code'}
                        </button>
                      </div>
                      {redeemMessage && (
                        <div className={`mt-3 p-3 rounded-lg text-xs sm:text-sm ${
                          redeemMessage.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
                        }`}>
                          {redeemMessage.text}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button className="p-4 border-2 border-gray-200 hover:border-purple-300 rounded-xl text-left transition-all group touch-manipulation">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-900 text-sm group-hover:text-purple-600">Export Data</h5>
                            <p className="text-xs text-gray-600 mt-0.5">Download your info</p>
                          </div>
                          <Download className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                        </div>
                      </button>
                      <button className="p-4 border-2 border-red-200 hover:border-red-400 rounded-xl text-left transition-all group touch-manipulation">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-900 text-sm group-hover:text-red-600">Delete Account</h5>
                            <p className="text-xs text-gray-600 mt-0.5">Permanently remove</p>
                          </div>
                          <Trash2 className="w-5 h-5 text-red-400 group-hover:text-red-600" />
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fixed on Mobile */}
        <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0 sticky bottom-0">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button onClick={onClose} className="sm:order-1 px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium rounded-lg hover:bg-gray-50 touch-manipulation" disabled={isSaving}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={isSaving || isLoading} className="sm:order-2 flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-semibold touch-manipulation">
              {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : 'Save Changes'}
            </button>
          </div>
          
          <button onClick={handleLogout} className="sm:hidden w-full mt-2 flex items-center justify-center gap-2 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium touch-manipulation">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}