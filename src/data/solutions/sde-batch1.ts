// Real C/Java/Python solutions for SDE questions, batch 1 (questions 0-9)
import { CodingSolutions } from '@/types';

export type SolutionEntry = {
  solutions: CodingSolutions;
  time: string;
  space: string;
  approach: string;
};

export const sdeSolutions1: Record<string, SolutionEntry> = {
  'two sum': {
    time: 'O(N)', space: 'O(N)',
    approach: 'Use a hash map to store each number and its index. For every number, check if target - num exists in the map.',
    solutions: {
      c: `#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    /* Simple O(N^2) since C lacks a built-in hash map.
       For O(N), implement a hash table manually. */
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    return result;
}`,
      java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`,
    },
  },

  'longest substring without repeating characters': {
    time: 'O(N)', space: 'O(min(N,K))',
    approach: 'Sliding window with a set/map tracking characters in the current window. Move left pointer past duplicates.',
    solutions: {
      c: `int lengthOfLongestSubstring(char* s) {
    int index[128];
    for (int i = 0; i < 128; i++) index[i] = -1;
    int left = 0, best = 0;
    for (int right = 0; s[right]; right++) {
        if (index[(int)s[right]] >= left)
            left = index[(int)s[right]] + 1;
        index[(int)s[right]] = right;
        int len = right - left + 1;
        if (len > best) best = len;
    }
    return best;
}`,
      java: `import java.util.HashMap;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        HashMap<Character, Integer> map = new HashMap<>();
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }
            map.put(c, right);
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        seen = {}
        left = best = 0
        for right, ch in enumerate(s):
            if ch in seen and seen[ch] >= left:
                left = seen[ch] + 1
            seen[ch] = right
            best = max(best, right - left + 1)
        return best`,
    },
  },

  'median of two sorted arrays': {
    time: 'O(log(min(M,N)))', space: 'O(1)',
    approach: 'Binary search on the shorter array to find the correct partition where elements on the left are ≤ elements on the right.',
    solutions: {
      c: `#include <limits.h>

double findMedianSortedArrays(int* nums1, int n1, int* nums2, int n2) {
    if (n1 > n2) return findMedianSortedArrays(nums2, n2, nums1, n1);
    int lo = 0, hi = n1, half = (n1 + n2 + 1) / 2;
    while (lo <= hi) {
        int i = (lo + hi) / 2;
        int j = half - i;
        int left1  = (i == 0)  ? INT_MIN : nums1[i - 1];
        int right1 = (i == n1) ? INT_MAX : nums1[i];
        int left2  = (j == 0)  ? INT_MIN : nums2[j - 1];
        int right2 = (j == n2) ? INT_MAX : nums2[j];
        if (left1 <= right2 && left2 <= right1) {
            int maxLeft = left1 > left2 ? left1 : left2;
            int minRight = right1 < right2 ? right1 : right2;
            if ((n1 + n2) % 2 == 1) return maxLeft;
            return (maxLeft + minRight) / 2.0;
        } else if (left1 > right2) hi = i - 1;
        else lo = i + 1;
    }
    return 0.0;
}`,
      java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length)
            return findMedianSortedArrays(nums2, nums1);
        int n1 = nums1.length, n2 = nums2.length;
        int lo = 0, hi = n1, half = (n1 + n2 + 1) / 2;
        while (lo <= hi) {
            int i = (lo + hi) / 2, j = half - i;
            int left1  = i == 0  ? Integer.MIN_VALUE : nums1[i - 1];
            int right1 = i == n1 ? Integer.MAX_VALUE : nums1[i];
            int left2  = j == 0  ? Integer.MIN_VALUE : nums2[j - 1];
            int right2 = j == n2 ? Integer.MAX_VALUE : nums2[j];
            if (left1 <= right2 && left2 <= right1) {
                int maxL = Math.max(left1, left2);
                int minR = Math.min(right1, right2);
                return (n1 + n2) % 2 == 1 ? maxL : (maxL + minR) / 2.0;
            } else if (left1 > right2) hi = i - 1;
            else lo = i + 1;
        }
        return 0;
    }
}`,
      python: `class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        n1, n2 = len(nums1), len(nums2)
        lo, hi = 0, n1
        while lo <= hi:
            i = (lo + hi) // 2
            j = (n1 + n2 + 1) // 2 - i
            left1  = float('-inf') if i == 0  else nums1[i - 1]
            right1 = float('inf')  if i == n1 else nums1[i]
            left2  = float('-inf') if j == 0  else nums2[j - 1]
            right2 = float('inf')  if j == n2 else nums2[j]
            if left1 <= right2 and left2 <= right1:
                max_left = max(left1, left2)
                min_right = min(right1, right2)
                if (n1 + n2) % 2 == 1:
                    return float(max_left)
                return (max_left + min_right) / 2.0
            elif left1 > right2:
                hi = i - 1
            else:
                lo = i + 1
        return 0.0`,
    },
  },

  'longest palindromic substring': {
    time: 'O(N²)', space: 'O(1)',
    approach: 'Expand around each index treating it as the center of a potential palindrome. Check both odd and even length palindromes.',
    solutions: {
      c: `char* longestPalindrome(char* s) {
    int n = 0;
    while (s[n]) n++;
    int start = 0, maxLen = 1;
    for (int i = 0; i < n; i++) {
        /* odd length */
        int l = i, r = i;
        while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }
        if (r - l - 1 > maxLen) { start = l + 1; maxLen = r - l - 1; }
        /* even length */
        l = i; r = i + 1;
        while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }
        if (r - l - 1 > maxLen) { start = l + 1; maxLen = r - l - 1; }
    }
    char* res = (char*)malloc(maxLen + 1);
    for (int i = 0; i < maxLen; i++) res[i] = s[start + i];
    res[maxLen] = '\\0';
    return res;
}`,
      java: `class Solution {
    public String longestPalindrome(String s) {
        int start = 0, maxLen = 1;
        for (int i = 0; i < s.length(); i++) {
            int len1 = expand(s, i, i);
            int len2 = expand(s, i, i + 1);
            int len = Math.max(len1, len2);
            if (len > maxLen) {
                maxLen = len;
                start = i - (len - 1) / 2;
            }
        }
        return s.substring(start, start + maxLen);
    }

    private int expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
            l--; r++;
        }
        return r - l - 1;
    }
}`,
      python: `class Solution:
    def longestPalindrome(self, s: str) -> str:
        start, max_len = 0, 1
        def expand(l: int, r: int) -> int:
            while l >= 0 and r < len(s) and s[l] == s[r]:
                l -= 1; r += 1
            return r - l - 1
        for i in range(len(s)):
            ln = max(expand(i, i), expand(i, i + 1))
            if ln > max_len:
                max_len = ln
                start = i - (ln - 1) // 2
        return s[start:start + max_len]`,
    },
  },

  'container with most water': {
    time: 'O(N)', space: 'O(1)',
    approach: 'Two pointers from both ends. Move the pointer with the shorter height inward, tracking maximum area.',
    solutions: {
      c: `int maxArea(int* height, int n) {
    int l = 0, r = n - 1, best = 0;
    while (l < r) {
        int h = height[l] < height[r] ? height[l] : height[r];
        int area = h * (r - l);
        if (area > best) best = area;
        if (height[l] < height[r]) l++;
        else r--;
    }
    return best;
}`,
      java: `class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1, best = 0;
        while (l < r) {
            int h = Math.min(height[l], height[r]);
            best = Math.max(best, h * (r - l));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return best;
    }
}`,
      python: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        l, r, best = 0, len(height) - 1, 0
        while l < r:
            best = max(best, min(height[l], height[r]) * (r - l))
            if height[l] < height[r]:
                l += 1
            else:
                r -= 1
        return best`,
    },
  },

  '3sum': {
    time: 'O(N²)', space: 'O(1)',
    approach: 'Sort the array. Fix one element, then use two pointers on the remaining range. Skip duplicates.',
    solutions: {
      c: `#include <stdlib.h>

int cmp(const void* a, const void* b) {
    return *(int*)a - *(int*)b;
}

int** threeSum(int* nums, int n, int* returnSize, int** returnColumnSizes) {
    qsort(nums, n, sizeof(int), cmp);
    int cap = 256;
    int** res = (int**)malloc(cap * sizeof(int*));
    *returnSize = 0;
    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int l = i + 1, r = n - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum == 0) {
                res[*returnSize] = (int*)malloc(3 * sizeof(int));
                res[*returnSize][0] = nums[i];
                res[*returnSize][1] = nums[l];
                res[*returnSize][2] = nums[r];
                (*returnSize)++;
                while (l < r && nums[l] == nums[l + 1]) l++;
                while (l < r && nums[r] == nums[r - 1]) r--;
                l++; r--;
            } else if (sum < 0) l++;
            else r--;
        }
    }
    *returnColumnSizes = (int*)malloc(*returnSize * sizeof(int));
    for (int i = 0; i < *returnSize; i++) (*returnColumnSizes)[i] = 3;
    return res;
}`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    result.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return result;
    }
}`,
      python: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        result = []
        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s == 0:
                    result.append([nums[i], nums[l], nums[r]])
                    while l < r and nums[l] == nums[l + 1]: l += 1
                    while l < r and nums[r] == nums[r - 1]: r -= 1
                    l += 1; r -= 1
                elif s < 0: l += 1
                else: r -= 1
        return result`,
    },
  },

  'letter combinations of a phone number': {
    time: 'O(4^N)', space: 'O(N)',
    approach: 'Backtracking: map each digit to its letters, recursively build all combinations.',
    solutions: {
      c: `#include <stdlib.h>
