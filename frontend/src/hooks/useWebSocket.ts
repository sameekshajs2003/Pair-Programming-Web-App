import { useCallback, useEffect, useRef } from 'react'
import type { RootState } from '../store'
import { setCode } from '../store/slices/editorSlice'
import {
    resetRoom,
    setConnected,
    setUserCount,
} from '../store/slices/roomSlice'
import {
    addMessage,
    setConnection,
    setError,
    setStatus,
} from '../store/slices/websocketSlice'
import { useAppDispatch, useAppSelector } from './useRedux'

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000'

interface WebSocketMessage {
  type: string
  [key: string]: any
}

export const useWebSocket = (roomId: string | null) => {
  const dispatch = useAppDispatch()
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number>()
  const websocketState = useAppSelector((state: RootState) => state.websocket) as any
  const connection: WebSocket | null = websocketState.connection

  const connect = useCallback(() => {
    if (!roomId) return

    // Clean up existing connection
    if (wsRef.current) {
      wsRef.current.close()
    }

    dispatch(setStatus('connecting'))
    const ws = new WebSocket(`${WS_BASE_URL}/ws/${roomId}`)

    ws.onopen = () => {
      console.log('WebSocket connected')
      dispatch(setStatus('connected'))
      dispatch(setConnected(true))
      dispatch(setError(null))
      dispatch(addMessage({ type: 'system', content: 'Connected to room' }))
    }

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        console.log('WebSocket message:', message)

        switch (message.type) {
          case 'init':
            // Initial state from server
            dispatch(setCode(message.code))
            dispatch(setUserCount(message.connectionCount))
            dispatch(addMessage({
              type: 'system',
              content: `Room joined. ${message.connectionCount} user(s) online`,
            }))
            break

          case 'code_update':
            // Code update from another user
            dispatch(setCode(message.code))
            dispatch(addMessage({
              type: 'update',
              content: `Code updated by ${message.userId || 'another user'}`,
            }))
            break

          case 'user_joined':
            dispatch(setUserCount(message.connectionCount))
            dispatch(addMessage({
              type: 'join',
              content: `User joined (${message.connectionCount} total)`,
            }))
            break

          case 'user_left':
            dispatch(setUserCount(message.connectionCount))
            dispatch(addMessage({
              type: 'leave',
              content: `User left (${message.connectionCount} remaining)`,
            }))
            break

          default:
            console.log('Unknown message type:', message.type)
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      dispatch(setStatus('error'))
      dispatch(setError('Connection error occurred'))
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      dispatch(setStatus('disconnected'))
      dispatch(setConnected(false))
      dispatch(addMessage({ type: 'system', content: 'Disconnected from room' }))

      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = window.setTimeout(() => {
        console.log('Attempting to reconnect...')
        connect()
      }, 3000)
    }

    wsRef.current = ws
    dispatch(setConnection(ws))
  }, [roomId, dispatch])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    dispatch(setConnection(null))
    dispatch(setStatus('disconnected'))
    dispatch(setConnected(false))
    dispatch(resetRoom())
  }, [dispatch])

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket not connected, cannot send message')
    }
  }, [])

  useEffect(() => {
    if (roomId) {
      connect()
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [roomId, connect])

  return {
    connect,
    disconnect,
    sendMessage,
    isConnected: connection?.readyState === WebSocket.OPEN,
  }
}
