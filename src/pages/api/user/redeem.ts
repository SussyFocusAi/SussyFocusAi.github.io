// src/pages/api/user/redeem.ts - Fixed with getServerSession
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Predefined gift codes
const GIFT_CODES = {
  'FOCUSAI-PRO-2024': {
    plan: 'pro',
    duration: 30,
    description: 'Pro Plan - 30 Days'
  },
  'TEAM-TRIAL-90': {
    plan: 'team',
    duration: 90,
    description: 'Team Plan - 90 Days'
  },
  'WELCOME10': {
    plan: 'pro',
    duration: 10,
    description: 'Welcome Pro - 10 Days'
  },
  'GIFT-PRO-365': {
    plan: 'pro',
    duration: 365,
    description: 'Pro Plan - 1 Year'
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = (session.user as any).id;
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code is required' });
  }

  try {
    const normalizedCode = code.trim().toUpperCase();

    const giftCode = GIFT_CODES[normalizedCode as keyof typeof GIFT_CODES];
    
    if (!giftCode) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    // Check if code already used
    const { data: existingRedemption } = await supabase
      .from('redeemed_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code', normalizedCode)
      .single();

    if (existingRedemption) {
      return res.status(400).json({ message: 'Code already redeemed' });
    }

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + giftCode.duration);

    // Update user's plan
    const { error: updateError } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        plan: giftCode.plan,
        plan_expiry: expiryDate.toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (updateError) {
      console.error('Error updating plan:', updateError);
      return res.status(500).json({ message: 'Failed to redeem code' });
    }

    // Record the redemption
    const { error: recordError } = await supabase
      .from('redeemed_codes')
      .insert({
        user_id: userId,
        code: normalizedCode,
        plan: giftCode.plan,
        duration: giftCode.duration,
        redeemed_at: new Date().toISOString(),
      });

    if (recordError) {
      console.error('Error recording redemption:', recordError);
    }

    return res.status(200).json({
      message: `Success! ${giftCode.description} activated!`,
      plan: giftCode.plan,
      expiryDate: expiryDate.toISOString(),
    });

  } catch (error) {
    console.error('Redeem error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}