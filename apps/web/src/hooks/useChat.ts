import { useCallback, useState, useEffect } from 'react';
import {
  createConversation,
  deleteConversation,
  getConversationMessages,
  listConversations,
  streamChat,
} from '../lib/api';
import { Conversation, type ChatMessage } from '../types/chat';

function createId(): string {
  return crypto.randomUUID();
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(
    undefined,
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    async function loadLatestConversation() {
      try {
        setError(null);

        const conversations = await listConversations();

        if (conversations.length === 0) {
          return;
        }

        const latestConversation = conversations[0];

        setConversationId(latestConversation.id);

        const storedMessages = await getConversationMessages(
          latestConversation.id,
        );

        setMessages(
          storedMessages.map((message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
          })),
        );
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error ? err.message : 'Failed to load conversation.',
        );
      }
    }
    void loadLatestConversation();
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const message = content.trim();

      if (!message || isStreaming) {
        return;
      }

      setError(null);
      setIsStreaming(true);

      const userMessage: ChatMessage = {
        id: createId(),
        role: 'user',
        content: message,
      };

      const assistantMessageId = createId();

      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
      };

      setMessages((current) => [...current, userMessage, assistantMessage]);

      try {
        await streamChat(
          message,
          conversationId,
          (chunk) => {
            setMessages((current) =>
              current.map((item) =>
                item.id === assistantMessageId
                  ? {
                      ...item,
                      content: item.content + chunk,
                    }
                  : item,
              ),
            );
          },
          (id) => setConversationId(id),
        );
      } catch (err) {
        console.error(err);

        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, conversationId],
  );

  const newChat = useCallback(async () => {
    try {
      setError(null);

      const conversation = await createConversation();

      setConversationId(conversation.id);
      setMessages([]);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create a new conversation.',
      );
    }
  }, []);

  const removeConversation = useCallback(
    async (id: string) => {
      try {
        setError(null);

        await deleteConversation(id);

        setConversations((current) =>
          current.filter(
            (conversation) => conversation.id !==id,
          ))
      }
    }
  )

  return {
    messages,
    conversationId,
    isStreaming,
    error,
    sendMessage,
    newChat,
  };
}
