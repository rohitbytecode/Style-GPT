import { GoogleGenAI } from '@google/genai';

import type { AIModel, AIProvider, AIRequest } from '../types.js';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GOOGLE_GEMINI_API_KEY is not configured');
}

const client = new GoogleGenAI({
  apiKey,
});

export const geminiProvider: AIProvider = {
  id: 'gemini',
  name: 'Google Gemini',

  async listModels(): Promise<AIModel[]> {
    const models: AIModel[] = [];

    const pager = await client.models.list();

    for await (const model of pager) {
      const actions = model.supportedActions ?? [];

      if (!actions.includes(`generateContent`)) {
        continue;
      }

      const id = model.name?.replace(/^models\//, '') ?? '';
      if (!id) continue;

      models.push({
        id,
        name: model.displayName ?? model.name ?? '',
        provider: 'gemini',

        capabilities: {
          streaming: true,
          reasoning: model.thinking ?? false,
          vision: false,
          toolCalling: false,
        },

        contextWindow: model.inputTokenLimit,
        maxOutputTokens: model.outputTokenLimit,
        description: model.description,
      });
    }

    return models;
  },

  async *chatStream(request: AIRequest): AsyncGenerator<string> {
    const systemInstruction = request.messages.find(
      (m) => m.role === 'system',
    )?.content;
    const contents = request.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const stream = await client.models.generateContentStream({
      model: request.model,

      contents,
      config: {
        systemInstruction,
        temperature: request.temperature,
        maxOutputTokens: request.maxTokens,
      },
    });

    for await (const chunk of stream) {
      if (chunk.text) yield chunk.text;
    }
  },
};
