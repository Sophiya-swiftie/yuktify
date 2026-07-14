# YUKTIFY - Technical Interview Preparation Platform

YUKTIFY is a production-ready, highly interactive platform designed to help developers prepare for software engineering interviews. It features curated, company-wise coding and conceptual questions, automated status tracking, real-time Gemini AI assistance, and premium styling.

---

## 🚀 Features

*   **100+ Companies**: Curated preparation paths for major tech firms (Google, Microsoft, Amazon, Meta, etc.).
*   **Role Filtering**: Filter questions by SDE, Frontend, and Backend domains.
*   **Progress Tracking**: Mark questions as *Todo*, *Attempted*, *Solved*, or *Revision*. 
*   **Database Synchronization**: Auto-synchronizes local guest progress and bookmarks to PostgreSQL when the user signs up or logs in.
*   **Supabase Authentication**: Secure email sign-in/sign-up and Google OAuth integration.
*   **Gemini AI Chat**: Context-aware AI code explanations and hints powered by Google Gemini.
*   **Multi-Language Solutions**: High-quality code implementations available in Python, Java, and C++.
*   **Responsive Dark Mode UI**: Built with modern UI elements, custom scrollbars, and premium animations.

---

## 🛠️ Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS & Vanilla CSS (custom design system tokens)
*   **Database & Auth**: Supabase (PostgreSQL & GoTrue)
*   **AI Integration**: Google Gemini SDK (Server-Side)
*   **Deployment**: Vercel

---

## 📦 Installation

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Sophiya-swiftie/yuktify.git
    cd yuktify
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```bash
# Gemini API Key (Server-side)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Credentials (Client & Server)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

---

## 💻 Running Locally

1.  **Start the Development Server**:
    ```bash
    npm run dev
    ```
2.  **Open the App**:
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

3.  **Code Verification**:
    ```bash
    # Run linter checks
    npm run lint

    # Compile production build
    npm run build
    ```

---

## 🌐 Deployment Instructions

### Deploy to Vercel

1.  **Initialize Vercel Project**:
    ```bash
    npx vercel
    ```

2.  **Add Environment Variables**:
    Configure `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the Vercel Dashboard under **Settings > Environment Variables**.

3.  **Production Release**:
    ```bash
    npx vercel --prod
    ```

---

## 📂 Folder Structure

```
yuktify/
├── src/
│   ├── app/                 # Next.js 16 page routes & layouts
│   │   ├── auth/            # Sign in and sign up interfaces
│   │   ├── profile/         # User dashboard & progress charts
│   │   ├── api/             # Serverless API routes (Gemini Chat API)
│   │   └── company/         # Company-specific practice routes
│   ├── components/          # Reusable UI controls (Sidebar, Header, QuestionCard)
│   ├── data/                # Hardcoded question pools & multi-language solutions
│   ├── lib/                 # Core client configuration (Supabase, utilities)
│   ├── providers/           # React context engines (AuthProvider)
│   └── proxy.ts             # Edge router proxy for route protection
├── supabase/
│   └── migrations/          # PostgreSQL schema migrations
├── .env.example             # Empty placeholders for configuration variables
├── .gitignore               # Configured to secure keys & cache directories
└── package.json             # NPM metadata and dependencies
```
