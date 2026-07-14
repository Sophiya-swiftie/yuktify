"use client";

import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface ChatBoxProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const TypewriterMarkdown: React.FC<{ content: string; enabled: boolean }> = ({
  content,
  enabled,
}) => {
  const [visibleLength, setVisibleLength] = React.useState(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let index = 0;
    const interval = window.setInterval(() => {
      index += Math.max(2, Math.ceil(content.length / 140));
      setVisibleLength(Math.min(index, content.length));

      if (index >= content.length) {
        window.clearInterval(interval);
      }
    }, 16);

    return () => window.clearInterval(interval);
  }, [content, enabled]);

  const visibleContent = enabled ? content.slice(0, visibleLength) : content;

  return <ReactMarkdown>{visibleContent}</ReactMarkdown>;
};

export const ChatBox: React.FC<ChatBoxProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center opacity-40">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4 p-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="purple-blue-welcome" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="cyan-magenta-welcome" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
            <path d="M32 24 L18 38 L32 52" stroke="url(#purple-blue-welcome)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 38 L50 62" stroke="url(#purple-blue-welcome)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M68 24 L82 38 L68 52" stroke="url(#cyan-magenta-welcome)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M82 38 L50 62" stroke="url(#cyan-magenta-welcome)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M50 62 L50 86" stroke="url(#purple-blue-welcome)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="62" r="5" fill="#FFFFFF" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Welcome to YUKTIFY Assistant</h3>
        <p className="max-w-sm text-sm">
          Ask questions about DSA, System Design, Frontend internals, or Backend optimizations. I&apos;m here to help you crack the interview.
        </p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex flex-col gap-6 py-6 overflow-y-auto scrollbar-none">
      {messages.map((message, index) => (
        <div 
          key={message.id}
          className={cn(
            "flex gap-4 p-4 rounded-2xl transition-all animate-fade-in",
            message.role === 'user' ? "bg-surface/30 self-end max-w-[85%]" : "bg-accent-violet/5 self-start max-w-[90%]"
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-1",
            message.role === 'user' ? "bg-border text-white/60" : "bg-accent-gradient text-white"
          )}>
            {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">
              {message.role === 'user' ? 'You' : 'YUKTIFY AI'}
            </div>
            <div className="text-sm md:text-base text-white/80 leading-relaxed markdown-content prose prose-invert max-w-none">
              <TypewriterMarkdown
                key={message.id}
                content={message.content}
                enabled={message.role === 'assistant' && index === messages.length - 1 && !isLoading}
              />
            </div>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex gap-4 p-4 rounded-2xl bg-accent-violet/5 self-start max-w-[90%] animate-pulse">
          <div className="w-8 h-8 rounded-lg bg-accent-gradient text-white flex items-center justify-center mt-1">
            <div className="w-4.5 h-4.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">YUKTIFY AI</div>
            <div className="flex gap-1 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-violet/40 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-accent-violet/40 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-accent-violet/40 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
