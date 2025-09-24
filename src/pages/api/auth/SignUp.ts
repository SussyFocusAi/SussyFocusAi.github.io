// src/pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  const { data, error } = await supabaseAdmin.from('users').insert([
    { name, email, password }
  ]);

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ message: 'Database error' });
  }

  res.status(200).json({ message: 'User created', user: data[0] });
}
