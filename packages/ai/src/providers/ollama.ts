import { read } from 'node:fs';
import type { AIProvider, AIRequest } from '../types.js';

const OLLAMA_URL = 'http://127.0.0.1:11434';
const MODEL = 'qwen2.5-coder:1.5b';

interface OllamaStreamChunk {
  message: {
    role: string;
    content: string;
  };
  done?: boolean;
}

export const ollamaProvider: AIProvider = {
  id: 'ollama',
  name: 'Ollama',

  async *chatStream(request: AIRequest): AsyncGenerator<string> {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: request.messages,
        stream: true,
        options: {
          temperature: request.temperature ?? 0.2,
          num_predict: request.maxTokens ?? 400,
        },
        keep_alive: -1,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Ollama request failed: ${response.status} ${response.statusText}`,
      );
    }

    if (!response.body) {
      throw new Error('Ollama response has no body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = '';

    try {
      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');

        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.trim()) {
            continue;
          }

          const chunk = JSON.parse(line) as OllamaStreamChunk;

          const content = chunk.message.content;

          if (content) {
            yield content;
          }
        }
      }

      const remaining = decoder.decode();

      if (remaining) {
        buffer += remaining;
      }

      if (buffer.trim()) {
        const chunk = JSON.parse(buffer) as OllamaStreamChunk;

        const content = chunk.message.content;

        if (content) {
          yield content;
        }
      }
    } finally {
      reader.releaseLock();
    }
  },
};
