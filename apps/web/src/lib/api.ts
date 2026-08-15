const API_URL = 'http://localhost:7190';

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as {
      error?: unknown;
    };

    if (typeof data.error === 'string') {
      return data.error;
    }
  } catch {
    // Response was not JSON
  }

  return `API request failed: ${response.status}`;
}

export async function listConversations(): Promise<Conversation[]> {
  const response = await fetch(`${API_URL}/api/conversations`);

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as Conversation[];
}

export async function createConversation(
  title?: string,
): Promise<Conversation> {
  const response = await fetch(`${API_URL}/api/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      title
        ? {
            title,
          }
        : {},
    ),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as Conversation;
}

export async function getConversation(
  conversationId: string,
): Promise<Conversation> {
  const response = await fetch(
    `${API_URL}/api/conversations/${conversationId}`,
  );

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as Conversation;
}

export async function getConversationMessages(
  conversationId: string,
): Promise<ConversationMessage[]> {
  const response = await fetch(
    `${API_URL}/api/conversations/${conversationId}/messages`,
  );

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as ConversationMessage[];
}

export async function deleteConversation(
  conversationId: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/conversations/${conversationId}`,
    {
      method: 'DELETE',
    },
  );

  if (!response.ok) {
    throw new Error(await parseError(response));
  }
}

export async function streamChat(
  message: string,
  conversationId: string | undefined,
  onChunk: (chunk: string) => void,
  onConversationId?: (conversationId: string) => void,
): Promise<void> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      ...(conversationId ? { conversationId } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const responseConversationId = response.headers.get('X-Conversation-id');

  if (responseConversationId) {
    onConversationId?.(responseConversationId);
  }

  if (!response.body) {
    throw new Error('API response has no body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });

      if (chunk) {
        onChunk(chunk);
      }
    }

    const remaining = decoder.decode();

    if (remaining) {
      onChunk(remaining);
    }
  } finally {
    reader.releaseLock();
  }
}
