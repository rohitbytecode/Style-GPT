import { useCallback, useState } from "react";

import { streamChat } from "../lib/api";
import type { ChatMessage } from "../types/chat";

function createId(): string {
    return crypto.randomUUID();
}

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (content: string) => {
        const message = content.trim();

        if(!message || isStreaming) {
            return;
        }

        setError(null);
        setIsStreaming(true);

        const userMessage: ChatMessage = {
            id: createId(),
            role: "user",
            content: message,
        };

        const assistantMessageId = createId();

        const assistantMessage: ChatMessage = {
            id: assistantMessageId,
            role: "assistant",
            content: "", 
        };

        setMessages((current) => [
            ...current,
            userMessage,
            assistantMessage,
        ]);

        try {
            await streamChat(message, (chunk) => {
                setMessages((current) =>
                    current.map((item) =>
                        item.id === assistantMessageId
                          ? {
                            ...item,
                            content: item.content + chunk,
                          }: item,
                        ),
                    );        
            });
        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                  ? err.message
                  : "Something went wrong.",
            );
        } finally {
            setIsStreaming(false);
        }
    }, [isStreaming]);

    const clearChat = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);

    return {
        messages,
        isStreaming,
        error,
        sendMessage,
        clearChat,
    }
}