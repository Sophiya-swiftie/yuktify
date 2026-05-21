"use client";

import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { CompanyAccordion } from './CompanyAccordion';
import { searchCompanies } from '@/data/companies';
import { PanelLeftClose, PanelLeftOpen, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Role } from '@/types';

interface SidebarProps {
  activeCompanySlug?: string;
  activeRole?: Role;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeCompanySlug,
  activeRole 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCompanies = searchCompanies(searchQuery);

  return (
    <aside 
      className={cn(
        "relative hidden h-screen flex-col border-r border-border bg-background transition-all duration-300 z-40 md:flex",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent-gradient shadow-lg">
              <Terminal size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">YUKTIFY</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          suppressHydrationWarning
          className="p-2 rounded-lg text-white/40 hover:bg-surface hover:text-white transition-colors"
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Search Section */}
      {!isCollapsed && (
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
        {isCollapsed ? (
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

      {/* Bottom Footer */}
      {!isCollapsed && (
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
  );
};
