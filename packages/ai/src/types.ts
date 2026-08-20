export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface AIRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  reasoningEffort?: 'low' | 'medium' | 'high';
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;

  capabilities: {
    streaming: boolean;
    reasoning: boolean;
    vision: boolean;
    toolCalling: boolean;
  };

  contextWindow?: number;
}

export interface AIProvider {
  readonly id: string;
  readonly name: string;

  chatStream(request: AIRequest): AsyncGenerator<string>;
  listModels(): Promise<AIModel[]>;
  healthCheck(): Promise<boolean>;
}
