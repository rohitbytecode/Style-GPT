import { useState, useMemo } from 'react';

import { ChatInput } from './components/ChatInput';
import { ChatWindow } from './components/ChatWindow';
import { SideBar } from './components/SideBar';
import { useChat } from './hooks/useChat';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
    conversations,
    conversationId,
    messages,
    isStreaming,
    error,
    sendMessage,
    newChat,
    selectConversation,
    removeConversation,
  } = useChat();

  const chatTitle = useMemo(() => {
    const firstUserMessage = messages.find((m) => m.role === 'user');

    if (!firstUserMessage) return '';

    return firstUserMessage.content.length > 32
      ? `${firstUserMessage.content.slice(0, 32)}...`
      : firstUserMessage.content;
  }, [messages]);

  return (
    <div className="app">
      <SideBar
        conversations={conversations}
        activeConversationId={conversationId}
        onNewChat={newChat}
        onSelectConversation={selectConversation}
        onDeleteConversation={removeConversation}
        isOpen={sidebarOpen}
      />

      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="main">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          <div className="topbar-title">{chatTitle || 'New chat'}</div>

          <div className="topbar-status">
            <span className="status-dot" />
            Online
          </div>
        </header>

        <ChatWindow messages={messages} isStreaming={isStreaming} />

        {error && <div className="error-message">{error}</div>}

        <ChatInput isStreaming={isStreaming} onSend={sendMessage} />
      </main>
    </div>
  );
}

export default App;
