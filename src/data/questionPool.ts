import { Question, Difficulty } from '@/types';
import { sdeSolutions1 } from './solutions/sde-batch1';
import { sdeSolutions2 } from './solutions/sde-batch2';
import { sdeSolutions3 } from './solutions/sde-batch3';
import { sdeSolutions4 } from './solutions/sde-batch4';
import { sdeSolutions5 } from './solutions/sde-batch5';
import { frontendQuestions, backendQuestions } from './solutions/frontend-backend';

// Combine all SDE solutions
const allSdeSolutions = {
  ...sdeSolutions1,
  ...sdeSolutions2,
  ...sdeSolutions3,
  ...sdeSolutions4,
  ...sdeSolutions5,
};

// LeetCode slug helper
function lc(slug: string) {
  return { leetcodeSlug: slug, leetcodeUrl: `https://leetcode.com/problems/${slug}/` };
}

// Original SDE Metadata mapped to Question objects
export const sdePool: Question[] = [
  { id: 'q-0',  title: 'Two Sum',                                                    difficulty: 'Easy',   tags: ['Array', 'Hash Table'],              ...lc('two-sum') },
  { id: 'q-1',  title: 'Longest Substring Without Repeating Characters',             difficulty: 'Medium', tags: ['String', 'Sliding Window'],         ...lc('longest-substring-without-repeating-characters') },
  { id: 'q-2',  title: 'Median of Two Sorted Arrays',                               difficulty: 'Hard',   tags: ['Array', 'Binary Search'],           ...lc('median-of-two-sorted-arrays') },
  { id: 'q-3',  title: 'Longest Palindromic Substring',                             difficulty: 'Medium', tags: ['String', 'Dynamic Programming'],    ...lc('longest-palindromic-substring') },
  { id: 'q-4',  title: 'Container With Most Water',                                 difficulty: 'Medium', tags: ['Array', 'Two Pointers'],            ...lc('container-with-most-water') },
  { id: 'q-5',  title: '3Sum',                                                      difficulty: 'Medium', tags: ['Array', 'Two Pointers'],            ...lc('3sum') },
  { id: 'q-6',  title: 'Letter Combinations of a Phone Number',                     difficulty: 'Medium', tags: ['String', 'Backtracking'],           ...lc('letter-combinations-of-a-phone-number') },
  { id: 'q-7',  title: 'Remove Nth Node From End of List',                          difficulty: 'Medium', tags: ['Linked List', 'Two Pointers'],      ...lc('remove-nth-node-from-end-of-list') },
  { id: 'q-8',  title: 'Valid Parentheses',                                         difficulty: 'Easy',   tags: ['String', 'Stack'],                  ...lc('valid-parentheses') },
  { id: 'q-9',  title: 'Merge Two Sorted Lists',                                    difficulty: 'Easy',   tags: ['Linked List', 'Recursion'],         ...lc('merge-two-sorted-lists') },
  { id: 'q-10', title: 'Merge k Sorted Lists',                                      difficulty: 'Hard',   tags: ['Linked List', 'Heap'],              ...lc('merge-k-sorted-lists') },
  { id: 'q-11', title: 'Search in Rotated Sorted Array',                            difficulty: 'Medium', tags: ['Array', 'Binary Search'],           ...lc('search-in-rotated-sorted-array') },
  { id: 'q-12', title: 'Combination Sum',                                           difficulty: 'Medium', tags: ['Array', 'Backtracking'],            ...lc('combination-sum') },
  { id: 'q-13', title: 'First Missing Positive',                                    difficulty: 'Hard',   tags: ['Array', 'Hash Table'],              ...lc('first-missing-positive') },
  { id: 'q-14', title: 'Trapping Rain Water',                                       difficulty: 'Hard',   tags: ['Array', 'Two Pointers'],            ...lc('trapping-rain-water') },
  { id: 'q-15', title: 'Group Anagrams',                                            difficulty: 'Medium', tags: ['Hash Table', 'String'],             ...lc('group-anagrams') },
  { id: 'q-16', title: 'Maximum Subarray',                                          difficulty: 'Medium', tags: ['Array', 'Dynamic Programming'],     ...lc('maximum-subarray') },
  { id: 'q-17', title: 'Spiral Matrix',                                             difficulty: 'Medium', tags: ['Array', 'Matrix'],                  ...lc('spiral-matrix') },
  { id: 'q-18', title: 'Jump Game',                                                 difficulty: 'Medium', tags: ['Array', 'Greedy'],                  ...lc('jump-game') },
  { id: 'q-19', title: 'Merge Intervals',                                           difficulty: 'Medium', tags: ['Array', 'Sorting'],                 ...lc('merge-intervals') },
  { id: 'q-20', title: 'Insert Interval',                                           difficulty: 'Medium', tags: ['Array'],                            ...lc('insert-interval') },
  { id: 'q-21', title: 'Unique Paths',                                              difficulty: 'Medium', tags: ['Math', 'Dynamic Programming'],      ...lc('unique-paths') },
  { id: 'q-22', title: 'Climbing Stairs',                                           difficulty: 'Easy',   tags: ['Math', 'Dynamic Programming'],      ...lc('climbing-stairs') },
  { id: 'q-23', title: 'Set Matrix Zeroes',                                         difficulty: 'Medium', tags: ['Array', 'Hash Table'],              ...lc('set-matrix-zeroes') },
  { id: 'q-24', title: 'Search a 2D Matrix',                                       difficulty: 'Medium', tags: ['Array', 'Binary Search'],           ...lc('search-a-2d-matrix') },
  { id: 'q-25', title: 'Sort Colors',                                               difficulty: 'Medium', tags: ['Array', 'Two Pointers'],            ...lc('sort-colors') },
  { id: 'q-26', title: 'Minimum Window Substring',                                  difficulty: 'Hard',   tags: ['Hash Table', 'Sliding Window'],     ...lc('minimum-window-substring') },
  { id: 'q-27', title: 'Word Search',                                               difficulty: 'Medium', tags: ['Array', 'Backtracking'],            ...lc('word-search') },
  { id: 'q-28', title: 'Binary Tree Inorder Traversal',                             difficulty: 'Easy',   tags: ['Tree', 'DFS'],                      ...lc('binary-tree-inorder-traversal') },
  { id: 'q-29', title: 'Validate Binary Search Tree',                               difficulty: 'Medium', tags: ['Tree', 'DFS'],                      ...lc('validate-binary-search-tree') },
  { id: 'q-30', title: 'Symmetric Tree',                                            difficulty: 'Easy',   tags: ['Tree', 'BFS'],                      ...lc('symmetric-tree') },
  { id: 'q-31', title: 'Binary Tree Level Order Traversal',                         difficulty: 'Medium', tags: ['Tree', 'BFS'],                      ...lc('binary-tree-level-order-traversal') },
  { id: 'q-32', title: 'Maximum Depth of Binary Tree',                              difficulty: 'Easy',   tags: ['Tree', 'DFS'],                      ...lc('maximum-depth-of-binary-tree') },
  { id: 'q-33', title: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: 'Medium', tags: ['Tree', 'Array'],                    ...lc('construct-binary-tree-from-preorder-and-inorder-traversal') },
  { id: 'q-34', title: 'Best Time to Buy and Sell Stock',                           difficulty: 'Easy',   tags: ['Array', 'Dynamic Programming'],     ...lc('best-time-to-buy-and-sell-stock') },
  { id: 'q-35', title: 'Binary Tree Maximum Path Sum',                              difficulty: 'Hard',   tags: ['Tree', 'Dynamic Programming'],      ...lc('binary-tree-maximum-path-sum') },
  { id: 'q-36', title: 'Word Ladder',                                               difficulty: 'Hard',   tags: ['Hash Table', 'BFS'],                ...lc('word-ladder') },
  { id: 'q-37', title: 'Longest Consecutive Sequence',                              difficulty: 'Medium', tags: ['Array', 'Hash Table'],              ...lc('longest-consecutive-sequence') },
  { id: 'q-38', title: 'Surrounded Regions',                                        difficulty: 'Medium', tags: ['Array', 'DFS'],                     ...lc('surrounded-regions') },
  { id: 'q-39', title: 'Palindrome Partitioning',                                   difficulty: 'Medium', tags: ['String', 'Backtracking'],           ...lc('palindrome-partitioning') },
  { id: 'q-40', title: 'Gas Station',                                               difficulty: 'Medium', tags: ['Array', 'Greedy'],                  ...lc('gas-station') },
  { id: 'q-41', title: 'Copy List with Random Pointer',                             difficulty: 'Medium', tags: ['Hash Table', 'Linked List'],        ...lc('copy-list-with-random-pointer') },
  { id: 'q-42', title: 'Word Break',                                                difficulty: 'Medium', tags: ['Hash Table', 'Dynamic Programming'], ...lc('word-break') },
  { id: 'q-43', title: 'LRU Cache',                                                 difficulty: 'Medium', tags: ['Hash Table', 'Design'],             ...lc('lru-cache') },
  { id: 'q-44', title: 'Insertion Sort List',                                       difficulty: 'Medium', tags: ['Linked List', 'Sorting'],           ...lc('insertion-sort-list') },
  { id: 'q-45', title: 'Sort List',                                                 difficulty: 'Medium', tags: ['Linked List', 'Divide and Conquer'], ...lc('sort-list') },
  { id: 'q-46', title: 'Evaluate Reverse Polish Notation',                          difficulty: 'Medium', tags: ['Array', 'Math'],                    ...lc('evaluate-reverse-polish-notation') },
  { id: 'q-47', title: 'Reverse Words in a String',                                 difficulty: 'Medium', tags: ['String', 'Two Pointers'],           ...lc('reverse-words-in-a-string') },
  { id: 'q-48', title: 'Find Minimum in Rotated Sorted Array',                      difficulty: 'Medium', tags: ['Array', 'Binary Search'],           ...lc('find-minimum-in-rotated-sorted-array') },
  { id: 'q-49', title: 'Maximum Product Subarray',                                  difficulty: 'Medium', tags: ['Array', 'Dynamic Programming'],     ...lc('maximum-product-subarray') },
].map(q => {
  const key = q.title.toLowerCase();
  const sol = allSdeSolutions[key] || {
    time: 'O(N)', space: 'O(N)', approach: 'Iterate and solve.',
    solutions: { c: '/* TODO */', java: '// TODO', python: '# TODO' }
  };
  
  return {
    ...q,
    difficulty: q.difficulty as Difficulty,
    description: `Write an efficient algorithm to solve the ${q.title} problem. Ensure your solution handles all edge cases optimally.`,
    approach: sol.approach,
    justification: `This ${q.difficulty.toLowerCase()} difficulty problem is a common interview question that tests your knowledge of ${q.tags.join(' and ')}.`,
    timeComplexity: sol.time,
    spaceComplexity: sol.space,
    company: 'Generic',
    role: 'SDE',
    questionType: 'coding' as const,
    solutions: sol.solutions
  };
});

// Export all the completed pools
export { frontendQuestions as frontendPool, backendQuestions as backendPool };
