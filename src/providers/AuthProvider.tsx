"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export type UserProgressStatus = 'not_started' | 'attempted' | 'solved' | 'revision';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  bookmarks: string[];
  recentlyViewed: string[];
  progress: Record<string, UserProgressStatus>;
  toggleBookmark: (questionId: string) => Promise<void>;
  isBookmarked: (questionId: string) => boolean;
  addRecentlyViewed: (questionId: string) => Promise<void>;
  updateProgress: (questionId: string, status: UserProgressStatus) => Promise<void>;
  refreshAuth: () => Promise<void>;
  authModalOpen: boolean;
  authModalMessage: string;
  openAuthModal: (message?: string) => void;
  closeAuthModal: () => void;
  isSupabaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, UserProgressStatus>>({});

  // Auth modal blocker state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');

  const supabase = createClient();

  const openAuthModal = (message?: string) => {
    setAuthModalMessage(message || 'Please sign in to save your progress.');
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthModalMessage('');
  };

  const isBookmarked = (questionId: string) => {
    return bookmarks.includes(questionId);
  };

  // Helper to load guest data from LocalStorage
  const loadGuestData = useCallback(() => {
    try {
      const localBookmarks = JSON.parse(localStorage.getItem('yuktify_bookmarks') || '[]');
      const localRecent = JSON.parse(localStorage.getItem('yuktify_recent') || '[]');
      const localProgress = JSON.parse(localStorage.getItem('yuktify_progress') || '{}');
      setBookmarks(localBookmarks);
      setRecentlyViewed(localRecent);
      setProgress(localProgress);
    } catch (e) {
      console.error('Failed to load guest data', e);
    }
  }, []);

  // Helper to save guest recent to LocalStorage
  const saveGuestRecent = (updated: string[]) => {
    localStorage.setItem('yuktify_recent', JSON.stringify(updated));
  };

  // Synchronize/Merge LocalStorage data to Supabase upon logging in
  const mergeLocalStorageToDatabase = useCallback(async (userId: string) => {
    try {
      // 1. Merge bookmarks
      const localBookmarks = JSON.parse(localStorage.getItem('yuktify_bookmarks') || '[]');
      if (localBookmarks.length > 0) {
        for (const qId of localBookmarks) {
          await supabase
            .from('bookmarks')
            .upsert({ user_id: userId, question_id: qId }, { onConflict: 'user_id,question_id' });
        }
        localStorage.removeItem('yuktify_bookmarks');
      }

      // 2. Merge recently viewed
      const localRecent = JSON.parse(localStorage.getItem('yuktify_recent') || '[]');
      if (localRecent.length > 0) {
        for (const qId of localRecent) {
          await supabase
            .from('recently_viewed')
            .upsert({ user_id: userId, question_id: qId }, { onConflict: 'user_id,question_id' });
        }
        localStorage.removeItem('yuktify_recent');
      }

      // 3. Merge progress
      const localProgress = JSON.parse(localStorage.getItem('yuktify_progress') || '{}');
      if (Object.keys(localProgress).length > 0) {
        for (const [qId, status] of Object.entries(localProgress)) {
          await supabase
            .from('user_progress')
            .upsert({ 
              user_id: userId, 
              question_id: qId, 
              status: status,
              solved_at: status === 'solved' ? new Date().toISOString() : null
            }, { onConflict: 'user_id,question_id' });
        }
        localStorage.removeItem('yuktify_progress');
      }
    } catch (e) {
      console.error('Error merging local storage to database:', e);
    }
  }, [supabase]);

  // Refresh user data from Supabase
  const loadUserData = useCallback(async (currentUser: User) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      
      setProfile(profileData || null);

      // Fetch bookmarks
      const { data: dbBookmarks } = await supabase
        .from('bookmarks')
        .select('question_id')
        .eq('user_id', currentUser.id);
      
      setBookmarks(dbBookmarks ? dbBookmarks.map(b => b.question_id) : []);

      // Fetch recently viewed
      const { data: dbRecent } = await supabase
        .from('recently_viewed')
        .select('question_id')
        .eq('user_id', currentUser.id)
        .order('viewed_at', { ascending: false });
      
      setRecentlyViewed(dbRecent ? dbRecent.map(r => r.question_id) : []);

      // Fetch progress
      const { data: dbProgress } = await supabase
        .from('user_progress')
        .select('question_id, status')
        .eq('user_id', currentUser.id);
      
      const progressMap: Record<string, UserProgressStatus> = {};
      if (dbProgress) {
        dbProgress.forEach(p => {
          progressMap[p.question_id] = p.status as UserProgressStatus;
        });
      }
      setProgress(progressMap);
    } catch (e) {
      console.error('Error loading user data:', e);
    }
  }, [supabase]);

  const refreshAuth = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user || null;
    setUser(currentUser);

    if (currentUser) {
      // Merge guest local storage first
      await mergeLocalStorageToDatabase(currentUser.id);
      // Fetch database states
      await loadUserData(currentUser);
    } else {
      setProfile(null);
      loadGuestData();
    }
    setLoading(false);
  }, [supabase, mergeLocalStorageToDatabase, loadUserData, loadGuestData]);

  useEffect(() => {
    // Defer the initial auth call to the next microtask/render tick
    // to prevent cascading render Warnings on state-in-effect
    const timer = setTimeout(() => {
      refreshAuth();
    }, 0);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        await mergeLocalStorageToDatabase(currentUser.id);
        await loadUserData(currentUser);
      } else {
        setProfile(null);
        loadGuestData();
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [loadUserData, mergeLocalStorageToDatabase, refreshAuth, loadGuestData, supabase.auth]);

  // Action: Toggle Bookmark
  const toggleBookmark = async (questionId: string) => {
    if (!user) {
      openAuthModal('Sign in to bookmark questions and save them to your account.');
      return;
    }

    // Auth behavior
    const isCurrentlyBookmarked = bookmarks.includes(questionId);
    // Optimistic UI update
    setBookmarks(prev => 
      isCurrentlyBookmarked ? prev.filter(id => id !== questionId) : [...prev, questionId]
    );

    try {
      if (isCurrentlyBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('question_id', questionId);
      } else {
        await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, question_id: questionId });
      }
    } catch (e) {
      console.error('Error toggling database bookmark:', e);
      // Revert optimistic update
      setBookmarks(prev => 
        isCurrentlyBookmarked ? [...prev, questionId] : prev.filter(id => id !== questionId)
      );
    }
  };

  // Action: Add Recently Viewed
  const addRecentlyViewed = async (questionId: string) => {
    if (!user) {
      // Guest behavior
      const filtered = recentlyViewed.filter(id => id !== questionId);
      const updated = [questionId, ...filtered].slice(0, 5);
      setRecentlyViewed(updated);
      saveGuestRecent(updated);
      return;
    }

    // Auth behavior
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== questionId);
      return [questionId, ...filtered].slice(0, 5);
    });

    try {
      await supabase
        .from('recently_viewed')
        .upsert(
          { user_id: user.id, question_id: questionId, viewed_at: new Date().toISOString() },
          { onConflict: 'user_id,question_id' }
        );
    } catch (e) {
      console.error('Error adding database recently viewed:', e);
    }
  };

  // Action: Update Progress Status
  const updateProgress = async (questionId: string, status: UserProgressStatus) => {
    if (!user) {
      openAuthModal('Sign in to update your solved status and track learning progress.');
      return;
    }

    // Auth behavior
    setProgress(prev => ({ ...prev, [questionId]: status }));

    try {
      if (status === 'not_started') {
        await supabase
          .from('user_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('question_id', questionId);
      } else {
        await supabase
          .from('user_progress')
          .upsert({ 
            user_id: user.id, 
            question_id: questionId, 
            status: status,
            solved_at: status === 'solved' ? new Date().toISOString() : null
          }, { onConflict: 'user_id,question_id' });
      }
    } catch (e) {
      console.error('Error updating progress in database:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        bookmarks,
        recentlyViewed,
        progress,
        toggleBookmark,
        isBookmarked,
        addRecentlyViewed,
        updateProgress,
        refreshAuth,
        authModalOpen,
        authModalMessage,
        openAuthModal,
        closeAuthModal,
        isSupabaseConfigured: Boolean(
          process.env.NEXT_PUBLIC_SUPABASE_URL && 
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        )
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
