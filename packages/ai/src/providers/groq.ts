import Groq from 'groq-sdk';
import type { AIProvider, AIRequest, AIModel } from '../types.js';

const MODEL = 'openai/gpt-oss-120b';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const groqProvider: AIProvider = {
  id: 'groq',
  name: 'Groqq',

  async *chatStream(request: AIRequest): AsyncGenerator<string> {
    const stream = await client.chat.completions.create({
      model: request.model,
      messages: request.messages,
      stream: true,
      temperature: request.temperature ?? 0.2,
      reasoning_effort: request.reasoningEffort ?? 'medium',
      max_tokens: request.maxTokens,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;

      if (content) {
        yield content;
      }
    }
  },

  async listModels(): Promise<AIModel[]> {
    return [];
  },

  async healthCheck(): Promise<boolean> {
    return false;
  },
};
