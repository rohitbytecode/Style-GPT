import { useState } from 'react'
import { useChat } from './hooks/useChat';

function App() {
  const [input, setInput] = useState("");

  const {
    messages,
    isStreaming,
    error,
    sendMessage,
    clearChat,
  } = useChat();

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const message = input.trim();

    if (!message || isStreaming) {
      return;
    }

    setInput("");
    await sendMessage(message);
  }

  return (
    <main>
      <h1>Style-GPT</h1>
      
        <button onClick={clearChat}>
          Clear
        </button>

        <section>
          {messages.map((messages) => (
          <article key={messages.id}>
            <strong>{messages.role}</strong>

            <pre>
              {messages.content}
            </pre>
          </article>
        ))}

        {error && (
          <p>
            Error: {error}
          </p>
        )}
        </section>

        <form onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask Style-GPT..."
            disabled={isStreaming}
          />

          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
          >
            {isStreaming ? "Generating..." : "Send"}
            </button>  
        </form>
    </main>
  )
}

export default App
