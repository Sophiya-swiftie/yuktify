import { Question, Role, Difficulty } from '@/types';
import { sdePool, frontendPool, backendPool } from './questionPool';

const solutionTemplates: Record<string, { code: string; time: string; space: string; approach: string }> = {
  'two sum': {
    time: 'O(N)',
    space: 'O(N)',
    approach: 'Scan once while storing each value and index in a hash map. For every value, check whether target - value has already been seen.',
    code: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();

  for (let i = 0; i < nums.length; i += 1) {
    const complement = target - nums[i];
    const matchIndex = seen.get(complement);

    if (matchIndex !== undefined) {
      return [matchIndex, i];
    }

    seen.set(nums[i], i);
  }

  return [];
}`,
  },
  'longest substring without repeating characters': {
    time: 'O(N)',
    space: 'O(min(N, K))',
    approach: 'Use a sliding window and remember the latest index of every character. Move the left boundary past duplicates.',
    code: `function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right += 1) {
    const char = s[right];
    const previous = lastSeen.get(char);

    if (previous !== undefined && previous >= left) {
      left = previous + 1;
    }

    lastSeen.set(char, right);
    best = Math.max(best, right - left + 1);
  }

  return best;
}`,
  },
  'merge intervals': {
    time: 'O(N log N)',
    space: 'O(N)',
    approach: 'Sort intervals by start time, then merge each interval into the previous one when ranges overlap.',
    code: `function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [];

  for (const [start, end] of intervals) {
    const last = merged[merged.length - 1];

    if (!last || start > last[1]) {
      merged.push([start, end]);
    } else {
      last[1] = Math.max(last[1], end);
    }
  }

  return merged;
}`,
  },
  'valid parentheses': {
    time: 'O(N)',
    space: 'O(N)',
    approach: 'Push opening brackets onto a stack and require every closing bracket to match the latest opener.',
    code: `function isValid(s: string): boolean {
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const stack: string[] = [];

  for (const char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
      continue;
    }

    if (stack.pop() !== pairs[char]) {
      return false;
    }
  }

  return stack.length === 0;
}`,
  },
  'maximum subarray': {
    time: 'O(N)',
    space: 'O(1)',
    approach: "Apply Kadane's algorithm: at each index, decide whether to extend the current subarray or restart from the current value.",
    code: `function maxSubArray(nums: number[]): number {
  let current = nums[0];
  let best = nums[0];

  for (let i = 1; i < nums.length; i += 1) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }

  return best;
}`,
  },
};

function buildGenericSolution(title: string, role: Role, tags: string[]) {
  if (role === 'Frontend') {
    return {
      time: 'O(1) per interaction',
      space: 'O(1)',
      approach: `Explain the browser or React primitive behind ${title}, then implement the smallest reusable utility or component that demonstrates the behavior under interview constraints.`,
      code: `type AnyFunction = (...args: unknown[]) => void;

export function debounce<T extends AnyFunction>(fn: T, delayMs: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => fn(...args), delayMs);
  };
}`,
    };
  }

  if (role === 'Backend') {
    return {
      time: 'O(1) average per request',
      space: 'O(U)',
      approach: `Model the backend concern in ${title} with clear contracts, isolation boundaries, and operational trade-offs before writing code.`,
      code: `class TokenBucket {
  private tokens: number;
  private lastRefill = Date.now();

  constructor(
    private readonly capacity: number,
    private readonly refillPerSecond: number,
  ) {
    this.tokens = capacity;
  }

  allow(): boolean {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSeconds * this.refillPerSecond);
    this.lastRefill = now;

    if (this.tokens < 1) {
      return false;
    }

    this.tokens -= 1;
    return true;
  }
}`,
    };
  }

  return {
    time: tags.includes('Sorting') ? 'O(N log N)' : 'O(N)',
    space: tags.includes('DP') || tags.includes('Hash Table') ? 'O(N)' : 'O(1)',
    approach: `Identify the invariant for ${title}, choose the data structure suggested by ${tags.join(', ') || 'the constraints'}, and reduce repeated work before coding.`,
    code: `function solveInterviewProblem<T>(items: T[]): T[] {
  const result: T[] = [];
  const seen = new Set<T>();

  for (const item of items) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }

  return result;
}`,
  };
}

function getSolutionForQuestion(title: string, role: Role, tags: string[]) {
  const key = title.toLowerCase();
  return solutionTemplates[key] ?? buildGenericSolution(title, role, tags);
}

/**
 * Dynamically generates 100 questions for a given company and role.
 * Uses a rotation/hashing logic to ensure variety while remaining deterministic.
 */
function generateQuestionsForCompany(companySlug: string, role: Role): Question[] {
  const pool = role === 'SDE' ? sdePool : role === 'Frontend' ? frontendPool : backendPool;
  const companySeed = companySlug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const generated: Question[] = [];
  const count = 100;

  for (let i = 0; i < count; i++) {
    const poolIndex = (companySeed + i) % pool.length;
    const baseQuestion = pool[poolIndex];
    const tags = baseQuestion.tags || [];
    const title = baseQuestion.title || 'Untitled Question';
    const solution = getSolutionForQuestion(title, role, tags);
    
    generated.push({
      id: `${companySlug}-${role.toLowerCase()}-${i}`,
      company: companySlug,
      role: role,
      title,
      difficulty: (baseQuestion.difficulty as Difficulty) || 'Medium',
      tags,
      leetcodeLink: baseQuestion.leetcodeLink,
      description: `High-frequency ${role} interview preparation question for ${companySlug.toUpperCase()}.\n\nProblem Statement: ${title}\n\nCandidate is expected to clarify constraints, discuss trade-offs, implement a clean solution, and explain complexity.`,
      approach: solution.approach,
      solution: solution.code,
      justification: `${title} tests practical understanding of ${tags.join(', ') || 'core engineering principles'}. It helps interviewers evaluate correctness, communication, edge-case coverage, and code quality.`,
      timeComplexity: solution.time,
      spaceComplexity: solution.space,
    });
  }

  return generated;
}

// Map to cache generated questions to avoid redundant computation
const questionsCache: Record<string, Question[]> = {};

export function getQuestionsByCompany(companySlug: string, role: Role = 'SDE'): Question[] {
  const cacheKey = `${companySlug}-${role}`;
  if (!questionsCache[cacheKey]) {
    questionsCache[cacheKey] = generateQuestionsForCompany(companySlug, role);
  }
  return questionsCache[cacheKey];
}

export function getQuestionsByRole(role: Role): Question[] {
  // For simplicity in the dashboard, we'll return a sample from top companies
  return getQuestionsByCompany('google', role);
}

export function getQuestionById(id: string): Question | undefined {
  // We can parse the ID to find the company and role
  const parts = id.split('-');
  if (parts.length < 3) return undefined;
  
  const companySlug = parts[0];
  const role = (parts[1].charAt(0).toUpperCase() + parts[1].slice(1)) as Role;
  const questions = getQuestionsByCompany(companySlug, role);
  
  return questions.find(q => q.id === id);
}

export function searchQuestions(query: string, companySlug?: string, role: Role = 'SDE'): Question[] {
  const q = query.toLowerCase();
  const source = companySlug ? getQuestionsByCompany(companySlug, role) : [];
  
  return source.filter(question => {
    return question.title.toLowerCase().includes(q) || 
           question.tags.some(t => t.toLowerCase().includes(q));
  });
}
