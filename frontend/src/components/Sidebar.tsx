import { useAppSelector } from '../hooks/useRedux'
import type { RootState } from '../store'
import './Sidebar.css'

interface SidebarProps {
  roomId: string
}

const Sidebar = ({ roomId }: SidebarProps) => {
  const roomState = useAppSelector((state: RootState) => state.room) as any
  const { userCount, isConnected } = roomState
  const websocketState = useAppSelector((state: RootState) => state.websocket) as any
  const { messages } = websocketState

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    alert('Room ID copied to clipboard!')
  }

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h2 className="sidebar-title">Room Information</h2>
        
        <div className="info-card">
          <div className="info-label">Room ID</div>
          <div className="info-value room-id-display">
            <span className="room-id-text">{roomId}</span>
            <button className="copy-button" onClick={copyRoomId} title="Copy Room ID">
              📋
            </button>
          </div>
        </div>

        <div className="info-card">
          <div className="info-label">Status</div>
          <div className="info-value">
            <span className={`status-badge ${isConnected ? 'online' : 'offline'}`}>
              {isConnected ? '● Online' : '○ Offline'}
            </span>
          </div>
        </div>

        <div className="info-card">
          <div className="info-label">Active Users</div>
          <div className="info-value user-count-display">
            <span className="count-number">{userCount}</span>
            <span className="count-label">{userCount === 1 ? 'user' : 'users'} online</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h2 className="sidebar-title">Activity Log</h2>
        <div className="activity-log">
          {messages.length === 0 ? (
            <div className="empty-state">No activity yet</div>
            ) : (
            messages.slice(-20).reverse().map((message: { type: string; content: string; timestamp: number }, index: number) => (
              <div key={index} className={`log-entry log-${message.type}`}>
                <span className="log-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
                <span className="log-content">{message.content}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="sidebar-section">
        <h2 className="sidebar-title">Share Room</h2>
        <div className="share-info">
          <p className="share-text">
            Share this Room ID with others to collaborate:
          </p>
          <div className="share-id">{roomId}</div>
          <p className="share-hint">
            They can join by entering this ID on the home page.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
