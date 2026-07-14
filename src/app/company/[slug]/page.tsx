"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { QuestionCard } from '@/components/QuestionCard';
import { ChatBox } from '@/components/ChatBox';
import { ChatInput } from '@/components/ChatInput';
import { getCompanyBySlug } from '@/data/companies';
import { getQuestionsByCompany } from '@/data/questions';
import { ChatMessage, Role } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronLeft, Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

export default function CompanyPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') as Role) || 'SDE';
  
  const company = getCompanyBySlug(slug as string);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const { addRecentlyViewed } = useAuth();

  useEffect(() => {
    if (company) {
      addRecentlyViewed(company.slug);
    }
  }, [company, addRecentlyViewed]);

  if (!company) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Company Not Found</h1>
          <Link href="/" className="text-accent-violet hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const allQuestions = getQuestionsByCompany(company.slug, role);
  
  const filteredQuestions = allQuestions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleSendMessage = async (content: string) => {
    const contextualContent = `Context: The student is preparing for ${company.name} ${role} interviews.\n\n${content}`;
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
          messages: [
            ...messages.map(({ role, content }) => ({ role, content })),
            { role: 'user', content: contextualContent },
          ],
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
      <Sidebar activeCompanySlug={company.slug} activeRole={role} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header />
        
        <div className="flex-1 overflow-y-auto scrollbar-custom px-4 md:px-6 pb-32">
          <div className="max-w-4xl mx-auto pt-8">
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-white/30 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronLeft size={12} className="rotate-180" />
              <span className="text-white/60">{company.name}</span>
              <ChevronLeft size={12} className="rotate-180" />
              <span className="text-accent-violet">{role}</span>
            </div>

            {/* Company Header */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-2xl shadow-accent-violet/20"
                style={{ backgroundColor: company.color }}
              >
                {company.name[0]}
              </div>
              <div className="pb-1">
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-1 tracking-tight">{company.name}</h1>
                <p className="text-sm sm:text-base text-white/40 font-medium">{role} Interview Preparation</p>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="relative w-full sm:w-72">
                <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Search questions or tags..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet transition-all"
                />
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex p-1 rounded-xl bg-surface border border-border w-full sm:w-auto justify-between sm:justify-start">
                  {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficultyFilter(diff)}
                      suppressHydrationWarning
                      className={cn(
                        "px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex-1 sm:flex-initial",
                        difficultyFilter === diff 
                          ? "bg-accent-violet text-white shadow-lg shadow-accent-violet/20" 
                          : "text-white/40 hover:text-white"
                      )}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Area */}
            {messages.length > 0 ? (
              <ChatBox messages={messages} isLoading={isLoading} />
            ) : (
              <div className="space-y-6">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q) => (
                    <QuestionCard key={q.id} question={q} />
                  ))
                ) : (
                  <div className="py-20 text-center glass-card">
                    <p className="text-white/30 italic">No questions found matching your filters for {company.name} {role}.</p>
                    <button 
                      onClick={() => { setSearchQuery(''); setDifficultyFilter('All'); }}
                      suppressHydrationWarning
                      className="mt-4 text-accent-violet text-sm hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}
