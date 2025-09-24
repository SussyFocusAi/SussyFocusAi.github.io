import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password, name } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password: hash, name }])
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: 'User created', user: data });
}
