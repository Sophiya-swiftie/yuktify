# YUKTIFY - AI-Powered Interview Preparation Platform

YUKTIFY is a modern, ChatGPT-inspired web application built with Next.js 15, TypeScript, and Tailwind CSS. It helps students and professionals prepare for technical interviews at 100+ top tech companies.

## Features

- **ChatGPT-Style UI**: Clean, neutral dark theme with modern glassmorphism.
- **Company-Wise Prep**: 100 top companies with role-specific tracks (SDE, Frontend, Backend).
- **AI Assistant**: Integrated OpenAI-powered chat for real-time technical guidance.
- **Rich Question Cards**: Expandable sections for Approach, Solution, and Justification.
- **Syntax Highlighting**: Beautiful code blocks with copy functionality.
- **Advanced Filtering**: Search by title, tags, or filter by difficulty and role.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Syntax Highlighting**: React Syntax Highlighter
- **AI**: OpenAI API (GPT-4o-mini)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- OpenAI API Key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Rename `.env.example` to `.env.local`
   - Add your `OPENAI_API_KEY`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to see the result.

## Project Structure

```
/src
  /app         - App Router pages and API routes
  /components  - Reusable UI components
  /data        - Static data for companies and questions
  /lib         - Utility functions and helpers
  /types       - TypeScript interfaces
/public        - Static assets
```

## Deployment

Deploy easily to Vercel:

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add your `OPENAI_API_KEY` in Environment Variables.
4. Deploy!

## License

MIT
