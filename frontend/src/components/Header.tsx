import { useAppDispatch, useAppSelector } from '../hooks/useRedux'
import { resetEditor } from '../store/slices/editorSlice'
import { resetRoom } from '../store/slices/roomSlice'
import './Header.css'

const Header = () => {
  const dispatch = useAppDispatch()
  const { roomId, isConnected, userCount } = useAppSelector((state) => state.room)

  const handleLeaveRoom = () => {
    if (window.confirm('Are you sure you want to leave this room?')) {
      dispatch(resetRoom())
      dispatch(resetEditor())
    }
  }

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">🚀 Real-Time Pair Programming</h1>
        {roomId && (
          <div className="room-info">
            <span className="room-id">Room: {roomId}</span>
          </div>
        )}
      </div>
      
      <div className="header-right">
        {roomId && (
          <>
            <div className="status-container">
              <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`} />
              <span className="status-text">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="user-count">
              <span className="icon">👥</span>
              <span>{userCount} {userCount === 1 ? 'user' : 'users'}</span>
            </div>
            
            <button className="leave-button" onClick={handleLeaveRoom}>
              Leave Room
            </button>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
