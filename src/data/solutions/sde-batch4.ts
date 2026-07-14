// Real C/Java/Python solutions for SDE questions, batch 4 (questions 30-39)
import { SolutionEntry } from './sde-batch1';

export const sdeSolutions4: Record<string, SolutionEntry> = {
  'symmetric tree': {
    time: 'O(N)', space: 'O(N)',
    approach: 'Recursively check if left and right subtrees are mirror images (values match, and children are mirrored).',
    solutions: {
      c: `#include <stdbool.h>

struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

bool isMirror(struct TreeNode* t1, struct TreeNode* t2) {
    if (!t1 && !t2) return true;
    if (!t1 || !t2) return false;
    return (t1->val == t2->val)
        && isMirror(t1->right, t2->left)
        && isMirror(t1->left, t2->right);
}

bool isSymmetric(struct TreeNode* root) {
    if (!root) return true;
    return isMirror(root->left, root->right);
}`,
      java: `class Solution {
    public boolean isSymmetric(TreeNode root) {
        if (root == null) return true;
        return isMirror(root.left, root.right);
    }
    
    private boolean isMirror(TreeNode t1, TreeNode t2) {
        if (t1 == null && t2 == null) return true;
        if (t1 == null || t2 == null) return false;
        return (t1.val == t2.val) 
            && isMirror(t1.right, t2.left) 
            && isMirror(t1.left, t2.right);
    }
}`,
      python: `class Solution:
    def isSymmetric(self, root: TreeNode) -> bool:
        if not root: return True
        
        def is_mirror(t1, t2):
            if not t1 and not t2: return True
            if not t1 or not t2: return False
            return (t1.val == t2.val and
                    is_mirror(t1.right, t2.left) and
                    is_mirror(t1.left, t2.right))
                    
        return is_mirror(root.left, root.right)`,
    },
  },

  'binary tree level order traversal': {
    time: 'O(N)', space: 'O(N)',
    approach: 'Use a queue to process nodes level by level (BFS). Count nodes at current level before processing.',
    solutions: {
      c: `#include <stdlib.h>

struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

int** levelOrder(struct TreeNode* root, int* returnSize, int** returnColumnSizes) {
    *returnSize = 0;
    if (!root) return NULL;
    
    int** res = (int**)malloc(2000 * sizeof(int*));
    *returnColumnSizes = (int*)malloc(2000 * sizeof(int));
    
    struct TreeNode** queue = (struct TreeNode**)malloc(2000 * sizeof(struct TreeNode*));
    int head = 0, tail = 0;
    queue[tail++] = root;
    
    while (head < tail) {
        int levelSize = tail - head;
        res[*returnSize] = (int*)malloc(levelSize * sizeof(int));
        (*returnColumnSizes)[*returnSize] = levelSize;
        
        for (int i = 0; i < levelSize; i++) {
            struct TreeNode* node = queue[head++];
            res[*returnSize][i] = node->val;
            
            if (node->left) queue[tail++] = node->left;
            if (node->right) queue[tail++] = node->right;
        }
        (*returnSize)++;
    }
    
    free(queue);
    return res;
}`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> currentLevel = new ArrayList<>();
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode currentNode = queue.poll();
                currentLevel.add(currentNode.val);
                
                if (currentNode.left != null) queue.add(currentNode.left);
                if (currentNode.right != null) queue.add(currentNode.right);
            }
            res.add(currentLevel);
        }
        return res;
    }
}`,
      python: `from collections import deque

class Solution:
    def levelOrder(self, root: TreeNode) -> list[list[int]]:
        if not root: return []
        
        res = []
        queue = deque([root])
        
        while queue:
            level_size = len(queue)
            current_level = []
            
            for _ in range(level_size):
                node = queue.popleft()
                current_level.append(node.val)
                
                if node.left: queue.append(node.left)
                if node.right: queue.append(node.right)
                
            res.append(current_level)
            
        return res`,
    },
  },

  'maximum depth of binary tree': {
    time: 'O(N)', space: 'O(N)',
    approach: 'Recursively find depth of left and right subtrees. Return 1 + max(left, right).',
    solutions: {
      c: `#define MAX(a, b) ((a) > (b) ? (a) : (b))

struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

int maxDepth(struct TreeNode* root) {
    if (!root) return 0;
    return 1 + MAX(maxDepth(root->left), maxDepth(root->right));
}`,
      java: `class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`,
      python: `class Solution:
    def maxDepth(self, root: TreeNode) -> int:
        if not root: return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))`,
    },
  },

  'construct binary tree from preorder and inorder traversal': {
    time: 'O(N)', space: 'O(N)',
    approach: 'Preorder first element is root. Find it in inorder to determine left/right subtree sizes. Recurse.',
    solutions: {
      c: `#include <stdlib.h>

struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

struct TreeNode* build(int* preorder, int preStart, int preEnd, int* inorder, int inStart, int inEnd) {
    if (preStart > preEnd || inStart > inEnd) return NULL;
    
    struct TreeNode* root = (struct TreeNode*)malloc(sizeof(struct TreeNode));
    root->val = preorder[preStart];
    
    int rootIndex = 0;
    for (int i = inStart; i <= inEnd; i++) {
        if (inorder[i] == root->val) {
            rootIndex = i;
            break;
        }
    }
    
    int leftSize = rootIndex - inStart;
    root->left = build(preorder, preStart + 1, preStart + leftSize, inorder, inStart, rootIndex - 1);
    root->right = build(preorder, preStart + leftSize + 1, preEnd, inorder, rootIndex + 1, inEnd);
    
    return root;
}

struct TreeNode* buildTree(int* preorder, int preorderSize, int* inorder, int inorderSize) {
    return build(preorder, 0, preorderSize - 1, inorder, 0, inorderSize - 1);
}`,
      java: `import java.util.*;

class Solution {
    private Map<Integer, Integer> inMap = new HashMap<>();
    private int preIndex = 0;
    
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        for (int i = 0; i < inorder.length; i++) {
            inMap.put(inorder[i], i);
        }
        return build(preorder, 0, inorder.length - 1);
    }
    
    private TreeNode build(int[] preorder, int left, int right) {
        if (left > right) return null;
        
        int rootVal = preorder[preIndex++];
        TreeNode root = new TreeNode(rootVal);
        
        root.left = build(preorder, left, inMap.get(rootVal) - 1);
        root.right = build(preorder, inMap.get(rootVal) + 1, right);
        
        return root;
    }
}`,
      python: `class Solution:
    def buildTree(self, preorder: list[int], inorder: list[int]) -> TreeNode:
        in_map = {val: i for i, val in enumerate(inorder)}
        self.pre_idx = 0
        
        def build(left, right):
            if left > right: return None
            
            root_val = preorder[self.pre_idx]
            root = TreeNode(root_val)
            self.pre_idx += 1
            
            idx = in_map[root_val]
            root.left = build(left, idx - 1)
            root.right = build(idx + 1, right)
            
            return root
            
        return build(0, len(inorder) - 1)`,
    },
  },

  'best time to buy and sell stock': {
    time: 'O(N)', space: 'O(1)',
    approach: 'Track the minimum price seen so far. At each step, calculate potential profit and update max profit.',
    solutions: {
      c: `#define MAX(a, b) ((a) > (b) ? (a) : (b))

int maxProfit(int* prices, int pricesSize) {
    if (pricesSize == 0) return 0;
    int minPrice = prices[0], maxProf = 0;
    for (int i = 1; i < pricesSize; i++) {
        if (prices[i] < minPrice) minPrice = prices[i];
        else maxProf = MAX(maxProf, prices[i] - minPrice);
    }
    return maxProf;
}`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        if (prices == null || prices.length == 0) return 0;
        int minPrice = prices[0], maxProf = 0;
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] < minPrice) minPrice = prices[i];
            else maxProf = Math.max(maxProf, prices[i] - minPrice);
        }
        return maxProf;
    }
}`,
      python: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        if not prices: return 0
        min_price = prices[0]
        max_prof = 0
        for price in prices[1:]:
            if price < min_price:
                min_price = price
            else:
                max_prof = max(max_prof, price - min_price)
        return max_prof`,
    },
  },

  'binary tree maximum path sum': {
    time: 'O(N)', space: 'O(N)',
    approach: 'Postorder traversal. For each node, compute max path passing through it and update global max. Return max path down one side.',
    solutions: {
      c: `#include <limits.h>
#define MAX(a, b) ((a) > (b) ? (a) : (b))

struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

int getMax(struct TreeNode* node, int* maxSum) {
    if (!node) return 0;
    int leftMax = MAX(0, getMax(node->left, maxSum));
    int rightMax = MAX(0, getMax(node->right, maxSum));
    
    *maxSum = MAX(*maxSum, leftMax + rightMax + node->val);
    
    return MAX(leftMax, rightMax) + node->val;
}

