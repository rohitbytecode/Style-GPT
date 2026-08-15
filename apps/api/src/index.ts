import express from 'express';
import {
  chatStream,
  CSS_SYSTEM_PROMPT,
  STYLE_GPT_SELF_KNOWLEDGE_PROMPT,
  STYLE_GPT_PERSONAL_PREFERENCES_PROMPT,
  getIdentityResponse,
} from '@style-gpt/ai';
import cors from 'cors';
import {
  createConversation,
  getConversation,
  addMessage,
  getConversationHistory,
} from './services/conversation.service.js';
import conversationRouter from './routes/conversation.routes.js';

const app = express();
const PORT = 7190;

app.use(
  cors({
    origin: 'http://localhost:5173',
    exposedHeaders: ['X-Conversation-Id'],
  }),
);
app.use(express.json());

app.use('/api/conversations', conversationRouter);

app.get('/', (_req, res) => {
  res.json({
    message: 'Style GPT API',
    status: 'running',
  });
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'style-gpt-api',
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationId } = req.body as {
      message?: unknown;
      conversationId?: unknown;
    };

    if (typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({
        error: 'message must be a non-empty string',
      });

      return;
    }

    if (conversationId !== undefined && typeof conversationId !== 'string') {
      res.status(400).json({
        error: 'conversationId must be a string',
      });

      return;
    }

    const userMessage = message.trim();

    // Conversation

    let conversation;

    if (conversationId) {
      conversation = await getConversation(conversationId);

      if (!conversation) {
        res.status(404).json({
          error: 'Conversation not found',
        });

        return;
      }
    } else {
      conversation = await createConversation(userMessage.slice(0, 60));
    }

    // Save user message

    await addMessage(conversation.id, 'user', userMessage);

    // Load conversation history

    const history = await getConversationHistory(conversation.id);

    // Identity handling

    const identityResponse = getIdentityResponse(userMessage);

    if (identityResponse) {
      await addMessage(conversation.id, 'assistant', identityResponse);

      res.status(200);

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');

      res.setHeader('Cache-Control', 'no-cache');

      // Send conversation ID to frontend

      res.setHeader('X-Conversation-Id', conversation.id);

      res.end(identityResponse);

      return;
    }

    // Stream AI response

    res.status(200);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    res.setHeader('Transfer-Encoding', 'chunked');

    res.setHeader('Cache-Control', 'no-cache');

    res.setHeader('Connection', 'keep-alive');

    res.setHeader('X-Conversation-Id', conversation.id);

    let assistantResponse = '';

    for await (const chunk of chatStream([
      {
        role: 'system',
        content: CSS_SYSTEM_PROMPT,
      },
      {
        role: 'system',
        content: STYLE_GPT_SELF_KNOWLEDGE_PROMPT,
      },
      {
        role: 'system',
        content: STYLE_GPT_PERSONAL_PREFERENCES_PROMPT,
      },

      ...history,
    ])) {
      assistantResponse += chunk;

      res.write(chunk);
    }

    // Save complete assistant reply

    if (assistantResponse.length > 0) {
      await addMessage(conversation.id, 'assistant', assistantResponse);
    }

    res.end();
  } catch (err) {
    console.error('AI request failed: ', err);

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to generate AI response',
      });
    } else {
      res.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Style GPT API running on Port Number: ${PORT}`);
});
