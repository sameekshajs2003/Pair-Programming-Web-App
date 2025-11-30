import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface WebSocketState {
  connection: WebSocket | null
  status: 'disconnected' | 'connecting' | 'connected' | 'error'
  error: string | null
  messages: Array<{
    type: string
    content: string
    timestamp: number
  }>
}

const initialState: WebSocketState = {
  connection: null,
  status: 'disconnected',
  error: null,
  messages: [],
}

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setConnection: (state, action: PayloadAction<WebSocket | null>) => {
      state.connection = action.payload as any // Bypass serialization check
    },
    setStatus: (state, action: PayloadAction<WebSocketState['status']>) => {
      state.status = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    addMessage: (state, action: PayloadAction<{ type: string; content: string }>) => {
      state.messages.push({
        ...action.payload,
        timestamp: Date.now(),
      })
      // Keep only last 100 messages
      if (state.messages.length > 100) {
        state.messages = state.messages.slice(-100)
      }
    },
    clearMessages: (state) => {
      state.messages = []
    },
  },
})

export const {
  setConnection,
  setStatus,
  setError,
  addMessage,
  clearMessages,
} = websocketSlice.actions

export default websocketSlice.reducer
