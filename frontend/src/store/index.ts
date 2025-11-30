import { configureStore } from '@reduxjs/toolkit'
import editorReducer from './slices/editorSlice'
import roomReducer from './slices/roomSlice'
import websocketReducer from './slices/websocketSlice'

export const store = configureStore({
  reducer: {
    room: roomReducer,
    editor: editorReducer,
    websocket: websocketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore WebSocket instance in state
        ignoredActions: ['websocket/setConnection'],
        ignoredPaths: ['websocket.connection'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
