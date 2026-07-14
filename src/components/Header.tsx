"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bookmark, LogOut, LayoutDashboard, LogIn, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const Header: React.FC = () => {
  const { user, profile, bookmarks, openAuthModal, setMobileSidebarOpen } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const getInitials = () => {
    if (!user) return 'G';
    const name = profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'U';
    return name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    if (!user) return 'Guest User';
    return profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  };

  const handleBookmarkHeaderClick = () => {
    if (!user) {
      openAuthModal('Sign in to view and synchronize your bookmarked questions!');
    } else {
      router.push('/profile');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu Toggle on Mobile */}
        <button 
          onClick={() => setMobileSidebarOpen(true)}
          suppressHydrationWarning
          className="p-2 rounded-lg text-white/60 hover:bg-surface hover:text-white transition-colors cursor-pointer md:hidden"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>

        <Link href="/" className="flex items-center">
          <h1 className="text-xl font-black accent-text">YUKTIFY</h1>
        </Link>
        <div className="hidden h-6 w-[1px] bg-border sm:block"></div>
        <p className="hidden text-sm text-white/50 sm:block font-medium">Master Coding and Interview</p>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Bookmarks Icon */}
        <button 
          onClick={handleBookmarkHeaderClick}
          suppressHydrationWarning
          className="relative rounded-full p-2 text-white/60 hover:bg-surface hover:text-white transition-colors cursor-pointer"
          title="View Bookmarks"
        >
          <Bookmark size={20} />
          {bookmarks.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-violet text-[9px] font-bold text-white">
              {bookmarks.length}
            </span>
          )}
        </button>

        {/* User Auth Controls */}
        {!user ? (
          <Link 
            href="/auth" 
            className="flex items-center gap-2 rounded-xl bg-surface border border-border px-4 py-1.5 hover:border-accent-violet hover:bg-surface/80 transition-all text-sm font-semibold text-white/90"
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-xl bg-surface border border-border px-3 py-1.5 hover:border-accent-violet transition-all cursor-pointer focus:outline-none"
            >
              <div className="h-6 w-6 rounded-full bg-accent-gradient flex items-center justify-center text-white text-[10px] font-black overflow-hidden shrink-0 border border-white/10">
                {profile?.avatar_url || user.user_metadata?.avatar_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={profile?.avatar_url || user.user_metadata?.avatar_url} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials()
                )}
              </div>
              <span className="max-w-[120px] truncate text-sm font-semibold text-white/80">{getDisplayName()}</span>
              <ChevronDown size={14} className={`text-white/40 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-border bg-surface p-2 shadow-2xl animate-slide-in">
                <Link 
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <LayoutDashboard size={15} className="text-accent-violet" />
                  <span>Profile Dashboard</span>
                </Link>
                
                <Link 
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Bookmark size={15} className="text-accent-cyan" />
                  <span>My Bookmarks</span>
                </Link>

                <div className="my-1 border-t border-border" />

                <button 
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
