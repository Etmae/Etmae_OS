import { AIProvider, AIRequest, AIResponse } from "./types";

export class DeepSeekProvider implements AIProvider {
  name = "deepseek";

  async call(request: AIRequest): Promise<AIResponse> {
    const PROVIDER_TIMEOUT_MS = Number(process.env.AI_PROVIDER_TIMEOUT_MS ?? 15000);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

    try {
      const res = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: request.prompt }],
          max_tokens: request.maxTokens ?? 512,
          temperature: request.temperature ?? 0.7,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`DeepSeek HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(`DeepSeek error: ${data.error.message}`);
      }

      return {
        text: data.choices?.[0]?.message?.content ?? "",
        provider: this.name,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}