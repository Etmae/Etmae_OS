import { AIProvider, AIRequest, AIResponse } from "./types";

export class OpenRouterProvider implements AIProvider {
  name: string;
  private modelId: string;

  constructor(modelId: string) {
    this.modelId = modelId;
    this.name = `openrouter:${modelId.split("/").pop()?.replace(":free", "") ?? modelId}`;
  }

  async call(request: AIRequest): Promise<AIResponse> {
    const PROVIDER_TIMEOUT_MS = Number(process.env.AI_PROVIDER_TIMEOUT_MS ?? 15000);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
          "X-Title": "Etmae Portfolio OS",
        },
        body: JSON.stringify({
          model: this.modelId,
          messages: [{ role: "user", content: request.prompt }],
          max_tokens: request.maxTokens ?? 512,
          temperature: request.temperature ?? 0.7,
          response_format: { type: "json_object" }, 
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`OpenRouter(${this.modelId}) HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(`OpenRouter(${this.modelId}): ${data.error.message}`);
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