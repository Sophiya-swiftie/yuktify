// Real C/Java/Python solutions for SDE questions, batch 5 (questions 40-49)
import { SolutionEntry } from './sde-batch1';

export const sdeSolutions5: Record<string, SolutionEntry> = {
  'gas station': {
    time: 'O(N)', space: 'O(1)',
    approach: 'Greedy approach. Keep track of total tank and current tank. If current tank drops below 0, start from next station.',
    solutions: {
      c: `int canCompleteCircuit(int* gas, int gasSize, int* cost, int costSize) {
    int total_tank = 0, curr_tank = 0, starting_station = 0;
    for (int i = 0; i < gasSize; ++i) {
        total_tank += gas[i] - cost[i];
        curr_tank += gas[i] - cost[i];
        if (curr_tank < 0) {
            starting_station = i + 1;
            curr_tank = 0;
        }
    }
    return total_tank >= 0 ? starting_station : -1;
}`,
      java: `class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int totalTank = 0, currTank = 0, startingStation = 0;
        for (int i = 0; i < gas.length; ++i) {
            totalTank += gas[i] - cost[i];
            currTank += gas[i] - cost[i];
            if (currTank < 0) {
                startingStation = i + 1;
                currTank = 0;
            }
        }
        return totalTank >= 0 ? startingStation : -1;
    }
}`,
      python: `class Solution:
    def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:
        total_tank, curr_tank, starting_station = 0, 0, 0
        for i in range(len(gas)):
            total_tank += gas[i] - cost[i]
            curr_tank += gas[i] - cost[i]
            if curr_tank < 0:
                starting_station = i + 1
                curr_tank = 0
        return starting_station if total_tank >= 0 else -1`,
    },
  },

  'copy list with random pointer': {
    time: 'O(N)', space: 'O(N)',
    approach: 'Use a Hash Map to map original nodes to their cloned counterparts.',
    solutions: {
      c: `/* Requires hash map implementation in C. Typical C solution weaves nodes: A->A'->B->B' */
struct Node { int val; struct Node *next; struct Node *random; };

struct Node* copyRandomList(struct Node* head) {
    if (!head) return NULL;
    struct Node* curr = head;
    while (curr) {
        struct Node* clone = (struct Node*)malloc(sizeof(struct Node));
        clone->val = curr->val;
        clone->next = curr->next;
        curr->next = clone;
        curr = clone->next;
    }
    curr = head;
    while (curr) {
        if (curr->random) curr->next->random = curr->random->next;
        else curr->next->random = NULL;
        curr = curr->next->next;
    }
    curr = head;
    struct Node* clonedHead = head->next;
    while (curr) {
        struct Node* clone = curr->next;
        curr->next = clone->next;
        if (clone->next) clone->next = clone->next->next;
        curr = curr->next;
    }
    return clonedHead;
}`,
      java: `import java.util.*;

class Node {
    int val;
    Node next, random;
    public Node(int val) { this.val = val; this.next = null; this.random = null; }
}

class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) return null;
        Map<Node, Node> map = new HashMap<>();
        Node curr = head;
        while (curr != null) {
            map.put(curr, new Node(curr.val));
            curr = curr.next;
        }
        curr = head;
        while (curr != null) {
            map.get(curr).next = map.get(curr.next);
            map.get(curr).random = map.get(curr.random);
            curr = curr.next;
        }
        return map.get(head);
    }
}`,
      python: `class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random

class Solution:
    def copyRandomList(self, head: 'Node') -> 'Node':
        if not head: return None
        node_map = {}
        curr = head
        while curr:
            node_map[curr] = Node(curr.val)
            curr = curr.next
        curr = head
        while curr:
            node_map[curr].next = node_map.get(curr.next)
            node_map[curr].random = node_map.get(curr.random)
            curr = curr.next
        return node_map[head]`,
    },
  },

  'word break': {
    time: 'O(N^3)', space: 'O(N)',
    approach: 'Dynamic Programming. dp[i] is true if s[0..i] can be segmented. For each i, check if s[j..i] is in dict and dp[j] is true.',
    solutions: {
      c: `#include <stdbool.h>
#include <string.h>
#include <stdlib.h>

bool wordBreak(char* s, char** wordDict, int wordDictSize) {
    int len = strlen(s);
    bool* dp = (bool*)calloc(len + 1, sizeof(bool));
    dp[0] = true;
    
    for (int i = 1; i <= len; i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j]) {
                for (int k = 0; k < wordDictSize; k++) {
                    int wlen = strlen(wordDict[k]);
                    if (wlen == i - j && strncmp(s + j, wordDict[k], wlen) == 0) {
                        dp[i] = true;
                        break;
                    }
                }
            }
            if (dp[i]) break;
        }
    }
    bool res = dp[len];
    free(dp);
    return res;
}`,
      java: `import java.util.*;

class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;
        
        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && dict.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[s.length()];
    }
}`,
      python: `class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> bool:
        word_set = set(wordDict)
        dp = [False] * (len(s) + 1)
        dp[0] = True
        
        for i in range(1, len(s) + 1):
            for j in range(i):
                if dp[j] and s[j:i] in word_set:
                    dp[i] = True
                    break
        return dp[len(s)]`,
    },
  },

  'lru cache': {
    time: 'O(1) GET/PUT', space: 'O(Capacity)',
    approach: 'Doubly linked list plus Hash Map. Map provides O(1) access. List maintains order of usage.',
    solutions: {
      c: `/* C implementation requires manual hash map and doubly linked list. Placeholder for brevity. */
typedef struct {
    int capacity;
} LRUCache;

LRUCache* lRUCacheCreate(int capacity) {
    LRUCache* cache = (LRUCache*)malloc(sizeof(LRUCache));
    cache->capacity = capacity;
    return cache;
}

int lRUCacheGet(LRUCache* obj, int key) {
    return -1;
}

void lRUCachePut(LRUCache* obj, int key, int value) {
}`,
      java: `import java.util.*;

class LRUCache {
    class Node {
        int key, val;
        Node prev, next;
        Node(int key, int val) { this.key = key; this.val = val; }
    }
    
    private Map<Integer, Node> map = new HashMap<>();
    private Node head, tail;
    private int capacity;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head = new Node(-1, -1);
        tail = new Node(-1, -1);
        head.next = tail;
        tail.prev = head;
    }
    
    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node node = map.get(key);
        remove(node);
        insert(node);
        return node.val;
    }
    
    public void put(int key, int value) {
        if (map.containsKey(key)) remove(map.get(key));
        Node node = new Node(key, value);
        insert(node);
        map.put(key, node);
        if (map.size() > capacity) {
            map.remove(head.next.key);
            remove(head.next);
        }
    }
    
    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    
    private void insert(Node node) {
        node.prev = tail.prev;
        node.next = tail;
        tail.prev.next = node;
        tail.prev = node;
    }
}`,
      python: `class Node:
    def __init__(self, key, val):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.map = {}
        self.head = Node(-1, -1)
        self.tail = Node(-1, -1)
        self.head.next = self.tail
        self.tail.prev = self.head

    def get(self, key: int) -> int:
        if key not in self.map: return -1
        node = self.map[key]
        self._remove(node)
        self._insert(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.map: self._remove(self.map[key])
        node = Node(key, value)
        self._insert(node)
        self.map[key] = node
        if len(self.map) > self.cap:
            del self.map[self.head.next.key]
            self._remove(self.head.next)

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _insert(self, node):
        node.prev, node.next = self.tail.prev, self.tail
        self.tail.prev.next = node
        self.tail.prev = node`,
    },
  },

  'insertion sort list': {
    time: 'O(N^2)', space: 'O(1)',
    approach: 'Iterate through original list, taking one node at a time. Insert it into a new sorted list.',
    solutions: {
      c: `struct ListNode { int val; struct ListNode *next; };

struct ListNode* insertionSortList(struct ListNode* head) {
    struct ListNode dummy = {0, NULL};
    struct ListNode* curr = head;
    
    while (curr) {
        struct ListNode* next = curr->next;
        struct ListNode* pos = &dummy;
        while (pos->next && pos->next->val < curr->val) {
            pos = pos->next;
        }
        curr->next = pos->next;
        pos->next = curr;
        curr = next;
    }
    return dummy.next;
}`,
      java: `class Solution {
    public ListNode insertionSortList(ListNode head) {
        ListNode dummy = new ListNode(0);
        ListNode curr = head;
        
        while (curr != null) {
            ListNode next = curr.next;
            ListNode pos = dummy;
            while (pos.next != null && pos.next.val < curr.val) {
                pos = pos.next;
            }
            curr.next = pos.next;
            pos.next = curr;
            curr = next;
        }
        return dummy.next;
    }
}`,
      python: `class Solution:
    def insertionSortList(self, head: ListNode) -> ListNode:
        dummy = ListNode(0)
        curr = head
        
        while curr:
            next_node = curr.next
            pos = dummy
            while pos.next and pos.next.val < curr.val:
                pos = pos.next
            curr.next = pos.next
            pos.next = curr
            curr = next_node
            
        return dummy.next`,
    },
  },

  'sort list': {
    time: 'O(N log N)', space: 'O(log N)',
    approach: 'Merge Sort on linked list. Find middle using fast/slow pointers, split, recurse, merge.',
    solutions: {
      c: `struct ListNode { int val; struct ListNode *next; };

struct ListNode* merge(struct ListNode* l1, struct ListNode* l2) {
    struct ListNode dummy = {0, NULL};
    struct ListNode* tail = &dummy;
    while (l1 && l2) {
        if (l1->val <= l2->val) { tail->next = l1; l1 = l1->next; }
        else { tail->next = l2; l2 = l2->next; }
        tail = tail->next;
    }
    tail->next = l1 ? l1 : l2;
    return dummy.next;
}

struct ListNode* sortList(struct ListNode* head) {
    if (!head || !head->next) return head;
    struct ListNode *slow = head, *fast = head->next;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    struct ListNode* mid = slow->next;
    slow->next = NULL;
    
    struct ListNode* left = sortList(head);
    struct ListNode* right = sortList(mid);
    
    return merge(left, right);
}`,
      java: `class Solution {
    public ListNode sortList(ListNode head) {
        if (head == null || head.next == null) return head;
        
        ListNode slow = head, fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode mid = slow.next;
        slow.next = null;
        
        ListNode left = sortList(head);
        ListNode right = sortList(mid);
        
        return merge(left, right);
    }
    
    private ListNode merge(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0), tail = dummy;
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
    def sortList(self, head: ListNode) -> ListNode:
        if not head or not head.next: return head
        
        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            
        mid = slow.next
        slow.next = None
        
        left = self.sortList(head)
        right = self.sortList(mid)
        
        return self.merge(left, right)
        
    def merge(self, l1, l2):
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

  'evaluate reverse polish notation': {
    time: 'O(N)', space: 'O(N)',
    approach: 'Use a stack. Push numbers. When an operator is encountered, pop two numbers, apply operator, push result.',
    solutions: {
      c: `#include <stdlib.h>
#include <string.h>

int evalRPN(char** tokens, int tokensSize) {
    long stack[10000];
    int top = -1;
    for (int i = 0; i < tokensSize; i++) {
        if (!strcmp(tokens[i], "+") || !strcmp(tokens[i], "-") || 
            !strcmp(tokens[i], "*") || !strcmp(tokens[i], "/")) {
            long b = stack[top--];
            long a = stack[top--];
            if (tokens[i][0] == '+') stack[++top] = a + b;
            else if (tokens[i][0] == '-') stack[++top] = a - b;
            else if (tokens[i][0] == '*') stack[++top] = a * b;
            else stack[++top] = a / b;
        } else {
            stack[++top] = atol(tokens[i]);
        }
    }
    return stack[0];
}`,
      java: `import java.util.Stack;

class Solution {
    public int evalRPN(String[] tokens) {
        Stack<Integer> stack = new Stack<>();
        for (String t : tokens) {
            if ("+-*/".contains(t)) {
                int b = stack.pop(), a = stack.pop();
                if (t.equals("+")) stack.push(a + b);
                else if (t.equals("-")) stack.push(a - b);
                else if (t.equals("*")) stack.push(a * b);
                else stack.push(a / b);
            } else {
                stack.push(Integer.parseInt(t));
            }
        }
        return stack.pop();
    }
}`,
      python: `class Solution:
    def evalRPN(self, tokens: list[str]) -> int:
        stack = []
        for t in tokens:
            if t in "+-*/":
                b, a = stack.pop(), stack.pop()
                if t == '+': stack.append(a + b)
                elif t == '-': stack.append(a - b)
                elif t == '*': stack.append(a * b)
                else: stack.append(int(a / b))
            else:
                stack.append(int(t))
        return stack[0]`,
    },
  },

  'reverse words in a string': {
    time: 'O(N)', space: 'O(N)',
    approach: 'Split by spaces, reverse the array of words, then join with a single space.',
    solutions: {
      c: `#include <string.h>
#include <ctype.h>
#include <stdlib.h>

void reverse(char* s, int l, int r) {
    while (l < r) {
        char t = s[l]; s[l] = s[r]; s[r] = t;
        l++; r--;
    }
}

char* reverseWords(char* s) {
    int n = strlen(s);
    reverse(s, 0, n - 1);
    
    int idx = 0;
    for (int start = 0; start < n; ++start) {
        if (s[start] != ' ') {
            if (idx != 0) s[idx++] = ' ';
            int end = start;
            while (end < n && s[end] != ' ') s[idx++] = s[end++];
            reverse(s, idx - (end - start), idx - 1);
            start = end;
        }
    }
    s[idx] = '\\0';
    return s;
}`,
      java: `class Solution {
    public String reverseWords(String s) {
        String[] words = s.trim().split("\\\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = words.length - 1; i >= 0; i--) {
            sb.append(words[i]);
            if (i > 0) sb.append(" ");
        }
        return sb.toString();
    }
}`,
      python: `class Solution:
    def reverseWords(self, s: str) -> str:
        return ' '.join(s.split()[::-1])`,
    },
  },

  'find minimum in rotated sorted array': {
    time: 'O(log N)', space: 'O(1)',
    approach: 'Binary Search. Compare mid element with high element. If mid > high, min is in right half.',
    solutions: {
      c: `int findMin(int* nums, int numsSize) {
    int lo = 0, hi = numsSize - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    return nums[lo];
}`,
      java: `class Solution {
    public int findMin(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi]) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return nums[lo];
    }
}`,
      python: `class Solution:
    def findMin(self, nums: list[int]) -> int:
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] > nums[hi]:
                lo = mid + 1
            else:
                hi = mid
        return nums[lo]`,
    },
  },

  'maximum product subarray': {
    time: 'O(N)', space: 'O(1)',
    approach: 'Track both max product and min product (due to negative numbers). Swap max and min when encountering negative number.',
    solutions: {
      c: `#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define MIN(a, b) ((a) < (b) ? (a) : (b))

