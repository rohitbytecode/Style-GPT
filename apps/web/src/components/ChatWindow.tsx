import { useEffect, useRef, useCallback } from 'react';

import { ChatMessage } from './ChatMessage';
import type { ChatMessage as ChatMessageType } from '../types/chat';

interface ChatWindowProps {
  messages: ChatMessageType[];
  isStreaming: boolean;
}

export function ChatWindow({ messages, isStreaming }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearBottom = useRef(true);

  const checkIfNearBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const threshold = 150;
    isNearBottom.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }, []);

  useEffect(() => {
    if (isNearBottom.current && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <section className="chat-empty">
        <div className="empty-logo">S</div>

        <h1>Style-GPT</h1>

        <p>Your personal CSS engineering assistant. Currently for Rohit.</p>

        <div className="suggestions">
          <button>Explain CSS Grid vs Flexbox</button>
          <button>Fix my responsive layout</button>
          <button>Review this CSS</button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="chat-window"
      ref={scrollRef}
      onScroll={checkIfNearBottom}
    >
      <div className="messages">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isStreaming && (
          <div className="generating">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
    </section>
  );
}
