import { NextRequest, NextResponse } from "next/server";
import { getRelevantContext, addToContext } from "@/libs/ai/rag";
import { getCorsHeaders } from "@/libs/cors";
// ============================================================
// RATE LIMITING — simple in-memory per-IP limiter
// ============================================================
const RATE_LIMIT_MAX = 20;
const WINDOW_MS = 60 * 1000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count += 1;
  return false;
}

// ============================================================
// CONSTANTS & PERSONAS
// ============================================================
const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_ITEMS = 6;

const systemMessage = {
  role: "system",
  content: `You are the personal AI representative for Etmae, a software developer. 
  Use the following context to answer questions as if you are Etmae. 
  
  Context:
  ${addToContext}
  
  Rules:
  1. Use "I", "me", and "my" (e.g., "I have experience with React" instead of "The developer has experience").
  2. If the context doesn't mention a specific project, mention your general skills and experience instead.
  3. Keep answers concise and professional.`
};

const PERSONAS: Record<string, string> = {
  hero: `
You are an AI assistant on a developer's portfolio hero section.
RULES:
- Keep responses to 1-2 sentences maximum
- Be punchy, confident, and impressive
- If the question relates to skills/projects/contact, hint to explore further
- Never list more than 3 items
  `.trim(),

  terminal: `
You are a CLI assistant on a developer's portfolio terminal.
RULES:
- Plain text only, no markdown
- Be technical and direct
- Short sentences, max 5 lines
- You may use "-" bullet prefix only
  `.trim(),

  app: `
You are a full AI assistant on a developer's portfolio OS.
RULES:
- Be detailed and helpful
- Use paragraph form where appropriate
- Reference specific projects when relevant
- Suggest sections for the user to explore if applicable
  `.trim(),
};



// Streaming response format: send natural text first, with metadata JSON appended on the final line.
const STREAMING_FORMAT_RULE = `
CRITICAL RESPONSE FORMAT:
You must respond naturally. Then, on a new line at the absolute end of your response, you MUST append a routing metadata block.
Format exactly like this:
__METADATA__ {"action": "NONE" | "OPEN_PROJECT" | "OPEN_SKILLS" | "OPEN_CONTACT", "payload": { "projectId": "optional-id" }}

Example:
Yes, I have experience with React and Next.js. I built a dashboard using them.
__METADATA__ {"action": "OPEN_PROJECT", "payload": {"projectId": "react-dashboard"}}
`.trim();



// ============================================================
// CORS PREFLIGHT
// ============================================================
export async function OPTIONS(req: NextRequest) {
  const headers = getCorsHeaders(req.headers.get("origin"));
  return new Response(null, { status: 204, headers });
}

// ============================================================
// MAIN HANDLER
// ============================================================
export async function POST(req: NextRequest) {
  const headers = getCorsHeaders(req.headers.get("origin"));

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Too many requests. Please wait." },
      { status: 429, headers },
    );
  }

  try {
    const body = await req.json();
    const { message, conversationHistory = [], source = "app" } = body;

    // --- Input validation ---
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400, headers },
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: "Message too long." },
        { status: 400, headers },
      );
    }

    // --- Sanitize history ---
    const safeHistory = Array.isArray(conversationHistory)
      ? conversationHistory
          .filter((m) => m?.role && m?.content)
          .slice(-MAX_HISTORY_ITEMS)
          .map((m) => ({ role: m.role, content: m.content.slice(0, 500) }))
      : [];

    // --- 1. Fetch RAG Context ---
    const context = await getRelevantContext(message);
    console.log("[RAG Context]:", context);
    // --- 2. Build Prompt ---
    const persona = PERSONAS[source] ?? PERSONAS.app;
    const systemPrompt = `
${persona}

${STREAMING_FORMAT_RULE}

${systemMessage.content.replace("${addToContext}", context)}
DATABASE CONTEXT:
${context}
    `.trim();

    // Prepare messages array for the AI provider
    const messages = [
      { role: "system", content: systemPrompt },
      ...safeHistory,
      { role: "user", content: message },
    ];

    // 3. Request the AI provider using an OpenAI/OpenRouter-compatible endpoint.
    const aiResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          // OpenRouter specific headers (Required for some rankings/models)
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Etmae Portfolio AI",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: messages,
          temperature: 0.4,
          max_tokens: 300,
          stream: true,
        }),
      },
    );

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("[OpenRouter Error]:", errorText);
      return new Response(JSON.stringify({ error: "AI Provider Error" }), {
        status: aiResponse.status,
      });
    }

    // --- 4. Pipe Stream to Client ---
    // We pass the raw Server-Sent Events (SSE) stream directly to the frontend.
    const stream = new ReadableStream({
      async start(controller) {
        const reader = aiResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } catch (e) {
          console.error("Streaming error", e);
        } finally {
          controller.close();
        }
      },
    });

    // Return the stream with proper text/event-stream headers
    const streamHeaders = new Headers(headers);
    streamHeaders.set("Content-Type", "text/event-stream");
    streamHeaders.set("Cache-Control", "no-cache");
    streamHeaders.set("Connection", "keep-alive");

    return new NextResponse(stream, { headers: streamHeaders });
  } catch (err) {
    console.error("[Chat Route Error]:", err);
    return NextResponse.json(
      { error: "I encountered an issue connecting to my neural network." },
      { status: 500, headers },
    );
  }
}
