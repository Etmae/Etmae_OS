import { AIProvider, AIRequest, AIResponse } from "./providers/types";
import { OpenRouterProvider } from "./providers/openrouter";
import { DeepSeekProvider } from "./providers/deepseek";
import { GeminiProvider } from "./providers/gemini";

// ============================================================
// PROVIDER CHAIN — edit this array to change architecture
// Order matters: first available provider wins
// To add a new provider: import it, add a new line below
// To disable a provider: comment out its line
// ============================================================
const PROVIDER_CHAIN: AIProvider[] = [
  // --- FREE TIER (OpenRouter) ---
  // new OpenRouterProvider("meta-llama/llama-3.3-70b-instruct:free"), // primary — best instruction following
  // new OpenRouterProvider("nvidia/nemotron-3-super:free"),           // fallback — 262K context
  new OpenRouterProvider("google/gemma-4-31b-it"),           // primary — 262K context
  new OpenRouterProvider("openrouter/free"),                        // nuclear fallback — auto-selects any free model

  // --- PAID TIER (existing — untouched) ---
  new DeepSeekProvider(),   // kicks in only if all free options exhausted
  new GeminiProvider(),     // last resort paid
];
// ============================================================

export async function routeAIRequest(request: AIRequest): Promise<AIResponse> {
  const errors: string[] = [];

  for (const provider of PROVIDER_CHAIN) {
    try {
      console.log(`[AI Router] Trying: ${provider.name}`);
      const response = await provider.call(request);

      if (!response.text) throw new Error("Empty response");

      console.log(`[AI Router] Success via: ${provider.name}`);
      return response;

    } catch (err: any) {
      const msg = err?.message ?? "Unknown error";
      console.warn(`[AI Router] Failed (${provider.name}): ${msg}`);
      errors.push(`${provider.name}: ${msg}`);
    }
  }

  console.error("[AI Router] All providers failed:", errors);
  throw new Error("All AI providers failed");
}