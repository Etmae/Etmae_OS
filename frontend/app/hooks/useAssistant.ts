// frontend/hooks/useAssistant.ts
import { useState, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIResponse {
  message?: string;
  action?: "NONE" | "OPEN_PROJECT" | "OPEN_SKILLS" | "OPEN_CONTACT";
  payload?: { projectId?: string };
}

// ============================================================
// SANITIZER — strips leaked JSON, XML/HTML tags, and control
// characters from AI message strings before storing them.
// This is the last line of defence before content hits the UI.
// ============================================================
function sanitizeAIMessage(raw: string): string {
  return raw
    .replace(/\{[\s\S]*?\}/g, "")        // remove any leaked JSON blobs
    .replace(/<[^>]+>/g, "")             // strip HTML / XML tags
    .replace(/[<>{}]/g, "")              // stray angle brackets or braces
    .replace(/<\//g, "")                 // the </</< artifact flood
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // control chars
    .trim();
}

// frontend/hooks/useAssistant.ts
// ... (keep your Message, AIResponse interfaces, and sanitizeAIMessage function exactly as they are)

export function useAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const fallbackMessage = "Something went wrong. Try again.";

  const sendMessage = useCallback(
    async (
      input: string,
      onAction?: (
        action: AIResponse["action"],
        payload: AIResponse["payload"],
        messageText: string // 👈 Added so HeroOrb can run detectNavigationIntent
      ) => void,
      options?: { source?: "app" | "hero" } // 👈 Added to control backend logic
    ) => {
      const trimmedInput = input.trim();
      if (!trimmedInput) return;

      const userMessage: Message = { role: "user", content: trimmedInput };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        let res: Response;
        try {
          res = await fetch(`${backendUrl}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: trimmedInput,
              conversationHistory: messages.slice(-6),
              source: options?.source || "app", // 👈 Defaults to "app", overridden by Orb
            }),
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeoutId);
        }

        let data: AIResponse | null = null;
        try {
          data = (await res.json()) as AIResponse;
        } catch {
          data = null;
        }

        const rawMessage =
          typeof data?.message === "string" && data.message.trim()
            ? data.message
            : !res.ok
            ? `Request failed (${res.status}). Please try again.`
            : fallbackMessage;

        const safeContent = sanitizeAIMessage(rawMessage) || fallbackMessage;
        const assistantMessage: Message = { role: "assistant", content: safeContent };

        setMessages((prev) => [...prev, assistantMessage]);

        // 👈 Always trigger onAction if provided, so the Orb can read safeContent
        if (onAction) {
          onAction(data?.action || "NONE", data?.payload ?? {}, safeContent);
        }
      } catch (err: any) {
        if (err?.name === "AbortError") {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "Request timed out. Please try again." },
          ]);
          return;
        }
        setMessages((prev) => [...prev, { role: "assistant", content: fallbackMessage }]);
      } finally {
        setLoading(false);
      }
    },
    [messages]
  );

  const clearHistory = () => setMessages([]);

  return { messages, loading, sendMessage, clearHistory };
}