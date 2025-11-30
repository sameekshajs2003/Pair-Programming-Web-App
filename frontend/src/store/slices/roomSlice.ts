import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface RoomState {
  roomId: string | null
  isConnected: boolean
  userCount: number
  users: string[]
  createdAt: string | null
}

const initialState: RoomState = {
  roomId: null,
  isConnected: false,
  userCount: 0,
  users: [],
  createdAt: null,
}

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },
    setUserCount: (state, action: PayloadAction<number>) => {
      state.userCount = action.payload
    },
    addUser: (state, action: PayloadAction<string>) => {
      if (!state.users.includes(action.payload)) {
        state.users.push(action.payload)
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user !== action.payload)
    },
    setCreatedAt: (state, action: PayloadAction<string>) => {
      state.createdAt = action.payload
    },
    resetRoom: () => initialState,
  },
})

export const {
  setRoomId,
  setConnected,
  setUserCount,
  addUser,
  removeUser,
  setCreatedAt,
  resetRoom,
} = roomSlice.actions

export default roomSlice.reducer