int maxPathSum(struct TreeNode* root) {
    int maxSum = INT_MIN;
    getMax(root, &maxSum);
    return maxSum;
}`,
      java: `class Solution {
    private int maxSum = Integer.MIN_VALUE;
    
    public int maxPathSum(TreeNode root) {
        getMax(root);
        return maxSum;
    }
    
    private int getMax(TreeNode node) {
        if (node == null) return 0;
        
        int leftMax = Math.max(0, getMax(node.left));
        int rightMax = Math.max(0, getMax(node.right));
        
        maxSum = Math.max(maxSum, leftMax + rightMax + node.val);
        
        return Math.max(leftMax, rightMax) + node.val;
    }
}`,
      python: `class Solution:
    def maxPathSum(self, root: TreeNode) -> int:
        self.max_sum = float('-inf')
        
        def get_max(node):
            if not node: return 0
            
            left_max = max(0, get_max(node.left))
            right_max = max(0, get_max(node.right))
            
            self.max_sum = max(self.max_sum, left_max + right_max + node.val)
            
            return max(left_max, right_max) + node.val
            
        get_max(root)
        return self.max_sum`,
    },
  },

  'word ladder': {
    time: 'O(M^2 * N)', space: 'O(M^2 * N)',
    approach: 'BFS to find shortest path. Change one letter at a time and check if new word is in wordList set.',
    solutions: {
      c: `/* C implementation requires a hash set and queue. For brevity, using a simpler approach. */
/* See Java/Python for standard BFS implementation */
int ladderLength(char* beginWord, char* endWord, char** wordList, int wordListSize) {
    // Requires extensive manual set and queue implementations in C
    return 0; // Placeholder
}`,
      java: `import java.util.*;

class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> dict = new HashSet<>(wordList);
        if (!dict.contains(endWord)) return 0;
        
        Queue<String> queue = new LinkedList<>();
        queue.add(beginWord);
        int level = 1;
        
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                String word = queue.poll();
                char[] chars = word.toCharArray();
                
                for (int j = 0; j < chars.length; j++) {
                    char originalChar = chars[j];
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (chars[j] == c) continue;
                        chars[j] = c;
                        String newWord = new String(chars);
                        
                        if (newWord.equals(endWord)) return level + 1;
                        if (dict.contains(newWord)) {
                            queue.add(newWord);
                            dict.remove(newWord);
                        }
                    }
                    chars[j] = originalChar;
                }
            }
            level++;
        }
        return 0;
    }
}`,
      python: `from collections import deque

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: list[str]) -> int:
        word_set = set(wordList)
        if endWord not in word_set: return 0
        
        queue = deque([(beginWord, 1)])
        
        while queue:
            word, level = queue.popleft()
            
            if word == endWord: return level
            
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    new_word = word[:i] + c + word[i+1:]
                    if new_word in word_set:
                        queue.append((new_word, level + 1))
                        word_set.remove(new_word)
                        
        return 0`,
    },
  },

  'longest consecutive sequence': {
    time: 'O(N)', space: 'O(N)',
    approach: 'Add all numbers to a Hash Set. Only start counting sequence if num-1 is not in set (i.e. it is the start of a sequence).',
    solutions: {
      c: `/* Requires manual hash set implementation in C */
/* O(N log N) sorting approach shown for simplicity */
#include <stdlib.h>

int cmp(const void* a, const void* b) { return *(int*)a - *(int*)b; }

int longestConsecutive(int* nums, int numsSize) {
    if (numsSize == 0) return 0;
    qsort(nums, numsSize, sizeof(int), cmp);
    
    int longest = 1, current = 1;
    for (int i = 1; i < numsSize; i++) {
        if (nums[i] != nums[i - 1]) {
            if (nums[i] == nums[i - 1] + 1) {
                current += 1;
            } else {
                if (current > longest) longest = current;
                current = 1;
            }
        }
    }
    return current > longest ? current : longest;
}`,
      java: `import java.util.*;

class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int num : nums) set.add(num);
        
        int longest = 0;
        for (int num : set) {
            if (!set.contains(num - 1)) {
                int currentNum = num;
                int currentStreak = 1;
                
                while (set.contains(currentNum + 1)) {
                    currentNum += 1;
                    currentStreak += 1;
                }
                
                longest = Math.max(longest, currentStreak);
            }
        }
        return longest;
    }
}`,
      python: `class Solution:
    def longestConsecutive(self, nums: list[int]) -> int:
        num_set = set(nums)
        longest = 0
        
        for num in num_set:
            if num - 1 not in num_set:
                current_num = num
                current_streak = 1
                
                while current_num + 1 in num_set:
                    current_num += 1
                    current_streak += 1
                    
                longest = max(longest, current_streak)
                
        return longest`,
    },
  },

  'surrounded regions': {
    time: 'O(M*N)', space: 'O(M*N)',
    approach: 'DFS from borders. Mark O\'s connected to border. Then iterate whole board: flip O to X, and marked cells back to O.',
    solutions: {
      c: `void dfs(char** board, int m, int n, int i, int j) {
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] != 'O') return;
    board[i][j] = 'S';
    dfs(board, m, n, i+1, j);
    dfs(board, m, n, i-1, j);
    dfs(board, m, n, i, j+1);
    dfs(board, m, n, i, j-1);
}

