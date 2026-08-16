import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

import { CodeBlock } from './CodeBlock';
import type { ChatMessage as ChatMessageType } from '../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

const markdownComponents: Components = {
  code({ className, children, ...rest }) {
    const isBlock = className?.startsWith('language-');

    if (isBlock) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }

    return (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  },
};

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopyResponse = useCallback(async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  return (
    <article className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">{isUser ? 'R' : 'S'}</div>

      <div className="message-body">
        <div className="message-author">{isUser ? 'You' : 'Style-GPT'}</div>

        <div className="message-content">
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {!isUser && message.content.length > 0 && (
          <button
            type="button"
            className={`copy-response-btn ${copied ? 'copied' : ''}`}
            onClick={() => void handleCopyResponse()}
          >
            {copied ? '✓ Copied' : '⎘ Copy response'}
          </button>
        )}
      </div>
    </article>
  );
}
