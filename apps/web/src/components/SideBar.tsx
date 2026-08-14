interface SideBarProps {
  chatTitle: string;
  onNewChat: () => void;
}

export function SideBar({ chatTitle, onNewChat }: SideBarProps) {
  return (
    <aside className="sidebar">
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

        <button className="chat-history-item">
          <span className="history-icon">0</span>
          <span>{chatTitle || 'New conversation'}</span>
        </button>
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
