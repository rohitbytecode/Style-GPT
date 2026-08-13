import Groq from "groq-sdk";

const MODEL = "openai/gpt-oss-120b";

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export async function* chatStream(
    messages: ChatMessage[],
): AsyncGenerator<string> {
  const stream = await client.chat.completions.create({
    model: MODEL,
    messages,
    stream: true,
    temperature: 0.2,
    reasoning_effort: "medium",
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;

    if(content) {
        yield content;
    }
  }
}