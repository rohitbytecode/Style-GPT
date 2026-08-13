import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';

import type { ChatMessage as ChatMessageType } from "../types/chat";

interface ChatMessageProps {
    message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
    return (
        <article className={`message message-${message.role}`}>
            <div className="message-role">
                {message.role === 'user' ? "You": "Style-GPT"}
            </div>

            <div className="message-content">
                {message.role === "assistant" ? (
                    <ReactMarkdown rehypePlugins={[remarkGfm]}>
                        {message.content}
                    </ReactMarkdown>
                ): (
                    <p>{message.content}</p>
                )}
            </div>
        </article>
    )
}