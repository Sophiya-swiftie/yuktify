"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Question, CodingLanguage } from '@/types';
import { DifficultyBadge } from './DifficultyBadge';
import { ChevronDown, ChevronUp, Copy, Check, ExternalLink, Clock, Database, Tag, Bookmark, CheckCircle2, Circle, RefreshCw, Flame } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { useAuth, UserProgressStatus } from '@/providers/AuthProvider';

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { isBookmarked, toggleBookmark, progress, updateProgress } = useAuth();
  const [expandedSection, setExpandedSection] = useState<'none' | 'approach' | 'solution' | 'justification'>('none');
  const [copied, setCopied] = useState(false);
  const [selectedLang, setSelectedLang] = useState<CodingLanguage>('java');
  
  // Status dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentStatus: UserProgressStatus = progress[question.id] || 'not_started';

  const getCodeToCopy = () => {
    if (question.questionType === 'conceptual' && question.conceptualAnswer) {
      return question.conceptualAnswer.explanation + '\n\n' + 
             question.conceptualAnswer.keyPoints.map(p => '- ' + p).join('\n');
    }
    if (question.domainSolution) {
      return question.domainSolution.code;
    }
    if (question.solutions) {
      return question.solutions[selectedLang];
    }
    return '';
  };

  const copyToClipboard = () => {
    const text = getCodeToCopy();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSection = (section: 'approach' | 'solution' | 'justification') => {
    setExpandedSection(expandedSection === section ? 'none' : section);
  };

  const handleStatusChange = async (status: UserProgressStatus) => {
    setDropdownOpen(false);
    await updateProgress(question.id, status);
  };

  // Status styling helpers
  const getStatusBadgeConfig = (status: UserProgressStatus) => {
    switch (status) {
      case 'attempted':
        return {
          label: 'Attempted',
          colorClass: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20 hover:border-accent-cyan/40',
          icon: <Flame size={12} className="text-accent-cyan animate-pulse" />
        };
      case 'solved':
        return {
          label: 'Solved',
          colorClass: 'text-green-500 bg-green-500/10 border-green-500/20 hover:border-green-500/40',
          icon: <CheckCircle2 size={12} className="text-green-500" />
        };
      case 'revision':
        return {
          label: 'Revision',
          colorClass: 'text-accent-violet bg-accent-violet/10 border-accent-violet/20 hover:border-accent-violet/40',
          icon: <RefreshCw size={12} className="text-accent-violet" />
        };
      default:
        return {
          label: 'Todo',
          colorClass: 'text-white/40 bg-surface/50 border-border hover:border-white/20',
          icon: <Circle size={12} className="text-white/30" />
        };
    }
  };

  const activeStatusConfig = getStatusBadgeConfig(currentStatus);

  return (
    <div className="glass-card mb-6 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            {/* Title & Bookmark Button */}
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-white">{question.title}</h2>
              <button
                onClick={() => toggleBookmark(question.id)}
                className="p-1.5 rounded-lg text-white/40 hover:bg-white/5 hover:text-accent-violet transition-all focus:outline-none cursor-pointer"
                title={isBookmarked(question.id) ? "Remove Bookmark" : "Bookmark Question"}
              >
                <Bookmark 
                  size={18} 
                  className={cn(
                    "transition-all",
                    isBookmarked(question.id) ? "fill-accent-violet text-accent-violet scale-110" : ""
                  )} 
                />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <DifficultyBadge difficulty={question.difficulty} />
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface border border-border text-white/60 uppercase tracking-wider">
                {question.role}
              </div>
              {question.leetcodeLink && (
                <a 
                  href={question.leetcodeLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-accent-cyan hover:underline ml-2"
                >
                  LeetCode <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          {/* Solved Status Selector */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer focus:outline-none",
                activeStatusConfig.colorClass
              )}
              title="Change Solve Status"
            >
              {activeStatusConfig.icon}
              <span>{activeStatusConfig.label}</span>
              <ChevronDown size={12} className="opacity-60" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl border border-border bg-surface p-1.5 shadow-2xl z-20 animate-slide-in">
                {(['not_started', 'attempted', 'solved', 'revision'] as UserProgressStatus[]).map((statusOption) => {
                  const optionConfig = getStatusBadgeConfig(statusOption);
                  return (
                    <button
                      key={statusOption}
                      onClick={() => handleStatusChange(statusOption)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors cursor-pointer hover:bg-white/5",
                        currentStatus === statusOption ? 'text-white bg-white/5' : 'text-white/60'
                      )}
                    >
                      {optionConfig.icon}
                      <span>{optionConfig.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap markdown-content prose prose-invert max-w-none">
          <ReactMarkdown>{question.description}</ReactMarkdown>
        </div>

        {question.timeComplexity && question.spaceComplexity && (
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Clock size={14} className="text-accent-violet" />
              <span>Time: <span className="text-white/80">{question.timeComplexity}</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Database size={14} className="text-accent-cyan" />
              <span>Space: <span className="text-white/80">{question.spaceComplexity}</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Tag size={14} />
              <div className="flex gap-1.5">
                {question.tags.map(tag => (
                  <span key={tag} className="text-white/80 hover:text-accent-violet cursor-pointer">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accordion Sections */}
      <div className="divide-y divide-border">
        {/* Approach Section */}
        {question.approach && (
          <section>
            <button 
              onClick={() => toggleSection('approach')}
              className="w-full flex items-center justify-between p-4 hover:bg-surface/30 transition-colors"
            >
              <span className="font-semibold text-sm uppercase tracking-widest text-white/60">Approach</span>
              {expandedSection === 'approach' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSection === 'approach' && (
              <div className="p-6 bg-black/20 text-white/80 text-sm leading-relaxed border-t border-border animate-slide-in">
                {question.approach}
              </div>
            )}
          </section>
        )}

        {/* Solution Section */}
        <section>
          <div 
            onClick={() => toggleSection('solution')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSection('solution'); } }}
            className="w-full flex items-center justify-between p-4 hover:bg-surface/30 transition-colors cursor-pointer focus:outline-none"
          >
            <span className="font-semibold text-sm uppercase tracking-widest text-white/60">
              {question.questionType === 'conceptual' ? 'Answer' : 'Solution'}
            </span>
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
                suppressHydrationWarning
                className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all focus:outline-none"
                title="Copy Content"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
              {expandedSection === 'solution' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
          
          {expandedSection === 'solution' && (
            <div className="p-0 border-t border-border animate-slide-in">
              {/* Conceptual Answer Rendering */}
              {question.questionType === 'conceptual' && question.conceptualAnswer && (
                <div className="p-6 bg-black/20 text-white/80 text-sm leading-relaxed space-y-4">
                  <div className="markdown-content prose prose-invert max-w-none">
                    <ReactMarkdown>{question.conceptualAnswer.explanation}</ReactMarkdown>
                  </div>
                  
                  {question.conceptualAnswer.keyPoints && question.conceptualAnswer.keyPoints.length > 0 && (
                    <ul className="list-disc pl-5 space-y-2 text-white/70">
                      {question.conceptualAnswer.keyPoints.map((point, idx) => (
                        <li key={idx}><ReactMarkdown components={{p: ({ ...props }) => <span {...props} />}}>{point}</ReactMarkdown></li>
                      ))}
                    </ul>
                  )}
                  
                  {question.conceptualAnswer.example && (
                    <div className="mt-4 p-4 rounded-lg bg-surface border border-border">
                      <div className="text-xs font-bold text-white/40 mb-2 uppercase tracking-wider">Example</div>
                      <div className="markdown-content prose prose-invert max-w-none text-sm"><ReactMarkdown>{question.conceptualAnswer.example}</ReactMarkdown></div>
                    </div>
                  )}
                </div>
              )}

              {/* Single Domain Language Solution (e.g., Frontend JS) */}
              {question.questionType === 'coding' && question.domainSolution && (
                <div>
                  <div className="px-4 py-2 bg-surface/50 border-b border-border text-xs font-medium text-white/60">
                    {question.domainSolution.languageLabel}
                  </div>
                  <div className="max-w-full overflow-x-auto">
                    <SyntaxHighlighter 
                      language={question.domainSolution.language}
                      style={atomDark}
                      customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.875rem' }}
                    >
                      {question.domainSolution.code}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )}

              {/* Multi-Language Solution (SDE - C, Java, Python) */}
              {question.questionType === 'coding' && question.solutions && (
                <div>
                  {/* Language Tabs */}
                  <div className="flex items-center gap-1 px-4 pt-2 bg-surface/30 border-b border-border">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedLang('c'); }}
                      className={cn(
                        "px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2",
                        selectedLang === 'c' 
                          ? "bg-black/20 text-accent-cyan border-accent-cyan" 
                          : "text-white/40 hover:text-white/80 border-transparent hover:bg-white/5"
                      )}
                    >
                      C
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedLang('java'); }}
                      className={cn(
                        "px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2",
                        selectedLang === 'java' 
                          ? "bg-black/20 text-accent-orange border-accent-orange" 
                          : "text-white/40 hover:text-white/80 border-transparent hover:bg-white/5"
                      )}
                    >
                      Java
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedLang('python'); }}
                      className={cn(
                        "px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2",
                        selectedLang === 'python' 
                          ? "bg-black/20 text-accent-violet border-accent-violet" 
                          : "text-white/40 hover:text-white/80 border-transparent hover:bg-white/5"
                      )}
                    >
                      Python
                    </button>
                  </div>
                  
                  {/* Code Viewer */}
                  <div className="max-w-full overflow-x-auto">
                    <SyntaxHighlighter 
                      language={selectedLang}
                      style={atomDark}
                      customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.875rem', backgroundColor: 'rgba(0,0,0,0.2)' }}
                    >
                      {question.solutions[selectedLang]}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Justification Section */}
        {question.justification && (
          <section>
            <button 
              onClick={() => toggleSection('justification')}
              className="w-full flex items-center justify-between p-4 hover:bg-surface/30 transition-colors"
            >
              <span className="font-semibold text-sm uppercase tracking-widest text-white/60">Justification</span>
              {expandedSection === 'justification' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSection === 'justification' && (
              <div className="p-6 bg-black/20 text-white/80 text-sm leading-relaxed border-t border-border animate-slide-in">
                {question.justification}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
