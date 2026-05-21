"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Briefcase, Layout, Database } from 'lucide-react';
import { Company, Role } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CompanyAccordionProps {
  company: Company;
  activeRole?: Role;
  isActive?: boolean;
}

export const CompanyAccordion: React.FC<CompanyAccordionProps> = ({ 
  company, 
  activeRole,
  isActive 
}) => {
  const [isOpen, setIsOpen] = useState(isActive);

  const roles: { id: Role, icon: React.ReactNode, label: string }[] = [
    { id: 'SDE', icon: <Briefcase size={14} />, label: 'SDE' },
    { id: 'Frontend', icon: <Layout size={14} />, label: 'Frontend' },
    { id: 'Backend', icon: <Database size={14} />, label: 'Backend' },
  ];

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        suppressHydrationWarning
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm",
          isOpen ? "bg-surface text-white" : "text-white/60 hover:bg-surface/50 hover:text-white"
        )}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: company.color || '#7c3aed' }}
          />
          <span className="font-medium">{company.name}</span>
        </div>
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>

      {isOpen && (
        <div className="mt-1 ml-4 border-l border-border pl-2 flex flex-col gap-1 animate-slide-in">
          {roles.map((role) => (
            <Link
              key={role.id}
              href={`/company/${company.slug}?role=${role.id}`}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all",
                activeRole === role.id 
                  ? "bg-accent-violet/10 text-accent-violet border border-accent-violet/20" 
                  : "text-white/40 hover:text-white hover:bg-surface/30"
              )}
            >
              {role.icon}
              {role.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
