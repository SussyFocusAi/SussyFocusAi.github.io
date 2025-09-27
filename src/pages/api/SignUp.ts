// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Add this to prevent NextAuth from intercepting
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    // Check if environment variables exist
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables')
      return res.status(500).json({ message: 'Server configuration error' })
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name }
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
      return res.status(400).json({ 
        message: authError.message === 'User already registered' 
          ? 'User already exists with this email'
          : authError.message || 'Account creation failed'
      })
    }

    return res.status(201).json({ 
      message: 'User created successfully',
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        name: name
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}