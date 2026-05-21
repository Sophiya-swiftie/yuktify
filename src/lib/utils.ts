import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('yuktify_bookmarks') || '[]');
  } catch {
    return [];
  }
}

export function toggleBookmark(questionId: string): boolean {
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(questionId);
  if (idx > -1) {
    bookmarks.splice(idx, 1);
  } else {
    bookmarks.push(questionId);
  }
  localStorage.setItem('yuktify_bookmarks', JSON.stringify(bookmarks));
  return idx === -1; // returns true if newly bookmarked
}

export function isBookmarked(questionId: string): boolean {
  return getBookmarks().includes(questionId);
}

export function getRecentlyViewed(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('yuktify_recent') || '[]');
  } catch {
    return [];
  }
}

export function addRecentlyViewed(companySlug: string): void {
  const recent = getRecentlyViewed();
  const filtered = recent.filter((s) => s !== companySlug);
  const updated = [companySlug, ...filtered].slice(0, 5);
  localStorage.setItem('yuktify_recent', JSON.stringify(updated));
}
