import { Router } from 'express';

import {
  createConversation,
  getConversation,
  listConversations,
  getMessages,
  deleteConversation,
} from '../services/conversation.service.js';

const router = Router();

// GET
router.get('/', async (_req, res) => {
  try {
    const conversations = await listConversations();

    res.json(conversations);
  } catch (err) {
    console.error('List conversations failed:', err);

    res.status(500).json({
      error: 'Failed to list conversations',
    });
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    const { title } = req.body as {
      title?: unknown;
    };

    if (title !== undefined && typeof title !== 'string') {
      res.status(400).json({
        error: 'title must be a string',
      });

      return;
    }

    const conversation = await createConversation(
      typeof title === 'string' && title.trim().length > 0
        ? title.trim()
        : 'New Chat',
    );

    res.status(201).json(conversation);
  } catch (err) {
    console.error('Create conversation failed:', err);

    res.status(500).json({
      error: 'Failed to create conversation',
    });
  }
});

// GET (By Id)
router.get('/:id', async (req, res) => {
  try {
    const conversation = await getConversation(req.params.id);

    if (!conversation) {
      res.status(404).json({
        error: 'Conversation not found',
      });

      return;
    }

    res.json(conversation);
  } catch (error) {
    console.error('Get conversation failed:', error);
  }
});

// GET by Id (conversations)
router.get('/:id/messages', async (req, res) => {
  try {
    const conversation = await getConversation(req.params.id);

    if (!conversation) {
      res.status(404).json({
        error: 'Conversation not found',
      });

      return;
    }

    const messages = await getMessages(req.params.id);

    res.json(messages);
  } catch (err) {
    console.error('Get conversation message failed:', err);

    res.status(500).json({
      error: 'Failed to get conversation messages',
    });
  }
});

// DELETE by Id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteConversation(req.params.id);

    if (!deleted) {
      res.status(404).json({
        error: 'Conversation not found',
      });

      return;
    }

    res.status(204).end();
  } catch (err) {
    console.error('Delete conversation failed:');

    res.status(500).json({
      error: 'Failed to delete conversation',
    });
  }
});

export default router;