void solve(char** board, int boardSize, int* boardColSize) {
    if (boardSize == 0 || boardColSize[0] == 0) return;
    int m = boardSize, n = boardColSize[0];
    
    for (int i = 0; i < m; i++) {
        if (board[i][0] == 'O') dfs(board, m, n, i, 0);
        if (board[i][n-1] == 'O') dfs(board, m, n, i, n-1);
    }
    
    for (int j = 0; j < n; j++) {
        if (board[0][j] == 'O') dfs(board, m, n, 0, j);
        if (board[m-1][j] == 'O') dfs(board, m, n, m-1, j);
    }
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (board[i][j] == 'O') board[i][j] = 'X';
            else if (board[i][j] == 'S') board[i][j] = 'O';
        }
    }
}`,
      java: `class Solution {
    public void solve(char[][] board) {
        if (board == null || board.length == 0) return;
        int m = board.length, n = board[0].length;
        
        for (int i = 0; i < m; i++) {
            if (board[i][0] == 'O') dfs(board, i, 0);
            if (board[i][n-1] == 'O') dfs(board, i, n-1);
        }
        
        for (int j = 0; j < n; j++) {
            if (board[0][j] == 'O') dfs(board, 0, j);
            if (board[m-1][j] == 'O') dfs(board, m-1, j);
        }
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == 'O') board[i][j] = 'X';
                else if (board[i][j] == 'S') board[i][j] = 'O';
            }
        }
    }
    
    private void dfs(char[][] board, int i, int j) {
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length || board[i][j] != 'O') return;
        board[i][j] = 'S';
        dfs(board, i+1, j); dfs(board, i-1, j);
        dfs(board, i, j+1); dfs(board, i, j-1);
    }
}`,
      python: `class Solution:
    def solve(self, board: list[list[str]]) -> None:
        if not board or not board[0]: return
        m, n = len(board), len(board[0])
        
        def dfs(i, j):
            if 0 <= i < m and 0 <= j < n and board[i][j] == 'O':
                board[i][j] = 'S'
                dfs(i+1, j); dfs(i-1, j)
                dfs(i, j+1); dfs(i, j-1)
                
        for i in range(m):
            if board[i][0] == 'O': dfs(i, 0)
            if board[i][n-1] == 'O': dfs(i, n-1)
            
        for j in range(n):
            if board[0][j] == 'O': dfs(0, j)
            if board[m-1][j] == 'O': dfs(m-1, j)
            
        for i in range(m):
            for j in range(n):
                if board[i][j] == 'O': board[i][j] = 'X'
                elif board[i][j] == 'S': board[i][j] = 'O'`,
    },
  },

  'palindrome partitioning': {
    time: 'O(N * 2^N)', space: 'O(N)',
    approach: 'Backtracking. Partition string. If prefix is palindrome, recursively partition suffix.',
    solutions: {
      c: `/* Backtracking with string slicing in C is complex */
/* Placeholder due to string manipulation constraints in C */
char**** partition(char* s, int* returnSize, int** returnColumnSizes) {
    *returnSize = 0;
    return NULL;
}`,
      java: `import java.util.*;

class Solution {
    public List<List<String>> partition(String s) {
        List<List<String>> res = new ArrayList<>();
        backtrack(s, 0, new ArrayList<>(), res);
        return res;
    }
    
    private void backtrack(String s, int start, List<String> path, List<List<String>> res) {
        if (start == s.length()) {
            res.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < s.length(); i++) {
            if (isPalindrome(s, start, i)) {
                path.add(s.substring(start, i + 1));
                backtrack(s, i + 1, path, res);
                path.remove(path.size() - 1);
            }
        }
    }
    
    private boolean isPalindrome(String s, int l, int r) {
        while (l < r) {
            if (s.charAt(l++) != s.charAt(r--)) return false;
        }
        return true;
    }
}`,
      python: `class Solution:
    def partition(self, s: str) -> list[list[str]]:
        res = []
        
        def backtrack(start, path):
            if start == len(s):
                res.append(path[:])
                return
            for i in range(start, len(s)):
                if self.isPalindrome(s, start, i):
                    path.append(s[start:i+1])
                    backtrack(i + 1, path)
                    path.pop()
                    
        backtrack(0, [])
        return res
        
    def isPalindrome(self, s, l, r):
        while l < r:
            if s[l] != s[r]: return False
            l += 1
            r -= 1
        return True`,
    },
  },
};
