import React from 'react';
import { Difficulty } from '@/types';
import { cn } from '@/lib/utils';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, className }) => {
  const getColors = () => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Hard':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-semibold border",
      getColors(),
      className
    )}>
      {difficulty}
    </span>
  );
};
