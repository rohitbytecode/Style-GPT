import { useCallback, useState, useEffect } from 'react';
import {
  deleteConversation,
  getConversationMessages,
  listConversations,
  streamChat,
} from '../lib/api';
import { type Conversation, type ChatMessage } from '../types/chat';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(
    undefined,
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    async function loadConversations() {
      try {
        setError(null);

        const data = await listConversations();

        setConversations(data);

        if (data.length === 0) {
          setConversationId(undefined);
          setMessages([]);

          return;
        }

        const latest = data[0];

        setConversationId(latest.id);

        const storedMessages = await getConversationMessages(latest.id);

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
          err instanceof Error ? err.message : 'Failed to load conversations.',
        );
      }
    }

    void loadConversations();
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
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
      };

      const assistantMessageId = crypto.randomUUID();

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
                  ? { ...item, content: item.content + chunk }
                  : item,
              ),
            );
          },
          (id) => setConversationId(id),
        );

        const updatedConversations = await listConversations();

        setConversations(updatedConversations);
      } catch (err) {
        console.error(err);

        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, conversationId],
  );

  function newChat() {
    if (isStreaming) return;

    setError(null);
    setConversationId(undefined);
    setMessages([]);
  }

  const selectConversation = useCallback(
    async (id: string) => {
      if (id === conversationId || isStreaming) {
        return;
      }

      try {
        setError(null);

        const storedMessages = await getConversationMessages(id);

        setConversationId(id);

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
    },
    [conversationId, isStreaming],
  );

  const removeConversation = useCallback(
    async (id: string) => {
      try {
        setError(null);

        await deleteConversation(id);

        setConversations((prev) => {
          const remaining = prev.filter((c) => c.id !== id);

          if (conversationId === id) {
            if (remaining.length > 0) {
              const next = remaining[0];
              setConversationId(next.id);

              getConversationMessages(next.id)
                .then((msgs) => {
                  setMessages(
                    msgs.map((m) => ({
                      id: m.id,
                      role: m.role,
                      content: m.content,
                    })),
                  );
                })
                .catch(console.error);
            } else {
              setConversationId(undefined);
              setMessages([]);
            }
          }

          return remaining;
        });
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error ? err.message : 'Failed to delete conversation.',
        );
      }
    },
    [conversationId],
  );

  return {
    conversations,
    messages,
    conversationId,
    isStreaming,
    error,
    sendMessage,
    newChat,
    removeConversation,
    selectConversation,
  };
}
