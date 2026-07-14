"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth');
      }, 3000);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to update your password.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md glass-card p-8 border border-border/80 shadow-2xl relative">
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="w-8 h-8 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <defs>
                <linearGradient id="purple-blue-reset" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="cyan-magenta-reset" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <path d="M32 24 L18 38 L32 52" stroke="url(#purple-blue-reset)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 38 L50 62" stroke="url(#purple-blue-reset)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M68 24 L82 38 L68 52" stroke="url(#cyan-magenta-reset)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M82 38 L50 62" stroke="url(#cyan-magenta-reset)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M50 62 L50 86" stroke="url(#purple-blue-reset)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="50" cy="62" r="5" fill="#FFFFFF" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white uppercase tracking-wider">YUKTIFY</span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-xs text-white/50">
            Create a strong new password for your account below.
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
            Password updated successfully! Redirecting you to sign in...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">New Password</label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="•••••••• (Min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-surface border border-border rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet transition-all focus:ring-1 focus:ring-accent-violet"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-new-password" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                id="confirm-new-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-surface border border-border rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet transition-all focus:ring-1 focus:ring-accent-violet"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Updating Password...
              </>
            ) : (
              'Save Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
