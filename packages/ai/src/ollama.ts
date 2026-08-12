const OLLAMA_URL = "http://127.0.0.1:11434";
const MODEL = "qwen2.5-coder:1.5b";

export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface OllamaResponse {
    message: { 
        role: string;
        content: string;
    };
}

export async function chat(messages:ChatMessage[]): Promise<string> {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: MODEL,
            messages,
            stream: false,
        }),
    });

    if (!response.ok) {
        throw new Error(
            `Ollama request failed: ${response.status} ${response.statusText}`,
        );
    }

    const data = (await response.json()) as OllamaResponse;

    return data.message.content;
}