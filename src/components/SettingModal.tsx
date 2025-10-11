// src/components/SettingsModal.tsx
import React, { useState, useEffect } from 'react';
import { X, User, Bell, Shield, Palette, Globe, Moon, Sun, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Profile settings
    name: '',
    email: '',
    timezone: 'America/New_York',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    taskReminders: true,
    
    // Appearance settings
    theme: 'light',
    accentColor: 'purple',
    compactMode: false,
    
    // Privacy settings
    profileVisibility: 'private',
    dataSharing: false,
    analytics: true,
  });

  // Fetch user data from Supabase when modal opens
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
            name: data.name || session.user?.name || '',
            email: data.email || session.user?.email || '',
            timezone: data.timezone || prev.timezone,
            emailNotifications: data.emailNotifications ?? prev.emailNotifications,
            pushNotifications: data.pushNotifications ?? prev.pushNotifications,
            weeklyReports: data.weeklyReports ?? prev.weeklyReports,
            taskReminders: data.taskReminders ?? prev.taskReminders,
            theme: data.theme || prev.theme,
            accentColor: data.accentColor || prev.accentColor,
            compactMode: data.compactMode ?? prev.compactMode,
            profileVisibility: data.profileVisibility || prev.profileVisibility,
            dataSharing: data.dataSharing ?? prev.dataSharing,
            analytics: data.analytics ?? prev.analytics,
          }));
        } else {
          // If no settings exist yet, use session data as defaults
          setSettings(prev => ({
            ...prev,
            name: session.user?.name || '',
            email: session.user?.email || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
        // Fallback to session data
        setSettings(prev => ({
          ...prev,
          name: session.user?.name || '',
          email: session.user?.email || '',
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isOpen, session]);

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      alert('Please sign in to save settings');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          ...settings,
        }),
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
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your account and preferences</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
                  <p className="text-gray-600">Loading your settings...</p>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={settings.name}
                            onChange={(e) => updateSetting('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter your full name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={settings.email}
                            onChange={(e) => updateSetting('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter your email"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            This is the email associated with your account
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <select
                            value={settings.timezone}
                            onChange={(e) => updateSetting('timezone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-600">Get updates via email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.emailNotifications}
                              onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-gray-600">Get browser notifications</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.pushNotifications}
                              onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Task Reminders</p>
                            <p className="text-sm text-gray-600">Reminders for upcoming deadlines</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.taskReminders}
                              onChange={(e) => updateSetting('taskReminders', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Appearance Settings</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Theme
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              onClick={() => updateSetting('theme', 'light')}
                              className={`p-3 rounded-lg border-2 text-center ${
                                settings.theme === 'light' 
                                  ? 'border-purple-500 bg-purple-50' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Sun className="w-6 h-6 mx-auto mb-1" />
                              <span className="text-sm">Light</span>
                            </button>
                            <button
                              onClick={() => updateSetting('theme', 'dark')}
                              className={`p-3 rounded-lg border-2 text-center ${
                                settings.theme === 'dark' 
                                  ? 'border-purple-500 bg-purple-50' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Moon className="w-6 h-6 mx-auto mb-1" />
                              <span className="text-sm">Dark</span>
                            </button>
                            <button
                              onClick={() => updateSetting('theme', 'system')}
                              className={`p-3 rounded-lg border-2 text-center ${
                                settings.theme === 'system' 
                                  ? 'border-purple-500 bg-purple-50' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Globe className="w-6 h-6 mx-auto mb-1" />
                              <span className="text-sm">System</span>
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Accent Color
                          </label>
                          <div className="flex gap-3">
                            {[
                              { name: 'purple', color: 'bg-purple-500' },
                              { name: 'blue', color: 'bg-blue-500' },
                              { name: 'green', color: 'bg-green-500' },
                              { name: 'orange', color: 'bg-orange-500' },
                            ].map((color) => (
                              <button
                                key={color.name}
                                onClick={() => updateSetting('accentColor', color.name)}
                                className={`w-8 h-8 rounded-full ${color.color} ${
                                  settings.accentColor === color.name 
                                    ? 'ring-2 ring-gray-400 ring-offset-2' 
                                    : ''
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Privacy & Security</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Data Sharing</p>
                            <p className="text-sm text-gray-600">Share anonymous usage data to improve FocusAI</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.dataSharing}
                              onChange={(e) => updateSetting('dataSharing', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Analytics</p>
                            <p className="text-sm text-gray-600">Help us understand how you use FocusAI</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.analytics}
                              onChange={(e) => updateSetting('analytics', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}