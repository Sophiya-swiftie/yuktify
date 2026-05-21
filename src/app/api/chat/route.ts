import { GoogleGenAI } from '@google/genai';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export const runtime = 'nodejs';

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash'] as const;
const SYSTEM_PROMPT =
  'You are YUKTIFY AI, an expert interview preparation assistant helping students crack software engineering interviews at top tech companies. You excel in Data Structures, Algorithms, Frontend (React/JS/Next.js), Backend (Node/DB/System Design), and behavioral questions. Provide clear, concise, production-minded technical explanations. Include code snippets when useful, call out complexity, and avoid inventing facts about a company-specific process.';

type ChatRequestBody = {
  message?: string;
  messages?: ChatMessage[];
};

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ChatMessage>;
  return (
    (candidate.role === 'user' || candidate.role === 'assistant') &&
    typeof candidate.content === 'string' &&
    candidate.content.trim().length > 0
  );
}

function toGeminiContents(messages: ChatMessage[]) {
  return messages.slice(-12).map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content.trim() }],
  }));
}

function getSafeErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message.replace(process.env.GEMINI_API_KEY || '', '[redacted]');
  }

  return 'Unexpected Gemini API error.';
}

function isRetryableGeminiError(error: unknown) {
  const message = getSafeErrorMessage(error).toLowerCase();
  return (
    message.includes('"code":503') ||
    message.includes('unavailable') ||
    message.includes('high demand') ||
    message.includes('temporarily') ||
    message.includes('rate limit') ||
    message.includes('429')
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateGeminiResponse(ai: GoogleGenAI, messages: ChatMessage[]) {
  let lastError: unknown;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const result = await ai.models.generateContent({
          model,
          contents: toGeminiContents(messages),
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.35,
            maxOutputTokens: 2400,
          },
        });

        return result.text?.trim();
      } catch (error) {
        lastError = error;

        if (!isRetryableGeminiError(error)) {
          throw error;
        }

        await wait(450 * (attempt + 1));
      }
    }
  }

  throw lastError;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: 'Gemini is not configured. Add GEMINI_API_KEY on the server.' },
        { status: 500 },
      );
    }

    const messages = Array.isArray(body.messages)
      ? body.messages.filter(isChatMessage)
      : typeof body.message === 'string'
        ? [{ role: 'user' as const, content: body.message }]
        : [];

    if (!messages.length) {
      return Response.json(
        { error: 'Send a non-empty message to chat with YUKTIFY AI.' },
        { status: 400 },
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const content = await generateGeminiResponse(ai, messages);

    return Response.json({
      content: content || 'I could not generate a useful response. Please try asking again with a little more context.',
    });
  } catch (error: unknown) {
    console.error('YUKTIFY chat API error:', getSafeErrorMessage(error));
    const status = isRetryableGeminiError(error) ? 503 : 500;

    return Response.json(
      {
        error:
          status === 503
            ? 'Gemini is temporarily busy. Please send the message again in a few seconds.'
            : 'Gemini could not complete the request. Please try again in a moment.',
      },
      { status },
    );
  }
}
