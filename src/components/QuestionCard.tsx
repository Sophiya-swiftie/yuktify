"use client";

import React, { useState } from 'react';
import { Question } from '@/types';
import { DifficultyBadge } from './DifficultyBadge';
import { ChevronDown, ChevronUp, Copy, Check, ExternalLink, Clock, Database, Tag } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [expandedSection, setExpandedSection] = useState<'none' | 'approach' | 'solution' | 'justification'>('none');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(question.solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSection = (section: 'approach' | 'solution' | 'justification') => {
    setExpandedSection(expandedSection === section ? 'none' : section);
  };

  return (
    <div className="glass-card mb-6 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{question.title}</h2>
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
        </div>

        <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
          {question.description}
        </div>

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
      </div>

      {/* Accordion Sections */}
      <div className="divide-y divide-border">
        {/* Approach Section */}
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

        {/* Solution Section */}
        <section>
          <div 
            onClick={() => toggleSection('solution')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSection('solution'); } }}
            className="w-full flex items-center justify-between p-4 hover:bg-surface/30 transition-colors cursor-pointer focus:outline-none"
          >
            <span className="font-semibold text-sm uppercase tracking-widest text-white/60">Solution</span>
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
                suppressHydrationWarning
                className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all focus:outline-none"
                title="Copy Code"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
              {expandedSection === 'solution' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
          {expandedSection === 'solution' && (
            <div className="p-0 border-t border-border animate-slide-in">
              <SyntaxHighlighter 
                language="typescript" 
                style={atomDark}
                customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.875rem' }}
              >
                {question.solution}
              </SyntaxHighlighter>
            </div>
          )}
        </section>

        {/* Justification Section */}
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
      </div>
    </div>
  );
};
