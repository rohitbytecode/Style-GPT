export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface AIRequest {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  reasoningEffort?: 'low' | 'medium' | 'high';
}

export interface AIProvider {
  readonly id: string;
  readonly name: string;
  chatStream(request: AIRequest): AsyncGenerator<string>;
}
