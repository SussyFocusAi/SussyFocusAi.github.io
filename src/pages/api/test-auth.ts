// src/pages/api/test-auth.ts
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: req.body.email,
    password: req.body.password
  })
  
  res.json({ success: !error, error: error?.message, user: data.user?.email })
}