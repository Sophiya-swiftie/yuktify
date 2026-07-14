"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useAuth } from '@/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { User, Trophy, BrainCircuit, Calendar, PenLine, Save, Loader2, Bookmark, CheckCircle2, History } from 'lucide-react';
import { sdePool, frontendPool, backendPool } from '@/data/questionPool';

export default function ProfilePage() {
  const { user, profile, bookmarks, progress, recentlyViewed, refreshAuth } = useAuth();
  const [fullName, setFullName] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const supabase = createClient();

  // Load profile name when loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      if (profile) {
        setFullName(profile.full_name || '');
      } else if (user) {
        setFullName(user.user_metadata?.full_name || user.user_metadata?.name || '');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [profile, user]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-white">
        <Loader2 className="animate-spin text-accent-violet" size={32} />
      </div>
    );
  }

  // Calculate statistics
  const totalQuestions = sdePool.length + frontendPool.length + backendPool.length;
  const bookmarkedCount = bookmarks.length;
  const recentCount = recentlyViewed.length;
  
  // Progress calculations
  const progressEntries = Object.entries(progress);
  const solvedCount = progressEntries.filter(([, status]) => status === 'solved').length;
  const attemptedCount = progressEntries.filter(([, status]) => status === 'attempted').length;
  const revisionCount = progressEntries.filter(([, status]) => status === 'revision').length;

  const solvedPercentage = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');
    setError('');

    try {
      // 1. Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // 2. Update user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (authError) throw authError;

      await refreshAuth();
      setMessage('Profile updated successfully!');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to update profile.';
      setError(errMsg);
    } finally {
      setUpdating(false);
    }
  };

  // Helper for initials
  const getInitials = () => {
    const name = fullName || user.email || 'U';
    return name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header />

        <div className="flex-1 overflow-y-auto scrollbar-custom px-6 pb-32">
          <div className="max-w-4xl mx-auto pt-8">
            <h1 className="text-3xl font-black text-white mb-8 tracking-tight">Your Dashboard</h1>

            {/* Profile Info & Edit Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2 glass-card p-6 border border-border/80 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <User size={18} className="text-accent-violet" />
                    Account Details
                  </h2>
                  
                  {message && (
                    <div className="p-3 mb-4 rounded-xl border border-green-500/20 bg-green-500/10 text-xs text-green-400 font-medium">
                      {message}
                    </div>
                  )}
                  {error && (
                    <div className="p-3 mb-4 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-400 font-medium">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Email Address</label>
                      <input 
                        type="text" 
                        disabled 
                        value={user.email || ''} 
                        className="w-full px-4 py-2.5 bg-surface/30 border border-border/50 rounded-xl text-sm text-white/50 cursor-not-allowed focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Display Name</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          required
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full pl-4 pr-12 py-2.5 bg-surface border border-border rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet transition-all focus:ring-1 focus:ring-accent-violet"
                        />
                        <PenLine size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={updating}
                      className="btn-primary py-2 px-6 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {updating ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Profile Avatar & Metadata */}
              <div className="glass-card p-6 border border-border/80 flex flex-col items-center justify-center text-center">
                <div className="relative mb-4">
                  {profile?.avatar_url || user.user_metadata?.avatar_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={profile?.avatar_url || user.user_metadata?.avatar_url} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full border-2 border-accent-violet object-cover shadow-xl"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-accent-gradient flex items-center justify-center text-white text-3xl font-black border-2 border-accent-violet shadow-xl">
                      {getInitials()}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{fullName || 'User'}</h3>
                <p className="text-xs text-white/40 mb-4">{user.email}</p>
                <div className="flex items-center gap-1.5 text-xs text-white/30 bg-surface px-3 py-1 rounded-full border border-border">
                  <Calendar size={12} />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Performance & Metrics Grid */}
            <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Interview Prep Progress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {/* Solved */}
              <div className="glass-card p-5 border border-border/80 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 text-green-500/10 group-hover:text-green-500/20 transition-colors">
                  <CheckCircle2 size={48} />
                </div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Solved</p>
                <p className="text-3xl font-black text-white">{solvedCount}</p>
                <p className="text-[10px] text-white/30 mt-2">Questions completed</p>
              </div>

              {/* Attempted */}
              <div className="glass-card p-5 border border-border/80 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 text-accent-cyan/10 group-hover:text-accent-cyan/20 transition-colors">
                  <BrainCircuit size={48} />
                </div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Attempted</p>
                <p className="text-3xl font-black text-white">{attemptedCount}</p>
                <p className="text-[10px] text-white/30 mt-2">In progress</p>
              </div>

              {/* Revision */}
              <div className="glass-card p-5 border border-border/80 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 text-accent-orange/10 group-hover:text-accent-orange/20 transition-colors">
                  <Trophy size={48} />
                </div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Revision</p>
                <p className="text-3xl font-black text-white">{revisionCount}</p>
                <p className="text-[10px] text-white/30 mt-2">Marked for review</p>
              </div>

              {/* Bookmarked */}
              <div className="glass-card p-5 border border-border/80 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 text-accent-violet/10 group-hover:text-accent-violet/20 transition-colors">
                  <Bookmark size={48} />
                </div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Bookmarks</p>
                <p className="text-3xl font-black text-white">{bookmarkedCount}</p>
                <p className="text-[10px] text-white/30 mt-2">Saved questions</p>
              </div>
            </div>

            {/* Overall Solving Progress Bar */}
            <div className="glass-card p-6 border border-border/80 mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-md font-bold text-white">Overall Platform Mastery</h3>
                  <p className="text-xs text-white/40">Mastery is calculated across all core questions</p>
                </div>
                <span className="text-2xl font-black text-accent-cyan">{solvedPercentage}%</span>
              </div>
              <div className="w-full bg-surface border border-border rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-accent-gradient h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.max(solvedPercentage, 2)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-white/30 mt-2">
                <span>0 Questions</span>
                <span>{solvedCount} of {totalQuestions} Solved</span>
                <span>{totalQuestions} Max Pool</span>
              </div>
            </div>

            {/* Recently Viewed Grid */}
            <div className="glass-card p-6 border border-border/80">
              <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                <History size={16} className="text-accent-cyan" />
                Recently Visited Paths
              </h3>
              {recentCount > 0 ? (
                <div className="space-y-3">
                  {recentlyViewed.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-surface/50 border border-border/50">
                      <span className="text-sm font-semibold text-white capitalize">{item.replace(/-/g, ' ')}</span>
                      <a 
                        href={`/company/${item}?role=SDE`}
                        className="text-xs text-accent-cyan hover:underline"
                      >
                        Launch Prep
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/30 italic text-center py-4">No recent history. Pick a company to begin practicing!</p>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
