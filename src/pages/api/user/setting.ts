// src/pages/api/user/settings.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getSession } from 'next-auth/react';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the user's session
  const session = await getSession({ req });
  
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = (session.user as any).id;

  // GET - Fetch user settings
  if (req.method === 'GET') {
    try {
      // First, get the user's basic info from auth.users
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
      
      if (authError) {
        console.error('Error fetching auth user:', authError);
        return res.status(500).json({ message: 'Error fetching user data' });
      }

      // Then, get their settings from a custom settings table (if exists)
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Combine auth data with settings data
      const userData = {
        name: authUser.user?.user_metadata?.name || '',
        email: authUser.user?.email || '',
        // Settings from database (with defaults if not found)
        timezone: settingsData?.timezone || 'America/New_York',
        emailNotifications: settingsData?.email_notifications ?? true,
        pushNotifications: settingsData?.push_notifications ?? false,
        weeklyReports: settingsData?.weekly_reports ?? true,
        taskReminders: settingsData?.task_reminders ?? true,
        theme: settingsData?.theme || 'light',
        accentColor: settingsData?.accent_color || 'purple',
        compactMode: settingsData?.compact_mode ?? false,
        profileVisibility: settingsData?.profile_visibility || 'private',
        dataSharing: settingsData?.data_sharing ?? false,
        analytics: settingsData?.analytics ?? true,
      };

      return res.status(200).json(userData);
    } catch (error) {
      console.error('GET settings error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // PUT - Update user settings
  if (req.method === 'PUT') {
    try {
      const {
        name,
        email,
        timezone,
        emailNotifications,
        pushNotifications,
        weeklyReports,
        taskReminders,
        theme,
        accentColor,
        compactMode,
        profileVisibility,
        dataSharing,
        analytics,
      } = req.body;

      // Update user metadata (name) in auth.users
      if (name) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
          user_metadata: { name }
        });

        if (updateError) {
          console.error('Error updating user metadata:', updateError);
        }
      }

      // Upsert settings in user_settings table
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          timezone,
          email_notifications: emailNotifications,
          push_notifications: pushNotifications,
          weekly_reports: weeklyReports,
          task_reminders: taskReminders,
          theme,
          accent_color: accentColor,
          compact_mode: compactMode,
          profile_visibility: profileVisibility,
          data_sharing: dataSharing,
          analytics,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (settingsError) {
        console.error('Error saving settings:', settingsError);
        return res.status(500).json({ message: 'Failed to save settings' });
      }

      return res.status(200).json({ message: 'Settings saved successfully' });
    } catch (error) {
      console.error('PUT settings error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}