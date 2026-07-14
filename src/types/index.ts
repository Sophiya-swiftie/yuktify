export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Role = 'SDE' | 'Frontend' | 'Backend';
export type QuestionType = 'coding' | 'conceptual';
export type CodingLanguage = 'c' | 'java' | 'python';

/** Multi-language solutions for coding-type questions. */
export interface CodingSolutions {
  c: string;
  java: string;
  python: string;
}

/** Structured answer for conceptual / non-coding questions. */
export interface ConceptualAnswer {
  explanation: string;
  keyPoints: string[];
  example: string;
  followUps: string[];
}

/**
 * A single-language solution used when only one language is relevant
 * (e.g. JavaScript for Frontend, SQL for Backend).
 */
export interface DomainSolution {
  language: string;           // e.g. "javascript", "typescript", "sql"
  languageLabel: string;      // e.g. "JavaScript", "TypeScript", "SQL"
  code: string;
}

export interface Question {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  approach: string;
  justification: string;
  timeComplexity: string;
  spaceComplexity: string;
  tags: string[];
  company: string;
  role: Role;
  leetcodeLink?: string;

  questionType: QuestionType;

  /** Present when questionType === 'coding' and the question supports C/Java/Python */
  solutions?: CodingSolutions;

  /** Present when questionType === 'coding' but only one domain-specific language applies */
  domainSolution?: DomainSolution;

  /** Present when questionType === 'conceptual' */
  conceptualAnswer?: ConceptualAnswer;
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
