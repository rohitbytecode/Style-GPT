import type { Conversation } from '../types/chat';

interface SideBarProps {
  conversations: Conversation[];
  activeConversationId?: string;
  isOpen: boolean;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export function SideBar({
  conversations,
  activeConversationId,
  isOpen,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}: SideBarProps) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-mark">S</div>
          <span>Style-GPT</span>
        </div>
      </div>

      <button className="new-chat" onClick={onNewChat}>
        <span>+</span>
        New chat
      </button>

      <div className="sidebar-section">
        <div className="sidebar-label">Recent</div>

        <div className="chat-history-list">
          {conversations.length === 0 ? (
            <div className="chat-history-empty">No conversations yet.</div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`chat-history-item ${
                  conversation.id === activeConversationId ? 'active' : ''
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <span className="history-icon">💬</span>

                <span className="chat-history-title">
                  {conversation.title || 'New conversation'}
                </span>

                <button
                  type="button"
                  className="chat-history-delete"
                  aria-label={`Delete ${conversation.title || 'conversation'}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="connection">
          <span className="status-dot" />
          <span>GPT-OSS 120B</span>
        </div>

        <div className="private-label">Private workspace</div>
      </div>
    </aside>
  );
}
