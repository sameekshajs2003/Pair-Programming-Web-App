import { useState } from 'react'
import './App.css'
import CodeEditor from './components/CodeEditor'
import Header from './components/Header'
import RoomSelector from './components/RoomSelector'
import Sidebar from './components/Sidebar'
import { useAppDispatch, useAppSelector } from './hooks/useRedux'
import { useWebSocket } from './hooks/useWebSocket'
import { roomApi } from './services/api'
import { setCreatedAt, setRoomId } from './store/slices/roomSlice'

function App() {
  const dispatch = useAppDispatch()
  const { roomId } = useAppSelector((state) => state.room)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { sendMessage } = useWebSocket(roomId)

  const handleCreateRoom = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const room = await roomApi.createRoom()
      dispatch(setRoomId(room.roomId))
      dispatch(setCreatedAt(room.created_at))
    } catch (err) {
      setError('Failed to create room. Please try again.')
      console.error('Error creating room:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinRoom = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Verify room exists
      await roomApi.getRoom(id)
      dispatch(setRoomId(id))
    } catch (err) {
      setError('Room not found. Please check the room ID.')
      console.error('Error joining room:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <Header />
      
      {!roomId ? (
        <RoomSelector
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <div className="main-container">
          <div className="editor-container">
            <CodeEditor sendMessage={sendMessage} />
          </div>
          <Sidebar roomId={roomId} />
        </div>
      )}
    </div>
  )
}

export default App
