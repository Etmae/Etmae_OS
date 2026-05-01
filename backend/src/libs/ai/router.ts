import { AIProvider, AIRequest, AIResponse } from "./providers/types";
import { OpenRouterProvider } from "./providers/openrouter";
import { DeepSeekProvider } from "./providers/deepseek";
import { GeminiProvider } from "./providers/gemini";

// ============================================================
// AI provider selection order
// The first provider to return a valid response is used.
// Add providers by importing them and appending them to this array.
// Disable a provider by commenting out its entry.
// ============================================================
const PROVIDER_CHAIN: AIProvider[] = [
  // Free provider tier
  // new OpenRouterProvider("meta-llama/llama-3.3-70b-instruct:free"), 
  // new OpenRouterProvider("nvidia/nemotron-3-super:free"),  
  new OpenRouterProvider("anthropic/claude-sonnet-4.6"),        
  new OpenRouterProvider("openrouter/free"),                     

  // Paid provider fallback tier
  new DeepSeekProvider(),   // fallback provider used after free tier exhaustion
  new GeminiProvider(),     // final paid fallback provider
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