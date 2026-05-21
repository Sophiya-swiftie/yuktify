import React from 'react';
import { Bell, Bookmark, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold accent-text">YUKTIFY</h1>
        <div className="hidden h-6 w-[1px] bg-border sm:block"></div>
        <p className="hidden text-sm text-white/50 sm:block">Master Coding and Interview</p>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          suppressHydrationWarning
          className="rounded-full p-2 text-white/60 hover:bg-surface hover:text-white transition-colors"
        >
          <Bookmark size={20} />
        </button>
        <button 
          suppressHydrationWarning
          className="rounded-full p-2 text-white/60 hover:bg-surface hover:text-white transition-colors"
        >
          <Bell size={20} />
        </button>
        <button 
          suppressHydrationWarning
          className="flex items-center gap-2 rounded-full bg-surface border border-border px-3 py-1.5 hover:border-accent-violet transition-all"
        >
          <div className="h-6 w-6 rounded-full bg-accent-gradient flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <span className="text-sm font-medium text-white/80">Guest User</span>
        </button>
      </div>
    </header>
  );
};
