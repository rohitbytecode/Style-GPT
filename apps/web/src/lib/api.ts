const API_URL = "https://localhost:7190";

export async function streamChat(
    message: string,
    onChunk: (chunk: string) => void,
): Promise<void> {
    const response = await fetch (`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
    });

    if(!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    if(!response.body) {
        throw new Error("API response has no body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
        while (true) {
            const { value, done } = await reader.read();

            if(done) {
                break;
            }

            const chunk = decoder.decode(value, { stream: true });

            if(chunk) {
                onChunk(chunk);
            }
        }

        const remaining = decoder.decode();

        if(remaining) {
            onChunk(remaining);
        }
    } finally {
        reader.releaseLock();
    }
}