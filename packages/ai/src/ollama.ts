import { read } from "node:fs";
import { CSS_SYSTEM_PROMPT } from "./system-prompt.js";

const OLLAMA_URL = "http://127.0.0.1:11434";
const MODEL = "qwen2.5-coder:1.5b";

export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface OllamaStreamChunk {
    message: { 
        role: string;
        content: string;
    };
    done?: boolean;
}

export async function *chatStream(
    messages: ChatMessage[],
    ):AsyncGenerator<string> {
        const response = await fetch(`${OLLAMA_URL}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: "system",
                        content: CSS_SYSTEM_PROMPT,
                    },
                    ...messages,
                ],
                stream: true,
                options: {
                    temperature: 0.2,
                    num_predict: 400,
                },
                keep_alive: -1,
            }),
        });

        if(!response.ok) {
            throw new Error(
                `Ollama request failed: ${response.status} ${response.statusText}`,
            );
        }

        if(!response.body) {
            throw new Error("Ollama response has no body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let buffer = "";

        try {
            while (true) {
                const { value, done } = await reader.read();

                if(done) {
                    break;
                }

                buffer += decoder.decode(value, { stream: true });

                const lines = buffer.split("\n");

                buffer = lines.pop() ?? "";

                for(const line of lines) {
                    if(!line.trim()) {
                        continue;
                    }

                    const chunk = JSON.parse(line) as OllamaStreamChunk;
                    const content = chunk.message?.content;

                    if(content) {
                        yield content;
                    }

                    if(chunk.done) {
                        return;
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }
