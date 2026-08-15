import { db, conversations, messages } from '@style-gpt/db';
import { desc, eq } from 'drizzle-orm';

export async function createConversation(title = 'New Chat') {
  const [conversation] = await db
    .insert(conversations)
    .values({
      title,
    })
    .returning();

  return conversation;
}

export async function getConversation(conversationId: string) {
  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  return conversation ?? null;
}

export async function listConversations() {
  return db.select().from(conversations).orderBy(desc(conversations.updatedAt));
}

export async function addMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
) {
  const [message] = await db
    .insert(messages)
    .values({
      conversationId,
      role,
      content,
    })
    .returning();

  await db
    .update(conversations)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(conversations.id, conversationId));

  return message;
}

export async function getMessages(conversationId: string) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

export async function deleteConversation(conversationId: string) {
  const result = await db
    .delete(conversations)
    .where(eq(conversations.id, conversationId))
    .returning({
      id: conversations.id,
    });

  return result.length > 0;
}

export async function getConversationHistory(conversationId: string) {
  const rows = await getMessages(conversationId);

  return rows.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

// This service is exposing following functions:
// createConversation()
// getConversation()
// listConversations()
// addMessage()
// getMessages()
// getConversationHistory()
// deleteConversation()
