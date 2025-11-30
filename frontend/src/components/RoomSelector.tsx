import { useState } from 'react'
import './RoomSelector.css'

interface RoomSelectorProps {
  onCreateRoom: () => void
  onJoinRoom: (roomId: string) => void
  isLoading: boolean
  error: string | null
}

const RoomSelector = ({ onCreateRoom, onJoinRoom, isLoading, error }: RoomSelectorProps) => {
  const [roomIdInput, setRoomIdInput] = useState('')

  const handleJoin = () => {
    if (roomIdInput.trim()) {
      onJoinRoom(roomIdInput.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoin()
    }
  }

  return (
    <div className="room-selector">
      <div className="room-selector-card">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome to Real-Time Pair Programming</h1>
          <p className="welcome-subtitle">
            Collaborate on code in real-time with AI-powered autocomplete
          </p>
        </div>

        <div className="action-section">
          <div className="action-card">
            <h2>Create New Room</h2>
            <p>Start a new collaborative coding session</p>
            <button
              className="primary-button"
              onClick={onCreateRoom}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : '🚀 Create Room'}
            </button>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="action-card">
            <h2>Join Existing Room</h2>
            <p>Enter a room ID to join</p>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="room-input"
              />
              <button
                className="secondary-button"
                onClick={handleJoin}
                disabled={isLoading || !roomIdInput.trim()}
              >
                {isLoading ? 'Joining...' : 'Join Room'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="features">
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span>Real-time Sync</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🤖</span>
            <span>AI Autocomplete</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <span>No Login Required</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomSelector
