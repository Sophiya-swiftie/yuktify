"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search...", 
  value, 
  onChange,
  className 
}) => {
  return (
    <div className={cn("relative group", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-accent-violet transition-colors">
        <Search size={18} />
      </div>
      <input
        type="text"
        suppressHydrationWarning
        className="block w-full pl-10 pr-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent-violet transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
