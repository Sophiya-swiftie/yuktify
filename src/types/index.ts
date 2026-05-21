export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Role = 'SDE' | 'Frontend' | 'Backend';

export interface Question {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  approach: string;
  solution: string;
  justification: string;
  timeComplexity: string;
  spaceComplexity: string;
  tags: string[];
  company: string;
  role: Role;
  leetcodeLink?: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  color?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FilterState {
  difficulty: Difficulty | 'All';
  role: Role | 'All';
  tags: string[];
  searchQuery: string;
}
