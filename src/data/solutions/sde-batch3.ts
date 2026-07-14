// Real C/Java/Python solutions for SDE questions, batch 3 (questions 20-29)
import { SolutionEntry } from './sde-batch1';

export const sdeSolutions3: Record<string, SolutionEntry> = {
  'insert interval': {
    time: 'O(N)', space: 'O(N)',
    approach: 'Add intervals before the new one, merge overlapping intervals into the new one, then add intervals after it.',
    solutions: {
      c: `#include <stdlib.h>

int** insert(int** intervals, int n, int* colSizes, int* newInterval, int newIntervalSize, int* returnSize, int** returnColumnSizes) {
    int** res = (int**)malloc((n + 1) * sizeof(int*));
    *returnSize = 0;
    int i = 0;
    
    // Add all intervals ending before newInterval starts
    while (i < n && intervals[i][1] < newInterval[0]) {
        res[*returnSize] = (int*)malloc(2 * sizeof(int));
        res[*returnSize][0] = intervals[i][0];
        res[*returnSize][1] = intervals[i][1];
        (*returnSize)++;
        i++;
    }
    
    // Merge all overlapping intervals to one newInterval
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = newInterval[0] < intervals[i][0] ? newInterval[0] : intervals[i][0];
        newInterval[1] = newInterval[1] > intervals[i][1] ? newInterval[1] : intervals[i][1];
        i++;
    }
    res[*returnSize] = (int*)malloc(2 * sizeof(int));
    res[*returnSize][0] = newInterval[0];
    res[*returnSize][1] = newInterval[1];
    (*returnSize)++;
    
    // Add all the remaining intervals
    while (i < n) {
        res[*returnSize] = (int*)malloc(2 * sizeof(int));
        res[*returnSize][0] = intervals[i][0];
        res[*returnSize][1] = intervals[i][1];
        (*returnSize)++;
        i++;
    }
    
    *returnColumnSizes = (int*)malloc(*returnSize * sizeof(int));
    for (int j = 0; j < *returnSize; j++) (*returnColumnSizes)[j] = 2;
    
    return res;
}`,
      java: `import java.util.*;

class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> res = new ArrayList<>();
        int i = 0, n = intervals.length;
        
        while (i < n && intervals[i][1] < newInterval[0]) {
            res.add(intervals[i]);
            i++;
        }
        
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        res.add(newInterval);
        
        while (i < n) {
            res.add(intervals[i]);
            i++;
        }
        
        return res.toArray(new int[res.size()][]);
    }
}`,
      python: `class Solution:
    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
        res = []
        i = 0
        n = len(intervals)
        
        while i < n and intervals[i][1] < newInterval[0]:
            res.append(intervals[i])
            i += 1
            
        while i < n and intervals[i][0] <= newInterval[1]:
            newInterval[0] = min(newInterval[0], intervals[i][0])
            newInterval[1] = max(newInterval[1], intervals[i][1])
            i += 1
        res.append(newInterval)
        
        while i < n:
            res.append(intervals[i])
            i += 1
            
        return res`,
    },
  },

  'unique paths': {
    time: 'O(M*N)', space: 'O(N)',
    approach: 'Dynamic Programming: number of paths to a cell is sum of paths from above and left. Space can be optimized to 1D array.',
    solutions: {
      c: `#include <stdlib.h>

int uniquePaths(int m, int n) {
    int* dp = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) dp[i] = 1;
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[j] += dp[j - 1];
        }
    }
    
    int result = dp[n - 1];
    free(dp);
    return result;
}`,
      java: `class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        java.util.Arrays.fill(dp, 1);
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[j] += dp[j - 1];
            }
        }
        return dp[n - 1];
    }
}`,
      python: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [1] * n
        for _ in range(1, m):
            for j in range(1, n):
                dp[j] += dp[j - 1]
        return dp[-1]`,
    },
  },

  'climbing stairs': {
    time: 'O(N)', space: 'O(1)',
    approach: 'Fibonacci sequence. State transitions depend only on the previous two steps.',
    solutions: {
      c: `int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}`,
      java: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }
}`,
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2: return n
        a, b = 1, 2
        for _ in range(3, n + 1):
            a, b = b, a + b
        return b`,
    },
  },

  'set matrix zeroes': {
    time: 'O(M*N)', space: 'O(1)',
    approach: 'Use the first row and first column to record zero states. Handle the first row/col separately based on initial scan.',
    solutions: {
      c: `void setZeroes(int** matrix, int matrixSize, int* matrixColSize) {
    int m = matrixSize, n = matrixColSize[0];
    int firstRowZero = 0, firstColZero = 0;
    
    for (int i = 0; i < m; i++) if (matrix[i][0] == 0) firstColZero = 1;
    for (int j = 0; j < n; j++) if (matrix[0][j] == 0) firstRowZero = 1;
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            if (matrix[i][j] == 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                matrix[i][j] = 0;
            }
        }
    }
    
    if (firstColZero) for (int i = 0; i < m; i++) matrix[i][0] = 0;
    if (firstRowZero) for (int j = 0; j < n; j++) matrix[0][j] = 0;
}`,
      java: `class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean firstRowZero = false, firstColZero = false;
        
        for (int i = 0; i < m; i++) if (matrix[i][0] == 0) firstColZero = true;
        for (int j = 0; j < n; j++) if (matrix[0][j] == 0) firstRowZero = true;
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                    matrix[i][j] = 0;
                }
            }
        }
        
        if (firstColZero) for (int i = 0; i < m; i++) matrix[i][0] = 0;
        if (firstRowZero) for (int j = 0; j < n; j++) matrix[0][j] = 0;
    }
}`,
      python: `class Solution:
    def setZeroes(self, matrix: list[list[int]]) -> None:
        m, n = len(matrix), len(matrix[0])
        first_row_zero = any(matrix[0][j] == 0 for j in range(n))
        first_col_zero = any(matrix[i][0] == 0 for i in range(m))
        
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][j] == 0:
                    matrix[i][0] = 0
                    matrix[0][j] = 0
                    
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][0] == 0 or matrix[0][j] == 0:
                    matrix[i][j] = 0
                    
        if first_col_zero:
            for i in range(m): matrix[i][0] = 0
        if first_row_zero:
            for j in range(n): matrix[0][j] = 0`,
    },
  },

  'search a 2d matrix': {
    time: 'O(log(M*N))', space: 'O(1)',
    approach: 'Treat the 2D matrix as a sorted 1D array by mapping index: row = idx / cols, col = idx % cols.',
    solutions: {
      c: `#include <stdbool.h>

