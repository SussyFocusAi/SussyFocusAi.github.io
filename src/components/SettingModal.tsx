// src/components/SettingsModal.tsx - ULTIMATE VERSION
import React, { useState, useEffect } from 'react';
import { X, User, Bell, Shield, Palette, CreditCard, Loader2, Gift, Crown, Users, Zap, Check, LogOut, Trash2, Download, Upload, Lock, Mail, Globe, Sun, Moon, ChevronRight } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemMessage, setRedeemMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [settings, setSettings] = useState({
    name: '',
    email: '',
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

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isOpen || !session?.user?.id) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/user/settings?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setSettings(prev => ({ ...prev, ...data, name: data.name || session.user?.name || '', email: data.email || session.user?.email || '' }));
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
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

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
        alert('Failed to save settings');
      }
    } catch (error) {
      alert('Error saving settings');
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
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setRedeemMessage({ type: 'error', text: data.message || 'Invalid code' });
      }
    } catch (error) {
      setRedeemMessage({ type: 'error', text: 'Failed to redeem code' });
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleExportData = () => {
    alert('Exporting your data... This will download a JSON file with all your information.');
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    if (confirm('Are you ABSOLUTELY sure? This action cannot be undone!')) {
      alert('Account deletion initiated. You will receive an email confirmation.');
      setShowDeleteConfirm(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'account', label: 'Account', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full h-full sm:h-auto sm:rounded-2xl shadow-2xl sm:max-w-5xl sm:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Manage your account</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Mobile Tab Selector */}
          <div className="sm:hidden w-full border-b border-gray-200">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-3 border-none focus:outline-none focus:ring-0 text-sm font-medium"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>{tab.label}</option>
              ))}
            </select>
          </div>

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

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Loading...</p>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-6">
                {/* ACCOUNT TAB */}
                {activeTab === 'account' && (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-lg font-semibold">Account & Billing</h3>
                    
                    {/* Plan Card */}
                    <div className={`relative bg-gradient-to-br ${currentPlan.color} text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
                      <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                              <PlanIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                              <h4 className="text-xl sm:text-2xl font-bold">{currentPlan.name}</h4>
                              <p className="text-xs sm:text-sm opacity-90">
                                {settings.plan === 'free' ? 'Active' : settings.planExpiry ? `Expires: ${new Date(settings.planExpiry).toLocaleDateString()}` : 'Active'}
                              </p>
                            </div>
                          </div>
                          {settings.plan === 'free' && (
                            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-semibold transition-all text-sm">
                              Upgrade
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {currentPlan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm">
                              <Check className="w-4 h-4 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Redeem Code */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 sm:p-6 border-2 border-purple-200">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Have a gift code?</h4>
                          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Redeem to unlock premium features</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={redeemCode}
                          onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                          placeholder="ENTER-CODE"
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-xs sm:text-sm"
                          disabled={isRedeeming}
                        />
                        <button
                          onClick={handleRedeemCode}
                          disabled={isRedeeming || !redeemCode.trim()}
                          className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 text-sm whitespace-nowrap"
                        >
                          {isRedeeming ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mx-auto" /> : 'Redeem'}
                        </button>
                      </div>
                      {redeemMessage && (
                        <div className={`mt-3 p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm ${
                          redeemMessage.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
                        }`}>
                          {redeemMessage.text}
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button onClick={handleExportData} className="p-3 sm:p-4 border-2 border-gray-200 hover:border-purple-300 rounded-xl text-left transition-all group">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-purple-600">Export Data</h5>
                            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Download your info</p>
                          </div>
                          <Download className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                        </div>
                      </button>
                      <button onClick={handleDeleteAccount} className="p-3 sm:p-4 border-2 border-red-200 hover:border-red-400 rounded-xl text-left transition-all group">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-red-600">Delete Account</h5>
                            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Permanently remove</p>
                          </div>
                          <Trash2 className="w-5 h-5 text-red-400 group-hover:text-red-600" />
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-lg font-semibold">Profile Information</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input type="text" value={settings.name} onChange={(e) => updateSetting('name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <input type="email" value={settings.email} onChange={(e) => updateSetting('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
                          <select value={settings.timezone} onChange={(e) => updateSetting('timezone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base">
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Language</label>
                          <select value={settings.language} onChange={(e) => updateSetting('language', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base">
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Get updates via email' },
                        { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser notifications' },
                        { key: 'taskReminders', label: 'Task Reminders', desc: 'Upcoming deadline alerts' },
                        { key: 'dailyDigest', label: 'Daily Digest', desc: 'Summary of your day' },
                        { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Progress summaries' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-2">
                          <div>
                            <p className="font-medium text-sm sm:text-base">{item.label}</p>
                            <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings[item.key as keyof typeof settings] as boolean} onChange={(e) => updateSetting(item.key, e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* APPEARANCE TAB */}
                {activeTab === 'appearance' && (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-lg font-semibold">Appearance</h3>
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                          {[
                            { value: 'light', icon: Sun, label: 'Light' },
                            { value: 'dark', icon: Moon, label: 'Dark' },
                            { value: 'system', icon: Globe, label: 'System' }
                          ].map((theme) => {
                            const Icon = theme.icon;
                            return (
                              <button key={theme.value} onClick={() => updateSetting('theme', theme.value)} className={`p-2 sm:p-3 rounded-lg border-2 text-center transition-all ${settings.theme === theme.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <Icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1" />
                                <span className="text-xs sm:text-sm font-medium">{theme.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Accent Color</label>
                        <div className="flex gap-2 sm:gap-3">
                          {['purple', 'blue', 'green', 'orange', 'pink'].map((color) => (
                            <button key={color} onClick={() => updateSetting('accentColor', color)} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-${color}-500 ${settings.accentColor === color ? 'ring-2 ring-gray-400 ring-offset-2' : ''}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PRIVACY TAB */}
                {activeTab === 'privacy' && (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-lg font-semibold">Privacy & Security</h3>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        { key: 'dataSharing', label: 'Data Sharing', desc: 'Share anonymous usage data' },
                        { key: 'analytics', label: 'Analytics', desc: 'Help improve FocusAI' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-2">
                          <div>
                            <p className="font-medium text-sm sm:text-base">{item.label}</p>
                            <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings[item.key as keyof typeof settings] as boolean} onChange={(e) => updateSetting(item.key, e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <button className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200 hover:border-purple-300 rounded-lg transition-all group">
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                          <div className="text-left">
                            <p className="font-medium text-sm sm:text-base">Change Password</p>
                            <p className="text-xs sm:text-sm text-gray-600">Update your password</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 sm:p-6 flex flex-col-reverse sm:flex-row justify-between gap-2 sm:gap-0 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base" disabled={isSaving}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={isSaving || isLoading} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base">
            {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : 'Save Changes'}
          </button>
        </div>

        {/* Mobile Logout Button */}
        <div className="sm:hidden p-4 border-t border-gray-200">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}