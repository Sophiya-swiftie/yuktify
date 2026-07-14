"use client";

import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { X, ShieldAlert, Sparkles, Trophy, BookMarked } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const AuthRequiredModal: React.FC = () => {
  const { authModalOpen, authModalMessage, closeAuthModal } = useAuth();
  const router = useRouter();

  if (!authModalOpen) return null;

  const handleSignInClick = () => {
    closeAuthModal();
    router.push('/auth');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button 
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-violet/10 text-accent-violet">
          <ShieldAlert size={24} />
        </div>

        {/* Title */}
        <h3 className="text-center text-lg font-bold text-white mb-2">
          Authentication Required
        </h3>

        {/* Message */}
        <p className="text-center text-sm text-white/60 mb-6 leading-relaxed">
          {authModalMessage}
        </p>

        {/* Premium Benefits List */}
        <div className="space-y-3 mb-6 bg-black/20 p-4 rounded-xl border border-border/50 text-xs">
          <div className="flex items-center gap-3 text-white/80">
            <BookMarked size={16} className="text-accent-cyan shrink-0" />
            <span>Save and sync bookmarks across devices</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <Trophy size={16} className="text-accent-orange shrink-0" />
            <span>Track attempted and solved coding statuses</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <Sparkles size={16} className="text-accent-violet shrink-0" />
            <span>Personalize your prep roadmap with AI</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button 
            onClick={handleSignInClick}
            className="w-full btn-primary"
          >
            Sign In / Create Account
          </button>
          <button 
            onClick={closeAuthModal}
            className="w-full py-2.5 text-sm font-semibold text-white/40 hover:text-white transition-colors rounded-xl hover:bg-white/5"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
