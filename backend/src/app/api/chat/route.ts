import { NextRequest, NextResponse } from "next/server";
import { detectIntent, getContext } from "@/libs/context";
import { routeAIRequest } from "@/libs/ai";
import { getCorsHeaders } from "@/libs/cors";

// ============================================================
// RATE LIMITING — simple in-memory per-IP limiter
// Resets every WINDOW_MS milliseconds
// ============================================================
const RATE_LIMIT_MAX = 20;          // max requests per window per IP
const WINDOW_MS = 60 * 1000;        // 1 minute window

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
// CONSTANTS
// ============================================================
const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_ITEMS = 6; // last N messages kept (aligned with frontend memory)

// ============================================================
// PERSONAS — controls tone/length per source
// Add new personas here as the system grows
// ============================================================
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

const JSON_FORMAT_RULE = `
RESPONSE FORMAT:
Respond ONLY with this exact JSON structure, no markdown, no backticks, no extra text:
{
  "message": "Your natural language response here",
  "action": "NONE" | "OPEN_PROJECT" | "OPEN_SKILLS" | "OPEN_CONTACT",
  "payload": { "projectId": "optional-project-id" }
}

CRITICAL: Output ONLY the JSON object.
- No text before it
- No text after it
- No HTML or XML tags
- No escape sequences outside string values
- No backticks or code fences
`.trim();

const FALLBACK_ASSISTANT_MESSAGE =
  "I couldn't generate a response right now. Please try again in a moment.";

// ============================================================
// JSON CLEANER — strips common AI response artifacts
// ============================================================
function cleanAndParseAIResponse(raw: string): {
  message?: string;
  action?: string;
  payload?: Record<string, unknown>;
} {
  let cleaned = raw
    .replace(/```json[\s\S]*?```/g, (match) => match.replace(/```json|```/g, "")) // unwrap code fences
    .replace(/```/g, "")                  // any remaining backticks
    .replace(/<\//g, "")                  // kills </</< flood artifacts
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // control chars (preserve \n \t)
    .trim();

  // Extract only the JSON object if stray text leaked around it
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  return JSON.parse(cleaned); // throws if still malformed — caught upstream
}

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

  // --- Rate limiting ---
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Too many requests. Please wait a moment and try again.", action: "NONE", payload: {} },
      { status: 429, headers }
    );
  }

  try {
    const body = await req.json();
    const {
      message,
      conversationHistory = [],
      source = "app",
    } = body;

    // --- Input validation ---
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400, headers }
      );
    }

    if (message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400, headers }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { message: "Your message is too long. Please keep it under 1000 characters.", action: "NONE", payload: {} },
        { status: 400, headers }
      );
    }

    // --- Sanitize + cap conversation history ---
    const safeHistory: { role: string; content: string }[] = Array.isArray(conversationHistory)
      ? conversationHistory
          .filter(
            (m) =>
              m &&
              typeof m === "object" &&
              (m.role === "user" || m.role === "assistant") &&
              typeof m.content === "string"
          )
          .slice(-MAX_HISTORY_ITEMS) // keep only last N messages
          .map((m) => ({ role: m.role, content: m.content.slice(0, 500) })) // cap each history item
      : [];

    const intent = detectIntent(message);
    const context = getContext(intent);

    // Pick persona — fall back to "app" if unknown source passed
    const persona = PERSONAS[source] ?? PERSONAS.app;

    const fullPrompt = `
${persona}

${JSON_FORMAT_RULE}

CONTEXT:
${context}

CONVERSATION SO FAR:
${safeHistory.map((m) => `${m.role}: ${m.content}`).join("\n")}

USER: ${message}
    `.trim();

    const aiResponse = await routeAIRequest({
      prompt: fullPrompt,
      maxTokens: 256,
      temperature: 0.4,
    });

    // --- Parse AI response with hardened cleaner ---
    let parsed: { message?: string; action?: string; payload?: Record<string, unknown> };
    try {
      parsed = cleanAndParseAIResponse(aiResponse.text);
    } catch {
      console.error("[Chat Route] JSON parse failed. Raw:", aiResponse.text);
      // Graceful degradation: strip any leaked JSON/tags and use raw text
      const fallbackText = aiResponse.text
        .replace(/\{[\s\S]*\}/g, "")   // remove any JSON blob
        .replace(/<[^>]+>/g, "")        // strip HTML/XML tags
        .replace(/[<>{}]/g, "")         // strip stray brackets
        .trim();

      parsed = {
        message: fallbackText || FALLBACK_ASSISTANT_MESSAGE,
        action: "NONE",
        payload: {},
      };
    }

    // --- Build validated safe response ---
    const safeResponse = {
      message:
        typeof parsed.message === "string" && parsed.message.trim()
          ? parsed.message
          : FALLBACK_ASSISTANT_MESSAGE,
      action:
        parsed.action === "OPEN_PROJECT" ||
        parsed.action === "OPEN_SKILLS" ||
        parsed.action === "OPEN_CONTACT"
          ? parsed.action
          : "NONE",
      payload:
        parsed.payload && typeof parsed.payload === "object"
          ? parsed.payload
          : {},
    };

    // Note: _provider intentionally omitted from response to avoid leaking AI backend info
    return NextResponse.json(safeResponse, { headers });

  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      {
        message: "I encountered an issue. Please try again.",
        action: "NONE",
        payload: {},
      },
      { status: 500, headers }
    );
  }
}