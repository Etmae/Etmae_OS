// frontend/hooks/useAssistant.ts
import { useState, useCallback } from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
  // Type extensions required to properly type the assistant hook exports and eliminate TypeScript errors.
  action?: "NONE" | "OPEN_PROJECT" | "OPEN_SKILLS" | "OPEN_CONTACT";
  payload?: { projectId?: string };
}

export interface AIResponse {
  message?: string;
  action?: Message["action"];
  payload?: Message["payload"];
}

export function useAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(
    async (
      input: string,
      onAction?: (action: Message["action"], payload: Message["payload"], messageText: string) => void,
      options?: { source?: "app" | "hero" | "terminal" }
    ) => {
      const trimmedInput = input.trim();
      if (!trimmedInput) return;

      // 1. Add user message
      setMessages((prev) => [...prev, { role: "user", content: trimmedInput }]);
      setLoading(true);

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        const res = await fetch(`${backendUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmedInput,
            conversationHistory: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
            source: options?.source || "app",
          }),
        });

        if (!res.ok || !res.body) throw new Error("Failed to connect");

        // 2. Add the empty assistant message ONLY when the stream starts
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        let metadataJson = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter(line => line.trim() !== "");
          
          for (const line of lines) {
            const message = line.replace(/^data: /, "");
            if (message === "[DONE]") break;

            try {
              const parsed = JSON.parse(message);
              const content = parsed.choices[0]?.delta?.content || "";
              fullText += content;

              let displayedText = fullText;
              if (fullText.includes("__METADATA__")) {
                const parts = fullText.split("__METADATA__");
                displayedText = parts[0].trim();
                metadataJson = parts[1].trim();
              }

              // Update message content in real-time
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastIdx = newMessages.length - 1;
                if (newMessages[lastIdx].role === "assistant") {
                  newMessages[lastIdx].content = displayedText;
                }
                return newMessages;
              });
            } catch (e) { /* ignore partial JSON */ }
          }
        }

        // 3. Finalize: Store metadata inside the message object itself
        if (metadataJson) {
          try {
            const meta = JSON.parse(metadataJson);
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastIdx = newMessages.length - 1;
              newMessages[lastIdx].action = meta.action;
              newMessages[lastIdx].payload = meta.payload;
              return newMessages;
            });

            if (onAction) onAction(meta.action, meta.payload, fullText.split("__METADATA__")[0].trim());
          } catch (e) {
            console.error("Metadata parse error", e);
          }
        }
      } catch (err) {
        console.error("Stream Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [messages]
  );

  return { messages, loading, sendMessage, clearHistory: () => setMessages([]) };
}