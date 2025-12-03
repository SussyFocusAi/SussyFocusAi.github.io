// src/components/sections/CTASection.tsx
import React, { useState } from 'react';
import { TrendingUp, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if Supabase is configured
    if (!supabase) {
      setStatus('error');
      setErrorMessage('Configuration error. Please contact support.');
      return;
    }
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const { data, error } = await supabase
        .from('waitlist')
        .insert([
          { 
            email: email.toLowerCase().trim(),
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        
        // Handle specific error codes
        if (error.code === '23505') {
          setStatus('error');
          setErrorMessage('This email is already on the waitlist! 🎉');
        } else if (error.code === '42501' || error.message.includes('row-level security')) {
          setStatus('error');
          setErrorMessage('Database permission error. Please contact support.');
          console.error('RLS ERROR: You need to create a policy in Supabase. See console for details.');
          console.error('Run this SQL in Supabase SQL Editor:');
          console.error(`
            ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY "Allow public waitlist signups"
            ON waitlist
            FOR INSERT
            TO anon
            WITH CHECK (true);
          `);
        } else {
          setStatus('error');
          setErrorMessage('Something went wrong. Please try again.');
        }
      } else {
        setStatus('success');
        setEmail('');
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          if (status === 'success') setStatus('idle');
        }, 5000);
      }
    } catch (err) {
      console.error('Network error:', err);
      setStatus('error');
      setErrorMessage('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="space-y-6 sm:space-y-8">
          <TrendingUp className="w-12 sm:w-16 h-12 sm:h-16 mx-auto text-purple-300 animate-bounce" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">Stop Procrastinating</span>?
          </h2>
          <p className="text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto px-4">
            Join thousands of students and professionals who've transformed their productivity and achieved their biggest goals with FocusAI
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus('idle');
                setErrorMessage('');
              }}
              disabled={isLoading || status === 'success'}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button 
              type="submit"
              disabled={isLoading || status === 'success'}
              className="whitespace-nowrap font-semibold transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-900 rounded-xl hover:bg-gray-100"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Joining...
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Joined!
                </>
              ) : (
                <>
                  Start Your Journey 
                  <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
                </>
              )}
            </button>
          </form>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="flex items-center justify-center gap-2 text-green-300 animate-fade-in">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm sm:text-base">🎉 You're on the list! Check your email for updates.</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex items-center justify-center gap-2 text-red-300 animate-fade-in">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm sm:text-base">{errorMessage}</p>
            </div>
          )}

          {status === 'idle' && (
            <div className="text-xs sm:text-sm text-purple-200">
              ✨ 14-day free trial • No credit card required • Cancel anytime
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}