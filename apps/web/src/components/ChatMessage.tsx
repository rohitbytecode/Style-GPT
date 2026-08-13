import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';

import type { ChatMessage as ChatMessageType } from "../types/chat";

interface ChatMessageProps {
    message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";
    return (
        <article className={`chat-message ${isUser ? "user" : "assistant"}`}>
            <div className="message-avatar">
                {isUser ? "R": "S"}
            </div>

            <div className="message-body">
                <div className="message-author">
                    {isUser? "You" : "Style-GPT"}
                </div>

                <div className="message-content">
                    {isUser ? (
                        <p>{message.content}</p>
                    ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                        </ReactMarkdown>
                    )}
                </div>
            </div>
        </article>
    );
}