"use client";

import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { CompanyAccordion } from './CompanyAccordion';
import { searchCompanies } from '@/data/companies';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Role } from '@/types';
import { useAuth } from '@/providers/AuthProvider';

interface SidebarProps {
  activeCompanySlug?: string;
  activeRole?: Role;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeCompanySlug,
  activeRole 
}) => {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCompanies = searchCompanies(searchQuery);

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside 
        className={cn(
          "h-screen flex-col border-r border-border bg-background transition-all duration-300 z-50",
          // Desktop styles
          "hidden md:flex md:relative",
          isCollapsed ? "md:w-20" : "md:w-72",
          // Mobile Drawer styles
          "fixed top-0 left-0 w-72 md:translate-x-0 md:w-auto shadow-2xl md:shadow-none",
          mobileSidebarOpen ? "translate-x-0 flex" : "-translate-x-full md:flex"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6">
          {/* Brand Logo (Visible on desktop when expanded, or always on mobile) */}
          {(!isCollapsed || mobileSidebarOpen) && (
            <div className="flex items-center gap-2 group">
              <div className="w-8 h-8 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="purple-blue-sidebar" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                    <linearGradient id="cyan-magenta-sidebar" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22D3EE" />
                      <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                  </defs>
                  <path d="M32 24 L18 38 L32 52" stroke="url(#purple-blue-sidebar)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 38 L50 62" stroke="url(#purple-blue-sidebar)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M68 24 L82 38 L68 52" stroke="url(#cyan-magenta-sidebar)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M82 38 L50 62" stroke="url(#cyan-magenta-sidebar)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M50 62 L50 86" stroke="url(#purple-blue-sidebar)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="50" cy="62" r="5" fill="#FFFFFF" />
                </svg>
              </div>
              <span className="text-lg font-black tracking-wider text-white uppercase">YUKTIFY</span>
            </div>
          )}

          {/* Close button for Mobile Drawer */}
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            suppressHydrationWarning
            className="p-2 rounded-lg text-white/40 hover:bg-surface hover:text-white transition-colors md:hidden"
          >
            <X size={20} />
          </button>

          {/* Collapse/Expand Toggle for Desktop */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            suppressHydrationWarning
            className="hidden md:block p-2 rounded-lg text-white/40 hover:bg-surface hover:text-white transition-colors"
          >
            {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        {/* Search Section (Shown if expanded or on mobile) */}
        {(!isCollapsed || mobileSidebarOpen) && (
          <div className="px-6 pb-4">
            <SearchBar 
              placeholder="Search companies..." 
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
        )}

        {/* Company List */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 scrollbar-custom">
          {isCollapsed && !mobileSidebarOpen ? (
            <div className="flex flex-col items-center gap-4 mt-4">
              {filteredCompanies.slice(0, 10).map((company) => (
                <div 
                  key={company.id}
                  title={company.name}
                  className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-accent-violet transition-all"
                  style={{ backgroundColor: company.color }}
                />
              ))}
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <CompanyAccordion 
                key={company.id} 
                company={company} 
                activeRole={activeCompanySlug === company.slug ? activeRole : undefined}
                isActive={activeCompanySlug === company.slug}
              />
            ))
          )}
        </div>

        {/* Bottom Footer (Shown if expanded or on mobile) */}
        {(!isCollapsed || mobileSidebarOpen) && (
          <div className="p-6 border-t border-border">
            <div className="p-4 rounded-xl bg-surface/50 border border-border">
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs text-white/60">YUKTIFY AI Online</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
