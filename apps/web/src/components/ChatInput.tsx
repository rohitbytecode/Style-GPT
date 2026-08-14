import { useState } from "react";

interface ChatInputProps {
  isStreaming: boolean;
  onSend: (message: string) => Promise<void>;
}

export function ChatInput({ isStreaming, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");

  async function handleSubmit() {
    const message = value.trim();

    if (!message || isStreaming) {
      return;
    }

    setValue("");
    await onSend(message);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  }

  return (
    <div className="composer-wrapper">
      <div className="composer">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Style-GPT about CSS..."
          disabled={isStreaming}
          rows={1}
        />

        <button
          className="send-button"
          onClick={() => void handleSubmit()}
          disabled={isStreaming || !value.trim()}
          aria-label="Send message"
        >
          ^
        </button>
      </div>
      <div className="composer-hint">
        Enter to send . Shift + Enter for new line
      </div>
    </div>
  );
}
