export interface AIMessage {
    role: "user" | "assistant";
    content: string;
  }
  
  export interface AIRequest {
    prompt: string;
    conversationHistory?: AIMessage[];
    maxTokens?: number;
    temperature?: number;
  }
  
  export interface AIResponse {
    text: string;
    provider: string;
    error?: string;
  }
  
  // Every provider must implement this interface
  export interface AIProvider {
    name: string;
    call(request: AIRequest): Promise<AIResponse>;
  }