#include <string.h>

static const char* mapping[] = {"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};

void bt(char* digits, int idx, char* path, int depth, char** res, int* count) {
    if (!digits[idx]) {
        path[depth] = '\\0';
        res[*count] = strdup(path);
        (*count)++;
        return;
    }
    const char* letters = mapping[digits[idx] - '0'];
    for (int i = 0; letters[i]; i++) {
        path[depth] = letters[i];
        bt(digits, idx + 1, path, depth + 1, res, count);
    }
}

char** letterCombinations(char* digits, int* returnSize) {
    *returnSize = 0;
    if (!digits[0]) return NULL;
    int cap = 1;
    for (int i = 0; digits[i]; i++) cap *= 4;
    char** res = (char**)malloc(cap * sizeof(char*));
    char path[5];
    bt(digits, 0, path, 0, res, returnSize);
    return res;
}`,
      java: `import java.util.*;

class Solution {
    private static final String[] MAP = {"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};

    public List<String> letterCombinations(String digits) {
        List<String> result = new ArrayList<>();
        if (digits.isEmpty()) return result;
        backtrack(digits, 0, new StringBuilder(), result);
        return result;
    }

    private void backtrack(String digits, int idx, StringBuilder path, List<String> result) {
        if (idx == digits.length()) {
            result.add(path.toString());
            return;
        }
        for (char c : MAP[digits.charAt(idx) - '0'].toCharArray()) {
            path.append(c);
            backtrack(digits, idx + 1, path, result);
            path.deleteCharAt(path.length() - 1);
        }
    }
}`,
      python: `class Solution:
    def letterCombinations(self, digits: str) -> list[str]:
        if not digits:
            return []
        mapping = {"2":"abc","3":"def","4":"ghi","5":"jkl",
                   "6":"mno","7":"pqrs","8":"tuv","9":"wxyz"}
        result = []
        def backtrack(idx: int, path: list[str]):
            if idx == len(digits):
                result.append("".join(path))
                return
            for ch in mapping[digits[idx]]:
                path.append(ch)
                backtrack(idx + 1, path)
                path.pop()
        backtrack(0, [])
        return result`,
    },
  },

  'remove nth node from end of list': {
    time: 'O(N)', space: 'O(1)',
    approach: 'Use two pointers separated by n nodes. When the fast pointer reaches the end, the slow pointer is at the node before the target.',
    solutions: {
      c: `struct ListNode { int val; struct ListNode *next; };

struct ListNode* removeNthFromEnd(struct ListNode* head, int n) {
    struct ListNode dummy = {0, head};
    struct ListNode *fast = &dummy, *slow = &dummy;
    for (int i = 0; i <= n; i++) fast = fast->next;
    while (fast) { fast = fast->next; slow = slow->next; }
    struct ListNode* del = slow->next;
    slow->next = del->next;
    return dummy.next;
}`,
      java: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode fast = dummy, slow = dummy;
        for (int i = 0; i <= n; i++) fast = fast.next;
        while (fast != null) { fast = fast.next; slow = slow.next; }
        slow.next = slow.next.next;
        return dummy.next;
    }
}`,
      python: `class Solution:
    def removeNthFromEnd(self, head: ListNode, n: int) -> ListNode:
        dummy = ListNode(0, head)
        fast = slow = dummy
        for _ in range(n + 1):
            fast = fast.next
        while fast:
            fast = fast.next
            slow = slow.next
        slow.next = slow.next.next
        return dummy.next`,
    },
  },

  'valid parentheses': {
    time: 'O(N)', space: 'O(N)',
    approach: 'Push opening brackets onto a stack. For closing brackets, check the top matches. Return true if stack is empty at end.',
    solutions: {
      c: `#include <stdbool.h>
#include <string.h>

bool isValid(char* s) {
    int n = strlen(s);
    char stack[n];
    int top = -1;
    for (int i = 0; s[i]; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') {
            stack[++top] = c;
        } else {
            if (top < 0) return false;
            char open = stack[top--];
            if ((c == ')' && open != '(') ||
                (c == ']' && open != '[') ||
                (c == '}' && open != '{'))
                return false;
        }
    }
    return top == -1;
}`,
      java: `import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '[') stack.push(']');
            else if (c == '{') stack.push('}');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        pairs = {')': '(', ']': '[', '}': '{'}
        for ch in s:
            if ch in '([{':
                stack.append(ch)
            elif not stack or stack.pop() != pairs[ch]:
                return False
        return len(stack) == 0`,
    },
  },

  'merge two sorted lists': {
    time: 'O(N+M)', space: 'O(1)',
    approach: 'Iterate both lists, always picking the smaller head. Attach remaining nodes at the end.',
    solutions: {
      c: `struct ListNode { int val; struct ListNode *next; };

struct ListNode* mergeTwoLists(struct ListNode* l1, struct ListNode* l2) {
    struct ListNode dummy = {0, NULL};
    struct ListNode* tail = &dummy;
    while (l1 && l2) {
        if (l1->val <= l2->val) { tail->next = l1; l1 = l1->next; }
        else { tail->next = l2; l2 = l2->next; }
        tail = tail->next;
    }
    tail->next = l1 ? l1 : l2;
    return dummy.next;
}`,
      java: `class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
            else { tail.next = l2; l2 = l2.next; }
            tail = tail.next;
        }
        tail.next = l1 != null ? l1 : l2;
        return dummy.next;
    }
}`,
      python: `class Solution:
    def mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:
        dummy = tail = ListNode(0)
        while l1 and l2:
            if l1.val <= l2.val:
                tail.next = l1; l1 = l1.next
            else:
                tail.next = l2; l2 = l2.next
            tail = tail.next
        tail.next = l1 or l2
        return dummy.next`,
    },
  },
};