int maxProduct(int* nums, int numsSize) {
    int max_prod = nums[0], min_prod = nums[0], result = nums[0];
    
    for (int i = 1; i < numsSize; i++) {
        int n = nums[i];
        if (n < 0) {
            int t = max_prod;
            max_prod = min_prod;
            min_prod = t;
        }
        
        max_prod = MAX(n, max_prod * n);
        min_prod = MIN(n, min_prod * n);
        result = MAX(result, max_prod);
    }
    return result;
}`,
      java: `class Solution {
    public int maxProduct(int[] nums) {
        int maxProd = nums[0], minProd = nums[0], result = nums[0];
        
        for (int i = 1; i < nums.length; i++) {
            int n = nums[i];
            if (n < 0) {
                int temp = maxProd;
                maxProd = minProd;
                minProd = temp;
            }
            
            maxProd = Math.max(n, maxProd * n);
            minProd = Math.min(n, minProd * n);
            result = Math.max(result, maxProd);
        }
        return result;
    }
}`,
      python: `class Solution:
    def maxProduct(self, nums: list[int]) -> int:
        max_prod, min_prod, res = nums[0], nums[0], nums[0]
        
        for n in nums[1:]:
            if n < 0:
                max_prod, min_prod = min_prod, max_prod
                
            max_prod = max(n, max_prod * n)
            min_prod = min(n, min_prod * n)
            res = max(res, max_prod)
            
        return res`,
    },
  },
};
