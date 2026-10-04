"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <div className="sticky bottom-0 w-full p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <form 
          onSubmit={handleSubmit}
          className="relative group bg-input-bg border border-border shadow-soft focus-within:shadow-glow focus-within:border-accent-violet/50 rounded-[22px] transition-all duration-300 p-2"
        >
          <div className="absolute -top-10 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/90 border border-border text-[10px] text-text-sec uppercase tracking-widest font-bold backdrop-blur-md shadow-sm">
            <Sparkles size={12} className="text-accent-cyan" />
            Ask YUKTIFY AI anything
          </div>
          
          <div className="flex items-end gap-2 px-3">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Explain Time Complexity of Quick Sort or give a System Design for Uber..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-foreground placeholder-text-mut py-3 resize-none scrollbar-none text-sm md:text-base outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              suppressHydrationWarning
              className="mb-1 p-2.5 rounded-[14px] bg-accent-gradient text-white disabled:opacity-20 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-glow cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-[10px] text-text-mut/70">
          YUKTIFY AI may provide helpful but imperfect technical guidance. Always verify complex architectural patterns.
        </p>
      </div>
    </div>
  );
};
