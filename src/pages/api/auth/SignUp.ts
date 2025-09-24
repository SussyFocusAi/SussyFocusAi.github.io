// src/pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '' // Use service key for server-side insert
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    // Check if user already exists
    const { data: existingUser, error: selectError } = await supabase
      .from('Users')
      .select('*')
      .eq('email', email)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      return res.status(500).json({ error: 'Database error', details: selectError });
    }

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into Supabase
    const { data, error: insertError } = await supabase
      .from('Users')
      .insert({
        name,
        email,
        password: hashedPassword,
      })
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: 'Failed to create user', details: insertError });
    }

    return res.status(201).json({ message: 'User created successfully', user: data });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
