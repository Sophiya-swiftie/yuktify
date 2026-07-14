"use client";

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setSuccess(true);
      setEmail('');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to send password reset email.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      {/* Back Link */}
      <Link 
        href="/auth" 
        className="absolute left-6 top-6 flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Login
      </Link>

      <div className="w-full max-w-md glass-card p-8 border border-border/80 shadow-2xl relative">
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="w-8 h-8 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <defs>
                <linearGradient id="purple-blue-forgot" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="cyan-magenta-forgot" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <path d="M32 24 L18 38 L32 52" stroke="url(#purple-blue-forgot)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 38 L50 62" stroke="url(#purple-blue-forgot)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M68 24 L82 38 L68 52" stroke="url(#cyan-magenta-forgot)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M82 38 L50 62" stroke="url(#cyan-magenta-forgot)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M50 62 L50 86" stroke="url(#purple-blue-forgot)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="50" cy="62" r="5" fill="#FFFFFF" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white uppercase tracking-wider">YUKTIFY</span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Forgot Password</h2>
          <p className="text-xs text-white/50 max-w-xs mx-auto">
            Enter your account email below, and we will send you a secure link to reset your password.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 mb-4 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-500 font-medium">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 mb-4 rounded-xl border border-green-500/20 bg-green-500/10 text-xs text-green-400 font-medium text-center">
            Password reset link sent! Check your email inbox to proceed.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Email Address</label>
            <input
              id="reset-email"
              type="email"
              required
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet transition-all focus:ring-1 focus:ring-accent-violet"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
