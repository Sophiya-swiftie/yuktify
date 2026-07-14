import { Question, Role, Difficulty } from '@/types';
import { sdePool, frontendPool, backendPool } from './questionPool';

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
    
    // Copy the entire base question structure but customize the ID and company
    generated.push({
      ...baseQuestion,
      id: `${companySlug}-${role.toLowerCase()}-${i}`,
      company: companySlug,
      role: role,
      title,
      difficulty: (baseQuestion.difficulty as Difficulty) || 'Medium',
      tags,
      leetcodeLink: baseQuestion.leetcodeLink,
      description: `High-frequency ${role} interview preparation question for ${companySlug.toUpperCase()}.\n\nProblem Statement: ${title}\n\n${baseQuestion.description || 'Candidate is expected to clarify constraints, discuss trade-offs, implement a clean solution, and explain complexity.'}`,
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