bool searchMatrix(int** matrix, int matrixSize, int* matrixColSize, int target) {
    if (matrixSize == 0 || matrixColSize[0] == 0) return false;
    int m = matrixSize, n = matrixColSize[0];
    int lo = 0, hi = m * n - 1;
    
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        int val = matrix[mid / n][mid % n];
        
        if (val == target) return true;
        if (val < target) lo = mid + 1;
        else hi = mid - 1;
    }
    
    return false;
}`,
      java: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) return false;
        int m = matrix.length, n = matrix[0].length;
        int lo = 0, hi = m * n - 1;
        
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int val = matrix[mid / n][mid % n];
            
            if (val == target) return true;
            if (val < target) lo = mid + 1;
            else hi = mid - 1;
        }
        
        return false;
    }
}`,
      python: `class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        if not matrix or not matrix[0]: return False
        m, n = len(matrix), len(matrix[0])
        lo, hi = 0, m * n - 1
        
        while lo <= hi:
            mid = (lo + hi) // 2
            val = matrix[mid // n][mid % n]
            
            if val == target: return True
            if val < target: lo = mid + 1
            else: hi = mid - 1
            
        return False`,
    },
  },

  'sort colors': {
    time: 'O(N)', space: 'O(1)',
    approach: 'Dutch National Flag algorithm. Three pointers separating 0s (red), 1s (white), and 2s (blue).',
    solutions: {
      c: `void sortColors(int* nums, int numsSize) {
    int low = 0, mid = 0, high = numsSize - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            int temp = nums[low];
            nums[low] = nums[mid];
            nums[mid] = temp;
            low++;
            mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            int temp = nums[high];
            nums[high] = nums[mid];
            nums[mid] = temp;
            high--;
        }
    }
}`,
      java: `class Solution {
    public void sortColors(int[] nums) {
        int low = 0, mid = 0, high = nums.length - 1;
        while (mid <= high) {
            if (nums[mid] == 0) {
                int temp = nums[low];
                nums[low] = nums[mid];
                nums[mid] = temp;
                low++; mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                int temp = nums[high];
                nums[high] = nums[mid];
                nums[mid] = temp;
                high--;
            }
        }
    }
}`,
      python: `class Solution:
    def sortColors(self, nums: list[int]) -> None:
        low, mid, high = 0, 0, len(nums) - 1
        while mid <= high:
            if nums[mid] == 0:
                nums[low], nums[mid] = nums[mid], nums[low]
                low += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            else:
                nums[high], nums[mid] = nums[mid], nums[high]
                high -= 1`,
    },
  },

  'minimum window substring': {
    time: 'O(N)', space: 'O(1)',
    approach: 'Sliding window. Expand until all target chars are included, then shrink to minimize the window.',
    solutions: {
      c: `#include <string.h>
#include <stdlib.h>

char* minWindow(char* s, char* t) {
    int target_counts[128] = {0};
    for (int i = 0; t[i]; i++) target_counts[(int)t[i]]++;
    
    int required = 0;
    for (int i = 0; i < 128; i++) if (target_counts[i] > 0) required++;
    
    int l = 0, r = 0, formed = 0;
    int window_counts[128] = {0};
    int ans[3] = {-1, 0, 0}; // len, left, right
    
    while (s[r]) {
        char c = s[r];
        window_counts[(int)c]++;
        
        if (target_counts[(int)c] > 0 && window_counts[(int)c] == target_counts[(int)c]) {
            formed++;
        }
        
        while (l <= r && formed == required) {
            c = s[l];
            if (ans[0] == -1 || r - l + 1 < ans[0]) {
                ans[0] = r - l + 1;
                ans[1] = l;
                ans[2] = r;
            }
            
            window_counts[(int)c]--;
            if (target_counts[(int)c] > 0 && window_counts[(int)c] < target_counts[(int)c]) {
                formed--;
            }
            l++;
        }
        r++;
    }
    
    if (ans[0] == -1) return strdup("");
    
    char* result = (char*)malloc((ans[0] + 1) * sizeof(char));
    strncpy(result, s + ans[1], ans[0]);
    result[ans[0]] = '\\0';
    return result;
}`,
      java: `class Solution {
    public String minWindow(String s, String t) {
        if (s.length() == 0 || t.length() == 0) return "";
        
        int[] target = new int[128];
        for (char c : t.toCharArray()) target[c]++;
        
        int required = 0;
        for (int i = 0; i < 128; i++) if (target[i] > 0) required++;
        
        int l = 0, r = 0, formed = 0;
        int[] window = new int[128];
        int[] ans = {-1, 0, 0}; // length, left, right
        
        while (r < s.length()) {
            char c = s.charAt(r);
            window[c]++;
            if (target[c] > 0 && window[c] == target[c]) formed++;
            
            while (l <= r && formed == required) {
                c = s.charAt(l);
                if (ans[0] == -1 || r - l + 1 < ans[0]) {
                    ans[0] = r - l + 1; ans[1] = l; ans[2] = r;
                }
                window[c]--;
                if (target[c] > 0 && window[c] < target[c]) formed--;
                l++;
            }
            r++;
        }
        return ans[0] == -1 ? "" : s.substring(ans[1], ans[2] + 1);
    }
}`,
      python: `from collections import Counter

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        if not s or not t: return ""
        
        target = Counter(t)
        required = len(target)
        window = {}
        l, r, formed = 0, 0, 0
        ans = float("inf"), None, None
        
        while r < len(s):
            char = s[r]
            window[char] = window.get(char, 0) + 1
            if char in target and window[char] == target[char]:
                formed += 1
                
            while l <= r and formed == required:
                char = s[l]
                if r - l + 1 < ans[0]:
                    ans = (r - l + 1, l, r)
                    
                window[char] -= 1
                if char in target and window[char] < target[char]:
                    formed -= 1
                l += 1
            r += 1
            
        return "" if ans[0] == float("inf") else s[ans[1]:ans[2] + 1]`,
    },
  },

  'word search': {
    time: 'O(M*N*3^L)', space: 'O(L)',
    approach: 'DFS from each cell. Keep track of visited cells. Abort early if path mismatch.',
    solutions: {
      c: `#include <stdbool.h>

bool dfs(char** board, int m, int n, char* word, int i, int j, int k) {
    if (word[k] == '\\0') return true;
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] != word[k]) return false;
    
    char temp = board[i][j];
    board[i][j] = '#'; // Mark visited
    
    bool found = dfs(board, m, n, word, i+1, j, k+1) ||
                 dfs(board, m, n, word, i-1, j, k+1) ||
                 dfs(board, m, n, word, i, j+1, k+1) ||
                 dfs(board, m, n, word, i, j-1, k+1);
                 
    board[i][j] = temp; // Restore
    return found;
}

bool exist(char** board, int boardSize, int* boardColSize, char* word) {
    int m = boardSize, n = boardColSize[0];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (dfs(board, m, n, word, i, j, 0)) return true;
        }
    }
    return false;
}`,
      java: `class Solution {
    public boolean exist(char[][] board, String word) {
        int m = board.length, n = board[0].length;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (dfs(board, i, j, word, 0)) return true;
            }
        }
        return false;
    }
    
    private boolean dfs(char[][] board, int i, int j, String word, int k) {
        if (k == word.length()) return true;
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length || board[i][j] != word.charAt(k)) 
            return false;
            
        char temp = board[i][j];
        board[i][j] = '#';
        
        boolean found = dfs(board, i+1, j, word, k+1) ||
                        dfs(board, i-1, j, word, k+1) ||
                        dfs(board, i, j+1, word, k+1) ||
                        dfs(board, i, j-1, word, k+1);
                        
        board[i][j] = temp;
        return found;
    }
}`,
      python: `class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        m, n = len(board), len(board[0])
        
        def dfs(i, j, k):
            if k == len(word): return True
            if not (0 <= i < m and 0 <= j < n) or board[i][j] != word[k]:
                return False
                
            temp = board[i][j]
            board[i][j] = '#'
            
            found = (dfs(i+1, j, k+1) or
                     dfs(i-1, j, k+1) or
                     dfs(i, j+1, k+1) or
                     dfs(i, j-1, k+1))
                     
            board[i][j] = temp
            return found
            
        return any(dfs(i, j, 0) for i in range(m) for j in range(n))`,
    },
  },

  'binary tree inorder traversal': {
    time: 'O(N)', space: 'O(N)',
    approach: 'Left, Node, Right. Recursive is simple, iterative uses a stack.',
    solutions: {
      c: `#include <stdlib.h>

struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

void traverse(struct TreeNode* root, int* arr, int* size) {
    if (!root) return;
    traverse(root->left, arr, size);
    arr[(*size)++] = root->val;
    traverse(root->right, arr, size);
}

int* inorderTraversal(struct TreeNode* root, int* returnSize) {
    *returnSize = 0;
    int* arr = (int*)malloc(100 * sizeof(int)); // Assuming max 100 nodes
    traverse(root, arr, returnSize);
    return arr;
}`,
      java: `import java.util.*;

class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode curr = root;
        
        while (curr != null || !stack.isEmpty()) {
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            curr = stack.pop();
            result.add(curr.val);
            curr = curr.right;
        }
        return result;
    }
}`,
      python: `class Solution:
    def inorderTraversal(self, root: TreeNode) -> list[int]:
        result, stack = [], []
        curr = root
        
        while curr or stack:
            while curr:
                stack.append(curr)
                curr = curr.left
            curr = stack.pop()
            result.append(curr.val)
            curr = curr.right
            
        return result`,
    },
  },

  'validate binary search tree': {
    time: 'O(N)', space: 'O(N)',
    approach: 'Pass down min/max limits to validate each node recursively.',
    solutions: {
      c: `#include <stdbool.h>
#include <limits.h>

struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };

bool isValid(struct TreeNode* node, long minVal, long maxVal) {
    if (!node) return true;
    if (node->val <= minVal || node->val >= maxVal) return false;
    return isValid(node->left, minVal, node->val) && isValid(node->right, node->val, maxVal);
}

bool isValidBST(struct TreeNode* root) {
    return isValid(root, LONG_MIN, LONG_MAX);
}`,
      java: `class Solution {
    public boolean isValidBST(TreeNode root) {
        return isValid(root, null, null);
    }
    
    private boolean isValid(TreeNode node, Integer min, Integer max) {
        if (node == null) return true;
        if ((min != null && node.val <= min) || (max != null && node.val >= max)) return false;
        return isValid(node.left, min, node.val) && isValid(node.right, node.val, max);
    }
}`,
      python: `class Solution:
    def isValidBST(self, root: TreeNode) -> bool:
        def is_valid(node, min_val, max_val):
            if not node: return True
            if not (min_val < node.val < max_val): return False
            return (is_valid(node.left, min_val, node.val) and
                    is_valid(node.right, node.val, max_val))
                    
        return is_valid(root, float('-inf'), float('inf'))`,
    },
  },
};
