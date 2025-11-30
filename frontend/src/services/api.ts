import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface Room {
  roomId: string
  created_at: string
}

export interface RoomInfo extends Room {
  code: string
  language: string
}

export interface AutocompleteRequest {
  code: string
  cursorPosition: number
  language: string
}

export interface AutocompleteResponse {
  suggestion: string
  confidence: number
  description?: string
}

export const roomApi = {
  createRoom: async (): Promise<Room> => {
    const response = await axios.post(`${API_BASE_URL}/api/rooms`)
    return response.data
  },

  getRoom: async (roomId: string): Promise<RoomInfo> => {
    const response = await axios.get(`${API_BASE_URL}/api/rooms/${roomId}`)
    return response.data
  },

  getAutocomplete: async (request: AutocompleteRequest): Promise<AutocompleteResponse> => {
    const response = await axios.post(`${API_BASE_URL}/api/autocomplete`, request)
    return response.data
  },
}
