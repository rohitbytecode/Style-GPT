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
        throw new Error
    }
}