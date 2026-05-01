import { AIProvider, AIRequest, AIResponse } from "./types";

export class GeminiProvider implements AIProvider {
  name = "gemini";

  async call(request: AIRequest): Promise<AIResponse> {
    const PROVIDER_TIMEOUT_MS = Number(process.env.AI_PROVIDER_TIMEOUT_MS ?? 15000);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: request.prompt }] }],
          generationConfig: {
            temperature: request.temperature ?? 0.7,
            maxOutputTokens: request.maxTokens ?? 512,
          },
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Gemini HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(`Gemini error: ${data.error.message}`);
      }

      return {
        text: data.candidates?.[0]?.content?.parts?.[0]?.text ?? "",
        provider: this.name,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}