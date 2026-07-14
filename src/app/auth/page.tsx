"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthPage() {
  const { isSupabaseConfigured } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInError, setSignInError] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.push('/');
      }
    };
    checkUser();
  }, [router, supabase]);

  const handleGoogleSignIn = async () => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to sign in with Google';
      if (activeTab === 'signin') {
        setSignInError(errMsg);
      } else {
        setSignUpError(errMsg);
      }
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');
    if (!signInEmail || !signInPassword) {
      setSignInError('Please fill in all fields.');
      return;
    }
    setSignInLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      });

      if (error) throw error;
      router.push('/');
      router.refresh();
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Invalid email or password.';
      setSignInError(errMsg);
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');
    setSignUpSuccess(false);

    if (!signUpName || !signUpEmail || !signUpPassword || !signUpConfirmPassword) {
      setSignUpError('Please fill in all fields.');
      return;
    }

    if (signUpPassword.length < 6) {
      setSignUpError('Password must be at least 6 characters.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError('Passwords do not match.');
      return;
    }

    setSignUpLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          data: {
            full_name: signUpName,
          },
        },
      });

      if (error) throw error;
      setSignUpSuccess(true);
      // Reset signup fields
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPassword('');
      setSignUpConfirmPassword('');
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to create your account.';
      setSignUpError(errMsg);
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground animate-fade-in">
      {/* Back to Home Button */}
      <Link 
        href="/"
        className="absolute left-6 top-6 z-50 flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Prep
      </Link>

      {/* LEFT SIDE (Branding & Logo) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-black/40 p-12 lg:flex border-r border-border overflow-hidden">
        {/* Violet-to-cyan glow backdrops */}
        <div className="absolute -left-1/4 -top-1/4 h-[80%] w-[80%] rounded-full bg-accent-violet/15 blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-1/4 -right-1/4 h-[80%] w-[80%] rounded-full bg-accent-cyan/10 blur-[150px] animate-pulse" style={{ animationDuration: '12s' }} />

        {/* Top Header */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <defs>
                <linearGradient id="purple-blue-auth" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="cyan-magenta-auth" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <path d="M32 24 L18 38 L32 52" stroke="url(#purple-blue-auth)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 38 L50 62" stroke="url(#purple-blue-auth)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M68 24 L82 38 L68 52" stroke="url(#cyan-magenta-auth)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M82 38 L50 62" stroke="url(#cyan-magenta-auth)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M50 62 L50 86" stroke="url(#purple-blue-auth)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="50" cy="62" r="5" fill="#FFFFFF" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider text-white uppercase leading-none mb-1">YUKTIFY</span>
            <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase leading-none">Master Coding. Ace Interviews.</span>
          </div>
        </div>

        {/* Content */}
        <div className="my-auto z-10 max-w-lg space-y-6">
          <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
            Your interview prep.<br />
            <span className="accent-text">Finally organized.</span>
          </h1>
          <p className="text-base text-white/50 leading-relaxed">
            Practice company-wise questions, master verified code solutions, track your progress status, and prepare smarter with interactive AI feedback.
          </p>
        </div>

        {/* Footer */}
        <div className="text-xs text-white/20 z-10">
          &copy; {new Date().getFullYear()} YUKTIFY Platform. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE (Authentication Card) */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2 relative overflow-hidden">
        {/* Glow backdrop for mobile */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-accent-violet/10 blur-[120px] animate-pulse" />
        
        <div className="w-full max-w-md glass-card p-8 border border-border/80 shadow-2xl relative z-10">
          {/* Logo visible on mobile only */}
          <div className="flex flex-col items-center justify-center mb-8 lg:hidden">
            <div className="w-12 h-12 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <defs>
                  <linearGradient id="purple-blue-auth-mb" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                  <linearGradient id="cyan-magenta-auth-mb" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22D3EE" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
                <path d="M32 24 L18 38 L32 52" stroke="url(#purple-blue-auth-mb)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 38 L50 62" stroke="url(#purple-blue-auth-mb)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M68 24 L82 38 L68 52" stroke="url(#cyan-magenta-auth-mb)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M82 38 L50 62" stroke="url(#cyan-magenta-auth-mb)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M50 62 L50 86" stroke="url(#purple-blue-auth-mb)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="50" cy="62" r="5" fill="#FFFFFF" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-wider text-white uppercase mb-1">YUKTIFY</span>
            <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase text-center">Master Coding. Ace Interviews.</span>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border mb-6">
            <button
              onClick={() => { setActiveTab('signin'); setSignInError(''); }}
              suppressHydrationWarning
              className={`w-1/2 pb-3 text-sm font-bold tracking-wider uppercase border-b-2 transition-all focus:outline-none ${
                activeTab === 'signin'
                  ? 'border-accent-violet text-white'
                  : 'border-transparent text-white/40 hover:text-white/60'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setSignUpError(''); }}
              suppressHydrationWarning
              className={`w-1/2 pb-3 text-sm font-bold tracking-wider uppercase border-b-2 transition-all focus:outline-none ${
                activeTab === 'signup'
                  ? 'border-accent-violet text-white'
                  : 'border-transparent text-white/40 hover:text-white/60'
              }`}
            >
              Create Account
            </button>
          </div>

          {!isSupabaseConfigured && (
            <div className="flex items-start gap-2.5 p-3.5 mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/10 text-xs text-yellow-500 font-medium leading-relaxed">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>
                <strong>Supabase not configured:</strong> Please configure your Supabase URL and Anon Key in <code>.env.local</code> to enable authentication and synchronization features.
              </span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {activeTab === 'signin' && (
            <div className="animate-slide-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
                <p className="text-xs text-white/40">Sign in with email or password to continue</p>
              </div>

              {signInError && (
                <div className="flex items-center gap-2 p-3.5 mb-4 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-500 font-medium">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{signInError}</span>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label htmlFor="signin-email" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Email</label>
                  <input
                    id="signin-email"
                    type="email"
                    required
                    disabled={!isSupabaseConfigured}
                    suppressHydrationWarning
                    placeholder="name@company.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet transition-all focus:ring-1 focus:ring-accent-violet disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="signin-password" className="block text-xs font-semibold text-white/50 uppercase tracking-wider">Password</label>
                    <Link href="/forgot-password" className="text-xs text-accent-cyan hover:underline">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <input
                      id="signin-password"
                      type={showSignInPassword ? 'text' : 'password'}
                      required
                      disabled={!isSupabaseConfigured}
                      suppressHydrationWarning
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 bg-surface border border-border rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet transition-all focus:ring-1 focus:ring-accent-violet disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      disabled={!isSupabaseConfigured}
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      suppressHydrationWarning
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={signInLoading || !isSupabaseConfigured}
                  suppressHydrationWarning
                  className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {signInLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* SIGN UP FORM */}
          {activeTab === 'signup' && (
            <div className="animate-slide-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">Create your account</h2>
                <p className="text-xs text-white/40">Enter your details below to setup your profile</p>
              </div>

              {signUpError && (
                <div className="flex items-center gap-2 p-3.5 mb-4 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-500 font-medium">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{signUpError}</span>
                </div>
              )}

              {signUpSuccess && (
                <div className="p-3.5 mb-4 rounded-xl border border-green-500/20 bg-green-500/10 text-xs text-green-400 font-medium">
                  Account created successfully! Check your email inbox to verify and confirm your account.
                </div>
              )}

              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label htmlFor="signup-name" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    id="signup-name"
                    type="text"
                    required
                    disabled={!isSupabaseConfigured}
                    suppressHydrationWarning
                    placeholder="Alex Johnson"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet transition-all focus:ring-1 focus:ring-accent-violet disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Email</label>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    disabled={!isSupabaseConfigured}
                    suppressHydrationWarning
                    placeholder="alex@company.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet transition-all focus:ring-1 focus:ring-accent-violet disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      disabled={!isSupabaseConfigured}
                      suppressHydrationWarning
                      placeholder="•••••••• (Min 6 chars)"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 bg-surface border border-border rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet transition-all focus:ring-1 focus:ring-accent-violet disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      disabled={!isSupabaseConfigured}
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      suppressHydrationWarning
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {showSignUpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-confirm" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      id="signup-confirm"
                      type={showSignUpConfirmPassword ? 'text' : 'password'}
                      required
                      disabled={!isSupabaseConfigured}
                      suppressHydrationWarning
                      placeholder="••••••••"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 bg-surface border border-border rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet transition-all focus:ring-1 focus:ring-accent-violet disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      disabled={!isSupabaseConfigured}
                      onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                      suppressHydrationWarning
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {showSignUpConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={signUpLoading || !isSupabaseConfigured}
                  suppressHydrationWarning
                  className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {signUpLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-white/30 font-semibold tracking-wider">or continue with</span>
            </div>
          </div>

          {/* OAuth button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={!isSupabaseConfigured}
            suppressHydrationWarning
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-surface hover:bg-surface/80 border border-border text-sm text-white font-semibold rounded-xl transition-all hover:border-accent-violet active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Footer Navigation */}
          <div className="text-center mt-6">
            <span className="text-xs text-white/30">
              {activeTab === 'signin' ? (
                <>
                  New to YUKTIFY?{' '}
                  <button 
                    onClick={() => { setActiveTab('signup'); setSignInError(''); }}
                    suppressHydrationWarning
                    className="text-accent-cyan hover:underline font-medium"
                  >
                    Create account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => { setActiveTab('signin'); setSignUpError(''); }}
                    suppressHydrationWarning
                    className="text-accent-cyan hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
