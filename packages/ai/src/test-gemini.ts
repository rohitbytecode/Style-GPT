import { geminiProvider } from './providers/gemini.js';

const models = await geminiProvider.listModels?.();

if (!models) {
  throw new Error('Gemini model discovery is not available');
}

for (const model of models) {
  console.log({
    id: model.id,
    name: model.name,
    contextWindow: model.contextWindow,
    maxOutputTokens: model.maxOutputTokens,
    capabilities: model.capabilities,
  });
}
