"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ChatBox } from '@/components/ChatBox';
import { ChatInput } from '@/components/ChatInput';
import { Sparkles, ArrowRight, BrainCircuit, Zap } from 'lucide-react';
import Link from 'next/link';
import { ChatMessage } from '@/types';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to connect to YUKTIFY AI.');
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.content,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            error instanceof Error
              ? error.message
              : 'Gemini could not complete the request. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header />
        
        <div className="flex-1 overflow-y-auto scrollbar-custom relative">
          <div className="max-w-4xl mx-auto px-6 pt-12 pb-32">
            
            {messages.length === 0 ? (
              <div className="animate-fade-in">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-xs font-bold uppercase tracking-widest mb-6">
                    <Sparkles size={14} />
                    The Future of Interview Prep
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                    Master <span className="accent-text">Coding and Interview.</span>
                  </h1>
                  <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
                    YUKTIFY combines curated high-frequency company questions with state-of-the-art AI to help you land your dream job.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                  <div className="glass-card p-8 group hover:border-accent-violet/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-accent-violet/10 flex items-center justify-center text-accent-violet mb-6 group-hover:scale-110 transition-transform">
                      <BrainCircuit size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">AI Deep Dives</h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      Don&apos;t just see the solution. Ask the AI to explain the intuition, suggest alternatives, or dry-run your code.
                    </p>
                  </div>
                  <div className="glass-card p-8 group hover:border-accent-cyan/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan mb-6 group-hover:scale-110 transition-transform">
                      <Zap size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Company Focused</h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      Select from 100+ top tech companies. Get specific questions asked in SDE, Frontend, and Backend loops.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Get Started</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/company/google?role=SDE" className="btn-primary flex items-center gap-2">
                      Try Google Prep <ArrowRight size={18} />
                    </Link>
                    <Link href="/company/amazon?role=SDE" className="px-6 py-2 rounded-xl bg-surface border border-border text-white font-semibold hover:bg-surface/80 transition-all">
                      Browse Amazon
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <ChatBox messages={messages} isLoading={isLoading} />
            )}
            
          </div>
        </div>

        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}
